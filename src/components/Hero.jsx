import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section
      className="relative flex flex-col md:flex-row min-h-screen overflow-hidden"
      style={{ background: "var(--color-bg-deep)", paddingTop: "72px" }}
    >
      {/* Warm blob background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 70% 40%, #faecc4 0%, transparent 70%)",
        }}
      />

      {/* Left — text content */}
      <div className="relative flex-1 flex flex-col justify-center px-8 md:px-16 py-16 md:py-0 order-2 md:order-1">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Pill label */}
          <span
            className="inline-block text-xs font-black tracking-widest uppercase mb-5 px-4 py-1.5"
            style={{
              background: "#fff8e8",
              color: "#c9940a",
              borderRadius: "999px",
              border: "1.5px solid rgba(201,148,10,0.3)",
            }}
          >
            🧀 Akron, Ohio's Favorite Food Truck
          </span>

          <h1
            className="font-black uppercase leading-none mb-6"
            style={{
              fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
              color: "#1a0800",
              letterSpacing: "-0.02em",
              lineHeight: 0.95,
            }}
          >
            ARTISAN<br />GRILLED<br />CHEESE.<br />
            <span style={{ color: "#c9940a" }}>REIMAGINED.</span>
          </h1>

          <p className="text-base mb-8 leading-relaxed" style={{ color: "rgba(61,34,0,0.65)", maxWidth: "420px" }}>
            Making every sandwich an experience that stops you in your tracks — fresh, bold, and melted to perfection.
          </p>

          {/* Trust bar */}
          <div
            className="inline-flex flex-wrap items-center gap-4 mb-8 px-5 py-3"
            style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 2px 16px rgba(201,148,10,0.12)", border: "1px solid rgba(201,148,10,0.15)" }}
          >
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#c9940a"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
                ))}
              </div>
              <span className="text-xs font-black" style={{ color: "#1a0800" }}>5.0</span>
              <span className="text-xs" style={{ color: "rgba(61,34,0,0.5)" }}>on Google</span>
            </div>
            <div className="w-px h-4" style={{ background: "#e8e0d0" }} />
            <a
              href="https://maps.app.goo.gl/dUyof854YsHaKcNE9"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold hover:underline underline-offset-2"
              style={{ color: "#c9940a" }}
            >
              Leave a Review ↗
            </a>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://cheeziesgourmetohio.square.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 font-black text-sm tracking-widest uppercase transition-all hover:opacity-90 hover:scale-105"
              style={{
                background: "#c9940a",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "14px",
                boxShadow: "0 4px 20px rgba(201,148,10,0.35)",
              }}
            >
              Order Online
            </a>
            <button
              onClick={() => { navigate("/Menu"); window.scrollTo({ top: 0, behavior: "instant" }); }}
              className="px-7 py-3.5 font-black text-sm tracking-widest uppercase transition-all hover:bg-amber-50"
              style={{
                background: "transparent",
                border: "2px solid rgba(201,148,10,0.5)",
                color: "#c9940a",
                cursor: "pointer",
                borderRadius: "14px",
              }}
            >
              View the Menu
            </button>
          </div>
        </motion.div>
      </div>

      {/* Right — food image */}
      <motion.div
        className="relative flex-1 order-1 md:order-2 flex items-center justify-center px-8 py-12 md:py-0"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ minHeight: "40vw" }}
      >
        {/* Decorative warm circle */}
        <div
          className="absolute inset-8 pointer-events-none"
          style={{ background: "radial-gradient(circle, #faecc4 0%, transparent 70%)", borderRadius: "50%" }}
        />
        <img
          src="https://media.base44.com/images/public/69b410ceece31b13c728497b/5e68b0a48_generated_image.png"
          alt="Cheezies gourmet grilled cheese"
          className="relative w-full max-w-lg object-contain drop-shadow-xl"
          style={{ maxHeight: "60vh" }}
        />
      </motion.div>
    </section>
  );
}