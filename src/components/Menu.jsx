import { motion } from "framer-motion";

const menuSections = [
  {
    title: "Signature Grilled Cheese",
    emoji: "🧀",
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
    emoji: "✨",
    items: [
      { name: "Extra Cheese", desc: "Add any additional cheese to your sandwich", price: "$1.50" },
      { name: "Bacon", desc: "Crispy strips of smoked bacon", price: "$2" },
      { name: "Jalapeños", desc: "Fresh or pickled jalapeño slices", price: "$0.75" },
      { name: "Avocado", desc: "Freshly sliced creamy avocado", price: "$1.50" },
    ],
  },
  {
    title: "Sides & Drinks",
    emoji: "🥤",
    items: [
      { name: "Tomato Soup", desc: "Creamy house-made tomato bisque — perfect for dipping", price: "$4" },
      { name: "Kettle Chips", desc: "Crunchy seasoned kettle chips", price: "$2" },
      { name: "Bottled Water", desc: "Cold bottled water", price: "$1" },
      { name: "Lemonade", desc: "Fresh-squeezed house lemonade", price: "$3" },
    ],
  },
];

export default function Menu() {
  return (
    <section id="menu" className="py-24 px-6 bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#f5c518] text-xs font-bold tracking-[0.3em] uppercase mb-3">What We Serve</p>
          <h2 className="text-5xl md:text-6xl font-black text-white">Our Menu</h2>
          <div className="mt-4 w-16 h-1 bg-[#f5c518] mx-auto rounded-full" />
          <p className="text-white/40 mt-4 text-base max-w-md mx-auto">
            All sandwiches made fresh to order. Menu may vary by location.
          </p>
        </motion.div>

        {/* Menu sections */}
        {menuSections.map((section, si) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: si * 0.1 }}
            className="mb-14"
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span>{section.emoji}</span>
              <span>{section.title}</span>
              <span className="flex-1 h-px bg-white/10 ml-2" />
            </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.items.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-white/[0.03] border border-white/8 rounded-2xl p-5 hover:border-[#f5c518]/30 hover:bg-[#f5c518]/5 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-bold text-base group-hover:text-[#f5c518] transition-colors">
                      {item.name}
                    </h4>
                    <span className="text-[#f5c518] font-black text-base ml-4 shrink-0">{item.price}</span>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        <p className="text-center text-white/30 text-sm mt-4">
          * Prices and availability may vary. Follow us on social media for daily specials.
        </p>
      </div>
    </section>
  );
}