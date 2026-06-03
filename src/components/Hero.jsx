import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { usePageContent } from "@/hooks/usePageContent";
import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function Hero() {
  const navigate = useNavigate();
  const c = usePageContent().hero;
  const [specials, setSpecials] = useState([]);

  useEffect(() => {
    base44.entities.WeeklySpecial.filter({ is_active: true }, "sort_order", 3).then(data => {
      if (data.length > 0) setSpecials(data);
    });
  }, []);

  return (
    <section className="relative flex flex-col md:flex-row min-h-screen" style={{ background: "var(--color-surface)" }}>
      {/* Find Us Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-0 left-0 right-0 mx-auto mt-6 px-4 max-w-md"
        style={{ zIndex: 40 }}
      >
        <div className="px-5 py-4 rounded-2xl flex items-center justify-between" style={{ background: "#c9940a", border: "1.5px solid #1a0800" }}>
          <div>
            <p className="text-xs font-black tracking-[0.2em] uppercase mb-0.5" style={{ color: "#fff8e8" }}>📍 Live Truck Tracker</p>
            <p className="text-xs" style={{ color: "rgba(255,248,232,0.85)" }}>See where we are right now</p>
          </div>
          <button
            onClick={() => { navigate("/FindUs"); window.scrollTo({ top: 0, behavior: "instant" }); }}
            className="shrink-0 ml-3 font-black text-xs tracking-widest uppercase transition-opacity hover:opacity-85"
            style={{ background: "#fff8e8", color: "#1a0800", border: "none", cursor: "pointer", padding: "0.5rem 0.75rem", borderRadius: "0.5rem" }}
          >
            Find Us →
          </button>
        </div>
      </motion.div>

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
            {c.headline.split("\n").map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
            <span style={{ color: "#c9940a" }}>{c.headline_accent}</span>
          </h1>
          <p className="text-base mb-8 leading-relaxed" style={{ color: "rgba(61,34,0,0.65)", maxWidth: "420px" }}>
            {c.subline}
          </p>

          {/* Trust bar */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
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
              href={c.review_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold underline-offset-2 hover:underline"
              style={{ color: "#c9940a" }}
            >
              Leave a Review ↗
            </a>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={c.order_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 rounded-full font-black text-sm tracking-widest uppercase transition-opacity hover:opacity-85"
              style={{ background: "#c9940a", color: "#fff", textDecoration: "none", border: "2px solid #c9940a" }}
            >
              Order Online
            </a>
            <button
              onClick={() => { navigate("/Events"); window.scrollTo({ top: 0, behavior: "instant" }); }}
              className="px-7 py-3.5 rounded-full font-black text-sm tracking-widest uppercase transition-opacity hover:opacity-85"
              style={{ background: "#1a0800", color: "#fff8e8", border: "2px solid #1a0800", cursor: "pointer" }}
            >
              📅 Events
            </button>
            <button
              onClick={() => { navigate("/GiftCards"); window.scrollTo({ top: 0, behavior: "instant" }); }}
              className="px-7 py-3.5 rounded-full font-black text-sm tracking-widest uppercase transition-all hover:bg-amber-50"
              style={{ background: "transparent", border: "2px solid #c9940a", color: "#c9940a", cursor: "pointer" }}
            >
              🎁 Gift Cards
            </button>
          </div>

          {/* Weekly Specials strip */}
          {specials.length > 0 && (
            <div className="mt-8 flex flex-col gap-2">
              <p className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: "#c9940a" }}>🔥 This Week's Specials</p>
              <div className="flex flex-wrap gap-2">
                {specials.map(s => (
                  <div key={s.id} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold"
                    style={{ background: "rgba(201,148,10,0.12)", border: "1.5px solid rgba(201,148,10,0.35)", color: "#7a4f00" }}>
                    {s.is_top_seller && <span>⭐</span>}
                    <span style={{ color: "#2a1200" }}>{s.name}</span>
                    {s.price && <span style={{ color: "#c9940a" }}>{s.price}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Right — food image */}
      <motion.div
        className="flex-1 order-1 md:order-2 flex items-center justify-center px-8 py-12 md:py-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        style={{ background: "#fffbf0", minHeight: "40vw", borderRadius: "0 0 0 2rem" }}
      >
        <img
          src={c.image_url}
          alt="Cheezies gourmet grilled cheese"
          className="w-full max-w-lg object-contain"
          style={{ maxHeight: "60vh" }}
          fetchpriority="high"
          loading="eager"
        />
      </motion.div>
    </section>
  );
}