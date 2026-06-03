import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const GOLD = "#c9940a";
const GREEN = "#22c55e";
const RED = "#ef4444";
const sectionStyle = { background: "#fff", border: "1px solid rgba(180,120,0,0.15)" };
const inputStyle = { background: "#fffbf0", border: "1.5px solid rgba(180,120,0,0.2)", color: "#2a1200", outline: "none" };

function getMonday(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split("T")[0];
}

function fmt(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n || 0);
}

const Field = ({ label, value, onChange, prefix = "$" }) => (
  <div>
    <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>{label}</label>
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold" style={{ color: "rgba(61,34,0,0.4)" }}>{prefix}</span>
      <input
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full pl-8 pr-4 py-3 rounded-xl text-sm"
        style={inputStyle}
        placeholder="0.00"
      />
    </div>
  </div>
);

export default function FinancialsPanel() {
  const [reports, setReports] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(getMonday());
  const [form, setForm] = useState({ sales: "", labor_cost: "", food_cost: "", fuel_cost: "", other_cost: "", notes: "" });
  const [existingId, setExistingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { load(); }, []);

  useEffect(() => {
    // Populate form when week changes
    const match = reports.find(r => r.week_start === selectedWeek);
    if (match) {
      setExistingId(match.id);
      setForm({
        sales: match.sales ?? "",
        labor_cost: match.labor_cost ?? "",
        food_cost: match.food_cost ?? "",
        fuel_cost: match.fuel_cost ?? "",
        other_cost: match.other_cost ?? "",
        notes: match.notes ?? "",
      });
    } else {
      setExistingId(null);
      setForm({ sales: "", labor_cost: "", food_cost: "", fuel_cost: "", other_cost: "", notes: "" });
    }
  }, [selectedWeek, reports]);

  const load = async () => {
    const data = await base44.entities.WeeklyReport.list("-week_start", 52);
    setReports(data);
  };

  const totalCosts = (
    (parseFloat(form.labor_cost) || 0) +
    (parseFloat(form.food_cost) || 0) +
    (parseFloat(form.fuel_cost) || 0) +
    (parseFloat(form.other_cost) || 0)
  );
  const sales = parseFloat(form.sales) || 0;
  const profit = sales - totalCosts;
  const margin = sales > 0 ? ((profit / sales) * 100).toFixed(1) : null;

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      week_start: selectedWeek,
      sales: parseFloat(form.sales) || 0,
      labor_cost: parseFloat(form.labor_cost) || 0,
      food_cost: parseFloat(form.food_cost) || 0,
      fuel_cost: parseFloat(form.fuel_cost) || 0,
      other_cost: parseFloat(form.other_cost) || 0,
      notes: form.notes,
    };
    if (existingId) {
      await base44.entities.WeeklyReport.update(existingId, payload);
    } else {
      const created = await base44.entities.WeeklyReport.create(payload);
      setExistingId(created.id);
    }
    await load();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Chart data — last 8 weeks
  const chartData = [...reports].slice(0, 8).reverse().map(r => ({
    week: r.week_start?.slice(5), // MM-DD
    sales: r.sales || 0,
    costs: (r.labor_cost || 0) + (r.food_cost || 0) + (r.fuel_cost || 0) + (r.other_cost || 0),
    profit: (r.sales || 0) - ((r.labor_cost || 0) + (r.food_cost || 0) + (r.fuel_cost || 0) + (r.other_cost || 0)),
  }));

  // Generate last 8 weeks for selector
  const weekOptions = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i * 7);
    const mon = getMonday(d);
    weekOptions.push(mon);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-black text-2xl" style={{ color: "#2a1200" }}>Financials & P&L</h2>
        <p className="text-xs mt-0.5" style={{ color: "rgba(61,34,0,0.45)" }}>Track weekly sales, costs, and profit/loss.</p>
      </div>

      {/* Week selector */}
      <section className="rounded-2xl p-6" style={sectionStyle}>
        <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: GOLD }}>📅 Select Week</p>
        <select
          value={selectedWeek}
          onChange={e => setSelectedWeek(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm"
          style={inputStyle}
        >
          {weekOptions.map(w => (
            <option key={w} value={w}>
              Week of {new Date(w + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              {w === getMonday() ? " (This Week)" : ""}
              {reports.find(r => r.week_start === w) ? " ✓" : ""}
            </option>
          ))}
        </select>
      </section>

      {/* P&L summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Gross Sales", value: fmt(sales), color: GOLD, icon: "💰" },
          { label: "Total Costs", value: fmt(totalCosts), color: "#7a4f00", icon: "📉" },
          { label: profit >= 0 ? "Net Profit" : "Net Loss", value: fmt(Math.abs(profit)), color: profit >= 0 ? GREEN : RED, icon: profit >= 0 ? "✅" : "⚠️" },
          { label: "Profit Margin", value: margin !== null ? `${margin}%` : "—", color: margin >= 20 ? GREEN : margin >= 10 ? GOLD : RED, icon: "📊" },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className="rounded-2xl p-5" style={sectionStyle}>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(61,34,0,0.4)" }}>{label}</p>
              <span>{icon}</span>
            </div>
            <p className="text-2xl font-black leading-none" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Input form */}
      <section className="rounded-2xl p-6" style={sectionStyle}>
        <p className="text-xs font-black uppercase tracking-widest mb-5" style={{ color: GOLD }}>💵 Weekly Entry</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Field label="Gross Sales" value={form.sales} onChange={v => setForm(f => ({ ...f, sales: v }))} />
          <Field label="Labor / Wages" value={form.labor_cost} onChange={v => setForm(f => ({ ...f, labor_cost: v }))} />
          <Field label="Food & Ingredients" value={form.food_cost} onChange={v => setForm(f => ({ ...f, food_cost: v }))} />
          <Field label="Fuel / Transport" value={form.fuel_cost} onChange={v => setForm(f => ({ ...f, fuel_cost: v }))} />
          <Field label="Other Costs" value={form.other_cost} onChange={v => setForm(f => ({ ...f, other_cost: v }))} />
          <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>Notes</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Any notes about this week…"
              className="w-full px-4 py-3 rounded-xl text-sm resize-none"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Cost breakdown preview */}
        {totalCosts > 0 && (
          <div className="rounded-xl p-4 mb-4" style={{ background: "#fffbf0", border: "1px solid rgba(180,120,0,0.1)" }}>
            <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: "rgba(61,34,0,0.4)" }}>Cost Breakdown</p>
            {[
              { label: "Labor", val: parseFloat(form.labor_cost) || 0 },
              { label: "Food", val: parseFloat(form.food_cost) || 0 },
              { label: "Fuel", val: parseFloat(form.fuel_cost) || 0 },
              { label: "Other", val: parseFloat(form.other_cost) || 0 },
            ].filter(x => x.val > 0).map(({ label, val }) => {
              const pct = Math.round((val / totalCosts) * 100);
              return (
                <div key={label} className="mb-2">
                  <div className="flex justify-between text-xs font-semibold mb-1" style={{ color: "#3d2200" }}>
                    <span>{label}</span><span>{fmt(val)} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "rgba(180,120,0,0.1)" }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: GOLD }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button onClick={handleSave} disabled={saving}
          className="w-full py-3.5 rounded-xl font-black text-base transition-all"
          style={{ background: saved ? GREEN : GOLD, color: "#fff8e8" }}>
          {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Weekly Report"}
        </button>
      </section>

      {/* Historical chart */}
      {chartData.length > 1 && (
        <section className="rounded-2xl p-6" style={sectionStyle}>
          <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: GOLD }}>📈 Sales vs Costs — Last {chartData.length} Weeks</p>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={16} barCategoryGap="30%">
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: "rgba(61,34,0,0.4)" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: "#fff", border: "1px solid rgba(180,120,0,0.2)", borderRadius: 8, fontSize: 11 }}
                  formatter={(v, name) => [fmt(v), name === "sales" ? "Sales" : name === "costs" ? "Costs" : "Profit"]}
                />
                <Bar dataKey="sales" fill={GOLD} radius={[3, 3, 0, 0]} name="sales" />
                <Bar dataKey="costs" fill="rgba(239,68,68,0.5)" radius={[3, 3, 0, 0]} name="costs" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* History table */}
          <div className="mt-4 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(180,120,0,0.1)" }}>
            <div className="grid px-4 py-2 text-xs font-black uppercase tracking-wider"
              style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr", background: "#fffbf0", color: "rgba(61,34,0,0.4)" }}>
              <span>Week</span><span>Sales</span><span>Costs</span><span>Profit</span>
            </div>
            {[...reports].slice(0, 8).map((r, i) => {
              const costs = (r.labor_cost || 0) + (r.food_cost || 0) + (r.fuel_cost || 0) + (r.other_cost || 0);
              const p = (r.sales || 0) - costs;
              return (
                <div key={r.id} className="grid px-4 py-3 text-sm"
                  style={{
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    borderTop: i > 0 ? "1px solid rgba(180,120,0,0.06)" : "none",
                    background: r.week_start === selectedWeek ? "rgba(201,148,10,0.06)" : undefined,
                  }}>
                  <span className="font-semibold" style={{ color: "#2a1200" }}>
                    {new Date(r.week_start + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <span style={{ color: GOLD }}>{fmt(r.sales)}</span>
                  <span style={{ color: "#7a4f00" }}>{fmt(costs)}</span>
                  <span style={{ color: p >= 0 ? GREEN : RED }}>{fmt(p)}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}