import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative flex items-end overflow-hidden" style={{ minHeight: "100svh", background: "#1a0800" }}>
      {/* Full-bleed food photo — using the uploaded Cheezies image */}
      <img
        src="https://media.base44.com/images/public/69b410ceece31b13c728497b/5e68b0a48_generated_image.png"
        alt="Cheezies Gourmet artisan grilled cheese sandwich"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.85 }}
      />

      {/* Dark gradient — heavier bottom-left for text, fades right */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(120deg, rgba(16,5,0,0.88) 0%, rgba(16,5,0,0.6) 45%, rgba(16,5,0,0.18) 100%)",
        }}
      />

      {/* Bottom vignette to ground content */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48"
        style={{ background: "linear-gradient(to top, rgba(16,5,0,0.6), transparent)" }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-24 pt-36">
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-xs font-bold tracking-[0.35em] uppercase mb-6"
            style={{ color: "#e8b800" }}
          >
            Handcrafted Melts &nbsp;·&nbsp; Premium Ingredients &nbsp;·&nbsp; Culinary Excellence
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="font-black leading-none mb-8"
            style={{
              fontFamily: "Georgia, serif",
              color: "#fff8e8",
              fontSize: "clamp(3.2rem, 8vw, 6rem)",
              letterSpacing: "-0.02em",
              textShadow: "0 2px 40px rgba(0,0,0,0.5)",
            }}
          >
            Artisan<br />
            Grilled Cheese<br />
            <span style={{ color: "#e8b800" }}>Reimagined</span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="text-lg mb-10 leading-relaxed"
            style={{ color: "rgba(255,248,232,0.65)", maxWidth: "480px" }}
          >
            Akron, Ohio's gourmet food truck — serving melts that stop you in your tracks.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="https://cheeziesgourmetohio.square.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-lg font-black text-base transition-all duration-300 hover:scale-105 select-none"
              style={{
                background: "#c9940a",
                color: "#fff8e8",
                textDecoration: "none",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                letterSpacing: "0.01em",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              Order Online
            </a>
            <button
              onClick={() => { navigate("/Menu"); window.scrollTo({ top: 0, behavior: "instant" }); }}
              className="px-8 py-4 rounded-lg font-bold text-base transition-all duration-300 hover:scale-105 select-none"
              style={{
                background: "rgba(255,248,232,0.1)",
                border: "1.5px solid rgba(255,248,232,0.35)",
                color: "#fff8e8",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              View Our Menu
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 right-8 z-10 hidden md:flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
      >
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: "rgba(255,248,232,0.35)" }}>Scroll</p>
        <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, rgba(255,248,232,0.3), transparent)" }} />
      </motion.div>
    </section>
  );
}