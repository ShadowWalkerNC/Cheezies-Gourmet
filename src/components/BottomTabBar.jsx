import { useLocation, useNavigate } from "react-router-dom";
import { Home, UtensilsCrossed, CalendarHeart, Phone } from "lucide-react";

const tabs = [
  { label: "Home",     path: "/Home",       Icon: Home },
  { label: "Menu",     path: "/Menu",        Icon: UtensilsCrossed },
  { label: "Catering", path: "/Catering",    Icon: CalendarHeart },
  { label: "Contact",  path: "/Contact",     Icon: Phone },
];

export default function BottomTabBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleTab = (path) => {
    if (location.pathname === path) {
      // already on this tab → scroll to top
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
        background: "rgba(14,8,3,0.97)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(245,197,24,0.12)",
        paddingBottom: "var(--safe-bottom)",
      }}
    >
      {tabs.map(({ label, path, Icon }) => {
        const active = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => handleTab(path)}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 select-none transition-all duration-200 active:scale-95"
            style={{
              color: active ? "#f5c518" : "rgba(255,235,180,0.4)",
              background: "none",
              border: "none",
              outline: "none",
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
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
                className="absolute bottom-0 rounded-full"
                style={{
                  width: 28,
                  height: 3,
                  background: "#f5c518",
                  borderRadius: "3px 3px 0 0",
                  marginBottom: "var(--safe-bottom)",
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}