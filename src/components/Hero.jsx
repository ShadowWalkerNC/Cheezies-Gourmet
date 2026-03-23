import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  const goTo = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #fffbe8 0%, #fef3c0 30%, #fde68a 60%, #fbbf24 100%)" }}
    >
      {/* Layered radial glow overlays */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 15% 40%, rgba(251,191,36,0.45) 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 85% 15%, rgba(245,158,11,0.3) 0%, transparent 50%),
            radial-gradient(ellipse 70% 60% at 55% 90%, rgba(252,211,77,0.4) 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 70% 50%, rgba(255,237,153,0.5) 0%, transparent 50%)
          `,
        }}
      />
      {/* Subtle noise / grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Decorative food truck image watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.06]">
        <img src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=60" alt="" aria-hidden="true" className="w-full h-full object-cover blur-sm" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8 text-xs font-bold tracking-[0.25em] uppercase"
            style={{ background: "#c9940a", color: "#fff8e8" }}
          >
            Gourmet Grilled Creations · Akron, Ohio
          </motion.div>

          <h1
            className="text-7xl sm:text-8xl md:text-[10rem] font-black leading-none mb-6"
            style={{
              fontFamily: "Georgia, serif",
              color: "#3d2200",
              textShadow: "0 4px 24px rgba(180,100,0,0.15)",
              letterSpacing: "-0.03em",
            }}
          >
            Chee<span style={{ color: "#c9940a" }}>zies</span>
          </h1>

          <p
            className="text-lg md:text-xl mb-12 max-w-lg mx-auto leading-relaxed"
            style={{ color: "rgba(80,40,0,0.75)" }}
          >
            Handcrafted gourmet grilled cheese sandwiches made fresh to order.
            Follow us to find out where we're rolling next.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://cheeziesgourmetohio.square.site/?location_id=LXWMCZH8PDQSN&fulfillment=PICKUP"
              target="_blank"
              rel="noopener noreferrer"
              className="px-9 py-4 rounded-full font-bold text-base transition-all duration-300 hover:scale-105 hover:shadow-xl select-none"
              style={{ background: "#c9940a", color: "#fff8e8", boxShadow: "0 8px 32px rgba(180,120,0,0.3)", textDecoration: "none", WebkitTapHighlightColor: "transparent" }}
            >
              Order Online
            </a>
            <button
              onClick={() => goTo("/Menu")}
              className="px-9 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:scale-105 select-none"
              style={{ border: "1.5px solid rgba(100,60,0,0.3)", color: "rgba(80,40,0,0.75)", background: "rgba(255,255,255,0.5)", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#c9940a"; e.currentTarget.style.color = "#c9940a"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(100,60,0,0.3)"; e.currentTarget.style.color = "rgba(80,40,0,0.75)"; }}
            >
              See Our Menu
            </button>
            <button
              onClick={() => goTo("/Catering")}
              className="px-9 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:scale-105 select-none"
              style={{ border: "1.5px solid rgba(100,60,0,0.2)", color: "rgba(80,40,0,0.5)", background: "transparent", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(100,60,0,0.3)"; e.currentTarget.style.color = "rgba(80,40,0,0.75)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(100,60,0,0.2)"; e.currentTarget.style.color = "rgba(80,40,0,0.5)"; }}
            >
              Book Catering
            </button>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="mt-20 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          <p className="text-xs tracking-widest uppercase" style={{ color: "rgba(180,120,0,0.5)" }}>Scroll</p>
          <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, rgba(180,120,0,0.4), transparent)" }} />
        </motion.div>
      </div>
    </section>
  );
}