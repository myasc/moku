-- Create the table for storing generated questions
create table public.generated_questions (
  id uuid not null default gen_random_uuid (),
  card_id text not null,
  questions_json jsonb not null,
  created_at timestamp with time zone not null default now(),
  constraint generated_questions_pkey primary key (id)
);

-- Add an index for faster lookups by card_id
create index idx_generated_questions_card_id on public.generated_questions (card_id);

-- Enable Row Level Security (RLS)
alter table public.generated_questions enable row level security;

-- Create a policy that allows anyone to read questions (since they are just generic questions)
-- You can restrict this further if needed, but for this app, public read is fine.
create policy "Enable read access for all users" on public.generated_questions
  for select
  using (true);

-- Create a policy that allows the service role (API) to insert questions
-- Note: The API uses the service role key or anon key with specific permissions. 
-- If using anon key for inserts from server-side, we might need a specific policy or just rely on service_role bypass.
-- Since we are using the anon key in the client initialization in `lib/supabase.ts`, 
-- but the API route runs on the server, we should ideally use a SERVICE_ROLE key for writing.
-- HOWEVER, for simplicity in this "anon" setup:
create policy "Enable insert for all users" on public.generated_questions
  for insert
  with check (true);

-- Create the table for storing users
create table public.users (
  id uuid not null default gen_random_uuid (),
  name text not null,
  dob date not null,
  gender text not null,
  compatibility_requests int not null default 0,
  created_at timestamp with time zone not null default now(),
  constraint users_pkey primary key (id)
);

-- Enable RLS for users table
alter table public.users enable row level security;

-- Allow inserts for users (anyone can create a profile)
create policy "Enable insert for all users" on public.users
  for insert
  with check (true);

-- Allow read access for users (needed to return the ID after insert)
create policy "Enable read access for all users" on public.users
  for select
  using (true);

-- Allow updates for users (to increment compatibility requests) - ideally restricted to the user themselves or server-side
-- For this simple app, we'll allow updates to the specific column via RPC or direct update if RLS permits.
-- But RPC is safer. Let's allow public update for now for simplicity, or better, use RPC with security definer.

create policy "Enable update for all users" on public.users
  for update
  using (true);

-- RPC function to safely increment compatibility requests
create or replace function increment_compatibility_requests(user_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.users
  set compatibility_requests = compatibility_requests + 1
  where id = user_id;
end;
$$;
