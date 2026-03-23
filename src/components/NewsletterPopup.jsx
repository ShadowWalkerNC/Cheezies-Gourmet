import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

export default function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const dismissed = localStorage.getItem("cheezies_popup_dismissed");
    if (!dismissed) {
      const t = setTimeout(() => setOpen(true), 3500);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem("cheezies_popup_dismissed", "1");
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Optimistic: show success immediately
    setDone(true);
    toast({ title: "🧀 You're in!", description: "We'll let you know where we're rolling next." });
    setTimeout(() => dismiss(), 2200);
    // Background send
    base44.integrations.Core.SendEmail({
      to: "cheeziesgourmet@gmail.com",
      subject: "New Newsletter Subscriber",
      body: `New subscriber: ${email}`,
    });
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
                  Stay in the Melt!
                </h2>
                <p className="text-sm mt-2 font-medium" style={{ color: "rgba(255,248,224,0.85)" }}>
                  Get updates on where we're parked, daily specials & secret deals.
                </p>
              </div>

              {/* Body */}
              <div className="px-8 py-7" style={{ background: "#fffbf0" }}>
                {done ? (
                  <div className="text-center py-4">
                    <div className="text-4xl mb-3">🎉</div>
                    <p className="font-bold text-lg" style={{ color: "#3d2200" }}>You're on the list!</p>
                    <p className="text-sm mt-1" style={{ color: "rgba(80,45,0,0.6)" }}>See you at the truck!</p>
                  </div>
                ) : (
                  <>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-5">
                      <input
                        required
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
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
                      <button
                        type="submit"
                        disabled={submitting}
                        className="py-3.5 rounded-full font-bold text-sm transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"
                        style={{ background: "#c9940a", color: "#fff8e8", boxShadow: "0 6px 24px rgba(180,120,0,0.3)" }}
                      >
                        {submitting ? "Subscribing…" : "🔔 Subscribe for Updates"}
                      </button>
                    </form>

                    <div className="flex items-center gap-3 mb-5">
                      <div className="flex-1 h-px" style={{ background: "rgba(180,120,0,0.15)" }} />
                      <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(80,45,0,0.4)" }}>or</span>
                      <div className="flex-1 h-px" style={{ background: "rgba(180,120,0,0.15)" }} />
                    </div>

                    <a
                      href="https://www.facebook.com/profile.php?id=61572987417963"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 py-3.5 rounded-full font-bold text-sm transition-all duration-300 hover:scale-[1.02] hover:opacity-90 w-full"
                      style={{ background: "#1877F2", color: "#ffffff", textDecoration: "none", boxShadow: "0 4px 20px rgba(24,119,242,0.3)" }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      Follow on Facebook
                    </a>
                  </>
                )}

                <button
                  onClick={dismiss}
                  className="w-full text-center text-xs mt-4 underline-offset-2 hover:underline"
                  style={{ color: "rgba(80,45,0,0.4)", background: "none", border: "none", cursor: "pointer" }}
                >
                  No thanks, I'll miss the deals
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}