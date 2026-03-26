create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  display_name text not null,
  reunion_year integer,
  support_email text,
  support_phone text,
  business_tagline text,
  business_summary text,
  cash_app_handle text,
  venmo_handle text,
  paypal_donate_url text,
  google_calendar_public_url text,
  google_calendar_embed_url text,
  primary_cta_label text default 'Support the reunion',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.tenant_admins (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'finance', 'events')),
  created_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, user_id)
);

create table if not exists public.business_services (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  title text not null,
  category text not null,
  description text not null,
  price_label text,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  title text not null,
  event_type text not null,
  status text not null default 'planned' check (status in ('planned', 'open', 'closed', 'complete', 'cancelled')),
  description text,
  location text,
  starts_at timestamptz,
  ends_at timestamptz,
  google_calendar_event_url text,
  intake_deadline timestamptz,
  capacity integer,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.fundraiser_campaigns (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  title text not null,
  slug text not null,
  description text,
  status text not null default 'active' check (status in ('draft', 'active', 'closed')),
  draw_at timestamptz,
  starts_at timestamptz,
  ends_at timestamptz,
  official_rules_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, slug)
);

create table if not exists public.fundraiser_orders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  campaign_id uuid references public.fundraiser_campaigns(id) on delete set null,
  reference_code text not null unique default upper(substring(replace(gen_random_uuid()::text, '-', '') from 1 for 10)),
  purchaser_name text not null,
  email text not null,
  phone text,
  address text,
  payment_method text not null check (payment_method in ('cashapp', 'venmo', 'paypal', 'cash', 'other')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'cancelled', 'refunded')),
  donation_amount_cents integer not null default 0,
  entry_count integer not null default 1 check (entry_count > 0),
  external_payment_reference text,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.fundraiser_tickets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  order_id uuid not null references public.fundraiser_orders(id) on delete cascade,
  ticket_number bigint generated always as identity unique,
  status text not null default 'active' check (status in ('active', 'void', 'winner')),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  category text not null,
  requester_name text not null,
  email text not null,
  phone text,
  event_type text,
  event_date date,
  budget_label text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'contacted', 'scheduled', 'closed')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace trigger tenants_set_updated_at
before update on public.tenants
for each row
execute function public.set_updated_at();

create or replace trigger events_set_updated_at
before update on public.events
for each row
execute function public.set_updated_at();

create or replace trigger fundraiser_campaigns_set_updated_at
before update on public.fundraiser_campaigns
for each row
execute function public.set_updated_at();

create or replace trigger fundraiser_orders_set_updated_at
before update on public.fundraiser_orders
for each row
execute function public.set_updated_at();

create or replace trigger service_requests_set_updated_at
before update on public.service_requests
for each row
execute function public.set_updated_at();

alter table public.tenants enable row level security;
alter table public.tenant_admins enable row level security;
alter table public.business_services enable row level security;
alter table public.events enable row level security;
alter table public.fundraiser_campaigns enable row level security;
alter table public.fundraiser_orders enable row level security;
alter table public.fundraiser_tickets enable row level security;
alter table public.service_requests enable row level security;

create policy "public can read tenant profiles"
on public.tenants
for select
to anon, authenticated
using (true);

create policy "public can read services"
on public.business_services
for select
to anon, authenticated
using (true);

create policy "public can read published events"
on public.events
for select
to anon, authenticated
using (status in ('planned', 'open', 'complete'));

create policy "public can read active campaigns"
on public.fundraiser_campaigns
for select
to anon, authenticated
using (status = 'active');

create policy "public can create service requests"
on public.service_requests
for insert
to anon, authenticated
with check (true);

create policy "tenant admins can read memberships"
on public.tenant_admins
for select
to authenticated
using (user_id = auth.uid());

create policy "tenant admins can read orders"
on public.fundraiser_orders
for select
to authenticated
using (
  exists (
    select 1
    from public.tenant_admins ta
    where ta.tenant_id = fundraiser_orders.tenant_id
      and ta.user_id = auth.uid()
  )
);

create policy "tenant admins can update orders"
on public.fundraiser_orders
for update
to authenticated
using (
  exists (
    select 1
    from public.tenant_admins ta
    where ta.tenant_id = fundraiser_orders.tenant_id
      and ta.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.tenant_admins ta
    where ta.tenant_id = fundraiser_orders.tenant_id
      and ta.user_id = auth.uid()
  )
);

