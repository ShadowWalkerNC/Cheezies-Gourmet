import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CateringTeaser() {
  const navigate = useNavigate();

  return (
    <section
      className="py-16 px-6"
      style={{ background: "#fffbf0", borderTop: "1px solid rgba(180,120,0,0.1)" }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl overflow-hidden flex flex-col md:flex-row"
          style={{ background: "linear-gradient(135deg, #2a1200 0%, #3d1f00 100%)", boxShadow: "0 8px 40px rgba(42,18,0,0.2)" }}
        >
          {/* Text side */}
          <div className="flex-1 px-8 py-10 flex flex-col justify-center">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "#e8b800" }}>
              Bring the Truck to You
            </p>
            <h2
              className="text-3xl md:text-4xl font-black mb-4 leading-tight"
              style={{ fontFamily: "Georgia, serif", color: "#fff8e8" }}
            >
              Catering &<br />
              <span style={{ color: "#e8b800" }}>Private Events</span>
            </h2>
            <p className="text-sm leading-relaxed mb-7" style={{ color: "rgba(255,248,232,0.72)", maxWidth: "380px", lineHeight: "1.75" }}>
              Birthday parties · Corporate lunches · Weddings · Festivals. We scale up and show up, from 25 guests to 300+.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => { navigate("/Catering"); window.scrollTo({ top: 0, behavior: "instant" }); }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-opacity duration-200 hover:opacity-85 select-none"
                style={{ background: "#c9940a", color: "#fff8e8", boxShadow: "0 4px 20px rgba(201,148,10,0.35)", minHeight: "44px" }}
              >
                Request a Quote <ArrowRight size={15} />
              </button>
              <a
                href="tel:3305108875"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-colors duration-200 hover:bg-white/20 select-none"
                style={{ background: "rgba(255,248,232,0.1)", border: "1.5px solid rgba(255,248,232,0.2)", color: "#fff8e8", textDecoration: "none", minHeight: "44px" }}
              >
                Call Us
              </a>
            </div>
          </div>

          {/* Stats side */}
          <div className="flex md:flex-col justify-around md:justify-center gap-0 px-8 py-8 md:py-10 md:w-48 border-t md:border-t-0 md:border-l"
            style={{ borderColor: "rgba(255,248,232,0.08)" }}>
            {[["25–300+", "Guests"], ["3", "Packages"], ["24hr", "Response"]].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-black" style={{ color: "#e8b800" }}>{val}</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: "rgba(255,248,232,0.45)" }}>{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}