-- Newsletter archive setup for Sumlin
-- Run this in the Supabase SQL editor for the current project.

create table if not exists sumlin.newsletter_documents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references sumlin.tenants(id) on delete cascade,
  title text not null,
  issue_date date not null,
  description text,
  file_name text not null,
  file_path text not null unique,
  file_url text not null,
  file_size_bytes bigint,
  mime_type text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace trigger newsletter_documents_set_updated_at
before update on sumlin.newsletter_documents
for each row
execute function sumlin.set_updated_at();

alter table sumlin.newsletter_documents enable row level security;

drop policy if exists "public can read newsletter documents" on sumlin.newsletter_documents;
create policy "public can read newsletter documents"
on sumlin.newsletter_documents
for select
to public
using (true);

drop policy if exists "tenant admins can insert newsletter documents" on sumlin.newsletter_documents;
create policy "tenant admins can insert newsletter documents"
on sumlin.newsletter_documents
for insert
to authenticated
with check (
  exists (
    select 1
    from sumlin.tenant_admins ta
    where ta.tenant_id = newsletter_documents.tenant_id
      and ta.user_id = auth.uid()
  )
);

drop policy if exists "tenant admins can update newsletter documents" on sumlin.newsletter_documents;
create policy "tenant admins can update newsletter documents"
on sumlin.newsletter_documents
for update
to authenticated
using (
  exists (
    select 1
    from sumlin.tenant_admins ta
    where ta.tenant_id = newsletter_documents.tenant_id
      and ta.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from sumlin.tenant_admins ta
    where ta.tenant_id = newsletter_documents.tenant_id
      and ta.user_id = auth.uid()
  )
);

drop policy if exists "tenant admins can delete newsletter documents" on sumlin.newsletter_documents;
create policy "tenant admins can delete newsletter documents"
on sumlin.newsletter_documents
for delete
to authenticated
using (
  exists (
    select 1
    from sumlin.tenant_admins ta
    where ta.tenant_id = newsletter_documents.tenant_id
      and ta.user_id = auth.uid()
  )
);

create index if not exists newsletter_documents_tenant_issue_idx
on sumlin.newsletter_documents (tenant_id, issue_date desc, created_at desc);

insert into storage.buckets (id, name, public)
values ('sumlin-newsletters', 'sumlin-newsletters', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "public can read newsletter files" on storage.objects;
create policy "public can read newsletter files"
on storage.objects
for select
to public
using (bucket_id = 'sumlin-newsletters');

drop policy if exists "tenant admins can upload newsletter files" on storage.objects;
create policy "tenant admins can upload newsletter files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'sumlin-newsletters'
  and exists (
    select 1
    from sumlin.tenant_admins ta
    where ta.user_id = auth.uid()
  )
);

drop policy if exists "tenant admins can update newsletter files" on storage.objects;
create policy "tenant admins can update newsletter files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'sumlin-newsletters'
  and exists (
    select 1
    from sumlin.tenant_admins ta
    where ta.user_id = auth.uid()
  )
)
with check (
  bucket_id = 'sumlin-newsletters'
  and exists (
    select 1
    from sumlin.tenant_admins ta
    where ta.user_id = auth.uid()
  )
);

drop policy if exists "tenant admins can delete newsletter files" on storage.objects;
create policy "tenant admins can delete newsletter files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'sumlin-newsletters'
  and exists (
    select 1
    from sumlin.tenant_admins ta
    where ta.user_id = auth.uid()
  )
);
