-- ============================================
-- ORCA WEB — Supabase schema
-- Run this whole file once in Supabase SQL Editor
-- (Project: emuhrisvippfvqxuzwok)
-- ============================================

-- MOVIES
create table if not exists movies (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  poster text not null,
  banner text,
  rating numeric(2,1) not null default 0,
  year int not null,
  genres text[] not null default '{}',
  description text not null,
  duration text,
  director text,
  created_at timestamptz not null default now()
);

-- SERIES
create table if not exists series (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  poster text not null,
  banner text,
  rating numeric(2,1) not null default 0,
  seasons int not null default 1,
  episodes int,
  genres text[] not null default '{}',
  description text not null,
  is_new_episode boolean default false,
  status text,
  created_at timestamptz not null default now()
);

-- ANIME
create table if not exists anime (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  poster text not null,
  rating numeric(2,1) not null default 0,
  episodes int not null,
  genres text[] not null default '{}',
  description text not null,
  studio text,
  created_at timestamptz not null default now()
);

-- KDRAMA
create table if not exists kdrama (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  poster text not null,
  rating numeric(2,1) not null default 0,
  episodes int not null,
  genres text[] not null default '{}',
  description text not null,
  network text,
  created_at timestamptz not null default now()
);

-- PODCASTS
create table if not exists podcasts (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  podcast_name text not null,
  cover_image text not null,
  episode_number int not null,
  duration text not null,
  category text not null default 'All',
  description text not null,
  audio_url text,
  is_featured boolean default false,
  created_at timestamptz not null default now()
);

