import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
	CalendarDays,
	CreditCard,
	Facebook,
	Globe,
	HeartHandshake,
	Instagram,
	Mail,
	MapPin,
	Send,
	Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	FAMILY_CONTACT_INFO,
	FAMILY_OFFICERS,
	fetchBusinessSnapshot,
	submitServiceRequest,
} from '@/lib/sumlinData';
import { useToast } from '@/hooks/use-toast';

const helpPaths = [
	{
		title: 'Reunion questions',
		description: 'Need updates, planning details, or help getting connected before the next gathering?',
		link: '/reunion-2026',
		linkLabel: 'View reunion page',
		icon: Users,
	},
	{
		title: 'Fundraiser support',
		description: 'Questions about tickets, donations, payment handles, or fundraiser rules start here.',
		link: '/donate',
		linkLabel: 'Open donation page',
		icon: CreditCard,
	},
	{
		title: 'Family business inquiries',
		description: 'Share a business, request event support, or connect with family-owned services.',
		link: '/family-business',
		linkLabel: 'Visit Business Corner',
		icon: HeartHandshake,
	},
	{
		title: 'Portrait sessions',
		description: 'Reach out about family portraits, keepsake sessions, and memory-making moments.',
		link: '/family-portraits',
		linkLabel: 'See portrait options',
		icon: CalendarDays,
	},
];

const initialFormData = {
	requester_name: '',
	email: '',
	phone: '',
	category: 'Reunion Support',
	event_type: 'General Question',
	event_date: '',
	budget_label: '',
	message: '',
};

