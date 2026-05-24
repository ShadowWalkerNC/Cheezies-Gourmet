import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const FALLBACK = [
  { id: "f1", name: "The Patty Meltdown", badge: "Best Seller", badge_color: "#c9940a", desc: "Smash-seared Prime Rib patty, caramelized onions, Swiss & American, sweet & tangy sauce on sourdough.", price: "$13", img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/dc51ccc91_generated_image.png" },
  { id: "f2", name: "The Mac Attack", badge: "Fan Favorite", badge_color: "#c9940a", desc: "Bacon Mac & Cheese stuffed between thick Texas Toast. The ultimate indulgence.", price: "$12", img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/1b08b210d_generated_image.png" },
  { id: "f3", name: "The Truffle Melt", badge: "Premium", badge_color: "#5a3e8a", desc: "Gruyere, sautéed mushrooms, fresh thyme & truffle oil drizzle on golden sourdough.", price: "$15", img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/ca1d3d7f8_generated_image.png" },
];

export default function FeaturedMenu() {
  const navigate = useNavigate();
  const [display, setDisplay] = useState(FALLBACK);

  useEffect(() => {
    base44.entities.MenuItem.filter({ is_featured: true, is_active: true }, "sort_order", 6).then(data => {
      if (data.length > 0) setDisplay(data);
    });
  }, []);

  return (
    <section className="py-20 px-6" style={{ background: "var(--color-bg-deep)" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span
            className="inline-block text-xs font-black tracking-widest uppercase mb-3 px-4 py-1.5"
            style={{ background: "#fff", color: "#c9940a", borderRadius: "999px", border: "1.5px solid rgba(201,148,10,0.25)" }}
          >
            Fan Favorites
          </span>
          <h2 className="font-black uppercase" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", color: "#1a0800", letterSpacing: "-0.01em" }}>
            Featured Items
          </h2>
          <div
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5"
            style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 2px 12px rgba(201,148,10,0.1)", border: "1px solid rgba(201,148,10,0.2)" }}
          >
            <span>🧀</span>
            <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#7a4f00" }}>All sandwiches include Chips and a Drink</p>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {display.map((item, i) => (
            <motion.div
              key={item.id || item.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="overflow-hidden group cursor-pointer"
              style={{ background: "#fff", borderRadius: "20px", boxShadow: "0 4px 24px rgba(61,34,0,0.08)", border: "1px solid rgba(201,148,10,0.12)" }}
              whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(61,34,0,0.14)" }}
            >
              <div className="relative h-48 overflow-hidden" style={{ borderRadius: "20px 20px 0 0" }}>
                <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,8,0,0.8) 0%, transparent 55%)" }} />
                {item.badge && (
                  <span
                    className="absolute top-3 left-3 text-xs font-black px-3 py-1"
                    style={{ background: item.badge_color || "#c9940a", color: "#fff", borderRadius: "8px", letterSpacing: "0.05em" }}
                  >
                    {item.badge}
                  </span>
                )}
                <span
                  className="absolute top-3 right-3 font-black text-sm px-2.5 py-1"
                  style={{ background: "#1a0800", color: "#e8b800", borderRadius: "8px" }}
                >
                  {item.price}
                </span>
                <h4 className="absolute bottom-3 left-4 font-black text-base text-white uppercase tracking-tight">{item.name}</h4>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(61,34,0,0.65)", lineHeight: "1.6", minHeight: "40px" }}>{item.desc}</p>
                <a
                  href="https://cheeziesgourmetohio.square.site/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-5 py-2.5 font-black text-xs tracking-widest uppercase transition-all hover:opacity-90 hover:scale-105"
                  style={{ background: "#c9940a", color: "#fff", textDecoration: "none", borderRadius: "10px" }}
                >
                  Order This →
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => { navigate("/Menu"); window.scrollTo({ top: 0, behavior: "instant" }); }}
            className="inline-flex items-center gap-2 px-8 py-4 font-black text-xs tracking-widest uppercase transition-all hover:opacity-90 hover:scale-105"
            style={{ background: "#1a0800", color: "#fff", borderRadius: "14px", boxShadow: "0 4px 20px rgba(26,8,0,0.2)" }}
          >
            View Full Menu →
          </button>
        </div>
      </div>
    </section>
  );
}