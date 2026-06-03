import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const StatCard = ({ label, value, sub, color = "#c9940a", icon }) => (
  <div className="rounded-2xl p-5 flex flex-col gap-1" style={{ background: "#fff", border: "1px solid rgba(180,120,0,0.15)" }}>
    <div className="flex items-center justify-between mb-1">
      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(61,34,0,0.4)" }}>{label}</p>
      {icon && <span className="text-base">{icon}</span>}
    </div>
    <p className="text-3xl font-black leading-none" style={{ color }}>{value ?? "—"}</p>
    {sub && <p className="text-xs mt-1" style={{ color: "rgba(61,34,0,0.45)" }}>{sub}</p>}
  </div>
);

const SectionHeader = ({ emoji, title }) => (
  <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "#c9940a" }}>
    {emoji} {title}
  </p>
);

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const load = async () => {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

      const [subscribers, menuItems, weeklySpecials, events, truckLocations, pageViews] = await Promise.all([
        base44.entities.NewsletterSubscriber.list("-created_date", 500),
        base44.entities.MenuItem.list(),
        base44.entities.WeeklySpecial.list(),
        base44.entities.Event.list("-date", 50),
        base44.entities.TruckLocation.list("-updated_date", 20),
        base44.entities.PageView.list("-created_date", 1000),
      ]);

      // Subscribers
      const totalSubs = subscribers.length;
      const newSubsThisWeek = subscribers.filter(s => new Date(s.created_date) >= oneWeekAgo).length;
      const newSubsPrevWeek = subscribers.filter(s => {
        const d = new Date(s.created_date);
        return d >= twoWeeksAgo && d < oneWeekAgo;
      }).length;
      const promoClaimed = subscribers.filter(s => s.promo_claimed).length;

      // Build last 7 days subscriber chart
      const subsByDay = [];
      for (let i = 6; i >= 0; i--) {
        const dayStart = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayStart);
        dayEnd.setHours(23, 59, 59, 999);
        const count = subscribers.filter(s => {
          const d = new Date(s.created_date);
          return d >= dayStart && d <= dayEnd;
        }).length;
        subsByDay.push({
          day: dayStart.toLocaleDateString("en-US", { weekday: "short" }),
          signups: count,
        });
      }

      // Menu
      const activeItems = menuItems.filter(i => i.is_active !== false).length;
      const hiddenItems = menuItems.filter(i => i.is_active === false).length;
      const featuredItems = menuItems.filter(i => i.is_featured).length;
      const sectionCounts = menuItems.reduce((acc, item) => {
        if (item.is_active !== false) acc[item.section] = (acc[item.section] || 0) + 1;
        return acc;
      }, {});

      // Weekly Specials
      const activeSpecials = weeklySpecials.filter(s => s.is_active !== false).length;
      const topSellers = weeklySpecials.filter(s => s.is_top_seller).length;

      // Events
      const now = new Date();
      const upcomingEvents = events.filter(e => new Date(e.date) >= now && e.is_active !== false).length;
      const pastEvents = events.filter(e => new Date(e.date) < now).length;
      const featuredEvents = events.filter(e => e.is_featured).length;

      // Truck
      const latest = truckLocations[0];
      const locationUpdatesThisWeek = truckLocations.filter(l => new Date(l.updated_date) >= oneWeekAgo).length;

      // Page Views
      const totalViews7d = pageViews.filter(v => new Date(v.created_date) >= oneWeekAgo).length;
      const uniqueSessions7d = new Set(pageViews.filter(v => new Date(v.created_date) >= oneWeekAgo).map(v => v.session_id)).size;
      const topPages = Object.entries(
        pageViews.filter(v => new Date(v.created_date) >= oneWeekAgo).reduce((acc, v) => {
          acc[v.page] = (acc[v.page] || 0) + 1; return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1]).slice(0, 5);

      setData({
        totalSubs, newSubsThisWeek, newSubsPrevWeek, promoClaimed, subsByDay,
        activeItems, hiddenItems, featuredItems, sectionCounts,
        activeSpecials, topSellers,
        upcomingEvents, pastEvents, featuredEvents,
        locationUpdatesThisWeek,
        latestStatus: latest?.status,
        latestAddress: latest?.address,
        openDays: latest?.open_days,
        hoursOpen: latest?.hours_open,
        hoursClose: latest?.hours_close,
        totalViews7d,
        uniqueSessions7d,
        topPages,
      });
    };
    load();
  }, []);

  const sendReport = async () => {
    setSending(true);
    await base44.functions.invoke("weeklyDigest", {});
    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  const statusColors = { open: "#22c55e", closed: "#ef4444", en_route: "#f59e0b" };
  const statusLabel = { open: "Open", closed: "Closed", en_route: "En Route" };
  const subDelta = data ? data.newSubsThisWeek - data.newSubsPrevWeek : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-black text-xl" style={{ color: "#2a1200" }}>Analytics Overview</h2>
          <p className="text-xs mt-0.5" style={{ color: "rgba(61,34,0,0.45)" }}>Live snapshot of your business performance.</p>
        </div>
        <button
          onClick={sendReport}
          disabled={sending || sent}
          className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
          style={{ background: sent ? "#22c55e" : "#c9940a", color: "#fff8e8" }}
        >
          {sending ? "Sending…" : sent ? "✓ Report Sent!" : "📧 Email Weekly Report"}
        </button>
      </div>

      {!data ? (
        <div className="text-center py-16 text-sm rounded-2xl" style={{ color: "rgba(61,34,0,0.4)", background: "#fff", border: "1px solid rgba(180,120,0,0.15)" }}>
          Loading analytics…
        </div>
      ) : (
        <>
          {/* ── Newsletter Subscribers ── */}
          <section className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid rgba(180,120,0,0.15)" }}>
            <SectionHeader emoji="📬" title="Newsletter Subscribers" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              <StatCard label="Total Subscribers" value={data.totalSubs} icon="👥" />
              <StatCard
                label="New This Week"
                value={data.newSubsThisWeek}
                sub={`${subDelta >= 0 ? "+" : ""}${subDelta} vs last week`}
                color={subDelta >= 0 ? "#22c55e" : "#ef4444"}
                icon="📈"
              />
              <StatCard label="Promo Claimed" value={data.promoClaimed} sub="used their signup promo" color="#7a4f00" icon="🎟️" />
              <StatCard
                label="Unclaimed Promos"
                value={data.totalSubs - data.promoClaimed}
                sub="haven't redeemed yet"
                color="#3d2200"
                icon="⏳"
              />
            </div>

            {/* Signups chart */}
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(61,34,0,0.4)" }}>Signups — Last 7 Days</p>
            <div style={{ height: 140 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.subsByDay} barSize={24}>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "rgba(61,34,0,0.45)" }} axisLine={false} tickLine={false} />
                  <YAxis hide allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: "#fff", border: "1px solid rgba(180,120,0,0.2)", borderRadius: 8, fontSize: 12 }}
                    formatter={(v) => [v, "Signups"]}
                  />
                  <Bar dataKey="signups" radius={[4, 4, 0, 0]}>
                    {data.subsByDay.map((entry, i) => (
                      <Cell key={i} fill={entry.signups > 0 ? "#c9940a" : "rgba(201,148,10,0.18)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* ── Truck Operations ── */}
          <section className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid rgba(180,120,0,0.15)" }}>
            <SectionHeader emoji="🚚" title="Truck Operations" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <StatCard
                label="Current Status"
                value={statusLabel[data.latestStatus] || "Unknown"}
                sub={data.latestAddress || "No location set"}
                color={statusColors[data.latestStatus] || "#aaa"}
                icon="📍"
              />
              <StatCard label="Location Updates (7d)" value={data.locationUpdatesThisWeek} sub="times location was saved" icon="🗺️" />
              <StatCard
                label="Open Hours"
                value={data.hoursOpen && data.hoursClose ? `${data.hoursOpen}–${data.hoursClose}` : "Not set"}
                sub={data.openDays?.join(", ") || "Days not configured"}
                color="#3d2200"
                icon="🕐"
              />
            </div>
          </section>

          {/* ── Menu ── */}
          <section className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid rgba(180,120,0,0.15)" }}>
            <SectionHeader emoji="🍽️" title="Menu" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <StatCard label="Active Items" value={data.activeItems} icon="✅" />
              <StatCard label="Hidden Items" value={data.hiddenItems} color="#ef4444" icon="🚫" />
              <StatCard label="Featured on Home" value={data.featuredItems} color="#5a3e8a" icon="⭐" />
              <StatCard label="Weekly Specials" value={data.activeSpecials} sub={`${data.topSellers} top seller(s)`} color="#c9940a" icon="🧀" />
            </div>
            {Object.keys(data.sectionCounts).length > 0 && (
              <div className="rounded-xl p-4" style={{ background: "#fffbf0", border: "1px solid rgba(180,120,0,0.1)" }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(61,34,0,0.4)" }}>Items by Section</p>
                <div className="flex flex-col gap-2.5">
                  {Object.entries(data.sectionCounts).map(([section, count]) => {
                    const pct = Math.round((count / data.activeItems) * 100);
                    return (
                      <div key={section}>
                        <div className="flex justify-between text-xs font-semibold mb-1" style={{ color: "#3d2200" }}>
                          <span>{section}</span>
                          <span>{count} item{count !== 1 ? "s" : ""} ({pct}%)</span>
                        </div>
                        <div className="h-2 rounded-full" style={{ background: "rgba(180,120,0,0.1)" }}>
                          <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: "#c9940a" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* ── Events ── */}
          <section className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid rgba(180,120,0,0.15)" }}>
            <SectionHeader emoji="📅" title="Events" />
            <div className="grid grid-cols-3 gap-3">
              <StatCard label="Upcoming" value={data.upcomingEvents} color="#22c55e" icon="🗓️" />
              <StatCard label="Featured on Home" value={data.featuredEvents} color="#5a3e8a" icon="⭐" />
              <StatCard label="Past Events" value={data.pastEvents} color="rgba(61,34,0,0.4)" icon="📁" />
            </div>
          </section>

          {/* ── Site Traffic ── */}
          <section className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid rgba(180,120,0,0.15)" }}>
            <SectionHeader emoji="👁️" title="Site Traffic (Last 7 Days)" />
            <div className="grid grid-cols-2 gap-3 mb-4">
              <StatCard label="Page Views" value={data.totalViews7d} icon="📄" />
              <StatCard label="Unique Sessions" value={data.uniqueSessions7d} sub="estimated unique visitors" color="#3d2200" icon="👤" />
            </div>
            {data.topPages.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(61,34,0,0.4)" }}>Top Pages</p>
                <div className="flex flex-col gap-2">
                  {data.topPages.map(([page, count]) => {
                    const pct = data.totalViews7d > 0 ? Math.round((count / data.totalViews7d) * 100) : 0;
                    return (
                      <div key={page}>
                        <div className="flex justify-between text-xs font-semibold mb-1" style={{ color: "#3d2200" }}>
                          <span>{page}</span><span>{count} ({pct}%)</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: "rgba(180,120,0,0.1)" }}>
                          <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: "#c9940a" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}