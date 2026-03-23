import { motion } from "framer-motion";

export default function About() {
  return (
    <section
      id="about"
      className="py-16 px-6"
      style={{ background: "linear-gradient(180deg, #fff8e8 0%, #fdf3d8 100%)" }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row items-center gap-10"
        >
          {/* Image */}
          <div className="flex-shrink-0 w-full md:w-72 h-56 md:h-72 rounded-2xl overflow-hidden" style={{ border: "1.5px solid rgba(180,120,0,0.15)" }}>
            <img
              src="https://images.unsplash.com/photo-1528736235302-52922df5c122?w=600&q=80"
              alt="Gourmet grilled cheese sandwich freshly made"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text */}
          <div className="flex-1">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "#c9940a" }}>Our Story</p>
            <h2
              className="text-4xl md:text-5xl font-black mb-4 leading-tight"
              style={{ fontFamily: "Georgia, serif", color: "#3d2200" }}
            >
              More Than Just a<br />
              <span style={{ color: "#c9940a" }}>Grilled Cheese</span>
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: "rgba(80,45,0,0.65)" }}>
              Cheezies started with one idea — take the most comforting food in the world and make it extraordinary. We blend bold flavors, premium ingredients, and a whole lot of heart into every sandwich. Born and raised in Akron, Ohio, we're proud to serve our community fresh to order.
            </p>
            <div className="flex flex-wrap gap-4">
              {[["Made Fresh", "Every sandwich crafted to order."], ["Premium Cheese", "Quality cheeses, melted perfectly."], ["Akron Proud", "Serving our community with love."]].map(([title, desc]) => (
                <div key={title} className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(201,148,10,0.08)", border: "1px solid rgba(180,120,0,0.15)" }}>
                  <p className="font-black mb-0.5" style={{ color: "#3d2200" }}>{title}</p>
                  <p style={{ color: "rgba(80,45,0,0.6)" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}