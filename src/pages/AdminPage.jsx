import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
	CalendarDays,
	CheckCircle,
	Database,
	Download,
	LogOut,
	Mail,
	PlusCircle,
	RefreshCcw,
	ShieldCheck,
	Store,
	Ticket,
	TrendingUp,
	Users,
	Wallet,
} from 'lucide-react';
import {
	clearAdminDataCache,
	fetchAdminDashboard,
	fetchNewsletterDocuments,
	fetchAllOrdersForExport,
	fetchOrdersWithTickets,
	formatDateTime,
	formatMoney,
	getAdminSession,
	recordManualDonation,
	recordManualTicketOrder,
	saveAdminInvite,
	saveBusinessListing,
	saveEvent,
	saveTenantProfile,
	sendFamilyCommunication,
	signInAdmin,
	signOutAdmin,
	signUpAdmin,
	uploadNewsletterDocument,
	deleteOrderAndTickets,
	deleteEventAndSignups,
	deleteNewsletterDocument,
	deleteTicket,
	resendOrderConfirmation,
	updateOrderPaymentStatus,
	watchAdminSession,
} from '@/lib/sumlinData';
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogAction,
	AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { hasSupabaseConfig } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const initialBusinessForm = {
	id: '',
	title: '',
	category: 'Professional Services',
	description: '',
	price_label: '',
	sort_order: '0',
	is_featured: false,
};

const initialEventForm = {
	id: '',
	title: '',
	event_type: 'family',
	status: 'planned',
	description: '',
	location: '',
	starts_at: '',
	ends_at: '',
	capacity: '',
	google_calendar_event_url: '',
	intake_deadline: '',
};

const initialSettingsForm = {
	display_name: '',
	support_email: '',
	support_phone: '',
	business_tagline: '',
	business_summary: '',
	cash_app_handle: '',
	venmo_handle: '',
	paypal_donate_url: '',
	google_calendar_public_url: '',
	google_calendar_embed_url: '',
	primary_cta_label: '',
};

const initialInviteForm = {
	email: '',
	role: 'admin',
};

const initialManualDonationForm = {
	name: '',
	email: '',
	phone: '',
	amount: '',
	paymentMethod: 'paypal',
	externalReference: '',
	notes: '',
};

const initialManualTicketForm = {
	name: '',
	email: '',
	phone: '',
	quantity: '',
	pricePerTicket: '',
	raffleName: 'General',
	paymentMethod: 'paypal',
	externalReference: '',
	notes: '',
};

const initialNewsletterForm = {
	title: '',
	issue_date: '',
	description: '',
	file: null,
};

const initialCommunicationForm = {
	recipients: '',
	subject: '',
	previewText: '',
	heading: '',
	message: '',
	ctaLabel: '',
	ctaUrl: '',
	audienceLabel: 'Family Update',
	replyTo: '',
	signature: 'The Sumlin Family Reunion Committee',
};

function toDateTimeInput(value) {
	if (!value) {
		return '';
	}
	const date = new Date(value);
	const offset = date.getTimezoneOffset();
	return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
}

