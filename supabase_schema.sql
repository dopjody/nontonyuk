-- Create 'content' table for movies and series
create table if not exists content (
  id text primary key,
  title text not null,
  description text,
  type text check (type in ('movie', 'series')),
  release_date date,
  cover text,
  genre text,
  rating numeric,
  raw_data jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table content enable row level security;

-- Create policy to allow read access for everyone
create policy "Allow public read access" on content for select using (true);

-- Create policy to allow insert/update for anon (for demo purposes, ideally restricted)
-- Since we are using anon key for syncing in this demo
create policy "Allow anon insert/update" on content for all using (true) with check (true);
