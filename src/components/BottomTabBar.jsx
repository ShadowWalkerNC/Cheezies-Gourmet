import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, UtensilsCrossed, CalendarHeart, Phone, UserCircle } from "lucide-react";

const tabs = [
  { label: "Home",     path: "/Home",      Icon: Home },
  { label: "Menu",     path: "/Menu",       Icon: UtensilsCrossed },
  { label: "Catering", path: "/Catering",   Icon: CalendarHeart },
  { label: "Contact",  path: "/Contact",    Icon: Phone },
  { label: "Profile",  path: "/Profile",    Icon: UserCircle },
];

// Preserve scroll position per tab
const scrollPositions = {};

export default function BottomTabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pressed, setPressed] = useState(null);
  const prevPath = useRef(location.pathname);

  // Save scroll position when leaving a tab
  useEffect(() => {
    const prev = prevPath.current;
    const curr = location.pathname;
    if (prev !== curr) {
      scrollPositions[prev] = window.scrollY;
      prevPath.current = curr;
      // Restore scroll for the new tab, or go to top
      const saved = scrollPositions[curr];
      window.scrollTo({ top: saved ?? 0, behavior: "instant" });
    }
  }, [location.pathname]);

  const handleTab = (path) => {
    if (location.pathname === path) {
      // Tap active tab → scroll to top and clear saved position
      scrollPositions[path] = 0;
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Save current before navigating
      scrollPositions[location.pathname] = window.scrollY;
      navigate(path, { replace: true });
    }
  };

  return (
    <nav
      className="hidden"
      style={{
        background: "var(--tab-bg)",
        borderTop: "1.5px solid var(--tab-border)",
        paddingBottom: "var(--safe-bottom)",
      }}
    >
      {tabs.map(({ label, path, Icon }) => {
        const active = location.pathname === path;
        const isPressed = pressed === path;
        return (
          <button
            key={path}
            onTouchStart={() => setPressed(path)}
            onTouchEnd={() => { setPressed(null); handleTab(path); }}
            onTouchCancel={() => setPressed(null)}
            onClick={() => handleTab(path)}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 relative select-none"
            style={{
              color: active ? "#c9940a" : "var(--tab-inactive)",
              background: "none",
              border: "none",
              outline: "none",
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
              transform: isPressed ? "scale(0.88)" : "scale(1)",
              transition: "transform 0.1s ease, color 0.15s ease",
              opacity: isPressed ? 0.7 : 1,
            }}
          >
            <Icon size={active ? 22 : 20} strokeWidth={active ? 2.5 : 1.8} />
            <span
              className="text-[9px] font-black tracking-[0.1em] uppercase"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              {label}
            </span>
            {active && (
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 24,
                  height: 2,
                  background: "#c9940a",
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}