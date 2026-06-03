import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const GOLD = "#c9940a";
const sectionStyle = { background: "#fff", border: "1px solid rgba(180,120,0,0.15)" };
const inputStyle = { background: "#fffbf0", border: "1.5px solid rgba(180,120,0,0.2)", color: "#2a1200", outline: "none" };

function getMonday(d = new Date()) {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split("T")[0];
}

function fmt(n) {
  if (n == null || n === "") return "—";
  return `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const COST_FIELDS = [
  { key: "labor_cost",  label: "Labor / Wages",     placeholder: "0.00", color: "#3b82f6" },
  { key: "food_cost",   label: "Food & Ingredients", placeholder: "0.00", color: "#f59e0b" },
  { key: "fuel_cost",   label: "Fuel / Transport",   placeholder: "0.00", color: "#ef4444" },
  { key: "other_cost",  label: "Other Overhead",     placeholder: "0.00", color: "#8b5cf6" },
];

export default function FinancialsPanel() {
  const [weekStart, setWeekStart] = useState(getMonday());
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ sales: "", labor_cost: "", food_cost: "", fuel_cost: "", other_cost: "", notes: "" });
  const [currentId, setCurrentId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { loadRecords(); }, []);
  useEffect(() => { applyWeek(weekStart); }, [weekStart, records]);

  const loadRecords = async () => {
    const data = await base44.entities.WeeklyReport.list("-week_start", 20);
    setRecords(data);
  };

  const applyWeek = (ws) => {
    const rec = records.find(r => r.week_start === ws);
    if (rec) {
      setCurrentId(rec.id);
      setForm({
        sales: rec.sales ?? "",
        labor_cost: rec.labor_cost ?? "",
        food_cost: rec.food_cost ?? "",
        fuel_cost: rec.fuel_cost ?? "",
        other_cost: rec.other_cost ?? "",
        notes: rec.notes ?? "",
      });
    } else {
      setCurrentId(null);
      setForm({ sales: "", labor_cost: "", food_cost: "", fuel_cost: "", other_cost: "", notes: "" });
    }
  };

  const totalCosts = () => {
    return ["labor_cost", "food_cost", "fuel_cost", "other_cost"].reduce((sum, k) => sum + (Number(form[k]) || 0), 0);
  };
  const profit = () => (Number(form.sales) || 0) - totalCosts();
  const margin = () => {
    const s = Number(form.sales);
    if (!s) return null;
    return ((profit() / s) * 100).toFixed(1);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      week_start: weekStart,
      sales: Number(form.sales) || 0,
      labor_cost: Number(form.labor_cost) || 0,
      food_cost: Number(form.food_cost) || 0,
      fuel_cost: Number(form.fuel_cost) || 0,
      other_cost: Number(form.other_cost) || 0,
      notes: form.notes,
    };
    if (currentId) {
      await base44.entities.WeeklyReport.update(currentId, payload);
    } else {
      const created = await base44.entities.WeeklyReport.create(payload);
      setCurrentId(created.id);
    }
    await loadRecords();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Chart data — last 8 weeks
  const chartData = [...records]
    .sort((a, b) => a.week_start.localeCompare(b.week_start))
    .slice(-8)
    .map(r => {
      const costs = (r.labor_cost || 0) + (r.food_cost || 0) + (r.fuel_cost || 0) + (r.other_cost || 0);
      return {
        week: r.week_start.slice(5), // MM-DD
        Sales: r.sales || 0,
        Costs: costs,
        Profit: Math.max(0, (r.sales || 0) - costs),
      };
    });

  const p = profit();
  const m = margin();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-black text-2xl" style={{ color: "#2a1200" }}>Financials 💰</h2>
        <p className="text-xs mt-0.5" style={{ color: "rgba(61,34,0,0.45)" }}>Track weekly sales and costs to understand profitability.</p>
      </div>

      {/* Week picker */}
      <section className="rounded-2xl p-6" style={sectionStyle}>
        <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: GOLD }}>📅 Select Week</p>
        <input
          type="date"
          value={weekStart}
          onChange={e => setWeekStart(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm"
          style={inputStyle}
        />
        <p className="text-xs mt-2" style={{ color: "rgba(61,34,0,0.4)" }}>
          {currentId ? "✓ Existing record — editing" : "New entry for this week"}
        </p>
      </section>

      {/* Input form */}
      <section className="rounded-2xl p-6" style={sectionStyle}>
        <p className="text-xs font-black uppercase tracking-widest mb-5" style={{ color: GOLD }}>📝 Weekly Numbers</p>
        <div className="flex flex-col gap-4">
          {/* Sales */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>
              💵 Gross Sales
            </label>
            <input
              type="number" min="0" step="0.01" placeholder="0.00"
              value={form.sales}
              onChange={e => setForm(f => ({ ...f, sales: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm"
              style={inputStyle}
            />
          </div>
          {/* Cost fields */}
          {COST_FIELDS.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>
                📉 {label}
              </label>
              <input
                type="number" min="0" step="0.01" placeholder={placeholder}
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={inputStyle}
              />
            </div>
          ))}
          {/* Notes */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>
              📋 Notes
            </label>
            <textarea
              rows={2} placeholder="Anything notable this week…"
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm resize-none"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Live P&L summary */}
        {(form.sales || form.labor_cost || form.food_cost) && (
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-xl p-4 text-center" style={{ background: "#f0fdf4", border: "1px solid #86efac" }}>
              <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "#15803d" }}>Sales</p>
              <p className="font-black text-lg" style={{ color: "#15803d" }}>{fmt(form.sales)}</p>
            </div>
            <div className="rounded-xl p-4 text-center" style={{ background: "#fef2f2", border: "1px solid #fca5a5" }}>
              <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "#dc2626" }}>Costs</p>
              <p className="font-black text-lg" style={{ color: "#dc2626" }}>{fmt(totalCosts())}</p>
            </div>
            <div className="rounded-xl p-4 text-center" style={{
              background: p >= 0 ? "#f0fdf4" : "#fef2f2",
              border: `1px solid ${p >= 0 ? "#86efac" : "#fca5a5"}`,
            }}>
              <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: p >= 0 ? "#15803d" : "#dc2626" }}>Profit</p>
              <p className="font-black text-lg" style={{ color: p >= 0 ? "#15803d" : "#dc2626" }}>
                {fmt(p)}
                {m != null && <span className="text-xs ml-1">({m}%)</span>}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleSave} disabled={saving}
          className="w-full py-4 rounded-2xl font-black text-lg mt-5 transition-all"
          style={{ background: saved ? "#22c55e" : GOLD, color: "#fff8e8", boxShadow: "0 4px 20px rgba(180,120,0,0.3)" }}
        >
          {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Week"}
        </button>
      </section>

      {/* Chart */}
      {chartData.length > 0 && (
        <section className="rounded-2xl p-6" style={sectionStyle}>
          <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: GOLD }}>📊 Sales vs Costs — Last 8 Weeks</p>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={2} barCategoryGap="20%">
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: "rgba(61,34,0,0.4)" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: "#fff", border: "1px solid rgba(180,120,0,0.2)", borderRadius: 8, fontSize: 12 }}
                  formatter={(v, name) => [fmt(v), name]}
                />
                <Bar dataKey="Sales" fill="#22c55e" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Costs" fill="#ef4444" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* History table */}
      {records.length > 0 && (
        <section className="rounded-2xl overflow-hidden" style={sectionStyle}>
          <p className="text-xs font-black uppercase tracking-widest px-6 py-4" style={{ color: GOLD, borderBottom: "1px solid rgba(180,120,0,0.1)" }}>
            📋 Recent Weeks
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#fffbf0", borderBottom: "1px solid rgba(180,120,0,0.08)" }}>
                  {["Week", "Sales", "Costs", "Profit", "Margin"].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-xs font-black uppercase tracking-wider" style={{ color: "rgba(61,34,0,0.4)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...records].sort((a, b) => b.week_start.localeCompare(a.week_start)).slice(0, 10).map((r, i) => {
                  const costs = (r.labor_cost || 0) + (r.food_cost || 0) + (r.fuel_cost || 0) + (r.other_cost || 0);
                  const prof = (r.sales || 0) - costs;
                  const mar = r.sales ? ((prof / r.sales) * 100).toFixed(1) : null;
                  return (
                    <tr key={r.id} style={{ borderBottom: i < records.length - 1 ? "1px solid rgba(180,120,0,0.06)" : "none" }}
                      className="hover:bg-amber-50 cursor-pointer transition-colors"
                      onClick={() => setWeekStart(r.week_start)}>
                      <td className="px-4 py-3 font-bold" style={{ color: "#2a1200" }}>{r.week_start}</td>
                      <td className="px-4 py-3" style={{ color: "#15803d" }}>{fmt(r.sales)}</td>
                      <td className="px-4 py-3" style={{ color: "#dc2626" }}>{fmt(costs)}</td>
                      <td className="px-4 py-3 font-bold" style={{ color: prof >= 0 ? "#15803d" : "#dc2626" }}>{fmt(prof)}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: "rgba(61,34,0,0.5)" }}>{mar != null ? `${mar}%` : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}