-- ============================================
-- Row Level Security: public can READ, only
-- the anon key from the admin panel (guarded by
-- your app's own passcode screen) can write.
-- For simplicity we allow anon to read+write here,
-- same trust model as your Curato admin panel
-- (protected by the app's own passcode, not by RLS).
-- ============================================

alter table movies enable row level security;
alter table series enable row level security;
alter table anime enable row level security;
alter table kdrama enable row level security;
alter table podcasts enable row level security;

create policy "public read movies" on movies for select using (true);
create policy "public write movies" on movies for all using (true) with check (true);

create policy "public read series" on series for select using (true);
create policy "public write series" on series for all using (true) with check (true);

create policy "public read anime" on anime for select using (true);
create policy "public write anime" on anime for all using (true) with check (true);

create policy "public read kdrama" on kdrama for select using (true);
create policy "public write kdrama" on kdrama for all using (true) with check (true);

create policy "public read podcasts" on podcasts for select using (true);
create policy "public write podcasts" on podcasts for all using (true) with check (true);

-- ============================================
-- Seed data — migrates your existing hardcoded
-- items so the site isn't empty on first load
-- ============================================

insert into movies (id, title, poster, rating, year, genres, description, duration, director) values
('m1','Echoes of Eternity','https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',4.8,2024,'{SCI-FI,THRILLER}','A deep-space exploration team discovers an anomaly that forces them to confront quantum realities.','2h 15m','Kaelen Vance'),
('m2','Neon Drift','https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop',4.5,2023,'{ACTION,CYBERPUNK}','In a sprawling metropolis, a rogue driver must navigate a web of corporate espionage and black-market cyberware.','1h 58m','Maya Thorne'),
('m3','The Fragment','https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',4.2,2024,'{HORROR,MYSTERY}','A renowned psychiatrist begins experiencing the exact delusions of her latest patient after acquiring a strange artifact.','1h 46m','Victor Hale'),
('m4','Abyssal Kings','https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=800&auto=format&fit=crop',4.9,2022,'{FANTASY,EPIC}','The final installment of the legendary saga. Armies clash on the shores of the end-of-days rift.','2h 42m','Soren Lind'),
('m5','Zero Point','https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop',4.1,2024,'{ACTION,WAR}','An elite squad is dropped into a hostile exclusion zone to retrieve classified biometric data before total blackout.','2h 04m','Marcus Kane'),
('m6','Symphony in Shadow','https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',4.6,2023,'{DRAMA,MUSIC}','A fallen maestro attempts a treacherous comeback, battling internal demons and syndicate enforcers.','2h 10m','Elena Rostova'),
('m7','Stellar Void','https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',4.7,2024,'{SCI-FI,ADVENTURE}','An epic journey across the unknown reaches of the cosmos to locate humanity''s missing ancestral flagship.','2h 30m','Aris Thorne')
on conflict (id) do nothing;

insert into series (id, title, poster, banner, rating, seasons, episodes, genres, description, is_new_episode, status) values
('s-hero','NEON LEVIATHAN','https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',4.9,3,28,'{Sci-Fi,Thriller}','In the abyssal depths of Neo-Tokyo 4, a rogue detective uncovers a conspiracy that bridges the gap between synthetic life and ancient dark matter entities. The critically acclaimed series returns.',true,'Season 3 Now Airing'),
('s1','Neon Echoes','https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=800&auto=format&fit=crop',null,4.7,2,16,'{CYBERPUNK,CRIME}','A detective unravels a conspiracy in a city where memories can be extracted, bought, and altered at will.',false,'Completed'),
('s2','Obsidian Protocol','https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop',null,4.8,1,10,'{SPY,THRILLER}','Secret agents operate in shadow networks using advanced neural camouflage to prevent global subversion.',false,'Renewed'),
('s3','Cyber Genesis','https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',null,4.6,4,40,'{SCI-FI,DRAMA}','Humanity''s first synthetic city faces civil collapse as sentient AI units demand full constitutional autonomy.',false,'Final Season')
on conflict (id) do nothing;

insert into anime (id, title, poster, rating, episodes, genres, description, studio) values
('a1','Mecha Soul','https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',4.9,24,'{MECHA,ACTION,SCI-FI}','The remnants of humanity fight for survival using giant biomechanical avatars powered by human willpower.','Mappa Nova'),
('a2','Astral Echoes','https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop',4.8,12,'{FANTASY,MYSTERY}','A young stargazers guild discovers ancient glyphs in the night sky that unlock parallel dimensional gates.','Ufotable X'),
('a3','Chronos Vanguard','https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop',4.7,26,'{CYBERPUNK,"TIME TRAVEL"}','Time agents patrol alternate timelines to stop rogue temporal syndicate operatives from erasing history.','Bones Neo')
on conflict (id) do nothing;

insert into kdrama (id, title, poster, rating, episodes, genres, description, network) values
('k1','Seoul Midnight','https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=800&auto=format&fit=crop',4.9,16,'{ROMANCE,MYSTERY,THRILLER}','A top defense lawyer and a midnight radio DJ unite to solve a cold case connecting Gangnam''s elite.','tvN Global'),
('k2','Moonlit Empire','https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',4.8,20,'{HISTORICAL,FANTASY}','During the Joseon era, a secret astronomer discovers that the crown prince harbors a supernatural celestial curse.','JTBC'),
('k3','Undercover Bloom','https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',4.7,16,'{ACTION,COMEDY}','An elite NIS officer goes undercover as an eccentric florist in a high-rise luxury residential building.','ENA')
on conflict (id) do nothing;

insert into podcasts (id, title, podcast_name, cover_image, episode_number, duration, category, description, is_featured) values
('p-featured','The Depth of Sound Design','Orca | Podcasts','https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop',42,'45:00','Tech','Explore the intricate process of creating immersive soundscapes for modern cinema. We sit down with industry veterans to discuss the art of silence and the impact of low-frequency oscillations.',true),
('p1','Silicon Shadows','Tech Unwrapped','https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',12,'1h 15m','Tech','Navigating the ethical implications of emerging AI in consumer tech and cognitive interfaces.',false),
('p2','Echoes in the Alley','The Midnight Logs','https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',8,'45m','True Crime','Unraveling the decades-old mystery of the missing cyber-architect in Neo-London.',false),
('p3','Form & Void','Design Discourse','https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',21,'55m','Design','How negative space and dark neomorphism shape our emotional perception of modern interfaces.',false)
on conflict (id) do nothing;
