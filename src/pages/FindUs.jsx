import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { useTruckData } from "@/hooks/useTruckData";

const GMAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

const statusConfig = {
  open:     { label: "Open Now",  dot: "#16a34a", bg: "#dcfce7", color: "#15803d" },
  closed:   { label: "Closed",    dot: "#dc2626", bg: "#fee2e2", color: "#b91c1c" },
  en_route: { label: "En Route",  dot: "#d97706", bg: "#fef9c3", color: "#a16207" },
};

function formatDays(days) {
  if (!days || days.length === 0) return "—";
  if (days.length === 7) return "Every day";
  return days.join(", ");
}

function formatUpdated(iso) {
  if (!iso) return null;
  const diff = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (diff < 1)  return "Just updated";
  if (diff < 60) return `Updated ${diff}m ago`;
  const h = Math.floor(diff / 60);
  if (h < 24)    return `Updated ${h}h ago`;
  return `Updated ${Math.floor(h / 24)}d ago`;
}

export default function FindUs() {
  const truckData = useTruckData();

  const status  = truckData?.status || "closed";
  const sc      = statusConfig[status] || statusConfig.closed;
  const isClosed = status === "closed";
  const hasCoords = !isClosed && truckData?.latitude && truckData?.longitude;

  const lat  = truckData?.latitude;
  const lng  = truckData?.longitude;
  const addr = truckData?.address || "Akron, Ohio";
  const updatedLabel = formatUpdated(truckData?.updated_at);

  // Google Static Map (requires VITE_GOOGLE_MAPS_KEY)
  const staticMapSrc = hasCoords && GMAPS_KEY
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=800x400&scale=2&markers=color:0xc9940a%7C${lat},${lng}&style=feature:all%7Celement:labels.text.fill%7Ccolor:0x3d2200&key=${GMAPS_KEY}`
    : null;

  // Native maps deep link (works without API key)
  const directionsUrl = hasCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;

  const hoursText = truckData?.hours_open && truckData?.hours_close
    ? `${truckData.hours_open} – ${truckData.hours_close}`
    : "11:00 AM – 6:00 PM";

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col" style={{ background: "#fffbf0" }}>
        <NavBar />
        <main className="flex-1 pt-20 pb-28">
          <div className="max-w-lg mx-auto px-6 py-10 flex flex-col gap-6">

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="text-center">
              <p className="text-xs font-black tracking-[0.3em] uppercase mb-2" style={{ color: "#c9940a" }}>Live Tracker</p>
              <h1 className="text-4xl font-black mb-2" style={{ fontFamily: "Georgia, serif", color: "#2a1200" }}>
                Find the <span style={{ color: "#c9940a" }}>Truck</span>
              </h1>
              <p className="text-sm" style={{ color: "rgba(61,34,0,0.5)" }}>Check before heading out — we update this daily.</p>
            </motion.div>

            {/* Status pill + last updated */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex flex-col items-center gap-2">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-sm" style={{ background: sc.bg, color: sc.color }}>
                <span className="w-2 h-2 rounded-full" style={{ background: sc.dot }} />
                {sc.label}
              </div>
              {updatedLabel && (
                <p className="text-xs" style={{ color: "rgba(61,34,0,0.35)" }}>{updatedLabel}</p>
              )}
            </motion.div>

            {/* Map area */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              {hasCoords ? (
                <div className="rounded-2xl overflow-hidden" style={{ border: "1.5px solid rgba(180,120,0,0.15)", boxShadow: "0 4px 24px rgba(180,120,0,0.1)" }}>
                  {staticMapSrc ? (
                    // Google Static Map
                    <a href={directionsUrl} target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
                      <img
                        src={staticMapSrc}
                        alt="Truck location map"
                        className="w-full"
                        style={{ height: 220, objectFit: "cover", display: "block" }}
                      />
                    </a>
                  ) : (
                    // No API key — show a branded tap-to-open card
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center gap-3 py-14"
                      style={{ background: "#1a0800", textDecoration: "none", display: "block" }}
                    >
                      <span className="text-4xl">📍</span>
                      <div className="text-center">
                        <p className="font-black text-base" style={{ color: "#e8b800" }}>{addr}</p>
                        <p className="text-xs mt-1" style={{ color: "rgba(232,184,0,0.5)" }}>Tap to open in Maps</p>
                      </div>
                    </a>
                  )}
                  {/* Get Directions bar */}
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3.5 font-black text-sm uppercase tracking-widest"
                    style={{ background: "#c9940a", color: "#fff8e8", textDecoration: "none", display: "block", textAlign: "center" }}
                  >
                    📍 Get Directions
                  </a>
                </div>
              ) : (
                // Closed / no coords
                <div
                  className="rounded-2xl flex flex-col items-center justify-center py-14 text-center gap-3 px-6"
                  style={{ background: "rgba(201,148,10,0.06)", border: "2px dashed rgba(180,120,0,0.2)" }}
                >
                  <p className="text-4xl">🧀</p>
                  <p className="font-black text-base" style={{ color: "#2a1200" }}>
                    {isClosed ? "We're closed today" : "Location not set yet"}
                  </p>
                  <p className="text-sm" style={{ color: "rgba(61,34,0,0.5)" }}>
                    Follow us on Facebook or Instagram for today's location update.
                  </p>
                  <div className="flex gap-3 mt-2">
                    <a href="https://www.facebook.com/cheeziesohio" target="_blank" rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-full font-bold text-sm" style={{ background: "#1877F212", color: "#1877F2", border: "1.5px solid #1877F230", textDecoration: "none" }}>
                      Facebook
                    </a>
                    <a href="https://instagram.com/cheeziesohio" target="_blank" rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-full font-bold text-sm" style={{ background: "#e1306c12", color: "#e1306c", border: "1.5px solid #e1306c30", textDecoration: "none" }}>
                      Instagram
                    </a>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Info card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="rounded-2xl p-5 flex flex-col gap-4"
              style={{ background: "#fff", border: "1.5px solid rgba(180,120,0,0.15)" }}
            >
              <div>
                <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "#c9940a" }}>Location</p>
                <p className="text-sm font-bold" style={{ color: "#2a1200" }}>{hasCoords ? addr : (truckData?.home_address || "Akron, Ohio")}</p>
                {isClosed && <p className="text-xs mt-1" style={{ color: "rgba(61,34,0,0.4)" }}>Check Facebook for today’s spot.</p>}
              </div>
              <div style={{ borderTop: "1px solid rgba(180,120,0,0.1)", paddingTop: 12 }}>
                <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "#c9940a" }}>Hours</p>
                <p className="text-sm font-bold" style={{ color: "#2a1200" }}>{hoursText}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(61,34,0,0.5)" }}>{formatDays(truckData?.open_days)}</p>
              </div>
              {truckData?.note ? (
                <div style={{ borderTop: "1px solid rgba(180,120,0,0.1)", paddingTop: 12 }}>
                  <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "#c9940a" }}>Today’s Note</p>
                  <p className="text-sm" style={{ color: "rgba(61,34,0,0.7)" }}>{truckData.note}</p>
                </div>
              ) : null}
            </motion.div>

            {/* Bottom CTAs */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-wrap gap-3">
              <a href="https://cheeziesgourmetohio.square.site/" target="_blank" rel="noopener noreferrer"
                className="flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-wider text-center"
                style={{ background: "#c9940a", color: "#fff8e8", textDecoration: "none", minWidth: 140 }}>
                Order Online
              </a>
              <a href="https://www.facebook.com/cheeziesohio" target="_blank" rel="noopener noreferrer"
                className="flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-wider text-center"
                style={{ background: "#fff", border: "1.5px solid rgba(180,120,0,0.2)", color: "#2a1200", textDecoration: "none", minWidth: 140 }}>
                Follow on Facebook
              </a>
            </motion.div>

          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
}
