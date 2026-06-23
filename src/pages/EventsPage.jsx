import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, Clock3, ExternalLink, MapPin, ClipboardList, DollarSign, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { fetchBusinessSnapshot, formatDateTime, submitReunionRegistration } from '@/lib/sumlinData';

const PRICE_TABLE = {
	dues:    { label: 'Annual Dues (Ages 21+)',          price: 35 },
	adult:   { label: 'Adult Registration (Ages 21+)',   price: 80 },
	teen:    { label: 'Teen / Young Adult (Ages 15–20)', price: 50 },
	child:   { label: 'Children (Ages 5–14)',            price: 35 },
	toddler: { label: 'Toddlers (Ages 4 & under)',       price: 0  },
	guest:   { label: 'Guest',                           price: 90 },
};

const REUNION_SCHEDULE = [
	{
		day: 'Friday, September 4, 2026',
		events: [
			{
				time: 'Evening',
				title: 'Meet & Greet',
				location: 'Wayman AME Church',
				description: 'Food & Games. Kick off reunion weekend with family, food, and fun.',
			},
		],
	},
	{
		day: 'Saturday, September 5, 2026',
		events: [
			{
				time: '11:00 AM – 2:00 PM',
				title: 'VIP Bowling & Lunch',
				location: 'Poelking Bowling VIP Suite',
				description: 'Lace up your bowling shoes, grab some lunch, and let\'s see who holds the family crown.',
			},
			{
				time: '6:00 PM – 9:00 PM',
				title: 'Family Trivia Night & Dinner',
				location: 'Golden Corral Buffet',
				description: 'A massive feast and high-stakes family trivia. Bring your competitive spirit and your appetite.',
			},
			{
				time: '9:00 PM – Until',
				title: 'Late Night Fun',
				location: 'Casino and/or Scene 75',
				description: 'The party doesn\'t stop. We\'re keeping the vibes going into the night.',
			},
		],
	},
	{
		day: 'Sunday, September 6, 2026',
		events: [
			{
				time: '12:00 PM – 6:00 PM',
				title: 'Grand Finale Family Picnic',
				location: 'Trotwood Community Cultural Arts Center — 4000 Lake Center Dr., Trotwood, OH',
				description: 'A fully catered picnic with good music, amazing food, deep laughs, and beautiful views by the lake.',
			},
		],
	},
];


const CONTACT_ORGANIZERS = [
	{ name: 'David Dowell', phone: '(937) 902-0020' },
	{ name: 'Mike Cranford', phone: '(703) 899-6189' },
	{ name: 'Debi Bass', phone: '(513) 265-5770' },
	{ name: 'Ronika Sumlin', phone: '(410) 807-2337' },
];


const EMPTY_FORM = {
	name: '', email: '', phone: '',
	duesCount: 0, adultCount: 0, teenCount: 0,
	childCount: 0, toddlerCount: 0, guestCount: 0,
	paymentMethod: 'cashapp', notes: '',
};

const calcTotal = (f) =>
	f.duesCount * 35 + f.adultCount * 80 + f.teenCount * 50 +
	f.childCount * 35 + f.toddlerCount * 0 + f.guestCount * 90;

const calcAttendees = (f) =>
	f.adultCount + f.teenCount + f.childCount + f.toddlerCount + f.guestCount;

