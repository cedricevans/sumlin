-- WARNING: Review and test before running on production.
-- This script creates a backup of the current fundraiser_tickets table,
-- then provides commented example DELETE statements for removing test data,
-- and shows how to restart the ticket_number identity sequence at 1.
-- Edit the DELETE WHERE clause to match the test data you want to remove.

BEGIN;

-- 1) Backup current tickets (table copy)
CREATE TABLE IF NOT EXISTS sumlin.fundraiser_tickets_backup AS TABLE sumlin.fundraiser_tickets WITH NO DATA;
INSERT INTO sumlin.fundraiser_tickets_backup SELECT * FROM sumlin.fundraiser_tickets;

-- 2) EXAMPLES: Delete test data
-- OPTION A: Delete ALL tickets (uncomment if you intend to wipe all tickets)
-- DELETE FROM sumlin.fundraiser_tickets;

-- OPTION B: Delete tickets that look like test data (edit these predicates)
-- Common test-data heuristics: purchaser_name or email containing 'test', or created_at before a cutoff date
-- DELETE FROM sumlin.fundraiser_tickets USING sumlin.fundraiser_orders o
-- WHERE sumlin.fundraiser_tickets.order_id = o.id
--   AND (
--     LOWER(o.purchaser_name) LIKE '%test%'
--     OR LOWER(o.email) LIKE '%test%'
--     OR o.created_at < '2026-03-01T00:00:00Z'::timestamptz
--   );

-- OPTION C: Delete tickets tied to orders marked as test-only (if you use a marker)
-- DELETE FROM sumlin.fundraiser_tickets
-- WHERE order_id IN (SELECT id FROM sumlin.fundraiser_orders WHERE email LIKE '%@example.test');

-- IMPORTANT: After deleting rows, restart the identity sequence used by ticket_number.
-- The identity sequence name is typically automatically generated. Try this query to find the sequence name:
-- SELECT pg_get_serial_sequence('sumlin.fundraiser_tickets', 'ticket_number');

-- Example sequence restart (replace with actual sequence name if different):
-- ALTER SEQUENCE IF EXISTS sumlin.fundraiser_tickets_ticket_number_seq RESTART WITH 1;

COMMIT;

-- Notes / recommended process:
-- 1) Run only the backup (CREATE TABLE + INSERT) first and verify backup contents.
-- 2) Identify which tickets to delete. Run a SELECT with the same WHERE clause to confirm matching rows.
-- 3) Run the DELETE(s) within a transaction and verify.
-- 4) Restart the identity sequence.
-- 5) Verify new tickets get ticket_number starting at 1 (create a dummy order+ticket in a test environment first).

-- If you want me to run through the SELECTs and suggest an exact DELETE WHERE clause based on your data (for example, delete tickets for orders created before a certain date or with test emails), tell me the identifying pattern and I will produce the exact SQL to run safely.
