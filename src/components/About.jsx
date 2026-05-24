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
    <section id="about" className="py-16 px-6" style={{ background: "var(--color-bg)", borderTop: "1.5px solid var(--color-border)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Left text */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-black tracking-[0.25em] uppercase mb-2" style={{ color: "var(--color-gold)" }}>Our Story</p>
            <h2
              className="font-black leading-tight mb-5"
              style={{ fontFamily: "Georgia, serif", color: "var(--color-cream)", fontSize: "clamp(2rem, 4vw, 2.8rem)" }}
            >
              More Than Just a Grilled Cheese
            </h2>
            <p className="text-sm leading-relaxed mb-7" style={{ color: "var(--color-text-muted)", lineHeight: "1.8" }}>
              Cheezies started with one idea — take the most comforting food in the world and make it extraordinary. We blend bold flavors, premium ingredients, and a whole lot of heart into every sandwich. Born and raised in Akron, Ohio, proud to serve our community fresh to order.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-7">
              {[["Made Fresh", "Crafted to order."], ["Premium Cheese", "Melted perfectly."], ["Akron Proud", "Community first."]].map(([title, desc]) => (
                <div key={title} className="p-4 text-sm" style={{ background: "var(--color-bg-mid)", border: "1.5px solid var(--color-border)" }}>
                <p className="font-black text-xs mb-1" style={{ color: "var(--color-cream)" }}>{title}</p>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{desc}</p>
                </div>
              ))}
            </div>

            {/* Live location */}
            <div className="flex items-start gap-2 mb-5 text-sm" style={{ color: "var(--color-cream)" }}>
              <span style={{ color: "#c9940a" }}>📍</span>
              <div>
                <span className="font-black">{liveAddress}</span>
                {status && (
                <span className="ml-2 text-xs font-bold px-2 py-0.5" style={{
                  background: status === "open" ? "#dcfce7" : status === "en_route" ? "#fef9c3" : "#fee2e2",
                  color: status === "open" ? "#15803d" : status === "en_route" ? "#a16207" : "#b91c1c",
                }}>
                  {status === "open" ? "Open Now" : status === "en_route" ? "En Route" : "Closed"}
                </span>
                )}
                <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                  {daysText}: {hoursText}
                  {closedDay && <> | {closedDay}</>}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => { navigate("/FindUs"); window.scrollTo({ top: 0, behavior: "instant" }); }}
                className="px-6 py-3 font-black text-xs tracking-widest uppercase transition-opacity hover:opacity-85"
                style={{ background: "var(--color-gold)", color: "#fff", border: "2px solid var(--color-gold)", cursor: "pointer" }}
              >
                Find the Truck →
              </button>
              <a
                href="https://cheeziesgourmetohio.square.site/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 font-black text-xs tracking-widest uppercase transition-all hover:bg-amber-50"
                style={{ background: "transparent", border: "2px solid var(--color-cream)", color: "var(--color-cream)", textDecoration: "none" }}
              >
                Order Online
              </a>
            </div>
          </motion.div>

          {/* Right — mascot image */}
          <motion.div
            className="w-full md:w-80 flex-shrink-0"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-full aspect-square flex items-center justify-center" style={{ background: "var(--color-bg-deep)", border: "1.5px solid var(--color-border)" }}>
              <img
                src="https://media.base44.com/images/public/69b410ceece31b13c728497b/03ee6d0a3_generated_image.png"
                alt="Cheezies mascot"
                className="w-full h-full object-contain p-6"
              />
            </div>
            <div className="mt-4 p-5" style={{ background: "var(--color-cream)" }}>
              <p className="text-xs font-black tracking-[0.2em] uppercase mb-1" style={{ color: "var(--color-gold)" }}>Fan Favorites</p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,248,232,0.75)" }}>
                From The Patty Meltdown to The Mac Attack — every sandwich is a showstopper. Come hungry.
              </p>
              <button
                onClick={() => { navigate("/Menu"); window.scrollTo({ top: 0, behavior: "instant" }); }}
                className="mt-4 w-full py-3 font-black text-xs tracking-widest uppercase transition-opacity hover:opacity-85"
                style={{ background: "var(--color-gold)", color: "#fff", border: "none", cursor: "pointer" }}
              >
                View Full Menu →
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}