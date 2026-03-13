import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

/**
 * Mobile-friendly bottom-sheet picker.
 * Falls back gracefully on desktop (still works, just looks like a modal).
 */
export default function BottomSheet({ open, onClose, title, options, value, onChange }) {
  const handleSelect = (opt) => {
    onChange(opt);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
              zIndex: 200,
            }}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 201,
              background: "#1a0e05",
              borderTop: "1px solid rgba(245,197,24,0.18)",
              borderRadius: "20px 20px 0 0",
              paddingBottom: "var(--safe-bottom)",
              maxHeight: "70vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Handle */}
            <div style={{ display: "flex", justifyContent: "center", paddingTop: 12, paddingBottom: 8 }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(245,197,24,0.25)" }} />
            </div>

            {/* Title */}
            <div style={{ padding: "4px 20px 12px", borderBottom: "1px solid rgba(245,197,24,0.08)" }}>
              <p style={{ color: "rgba(255,235,180,0.5)", fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                {title}
              </p>
            </div>

            {/* Options list */}
            <div style={{ overflowY: "auto", flex: 1, padding: "8px 0 12px" }}>
              {options.map((opt) => {
                const selected = value === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "14px 20px",
                      background: selected ? "rgba(245,197,24,0.08)" : "transparent",
                      border: "none",
                      cursor: "pointer",
                      WebkitTapHighlightColor: "transparent",
                      userSelect: "none",
                      WebkitUserSelect: "none",
                      transition: "background 0.1s",
                    }}
                    onTouchStart={e => (e.currentTarget.style.background = "rgba(245,197,24,0.12)")}
                    onTouchEnd={e => (e.currentTarget.style.background = selected ? "rgba(245,197,24,0.08)" : "transparent")}
                  >
                    <span style={{ color: selected ? "#f5c518" : "#fff8e8", fontSize: 16, fontWeight: selected ? 700 : 400 }}>
                      {opt}
                    </span>
                    {selected && <Check size={18} color="#f5c518" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}