import { getSupabaseConnectionLabel, supabase } from '@/lib/supabase';

export const DEFAULT_TENANT_SLUG = 'sumlin';

export const fundraiserRules = {
	title: 'Sumlin Family Reunion fundraiser disclaimer and entry rules',
	lastUpdated: 'March 26, 2026',
	sections: [
		{
			title: 'Donation and entry notice',
			items: [
				'No purchase or donation is necessary to submit an entry request.',
				'A donation does not increase or improve the odds of being selected.',
				'All qualified entries must be handled on substantially equal terms.',
			],
		},
		{
			title: 'Use of funds',
			items: [
				'Family support donations are intended to help reunion expenses such as venue, food, hospitality, and shared event logistics.',
				'Administrative records should be retained for donations, entry requests, payments received, and any prizes awarded.',
			],
		},
		{
			title: 'Payment channels',
			items: [
				'Cash App, Venmo, PayPal, and other peer-payment channels should be treated as payment methods only.',
				'Ticket numbers or entries should be issued from the admin system after the family confirms a payment or accepts a free entry request.',
				'PayPal donation links should return to this site, but final ticket issuance should still happen from the admin panel after the record is created.',
			],
		},
		{
			title: 'Administrative safeguard',
			items: [
				'This page is an operational disclaimer, not legal advice.',
				'Before taking live payments, the family should confirm the final program structure, rules, and entity status with Ohio counsel or a qualified advisor.',
			],
		},
	],
};

const fallbackTenant = {
	slug: DEFAULT_TENANT_SLUG,
	name: 'Sumlin',
	display_name: 'Sumlin Family',
	reunion_year: 2026,
	support_email: 'info@sumlinfamily.com',
	support_phone: '937-555-2026',
	business_tagline: 'A directory of family-owned businesses, services, and community connections.',
	business_summary:
		'Explore and support family-owned businesses across the Sumlin family network, from food and events to photography, travel, and professional services.',
	cash_app_handle: '$SumlinReunionClub',
	venmo_handle: '@sumlin-family',
	paypal_donate_url: '',
	google_calendar_public_url: '',
	google_calendar_embed_url: '',
	primary_cta_label: 'Support the reunion',
};

