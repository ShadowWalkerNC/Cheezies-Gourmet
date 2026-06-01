import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";

const SECTIONS = ["Signature Creations", "Gourmet Melts", "Sides & Refreshments", "Add-Ons & Extras"];
const BADGE_PRESETS = ["Best Seller", "Fan Favorite", "Premium", "New", "The Classic", "Original", "Legendary", "Limited"];

const empty = () => ({
  name: "", section: "Signature Creations", desc: "", price: "", price_note: "",
  badge: "", badge_color: "#c9940a", img: "", is_featured: false, sort_order: 0, is_active: true,
});

const sectionStyle = { background: "#fff", border: "1px solid rgba(180,120,0,0.15)", boxShadow: "0 2px 12px rgba(180,120,0,0.06)" };
const inputStyle = { background: "#fffbf0", border: "1.5px solid rgba(180,120,0,0.2)", color: "#2a1200" };

export default function AdminMenuManager() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null); // null = list, "new" = new form, id = edit form
  const [form, setForm] = useState(empty());
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const fileRef = useRef();

  useEffect(() => { load(); }, []);

  const load = async () => {
    const data = await base44.entities.MenuItem.list("sort_order", 200);
    setItems(data);
  };

  const startNew = () => { setForm(empty()); setEditing("new"); };
  const startEdit = (item) => {
    setForm({
      name: item.name || "", section: item.section || "Signature Creations",
      desc: item.desc || "", price: item.price || "", price_note: item.price_note || "",
      badge: item.badge || "", badge_color: item.badge_color || "#c9940a",
      img: item.img || "", is_featured: item.is_featured || false,
      sort_order: item.sort_order || 0, is_active: item.is_active !== false,
    });
    setEditing(item.id);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, img: file_url }));
    setUploading(false);
  };

  const invokeMenuItem = (action, itemId, payload) =>
    base44.functions.invoke("saveMenuItem", { passcode: "cheezies2024", action, itemId, payload });

  const handleSave = async () => {
    setSaving(true);
    if (editing === "new") {
      await invokeMenuItem("create", null, form);
    } else {
      await invokeMenuItem("update", editing, form);
    }
    await load();
    setSaving(false);
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this menu item?")) return;
    setDeleting(id);
    await invokeMenuItem("delete", id, null);
    await load();
    setDeleting(null);
  };

  const toggleActive = async (item) => {
    await invokeMenuItem("update", item.id, { is_active: !item.is_active });
    await load();
  };

  // ── Form View ──────────────────────────────────────────────────
  if (editing !== null) {
    return (
      <section className="rounded-2xl p-6" style={sectionStyle}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-black text-lg" style={{ color: "#2a1200" }}>
            {editing === "new" ? "Add Menu Item" : "Edit Menu Item"}
          </h2>
          <button onClick={() => setEditing(null)} className="text-sm px-3 py-1.5 rounded-lg" style={{ background: "rgba(0,0,0,0.06)", color: "#555" }}>
            ← Back
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>Item Name *</label>
            <input className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle}
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. The Truffle Melt" />
          </div>

          {/* Section */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>Menu Section *</label>
            <select className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle}
              value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value }))}>
              {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>Description</label>
            <textarea rows={3} className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={inputStyle}
              value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="Describe the item..." />
          </div>

          {/* Price */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>Price</label>
              <input className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle}
                value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="$13" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>Price Note</label>
              <input className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle}
                value={form.price_note} onChange={e => setForm(f => ({ ...f, price_note: e.target.value }))} placeholder="e.g. Single / Double" />
            </div>
          </div>

          {/* Badge */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>Badge Label</label>
              <select className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle}
                value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}>
                <option value="">None</option>
                {BADGE_PRESETS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>Badge Color</label>
              <div className="flex gap-2 items-center">
                <input type="color" className="h-11 w-14 rounded-lg cursor-pointer border-0 outline-none p-1" style={{ background: "#fffbf0", border: "1.5px solid rgba(180,120,0,0.2)" }}
                  value={form.badge_color} onChange={e => setForm(f => ({ ...f, badge_color: e.target.value }))} />
                <span className="text-xs" style={{ color: "rgba(61,34,0,0.5)" }}>{form.badge_color}</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>Image</label>
            {form.img && (
              <div className="relative mb-3 rounded-xl overflow-hidden" style={{ height: 160 }}>
                <img src={form.img} alt="preview" className="w-full h-full object-cover" />
                <button
                  onClick={() => setForm(f => ({ ...f, img: "" }))}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full font-bold text-sm flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}
                >✕</button>
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={() => fileRef.current.click()} disabled={uploading}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all"
                style={{ background: "rgba(201,148,10,0.12)", color: "#7a4f00", border: "1.5px solid rgba(180,120,0,0.25)" }}>
                {uploading ? "Uploading…" : "📷 Upload Photo"}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>
            <input className="w-full px-4 py-3 rounded-xl text-sm outline-none mt-2" style={inputStyle}
              value={form.img} onChange={e => setForm(f => ({ ...f, img: e.target.value }))} placeholder="Or paste image URL here" />
          </div>

          {/* Sort & Flags */}
          <div className="flex gap-3 flex-wrap">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>Sort Order</label>
              <input type="number" className="w-24 px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle}
                value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))} />
            </div>
            <div className="flex flex-col justify-end gap-2 pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} className="w-4 h-4 accent-amber-600" />
                <span className="text-sm font-semibold" style={{ color: "#2a1200" }}>Show on Home Page (Featured)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 accent-amber-600" />
                <span className="text-sm font-semibold" style={{ color: "#2a1200" }}>Active (visible on menu)</span>
              </label>
            </div>
          </div>

          {/* Save */}
          <button onClick={handleSave} disabled={saving || !form.name}
            className="w-full py-3.5 rounded-2xl font-black text-base transition-all hover:scale-[1.02] mt-2"
            style={{ background: "#c9940a", color: "#fff8e8", boxShadow: "0 4px 20px rgba(180,120,0,0.25)", opacity: !form.name ? 0.5 : 1 }}>
            {saving ? "Saving…" : "Save Menu Item"}
          </button>
        </div>
      </section>
    );
  }

  // ── List View ─────────────────────────────────────────────────
  const grouped = SECTIONS.reduce((acc, s) => { acc[s] = items.filter(i => i.section === s); return acc; }, {});

  return (
    <section className="rounded-2xl p-6" style={sectionStyle}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-black text-lg" style={{ color: "#2a1200" }}>Menu Items</h2>
          <p className="text-xs mt-0.5" style={{ color: "rgba(61,34,0,0.45)" }}>Add, edit, or remove items. Upload real photos to replace AI images.</p>
        </div>
        <button onClick={startNew}
          className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105"
          style={{ background: "#c9940a", color: "#fff8e8" }}>
          + Add Item
        </button>
      </div>

      {items.length === 0 && (
        <div className="text-center py-10 text-sm" style={{ color: "rgba(61,34,0,0.4)" }}>
          No menu items yet. Click "Add Item" to get started, or items will be seeded from the default menu.
        </div>
      )}

      <div className="flex flex-col gap-6">
        {SECTIONS.map(section => grouped[section]?.length > 0 && (
          <div key={section}>
            <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "#c9940a" }}>{section}</p>
            <div className="flex flex-col gap-2">
              {grouped[section].map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: item.is_active ? "#fffbf0" : "rgba(0,0,0,0.03)", border: "1px solid rgba(180,120,0,0.12)" }}>
                  {item.img
                    ? <img src={item.img} alt={item.name} className="w-14 h-14 object-cover rounded-lg flex-shrink-0" style={{ opacity: item.is_active ? 1 : 0.45 }} />
                    : <div className="w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl" style={{ background: "rgba(201,148,10,0.08)" }}>🧀</div>
                  }
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm" style={{ color: item.is_active ? "#2a1200" : "#999" }}>{item.name}</span>
                      {item.badge && <span className="text-[10px] font-black px-1.5 py-0.5 rounded" style={{ background: item.badge_color || "#c9940a", color: "#fff8e8" }}>{item.badge}</span>}
                      {item.is_featured && <span className="text-[10px] font-black px-1.5 py-0.5 rounded" style={{ background: "rgba(90,62,138,0.15)", color: "#5a3e8a" }}>Featured</span>}
                      {!item.is_active && <span className="text-[10px] font-black px-1.5 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.08)", color: "#888" }}>Hidden</span>}
                    </div>
                    <p className="text-xs truncate mt-0.5" style={{ color: "rgba(61,34,0,0.5)" }}>{item.price} {item.price_note ? `· ${item.price_note}` : ""}</p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => toggleActive(item)} className="px-2.5 py-1.5 rounded-lg text-xs font-bold"
                      style={{ background: "rgba(0,0,0,0.05)", color: "#666" }}>
                      {item.is_active ? "Hide" : "Show"}
                    </button>
                    <button onClick={() => startEdit(item)} className="px-2.5 py-1.5 rounded-lg text-xs font-bold"
                      style={{ background: "rgba(201,148,10,0.12)", color: "#7a4f00" }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold"
                      style={{ background: "rgba(239,68,68,0.08)", color: "#dc2626" }}>
                      {deleting === item.id ? "…" : "Del"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}