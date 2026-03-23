import { motion } from "framer-motion";

const steps = [
  {
    img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80",
    label: "Snap It",
    desc: "Take a drool-worthy photo of your Cheezies order.",
  },
  {
    img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&q=80",
    label: "Post It",
    desc: "Share it on Facebook or Instagram — public post.",
  },
  {
    img: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&q=80",
    label: "Tag Us",
    desc: "Tag @CheeziesGourmet and use #CheeziesGourmet.",
  },
];

export default function SocialDiscount() {
  return (
    <section
      className="py-20 px-6 relative overflow-hidden"
      style={{ background: "#2a1200" }}
    >
      {/* Background image overlay */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-[0.07]">
        <img
          src="https://images.unsplash.com/photo-1528736235302-52922df5c122?w=1200&q=60"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: "rgba(245,197,24,0.8)" }}>
            Share the Love
          </p>

          <div className="mb-4">
            <span
              className="text-[7rem] md:text-[9rem] font-black leading-none block"
              style={{
                fontFamily: "Georgia, serif",
                background: "linear-gradient(135deg, #f5c518 0%, #c9940a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 4px 16px rgba(245,197,24,0.25))",
              }}
            >
              10%
            </span>
            <p className="text-2xl md:text-3xl font-black -mt-4" style={{ color: "#fff8e8" }}>
              OFF Your Next Order
            </p>
          </div>

          <p className="text-base max-w-xl mx-auto leading-relaxed" style={{ color: "rgba(255,248,224,0.65)" }}>
            Show your love for Cheezies on social media and we'll reward you with a discount on your next visit.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl overflow-hidden flex flex-col"
              style={{
                background: "rgba(255,248,224,0.06)",
                border: "1px solid rgba(255,248,224,0.12)",
              }}
            >
              <div className="w-full h-36 overflow-hidden">
                <img src={step.img} alt={step.label} className="w-full h-full object-cover" />
              </div>
              <div className="p-5 flex flex-col items-center text-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black"
                  style={{ background: "#c9940a", color: "#fff8e8" }}
                >
                  {i + 1}
                </div>
                <h4 className="font-black text-lg" style={{ color: "#f5c518" }}>{step.label}</h4>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,248,224,0.6)" }}>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div
            className="inline-block rounded-2xl px-8 py-5 mb-6"
            style={{ background: "rgba(201,148,10,0.15)", border: "1px solid rgba(201,148,10,0.3)" }}
          >
            <p className="text-base font-bold mb-1" style={{ color: "#f5c518" }}>
              Then show us your post at the truck!
            </p>
            <p className="text-sm" style={{ color: "rgba(255,248,224,0.55)" }}>
              Find us at our next location — follow Facebook for daily spots.
            </p>
          </div>

          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="https://www.facebook.com/profile.php?id=61572987417963"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105"
              style={{ background: "#1877F2", color: "#ffffff", textDecoration: "none", boxShadow: "0 4px 20px rgba(24,119,242,0.3)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </a>
            <a
              href="https://www.instagram.com/cheeziesgourmet"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
                color: "#ffffff",
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(220,39,67,0.3)",
              }}
            >
              Instagram
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}