import { motion } from "framer-motion";
import { useState } from "react";

const menuSections = [
  {
    title: "Signature Creations",
    icon: "🍔",
    note: "All sandwiches include Bagged Chips and a Drink. Sub chips for a Regular Bacon Mac for +$2.",
    items: [
      {
        name: "The Patty Meltdown",
        tag: "Our #1 Seller!",
        desc: "A legendary, caramelized Prime Rib smashburger seasoned with our signature Burger Seasoning blend. Topped with savory grilled onions, a melt of Swiss and American cheeses, and our signature Sweet & Tangy sauce on buttery, toasted Sourdough.",
        price: "$13",
        img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/dc51ccc91_generated_image.png",
      },
      {
        name: "The Smashburger",
        tag: "The Classic",
        desc: "Our signature Prime Rib & Fat blend, ground fresh daily and seared to perfection with Burger Seasoning. Served on a toasted Brioche roll with your choice of premium cheeses and fresh toppings.",
        price: "$10 / $13",
        priceNote: "Single / Double",
        img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/abb4d4b5a_generated_image.png",
      },
      {
        name: "The Savory Italian",
        tag: "The Original",
        desc: "Authentic Soppressata (premium Italian dry-cured salami) paired with a gooey melt of smooth Provolone and Mozzarella for the ultimate cheese pull. Finished with our signature Sweet Balsamic Onions on golden Sourdough.",
        price: "$13",
        img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/d53f2a61f_generated_image.png",
      },
      {
        name: "The Traditional",
        desc: "The ultimate comfort classic: a thick layer of sharp aged white cheddar combined with classic American cheese, melted to perfection between two slices of crusty, grilled Texas Toast.",
        price: "$10",
        img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/b1621f5b7_generated_image.png",
      },
    ],
  },
  {
    title: "Gourmet Melts",
    icon: "🔥",
    note: "Limited Daily Quantities | Prepped fresh and grilled to order for maximum flavor. Includes Bagged Chips and a Drink.",
    items: [
      {
        name: "The Mac Attack",
        desc: "The ultimate indulgence. Our famous Five Star Bacon Mac & Cheese stuffed between two thick slices of Texas Toast. Double the bacon? Add 3 crispy, thick-cut strips for $3!",
        price: "$12",
        img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/1b08b210d_generated_image.png",
      },
      {
        name: "The Spicy Melt",
        desc: "A fiery blend featuring Pepper Jack as our spicy anchor, fresh hand-sliced jalapeños, and a zesty, creamy kick of Sriracha Aioli on toasted Sourdough.",
        price: "$13",
        img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/b55b7ae1c_generated_image.png",
      },
      {
        name: "BBQ Bacon Melt",
        desc: "Smoked Gouda adds a deep, smoky profile alongside crispy, thick-cut bacon. Topped with caramelized onions and a bold BBQ Drizzle on toasted Sourdough.",
        price: "$14",
        img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/3ce632781_generated_image.png",
      },
      {
        name: "The Southwest",
        desc: "Sharp aged white cheddar meets a vibrant blend of roasted peppers, fire-roasted corn, and our smoky, rich Chipotle spread on grilled Texas Toast.",
        price: "$13",
        img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/5fdf67f91_generated_image.png",
      },
      {
        name: "The Truffle Melt",
        tag: "Premium",
        desc: "Sophisticated and earthy. Premium Gruyere cheese, sautéed mushrooms finished with fresh thyme, and a decadent Truffle Oil drizzle on toasted Sourdough.",
        price: "$15",
        img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b410ceece31b13c728497b/ca1d3d7f8_generated_image.png",
      },
    ],
  },
  {
    title: "Legendary Sides",
    icon: "🍟",
    items: [
      {
        name: "Five Star Bacon Mac & Cheese — Regular (16oz)",
        desc: "Our legendary masterpiece. Tender macaroni in a silky triple-cheese blend of Velveeta, sharp aged white cheddar, and smoked gouda. Made rich with heavy cream and butter, infused with bacon grease, loaded with thick-cut bacon bits, and finished with our umami-rich Cheezies Secret Seasoning.",
        price: "$6",
      },
      {
        name: "Five Star Bacon Mac & Cheese — Large (32oz)",
        desc: "Our legendary masterpiece. Tender macaroni in a silky triple-cheese blend of Velveeta, sharp aged white cheddar, and smoked gouda. Made rich with heavy cream and butter, infused with bacon grease, loaded with thick-cut bacon bits, and finished with our umami-rich Cheezies Secret Seasoning.",
        price: "$10",
      },
    ],
  },
  {
    title: "Customize & Extras",
    icon: "🧀",
    note: "Make it your own with our curated selection of premium ingredients.",
    items: [
      {
        name: "The Mac-Topper",
        desc: "Add a golden scoop of our Five Star Bacon Mac inside any sandwich.",
        price: "$3",
      },
      {
        name: "Premium Proteins",
        desc: "Thick-Cut Crispy Bacon (3 pcs) | Savory Baked Ham",
        price: "$3 each",
      },
      {
        name: "Signature Sauces",
        desc: "Sweet & Tangy Sauce · Sriracha Aioli · Chipotle Spread · BBQ Drizzle · Truffle Oil",
        price: "$0.50 each",
      },
      {
        name: "Cheese Options",
        desc: "American · Sharp Aged White Cheddar · Swiss · Provolone · Mozzarella · Smoked Gouda · Pepper Jack · Gruyere",
        price: "",
      },
    ],
  },
  {
    title: "Refreshments",
    icon: "🥤",
    items: [
      {
        name: "Beverages",
        desc: "Canned Soda | Bottled Water",
        price: "$2",
      },
      {
        name: "🍋 Hand-Squeezed Lemonade",
        tag: "Coming Soon",
        desc: "Ask us about our Hand-Squeezed Lemonade trials — our upcoming fresh refreshment!",
        price: "",
      },
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
      style={{ background: "linear-gradient(180deg, #231500 0%, #1e1200 100%)" }}
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
            style={{ fontFamily: "Georgia, serif", color: "#fff8e8" }}
          >
            Our Menu
          </h2>
          <div className="w-16 h-1 mx-auto rounded-full mb-5" style={{ background: "#f5c518" }} />

          {/* Freshness Guarantee */}
          <div
            className="inline-block px-5 py-3 rounded-2xl text-sm max-w-xl mx-auto"
            style={{ background: "rgba(245,197,24,0.08)", border: "1px solid rgba(245,197,24,0.2)", color: "rgba(255,225,120,0.9)" }}
          >
            ✨ <strong>Freshness Guarantee:</strong> Our Prime Rib beef is ground fresh and pressed every morning. Our Bacon Mac is crafted from scratch daily. <em>When we're out, we're out!</em>
          </div>
        </motion.div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-10 mt-10 gap-2 flex-wrap">
          {menuSections.map((s, i) => (
            <button
              key={s.title}
              onClick={() => setActiveTab(i)}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300"
              style={
                activeTab === i
                  ? { background: "#f5c518", color: "#1c1008" }
                  : { background: "rgba(245,197,24,0.07)", border: "1px solid rgba(245,197,24,0.18)", color: "rgba(255,235,180,0.7)" }
              }
            >
              {s.icon} {s.title}
            </button>
          ))}
        </div>

        {/* Section note */}
        {section.note && (
          <p className="text-center text-sm mb-8 italic" style={{ color: "rgba(255,220,100,0.65)" }}>
            {section.note}
          </p>
        )}

        {/* Items */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className={section.items.some(i => i.img) ? "grid sm:grid-cols-2 gap-5" : "space-y-4"}
        >
          {section.items.map((item, i) => (
            item.img ? (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl overflow-hidden transition-all duration-300 group cursor-default"
                style={{ background: "rgba(255,200,60,0.04)", border: "1px solid rgba(245,197,24,0.1)" }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(245,197,24,0.3)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.5)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(245,197,24,0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(20,10,0,0.75) 0%, transparent 60%)" }} />
                  {item.tag && (
                    <span className="absolute top-3 left-3 text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#f5c518", color: "#1c1008" }}>
                      {item.tag}
                    </span>
                  )}
                  {item.price && (
                    <span className="absolute top-3 right-3 font-black text-base px-3 py-1 rounded-full" style={{ background: "#f5c518", color: "#1c1008" }}>
                      {item.price}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-base mb-1.5" style={{ color: "#fff8e8" }}>{item.name}</h4>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,225,140,0.7)" }}>{item.desc}</p>
                  {item.priceNote && <p className="text-xs mt-1" style={{ color: "rgba(255,220,100,0.5)" }}>{item.priceNote}</p>}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start justify-between gap-6 p-5 rounded-2xl transition-all duration-300"
                style={{ background: "rgba(255,200,60,0.04)", border: "1px solid rgba(245,197,24,0.1)" }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(245,197,24,0.08)";
                  e.currentTarget.style.borderColor = "rgba(245,197,24,0.25)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,200,60,0.04)";
                  e.currentTarget.style.borderColor = "rgba(245,197,24,0.1)";
                }}
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="font-bold text-base" style={{ color: "#fff8e8" }}>{item.name}</h4>
                    {item.tag && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#f5c518", color: "#1c1008" }}>
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,225,140,0.7)" }}>{item.desc}</p>
                </div>
                {item.price && (
                  <div className="text-right shrink-0">
                    <span className="text-lg font-black block" style={{ color: "#f5c518" }}>{item.price}</span>
                    {item.priceNote && <span className="text-xs" style={{ color: "rgba(255,220,100,0.5)" }}>{item.priceNote}</span>}
                  </div>
                )}
              </motion.div>
            )
          ))}
        </motion.div>

        <p className="text-center text-xs mt-10" style={{ color: "rgba(255,235,180,0.25)" }}>
          * Prices and availability may vary. Follow us on social media for daily specials.
        </p>
      </div>
    </section>
  );
}