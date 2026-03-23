import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const menuSections = [
  {
    title: "Signature Creations",
    icon: "🍔",
    note: "All sandwiches include Chips and a Drink.",
    items: [
      {
        name: "The Patty Meltdown",
        tag: "Our #1 Seller!",
        desc: "A legendary, caramelized Prime Rib smashburger seasoned with our signature Burger Seasoning blend. Topped with tender grilled onions, a melt of Swiss and American cheeses, and our signature Sweet and Tangy sauce on buttery, toasted Sourdough.",
        price: "$13",
        img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/dc51ccc91_generated_image.png",
      },
      {
        name: "The Smashburger",
        tag: "The Classic",
        desc: "Our signature Prime Rib & Fat blend, ground fresh and seared to perfection with Burger Seasoning. Served on a toasted Brioche roll with your choice of premium cheese and fresh toppings.",
        price: "$10 / $13",
        priceNote: "Single / Double",
        img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/abb4d4b5a_generated_image.png",
      },
      {
        name: "The Savory Italian",
        tag: "The Original",
        desc: "Authentic Soppressata salami paired with a gooey melt of Provolone and Mozzarella, finished with our house-made Sweet Balsamic Onions on golden Sourdough.",
        price: "$13",
        img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/d53f2a61f_generated_image.png",
      },
      {
        name: "The Traditional",
        desc: "The ultimate comfort classic: a thick layer of sharp Cheddar and American cheese melted to perfection between two slices of crusty, grilled Texas Toast.",
        price: "$10",
        img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/b1621f5b7_generated_image.png",
      },
    ],
  },
  {
    title: "Gourmet Melts",
    icon: "🔥",
    note: "Limited Daily Quantities | Includes Chips and a Drink.",
    items: [
      {
        name: "The Mac Attack",
        desc: "The ultimate indulgence. Our famous Five Star Bacon Mac & Cheese—loaded with three cheeses and crispy bacon—stuffed between two thick slices of Texas Toast. Double the bacon? Add 3 strips for $3!",
        price: "$12",
        img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/1b08b210d_generated_image.png",
      },
      {
        name: "The Spicy Melt",
        desc: "A fiery blend of Pepper Jack cheese, hand-sliced fresh jalapeños, and a drizzle of zesty Sriracha Aioli on toasted Sourdough.",
        price: "$13",
        img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/b55b7ae1c_generated_image.png",
      },
      {
        name: "BBQ Bacon Melt",
        desc: "Smoky Gouda and crispy, thick-cut bacon topped with caramelized onions and a bold BBQ drizzle on toasted Sourdough.",
        price: "$14",
        img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/3ce632781_generated_image.png",
      },
      {
        name: "The Southwest",
        desc: "Sharp Cheddar meets a vibrant blend of roasted peppers, fire-roasted corn, and our creamy, smoky Chipotle spread on grilled Texas Toast.",
        price: "$13",
        img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/5fdf67f91_generated_image.png",
      },
      {
        name: "The Truffle Melt",
        tag: "Premium",
        desc: "Sophisticated and earthy. Rich Gruyere cheese, sautéed mushrooms, and fresh thyme, finished with a decadent Truffle Oil drizzle on toasted Sourdough.",
        price: "$15",
        img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/ca1d3d7f8_generated_image.png",
      },
    ],
  },
  {
    title: "Sides & Refreshments",
    icon: "🍟",
    items: [
      {
        name: "Five Star Bacon Mac & Cheese",
        desc: "Our legendary, decadent masterpiece. We fold tender macaroni into a silky, triple-cheese blend of velvety Velveeta, sharp aged white cheddar, and smoky gouda. Made rich with heavy cream and butter, infused with savory bacon grease, and loaded with bacon bits. Finished with our \"Cheezies Secret Seasoning\" and umami-rich infusions. Sub for chips in a meal for +$2.",
        price: "$6 / $10",
        priceNote: "Regular 16oz / Large 32oz",
      },
      {
        name: "Beverages",
        desc: "Canned Soda | Bottled Water",
        price: "$2",
      },
    ],
  },
  {
    title: "Customize & Extras",
    icon: "🧀",
    note: "Make it your own with our curated selection of premium add-ons.",
    items: [
      {
        name: "The Mac-Topper",
        desc: "Add a golden scoop of Bacon Mac inside any sandwich.",
        price: "$3",
      },
      {
        name: "Bacon (3 pcs) or Baked Ham",
        desc: "Add crispy thick-cut bacon or savory baked ham to any sandwich.",
        price: "$3 each",
      },
      {
        name: "Signature Sauces",
        desc: "Sweet & Tangy · Sriracha Aioli · Chipotle Spread · BBQ Drizzle · Truffle Oil",
        price: "$0.50 each",
      },
    ],
  },
];

