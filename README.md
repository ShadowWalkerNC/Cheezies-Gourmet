# 🧀 Cheezies Gourmet

The official web app for **Cheezies Gourmet** — a gourmet grilled cheese food truck based in Akron/Cuyahoga Falls, Ohio.

Built with React + Vite, backed by Supabase, deployed on Vercel.

🌐 **Live site:** [cheeziesgourmetohio.com](https://cheeziesgourmetohio.com)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 6, React Router v6 |
| Styling | Tailwind CSS, Radix UI, Framer Motion |
| Backend / DB | Supabase (PostgreSQL + Auth + Realtime) |
| Deployment | Vercel (auto-deploy on push to `main`) |
| PWA | Web App Manifest, Service Worker (`sw.js`) |
| Maps | React Leaflet |
| Notifications | Web Push (VAPID) via Supabase Edge Functions |

---

## Local Development

```bash
npm install
npm run dev
```

Create a `.env` file in the project root (see Environment Variables below).

## Build

```bash
npm run build
# output in /dist
```

## Preview Production Build

```bash
npm run preview
```

---

## Deployment

Hosted on **Vercel**. Every push to `main` triggers an automatic deployment.

To deploy manually:
```bash
npx vercel --prod
```

---

## Environment Variables

Set these in **Vercel → Project Settings → Environment Variables** and in your local `.env` file:

| Variable | Description | Where to get it |
|---|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Supabase → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key | Supabase → Project Settings → API |
| `VITE_VAPID_PUBLIC_KEY` | VAPID public key for push notifications | `npx web-push generate-vapid-keys` |
| `VITE_GOOGLE_MAPS_KEY` | Google Maps Static API key (optional) | Google Cloud Console |

`.env` example:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_VAPID_PUBLIC_KEY=your-vapid-public-key
VITE_GOOGLE_MAPS_KEY=your-google-maps-key
```

---

## Supabase Setup

Run these in **Supabase → SQL Editor** if tables don't exist yet.

### `truck_status`
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

### `contact_submissions`
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

### `catering_inquiries`
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

### `push_subscriptions`
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

### `broadcast_log`
```sql
alter table broadcast_log add column if not exists recipient_count int default 0;
```

---

## Push Notifications (VAPID)

The push notification system is fully built. To activate:

1. Generate VAPID keys:
   ```bash
   npx web-push generate-vapid-keys
   ```
2. Add keys to Vercel environment variables and `.env`
3. Deploy the Supabase Edge Function:
   ```bash
   supabase functions deploy send-broadcast
   supabase secrets set VAPID_PUBLIC_KEY=your_public_key
   supabase secrets set VAPID_PRIVATE_KEY=your_private_key
   supabase secrets set VAPID_SUBJECT=mailto:cheeziesgourmet@gmail.com
   ```

---

## PWA Icons

The manifest references `/icon-192.png` and `/icon-512.png` in `public/`. These should be square PNG versions of the Cheezies mascot logo.

- Recommended tool: [squoosh.app](https://squoosh.app) or [favicon.io](https://favicon.io)
- Place exported files at `public/icon-192.png` and `public/icon-512.png`

---

## Project Structure

```
cheezies-gourmet/
├── public/              # Static assets (images, icons, manifest, sw.js)
├── src/
│   ├── api/             # Supabase API clients
│   ├── components/      # All UI components
│   │   ├── admin/       # Admin dashboard components
│   │   └── ui/          # Radix/shadcn base components
│   ├── data/            # Static data files
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page-level route components
│   └── utils/           # Utility functions
├── .env                 # Local environment variables (not committed)
├── package.json
└── vite.config.js
```
