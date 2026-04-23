import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { base44 } from "@/api/base44Client";

const SECTIONS = ["Signature Creations", "Gourmet Melts", "Sides & Refreshments", "Add-Ons & Extras"];

const SECTION_NOTES = {
  "Signature Creations": "All sandwiches include Chips and a Drink.",
  "Gourmet Melts": "Limited Daily Quantities. Includes Chips and a Drink.",
  "Add-Ons & Extras": "Make it your own with our curated selection of premium add-ons.",
};

const FALLBACK_SECTIONS = [
  {
    title: "Signature Creations",
    note: "All sandwiches include Chips and a Drink.",
    items: [
      { name: "The Patty Meltdown", badge: "Best Seller", badge_color: "#c9940a", desc: "A legendary, caramelized Prime Rib smashburger seasoned with our signature Burger Seasoning blend. Topped with tender grilled onions, a melt of Swiss and American cheeses, and our signature Sweet and Tangy sauce on buttery, toasted Sourdough.", price: "$13", img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/dc51ccc91_generated_image.png" },
      { name: "The Smashburger", badge: "The Classic", badge_color: "#7a5c2e", desc: "Our signature Prime Rib & Fat blend, ground fresh and seared to perfection with Burger Seasoning. Served on a toasted Brioche roll with your choice of premium cheese and fresh toppings.", price: "$10 / $13", price_note: "Single / Double", img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/abb4d4b5a_generated_image.png" },
      { name: "The Savory Italian", badge: "Original", badge_color: "#7a5c2e", desc: "Authentic Soppressata salami paired with a gooey melt of Provolone and Mozzarella, finished with our house-made Sweet Balsamic Onions on golden Sourdough.", price: "$13", img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/d53f2a61f_generated_image.png" },
      { name: "The Traditional", desc: "The ultimate comfort classic: a thick layer of sharp Cheddar and American cheese melted to perfection between two slices of crusty, grilled Texas Toast.", price: "$10", img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/b1621f5b7_generated_image.png" },
    ],
  },
  {
    title: "Gourmet Melts",
    note: "Limited Daily Quantities. Includes Chips and a Drink.",
    items: [
      { name: "The Mac Attack", badge: "Fan Favorite", badge_color: "#c9940a", desc: "The ultimate indulgence. Our famous Five Star Bacon Mac & Cheese—loaded with three cheeses and crispy bacon—stuffed between two thick slices of Texas Toast. Double the bacon? Add 3 strips for $3!", price: "$12", img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/1b08b210d_generated_image.png" },
      { name: "The Spicy Melt", desc: "A fiery blend of Pepper Jack cheese, hand-sliced fresh jalapeños, and a drizzle of zesty Sriracha Aioli on toasted Sourdough.", price: "$13", img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/b55b7ae1c_generated_image.png" },
      { name: "BBQ Bacon Melt", badge: "New", badge_color: "#b84a1a", desc: "Smoky Gouda and crispy, thick-cut bacon topped with caramelized onions and a bold BBQ drizzle on toasted Sourdough.", price: "$14", img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/3ce632781_generated_image.png" },
      { name: "The Southwest", desc: "Sharp Cheddar meets a vibrant blend of roasted peppers, fire-roasted corn, and our creamy, smoky Chipotle spread on grilled Texas Toast.", price: "$13", img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/5fdf67f91_generated_image.png" },
      { name: "The Truffle Melt", badge: "Premium", badge_color: "#5a3e8a", desc: "Sophisticated and earthy. Rich Gruyere cheese, sautéed mushrooms, and fresh thyme, finished with a decadent Truffle Oil drizzle on toasted Sourdough.", price: "$15", img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/ca1d3d7f8_generated_image.png" },
    ],
  },
  {
    title: "Sides & Refreshments",
    items: [
      { name: "Five Star Bacon Mac & Cheese", badge: "Legendary", badge_color: "#c9940a", desc: 'Our legendary, decadent masterpiece. We fold tender macaroni into a silky, triple-cheese blend of velvety Velveeta, sharp aged white cheddar, and smoky gouda. Made rich with heavy cream and butter, infused with savory bacon grease, and loaded with bacon bits. Finished with our "Cheezies Secret Seasoning." Sub for chips in a meal for +$2.', price: "$6 / $10", price_note: "Regular 16oz / Large 32oz" },
      { name: "Beverages", desc: "Canned Soda or Bottled Water", price: "$2" },
    ],
  },
  {
    title: "Add-Ons & Extras",
    note: "Make it your own with our curated selection of premium add-ons.",
    items: [
      { name: "The Mac-Topper", desc: "Add a golden scoop of Bacon Mac inside any sandwich.", price: "$3" },
      { name: "Bacon (3 pcs) or Baked Ham", desc: "Add crispy thick-cut bacon or savory baked ham to any sandwich.", price: "$3 each" },
      { name: "Signature Sauces", desc: "Sweet & Tangy · Sriracha Aioli · Chipotle Spread · BBQ Drizzle · Truffle Oil", price: "$0.50 each" },
    ],
  },
];

function MenuItemCard({ item, index }) {
  const [open, setOpen] = useState(false);
  const badgeColor = item.badge_color || item.badgeColor;

  if (item.img) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}
        onClick={() => setOpen(!open)}
        className="rounded-2xl overflow-hidden cursor-pointer select-none"
        style={{ background: "#fff", border: open ? "1.5px solid rgba(201,148,10,0.45)" : "1px solid rgba(180,120,0,0.14)", boxShadow: open ? "0 12px 40px rgba(180,120,0,0.18)" : "0 2px 12px rgba(180,120,0,0.07)", transition: "box-shadow 0.25s ease, border-color 0.25s ease" }}
      >
        <div className="relative h-44 overflow-hidden">
          <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-700" style={{ transform: open ? "scale(1.07)" : "scale(1)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(30,12,0,0.72) 0%, transparent 55%)" }} />
          {item.badge && (
            <span className="absolute top-2.5 left-2.5 text-xs font-black px-2.5 py-1 rounded"
              style={{ background: badgeColor, color: "#fff8e8", letterSpacing: "0.05em" }}>
              {item.badge}
            </span>
          )}
          <span className="absolute top-2.5 right-2.5 font-black text-sm px-2.5 py-1 rounded"
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
                <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(61,34,0,0.7)" }}>{item.desc}</p>
                <a href="https://cheeziesgourmetohio.square.site/" target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="inline-flex items-center px-5 py-2.5 rounded-full font-bold text-sm transition-opacity duration-200 hover:opacity-85"
                  style={{ background: "#c9940a", color: "#fff8e8", textDecoration: "none", minHeight: "44px" }}>
                  Order This
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
      className="flex items-start justify-between gap-4 p-4 rounded-2xl cursor-pointer select-none"
      style={{ background: open ? "#fffbf0" : "#fff", border: open ? "1.5px solid rgba(201,148,10,0.35)" : "1px solid rgba(180,120,0,0.13)", boxShadow: "0 1px 8px rgba(180,120,0,0.05)", transition: "background 0.2s ease, border-color 0.2s ease" }}
    >
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h4 className="font-bold text-sm" style={{ color: "#2a1200" }}>{item.name}</h4>
          {item.badge && <span className="text-[10px] font-black px-2 py-0.5 rounded" style={{ background: badgeColor, color: "#fff8e8" }}>{item.badge}</span>}
        </div>
        <p className={`text-sm leading-relaxed ${open ? "" : "line-clamp-1"}`} style={{ color: "rgba(61,34,0,0.55)" }}>{item.desc}</p>
        {item.price_note && open && <p className="text-xs mt-1" style={{ color: "rgba(61,34,0,0.4)" }}>{item.price_note}</p>}
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className="font-black text-base" style={{ color: "#c9940a" }}>{item.price}</span>
        <ChevronDown size={14} style={{ color: "rgba(180,120,0,0.4)", transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s" }} />
      </div>
    </motion.div>
  );
}

export default function Menu() {
  const [dbItems, setDbItems] = useState(null);

  useEffect(() => {
    base44.entities.MenuItem.filter({ is_active: true }, "sort_order", 200).then(data => {
      setDbItems(data);
    });
  }, []);

  const sections = dbItems && dbItems.length > 0
    ? SECTIONS.map(title => ({
        title,
        note: SECTION_NOTES[title] || null,
        items: dbItems.filter(i => i.section === title),
      })).filter(s => s.items.length > 0)
    : FALLBACK_SECTIONS;

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

        <div className="space-y-14">
          {sections.map((section, si) => (
            <motion.div key={section.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: si * 0.08 }}>
              <div className="flex items-center gap-4 mb-2">
                <h3 className="text-2xl font-black" style={{ fontFamily: "Georgia, serif", color: "#2a1200" }}>{section.title}</h3>
                <div className="flex-1 h-px" style={{ background: "rgba(180,120,0,0.15)" }} />
              </div>
              {section.note && (
                <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-lg" style={{ background: "rgba(201,148,10,0.13)", border: "1.5px solid rgba(201,148,10,0.35)" }}>
                  <span style={{ fontSize: "16px" }}>🧀</span>
                  <p className="text-sm font-black uppercase tracking-wide" style={{ color: "#8a5a00" }}>{section.note}</p>
                </div>
              )}
              <div className={section.items.some(i => i.img) ? "grid sm:grid-cols-2 md:grid-cols-3 gap-4" : "space-y-3"}>
                {section.items.map((item, i) => (
                  <MenuItemCard key={item.id || item.name} item={item} index={i} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs mt-12" style={{ color: "rgba(61,34,0,0.3)" }}>
          Prices and availability may vary. Follow us on social media for daily specials.
        </p>
      </div>
    </section>
  );
}