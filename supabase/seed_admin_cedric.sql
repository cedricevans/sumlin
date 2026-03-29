-- Run this in Supabase SQL Editor to grant cedric.evans@gmail.com owner access
INSERT INTO sumlin.tenant_admins (tenant_id, user_id, email, role)
VALUES (
  'f3fc302c-2b2f-48f6-9b5b-ee2ea49846c3',
  'fbd293da-0de5-40d2-aeeb-6561608ac0cc',
  'cedric.evans@gmail.com',
  'owner'
)
ON CONFLICT DO NOTHING;
