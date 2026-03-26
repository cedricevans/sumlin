create extension if not exists pgcrypto;

create schema if not exists sumlin;

grant usage on schema sumlin to anon, authenticated, service_role;
grant all on all tables in schema sumlin to anon, authenticated, service_role;
grant all on all sequences in schema sumlin to anon, authenticated, service_role;
grant all on all routines in schema sumlin to anon, authenticated, service_role;

alter default privileges in schema sumlin grant all on tables to anon, authenticated, service_role;
alter default privileges in schema sumlin grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema sumlin grant all on routines to anon, authenticated, service_role;

create or replace function sumlin.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists sumlin.tenants (
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

create table if not exists sumlin.tenant_admins (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references sumlin.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  email text,
  role text not null check (role in ('owner', 'admin', 'finance', 'events')),
  created_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, user_id)
);

create table if not exists sumlin.tenant_admin_invites (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references sumlin.tenants(id) on delete cascade,
  email text not null,
  role text not null check (role in ('owner', 'admin', 'finance', 'events')),
  status text not null default 'pending' check (status in ('pending', 'claimed', 'revoked')),
  invited_by uuid references auth.users(id) on delete set null,
  claimed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, email)
);

create table if not exists sumlin.business_services (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references sumlin.tenants(id) on delete cascade,
  title text not null,
  category text not null,
  description text not null,
  price_label text,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists sumlin.events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references sumlin.tenants(id) on delete cascade,
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

create table if not exists sumlin.fundraiser_campaigns (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references sumlin.tenants(id) on delete cascade,
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

create table if not exists sumlin.fundraiser_orders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references sumlin.tenants(id) on delete cascade,
  campaign_id uuid references sumlin.fundraiser_campaigns(id) on delete set null,
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

create table if not exists sumlin.fundraiser_tickets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references sumlin.tenants(id) on delete cascade,
  order_id uuid not null references sumlin.fundraiser_orders(id) on delete cascade,
  ticket_number bigint generated always as identity unique,
  status text not null default 'active' check (status in ('active', 'void', 'winner')),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists sumlin.service_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references sumlin.tenants(id) on delete cascade,
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

create table if not exists sumlin.event_signups (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references sumlin.tenants(id) on delete cascade,
  event_id uuid not null references sumlin.events(id) on delete cascade,
  attendee_name text not null,
  email text not null,
  phone text,
  party_size integer not null default 1 check (party_size > 0),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'waitlist', 'cancelled')),
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace trigger tenants_set_updated_at
before update on sumlin.tenants
for each row
execute function sumlin.set_updated_at();

create or replace trigger tenant_admin_invites_set_updated_at
before update on sumlin.tenant_admin_invites
for each row
execute function sumlin.set_updated_at();

create or replace trigger business_services_set_updated_at
before update on sumlin.business_services
for each row
execute function sumlin.set_updated_at();

create or replace trigger events_set_updated_at
before update on sumlin.events
for each row
execute function sumlin.set_updated_at();

create or replace trigger fundraiser_campaigns_set_updated_at
before update on sumlin.fundraiser_campaigns
for each row
execute function sumlin.set_updated_at();

create or replace trigger fundraiser_orders_set_updated_at
before update on sumlin.fundraiser_orders
for each row
execute function sumlin.set_updated_at();

create or replace trigger service_requests_set_updated_at
before update on sumlin.service_requests
for each row
execute function sumlin.set_updated_at();

create or replace trigger event_signups_set_updated_at
before update on sumlin.event_signups
for each row
execute function sumlin.set_updated_at();

alter table sumlin.tenants enable row level security;
alter table sumlin.tenant_admins enable row level security;
alter table sumlin.tenant_admin_invites enable row level security;
alter table sumlin.business_services enable row level security;
alter table sumlin.events enable row level security;
alter table sumlin.fundraiser_campaigns enable row level security;
alter table sumlin.fundraiser_orders enable row level security;
alter table sumlin.fundraiser_tickets enable row level security;
alter table sumlin.service_requests enable row level security;
alter table sumlin.event_signups enable row level security;

drop policy if exists "public can read tenant profiles" on sumlin.tenants;
create policy "public can read tenant profiles"
on sumlin.tenants
for select
to anon, authenticated
using (true);

drop policy if exists "tenant admins can update tenant profiles" on sumlin.tenants;
create policy "tenant admins can update tenant profiles"
on sumlin.tenants
for update
to authenticated
using (
  exists (
    select 1
    from sumlin.tenant_admins ta
    where ta.tenant_id = tenants.id
      and ta.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from sumlin.tenant_admins ta
    where ta.tenant_id = tenants.id
      and ta.user_id = auth.uid()
  )
);

drop policy if exists "public can read services" on sumlin.business_services;
create policy "public can read services"
on sumlin.business_services
for select
to anon, authenticated
using (true);

drop policy if exists "public can read published events" on sumlin.events;
create policy "public can read published events"
on sumlin.events
for select
to anon, authenticated
using (status in ('planned', 'open', 'complete'));

drop policy if exists "public can create service requests" on sumlin.service_requests;
create policy "public can create service requests"
on sumlin.service_requests
for insert
to anon, authenticated
with check (true);

drop policy if exists "public can create event signups" on sumlin.event_signups;
create policy "public can create event signups"
on sumlin.event_signups
for insert
to anon, authenticated
with check (true);

drop policy if exists "tenant admins can read memberships" on sumlin.tenant_admins;
create policy "tenant admins can read memberships"
on sumlin.tenant_admins
for select
to authenticated
using (
  exists (
    select 1
    from sumlin.tenant_admins ta
    where ta.tenant_id = tenant_admins.tenant_id
      and ta.user_id = auth.uid()
  )
);

drop policy if exists "tenant admins can read invites" on sumlin.tenant_admin_invites;
create policy "tenant admins can read invites"
on sumlin.tenant_admin_invites
for select
to authenticated
using (
  exists (
    select 1
    from sumlin.tenant_admins ta
    where ta.tenant_id = tenant_admin_invites.tenant_id
      and ta.user_id = auth.uid()
  )
);

drop policy if exists "tenant admins can manage invites" on sumlin.tenant_admin_invites;
create policy "tenant admins can manage invites"
on sumlin.tenant_admin_invites
for insert
to authenticated
with check (
  exists (
    select 1
    from sumlin.tenant_admins ta
    where ta.tenant_id = tenant_admin_invites.tenant_id
      and ta.user_id = auth.uid()
      and ta.role in ('owner', 'admin')
  )
);

drop policy if exists "tenant admins can update invites" on sumlin.tenant_admin_invites;
create policy "tenant admins can update invites"
on sumlin.tenant_admin_invites
for update
to authenticated
using (
  exists (
    select 1
    from sumlin.tenant_admins ta
    where ta.tenant_id = tenant_admin_invites.tenant_id
      and ta.user_id = auth.uid()
      and ta.role in ('owner', 'admin')
  )
)
with check (
  exists (
    select 1
    from sumlin.tenant_admins ta
    where ta.tenant_id = tenant_admin_invites.tenant_id
      and ta.user_id = auth.uid()
      and ta.role in ('owner', 'admin')
  )
);

drop policy if exists "tenant admins can read orders" on sumlin.fundraiser_orders;
create policy "tenant admins can read orders"
on sumlin.fundraiser_orders
for select
to authenticated
using (
  exists (
    select 1
    from sumlin.tenant_admins ta
    where ta.tenant_id = fundraiser_orders.tenant_id
      and ta.user_id = auth.uid()
  )
);

drop policy if exists "tenant admins can update orders" on sumlin.fundraiser_orders;
create policy "tenant admins can update orders"
on sumlin.fundraiser_orders
for update
to authenticated
using (
  exists (
    select 1
    from sumlin.tenant_admins ta
    where ta.tenant_id = fundraiser_orders.tenant_id
      and ta.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from sumlin.tenant_admins ta
    where ta.tenant_id = fundraiser_orders.tenant_id
      and ta.user_id = auth.uid()
  )
);

drop policy if exists "tenant admins can read tickets" on sumlin.fundraiser_tickets;
create policy "tenant admins can read tickets"
on sumlin.fundraiser_tickets
for select
to authenticated
using (
  exists (
    select 1
    from sumlin.tenant_admins ta
    where ta.tenant_id = fundraiser_tickets.tenant_id
      and ta.user_id = auth.uid()
  )
);

drop policy if exists "tenant admins can read and manage requests" on sumlin.service_requests;
create policy "tenant admins can read and manage requests"
on sumlin.service_requests
for select
to authenticated
using (
  exists (
    select 1
    from sumlin.tenant_admins ta
    where ta.tenant_id = service_requests.tenant_id
      and ta.user_id = auth.uid()
  )
);

drop policy if exists "tenant admins can update requests" on sumlin.service_requests;
create policy "tenant admins can update requests"
on sumlin.service_requests
for update
to authenticated
using (
  exists (
    select 1
    from sumlin.tenant_admins ta
    where ta.tenant_id = service_requests.tenant_id
      and ta.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from sumlin.tenant_admins ta
    where ta.tenant_id = service_requests.tenant_id
      and ta.user_id = auth.uid()
  )
);

drop policy if exists "tenant admins can read event signups" on sumlin.event_signups;
create policy "tenant admins can read event signups"
on sumlin.event_signups
for select
to authenticated
using (
  exists (
    select 1
    from sumlin.tenant_admins ta
    where ta.tenant_id = event_signups.tenant_id
      and ta.user_id = auth.uid()
  )
);

drop policy if exists "tenant admins can update event signups" on sumlin.event_signups;
create policy "tenant admins can update event signups"
on sumlin.event_signups
for update
to authenticated
using (
  exists (
    select 1
    from sumlin.tenant_admins ta
    where ta.tenant_id = event_signups.tenant_id
      and ta.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from sumlin.tenant_admins ta
    where ta.tenant_id = event_signups.tenant_id
      and ta.user_id = auth.uid()
  )
);

drop policy if exists "tenant admins can read and manage events" on sumlin.events;
create policy "tenant admins can read and manage events"
on sumlin.events
for all
to authenticated
using (
  exists (
    select 1
    from sumlin.tenant_admins ta
    where ta.tenant_id = events.tenant_id
      and ta.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from sumlin.tenant_admins ta
    where ta.tenant_id = events.tenant_id
      and ta.user_id = auth.uid()
  )
);

drop policy if exists "tenant admins can manage services" on sumlin.business_services;
create policy "tenant admins can manage services"
on sumlin.business_services
for all
to authenticated
using (
  exists (
    select 1
    from sumlin.tenant_admins ta
    where ta.tenant_id = business_services.tenant_id
      and ta.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from sumlin.tenant_admins ta
    where ta.tenant_id = business_services.tenant_id
      and ta.user_id = auth.uid()
  )
);

create index if not exists business_services_tenant_sort_idx
on sumlin.business_services (tenant_id, sort_order, created_at);

create index if not exists events_tenant_start_idx
on sumlin.events (tenant_id, starts_at);

create index if not exists event_signups_tenant_created_idx
on sumlin.event_signups (tenant_id, created_at desc);

create index if not exists tenant_admin_invites_tenant_created_idx
on sumlin.tenant_admin_invites (tenant_id, created_at desc);

create or replace function sumlin.claim_tenant_admin_invite(target_slug text)
returns text
language plpgsql
security definer
set search_path = sumlin, public
as $$
declare
  target_tenant_id uuid;
  invite_row sumlin.tenant_admin_invites;
  jwt_email text;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  jwt_email := lower(coalesce(auth.jwt()->>'email', ''));

  if jwt_email = '' then
    return 'no_email';
  end if;

  select id
  into target_tenant_id
  from sumlin.tenants
  where slug = target_slug
  limit 1;

  if target_tenant_id is null then
    return 'tenant_missing';
  end if;

  select *
  into invite_row
  from sumlin.tenant_admin_invites
  where tenant_id = target_tenant_id
    and email = jwt_email
    and status = 'pending'
  order by created_at desc
  limit 1;

  if invite_row.id is null then
    return 'no_invite';
  end if;

  insert into sumlin.tenant_admins (tenant_id, user_id, email, role)
  values (target_tenant_id, auth.uid(), jwt_email, invite_row.role)
  on conflict (tenant_id, user_id) do update
  set email = excluded.email,
      role = excluded.role;

  update sumlin.tenant_admin_invites
  set status = 'claimed',
      claimed_by = auth.uid(),
      updated_at = timezone('utc', now())
  where id = invite_row.id;

  return 'claimed';
end;
$$;

grant execute on function sumlin.claim_tenant_admin_invite(text) to authenticated;

insert into sumlin.tenants (
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
  'A family business directory, event calendar, and reunion connection point.',
  'Browse family-owned businesses, post new listings, share event updates, and keep family signups in one place.',
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
  from sumlin.tenants
  where slug = 'sumlin'
)
insert into sumlin.tenant_admin_invites (tenant_id, email, role, status)
select tenant.id, '1bassdebi@gmail.com', 'owner', 'pending'
from tenant
where not exists (
  select 1
  from sumlin.tenant_admin_invites existing
  where existing.tenant_id = tenant.id
    and existing.email = '1bassdebi@gmail.com'
);
