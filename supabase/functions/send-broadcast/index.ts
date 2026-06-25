// Supabase Edge Function: send-broadcast
// Triggered by: POST /functions/v1/send-broadcast
// Called from: BroadcastTab after inserting a broadcast_log row
// Or: set up a pg_cron job to call this every minute for queued rows
//
// Required secrets (set via: supabase secrets set KEY=value):
//   VAPID_PUBLIC_KEY   — your VAPID public key
//   VAPID_PRIVATE_KEY  — your VAPID private key
//   VAPID_SUBJECT      — mailto:cheeziesgourmet@gmail.com
//   SUPABASE_URL       — auto-injected by Supabase
//   SUPABASE_SERVICE_ROLE_KEY — auto-injected by Supabase

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Minimal Web Push sender — uses the web-push npm-compatible approach via fetch
async function sendWebPush(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: string,
  vapidPublic: string,
  vapidPrivate: string,
  subject: string
): Promise<{ ok: boolean; status?: number }> {
  // Build a minimal JWT for VAPID
  const audience = new URL(subscription.endpoint).origin;
  const now = Math.floor(Date.now() / 1000);
  const header = btoa(JSON.stringify({ typ: 'JWT', alg: 'ES256' })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const claims = btoa(JSON.stringify({ aud: audience, exp: now + 43200, sub: subject })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  // Import VAPID private key for signing
  const rawPrivate = Uint8Array.from(atob(vapidPrivate.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    rawPrivate,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  );
  const sigInput = new TextEncoder().encode(`${header}.${claims}`);
  const sigBuffer = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, cryptoKey, sigInput);
  const sig = btoa(String.fromCharCode(...new Uint8Array(sigBuffer))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const jwt = `${header}.${claims}.${sig}`;

  // Encrypt payload with ECDH (simplified — using unencrypted for Deno compatibility)
  // For production encryption use: https://github.com/nickvdyck/webtransport (or switch to a Deno Web Push lib)
  const body = new TextEncoder().encode(payload);

  const res = await fetch(subscription.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'TTL': '86400',
      'Authorization': `vapid t=${jwt},k=${vapidPublic}`,
      'Content-Length': body.byteLength.toString(),
    },
    body,
  });

  return { ok: res.status < 300 || res.status === 201, status: res.status };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, content-type' } });
  }

  const VAPID_PUBLIC  = Deno.env.get('VAPID_PUBLIC_KEY') ?? '';
  const VAPID_PRIVATE = Deno.env.get('VAPID_PRIVATE_KEY') ?? '';
  const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT') ?? 'mailto:cheeziesgourmet@gmail.com';

  if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
    return new Response(JSON.stringify({ error: 'VAPID keys not configured' }), { status: 500 });
  }

  // 1. Fetch all queued broadcasts
  const { data: queued, error: qErr } = await supabase
    .from('broadcast_log')
    .select('*')
    .eq('status', 'queued')
    .order('sent_at', { ascending: true })
    .limit(10);

  if (qErr) return new Response(JSON.stringify({ error: qErr.message }), { status: 500 });
  if (!queued || queued.length === 0) return new Response(JSON.stringify({ sent: 0 }), { status: 200 });

  // 2. Fetch all active push subscriptions
  const { data: subs, error: sErr } = await supabase
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth')
    .eq('active', true);

  if (sErr) return new Response(JSON.stringify({ error: sErr.message }), { status: 500 });
  if (!subs || subs.length === 0) {
    // No subscribers yet — still mark as sent so we don't loop forever
    await supabase.from('broadcast_log').update({ status: 'sent', recipient_count: 0 }).in('id', queued.map(b => b.id));
    return new Response(JSON.stringify({ sent: 0, broadcasts: queued.length }), { status: 200 });
  }

  let totalSent = 0;
  const deadEndpoints: string[] = [];

  for (const broadcast of queued) {
    const payload = JSON.stringify({
      title: 'Cheezies Gourmet 🧀',
      body: broadcast.message,
      url: '/',
    });

    let sent = 0;
    await Promise.allSettled(
      subs.map(async sub => {
        const result = await sendWebPush(sub, payload, VAPID_PUBLIC, VAPID_PRIVATE, VAPID_SUBJECT);
        if (result.ok) {
          sent++;
        } else if (result.status === 410 || result.status === 404) {
          // Subscription expired — mark inactive
          deadEndpoints.push(sub.endpoint);
        }
      })
    );

    // Mark broadcast as sent
    await supabase
      .from('broadcast_log')
      .update({ status: 'sent', recipient_count: sent })
      .eq('id', broadcast.id);

    totalSent += sent;
  }

  // Clean up dead subscriptions
  if (deadEndpoints.length > 0) {
    await supabase.from('push_subscriptions').update({ active: false }).in('endpoint', deadEndpoints);
  }

  return new Response(
    JSON.stringify({ ok: true, broadcasts: queued.length, sent: totalSent, cleaned: deadEndpoints.length }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
});
