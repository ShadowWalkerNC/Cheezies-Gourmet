import { useEffect, useState } from "react";

export default function StickyOrderButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => {
      // Show after scrolling ~80vh (past the hero)
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div
      className={`md:hidden fixed z-40 sticky-order-btn ${visible ? "visible" : ""}`}
      style={{
        bottom: `calc(var(--tab-bar-h) + 12px + var(--safe-bottom))`,
        left: "50%",
        transform: visible ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(120%)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <a
        href="https://cheeziesgourmetohio.square.site/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-7 py-3.5 rounded-full font-black text-sm tracking-widest uppercase select-none"
        style={{
          background: "#c9940a",
          color: "#fff",
          textDecoration: "none",
          boxShadow: "0 4px 24px rgba(201,148,10,0.45), 0 1px 4px rgba(0,0,0,0.15)",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        Order Now
      </a>
    </div>
  );
}
