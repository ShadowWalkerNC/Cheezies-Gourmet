import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";

// Parse user agent into device/os/browser
function parseUA(ua) {
  // Device type
  let device_type = "desktop";
  if (/tablet|ipad|playbook|silk/i.test(ua)) device_type = "tablet";
  else if (/mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua)) device_type = "mobile";

  // OS
  let os = "Unknown";
  if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/windows/i.test(ua)) os = "Windows";
  else if (/mac os/i.test(ua)) os = "macOS";
  else if (/linux/i.test(ua)) os = "Linux";

  // Browser
  let browser = "Unknown";
  if (/edg\//i.test(ua)) browser = "Edge";
  else if (/opr\//i.test(ua)) browser = "Opera";
  else if (/chrome/i.test(ua) && !/chromium/i.test(ua)) browser = "Chrome";
  else if (/firefox/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/msie|trident/i.test(ua)) browser = "IE";

  return { device_type, os, browser };
}

// Get or create an anonymous session ID
function getSessionId() {
  let sid = sessionStorage.getItem("_cz_sid");
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem("_cz_sid", sid);
  }
  return sid;
}

// Parse referrer into a clean source label
function parseReferrer(ref) {
  if (!ref) return "Direct";
  try {
    const url = new URL(ref);
    const host = url.hostname.replace("www.", "");
    if (host.includes("facebook")) return "Facebook";
    if (host.includes("instagram")) return "Instagram";
    if (host.includes("tiktok")) return "TikTok";
    if (host.includes("google")) return "Google";
    if (host.includes("bing")) return "Bing";
    return host;
  } catch {
    return "Direct";
  }
}

// Geo lookup via free API (no key needed)
async function getGeo() {
  try {
    const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) });
    const d = await res.json();
    return { country: d.country_name || "", city: d.city || "", region: d.region || "" };
  } catch {
    return { country: "", city: "", region: "" };
  }
}

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    const track = async () => {
      const ua = navigator.userAgent;
      const { device_type, os, browser } = parseUA(ua);
      const session_id = getSessionId();
      const referrer = parseReferrer(document.referrer);
      const is_pwa = window.matchMedia("(display-mode: standalone)").matches ||
                     window.navigator.standalone === true;
      const geo = await getGeo();

      base44.entities.PageView.create({
        page: location.pathname,
        referrer,
        device_type,
        os,
        browser,
        session_id,
        is_pwa,
        ...geo,
      });
    };

    track();
  }, [location.pathname]);
}