import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  const goTo = (path) => { navigate(path); window.scrollTo({ top: 0, behavior: "instant" }); };

  return (
    <section className="relative min-h-screen flex items-end overflow-hidden" style={{ background: "#1a0e00" }}>
      {/* Full-bleed food photo */}
      <img
        src="https://images.unsplash.com/photo-1528736235302-52922df5c122?w=1600&q=90"
        alt="Gourmet grilled cheese sandwich"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.75 }}
      />
      {/* Dark gradient overlay — heavier at bottom-left for text legibility */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, rgba(20,8,0,0.82) 0%, rgba(20,8,0,0.5) 50%, rgba(20,8,0,0.15) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-20 pt-40 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="max-w-xl"
        >
          <p
            className="text-xs font-bold tracking-[0.3em] uppercase mb-5"
            style={{ color: "#e8b800" }}
          >
            Handcrafted Melts &nbsp;|&nbsp; Premium Ingredients &nbsp;|&nbsp; Culinary Excellence
          </p>
          <h1
            className="font-black leading-none mb-6"
            style={{
              fontFamily: "Georgia, serif",
              color: "#fff8e8",
              fontSize: "clamp(3rem, 8vw, 5.5rem)",
              letterSpacing: "-0.02em",
              textShadow: "0 4px 32px rgba(0,0,0,0.4)",
            }}
          >
            Artisan<br />
            Grilled Cheese<br />
            <span style={{ color: "#e8b800" }}>Reimagined</span>
          </h1>

          <div className="flex flex-wrap gap-3 mt-8">
            <a
              href="https://cheeziesgourmetohio.square.site/?location_id=LXWMCZH8PDQSN&fulfillment=PICKUP"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-lg font-bold text-base transition-all duration-300 hover:scale-105 select-none"
              style={{ background: "#c9940a", color: "#fff8e8", boxShadow: "0 6px 24px rgba(0,0,0,0.35)", textDecoration: "none", WebkitTapHighlightColor: "transparent" }}
            >
              Order Online
            </a>
            <button
              onClick={() => goTo("/Menu")}
              className="px-8 py-3.5 rounded-lg font-bold text-base transition-all duration-300 hover:scale-105 select-none"
              style={{ background: "rgba(255,248,232,0.12)", border: "1.5px solid rgba(255,248,232,0.4)", color: "#fff8e8", cursor: "pointer", WebkitTapHighlightColor: "transparent", backdropFilter: "blur(8px)" }}
            >
              View Our Menu
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 right-8 z-10 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
      >
        <p className="text-xs tracking-widest uppercase" style={{ color: "rgba(255,248,232,0.4)" }}>Scroll</p>
        <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, rgba(255,248,232,0.3), transparent)" }} />
      </motion.div>
    </section>
  );
}