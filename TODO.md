# Cheezies Gourmet — Remaining TODO

Everything below requires manual steps outside the codebase.
The code is already wired — just needs the external resource added.

---

## 1. 🖼️ Images (URGENT — hero and about photos are missing)

Run these commands from your project root. The images have already been processed and are ready to download.

```bash
# Hero image (gray background logo — right side of homepage)
curl -L -o public/hero_image.jpg "https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/b64f6135310aebc56134a87a34e44cb0/c6108fea-e1e2-415d-af3f-5d9f39700dce/hero_image.jpg"

# About image (white background logo — about section)
curl -L -o public/about_image.jpg "https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/b64f6135310aebc56134a87a34e44cb0/c6108fea-e1e2-415d-af3f-5d9f39700dce/about_image.jpg"

# PWA icons
curl -o public/icon-192.png "https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/b64f6135310aebc56134a87a34e44cb0/c6108fea-e1e2-415d-af3f-5d9f39700dce/966c2ce6.png"
curl -o public/icon-512.png "https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/b64f6135310aebc56134a87a34e44cb0/c6108fea-e1e2-415d-af3f-5d9f39700dce/db1b1e57.png"

# NavBar + Footer logo (last base44 CDN reference)
curl -L -o public/logo.png "https://media.base44.com/images/public/69b410ceece31b13c728497b/03ee6d0a3_generated_image.png"

# Commit all at once
git add public/ && git commit -m "chore: add images, PWA icons, and local logo" && git push
```

---

## 2. 💾 Supabase — Create newsletter_subscribers table

The Footer and Newsletter section now write signups directly to Supabase. Run this once in your **Supabase SQL editor** to create the table:

```sql
create table if not exists newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  source text,
  subscribed_at timestamptz default now()
);
```

Optional but recommended — enable Row Level Security so only your service role can read it:
```sql
alter table newsletter_subscribers enable row level security;
```

---

## 3. 🔔 Push Notifications — VAPID Keys

The push notification system is fully built. Needs VAPID keys to go live.

### Step 1 — Generate keys
```bash
npx web-push generate-vapid-keys
```

### Step 2 — Add public key to Netlify
**Netlify → Site Settings → Environment Variables:**
```
VITE_VAPID_PUBLIC_KEY=your_public_key_here
```

### Step 3 — Set Supabase secrets
```bash
supabase functions deploy send-broadcast
supabase secrets set VAPID_PUBLIC_KEY=your_public_key_here
supabase secrets set VAPID_PRIVATE_KEY=your_private_key_here
supabase secrets set VAPID_SUBJECT=mailto:cheeziesgourmet@gmail.com
```

---

## 4. 🗺️ Google Maps API Key (Find Us embedded map)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create project → enable **Maps Static API**
3. Create API key → restrict to your domains + Maps Static API
4. Add to Netlify environment variables:
   ```
   VITE_GOOGLE_MAPS_KEY=AIza...yourkey...
   ```

---

## 5. 🌐 Custom Domain — cheeziesgourmetohio.com

1. Go to **Netlify → Site Settings → Domain Management**
2. Click **Add custom domain**
3. Enter `cheeziesgourmetohio.com`
4. Point your domain DNS to Netlify:
   - If using Netlify DNS: change nameservers at your registrar
   - If keeping registrar DNS: add a CNAME record pointing `www` to your Netlify subdomain, and an A record for the apex domain
5. Netlify auto-provisions SSL (HTTPS) — takes ~10 min

---

## 6. 🎨 CSS Responsive Pass (Dev Task)

Full desktop + mobile layout audit and rebuild across all pages.

**Priority pages:**
- Home (Hero two-column layout, section spacing)
- Menu (card grid — 1 col mobile, 2 col tablet, 3 col desktop)
- Catering (form layout, stat blocks)
- Find Us (map card width on desktop)
- NavBar (desktop horizontal nav vs mobile hamburger)
- Footer (column stacking on mobile)

**Goals:**
- Consistent max-width containers (`max-w-5xl` or `max-w-6xl`) on all pages
- No horizontal scroll on any viewport
- Touch-friendly tap targets (min 44px) on all buttons and links
- Typography scales properly from 375px to 1440px+
- Bottom tab bar hidden on desktop, visible on mobile

---

## 7. 🍽️ Menu Page — Ingredient & Description Rebuild (Dev Task)

Current menu cards show name + price only. Need a full ingredient-focused redesign.

**What's needed:**
- Each menu item shows full ingredient list / description below the title
- Allergen tags (gluten, dairy, etc.) as small badge pills
- "Signature" or "Fan Favorite" badge on featured items
- Better card layout: larger title, ingredient list in a readable style, price prominent
- Category filter tabs (Sandwiches, Sides, Drinks, Specials) that actually filter live
- Admin panel → Menu tab should have description + ingredients fields per item

**Note:** Menu data lives in Supabase `menu_items` table. The `description` and `ingredients` columns may need to be added if not already there — check in Supabase SQL editor:
```sql
alter table menu_items add column if not exists description text;
alter table menu_items add column if not exists ingredients text;
alter table menu_items add column if not exists allergens text[];
alter table menu_items add column if not exists badge text;
```

---

## Status

| Task | Done? |
|---|---|
| NavBar logo — swapped to /logo.png in code | ✅ Code done — drop the file (see §1) |
| Footer base44 removed — wired to Supabase | ✅ Done |
| Newsletter section — wired to Supabase | ✅ Done |
| CSS polish (grain, shimmer, glow, sticky CTA) | ✅ Done |
| Hero + About images | ❌ Run curl commands in §1 |
| PWA Icons | ❌ Run curl commands in §1 |
| logo.png file in public/ | ❌ Run curl command in §1 |
| newsletter_subscribers Supabase table | ❌ Run SQL in §2 |
| Push Notifications (VAPID) | ❌ See §3 |
| Google Maps API Key | ❌ See §4 |
| Custom domain attached | ❌ See §5 |
| CSS responsive pass | ❌ Dev task — §6 |
| Menu ingredients rebuild | ❌ Dev task — §7 |
