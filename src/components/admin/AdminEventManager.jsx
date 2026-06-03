import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";

const inputStyle = { background: "#fffbf0", border: "1.5px solid rgba(180,120,0,0.2)", color: "#2a1200" };
const sectionStyle = { background: "#fff", border: "1px solid rgba(180,120,0,0.15)", boxShadow: "0 2px 12px rgba(180,120,0,0.06)" };

const emptyEvent = () => ({
  title: "", description: "", date: "", time_start: "", time_end: "",
  location_name: "", address: "", img: "", facebook_event_url: "",
  is_active: true, is_featured: false,
});

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function isPast(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr + "T00:00:00") < new Date(new Date().toDateString());
}

export default function AdminEventManager() {
  const [events, setEvents] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyEvent());
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  useEffect(() => { load(); }, []);

  const load = async () => {
    const data = await base44.entities.Event.list("date", 100);
    setEvents(data);
  };

  const startNew = () => { setForm(emptyEvent()); setEditing("new"); };
  const startEdit = (e) => {
    setForm({
      title: e.title || "", description: e.description || "",
      date: e.date || "", time_start: e.time_start || "", time_end: e.time_end || "",
      location_name: e.location_name || "", address: e.address || "",
      img: e.img || "", facebook_event_url: e.facebook_event_url || "",
      is_active: e.is_active !== false, is_featured: e.is_featured || false,
    });
    setEditing(e.id);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, img: file_url }));
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.title || !form.date) return;
    setSaving(true);
    if (editing === "new") await base44.entities.Event.create(form);
    else await base44.entities.Event.update(editing, form);
    await load();
    setSaving(false);
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this event?")) return;
    setDeleting(id);
    await base44.entities.Event.delete(id);
    await load();
    setDeleting(null);
  };

  const toggleActive = async (e) => {
    await base44.entities.Event.update(e.id, { is_active: !e.is_active });
    await load();
  };

  // ── Form View ──
  if (editing !== null) {
    return (
      <section className="rounded-2xl p-6" style={sectionStyle}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-black text-lg" style={{ color: "#2a1200" }}>
            {editing === "new" ? "Add Event" : "Edit Event"}
          </h2>
          <button onClick={() => setEditing(null)} className="text-sm px-3 py-1.5 rounded-lg" style={{ background: "rgba(0,0,0,0.06)", color: "#555" }}>← Back</button>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>Event Title *</label>
            <input className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle}
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Akron Farmers Market" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>Description</label>
            <textarea rows={3} className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={inputStyle}
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Tell customers what to expect..." />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>Date *</label>
              <input type="date" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle}
                value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>Start Time</label>
              <input className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle}
                value={form.time_start} onChange={e => setForm(f => ({ ...f, time_start: e.target.value }))} placeholder="11:00 AM" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>End Time</label>
              <input className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle}
                value={form.time_end} onChange={e => setForm(f => ({ ...f, time_end: e.target.value }))} placeholder="5:00 PM" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>Venue / Location Name</label>
            <input className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle}
              value={form.location_name} onChange={e => setForm(f => ({ ...f, location_name: e.target.value }))} placeholder="e.g. Highland Square" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>Address</label>
            <input className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle}
              value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="123 Main St, Akron, OH" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>Facebook Event URL</label>
            <input className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle}
              value={form.facebook_event_url} onChange={e => setForm(f => ({ ...f, facebook_event_url: e.target.value }))} placeholder="https://facebook.com/events/..." />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>Event Image</label>
            {form.img && (
              <div className="relative mb-3 rounded-xl overflow-hidden" style={{ height: 160 }}>
                <img src={form.img} alt="preview" className="w-full h-full object-cover" />
                <button onClick={() => setForm(f => ({ ...f, img: "" }))} className="absolute top-2 right-2 w-8 h-8 rounded-full font-bold text-sm flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}>✕</button>
              </div>
            )}
            <button onClick={() => fileRef.current.click()} disabled={uploading}
              className="w-full py-2.5 rounded-xl font-bold text-sm mb-2"
              style={{ background: "rgba(201,148,10,0.12)", color: "#7a4f00", border: "1.5px solid rgba(180,120,0,0.25)" }}>
              {uploading ? "Uploading…" : "📷 Upload Photo"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <input className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle}
              value={form.img} onChange={e => setForm(f => ({ ...f, img: e.target.value }))} placeholder="Or paste image URL" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} className="w-4 h-4 accent-amber-600" />
              <span className="text-sm font-semibold" style={{ color: "#2a1200" }}>⭐ Feature on home page</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 accent-amber-600" />
              <span className="text-sm font-semibold" style={{ color: "#2a1200" }}>Active (visible on events page)</span>
            </label>
          </div>
          <button onClick={handleSave} disabled={saving || !form.title || !form.date}
            className="w-full py-3.5 rounded-2xl font-black text-base mt-2"
            style={{ background: "#c9940a", color: "#fff8e8", boxShadow: "0 4px 20px rgba(180,120,0,0.25)", opacity: (!form.title || !form.date) ? 0.5 : 1 }}>
            {saving ? "Saving…" : "Save Event"}
          </button>
        </div>
      </section>
    );
  }

  // ── List View ──
  const upcoming = events.filter(e => !isPast(e.date));
  const past = events.filter(e => isPast(e.date));

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl p-6" style={sectionStyle}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-black text-lg" style={{ color: "#2a1200" }}>Events</h2>
            <p className="text-xs mt-0.5" style={{ color: "rgba(61,34,0,0.45)" }}>Add upcoming markets, festivals, and pop-ups.</p>
          </div>
          <button onClick={startNew} className="px-5 py-2.5 rounded-xl font-bold text-sm" style={{ background: "#c9940a", color: "#fff8e8" }}>+ Add Event</button>
        </div>

        {events.length === 0 && (
          <div className="text-center py-10 text-sm" style={{ color: "rgba(61,34,0,0.4)" }}>No events yet. Add your first event!</div>
        )}

        {upcoming.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "#c9940a" }}>Upcoming</p>
            <div className="flex flex-col gap-2">
              {upcoming.map(event => (
                <div key={event.id} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: event.is_active ? "#fffbf0" : "rgba(0,0,0,0.03)", border: "1px solid rgba(180,120,0,0.12)" }}>
                  {event.img
                    ? <img src={event.img} alt={event.title} className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
                    : <div className="w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl" style={{ background: "rgba(201,148,10,0.08)" }}>📅</div>
                  }
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm" style={{ color: "#2a1200" }}>{event.title}</span>
                      {event.is_featured && <span className="text-[10px] font-black px-1.5 py-0.5 rounded" style={{ background: "#c9940a", color: "#fff8e8" }}>⭐ Featured</span>}
                      {!event.is_active && <span className="text-[10px] font-black px-1.5 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.08)", color: "#888" }}>Hidden</span>}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(61,34,0,0.5)" }}>{formatDate(event.date)}{event.location_name ? ` · ${event.location_name}` : ""}</p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => toggleActive(event)} className="px-2.5 py-1.5 rounded-lg text-xs font-bold" style={{ background: "rgba(0,0,0,0.05)", color: "#666" }}>
                      {event.is_active ? "Hide" : "Show"}
                    </button>
                    <button onClick={() => startEdit(event)} className="px-2.5 py-1.5 rounded-lg text-xs font-bold" style={{ background: "rgba(201,148,10,0.12)", color: "#7a4f00" }}>Edit</button>
                    <button onClick={() => handleDelete(event.id)} disabled={deleting === event.id}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold" style={{ background: "rgba(239,68,68,0.08)", color: "#dc2626" }}>
                      {deleting === event.id ? "…" : "Del"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {past.length > 0 && (
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "rgba(61,34,0,0.35)" }}>Past Events</p>
            <div className="flex flex-col gap-2">
              {past.slice(0, 5).map(event => (
                <div key={event.id} className="flex items-center gap-3 p-3 rounded-xl opacity-60"
                  style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(180,120,0,0.08)" }}>
                  <div className="w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl" style={{ background: "rgba(201,148,10,0.06)" }}>📅</div>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-sm" style={{ color: "#2a1200" }}>{event.title}</span>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(61,34,0,0.5)" }}>{formatDate(event.date)}</p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => startEdit(event)} className="px-2.5 py-1.5 rounded-lg text-xs font-bold" style={{ background: "rgba(201,148,10,0.12)", color: "#7a4f00" }}>Edit</button>
                    <button onClick={() => handleDelete(event.id)} disabled={deleting === event.id}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold" style={{ background: "rgba(239,68,68,0.08)", color: "#dc2626" }}>
                      {deleting === event.id ? "…" : "Del"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}