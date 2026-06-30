import { motion } from "framer-motion";
import { usePageContent } from "@/hooks/usePageContent";

export default function VideoShowcase() {
  const c = usePageContent().video;
  const fbUrl = c.video_url || 'https://www.facebook.com/cheeziesohio';

  return (
    <section className="py-12 px-6" style={{ background: "#1a0800" }}>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p className="text-xs font-black tracking-[0.25em] uppercase mb-2" style={{ color: "#c9940a" }}>
            {c.eyebrow}
          </p>
          <h2 className="font-black uppercase" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#fff8e8" }}>
            {c.headline}
          </h2>
          <p className="text-sm mt-3" style={{ color: "rgba(255,248,232,0.6)" }}>{c.caption}</p>
        </motion.div>

        <motion.a
          href={fbUrl}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.25rem",
            background: "rgba(201,148,10,0.08)",
            border: "2px solid rgba(201,148,10,0.3)",
            borderRadius: "1.25rem",
            padding: "3rem 2rem",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          {/* Play icon */}
          <div style={{
            width: 72, height: 72,
            background: "#c9940a",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 4 }}>
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>

          <div style={{ textAlign: "center" }}>
            <p className="font-black text-lg" style={{ color: "#fff8e8" }}>Watch on Facebook</p>
            <p className="text-sm mt-1" style={{ color: "rgba(255,248,232,0.55)" }}>See the truck, the food, the vibe \u2014 live on our Facebook page.</p>
          </div>

          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-sm uppercase tracking-widest" style={{ background: "#c9940a", color: "#fff8e8" }}>
            Watch Now \u2197
          </div>
        </motion.a>
      </div>
    </section>
  );
}
