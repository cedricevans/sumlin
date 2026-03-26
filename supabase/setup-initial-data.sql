-- Initial setup script for Sumlin Family database
-- Run this in your Supabase SQL Editor after running schema.sql

-- Insert the Sumlin family tenant
INSERT INTO public.tenants (
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
) VALUES (
  'sumlin',
  'Sumlin',
  'Sumlin Family',
  2026,
  'info@sumlinfamily.com',
  '937-555-2026',
  'A directory of family-owned businesses, services, and community connections.',
  'Explore and support family-owned businesses across the Sumlin family network, from food and events to photography, travel, and professional services.',
  '$SumlinReunionClub',
  '@sumlin-family',
  '',
  '',
  '',
  'Support the reunion'
) ON CONFLICT (slug) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  reunion_year = EXCLUDED.reunion_year,
  support_email = EXCLUDED.support_email,
  support_phone = EXCLUDED.support_phone,
  business_tagline = EXCLUDED.business_tagline,
  business_summary = EXCLUDED.business_summary,
  cash_app_handle = EXCLUDED.cash_app_handle,
  venmo_handle = EXCLUDED.venmo_handle,
  primary_cta_label = EXCLUDED.primary_cta_label;

-- Note: Admin users will be automatically added when they sign up
-- To manually add Debi as the first owner, you need her auth user ID
-- After she signs up, run:
-- INSERT INTO public.tenant_admins (tenant_id, user_id, email, role)
-- SELECT id, 'USER_ID_FROM_AUTH_USERS', '1bassdebi@gmail.com', 'owner'
-- FROM public.tenants WHERE slug = 'sumlin';

-- Add some sample business services
DO $$
DECLARE
  v_tenant_id uuid;
BEGIN
  SELECT id INTO v_tenant_id FROM public.tenants WHERE slug = 'sumlin';
  
  INSERT INTO public.business_services (tenant_id, title, category, description, price_label, is_featured, sort_order)
  VALUES
    (v_tenant_id, 'Sumlin Celebrations & Events', 'Events', 'Event coordination, family gatherings, milestone celebrations, and reunion support with a personal touch.', 'Dayton, Ohio', true, 1),
    (v_tenant_id, 'Bass Family Catering', 'Food', 'Home-style catering, reunion meals, special event trays, and comfort food packages for gatherings large and small.', 'Cincinnati, Ohio', true, 2),
    (v_tenant_id, 'Legacy Lens Photography', 'Photography', 'Family portraits, graduation sessions, reunion photos, and keepsake photography packages.', 'Serving Ohio and nearby states', false, 3),
    (v_tenant_id, 'Dowell Travel Support', 'Travel', 'Travel planning help, group lodging suggestions, and family trip coordination for reunions and special events.', 'Remote support', false, 4)
  ON CONFLICT DO NOTHING;
END $$;

-- Add sample events
DO $$
DECLARE
  v_tenant_id uuid;
BEGIN
  SELECT id INTO v_tenant_id FROM public.tenants WHERE slug = 'sumlin';
  
  INSERT INTO public.events (tenant_id, title, event_type, status, description, location, starts_at, capacity)
  VALUES
    (v_tenant_id, 'Family Planning Call', 'family', 'open', 'Join us for a family planning call to discuss reunion details.', 'Online via Zoom', NOW() + INTERVAL '7 days', 50),
    (v_tenant_id, 'Summer Business Spotlight', 'business', 'planned', 'Showcase of family businesses and services.', 'Dayton, Ohio', NOW() + INTERVAL '21 days', 100),
    (v_tenant_id, 'Sumlin Family Reunion 2026', 'reunion', 'planned', 'The main reunion celebration for the Sumlin family.', 'To be announced', '2026-07-04 12:00:00', 200)
  ON CONFLICT DO NOTHING;
END $$;

SELECT 'Setup complete! Sumlin family tenant and sample data created.' as message;