create policy "tenant admins can read tickets"
on public.fundraiser_tickets
for select
to authenticated
using (
  exists (
    select 1
    from public.tenant_admins ta
    where ta.tenant_id = fundraiser_tickets.tenant_id
      and ta.user_id = auth.uid()
  )
);

create policy "tenant admins can read and manage requests"
on public.service_requests
for select
to authenticated
using (
  exists (
    select 1
    from public.tenant_admins ta
    where ta.tenant_id = service_requests.tenant_id
      and ta.user_id = auth.uid()
  )
);

create policy "tenant admins can update requests"
on public.service_requests
for update
to authenticated
using (
  exists (
    select 1
    from public.tenant_admins ta
    where ta.tenant_id = service_requests.tenant_id
      and ta.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.tenant_admins ta
    where ta.tenant_id = service_requests.tenant_id
      and ta.user_id = auth.uid()
  )
);

create policy "tenant admins can read and manage events"
on public.events
for all
to authenticated
using (
  exists (
    select 1
    from public.tenant_admins ta
    where ta.tenant_id = events.tenant_id
      and ta.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.tenant_admins ta
    where ta.tenant_id = events.tenant_id
      and ta.user_id = auth.uid()
  )
);

create policy "tenant admins can manage services"
on public.business_services
for all
to authenticated
using (
  exists (
    select 1
    from public.tenant_admins ta
    where ta.tenant_id = business_services.tenant_id
      and ta.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.tenant_admins ta
    where ta.tenant_id = business_services.tenant_id
      and ta.user_id = auth.uid()
  )
);

insert into public.tenants (
  slug,
  name,
  display_name,
  reunion_year,
  support_email,
  support_phone,
  business_tagline,
  business_summary,
  cash_app_handle,
  venmo_handle,
  paypal_donate_url,
  google_calendar_public_url,
  google_calendar_embed_url,
  primary_cta_label
)
values (
  'sumlin',
  'Sumlin',
  'Sumlin Family',
  2026,
  'info@sumlinfamily.com',
  '937-555-2026',
  'Family reunion support, milestone events, and legacy-centered planning.',
  'The Sumlin tenant powers reunion fundraising, birthday event coordination, family business inquiries, and admin management from one dashboard.',
  '$SumlinReunionClub',
  '@sumlin-family',
  '',
  '',
  '',
  'Support the reunion'
)
on conflict (slug) do update
set
  display_name = excluded.display_name,
  reunion_year = excluded.reunion_year,
  support_email = excluded.support_email,
  support_phone = excluded.support_phone,
  business_tagline = excluded.business_tagline,
  business_summary = excluded.business_summary,
  cash_app_handle = excluded.cash_app_handle,
  venmo_handle = excluded.venmo_handle,
  primary_cta_label = excluded.primary_cta_label;

