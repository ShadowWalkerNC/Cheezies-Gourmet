# Cheezies Gourmet — Remaining TODO

Everything below requires manual steps outside the codebase.
The code is already wired — just needs the external resource added.

---

## 1. 🖼️ PWA Icons (URGENT — install icon is broken)

The manifest points to `/icon-192.png` and `/icon-512.png` in `public/`.
Both files are missing. The resized icons are ready to download.

```bash
curl -o public/icon-192.png "https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/b64f6135310aebc56134a87a34e44cb0/c6108fea-e1e2-415d-af3f-5d9f39700dce/966c2ce6.png"

curl -o public/icon-512.png "https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/b64f6135310aebc56134a87a34e44cb0/c6108fea-e1e2-415d-af3f-5d9f39700dce/db1b1e57.png"

git add public/icon-192.png public/icon-512.png && git commit -m "chore: add PWA icons" && git push
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

Currently shows a tap-to-open card. With this key it shows a full embedded map.

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create project → enable **Maps Static API**
3. Create API key → restrict to your domains + Maps Static API
4. Add to `.env` locally:
   ```
   VITE_GOOGLE_MAPS_KEY=AIza...yourkey...
   ```
5. Add same variable in **Netlify → Site Settings → Environment Variables**

Free tier: $200/month credit → ~100,000 map loads. You won’t hit it.

---

## Status

| Task | Done? |
|---|---|
| PWA Icons | ❌ |
| Push Notifications (VAPID) | ❌ |
| Google Maps API Key | ❌ |
