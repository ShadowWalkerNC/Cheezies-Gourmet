import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const highlights = [
  { icon: "🎉", label: "Parties & Events", desc: "Up to 50 guests" },
  { icon: "🏢", label: "Corporate Catering", desc: "50–150 guests" },
  { icon: "💍", label: "Grand Events", desc: "150+ guests" },
];

export default function CateringPreview() {
  const navigate = useNavigate();

  return (
    <section
      className="py-16 px-6"
      style={{ background: "#fffbf0", borderTop: "1px solid rgba(180,120,0,0.1)" }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-8 gap-4 flex-wrap"
        >
          <div>
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-2" style={{ color: "#c9940a" }}>Bring Cheezies To You</p>
            <h2 className="text-3xl md:text-4xl font-black leading-tight" style={{ fontFamily: "Georgia, serif", color: "#2a1200" }}>
              Catering & Private Events
            </h2>
          </div>
          <button
            onClick={() => { navigate("/Catering"); window.scrollTo({ top: 0, behavior: "instant" }); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 hover:scale-105 select-none whitespace-nowrap"
            style={{ background: "#c9940a", color: "#fff8e8", border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(180,120,0,0.2)" }}
          >
            Get a Quote <ArrowRight size={15} />
          </button>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-4">
          {highlights.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl p-5 flex items-center gap-4"
              style={{ background: "#fff", border: "1px solid rgba(180,120,0,0.14)", boxShadow: "0 2px 10px rgba(180,120,0,0.06)" }}
            >
              <span className="text-3xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="font-black text-sm" style={{ color: "#2a1200" }}>{item.label}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(61,34,0,0.5)" }}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm mt-6 text-center"
          style={{ color: "rgba(61,34,0,0.55)" }}
        >
          We bring the grill, the cheese, and the good vibes right to your door. &nbsp;
          <button
            onClick={() => { navigate("/Catering"); window.scrollTo({ top: 0, behavior: "instant" }); }}
            className="font-bold underline underline-offset-2"
            style={{ color: "#c9940a", background: "none", border: "none", cursor: "pointer" }}
          >
            Request a quote →
          </button>
        </motion.p>
      </div>
    </section>
  );
}