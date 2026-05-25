import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { base44 } from "@/api/base44Client";

const statusConfig = {
  open:     { label: "Open Now", bg: "#dcfce7", color: "#15803d" },
  closed:   { label: "Closed",   bg: "#fee2e2", color: "#b91c1c" },
  en_route: { label: "En Route", bg: "#fef9c3", color: "#a16207" },
};

const tabs = [
  { label: "Home",       path: "/Home" },
  { label: "Menu",       path: "/Menu" },
  { label: "Catering",   path: "/Catering" },
  { label: "Gift Cards", path: "/GiftCards" },
  { label: "Find Us",    path: "/FindUs" },
  { label: "Contact",    path: "/ContactUs" },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [truckData, setTruckData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    base44.entities.TruckLocation.list("-updated_date", 1).then(records => {
      if (records.length > 0) setTruckData(records[0]);
    });
    const unsub = base44.entities.TruckLocation.subscribe(event => {
      if (event.type === "create" || event.type === "update") setTruckData(event.data);
    });
    return unsub;
  }, []);

  const truckStatus = truckData?.status || "closed";
  const sc = statusConfig[truckStatus] || statusConfig.closed;
  const hasLive = truckStatus !== "closed" && truckData?.latitude && truckData?.longitude;
  const truckAddress = hasLive ? truckData.address : (truckData?.home_address || "Akron, Ohio");

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
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
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
      style={{
        paddingTop: "var(--safe-top)",
        background: "#fff",
        borderBottom: "1.5px solid #e8e0d0",
        boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.07)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => handleLink("/Home")}
          className="select-none flex items-center gap-2.5"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <img
            src="https://media.base44.com/images/public/69b410ceece31b13c728497b/03ee6d0a3_generated_image.png"
            alt="Cheezies logo"
            className="h-9 w-9 object-contain"
          />
          <span
            className="font-black text-xl tracking-tight"
            style={{ color: "#1a0800", fontFamily: "Georgia, serif" }}
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
                className="text-xs font-black tracking-[0.15em] uppercase transition-colors duration-150 select-none"
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: active ? "#c9940a" : "#1a0800",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#c9940a")}
                onMouseLeave={e => (e.currentTarget.style.color = active ? "#c9940a" : "#1a0800")}
              >
                {label}
              </button>
            );
          })}

          <a
            href="tel:3305108875"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-xs tracking-widest uppercase transition-opacity hover:opacity-85 select-none"
            style={{ background: "#c9940a", color: "#fff", textDecoration: "none" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            330-510-8875
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 select-none"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}
        >
          <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} style={{ background: "#1a0800" }} />
          <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} style={{ background: "#1a0800" }} />
          <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} style={{ background: "#1a0800" }} />
        </button>
      </div>

      {/* Truck status banner — always visible, part of fixed nav */}
      <div
        className="px-4 py-2 flex items-center justify-between gap-3"
        style={{ background: "#1a0800", borderTop: "1px solid rgba(201,148,10,0.3)" }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: "#c9940a" }} />
          <span className="text-xs font-bold truncate" style={{ color: "#fff8e8" }}>{truckAddress}</span>
          <span className="shrink-0 text-xs font-black px-2 py-0.5 rounded" style={{ background: sc.bg, color: sc.color }}>
            {sc.label}
          </span>
        </div>
        <button
          onClick={() => { navigate("/FindUs"); window.scrollTo({ top: 0, behavior: "instant" }); }}
          className="shrink-0 text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-full transition-opacity hover:opacity-80"
          style={{ background: "#c9940a", color: "#fff", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}
        >
          Live Tracker →
        </button>
      </div>

      {menuOpen && (
        <div
          className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-0"
          style={{ background: "#fff", borderTop: "1px solid #e8e0d0" }}
        >
          {tabs.map(({ label, path }) => (
            <button
              key={label}
              onClick={() => handleLink(path)}
              className="text-sm font-black uppercase tracking-widest py-4 text-left select-none w-full"
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: location.pathname === path ? "#c9940a" : "#1a0800",
                borderBottom: "1px solid #f0e8d8",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {label}
            </button>
          ))}
          <a
            href="tel:3305108875"
            className="mt-4 text-center px-5 py-3.5 rounded-full font-black text-sm tracking-widest uppercase select-none"
            style={{ background: "#c9940a", color: "#fff", textDecoration: "none" }}
            onClick={() => setMenuOpen(false)}
          >
            Call 330-510-8875
          </a>
        </div>
      )}
    </nav>
  );
}