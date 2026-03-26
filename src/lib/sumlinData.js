import { getSupabaseConnectionLabel, supabase, sumlinDb } from '@/lib/supabase';

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
	businesses: fallbackServices,
	tickets: [
		{ id: 'T-301', order_id: 'SUM-1041', ticket_number: 301, status: 'active' },
		{ id: 'T-302', order_id: 'SUM-1041', ticket_number: 302, status: 'active' },
		{ id: 'T-303', order_id: 'SUM-1040', ticket_number: 303, status: 'active' },
	],
	events: [
		{
			id: 'event-fallback-1',
			title: 'Family planning call',
			event_type: 'planning',
			status: 'open',
			location: 'Online',
			starts_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
		},
		{
			id: 'event-fallback-2',
			title: 'Summer business spotlight',
			event_type: 'business',
			status: 'planned',
			location: 'Dayton, Ohio',
			starts_at: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
		},
	],
	eventSignups: [
		{
			id: 'signup-1',
			attendee_name: 'Alicia Sumlin',
			email: 'family@example.com',
			party_size: 2,
			status: 'confirmed',
			events: { title: 'Family planning call', starts_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
		},
	],
	admins: [
		{
			id: 'admin-1',
			email: '1bassdebi@gmail.com',
			role: 'owner',
			created_at: new Date().toISOString(),
		},
	],
	adminInvites: [],
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
			message: 'Supabase is connected, but the Sumlin schema is not ready yet. Run supabase/sumlin_schema.sql, expose the sumlin schema in Supabase API settings, and then rerun the move script if needed.',
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

async function getTenantIdForSlug(slug) {
	const tenantResult = await sumlinDb
		.from('tenants')
		.select('id')
		.eq('slug', slug)
		.maybeSingle();

	if (tenantResult.error || !tenantResult.data?.id) {
		return {
			id: null,
			error: normalizeError(tenantResult.error) || {
				type: 'tenant_missing',
				message: 'The Sumlin tenant is not available yet.',
			},
		};
	}

	return {
		id: tenantResult.data.id,
		error: null,
	};
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

	const tenantResult = await sumlinDb
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
				message: 'The Sumlin tenant record was not found in the sumlin schema. Run supabase/sumlin_schema.sql to seed it.',
			},
		};
	}

	const [servicesResult, eventsResult] = await Promise.all([
		sumlinDb
			.from('business_services')
			.select('*')
			.eq('tenant_id', tenantId)
			.order('sort_order', { ascending: true }),
		sumlinDb
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

	const tenantResult = await getTenantIdForSlug(slug);

	if (tenantResult.error || !tenantResult.id) {
		return {
			ok: false,
			message: tenantResult.error?.message || 'The Sumlin tenant is not available yet.',
		};
	}

	const insertResult = await sumlinDb
		.from('service_requests')
		.insert({
			tenant_id: tenantResult.id,
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

export async function submitEventSignup(payload, slug = DEFAULT_TENANT_SLUG) {
	if (!supabase) {
		return {
			ok: false,
			message: 'Supabase is not configured yet.',
		};
	}

	const tenantResult = await getTenantIdForSlug(slug);

	if (tenantResult.error || !tenantResult.id) {
		return {
			ok: false,
			message: tenantResult.error?.message || 'The Sumlin tenant is not available yet.',
		};
	}

	const insertResult = await sumlinDb
		.from('event_signups')
		.insert({
			tenant_id: tenantResult.id,
			event_id: payload.event_id,
			attendee_name: payload.attendee_name,
			email: payload.email,
			phone: payload.phone,
			party_size: Number(payload.party_size) || 1,
			notes: payload.notes,
		});

	if (insertResult.error) {
		return {
			ok: false,
			message: normalizeError(insertResult.error)?.message || 'Unable to save the signup right now.',
		};
	}

	return {
		ok: true,
		message: 'Signup received. The family admin team can see it in the dashboard.',
	};
}

export async function saveBusinessListing(payload, slug = DEFAULT_TENANT_SLUG) {
	if (!supabase) {
		return {
			ok: false,
			message: 'Supabase is not configured yet.',
		};
	}

	const tenantResult = await getTenantIdForSlug(slug);

	if (tenantResult.error || !tenantResult.id) {
		return {
			ok: false,
			message: tenantResult.error?.message || 'The Sumlin tenant is not available yet.',
		};
	}

	const values = {
		tenant_id: tenantResult.id,
		title: payload.title,
		category: payload.category,
		description: payload.description,
		price_label: payload.price_label,
		is_featured: Boolean(payload.is_featured),
		sort_order: Number(payload.sort_order) || 0,
	};

	const result = payload.id
		? await sumlinDb
			.from('business_services')
			.update(values)
			.eq('id', payload.id)
			.eq('tenant_id', tenantResult.id)
		: await sumlinDb
			.from('business_services')
			.insert(values);

	if (result.error) {
		return {
			ok: false,
			message: normalizeError(result.error)?.message || 'Unable to save the business listing.',
		};
	}

	return {
		ok: true,
		message: payload.id ? 'Business listing updated.' : 'Business listing added.',
	};
}

export async function saveEvent(payload, slug = DEFAULT_TENANT_SLUG) {
	if (!supabase) {
		return {
			ok: false,
			message: 'Supabase is not configured yet.',
		};
	}

	const tenantResult = await getTenantIdForSlug(slug);

	if (tenantResult.error || !tenantResult.id) {
		return {
			ok: false,
			message: tenantResult.error?.message || 'The Sumlin tenant is not available yet.',
		};
	}

	const values = {
		tenant_id: tenantResult.id,
		title: payload.title,
		event_type: payload.event_type,
		status: payload.status,
		description: payload.description,
		location: payload.location,
		starts_at: payload.starts_at || null,
		ends_at: payload.ends_at || null,
		capacity: payload.capacity ? Number(payload.capacity) : null,
		google_calendar_event_url: payload.google_calendar_event_url || null,
		intake_deadline: payload.intake_deadline || null,
	};

	const result = payload.id
		? await sumlinDb
			.from('events')
			.update(values)
			.eq('id', payload.id)
			.eq('tenant_id', tenantResult.id)
		: await sumlinDb
			.from('events')
			.insert(values);

	if (result.error) {
		return {
			ok: false,
			message: normalizeError(result.error)?.message || 'Unable to save the event.',
		};
	}

	return {
		ok: true,
		message: payload.id ? 'Event updated.' : 'Event added.',
	};
}

export async function saveTenantProfile(payload, slug = DEFAULT_TENANT_SLUG) {
	if (!supabase) {
		return {
			ok: false,
			message: 'Supabase is not configured yet.',
		};
	}

	const values = {
		display_name: payload.display_name,
		support_email: payload.support_email,
		support_phone: payload.support_phone,
		business_tagline: payload.business_tagline,
		business_summary: payload.business_summary,
		cash_app_handle: payload.cash_app_handle,
		venmo_handle: payload.venmo_handle,
		paypal_donate_url: payload.paypal_donate_url || null,
		google_calendar_public_url: payload.google_calendar_public_url || null,
		google_calendar_embed_url: payload.google_calendar_embed_url || null,
		primary_cta_label: payload.primary_cta_label,
	};

	const result = await sumlinDb
		.from('tenants')
		.update(values)
		.eq('slug', slug);

	if (result.error) {
		return {
			ok: false,
			message: normalizeError(result.error)?.message || 'Unable to save the family settings.',
		};
	}

	return {
		ok: true,
		message: 'Family settings updated.',
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

export async function claimAdminInvite(slug = DEFAULT_TENANT_SLUG) {
	if (!supabase) {
		return { ok: false, message: 'Supabase is not configured yet.' };
	}

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session) {
		return { ok: false, message: 'No active admin session found.' };
	}

	const result = await sumlinDb.rpc('claim_tenant_admin_invite', {
		target_slug: slug,
	});

	if (result.error) {
		return {
			ok: false,
			message: normalizeError(result.error)?.message || 'Unable to claim admin access.',
		};
	}

	return {
		ok: true,
		status: result.data || 'no_invite',
	};
}

export async function signUpAdmin({ email, password }, slug = DEFAULT_TENANT_SLUG) {
	if (!supabase) {
		return { ok: false, message: 'Supabase is not configured yet.' };
	}

	const normalizedEmail = email.trim().toLowerCase();
	const { data, error } = await supabase.auth.signUp({
		email: normalizedEmail,
		password,
	});

	if (error) {
		return { ok: false, message: error.message };
	}

	if (data.session) {
		await claimAdminInvite(slug);
		return {
			ok: true,
			message: 'Admin account created and signed in.',
		};
	}

	return {
		ok: true,
		message: 'Account created. Check your email to confirm the invite, then sign in.',
	};
}

export async function signInAdmin({ email, password }, slug = DEFAULT_TENANT_SLUG) {
	if (!supabase) {
		return { ok: false, message: 'Supabase is not configured yet.' };
	}

	const { error } = await supabase.auth.signInWithPassword({
		email: email.trim().toLowerCase(),
		password,
	});

	if (error) {
		return { ok: false, message: error.message };
	}

	const claimResult = await claimAdminInvite(slug);

	return {
		ok: true,
		claimStatus: claimResult.ok ? claimResult.status : 'no_invite',
	};
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

export async function saveAdminInvite(payload, slug = DEFAULT_TENANT_SLUG) {
	if (!supabase) {
		return {
			ok: false,
			message: 'Supabase is not configured yet.',
		};
	}

	const tenantResult = await getTenantIdForSlug(slug);

	if (tenantResult.error || !tenantResult.id) {
		return {
			ok: false,
			message: tenantResult.error?.message || 'The Sumlin tenant is not available yet.',
		};
	}

	const values = {
		tenant_id: tenantResult.id,
		email: payload.email.trim().toLowerCase(),
		role: payload.role,
		status: 'pending',
	};

	const result = await sumlinDb
		.from('tenant_admin_invites')
		.upsert(values, {
			onConflict: 'tenant_id,email',
		});

	if (result.error) {
		return {
			ok: false,
			message: normalizeError(result.error)?.message || 'Unable to save the admin invite.',
		};
	}

	return {
		ok: true,
		message: 'Admin invite saved. Once that person creates an account and signs in, access will be claimed automatically.',
	};
}

export async function fetchAdminDashboard(slug = DEFAULT_TENANT_SLUG) {
	if (!supabase) {
		return {
			mode: 'fallback',
			tenant: fallbackTenant,
			error: {
				type: 'missing_config',
				message: 'Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to connect the Sumlin dashboard.',
			},
			...fallbackDashboard,
		};
	}

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (session) {
		await claimAdminInvite(slug);
	}

	const currentUserId = session?.user?.id;

	const membershipResult = await sumlinDb
		.from('tenant_admins')
		.select('tenant_id, role, tenants!inner(*)')
		.eq('tenants.slug', slug)
		.eq('user_id', currentUserId)
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
				message: 'This account does not have admin access yet. Ask Debi to add your email in the admin panel, then sign in again to claim access.',
			},
			...fallbackDashboard,
		};
	}

	const tenant = membership.tenants || fallbackTenant;
	const tenantId = membership.tenant_id;

	const [ordersResult, requestsResult, ticketsResult, eventsResult, businessesResult, signupsResult, adminsResult, invitesResult] = await Promise.all([
		sumlinDb
			.from('fundraiser_orders')
			.select('*')
			.eq('tenant_id', tenantId)
			.order('created_at', { ascending: false })
			.limit(8),
		sumlinDb
			.from('service_requests')
			.select('*')
			.eq('tenant_id', tenantId)
			.order('created_at', { ascending: false })
			.limit(8),
		sumlinDb
			.from('fundraiser_tickets')
			.select('id, order_id, ticket_number, status')
			.eq('tenant_id', tenantId)
			.order('ticket_number', { ascending: false })
			.limit(8),
		sumlinDb
			.from('events')
			.select('*')
			.eq('tenant_id', tenantId)
			.order('starts_at', { ascending: true })
			.limit(8),
		sumlinDb
			.from('business_services')
			.select('*')
			.eq('tenant_id', tenantId)
			.order('sort_order', { ascending: true })
			.limit(25),
		sumlinDb
			.from('event_signups')
			.select('id, attendee_name, email, phone, party_size, status, created_at, events(title, starts_at)')
			.eq('tenant_id', tenantId)
			.order('created_at', { ascending: false })
			.limit(12),
		sumlinDb
			.from('tenant_admins')
			.select('id, user_id, email, role, created_at')
			.eq('tenant_id', tenantId)
			.order('created_at', { ascending: true }),
		sumlinDb
			.from('tenant_admin_invites')
			.select('id, email, role, status, created_at')
			.eq('tenant_id', tenantId)
			.order('created_at', { ascending: false })
			.limit(20),
	]);

	const dashboardError = normalizeError(
		ordersResult.error
		|| requestsResult.error
		|| ticketsResult.error
		|| eventsResult.error
		|| businessesResult.error
		|| signupsResult.error
		|| adminsResult.error
		|| invitesResult.error
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
	const businesses = businessesResult.data || [];
	const eventSignups = signupsResult.data || [];
	const admins = adminsResult.data || [];
	const adminInvites = invitesResult.data || [];

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
		businesses,
		tickets,
		events: upcomingEvents,
		eventSignups,
		admins,
		adminInvites,
		currentAdminRole: membership.role,
	};
}

export const adminOnboardingSteps = [
	'Run supabase/sumlin_schema.sql in the Supabase SQL editor to create the dedicated Sumlin schema.',
	'In Supabase API settings, add sumlin to the exposed schemas list.',
	'If Sumlin data still lives in public, run supabase/move_sumlin_from_public_to_sumlin_schema.sql next.',
	'Create the first admin account for 1bassdebi@gmail.com in Supabase Authentication.',
	'Sign in at /admin so the owner invite can be claimed automatically.',
	'Add your real PayPal donate URL and Google Calendar public/embed URLs in the tenants row.',
	'Use the admin dashboard to add businesses, add events, review family signups, and invite more admins.',
];
