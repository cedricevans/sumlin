-- ============================================================
-- FIX: Infinite recursion on public.tenant_admins RLS
-- Run in Supabase SQL Editor
-- ============================================================

-- Step 1: Security-definer helper that checks admin membership
-- WITHOUT triggering RLS (bypasses policies entirely)
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

GRANT EXECUTE ON FUNCTION public.is_tenant_admin(uuid) TO anon, authenticated;


-- Step 2: Drop ALL existing policies on tenant_admins and recreate
-- using the helper so there is no recursion
DO $$
DECLARE pol text;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'tenant_admins'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.tenant_admins', pol);
  END LOOP;
END $$;

CREATE POLICY "tenant_admins_select"
  ON public.tenant_admins FOR SELECT TO authenticated
  USING (public.is_tenant_admin(tenant_id));

CREATE POLICY "tenant_admins_insert"
  ON public.tenant_admins FOR INSERT TO authenticated
  WITH CHECK (public.is_tenant_admin(tenant_id));

CREATE POLICY "tenant_admins_update"
  ON public.tenant_admins FOR UPDATE TO authenticated
  USING (public.is_tenant_admin(tenant_id));

CREATE POLICY "tenant_admins_delete"
  ON public.tenant_admins FOR DELETE TO authenticated
  USING (public.is_tenant_admin(tenant_id));


-- Step 3: Also fix any other policies that reference tenant_admins
-- directly in subqueries (business_services, events, etc.)
-- Replace all "EXISTS (SELECT 1 FROM public.tenant_admins ...)" patterns
-- with the helper function.

-- business_services
DROP POLICY IF EXISTS "tenant admins can manage services" ON public.business_services;
CREATE POLICY "tenant admins can manage services"
ON public.business_services FOR ALL TO authenticated
USING (public.is_tenant_admin(tenant_id))
WITH CHECK (public.is_tenant_admin(tenant_id));

-- events
DROP POLICY IF EXISTS "tenant admins can read and manage events" ON public.events;
CREATE POLICY "tenant admins can read and manage events"
ON public.events FOR ALL TO authenticated
USING (public.is_tenant_admin(tenant_id))
WITH CHECK (public.is_tenant_admin(tenant_id));

-- fundraiser_orders
DROP POLICY IF EXISTS "tenant admins can read orders" ON public.fundraiser_orders;
DROP POLICY IF EXISTS "tenant admins can update orders" ON public.fundraiser_orders;
CREATE POLICY "tenant admins can read orders"
ON public.fundraiser_orders FOR SELECT TO authenticated
USING (public.is_tenant_admin(tenant_id));
CREATE POLICY "tenant admins can update orders"
ON public.fundraiser_orders FOR UPDATE TO authenticated
USING (public.is_tenant_admin(tenant_id))
WITH CHECK (public.is_tenant_admin(tenant_id));

-- fundraiser_tickets
DROP POLICY IF EXISTS "tenant admins can read tickets" ON public.fundraiser_tickets;
CREATE POLICY "tenant admins can read tickets"
ON public.fundraiser_tickets FOR SELECT TO authenticated
USING (public.is_tenant_admin(tenant_id));

-- event_signups
DROP POLICY IF EXISTS "tenant admins can read event signups" ON public.event_signups;
DROP POLICY IF EXISTS "tenant admins can update event signups" ON public.event_signups;
CREATE POLICY "tenant admins can read event signups"
ON public.event_signups FOR SELECT TO authenticated
USING (public.is_tenant_admin(tenant_id));
CREATE POLICY "tenant admins can update event signups"
ON public.event_signups FOR UPDATE TO authenticated
USING (public.is_tenant_admin(tenant_id))
WITH CHECK (public.is_tenant_admin(tenant_id));

-- service_requests
DROP POLICY IF EXISTS "tenant admins can read and manage requests" ON public.service_requests;
DROP POLICY IF EXISTS "tenant admins can update requests" ON public.service_requests;
CREATE POLICY "tenant admins can read requests"
ON public.service_requests FOR SELECT TO authenticated
USING (public.is_tenant_admin(tenant_id));
CREATE POLICY "tenant admins can update requests"
ON public.service_requests FOR UPDATE TO authenticated
USING (public.is_tenant_admin(tenant_id))
WITH CHECK (public.is_tenant_admin(tenant_id));

-- tenant_admin_invites
DROP POLICY IF EXISTS "tenant admins can read invites" ON public.tenant_admin_invites;
DROP POLICY IF EXISTS "tenant admins can manage invites" ON public.tenant_admin_invites;
DROP POLICY IF EXISTS "tenant admins can update invites" ON public.tenant_admin_invites;
CREATE POLICY "tenant admins can read invites"
ON public.tenant_admin_invites FOR SELECT TO authenticated
USING (public.is_tenant_admin(tenant_id));
CREATE POLICY "tenant admins can manage invites"
ON public.tenant_admin_invites FOR INSERT TO authenticated
WITH CHECK (public.is_tenant_admin(tenant_id));
CREATE POLICY "tenant admins can update invites"
ON public.tenant_admin_invites FOR UPDATE TO authenticated
USING (public.is_tenant_admin(tenant_id))
WITH CHECK (public.is_tenant_admin(tenant_id));

-- newsletter_documents (if it exists)
DROP POLICY IF EXISTS "tenant admins can manage newsletter docs" ON public.newsletter_documents;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='newsletter_documents') THEN
    CREATE POLICY "tenant admins can manage newsletter docs"
    ON public.newsletter_documents FOR ALL TO authenticated
    USING (public.is_tenant_admin(tenant_id))
    WITH CHECK (public.is_tenant_admin(tenant_id));
  END IF;
END $$;

-- reunion_registrations (if it exists)
DROP POLICY IF EXISTS "tenant admins can read registrations" ON public.reunion_registrations;
DROP POLICY IF EXISTS "tenant admins can update registrations" ON public.reunion_registrations;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='reunion_registrations') THEN
    CREATE POLICY "tenant admins can read registrations"
    ON public.reunion_registrations FOR SELECT TO authenticated
    USING (public.is_tenant_admin(tenant_id));
    CREATE POLICY "tenant admins can update registrations"
    ON public.reunion_registrations FOR UPDATE TO authenticated
    USING (public.is_tenant_admin(tenant_id))
    WITH CHECK (public.is_tenant_admin(tenant_id));
  END IF;
END $$;
