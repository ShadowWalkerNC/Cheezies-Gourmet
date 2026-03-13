import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

// Simple looping pull-apart using motion values
export default function GrilledCheesePullApart() {
  const progress = useMotionValue(0); // 0 = together, 1 = pulled apart
  const [hovered, setHovered] = useState(false);

  const topY = useTransform(progress, [0, 1], [0, -44]);
  const botY = useTransform(progress, [0, 1], [0, 44]);
  const [sep, setSep] = useState(0);

  useEffect(() => {
    progress.on("change", v => setSep(v * 88));
  }, []);

  useEffect(() => {
    let stopped = false;

    const loop = async () => {
      while (!stopped) {
        // Pull apart
        await animate(progress, 1, { duration: 1.5, ease: "easeInOut" });
        if (stopped) break;
        await new Promise(r => setTimeout(r, 700));
        if (stopped) break;
        // Snap back
        await animate(progress, 0, { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] });
        if (stopped) break;
        await new Promise(r => setTimeout(r, 1200));
      }
    };

    if (!hovered) {
      loop();
    } else {
      animate(progress, 1, { duration: 0.5, ease: "easeOut" });
    }

    return () => { stopped = true; };
  }, [hovered]);

  const strands = [
    { x1: 28, x2: 32, cp: 8 },
    { x1: 42, x2: 38, cp: -6 },
    { x1: 55, x2: 58, cp: 10 },
    { x1: 68, x2: 65, cp: -8 },
    { x1: 80, x2: 77, cp: 6 },
  ];

  const topY0 = 38;
  const botY0 = 38 + sep;

  return (
    <div
      className="relative select-none cursor-pointer mx-auto"
      style={{ width: 200, height: 220 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
    >
      <svg viewBox="0 0 110 220" width="200" height="220" style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}>

        {/* Drop shadow */}
        <ellipse cx="55" cy="205" rx="30" ry="5" fill="rgba(180,100,0,0.12)" />

        {/* Cheese strands */}
        {strands.map((s, i) => {
          const midY = (topY0 + botY0) / 2;
          const d = `M ${s.x1} ${topY0} C ${s.x1 + s.cp} ${midY - 5}, ${s.x2 - s.cp} ${midY + 5}, ${s.x2} ${botY0}`;
          const sw = Math.max(0.8, 3.5 - sep * 0.03);
          const opacity = Math.max(0.2, 1 - sep * 0.007);
          return (
            <path key={i} d={d} stroke="#f5c518" strokeWidth={sw} fill="none" strokeLinecap="round" opacity={opacity} />
          );
        })}

        {/* Bottom bread */}
        <motion.g style={{ y: botY }}>
          <rect x="8" y="105" width="94" height="6" rx="3" fill="#e8b800" />
          <rect x="10" y="109" width="90" height="28" rx="6" fill="#c97a2a" />
          <rect x="10" y="109" width="90" height="5" rx="3" fill="#a05c18" />
          <circle cx="28" cy="122" r="2" fill="rgba(180,100,0,0.25)" />
          <circle cx="55" cy="126" r="1.5" fill="rgba(180,100,0,0.2)" />
          <circle cx="80" cy="121" r="2" fill="rgba(180,100,0,0.25)" />
        </motion.g>

        {/* Top bread */}
        <motion.g style={{ y: topY }}>
          <rect x="8" y="68" width="94" height="6" rx="3" fill="#e8b800" />
          <rect x="10" y="64" width="90" height="28" rx="6" fill="#c97a2a" />
          <rect x="10" y="64" width="90" height="10" rx="6" fill="#d4893a" />
          <rect x="10" y="87" width="90" height="5" rx="3" fill="#a05c18" />
          <ellipse cx="30" cy="68" rx="3" ry="1.5" fill="rgba(255,240,200,0.6)" transform="rotate(-20 30 68)" />
          <ellipse cx="55" cy="66" rx="3" ry="1.5" fill="rgba(255,240,200,0.6)" transform="rotate(10 55 66)" />
          <ellipse cx="78" cy="68" rx="3" ry="1.5" fill="rgba(255,240,200,0.6)" transform="rotate(-15 78 68)" />
          <circle cx="28" cy="77" r="2" fill="rgba(180,100,0,0.2)" />
          <circle cx="55" cy="74" r="1.5" fill="rgba(180,100,0,0.15)" />
          <circle cx="80" cy="77" r="2" fill="rgba(180,100,0,0.2)" />
        </motion.g>
      </svg>

      <p
        className="absolute bottom-0 w-full text-center text-xs font-semibold tracking-widest uppercase"
        style={{ color: "rgba(180,120,0,0.45)" }}
      >
        {hovered ? "Mmm… 🧀" : "Hover me"}
      </p>
    </div>
  );
}