-- ============================================================
-- COMPLETE FIX: Raffle name tracking per ticket
-- Run this in Supabase SQL Editor
-- ============================================================

-- Step 1: Add raffle_name column
ALTER TABLE sumlin.fundraiser_tickets
  ADD COLUMN IF NOT EXISTS raffle_name text;

-- Step 2: Backfill raffle_name on ALL existing tickets
DO $$
DECLARE
  v_order     record;
  v_item      jsonb;
  v_item_qty  integer;
  v_item_title text;
  v_ticket_ids uuid[];
  idx         integer;
  i           integer;
BEGIN
  FOR v_order IN
    SELECT id, items_snapshot
    FROM sumlin.fundraiser_orders
    WHERE items_snapshot IS NOT NULL
      AND jsonb_array_length(items_snapshot) > 0
  LOOP
    SELECT array_agg(id ORDER BY ticket_number ASC)
    INTO v_ticket_ids
    FROM sumlin.fundraiser_tickets
    WHERE order_id = v_order.id;

    CONTINUE WHEN v_ticket_ids IS NULL;

    idx := 1;
    FOR v_item IN SELECT * FROM jsonb_array_elements(v_order.items_snapshot)
    LOOP
      v_item_qty   := (v_item->>'quantity')::integer;
      v_item_title := trim(v_item->>'title');

      FOR i IN 1..v_item_qty LOOP
        EXIT WHEN idx > array_length(v_ticket_ids, 1);
        UPDATE sumlin.fundraiser_tickets
          SET raffle_name = v_item_title
          WHERE id = v_ticket_ids[idx];
        idx := idx + 1;
      END LOOP;
    END LOOP;
  END LOOP;
END $$;

-- Step 3: Drop old function first, then recreate with raffle_name support
DROP FUNCTION IF EXISTS sumlin.create_public_fundraiser_order(text,text,text,text,jsonb,text,text,text,text);

CREATE OR REPLACE FUNCTION sumlin.create_public_fundraiser_order(
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
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $func$
DECLARE
  v_tenant_id     uuid;
  v_order_id      uuid;
  v_reference     text;
  v_total_cents   integer := 0;
  v_entry_count   integer := 0;
  v_ticket_nums   integer[] := '{}';
  v_tickets_json  jsonb := '[]'::jsonb;
  v_new_num       bigint;
  v_item          jsonb;
  v_qty           integer;
  v_title         text;
  v_price         integer;
  i               integer;
BEGIN
  SELECT id INTO v_tenant_id FROM sumlin.tenants WHERE slug = target_slug;
  IF v_tenant_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Tenant not found');
  END IF;

  FOR v_item IN SELECT * FROM jsonb_array_elements(items_snapshot) LOOP
    v_qty   := (v_item->>'quantity')::integer;
    v_price := (v_item->>'price_cents')::integer;
    v_total_cents := v_total_cents + (v_qty * v_price);
    v_entry_count := v_entry_count + v_qty;
  END LOOP;

  v_reference := upper(substring(replace(gen_random_uuid()::text, '-', '') FROM 1 FOR 10));

  INSERT INTO sumlin.fundraiser_orders (
    tenant_id, reference_code, purchaser_name, email, phone, address,
    payment_method, payment_status, donation_amount_cents, entry_count,
    external_payment_reference, notes, items_snapshot
  ) VALUES (
    v_tenant_id, v_reference, purchaser_name, purchaser_email,
    purchaser_phone, purchaser_address, payment_method, 'pending',
    v_total_cents, v_entry_count, external_payment_reference,
    order_notes, items_snapshot
  )
  RETURNING id INTO v_order_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(items_snapshot) LOOP
    v_qty   := (v_item->>'quantity')::integer;
    v_title := trim(v_item->>'title');

    FOR i IN 1..v_qty LOOP
      INSERT INTO sumlin.fundraiser_tickets (tenant_id, order_id, status, raffle_name)
      VALUES (v_tenant_id, v_order_id, 'active', v_title)
      RETURNING ticket_number INTO v_new_num;

      v_ticket_nums  := array_append(v_ticket_nums, v_new_num::integer);
      v_tickets_json := v_tickets_json || jsonb_build_object(
        'number',      v_new_num,
        'raffle_name', v_title
      );
    END LOOP;
  END LOOP;

  RETURN jsonb_build_object(
    'ok',                    true,
    'order_id',              v_order_id,
    'reference_code',        v_reference,
    'donation_amount_cents', v_total_cents,
    'entry_count',           v_entry_count,
    'payment_status',        'pending',
    'ticket_numbers',        v_ticket_nums,
    'tickets',               v_tickets_json
  );
END;
$func$;

-- Step 4: Update get_admin_data to include raffle_name on tickets
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
    RETURN jsonb_build_object('ok', false, 'message', 'Access denied. Your account does not have admin access. Ask an existing admin to invite your email.');
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
    )
  );
END;
$func$;

GRANT EXECUTE ON FUNCTION sumlin.get_admin_data(text) TO authenticated;
