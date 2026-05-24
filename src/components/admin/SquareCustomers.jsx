import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function SquareCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loyalty, setLoyalty] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [custRes, loyRes] = await Promise.all([
        base44.functions.invoke("squareSync", { action: "customers" }),
        base44.functions.invoke("squareSync", { action: "loyalty" }),
      ]);
      setCustomers(custRes.data.customers || []);
      // Map loyalty by customer id
      const loyMap = {};
      for (const l of (loyRes.data.accounts || [])) {
        loyMap[l.customer_id] = l;
      }
      setLoyalty(loyMap);
    } catch (e) {
      setError("Failed to load customer data.");
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = customers.filter(c => {
    const q = search.toLowerCase();
    return !q || (c.name || "").toLowerCase().includes(q) || (c.email || "").includes(q) || (c.phone || "").includes(q);
  });

  return (
    <section className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid rgba(180,120,0,0.15)", boxShadow: "0 2px 12px rgba(180,120,0,0.06)" }}>
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between" style={{ background: "#1a0800", borderBottom: "2px solid #c9940a" }}>
        <div className="flex items-center gap-2.5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9940a" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span className="font-black text-base" style={{ color: "#fff8e8" }}>Square Customers</span>
        </div>
        <button onClick={load} className="text-xs font-black px-3 py-1.5 tracking-widest uppercase" style={{ background: "rgba(201,148,10,0.2)", color: "#c9940a", border: "1px solid rgba(201,148,10,0.3)" }}>
          Refresh
        </button>
      </div>

      <div className="p-6">
        {loading && (
          <div className="flex items-center justify-center py-10 gap-3">
            <div className="w-5 h-5 border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
            <span className="text-sm" style={{ color: "rgba(61,34,0,0.5)" }}>Loading customers…</span>
          </div>
        )}
        {error && !loading && (
          <p className="text-sm font-bold text-center py-6" style={{ color: "#ef4444" }}>{error}</p>
        )}
        {!loading && !error && (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="p-3 text-center" style={{ background: "#fff8e8", border: "1.5px solid #e8e0d0" }}>
                <p className="text-2xl font-black" style={{ color: "#1a0800" }}>{customers.length}</p>
                <p className="text-xs font-black tracking-widest uppercase mt-1" style={{ color: "rgba(61,34,0,0.45)" }}>Total</p>
              </div>
              <div className="p-3 text-center" style={{ background: "#fff8e8", border: "1.5px solid #e8e0d0" }}>
                <p className="text-2xl font-black" style={{ color: "#c9940a" }}>{Object.keys(loyalty).length}</p>
                <p className="text-xs font-black tracking-widest uppercase mt-1" style={{ color: "rgba(61,34,0,0.45)" }}>Loyalty</p>
              </div>
              <div className="p-3 text-center" style={{ background: "#fff8e8", border: "1.5px solid #e8e0d0" }}>
                <p className="text-2xl font-black" style={{ color: "#22c55e" }}>{customers.filter(c => c.email).length}</p>
                <p className="text-xs font-black tracking-widest uppercase mt-1" style={{ color: "rgba(61,34,0,0.45)" }}>With Email</p>
              </div>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search by name, email, or phone…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 text-sm outline-none mb-4"
              style={{ background: "#fffbf0", border: "1.5px solid rgba(180,120,0,0.2)", color: "#2a1200" }}
            />

            {/* Customer list */}
            <div className="flex flex-col gap-2">
              {filtered.length === 0 && (
                <p className="text-center text-sm py-4" style={{ color: "rgba(61,34,0,0.4)" }}>No customers found.</p>
              )}
              {filtered.map(c => {
                const loy = loyalty[c.id];
                return (
                  <div key={c.id} className="flex items-center justify-between px-4 py-3 gap-3" style={{ background: "#fafaf8", border: "1.5px solid #e8e0d0" }}>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-black text-sm truncate" style={{ color: "#1a0800" }}>{c.name || "Guest"}</p>
                        {loy && (
                          <span className="text-xs font-black px-1.5 py-0.5 shrink-0" style={{ background: "#c9940a18", color: "#c9940a", border: "1px solid #c9940a33" }}>
                            ★ {loy.balance ?? "?"} pts
                          </span>
                        )}
                      </div>
                      {c.email && <p className="text-xs truncate" style={{ color: "rgba(61,34,0,0.5)" }}>{c.email}</p>}
                      {c.phone && <p className="text-xs" style={{ color: "rgba(61,34,0,0.4)" }}>{c.phone}</p>}
                    </div>
                    <p className="text-xs shrink-0" style={{ color: "rgba(61,34,0,0.35)" }}>
                      {new Date(c.created_at).toLocaleDateString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}