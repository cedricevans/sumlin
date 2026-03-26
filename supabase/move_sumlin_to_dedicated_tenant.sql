-- Move Sumlin records off a shared tenant and into the dedicated `sumlin` tenant.
-- Change `source_tenant_slug` below if your shared tenant is not literally named `public`.

begin;

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

do $$
declare
  source_tenant_slug text := 'public';
  target_tenant_slug text := 'sumlin';
  source_tenant_id uuid;
  target_tenant_id uuid;
begin
  select id into target_tenant_id
  from public.tenants
  where slug = target_tenant_slug;

  if target_tenant_id is null then
    raise exception 'Target tenant % was not created.', target_tenant_slug;
  end if;

  select id into source_tenant_id
  from public.tenants
  where slug = source_tenant_slug;

  if source_tenant_id is null then
    raise notice 'Source tenant % was not found. No reassignment was needed.', source_tenant_slug;
    return;
  end if;

  if source_tenant_id = target_tenant_id then
    raise notice 'Source tenant % is already the dedicated Sumlin tenant. No reassignment was needed.', source_tenant_slug;
    return;
  end if;

  update public.business_services
  set tenant_id = target_tenant_id,
      updated_at = timezone('utc', now())
  where tenant_id = source_tenant_id;

  update public.events
  set tenant_id = target_tenant_id,
      updated_at = timezone('utc', now())
  where tenant_id = source_tenant_id;

  update public.fundraiser_campaigns fc
  set tenant_id = target_tenant_id,
      updated_at = timezone('utc', now())
  where fc.tenant_id = source_tenant_id
    and not exists (
      select 1
      from public.fundraiser_campaigns existing
      where existing.tenant_id = target_tenant_id
        and existing.slug = fc.slug
    );

  update public.fundraiser_orders
  set tenant_id = target_tenant_id,
      updated_at = timezone('utc', now())
  where tenant_id = source_tenant_id;

  update public.fundraiser_tickets
  set tenant_id = target_tenant_id
  where tenant_id = source_tenant_id;

  update public.service_requests
  set tenant_id = target_tenant_id,
      updated_at = timezone('utc', now())
  where tenant_id = source_tenant_id;

  update public.event_signups
  set tenant_id = target_tenant_id,
      updated_at = timezone('utc', now())
  where tenant_id = source_tenant_id;

  update public.tenant_admins ta
  set tenant_id = target_tenant_id
  where ta.tenant_id = source_tenant_id
    and not exists (
      select 1
      from public.tenant_admins existing
      where existing.tenant_id = target_tenant_id
        and existing.user_id = ta.user_id
    );

  update public.tenant_admin_invites tai
  set tenant_id = target_tenant_id,
      updated_at = timezone('utc', now())
  where tai.tenant_id = source_tenant_id
    and not exists (
      select 1
      from public.tenant_admin_invites existing
      where existing.tenant_id = target_tenant_id
        and lower(existing.email) = lower(tai.email)
    );

  raise notice 'Moved Sumlin records from tenant % to dedicated tenant %.', source_tenant_slug, target_tenant_slug;
end;
$$;

commit;

select
  t.slug,
  count(distinct bs.id) as business_count,
  count(distinct e.id) as event_count,
  count(distinct fo.id) as order_count,
  count(distinct es.id) as signup_count,
  count(distinct ta.id) as admin_count
from public.tenants t
left join public.business_services bs on bs.tenant_id = t.id
left join public.events e on e.tenant_id = t.id
left join public.fundraiser_orders fo on fo.tenant_id = t.id
left join public.event_signups es on es.tenant_id = t.id
left join public.tenant_admins ta on ta.tenant_id = t.id
where t.slug in ('public', 'sumlin')
group by t.slug
order by t.slug;
