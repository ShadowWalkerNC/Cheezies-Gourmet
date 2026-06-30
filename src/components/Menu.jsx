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
  const [hovered, setHovered] = useState(false);
  const badgeColor = item.badge_color;

  if (item.image_url) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06 }}
        className="rounded-3xl overflow-hidden card-glow flex flex-col h-full"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "#fff",
          border: hovered
            ? "1.5px solid rgba(201,148,10,0.35)"
            : "1px solid rgba(180,120,0,0.14)",
          boxShadow: hovered
            ? "0 8px 28px rgba(180,120,0,0.16)"
            : "0 2px 12px rgba(180,120,0,0.07)",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          transition: "box-shadow 0.25s ease, border-color 0.25s ease, transform 0.25s ease",
        }}
      >
        <div className="relative h-44 overflow-hidden">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
            style={{
              transform: hovered ? "scale(1.05)" : "scale(1)",
              transition: "transform 0.6s ease",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: hovered
                ? "linear-gradient(to top, rgba(30,12,0,0.82) 0%, transparent 55%)"
                : "linear-gradient(to top, rgba(30,12,0,0.72) 0%, transparent 55%)",
              transition: "background 0.3s ease",
            }}
          />
          {item.badge && (
            <span
              className="absolute top-2.5 left-2.5 text-xs font-black px-2.5 py-1 rounded-full"
              style={{ background: badgeColor || "#c9940a", color: "#fff8e8", letterSpacing: "0.05em" }}
            >
              {item.badge}
            </span>
          )}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 flex items-end justify-between">
            <h4 className="font-black text-base text-white uppercase tracking-tight leading-tight">{item.name}</h4>
            <span
              className="font-black text-sm px-2.5 py-1 rounded-full shrink-0 ml-2"
              style={{
                background: hovered ? "rgba(201,148,10,0.9)" : "rgba(26,8,0,0.7)",
                color: "#fff8e8",
                transition: "background 0.25s ease",
              }}
            >
              {item.price_text || `$${item.price}`}
            </span>
          </div>
        </div>
        <div className="px-4 py-4 flex flex-col justify-between flex-1">
          <div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(61,34,0,0.7)" }}>
              {item.description}
            </p>
            {item.price_note && (
              <p className="text-xs mb-3 font-semibold" style={{ color: "rgba(61,34,0,0.4)" }}>
                {item.price_note}
              </p>
            )}
          </div>
          <a
            href="https://cheeziesgourmetohio.square.site/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full font-bold text-sm mt-auto"
            style={{
              background: "#c9940a",
              color: "#fff",
              textDecoration: "none",
              transition: "background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "#b8820a";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(201,148,10,0.4)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "#c9940a";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Order This →
          </a>
        </div>
      </motion.div>
    );
  }

  // Text-only card
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-2xl px-4 py-3 flex flex-col justify-between"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#fffbf2" : "#fff",
        border: hovered
          ? "1.5px solid rgba(201,148,10,0.25)"
          : "1px solid rgba(180,120,0,0.12)",
        boxShadow: hovered
          ? "0 4px 16px rgba(180,120,0,0.09)"
          : "none",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h4 className="font-bold text-sm" style={{ color: "#2a1200" }}>{item.name}</h4>
            {item.badge && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded" style={{ background: badgeColor, color: "#fff8e8" }}>
                {item.badge}
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(61,34,0,0.55)" }}>
            {item.description}
          </p>
          {item.price_note && (
            <p className="text-xs mb-3 font-semibold" style={{ color: "rgba(61,34,0,0.4)" }}>{item.price_note}</p>
          )}
          <a
            href="https://cheeziesgourmetohio.square.site/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-full font-bold text-sm"
            style={{
              background: "#c9940a",
              color: "#fff",
              textDecoration: "none",
              transition: "background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "#b8820a";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(201,148,10,0.4)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "#c9940a";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Order This →
          </a>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span
            className="font-black text-sm"
            style={{
              color: hovered ? "#b8820a" : "#c9940a",
              transition: "color 0.2s ease",
            }}
          >
            {item.price_text || `$${item.price}`}
          </span>
        </div>
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
        className="w-full flex items-center gap-4 mb-2 text-left group"
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        <h3
          className="text-2xl font-black"
          style={{
            fontFamily: "Georgia, serif",
            color: "#2a1200",
            transition: "color 0.2s ease",
          }}
        >
          {section}
        </h3>
        <div className="flex-1 h-px" style={{ background: "rgba(180,120,0,0.15)" }} />
        <ChevronDown
          size={18}
          style={{
            color: "#c9940a",
            flexShrink: 0,
            transition: "transform 0.3s",
            transform: open ? "rotate(180deg)" : "rotate(0)",
          }}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {note && (
              <div
                className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-2xl"
                style={{ background: "rgba(201,148,10,0.08)", border: "1.5px solid rgba(201,148,10,0.2)" }}
              >
                <span style={{ fontSize: "16px" }}>🧀</span>
                <p className="text-sm font-black uppercase tracking-wide" style={{ color: "#8a5a00" }}>{note}</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    <section id="menu" className="py-20 px-6 grain" style={{ background: "#fdf6e3", borderTop: "1px solid rgba(180,120,0,0.1)" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "#c9940a" }}>What We Serve</p>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: "Georgia, serif", color: "#2a1200" }}>Our Menu</h2>
          <div className="w-12 h-1 rounded-full mb-6" style={{ background: "#c9940a" }} />
          <div
            className="inline-flex items-start gap-3 px-4 py-3 rounded-2xl"
            style={{ background: "rgba(201,148,10,0.08)", border: "1px solid rgba(201,148,10,0.2)" }}
          >
            <span style={{ fontSize: "18px", lineHeight: 1 }}>⭐</span>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(61,34,0,0.7)" }}>
              <strong>Freshness Guarantee:</strong> Our Prime Rib beef is ground fresh and pressed every morning. Bacon Mac is crafted from scratch daily. <em>When we're out, we're out.</em>
            </p>
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
