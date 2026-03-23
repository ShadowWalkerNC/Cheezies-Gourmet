import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

// Pages that are in the main tab stack — no back button needed
const TAB_PATHS = ["/Home", "/Menu", "/Catering", "/Contact", "/Profile", "/"];

export default function AppHeader({ title, backPath }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isSubPage = !TAB_PATHS.includes(location.pathname);
  const showBack = isSubPage || !!backPath;

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/Home");
    }
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14"
      style={{
        paddingTop: "var(--safe-top)",
        background: "rgba(255,248,220,0.97)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(180,120,0,0.12)",
      }}
    >
      <div className="flex items-center gap-3 min-w-[40px]">
        {showBack && (
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-9 h-9 rounded-full active:scale-90 transition-transform select-none"
            style={{ background: "rgba(201,148,10,0.1)", WebkitTapHighlightColor: "transparent" }}
            aria-label="Go back"
          >
            <ArrowLeft size={18} style={{ color: "#c9940a" }} />
          </button>
        )}
      </div>

      {title && (
        <span
          className="absolute left-1/2 -translate-x-1/2 font-black text-base tracking-tight"
          style={{ color: "#3d2200", fontFamily: "Georgia, serif" }}
        >
          {title}
        </span>
      )}

      <button
        onClick={toggleTheme}
        className="flex items-center justify-center w-9 h-9 rounded-full active:scale-90 transition-transform select-none"
        style={{ background: "rgba(201,148,10,0.1)", WebkitTapHighlightColor: "transparent" }}
        aria-label="Toggle dark mode"
      >
        {theme === "dark" ? <Sun size={16} style={{ color: "#c9940a" }} /> : <Moon size={16} style={{ color: "#c9940a" }} />}
      </button>
    </div>
  );
}