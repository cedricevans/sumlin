import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Calendar, CreditCard, HeartHandshake, Mail, MapPin, PartyPopper, Phone, Send, Store, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { submitServiceRequest, fetchBusinessSnapshot, formatDateTime } from '@/lib/sumlinData';
import { useToast } from '@/hooks/use-toast';

const initialForm = {
	requester_name: '',
	email: '',
	phone: '',
	category: 'professional-services',
	event_type: '',
	event_date: '',
	budget_label: '',
	message: '',
};

const FamilyBusinessPage = () => {
	const { toast } = useToast();
	const [snapshot, setSnapshot] = useState({
		tenant: null,
		services: [],
		events: [],
		status: 'loading',
		error: null,
	});
	const [formData, setFormData] = useState(initialForm);
	const [isSubmitting, setIsSubmitting] = useState(false);

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

	const tenant = snapshot.tenant;
	const featuredServices = useMemo(
		() => snapshot.services.filter((service) => service.is_featured),
		[snapshot.services],
	);
	const hasCalendarLink = Boolean(tenant?.google_calendar_public_url);
	const hasCalendarEmbed = Boolean(tenant?.google_calendar_embed_url);
	const hasCalendarEvents = snapshot.events.length > 0;

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((current) => ({
			...current,
			[name]: value,
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setIsSubmitting(true);

		const result = await submitServiceRequest(formData);

		if (result.ok) {
			toast({
				title: 'Request saved',
				description: result.message,
			});
			setFormData(initialForm);
		} else {
			toast({
				title: 'Request not saved',
				description: result.message,
				variant: 'destructive',
			});
		}

		setIsSubmitting(false);
	};

	return (
		<>
			<Helmet>
				<title>Business Corner | Sumlin Family</title>
				<meta
					name="description"
					content="Browse and support family-owned businesses across the Sumlin family network in the Business Corner."
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
							<h1 className="text-5xl md:text-6xl font-bold mb-6">
								Business Corner
							</h1>
							<p className="text-xl text-muted-foreground max-w-3xl leading-relaxed mb-8">
								{tenant?.business_summary
									|| 'This page highlights family-owned businesses so we can support one another, share referrals, and keep our dollars moving through the family.'}
							</p>
							<p className="text-base text-muted-foreground max-w-2xl leading-relaxed mb-8">
								Each family member can use this page to share a personal business, side hustle, brand, or professional service with the rest of the family.
							</p>

							<div className="grid sm:grid-cols-2 gap-4 mb-8">
								<div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
									<div className="flex items-center gap-3 mb-3">
										<Store className="h-5 w-5 text-primary" />
										<h2 className="font-semibold">Support family businesses</h2>
									</div>
									<p className="text-sm text-muted-foreground leading-relaxed">
										Find family-owned brands, service providers, food businesses, photographers, and other trusted contacts.
									</p>
								</div>

								<div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
									<div className="flex items-center gap-3 mb-3">
										<Calendar className="h-5 w-5 text-primary" />
										<h2 className="font-semibold">Family dates and highlights</h2>
									</div>
									<p className="text-sm text-muted-foreground leading-relaxed">
										Keep important family dates, business pop-ups, and reunion reminders easy to find.
									</p>
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
										Calendar details coming soon
									</span>
								)}
							</div>
						</div>

						<div className="bg-card border border-border/50 rounded-3xl p-8 shadow-xl">
							<h2 className="text-2xl font-bold mb-4">Directory details</h2>
							<p className="text-muted-foreground leading-relaxed mb-6">
								Keep contact details, payment options, and shared family links together so relatives know
								how to connect and support one another.
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
										<p className="font-medium">Peer payment handles</p>
										<p className="text-muted-foreground">
											Cash App {tenant?.cash_app_handle || '$SumlinReunionClub'}
										</p>
										<p className="text-muted-foreground">
											Venmo {tenant?.venmo_handle || '@sumlin-family'}
										</p>
										<p className="text-muted-foreground">
											PayPal {tenant?.paypal_donate_url ? 'Configured in tenant settings' : 'Add your donate link in Supabase'}
										</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<MapPin className="h-4 w-4 text-primary mt-1" />
									<div>
										<p className="font-medium">Page status</p>
										<p className="text-muted-foreground">
											{snapshot.status === 'live'
												? 'Connected to the family business records'
												: 'Showing starter directory information until the family business records are finished'}
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
						<div>
							<div className="flex items-center gap-3 mb-5">
								<PartyPopper className="h-6 w-6 text-primary" />
								<h2 className="text-3xl font-bold">Business Corner listings</h2>
							</div>
							<div className="grid md:grid-cols-2 gap-6">
								{snapshot.services.map((service) => (
									<div key={service.id} className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
										<div className="flex items-center justify-between gap-4 mb-4">
											<span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
												{service.category}
											</span>
											{service.is_featured && (
												<span className="inline-flex rounded-full bg-secondary/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
													Featured
												</span>
											)}
										</div>
										<h3 className="text-xl font-bold mb-3">{service.title}</h3>
										<p className="text-muted-foreground leading-relaxed mb-4">{service.description}</p>
										<p className="text-sm font-semibold text-primary">{service.price_label || 'Location coming soon'}</p>
									</div>
								))}
							</div>

							<div id="calendar" className="mt-10 bg-muted rounded-3xl p-8 border border-border/50">
								<h2 className="text-3xl font-bold mb-4">Family calendar</h2>
								<p className="text-muted-foreground leading-relaxed mb-6">
									Reunion dates, birthday reminders, planning calls, and event updates will be shared here
									once the family calendar is connected.
								</p>
								{(hasCalendarLink || hasCalendarEmbed) ? (
									<div className="grid md:grid-cols-2 gap-5">
										{hasCalendarLink && (
											<div className="bg-card rounded-2xl p-5 border border-border/50">
												<p className="text-sm font-semibold mb-2">Calendar link</p>
												<a
													href={tenant.google_calendar_public_url}
													className="text-sm text-primary break-all underline"
												>
													{tenant.google_calendar_public_url}
												</a>
											</div>
										)}
										{hasCalendarEmbed && (
											<div className="bg-card rounded-2xl p-5 border border-border/50">
												<p className="text-sm font-semibold mb-2">Embedded calendar</p>
												<p className="text-sm text-muted-foreground break-all">
													{tenant.google_calendar_embed_url}
												</p>
											</div>
										)}
									</div>
								) : (
									<div className="bg-card rounded-2xl p-5 border border-border/50">
										<p className="text-sm text-muted-foreground">
											Calendar details will be added here once they are ready.
										</p>
									</div>
								)}

								{hasCalendarEvents && (
									<div className="mt-6 grid md:grid-cols-3 gap-4">
										{snapshot.events.map((eventItem) => (
											<div key={eventItem.id} className="rounded-2xl border border-border/50 bg-card p-5">
												<p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-2">
													{eventItem.event_type}
												</p>
												<h3 className="font-bold text-lg mb-2">{eventItem.title}</h3>
												<p className="text-sm text-muted-foreground mb-3">{eventItem.description}</p>
												<p className="text-sm font-medium">{formatDateTime(eventItem.starts_at)}</p>
												<p className="text-sm text-muted-foreground">{eventItem.location || 'Location TBD'}</p>
											</div>
										))}
									</div>
								)}
							</div>
						</div>

						<div>
							<div className="bg-card border border-border/50 rounded-3xl p-8 shadow-xl">
								<div className="flex items-center gap-3 mb-4">
									<Send className="h-5 w-5 text-primary" />
									<h2 className="text-3xl font-bold">Add your business to the corner</h2>
								</div>
								<p className="text-muted-foreground leading-relaxed mb-6">
									Use this form to submit a family-owned business, side hustle, creative service, or professional practice for the directory.
								</p>
								<form className="space-y-4" onSubmit={handleSubmit}>
									<input
										type="text"
										name="requester_name"
										placeholder="Owner or contact name"
										value={formData.requester_name}
										onChange={handleChange}
										required
										className="w-full"
									/>
									<div className="grid sm:grid-cols-2 gap-4">
										<input
											type="email"
											name="email"
											placeholder="Email"
											value={formData.email}
											onChange={handleChange}
											required
											className="w-full"
										/>
										<input
											type="tel"
											name="phone"
											placeholder="Phone"
											value={formData.phone}
											onChange={handleChange}
											className="w-full"
										/>
									</div>
									<div className="grid sm:grid-cols-2 gap-4">
										<select name="category" value={formData.category} onChange={handleChange} className="w-full">
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
											value={formData.event_type}
											onChange={handleChange}
											className="w-full"
										/>
									</div>
									<div className="grid sm:grid-cols-2 gap-4">
										<input
											type="text"
											name="event_date"
											placeholder="Website or social link"
											value={formData.event_date}
											onChange={handleChange}
											className="w-full"
										/>
										<input
											type="text"
											name="budget_label"
											placeholder="City, state or service area"
											value={formData.budget_label}
											onChange={handleChange}
											className="w-full"
										/>
									</div>
									<textarea
										name="message"
										placeholder="Describe the business, services, and how family members can contact or book you."
										value={formData.message}
										onChange={handleChange}
										required
										rows={5}
										className="w-full"
									/>
									<button
										type="submit"
										disabled={isSubmitting}
										className="w-full gradient-gold text-foreground py-3 rounded-xl font-semibold hover:shadow-gold transition-all duration-200 disabled:opacity-70"
									>
										{isSubmitting ? 'Sending...' : 'Submit business'}
									</button>
								</form>
							</div>

							<div className="mt-6 bg-muted rounded-3xl p-8 border border-border/50">
								<h2 className="text-2xl font-bold mb-4">Featured in the corner</h2>
								<div className="space-y-4">
									{featuredServices.map((service) => (
										<div key={service.id} className="rounded-2xl bg-card border border-border/50 p-5">
											<p className="text-sm font-semibold text-primary mb-1">{service.category}</p>
											<h3 className="font-bold text-lg mb-2">{service.title}</h3>
											<p className="text-sm text-muted-foreground">{service.description}</p>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default FamilyBusinessPage;
