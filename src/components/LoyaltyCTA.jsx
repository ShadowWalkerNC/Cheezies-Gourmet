import { motion } from "framer-motion";

export default function LoyaltyCTA() {
  return (
    <section className="py-20 px-6" style={{ background: "#1a0800", borderTop: "1.5px solid rgba(224,171,32,0.15)" }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center gap-8"
        >
          {/* Left copy */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-xs font-black tracking-[0.25em] uppercase mb-2" style={{ color: "#c9940a" }}>
              Rewards Program
            </p>
            <h2 className="font-black uppercase mb-3" style={{ fontSize: "clamp(1.6rem,3.5vw,2.4rem)", color: "#fff8e8" }}>
              Earn Points.<br />Get Free Food.
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,248,232,0.55)" }}>
              Join the Cheezies loyalty program through Square — earn points on every order and redeem them for free menu items. The more you eat, the more you save.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <a
                href="https://squareup.com/loyalty/cheeziesohio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 rounded-full font-black text-xs tracking-widest uppercase transition-opacity hover:opacity-85"
                style={{ background: "#c9940a", color: "#fff", textDecoration: "none" }}
              >
                Join Loyalty Program →
              </a>
              <a
                href="https://www.facebook.com/cheeziesohio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 rounded-full font-black text-xs tracking-widest uppercase transition-opacity hover:opacity-75"
                style={{ background: "rgba(255,248,232,0.08)", color: "#fff8e8", textDecoration: "none", border: "1.5px solid rgba(255,248,232,0.2)" }}
              >
                Follow on Facebook →
              </a>
            </div>
          </div>

          {/* Right — perks */}
          <div className="flex-1 w-full grid grid-cols-1 gap-3">
            {[
              { icon: "🧀", title: "Earn on Every Order", desc: "Points added automatically when you pay with Square." },
              { icon: "🎁", title: "Redeem for Free Items", desc: "Use points toward menu items — no minimum." },
              { icon: "🎂", title: "Birthday Loyalty Bonus", desc: "Add your birthday when you sign up for exclusive birthday deals." },
              { icon: "📣", title: "Exclusive Facebook Deals", desc: "Follow us for flash specials and loyalty bonus days." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 px-5 py-4 rounded-2xl" style={{ background: "rgba(255,248,232,0.05)", border: "1px solid rgba(255,248,232,0.1)" }}>
                <span className="text-2xl shrink-0">{icon}</span>
                <div>
                  <p className="font-black text-sm mb-0.5" style={{ color: "#fff8e8" }}>{title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,248,232,0.45)" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}