function formatIssueDate(value) {
	if (!value) {
		return 'Date coming soon';
	}

	return new Intl.DateTimeFormat('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	}).format(new Date(value));
}

function formatFileSize(bytes) {
	if (!bytes) {
		return 'File ready to download';
	}

	if (bytes < 1024 * 1024) {
		return `${Math.max(1, Math.round(bytes / 1024))} KB`;
	}

	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function buildSettingsForm(tenant) {
	return {
		display_name: tenant?.display_name || '',
		support_email: tenant?.support_email || '',
		support_phone: tenant?.support_phone || '',
		business_tagline: tenant?.business_tagline || '',
		business_summary: tenant?.business_summary || '',
		cash_app_handle: tenant?.cash_app_handle || '',
		venmo_handle: tenant?.venmo_handle || '',
		paypal_donate_url: tenant?.paypal_donate_url || '',
		google_calendar_public_url: tenant?.google_calendar_public_url || '',
		google_calendar_embed_url: tenant?.google_calendar_embed_url || '',
		primary_cta_label: tenant?.primary_cta_label || '',
	};
}

function OrderAccordion({ order, onApprove, onEmail, onDelete, approvingOrderId, emailingOrderId }) {
	const [open, setOpen] = useState(false);

	const ticketsByRaffle = (order.tickets || []).reduce((acc, ticket) => {
		const raffleName = ticket.raffle_name || 'General';
		if (!acc[raffleName]) {
			acc[raffleName] = [];
		}
		acc[raffleName].push(ticket.ticket_number);
		return acc;
	}, {});

	return (
		<div className={`rounded-2xl border ${order.payment_status === 'paid' ? 'border-green-200 bg-green-50/30' : 'border-border/50 bg-background'}`}>
			<button
				type="button"
				onClick={() => setOpen((current) => !current)}
				className="w-full px-5 py-4 text-left"
			>
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div className="min-w-0">
						<div className="flex items-center gap-2 mb-1">
							<span className="text-primary">{open ? '▼' : '▶'}</span>
							<p className="font-bold truncate">{order.purchaser_name}</p>
							<span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
								{order.payment_status}
							</span>
						</div>
						<p className="text-sm text-muted-foreground truncate">{order.reference_code} • {order.email}</p>
					</div>
					<div className="flex items-center gap-4 text-sm sm:text-right">
						<div>
							<p className="font-semibold text-primary">{formatMoney(order.donation_amount_cents)}</p>
							<p className="text-muted-foreground">{order.entry_count} entries</p>
						</div>


						<p className="text-muted-foreground">{order.payment_method}</p>
					</div>
				</div>
			</button>

			{open && (
				<div className="border-t border-border/50 px-5 py-4">
					{order.tickets.length > 0 && (
						<div className="rounded-xl bg-muted/50 border border-border/50 px-4 py-3 mb-4">
							<p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Tickets by Raffle</p>
							<div className="space-y-1.5">
								{Object.entries(ticketsByRaffle).map(([raffleName, numbers]) => (
									<div key={raffleName} className="flex flex-col gap-1 text-sm sm:flex-row sm:gap-3">
										<span className="font-semibold text-foreground sm:min-w-[180px]">{raffleName}</span>
										<span className="text-muted-foreground">{numbers.map((number) => `#${number}`).join(' · ')}</span>
									</div>
								))}
							</div>
						</div>
					)}

					<div className="flex flex-wrap gap-2">
						{order.payment_status === 'pending' && (
							<button
								type="button"
								onClick={() => onApprove(order.id)}
								disabled={approvingOrderId === order.id}
								className="inline-flex items-center gap-1.5 gradient-gold text-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-gold transition-all duration-200 disabled:opacity-70"
							>
								<CheckCircle className="h-4 w-4" />
								{approvingOrderId === order.id ? 'Approving...' : 'Approve Payment'}
							</button>
						)}
						<button
							type="button"
							onClick={() => onEmail(order)}
							disabled={emailingOrderId === order.id}
							className="inline-flex items-center gap-1.5 bg-card border border-border/60 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-muted transition-colors duration-200"
						>
							<Mail className="h-4 w-4" />
							{emailingOrderId === order.id
								? 'Sending...'
								: order.payment_status === 'paid'
									? 'Send Thank You Email'
									: 'Send Order Email'}
						</button>

						<button
							type="button"
							onClick={() => onDelete && onDelete(order.id)}
							className="inline-flex items-center gap-1.5 bg-rose-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-rose-700 transition-colors duration-200"
						>
							<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
							Delete
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

const AdminPage = () => {
	const { toast } = useToast();
	const [session, setSession] = useState(null);
	const [dashboard, setDashboard] = useState(null);
	const [loading, setLoading] = useState(true);
	const [signingIn, setSigningIn] = useState(false);
	const [signingUp, setSigningUp] = useState(false);
	const [savingBusiness, setSavingBusiness] = useState(false);
	const [savingEvent, setSavingEvent] = useState(false);
	const [savingNewsletter, setSavingNewsletter] = useState(false);
	const [savingCommunication, setSavingCommunication] = useState(false);
	const [savingSettings, setSavingSettings] = useState(false);
	const [savingInvite, setSavingInvite] = useState(false);
	const [approvingOrderId, setApprovingOrderId] = useState(null);
	const [emailingOrderId, setEmailingOrderId] = useState(null);
	const [exportingCSV, setExportingCSV] = useState(false);
	const [orders, setOrders] = useState([]);
	const [ordersLoading, setOrdersLoading] = useState(false);
	const [ordersFilter, setOrdersFilter] = useState('all');
	const [activeTab, setActiveTab] = useState('orders');
	const [credentials, setCredentials] = useState({ email: '', password: '' });
	const [businessForm, setBusinessForm] = useState(initialBusinessForm);
	const [eventForm, setEventForm] = useState(initialEventForm);
	const [newsletterForm, setNewsletterForm] = useState(initialNewsletterForm);
	const [communicationForm, setCommunicationForm] = useState(initialCommunicationForm);
	const [settingsForm, setSettingsForm] = useState(initialSettingsForm);
	const [inviteForm, setInviteForm] = useState(initialInviteForm);
	const [newsletterDocuments, setNewsletterDocuments] = useState([]);
	const [newsletterLoading, setNewsletterLoading] = useState(false);
	const [newsletterUploadKey, setNewsletterUploadKey] = useState(0);
	const [manualDonationForm, setManualDonationForm] = useState(initialManualDonationForm);
	const [savingManualDonation, setSavingManualDonation] = useState(false);
	const [manualTicketForm, setManualTicketForm] = useState(initialManualTicketForm);
	const [savingManualTicket, setSavingManualTicket] = useState(false);

	const showDashboard = Boolean(session);
	const showDisconnectedState = !hasSupabaseConfig;
	const canManage = Boolean(session) && dashboard?.mode === 'live';
	const canInviteAdmins = ['owner', 'admin'].includes(dashboard?.currentAdminRole || '');

	const loadDashboard = async () => {
		clearAdminDataCache();
		// Don't set loading=true for background refreshes — only show the loading state on initial mount
		const nextDashboard = await fetchAdminDashboard();
		setDashboard(nextDashboard);
	};

	const loadDashboardFull = async () => {
		clearAdminDataCache();
		setLoading(true);
		const nextDashboard = await fetchAdminDashboard();
		setDashboard(nextDashboard);
		setLoading(false);
	};

	const loadOrders = async () => {
		setOrdersLoading(true);
		const result = await fetchOrdersWithTickets();
		if (result.ok) {
			setOrders(result.orders);
		}
		setOrdersLoading(false);
	};

	const loadNewsletterArchive = async () => {
		setNewsletterLoading(true);
		const result = await fetchNewsletterDocuments();
		setNewsletterDocuments(result.documents || []);
		setNewsletterLoading(false);
	};

	useEffect(() => {
		let active = true;

		const initialize = async () => {
			const nextSession = await getAdminSession();
			if (active) {
				setSession(nextSession);
			}
		};

		initialize();

		const unsubscribe = watchAdminSession((nextSession) => {
			setSession(nextSession);
		});

		return () => {
			active = false;
			unsubscribe();
		};
	}, []);

	useEffect(() => {
		let active = true;

		const initializeDashboard = async () => {
			if (!showDashboard) {
				setDashboard(null);
				setLoading(false);
				return;
			}

			setLoading(true);
			const nextDashboard = await fetchAdminDashboard();
			if (active) {
				setDashboard(nextDashboard);
				setLoading(false);
			}
		};

		initializeDashboard();

		return () => {
			active = false;
		};
	}, [showDashboard, session]);

	useEffect(() => {
		if (dashboard?.tenant) {
			setSettingsForm(buildSettingsForm(dashboard.tenant));
			setCommunicationForm((current) => ({
				...current,
				replyTo: current.replyTo || dashboard.tenant.support_email || '',
			}));
		}
	}, [dashboard?.tenant]);

	useEffect(() => {
		if (showDashboard) {
			loadOrders();
			loadNewsletterArchive();
		}
	}, [showDashboard]);

	const handleCredentialChange = (event) => {
		const { name, value } = event.target;
		setCredentials((current) => ({ ...current, [name]: value }));
	};

	const handleBusinessChange = (event) => {
		const { name, value, type, checked } = event.target;
		setBusinessForm((current) => ({
			...current,
			[name]: type === 'checkbox' ? checked : value,
		}));
	};

	const handleEventChange = (event) => {
		const { name, value } = event.target;
		setEventForm((current) => ({ ...current, [name]: value }));
	};

	const handleNewsletterChange = (event) => {
		const { name, value, files, type } = event.target;
		setNewsletterForm((current) => ({
			...current,
			[name]: type === 'file' ? (files?.[0] || null) : value,
		}));
	};

	const handleSettingsChange = (event) => {
		const { name, value } = event.target;
		setSettingsForm((current) => ({ ...current, [name]: value }));
	};

	const handleInviteChange = (event) => {
		const { name, value } = event.target;
		setInviteForm((current) => ({ ...current, [name]: value }));
	};

	const handleManualDonationChange = (event) => {
		const { name, value } = event.target;
		setManualDonationForm((current) => ({ ...current, [name]: value }));
	};

	const handleManualDonationSubmit = async (event) => {
		event.preventDefault();
		setSavingManualDonation(true);

		const result = await recordManualDonation(manualDonationForm);

		if (result.ok) {
			toast({
				title: 'Donation recorded',
				description: result.message,
				variant: result.warning ? 'destructive' : 'default',
			});
			setManualDonationForm(initialManualDonationForm);
			await Promise.all([loadDashboard(), loadOrders()]);
		} else {
			toast({
				title: 'Could not record donation',
				description: result.message,
				variant: 'destructive',
			});
		}

		setSavingManualDonation(false);
	};

	const handleManualTicketChange = (event) => {
		const { name, value } = event.target;
		setManualTicketForm((current) => ({ ...current, [name]: value }));
	};

	const handleManualTicketSubmit = async (event) => {
		event.preventDefault();
		setSavingManualTicket(true);

		const result = await recordManualTicketOrder(manualTicketForm);

		if (result.ok) {
			toast({
				title: 'Tickets issued',
				description: result.message,
				variant: result.warning ? 'destructive' : 'default',
			});
			setManualTicketForm(initialManualTicketForm);
			await Promise.all([loadDashboard(), loadOrders()]);
		} else {
			toast({
				title: 'Could not issue tickets',
				description: result.message,
				variant: 'destructive',
			});
		}

		setSavingManualTicket(false);
	};

	const handleSignIn = async (event) => {
		event.preventDefault();
		setSigningIn(true);
		const result = await signInAdmin(credentials);

		if (!result.ok) {
			toast({
				title: 'Sign in failed',
				description: result.message,
				variant: 'destructive',
			});
		} else {
			toast({
				title: 'Signed in',
				description: result.claimStatus === 'claimed'
					? 'Your admin invite was claimed and the dashboard is loading.'
					: 'Loading the admin panel.',
			});
		}

		setSigningIn(false);
	};

	const handleSignUp = async (event) => {
		event.preventDefault();
		setSigningUp(true);
		const result = await signUpAdmin(credentials);

		if (!result.ok) {
			toast({
				title: 'Account setup failed',
				description: result.message,
				variant: 'destructive',
			});
		} else {
			toast({
				title: 'Account ready',
				description: result.message,
			});
		}

		setSigningUp(false);
	};

	const handleSignOut = async () => {
		await signOutAdmin();
		setDashboard(null);
		setNewsletterDocuments([]);
		toast({
			title: 'Signed out',
			description: 'The admin session has been closed.',
		});
	};

	const handleRefresh = async () => {
		await Promise.all([loadDashboardFull(), loadOrders(), loadNewsletterArchive()]);
		toast({
			title: 'Dashboard refreshed',
			description: 'Latest family records loaded.',
		});
	};

	const handleBusinessSubmit = async (event) => {
		event.preventDefault();
		setSavingBusiness(true);
		const result = await saveBusinessListing(businessForm);

		if (result.ok) {
			toast({
				title: 'Business saved',
				description: result.message,
			});
			setBusinessForm(initialBusinessForm);
			await loadDashboard();
		} else {
			toast({
				title: 'Business not saved',
				description: result.message,
				variant: 'destructive',
			});
		}

		setSavingBusiness(false);
	};

	const handleEventSubmit = async (event) => {
		event.preventDefault();
		setSavingEvent(true);
		const result = await saveEvent(eventForm);

		if (result.ok) {
			toast({
				title: 'Event saved',
				description: result.message,
			});
			setEventForm(initialEventForm);
			await loadDashboard();
		} else {
			toast({
				title: 'Event not saved',
				description: result.message,
				variant: 'destructive',
			});
		}

		setSavingEvent(false);
	};

	const handleNewsletterSubmit = async (event) => {
		event.preventDefault();
		setSavingNewsletter(true);
		const result = await uploadNewsletterDocument(newsletterForm);

		if (result.ok) {
			toast({
				title: 'Newsletter uploaded',
				description: result.message,
			});
			setNewsletterForm(initialNewsletterForm);
			setNewsletterUploadKey((current) => current + 1);
			await loadNewsletterArchive();
		} else {
			toast({
				title: 'Upload failed',
				description: result.message,
				variant: 'destructive',
			});
		}

		setSavingNewsletter(false);
	};

	const handleSettingsSubmit = async (event) => {
		event.preventDefault();
		setSavingSettings(true);
		const result = await saveTenantProfile(settingsForm);

		if (result.ok) {
			toast({
				title: 'Family settings updated',
				description: result.message,
			});
			await loadDashboard();
		} else {
			toast({
				title: 'Settings not saved',
				description: result.message,
				variant: 'destructive',
			});
		}

		setSavingSettings(false);
	};

	const handleInviteSubmit = async (event) => {
		event.preventDefault();
		setSavingInvite(true);
		const result = await saveAdminInvite(inviteForm);

		if (result.ok) {
			toast({
				title: 'Admin invite saved',
				description: result.message,
			});
			setInviteForm(initialInviteForm);
			await loadDashboard();
		} else {
			toast({
				title: 'Invite not saved',
				description: result.message,
				variant: 'destructive',
			});
		}

		setSavingInvite(false);
	};

	const handleCommunicationChange = (event) => {
		const { name, value } = event.target;
		setCommunicationForm((current) => ({
			...current,
			[name]: value,
		}));
	};

	const handleCommunicationSubmit = async (event) => {
		event.preventDefault();
		setSavingCommunication(true);

		const result = await sendFamilyCommunication(communicationForm);

		if (result.ok) {
			toast({
				title: 'Email sent',
				description: result.message,
			});
			setCommunicationForm((current) => ({
				...initialCommunicationForm,
				replyTo: current.replyTo,
				signature: current.signature,
			}));
		} else {
			toast({
				title: 'Email not sent',
				description: result.message,
				variant: 'destructive',
			});
		}

		setSavingCommunication(false);
	};

	const handleApproveOrder = async (orderId) => {
		setApprovingOrderId(orderId);
		const result = await updateOrderPaymentStatus(orderId, 'paid');

		if (result.ok) {
			const emailResult = await resendOrderConfirmation(orderId, { variant: 'payment-confirmed' });
			toast({
				title: emailResult.ok ? 'Order approved' : 'Order approved, email pending',
				description: emailResult.ok
					? 'Payment marked as paid and thank-you email sent.'
					: `Payment marked as paid, but the thank-you email failed: ${emailResult.message || 'Unknown error'}`,
				variant: emailResult.ok ? 'default' : 'destructive',
			});
			await Promise.all([loadDashboard(), loadOrders()]);
		} else {
			toast({
				title: 'Approval failed',
				description: result.message,
				variant: 'destructive',
			});
		}

		setApprovingOrderId(null);
	};

	const handleDeleteOrder = async (orderId) => {
		// open confirm dialog instead
		setConfirmDelete({ type: 'order', id: orderId, label: null });
	};

	const handleDeleteEvent = async (eventId) => {
		setConfirmDelete({ type: 'event', id: eventId, label: null });
	};

	const handleDeleteNewsletter = async (documentId) => {
		setConfirmDelete({ type: 'newsletter', id: documentId, label: null });
	};

	const handleDeleteTicket = (ticketId, label) => {
		setConfirmDelete({ type: 'ticket', id: ticketId, label: label || 'ticket' });
	};

	const handleEmailConfirmation = async (order) => {
		setEmailingOrderId(order.id);
		const variant = order.payment_status === 'paid' ? 'payment-confirmed' : 'payment-pending';
		const result = await resendOrderConfirmation(order.id, { variant });

		toast({
			title: result.ok ? 'Email sent' : 'Email failed',
			description: result.ok
				? `Resend delivered to ${order.email}.`
				: result.message || 'Could not send the order email.',
			variant: result.ok ? 'default' : 'destructive',
		});

		setEmailingOrderId(null);
	};

	// Confirmation dialog state for destructive actions
	const [confirmDelete, setConfirmDelete] = useState(null);

	const performConfirmedDelete = async () => {
		if (!confirmDelete) return;
		const { type, id } = confirmDelete;
		setConfirmDelete(null);
		try {
			if (type === 'order') {
				setApprovingOrderId(id);
				const res = await deleteOrderAndTickets(id);
				if (res.ok) {
					toast({ title: 'Order deleted', description: 'Order and associated tickets removed.' });
					await Promise.all([loadDashboard(), loadOrders()]);
				} else {
					toast({ title: 'Delete failed', description: res.message, variant: 'destructive' });
				}
				setApprovingOrderId(null);
			} else if (type === 'event') {
				setSavingEvent(true);
				const res = await deleteEventAndSignups(id);
				if (res.ok) {
					toast({ title: 'Event deleted', description: 'Event and associated signups removed.' });
					await loadDashboard();
				} else {
					toast({ title: 'Delete failed', description: res.message, variant: 'destructive' });
				}
				setSavingEvent(false);
			} else if (type === 'newsletter') {
				setSavingNewsletter(true);
				const res = await deleteNewsletterDocument(id);
				if (res.ok) {
					toast({ title: 'Newsletter deleted', description: 'Document removed from archive.' });
					await loadNewsletterArchive();
				} else {
					toast({ title: 'Delete failed', description: res.message, variant: 'destructive' });
				}
				setSavingNewsletter(false);
					} else if (type === 'ticket') {
						// single ticket delete
						const res = await deleteTicket(id);
						if (res.ok) {
							toast({ title: 'Ticket deleted', description: 'Ticket removed.' });
							await loadDashboard();
						} else {
							toast({ title: 'Delete failed', description: res.message, variant: 'destructive' });
						}
			}
		} catch (err) {
			toast({ title: 'Delete failed', description: err.message || String(err), variant: 'destructive' });
		}
	};

	const handleExportCSV = async () => {
		setExportingCSV(true);
		const { ok, orders: allOrders } = await fetchAllOrdersForExport();

		if (!ok || allOrders.length === 0) {
			toast({
				title: 'Nothing to export',
				description: 'No orders found.',
				variant: 'destructive',
			});
			setExportingCSV(false);
			return;
		}

		const headers = ['Reference', 'Name', 'Email', 'Phone', 'Method', 'Status', 'Amount', 'Entries', 'Date', 'Notes'];
		const rows = allOrders.map((order) => [
			order.reference_code || '',
			order.purchaser_name || '',
			order.email || '',
			order.phone || '',
			order.payment_method || '',
			order.payment_status || '',
			((order.donation_amount_cents || 0) / 100).toFixed(2),
			order.entry_count || 0,
			order.created_at ? new Date(order.created_at).toLocaleDateString() : '',
			(order.notes || '').replace(/,/g, ' '),
		]);

		const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `sumlin-orders-${new Date().toISOString().slice(0, 10)}.csv`;
		link.click();
		URL.revokeObjectURL(url);
		setExportingCSV(false);
	};

	const handleBusinessEdit = (item) => {
		setBusinessForm({
			id: item.id,
			title: item.title || '',
			category: item.category || 'Professional Services',
			description: item.description || '',
			price_label: item.price_label || '',
			sort_order: String(item.sort_order ?? 0),
			is_featured: Boolean(item.is_featured),
		});
		setActiveTab('business');
	};

	const handleEventEdit = (item) => {
		setEventForm({
			id: item.id,
			title: item.title || '',
			event_type: item.event_type || 'family',
			status: item.status || 'planned',
			description: item.description || '',
			location: item.location || '',
			starts_at: toDateTimeInput(item.starts_at),
			ends_at: toDateTimeInput(item.ends_at),
			capacity: item.capacity ? String(item.capacity) : '',
			google_calendar_event_url: item.google_calendar_event_url || '',
			intake_deadline: toDateTimeInput(item.intake_deadline),
		});
		setActiveTab('events');
	};

	const filteredOrders = orders.filter((order) => (
		ordersFilter === 'all' || order.payment_status === ordersFilter
	));

	const adminTabs = [
		{ id: 'orders', label: 'Orders', icon: Wallet, count: orders.length },
		{ id: 'communications', label: 'Communications', icon: Mail, count: 'Send' },
		{ id: 'tickets', label: 'Tickets', icon: Ticket, count: dashboard?.tickets?.length || 0 },
		{ id: 'events', label: 'Events', icon: CalendarDays, count: dashboard?.events?.length || 0 },
		{ id: 'newsletter', label: 'Newsletter', icon: Download, count: newsletterDocuments.length },
		{ id: 'business', label: 'Business', icon: Store, count: dashboard?.businesses?.length || 0 },
		{ id: 'access', label: 'Access', icon: Users, count: dashboard?.admins?.length || 0 },
	];

	return (
		<>
			<Helmet>
				<title>Admin Dashboard | Sumlin Family</title>
				<meta
					name="description"
					content="Manage the Sumlin family calendar, newsletter uploads, business directory, fundraiser records, and family signups."
				/>
			</Helmet>

			{/* Global confirm dialog for destructive actions (orders, events, newsletter) */}
			<AlertDialog open={Boolean(confirmDelete)} onOpenChange={(open) => { if (!open) setConfirmDelete(null); }}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Confirm delete</AlertDialogTitle>
						<AlertDialogDescription>
							This action is permanent and cannot be undone. Are you sure you want to continue?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className="mt-4 flex gap-2 justify-end">
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={performConfirmedDelete} className="bg-rose-600">Delete permanently</AlertDialogAction>
					</div>
				</AlertDialogContent>
			</AlertDialog>

			<section className="bg-background pt-20 pb-4 border-b border-border/50">
				<div className="container-custom">
					<div className="flex flex-wrap items-center justify-between gap-3 py-3">
						<div className="flex items-center gap-3 min-w-0">
							<div className="flex-shrink-0 w-9 h-9 rounded-xl gradient-burgundy flex items-center justify-center">
								<ShieldCheck className="h-4 w-4 text-white" />
							</div>
							<div className="min-w-0">
								<p className="text-xs font-semibold uppercase tracking-widest text-primary leading-none mb-0.5">Family Admin Panel</p>
								<h1 className="text-lg font-bold leading-tight truncate">Manage businesses, events, tickets &amp; signups</h1>
							</div>
						</div>

						<div className="flex items-center gap-2">
							{showDashboard && (
								<button
									type="button"
									onClick={handleRefresh}
									className="inline-flex items-center gap-1.5 bg-card border border-border/60 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-muted transition-colors duration-200"
								>
									<RefreshCcw className="h-3.5 w-3.5" />
									Refresh
								</button>
							)}
							{session && (
								<button
									type="button"
									onClick={handleSignOut}
									className="inline-flex items-center gap-1.5 bg-card border border-border/60 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-muted transition-colors duration-200"
								>
									<LogOut className="h-3.5 w-3.5" />
									Sign out
								</button>
							)}
						</div>
					</div>
				</div>
			</section>

			<section className="bg-background py-6">
				<div className="container-custom">

					{!session && hasSupabaseConfig && (
						<div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 mb-10">
							<form onSubmit={handleSignIn} className="bg-card border border-border/50 rounded-3xl p-8 shadow-xl">
								<h2 className="text-2xl font-bold mb-3">Admin sign in</h2>
								<p className="text-muted-foreground mb-6">
									Sign in with your admin email to access the family dashboard. If you were invited, create your account first and then sign in to claim access.
								</p>
								<div className="space-y-4">
									<input type="email" name="email" placeholder="Your email address" value={credentials.email} onChange={handleCredentialChange} required className="w-full" />
									<input type="password" name="password" placeholder="Your password" value={credentials.password} onChange={handleCredentialChange} required className="w-full" />
									<button
										type="submit"
										disabled={signingIn}
										className="w-full gradient-gold text-foreground py-3 rounded-xl font-semibold hover:shadow-gold transition-all duration-200 disabled:opacity-70"
									>
										{signingIn ? 'Signing in...' : 'Sign in to admin panel'}
									</button>
									<button
										type="button"
										onClick={handleSignUp}
										disabled={signingUp}
										className="w-full bg-card border border-border/60 py-3 rounded-xl font-semibold hover:bg-muted transition-colors duration-200 disabled:opacity-70"
									>
										{signingUp ? 'Creating account...' : 'Create new account'}
									</button>
								</div>
							</form>

							<div className="bg-muted border border-border/50 rounded-3xl p-8">
								<div className="flex items-center gap-3 mb-4">
									<ShieldCheck className="h-5 w-5 text-primary" />
									<h2 className="text-2xl font-bold">Getting started</h2>
								</div>
								<div className="space-y-4 text-muted-foreground leading-relaxed">
									<p><strong>First time here?</strong> If an existing admin invited your email, create your account first, then sign in to claim access.</p>
									<p><strong>Already have an account?</strong> Sign in with your email and password. Access depends on your admin role.</p>
									<p><strong>Need access?</strong> Ask any existing admin to invite your email from the access section.</p>
								</div>
							</div>
						</div>
					)}

					{showDisconnectedState && (
						<div className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-8 mb-10">
							<div className="flex items-center gap-3 mb-4">
								<Database className="h-5 w-5 text-amber-600" />
								<h2 className="text-2xl font-bold">Database setup in progress</h2>
							</div>
							<div className="space-y-3 text-muted-foreground leading-relaxed">
								<p>The admin panel is currently being configured. Once the database connection is complete, you'll be able to sign in and manage family events, businesses, and signups.</p>
								<p>Check back soon or contact the site administrator for updates.</p>
							</div>
						</div>
					)}

					{showDashboard && (
						<>
							{loading && (
								<div className="bg-card border border-border/50 rounded-3xl p-10 text-center text-muted-foreground">
									Loading family records...
								</div>
							)}

							{!loading && dashboard && (
								<>
									{dashboard.error && (
										<div className="rounded-3xl border border-rose-950/30 bg-rose-50 p-6 mb-8">
											<h2 className="text-xl font-semibold mb-2 text-rose-950">
												{dashboard.error.type === 'membership_missing' ? 'Access denied' : 'Database setup needed'}
											</h2>
											<p className="text-muted-foreground">{dashboard.error.message}</p>
										</div>
									)}

									<div className="grid md:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
										{/* Injected $ raised card — computed live from orders */}
										{(() => {
											const paidOrders = orders.filter((o) => o.payment_status === 'paid');
											const totalRaisedCents = paidOrders.reduce((s, o) => s + (o.donation_amount_cents || 0), 0);
											const ticketRevenueCents = paidOrders.filter((o) => (o.entry_count || 0) > 0).reduce((s, o) => s + (o.donation_amount_cents || 0), 0);
											const donationCents = totalRaisedCents - ticketRevenueCents;
											const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n / 100);
											return (
												<div className="bg-card border border-green-200 rounded-2xl p-4 shadow-sm xl:col-span-1">
													<p className="text-xs uppercase tracking-[0.2em] text-green-700 font-semibold mb-1">Total Raised</p>
													<p className="text-3xl font-bold mb-1 text-green-700">{fmt(totalRaisedCents)}</p>
													<p className="text-xs text-muted-foreground leading-relaxed">
														{fmt(ticketRevenueCents)} tickets · {fmt(donationCents)} donations
													</p>
												</div>
											);
										})()}
										{dashboard.kpis.map((kpi) => (
											<div key={kpi.label} className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
												<p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-1">{kpi.label}</p>
												<p className="text-3xl font-bold mb-1">{kpi.value}</p>
												<p className="text-xs text-muted-foreground leading-relaxed">{kpi.detail}</p>
											</div>
										))}
									</div>

									<div className="sticky top-16 z-10 mb-6 rounded-2xl border border-border/50 bg-background/95 p-2 shadow-sm backdrop-blur">
										<div className="flex flex-wrap gap-2">
											{adminTabs.map((tab) => {
												const Icon = tab.icon;
												return (
													<button
														key={tab.id}
														type="button"
														onClick={() => setActiveTab(tab.id)}
														className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
															activeTab === tab.id
																? 'gradient-burgundy text-white shadow-md'
																: 'bg-card text-muted-foreground hover:bg-muted'
														}`}
													>
														<Icon className="h-4 w-4" />
														<span>{tab.label}</span>
														<span className={`rounded-full px-2 py-0.5 text-xs ${activeTab === tab.id ? 'bg-white/15' : 'bg-muted-foreground/10 text-foreground'}`}>
															{tab.count}
														</span>
													</button>
												);
											})}
										</div>
									</div>

									{activeTab === 'tickets' && (
										<div className="space-y-6">

											{/* ── Issue Tickets Manually — full width at top ── */}
											<div className="bg-card border border-primary/20 rounded-3xl p-6 shadow-sm">
												<div className="flex items-center gap-3 mb-1">
													<Ticket className="h-5 w-5 text-primary" />
													<h2 className="text-xl font-bold">Issue Tickets Manually</h2>
												</div>
												<p className="text-sm text-muted-foreground mb-5">
													Type the number of tickets purchased — no need to click +/− for each one. This creates a paid order and assigns ticket numbers automatically.
												</p>
												<form onSubmit={handleManualTicketSubmit} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
													<input
														type="text"
														name="name"
														placeholder="Buyer name *"
														value={manualTicketForm.name}
														onChange={handleManualTicketChange}
														required
														className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm"
													/>
													<input
														type="email"
														name="email"
														placeholder="Buyer email (optional)"
														value={manualTicketForm.email}
														onChange={handleManualTicketChange}
														className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm"
													/>
													<input
														type="tel"
														name="phone"
														placeholder="Buyer phone (optional)"
														value={manualTicketForm.phone}
														onChange={handleManualTicketChange}
														className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm"
													/>
													<input
														type="text"
														name="raffleName"
														placeholder="Raffle name (e.g. General, Basket #1)"
														value={manualTicketForm.raffleName}
														onChange={handleManualTicketChange}
														required
														className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm"
													/>
													<div>
														<label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block mb-1">
															# of Tickets *
														</label>
														<input
															type="number"
															name="quantity"
															min="1"
															max="500"
															step="1"
															placeholder="e.g. 10"
															value={manualTicketForm.quantity}
															onChange={handleManualTicketChange}
															required
															className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm font-bold"
														/>
													</div>
													<div>
														<label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block mb-1">
															$ per Ticket *
														</label>
														<div className="relative">
															<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">$</span>
															<input
																type="number"
																name="pricePerTicket"
																min="0.01"
																step="0.01"
																placeholder="e.g. 5.00"
																value={manualTicketForm.pricePerTicket}
																onChange={handleManualTicketChange}
																required
																className="w-full rounded-xl border border-border/60 bg-background pl-7 pr-4 py-3 text-sm font-bold"
															/>
														</div>
													</div>
													<select
														name="paymentMethod"
														value={manualTicketForm.paymentMethod}
														onChange={handleManualTicketChange}
														className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm"
													>
														<option value="paypal">PayPal</option>
														<option value="cashapp">Cash App</option>
														<option value="venmo">Venmo</option>
														<option value="cash">Cash</option>
														<option value="other">Other (Zelle, Check, etc.)</option>
													</select>
													<input
														type="text"
														name="externalReference"
														placeholder="Transaction ID / reference (optional)"
														value={manualTicketForm.externalReference}
														onChange={handleManualTicketChange}
														className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm"
													/>
													{manualTicketForm.quantity && manualTicketForm.pricePerTicket && (
														<p className="text-sm font-semibold text-primary text-center rounded-xl bg-primary/10 py-2 sm:col-span-2 lg:col-span-2">
															Total: ${(Number(manualTicketForm.quantity) * Number(manualTicketForm.pricePerTicket)).toFixed(2)} for {manualTicketForm.quantity} ticket{Number(manualTicketForm.quantity) !== 1 ? 's' : ''}
														</p>
													)}
													<textarea
														name="notes"
														placeholder="Internal notes (optional)"
														value={manualTicketForm.notes}
														onChange={handleManualTicketChange}
														rows={2}
														className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm sm:col-span-2 lg:col-span-2"
													/>
													<div className="sm:col-span-2 lg:col-span-4">
														<button
															type="submit"
															disabled={savingManualTicket}
															className="inline-flex items-center justify-center gap-2 gradient-burgundy text-white px-6 py-3 rounded-xl font-semibold hover:shadow-burgundy transition-all duration-200 disabled:opacity-70"
														>
															<Ticket className="h-4 w-4" />
															{savingManualTicket ? 'Issuing...' : 'Issue Tickets & Mark Paid'}
														</button>
													</div>
												</form>
											</div>

											{/* ── Ticket list + Recent purchases below ── */}
											<div className="grid xl:grid-cols-[1.35fr_0.65fr] gap-8">
												<div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
													<div className="flex items-center justify-between gap-4 mb-6">
														<div className="flex items-center gap-3">
															<Ticket className="h-5 w-5 text-primary" />
															<div>
																<h2 className="text-2xl font-bold">Latest tickets</h2>
																<p className="text-sm text-muted-foreground mt-0.5">Compact list view to keep ticket intake at the top with less scrolling.</p>
															</div>
														</div>
														<div className="text-right">
															<p className="text-2xl font-bold">{dashboard.tickets.length}</p>
															<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Visible tickets</p>
														</div>
													</div>
													<div className="overflow-hidden rounded-2xl border border-border/50">
														<div className="grid grid-cols-[96px_minmax(0,1fr)_120px] gap-4 bg-muted/50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
															<p>Ticket</p>
															<p>Raffle</p>
															<p>Status</p>
														</div>
														<div className="divide-y divide-border/50">
															{dashboard.tickets.map((ticket) => (
																<div key={ticket.id} className="grid grid-cols-[96px_minmax(0,1fr)_120px] gap-4 px-4 py-3 text-sm items-center">
																	<p className="font-semibold text-foreground">#{ticket.ticket_number}</p>
																	<div className="min-w-0">
																		<p className="font-medium text-foreground truncate">{ticket.raffle_name || 'General raffle'}</p>
																		<p className="text-xs text-muted-foreground truncate">Order {ticket.order_id}</p>
																	</div>
																	<div className="flex items-center justify-end gap-3">
																		<p className="text-sm text-muted-foreground">{ticket.status}</p>
																		<button type="button" onClick={() => handleDeleteTicket(ticket.id, `#${ticket.ticket_number}`)} className="text-sm font-semibold text-rose-600 hover:text-rose-700">
																			Delete
																		</button>
																	</div>
																</div>
															))}
															{dashboard.tickets.length === 0 && (
																<p className="px-4 py-8 text-center text-sm text-muted-foreground">No tickets found yet.</p>
															)}
														</div>
													</div>
												</div>

												<div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
													<div className="flex items-center gap-3 mb-6">
														<Wallet className="h-5 w-5 text-primary" />
														<h2 className="text-2xl font-bold">Recent purchases</h2>
													</div>
													<div className="space-y-3">
														{orders.slice(0, 6).map((order) => (
															<div key={order.id} className="rounded-2xl border border-border/50 px-4 py-3">
																<div className="flex items-center justify-between gap-3">
																	<div className="min-w-0">
																		<p className="font-semibold truncate">{order.purchaser_name}</p>
																		<p className="text-xs text-muted-foreground truncate">{order.reference_code}</p>
																	</div>
																	<p className="font-semibold text-primary shrink-0">{formatMoney(order.donation_amount_cents)}</p>
																</div>
																<p className="text-xs text-muted-foreground mt-2">{order.entry_count} entries • {order.payment_status}</p>
															</div>
														))}
													</div>
												</div>
											</div>
										</div>
									)}

								{activeTab === 'orders' && (
									<div className="space-y-6">

										{/* ── Record an Offline Donation — full width above the 2-col card ── */}
										<div className="rounded-2xl border border-border/50 bg-muted/40 p-6">
											<div className="flex items-center gap-3 mb-2">
												<PlusCircle className="h-5 w-5 text-primary" />
												<h3 className="text-xl font-bold">Record an Offline Donation</h3>
											</div>
											<p className="text-sm text-muted-foreground mb-3">
												Use this to log a <strong>money donation</strong> received via PayPal dashboard, Cash App, Venmo, or in person. The donation will be recorded as <strong>paid</strong> immediately.
											</p>
											<div className="mb-5 flex items-start gap-2 rounded-xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-800">
												<Ticket className="h-4 w-4 mt-0.5 shrink-0" />
												<span>
													<strong>Donations only — no raffle tickets.</strong> If the person wants to buy tickets online, send them to{' '}
													<a href="/store" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-amber-900">
														Fundraiser
													</a>
													. If they already paid offline and need tickets issued manually, use the{' '}
													<button type="button" onClick={() => setActiveTab('tickets')} className="underline font-semibold hover:text-amber-900">
														Tickets tab
													</button>
													.
												</span>
											</div>
											<form onSubmit={handleManualDonationSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
												<input
													type="text"
													name="name"
													placeholder="Donor name"
													value={manualDonationForm.name}
													onChange={handleManualDonationChange}
													required
													className="w-full rounded-xl border border-border/60 bg-background px-4 py-3"
												/>
												<input
													type="email"
													name="email"
													placeholder="Donor email (optional)"
													value={manualDonationForm.email}
													onChange={handleManualDonationChange}
													className="w-full rounded-xl border border-border/60 bg-background px-4 py-3"
												/>
												<div className="relative">
													<span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">$</span>
													<input
														type="number"
														name="amount"
														min="1"
														step="0.01"
														placeholder="Amount (e.g. 50.00)"
														value={manualDonationForm.amount}
														onChange={handleManualDonationChange}
														required
														className="w-full rounded-xl border border-border/60 bg-background pl-8 pr-4 py-3"
													/>
												</div>
												<select
													name="paymentMethod"
													value={manualDonationForm.paymentMethod}
													onChange={handleManualDonationChange}
													className="w-full rounded-xl border border-border/60 bg-background px-4 py-3"
												>
													<option value="paypal">PayPal</option>
													<option value="cashapp">Cash App</option>
													<option value="venmo">Venmo</option>
													<option value="cash">Cash</option>
													<option value="other">Other (Zelle, Check, etc.)</option>
												</select>
												<input
													type="text"
													name="externalReference"
													placeholder="PayPal transaction ID / reference (optional)"
													value={manualDonationForm.externalReference}
													onChange={handleManualDonationChange}
													className="w-full rounded-xl border border-border/60 bg-background px-4 py-3"
												/>
												<input
													type="tel"
													name="phone"
													placeholder="Donor phone (optional)"
													value={manualDonationForm.phone}
													onChange={handleManualDonationChange}
													className="w-full rounded-xl border border-border/60 bg-background px-4 py-3"
												/>
												<textarea
													name="notes"
													placeholder="Internal notes (optional)"
													value={manualDonationForm.notes}
													onChange={handleManualDonationChange}
													rows={2}
													className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 sm:col-span-2"
												/>
												<div className="sm:col-span-2 lg:col-span-4">
													<button
														type="submit"
														disabled={savingManualDonation}
														className="inline-flex items-center gap-2 gradient-gold text-foreground px-6 py-3 rounded-xl font-semibold hover:shadow-gold transition-all duration-200 disabled:opacity-70"
													>
														<PlusCircle className="h-4 w-4" />
														{savingManualDonation ? 'Recording...' : 'Record Donation'}
													</button>
												</div>
											</form>
										</div>

									<div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
										<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
											<div className="flex items-center gap-3">
												<Wallet className="h-5 w-5 text-primary" />
												<div>
													<h2 className="text-2xl font-bold">Payment Command Center</h2>
													<p className="text-sm text-muted-foreground mt-0.5">Compact order review with approvals and email confirmations in one place.</p>
												</div>
											</div>
											<button
												type="button"
												onClick={handleExportCSV}
												disabled={exportingCSV}
												className="inline-flex items-center gap-2 bg-card border border-border/60 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-muted transition-colors duration-200 disabled:opacity-70"
											>
												<Download className="h-4 w-4" />
												{exportingCSV ? 'Exporting...' : 'Export CSV'}
											</button>
										</div>

										{/* ── $ Dollar Tracker ── */}
										{(() => {
											const FUNDRAISER_GOAL = 5000;
											const paidOrders = orders.filter((o) => o.payment_status === 'paid');
											const pendingOrders = orders.filter((o) => o.payment_status === 'pending');
											const ticketRevenue = paidOrders.filter((o) => (o.entry_count || 0) > 0).reduce((s, o) => s + (o.donation_amount_cents || 0), 0) / 100;
											const donationRevenue = paidOrders.filter((o) => (o.entry_count || 0) === 0).reduce((s, o) => s + (o.donation_amount_cents || 0), 0) / 100;
											const totalRaised = ticketRevenue + donationRevenue;
											const pendingDollars = pendingOrders.reduce((s, o) => s + (o.donation_amount_cents || 0), 0) / 100;
											const ticketsSold = paidOrders.reduce((s, o) => s + (o.entry_count || 0), 0);
											const pendingTickets = pendingOrders.reduce((s, o) => s + (o.entry_count || 0), 0);
											const goalPct = Math.min(100, FUNDRAISER_GOAL > 0 ? Math.round((totalRaised / FUNDRAISER_GOAL) * 100) : 0);
											const methodTotals = paidOrders.reduce((acc, o) => { const m = o.payment_method || 'other'; acc[m] = (acc[m] || 0) + (o.donation_amount_cents || 0) / 100; return acc; }, {});
											const methodEntries = Object.entries(methodTotals).sort((a, b) => b[1] - a[1]);
											const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
											return (
												<div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-5">
													<div className="flex items-center justify-between gap-3 mb-4">
														<div className="flex items-center gap-2">
															<TrendingUp className="h-4 w-4 text-primary" />
															<p className="text-sm font-bold uppercase tracking-widest text-primary">$ Dollar Tracker</p>
															<span className="inline-flex items-center gap-1 rounded-full bg-green-100 border border-green-200 px-2 py-0.5 text-xs font-semibold text-green-700">● Live</span>
														</div>
														<div className="text-right">
															<p className="text-xs text-muted-foreground">{paidOrders.length} paid · {pendingOrders.length} pending</p>
															<p className="text-xs text-muted-foreground/60">Updates after every submission</p>
														</div>
													</div>
													<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
														<div className="rounded-xl bg-background border border-border/50 p-3 text-center"><p className="text-2xl font-black text-green-600">{fmt(totalRaised)}</p><p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wider">Total Raised</p></div>
														<div className="rounded-xl bg-background border border-border/50 p-3 text-center"><p className="text-2xl font-black text-primary">{fmt(ticketRevenue)}</p><p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wider">Ticket Sales</p><p className="text-xs text-primary/70 font-semibold">{ticketsSold} tickets</p></div>
														<div className="rounded-xl bg-background border border-border/50 p-3 text-center"><p className="text-2xl font-black text-amber-600">{fmt(donationRevenue)}</p><p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wider">Direct Donations</p><p className="text-xs text-amber-600/70 font-semibold">No ticket</p></div>
														<div className="rounded-xl bg-background border border-border/50 p-3 text-center"><p className="text-2xl font-black text-muted-foreground">{fmt(pendingDollars)}</p><p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wider">Pending</p><p className="text-xs text-muted-foreground/70 font-semibold">{pendingTickets} tickets</p></div>
													</div>
													{/* Fundraiser Goal Progress bar — hidden until launch
													<div className="mb-4">
														<div className="flex justify-between text-xs text-muted-foreground mb-1"><span className="font-semibold">Fundraiser Goal Progress</span><span>{fmt(totalRaised)} of {fmt(FUNDRAISER_GOAL)} — <strong className="text-foreground">{goalPct}%</strong></span></div>
														<div className="h-3 w-full rounded-full bg-border/40 overflow-hidden"><div className="h-full rounded-full gradient-burgundy transition-all duration-700" style={{ width: `${goalPct}%` }} /></div>
													</div>
													*/}
													{methodEntries.length > 0 && (
														<div>
															<p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">By Payment Method (paid)</p>
															<div className="flex flex-wrap gap-2">{methodEntries.map(([method, amount]) => (<span key={method} className="inline-flex items-center gap-1.5 rounded-lg bg-background border border-border/50 px-3 py-1.5 text-xs font-semibold capitalize"><span className="text-primary">{method}</span><span className="text-muted-foreground">{fmt(amount)}</span></span>))}</div>
														</div>
													)}
												</div>
											);
										})()}

										<div className="grid grid-cols-3 gap-3 mb-6">
											{[
												{ label: 'Total Orders', value: orders.length },
												{ label: 'Pending', value: orders.filter((order) => order.payment_status === 'pending').length },
												{ label: 'Confirmed', value: orders.filter((order) => order.payment_status === 'paid').length },
											].map((stat) => (
												<div key={stat.label} className="rounded-xl bg-muted/50 border border-border/50 p-3 text-center">
													<p className="text-xl font-bold">{stat.value}</p>
													<p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{stat.label}</p>
												</div>
											))}
										</div>

										<div className="flex flex-wrap gap-2 mb-6">
											{['all', 'pending', 'paid'].map((filter) => (
												<button
													key={filter}
													type="button"
													onClick={() => setOrdersFilter(filter)}
													className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-colors duration-200 ${
														ordersFilter === filter
															? 'gradient-burgundy text-white'
															: 'bg-muted text-muted-foreground hover:bg-muted/80'
													}`}
												>
													{filter === 'all' ? `All (${orders.length})` : filter === 'pending' ? `Pending (${orders.filter((order) => order.payment_status === 'pending').length})` : `Paid (${orders.filter((order) => order.payment_status === 'paid').length})`}
												</button>
											))}
										</div>

										{ordersLoading ? (
											<p className="py-8 text-center text-sm text-muted-foreground">Loading orders...</p>
										) : (
											<div className="space-y-3">
												{filteredOrders.map((order) => (
													<OrderAccordion
														key={order.id}
														order={order}
														onApprove={handleApproveOrder}
														onEmail={handleEmailConfirmation}
														onDelete={handleDeleteOrder}
														approvingOrderId={approvingOrderId}
														emailingOrderId={emailingOrderId}
													/>
												))}
												{filteredOrders.length === 0 && (
													<p className="py-8 text-center text-sm text-muted-foreground">No matching orders found.</p>
												)}
											</div>
										)}
									</div>
									</div>
								)}								{activeTab === 'communications' && (
									<div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
											<div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
												<div className="flex items-center gap-3 mb-4">
													<Mail className="h-5 w-5 text-primary" />
													<div>
														<h2 className="text-2xl font-bold">Send family email</h2>
														<p className="text-sm text-muted-foreground mt-0.5">Use Resend for announcements, donation reminders, reunion updates, and family communications.</p>
													</div>
												</div>
												<form onSubmit={handleCommunicationSubmit} className="space-y-4">
													<textarea
														name="recipients"
														value={communicationForm.recipients}
														onChange={handleCommunicationChange}
														rows={4}
														placeholder="Recipient emails, separated by commas or new lines"
														className="w-full rounded-2xl border border-border/60 bg-background px-4 py-3"
														required
													/>
													<div className="grid gap-4 md:grid-cols-2">
														<input
															type="text"
															name="audienceLabel"
															value={communicationForm.audienceLabel}
															onChange={handleCommunicationChange}
															placeholder="Audience label"
															className="w-full"
														/>
														<input
															type="text"
															name="replyTo"
															value={communicationForm.replyTo}
															onChange={handleCommunicationChange}
															placeholder="Reply-to email"
															className="w-full"
														/>
													</div>
													<input
														type="text"
														name="subject"
														value={communicationForm.subject}
														onChange={handleCommunicationChange}
														placeholder="Email subject"
														className="w-full"
														required
													/>
													<div className="grid gap-4 md:grid-cols-2">
														<input
															type="text"
															name="previewText"
															value={communicationForm.previewText}
															onChange={handleCommunicationChange}
															placeholder="Preview text"
															className="w-full"
														/>
														<input
															type="text"
															name="heading"
															value={communicationForm.heading}
															onChange={handleCommunicationChange}
															placeholder="Email heading"
															className="w-full"
														/>
													</div>
													<textarea
														name="message"
														value={communicationForm.message}
														onChange={handleCommunicationChange}
														rows={10}
														placeholder="Write the family message here. Separate paragraphs with a blank line."
														className="w-full rounded-2xl border border-border/60 bg-background px-4 py-3"
														required
													/>
													<div className="grid gap-4 md:grid-cols-2">
														<input
															type="text"
															name="ctaLabel"
															value={communicationForm.ctaLabel}
															onChange={handleCommunicationChange}
															placeholder="Button label"
															className="w-full"
														/>
														<input
															type="url"
															name="ctaUrl"
															value={communicationForm.ctaUrl}
															onChange={handleCommunicationChange}
															placeholder="Button URL"
															className="w-full"
														/>
													</div>
													<input
														type="text"
														name="signature"
														value={communicationForm.signature}
														onChange={handleCommunicationChange}
														placeholder="Signature"
														className="w-full"
													/>
													<button
														type="submit"
														disabled={savingCommunication}
														className="inline-flex items-center gap-2 rounded-2xl gradient-burgundy px-5 py-3 font-semibold text-white disabled:opacity-70"
													>
														<Mail className="h-4 w-4" />
														{savingCommunication ? 'Sending...' : 'Send family email'}
													</button>
												</form>
											</div>

											<div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
												<h2 className="text-2xl font-bold mb-4">What this sends</h2>
												<div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
													<p>The email is sent from your configured `RESEND_EMAIL` address and uses the same family styling as payment confirmations.</p>
													<p>Use this for reunion updates, thank-you notes, donation reminders, memorial messages, or general family announcements.</p>
													<p>The order approval flow now sends a thank-you email automatically as soon as payment is marked paid.</p>
												</div>
											</div>
										</div>
									)}

									{activeTab === 'events' && (
										<div className="space-y-8">
											{canManage && (
												<div className="grid xl:grid-cols-2 gap-8">
													<div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
														<div className="flex items-center justify-between gap-4 mb-4">
															<div className="flex items-center gap-3">
																<CalendarDays className="h-5 w-5 text-primary" />
																<h2 className="text-2xl font-bold">Update events</h2>
															</div>
															<button type="button" onClick={() => setEventForm(initialEventForm)} className="text-sm font-semibold text-primary">
																New event
															</button>
														</div>
														<form onSubmit={handleEventSubmit} className="space-y-4">
															<input type="text" name="title" placeholder="Event title" value={eventForm.title} onChange={handleEventChange} required className="w-full" />
															<div className="grid sm:grid-cols-2 gap-4">
																<input type="text" name="event_type" placeholder="Event type" value={eventForm.event_type} onChange={handleEventChange} required className="w-full" />
																<select name="status" value={eventForm.status} onChange={handleEventChange} className="w-full">
																	<option value="planned">Planned</option>
																	<option value="open">Open</option>
																	<option value="closed">Closed</option>
																	<option value="complete">Complete</option>
																	<option value="cancelled">Cancelled</option>
																</select>
															</div>
															<textarea name="description" placeholder="Event details" value={eventForm.description} onChange={handleEventChange} rows={4} className="w-full" />
															<input type="text" name="location" placeholder="Location" value={eventForm.location} onChange={handleEventChange} className="w-full" />
															<div className="grid sm:grid-cols-2 gap-4">
																<input type="datetime-local" name="starts_at" value={eventForm.starts_at} onChange={handleEventChange} className="w-full" />
																<input type="datetime-local" name="ends_at" value={eventForm.ends_at} onChange={handleEventChange} className="w-full" />
															</div>
															<div className="grid sm:grid-cols-2 gap-4">
																<input type="datetime-local" name="intake_deadline" value={eventForm.intake_deadline} onChange={handleEventChange} className="w-full" />
																<input type="number" min="1" name="capacity" placeholder="Capacity" value={eventForm.capacity} onChange={handleEventChange} className="w-full" />
															</div>
															<input type="url" name="google_calendar_event_url" placeholder="Google Calendar event link" value={eventForm.google_calendar_event_url} onChange={handleEventChange} className="w-full" />
															<button
																type="submit"
																disabled={savingEvent}
																className="gradient-gold text-foreground px-6 py-3 rounded-xl font-semibold hover:shadow-gold transition-all duration-200 disabled:opacity-70"
															>
																{savingEvent ? 'Saving...' : eventForm.id ? 'Update event' : 'Add event'}
															</button>
														</form>
													</div>

													<div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
														<div className="flex items-center gap-3 mb-6">
															<CalendarDays className="h-5 w-5 text-primary" />
															<h2 className="text-2xl font-bold">Current events</h2>
														</div>
														<div className="divide-y divide-border/50">
															{dashboard.events.map((item) => (
																<div key={item.id} className="py-4 first:pt-0 last:pb-0">
																	<div className="flex items-start justify-between gap-4">
																		<div>
																			<p className="font-semibold">{item.title}</p>
																			<p className="text-sm text-muted-foreground">{formatDateTime(item.starts_at)}</p>
																			<p className="text-sm text-muted-foreground">{item.location || 'Location TBD'}</p>
																		</div>
																		<div className="flex gap-2">
																			<button type="button" onClick={() => handleEventEdit(item)} className="text-sm font-semibold text-primary">
																			Edit
																			</button>
																			<button type="button" onClick={() => handleDeleteEvent(item.id)} className="text-sm font-semibold text-rose-600">
																			Delete
																			</button>
																		</div>
																	</div>
																</div>
															))}
														</div>
													</div>
												</div>
											)}

											<div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
												<div className="flex items-center gap-3 mb-6">
													<Users className="h-5 w-5 text-primary" />
													<h2 className="text-2xl font-bold">Family event signups</h2>
												</div>
												<div className="space-y-3">
													{dashboard.eventSignups.map((signup) => (
														<div key={signup.id} className="rounded-2xl border border-border/50 px-4 py-3">
															<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
																<div>
																	<p className="font-semibold">{signup.attendee_name}</p>
																	<p className="text-sm text-muted-foreground">{signup.email}</p>
																	<p className="text-sm text-muted-foreground">{signup.events?.title || 'Event not found'}</p>
																</div>
																<span className="inline-flex rounded-full bg-secondary/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
																	{signup.status}
																</span>
															</div>
															<p className="text-xs text-muted-foreground mt-2">Party size: {signup.party_size} • {formatDateTime(signup.events?.starts_at || signup.created_at)}</p>
														</div>
													))}
												</div>
											</div>
										</div>
									)}

									{activeTab === 'newsletter' && (
										<div className="space-y-8">
											{canManage && (
												<div className="grid xl:grid-cols-2 gap-8">
													<div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
														<div className="flex items-center gap-3 mb-4">
															<Download className="h-5 w-5 text-primary" />
															<h2 className="text-2xl font-bold">Upload newsletter</h2>
														</div>
														<p className="text-muted-foreground mb-6">
															Add a newsletter file, give it a name and issue date, and it will appear on the public newsletter archive page.
														</p>
														<form onSubmit={handleNewsletterSubmit} className="space-y-4">
															<input
																type="text"
																name="title"
																placeholder="Newsletter title"
																value={newsletterForm.title}
																onChange={handleNewsletterChange}
																required
																className="w-full"
															/>
															<input
																type="date"
																name="issue_date"
																value={newsletterForm.issue_date}
																onChange={handleNewsletterChange}
																required
																className="w-full"
															/>
															<textarea
																name="description"
																placeholder="Short description or headline summary"
																value={newsletterForm.description}
																onChange={handleNewsletterChange}
																rows={4}
																className="w-full"
															/>
															<input
																key={newsletterUploadKey}
																type="file"
																name="file"
																accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
																onChange={handleNewsletterChange}
																required
																className="w-full"
															/>
															<p className="text-xs text-muted-foreground">
																PDF is the cleanest option for public download, but Word docs and image files are also accepted.
															</p>
															<button
																type="submit"
																disabled={savingNewsletter}
																className="gradient-burgundy text-white px-6 py-3 rounded-xl font-semibold hover:shadow-burgundy transition-all duration-200 disabled:opacity-70"
															>
																{savingNewsletter ? 'Uploading...' : 'Upload newsletter'}
															</button>
														</form>
													</div>

													<div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
														<div className="flex items-center gap-3 mb-4">
															<Mail className="h-5 w-5 text-primary" />
															<h2 className="text-2xl font-bold">How it shows publicly</h2>
														</div>
														<div className="space-y-4 text-muted-foreground">
															<p>The newest issue becomes the featured download on the public newsletter page.</p>
															<p>Older uploads stay listed as archives so family members can return and download past issues at any time.</p>
															<p>If upload fails because storage is not configured yet, run <code>supabase/add_newsletter_documents.sql</code> in Supabase and try again.</p>
														</div>
													</div>
												</div>
											)}

											<div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
												<div className="flex items-center gap-3 mb-6">
													<Download className="h-5 w-5 text-primary" />
													<h2 className="text-2xl font-bold">Published newsletter archive</h2>
												</div>

												{newsletterLoading ? (
													<p className="py-8 text-center text-sm text-muted-foreground">Loading newsletter files...</p>
												) : newsletterDocuments.length === 0 ? (
													<p className="py-8 text-center text-sm text-muted-foreground">
														No newsletter files uploaded yet.
													</p>
												) : (
													<div className="space-y-3">
														{newsletterDocuments.map((document, index) => (
															<div key={document.id} className="rounded-2xl border border-border/50 px-4 py-4">
																<div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
																	<div className="min-w-0">
																		<div className="flex flex-wrap items-center gap-2 mb-2">
																			<p className="font-semibold">{document.title}</p>
																			{index === 0 && (
																				<span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
																					Latest
																				</span>
																			)}
																		</div>
																		<p className="text-sm text-muted-foreground">
																			{formatIssueDate(document.issue_date)} • {document.file_name} • {formatFileSize(document.file_size_bytes)}
																		</p>
																		{document.description && (
																			<p className="text-sm text-muted-foreground mt-2">{document.description}</p>
																		)}
																	</div>
																	<div className="flex items-center gap-3">
																		<a
																			href={document.file_url}
																			download
																			className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
																		>
																			<Download className="h-4 w-4" />
																			Download
																		</a>
																		<button type="button" onClick={() => handleDeleteNewsletter(document.id)} className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-700">
																			Delete
																		</button>
																	</div>
																</div>
															</div>
														))}
													</div>
												)}
											</div>
										</div>
									)}

									{activeTab === 'business' && (
										<div className="space-y-8">
											{canManage && (
												<div className="grid xl:grid-cols-2 gap-8">
													<div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
														<div className="flex items-center justify-between gap-4 mb-4">
															<div className="flex items-center gap-3">
																<Store className="h-5 w-5 text-primary" />
																<h2 className="text-2xl font-bold">Update business listings</h2>
															</div>
															<button type="button" onClick={() => setBusinessForm(initialBusinessForm)} className="text-sm font-semibold text-primary">
																New listing
															</button>
														</div>
														<form onSubmit={handleBusinessSubmit} className="space-y-4">
															<input type="text" name="title" placeholder="Business name" value={businessForm.title} onChange={handleBusinessChange} required className="w-full" />
															<div className="grid sm:grid-cols-2 gap-4">
																<input type="text" name="category" placeholder="Category" value={businessForm.category} onChange={handleBusinessChange} required className="w-full" />
																<input type="text" name="price_label" placeholder="City, state or service area" value={businessForm.price_label} onChange={handleBusinessChange} className="w-full" />
															</div>
															<textarea name="description" placeholder="What does this business do?" value={businessForm.description} onChange={handleBusinessChange} rows={5} required className="w-full" />
															<div className="grid sm:grid-cols-[160px_1fr] gap-4 items-center">
																<input type="number" name="sort_order" placeholder="Sort order" value={businessForm.sort_order} onChange={handleBusinessChange} className="w-full" />
																<label className="inline-flex items-center gap-3 text-sm font-medium">
																	<input type="checkbox" name="is_featured" checked={businessForm.is_featured} onChange={handleBusinessChange} />
																	Feature this listing near the top
																</label>
															</div>
															<button
																type="submit"
																disabled={savingBusiness}
																className="gradient-burgundy text-white px-6 py-3 rounded-xl font-semibold hover:shadow-burgundy transition-all duration-200 disabled:opacity-70"
															>
																{savingBusiness ? 'Saving...' : businessForm.id ? 'Update listing' : 'Add listing'}
															</button>
														</form>
													</div>

													<div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
														<div className="flex items-center gap-3 mb-6">
															<Store className="h-5 w-5 text-primary" />
															<h2 className="text-2xl font-bold">Current business directory</h2>
														</div>
														<div className="divide-y divide-border/50">
															{dashboard.businesses.map((item) => (
																<div key={item.id} className="py-4 first:pt-0 last:pb-0">
																	<div className="flex items-start justify-between gap-4">
																		<div>
																			<p className="font-semibold">{item.title}</p>
																			<p className="text-sm text-muted-foreground">{item.category}</p>
																			<p className="text-sm text-muted-foreground">{item.price_label || 'No location added'}</p>
																		</div>
																		<button type="button" onClick={() => handleBusinessEdit(item)} className="text-sm font-semibold text-primary">
																			Edit
																		</button>
																	</div>
																</div>
															))}
														</div>
													</div>
												</div>
											)}

											<div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
												<div className="flex items-center gap-3 mb-6">
													<Store className="h-5 w-5 text-primary" />
													<h2 className="text-2xl font-bold">Directory submissions</h2>
												</div>
												<div className="space-y-3">
													{dashboard.serviceRequests.map((request) => (
														<div key={request.id} className="rounded-2xl border border-border/50 px-4 py-3">
															<div className="flex items-start justify-between gap-3 mb-2">
																<p className="font-semibold">{request.requester_name}</p>
																<span className="inline-flex rounded-full bg-secondary/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
																	{request.status}
																</span>
															</div>
															<p className="text-sm text-muted-foreground">{request.email}</p>
															<p className="text-sm text-muted-foreground mt-1">{request.message}</p>
															<p className="text-xs text-muted-foreground mt-2">{request.budget_label || 'No budget or location added'}</p>
														</div>
													))}
												</div>
											</div>
										</div>
									)}

									{activeTab === 'access' && (
										<div className="space-y-8">
											<div className="grid xl:grid-cols-2 gap-8">
												<div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
													<div className="flex items-center gap-3 mb-4">
														<Users className="h-5 w-5 text-primary" />
														<h2 className="text-2xl font-bold">Current admins</h2>
													</div>
													<p className="text-muted-foreground mb-6">These family members have admin access to the dashboard.</p>
													<div className="space-y-3">
														{(dashboard.admins || []).map((admin) => (
															<div key={admin.id} className="rounded-2xl border border-border/50 p-4">
																<div className="flex items-start justify-between gap-3">
																	<div>
																		<p className="font-semibold">{admin.email || admin.user_id}</p>
																		<p className="text-sm text-muted-foreground">Added {formatDateTime(admin.created_at)}</p>
																	</div>
																	<span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
																		{admin.role}
																	</span>
																</div>
															</div>
														))}
													</div>
												</div>

												<div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
													<div className="flex items-center gap-3 mb-4">
														<Users className="h-5 w-5 text-primary" />
														<h2 className="text-2xl font-bold">Invite new admin</h2>
													</div>
													<p className="text-muted-foreground mb-6">Save an email here so the person can create an account and claim access.</p>
													{canInviteAdmins ? (
														<form onSubmit={handleInviteSubmit} className="space-y-4">
															<input type="email" name="email" placeholder="Admin email" value={inviteForm.email} onChange={handleInviteChange} required className="w-full" />
															<select name="role" value={inviteForm.role} onChange={handleInviteChange} className="w-full">
																<option value="admin">Admin</option>
																<option value="events">Events</option>
																<option value="finance">Finance</option>
																<option value="owner">Owner</option>
															</select>
															<button
																type="submit"
																disabled={savingInvite}
																className="gradient-gold text-foreground px-6 py-3 rounded-xl font-semibold hover:shadow-gold transition-all duration-200 disabled:opacity-70"
															>
																{savingInvite ? 'Saving invite...' : 'Save admin invite'}
															</button>
														</form>
													) : (
														<p className="text-sm text-muted-foreground">Only owners and full admins can invite other admins.</p>
													)}

													<div className="mt-6 space-y-3">
														{(dashboard.adminInvites || []).map((invite) => (
															<div key={invite.id} className="rounded-2xl border border-border/50 p-4">
																<div className="flex items-start justify-between gap-3">
																	<div>
																		<p className="font-semibold">{invite.email}</p>
																		<p className="text-sm text-muted-foreground">Saved {formatDateTime(invite.created_at)}</p>
																	</div>
																	<div className="text-right">
																		<p className="text-xs font-semibold uppercase tracking-wide text-primary">{invite.role}</p>
																		<p className="text-xs text-muted-foreground">{invite.status}</p>
																	</div>
																</div>
															</div>
														))}
													</div>
												</div>
											</div>

											{canManage && (
												<form onSubmit={handleSettingsSubmit} className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
													<div className="flex items-center gap-3 mb-4">
														<Database className="h-5 w-5 text-primary" />
														<h2 className="text-2xl font-bold">Family settings</h2>
													</div>
													<p className="text-muted-foreground mb-6">Update the main family contact details, payment links, and calendar links shown on the site.</p>
													<div className="grid lg:grid-cols-2 gap-4">
														<input type="text" name="display_name" placeholder="Family name shown on site" value={settingsForm.display_name} onChange={handleSettingsChange} className="w-full" />
														<input type="text" name="primary_cta_label" placeholder="Main button label" value={settingsForm.primary_cta_label} onChange={handleSettingsChange} className="w-full" />
														<input type="email" name="support_email" placeholder="Family contact email" value={settingsForm.support_email} onChange={handleSettingsChange} className="w-full" />
														<input type="tel" name="support_phone" placeholder="Family contact phone" value={settingsForm.support_phone} onChange={handleSettingsChange} className="w-full" />
														<input type="text" name="cash_app_handle" placeholder="Cash App handle" value={settingsForm.cash_app_handle} onChange={handleSettingsChange} className="w-full" />
														<input type="text" name="venmo_handle" placeholder="Venmo handle" value={settingsForm.venmo_handle} onChange={handleSettingsChange} className="w-full" />
														<input type="url" name="paypal_donate_url" placeholder="PayPal donation link" value={settingsForm.paypal_donate_url} onChange={handleSettingsChange} className="w-full lg:col-span-2" />
														<input type="url" name="google_calendar_public_url" placeholder="Google Calendar public link" value={settingsForm.google_calendar_public_url} onChange={handleSettingsChange} className="w-full lg:col-span-2" />
														<input type="url" name="google_calendar_embed_url" placeholder="Google Calendar embed link" value={settingsForm.google_calendar_embed_url} onChange={handleSettingsChange} className="w-full lg:col-span-2" />
														<input type="text" name="business_tagline" placeholder="Business Corner headline" value={settingsForm.business_tagline} onChange={handleSettingsChange} className="w-full lg:col-span-2" />
														<textarea name="business_summary" placeholder="Business Corner summary" value={settingsForm.business_summary} onChange={handleSettingsChange} rows={4} className="w-full lg:col-span-2" />
													</div>
													<div className="mt-5">
														<button
															type="submit"
															disabled={savingSettings}
															className="gradient-burgundy text-white px-6 py-3 rounded-xl font-semibold hover:shadow-burgundy transition-all duration-200 disabled:opacity-70"
														>
															{savingSettings ? 'Saving...' : 'Save family settings'}
														</button>
													</div>
												</form>
											)}
										</div>
									)}
								</>
							)}
						</>
					)}
				</div>
			</section>
		</>
	);
};

export default AdminPage;
