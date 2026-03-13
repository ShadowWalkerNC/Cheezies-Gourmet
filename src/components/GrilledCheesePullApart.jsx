import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useState } from "react";

const CHEESE_STRANDS = [
  { x1: 28, x2: 32, cpOffset: 8 },
  { x1: 42, x2: 38, cpOffset: -6 },
  { x1: 55, x2: 58, cpOffset: 10 },
  { x1: 68, x2: 65, cpOffset: -8 },
  { x1: 80, x2: 77, cpOffset: 6 },
];

function CheeseStrand({ x1, x2, cpOffset, separation }) {
  const topY = 38;
  const botY = 38 + separation;
  const midY = (topY + botY) / 2;
  const cp1X = x1 + cpOffset;
  const cp2X = x2 - cpOffset;

  const d = `M ${x1} ${topY} C ${cp1X} ${midY - 4}, ${cp2X} ${midY + 4}, ${x2} ${botY}`;

  // Strand thins out as it stretches
  const strokeWidth = Math.max(0.8, 3.5 - separation * 0.045);

  return (
    <path
      d={d}
      stroke="#f5c518"
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="round"
      opacity={Math.max(0.3, 1 - separation * 0.008)}
    />
  );
}

export default function GrilledCheesePullApart() {
  const [separation, setSeparation] = useState(0);
  const [hovered, setHovered] = useState(false);
  const topControls = useAnimationControls();
  const botControls = useAnimationControls();

  // Auto-loop animation
  useEffect(() => {
    if (hovered) return;

    let cancelled = false;
    let frame;

    const animate = async () => {
      // Pull apart
      await Promise.all([
        topControls.start({ y: -38, transition: { duration: 1.6, ease: "easeInOut" } }),
        botControls.start({ y: 38, transition: { duration: 1.6, ease: "easeInOut" } }),
      ]);
      if (cancelled) return;

      // Hold apart briefly
      await new Promise(r => setTimeout(r, 600));
      if (cancelled) return;

      // Snap back together
      await Promise.all([
        topControls.start({ y: 0, transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] } }),
        botControls.start({ y: 0, transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] } }),
      ]);
      if (cancelled) return;

      // Pause before repeating
      await new Promise(r => setTimeout(r, 1400));
      if (!cancelled) animate();
    };

    animate();
    return () => { cancelled = true; };
  }, [hovered, topControls, botControls]);

  // On hover: pull apart and hold
  useEffect(() => {
    if (hovered) {
      topControls.start({ y: -46, transition: { duration: 0.6, ease: "easeOut" } });
      botControls.start({ y: 46, transition: { duration: 0.6, ease: "easeOut" } });
    }
  }, [hovered]);

  return (
    <motion.div
      className="relative select-none cursor-pointer mx-auto"
      style={{ width: 200, height: 200 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onTapStart={() => setHovered(true)}
      onTap={() => setHovered(false)}
    >
      <svg
        viewBox="0 0 110 200"
        width="200"
        height="200"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* Shadow */}
        <ellipse cx="55" cy="185" rx="32" ry="5" fill="rgba(180,100,0,0.12)" />

        {/* Bottom bread half */}
        <motion.g
          animate={botControls}
          initial={{ y: 0 }}
          onUpdate={({ y }) => setSeparation(Math.abs(y ?? 0) * 2)}
        >
          {/* Bread body */}
          <rect x="10" y="108" width="90" height="28" rx="6" fill="#c97a2a" />
          {/* Toasted top edge */}
          <rect x="10" y="108" width="90" height="5" rx="3" fill="#a05c18" />
          {/* Bread texture dots */}
          <circle cx="28" cy="120" r="2" fill="rgba(180,100,0,0.25)" />
          <circle cx="55" cy="124" r="1.5" fill="rgba(180,100,0,0.2)" />
          <circle cx="80" cy="119" r="2" fill="rgba(180,100,0,0.25)" />
          {/* Cheese layer peeking out */}
          <rect x="8" y="104" width="94" height="7" rx="3" fill="#f5c518" />
          <rect x="6" y="104" width="98" height="4" rx="2" fill="#e8b800" />
        </motion.g>

        {/* Cheese strands — rendered between bread halves */}
        <g>
          {CHEESE_STRANDS.map((strand, i) => (
            <CheeseStrand key={i} {...strand} separation={separation} />
          ))}
        </g>

        {/* Top bread half */}
        <motion.g animate={topControls} initial={{ y: 0 }}>
          {/* Cheese layer on bottom of top bread */}
          <rect x="6" y="68" width="98" height="5" rx="2" fill="#e8b800" />
          <rect x="8" y="71" width="94" height="5" rx="2" fill="#f5c518" />
          {/* Bread body */}
          <rect x="10" y="64" width="90" height="28" rx="6" fill="#c97a2a" />
          {/* Toasted bottom edge */}
          <rect x="10" y="87" width="90" height="5" rx="3" fill="#a05c18" />
          {/* Rounded top crust */}
          <rect x="10" y="64" width="90" height="10" rx="6" fill="#d4893a" />
          {/* Sesame seeds */}
          <ellipse cx="30" cy="68" rx="3" ry="1.5" fill="rgba(255,240,200,0.6)" transform="rotate(-20 30 68)" />
          <ellipse cx="55" cy="66" rx="3" ry="1.5" fill="rgba(255,240,200,0.6)" transform="rotate(10 55 66)" />
          <ellipse cx="78" cy="68" rx="3" ry="1.5" fill="rgba(255,240,200,0.6)" transform="rotate(-15 78 68)" />
          {/* Bread texture */}
          <circle cx="28" cy="77" r="2" fill="rgba(180,100,0,0.2)" />
          <circle cx="55" cy="74" r="1.5" fill="rgba(180,100,0,0.15)" />
          <circle cx="80" cy="77" r="2" fill="rgba(180,100,0,0.2)" />
        </motion.g>
      </svg>

      {/* Hint label */}
      <p
        className="absolute bottom-0 w-full text-center text-xs font-semibold tracking-widest uppercase"
        style={{ color: "rgba(180,120,0,0.45)" }}
      >
        {hovered ? "Mmm…" : "Hover me"}
      </p>
    </motion.div>
  );
}