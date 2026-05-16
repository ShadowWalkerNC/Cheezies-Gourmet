import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, UtensilsCrossed, CalendarHeart, Phone, UserCircle } from "lucide-react";

const tabs = [
  { label: "Home",     path: "/Home",      Icon: Home },
  { label: "Menu",     path: "/Menu",       Icon: UtensilsCrossed },
  { label: "Catering", path: "/Catering",   Icon: CalendarHeart },
  { label: "Contact",  path: "/Contact",    Icon: Phone },
  { label: "Profile",  path: "/Profile",    Icon: UserCircle },
];

export default function BottomTabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pressed, setPressed] = useState(null);

  const handleTab = (path) => {
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(path, { replace: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex items-stretch"
      style={{
        background: "#fff",
        borderTop: "1.5px solid #e8e0d0",
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
              color: active ? "#c9940a" : "rgba(26,8,0,0.35)",
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