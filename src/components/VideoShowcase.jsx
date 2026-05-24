import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function VideoShowcase() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="py-12 px-6" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p className="text-xs font-black tracking-[0.25em] uppercase mb-2" style={{ color: "#c9940a" }}>
            See Us in Action
          </p>
          <h2 className="font-black uppercase" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#1a0800" }}>
            Truck Life
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative w-full overflow-hidden rounded-2xl cursor-pointer group"
          onClick={() => setPlaying(true)}
          style={{ background: "#000", border: "1.5px solid #e8e0d0", aspectRatio: "16/9" }}
        >
          {!playing ? (
            <>
              {/* Thumbnail overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "linear-gradient(135deg, rgba(26,8,0,0.3) 0%, rgba(26,8,0,0.1) 100%)",
                }}
              />
              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{
                    width: "80px",
                    height: "80px",
                    background: "#c9940a",
                    borderRadius: "50%",
                  }}
                >
                  <Play className="w-8 h-8 text-white fill-white" style={{ marginLeft: "4px" }} />
                </div>
              </div>
            </>
          ) : (
            <video
              src="https://media.base44.com/videos/public/69b410ceece31b13c728497b/c5456f871_attcS18sxOcDJnkfVPRyAR7tGR4pyDRz3M5DhjwM2A_b-I.mp4"
              controls
              autoPlay
              className="w-full h-full object-cover"
            />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-center mt-6"
        >
          <p className="text-sm leading-relaxed" style={{ color: "rgba(61,34,0,0.65)" }}>
            From prep to plate, watch the craft behind every gourmet creation. This is Cheezies.
          </p>
        </motion.div>
      </div>
    </section>
  );
}