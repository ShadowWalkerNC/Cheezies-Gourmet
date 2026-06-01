import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";

const SECTIONS = ["Signature Creations", "Gourmet Melts", "Sides & Refreshments", "Add-Ons & Extras"];
const BADGE_PRESETS = ["Best Seller", "Fan Favorite", "Premium", "New", "The Classic", "Original", "Legendary", "Limited"];

const emptyItem = () => ({
  name: "", section: "Signature Creations", desc: "", price: "", price_note: "",
  badge: "", badge_color: "#c9940a", img: "", is_featured: false, sort_order: 0, is_active: true,
});

const emptySpecial = () => ({
  name: "", desc: "", price: "", img: "", is_top_seller: false, is_active: true, sort_order: 0,
});

const sectionStyle = { background: "#fff", border: "1px solid rgba(180,120,0,0.15)", boxShadow: "0 2px 12px rgba(180,120,0,0.06)" };
const inputStyle = { background: "#fffbf0", border: "1.5px solid rgba(180,120,0,0.2)", color: "#2a1200" };

const invoke = (action, itemId, payload, entity) =>
  base44.functions.invoke("saveMenuItem", { passcode: "cheezies2024", action, itemId, payload, entity });

export default function AdminMenuManager() {
  const [tab, setTab] = useState("menu"); // "menu" | "specials"

  // Menu state
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyItem());

  // Specials state
  const [specials, setSpecials] = useState([]);
  const [editingSpecial, setEditingSpecial] = useState(null);
  const [specialForm, setSpecialForm] = useState(emptySpecial());

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const fileRef = useRef();

  useEffect(() => { loadMenu(); loadSpecials(); }, []);

  const loadMenu = async () => {
    const data = await base44.entities.MenuItem.list("sort_order", 200);
    setItems(data);
  };

  const loadSpecials = async () => {
    const data = await base44.entities.WeeklySpecial.list("sort_order", 10);
    setSpecials(data);
  };

  // ── Menu handlers ──
  const startNew = () => { setForm(emptyItem()); setEditing("new"); };
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

  const handleImageUpload = async (e, isSpecial = false) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    if (isSpecial) setSpecialForm(f => ({ ...f, img: file_url }));
    else setForm(f => ({ ...f, img: file_url }));
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    if (editing === "new") await invoke("create", null, form, "MenuItem");
    else await invoke("update", editing, form, "MenuItem");
    await loadMenu();
    setSaving(false);
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this item?")) return;
    setDeleting(id);
    await invoke("delete", id, null, "MenuItem");
    await loadMenu();
    setDeleting(null);
  };

  const toggleActive = async (item) => {
    await invoke("update", item.id, { is_active: !item.is_active }, "MenuItem");
    await loadMenu();
  };

  const handle86 = async (item) => {
    if (!confirm(`86 "${item.name}"? This marks it as unavailable and hides it from the menu.`)) return;
    await invoke("update", item.id, { is_active: false, badge: "86'd", badge_color: "#ef4444" }, "MenuItem");
    await loadMenu();
  };

  // ── Specials handlers ──
  const startNewSpecial = () => { setSpecialForm(emptySpecial()); setEditingSpecial("new"); };
  const startEditSpecial = (s) => {
    setSpecialForm({
      name: s.name || "", desc: s.desc || "", price: s.price || "",
      img: s.img || "", is_top_seller: s.is_top_seller || false,
      is_active: s.is_active !== false, sort_order: s.sort_order || 0,
    });
    setEditingSpecial(s.id);
  };

  const handleSaveSpecial = async () => {
    const activeCount = specials.filter(s => s.is_active && (editingSpecial === "new" || s.id !== editingSpecial)).length;
    if (editingSpecial === "new" && specialForm.is_active && activeCount >= 3) {
      alert("You can only have 3 active weekly specials at a time. Deactivate one first.");
      return;
    }
    setSaving(true);
    if (editingSpecial === "new") await invoke("create", null, specialForm, "WeeklySpecial");
    else await invoke("update", editingSpecial, specialForm, "WeeklySpecial");
    await loadSpecials();
    setSaving(false);
    setEditingSpecial(null);
  };

  const handleDeleteSpecial = async (id) => {
    if (!confirm("Delete this special?")) return;
    setDeleting(id);
    await invoke("delete", id, null, "WeeklySpecial");
    await loadSpecials();
    setDeleting(null);
  };

  const toggleSpecialActive = async (s) => {
    const activeCount = specials.filter(x => x.is_active && x.id !== s.id).length;
    if (!s.is_active && activeCount >= 3) {
      alert("Max 3 active weekly specials. Deactivate one first.");
      return;
    }
    await invoke("update", s.id, { is_active: !s.is_active }, "WeeklySpecial");
    await loadSpecials();
  };

  // ── Special form view ──
  if (editingSpecial !== null) {
    return (
      <section className="rounded-2xl p-6" style={sectionStyle}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-black text-lg" style={{ color: "#2a1200" }}>
            {editingSpecial === "new" ? "Add Weekly Special" : "Edit Weekly Special"}
          </h2>
          <button onClick={() => setEditingSpecial(null)} className="text-sm px-3 py-1.5 rounded-lg" style={{ background: "rgba(0,0,0,0.06)", color: "#555" }}>← Back</button>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>Item Name *</label>
            <input className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle}
              value={specialForm.name} onChange={e => setSpecialForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. The Lobster Melt" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>Description</label>
            <textarea rows={3} className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={inputStyle}
              value={specialForm.desc} onChange={e => setSpecialForm(f => ({ ...f, desc: e.target.value }))} placeholder="What makes it special..." />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>Price</label>
            <input className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle}
              value={specialForm.price} onChange={e => setSpecialForm(f => ({ ...f, price: e.target.value }))} placeholder="$16" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>Image</label>
            {specialForm.img && (
              <div className="relative mb-3 rounded-xl overflow-hidden" style={{ height: 160 }}>
                <img src={specialForm.img} alt="preview" className="w-full h-full object-cover" />
                <button onClick={() => setSpecialForm(f => ({ ...f, img: "" }))} className="absolute top-2 right-2 w-8 h-8 rounded-full font-bold text-sm flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}>✕</button>
              </div>
            )}
            <button onClick={() => fileRef.current.click()} disabled={uploading}
              className="w-full py-2.5 rounded-xl font-bold text-sm mb-2"
              style={{ background: "rgba(201,148,10,0.12)", color: "#7a4f00", border: "1.5px solid rgba(180,120,0,0.25)" }}>
              {uploading ? "Uploading…" : "📷 Upload Photo"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, true)} />
            <input className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle}
              value={specialForm.img} onChange={e => setSpecialForm(f => ({ ...f, img: e.target.value }))} placeholder="Or paste image URL" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={specialForm.is_top_seller} onChange={e => setSpecialForm(f => ({ ...f, is_top_seller: e.target.checked }))} className="w-4 h-4 accent-amber-600" />
              <span className="text-sm font-semibold" style={{ color: "#2a1200" }}>⭐ Mark as Top Selling Sandwich</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={specialForm.is_active} onChange={e => setSpecialForm(f => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 accent-amber-600" />
              <span className="text-sm font-semibold" style={{ color: "#2a1200" }}>Active (visible on menu)</span>
            </label>
          </div>
          <button onClick={handleSaveSpecial} disabled={saving || !specialForm.name}
            className="w-full py-3.5 rounded-2xl font-black text-base mt-2"
            style={{ background: "#c9940a", color: "#fff8e8", boxShadow: "0 4px 20px rgba(180,120,0,0.25)", opacity: !specialForm.name ? 0.5 : 1 }}>
            {saving ? "Saving…" : "Save Special"}
          </button>
        </div>
      </section>
    );
  }

  // ── Menu item form view ──
  if (editing !== null) {
    return (
      <section className="rounded-2xl p-6" style={sectionStyle}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-black text-lg" style={{ color: "#2a1200" }}>
            {editing === "new" ? "Add Menu Item" : "Edit Menu Item"}
          </h2>
          <button onClick={() => setEditing(null)} className="text-sm px-3 py-1.5 rounded-lg" style={{ background: "rgba(0,0,0,0.06)", color: "#555" }}>← Back</button>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>Item Name *</label>
            <input className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle}
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. The Truffle Melt" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>Menu Section *</label>
            <select className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle}
              value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value }))}>
              {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>Description</label>
            <textarea rows={3} className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={inputStyle}
              value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="Describe the item..." />
          </div>
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
          <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>Image</label>
            {form.img && (
              <div className="relative mb-3 rounded-xl overflow-hidden" style={{ height: 160 }}>
                <img src={form.img} alt="preview" className="w-full h-full object-cover" />
                <button onClick={() => setForm(f => ({ ...f, img: "" }))} className="absolute top-2 right-2 w-8 h-8 rounded-full font-bold text-sm flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}>✕</button>
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={() => fileRef.current.click()} disabled={uploading}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm"
                style={{ background: "rgba(201,148,10,0.12)", color: "#7a4f00", border: "1.5px solid rgba(180,120,0,0.25)" }}>
                {uploading ? "Uploading…" : "📷 Upload Photo"}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, false)} />
            </div>
            <input className="w-full px-4 py-3 rounded-xl text-sm outline-none mt-2" style={inputStyle}
              value={form.img} onChange={e => setForm(f => ({ ...f, img: e.target.value }))} placeholder="Or paste image URL here" />
          </div>
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
          <button onClick={handleSave} disabled={saving || !form.name}
            className="w-full py-3.5 rounded-2xl font-black text-base transition-all hover:scale-[1.02] mt-2"
            style={{ background: "#c9940a", color: "#fff8e8", boxShadow: "0 4px 20px rgba(180,120,0,0.25)", opacity: !form.name ? 0.5 : 1 }}>
            {saving ? "Saving…" : "Save Menu Item"}
          </button>
        </div>
      </section>
    );
  }

  // ── List View ──
  const grouped = SECTIONS.reduce((acc, s) => { acc[s] = items.filter(i => i.section === s); return acc; }, {});
  const activeSpecialsCount = specials.filter(s => s.is_active).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Sub-tab switcher */}
      <div className="flex rounded-xl overflow-hidden" style={{ border: "1.5px solid rgba(180,120,0,0.2)" }}>
        <button onClick={() => setTab("menu")} className="flex-1 py-2.5 text-sm font-black tracking-wide uppercase"
          style={{ background: tab === "menu" ? "#c9940a" : "#fff", color: tab === "menu" ? "#fff8e8" : "rgba(61,34,0,0.5)", border: "none", cursor: "pointer" }}>
          🍞 Menu Items
        </button>
        <button onClick={() => setTab("specials")} className="flex-1 py-2.5 text-sm font-black tracking-wide uppercase"
          style={{ background: tab === "specials" ? "#c9940a" : "#fff", color: tab === "specials" ? "#fff8e8" : "rgba(61,34,0,0.5)", border: "none", cursor: "pointer" }}>
          ⭐ Weekly Specials {activeSpecialsCount > 0 ? `(${activeSpecialsCount}/3)` : ""}
        </button>
      </div>

      {/* ── MENU ITEMS TAB ── */}
      {tab === "menu" && (
        <section className="rounded-2xl p-6" style={sectionStyle}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-black text-lg" style={{ color: "#2a1200" }}>Menu Items</h2>
              <p className="text-xs mt-0.5" style={{ color: "rgba(61,34,0,0.45)" }}>Edit items, 86 unavailable ones, or hide/show them.</p>
            </div>
            <button onClick={startNew} className="px-5 py-2.5 rounded-xl font-bold text-sm" style={{ background: "#c9940a", color: "#fff8e8" }}>+ Add Item</button>
          </div>

          {items.length === 0 && (
            <div className="text-center py-10 text-sm" style={{ color: "rgba(61,34,0,0.4)" }}>No menu items yet. Click "Add Item" to get started.</div>
          )}

          <div className="flex flex-col gap-6">
            {SECTIONS.map(section => grouped[section]?.length > 0 && (
              <div key={section}>
                <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "#c9940a" }}>{section}</p>
                <div className="flex flex-col gap-2">
                  {grouped[section].map(item => {
                    const is86 = item.badge === "86'd";
                    return (
                      <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl"
                        style={{ background: is86 ? "rgba(239,68,68,0.04)" : item.is_active ? "#fffbf0" : "rgba(0,0,0,0.03)", border: `1px solid ${is86 ? "rgba(239,68,68,0.2)" : "rgba(180,120,0,0.12)"}` }}>
                        {item.img
                          ? <img src={item.img} alt={item.name} className="w-14 h-14 object-cover rounded-lg flex-shrink-0" style={{ opacity: item.is_active ? (is86 ? 0.35 : 1) : 0.45 }} />
                          : <div className="w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl" style={{ background: "rgba(201,148,10,0.08)" }}>🧀</div>
                        }
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm" style={{ color: is86 ? "#ef4444" : item.is_active ? "#2a1200" : "#999" }}>{item.name}</span>
                            {item.badge && <span className="text-[10px] font-black px-1.5 py-0.5 rounded" style={{ background: item.badge_color || "#c9940a", color: "#fff8e8" }}>{item.badge}</span>}
                            {item.is_featured && <span className="text-[10px] font-black px-1.5 py-0.5 rounded" style={{ background: "rgba(90,62,138,0.15)", color: "#5a3e8a" }}>Featured</span>}
                            {!item.is_active && !is86 && <span className="text-[10px] font-black px-1.5 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.08)", color: "#888" }}>Hidden</span>}
                          </div>
                          <p className="text-xs truncate mt-0.5" style={{ color: "rgba(61,34,0,0.5)" }}>{item.price} {item.price_note ? `· ${item.price_note}` : ""}</p>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0 flex-wrap justify-end">
                          {!is86 && (
                            <button onClick={() => handle86(item)}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-black"
                              style={{ background: "rgba(239,68,68,0.1)", color: "#dc2626", border: "1px solid rgba(239,68,68,0.25)" }}>
                              86
                            </button>
                          )}
                          {is86 && (
                            <button onClick={() => toggleActive(item)}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-bold"
                              style={{ background: "rgba(34,197,94,0.1)", color: "#16a34a" }}>
                              Restore
                            </button>
                          )}
                          {!is86 && (
                            <button onClick={() => toggleActive(item)} className="px-2.5 py-1.5 rounded-lg text-xs font-bold"
                              style={{ background: "rgba(0,0,0,0.05)", color: "#666" }}>
                              {item.is_active ? "Hide" : "Show"}
                            </button>
                          )}
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
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── WEEKLY SPECIALS TAB ── */}
      {tab === "specials" && (
        <section className="rounded-2xl p-6" style={sectionStyle}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-black text-lg" style={{ color: "#2a1200" }}>Weekly Specials</h2>
              <p className="text-xs mt-0.5" style={{ color: "rgba(61,34,0,0.45)" }}>Max 3 active specials. Mark one as your Top Selling Sandwich.</p>
            </div>
            <button onClick={startNewSpecial} disabled={activeSpecialsCount >= 3}
              className="px-5 py-2.5 rounded-xl font-bold text-sm"
              style={{ background: activeSpecialsCount >= 3 ? "rgba(0,0,0,0.08)" : "#c9940a", color: activeSpecialsCount >= 3 ? "#999" : "#fff8e8", cursor: activeSpecialsCount >= 3 ? "not-allowed" : "pointer" }}>
              + Add Special
            </button>
          </div>

          {activeSpecialsCount >= 3 && (
            <div className="mb-4 px-4 py-2.5 rounded-xl text-xs font-bold" style={{ background: "rgba(201,148,10,0.1)", color: "#7a4f00", border: "1px solid rgba(201,148,10,0.25)" }}>
              ⚠️ 3/3 specials active — deactivate one to add more.
            </div>
          )}

          {specials.length === 0 && (
            <div className="text-center py-10 text-sm" style={{ color: "rgba(61,34,0,0.4)" }}>No weekly specials yet. Add up to 3!</div>
          )}

          <div className="flex flex-col gap-2">
            {specials.map(s => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: s.is_active ? "#fffbf0" : "rgba(0,0,0,0.03)", border: "1px solid rgba(180,120,0,0.12)" }}>
                {s.img
                  ? <img src={s.img} alt={s.name} className="w-14 h-14 object-cover rounded-lg flex-shrink-0" style={{ opacity: s.is_active ? 1 : 0.4 }} />
                  : <div className="w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl" style={{ background: "rgba(201,148,10,0.08)" }}>⭐</div>
                }
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm" style={{ color: s.is_active ? "#2a1200" : "#999" }}>{s.name}</span>
                    {s.is_top_seller && <span className="text-[10px] font-black px-1.5 py-0.5 rounded" style={{ background: "#c9940a", color: "#fff8e8" }}>⭐ Top Seller</span>}
                    {!s.is_active && <span className="text-[10px] font-black px-1.5 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.08)", color: "#888" }}>Inactive</span>}
                  </div>
                  <p className="text-xs truncate mt-0.5" style={{ color: "rgba(61,34,0,0.5)" }}>{s.price}</p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => toggleSpecialActive(s)} className="px-2.5 py-1.5 rounded-lg text-xs font-bold"
                    style={{ background: "rgba(0,0,0,0.05)", color: "#666" }}>
                    {s.is_active ? "Hide" : "Show"}
                  </button>
                  <button onClick={() => startEditSpecial(s)} className="px-2.5 py-1.5 rounded-lg text-xs font-bold"
                    style={{ background: "rgba(201,148,10,0.12)", color: "#7a4f00" }}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteSpecial(s.id)} disabled={deleting === s.id}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold"
                    style={{ background: "rgba(239,68,68,0.08)", color: "#dc2626" }}>
                    {deleting === s.id ? "…" : "Del"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}