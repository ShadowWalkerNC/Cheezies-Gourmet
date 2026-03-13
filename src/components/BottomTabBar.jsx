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
      navigate(path);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex items-stretch"
      style={{
        background: "rgba(255,248,220,0.97)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(180,120,0,0.12)",
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
            onClick={() => handleTab(path)}   // desktop fallback
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 relative select-none"
            style={{
              color: active ? "#c9940a" : "rgba(80,45,0,0.45)",
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
            <Icon
              size={active ? 22 : 20}
              strokeWidth={active ? 2.2 : 1.8}
            />
            <span
              className="text-[10px] font-bold tracking-wider uppercase"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              {label}
            </span>
            {active && (
              <span
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 28,
                  height: 3,
                  background: "#c9940a",
                  borderRadius: "3px 3px 0 0",
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}