const fallbackServices = [
	{
		id: 'service-reunion',
		title: 'Sumlin Celebrations & Events',
		category: 'Events',
		description:
			'Event coordination, family gatherings, milestone celebrations, and reunion support with a personal touch.',
		price_label: 'Dayton, Ohio',
		is_featured: true,
	},
	{
		id: 'service-birthdays',
		title: 'Bass Family Catering',
		category: 'Food',
		description:
			'Home-style catering, reunion meals, special event trays, and comfort food packages for gatherings large and small.',
		price_label: 'Cincinnati, Ohio',
		is_featured: true,
	},
	{
		id: 'service-travel',
		title: 'Legacy Lens Photography',
		category: 'Photography',
		description:
			'Family portraits, graduation sessions, reunion photos, and keepsake photography packages.',
		price_label: 'Serving Ohio and nearby states',
		is_featured: false,
	},
	{
		id: 'service-legacy',
		title: 'Dowell Travel Support',
		category: 'Travel',
		description:
			'Travel planning help, group lodging suggestions, and family trip coordination for reunions and special events.',
		price_label: 'Remote support',
		is_featured: false,
	},
	{
		id: 'service-5',
		title: 'Cranford Home Repairs',
		category: 'Home Services',
		description:
			'General repairs, painting, fixture installs, and home upkeep support for families who need trusted hands.',
		price_label: 'Northern Virginia',
		is_featured: false,
	},
	{
		id: 'service-6',
		title: 'Ronika Wellness Studio',
		category: 'Beauty',
		description:
			'Beauty, self-care, and wellness services with a focus on confidence, care, and community.',
		price_label: 'Baltimore, Maryland',
		is_featured: false,
	},
	{
		id: 'service-7',
		title: 'Farley Family Childcare',
		category: 'Childcare',
		description:
			'Warm and reliable childcare support for busy parents, date nights, and family events.',
		price_label: 'Dayton, Ohio',
		is_featured: false,
	},
	{
		id: 'service-8',
		title: 'Dowell Digital Help',
		category: 'Technology',
		description:
			'Help with websites, basic design, social setup, and digital support for small family businesses.',
		price_label: 'Remote service',
		is_featured: false,
	},
	{
		id: 'service-9',
		title: 'Legacy Tee Co.',
		category: 'Retail',
		description:
			'Custom shirts, reunion merchandise, and branded keepsakes for events, schools, and local groups.',
		price_label: 'Online orders available',
		is_featured: true,
	},
	{
		id: 'service-10',
		title: 'Bass Dessert Table',
		category: 'Food',
		description:
			'Cakes, cobblers, banana pudding, and dessert trays for birthdays, showers, and family dinners.',
		price_label: 'Cincinnati, Ohio',
		is_featured: false,
	},
	{
		id: 'service-11',
		title: 'Sumlin Tax & Bookkeeping',
		category: 'Professional Services',
		description:
			'Bookkeeping, tax prep support, and organized financial help for families and small businesses.',
		price_label: 'By appointment',
		is_featured: false,
	},
	{
		id: 'service-12',
		title: 'Family Touch Cleaning',
		category: 'Home Services',
		description:
			'Residential cleaning, turnover support, and special occasion prep for homes and event spaces.',
		price_label: 'Dayton and surrounding areas',
		is_featured: false,
	},
	{
		id: 'service-13',
		title: 'Cranford Transportation',
		category: 'Transportation',
		description:
			'Airport runs, local group transportation, and event-day rides for family gatherings and special dates.',
		price_label: 'Regional service',
		is_featured: false,
	},
	{
		id: 'service-14',
		title: 'Portraits by Kesha',
		category: 'Photography',
		description:
			'Graduation, birthday, family, and branding shoots with edited galleries and print options.',
		price_label: 'Ohio and travel dates',
		is_featured: false,
	},
	{
		id: 'service-15',
		title: 'Soul Food Sunday Trays',
		category: 'Food',
		description:
			'Sunday dinner trays, holiday pans, and comfort food packages for family celebrations.',
		price_label: 'Pickup and delivery options',
		is_featured: false,
	},
	{
		id: 'service-16',
		title: 'The Legacy Lounge',
		category: 'Events',
		description:
			'Small event hosting, decor styling, and setup support for showers, birthdays, and family gatherings.',
		price_label: 'By quote',
		is_featured: false,
	},
	{
		id: 'service-17',
		title: 'Faith & Favor Boutique',
		category: 'Retail',
		description:
			'Faith-inspired apparel, accessories, and gift items made for everyday wear and special occasions.',
		price_label: 'Shop online',
		is_featured: false,
	},
	{
		id: 'service-18',
		title: 'Family Fit Coaching',
		category: 'Wellness',
		description:
			'Personal training, accountability coaching, and fitness plans built for real life and family schedules.',
		price_label: 'Virtual and in-person',
		is_featured: false,
	},
	{
		id: 'service-19',
		title: 'Dowell Insurance Guidance',
		category: 'Professional Services',
		description:
			'Insurance reviews, policy guidance, and help understanding coverage options for families and entrepreneurs.',
		price_label: 'Consultation available',
		is_featured: false,
	},
	{
		id: 'service-20',
		title: 'Ronika Travel Planning',
		category: 'Travel',
		description:
			'Cruise, group trip, and reunion travel planning with itinerary support and booking guidance.',
		price_label: 'Remote planning',
		is_featured: false,
	},
];

const fallbackEvents = [];

const fallbackDashboard = {
	kpis: [
		{ label: 'Pending payments', value: '6', detail: 'Needs manual confirmation in Cash App, Venmo, or PayPal.' },
		{ label: 'Active tickets', value: '124', detail: 'Issued after payment or free-entry confirmation.' },
		{ label: 'Open service requests', value: '4', detail: 'Family business inquiries waiting for follow-up.' },
		{ label: 'Upcoming events', value: '3', detail: 'Shared through Google Calendar instead of local scheduling.' },
	],
	recentOrders: [
		{ id: 'SUM-1042', purchaser_name: 'Alicia Sumlin', payment_method: 'cashapp', payment_status: 'pending', entry_count: 8, donation_amount_cents: 2500 },
		{ id: 'SUM-1041', purchaser_name: 'Marcus Dowell', payment_method: 'paypal', payment_status: 'paid', entry_count: 12, donation_amount_cents: 5000 },
		{ id: 'SUM-1040', purchaser_name: 'Debi Bass', payment_method: 'venmo', payment_status: 'paid', entry_count: 5, donation_amount_cents: 1000 },
	],
	serviceRequests: [
		{ id: 'REQ-1', requester_name: 'Carrie Farley', category: 'birthday', status: 'new', event_date: '2026-05-08' },
		{ id: 'REQ-2', requester_name: 'Mike Cranford', category: 'reunion', status: 'contacted', event_date: '2026-06-14' },
	],
	tickets: [
		{ id: 'T-301', order_id: 'SUM-1041', ticket_number: 301, status: 'active' },
		{ id: 'T-302', order_id: 'SUM-1041', ticket_number: 302, status: 'active' },
		{ id: 'T-303', order_id: 'SUM-1040', ticket_number: 303, status: 'active' },
	],
};

