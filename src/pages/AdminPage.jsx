import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Database, LogOut, ShieldCheck, Ticket, Wallet } from 'lucide-react';
import { adminOnboardingSteps, fetchAdminDashboard, formatDateTime, formatMoney, getAdminSession, signInAdmin, signOutAdmin, watchAdminSession } from '@/lib/sumlinData';
import { hasSupabaseConfig } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const AdminPage = () => {
	const { toast } = useToast();
	const [session, setSession] = useState(null);
	const [dashboard, setDashboard] = useState(null);
	const [loading, setLoading] = useState(true);
	const [signingIn, setSigningIn] = useState(false);
	const [credentials, setCredentials] = useState({
		email: '',
		password: '',
	});

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

		const loadDashboard = async () => {
			setLoading(true);
			const nextDashboard = await fetchAdminDashboard();
			if (active) {
				setDashboard(nextDashboard);
				setLoading(false);
			}
		};

		if (session || !hasSupabaseConfig) {
			loadDashboard();
			return () => {
				active = false;
			};
		}

		setDashboard(null);
		setLoading(false);

		return () => {
			active = false;
		};
	}, [session]);

	const handleCredentialChange = (event) => {
		const { name, value } = event.target;
		setCredentials((current) => ({
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
				description: 'Loading the Sumlin admin dashboard.',
			});
		}

		setSigningIn(false);
	};

	const handleSignOut = async () => {
		await signOutAdmin();
		setDashboard(null);
		toast({
			title: 'Signed out',
			description: 'The admin session has been closed.',
		});
	};

	const showDashboard = Boolean(session) || !hasSupabaseConfig;

	return (
		<>
			<Helmet>
				<title>Admin Dashboard | Sumlin Family</title>
				<meta
					name="description"
					content="Manage Sumlin family fundraiser entries, service requests, business services, and events."
				/>
			</Helmet>

			<section className="section-spacing bg-background pt-24 md:pt-32">
				<div className="container-custom">
					<div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
						<div>
							<div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-5">
								<ShieldCheck className="h-4 w-4" />
								Sumlin admin workspace
							</div>
							<h1 className="text-5xl md:text-6xl font-bold mb-4">Fundraiser, events, and family business admin</h1>
							<p className="text-lg text-muted-foreground max-w-3xl">
								Use this page to review pending payments, issue tickets, manage service requests, and keep
								the Google Calendar-linked family business system organized under the Sumlin tenant.
							</p>
						</div>

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

					{!session && hasSupabaseConfig && (
						<div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 mb-10">
							<form onSubmit={handleSignIn} className="bg-card border border-border/50 rounded-3xl p-8 shadow-xl">
								<h2 className="text-2xl font-bold mb-3">Admin sign in</h2>
								<p className="text-muted-foreground mb-6">
									Sign in with a Supabase Auth user that has a matching row in tenant_admins.
								</p>
								<div className="space-y-4">
									<input
										type="email"
										name="email"
										placeholder="Admin email"
										value={credentials.email}
										onChange={handleCredentialChange}
										required
										className="w-full"
									/>
									<input
										type="password"
										name="password"
										placeholder="Password"
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
										{signingIn ? 'Signing in...' : 'Sign in'}
									</button>
								</div>
							</form>

							<div className="bg-muted border border-border/50 rounded-3xl p-8">
								<div className="flex items-center gap-3 mb-4">
									<Database className="h-5 w-5 text-primary" />
									<h2 className="text-2xl font-bold">Onboarding checklist</h2>
								</div>
								<ul className="space-y-4 text-muted-foreground leading-relaxed">
									{adminOnboardingSteps.map((step) => (
										<li key={step} className="flex items-start gap-3">
											<span className="mt-2 h-2.5 w-2.5 rounded-full bg-primary flex-shrink-0" />
											<span>{step}</span>
										</li>
									))}
								</ul>
							</div>
						</div>
					)}

					{showDashboard && (
						<>
							{loading && (
								<div className="bg-card border border-border/50 rounded-3xl p-10 text-center text-muted-foreground">
									Loading dashboard data...
								</div>
							)}

							{!loading && dashboard && (
								<>
									{dashboard.error && (
										<div className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6 mb-8">
											<h2 className="text-xl font-semibold mb-2">Backend setup note</h2>
											<p className="text-muted-foreground">{dashboard.error.message}</p>
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

									<div className="grid xl:grid-cols-[1.1fr_0.9fr] gap-8">
										<div className="space-y-8">
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
																<div className="text-sm">
																	<span className="inline-flex rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
																		{order.payment_status}
																	</span>
																</div>
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

											<div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
												<div className="flex items-center gap-3 mb-6">
													<Ticket className="h-5 w-5 text-primary" />
													<h2 className="text-2xl font-bold">Latest issued tickets</h2>
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
										</div>

										<div className="space-y-8">
											<div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
												<h2 className="text-2xl font-bold mb-6">Service requests</h2>
												<div className="space-y-4">
													{dashboard.serviceRequests.map((request) => (
														<div key={request.id} className="rounded-2xl border border-border/50 p-5">
															<div className="flex items-center justify-between gap-3 mb-2">
																<p className="font-semibold">{request.requester_name}</p>
																<span className="inline-flex rounded-full bg-secondary/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
																	{request.status}
																</span>
															</div>
															<p className="text-sm text-muted-foreground mb-2">{request.category}</p>
															<p className="text-sm text-muted-foreground">
																{request.event_date ? formatDateTime(request.event_date) : 'No event date provided'}
															</p>
														</div>
													))}
												</div>
											</div>

											<div className="bg-muted border border-border/50 rounded-3xl p-8">
												<h2 className="text-2xl font-bold mb-6">Upcoming events</h2>
												<div className="space-y-4">
													{(dashboard.events || []).map((eventItem) => (
														<div key={eventItem.id} className="rounded-2xl bg-card border border-border/50 p-5">
															<p className="text-sm font-semibold text-primary mb-2">{eventItem.event_type}</p>
															<p className="font-bold mb-2">{eventItem.title}</p>
															<p className="text-sm text-muted-foreground mb-2">
																{formatDateTime(eventItem.starts_at)}
															</p>
															<p className="text-sm text-muted-foreground">{eventItem.location || 'Location TBD'}</p>
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
