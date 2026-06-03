import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const GOLD = "#c9940a";
const sectionStyle = { background: "#fff", border: "1px solid rgba(180,120,0,0.15)" };

const SectionHeader = ({ emoji, title }) => (
  <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: GOLD }}>
    {emoji} {title}
  </p>
);

const StatCard = ({ label, value, sub, color = GOLD, icon }) => (
  <div className="rounded-2xl p-5 flex flex-col gap-1" style={sectionStyle}>
    <div className="flex items-center justify-between mb-1">
      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(61,34,0,0.4)" }}>{label}</p>
      {icon && <span className="text-base">{icon}</span>}
    </div>
    <p className="text-3xl font-black leading-none" style={{ color }}>{value ?? "—"}</p>
    {sub && <p className="text-xs mt-1" style={{ color: "rgba(61,34,0,0.45)" }}>{sub}</p>}
  </div>
);

function BarList({ items, total }) {
  if (!items.length) return <p className="text-xs" style={{ color: "rgba(61,34,0,0.4)" }}>No data yet.</p>;
  return (
    <div className="flex flex-col gap-2">
      {items.map(({ label, count }) => {
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div key={label}>
            <div className="flex justify-between text-xs font-semibold mb-1" style={{ color: "#3d2200" }}>
              <span>{label || "Unknown"}</span>
              <span>{count} ({pct}%)</span>
            </div>
            <div className="h-2 rounded-full" style={{ background: "rgba(180,120,0,0.1)" }}>
              <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: GOLD }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function tally(views, key) {
  const counts = {};
  views.forEach(v => {
    const k = v[key] || "Unknown";
    counts[k] = (counts[k] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

export default function VisitorAnalytics() {
  const [views, setViews] = useState(null);
  const [range, setRange] = useState(7); // days

  useEffect(() => {
    base44.functions.invoke("getPageViews", {}).then(res => setViews(res.data?.views || []));
  }, []);

  if (!views) return (
    <div className="text-center py-16 text-sm rounded-2xl" style={{ color: "rgba(61,34,0,0.4)", ...sectionStyle }}>
      Loading visitor data…
    </div>
  );

  const cutoff = new Date(Date.now() - range * 24 * 60 * 60 * 1000);
  const filtered = views.filter(v => new Date(v.created_date) >= cutoff);

  const totalViews = filtered.length;
  const uniqueSessions = new Set(filtered.map(v => v.session_id)).size;
  const pwaViews = filtered.filter(v => v.is_pwa).length;

  // Page views chart by day
  const viewsByDay = [];
  for (let i = range - 1; i >= 0; i--) {
    const dayStart = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);
    const count = filtered.filter(v => {
      const d = new Date(v.created_date);
      return d >= dayStart && d <= dayEnd;
    }).length;
    viewsByDay.push({
      day: dayStart.toLocaleDateString("en-US", { weekday: "short", month: "numeric", day: "numeric" }),
      views: count,
    });
  }

  // Top pages
  const pageList = tally(filtered, "page").slice(0, 8);

  // Devices
  const deviceList = tally(filtered, "device_type");
  const osList = tally(filtered, "os");
  const browserList = tally(filtered, "browser");

  // Sources
  const referrerList = tally(filtered, "referrer").slice(0, 6);

  // Geo
  const countryList = tally(filtered, "country").slice(0, 6);
  const cityList = tally(filtered, "city").slice(0, 6);

  const RANGES = [7, 14, 30];

  return (
    <div className="flex flex-col gap-6">
      {/* Header + range toggle */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-black text-xl" style={{ color: "#2a1200" }}>Visitor Analytics</h2>
          <p className="text-xs mt-0.5" style={{ color: "rgba(61,34,0,0.45)" }}>Real traffic data from your site visitors.</p>
        </div>
        <div className="flex gap-1 rounded-xl overflow-hidden" style={{ border: "1.5px solid rgba(180,120,0,0.2)" }}>
          {RANGES.map(r => (
            <button key={r} onClick={() => setRange(r)}
              className="px-4 py-2 text-xs font-black transition-all"
              style={{
                background: range === r ? GOLD : "#fff",
                color: range === r ? "#fff8e8" : "rgba(61,34,0,0.5)",
              }}>
              {r}d
            </button>
          ))}
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Page Views" value={totalViews} icon="👁️" />
        <StatCard label="Unique Sessions" value={uniqueSessions} sub="estimated unique visitors" icon="👤" />
        <StatCard label="PWA Users" value={pwaViews} sub="using installed app" color="#5a3e8a" icon="📱" />
        <StatCard
          label="Avg Views / Visitor"
          value={uniqueSessions > 0 ? (totalViews / uniqueSessions).toFixed(1) : "—"}
          sub="pages per session"
          color="#3d2200"
          icon="📊"
        />
      </div>

      {/* Page views chart */}
      <section className="rounded-2xl p-6" style={sectionStyle}>
        <SectionHeader emoji="📈" title={`Page Views — Last ${range} Days`} />
        <div style={{ height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={viewsByDay} barSize={range > 14 ? 10 : 20}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "rgba(61,34,0,0.4)" }} axisLine={false} tickLine={false} />
              <YAxis hide allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid rgba(180,120,0,0.2)", borderRadius: 8, fontSize: 12 }}
                formatter={v => [v, "Views"]}
              />
              <Bar dataKey="views" radius={[4, 4, 0, 0]}>
                {viewsByDay.map((entry, i) => (
                  <Cell key={i} fill={entry.views > 0 ? GOLD : "rgba(201,148,10,0.15)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Top pages + Traffic sources */}
      <div className="grid md:grid-cols-2 gap-4">
        <section className="rounded-2xl p-6" style={sectionStyle}>
          <SectionHeader emoji="📄" title="Top Pages" />
          <BarList items={pageList} total={totalViews} />
        </section>
        <section className="rounded-2xl p-6" style={sectionStyle}>
          <SectionHeader emoji="🔗" title="Traffic Sources" />
          <BarList items={referrerList} total={totalViews} />
        </section>
      </div>

      {/* Devices + OS + Browser */}
      <div className="grid md:grid-cols-3 gap-4">
        <section className="rounded-2xl p-6" style={sectionStyle}>
          <SectionHeader emoji="💻" title="Devices" />
          <BarList items={deviceList} total={totalViews} />
        </section>
        <section className="rounded-2xl p-6" style={sectionStyle}>
          <SectionHeader emoji="⚙️" title="Operating System" />
          <BarList items={osList} total={totalViews} />
        </section>
        <section className="rounded-2xl p-6" style={sectionStyle}>
          <SectionHeader emoji="🌐" title="Browser" />
          <BarList items={browserList} total={totalViews} />
        </section>
      </div>

      {/* Geo */}
      <div className="grid md:grid-cols-2 gap-4">
        <section className="rounded-2xl p-6" style={sectionStyle}>
          <SectionHeader emoji="🌍" title="Top Countries" />
          <BarList items={countryList} total={totalViews} />
        </section>
        <section className="rounded-2xl p-6" style={sectionStyle}>
          <SectionHeader emoji="📍" title="Top Cities" />
          <BarList items={cityList} total={totalViews} />
        </section>
      </div>

      {totalViews === 0 && (
        <div className="rounded-2xl p-6 text-center text-sm" style={{ background: "rgba(201,148,10,0.06)", border: "1px solid rgba(180,120,0,0.15)", color: "rgba(61,34,0,0.5)" }}>
          No visitor data yet for this period. Data will appear as visitors browse the site.
        </div>
      )}
    </div>
  );
}