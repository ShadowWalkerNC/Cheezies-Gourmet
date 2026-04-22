import { motion } from "framer-motion";

export default function About() {
  return (
    <section
      id="about"
      className="py-16 px-6"
      style={{ background: "#fffbf0", borderBottom: "1px solid rgba(180,120,0,0.1)" }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row items-center gap-12"
        >
          {/* Image */}
          <div className="flex-shrink-0 w-full md:w-80 h-60 md:h-80 rounded-xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1528736235302-52922df5c122?w=700&q=85"
              alt="Gourmet grilled cheese sandwich freshly made"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text */}
          <div className="flex-1">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "#c9940a" }}>Our Story</p>
            <h2
              className="text-4xl md:text-5xl font-black mb-5 leading-tight"
              style={{ fontFamily: "Georgia, serif", color: "#2a1200" }}
            >
              More Than Just a<br />
              <span style={{ color: "#c9940a" }}>Grilled Cheese</span>
            </h2>
            <p className="text-base leading-relaxed mb-7" style={{ color: "rgba(61,34,0,0.65)" }}>
              Cheezies started with one idea — take the most comforting food in the world and make it extraordinary. We blend bold flavors, premium ingredients, and a whole lot of heart into every sandwich. Born and raised in Akron, Ohio, proud to serve our community fresh to order.
            </p>
            <div className="flex flex-wrap gap-3 mb-7">
              {[["Made Fresh", "Crafted to order."], ["Premium Cheese", "Melted perfectly."], ["Akron Proud", "Community first."]].map(([title, desc]) => (
                <div key={title} className="rounded-lg px-4 py-3 text-sm" style={{ background: "rgba(201,148,10,0.08)", border: "1px solid rgba(180,120,0,0.18)" }}>
                  <p className="font-black mb-0.5" style={{ color: "#2a1200" }}>{title}</p>
                  <p className="text-xs" style={{ color: "rgba(61,34,0,0.55)" }}>{desc}</p>
                </div>
              ))}
            </div>
            <p className="text-xs mb-4" style={{ color: "rgba(61,34,0,0.45)" }}>
              <strong>April:</strong> Sat–Sun Noon–7 PM (Closed Mon–Fri)<br />
              <strong>May onward:</strong> Wed–Sun Noon–7 PM (Closed Mon–Tue)<br />
              Hours may vary based on event schedule. Follow us on Facebook for daily updates.
            </p>
          <div className="flex flex-wrap gap-3">
              <a
                href="https://cheeziesgourmetohio.square.site/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105 select-none"
                style={{ background: "#c9940a", color: "#fff8e8", textDecoration: "none", boxShadow: "0 4px 16px rgba(180,120,0,0.25)" }}
              >
                Order Online
              </a>
              <a
                href="tel:3305108875"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105 select-none"
                style={{ background: "rgba(201,148,10,0.08)", border: "1.5px solid rgba(180,120,0,0.2)", color: "#2a1200", textDecoration: "none" }}
              >
                330-510-8875
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}