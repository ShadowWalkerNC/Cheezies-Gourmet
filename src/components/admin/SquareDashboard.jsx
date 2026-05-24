import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function SquareDashboard() {
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [weeklySummary, setWeeklySummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (type) => {
    setLoading(true);
    setError(null);
    try {
      if (type === "orders") {
        const res = await base44.functions.invoke("squareSync", { action: "orders" });
        setOrders(res.data.orders || []);
      } else if (type === "customers") {
        const res = await base44.functions.invoke("squareSync", { action: "customers" });
        setCustomers(res.data.customers || []);
      } else if (type === "sales") {
        const res = await base44.functions.invoke("squareSync", { action: "sales_summary" });
        setWeeklySummary(res.data);
      }
    } catch (e) {
      setError("Failed to load Square data. Check your API key.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(tab);
  }, [tab]);

  const tabs = [
    { id: "orders", label: "Today's Orders" },
    { id: "sales", label: "Weekly Sales" },
    { id: "customers", label: "Customers" },
  ];

  return (
    <section className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid rgba(180,120,0,0.15)", boxShadow: "0 2px 12px rgba(180,120,0,0.06)" }}>
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between" style={{ background: "#1a0800", borderBottom: "2px solid #c9940a" }}>
        <div className="flex items-center gap-2.5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9940a" strokeWidth="2.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
          <span className="font-black text-base" style={{ color: "#fff8e8" }}>Square Integration</span>
        </div>
        <button
          onClick={() => fetchData(tab)}
          className="text-xs font-black px-3 py-1.5 tracking-widest uppercase"
          style={{ background: "rgba(201,148,10,0.2)", color: "#c9940a", border: "1px solid rgba(201,148,10,0.3)" }}
        >
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex" style={{ borderBottom: "1.5px solid #e8e0d0" }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex-1 py-3 text-xs font-black tracking-widest uppercase transition-all"
            style={{
              background: tab === t.id ? "#fff8e8" : "#fff",
              color: tab === t.id ? "#c9940a" : "rgba(61,34,0,0.4)",
              borderBottom: tab === t.id ? "2px solid #c9940a" : "2px solid transparent",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {loading && (
          <div className="flex items-center justify-center py-10 gap-3">
            <div className="w-5 h-5 border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
            <span className="text-sm" style={{ color: "rgba(61,34,0,0.5)" }}>Loading Square data…</span>
          </div>
        )}

        {error && !loading && (
          <div className="py-6 text-center">
            <p className="text-sm font-bold" style={{ color: "#ef4444" }}>{error}</p>
          </div>
        )}

        {/* TODAY'S ORDERS */}
        {!loading && !error && tab === "orders" && (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 text-center" style={{ background: "#fff8e8", border: "1.5px solid #e8e0d0" }}>
                <p className="text-3xl font-black" style={{ color: "#1a0800" }}>{orders.length}</p>
                <p className="text-xs font-black tracking-widest uppercase mt-1" style={{ color: "rgba(61,34,0,0.45)" }}>Orders Today</p>
              </div>
              <div className="p-4 text-center" style={{ background: "#fff8e8", border: "1.5px solid #e8e0d0" }}>
                <p className="text-3xl font-black" style={{ color: "#1a0800" }}>
                  ${orders.reduce((s, o) => s + parseFloat(o.total || 0), 0).toFixed(2)}
                </p>
                <p className="text-xs font-black tracking-widest uppercase mt-1" style={{ color: "rgba(61,34,0,0.45)" }}>Revenue Today</p>
              </div>
            </div>
            {orders.length === 0 ? (
              <p className="text-center text-sm py-4" style={{ color: "rgba(61,34,0,0.4)" }}>No orders yet today.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {orders.map(order => (
                  <div key={order.id} className="p-4" style={{ background: "#fafaf8", border: "1.5px solid #e8e0d0" }}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs font-black tracking-widest uppercase" style={{ color: "rgba(61,34,0,0.4)" }}>
                          Order #{order.id.slice(-6).toUpperCase()}
                        </span>
                        <p className="text-xs mt-0.5" style={{ color: "rgba(61,34,0,0.35)" }}>
                          {new Date(order.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-base" style={{ color: "#1a0800" }}>${order.total}</p>
                        <span className="text-xs font-black px-2 py-0.5" style={{ background: order.state === "COMPLETED" ? "#22c55e18" : "#f59e0b18", color: order.state === "COMPLETED" ? "#15803d" : "#b45309" }}>
                          {order.state}
                        </span>
                      </div>
                    </div>
                    {order.items?.length > 0 && (
                      <div className="flex flex-col gap-1 mt-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-xs" style={{ color: "rgba(61,34,0,0.6)" }}>
                            <span>{item.name} × {item.qty}</span>
                            <span>${item.price}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* WEEKLY SALES */}
        {!loading && !error && tab === "sales" && weeklySummary && (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 text-center" style={{ background: "#fff8e8", border: "1.5px solid #e8e0d0" }}>
                <p className="text-3xl font-black" style={{ color: "#1a0800" }}>{weeklySummary.week_orders}</p>
                <p className="text-xs font-black tracking-widest uppercase mt-1" style={{ color: "rgba(61,34,0,0.45)" }}>Orders This Week</p>
              </div>
              <div className="p-4 text-center" style={{ background: "#fff8e8", border: "1.5px solid #e8e0d0" }}>
                <p className="text-3xl font-black" style={{ color: "#c9940a" }}>${weeklySummary.week_revenue}</p>
                <p className="text-xs font-black tracking-widest uppercase mt-1" style={{ color: "rgba(61,34,0,0.45)" }}>Revenue This Week</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {(weeklySummary.daily_breakdown || []).reverse().map(day => (
                <div key={day.date} className="flex items-center justify-between px-4 py-3" style={{ background: "#fafaf8", border: "1.5px solid #e8e0d0" }}>
                  <span className="text-sm font-black" style={{ color: "#1a0800" }}>{new Date(day.date + "T12:00:00").toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}</span>
                  <div className="text-right">
                    <span className="font-black text-sm" style={{ color: "#c9940a" }}>${day.revenue}</span>
                    <span className="text-xs ml-2" style={{ color: "rgba(61,34,0,0.4)" }}>{day.orders} orders</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CUSTOMERS */}
        {!loading && !error && tab === "customers" && (
          <div>
            <p className="text-xs font-black tracking-widest uppercase mb-4" style={{ color: "rgba(61,34,0,0.4)" }}>{customers.length} customers on record</p>
            <div className="flex flex-col gap-2">
              {customers.length === 0 && <p className="text-sm text-center py-4" style={{ color: "rgba(61,34,0,0.4)" }}>No customers found.</p>}
              {customers.map(c => (
                <div key={c.id} className="flex items-center justify-between px-4 py-3" style={{ background: "#fafaf8", border: "1.5px solid #e8e0d0" }}>
                  <div>
                    <p className="font-black text-sm" style={{ color: "#1a0800" }}>{c.name || "Guest"}</p>
                    {c.email && <p className="text-xs" style={{ color: "rgba(61,34,0,0.5)" }}>{c.email}</p>}
                    {c.phone && <p className="text-xs" style={{ color: "rgba(61,34,0,0.4)" }}>{c.phone}</p>}
                  </div>
                  <p className="text-xs" style={{ color: "rgba(61,34,0,0.35)" }}>
                    {new Date(c.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}