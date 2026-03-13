import { motion } from "framer-motion";
import { useState } from "react";

const menuSections = [
  {
    title: "Signature Grilled Cheese",
    icon: "🧀",
    items: [
      { name: "The Classic", desc: "American cheese on toasted white bread, buttered to perfection", price: "$7" },
      { name: "The Spicy Melt", desc: "Pepper jack, jalapeños, sriracha aioli on sourdough", price: "$9" },
      { name: "The BBQ Bacon Melt", desc: "Smoked gouda, crispy bacon, caramelized onions, BBQ drizzle", price: "$10" },
      { name: "The Southwest", desc: "Cheddar, roasted peppers, corn, chipotle spread", price: "$9" },
      { name: "The Truffle Melt", desc: "Gruyère, mushrooms, truffle oil, fresh thyme", price: "$11" },
      { name: "The Mac Attack", desc: "Creamy mac & cheese stuffed between two slices of Texas toast", price: "$10" },
    ],
  },
  {
    title: "Add-Ons & Extras",
    icon: "✨",
    items: [
      { name: "Extra Cheese", desc: "Add any additional cheese to your sandwich", price: "$1.50" },
      { name: "Bacon", desc: "Crispy strips of smoked bacon", price: "$2" },
      { name: "Jalapeños", desc: "Fresh or pickled jalapeño slices", price: "$0.75" },
      { name: "Avocado", desc: "Freshly sliced creamy avocado", price: "$1.50" },
    ],
  },
  {
    title: "Sides & Drinks",
    icon: "🥤",
    items: [
      { name: "Tomato Soup", desc: "Creamy house-made tomato bisque — perfect for dipping", price: "$4" },
      { name: "Kettle Chips", desc: "Crunchy seasoned kettle chips", price: "$2" },
      { name: "Bottled Water", desc: "Cold bottled water", price: "$1" },
      { name: "Lemonade", desc: "Fresh-squeezed house lemonade", price: "$3" },
    ],
  },
];

export default function Menu() {
  const [activeTab, setActiveTab] = useState(0);
  const section = menuSections[activeTab];

  return (
    <section
      id="menu"
      className="py-28 px-6"
      style={{ background: "linear-gradient(180deg, #1a0e05 0%, #221205 100%)" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: "#f5c518" }}>
            What We Serve
          </p>
          <h2
            className="text-5xl md:text-6xl font-black mb-4"
            style={{ fontFamily: "Georgia, serif", color: "#fff8e8" }}
          >
            Our Menu
          </h2>
          <div className="w-16 h-1 mx-auto rounded-full" style={{ background: "#f5c518" }} />
          <p className="mt-5 text-base" style={{ color: "rgba(255,235,180,0.4)" }}>
            All sandwiches made fresh to order. Menu may vary by location — follow us for daily specials.
          </p>
        </motion.div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-12 gap-2 flex-wrap">
          {menuSections.map((s, i) => (
            <button
              key={s.title}
              onClick={() => setActiveTab(i)}
              className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300"
              style={
                activeTab === i
                  ? { background: "#f5c518", color: "#1c1008" }
                  : { background: "rgba(245,197,24,0.07)", border: "1px solid rgba(245,197,24,0.18)", color: "rgba(255,235,180,0.6)" }
              }
            >
              {s.icon} {s.title}
            </button>
          ))}
        </div>

        {/* Items */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-3"
        >
          {section.items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start justify-between gap-6 p-5 rounded-2xl transition-all duration-300 group"
              style={{ background: "rgba(255,200,60,0.04)", border: "1px solid rgba(245,197,24,0.08)" }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(245,197,24,0.08)";
                e.currentTarget.style.borderColor = "rgba(245,197,24,0.2)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,200,60,0.04)";
                e.currentTarget.style.borderColor = "rgba(245,197,24,0.08)";
              }}
            >
              <div className="flex-1">
                <h4 className="font-bold text-base mb-1" style={{ color: "#fff8e8" }}>{item.name}</h4>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,235,180,0.45)" }}>{item.desc}</p>
              </div>
              <span className="text-lg font-black shrink-0" style={{ color: "#f5c518" }}>{item.price}</span>
            </motion.div>
          ))}
        </motion.div>

        <p className="text-center text-xs mt-10" style={{ color: "rgba(255,235,180,0.25)" }}>
          * Prices and availability may vary. Follow us on social media for daily specials.
        </p>
      </div>
    </section>
  );
}