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

# Commit all at once
git add public/ && git commit -m "chore: add images and PWA icons" && git push
```

---

## 2. 🔔 Push Notifications — VAPID Keys

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

## 3. 🗺️ Google Maps API Key (Find Us embedded map)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create project → enable **Maps Static API**
3. Create API key → restrict to your domains + Maps Static API
4. Add to Netlify environment variables:
   ```
   VITE_GOOGLE_MAPS_KEY=AIza...yourkey...
   ```

---

## 4. 🌐 Custom Domain — cheeziesgourmetohio.com

1. Go to **Netlify → Site Settings → Domain Management**
2. Click **Add custom domain**
3. Enter `cheeziesgourmetohio.com`
4. Point your domain DNS to Netlify:
   - If using Netlify DNS: change nameservers at your registrar
   - If keeping registrar DNS: add a CNAME record pointing `www` to your Netlify subdomain, and an A record for the apex domain
5. Netlify auto-provisions SSL (HTTPS) — takes ~10 min

---

## 5. 🎨 CSS Responsive Pass (Dev Task)

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

## 6. 🍽️ Menu Page — Ingredient & Description Rebuild (Dev Task)

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
| Hero + About images | ❌ Run curl commands above |
| PWA Icons | ❌ Run curl commands above |
| Push Notifications (VAPID) | ❌ |
| Google Maps API Key | ❌ |
| Custom domain attached | ❌ |
| CSS responsive pass | ❌ Dev task |
| Menu ingredients rebuild | ❌ Dev task |
