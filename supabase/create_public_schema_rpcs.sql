-- ============================================================
-- PUBLIC SCHEMA RPCs
-- Recreates all app functions in the public schema so the app
-- can use supabase (no .schema('sumlin') override) and still
-- call every RPC via /rest/v1/rpc/...
--
-- Run this once in Supabase SQL Editor.
-- All functions delegate to sumlin schema tables.
-- ============================================================


-- ── Helper: is_tenant_admin ──────────────────────────────
CREATE OR REPLACE FUNCTION public.is_tenant_admin(p_tenant_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.tenant_admins
    WHERE tenant_id = p_tenant_id AND user_id = auth.uid()
  );
$$;


-- ── claim_tenant_admin_invite ────────────────────────────
CREATE OR REPLACE FUNCTION public.claim_tenant_admin_invite(target_slug text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  target_tenant_id uuid;
  invite_row public.tenant_admin_invites;
  jwt_email text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  jwt_email := lower(coalesce(auth.jwt()->>'email', ''));
  IF jwt_email = '' THEN RETURN 'no_email'; END IF;

  SELECT id INTO target_tenant_id FROM public.tenants WHERE slug = target_slug LIMIT 1;
  IF target_tenant_id IS NULL THEN RETURN 'tenant_missing'; END IF;

  SELECT * INTO invite_row
  FROM public.tenant_admin_invites
  WHERE tenant_id = target_tenant_id AND email = jwt_email AND status = 'pending'
  ORDER BY created_at DESC LIMIT 1;

  IF invite_row.id IS NULL THEN RETURN 'no_invite'; END IF;

  INSERT INTO public.tenant_admins (tenant_id, user_id, email, role)
  VALUES (target_tenant_id, auth.uid(), jwt_email, invite_row.role)
  ON CONFLICT (tenant_id, user_id) DO UPDATE SET email = excluded.email, role = excluded.role;

  UPDATE public.tenant_admin_invites
  SET status = 'claimed', claimed_by = auth.uid(), updated_at = timezone('utc', now())
  WHERE id = invite_row.id;

  RETURN 'claimed';
END;
$$;
GRANT EXECUTE ON FUNCTION public.claim_tenant_admin_invite(text) TO authenticated;


-- ── save_admin_invite ────────────────────────────────────
CREATE OR REPLACE FUNCTION public.save_admin_invite(
  p_email text,
  p_role text,
  target_slug text DEFAULT 'sumlin'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $func$
DECLARE
  v_tenant_id uuid;
  v_user_role text;
BEGIN
  SELECT id INTO v_tenant_id FROM public.tenants WHERE slug = target_slug;
  IF v_tenant_id IS NULL THEN RETURN jsonb_build_object('ok', false, 'message', 'Tenant not found'); END IF;

  SELECT role INTO v_user_role FROM public.tenant_admins
  WHERE tenant_id = v_tenant_id AND user_id = auth.uid() LIMIT 1;
  IF v_user_role NOT IN ('owner','admin') THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Access denied');
  END IF;

  INSERT INTO public.tenant_admin_invites (tenant_id, email, role, status)
  VALUES (v_tenant_id, lower(trim(p_email)), p_role, 'pending')
  ON CONFLICT (tenant_id, email) DO UPDATE SET role = excluded.role, status = 'pending', updated_at = now();

  RETURN jsonb_build_object('ok', true);
END;
$func$;
GRANT EXECUTE ON FUNCTION public.save_admin_invite(text, text, text) TO authenticated;


-- ── get_admin_data ───────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_admin_data(target_slug text DEFAULT 'sumlin')
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $func$
DECLARE
  v_tenant_id uuid;
  v_user_role text;
BEGIN
  SELECT id INTO v_tenant_id FROM public.tenants WHERE slug = target_slug;
  IF v_tenant_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Tenant not found');
  END IF;

  SELECT role INTO v_user_role FROM public.tenant_admins
  WHERE tenant_id = v_tenant_id AND user_id = auth.uid() LIMIT 1;
  IF v_user_role IS NULL THEN
    RETURN jsonb_build_object('ok', false,
      'message', 'Access denied. Your account does not have admin access. Ask an existing admin to invite your email.');
  END IF;

  RETURN jsonb_build_object(
    'ok',     true,
    'role',   v_user_role,
    'tenant', (SELECT to_jsonb(t) FROM public.tenants t WHERE t.id = v_tenant_id),
    'orders', (
      SELECT COALESCE(jsonb_agg(o ORDER BY o.created_at DESC), '[]'::jsonb)
      FROM public.fundraiser_orders o WHERE o.tenant_id = v_tenant_id
    ),
    'tickets', (
      SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
          'id', t.id, 'order_id', t.order_id,
          'ticket_number', t.ticket_number, 'status', t.status, 'raffle_name', t.raffle_name
        ) ORDER BY t.ticket_number ASC
      ), '[]'::jsonb)
      FROM public.fundraiser_tickets t WHERE t.tenant_id = v_tenant_id
    ),
    'admins', (
      SELECT COALESCE(jsonb_agg(a ORDER BY a.created_at ASC), '[]'::jsonb)
      FROM public.tenant_admins a WHERE a.tenant_id = v_tenant_id
    ),
    'invites', (
      SELECT COALESCE(jsonb_agg(i ORDER BY i.created_at DESC), '[]'::jsonb)
      FROM public.tenant_admin_invites i WHERE i.tenant_id = v_tenant_id
    ),
    'events', (
      SELECT COALESCE(jsonb_agg(e ORDER BY e.starts_at ASC), '[]'::jsonb)
      FROM public.events e WHERE e.tenant_id = v_tenant_id
    ),
    'event_signups', (
      SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
          'id', s.id, 'attendee_name', s.attendee_name, 'email', s.email,
          'phone', s.phone, 'party_size', s.party_size, 'status', s.status,
          'created_at', s.created_at,
          'events', (SELECT jsonb_build_object('title', ev.title, 'starts_at', ev.starts_at)
                     FROM public.events ev WHERE ev.id = s.event_id)
        ) ORDER BY s.created_at DESC
      ), '[]'::jsonb)
      FROM public.event_signups s WHERE s.tenant_id = v_tenant_id
    ),
    'businesses', (
      SELECT COALESCE(jsonb_agg(b ORDER BY b.sort_order ASC), '[]'::jsonb)
      FROM public.business_services b WHERE b.tenant_id = v_tenant_id
    ),
    'service_requests', (
      SELECT COALESCE(jsonb_agg(r ORDER BY r.created_at DESC), '[]'::jsonb)
      FROM public.service_requests r WHERE r.tenant_id = v_tenant_id
    ),
    'reunion_registrations', (
      SELECT COALESCE(jsonb_agg(reg ORDER BY reg.created_at DESC), '[]'::jsonb)
      FROM public.reunion_registrations reg WHERE reg.tenant_id = v_tenant_id
    )
  );