function sortByDate(items, key) {
	return [...items].sort((left, right) => {
		const leftValue = left?.[key] ? new Date(left[key]).getTime() : 0;
		const rightValue = right?.[key] ? new Date(right[key]).getTime() : 0;
		return leftValue - rightValue;
	});
}

function normalizeError(error) {
	if (!error) {
		return null;
	}

	const message = `${error.message || ''} ${error.details || ''}`.toLowerCase();

	if (
		message.includes('relation')
		|| message.includes('schema cache')
		|| message.includes('does not exist')
	) {
		return {
			type: 'schema_missing',
			message: 'Supabase is connected, but the schema has not been created yet. Run supabase/schema.sql in the dashboard SQL editor.',
		};
	}

	return {
		type: 'query_failed',
		message: error.message || 'Supabase query failed.',
	};
}

export function formatDateTime(value) {
	if (!value) {
		return 'TBD';
	}

	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	}).format(new Date(value));
}

export function formatMoney(cents) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	}).format((cents || 0) / 100);
}

export async function fetchBusinessSnapshot(slug = DEFAULT_TENANT_SLUG) {
	if (!supabase) {
		return {
			tenant: fallbackTenant,
			services: fallbackServices,
			events: fallbackEvents,
			status: getSupabaseConnectionLabel(),
			error: null,
		};
	}

	const tenantResult = await supabase
		.from('tenants')
		.select('*')
		.eq('slug', slug)
		.maybeSingle();

	if (tenantResult.error) {
		return {
			tenant: fallbackTenant,
			services: fallbackServices,
			events: fallbackEvents,
			status: 'fallback',
			error: normalizeError(tenantResult.error),
		};
	}

	const tenant = tenantResult.data || fallbackTenant;
	const tenantId = tenant.id;

	if (!tenantId) {
		return {
			tenant,
			services: fallbackServices,
			events: fallbackEvents,
			status: 'fallback',
			error: {
				type: 'tenant_missing',
				message: 'The Sumlin tenant record was not found. Run supabase/schema.sql to seed it.',
			},
		};
	}

	const [servicesResult, eventsResult] = await Promise.all([
		supabase
			.from('business_services')
			.select('*')
			.eq('tenant_id', tenantId)
			.order('sort_order', { ascending: true }),
		supabase
			.from('events')
			.select('*')
			.eq('tenant_id', tenantId)
			.order('starts_at', { ascending: true }),
	]);

	const dataError = normalizeError(servicesResult.error || eventsResult.error);

	return {
		tenant,
		services: servicesResult.data?.length ? servicesResult.data : fallbackServices,
		events: eventsResult.data?.length ? sortByDate(eventsResult.data, 'starts_at') : fallbackEvents,
		status: dataError ? 'fallback' : 'live',
		error: dataError,
	};
}

export async function submitServiceRequest(payload, slug = DEFAULT_TENANT_SLUG) {
	if (!supabase) {
		return {
			ok: false,
			message: 'Supabase is not configured yet.',
		};
	}

	const tenantResult = await supabase
		.from('tenants')
		.select('id')
		.eq('slug', slug)
		.maybeSingle();

	if (tenantResult.error || !tenantResult.data?.id) {
		return {
			ok: false,
			message: normalizeError(tenantResult.error)?.message || 'The Sumlin tenant is not available yet.',
		};
	}

	const insertResult = await supabase
		.from('service_requests')
		.insert({
			tenant_id: tenantResult.data.id,
			category: payload.category,
			requester_name: payload.requester_name,
			email: payload.email,
			phone: payload.phone,
			event_type: payload.event_type,
			event_date: payload.event_date || null,
			budget_label: payload.budget_label,
			message: payload.message,
		});

	if (insertResult.error) {
		return {
			ok: false,
			message: normalizeError(insertResult.error)?.message || 'Unable to submit the request right now.',
		};
	}

	return {
		ok: true,
		message: 'Your request was saved. The family admin team can now review it in the dashboard.',
	};
}

