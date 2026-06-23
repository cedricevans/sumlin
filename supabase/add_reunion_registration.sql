-- ============================================================
-- Reunion Registration System
-- Run in Supabase SQL Editor (Dashboard → SQL Editor)
--
-- PREREQUISITE: sumlin schema must be exposed in Supabase API settings.
-- Dashboard → Settings → API → Exposed schemas → add "sumlin"
-- ============================================================

-- ── 1. Table ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sumlin.reunion_registrations (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id          uuid        NOT NULL REFERENCES sumlin.tenants(id) ON DELETE CASCADE,
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
  payment_status     text        NOT NULL DEFAULT 'pending'
                                 CHECK (payment_status IN ('pending','paid','cancelled','refunded')),
  external_payment_reference text,
  notes              text,

  created_at         timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at         timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE OR REPLACE TRIGGER reunion_registrations_set_updated_at
BEFORE UPDATE ON sumlin.reunion_registrations
FOR EACH ROW EXECUTE FUNCTION sumlin.set_updated_at();

CREATE INDEX IF NOT EXISTS reunion_registrations_tenant_created_idx
ON sumlin.reunion_registrations (tenant_id, created_at DESC);

-- ── 2. RLS ────────────────────────────────────────────────
ALTER TABLE sumlin.reunion_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public can create registrations" ON sumlin.reunion_registrations;
CREATE POLICY "public can create registrations"
ON sumlin.reunion_registrations FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "tenant admins can read registrations" ON sumlin.reunion_registrations;
CREATE POLICY "tenant admins can read registrations"
ON sumlin.reunion_registrations FOR SELECT
TO authenticated
USING (sumlin.is_tenant_admin(tenant_id));

DROP POLICY IF EXISTS "tenant admins can update registrations" ON sumlin.reunion_registrations;
CREATE POLICY "tenant admins can update registrations"
ON sumlin.reunion_registrations FOR UPDATE
TO authenticated
USING (sumlin.is_tenant_admin(tenant_id))
WITH CHECK (sumlin.is_tenant_admin(tenant_id));


-- ── 3. Public RPC: submit registration ───────────────────
CREATE OR REPLACE FUNCTION sumlin.create_reunion_registration(
  target_slug                text,
  registrant_name            text,
  registrant_email           text,
  registrant_phone           text    DEFAULT NULL,
  p_adult_count              integer DEFAULT 0,
  p_teen_count               integer DEFAULT 0,
  p_child_count              integer DEFAULT 0,
  p_toddler_count            integer DEFAULT 0,
  p_guest_count              integer DEFAULT 0,
  p_dues_count               integer DEFAULT 0,
  payment_method             text    DEFAULT 'cashapp',
  registration_notes         text    DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $func$
DECLARE
  v_tenant_id    uuid;
  v_reg_id       uuid;
  v_reference    text;
  v_total_cents  integer;
  v_total_people integer;
BEGIN
  SELECT id INTO v_tenant_id FROM sumlin.tenants WHERE slug = target_slug;
  IF v_tenant_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Tenant not found');
  END IF;

  v_total_cents :=
      (p_dues_count    * 3500)
    + (p_adult_count   * 8000)
    + (p_teen_count    * 5000)
    + (p_child_count   * 3500)
    + (p_toddler_count * 0)
    + (p_guest_count   * 9000);

  v_total_people :=
      p_adult_count + p_teen_count + p_child_count + p_toddler_count + p_guest_count;

  IF v_total_people < 1 THEN
    RETURN jsonb_build_object('ok', false, 'message', 'At least one attendee is required.');
  END IF;

  v_reference := upper(substring(replace(gen_random_uuid()::text, '-', '') FROM 1 FOR 10));

  INSERT INTO sumlin.reunion_registrations (
    tenant_id, reference_code,
    registrant_name, email, phone,
    adult_count, teen_count, child_count, toddler_count, guest_count, dues_count,
    total_amount_cents, total_attendees,
    payment_method, payment_status, notes
  ) VALUES (
    v_tenant_id, v_reference,
    registrant_name, registrant_email, registrant_phone,
    p_adult_count, p_teen_count, p_child_count, p_toddler_count, p_guest_count, p_dues_count,
    v_total_cents, v_total_people,
    payment_method, 'pending', registration_notes
  )
  RETURNING id INTO v_reg_id;

  RETURN jsonb_build_object(
    'ok',                 true,
    'registration_id',    v_reg_id,
    'reference_code',     v_reference,
    'total_amount_cents', v_total_cents,
    'total_attendees',    v_total_people
  );
END;
$func$;

GRANT EXECUTE ON FUNCTION sumlin.create_reunion_registration(text,text,text,text,integer,integer,integer,integer,integer,integer,text,text) TO anon, authenticated;


-- ── 4. Admin RPC: update registration status ─────────────
CREATE OR REPLACE FUNCTION sumlin.update_registration_status(
  p_registration_id  uuid,
  p_status           text,
  target_slug        text DEFAULT 'sumlin'
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
  SELECT id INTO v_tenant_id FROM sumlin.tenants WHERE slug = target_slug;
  IF v_tenant_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Tenant not found');
  END IF;

  SELECT role INTO v_user_role
  FROM sumlin.tenant_admins
  WHERE tenant_id = v_tenant_id AND user_id = auth.uid()
  LIMIT 1;

  IF v_user_role IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Access denied');
  END IF;

  UPDATE sumlin.reunion_registrations
  SET payment_status = p_status, updated_at = now()
  WHERE id = p_registration_id AND tenant_id = v_tenant_id;

  RETURN jsonb_build_object('ok', true);
END;
$func$;

GRANT EXECUTE ON FUNCTION sumlin.update_registration_status(uuid, text, text) TO authenticated;


-- ── 5. Patch get_admin_data to include reunion_registrations ─
CREATE OR REPLACE FUNCTION sumlin.get_admin_data(target_slug text DEFAULT 'sumlin')
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $func$
DECLARE
  v_tenant_id uuid;
  v_user_role text;
BEGIN
  SELECT id INTO v_tenant_id FROM sumlin.tenants WHERE slug = target_slug;
  IF v_tenant_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Tenant not found');
  END IF;

  SELECT role INTO v_user_role
  FROM sumlin.tenant_admins
  WHERE tenant_id = v_tenant_id AND user_id = auth.uid()
  LIMIT 1;

  IF v_user_role IS NULL THEN
    RETURN jsonb_build_object(
      'ok', false,
      'message', 'Access denied. Your account does not have admin access. Ask an existing admin to invite your email.'
    );
  END IF;

  RETURN jsonb_build_object(
    'ok',     true,
    'role',   v_user_role,
    'tenant', (SELECT to_jsonb(t) FROM sumlin.tenants t WHERE t.id = v_tenant_id),
    'orders', (
      SELECT COALESCE(jsonb_agg(o ORDER BY o.created_at DESC), '[]'::jsonb)
      FROM sumlin.fundraiser_orders o WHERE o.tenant_id = v_tenant_id
    ),
    'tickets', (
      SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
          'id',            t.id,
          'order_id',      t.order_id,
          'ticket_number', t.ticket_number,
          'status',        t.status,
          'raffle_name',   t.raffle_name
        ) ORDER BY t.ticket_number ASC
      ), '[]'::jsonb)
      FROM sumlin.fundraiser_tickets t WHERE t.tenant_id = v_tenant_id
    ),
    'admins', (
      SELECT COALESCE(jsonb_agg(a ORDER BY a.created_at ASC), '[]'::jsonb)
      FROM sumlin.tenant_admins a WHERE a.tenant_id = v_tenant_id
    ),
    'invites', (
      SELECT COALESCE(jsonb_agg(i ORDER BY i.created_at DESC), '[]'::jsonb)
      FROM sumlin.tenant_admin_invites i WHERE i.tenant_id = v_tenant_id
    ),
    'events', (
      SELECT COALESCE(jsonb_agg(e ORDER BY e.starts_at ASC), '[]'::jsonb)
      FROM sumlin.events e WHERE e.tenant_id = v_tenant_id
    ),
    'event_signups', (
      SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
          'id', s.id, 'attendee_name', s.attendee_name, 'email', s.email,
          'phone', s.phone, 'party_size', s.party_size, 'status', s.status,
          'created_at', s.created_at,
          'events', (SELECT jsonb_build_object('title', ev.title, 'starts_at', ev.starts_at)
                     FROM sumlin.events ev WHERE ev.id = s.event_id)
        ) ORDER BY s.created_at DESC
      ), '[]'::jsonb)
      FROM sumlin.event_signups s WHERE s.tenant_id = v_tenant_id
    ),
    'businesses', (
      SELECT COALESCE(jsonb_agg(b ORDER BY b.sort_order ASC), '[]'::jsonb)
      FROM sumlin.business_services b WHERE b.tenant_id = v_tenant_id
    ),
    'service_requests', (
      SELECT COALESCE(jsonb_agg(r ORDER BY r.created_at DESC), '[]'::jsonb)
      FROM sumlin.service_requests r WHERE r.tenant_id = v_tenant_id
    ),
    'reunion_registrations', (
      SELECT COALESCE(jsonb_agg(reg ORDER BY reg.created_at DESC), '[]'::jsonb)
      FROM sumlin.reunion_registrations reg WHERE reg.tenant_id = v_tenant_id
    )
  );
END;
$func$;

GRANT EXECUTE ON FUNCTION sumlin.get_admin_data(text) TO authenticated;
