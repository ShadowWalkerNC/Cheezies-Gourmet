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
      style={{ background: "linear-gradient(135deg, #2a1505 0%, #1c1008 50%, #0e0803 100%)" }}
    >
      {/* Warm texture overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(180,90,20,0.3) 0%, transparent 60%),
                            radial-gradient(ellipse at 80% 20%, rgba(245,197,24,0.15) 0%, transparent 50%),
                            radial-gradient(ellipse at 60% 80%, rgba(160,60,10,0.2) 0%, transparent 50%)`,
        }}
      />

      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* Large decorative cheese emoji */}
      <div className="absolute text-[22rem] opacity-[0.04] select-none pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-sm">
        🧀
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
            style={{ background: "rgba(245,197,24,0.12)", border: "1px solid rgba(245,197,24,0.25)", color: "#f5c518" }}
          >
            ✦ Gourmet Grilled Creations · Akron, Ohio ✦
          </motion.div>

          <h1
            className="text-7xl sm:text-8xl md:text-[10rem] font-black leading-none mb-6"
            style={{
              fontFamily: "Georgia, serif",
              color: "#fff8e8",
              textShadow: "0 0 80px rgba(245,197,24,0.2), 0 4px 32px rgba(0,0,0,0.8)",
              letterSpacing: "-0.03em",
            }}
          >
            Chee<span style={{ color: "#f5c518" }}>zies</span>
          </h1>

          <p
            className="text-lg md:text-xl mb-12 max-w-lg mx-auto leading-relaxed"
            style={{ color: "rgba(255,235,180,0.55)" }}
          >
            Handcrafted gourmet grilled cheese sandwiches made fresh to order.
            Follow us to find out where we're rolling next.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://cheeziesgourmetohio.square.site/?location_id=LXWMCZH8PDQSN&fulfillment=PICKUP"
              target="_blank"
              rel="noopener noreferrer"
              className="px-9 py-4 rounded-full font-bold text-base transition-all duration-300 hover:scale-105 hover:shadow-2xl select-none"
              style={{ background: "#f5c518", color: "#1c1008", boxShadow: "0 8px 32px rgba(245,197,24,0.3)", textDecoration: "none", WebkitTapHighlightColor: "transparent" }}
            >
              🛒 Order Online
            </a>
            <button
              onClick={() => goTo("/Menu")}
              className="px-9 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:scale-105 select-none"
              style={{ border: "1.5px solid rgba(245,197,24,0.35)", color: "rgba(255,235,180,0.8)", background: "transparent", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#f5c518"; e.currentTarget.style.color = "#f5c518"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(245,197,24,0.35)"; e.currentTarget.style.color = "rgba(255,235,180,0.8)"; }}
            >
              See Our Menu
            </button>
            <button
              onClick={() => goTo("/Catering")}
              className="px-9 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:scale-105 select-none"
              style={{ border: "1.5px solid rgba(245,197,24,0.15)", color: "rgba(255,235,180,0.5)", background: "transparent", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(245,197,24,0.35)"; e.currentTarget.style.color = "rgba(255,235,180,0.8)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(245,197,24,0.15)"; e.currentTarget.style.color = "rgba(255,235,180,0.5)"; }}
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
          <p className="text-xs tracking-widest uppercase" style={{ color: "rgba(245,197,24,0.4)" }}>Scroll</p>
          <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, rgba(245,197,24,0.4), transparent)" }} />
        </motion.div>
      </div>
    </section>
  );
}