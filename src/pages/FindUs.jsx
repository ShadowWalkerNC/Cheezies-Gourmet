import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { useTruckData } from "@/hooks/useTruckData";

const statusConfig = {
  open:     { label: "Open Now 🟢", bg: "#dcfce7", color: "#15803d" },
  closed:   { label: "Closed 🔴",   bg: "#fee2e2", color: "#b91c1c" },
  en_route: { label: "En Route 🟡", bg: "#fef9c3", color: "#a16207" },
};

function formatDays(days) {
  if (!days || days.length === 0) return "—";
  if (days.length === 7) return "Every day";
  return days.join(", ");
}

export default function FindUs() {
  const truckData = useTruckData();

  const status = truckData?.status || "closed";
  const sc = statusConfig[status] || statusConfig.closed;
  const isClosed = status === "closed";
  const showLive = !isClosed && truckData?.latitude && truckData?.longitude;

  const mapLat = showLive ? truckData.latitude : null;
  const mapLng = showLive ? truckData.longitude : null;
  const mapAddress = showLive ? truckData?.address : (truckData?.home_address || "Akron, Ohio");
  const hasMap = mapLat && mapLng;

  const mapSrc = hasMap
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${mapLng - 0.01},${mapLat - 0.01},${mapLng + 0.01},${mapLat + 0.01}&layer=mapnik&marker=${mapLat},${mapLng}`
    : null;

  const hoursText = truckData?.hours_open && truckData?.hours_close
    ? `${truckData.hours_open} – ${truckData.hours_close}`
    : "11:00 AM – 6:00 PM";
  const daysText = formatDays(truckData?.open_days);

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col" style={{ background: "#fffbf0" }}>
        <NavBar />
        <main className="flex-1 pt-20 pb-24">
          <div className="max-w-4xl mx-auto px-6 py-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-8">
              <p className="text-xs font-bold tracking-[0.3em] uppercase mb-2" style={{ color: "#c9940a" }}>Live Tracker</p>
              <h1 className="text-4xl md:text-5xl font-black mb-3" style={{ fontFamily: "Georgia, serif", color: "#2a1200" }}>
                Find the <span style={{ color: "#c9940a" }}>Truck</span>
              </h1>
              <p className="text-base" style={{ color: "rgba(61,34,0,0.55)" }}>Check back before heading out!</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="flex flex-col gap-5">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm self-center" style={{ background: sc.bg, color: sc.color }}>
                {sc.label}
              </div>

              {hasMap ? (
                <div className="rounded-2xl overflow-hidden shadow-lg" style={{ height: 380 }}>
                  <iframe title="Truck Location" width="100%" height="100%" style={{ border: 0, display: "block" }} src={mapSrc} />
                </div>
              ) : (
                <div className="rounded-2xl flex items-center justify-center py-16 text-center" style={{ background: "rgba(201,148,10,0.06)", border: "2px dashed rgba(180,120,0,0.2)" }}>
                  <div>
                    <p className="text-4xl mb-3">📍</p>
                    <p className="font-bold" style={{ color: "#2a1200" }}>No live location set</p>
                    <p className="text-sm mt-1" style={{ color: "rgba(61,34,0,0.5)" }}>Follow us on Facebook for daily location updates.</p>
                  </div>
                </div>
              )}

              <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: "#fff", border: "1px solid rgba(180,120,0,0.15)" }}>
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#c9940a" }}>Location</p>
                  <p className="text-sm font-semibold" style={{ color: "#2a1200" }}>{mapAddress}</p>
                  {isClosed && <p className="text-xs mt-1" style={{ color: "rgba(61,34,0,0.45)" }}>Truck is currently closed — check Facebook for today's location.</p>}
                </div>
                <div style={{ borderTop: "1px solid rgba(180,120,0,0.1)", paddingTop: 12 }}>
                  <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#c9940a" }}>Hours</p>
                  <p className="text-sm font-semibold" style={{ color: "#2a1200" }}>{hoursText}</p>
                  <p className="text-sm" style={{ color: "rgba(61,34,0,0.6)" }}>{daysText}</p>
                </div>
                {truckData?.note ? (
                  <div style={{ borderTop: "1px solid rgba(180,120,0,0.1)", paddingTop: 12 }}>
                    <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#c9940a" }}>Today's Note</p>
                    <p className="text-sm" style={{ color: "rgba(61,34,0,0.7)" }}>{truckData.note}</p>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-wrap justify-center gap-3 mt-2">
                <a href="https://cheeziesgourmetohio.square.site/" target="_blank" rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full font-bold text-sm transition-all hover:scale-105"
                  style={{ background: "#c9940a", color: "#fff8e8" }}>Order Online</a>
                <a href="https://www.facebook.com/cheeziesohio" target="_blank" rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full font-bold text-sm transition-all hover:scale-105"
                  style={{ background: "rgba(201,148,10,0.08)", border: "1.5px solid rgba(180,120,0,0.2)", color: "#2a1200" }}>Follow on Facebook</a>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
}