const Contact = () => {
	const { toast } = useToast();
	const [snapshot, setSnapshot] = useState({
		tenant: null,
		services: [],
		events: [],
		status: 'loading',
		error: null,
	});
	const [formData, setFormData] = useState(initialFormData);
	const [saving, setSaving] = useState(false);

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
	const supportEmail = tenant?.support_email || FAMILY_CONTACT_INFO.email;
	const cashAppHandle = tenant?.cash_app_handle || '$SumlinReunionClub';

	const contactChannels = [
		{
			icon: Mail,
			title: 'Family email',
			content: supportEmail,
			subtitle: 'Best for general questions and follow-up.',
			href: `mailto:${supportEmail}`,
			isInternal: false,
		},
		{
			icon: Globe,
			title: 'Website',
			content: FAMILY_CONTACT_INFO.websiteUrl,
			subtitle: 'Start here for reunion updates, fundraiser details, and family news.',
			href: FAMILY_CONTACT_INFO.websiteUrl,
			isInternal: false,
		},
		{
			icon: Instagram,
			title: 'Instagram',
			content: FAMILY_CONTACT_INFO.instagramHandle,
			subtitle: 'Follow for family highlights and reunion updates.',
			href: FAMILY_CONTACT_INFO.instagramUrl,
			isInternal: false,
		},
		{
			icon: Facebook,
			title: 'Facebook',
			content: FAMILY_CONTACT_INFO.facebookLabel,
			subtitle: 'Search this page name on Facebook to stay connected with the family.',
			href: FAMILY_CONTACT_INFO.facebookSearchUrl,
			isInternal: false,
		},
	];

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((current) => ({
			...current,
			[name]: value,
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setSaving(true);

		const result = await submitServiceRequest(formData);

		if (result.ok) {
			toast({
				title: 'Message sent',
				description: result.message,
			});
			setFormData(initialFormData);
		} else {
			toast({
				title: 'Unable to send message',
				description: result.message,
				variant: 'destructive',
			});
		}

		setSaving(false);
	};

	return (
		<>
			<Helmet>
				<title>Contact the Family | Sumlin Family Reunion 2026</title>
				<meta
					name="description"
					content="Contact the Sumlin Family Reunion team for reunion updates, fundraiser questions, family business support, and portrait inquiries."
				/>
			</Helmet>

			<div className="min-h-screen bg-background">
				<section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.18),_transparent_40%),linear-gradient(135deg,_rgba(70,6,28,1)_0%,_rgba(34,16,18,1)_55%,_rgba(128,87,22,1)_100%)]">
					<div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-15" />
					<div className="container-custom relative z-10 py-20 md:py-28">
						<div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
							<motion.div
								initial={{ opacity: 0, y: 24 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.7 }}
							>
								<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur-sm">
									<HeartHandshake className="h-4 w-4 text-[#d4af37]" />
									Family Support and Reunion Coordination
								</div>
								<h1 className="mb-6 text-5xl font-bold leading-tight text-white md:text-6xl">
									A contact page that feels like the Sumlin family.
								</h1>
								<p className="mb-8 max-w-2xl text-lg leading-relaxed text-white/80">
									Whether you need reunion details, fundraiser help, business support, or a direct family contact, this page is built around the real work of bringing the Sumlin family together.
								</p>

								<div className="flex flex-wrap gap-4">
									<Button asChild className="gradient-metallic h-12 rounded-xl px-6 font-bold text-black hover:brightness-110">
										<a href={`mailto:${supportEmail}`}>Email the family team</a>
									</Button>
									<Button
										asChild
										variant="outline"
										className="h-12 rounded-xl border-white/20 bg-white/10 px-6 font-semibold text-white hover:bg-white/15 hover:text-white"
									>
										<Link to="/family-business">Explore Business Corner</Link>
									</Button>
								</div>

								<div className="mt-10 grid gap-4 sm:grid-cols-2">
									<div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
										<p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
											Support Email
										</p>
										<p className="mt-2 text-lg font-semibold text-white">{supportEmail}</p>
									</div>
									<div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
										<p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
											Official Website
										</p>
										<p className="mt-2 text-lg font-semibold text-white">{FAMILY_CONTACT_INFO.websiteUrl}</p>
									</div>
								</div>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, scale: 0.96 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.7, delay: 0.1 }}
								className="relative"
							>
								<div className="absolute inset-0 gradient-metallic rounded-[2rem] blur-3xl opacity-20" />
								<div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/95 p-8 shadow-2xl">
									<div className="flex items-center gap-4 border-b border-border/60 pb-6">
										<img
											src="https://horizons-cdn.hostinger.com/6ddbc4c1-b479-4ef4-be4a-ff36b8b1842e/84d9ab8efcec41799c1c6b1d68bfb5f9.jpg"
											alt="Sumlin family crest"
											className="h-20 w-20 rounded-2xl object-cover shadow-lg"
										/>
										<div>
											<p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
												Rooted in Faith, United in Legacy
											</p>
											<h2 className="mt-2 text-3xl font-bold text-foreground">Stay connected</h2>
										</div>
									</div>

									<div className="mt-6 space-y-4">
										<div className="rounded-2xl bg-muted/60 p-5">
											<p className="text-sm font-semibold text-primary">Project focus</p>
											<p className="mt-2 text-muted-foreground">
												This site supports reunion planning, fundraiser coordination, family business visibility, and shared memory-making across generations.
											</p>
										</div>

										<div className="rounded-2xl bg-muted/60 p-5">
											<p className="text-sm font-semibold text-primary">Live page status</p>
											<p className="mt-2 text-muted-foreground">
												{snapshot.status === 'live'
													? 'Live family contact details and updates are connected.'
													: snapshot.status === 'loading'
														? 'Loading the latest family support details.'
														: 'Showing starter contact details while live updates are still being connected.'}
											</p>
										</div>

										<div className="rounded-2xl bg-muted/60 p-5">
											<p className="text-sm font-semibold text-primary">Established family channels</p>
											<div className="mt-3 space-y-3 text-sm text-muted-foreground">
												<div className="rounded-xl border border-border/50 bg-background/80 p-4">
													<p className="font-semibold text-foreground">Instagram</p>
													<p className="mt-1">{FAMILY_CONTACT_INFO.instagramHandle}</p>
												</div>
												<div className="rounded-xl border border-border/50 bg-background/80 p-4">
													<p className="font-semibold text-foreground">Facebook</p>
													<p className="mt-1">{FAMILY_CONTACT_INFO.facebookLabel}</p>
												</div>
												<div className="rounded-xl border border-border/50 bg-background/80 p-4">
													<p className="font-semibold text-foreground">Cash App</p>
													<p className="mt-1">{cashAppHandle}</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</motion.div>
						</div>
					</div>
				</section>

				<section className="section-spacing bg-background">
					<div className="container-custom">
						<div className="mb-10 text-center">
							<h2 className="text-4xl font-bold text-foreground">Reach the right family contact</h2>
							<p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
								These are the contact paths people actually need when they visit the Sumlin site.
							</p>
						</div>

						<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
							{contactChannels.map((channel, index) => {
								const Icon = channel.icon;
								const cardClassName =
									'block h-full rounded-3xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl';

								return (
									<motion.div
										key={channel.title}
										initial={{ opacity: 0, y: 24 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ duration: 0.5, delay: index * 0.08 }}
										className="h-full"
									>
										{channel.isInternal ? (
											<Link to={channel.href} className={cardClassName}>
												<div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-burgundy text-white shadow-burgundy">
													<Icon className="h-6 w-6" />
												</div>
												<h3 className="text-2xl font-bold text-foreground">{channel.title}</h3>
												<p className="mt-3 text-lg font-semibold text-primary">{channel.content}</p>
												<p className="mt-3 text-sm leading-relaxed text-muted-foreground">{channel.subtitle}</p>
											</Link>
										) : (
											<a href={channel.href} className={cardClassName}>
												<div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-burgundy text-white shadow-burgundy">
													<Icon className="h-6 w-6" />
												</div>
												<h3 className="text-2xl font-bold text-foreground">{channel.title}</h3>
												<p className="mt-3 text-lg font-semibold text-primary">{channel.content}</p>
												<p className="mt-3 text-sm leading-relaxed text-muted-foreground">{channel.subtitle}</p>
											</a>
										)}
									</motion.div>
								);
							})}
						</div>
					</div>
				</section>

				<section className="section-spacing bg-muted/40">
					<div className="container-custom">
						<div className="mb-10 text-center">
							<h2 className="text-4xl font-bold text-foreground">Built around how this project works</h2>
							<p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
								The contact page should move people toward the parts of the site that support the reunion, not send them into a dead end.
							</p>
						</div>

						<div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
							{helpPaths.map((item, index) => {
								const Icon = item.icon;

								return (
									<motion.div
										key={item.title}
										initial={{ opacity: 0, y: 24 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ duration: 0.5, delay: index * 0.08 }}
										className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm"
									>
										<div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
											<Icon className="h-5 w-5" />
										</div>
										<h3 className="text-2xl font-bold text-foreground">{item.title}</h3>
										<p className="mt-3 text-muted-foreground">{item.description}</p>
										<Link
											to={item.link}
											className="mt-6 inline-flex items-center font-semibold text-primary hover:text-primary/80"
										>
											{item.linkLabel}
										</Link>
									</motion.div>
								);
							})}
						</div>
					</div>
				</section>

				<section className="section-spacing bg-background">
					<div className="container-custom">
						<div className="grid gap-8 xl:grid-cols-[0.88fr_1.12fr]">
							<motion.div
								initial={{ opacity: 0, x: -24 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6 }}
								className="rounded-[2rem] border border-border/60 bg-card p-8 shadow-lg"
							>
								<div className="mb-8">
									<p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
										Direct Email
									</p>
									<h2 className="mt-3 text-4xl font-bold text-foreground">Family officers</h2>
									<p className="mt-4 text-muted-foreground">
										If you need a direct conversation, these are the family contacts already surfaced elsewhere in the project.
									</p>
								</div>

								<div className="space-y-4">
									{FAMILY_OFFICERS.map((officer) => (
										<div
											key={officer.name}
											className="flex items-center justify-between gap-4 rounded-2xl border border-border/50 bg-muted/40 p-4"
										>
											<div className="flex items-center gap-4">
												<div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-metallic font-bold text-black shadow-gold">
													{officer.name.split(' ').map((part) => part[0]).join('')}
												</div>
												<div>
													<p className="font-semibold text-foreground">{officer.name}</p>
													<p className="text-sm text-muted-foreground">Family officer email</p>
												</div>
											</div>
											<a
												href={`mailto:${officer.email}`}
												className="text-sm font-semibold text-primary hover:text-primary/80"
											>
												{officer.email}
											</a>
										</div>
									))}
								</div>

								<div className="mt-8 rounded-2xl border border-border/60 bg-muted/40 p-5">
									<div className="flex items-start gap-3">
										<MapPin className="mt-1 h-5 w-5 text-primary" />
										<div>
											<p className="font-semibold text-foreground">Where this project lives</p>
											<p className="mt-2 text-sm text-muted-foreground">
												Sumlin Family Reunion 2026 ties together planning, payments, storytelling, portraits, and family business support instead of treating contact as a generic storefront page.
											</p>
										</div>
									</div>
								</div>

								{snapshot.error && (
									<div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-muted-foreground">
										{snapshot.error.message}
									</div>
								)}
							</motion.div>

							<motion.div
								initial={{ opacity: 0, x: 24 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.08 }}
								className="rounded-[2rem] border border-border/60 bg-card p-8 shadow-lg"
							>
								<div className="mb-8">
									<p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
										Send a Request
									</p>
									<h2 className="mt-3 text-4xl font-bold text-foreground">Message the organizing team</h2>
									<p className="mt-4 text-muted-foreground">
										This form now feeds the same request system used by the rest of the project, so messages can be tracked instead of disappearing behind placeholder content.
									</p>
								</div>

								<form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
									<div>
										<label htmlFor="requester_name" className="mb-2 block text-sm font-medium text-foreground">
											Your name
										</label>
										<input
											id="requester_name"
											name="requester_name"
											type="text"
											value={formData.requester_name}
											onChange={handleChange}
											placeholder="Enter your full name"
											required
										/>
									</div>

									<div>
										<label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
											Email address
										</label>
										<input
											id="email"
											name="email"
											type="email"
											value={formData.email}
											onChange={handleChange}
											placeholder="you@example.com"
											required
										/>
									</div>

									<div>
										<label htmlFor="phone" className="mb-2 block text-sm font-medium text-foreground">
											Phone number
										</label>
										<input
											id="phone"
											name="phone"
											type="tel"
											value={formData.phone}
											onChange={handleChange}
											placeholder="Best number for a callback"
										/>
									</div>

									<div>
										<label htmlFor="category" className="mb-2 block text-sm font-medium text-foreground">
											Main topic
										</label>
										<select id="category" name="category" value={formData.category} onChange={handleChange}>
											<option>Reunion Support</option>
											<option>Fundraiser Payment</option>
											<option>Business Corner</option>
											<option>Family Portraits</option>
											<option>Family Legacy</option>
										</select>
									</div>

									<div>
										<label htmlFor="event_type" className="mb-2 block text-sm font-medium text-foreground">
											Request type
										</label>
										<select id="event_type" name="event_type" value={formData.event_type} onChange={handleChange}>
											<option>General Question</option>
											<option>Registration Help</option>
											<option>Payment Confirmation</option>
											<option>Business Listing</option>
											<option>Portrait Booking</option>
											<option>Family History Update</option>
										</select>
									</div>

									<div>
										<label htmlFor="event_date" className="mb-2 block text-sm font-medium text-foreground">
											Event date or deadline
										</label>
										<input
											id="event_date"
											name="event_date"
											type="date"
											value={formData.event_date}
											onChange={handleChange}
										/>
									</div>

									<div className="md:col-span-2">
										<label htmlFor="budget_label" className="mb-2 block text-sm font-medium text-foreground">
											Best time to reach you
										</label>
										<input
											id="budget_label"
											name="budget_label"
											type="text"
											value={formData.budget_label}
											onChange={handleChange}
											placeholder="Example: Weeknights after 6 PM"
										/>
									</div>

									<div className="md:col-span-2">
										<label htmlFor="message" className="mb-2 block text-sm font-medium text-foreground">
											Message
										</label>
										<textarea
											id="message"
											name="message"
											value={formData.message}
											onChange={handleChange}
											rows={6}
											placeholder="Tell the family team what you need."
											required
										/>
									</div>

									<div className="md:col-span-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
										<p className="max-w-xl text-sm text-muted-foreground">
											Questions submitted here can cover reunion planning, fundraiser support, family business requests, and other coordination needs.
										</p>
										<Button
											type="submit"
											disabled={saving}
											className="gradient-burgundy h-12 rounded-xl px-6 font-semibold text-white hover:brightness-110"
										>
											<Send className="mr-2 h-4 w-4" />
											{saving ? 'Sending...' : 'Send message'}
										</Button>
									</div>
								</form>
							</motion.div>
						</div>
					</div>
				</section>
			</div>
		</>
	);
};

export default Contact;
