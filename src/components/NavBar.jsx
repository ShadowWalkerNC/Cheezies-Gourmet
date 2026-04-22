import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";


const tabs = [
  { label: "About",    path: "/Home" },
  { label: "Menu",     path: "/Menu" },
  { label: "Catering", path: "/Catering" },
  { label: "Contact",  path: "/Contact" },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

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
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        paddingTop: "var(--safe-top)",
        background: scrolled ? "#fffbf0" : "rgba(255,251,240,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: scrolled ? "1px solid rgba(180,120,0,0.18)" : "1px solid rgba(180,120,0,0.1)",
        boxShadow: scrolled ? "0 2px 20px rgba(180,120,0,0.1)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo — Georgia serif, warm brown, consistent everywhere */}
        <button
          onClick={() => handleLink("/Home")}
          className="select-none flex items-center gap-2"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <img
            src="https://media.base44.com/images/public/69b410ceece31b13c728497b/03ee6d0a3_generated_image.png"
            alt="Cheezies logo"
            className="h-10 w-10 object-contain rounded"
          />
          <span
            className="font-black text-2xl"
            style={{ color: "#3d2200", fontFamily: "Georgia, serif", letterSpacing: "-0.03em" }}
          >
            Chee<span style={{ color: "#c9940a" }}>zies</span>
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {tabs.map(({ label, path }) => {
            const active = location.pathname === path;
            return (
              <button
                key={label}
                onClick={() => handleLink(path)}
                className="text-sm font-semibold tracking-wide transition-colors duration-200 select-none pb-0.5"
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: active ? "#c9940a" : "#3d2200",
                  borderBottom: active ? "2px solid #c9940a" : "2px solid transparent",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#c9940a")}
                onMouseLeave={e => (e.currentTarget.style.color = active ? "#c9940a" : "#3d2200")}
              >
                {label}
              </button>
            );
          })}

          <a
            href="tel:3305108875"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 hover:scale-105 select-none"
            style={{ background: "#c9940a", color: "#fff8e8", boxShadow: "0 2px 12px rgba(180,120,0,0.25)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            330-510-8875
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 select-none"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}
        >
          <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} style={{ background: "#3d2200" }} />
          <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} style={{ background: "#3d2200" }} />
          <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} style={{ background: "#3d2200" }} />
        </button>
      </div>

      {menuOpen && (
        <div
          className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-3"
          style={{ background: "#fffbf0", borderTop: "1px solid rgba(180,120,0,0.1)" }}
        >
          {tabs.map(({ label, path }) => (
            <button
              key={label}
              onClick={() => handleLink(path)}
              className="text-base font-semibold py-3 text-left select-none w-full"
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: location.pathname === path ? "#c9940a" : "#3d2200",
                borderBottom: "1px solid rgba(180,120,0,0.08)",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {label}
            </button>
          ))}
          <a
            href="tel:3305108875"
            className="mt-1 text-center px-5 py-3 rounded-lg font-bold text-base select-none"
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