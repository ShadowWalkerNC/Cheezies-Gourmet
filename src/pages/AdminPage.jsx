import { useState } from "react";
import { notifyTruckUpdate } from "@/hooks/useTruckData";

const ADMIN_PASSWORD = "cheezies2024";
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

function getDefault() {
  try {
    const saved = localStorage.getItem("cheezies_truck");
    if (saved) return JSON.parse(saved);
  } catch {}
  return { status: "closed", address: "", home_address: "Akron, Ohio", hours_open: "11:00 AM", hours_close: "6:00 PM", open_days: ["Wednesday","Thursday","Friday","Saturday"], note: "", latitude: "", longitude: "" };
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState(false);
  const [form, setForm] = useState(getDefault);
  const [saved, setSaved] = useState(false);

  const login = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwErr(false); }
    else setPwErr(true);
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleDay = (day) => {
    setForm(f => ({
      ...f,
      open_days: f.open_days.includes(day)
        ? f.open_days.filter(d => d !== day)
        : [...f.open_days, day],
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const data = { ...form, latitude: form.latitude ? parseFloat(form.latitude) : null, longitude: form.longitude ? parseFloat(form.longitude) : null };
    notifyTruckUpdate(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inp = { background: "#fffbf0", border: "1.5px solid rgba(180,120,0,0.25)", borderRadius: 10, padding: "10px 14px", color: "#2a1200", fontSize: 14, outline: "none", width: "100%" };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "#fffbf0" }}>
        <form onSubmit={login} className="w-full max-w-sm flex flex-col gap-4 p-8 rounded-2xl" style={{ background: "#fff", border: "1.5px solid #e8e0d0", boxShadow: "0 4px 24px rgba(180,120,0,0.1)" }}>
          <h2 className="font-black text-2xl text-center" style={{ color: "#1a0800" }}>🧀 Admin Login</h2>
          <input type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} style={inp} />
          {pwErr && <p className="text-xs text-red-500 text-center">Incorrect password</p>}
          <button type="submit" className="py-3 rounded-full font-black text-sm uppercase tracking-widest" style={{ background: "#c9940a", color: "#fff" }}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10" style={{ background: "#fffbf0" }}>
      <div className="max-w-lg mx-auto">
        <h1 className="font-black text-3xl mb-1" style={{ color: "#1a0800" }}>🧀 Truck Status</h1>
        <p className="text-sm mb-8" style={{ color: "rgba(61,34,0,0.5)" }}>Changes save locally and update the navbar + Find Us page instantly.</p>

        <form onSubmit={handleSave} className="flex flex-col gap-5">

          {/* Status */}
          <div>
            <label className="text-xs font-black uppercase tracking-widest mb-2 block" style={{ color: "#c9940a" }}>Status</label>
            <div className="flex gap-2">
              {["open","closed","en_route"].map(s => (
                <button type="button" key={s} onClick={() => set("status", s)}
                  className="flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-full transition-all"
                  style={{ background: form.status === s ? "#c9940a" : "#fff", color: form.status === s ? "#fff" : "#7a4f00", border: `1.5px solid ${form.status === s ? "#c9940a" : "#e8e0d0"}` }}
                >{s.replace("_"," ")}</button>
              ))}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="text-xs font-black uppercase tracking-widest mb-2 block" style={{ color: "#c9940a" }}>Today's Address</label>
            <input value={form.address} onChange={e => set("address", e.target.value)} placeholder="e.g. 123 Main St, Akron" style={inp} />
          </div>

          {/* Lat / Lng */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black uppercase tracking-widest mb-2 block" style={{ color: "#c9940a" }}>Latitude</label>
              <input value={form.latitude} onChange={e => set("latitude", e.target.value)} placeholder="41.0814" style={inp} />
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-widest mb-2 block" style={{ color: "#c9940a" }}>Longitude</label>
              <input value={form.longitude} onChange={e => set("longitude", e.target.value)} placeholder="-81.5190" style={inp} />
            </div>
          </div>
          <p className="text-xs" style={{ color: "rgba(61,34,0,0.45)" }}>Tip: Google Maps → right-click location → copy lat/lng. Leave blank to hide map pin.</p>

          {/* Hours */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black uppercase tracking-widest mb-2 block" style={{ color: "#c9940a" }}>Opens</label>
              <input value={form.hours_open} onChange={e => set("hours_open", e.target.value)} placeholder="11:00 AM" style={inp} />
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-widest mb-2 block" style={{ color: "#c9940a" }}>Closes</label>
              <input value={form.hours_close} onChange={e => set("hours_close", e.target.value)} placeholder="6:00 PM" style={inp} />
            </div>
          </div>

          {/* Open Days */}
          <div>
            <label className="text-xs font-black uppercase tracking-widest mb-2 block" style={{ color: "#c9940a" }}>Open Days</label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map(day => (
                <button type="button" key={day} onClick={() => toggleDay(day)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                  style={{ background: form.open_days.includes(day) ? "#c9940a" : "#fff", color: form.open_days.includes(day) ? "#fff" : "#7a4f00", border: `1.5px solid ${form.open_days.includes(day) ? "#c9940a" : "#e8e0d0"}` }}
                >{day.slice(0,3)}</button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="text-xs font-black uppercase tracking-widest mb-2 block" style={{ color: "#c9940a" }}>Today's Note (optional)</label>
            <textarea rows={2} value={form.note} onChange={e => set("note", e.target.value)} placeholder="e.g. Special menu today! Cash only." style={{ ...inp, resize: "none" }} />
          </div>

          <button type="submit" className="w-full py-4 rounded-full font-black text-sm uppercase tracking-widest transition-opacity hover:opacity-85" style={{ background: "#1a0800", color: "#e8b800" }}>
            {saved ? "✅ Saved!" : "Save & Publish"}
          </button>
        </form>
      </div>
    </div>
  );
}
