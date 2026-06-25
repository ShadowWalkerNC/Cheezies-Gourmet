import { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';

// Public VAPID key — replace with your own from:
// npx web-push generate-vapid-keys
// Then set VITE_VAPID_PUBLIC_KEY in your .env and Netlify env vars
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

export function usePushSubscription() {
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const supported = 'serviceWorker' in navigator && 'PushManager' in window;

  // Check if already subscribed on mount
  useEffect(() => {
    if (!supported) return;
    navigator.serviceWorker.ready.then(async reg => {
      const existing = await reg.pushManager.getSubscription();
      if (existing) setSubscribed(true);
    }).catch(() => {});
  }, [supported]);

  const subscribe = async () => {
    if (!supported) { setError('Push notifications are not supported in this browser.'); return; }
    if (!VAPID_PUBLIC_KEY) { setError('VAPID key not configured. Set VITE_VAPID_PUBLIC_KEY.'); return; }
    setLoading(true);
    setError(null);
    try {
      const reg = await navigator.serviceWorker.ready;
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== 'granted') { setLoading(false); return; }

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      const subJSON = sub.toJSON();
      // Upsert so re-subscribing the same endpoint doesn't create duplicates
      const { error: dbErr } = await supabase
        .from('push_subscriptions')
        .upsert(
          { endpoint: subJSON.endpoint, p256dh: subJSON.keys.p256dh, auth: subJSON.keys.auth, active: true, updated_at: new Date().toISOString() },
          { onConflict: 'endpoint' }
        );
      if (dbErr) throw dbErr;
      setSubscribed(true);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const unsubscribe = async () => {
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await supabase.from('push_subscriptions').update({ active: false }).eq('endpoint', sub.endpoint);
        await sub.unsubscribe();
      }
      setSubscribed(false);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return { supported, permission, subscribed, loading, error, subscribe, unsubscribe };
}
