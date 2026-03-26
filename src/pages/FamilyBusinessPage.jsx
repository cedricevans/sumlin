import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { CalendarDays, CreditCard, HeartHandshake, Mail, MapPin, Phone, Send, Store, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchBusinessSnapshot, formatDateTime, submitEventSignup, submitServiceRequest } from '@/lib/sumlinData';
import { useToast } from '@/hooks/use-toast';

const initialBusinessForm = {
	requester_name: '',
	email: '',
	phone: '',
	category: 'professional-services',
	event_type: '',
	event_date: '',
	budget_label: '',
	message: '',
};

const initialSignupForm = {
	event_id: '',
	attendee_name: '',
	email: '',
	phone: '',
	party_size: '1',
	notes: '',
};

const FamilyBusinessPage = () => {
	const { toast } = useToast();
	const [businessSearch, setBusinessSearch] = useState('');
	const [activeCategory, setActiveCategory] = useState('All');
	const [visibleBusinessCount, setVisibleBusinessCount] = useState(8);
	const [snapshot, setSnapshot] = useState({
		tenant: null,
		services: [],
		events: [],
		status: 'loading',
		error: null,
	});
	const [businessForm, setBusinessForm] = useState(initialBusinessForm);
	const [signupForm, setSignupForm] = useState(initialSignupForm);
	const [savingBusiness, setSavingBusiness] = useState(false);
	const [savingSignup, setSavingSignup] = useState(false);

	useEffect(() => {
		let active = true;

		const loadSnapshot = async () => {
			const nextSnapshot = await fetchBusinessSnapshot();
			if (active) {
				setSnapshot(nextSnapshot);
			}
		};

		loadSnapshot();

		return () => {
			active = false;
		};
	}, []);

	useEffect(() => {
		if (!signupForm.event_id && snapshot.events.length > 0) {
			setSignupForm((current) => ({
				...current,
				event_id: snapshot.events[0].id,
			}));
		}
	}, [snapshot.events, signupForm.event_id]);

	const tenant = snapshot.tenant;
	const businessCount = snapshot.services.length;
	const featuredCount = useMemo(
		() => snapshot.services.filter((service) => service.is_featured).length,
		[snapshot.services],
	);
	const businessCategories = useMemo(
		() => ['All', ...new Set(snapshot.services.map((service) => service.category).filter(Boolean))],
		[snapshot.services],
	);
	const filteredServices = useMemo(() => {
		const query = businessSearch.trim().toLowerCase();

		return snapshot.services.filter((service) => {
			const matchesCategory = activeCategory === 'All' || service.category === activeCategory;
			const haystack = [service.title, service.category, service.description, service.price_label]
				.filter(Boolean)
				.join(' ')
				.toLowerCase();
			const matchesSearch = !query || haystack.includes(query);
			return matchesCategory && matchesSearch;
		});
	}, [activeCategory, businessSearch, snapshot.services]);
	const visibleServices = useMemo(
		() => filteredServices.slice(0, visibleBusinessCount),
		[filteredServices, visibleBusinessCount],
	);
	const hasCalendarLink = Boolean(tenant?.google_calendar_public_url);
	const hasCalendarEmbed = Boolean(tenant?.google_calendar_embed_url);

	useEffect(() => {
		setVisibleBusinessCount(8);
	}, [activeCategory, businessSearch, snapshot.services]);

	const handleBusinessChange = (event) => {
		const { name, value } = event.target;
		setBusinessForm((current) => ({
			...current,
			[name]: value,
		}));
	};

	const handleSignupChange = (event) => {
		const { name, value } = event.target;
		setSignupForm((current) => ({
			...current,
			[name]: value,
		}));
	};

	const handleBusinessSubmit = async (event) => {
		event.preventDefault();
		setSavingBusiness(true);

		const result = await submitServiceRequest(businessForm);

		if (result.ok) {
			toast({
				title: 'Business submitted',
				description: result.message,
			});
			setBusinessForm(initialBusinessForm);
		} else {
			toast({
				title: 'Submission failed',
				description: result.message,
				variant: 'destructive',
			});
		}

		setSavingBusiness(false);
	};

	const handleSignupSubmit = async (event) => {
		event.preventDefault();
		setSavingSignup(true);

		const result = await submitEventSignup(signupForm);

		if (result.ok) {
			toast({
				title: 'Signup saved',
				description: result.message,
			});
			setSignupForm((current) => ({
				...initialSignupForm,
				event_id: current.event_id,
			}));
		} else {
			toast({
				title: 'Signup failed',
				description: result.message,
				variant: 'destructive',
			});
		}

		setSavingSignup(false);
	};

	return (
		<>
			<Helmet>
				<title>Business Corner | Sumlin Family</title>
				<meta
					name="description"
					content="Browse the Sumlin Business Corner, sign up for family events, and submit your business for the directory."
				/>
			</Helmet>

			<section className="section-spacing bg-background pt-24 md:pt-32">
				<div className="container-custom">
					<div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
						<div>
							<div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-5">
								<HeartHandshake className="h-4 w-4" />
								Sumlin Business Corner
							</div>
							<h1 className="text-5xl md:text-6xl font-bold mb-6">A directory of family businesses</h1>
							<p className="text-xl text-muted-foreground max-w-3xl leading-relaxed mb-6">
								{tenant?.business_summary
									|| 'Explore family-owned businesses, side hustles, brands, and professional services so we can support one another and keep referrals inside the family.'}
							</p>
							<p className="text-base text-muted-foreground max-w-2xl leading-relaxed mb-8">
								Use this page to find businesses, share your own listing, and sign up for family events and activities.
							</p>

							<div className="grid sm:grid-cols-3 gap-4 mb-8">
								<div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
									<p className="text-sm font-semibold text-primary mb-2">Listed businesses</p>
									<p className="text-3xl font-bold">{businessCount}</p>
								</div>
								<div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
									<p className="text-sm font-semibold text-primary mb-2">Featured listings</p>
									<p className="text-3xl font-bold">{featuredCount}</p>
								</div>
								<div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
									<p className="text-sm font-semibold text-primary mb-2">Upcoming events</p>
									<p className="text-3xl font-bold">{snapshot.events.length}</p>
								</div>
							</div>

							<div className="flex flex-wrap gap-4">
								<Link
									to="/fundraiser-rules"
									className="gradient-burgundy text-white px-6 py-3 rounded-xl font-semibold hover:shadow-burgundy transition-all duration-200"
								>
									Review fundraiser disclaimer
								</Link>
								{hasCalendarLink ? (
									<a
										href={tenant.google_calendar_public_url}
										className="bg-card border border-border/60 px-6 py-3 rounded-xl font-semibold hover:bg-muted transition-colors duration-200"
									>
										Open family calendar
									</a>
								) : (
									<span className="bg-card border border-border/60 px-6 py-3 rounded-xl font-semibold text-muted-foreground">
										Calendar link coming soon
									</span>
								)}
							</div>
						</div>

						<div className="bg-card border border-border/50 rounded-3xl p-8 shadow-xl">
							<h2 className="text-2xl font-bold mb-4">Directory details</h2>
							<p className="text-muted-foreground leading-relaxed mb-6">
								Keep contact details, payment options, and family links together so everyone knows how to connect.
							</p>

							<div className="space-y-4 text-sm">
								<div className="flex items-start gap-3">
									<Mail className="h-4 w-4 text-primary mt-1" />
									<div>
										<p className="font-medium">Email</p>
										<p className="text-muted-foreground">{tenant?.support_email || 'info@sumlinfamily.com'}</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<Phone className="h-4 w-4 text-primary mt-1" />
									<div>
										<p className="font-medium">Phone</p>
										<p className="text-muted-foreground">{tenant?.support_phone || '937-555-2026'}</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<CreditCard className="h-4 w-4 text-primary mt-1" />
									<div>
										<p className="font-medium">Payment handles</p>
										<p className="text-muted-foreground">Cash App {tenant?.cash_app_handle || '$SumlinReunionClub'}</p>
										<p className="text-muted-foreground">Venmo {tenant?.venmo_handle || '@sumlin-family'}</p>
										<p className="text-muted-foreground">
											PayPal {tenant?.paypal_donate_url ? 'Configured for the family' : 'Add your PayPal link in admin'}
										</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<MapPin className="h-4 w-4 text-primary mt-1" />
									<div>
										<p className="font-medium">Page status</p>
										<p className="text-muted-foreground">
											{snapshot.status === 'live'
												? 'Connected to the family records'
												: 'Showing starter information until the family records are finished'}
										</p>
									</div>
								</div>
							</div>

							{snapshot.error && (
								<div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-muted-foreground">
									<p className="font-semibold text-foreground mb-1">Setup note</p>
									<p>{snapshot.error.message}</p>
								</div>
							)}
						</div>
					</div>

					<div className="mt-16 grid lg:grid-cols-[1.05fr_0.95fr] gap-10">
						<div className="space-y-10">
							<div>
								<div className="flex items-center gap-3 mb-5">
									<Store className="h-6 w-6 text-primary" />
									<h2 className="text-3xl font-bold">Business directory</h2>
								</div>
								<div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm mb-5">
									<div className="grid lg:grid-cols-[1fr_auto] gap-4 items-start">
										<div>
											<input
												type="text"
												value={businessSearch}
												onChange={(event) => setBusinessSearch(event.target.value)}
												placeholder="Search by name, category, service, or city"
												className="w-full"
											/>
										</div>
										<div className="text-sm text-muted-foreground lg:text-right">
											Showing {visibleServices.length} of {filteredServices.length} businesses
										</div>
									</div>
									<div className="flex flex-wrap gap-2 mt-4">
										{businessCategories.map((category) => (
											<button
												key={category}
												type="button"
												onClick={() => setActiveCategory(category)}
												className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
													activeCategory === category
														? 'bg-primary text-primary-foreground'
														: 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
												}`}
											>
												{category}
											</button>
										))}
									</div>
								</div>
								<div className="bg-card border border-border/50 rounded-3xl shadow-sm overflow-hidden">
									<div className="divide-y divide-border/50">
										{visibleServices.map((service) => (
											<div key={service.id} className="p-6 md:p-7">
												<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
													<div className="min-w-0">
														<div className="flex flex-wrap items-center gap-2 mb-3">
															<span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
																{service.category}
															</span>
															{service.is_featured && (
																<span className="inline-flex rounded-full bg-secondary/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
																	Featured
																</span>
															)}
														</div>
														<h3 className="text-2xl font-bold mb-2">{service.title}</h3>
														<p className="text-muted-foreground leading-relaxed">{service.description}</p>
													</div>
													<div className="md:text-right md:min-w-[180px]">
														<p className="text-sm font-semibold text-primary">
															{service.price_label || 'Details coming soon'}
														</p>
													</div>
												</div>
											</div>
										))}
										{filteredServices.length === 0 && (
											<div className="p-6 md:p-7">
												<p className="text-muted-foreground">
													No businesses match that search yet. Try another category or a shorter search.
												</p>
											</div>
										)}
									</div>
								</div>
								{filteredServices.length > visibleServices.length && (
									<div className="mt-5 flex justify-center">
										<button
											type="button"
											onClick={() => setVisibleBusinessCount((current) => current + 8)}
											className="bg-card border border-border/60 px-6 py-3 rounded-xl font-semibold hover:bg-muted transition-colors duration-200"
										>
											Show more businesses
										</button>
									</div>
								)}
							</div>

							<div id="calendar" className="bg-muted rounded-3xl p-8 border border-border/50">
								<div className="flex items-center gap-3 mb-4">
									<CalendarDays className="h-6 w-6 text-primary" />
									<h2 className="text-3xl font-bold">Event calendar</h2>
								</div>
								<p className="text-muted-foreground leading-relaxed mb-6">
									Family events, signups, and important dates will show here as they are added.
								</p>

								{hasCalendarEmbed && (
									<div className="bg-card border border-border/50 rounded-3xl overflow-hidden mb-6">
										<iframe
											title="Sumlin Family Calendar"
											src={tenant.google_calendar_embed_url}
											className="w-full min-h-[480px]"
										/>
									</div>
								)}

								{snapshot.events.length > 0 ? (
									<div className="bg-card border border-border/50 rounded-3xl overflow-hidden">
										<div className="divide-y divide-border/50">
											{snapshot.events.map((eventItem) => (
												<div key={eventItem.id} className="p-6 md:p-7 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
													<div>
														<div className="flex flex-wrap items-center gap-2 mb-2">
															<span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
																{eventItem.event_type}
															</span>
															<span className="inline-flex rounded-full bg-secondary/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
																{eventItem.status}
															</span>
														</div>
														<h3 className="text-2xl font-bold mb-2">{eventItem.title}</h3>
														<p className="text-muted-foreground mb-3">{eventItem.description || 'Details coming soon.'}</p>
														<p className="text-sm font-medium">{formatDateTime(eventItem.starts_at)}</p>
														<p className="text-sm text-muted-foreground">{eventItem.location || 'Location TBD'}</p>
													</div>
													<div className="md:text-right md:min-w-[180px]">
														<p className="text-sm text-muted-foreground">
															{eventItem.capacity ? `${eventItem.capacity} spots planned` : 'Open signup'}
														</p>
													</div>
												</div>
											))}
										</div>
									</div>
								) : !hasCalendarEmbed ? (
									<div className="bg-card rounded-2xl p-5 border border-border/50">
										<p className="text-sm text-muted-foreground">
											No events have been added yet. Once the family adds them in admin, everyone will be able to sign up here.
										</p>
									</div>
								) : null}
							</div>
						</div>

						<div className="space-y-6">
							<div className="bg-card border border-border/50 rounded-3xl p-8 shadow-xl">
								<div className="flex items-center gap-3 mb-4">
									<Send className="h-5 w-5 text-primary" />
									<h2 className="text-3xl font-bold">Sign up for an event</h2>
								</div>
								<p className="text-muted-foreground leading-relaxed mb-6">
									Use this form to sign up for reunions, planning calls, business spotlights, and other family activities.
								</p>
								<form className="space-y-4" onSubmit={handleSignupSubmit}>
									<select
										name="event_id"
										value={signupForm.event_id}
										onChange={handleSignupChange}
										required
										className="w-full"
										disabled={snapshot.events.length === 0}
									>
										<option value="">Select an event</option>
										{snapshot.events.map((eventItem) => (
											<option key={eventItem.id} value={eventItem.id}>
												{eventItem.title}
											</option>
										))}
									</select>
									<input
										type="text"
										name="attendee_name"
										placeholder="Full name"
										value={signupForm.attendee_name}
										onChange={handleSignupChange}
										required
										className="w-full"
									/>
									<div className="grid sm:grid-cols-2 gap-4">
										<input
											type="email"
											name="email"
											placeholder="Email"
											value={signupForm.email}
											onChange={handleSignupChange}
											required
											className="w-full"
										/>
										<input
											type="tel"
											name="phone"
											placeholder="Phone"
											value={signupForm.phone}
											onChange={handleSignupChange}
											className="w-full"
										/>
									</div>
									<input
										type="number"
										min="1"
										name="party_size"
										placeholder="Party size"
										value={signupForm.party_size}
										onChange={handleSignupChange}
										className="w-full"
									/>
									<textarea
										name="notes"
										placeholder="Anything the family should know?"
										value={signupForm.notes}
										onChange={handleSignupChange}
										rows={4}
										className="w-full"
									/>
									<button
										type="submit"
										disabled={savingSignup || snapshot.events.length === 0}
										className="w-full gradient-gold text-foreground py-3 rounded-xl font-semibold hover:shadow-gold transition-all duration-200 disabled:opacity-70"
									>
										{savingSignup ? 'Saving signup...' : 'Save my signup'}
									</button>
								</form>
							</div>

							<div className="bg-card border border-border/50 rounded-3xl p-8 shadow-xl">
								<div className="flex items-center gap-3 mb-4">
									<Users className="h-5 w-5 text-primary" />
									<h2 className="text-3xl font-bold">Add your business</h2>
								</div>
								<p className="text-muted-foreground leading-relaxed mb-6">
									Use this form to submit a family-owned business, side hustle, creative service, or professional practice for the directory.
								</p>
								<form className="space-y-4" onSubmit={handleBusinessSubmit}>
									<input
										type="text"
										name="requester_name"
										placeholder="Owner or contact name"
										value={businessForm.requester_name}
										onChange={handleBusinessChange}
										required
										className="w-full"
									/>
									<div className="grid sm:grid-cols-2 gap-4">
										<input
											type="email"
											name="email"
											placeholder="Email"
											value={businessForm.email}
											onChange={handleBusinessChange}
											required
											className="w-full"
										/>
										<input
											type="tel"
											name="phone"
											placeholder="Phone"
											value={businessForm.phone}
											onChange={handleBusinessChange}
											className="w-full"
										/>
									</div>
									<div className="grid sm:grid-cols-2 gap-4">
										<select
											name="category"
											value={businessForm.category}
											onChange={handleBusinessChange}
											className="w-full"
										>
											<option value="professional-services">Professional services</option>
											<option value="food">Food and catering</option>
											<option value="beauty">Beauty and wellness</option>
											<option value="events">Events and rentals</option>
											<option value="photography">Photography and media</option>
											<option value="travel">Travel and hospitality</option>
											<option value="retail">Retail and products</option>
										</select>
										<input
											type="text"
											name="event_type"
											placeholder="Business name"
											value={businessForm.event_type}
											onChange={handleBusinessChange}
											className="w-full"
										/>
									</div>
									<div className="grid sm:grid-cols-2 gap-4">
										<input
											type="text"
											name="event_date"
											placeholder="Website or social link"
											value={businessForm.event_date}
											onChange={handleBusinessChange}
											className="w-full"
										/>
										<input
											type="text"
											name="budget_label"
											placeholder="City, state or service area"
											value={businessForm.budget_label}
											onChange={handleBusinessChange}
											className="w-full"
										/>
									</div>
									<textarea
										name="message"
										placeholder="Describe the business, services, and how family members can reach you."
										value={businessForm.message}
										onChange={handleBusinessChange}
										required
										rows={5}
										className="w-full"
									/>
									<button
										type="submit"
										disabled={savingBusiness}
										className="w-full gradient-burgundy text-white py-3 rounded-xl font-semibold hover:shadow-burgundy transition-all duration-200 disabled:opacity-70"
									>
										{savingBusiness ? 'Sending...' : 'Submit business'}
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default FamilyBusinessPage;
