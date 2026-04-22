import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const PASSWORD = "Cheezies0h!026";

const statusLabels = {
  open: { label: "Open Now", color: "#22c55e" },
  closed: { label: "Closed", color: "#ef4444" },
  en_route: { label: "En Route", color: "#f59e0b" },
};

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState("open");
  const [note, setNote] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [mapCenter, setMapCenter] = useState([41.0814, -81.5190]); // Akron, OH default

  useEffect(() => {
    const saved = sessionStorage.getItem("cheezies_admin_authed");
    if (saved === "true") setAuthed(true);
  }, []);

  useEffect(() => {
    if (authed) loadCurrentLocation();
  }, [authed]);

  const loadCurrentLocation = async () => {
    const records = await base44.entities.TruckLocation.list("-updated_date", 1);
    if (records.length > 0) {
      const r = records[0];
      setLocation({ lat: r.latitude, lng: r.longitude });
      setStatus(r.status || "open");
      setNote(r.note || "");
      setAddress(r.address || "");
      if (r.latitude && r.longitude) {
        setMapCenter([r.latitude, r.longitude]);
      }
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === PASSWORD) {
      setAuthed(true);
      sessionStorage.setItem("cheezies_admin_authed", "true");
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 2000);
    }
  };

  const handleLogout = () => {
    setAuthed(false);
    sessionStorage.removeItem("cheezies_admin_authed");
  };

  const handleGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocation({ lat, lng });
        setMapCenter([lat, lng]);

        // Reverse geocode
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );
          const data = await res.json();
          setAddress(data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        } catch {
          setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        }
        setGpsLoading(false);
      },
      (err) => {
        alert("Could not get location: " + err.message);
        setGpsLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleMapClick = async ({ lat, lng }) => {
    setLocation({ lat, lng });
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      setAddress(data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } catch {
      setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    }
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
      updated_at: new Date().toISOString(),
    };

    const existing = await base44.entities.TruckLocation.list("-updated_date", 1);
    if (existing.length > 0) {
      await base44.entities.TruckLocation.update(existing[0].id, payload);
    } else {
      await base44.entities.TruckLocation.create(payload);
    }

    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (!authed) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: "#fffbf0" }}
      >
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <img
              src="https://media.base44.com/images/public/69b410ceece31b13c728497b/03ee6d0a3_generated_image.png"
              alt="Cheezies logo"
              className="w-20 h-20 object-contain mx-auto mb-4"
            />
            <h1
              className="text-3xl font-black"
              style={{ fontFamily: "Georgia, serif", color: "#2a1200" }}
            >
              Chee<span style={{ color: "#c9940a" }}>zies</span> Admin
            </h1>
            <p className="text-sm mt-1" style={{ color: "rgba(61,34,0,0.5)" }}>
              Enter your password to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all"
              style={{
                background: "#fff",
                border: `2px solid ${passwordError ? "#ef4444" : "rgba(180,120,0,0.2)"}`,
                color: "#2a1200",
              }}
              autoFocus
            />
            {passwordError && (
              <p className="text-sm text-center" style={{ color: "#ef4444" }}>
                Incorrect password. Try again.
              </p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-base transition-all hover:scale-105"
              style={{ background: "#c9940a", color: "#fff8e8" }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fffbf0", paddingBottom: "6rem" }}>
      {/* Header */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{ background: "#2a1200", borderBottom: "2px solid #c9940a" }}
      >
        <div className="flex items-center gap-3">
          <img
            src="https://media.base44.com/images/public/69b410ceece31b13c728497b/03ee6d0a3_generated_image.png"
            alt="Cheezies"
            className="w-9 h-9 object-contain"
          />
          <span
            className="font-black text-xl"
            style={{ fontFamily: "Georgia, serif", color: "#fff8e8" }}
          >
            Chee<span style={{ color: "#c9940a" }}>zies</span> Admin
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm px-4 py-2 rounded-lg font-semibold"
          style={{ background: "rgba(255,248,232,0.1)", color: "rgba(255,248,232,0.6)" }}
        >
          Logout
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-6">

        {/* Truck Status */}
        <section
          className="rounded-2xl p-6"
          style={{ background: "#fff", border: "1px solid rgba(180,120,0,0.15)", boxShadow: "0 2px 12px rgba(180,120,0,0.06)" }}
        >
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

        {/* Location Update */}
        <section
          className="rounded-2xl p-6"
          style={{ background: "#fff", border: "1px solid rgba(180,120,0,0.15)", boxShadow: "0 2px 12px rgba(180,120,0,0.06)" }}
        >
          <h2 className="font-black text-lg mb-4" style={{ color: "#2a1200" }}>Truck Location</h2>

          <button
            onClick={handleGPS}
            disabled={gpsLoading}
            className="w-full py-3 rounded-xl font-bold text-base mb-4 transition-all hover:scale-[1.02]"
            style={{ background: "#c9940a", color: "#fff8e8" }}
          >
            {gpsLoading ? "Getting GPS..." : "📍 Use My Current Location"}
          </button>

          <p className="text-xs text-center mb-4" style={{ color: "rgba(61,34,0,0.4)" }}>
            — or tap anywhere on the map to set location —
          </p>

          {/* Map */}
          <div className="rounded-xl overflow-hidden mb-4" style={{ height: 300 }}>
            <MapContainer
              center={mapCenter}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapClickHandler onMapClick={handleMapClick} />
              {location && (
                <Marker position={[location.lat, location.lng]}>
                  <Popup>Cheezies is here!</Popup>
                </Marker>
              )}
            </MapContainer>
          </div>

          {/* Address */}
          <input
            type="text"
            placeholder="Address (auto-filled or type manually)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{
              background: "#fffbf0",
              border: "1.5px solid rgba(180,120,0,0.2)",
              color: "#2a1200",
            }}
          />
        </section>

        {/* Customer Note */}
        <section
          className="rounded-2xl p-6"
          style={{ background: "#fff", border: "1px solid rgba(180,120,0,0.15)", boxShadow: "0 2px 12px rgba(180,120,0,0.06)" }}
        >
          <h2 className="font-black text-lg mb-2" style={{ color: "#2a1200" }}>Customer Message</h2>
          <p className="text-xs mb-3" style={{ color: "rgba(61,34,0,0.45)" }}>
            Optional — shown on the Find Us page (e.g. "Today's special: Lobster Grilled Cheese!")
          </p>
          <textarea
            rows={3}
            placeholder="Leave a note for customers..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
            style={{
              background: "#fffbf0",
              border: "1.5px solid rgba(180,120,0,0.2)",
              color: "#2a1200",
            }}
          />
        </section>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 rounded-2xl font-black text-lg transition-all hover:scale-[1.02]"
          style={{
            background: saveSuccess ? "#22c55e" : "#c9940a",
            color: "#fff8e8",
            boxShadow: "0 4px 20px rgba(180,120,0,0.3)",
          }}
        >
          {saving ? "Saving..." : saveSuccess ? "✓ Saved!" : "Save & Publish Location"}
        </button>
      </div>
    </div>
  );
}