END;
$func$;
GRANT EXECUTE ON FUNCTION public.get_admin_data(text) TO authenticated;


-- ── update_order_status ───────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_order_status(
  p_order_id uuid, p_status text, target_slug text DEFAULT 'sumlin'
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $func$
DECLARE v_tenant_id uuid; v_user_role text;
BEGIN
  SELECT id INTO v_tenant_id FROM public.tenants WHERE slug = target_slug;
  IF v_tenant_id IS NULL THEN RETURN jsonb_build_object('ok', false, 'message', 'Tenant not found'); END IF;
  SELECT role INTO v_user_role FROM public.tenant_admins
  WHERE tenant_id = v_tenant_id AND user_id = auth.uid() LIMIT 1;
  IF v_user_role IS NULL THEN RETURN jsonb_build_object('ok', false, 'message', 'Access denied'); END IF;
  UPDATE public.fundraiser_orders SET payment_status = p_status, updated_at = now()
  WHERE id = p_order_id AND tenant_id = v_tenant_id;
  RETURN jsonb_build_object('ok', true);
END;
$func$;
GRANT EXECUTE ON FUNCTION public.update_order_status(uuid, text, text) TO authenticated;


-- ── delete_order_and_tickets ──────────────────────────────
CREATE OR REPLACE FUNCTION public.delete_order_and_tickets(
  p_order_id uuid, target_slug text DEFAULT 'sumlin'
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $func$
DECLARE v_tenant_id uuid; v_user_role text;
BEGIN
  SELECT id INTO v_tenant_id FROM public.tenants WHERE slug = target_slug;
  IF v_tenant_id IS NULL THEN RETURN jsonb_build_object('ok', false, 'message', 'Tenant not found'); END IF;
  SELECT role INTO v_user_role FROM public.tenant_admins
  WHERE tenant_id = v_tenant_id AND user_id = auth.uid() LIMIT 1;
  IF v_user_role IS NULL THEN RETURN jsonb_build_object('ok', false, 'message', 'Access denied'); END IF;
  DELETE FROM public.fundraiser_tickets t USING public.fundraiser_orders o
  WHERE t.order_id = o.id AND o.id = p_order_id AND o.tenant_id = v_tenant_id;
  DELETE FROM public.fundraiser_orders WHERE id = p_order_id AND tenant_id = v_tenant_id;
  RETURN jsonb_build_object('ok', true);
END;
$func$;
GRANT EXECUTE ON FUNCTION public.delete_order_and_tickets(uuid, text) TO authenticated;


-- ── delete_event_and_signups ──────────────────────────────
CREATE OR REPLACE FUNCTION public.delete_event_and_signups(
  p_event_id uuid, target_slug text DEFAULT 'sumlin'
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $func$
DECLARE v_tenant_id uuid; v_user_role text;
BEGIN
  SELECT id INTO v_tenant_id FROM public.tenants WHERE slug = target_slug;
  IF v_tenant_id IS NULL THEN RETURN jsonb_build_object('ok', false, 'message', 'Tenant not found'); END IF;
  SELECT role INTO v_user_role FROM public.tenant_admins
  WHERE tenant_id = v_tenant_id AND user_id = auth.uid() LIMIT 1;
  IF v_user_role IS NULL THEN RETURN jsonb_build_object('ok', false, 'message', 'Access denied'); END IF;
  DELETE FROM public.event_signups s USING public.events e
  WHERE s.event_id = e.id AND e.id = p_event_id AND e.tenant_id = v_tenant_id;
  DELETE FROM public.events WHERE id = p_event_id AND tenant_id = v_tenant_id;
  RETURN jsonb_build_object('ok', true);
END;
$func$;
GRANT EXECUTE ON FUNCTION public.delete_event_and_signups(uuid, text) TO authenticated;


-- ── delete_newsletter_document ────────────────────────────
CREATE OR REPLACE FUNCTION public.delete_newsletter_document(
  p_document_id uuid, target_slug text DEFAULT 'sumlin'
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $func$
DECLARE v_tenant_id uuid; v_user_role text;
BEGIN
  SELECT id INTO v_tenant_id FROM public.tenants WHERE slug = target_slug;
  IF v_tenant_id IS NULL THEN RETURN jsonb_build_object('ok', false, 'message', 'Tenant not found'); END IF;
  SELECT role INTO v_user_role FROM public.tenant_admins
  WHERE tenant_id = v_tenant_id AND user_id = auth.uid() LIMIT 1;
  IF v_user_role IS NULL THEN RETURN jsonb_build_object('ok', false, 'message', 'Access denied'); END IF;
  DELETE FROM public.newsletter_documents WHERE id = p_document_id AND tenant_id = v_tenant_id;
  RETURN jsonb_build_object('ok', true);
END;
$func$;
GRANT EXECUTE ON FUNCTION public.delete_newsletter_document(uuid, text) TO authenticated;


-- ── delete_ticket ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.delete_ticket(
  p_ticket_id uuid, target_slug text DEFAULT 'sumlin'
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $func$
DECLARE v_tenant_id uuid; v_user_role text;
BEGIN
  SELECT id INTO v_tenant_id FROM public.tenants WHERE slug = target_slug;
  IF v_tenant_id IS NULL THEN RETURN jsonb_build_object('ok', false, 'message', 'Tenant not found'); END IF;
  SELECT role INTO v_user_role FROM public.tenant_admins
  WHERE tenant_id = v_tenant_id AND user_id = auth.uid() LIMIT 1;
  IF v_user_role IS NULL THEN RETURN jsonb_build_object('ok', false, 'message', 'Access denied'); END IF;
  DELETE FROM public.fundraiser_tickets t
  USING public.fundraiser_orders o
  WHERE t.id = p_ticket_id AND t.order_id = o.id AND o.tenant_id = v_tenant_id;
  RETURN jsonb_build_object('ok', true);
END;
$func$;
GRANT EXECUTE ON FUNCTION public.delete_ticket(uuid, text) TO authenticated;


-- ── reset_raffle_winners ──────────────────────────────────
CREATE OR REPLACE FUNCTION public.reset_raffle_winners(target_slug text DEFAULT 'sumlin')
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $func$
DECLARE v_tenant_id uuid; v_user_role text;
BEGIN
  SELECT id INTO v_tenant_id FROM public.tenants WHERE slug = target_slug;
  IF v_tenant_id IS NULL THEN RETURN jsonb_build_object('ok', false, 'message', 'Tenant not found'); END IF;
  SELECT role INTO v_user_role FROM public.tenant_admins
  WHERE tenant_id = v_tenant_id AND user_id = auth.uid() LIMIT 1;
  IF v_user_role IS NULL THEN RETURN jsonb_build_object('ok', false, 'message', 'Access denied'); END IF;
  UPDATE public.fundraiser_tickets SET status = 'active'
  WHERE tenant_id = v_tenant_id AND status = 'winner';
  RETURN jsonb_build_object('ok', true);
END;
$func$;
GRANT EXECUTE ON FUNCTION public.reset_raffle_winners(text) TO authenticated;


-- ── mark_raffle_winner ────────────────────────────────────
CREATE OR REPLACE FUNCTION public.mark_raffle_winner(
  p_ticket_id uuid, target_slug text DEFAULT 'sumlin'
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $func$
DECLARE v_tenant_id uuid; v_user_role text;
BEGIN
  SELECT id INTO v_tenant_id FROM public.tenants WHERE slug = target_slug;
  IF v_tenant_id IS NULL THEN RETURN jsonb_build_object('ok', false, 'message', 'Tenant not found'); END IF;
  SELECT role INTO v_user_role FROM public.tenant_admins
  WHERE tenant_id = v_tenant_id AND user_id = auth.uid() LIMIT 1;
  IF v_user_role IS NULL THEN RETURN jsonb_build_object('ok', false, 'message', 'Access denied'); END IF;
  UPDATE public.fundraiser_tickets SET status = 'winner'
  WHERE id = p_ticket_id AND tenant_id = v_tenant_id;
  RETURN jsonb_build_object('ok', true);
END;
$func$;
GRANT EXECUTE ON FUNCTION public.mark_raffle_winner(uuid, text) TO authenticated;


-- ── get_raffle_tickets ────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_raffle_tickets(target_slug text DEFAULT 'sumlin')
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $func$
DECLARE v_tenant_id uuid; v_user_role text;
BEGIN
  SELECT id INTO v_tenant_id FROM public.tenants WHERE slug = target_slug;
  IF v_tenant_id IS NULL THEN RETURN jsonb_build_object('ok', false, 'message', 'Tenant not found'); END IF;
  SELECT role INTO v_user_role FROM public.tenant_admins
  WHERE tenant_id = v_tenant_id AND user_id = auth.uid() LIMIT 1;
  IF v_user_role IS NULL THEN RETURN jsonb_build_object('ok', false, 'message', 'Access denied'); END IF;
  RETURN (
    SELECT COALESCE(jsonb_agg(
      jsonb_build_object(
        'id', t.id, 'ticket_number', t.ticket_number,
        'status', t.status, 'raffle_name', t.raffle_name,
        'order_id', t.order_id,
        'purchaser_name', o.purchaser_name,
        'email', o.email,
        'payment_status', o.payment_status
      ) ORDER BY t.ticket_number ASC
    ), '[]'::jsonb)
    FROM public.fundraiser_tickets t
    JOIN public.fundraiser_orders o ON o.id = t.order_id
    WHERE t.tenant_id = v_tenant_id
  );
END;
$func$;
GRANT EXECUTE ON FUNCTION public.get_raffle_tickets(text) TO authenticated;


-- ── create_public_fundraiser_order ────────────────────────
CREATE OR REPLACE FUNCTION public.create_public_fundraiser_order(
  target_slug                text,
  purchaser_name             text,
  purchaser_email            text,
  payment_method             text,
  items_snapshot             jsonb,
  purchaser_phone            text  DEFAULT NULL,
  purchaser_address          text  DEFAULT NULL,
  external_payment_reference text  DEFAULT NULL,
  order_notes                text  DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $func$
DECLARE
  v_tenant_id    uuid;
  v_order_id     uuid;
  v_reference    text;
  v_total_cents  integer := 0;
  v_entry_count  integer := 0;
  v_ticket_nums  integer[] := '{}';
  v_tickets_json jsonb := '[]'::jsonb;
  v_new_num      bigint;
  v_item         jsonb;
  v_qty          integer;
  v_title        text;
  v_price        integer;
  i              integer;
BEGIN
  SELECT id INTO v_tenant_id FROM public.tenants WHERE slug = target_slug;
  IF v_tenant_id IS NULL THEN RETURN jsonb_build_object('ok', false, 'message', 'Tenant not found'); END IF;

  FOR v_item IN SELECT * FROM jsonb_array_elements(items_snapshot) LOOP
    v_qty   := (v_item->>'quantity')::integer;
    v_price := (v_item->>'price_cents')::integer;
    v_total_cents := v_total_cents + (v_qty * v_price);
    v_entry_count := v_entry_count + v_qty;
  END LOOP;

  v_reference := upper(substring(replace(gen_random_uuid()::text, '-', '') FROM 1 FOR 10));

  INSERT INTO public.fundraiser_orders (
    tenant_id, reference_code, purchaser_name, email, phone, address,
    payment_method, payment_status, donation_amount_cents, entry_count,
    external_payment_reference, notes, items_snapshot
  ) VALUES (
    v_tenant_id, v_reference, purchaser_name, purchaser_email,
    purchaser_phone, purchaser_address, payment_method, 'pending',
    v_total_cents, GREATEST(v_entry_count, 1), external_payment_reference,
    order_notes, items_snapshot
  ) RETURNING id INTO v_order_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(items_snapshot) LOOP
    v_qty   := (v_item->>'quantity')::integer;
    v_title := trim(v_item->>'title');
    FOR i IN 1..v_qty LOOP
      INSERT INTO public.fundraiser_tickets (tenant_id, order_id, status, raffle_name)
      VALUES (v_tenant_id, v_order_id, 'active', v_title)
      RETURNING ticket_number INTO v_new_num;
      v_ticket_nums  := array_append(v_ticket_nums, v_new_num::integer);
      v_tickets_json := v_tickets_json || jsonb_build_object('number', v_new_num, 'raffle_name', v_title);
    END LOOP;
  END LOOP;

  RETURN jsonb_build_object(
    'ok', true, 'order_id', v_order_id, 'reference_code', v_reference,
    'donation_amount_cents', v_total_cents, 'entry_count', v_entry_count,
    'payment_status', 'pending', 'ticket_numbers', v_ticket_nums, 'tickets', v_tickets_json
  );
END;
$func$;
GRANT EXECUTE ON FUNCTION public.create_public_fundraiser_order(text,text,text,text,jsonb,text,text,text,text) TO anon, authenticated;


-- ── create_reunion_registration ───────────────────────────
CREATE TABLE IF NOT EXISTS public.reunion_registrations (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id          uuid        NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  reference_code     text        NOT NULL UNIQUE
                                 DEFAULT upper(substring(replace(gen_random_uuid()::text, '-', '') FROM 1 FOR 10)),
  registrant_name    text        NOT NULL,
  email              text        NOT NULL,
  phone              text,
  adult_count        integer     NOT NULL DEFAULT 0 CHECK (adult_count >= 0),
  teen_count         integer     NOT NULL DEFAULT 0 CHECK (teen_count >= 0),
  child_count        integer     NOT NULL DEFAULT 0 CHECK (child_count >= 0),
  toddler_count      integer     NOT NULL DEFAULT 0 CHECK (toddler_count >= 0),
  guest_count        integer     NOT NULL DEFAULT 0 CHECK (guest_count >= 0),
  dues_count         integer     NOT NULL DEFAULT 0 CHECK (dues_count >= 0),
  total_amount_cents integer     NOT NULL DEFAULT 0,
  total_attendees    integer     NOT NULL DEFAULT 1,
  payment_method     text        NOT NULL CHECK (payment_method IN ('cashapp','venmo','paypal','cash','check','other')),
  payment_status     text        NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','cancelled','refunded')),
  external_payment_reference text,
  notes              text,
  created_at         timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at         timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE OR REPLACE TRIGGER reunion_registrations_set_updated_at
BEFORE UPDATE ON public.reunion_registrations
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS reunion_registrations_tenant_created_idx
ON public.reunion_registrations (tenant_id, created_at DESC);

ALTER TABLE public.reunion_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public can create registrations" ON public.reunion_registrations;
CREATE POLICY "public can create registrations"
ON public.reunion_registrations FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "tenant admins can read registrations" ON public.reunion_registrations;
CREATE POLICY "tenant admins can read registrations"
ON public.reunion_registrations FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.tenant_admins ta
  WHERE ta.tenant_id = reunion_registrations.tenant_id AND ta.user_id = auth.uid()
));

DROP POLICY IF EXISTS "tenant admins can update registrations" ON public.reunion_registrations;
CREATE POLICY "tenant admins can update registrations"
ON public.reunion_registrations FOR UPDATE TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.tenant_admins ta
  WHERE ta.tenant_id = reunion_registrations.tenant_id AND ta.user_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.tenant_admins ta
  WHERE ta.tenant_id = reunion_registrations.tenant_id AND ta.user_id = auth.uid()
));

CREATE OR REPLACE FUNCTION public.create_reunion_registration(
  target_slug       text,
  registrant_name   text,
  registrant_email  text,
  registrant_phone  text    DEFAULT NULL,
  p_adult_count     integer DEFAULT 0,
  p_teen_count      integer DEFAULT 0,
  p_child_count     integer DEFAULT 0,
  p_toddler_count   integer DEFAULT 0,
  p_guest_count     integer DEFAULT 0,
  p_dues_count      integer DEFAULT 0,
  payment_method    text    DEFAULT 'cashapp',
  registration_notes text   DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $func$
DECLARE
  v_tenant_id    uuid;
  v_reg_id       uuid;
  v_reference    text;
  v_total_cents  integer;
  v_total_people integer;
BEGIN
  SELECT id INTO v_tenant_id FROM public.tenants WHERE slug = target_slug;
  IF v_tenant_id IS NULL THEN RETURN jsonb_build_object('ok', false, 'message', 'Tenant not found'); END IF;

  v_total_cents :=
      (p_dues_count * 3500) + (p_adult_count * 8000) + (p_teen_count * 5000)
    + (p_child_count * 3500) + (p_toddler_count * 0) + (p_guest_count * 9000);

  v_total_people := p_adult_count + p_teen_count + p_child_count + p_toddler_count + p_guest_count;

  IF v_total_people < 1 THEN
    RETURN jsonb_build_object('ok', false, 'message', 'At least one attendee is required.');
  END IF;

  v_reference := upper(substring(replace(gen_random_uuid()::text, '-', '') FROM 1 FOR 10));

  INSERT INTO public.reunion_registrations (
    tenant_id, reference_code, registrant_name, email, phone,
    adult_count, teen_count, child_count, toddler_count, guest_count, dues_count,
    total_amount_cents, total_attendees, payment_method, payment_status, notes
  ) VALUES (
    v_tenant_id, v_reference, registrant_name, registrant_email, registrant_phone,
    p_adult_count, p_teen_count, p_child_count, p_toddler_count, p_guest_count, p_dues_count,
    v_total_cents, v_total_people, payment_method, 'pending', registration_notes
  ) RETURNING id INTO v_reg_id;

  RETURN jsonb_build_object(
    'ok', true, 'registration_id', v_reg_id, 'reference_code', v_reference,
    'total_amount_cents', v_total_cents, 'total_attendees', v_total_people
  );
END;
$func$;
GRANT EXECUTE ON FUNCTION public.create_reunion_registration(text,text,text,text,integer,integer,integer,integer,integer,integer,text,text) TO anon, authenticated;


-- ── update_registration_status ────────────────────────────
CREATE OR REPLACE FUNCTION public.update_registration_status(
  p_registration_id uuid, p_status text, target_slug text DEFAULT 'sumlin'
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $func$
DECLARE v_tenant_id uuid; v_user_role text;
BEGIN
  SELECT id INTO v_tenant_id FROM public.tenants WHERE slug = target_slug;
  IF v_tenant_id IS NULL THEN RETURN jsonb_build_object('ok', false, 'message', 'Tenant not found'); END IF;
  SELECT role INTO v_user_role FROM public.tenant_admins
  WHERE tenant_id = v_tenant_id AND user_id = auth.uid() LIMIT 1;
  IF v_user_role IS NULL THEN RETURN jsonb_build_object('ok', false, 'message', 'Access denied'); END IF;
  UPDATE public.reunion_registrations SET payment_status = p_status, updated_at = now()
  WHERE id = p_registration_id AND tenant_id = v_tenant_id;
  RETURN jsonb_build_object('ok', true);
END;
$func$;
GRANT EXECUTE ON FUNCTION public.update_registration_status(uuid, text, text) TO authenticated;


-- ── Also add raffle_name column to public.fundraiser_tickets if missing ──
ALTER TABLE public.fundraiser_tickets ADD COLUMN IF NOT EXISTS raffle_name text;

-- ── Also add items_snapshot column to public.fundraiser_orders if missing ──
ALTER TABLE public.fundraiser_orders ADD COLUMN IF NOT EXISTS items_snapshot jsonb;

-- ── newsletter_documents table (full schema matching sumlin schema) ──
CREATE TABLE IF NOT EXISTS public.newsletter_documents (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        uuid        NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  title            text        NOT NULL,
  issue_date       date        NOT NULL,
  description      text,
  file_name        text        NOT NULL,
  file_path        text        NOT NULL UNIQUE,
  file_url         text        NOT NULL,
  file_size_bytes  bigint,
  mime_type        text,
  created_at       timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at       timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE OR REPLACE TRIGGER newsletter_documents_set_updated_at
BEFORE UPDATE ON public.newsletter_documents
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS newsletter_documents_tenant_issue_idx
ON public.newsletter_documents (tenant_id, issue_date DESC, created_at DESC);

ALTER TABLE public.newsletter_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public can read newsletter documents" ON public.newsletter_documents;
CREATE POLICY "public can read newsletter documents"
ON public.newsletter_documents FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "tenant admins can manage newsletter docs" ON public.newsletter_documents;
CREATE POLICY "tenant admins can manage newsletter docs"
ON public.newsletter_documents FOR ALL TO authenticated
USING (public.is_tenant_admin(tenant_id))
WITH CHECK (public.is_tenant_admin(tenant_id));

-- Storage bucket for newsletters
INSERT INTO storage.buckets (id, name, public)
VALUES ('sumlin-newsletters', 'sumlin-newsletters', true)
ON CONFLICT (id) DO UPDATE SET public = excluded.public;

DROP POLICY IF EXISTS "public can read newsletter files" ON storage.objects;
CREATE POLICY "public can read newsletter files"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'sumlin-newsletters');

DROP POLICY IF EXISTS "tenant admins can upload newsletter files" ON storage.objects;
CREATE POLICY "tenant admins can upload newsletter files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'sumlin-newsletters' AND EXISTS (
  SELECT 1 FROM public.tenant_admins ta WHERE ta.user_id = auth.uid()
));

DROP POLICY IF EXISTS "tenant admins can delete newsletter files" ON storage.objects;
CREATE POLICY "tenant admins can delete newsletter files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'sumlin-newsletters' AND EXISTS (
  SELECT 1 FROM public.tenant_admins ta WHERE ta.user_id = auth.uid()
));

-- ── Update the cash_app_handle for sumlin tenant ──────────
UPDATE public.tenants SET cash_app_handle = '$SumlinFamilyLegacy' WHERE slug = 'sumlin';

-- ── Add cedric.evans@gmail.com as admin ───────────────────
-- Inserts an invite that auto-claims on next login,
-- and directly inserts into tenant_admins if the auth user already exists.
DO $$
DECLARE
  v_tenant_id uuid;
  v_user_id   uuid;
BEGIN
  SELECT id INTO v_tenant_id FROM public.tenants WHERE slug = 'sumlin';

  -- Upsert invite so the email is always pending/claimable
  INSERT INTO public.tenant_admin_invites (tenant_id, email, role, status)
  VALUES (v_tenant_id, 'cedric.evans@gmail.com', 'owner', 'pending')
  ON CONFLICT (tenant_id, email) DO UPDATE SET role = 'owner', status = 'pending', updated_at = now();

  -- If the auth user already exists, add directly to tenant_admins
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'cedric.evans@gmail.com' LIMIT 1;
  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.tenant_admins (tenant_id, user_id, email, role)
    VALUES (v_tenant_id, v_user_id, 'cedric.evans@gmail.com', 'owner')
    ON CONFLICT (tenant_id, user_id) DO UPDATE SET role = 'owner', email = 'cedric.evans@gmail.com';

    UPDATE public.tenant_admin_invites
    SET status = 'claimed', claimed_by = v_user_id, updated_at = now()
    WHERE tenant_id = v_tenant_id AND email = 'cedric.evans@gmail.com';
  END IF;
END $$;
