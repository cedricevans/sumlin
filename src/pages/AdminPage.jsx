import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
	CalendarDays,
	Database,
	LogOut,
	RefreshCcw,
	ShieldCheck,
	Store,
	Ticket,
	Users,
	Wallet,
} from 'lucide-react';
import {
	fetchAdminDashboard,
	formatDateTime,
	formatMoney,
	getAdminSession,
	saveAdminInvite,
	saveBusinessListing,
	saveEvent,
	saveTenantProfile,
	signInAdmin,
	signOutAdmin,
	signUpAdmin,
	watchAdminSession,
} from '@/lib/sumlinData';
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

function toDateTimeInput(value) {
	if (!value) {
		return '';
	}

	const date = new Date(value);
	const offset = date.getTimezoneOffset();
	return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
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

const AdminPage = () => {
	const { toast } = useToast();
	const [session, setSession] = useState(null);
	const [dashboard, setDashboard] = useState(null);
	const [loading, setLoading] = useState(true);
	const [signingIn, setSigningIn] = useState(false);
	const [signingUp, setSigningUp] = useState(false);
	const [savingBusiness, setSavingBusiness] = useState(false);
	const [savingEvent, setSavingEvent] = useState(false);
	const [savingSettings, setSavingSettings] = useState(false);
	const [savingInvite, setSavingInvite] = useState(false);
	const [credentials, setCredentials] = useState({
		email: '',
		password: '',
	});
	const [businessForm, setBusinessForm] = useState(initialBusinessForm);
	const [eventForm, setEventForm] = useState(initialEventForm);
	const [settingsForm, setSettingsForm] = useState(initialSettingsForm);
	const [inviteForm, setInviteForm] = useState(initialInviteForm);

	const showDashboard = Boolean(session);
	const showDisconnectedState = !hasSupabaseConfig;
	const canManage = Boolean(session) && dashboard?.mode === 'live';
	const canInviteAdmins = ['owner', 'admin'].includes(dashboard?.currentAdminRole || '');

	const loadDashboard = async () => {
		setLoading(true);
		const nextDashboard = await fetchAdminDashboard();
		setDashboard(nextDashboard);
		setLoading(false);
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
		}
	}, [dashboard?.tenant]);

	const handleCredentialChange = (event) => {
		const { name, value } = event.target;
		setCredentials((current) => ({
			...current,
			[name]: value,
		}));
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
		setEventForm((current) => ({
			...current,
			[name]: value,
		}));
	};

	const handleSettingsChange = (event) => {
		const { name, value } = event.target;
		setSettingsForm((current) => ({
			...current,
			[name]: value,
		}));
	};

	const handleInviteChange = (event) => {
		const { name, value } = event.target;
		setInviteForm((current) => ({
			...current,
			[name]: value,
		}));
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
					? 'Your admin invite was claimed and the command central is loading.'
					: 'Loading the family admin panel.',
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
		toast({
			title: 'Signed out',
			description: 'The admin session has been closed.',
		});
	};

	const handleRefresh = async () => {
		await loadDashboard();
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
	};

	return (
		<>
			<Helmet>
				<title>Admin Dashboard | Sumlin Family</title>
				<meta
					name="description"
					content="Manage the Sumlin family business directory, family calendar links, events, signups, and reunion support records."
				/>
			</Helmet>

			<section className="section-spacing bg-background pt-24 md:pt-32">
				<div className="container-custom">
					<div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
						<div>
							<div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-5">
								<ShieldCheck className="h-4 w-4" />
								Family admin panel
							</div>
							<h1 className="text-5xl md:text-6xl font-bold mb-4">Manage businesses, events, and family signups</h1>
							<p className="text-lg text-muted-foreground max-w-3xl">
								Use one place to update the Business Corner, keep the event calendar current, and review the
								family members who sign up for gatherings, calls, and reunion activities.
							</p>
						</div>

						<div className="flex flex-wrap gap-3">
							{showDashboard && (
								<button
									type="button"
									onClick={handleRefresh}
									className="inline-flex items-center justify-center gap-2 bg-card border border-border/60 px-5 py-3 rounded-xl font-semibold hover:bg-muted transition-colors duration-200"
								>
									<RefreshCcw className="h-4 w-4" />
									Refresh
								</button>
							)}
							{session && (
								<button
									type="button"
									onClick={handleSignOut}
									className="inline-flex items-center justify-center gap-2 bg-card border border-border/60 px-5 py-3 rounded-xl font-semibold hover:bg-muted transition-colors duration-200"
								>
									<LogOut className="h-4 w-4" />
									Sign out
								</button>
							)}
						</div>
					</div>

					{!session && hasSupabaseConfig && (
						<div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 mb-10">
							<form onSubmit={handleSignIn} className="bg-card border border-border/50 rounded-3xl p-8 shadow-xl">
								<h2 className="text-2xl font-bold mb-3">Admin sign in</h2>
								<p className="text-muted-foreground mb-6">
									Sign in with your admin email to access the family dashboard. If Debi has invited you, create your account first, then sign in to access the admin panel.
								</p>
								<div className="space-y-4">
									<input
										type="email"
										name="email"
										placeholder="Your email address"
										value={credentials.email}
										onChange={handleCredentialChange}
										required
										className="w-full"
									/>
									<input
										type="password"
										name="password"
										placeholder="Your password"
										value={credentials.password}
										onChange={handleCredentialChange}
										required
										className="w-full"
									/>
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
									<p><strong>First time here?</strong> If Debi has invited you as an admin, click "Create new account" to set up your password, then sign in.</p>
									<p><strong>Already have an account?</strong> Just sign in with your email and password to access the family admin dashboard.</p>
									<p><strong>Need help?</strong> Contact Debi if you need admin access or have questions about managing family events and businesses.</p>
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
											<h2 className="text-xl font-semibold mb-2 text-rose-950">Database setup needed</h2>
											<p className="text-muted-foreground mb-3">The family database tables are being set up. Sample data is shown below until the connection is complete.</p>
											<p className="text-sm text-muted-foreground italic">Contact your site administrator to complete the database setup using the schema.sql file.</p>
										</div>
									)}

									<div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
										{dashboard.kpis.map((kpi) => (
											<div key={kpi.label} className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
												<p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-3">
													{kpi.label}
												</p>
												<p className="text-4xl font-bold mb-3">{kpi.value}</p>
												<p className="text-sm text-muted-foreground leading-relaxed">{kpi.detail}</p>
											</div>
										))}
									</div>

									{canManage && (
										<div className="space-y-8 mb-10">
											<div className="grid xl:grid-cols-2 gap-8">
												<div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
													<div className="flex items-center gap-3 mb-4">
														<Users className="h-5 w-5 text-primary" />
														<h2 className="text-2xl font-bold">Current admins</h2>
													</div>
													<p className="text-muted-foreground mb-6">
														These family members have admin access to manage events, businesses, and family signups. Debi can invite additional admins using the form on the right.
													</p>
													<div className="space-y-4">
														{(dashboard.admins || []).map((admin) => (
															<div key={admin.id} className="rounded-2xl border border-border/50 p-4">
																<div className="flex items-start justify-between gap-3">
																	<div>
																		<p className="font-semibold">{admin.email || admin.user_id}</p>
																		<p className="text-sm text-muted-foreground">
																			Added {formatDateTime(admin.created_at)}
																		</p>
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
													<p className="text-muted-foreground mb-6">
														Enter an email address to invite someone as an admin. They'll create an account and automatically get admin access when they sign in.
													</p>
													{canInviteAdmins ? (
														<form onSubmit={handleInviteSubmit} className="space-y-4">
															<input
																type="email"
																name="email"
																placeholder="Admin email"
																value={inviteForm.email}
																onChange={handleInviteChange}
																required
																className="w-full"
															/>
															<select
																name="role"
																value={inviteForm.role}
																onChange={handleInviteChange}
																className="w-full"
															>
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
														<p className="text-sm text-muted-foreground">
															Only owners and full admins can invite other admins.
														</p>
													)}

													<div className="mt-6 space-y-3">
														{(dashboard.adminInvites || []).map((invite) => (
															<div key={invite.id} className="rounded-2xl border border-border/50 p-4">
																<div className="flex items-start justify-between gap-3">
																	<div>
																		<p className="font-semibold">{invite.email}</p>
																		<p className="text-sm text-muted-foreground">
																			Saved {formatDateTime(invite.created_at)}
																		</p>
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

											<form onSubmit={handleSettingsSubmit} className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
												<div className="flex items-center gap-3 mb-4">
													<Database className="h-5 w-5 text-primary" />
													<h2 className="text-2xl font-bold">Family settings</h2>
												</div>
												<p className="text-muted-foreground mb-6">
													Update the main family contact details, payment links, and Google Calendar links that show on the site.
												</p>
												<div className="grid lg:grid-cols-2 gap-4">
													<input
														type="text"
														name="display_name"
														placeholder="Family name shown on site"
														value={settingsForm.display_name}
														onChange={handleSettingsChange}
														className="w-full"
													/>
													<input
														type="text"
														name="primary_cta_label"
														placeholder="Main button label"
														value={settingsForm.primary_cta_label}
														onChange={handleSettingsChange}
														className="w-full"
													/>
													<input
														type="email"
														name="support_email"
														placeholder="Family contact email"
														value={settingsForm.support_email}
														onChange={handleSettingsChange}
														className="w-full"
													/>
													<input
														type="tel"
														name="support_phone"
														placeholder="Family contact phone"
														value={settingsForm.support_phone}
														onChange={handleSettingsChange}
														className="w-full"
													/>
													<input
														type="text"
														name="cash_app_handle"
														placeholder="Cash App handle"
														value={settingsForm.cash_app_handle}
														onChange={handleSettingsChange}
														className="w-full"
													/>
													<input
														type="text"
														name="venmo_handle"
														placeholder="Venmo handle"
														value={settingsForm.venmo_handle}
														onChange={handleSettingsChange}
														className="w-full"
													/>
													<input
														type="url"
														name="paypal_donate_url"
														placeholder="PayPal donation link"
														value={settingsForm.paypal_donate_url}
														onChange={handleSettingsChange}
														className="w-full lg:col-span-2"
													/>
													<input
														type="url"
														name="google_calendar_public_url"
														placeholder="Google Calendar public link"
														value={settingsForm.google_calendar_public_url}
														onChange={handleSettingsChange}
														className="w-full lg:col-span-2"
													/>
													<input
														type="url"
														name="google_calendar_embed_url"
														placeholder="Google Calendar embed link"
														value={settingsForm.google_calendar_embed_url}
														onChange={handleSettingsChange}
														className="w-full lg:col-span-2"
													/>
													<input
														type="text"
														name="business_tagline"
														placeholder="Business Corner headline"
														value={settingsForm.business_tagline}
														onChange={handleSettingsChange}
														className="w-full lg:col-span-2"
													/>
													<textarea
														name="business_summary"
														placeholder="Business Corner summary"
														value={settingsForm.business_summary}
														onChange={handleSettingsChange}
														rows={4}
														className="w-full lg:col-span-2"
													/>
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

											<div className="grid xl:grid-cols-2 gap-8">
												<div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
													<div className="flex items-center justify-between gap-4 mb-4">
														<div className="flex items-center gap-3">
															<Store className="h-5 w-5 text-primary" />
															<h2 className="text-2xl font-bold">Update business listings</h2>
														</div>
														<button
															type="button"
															onClick={() => setBusinessForm(initialBusinessForm)}
															className="text-sm font-semibold text-primary"
														>
															New listing
														</button>
													</div>
													<form onSubmit={handleBusinessSubmit} className="space-y-4">
														<input
															type="text"
															name="title"
															placeholder="Business name"
															value={businessForm.title}
															onChange={handleBusinessChange}
															required
															className="w-full"
														/>
														<div className="grid sm:grid-cols-2 gap-4">
															<input
																type="text"
																name="category"
																placeholder="Category"
																value={businessForm.category}
																onChange={handleBusinessChange}
																required
																className="w-full"
															/>
															<input
																type="text"
																name="price_label"
																placeholder="City, state or service area"
																value={businessForm.price_label}
																onChange={handleBusinessChange}
																className="w-full"
															/>
														</div>
														<textarea
															name="description"
															placeholder="What does this business do?"
															value={businessForm.description}
															onChange={handleBusinessChange}
															rows={5}
															required
															className="w-full"
														/>
														<div className="grid sm:grid-cols-[160px_1fr] gap-4 items-center">
															<input
																type="number"
																name="sort_order"
																placeholder="Sort order"
																value={businessForm.sort_order}
																onChange={handleBusinessChange}
																className="w-full"
															/>
															<label className="inline-flex items-center gap-3 text-sm font-medium">
																<input
																	type="checkbox"
																	name="is_featured"
																	checked={businessForm.is_featured}
																	onChange={handleBusinessChange}
																/>
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
																	<button
																		type="button"
																		onClick={() => handleBusinessEdit(item)}
																		className="text-sm font-semibold text-primary"
																	>
																		Edit
																	</button>
																</div>
															</div>
														))}
													</div>
												</div>
											</div>

											<div className="grid xl:grid-cols-2 gap-8">
												<div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
													<div className="flex items-center justify-between gap-4 mb-4">
														<div className="flex items-center gap-3">
															<CalendarDays className="h-5 w-5 text-primary" />
															<h2 className="text-2xl font-bold">Update events</h2>
														</div>
														<button
															type="button"
															onClick={() => setEventForm(initialEventForm)}
															className="text-sm font-semibold text-primary"
														>
															New event
														</button>
													</div>
													<form onSubmit={handleEventSubmit} className="space-y-4">
														<input
															type="text"
															name="title"
															placeholder="Event title"
															value={eventForm.title}
															onChange={handleEventChange}
															required
															className="w-full"
														/>
														<div className="grid sm:grid-cols-2 gap-4">
															<input
																type="text"
																name="event_type"
																placeholder="Event type"
																value={eventForm.event_type}
																onChange={handleEventChange}
																required
																className="w-full"
															/>
															<select
																name="status"
																value={eventForm.status}
																onChange={handleEventChange}
																className="w-full"
															>
																<option value="planned">Planned</option>
																<option value="open">Open</option>
																<option value="closed">Closed</option>
																<option value="complete">Complete</option>
																<option value="cancelled">Cancelled</option>
															</select>
														</div>
														<textarea
															name="description"
															placeholder="Event details"
															value={eventForm.description}
															onChange={handleEventChange}
															rows={4}
															className="w-full"
														/>
														<input
															type="text"
															name="location"
															placeholder="Location"
															value={eventForm.location}
															onChange={handleEventChange}
															className="w-full"
														/>
														<div className="grid sm:grid-cols-2 gap-4">
															<input
																type="datetime-local"
																name="starts_at"
																value={eventForm.starts_at}
																onChange={handleEventChange}
																className="w-full"
															/>
															<input
																type="datetime-local"
																name="ends_at"
																value={eventForm.ends_at}
																onChange={handleEventChange}
																className="w-full"
															/>
														</div>
														<div className="grid sm:grid-cols-2 gap-4">
															<input
																type="datetime-local"
																name="intake_deadline"
																value={eventForm.intake_deadline}
																onChange={handleEventChange}
																className="w-full"
															/>
															<input
																type="number"
																min="1"
																name="capacity"
																placeholder="Capacity"
																value={eventForm.capacity}
																onChange={handleEventChange}
																className="w-full"
															/>
														</div>
														<input
															type="url"
															name="google_calendar_event_url"
															placeholder="Google Calendar event link"
															value={eventForm.google_calendar_event_url}
															onChange={handleEventChange}
															className="w-full"
														/>
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
																	<button
																		type="button"
																		onClick={() => handleEventEdit(item)}
																		className="text-sm font-semibold text-primary"
																	>
																		Edit
																	</button>
																</div>
															</div>
														))}
													</div>
												</div>
											</div>
										</div>
									)}

									<div className="grid xl:grid-cols-[1.1fr_0.9fr] gap-8">
										<div className="space-y-8">
											<div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
												<div className="flex items-center gap-3 mb-6">
													<Users className="h-5 w-5 text-primary" />
													<h2 className="text-2xl font-bold">Family event signups</h2>
												</div>
												<div className="space-y-4">
													{dashboard.eventSignups.map((signup) => (
														<div key={signup.id} className="rounded-2xl border border-border/50 p-5">
															<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
																<div>
																	<p className="font-semibold">{signup.attendee_name}</p>
																	<p className="text-sm text-muted-foreground">{signup.email}</p>
																	<p className="text-sm text-muted-foreground">
																		{signup.events?.title || 'Event not found'}
																	</p>
																</div>
																<span className="inline-flex rounded-full bg-secondary/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
																	{signup.status}
																</span>
															</div>
															<div className="grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
																<p>Party size: {signup.party_size}</p>
																<p>{formatDateTime(signup.events?.starts_at || signup.created_at)}</p>
															</div>
														</div>
													))}
												</div>
											</div>

											<div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
												<div className="flex items-center gap-3 mb-6">
													<Wallet className="h-5 w-5 text-primary" />
													<h2 className="text-2xl font-bold">Recent payments and entry records</h2>
												</div>
												<div className="space-y-4">
													{dashboard.recentOrders.map((order) => (
														<div key={order.id || order.reference_code} className="rounded-2xl border border-border/50 p-5">
															<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
																<div>
																	<p className="font-semibold">{order.reference_code || order.id}</p>
																	<p className="text-sm text-muted-foreground">{order.purchaser_name}</p>
																</div>
																<span className="inline-flex rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
																	{order.payment_status}
																</span>
															</div>
															<div className="grid sm:grid-cols-3 gap-3 text-sm text-muted-foreground">
																<p>Method: {order.payment_method}</p>
																<p>Entries: {order.entry_count}</p>
																<p>Amount: {formatMoney(order.donation_amount_cents)}</p>
															</div>
														</div>
													))}
												</div>
											</div>
										</div>

										<div className="space-y-8">
											<div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
												<div className="flex items-center gap-3 mb-6">
													<Ticket className="h-5 w-5 text-primary" />
													<h2 className="text-2xl font-bold">Latest tickets</h2>
												</div>
												<div className="grid sm:grid-cols-2 gap-4">
													{dashboard.tickets.map((ticket) => (
														<div key={ticket.id} className="rounded-2xl border border-border/50 p-5">
															<p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-2">
																Ticket
															</p>
															<p className="text-2xl font-bold mb-2">#{ticket.ticket_number}</p>
															<p className="text-sm text-muted-foreground mb-1">Order {ticket.order_id}</p>
															<p className="text-sm font-medium">{ticket.status}</p>
														</div>
													))}
												</div>
											</div>

											<div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
												<div className="flex items-center gap-3 mb-6">
													<Store className="h-5 w-5 text-primary" />
													<h2 className="text-2xl font-bold">Directory submissions</h2>
												</div>
												<div className="space-y-4">
													{dashboard.serviceRequests.map((request) => (
														<div key={request.id} className="rounded-2xl border border-border/50 p-5">
															<div className="flex items-start justify-between gap-3 mb-2">
																<p className="font-semibold">{request.requester_name}</p>
																<span className="inline-flex rounded-full bg-secondary/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
																	{request.status}
																</span>
															</div>
															<p className="text-sm text-muted-foreground mb-2">{request.email}</p>
															<p className="text-sm text-muted-foreground mb-2">{request.message}</p>
															<p className="text-sm text-muted-foreground">
																{request.budget_label || 'No location added'}
															</p>
														</div>
													))}
												</div>
											</div>
										</div>
									</div>
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
