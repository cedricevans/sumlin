# Sumlin Family Database Setup

## Step 1: Run the Schema

1. Go to your Supabase project: https://supabase.com/dashboard/project/qwhdeenasiollfyftdbb
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `schema.sql` and paste it
5. Click **Run** to create all the tables

## Step 2: Add Initial Data

1. Still in the **SQL Editor**, create another **New Query**
2. Copy the entire contents of `setup-initial-data.sql` and paste it
3. Click **Run** to insert the Sumlin family tenant and sample data

## Step 3: Add Debi as First Admin

After Debi signs up on the website (https://sumlinfamily.com/admin):

1. Go to **Authentication** → **Users** in Supabase dashboard
2. Find Debi's account (1bassdebi@gmail.com) and copy her User ID
3. Go back to **SQL Editor** and run this query (replace USER_ID with her actual ID):

```sql
INSERT INTO public.tenant_admins (tenant_id, user_id, email, role)
SELECT id, 'USER_ID_HERE', '1bassdebi@gmail.com', 'owner'
FROM public.tenants WHERE slug = 'sumlin';
```

## Step 4: Verify Setup

1. Go to **Table Editor** in Supabase
2. Check that these tables have data:
   - `tenants` - should have 1 row (Sumlin family)
   - `business_services` - should have sample businesses
   - `events` - should have sample events
   - `tenant_admins` - should have Debi's admin record

## Troubleshooting

**"Invalid schema: sumlin" error** - This has been fixed! The code now uses the `public` schema.

**Admin can't access dashboard** - Make sure Debi's email is in the `tenant_admins` table with the correct user_id from the auth.users table.

**Database tables don't exist** - Run the schema.sql file first in the SQL Editor.

## Current Status

✅ Environment variables configured in .env.local
✅ Schema uses `public` schema (not custom `sumlin` schema)
✅ Admin panel has user-friendly language
✅ Sample data ready to insert

Next: Run schema.sql and setup-initial-data.sql in your Supabase dashboard!
