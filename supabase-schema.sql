create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  wedding_attendance boolean not null,
  reception_attendance boolean not null,
  message text,
  created_at timestamptz not null default now()
);

alter table public.rsvps enable row level security;
-- Only the Vercel serverless function can write: it uses the service-role key,
-- which must only be configured as a server environment variable.
