import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CateringTeaser() {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-6" style={{ background: "var(--color-bg-deep)" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="relative overflow-hidden p-10 md:p-14"
          style={{
            background: "linear-gradient(135deg, #1a0800 0%, #2e1200 60%, #3d1a00 100%)",
            borderRadius: "28px",
            boxShadow: "0 20px 60px rgba(26,8,0,0.3)",
          }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Decorative glow */}
          <div
            className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(201,148,10,0.12) 0%, transparent 70%)", transform: "translate(30%, -30%)" }}
          />

          <div className="relative flex flex-col md:flex-row items-center gap-10">
            {/* Text */}
            <div className="flex-1">
              <span
                className="inline-block text-xs font-black tracking-widest uppercase mb-4 px-4 py-1.5"
                style={{ background: "rgba(201,148,10,0.15)", color: "#e8b800", borderRadius: "999px", border: "1px solid rgba(232,184,0,0.25)" }}
              >
                Book the Truck
              </span>
              <h2
                className="font-black leading-tight mb-4"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff8e8" }}
              >
                Catering &<br />
                <span style={{ color: "#e8b800" }}>Private Events</span>
              </h2>
              <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(255,248,232,0.65)", maxWidth: "380px", lineHeight: "1.8" }}>
                Birthday parties · Corporate lunches · Weddings · Festivals. We scale up and show up, from 25 guests to 300+.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => { navigate("/Catering"); window.scrollTo({ top: 0, behavior: "instant" }); }}
                  className="px-6 py-3 font-black text-xs tracking-widest uppercase transition-all hover:opacity-90 hover:scale-105"
                  style={{ background: "#c9940a", color: "#fff", border: "none", cursor: "pointer", borderRadius: "12px", boxShadow: "0 4px 16px rgba(201,148,10,0.4)" }}
                >
                  Request a Quote
                </button>
                <a
                  href="tel:3305108875"
                  className="px-6 py-3 font-black text-xs tracking-widest uppercase transition-all hover:bg-white/10"
                  style={{ background: "transparent", border: "1.5px solid rgba(255,248,232,0.25)", color: "#fff8e8", textDecoration: "none", borderRadius: "12px" }}
                >
                  Call Us
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="flex md:flex-col gap-8 md:gap-6 flex-shrink-0 md:w-48">
              {[["25–300+", "Guests Served"], ["3", "Event Packages"], ["24hr", "Response Time"]].map(([val, label]) => (
                <div
                  key={label}
                  className="text-center p-4"
                  style={{ background: "rgba(255,248,232,0.06)", borderRadius: "16px", border: "1px solid rgba(255,248,232,0.1)" }}
                >
                  <p className="font-black leading-none" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#e8b800" }}>{val}</p>
                  <p className="text-xs font-black tracking-wide mt-1" style={{ color: "rgba(255,248,232,0.4)" }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}