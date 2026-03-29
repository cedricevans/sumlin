import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, Clock3, ExternalLink, MapPin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchBusinessSnapshot, formatDateTime } from '@/lib/sumlinData';

const starterEvents = [
	{
		id: 'starter-1',
		title: 'Family planning calls',
		description: 'Stay tuned for check-in calls, committee updates, and reunion planning touchpoints.',
		location: 'Online',
		starts_at: '',
	},
	{
		id: 'starter-2',
		title: 'Fundraiser and payment reminders',
		description: 'Ticket deadlines, family support reminders, and fundraiser milestones will be posted here.',
		location: 'Sitewide updates',
		starts_at: '',
	},
	{
		id: 'starter-3',
		title: 'Reunion weekend schedule',
		description: 'When the full weekend agenda is ready, this page will hold the calendar view and each event detail in one place.',
		location: 'Reunion 2026',
		starts_at: '',
	},
];

const EventsPage = () => {
	const [snapshot, setSnapshot] = useState({
		tenant: null,
		services: [],
		events: [],
		status: 'loading',
		error: null,
	});

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
	const supportEmail = tenant?.support_email || 'info@sumlinfamily.com';
	const calendarPublicUrl = tenant?.google_calendar_public_url || '';
	const calendarEmbedUrl = tenant?.google_calendar_embed_url || '';
	const visibleEvents = useMemo(
		() => (snapshot.events.length > 0 ? snapshot.events : starterEvents),
		[snapshot.events],
	);

	return (
		<>
			<Helmet>
				<title>Events & Family Calendar | Sumlin Family Reunion 2026</title>
				<meta
					name="description"
					content="View the Sumlin family calendar, upcoming reunion events, planning calls, and public event updates in one place."
				/>
			</Helmet>

			<div className="min-h-screen bg-background">
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
									Calendar of Events
								</div>
								<h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
									One place for family events and calendar updates.
								</h1>
								<p className="text-lg text-white/80 max-w-2xl leading-relaxed mb-8">
									Check here for upcoming family events, planning calls, reunion activities, and calendar updates all in one place.
								</p>
								<div className="flex flex-wrap gap-4">
									{calendarPublicUrl ? (
										<Button asChild className="gradient-metallic h-12 rounded-xl px-6 font-bold text-black hover:brightness-110">
											<a href={calendarPublicUrl} target="_blank" rel="noreferrer">
												Open Google Calendar
											</a>
										</Button>
										) : (
											<Button asChild className="gradient-metallic h-12 rounded-xl px-6 font-bold text-black hover:brightness-110">
												<Link to="/newsletter">Open newsletter archive</Link>
											</Button>
										)}
									<Button asChild variant="outline" className="h-12 rounded-xl px-6 font-semibold border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white">
										<Link to="/contact">Contact the family team</Link>
									</Button>
								</div>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, scale: 0.96 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.7, delay: 0.08 }}
								className="rounded-[2rem] border border-white/15 bg-white/95 p-8 shadow-2xl"
							>
								<h2 className="text-3xl font-bold text-foreground mb-4">How this page works</h2>
								<div className="space-y-4 text-muted-foreground">
									<p>
										When the family calendar is available, it will appear here alongside the rest of the event updates.
									</p>
									<p>
										Until then, the event cards below will keep everyone informed about what is coming up next.
									</p>
									<div className="rounded-2xl bg-muted/60 p-5">
										<p className="text-sm font-semibold text-primary mb-2">Current page status</p>
										<p>
											{calendarEmbedUrl
												? 'Google Calendar embed is active on this page.'
												: snapshot.status === 'loading'
													? 'Loading family event data.'
													: 'Calendar embed is not set yet, so the page is showing the simple event layout.'}
										</p>
									</div>
									<div className="rounded-2xl bg-muted/60 p-5">
										<p className="text-sm font-semibold text-primary mb-2">Support email</p>
										<p>{supportEmail}</p>
									</div>
								</div>
							</motion.div>
						</div>
					</div>
				</section>

				<section className="section-spacing bg-background">
					<div className="container-custom">
						<div className="flex items-center justify-between gap-4 flex-wrap mb-8">
							<div>
								<h2 className="text-4xl font-bold text-foreground">Family calendar</h2>
								<p className="text-lg text-muted-foreground mt-3 max-w-3xl">
									Use the live calendar when it is available, or rely on the event cards below as the public source of truth.
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
									Public calendar link
								</a>
							)}
						</div>

						{calendarEmbedUrl ? (
							<div className="rounded-[2rem] border border-border/60 bg-card p-4 md:p-6 shadow-lg overflow-hidden">
								<div className="aspect-[4/5] md:aspect-[16/10] overflow-hidden rounded-[1.5rem] border border-border/50">
									<iframe
										title="Sumlin family calendar"
										src={calendarEmbedUrl}
										className="h-full w-full"
									/>
								</div>
							</div>
						) : (
								<div className="rounded-[2rem] border border-dashed border-border bg-muted/40 p-8 text-center">
									<Mail className="h-10 w-10 text-primary mx-auto mb-4" />
									<h3 className="text-2xl font-bold text-foreground">Calendar embed not added yet</h3>
									<p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
										The family calendar will appear here once it is connected. Until then, this page will still share the latest event information below.
									</p>
								</div>
						)}
					</div>
				</section>

				<section className="section-spacing bg-muted/40">
					<div className="container-custom">
						<div className="mb-10 text-center">
							<h2 className="text-4xl font-bold text-foreground">Upcoming family events</h2>
							<p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
								These cards are ready for live event records, but they also keep the page useful while the calendar is being finalized.
							</p>
						</div>

						<div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
							{visibleEvents.map((eventItem, index) => (
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
											className="mt-6 inline-flex items-center gap-2 font-semibold text-primary hover:text-primary/80"
										>
											Open event link
											<ExternalLink className="h-4 w-4" />
										</a>
									)}
								</motion.div>
							))}
						</div>
					</div>
				</section>
			</div>
		</>
	);
};

export default EventsPage;
