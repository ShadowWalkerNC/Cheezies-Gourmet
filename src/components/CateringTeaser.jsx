import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CateringTeaser() {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-6" style={{ background: "#1a0800", borderTop: "1.5px solid #2a1200" }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* Text */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2
            className="font-black leading-tight mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff8e8" }}
          >
            Catering &<br />
            <span style={{ color: "#e8b800" }}>Private Events</span>
          </h2>
          <p className="text-sm leading-relaxed mb-7" style={{ color: "rgba(255,248,232,0.65)", maxWidth: "380px", lineHeight: "1.8" }}>
            Birthday parties · Corporate lunches · Weddings · Festivals. We scale up and show up, from 25 guests to 300+.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => { navigate("/Catering"); window.scrollTo({ top: 0, behavior: "instant" }); }}
              className="px-6 py-3 rounded-full font-black text-xs tracking-widest uppercase transition-opacity hover:opacity-85"
              style={{ background: "#c9940a", color: "#fff", border: "none", cursor: "pointer" }}
            >
              Request a Quote
            </button>
            <a
              href="tel:3305108875"
              className="px-6 py-3 rounded-full font-black text-xs tracking-widest uppercase transition-all hover:bg-white/10"
              style={{ background: "transparent", border: "1.5px solid rgba(255,248,232,0.3)", color: "#fff8e8", textDecoration: "none" }}
            >
              Call Us
            </a>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="flex md:flex-col gap-8 md:gap-6 flex-shrink-0 md:w-40">
          {[["25-300+", "GUESTS"], ["3", "PACKAGES"], ["24HR", "RESPONSE"]].map(([val, label]) => (
            <div key={label} className="text-right md:text-right">
              <p className="font-black leading-none" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "#e8b800" }}>{val}</p>
              <p className="text-xs font-black tracking-widest mt-0.5" style={{ color: "rgba(255,248,232,0.4)" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}