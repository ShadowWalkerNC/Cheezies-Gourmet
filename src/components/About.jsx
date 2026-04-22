import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";

function formatDays(days) {
  if (!days || days.length === 0) return "Closed";
  if (days.length === 7) return "Every day";
  return days.join(", ");
}

export default function About() {
  const [truckData, setTruckData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    base44.entities.TruckLocation.list("-updated_date", 1).then(records => {
      if (records.length > 0) setTruckData(records[0]);
    });
    const unsub = base44.entities.TruckLocation.subscribe(event => {
      if (event.type === "create" || event.type === "update") setTruckData(event.data);
    });
    return unsub;
  }, []);

  const hoursText = truckData?.hours_open && truckData?.hours_close
    ? `${truckData.hours_open} – ${truckData.hours_close}`
    : "Noon – 6:00 PM";
  const daysText = formatDays(truckData?.open_days);
  const closedDay = truckData?.open_days && !truckData.open_days.includes("Mon") ? "Closed Monday" : null;

  const status = truckData?.status;
  const isClosed = status === "closed";
  const hasLiveLocation = !isClosed && truckData?.latitude && truckData?.longitude;
  const liveAddress = hasLiveLocation ? truckData.address : (truckData?.home_address || "Akron, Ohio");

  return (
    <section
      id="about"
      className="py-16 px-6"
      style={{ background: "#fffbf0", borderBottom: "1px solid rgba(180,120,0,0.1)" }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row items-center gap-12"
        >
          {/* Image */}
          <div className="flex-shrink-0 w-full md:w-80 h-60 md:h-80 rounded-xl overflow-hidden shadow-lg flex items-center justify-center" style={{ background: "#fffbf0" }}>
            <img
              src="https://media.base44.com/images/public/69b410ceece31b13c728497b/03ee6d0a3_generated_image.png"
              alt="Cheezies gourmet grilled cheese mascot"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Text */}
          <div className="flex-1">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "#c9940a" }}>Our Story</p>
            <h2
              className="text-4xl md:text-5xl font-black mb-5 leading-tight"
              style={{ fontFamily: "Georgia, serif", color: "#2a1200" }}
            >
              More Than Just a<br />
              <span style={{ color: "#c9940a" }}>Grilled Cheese</span>
            </h2>
            <p className="text-base leading-relaxed mb-7" style={{ color: "rgba(61,34,0,0.65)" }}>
              Cheezies started with one idea — take the most comforting food in the world and make it extraordinary. We blend bold flavors, premium ingredients, and a whole lot of heart into every sandwich. Born and raised in Akron, Ohio, proud to serve our community fresh to order.
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              {[["Made Fresh", "Crafted to order."], ["Premium Cheese", "Melted perfectly."], ["Akron Proud", "Community first."]].map(([title, desc]) => (
                <div key={title} className="rounded-lg px-4 py-3 text-sm" style={{ background: "rgba(201,148,10,0.08)", border: "1px solid rgba(180,120,0,0.18)" }}>
                  <p className="font-black mb-0.5" style={{ color: "#2a1200" }}>{title}</p>
                  <p className="text-xs" style={{ color: "rgba(61,34,0,0.55)" }}>{desc}</p>
                </div>
              ))}
            </div>

            {/* Live hours + location from DB */}
            <div className="rounded-xl px-4 py-3 mb-5 text-sm" style={{ background: "rgba(201,148,10,0.06)", border: "1px solid rgba(180,120,0,0.15)" }}>
              <p className="font-black mb-1" style={{ color: "#2a1200" }}>
                📍 {liveAddress}
                {status && (
                  <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full" style={{
                    background: status === "open" ? "#dcfce7" : status === "en_route" ? "#fef9c3" : "#fee2e2",
                    color: status === "open" ? "#15803d" : status === "en_route" ? "#a16207" : "#b91c1c",
                  }}>
                    {status === "open" ? "Open Now" : status === "en_route" ? "En Route" : "Closed"}
                  </span>
                )}
              </p>
              <p className="text-xs" style={{ color: "rgba(61,34,0,0.55)" }}>
                <strong>{daysText}:</strong> {hoursText}
                {closedDay && <>&nbsp;|&nbsp;<strong>{closedDay}</strong></>}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => { navigate("/FindUs"); window.scrollTo({ top: 0, behavior: "instant" }); }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105 select-none"
                style={{ background: "#c9940a", color: "#fff8e8", border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(180,120,0,0.25)" }}
              >
                Find the Truck →
              </button>
              <a
                href="https://cheeziesgourmetohio.square.site/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105 select-none"
                style={{ background: "rgba(201,148,10,0.08)", border: "1.5px solid rgba(180,120,0,0.2)", color: "#2a1200", textDecoration: "none" }}
              >
                Order Online
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}