import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { base44 } from "@/api/base44Client";

const PROMO_CODE = "CHEEZIE26";

export default function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const hasCookie = document.cookie.split(";").some(c => c.trim().startsWith("cheezies_popup="));
    if (!hasCookie) {
      const t = setTimeout(() => setOpen(true), 3500);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `cheezies_popup=1; expires=${expires}; path=/`;
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await base44.functions.invoke("sendNotification", {
        type: "newsletter_signup",
        data: { email, birthday, source: "popup" },
      });
      if (res.data?.error === "already_subscribed") {
        setError("This email is already subscribed.");
        setSubmitting(false);
        return;
      }
      setDone(true);
      setTimeout(() => dismiss(), 8000);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setSubmitting(false);
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
            className="fixed inset-0 z-[100]"
            style={{ background: "rgba(40,20,0,0.55)", backdropFilter: "blur(4px)" }}
            onClick={dismiss}
          />

          {/* Modal */}
          <motion.div
            key="popup"
            initial={{ opacity: 0, scale: 0.88, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 32 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            className="fixed z-[101] inset-0 flex items-center justify-center px-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-md rounded-3xl overflow-hidden pointer-events-auto"
              style={{ boxShadow: "0 32px 80px rgba(100,50,0,0.35)" }}
            >
              {/* Top gradient band */}
              <div
                className="relative px-8 pt-10 pb-6 text-center"
                style={{ background: "linear-gradient(135deg, #c9940a 0%, #e8b800 50%, #f5c518 100%)" }}
              >
                <button
                  onClick={dismiss}
                  className="absolute top-4 right-4 p-1.5 rounded-full transition-all hover:bg-white/20"
                  style={{ color: "#fff8e8" }}
                >
                  <X size={18} />
                </button>
                <div className="text-5xl mb-3">🧀</div>
                <h2
                  className="text-3xl font-black leading-tight"
                  style={{ fontFamily: "Georgia, serif", color: "#fff8e8", textShadow: "0 2px 8px rgba(100,50,0,0.3)" }}
                >
                  Get a Promo Code!
                </h2>
                <p className="text-sm mt-2 font-medium" style={{ color: "rgba(255,248,224,0.85)" }}>
                  Join our list with a new email & get an exclusive discount code.
                </p>
              </div>

              {/* Body */}
              <div className="px-8 py-7" style={{ background: "#fffbf0" }}>
                {done ? (
                  <div className="text-center py-4">
                    <div className="text-4xl mb-3">🎉</div>
                    <p className="font-bold text-lg" style={{ color: "#3d2200" }}>You're on the list!</p>
                    <p className="text-sm mt-1 mb-4" style={{ color: "rgba(80,45,0,0.6)" }}>Use this code on your next order:</p>
                    <div
                      className="py-3 px-6 text-2xl font-black tracking-widest text-center rounded-xl"
                      style={{ background: "#1a0800", color: "#e8b800", letterSpacing: "0.2em" }}
                    >
                      {PROMO_CODE}
                    </div>
                    <p className="text-xs mt-3" style={{ color: "rgba(80,45,0,0.5)" }}>Code also sent to your email!</p>
                  </div>
                ) : (
                  <>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-3">
                      <input
                        required
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setError(""); }}
                        style={{
                          background: "#fff",
                          border: "1.5px solid rgba(180,120,0,0.25)",
                          borderRadius: "999px",
                          color: "#3d2200",
                          padding: "13px 20px",
                          outline: "none",
                          fontSize: "15px",
                        }}
                        onFocus={e => (e.target.style.borderColor = "#c9940a")}
                        onBlur={e => (e.target.style.borderColor = "rgba(180,120,0,0.25)")}
                      />
                      <div>
                        <label className="text-xs font-bold tracking-widest uppercase mb-1 block" style={{ color: "rgba(80,45,0,0.5)" }}>
                          Birthday (optional — for birthday deals 🎂)
                        </label>
                        <input
                          type="date"
                          value={birthday}
                          onChange={e => setBirthday(e.target.value)}
                          style={{
                            background: "#fff",
                            border: "1.5px solid rgba(180,120,0,0.25)",
                            borderRadius: "999px",
                            color: "#3d2200",
                            padding: "10px 20px",
                            outline: "none",
                            fontSize: "14px",
                            width: "100%",
                          }}
                        />
                      </div>
                      {error && (
                        <p className="text-xs text-center font-bold" style={{ color: "#c0392b" }}>{error}</p>
                      )}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="py-3.5 rounded-full font-bold text-sm transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"
                        style={{ background: "#c9940a", color: "#fff8e8", boxShadow: "0 6px 24px rgba(180,120,0,0.3)" }}
                      >
                        {submitting ? "Checking…" : "🔔 Get My Promo Code"}
                      </button>
                    </form>

                    <button
                      onClick={dismiss}
                      className="w-full text-center text-xs mt-2 underline-offset-2 hover:underline"
                      style={{ color: "rgba(80,45,0,0.4)", background: "none", border: "none", cursor: "pointer" }}
                    >
                      No thanks, I'll miss the deals
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}