function ImageCard({ item, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      key={item.name}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.07 }}
      onClick={() => setExpanded(!expanded)}
      className="rounded-2xl overflow-hidden cursor-pointer select-none"
      style={{
        background: "#ffffff",
        border: expanded ? "1.5px solid rgba(201,148,10,0.5)" : "1px solid rgba(180,120,0,0.15)",
        boxShadow: expanded ? "0 16px 48px rgba(180,120,0,0.18)" : "0 2px 12px rgba(180,120,0,0.06)",
        transform: expanded ? "scale(1.01)" : "scale(1)",
        transition: "all 0.3s ease",
      }}
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={item.img}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700"
          style={{ transform: expanded ? "scale(1.08)" : "scale(1)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(40,20,0,0.7) 0%, transparent 55%)" }}
        />
        {item.tag && (
          <span
            className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: "#c9940a", color: "#fff8e8" }}
          >
            {item.tag}
          </span>
        )}
        {item.price && (
          <span
            className="absolute top-3 right-3 font-black text-base px-3 py-1 rounded-full"
            style={{ background: "#c9940a", color: "#fff8e8" }}
          >
            {item.price}
          </span>
        )}
        {/* Name on image */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
          <h4 className="font-black text-base text-white leading-tight drop-shadow">{item.name}</h4>
          {item.priceNote && <p className="text-xs text-white/70 mt-0.5">{item.priceNote}</p>}
        </div>
        {/* Tap hint */}
        <div
          className="absolute bottom-3 right-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "rgba(255,248,224,0.65)" }}
        >
          <ChevronDown size={12} style={{ transform: expanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s" }} />
          {expanded ? "Less" : "Details"}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4">
              <p className="text-sm leading-relaxed" style={{ color: "rgba(80,45,0,0.7)" }}>{item.desc}</p>
              <a
                href="https://cheeziesgourmetohio.square.site/?location_id=LXWMCZH8PDQSN&fulfillment=PICKUP"
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 mt-4 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-200 hover:scale-105"
                style={{ background: "#c9940a", color: "#fff8e8", textDecoration: "none" }}
              >
                🛒 Order This
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TextCard({ item, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      key={item.name}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      onClick={() => setExpanded(!expanded)}
      className="flex items-start justify-between gap-6 p-5 rounded-2xl cursor-pointer select-none transition-all duration-300"
      style={{
        background: expanded ? "#fffbf0" : "#ffffff",
        border: expanded ? "1.5px solid rgba(201,148,10,0.4)" : "1px solid rgba(180,120,0,0.15)",
        boxShadow: expanded ? "0 8px 24px rgba(180,120,0,0.1)" : "0 1px 8px rgba(180,120,0,0.05)",
      }}
    >
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h4 className="font-bold text-base" style={{ color: "#3d2200" }}>{item.name}</h4>
          {item.tag && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#c9940a", color: "#fff8e8" }}>
              {item.tag}
            </span>
          )}
        </div>
        <AnimatePresence>
          {expanded ? (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm leading-relaxed overflow-hidden"
              style={{ color: "rgba(80,45,0,0.65)" }}
            >
              {item.desc}
            </motion.p>
          ) : (
            <p className="text-sm leading-relaxed line-clamp-1" style={{ color: "rgba(80,45,0,0.5)" }}>
              {item.desc}
            </p>
          )}
        </AnimatePresence>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        {item.price && (
          <span className="text-lg font-black" style={{ color: "#c9940a" }}>{item.price}</span>
        )}
        {item.priceNote && <span className="text-xs" style={{ color: "rgba(80,45,0,0.45)" }}>{item.priceNote}</span>}
        <ChevronDown
          size={16}
          style={{
            color: "rgba(180,120,0,0.5)",
            transform: expanded ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 0.3s",
            marginTop: "4px",
          }}
        />
      </div>
    </motion.div>
  );
}

export default function Menu() {
  const [activeTab, setActiveTab] = useState(0);
  const section = menuSections[activeTab];

  return (
    <section
      id="menu"
      className="py-28 px-6"
      style={{ background: "linear-gradient(180deg, #faecc4 0%, #fdf3d8 100%)" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: "#f5c518" }}>
            What We Serve
          </p>
          <h2
            className="text-5xl md:text-6xl font-black mb-4"
            style={{ fontFamily: "Georgia, serif", color: "#3d2200" }}
          >
            Our Menu
          </h2>
          <div className="w-16 h-1 mx-auto rounded-full mb-5" style={{ background: "#c9940a" }} />

          <div
            className="inline-block px-5 py-3 rounded-2xl text-sm max-w-xl mx-auto"
            style={{ background: "rgba(201,148,10,0.1)", border: "1px solid rgba(180,120,0,0.2)", color: "rgba(80,45,0,0.85)" }}
          >
            ✨ <strong>Freshness Guarantee:</strong> Our Prime Rib beef is ground fresh and pressed every morning. Our Bacon Mac is crafted from scratch daily. <em>When we're out, we're out!</em>
          </div>
        </motion.div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-10 mt-10 gap-2 flex-wrap">
          {menuSections.map((s, i) => (
            <motion.button
              key={s.title}
              onClick={() => setActiveTab(i)}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 relative"
              style={
                activeTab === i
                  ? { background: "#c9940a", color: "#fff8e8", boxShadow: "0 4px 16px rgba(180,120,0,0.35)" }
                  : { background: "rgba(255,255,255,0.7)", border: "1px solid rgba(180,120,0,0.2)", color: "rgba(80,45,0,0.65)" }
              }
            >
              {s.icon} {s.title}
              {activeTab === i && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute inset-0 rounded-full -z-10"
                  style={{ background: "#c9940a" }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Section note */}
        {section.note && (
          <motion.p
            key={`note-${activeTab}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm mb-8 italic"
            style={{ color: "rgba(80,45,0,0.55)" }}
          >
            {section.note}
          </motion.p>
        )}

        {/* Tap-to-expand hint */}
        <motion.p
          key={`hint-${activeTab}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs mb-6 font-semibold tracking-wide"
          style={{ color: "rgba(180,120,0,0.5)" }}
        >
          👆 Tap any item to see the full description
        </motion.p>

        {/* Items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className={section.items.some(i => i.img) ? "grid sm:grid-cols-2 gap-5" : "space-y-4"}
          >
            {section.items.map((item, i) =>
              item.img ? (
                <ImageCard key={item.name} item={item} index={i} />
              ) : (
                <TextCard key={item.name} item={item} index={i} />
              )
            )}
          </motion.div>
        </AnimatePresence>

        <p className="text-center text-xs mt-10" style={{ color: "rgba(80,45,0,0.35)" }}>
          * Prices and availability may vary. Follow us on social media for daily specials.
        </p>
      </div>
    </section>
  );
}