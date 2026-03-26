-- Run `supabase/sumlin_schema.sql` first.
-- Then run this script to move Sumlin app records out of the shared `public` schema.
-- Change `source_tenant_slug` below if the Sumlin rows in `public.tenants` are not tagged with `public`.

begin;

do $$
declare
  source_tenant_slug text := 'public';
  source_tenant_id uuid;
  target_tenant_id uuid;
begin
  select id into source_tenant_id
  from public.tenants
  where slug = source_tenant_slug;

  select id into target_tenant_id
  from sumlin.tenants
  where slug = 'sumlin';

  if target_tenant_id is null then
    raise exception 'Run supabase/sumlin_schema.sql first so sumlin.tenants exists.';
  end if;

  if source_tenant_id is null then
    raise notice 'No source tenant with slug % was found in public.tenants.', source_tenant_slug;
    return;
  end if;

  insert into sumlin.business_services (id, tenant_id, title, category, description, price_label, is_featured, sort_order, created_at, updated_at)
  select id, target_tenant_id, title, category, description, price_label, is_featured, sort_order, created_at, updated_at
  from public.business_services
  where tenant_id = source_tenant_id
  on conflict (id) do nothing;

  insert into sumlin.events (id, tenant_id, title, event_type, status, description, location, starts_at, ends_at, google_calendar_event_url, intake_deadline, capacity, created_at, updated_at)
  select id, target_tenant_id, title, event_type, status, description, location, starts_at, ends_at, google_calendar_event_url, intake_deadline, capacity, created_at, updated_at
  from public.events
  where tenant_id = source_tenant_id
  on conflict (id) do nothing;

  insert into sumlin.fundraiser_campaigns (id, tenant_id, title, slug, description, status, draw_at, starts_at, ends_at, official_rules_url, created_at, updated_at)
  select id, target_tenant_id, title, slug, description, status, draw_at, starts_at, ends_at, official_rules_url, created_at, updated_at
  from public.fundraiser_campaigns
  where tenant_id = source_tenant_id
  on conflict (id) do nothing;

  insert into sumlin.fundraiser_orders (id, tenant_id, campaign_id, reference_code, purchaser_name, email, phone, address, payment_method, payment_status, donation_amount_cents, entry_count, external_payment_reference, notes, created_by, created_at, updated_at)
  select id, target_tenant_id, campaign_id, reference_code, purchaser_name, email, phone, address, payment_method, payment_status, donation_amount_cents, entry_count, external_payment_reference, notes, created_by, created_at, updated_at
  from public.fundraiser_orders
  where tenant_id = source_tenant_id
  on conflict (id) do nothing;

  insert into sumlin.fundraiser_tickets (id, tenant_id, order_id, status, created_at)
  select id, target_tenant_id, order_id, status, created_at
  from public.fundraiser_tickets
  where tenant_id = source_tenant_id
  on conflict (id) do nothing;

  insert into sumlin.service_requests (id, tenant_id, category, requester_name, email, phone, event_type, event_date, budget_label, message, status, created_at, updated_at)
  select id, target_tenant_id, category, requester_name, email, phone, event_type, event_date, budget_label, message, status, created_at, updated_at
  from public.service_requests
  where tenant_id = source_tenant_id
  on conflict (id) do nothing;

  insert into sumlin.event_signups (id, tenant_id, event_id, attendee_name, email, phone, party_size, status, notes, created_at, updated_at)
  select id, target_tenant_id, event_id, attendee_name, email, phone, party_size, status, notes, created_at, updated_at
  from public.event_signups
  where tenant_id = source_tenant_id
  on conflict (id) do nothing;

  insert into sumlin.tenant_admins (id, tenant_id, user_id, email, role, created_at)
  select id, target_tenant_id, user_id, email, role, created_at
  from public.tenant_admins
  where tenant_id = source_tenant_id
  on conflict (id) do nothing;

  insert into sumlin.tenant_admin_invites (id, tenant_id, email, role, status, invited_by, claimed_by, created_at, updated_at)
  select id, target_tenant_id, email, role, status, invited_by, claimed_by, created_at, updated_at
  from public.tenant_admin_invites
  where tenant_id = source_tenant_id
  on conflict (id) do nothing;

  delete from public.fundraiser_tickets where tenant_id = source_tenant_id;
  delete from public.event_signups where tenant_id = source_tenant_id;
  delete from public.service_requests where tenant_id = source_tenant_id;
  delete from public.fundraiser_orders where tenant_id = source_tenant_id;
  delete from public.fundraiser_campaigns where tenant_id = source_tenant_id;
  delete from public.events where tenant_id = source_tenant_id;
  delete from public.business_services where tenant_id = source_tenant_id;
  delete from public.tenant_admin_invites where tenant_id = source_tenant_id;
  delete from public.tenant_admins where tenant_id = source_tenant_id;

  raise notice 'Moved Sumlin rows from public schema tenant % into sumlin schema tenant sumlin.', source_tenant_slug;
end;
$$;

commit;

select 'public' as schema_name, count(*) as tenants from public.tenants
union all
select 'sumlin' as schema_name, count(*) as tenants from sumlin.tenants;
