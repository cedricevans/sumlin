-- ============================================================
-- FIX: RLS infinite recursion + Admin RPCs
-- Run this in your Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- Step 1: Create a SECURITY DEFINER helper that checks admin membership
-- WITHOUT triggering RLS (bypasses policies entirely due to SET search_path = '')
CREATE OR REPLACE FUNCTION sumlin.is_tenant_admin(p_tenant_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM sumlin.tenant_admins
    WHERE tenant_id = p_tenant_id
    AND user_id = auth.uid()
  );
$$;

-- Step 2: Fix the infinite recursion on tenant_admins
-- Drop all existing policies on it, then recreate with the helper
DO $$
DECLARE pol text;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'sumlin' AND tablename = 'tenant_admins'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON sumlin.tenant_admins', pol);
  END LOOP;
END $$;

CREATE POLICY "tenant_admins_select"
  ON sumlin.tenant_admins FOR SELECT
  USING (sumlin.is_tenant_admin(tenant_id));

CREATE POLICY "tenant_admins_insert"
  ON sumlin.tenant_admins FOR INSERT
  WITH CHECK (sumlin.is_tenant_admin(tenant_id));

CREATE POLICY "tenant_admins_update"
  ON sumlin.tenant_admins FOR UPDATE
  USING (sumlin.is_tenant_admin(tenant_id));

CREATE POLICY "tenant_admins_delete"
  ON sumlin.tenant_admins FOR DELETE
  USING (sumlin.is_tenant_admin(tenant_id));


-- ============================================================
-- Step 3: Admin data RPC — returns all dashboard data at once
-- Bypasses RLS entirely via SECURITY DEFINER
-- ============================================================
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
  -- Get tenant id
  SELECT id INTO v_tenant_id FROM sumlin.tenants WHERE slug = target_slug;
  IF v_tenant_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Tenant not found');
  END IF;

  -- Verify caller is an admin for this tenant
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
    'ok', true,
    'role', v_user_role,
    'tenant', (SELECT to_jsonb(t) FROM sumlin.tenants t WHERE t.id = v_tenant_id),
    'orders', (
      SELECT COALESCE(jsonb_agg(o ORDER BY o.created_at DESC), '[]'::jsonb)
      FROM sumlin.fundraiser_orders o
      WHERE o.tenant_id = v_tenant_id
    ),
    'tickets', (
      SELECT COALESCE(jsonb_agg(t ORDER BY t.ticket_number ASC), '[]'::jsonb)
      FROM sumlin.fundraiser_tickets t
      WHERE t.tenant_id = v_tenant_id
    ),
    'admins', (
      SELECT COALESCE(jsonb_agg(a ORDER BY a.created_at ASC), '[]'::jsonb)
      FROM sumlin.tenant_admins a
      WHERE a.tenant_id = v_tenant_id
    ),
    'invites', (
      SELECT COALESCE(jsonb_agg(i ORDER BY i.created_at DESC), '[]'::jsonb)
      FROM sumlin.tenant_admin_invites i
      WHERE i.tenant_id = v_tenant_id
    ),
    'events', (
      SELECT COALESCE(jsonb_agg(e ORDER BY e.starts_at ASC), '[]'::jsonb)
      FROM sumlin.events e
      WHERE e.tenant_id = v_tenant_id
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
      FROM sumlin.event_signups s
      WHERE s.tenant_id = v_tenant_id
    ),
    'businesses', (
      SELECT COALESCE(jsonb_agg(b ORDER BY b.sort_order ASC), '[]'::jsonb)
      FROM sumlin.business_services b
      WHERE b.tenant_id = v_tenant_id
    ),
    'service_requests', (
      SELECT COALESCE(jsonb_agg(r ORDER BY r.created_at DESC), '[]'::jsonb)
      FROM sumlin.service_requests r
      WHERE r.tenant_id = v_tenant_id
    )
  );
END;
$func$;

GRANT EXECUTE ON FUNCTION sumlin.get_admin_data(text) TO authenticated;


