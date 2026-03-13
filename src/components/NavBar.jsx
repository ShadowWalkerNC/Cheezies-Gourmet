import { useState, useEffect } from "react";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = ["About", "Menu", "Catering", "Contact"];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(22,12,4,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(245,197,24,0.12)" : "none",
        boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.5)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <span
            className="font-black text-2xl tracking-tight"
            style={{ color: "#f5c518", fontFamily: "Georgia, serif", letterSpacing: "-0.02em" }}
          >
            Cheezies
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm font-semibold tracking-widest uppercase transition-colors duration-200"
              style={{ color: "rgba(255,235,180,0.7)" }}
              onMouseEnter={e => (e.target.style.color = "#f5c518")}
              onMouseLeave={e => (e.target.style.color = "rgba(255,235,180,0.7)")}
            >
              {link}
            </a>
          ))}
          <a
            href="tel:3305108875"
            className="px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-200 hover:scale-105"
            style={{ background: "#f5c518", color: "#1c1008" }}
          >
            330-510-8875
          </a>
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} style={{ background: "#f5c518" }} />
          <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} style={{ background: "#f5c518" }} />
          <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} style={{ background: "#f5c518" }} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-4" style={{ background: "rgba(22,12,4,0.98)" }}>
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-lg font-semibold py-3 border-b"
              style={{ color: "rgba(255,235,180,0.8)", borderColor: "rgba(245,197,24,0.15)" }}
              onClick={() => setMenuOpen(false)}
            >
              {link}
            </a>
          ))}
          <a
            href="tel:3305108875"
            className="mt-2 text-center px-5 py-3 rounded-full font-bold text-base"
            style={{ background: "#f5c518", color: "#1c1008" }}
            onClick={() => setMenuOpen(false)}
          >
            Call 330-510-8875
          </a>
        </div>
      )}
    </nav>
  );
}