with tenant as (
  select id
  from public.tenants
  where slug = 'sumlin'
)
insert into public.business_services (tenant_id, title, category, description, price_label, is_featured, sort_order)
select tenant.id, s.title, s.category, s.description, s.price_label, s.is_featured, s.sort_order
from tenant
cross join (
  values
    ('Sumlin Celebrations & Events', 'Events', 'Event coordination, family gatherings, milestone celebrations, and reunion support with a personal touch.', 'Dayton, Ohio', true, 10),
    ('Bass Family Catering', 'Food', 'Home-style catering, reunion meals, special event trays, and comfort food packages for gatherings large and small.', 'Cincinnati, Ohio', true, 20),
    ('Legacy Lens Photography', 'Photography', 'Family portraits, graduation sessions, reunion photos, and keepsake photography packages.', 'Serving Ohio and nearby states', false, 30),
    ('Dowell Travel Support', 'Travel', 'Travel planning help, group lodging suggestions, and family trip coordination for reunions and special events.', 'Remote support', false, 40),
    ('Cranford Home Repairs', 'Home Services', 'General repairs, painting, fixture installs, and home upkeep support for families who need trusted hands.', 'Northern Virginia', false, 50),
    ('Ronika Wellness Studio', 'Beauty', 'Beauty, self-care, and wellness services with a focus on confidence, care, and community.', 'Baltimore, Maryland', false, 60),
    ('Farley Family Childcare', 'Childcare', 'Warm and reliable childcare support for busy parents, date nights, and family events.', 'Dayton, Ohio', false, 70),
    ('Dowell Digital Help', 'Technology', 'Help with websites, basic design, social setup, and digital support for small family businesses.', 'Remote service', false, 80),
    ('Legacy Tee Co.', 'Retail', 'Custom shirts, reunion merchandise, and branded keepsakes for events, schools, and local groups.', 'Online orders available', true, 90),
    ('Bass Dessert Table', 'Food', 'Cakes, cobblers, banana pudding, and dessert trays for birthdays, showers, and family dinners.', 'Cincinnati, Ohio', false, 100),
    ('Sumlin Tax & Bookkeeping', 'Professional Services', 'Bookkeeping, tax prep support, and organized financial help for families and small businesses.', 'By appointment', false, 110),
    ('Family Touch Cleaning', 'Home Services', 'Residential cleaning, turnover support, and special occasion prep for homes and event spaces.', 'Dayton and surrounding areas', false, 120),
    ('Cranford Transportation', 'Transportation', 'Airport runs, local group transportation, and event-day rides for family gatherings and special dates.', 'Regional service', false, 130),
    ('Portraits by Kesha', 'Photography', 'Graduation, birthday, family, and branding shoots with edited galleries and print options.', 'Ohio and travel dates', false, 140),
    ('Soul Food Sunday Trays', 'Food', 'Sunday dinner trays, holiday pans, and comfort food packages for family celebrations.', 'Pickup and delivery options', false, 150),
    ('The Legacy Lounge', 'Events', 'Small event hosting, decor styling, and setup support for showers, birthdays, and family gatherings.', 'By quote', false, 160),
    ('Faith & Favor Boutique', 'Retail', 'Faith-inspired apparel, accessories, and gift items made for everyday wear and special occasions.', 'Shop online', false, 170),
    ('Family Fit Coaching', 'Wellness', 'Personal training, accountability coaching, and fitness plans built for real life and family schedules.', 'Virtual and in-person', false, 180),
    ('Dowell Insurance Guidance', 'Professional Services', 'Insurance reviews, policy guidance, and help understanding coverage options for families and entrepreneurs.', 'Consultation available', false, 190),
    ('Ronika Travel Planning', 'Travel', 'Cruise, group trip, and reunion travel planning with itinerary support and booking guidance.', 'Remote planning', false, 200)
) as s(title, category, description, price_label, is_featured, sort_order)
where not exists (
  select 1
  from public.business_services existing
  where existing.tenant_id = tenant.id
    and existing.title = s.title
);

with tenant as (
  select id
  from public.tenants
  where slug = 'sumlin'
)
insert into public.events (tenant_id, title, event_type, status, description, location, starts_at, ends_at, capacity)
select tenant.id, e.title, e.event_type, e.status, e.description, e.location, e.starts_at, e.ends_at, e.capacity
from tenant
cross join (
  values
    ('Reunion planning call', 'planning', 'planned', 'Monthly working session for officers, hosts, and volunteers.', 'Online', timezone('utc', now()) + interval '14 days', timezone('utc', now()) + interval '14 days 90 minutes', 30),
    ('Family birthday spotlight brunch', 'birthday', 'planned', 'Shared celebration for upcoming family birthdays and milestone announcements.', 'Dayton, Ohio', timezone('utc', now()) + interval '30 days', timezone('utc', now()) + interval '30 days 3 hours', 60),
    ('Raffle drawing and reunion sendoff', 'fundraiser', 'planned', 'Closing drawing and thank-you moment during reunion weekend.', 'Main reunion venue', timezone('utc', now()) + interval '60 days', timezone('utc', now()) + interval '60 days 2 hours', 200)
) as e(title, event_type, status, description, location, starts_at, ends_at, capacity)
where not exists (
  select 1
  from public.events existing
  where existing.tenant_id = tenant.id
    and existing.title = e.title
);

with tenant as (
  select id
  from public.tenants
  where slug = 'sumlin'
)
insert into public.fundraiser_campaigns (tenant_id, title, slug, description, status, starts_at, ends_at)
select tenant.id, '2026 reunion support drawing', '2026-reunion-support', 'Family support drawing and donation campaign for reunion hospitality and venue expenses.', 'active', timezone('utc', now()), timezone('utc', now()) + interval '90 days'
from tenant
where not exists (
  select 1
  from public.fundraiser_campaigns existing
  where existing.tenant_id = tenant.id
    and existing.slug = '2026-reunion-support'
);
