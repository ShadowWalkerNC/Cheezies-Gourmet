import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useMenuItems } from "../hooks/useMenuItems";

const SECTION_NOTES = {
  "Signature Creations": "All sandwiches include Chips and a Drink.",
  "Gourmet Melts": "Limited Daily Quantities. Includes Chips and a Drink.",
  "Add-Ons & Extras": "Make it your own with our curated selection of premium add-ons.",
};

function MenuItemCard({ item, index }) {
  const [open, setOpen] = useState(false);
  const badgeColor = item.badge_color;

  if (item.image_url) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}
        onClick={() => setOpen(!open)}
        className="rounded-3xl overflow-hidden cursor-pointer select-none"
        style={{ background: "#fff", border: open ? "1.5px solid rgba(201,148,10,0.45)" : "1px solid rgba(180,120,0,0.14)", boxShadow: open ? "0 12px 40px rgba(180,120,0,0.18)" : "0 2px 12px rgba(180,120,0,0.07)", transition: "box-shadow 0.25s ease, border-color 0.25s ease" }}
      >
        <div className="relative h-44 overflow-hidden">
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform duration-700" style={{ transform: open ? "scale(1.07)" : "scale(1)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(30,12,0,0.72) 0%, transparent 55%)" }} />
          {item.badge && (
            <span className="absolute top-2.5 left-2.5 text-xs font-black px-2.5 py-1 rounded-full"
              style={{ background: badgeColor, color: "#fff8e8", letterSpacing: "0.05em" }}>
              {item.badge}
            </span>
          )}
          <span className="absolute top-2.5 right-2.5 font-black text-sm px-2.5 py-1 rounded-full"
            style={{ background: "rgba(42,18,0,0.75)", color: "#e8b800" }}>
            {item.price}
          </span>
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 flex items-end justify-between">
            <div>
              <h4 className="font-black text-sm text-white leading-tight">{item.name}</h4>
              {item.price_note && <p className="text-[11px] text-white/60 mt-0.5">{item.price_note}</p>}
            </div>
            <ChevronDown size={14} style={{ color: "rgba(255,248,232,0.6)", transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s", flexShrink: 0 }} />
          </div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
              <div className="px-4 py-4">
                <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(61,34,0,0.7)" }}>{item.description}</p>
                <a href="https://cheeziesgourmetohio.square.site/" target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="inline-flex items-center px-5 py-2.5 rounded-full font-bold text-sm transition-opacity duration-200 hover:opacity-85"
                  style={{ background: "#c9940a", color: "#fff8e8", textDecoration: "none", minHeight: "44px" }}>
                  Order This →
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.06 }}
      onClick={() => setOpen(!open)}
      className="flex items-start justify-between gap-4 p-4 rounded-3xl cursor-pointer select-none"
      style={{ background: open ? "#fffbf0" : "#fff", border: open ? "1.5px solid rgba(201,148,10,0.35)" : "1px solid rgba(180,120,0,0.13)", boxShadow: "0 1px 8px rgba(180,120,0,0.05)", transition: "background 0.2s ease, border-color 0.2s ease" }}
    >
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h4 className="font-bold text-sm" style={{ color: "#2a1200" }}>{item.name}</h4>
          {item.badge && <span className="text-[10px] font-black px-2 py-0.5 rounded" style={{ background: badgeColor, color: "#fff8e8" }}>{item.badge}</span>}
        </div>
        <p className={`text-sm leading-relaxed ${open ? "" : "line-clamp-1"}`} style={{ color: "rgba(61,34,0,0.55)" }}>{item.description}</p>
        {item.price_note && open && <p className="text-xs mt-1" style={{ color: "rgba(61,34,0,0.4)" }}>{item.price_note}</p>}
        {open && (
          <a href="https://cheeziesgourmetohio.square.site/" target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center mt-3 px-4 py-2 rounded-full font-bold text-xs transition-opacity hover:opacity-85"
            style={{ background: "#c9940a", color: "#fff8e8", textDecoration: "none" }}>
            Order This →
          </a>
        )}
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className="font-black text-base" style={{ color: "#c9940a" }}>{item.price}</span>
        <ChevronDown size={14} style={{ color: "rgba(180,120,0,0.4)", transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s" }} />
      </div>
    </motion.div>
  );
}

function SectionBlock({ section, items, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  const note = SECTION_NOTES[section];
  const hasImages = items.some(i => i.image_url);

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 mb-2 text-left"
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        <h3 className="text-2xl font-black" style={{ fontFamily: "Georgia, serif", color: "#2a1200" }}>{section}</h3>
        <div className="flex-1 h-px" style={{ background: "rgba(180,120,0,0.15)" }} />
        <ChevronDown size={18} style={{ color: "#c9940a", flexShrink: 0, transition: "transform 0.3s", transform: open ? "rotate(180deg)" : "rotate(0)" }} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            {note && (
              <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-2xl" style={{ background: "rgba(201,148,10,0.13)", border: "1.5px solid rgba(201,148,10,0.35)" }}>
                <span style={{ fontSize: "16px" }}>🧀</span>
                <p className="text-sm font-black uppercase tracking-wide" style={{ color: "#8a5a00" }}>{note}</p>
              </div>
            )}
            <div className={hasImages ? "grid sm:grid-cols-2 md:grid-cols-3 gap-4" : "space-y-3"}>
              {items.map((item, i) => (
                <MenuItemCard key={item.id} item={item} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Menu() {
  const { items, loading } = useMenuItems();

  const sections = items.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  const sectionOrder = ["Signature Creations", "Gourmet Melts", "Sides & Refreshments", "Add-Ons & Extras"];
  const orderedSections = [
    ...sectionOrder.filter(s => sections[s]),
    ...Object.keys(sections).filter(s => !sectionOrder.includes(s)),
  ];

  return (
    <section id="menu" className="py-20 px-6" style={{ background: "#fdf6e3", borderTop: "1px solid rgba(180,120,0,0.1)" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "#c9940a" }}>What We Serve</p>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: "Georgia, serif", color: "#2a1200" }}>Our Menu</h2>
          <div className="w-12 h-1 mx-auto rounded-full mb-6" style={{ background: "#c9940a" }} />
          <div className="inline-block px-5 py-3 rounded-xl text-sm max-w-xl mx-auto"
            style={{ background: "rgba(201,148,10,0.09)", border: "1px solid rgba(180,120,0,0.18)", color: "rgba(61,34,0,0.8)" }}>
            <strong>Freshness Guarantee:</strong> Our Prime Rib beef is ground fresh and pressed every morning. Bacon Mac is crafted from scratch daily. <em>When we're out, we're out.</em>
          </div>
        </motion.div>
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            {orderedSections.map((section, si) => (
              <SectionBlock key={section} section={section} items={sections[section]} defaultOpen={si === 0} />
            ))}
          </div>
        )}
        <p className="text-center text-xs mt-12" style={{ color: "rgba(61,34,0,0.3)" }}>
          Prices and availability may vary. Follow us on social media for daily specials.
        </p>
      </div>
    </section>
  );
}
