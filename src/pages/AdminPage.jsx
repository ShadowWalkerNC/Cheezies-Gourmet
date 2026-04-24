import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import AdminMenuManager from "@/components/admin/AdminMenuManager";

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ADMIN_PASSCODE = "cheezies2024";

const statusLabels = {
  open:     { label: "Open Now",  color: "#22c55e" },
  closed:   { label: "Closed",    color: "#ef4444" },
  en_route: { label: "En Route",  color: "#f59e0b" },
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);
  const [recordId, setRecordId] = useState(null);

  // Live location
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("open");
  const [note, setNote] = useState("");
  const [gpsLoading, setGpsLoading] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  // Home base
  const [homeLocation, setHomeLocation] = useState(null);
  const [homeAddress, setHomeAddress] = useState("");
  const [homeGpsLoading, setHomeGpsLoading] = useState(false);
  const [homeMapKey, setHomeMapKey] = useState(0);

  // Hours & days
  const [hoursOpen, setHoursOpen] = useState("12:00 PM");
  const [hoursClose, setHoursClose] = useState("6:00 PM");
  const [openDays, setOpenDays] = useState(["Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (authed) load();
  }, [authed]);

  const handlePasscode = () => {
    if (passcode === ADMIN_PASSCODE) {
      setAuthed(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

  const load = async () => {
    const records = await base44.entities.TruckLocation.list("-updated_date", 1);
    if (records.length > 0) {
      const r = records[0];
      setRecordId(r.id);
      if (r.latitude && r.longitude) setLocation({ lat: r.latitude, lng: r.longitude });
      setAddress(r.address || "");
      setStatus(r.status || "open");
      setNote(r.note || "");
      if (r.home_latitude && r.home_longitude) setHomeLocation({ lat: r.home_latitude, lng: r.home_longitude });
      setHomeAddress(r.home_address || "");
      setHoursOpen(r.hours_open || "12:00 PM");
      setHoursClose(r.hours_close || "6:00 PM");
      setOpenDays(r.open_days || ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
    }
  };

  const doGPS = (isHome) => {
    if (!navigator.geolocation) { alert("Geolocation not supported."); return; }
    isHome ? setHomeGpsLoading(true) : setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        let addr = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const data = await res.json();
          addr = data.display_name || addr;
        } catch {}
        if (isHome) {
          setHomeLocation({ lat, lng });
          setHomeAddress(addr);
          setHomeMapKey(k => k + 1);
          setHomeGpsLoading(false);
        } else {
          setLocation({ lat, lng });
          setAddress(addr);
          setMapKey(k => k + 1);
          setGpsLoading(false);
        }
      },
      (err) => {
        alert("Could not get location: " + err.message);
        isHome ? setHomeGpsLoading(false) : setGpsLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const toggleDay = (day) => {
    setOpenDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      latitude: location?.lat || null,
      longitude: location?.lng || null,
      address,
      status,
      note,
      is_active: true,
      home_latitude: homeLocation?.lat || null,
      home_longitude: homeLocation?.lng || null,
      home_address: homeAddress,
      hours_open: hoursOpen,
      hours_close: hoursClose,
      open_days: openDays,
    };

    const res = await base44.functions.invoke("saveTruckLocation", {
      passcode: ADMIN_PASSCODE,
      recordId,
      payload,
    });

    if (!recordId && res.data?.data?.id) {
      setRecordId(res.data.data.id);
    }

    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "#fffbf0" }}>
        <div className="w-full max-w-sm text-center">
          <img src="https://media.base44.com/images/public/69b410ceece31b13c728497b/03ee6d0a3_generated_image.png" alt="Cheezies logo" className="w-20 h-20 object-contain mx-auto mb-4" />
          <h1 className="text-3xl font-black mb-2" style={{ fontFamily: "Georgia, serif", color: "#2a1200" }}>
            Chee<span style={{ color: "#c9940a" }}>zies</span> Admin
          </h1>
          <p className="text-sm mb-6" style={{ color: "rgba(61,34,0,0.5)" }}>Enter your passcode to continue.</p>
          <input
            type="password"
            placeholder="Passcode"
            value={passcode}
            onChange={e => setPasscode(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handlePasscode()}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-3"
            style={{ background: "#fff", border: `1.5px solid ${passcodeError ? "#ef4444" : "rgba(180,120,0,0.2)"}`, color: "#2a1200" }}
          />
          {passcodeError && <p className="text-sm text-red-500 mb-3">Incorrect passcode. Try again.</p>}
          <button
            onClick={handlePasscode}
            className="w-full py-3 rounded-xl font-bold text-base"
            style={{ background: "#c9940a", color: "#fff8e8" }}
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  const sectionStyle = { background: "#fff", border: "1px solid rgba(180,120,0,0.15)", boxShadow: "0 2px 12px rgba(180,120,0,0.06)" };

  return (
    <div style={{ minHeight: "100vh", background: "#fffbf0", paddingBottom: "6rem" }}>
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between" style={{ background: "#2a1200", borderBottom: "2px solid #c9940a" }}>
        <div className="flex items-center gap-3">
          <img src="https://media.base44.com/images/public/69b410ceece31b13c728497b/03ee6d0a3_generated_image.png" alt="Cheezies" className="w-9 h-9 object-contain" />
          <span className="font-black text-xl" style={{ fontFamily: "Georgia, serif", color: "#fff8e8" }}>
            Chee<span style={{ color: "#c9940a" }}>zies</span> Admin
          </span>
        </div>
        <button onClick={() => setAuthed(false)} className="text-sm px-4 py-2 rounded-lg font-semibold" style={{ background: "rgba(255,248,232,0.1)", color: "rgba(255,248,232,0.6)" }}>
          Logout
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-6">

        {/* Truck Status */}
        <section className="rounded-2xl p-6" style={sectionStyle}>
          <h2 className="font-black text-lg mb-4" style={{ color: "#2a1200" }}>Truck Status</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(statusLabels).map(([key, { label, color }]) => (
              <button
                key={key}
                onClick={() => setStatus(key)}
                className="px-5 py-2.5 rounded-full font-bold text-sm transition-all"
                style={{
                  background: status === key ? color : "rgba(0,0,0,0.05)",
                  color: status === key ? "#fff" : "#555",
                  border: `2px solid ${status === key ? color : "transparent"}`,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Today's Live Location */}
        <section className="rounded-2xl p-6" style={sectionStyle}>
          <h2 className="font-black text-lg mb-1" style={{ color: "#2a1200" }}>Today's Location</h2>
          <p className="text-xs mb-4" style={{ color: "rgba(61,34,0,0.45)" }}>Where the truck is right now. Updates the live tracker instantly.</p>

          <button
            onClick={() => doGPS(false)}
            disabled={gpsLoading}
            className="w-full py-3 rounded-xl font-bold text-base mb-4 transition-all hover:scale-[1.02]"
            style={{ background: "#c9940a", color: "#fff8e8" }}
          >
            {gpsLoading ? "Getting GPS…" : "📍 Use My Current Location"}
          </button>

          {location && (
            <div className="rounded-xl overflow-hidden mb-4" style={{ height: 200 }}>
              <iframe
                key={mapKey}
                title="Live Location"
                width="100%" height="100%"
                style={{ border: 0 }}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng - 0.01},${location.lat - 0.01},${location.lng + 0.01},${location.lat + 0.01}&layer=mapnik&marker=${location.lat},${location.lng}`}
              />
            </div>
          )}
          {!location && (
            <div className="rounded-xl mb-4 flex items-center justify-center text-sm" style={{ height: 100, background: "rgba(201,148,10,0.05)", border: "1.5px dashed rgba(180,120,0,0.2)", color: "rgba(61,34,0,0.4)" }}>
              Use GPS to set today's location
            </div>
          )}

          <input
            type="text"
            placeholder="Address (auto-filled or type manually)"
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: "#fffbf0", border: "1.5px solid rgba(180,120,0,0.2)", color: "#2a1200" }}
          />
        </section>

        {/* Home Base Location */}
        <section className="rounded-2xl p-6" style={sectionStyle}>
          <h2 className="font-black text-lg mb-1" style={{ color: "#2a1200" }}>Home Base Location</h2>
          <p className="text-xs mb-4" style={{ color: "rgba(61,34,0,0.45)" }}>Shown on the map when the truck is closed. Set it once and forget it.</p>

          <button
            onClick={() => doGPS(true)}
            disabled={homeGpsLoading}
            className="w-full py-3 rounded-xl font-bold text-base mb-4 transition-all hover:scale-[1.02]"
            style={{ background: "rgba(201,148,10,0.12)", color: "#7a4f00", border: "1.5px solid rgba(180,120,0,0.25)" }}
          >
            {homeGpsLoading ? "Getting GPS…" : "🏠 Use Current Location as Home Base"}
          </button>

          {homeLocation && (
            <div className="rounded-xl overflow-hidden mb-4" style={{ height: 200 }}>
              <iframe
                key={homeMapKey}
                title="Home Base"
                width="100%" height="100%"
                style={{ border: 0 }}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${homeLocation.lng - 0.01},${homeLocation.lat - 0.01},${homeLocation.lng + 0.01},${homeLocation.lat + 0.01}&layer=mapnik&marker=${homeLocation.lat},${homeLocation.lng}`}
              />
            </div>
          )}
          {!homeLocation && (
            <div className="rounded-xl mb-4 flex items-center justify-center text-sm" style={{ height: 100, background: "rgba(201,148,10,0.05)", border: "1.5px dashed rgba(180,120,0,0.2)", color: "rgba(61,34,0,0.4)" }}>
              No home base set yet
            </div>
          )}

          <input
            type="text"
            placeholder="Home base address"
            value={homeAddress}
            onChange={e => setHomeAddress(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: "#fffbf0", border: "1.5px solid rgba(180,120,0,0.2)", color: "#2a1200" }}
          />
        </section>

        {/* Hours & Days */}
        <section className="rounded-2xl p-6" style={sectionStyle}>
          <h2 className="font-black text-lg mb-1" style={{ color: "#2a1200" }}>Hours & Days Open</h2>
          <p className="text-xs mb-5" style={{ color: "rgba(61,34,0,0.45)" }}>These display across the website automatically.</p>

          <div className="flex gap-4 mb-5">
            <div className="flex-1">
              <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>Opens</label>
              <input
                type="text"
                placeholder="12:00 PM"
                value={hoursOpen}
                onChange={e => setHoursOpen(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "#fffbf0", border: "1.5px solid rgba(180,120,0,0.2)", color: "#2a1200" }}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(61,34,0,0.5)" }}>Closes</label>
              <input
                type="text"
                placeholder="6:00 PM"
                value={hoursClose}
                onChange={e => setHoursClose(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "#fffbf0", border: "1.5px solid rgba(180,120,0,0.2)", color: "#2a1200" }}
              />
            </div>
          </div>

          <label className="text-xs font-bold uppercase tracking-wider block mb-3" style={{ color: "rgba(61,34,0,0.5)" }}>Open Days</label>
          <div className="flex flex-wrap gap-2">
            {ALL_DAYS.map(day => {
              const active = openDays.includes(day);
              return (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className="px-4 py-2 rounded-full text-sm font-bold transition-all"
                  style={{
                    background: active ? "#c9940a" : "rgba(0,0,0,0.05)",
                    color: active ? "#fff8e8" : "#555",
                    border: `2px solid ${active ? "#c9940a" : "transparent"}`,
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </section>

        {/* Customer Note */}
        <section className="rounded-2xl p-6" style={sectionStyle}>
          <h2 className="font-black text-lg mb-2" style={{ color: "#2a1200" }}>Customer Message</h2>
          <p className="text-xs mb-3" style={{ color: "rgba(61,34,0,0.45)" }}>Optional — shown on the Find Us page (e.g. "Today's special: Lobster Grilled Cheese!")</p>
          <textarea
            rows={3}
            placeholder="Leave a note for customers..."
            value={note}
            onChange={e => setNote(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
            style={{ background: "#fffbf0", border: "1.5px solid rgba(180,120,0,0.2)", color: "#2a1200" }}
          />
        </section>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 rounded-2xl font-black text-lg transition-all hover:scale-[1.02]"
          style={{ background: saveSuccess ? "#22c55e" : "#c9940a", color: "#fff8e8", boxShadow: "0 4px 20px rgba(180,120,0,0.3)" }}
        >
          {saving ? "Saving…" : saveSuccess ? "✓ Saved & Published!" : "Save & Publish"}
        </button>

        {/* Menu Manager */}
        <AdminMenuManager />
      </div>
    </div>
  );
}