-- ============================================================
-- Step 4: Update order payment status RPC
-- ============================================================
CREATE OR REPLACE FUNCTION sumlin.update_order_status(
  p_order_id uuid,
  p_status text,
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

  UPDATE sumlin.fundraiser_orders
  SET payment_status = p_status, updated_at = now()
  WHERE id = p_order_id AND tenant_id = v_tenant_id;

  RETURN jsonb_build_object('ok', true);
END;
$func$;

GRANT EXECUTE ON FUNCTION sumlin.update_order_status(uuid, text, text) TO authenticated;


-- ============================================================
-- Step 4b: Delete order and its tickets (admin-only)
-- ============================================================
CREATE OR REPLACE FUNCTION sumlin.delete_order_and_tickets(
  p_order_id uuid,
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

  -- Delete tickets belonging to the order (scoped to tenant)
  DELETE FROM sumlin.fundraiser_tickets t
  USING sumlin.fundraiser_orders o
  WHERE t.order_id = o.id
    AND o.id = p_order_id
    AND o.tenant_id = v_tenant_id;

  -- Delete the order (scoped to tenant)
  DELETE FROM sumlin.fundraiser_orders
  WHERE id = p_order_id
    AND tenant_id = v_tenant_id;

  RETURN jsonb_build_object('ok', true);
END;
$func$;

GRANT EXECUTE ON FUNCTION sumlin.delete_order_and_tickets(uuid, text) TO authenticated;


-- ============================================================
-- Step 4c: Delete event and its signups (admin-only)
-- ============================================================
CREATE OR REPLACE FUNCTION sumlin.delete_event_and_signups(
  p_event_id uuid,
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

  -- Delete signups for the event (scoped to tenant)
  DELETE FROM sumlin.event_signups s
  USING sumlin.events e
  WHERE s.event_id = e.id
    AND e.id = p_event_id
    AND e.tenant_id = v_tenant_id;

  -- Delete the event (scoped to tenant)
  DELETE FROM sumlin.events
  WHERE id = p_event_id
    AND tenant_id = v_tenant_id;

  RETURN jsonb_build_object('ok', true);
END;
$func$;

GRANT EXECUTE ON FUNCTION sumlin.delete_event_and_signups(uuid, text) TO authenticated;


-- ============================================================
-- Step 4d: Delete newsletter document (admin-only)
-- ============================================================
CREATE OR REPLACE FUNCTION sumlin.delete_newsletter_document(
  p_document_id uuid,
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

  -- Delete the document (scoped to tenant)
  DELETE FROM sumlin.newsletter_documents
  WHERE id = p_document_id
    AND tenant_id = v_tenant_id;

  RETURN jsonb_build_object('ok', true);
END;
$func$;

GRANT EXECUTE ON FUNCTION sumlin.delete_newsletter_document(uuid, text) TO authenticated;


-- ============================================================
-- Step 5: Save admin invite RPC
-- ============================================================
CREATE OR REPLACE FUNCTION sumlin.save_admin_invite(
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
  SELECT id INTO v_tenant_id FROM sumlin.tenants WHERE slug = target_slug;

  SELECT role INTO v_user_role
  FROM sumlin.tenant_admins
  WHERE tenant_id = v_tenant_id AND user_id = auth.uid()
  LIMIT 1;

  IF v_user_role NOT IN ('owner', 'admin') THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Only owners and admins can invite others');
  END IF;

  INSERT INTO sumlin.tenant_admin_invites (tenant_id, email, role, status)
  VALUES (v_tenant_id, lower(trim(p_email)), p_role, 'pending')
  ON CONFLICT (tenant_id, email) DO UPDATE SET role = EXCLUDED.role, status = 'pending', updated_at = now();

  RETURN jsonb_build_object('ok', true, 'message', 'Invite saved. They will get access when they sign in.');
END;
$func$;

GRANT EXECUTE ON FUNCTION sumlin.save_admin_invite(text, text, text) TO authenticated;