export async function getAdminSession() {
	if (!supabase) {
		return null;
	}

	const {
		data: { session },
	} = await supabase.auth.getSession();

	return session;
}

export async function signInAdmin({ email, password }) {
	if (!supabase) {
		return { ok: false, message: 'Supabase is not configured yet.' };
	}

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		return { ok: false, message: error.message };
	}

	return { ok: true };
}

export async function signOutAdmin() {
	if (!supabase) {
		return;
	}

	await supabase.auth.signOut();
}

export function watchAdminSession(callback) {
	if (!supabase) {
		return () => {};
	}

	const {
		data: { subscription },
	} = supabase.auth.onAuthStateChange((_event, session) => {
		callback(session);
	});

	return () => {
		subscription.unsubscribe();
	};
}

export async function fetchAdminDashboard(slug = DEFAULT_TENANT_SLUG) {
	if (!supabase) {
		return {
			mode: 'fallback',
			tenant: fallbackTenant,
			error: {
				type: 'missing_config',
				message: 'Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to connect the dashboard.',
			},
			...fallbackDashboard,
		};
	}

	const membershipResult = await supabase
		.from('tenant_admins')
		.select('tenant_id, role, tenants!inner(*)')
		.eq('tenants.slug', slug)
		.limit(1)
		.maybeSingle();

	if (membershipResult.error) {
		return {
			mode: 'fallback',
			tenant: fallbackTenant,
			error: normalizeError(membershipResult.error),
			...fallbackDashboard,
		};
	}

	const membership = membershipResult.data;

	if (!membership?.tenant_id) {
		return {
			mode: 'fallback',
			tenant: fallbackTenant,
			error: {
				type: 'membership_missing',
				message: 'Sign in with an admin user and add that user to tenant_admins for the Sumlin tenant.',
			},
			...fallbackDashboard,
		};
	}

	const tenant = membership.tenants || fallbackTenant;
	const tenantId = membership.tenant_id;

	const [ordersResult, requestsResult, ticketsResult, eventsResult] = await Promise.all([
		supabase
			.from('fundraiser_orders')
			.select('*')
			.eq('tenant_id', tenantId)
			.order('created_at', { ascending: false })
			.limit(8),
		supabase
			.from('service_requests')
			.select('*')
			.eq('tenant_id', tenantId)
			.order('created_at', { ascending: false })
			.limit(8),
		supabase
			.from('fundraiser_tickets')
			.select('id, order_id, ticket_number, status')
			.eq('tenant_id', tenantId)
			.order('ticket_number', { ascending: false })
			.limit(8),
		supabase
			.from('events')
			.select('*')
			.eq('tenant_id', tenantId)
			.order('starts_at', { ascending: true })
			.limit(8),
	]);

	const dashboardError = normalizeError(
		ordersResult.error || requestsResult.error || ticketsResult.error || eventsResult.error,
	);

	if (dashboardError) {
		return {
			mode: 'fallback',
			tenant,
			error: dashboardError,
			...fallbackDashboard,
		};
	}

	const recentOrders = ordersResult.data || [];
	const serviceRequests = requestsResult.data || [];
	const tickets = ticketsResult.data || [];
	const upcomingEvents = eventsResult.data || [];

	const pendingPayments = recentOrders.filter((order) => order.payment_status === 'pending').length;
	const activeTickets = tickets.filter((ticket) => ticket.status === 'active').length;
	const openRequests = serviceRequests.filter((request) => request.status !== 'closed').length;

	return {
		mode: 'live',
		tenant,
		error: null,
		kpis: [
			{ label: 'Pending payments', value: String(pendingPayments), detail: 'Orders waiting for manual confirmation.' },
			{ label: 'Active tickets', value: String(activeTickets), detail: 'Current tickets available for the drawing.' },
			{ label: 'Open service requests', value: String(openRequests), detail: 'New or contacted family business requests.' },
			{ label: 'Upcoming events', value: String(upcomingEvents.length), detail: 'Google Calendar-linked events in the near term.' },
		],
		recentOrders,
		serviceRequests,
		tickets,
		events: upcomingEvents,
	};
}

export const adminOnboardingSteps = [
	'Run supabase/schema.sql in the Supabase SQL editor to create the tables, policies, and Sumlin tenant seed data.',
	'Create an admin user in Supabase Authentication.',
	'Insert that user into tenant_admins with role owner or admin for the Sumlin tenant.',
	'Add your real PayPal donate URL and Google Calendar public/embed URLs in the tenants row.',
	'Use the admin dashboard to review payment records, tickets, and family business requests.',
];
