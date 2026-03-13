import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { label: "About",    path: "/Home",     hash: "" },
  { label: "Menu",     path: "/Menu",     hash: "" },
  { label: "Catering", path: "/Catering", hash: "" },
  { label: "Contact",  path: "/Contact",  hash: "" },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLink = (path) => {
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(path);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    setMenuOpen(false);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        paddingTop: "var(--safe-top)",
        background: scrolled ? "rgba(255,248,220,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(180,120,0,0.15)" : "none",
        boxShadow: scrolled ? "0 4px 24px rgba(180,120,0,0.1)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <button
          onClick={() => handleLink("/Home")}
          className="flex items-center gap-2 select-none"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <span
            className="font-black text-2xl tracking-tight"
            style={{ color: "#c9940a", fontFamily: "Georgia, serif", letterSpacing: "-0.02em" }}
          >
            Cheezies
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {tabs.map(({ label, path }) => {
            const active = location.pathname === path;
            return (
              <button
                key={label}
                onClick={() => handleLink(path)}
                className="text-sm font-semibold tracking-widest uppercase transition-colors duration-200 select-none"
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: active ? "#c9940a" : "rgba(80,45,0,0.7)",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#c9940a")}
                onMouseLeave={e => (e.currentTarget.style.color = active ? "#c9940a" : "rgba(80,45,0,0.7)")}
              >
                {label}
              </button>
            );
          })}
          <a
            href="tel:3305108875"
            className="px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-200 hover:scale-105 select-none"
            style={{ background: "var(--color-gold)", color: "var(--color-bg)" }}
          >
            330-510-8875
          </a>
        </div>

        {/* Hamburger — hidden on md+ (tab bar handles mobile nav) */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 select-none"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}
        >
          <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} style={{ background: "#c9940a" }} />
          <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} style={{ background: "#c9940a" }} />
          <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} style={{ background: "#c9940a" }} />
        </button>
      </div>

      {menuOpen && (
        <div
          className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-4"
          style={{ background: "rgba(255,248,220,0.99)", borderTop: "1px solid rgba(180,120,0,0.1)" }}
        >
          {tabs.map(({ label, path }) => (
            <button
              key={label}
              onClick={() => handleLink(path)}
              className="text-lg font-semibold py-3 border-b text-left select-none w-full"
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: location.pathname === path ? "#c9940a" : "rgba(80,45,0,0.7)",
                borderBottom: "1px solid rgba(180,120,0,0.1)",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {label}
            </button>
          ))}
          <a
            href="tel:3305108875"
            className="mt-2 text-center px-5 py-3 rounded-full font-bold text-base select-none"
            style={{ background: "#c9940a", color: "#fff8e8" }}
            onClick={() => setMenuOpen(false)}
          >
            Call 330-510-8875
          </a>
        </div>
      )}
    </nav>
  );
}