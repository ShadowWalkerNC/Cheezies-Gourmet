# Cheezies Gourmet

React + Vite PWA for the Cheezies Gourmet food truck. Hosted on Netlify, backed by Supabase.

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
# output in /dist
```

## Deployment

Hosted on Netlify. Every push to `main` auto-deploys.

---

## ✅ Manual TODO List

These items require manual steps outside the codebase. Everything is already wired in code — just needs the external resource added.

---

### 🖼️ PWA Icons (URGENT — current icons are broken)

The manifest points to `/icon-192.png` and `/icon-512.png` in the `public/` folder. These files do not exist yet.

1. Create or export your Cheezies logo as a square PNG
2. Resize to **512×512** and save as `public/icon-512.png`
3. Resize to **192×192** and save as `public/icon-192.png`
4. `git add public/icon-192.png public/icon-512.png && git commit -m "chore: add PWA icons" && git push`

Tools: [squoosh.app](https://squoosh.app) or [favicon.io](https://favicon.io) for easy resizing.

---

### 🗺️ Google Maps API Key (for live map on Find Us page)

The Find Us page shows a branded tap-to-open location card without this key. With the key it shows a full embedded static map.

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → enable **Maps Static API**
3. Create an API key → restrict to your domains + Maps Static API
4. Add to `.env`:
   ```
   VITE_GOOGLE_MAPS_KEY=AIza...yourkey...
   ```
5. Add the same variable in **Netlify → Site Settings → Environment Variables**

Free tier: $200/month credit → ~100,000 map loads. You won't hit it.

---

### 🔔 Push Notifications — VAPID Keys

The push notification system is fully built. It needs VAPID keys to go live.

1. Generate keys:
   ```bash
   npx web-push generate-vapid-keys
   ```
2. Add to `.env`:
   ```
   VITE_VAPID_PUBLIC_KEY=your_public_key
   ```
3. Add to Netlify environment variables:
   ```
   VITE_VAPID_PUBLIC_KEY=your_public_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
4. Deploy the Edge Function and set Supabase secrets:
   ```bash
   supabase functions deploy send-broadcast
   supabase secrets set VAPID_PUBLIC_KEY=your_public_key
   supabase secrets set VAPID_PRIVATE_KEY=your_private_key
   supabase secrets set VAPID_SUBJECT=mailto:cheeziesgourmet@gmail.com
   ```

---

### 🗄️ Supabase Tables

Run these in **Supabase → SQL Editor** if not already done:

#### `truck_status`
```sql
create table if not exists truck_status (
  id           int primary key default 1,
  status       text default 'closed',
  address      text,
  home_address text,
  latitude     numeric,
  longitude    numeric,
  hours_open   text,
  hours_close  text,
  open_days    text[],
  note         text,
  updated_at   timestamptz default now()
);
insert into truck_status (id) values (1) on conflict do nothing;
```

#### `contact_submissions`
```sql
create table if not exists contact_submissions (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  message    text,
  source     text default 'contact_form',
  read       boolean default false,
  created_at timestamptz default now()
);
alter table contact_submissions enable row level security;
create policy "anon can insert" on contact_submissions for insert to anon with check (true);
create policy "auth can manage" on contact_submissions for all to authenticated using (true) with check (true);
```

#### `catering_inquiries`
```sql
create table if not exists catering_inquiries (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text,
  event_type  text,
  event_date  date,
  guest_count text,
  message     text,
  status      text default 'new',
  created_at  timestamptz default now()
);
alter table catering_inquiries enable row level security;
create policy "anon can insert" on catering_inquiries for insert to anon with check (true);
create policy "auth can manage" on catering_inquiries for all to authenticated using (true) with check (true);
```

#### `push_subscriptions`
```sql
create table if not exists push_subscriptions (
  id         uuid primary key default gen_random_uuid(),
  endpoint   text unique not null,
  p256dh     text not null,
  auth       text not null,
  active     boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table push_subscriptions enable row level security;
create policy "anon can insert" on push_subscriptions for insert to anon with check (true);
create policy "anon can update" on push_subscriptions for update to anon using (true) with check (true);
create policy "auth can manage" on push_subscriptions for all to authenticated using (true) with check (true);
```

#### `broadcast_log` (add column if table already exists)
```sql
alter table broadcast_log add column if not exists recipient_count int default 0;
```

---

### 🌐 Netlify Environment Variables

Make sure all of these are set in **Netlify → Site Settings → Environment Variables**:

| Variable | Where to get it |
|---|---|
| `VITE_SUPABASE_URL` | Supabase → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `VITE_VAPID_PUBLIC_KEY` | From `npx web-push generate-vapid-keys` |
| `VITE_GOOGLE_MAPS_KEY` | Google Cloud Console |
