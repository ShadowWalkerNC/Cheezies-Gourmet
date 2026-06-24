import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Lightweight page tracking - logs to console in dev, ready for any analytics service
function parseUA(ua) {
  let device_type = "desktop";
  if (/tablet|ipad|playbook|silk/i.test(ua)) device_type = "tablet";
  else if (/mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua)) device_type = "mobile";
  let os = "Unknown";
  if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/windows/i.test(ua)) os = "Windows";
  else if (/mac os/i.test(ua)) os = "macOS";
  else if (/linux/i.test(ua)) os = "Linux";
  let browser = "Unknown";
  if (/edg\//i.test(ua)) browser = "Edge";
  else if (/opr\//i.test(ua)) browser = "Opera";
  else if (/chrome/i.test(ua) && !/chromium/i.test(ua)) browser = "Chrome";
  else if (/firefox/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/msie|trident/i.test(ua)) browser = "IE";
  return { device_type, os, browser };
}

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

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Vercel Speed Insights handles real analytics automatically.
    // This hook is kept as a no-op stub for future use.
    if (import.meta.env.DEV) {
      const { device_type, os, browser } = parseUA(navigator.userAgent);
      const referrer = parseReferrer(document.referrer);
      console.debug("[PageTracking]", { page: location.pathname, device_type, os, browser, referrer });
    }
  }, [location.pathname]);
}
