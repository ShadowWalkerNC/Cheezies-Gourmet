import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    label: "Snap It",
    desc: "Take a photo of your Cheezies order — the cheesier the better.",
  },
  {
    step: "02",
    label: "Post It",
    desc: "Share it publicly on Facebook or Instagram.",
  },
  {
    step: "03",
    label: "Tag Us",
    desc: "Tag @CheeziesGourmet and include #CheeziesGourmet in your post.",
  },
  {
    step: "04",
    label: "Collect",
    desc: "Show us your post at the truck and get 10% off your next order.",
  },
];

export default function SocialDiscount() {
  return (
    <section
      className="py-20 px-6"
      style={{ background: "#2a1200", borderTop: "1px solid rgba(255,248,232,0.06)" }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-5" style={{ color: "rgba(232,184,0,0.7)" }}>
            Share the Love
          </p>
          <h2
            className="font-black leading-none mb-3"
            style={{
              fontFamily: "Georgia, serif",
              color: "#fff8e8",
              fontSize: "clamp(3.5rem, 10vw, 6rem)",
            }}
          >
            <span style={{ color: "#e8b800" }}>10%</span> Off
          </h2>
          <p className="text-lg max-w-lg mx-auto leading-relaxed" style={{ color: "rgba(255,248,224,0.55)" }}>
            Post about your visit, tag us, and we'll reward you at the truck.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl p-6 flex flex-col"
              style={{
                background: "rgba(255,248,224,0.05)",
                border: "1px solid rgba(255,248,224,0.1)",
              }}
            >
              <p
                className="font-black mb-3"
                style={{ fontSize: "2.5rem", lineHeight: 1, color: "rgba(232,184,0,0.25)", fontFamily: "Georgia, serif" }}
              >
                {step.step}
              </p>
              <h4 className="font-black text-base mb-2" style={{ color: "#e8b800" }}>{step.label}</h4>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,248,224,0.55)" }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <div
            className="inline-flex flex-col sm:flex-row items-center gap-6 rounded-xl px-8 py-6"
            style={{ background: "rgba(201,148,10,0.12)", border: "1px solid rgba(201,148,10,0.25)" }}
          >
            <div className="text-left">
              <p className="font-black text-base mb-1" style={{ color: "#e8b800" }}>Ready to share?</p>
              <p className="text-sm" style={{ color: "rgba(255,248,224,0.5)" }}>Follow our social pages and tag us after your next visit.</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <a
                href="https://www.facebook.com/profile.php?id=61572987417963"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 hover:scale-105 select-none"
                style={{ background: "#1877F2", color: "#fff", textDecoration: "none" }}
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/cheeziesgourmet"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 hover:scale-105 select-none"
                style={{ background: "linear-gradient(135deg, #f09433, #dc2743, #bc1888)", color: "#fff", textDecoration: "none" }}
              >
                Instagram
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}