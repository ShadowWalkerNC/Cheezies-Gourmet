import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const GOLD = "#c9940a";
const sectionStyle = { background: "#fff", border: "1px solid rgba(180,120,0,0.15)" };

const KPI = ({ label, value, sub, color = GOLD, icon }) => (
  <div className="rounded-2xl p-5 flex flex-col gap-1" style={sectionStyle}>
    <div className="flex items-center justify-between mb-1">
      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(61,34,0,0.4)" }}>{label}</p>
      <span className="text-lg">{icon}</span>
    </div>
    <p className="text-3xl font-black leading-none" style={{ color }}>{value ?? "—"}</p>
    {sub && <p className="text-xs mt-1" style={{ color: "rgba(61,34,0,0.45)" }}>{sub}</p>}
  </div>
);

const statusColors = { open: "#22c55e", closed: "#ef4444", en_route: "#f59e0b" };
const statusLabels = { open: "🟢 Open Now", closed: "🔴 Closed", en_route: "🟡 En Route" };

export default function MissionControl() {
  const [data, setData] = useState(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const load = async () => {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const [subscribers, menuItems, events, truckLocations, pageViews] = await Promise.all([
        base44.entities.NewsletterSubscriber.list("-created_date", 2000),
        base44.entities.MenuItem.list(),
        base44.entities.Event.list("-date", 50),
        base44.entities.TruckLocation.list("-updated_date", 1),
        base44.entities.PageView.list("-created_date", 500),
      ]);

      const truck = truckLocations[0];
      const newSubs = subscribers.filter(s => new Date(s.created_date) >= oneWeekAgo).length;
      const upcomingEvents = events.filter(e => new Date(e.date) >= new Date() && e.is_active !== false).length;
      const activeMenu = menuItems.filter(i => i.is_active !== false).length;
      const recentViews = pageViews.filter(v => new Date(v.created_date) >= oneWeekAgo).length;
      const uniqueSessions = new Set(pageViews.filter(v => new Date(v.created_date) >= oneWeekAgo).map(v => v.session_id)).size;

      setData({ truck, subscribers: subscribers.length, newSubs, upcomingEvents, activeMenu, recentViews, uniqueSessions });
    };
    load();
  }, []);

  const sendWeeklyReport = async () => {
    setSending(true);
    await base44.functions.invoke("weeklyDigest", {});
    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-black text-2xl" style={{ color: "#2a1200" }}>Mission Control 🎯</h2>
          <p className="text-xs mt-0.5" style={{ color: "rgba(61,34,0,0.45)" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <button
          onClick={sendWeeklyReport}
          disabled={sending || sent}
          className="px-5 py-2.5 rounded-xl font-bold text-sm"
          style={{ background: sent ? "#22c55e" : GOLD, color: "#fff8e8" }}
        >
          {sending ? "Sending…" : sent ? "✓ Report Sent!" : "📧 Email Weekly Report"}
        </button>
      </div>

      {/* Truck status banner */}
      {data?.truck && (
        <div className="rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap"
          style={{ background: data.truck.status === "open" ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.06)", border: `1.5px solid ${statusColors[data.truck.status]}30` }}>
          <div>
            <p className="font-black text-lg" style={{ color: statusColors[data.truck.status] }}>
              {statusLabels[data.truck.status] || "Unknown"}
            </p>
            <p className="text-sm mt-0.5" style={{ color: "rgba(61,34,0,0.6)" }}>
              {data.truck.address || "No location set"} · {data.truck.hours_open}–{data.truck.hours_close}
            </p>
          </div>
          <span className="text-4xl">🚚</span>
        </div>
      )}

      {/* KPI Grid */}
      {!data ? (
        <div className="text-center py-16 text-sm rounded-2xl" style={{ color: "rgba(61,34,0,0.4)", ...sectionStyle }}>Loading…</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <KPI label="Newsletter Subscribers" value={data.subscribers} sub={`+${data.newSubs} this week`} icon="📬" />
          <KPI label="Site Visitors (7d)" value={data.recentViews} sub={`${data.uniqueSessions} unique sessions`} icon="👁️" />
          <KPI label="Active Menu Items" value={data.activeMenu} sub="currently on menu" color="#3d2200" icon="🍽️" />
          <KPI label="Upcoming Events" value={data.upcomingEvents} sub="scheduled events" color="#5a3e8a" icon="📅" />
        </div>
      )}

      {/* Quick links */}
      <section className="rounded-2xl p-6" style={sectionStyle}>
        <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: GOLD }}>⚡ Quick Actions</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "📍 Update Truck Location", tab: "truck" },
            { label: "🍽️ Manage Menu", tab: "menu" },
            { label: "📅 Add Event", tab: "events" },
            { label: "📬 Email Subscribers", tab: "crm" },
            { label: "📊 View Analytics", tab: "analytics" },
            { label: "✏️ Edit Content", tab: "content" },
          ].map(({ label, tab }) => (
            <button
              key={tab}
              onClick={() => {
                // Signal parent via custom event
                window.dispatchEvent(new CustomEvent("admin-nav", { detail: tab }));
              }}
              className="text-left px-4 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-80"
              style={{ background: "rgba(201,148,10,0.07)", color: "#7a4f00", border: "1.5px solid rgba(180,120,0,0.15)" }}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Social links */}
      <section className="rounded-2xl p-6" style={sectionStyle}>
        <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: GOLD }}>📣 Social Channels</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: "Facebook", url: "https://www.facebook.com/cheeziesohio", color: "#1877F2" },
            { name: "Instagram", url: "https://instagram.com/cheeziesohio", color: "#e1306c" },
            { name: "TikTok", url: "https://tiktok.com/@cheeziesohio", color: "#010101" },
            { name: "Google Reviews", url: "https://maps.app.goo.gl/dUyof854YsHaKcNE9", color: "#4285F4" },
          ].map(s => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-80"
              style={{ background: `${s.color}12`, color: s.color, border: `1.5px solid ${s.color}30`, textDecoration: "none" }}>
              {s.name} <span>→</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}