import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

// Fallback items shown if no DB items exist yet
const FALLBACK = [
  {
    id: "f1", name: "The Patty Meltdown", badge: "Best Seller", badge_color: "#c9940a",
    desc: "Smash-seared Prime Rib patty, caramelized onions, Swiss & American, sweet & tangy sauce on sourdough.",
    price: "$13",
    img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/dc51ccc91_generated_image.png",
  },
  {
    id: "f2", name: "The Mac Attack", badge: "Fan Favorite", badge_color: "#c9940a",
    desc: "Bacon Mac & Cheese stuffed between thick Texas Toast. The ultimate indulgence.",
    price: "$12",
    img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/1b08b210d_generated_image.png",
  },
  {
    id: "f3", name: "The Truffle Melt", badge: "Premium", badge_color: "#5a3e8a",
    desc: "Gruyere, sautéed mushrooms, fresh thyme & truffle oil drizzle on golden sourdough.",
    price: "$15",
    img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/ca1d3d7f8_generated_image.png",
  },
];

export default function FeaturedMenu() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    base44.entities.MenuItem.filter({ is_featured: true, is_active: true }, "sort_order", 6).then(data => {
      setItems(data.length > 0 ? data : FALLBACK);
    });
  }, []);

  const display = items.length > 0 ? items : FALLBACK;

  return (
    <section className="py-16 px-6" style={{ background: "#fdf6e3", borderTop: "1px solid rgba(180,120,0,0.1)" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-2" style={{ color: "#c9940a" }}>Fan Favorites</p>
          <h2 className="text-4xl md:text-5xl font-black mb-3" style={{ fontFamily: "Georgia, serif", color: "#2a1200" }}>
            Featured Items
          </h2>
          <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-lg"
            style={{ background: "rgba(201,148,10,0.13)", border: "1.5px solid rgba(201,148,10,0.35)" }}>
            <span>🧀</span>
            <p className="text-sm font-black uppercase tracking-wide" style={{ color: "#8a5a00" }}>
              All sandwiches include Chips and a Drink
            </p>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-5 mb-8">
          {display.map((item, i) => (
            <motion.div
              key={item.id || item.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl overflow-hidden"
              style={{ background: "#fff", border: "1px solid rgba(180,120,0,0.14)", boxShadow: "0 2px 12px rgba(180,120,0,0.07)" }}
            >
              <div className="relative h-40 overflow-hidden">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(30,12,0,0.65) 0%, transparent 55%)" }} />
                {item.badge && (
                  <span className="absolute top-2.5 left-2.5 text-xs font-black px-2.5 py-1 rounded"
                    style={{ background: item.badge_color || item.badgeColor || "#c9940a", color: "#fff8e8" }}>
                    {item.badge}
                  </span>
                )}
                <span className="absolute top-2.5 right-2.5 font-black text-sm px-2.5 py-1 rounded"
                  style={{ background: "rgba(42,18,0,0.75)", color: "#e8b800" }}>
                  {item.price}
                </span>
                <h4 className="absolute bottom-2.5 left-3 font-black text-sm text-white">{item.name}</h4>
              </div>
              <div className="px-4 py-3">
                <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(61,34,0,0.65)" }}>{item.desc}</p>
                <a href="https://cheeziesgourmetohio.square.site/" target="_blank" rel="noopener noreferrer"
                  className="inline-block px-4 py-1.5 rounded-lg font-bold text-xs transition-all duration-200 hover:scale-105"
                  style={{ background: "#c9940a", color: "#fff8e8", textDecoration: "none" }}>
                  Order This
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => { navigate("/Menu"); window.scrollTo({ top: 0, behavior: "instant" }); }}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105 select-none"
            style={{ background: "#2a1200", color: "#fff8e8", boxShadow: "0 4px 20px rgba(42,18,0,0.2)" }}
          >
            View Full Menu <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}