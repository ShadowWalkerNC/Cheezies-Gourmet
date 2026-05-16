import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const StatCard = ({ label, value, sub, color = "#c9940a" }) => (
  <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid rgba(180,120,0,0.15)" }}>
    <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "rgba(61,34,0,0.4)" }}>{label}</p>
    <p className="text-3xl font-black" style={{ color }}>{value ?? "—"}</p>
    {sub && <p className="text-xs mt-1" style={{ color: "rgba(61,34,0,0.45)" }}>{sub}</p>}
  </div>
);

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const load = async () => {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

      const [users, menuItems, truckLocations] = await Promise.all([
        base44.entities.User.list(),
        base44.entities.MenuItem.list(),
        base44.entities.TruckLocation.list("-updated_date", 20),
      ]);

      const newThisWeek = users.filter(u => new Date(u.created_date) >= oneWeekAgo).length;
      const newPrevWeek = users.filter(u => {
        const d = new Date(u.created_date);
        return d >= twoWeeksAgo && d < oneWeekAgo;
      }).length;

      const activeItems = menuItems.filter(i => i.is_active !== false).length;
      const featuredItems = menuItems.filter(i => i.is_featured).length;

      const sectionCounts = menuItems.reduce((acc, item) => {
        if (item.is_active !== false) acc[item.section] = (acc[item.section] || 0) + 1;
        return acc;
      }, {});

      const locationUpdatesThisWeek = truckLocations.filter(
        l => new Date(l.updated_date) >= oneWeekAgo
      ).length;

      const latest = truckLocations[0];

      setData({
        totalUsers: users.length,
        newThisWeek,
        newPrevWeek,
        adminCount: users.filter(u => u.role === "admin").length,
        activeItems,
        featuredItems,
        sectionCounts,
        locationUpdatesThisWeek,
        latestStatus: latest?.status,
        latestAddress: latest?.address,
        openDays: latest?.open_days,
        hoursOpen: latest?.hours_open,
        hoursClose: latest?.hours_close,
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
  const growthDelta = data ? data.newThisWeek - data.newPrevWeek : 0;

  const sectionStyle = { background: "#fff", border: "1px solid rgba(180,120,0,0.15)", boxShadow: "0 2px 12px rgba(180,120,0,0.06)" };

  return (
    <section className="rounded-2xl p-6" style={sectionStyle}>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="font-black text-lg" style={{ color: "#2a1200" }}>Analytics Overview</h2>
          <p className="text-xs mt-0.5" style={{ color: "rgba(61,34,0,0.45)" }}>Live snapshot of your app and truck performance.</p>
        </div>
        <button
          onClick={sendReport}
          disabled={sending || sent}
          className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105"
          style={{ background: sent ? "#22c55e" : "#c9940a", color: "#fff8e8" }}
        >
          {sending ? "Sending…" : sent ? "✓ Report Sent!" : "📧 Email Report Now"}
        </button>
      </div>

      {!data ? (
        <div className="text-center py-10 text-sm" style={{ color: "rgba(61,34,0,0.4)" }}>Loading analytics…</div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Audience */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "#c9940a" }}>👥 Audience</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Total Users" value={data.totalUsers} />
              <StatCard
                label="New This Week"
                value={data.newThisWeek}
                sub={`${growthDelta >= 0 ? "+" : ""}${growthDelta} vs last week`}
                color={growthDelta >= 0 ? "#22c55e" : "#ef4444"}
              />
              <StatCard label="Admin Accounts" value={data.adminCount} color="#7a4f00" />
              <StatCard label="Regular Users" value={data.totalUsers - data.adminCount} color="#3d2200" />
            </div>
          </div>

          {/* Truck Ops */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "#c9940a" }}>🚚 Truck Operations</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <StatCard
                label="Current Status"
                value={statusLabel[data.latestStatus] || "Unknown"}
                sub={data.latestAddress || "No location set"}
                color={statusColors[data.latestStatus] || "#aaa"}
              />
              <StatCard label="Location Updates (7d)" value={data.locationUpdatesThisWeek} sub="times location was saved" />
              <StatCard
                label="Open Hours"
                value={data.hoursOpen && data.hoursClose ? `${data.hoursOpen}–${data.hoursClose}` : "Not set"}
                sub={data.openDays?.join(", ") || "Days not configured"}
                color="#3d2200"
              />
            </div>
          </div>

          {/* Menu */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "#c9940a" }}>🍽️ Menu</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
              <StatCard label="Active Items" value={data.activeItems} />
              <StatCard label="Featured on Home" value={data.featuredItems} color="#5a3e8a" />
            </div>
            {Object.keys(data.sectionCounts).length > 0 && (
              <div className="rounded-xl p-4" style={{ background: "#fffbf0", border: "1px solid rgba(180,120,0,0.1)" }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(61,34,0,0.4)" }}>Items by Section</p>
                <div className="flex flex-col gap-2">
                  {Object.entries(data.sectionCounts).map(([section, count]) => {
                    const pct = Math.round((count / data.activeItems) * 100);
                    return (
                      <div key={section}>
                        <div className="flex justify-between text-xs font-semibold mb-1" style={{ color: "#3d2200" }}>
                          <span>{section}</span>
                          <span>{count} items ({pct}%)</span>
                        </div>
                        <div className="h-2 rounded-full" style={{ background: "rgba(180,120,0,0.1)" }}>
                          <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: "#c9940a" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Note about traffic */}
          <div className="rounded-xl p-4 text-sm" style={{ background: "rgba(201,148,10,0.06)", border: "1px solid rgba(180,120,0,0.12)" }}>
            <p className="font-bold mb-1" style={{ color: "#7a4f00" }}>📈 Website Traffic Tracking</p>
            <p style={{ color: "rgba(61,34,0,0.6)" }}>
              To track page views and visitor traffic, connect Google Analytics to your site. Add your GA4 Measurement ID to <code className="px-1 rounded text-xs" style={{ background: "rgba(0,0,0,0.06)" }}>index.html</code> — or ask us to set it up for you.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}