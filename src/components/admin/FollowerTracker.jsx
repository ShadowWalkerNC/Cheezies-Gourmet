import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

// Follower = newsletter subscribers stored in a base44 entity
// We surface them here alongside social links

export default function FollowerTracker() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  // We track newsletter subscribers via the sendNotification function logs
  // Instead we'll use localStorage-persisted signups from the newsletter form
  // For now we expose what's available: social channel links + subscriber list from InvokeLLM logs
  // In reality, we store newsletter_signup events — we can retrieve them via a backend search

  const load = async () => {
    setLoading(true);
    try {
      // Ask the LLM to summarize follower growth tips — but also pull any stored leads
      // For a real implementation, newsletter emails are sent to owner via sendNotification
      // We'll show a stats panel with social links and CTA performance tips
      setSubscribers([]); // placeholder — real data would come from a Lead entity
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const socials = [
    { name: "Facebook", url: "https://www.facebook.com/cheeziesohio", color: "#1877F2", followers: "Check Page", cta: "Post Today's Location" },
    { name: "Instagram", url: "https://instagram.com/cheeziesohio", color: "#e1306c", followers: "Check App", cta: "Post a Story" },
    { name: "TikTok", url: "https://tiktok.com/@cheeziesohio", color: "#010101", followers: "Check App", cta: "Post a Video" },
    { name: "Google", url: "https://maps.app.goo.gl/dUyof854YsHaKcNE9", color: "#4285F4", followers: "Reviews", cta: "Share Review Link" },
  ];

  const tips = [
    { icon: "📍", text: "Post your location every morning on Facebook — it drives walk-up traffic." },
    { icon: "📸", text: "Share a photo of today's special on Instagram Stories before opening." },
    { icon: "⭐", text: "Ask happy customers to leave a Google Review after each visit." },
    { icon: "🧀", text: "Run a Facebook poll asking followers what new sandwich they want next." },
    { icon: "🎉", text: "Announce pop-up events via Facebook Events — followers get notified automatically." },
  ];

  return (
    <section className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid rgba(180,120,0,0.15)", boxShadow: "0 2px 12px rgba(180,120,0,0.06)" }}>
      {/* Header */}
      <div className="px-6 py-4" style={{ background: "#1a0800", borderBottom: "2px solid #c9940a" }}>
        <div className="flex items-center gap-2.5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9940a" strokeWidth="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span className="font-black text-base" style={{ color: "#fff8e8" }}>Followers & Social</span>
        </div>
      </div>

      <div className="p-6">
        {/* Social channels */}
        <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: "rgba(61,34,0,0.4)" }}>Your Channels</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {socials.map(s => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-1 p-3 transition-all hover:scale-[1.02]"
              style={{ background: "#fafaf8", border: "1.5px solid #e8e0d0", textDecoration: "none" }}
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-sm" style={{ color: "#1a0800" }}>{s.name}</span>
                <span className="text-xs font-bold px-1.5 py-0.5" style={{ background: `${s.color}18`, color: s.color }}>
                  {s.followers}
                </span>
              </div>
              <span className="text-xs" style={{ color: "rgba(61,34,0,0.45)" }}>→ {s.cta}</span>
            </a>
          ))}
        </div>

        {/* Growth tips */}
        <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: "rgba(61,34,0,0.4)" }}>Daily Growth Tips</p>
        <div className="flex flex-col gap-2">
          {tips.map((t, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3" style={{ background: "#fff8e8", border: "1.5px solid #e8e0d0" }}>
              <span className="text-base shrink-0">{t.icon}</span>
              <p className="text-sm" style={{ color: "rgba(61,34,0,0.7)" }}>{t.text}</p>
            </div>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-5 p-4" style={{ background: "#c9940a18", border: "1.5px solid #c9940a33" }}>
          <p className="font-black text-sm mb-1" style={{ color: "#1a0800" }}>Newsletter Subscribers</p>
          <p className="text-xs mb-3" style={{ color: "rgba(61,34,0,0.6)" }}>
            Subscribers sign up via the website footer. Each signup triggers an email to you via the notification system.
            Check your inbox for subscriber notifications.
          </p>
          <a
            href={`mailto:${""}`}
            className="text-xs font-black tracking-widest uppercase px-4 py-2 inline-block"
            style={{ background: "#c9940a", color: "#fff" }}
          >
            Open Email Inbox →
          </a>
        </div>
      </div>
    </section>
  );
}