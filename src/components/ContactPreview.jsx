import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ContactPreview() {
  const navigate = useNavigate();

  return (
    <section
      className="py-16 px-6"
      style={{ background: "#fdf6e3", borderTop: "1px solid rgba(180,120,0,0.1)" }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-8 gap-4 flex-wrap"
        >
          <div>
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-2" style={{ color: "#c9940a" }}>Get In Touch</p>
            <h2 className="text-3xl md:text-4xl font-black leading-tight" style={{ fontFamily: "Georgia, serif", color: "#2a1200" }}>
              Find Us
            </h2>
          </div>
          <button
            onClick={() => { navigate("/Contact"); window.scrollTo({ top: 0, behavior: "instant" }); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 hover:scale-105 select-none whitespace-nowrap"
            style={{ background: "#2a1200", color: "#fff8e8", border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}
          >
            Full Info <ArrowRight size={15} />
          </button>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-4">
          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-xl p-5"
            style={{ background: "#fff", border: "1px solid rgba(180,120,0,0.14)", boxShadow: "0 2px 10px rgba(180,120,0,0.06)" }}
          >
            <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "rgba(80,45,0,0.4)" }}>Location</p>
            <p className="font-black text-base mb-1" style={{ color: "#2a1200" }}>Akron, Ohio</p>
            <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(61,34,0,0.55)" }}>
              We move daily — follow social for today's exact spot.
            </p>
            <a
              href="https://www.facebook.com/profile.php?id=61572987417963"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-3 py-1.5 rounded-lg font-bold text-xs transition-all hover:scale-105"
              style={{ background: "#1877F2", color: "#fff", textDecoration: "none" }}
            >
              Today's Location →
            </a>
          </motion.div>

          {/* Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="rounded-xl p-5"
            style={{ background: "#fff", border: "1px solid rgba(180,120,0,0.14)", boxShadow: "0 2px 10px rgba(180,120,0,0.06)" }}
          >
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(80,45,0,0.4)" }}>Hours</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between gap-2">
                <span style={{ color: "rgba(61,34,0,0.65)" }}>Mon – Fri</span>
                <span className="font-bold" style={{ color: "#2a1200" }}>11am – 7pm</span>
              </div>
              <div className="flex justify-between gap-2">
                <span style={{ color: "rgba(61,34,0,0.65)" }}>Sat – Sun</span>
                <span className="font-bold" style={{ color: "#2a1200" }}>11am – 5pm</span>
              </div>
            </div>
            <p className="text-[10px] mt-3" style={{ color: "rgba(61,34,0,0.35)" }}>Hours vary — check social for updates.</p>
          </motion.div>

          {/* Phone */}
          <motion.a
            href="tel:3305108875"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16 }}
            className="rounded-xl p-5 flex flex-col justify-between transition-all duration-200 hover:scale-[1.02]"
            style={{ background: "#c9940a", boxShadow: "0 4px 20px rgba(180,120,0,0.3)", textDecoration: "none" }}
          >
            <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "rgba(255,248,232,0.6)" }}>Call Us</p>
            <p className="font-black text-xl mb-3" style={{ color: "#fff8e8" }}>330-510-8875</p>
            <span
              className="inline-block px-3 py-1.5 rounded-lg font-bold text-xs self-start"
              style={{ background: "rgba(255,248,232,0.2)", color: "#fff8e8" }}
            >
              Tap to Call →
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}