const EventsPage = () => {
	const navigate = useNavigate();
	const { toast } = useToast();

	const [snapshot, setSnapshot] = useState({
		tenant: null,
		services: [],
		events: [],
		status: 'loading',
		error: null,
	});

	const [form, setForm] = useState(EMPTY_FORM);
	const [submitting, setSubmitting] = useState(false);

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
	const calendarPublicUrl = tenant?.google_calendar_public_url || '';
	const calendarEmbedUrl = tenant?.google_calendar_embed_url || '';

	return (
		<>
			<Helmet>
				<title>Events & Registration | Sumlin Family Reunion 2026</title>
				<meta
					name="description"
					content="Registration is open for the 2026 Sumlin Family Reunion in Trotwood, Ohio. View the full weekend schedule, pricing, and how to register."
				/>
			</Helmet>

			<div className="min-h-screen bg-background">

				{/* Hero */}
				<section className="section-spacing pt-24 md:pt-32 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.16),_transparent_35%),linear-gradient(160deg,_rgba(70,6,28,1)_0%,_rgba(43,18,20,1)_55%,_rgba(27,24,24,1)_100%)]">
					<div className="container-custom">
						<div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-center">
							<motion.div
								initial={{ opacity: 0, y: 24 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.7 }}
							>
								<div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 mb-6">
									<CalendarDays className="h-4 w-4 text-[#d4af37]" />
									Sumlin Family Reunion 2026
								</div>
								<h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
									Registration is open. Labor Day Weekend in Trotwood, Ohio.
								</h1>
								<p className="text-lg text-white/80 max-w-2xl leading-relaxed mb-8">
									The wait is over. Join the family September 4–6, 2026 for a packed weekend of bowling, trivia, dinner, and the Grand Finale Picnic. Register before August 28.
								</p>
								<div className="flex flex-wrap gap-4">
									<Button asChild className="gradient-metallic h-12 rounded-xl px-6 font-bold text-black hover:brightness-110">
										<a href="#registration">Register now</a>
									</Button>
									<Button asChild variant="outline" className="h-12 rounded-xl px-6 font-semibold border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white">
										<a href="#schedule">View schedule</a>
									</Button>
								</div>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, scale: 0.96 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.7, delay: 0.08 }}
								className="rounded-[2rem] border border-white/15 bg-white/95 p-8 shadow-2xl"
							>
								<p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary mb-3">Key details</p>
								<h2 className="text-2xl font-bold text-foreground mb-5">2026 Reunion at a glance</h2>
								<div className="space-y-4 text-sm">
									<div className="flex items-start gap-3">
										<CalendarDays className="h-4 w-4 text-primary mt-0.5 shrink-0" />
										<div>
											<p className="font-semibold text-foreground">Labor Day Weekend</p>
											<p className="text-muted-foreground">September 4–6, 2026</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
										<div>
											<p className="font-semibold text-foreground">Trotwood, Ohio</p>
											<p className="text-muted-foreground">Multiple venues across the weekend</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<ClipboardList className="h-4 w-4 text-primary mt-0.5 shrink-0" />
										<div>
											<p className="font-semibold text-foreground">Registration deadline</p>
											<p className="text-muted-foreground">August 28, 2026 — don't wait</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<DollarSign className="h-4 w-4 text-primary mt-0.5 shrink-0" />
										<div>
											<p className="font-semibold text-foreground">Annual dues</p>
											<p className="text-muted-foreground">$35.00 mandatory for ages 21+ (Sumlin descendants)</p>
										</div>
									</div>
								</div>
								<div className="mt-6 rounded-2xl bg-primary/10 border border-primary/20 p-4">
									<p className="text-sm font-semibold text-primary">Registration fee covers both days of events</p>
								</div>
							</motion.div>
						</div>
					</div>
				</section>

				{/* Weekend Schedule */}
				<section id="schedule" className="py-10 bg-background">
					<div className="container-custom">
						<div className="max-w-4xl mx-auto">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-2xl font-bold text-foreground">Weekend schedule</h2>
								<a href="#registration" className="text-sm font-semibold text-primary hover:underline">Jump to registration ↓</a>
							</div>

							<div className="rounded-[1.5rem] border border-border/60 bg-card overflow-hidden shadow-sm">
								{REUNION_SCHEDULE.map((dayBlock, di) => (
									<div key={dayBlock.day} className={di > 0 ? 'border-t border-border/60' : ''}>
										<div className="flex items-center gap-2 bg-primary/8 px-5 py-3 border-b border-border/40">
											<CalendarDays className="h-4 w-4 text-primary shrink-0" />
											<p className="text-sm font-bold text-primary">{dayBlock.day}</p>
										</div>
										<div className="divide-y divide-border/40">
											{dayBlock.events.map((ev) => (
												<div key={ev.title} className="grid sm:grid-cols-[10rem_1fr_1fr] gap-1 sm:gap-4 items-baseline px-5 py-3">
													<p className="text-xs font-semibold text-muted-foreground tabular-nums">{ev.time}</p>
													<p className="font-semibold text-foreground text-sm">{ev.title}</p>
													<p className="text-xs text-muted-foreground">{ev.location}</p>
												</div>
											))}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* Registration Form */}
				<section id="registration" className="py-10 bg-muted/40">
					<div className="container-custom">
						<div className="max-w-5xl mx-auto grid gap-6 lg:grid-cols-[1fr_1.1fr]">

							{/* Left: pricing reference */}
							<div className="space-y-4">
								<div className="rounded-[1.5rem] border border-border/60 bg-card p-6 shadow-sm">
									<p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary mb-4">2026 pricing</p>
									<div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-center justify-between">
										<p className="text-sm font-semibold text-amber-900">Annual Dues (Ages 21+)</p>
										<p className="text-sm font-bold text-amber-900">$35</p>
									</div>
									{Object.entries(PRICE_TABLE).filter(([k]) => k !== 'dues').map(([key, row]) => (
										<div key={key} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
											<p className="text-sm text-foreground">{row.label}</p>
											<p className="text-sm font-semibold text-primary">{row.price === 0 ? 'Free' : `$${row.price}`}</p>
										</div>
									))}
									<p className="text-xs text-muted-foreground mt-4">Fee covers both days. Deadline: August 28, 2026.</p>
								</div>

								<div className="rounded-[1.5rem] border border-border/60 bg-card p-6 shadow-sm">
									<p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary mb-3">Questions? Contact the squad</p>
									<div className="space-y-2">
										{CONTACT_ORGANIZERS.map((c) => (
											<div key={c.name} className="flex items-center gap-3">
												<Phone className="h-3.5 w-3.5 text-primary shrink-0" />
												<p className="text-sm text-foreground font-medium">{c.name}</p>
												<a href={`tel:${c.phone.replace(/\D/g, '')}`} className="text-sm text-muted-foreground hover:text-primary ml-auto">{c.phone}</a>
											</div>
										))}
									</div>
								</div>
							</div>

							{/* Right: registration form */}
							<div className="rounded-[1.5rem] border border-border/60 bg-card p-6 shadow-sm">
								<p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary mb-1">Register your family</p>
								<h2 className="text-2xl font-bold text-foreground mb-5">Let's get it secured</h2>

								<form
									onSubmit={async (e) => {
										e.preventDefault();
										if (!form.name || !form.email || !form.phone) {
											toast({ title: 'Missing info', description: 'Name, email, and phone are required.', variant: 'destructive' });
											return;
										}
										if (calcAttendees(form) < 1) {
											toast({ title: 'Add attendees', description: 'Select at least one person to register.', variant: 'destructive' });
											return;
										}
										setSubmitting(true);
										const result = await submitReunionRegistration(form);
										setSubmitting(false);
										if (!result.ok) {
											toast({ title: 'Registration error', description: result.message, variant: 'destructive' });
											return;
										}
										navigate('/success', {
											state: {
												orderDetails: {
													id: result.referenceCode,
													date: new Date().toISOString(),
													method: form.paymentMethod === 'cashapp' ? 'Cash App' : form.paymentMethod === 'venmo' ? 'Venmo' : form.paymentMethod === 'paypal' ? 'PayPal' : 'Other',
													customer: { name: form.name, email: form.email, phone: form.phone },
													total: `$${(result.totalCents / 100).toFixed(2)}`,
													items: [{ title: `Reunion registration — ${result.totalAttendees} attendee${result.totalAttendees !== 1 ? 's' : ''}`, quantity: 1 }],
												},
											},
										});
									}}
									className="space-y-4"
								>
									{/* Contact info */}
									<div className="grid sm:grid-cols-2 gap-3">
										<div className="sm:col-span-2">
											<label className="block text-xs font-semibold text-muted-foreground mb-1">Full name *</label>
											<input required className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="Your full name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
										</div>
										<div>
											<label className="block text-xs font-semibold text-muted-foreground mb-1">Email *</label>
											<input required type="email" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="your@email.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
										</div>
										<div>
											<label className="block text-xs font-semibold text-muted-foreground mb-1">Phone *</label>
											<input required type="tel" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="(555) 000-0000" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
										</div>
									</div>

									{/* Attendee counts */}
									<div>
										<p className="text-xs font-semibold text-muted-foreground mb-2">Attendees</p>
										<div className="space-y-2">
											{[
												{ key: 'duesCount',    label: 'Annual Dues (Ages 21+)',          price: 35, note: 'Mandatory per adult descendant' },
												{ key: 'adultCount',   label: 'Adult Registration (Ages 21+)',   price: 80 },
												{ key: 'teenCount',    label: 'Teen / Young Adult (Ages 15–20)', price: 50 },
												{ key: 'childCount',   label: 'Children (Ages 5–14)',            price: 35 },
												{ key: 'toddlerCount', label: 'Toddlers (Ages 4 & under)',       price: 0  },
												{ key: 'guestCount',   label: 'Guest',                           price: 90 },
											].map(({ key, label, price, note }) => (
												<div key={key} className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-background px-4 py-2.5">
													<div className="min-w-0">
														<p className="text-sm font-medium text-foreground truncate">{label}</p>
														{note && <p className="text-xs text-muted-foreground">{note}</p>}
													</div>
													<div className="flex items-center gap-2 shrink-0">
														<span className="text-xs font-semibold text-primary w-10 text-right">{price === 0 ? 'Free' : `$${price}`}</span>
														<div className="flex items-center gap-1">
															<button type="button" onClick={() => setForm((f) => ({ ...f, [key]: Math.max(0, f[key] - 1) }))} className="h-7 w-7 rounded-lg border border-border text-sm font-bold text-foreground hover:bg-muted flex items-center justify-center">−</button>
															<span className="w-6 text-center text-sm font-semibold tabular-nums">{form[key]}</span>
															<button type="button" onClick={() => setForm((f) => ({ ...f, [key]: f[key] + 1 }))} className="h-7 w-7 rounded-lg border border-border text-sm font-bold text-foreground hover:bg-muted flex items-center justify-center">+</button>
														</div>
													</div>
												</div>
											))}
										</div>
									</div>

									{/* Running total */}
									{(calcAttendees(form) > 0 || form.duesCount > 0) && (
										<div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 flex items-center justify-between">
											<p className="text-sm font-semibold text-foreground">{calcAttendees(form)} attendee{calcAttendees(form) !== 1 ? 's' : ''} · {form.duesCount} dues</p>
											<p className="text-lg font-bold text-primary">${calcTotal(form).toFixed(2)}</p>
										</div>
									)}

									{/* Payment method */}
									<div>
										<p className="text-xs font-semibold text-muted-foreground mb-2">How will you pay?</p>
										<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
											{[
												{ value: 'cashapp', label: 'Cash App' },
												{ value: 'venmo',   label: 'Venmo' },
												{ value: 'paypal',  label: 'PayPal' },
												{ value: 'other',   label: 'Cash / Check' },
											].map((opt) => (
												<button
													key={opt.value}
													type="button"
													onClick={() => setForm((f) => ({ ...f, paymentMethod: opt.value }))}
													className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${form.paymentMethod === opt.value ? 'border-primary bg-primary text-white' : 'border-border bg-background text-foreground hover:bg-muted'}`}
												>
													{opt.label}
												</button>
											))}
										</div>
										{form.paymentMethod === 'cashapp' && (
											<div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
												<p className="text-sm font-semibold text-amber-900">Send payment to: <span className="font-bold">$SumlinFamilyLegacy</span></p>
												<p className="text-xs text-amber-800 mt-1">Include your reference code in the memo after submitting.</p>
											</div>
										)}
										{form.paymentMethod === 'venmo' && (
											<div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
												<p className="text-sm font-semibold text-blue-900">Send via Venmo and include your reference code in the note.</p>
											</div>
										)}
										{form.paymentMethod === 'other' && (
											<div className="mt-3 rounded-xl border border-border bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
												Mail check payable to <strong>David Dowell</strong> or <strong>Kenneth Wynn</strong> · 5842 Seven Gables, Trotwood, OH 45426
											</div>
										)}
									</div>

									<textarea
										className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
										rows={2}
										placeholder="Notes (optional) — special requests, accessibility needs, etc."
										value={form.notes}
										onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
									/>

									<button
										type="submit"
										disabled={submitting}
										className="w-full gradient-burgundy text-white py-3.5 rounded-xl font-semibold hover:shadow-burgundy transition-all duration-200 disabled:opacity-60"
									>
										{submitting ? 'Submitting…' : `Submit registration${calcTotal(form) > 0 ? ` · $${calcTotal(form).toFixed(2)}` : ''}`}
									</button>
									<p className="text-xs text-center text-muted-foreground">Submitting this form reserves your spot. Payment must be received by August 28, 2026.</p>
								</form>
							</div>
						</div>
					</div>
				</section>

				{/* Calendar embed / event cards */}
				{calendarEmbedUrl && (
					<section className="section-spacing bg-background">
						<div className="container-custom">
							<div className="flex items-center justify-between gap-4 flex-wrap mb-8">
								<div>
									<h2 className="text-4xl font-bold text-foreground">Family calendar</h2>
									<p className="text-lg text-muted-foreground mt-3 max-w-3xl">
										Live family calendar with all scheduled events in one place.
									</p>
								</div>
								{calendarPublicUrl && (
									<a
										href={calendarPublicUrl}
										target="_blank"
										rel="noreferrer"
										className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card px-5 py-3 font-semibold hover:bg-muted transition-colors duration-200"
									>
										<ExternalLink className="h-4 w-4" />
										Open in Google Calendar
									</a>
								)}
							</div>
							<div className="rounded-[2rem] border border-border/60 bg-card p-4 md:p-6 shadow-lg overflow-hidden">
								<div className="aspect-[4/5] md:aspect-[16/10] overflow-hidden rounded-[1.5rem] border border-border/50">
									<iframe
										title="Sumlin family calendar"
										src={calendarEmbedUrl}
										className="h-full w-full"
									/>
								</div>
							</div>
						</div>
					</section>
				)}

				{/* Admin-entered event cards — shown if any exist in the DB */}
				{snapshot.events.length > 0 && (
					<section className="section-spacing bg-muted/40">
						<div className="container-custom">
							<div className="mb-10 text-center">
								<h2 className="text-4xl font-bold text-foreground">Upcoming family events</h2>
								<p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
									Additional events and updates added by the family team.
								</p>
							</div>

							<div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
								{snapshot.events.map((eventItem, index) => (
									<motion.div
										key={eventItem.id}
										initial={{ opacity: 0, y: 24 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ duration: 0.5, delay: index * 0.08 }}
										className="rounded-3xl border border-border/60 bg-card p-7 shadow-sm"
									>
										<div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl gradient-burgundy text-white mb-5">
											<CalendarDays className="h-5 w-5" />
										</div>
										<h3 className="text-2xl font-bold text-foreground">{eventItem.title}</h3>
										<p className="mt-3 text-muted-foreground">
											{eventItem.description || 'Details will be shared here as the family schedule is finalized.'}
										</p>
										<div className="mt-6 space-y-3 text-sm text-muted-foreground">
											<div className="flex items-start gap-3">
												<Clock3 className="h-4 w-4 text-primary mt-0.5" />
												<p>{eventItem.starts_at ? formatDateTime(eventItem.starts_at) : 'Date and time coming soon'}</p>
											</div>
											<div className="flex items-start gap-3">
												<MapPin className="h-4 w-4 text-primary mt-0.5" />
												<p>{eventItem.location || 'Location coming soon'}</p>
											</div>
										</div>
										{eventItem.google_calendar_event_url && (
											<a
												href={eventItem.google_calendar_event_url}
												target="_blank"
												rel="noreferrer"
												className="mt-6 inline-flex items-center gap-2 rounded-xl gradient-burgundy text-white px-5 py-2.5 font-semibold text-sm"
											>
												<ClipboardList className="h-4 w-4" />
												Register / View event
											</a>
										)}
									</motion.div>
								))}
							</div>
						</div>
					</section>
				)}
			</div>
		</>
	);
};

export default EventsPage;
