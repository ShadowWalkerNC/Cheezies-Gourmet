import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Search, Mail, Trash2, Download, ChevronDown } from "lucide-react";

const GOLD = "#c9940a";
const sectionStyle = { background: "#fff", border: "1px solid rgba(180,120,0,0.15)" };
const inputStyle = { background: "#fffbf0", border: "1.5px solid rgba(180,120,0,0.2)", color: "#2a1200", outline: "none" };

export default function CRMPanel() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [segment, setSegment] = useState("all");
  const [selected, setSelected] = useState(new Set());

  // Email composer
  const [composing, setComposing] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailSegment, setEmailSegment] = useState("all");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  // Delete confirm
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.NewsletterSubscriber.list("-created_date", 2000);
    setSubscribers(data);
    setLoading(false);
  };

  const filtered = subscribers.filter(s => {
    const matchSearch = s.email.toLowerCase().includes(search.toLowerCase());
    const matchSeg = segment === "all" || (segment === "claimed" ? s.promo_claimed : !s.promo_claimed);
    return matchSearch && matchSeg;
  });

  const allSelected = filtered.length > 0 && filtered.every(s => selected.has(s.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelected(prev => {
        const next = new Set(prev);
        filtered.forEach(s => next.delete(s.id));
        return next;
      });
    } else {
      setSelected(prev => {
        const next = new Set(prev);
        filtered.forEach(s => next.add(s.id));
        return next;
      });
    }
  };

  const toggleOne = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDelete = async () => {
    if (selected.size === 0) return;
    setDeleting(true);
    await Promise.all([...selected].map(id => base44.entities.NewsletterSubscriber.delete(id)));
    setSelected(new Set());
    setDeleting(false);
    load();
  };

  const handleExportCSV = () => {
    const rows = [["Email", "Birthday", "Promo Claimed", "Source", "Joined"]];
    filtered.forEach(s => {
      rows.push([s.email, s.birthday || "", s.promo_claimed ? "Yes" : "No", s.source || "", new Date(s.created_date).toLocaleDateString()]);
    });
    const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendEmail = async () => {
    if (!emailSubject.trim() || !emailBody.trim()) return;
    setSending(true);
    setSendResult(null);
    const res = await base44.functions.invoke("sendBulkEmail", {
      subject: emailSubject,
      body: emailBody,
      segment: emailSegment,
    });
    setSending(false);
    setSendResult(res.data);
    if (res.data?.success) {
      setEmailSubject("");
      setEmailBody("");
      setTimeout(() => { setComposing(false); setSendResult(null); }, 4000);
    }
  };

  const segCounts = {
    all: subscribers.length,
    claimed: subscribers.filter(s => s.promo_claimed).length,
    unclaimed: subscribers.filter(s => !s.promo_claimed).length,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-black text-2xl" style={{ color: "#2a1200" }}>CRM — Subscribers</h2>
          <p className="text-xs mt-0.5" style={{ color: "rgba(61,34,0,0.45)" }}>
            {subscribers.length} total subscribers
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold"
            style={{ background: "rgba(201,148,10,0.1)", color: "#7a4f00", border: "1.5px solid rgba(180,120,0,0.2)" }}>
            <Download size={14} /> Export CSV
          </button>
          <button onClick={() => setComposing(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold"
            style={{ background: GOLD, color: "#fff8e8" }}>
            <Mail size={14} /> Send Email
          </button>
        </div>
      </div>

      {/* Segment tabs */}
      <div className="flex gap-2 flex-wrap">
        {[["all", "All"], ["unclaimed", "Promo Unclaimed"], ["claimed", "Promo Claimed"]].map(([key, label]) => (
          <button key={key} onClick={() => setSegment(key)}
            className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
            style={{
              background: segment === key ? GOLD : "rgba(201,148,10,0.08)",
              color: segment === key ? "#fff8e8" : "#7a4f00",
              border: `1.5px solid ${segment === key ? GOLD : "rgba(180,120,0,0.2)"}`,
            }}>
            {label} <span className="opacity-60">({segCounts[key]})</span>
          </button>
        ))}
      </div>

      {/* Email Composer Modal */}
      {composing && (
        <section className="rounded-2xl p-6" style={{ ...sectionStyle, border: `1.5px solid ${GOLD}` }}>
          <div className="flex items-center justify-between mb-5">
            <p className="font-black text-base" style={{ color: "#2a1200" }}>📧 Compose Email Blast</p>
            <button onClick={() => { setComposing(false); setSendResult(null); }}
              className="text-sm px-3 py-1 rounded-lg" style={{ background: "rgba(0,0,0,0.06)", color: "#888" }}>
              ✕ Cancel
            </button>
          </div>

          {/* Segment selector */}
          <div className="mb-4">
            <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>Send To</label>
            <select value={emailSegment} onChange={e => setEmailSegment(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm"
              style={inputStyle}>
              <option value="all">All Subscribers ({segCounts.all})</option>
              <option value="unclaimed">Promo Unclaimed ({segCounts.unclaimed})</option>
              <option value="claimed">Promo Claimed ({segCounts.claimed})</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>Subject Line</label>
            <input type="text" value={emailSubject} onChange={e => setEmailSubject(e.target.value)}
              placeholder="🧀 This week at Cheezies…"
              className="w-full px-4 py-3 rounded-xl text-sm"
              style={inputStyle} />
          </div>

          <div className="mb-5">
            <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>Message Body</label>
            <textarea rows={8} value={emailBody} onChange={e => setEmailBody(e.target.value)}
              placeholder="Hey there, Cheezies crew!&#10;&#10;We're parked at [location] today from [time] to [time].&#10;&#10;Today's special: ...&#10;&#10;See you at the truck! 🧀"
              className="w-full px-4 py-3 rounded-xl text-sm resize-none"
              style={inputStyle} />
          </div>

          {sendResult && (
            <div className="rounded-xl px-4 py-3 mb-4 text-sm font-bold"
              style={{
                background: sendResult.success ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                color: sendResult.success ? "#15803d" : "#dc2626",
                border: `1px solid ${sendResult.success ? "#22c55e40" : "#ef444440"}`,
              }}>
              {sendResult.success
                ? `✓ Sent to ${sendResult.sent} subscriber${sendResult.sent !== 1 ? "s" : ""}${sendResult.failed > 0 ? ` (${sendResult.failed} failed)` : ""}!`
                : `Error: ${sendResult.error}`}
            </div>
          )}

          <button onClick={handleSendEmail} disabled={sending || !emailSubject.trim() || !emailBody.trim()}
            className="w-full py-3.5 rounded-xl font-black text-base transition-all"
            style={{ background: sending ? "rgba(201,148,10,0.5)" : GOLD, color: "#fff8e8" }}>
            {sending ? "Sending…" : `🚀 Send to ${emailSegment === "all" ? segCounts.all : segCounts[emailSegment]} Subscribers`}
          </button>
        </section>
      )}

      {/* Subscriber list */}
      <section className="rounded-2xl overflow-hidden" style={sectionStyle}>
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-4 py-3 flex-wrap" style={{ borderBottom: "1px solid rgba(180,120,0,0.1)" }}>
          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(61,34,0,0.35)" }} />
            <input type="text" placeholder="Search email…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm"
              style={inputStyle} />
          </div>
          {selected.size > 0 && (
            <button onClick={handleDelete} disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
              style={{ background: "rgba(239,68,68,0.1)", color: "#dc2626", border: "1px solid rgba(239,68,68,0.25)" }}>
              <Trash2 size={13} />
              {deleting ? "Deleting…" : `Delete (${selected.size})`}
            </button>
          )}
          <span className="text-xs font-bold" style={{ color: "rgba(61,34,0,0.4)" }}>
            {filtered.length} shown
          </span>
        </div>

        {/* Table header */}
        <div className="grid px-4 py-2 text-xs font-black uppercase tracking-widest"
          style={{ gridTemplateColumns: "32px 1fr 80px 80px 90px", color: "rgba(61,34,0,0.4)", borderBottom: "1px solid rgba(180,120,0,0.08)", background: "#fffbf0" }}>
          <input type="checkbox" checked={allSelected} onChange={toggleAll} className="mt-0.5" />
          <span>Email</span>
          <span>Source</span>
          <span className="text-center">Promo</span>
          <span>Joined</span>
        </div>

        {/* Rows */}
        <div className="max-h-[500px] overflow-y-auto">
          {loading ? (
            <div className="text-center py-12 text-sm" style={{ color: "rgba(61,34,0,0.4)" }}>Loading subscribers…</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-sm" style={{ color: "rgba(61,34,0,0.4)" }}>No subscribers found.</div>
          ) : (
            filtered.map((s, i) => (
              <div key={s.id}
                className="grid px-4 py-3 text-sm items-center transition-all hover:bg-amber-50"
                style={{
                  gridTemplateColumns: "32px 1fr 80px 80px 90px",
                  borderBottom: i < filtered.length - 1 ? "1px solid rgba(180,120,0,0.06)" : "none",
                  background: selected.has(s.id) ? "rgba(201,148,10,0.05)" : undefined,
                }}>
                <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggleOne(s.id)} />
                <span className="font-medium truncate pr-2" style={{ color: "#2a1200" }}>{s.email}</span>
                <span className="text-xs capitalize" style={{ color: "rgba(61,34,0,0.45)" }}>{s.source || "—"}</span>
                <span className="text-center text-xs font-bold" style={{ color: s.promo_claimed ? "#22c55e" : "rgba(61,34,0,0.3)" }}>
                  {s.promo_claimed ? "✓" : "—"}
                </span>
                <span className="text-xs" style={{ color: "rgba(61,34,0,0.4)" }}>
                  {new Date(s.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}