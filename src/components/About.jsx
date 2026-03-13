import { motion } from "framer-motion";

const features = [
  { icon: "🔥", title: "Made Fresh", desc: "Every sandwich is crafted to order, never sitting under a heat lamp." },
  { icon: "🧀", title: "Premium Cheese", desc: "We source quality cheeses that melt beautifully and taste incredible." },
  { icon: "🚚", title: "Always Moving", desc: "Follow our socials to find where we're parked near you today." },
  { icon: "❤️", title: "Akron Proud", desc: "Born and raised in Akron, Ohio — serving our community with love." },
];

export default function About() {
  return (
    <section
      id="about"
      className="py-28 px-6"
      style={{ background: "linear-gradient(180deg, #fff8e8 0%, #fdf3d8 100%)" }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: "#c9940a" }}>
            Our Story
          </p>
          <h2
            className="text-5xl md:text-6xl font-black mb-6 leading-tight"
            style={{ fontFamily: "Georgia, serif", color: "#3d2200" }}
          >
            More Than Just a<br />
            <span style={{ color: "#c9940a" }}>Grilled Cheese</span>
          </h2>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: "rgba(80,45,0,0.65)" }}>
            Cheezies started with one idea: take the most comforting food in the world and make it extraordinary.
            We blend bold flavors, premium ingredients, and a whole lot of heart into every single sandwich.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="rounded-2xl p-7 text-center group cursor-default transition-all duration-300"
              style={{
                background: "#ffffff",
                border: "1px solid rgba(180,120,0,0.15)",
                boxShadow: "0 2px 16px rgba(180,120,0,0.06)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#fffbf0";
                e.currentTarget.style.borderColor = "rgba(180,120,0,0.35)";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(180,120,0,0.12)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.borderColor = "rgba(180,120,0,0.15)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 16px rgba(180,120,0,0.06)";
              }}
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-lg mb-2" style={{ color: "#3d2200" }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(80,45,0,0.6)" }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Divider quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-20 text-center"
        >
          <div className="inline-block px-8 py-6 rounded-2xl" style={{ background: "rgba(201,148,10,0.08)", border: "1px solid rgba(180,120,0,0.2)" }}>
            <p className="text-2xl md:text-3xl font-black italic" style={{ fontFamily: "Georgia, serif", color: "#c9940a" }}>
              "Life's too short for bad grilled cheese."
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}