-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)

CREATE OR REPLACE FUNCTION sumlin.mark_raffle_winner(
  p_ticket_number bigint,
  target_slug text DEFAULT 'sumlin'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = sumlin, public
AS $$
DECLARE
  v_tenant_id uuid;
BEGIN
  SELECT id INTO v_tenant_id FROM sumlin.tenants WHERE slug = target_slug;
  IF v_tenant_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Tenant not found');
  END IF;

  UPDATE sumlin.fundraiser_tickets
  SET status = 'winner'
  WHERE ticket_number = p_ticket_number
    AND tenant_id = v_tenant_id;

  RETURN jsonb_build_object('ok', true);
END;
$$;

CREATE OR REPLACE FUNCTION sumlin.reset_raffle_winners(
  target_slug text DEFAULT 'sumlin'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = sumlin, public
AS $$
DECLARE
  v_tenant_id uuid;
BEGIN
  SELECT id INTO v_tenant_id FROM sumlin.tenants WHERE slug = target_slug;
  IF v_tenant_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Tenant not found');
  END IF;

  UPDATE sumlin.fundraiser_tickets
  SET status = 'active'
  WHERE status = 'winner'
    AND tenant_id = v_tenant_id;

  RETURN jsonb_build_object('ok', true);
END;
$$;
