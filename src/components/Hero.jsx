import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative flex flex-col md:flex-row min-h-screen" style={{ background: "#fff", paddingTop: "72px" }}>
      {/* Left — text content */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-16 md:py-0 order-2 md:order-1">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
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
            Akron, Ohio's gourmet food truck making every sandwich an experience that stops you in your tracks.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://cheeziesgourmetohio.square.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 font-black text-sm tracking-widest uppercase transition-opacity hover:opacity-85"
              style={{
                background: "#c9940a",
                color: "#fff",
                textDecoration: "none",
                border: "2px solid #c9940a",
              }}
            >
              Order Online
            </a>
            <button
              onClick={() => { navigate("/Menu"); window.scrollTo({ top: 0, behavior: "instant" }); }}
              className="px-7 py-3.5 font-black text-sm tracking-widest uppercase transition-all hover:bg-amber-50"
              style={{
                background: "transparent",
                border: "2px solid #c9940a",
                color: "#c9940a",
                cursor: "pointer",
              }}
            >
              View the Menu
            </button>
          </div>
        </motion.div>
      </div>

      {/* Right — food image */}
      <motion.div
        className="flex-1 order-1 md:order-2 flex items-center justify-center px-8 py-12 md:py-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        style={{ background: "#fffbf0", minHeight: "40vw" }}
      >
        <img
          src="https://media.base44.com/images/public/69b410ceece31b13c728497b/5e68b0a48_generated_image.png"
          alt="Cheezies gourmet grilled cheese"
          className="w-full max-w-lg object-contain"
          style={{ maxHeight: "60vh" }}
        />
      </motion.div>
    </section>
  );
}