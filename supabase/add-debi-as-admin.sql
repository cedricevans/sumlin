-- Run this AFTER Debi has created her account on the website
-- Replace 'DEBI_USER_ID' with her actual user ID from auth.users table

-- Step 1: Find Debi's user ID (run this first to get the ID)
SELECT id, email, created_at 
FROM auth.users 
WHERE email = '1bassdebi@gmail.com';

-- Step 2: After you have the ID, uncomment and run this to add her as owner
-- (Replace 'DEBI_USER_ID' with the actual ID from Step 1)
/*
INSERT INTO public.tenant_admins (tenant_id, user_id, email, role)
SELECT 
  t.id as tenant_id,
  'DEBI_USER_ID' as user_id,
  '1bassdebi@gmail.com' as email,
  'owner' as role
FROM public.tenants t 
WHERE t.slug = 'sumlin'
ON CONFLICT (tenant_id, user_id) DO UPDATE 
SET role = 'owner';
*/

-- Step 3: Verify the admin was added
SELECT 
  ta.email,
  ta.role,
  t.display_name as tenant_name,
  ta.created_at
FROM public.tenant_admins ta
JOIN public.tenants t ON t.id = ta.tenant_id
WHERE t.slug = 'sumlin';
