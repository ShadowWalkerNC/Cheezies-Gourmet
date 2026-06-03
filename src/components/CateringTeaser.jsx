import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { usePageContent } from "@/hooks/usePageContent";

export default function CateringTeaser() {
  const navigate = useNavigate();
  const c = usePageContent().catering;

  const stats = [
    [c.stat1_val, c.stat1_label],
    [c.stat2_val, c.stat2_label],
    [c.stat3_val, c.stat3_label],
  ];

  return (
    <section className="py-16 px-6" style={{ background: "var(--color-bg)", borderTop: "1.5px solid #e8e0d0" }}>
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
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#1a0800" }}
          >
            {c.headline}<br />
            <span style={{ color: "#c9940a" }}>{c.headline_accent}</span>
          </h2>
          <p className="text-sm leading-relaxed mb-7" style={{ color: "rgba(61,34,0,0.65)", maxWidth: "380px", lineHeight: "1.8" }}>
            {c.body}
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
              className="px-6 py-3 rounded-full font-black text-xs tracking-widest uppercase transition-all hover:bg-amber-50"
              style={{ background: "transparent", border: "1.5px solid #1a0800", color: "#1a0800", textDecoration: "none" }}
            >
              Call Us
            </a>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="flex md:flex-col gap-8 md:gap-6 flex-shrink-0 md:w-40">
          {stats.map(([val, label]) => (
            <div key={label} className="text-right md:text-right">
              <p className="font-black leading-none" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "#c9940a" }}>{val}</p>
              <p className="text-xs font-black tracking-widest mt-0.5" style={{ color: "rgba(61,34,0,0.4)" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}