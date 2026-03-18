import { motion } from "framer-motion";
import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

export default function Newsletter() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.integrations.Core.SendEmail({
      to: "cheeziesgourmet@gmail.com",
      subject: "New Newsletter Subscriber",
      body: `New subscriber: ${email}`,
    });
    setSubmitting(false);
    setEmail("");
    setDone(true);
    toast({ title: "You're on the list! 🧀", description: "We'll let you know when we're rolling your way." });
  };

  return (
    <section
      className="py-24 px-6"
      style={{ background: "linear-gradient(180deg, #fdf3d8 0%, #faecc4 100%)" }}
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl overflow-hidden"
          style={{ border: "1.5px solid rgba(180,120,0,0.2)", boxShadow: "0 4px 40px rgba(180,120,0,0.08)" }}
        >
          {/* Top banner */}
          <div
            className="px-10 py-8 text-center"
            style={{ background: "linear-gradient(135deg, #c9940a 0%, #e8b800 60%, #f5c518 100%)" }}
          >
            <div className="text-4xl mb-3">📍</div>
            <h2
              className="text-4xl md:text-5xl font-black mb-2 leading-tight"
              style={{ fontFamily: "Georgia, serif", color: "#3d2200" }}
            >
              Know Where We Are
            </h2>
            <p className="text-sm font-semibold" style={{ color: "rgba(61,34,0,0.65)" }}>
              Daily locations, specials &amp; events — straight to your inbox.
            </p>
          </div>

          {/* Body */}
          <div className="px-10 py-8" style={{ background: "#fffbf0" }}>
            {done ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-3">🎉</div>
                <p className="text-xl font-black" style={{ color: "#3d2200" }}>You're on the list!</p>
                <p className="text-sm mt-2" style={{ color: "rgba(80,45,0,0.6)" }}>See you at the truck. No spam — just cheese.</p>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
                  <input
                    required
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="flex-1"
                    style={{
                      background: "#fff",
                      border: "1.5px solid rgba(180,120,0,0.2)",
                      borderRadius: "999px",
                      color: "#3d2200",
                      padding: "14px 22px",
                      outline: "none",
                      fontSize: "15px",
                    }}
                    onFocus={e => (e.target.style.borderColor = "#c9940a")}
                    onBlur={e => (e.target.style.borderColor = "rgba(180,120,0,0.2)")}
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-7 py-3.5 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105 disabled:opacity-60 whitespace-nowrap"
                    style={{ background: "#c9940a", color: "#fff8e8", boxShadow: "0 6px 24px rgba(180,120,0,0.25)" }}
                  >
                    {submitting ? "Subscribing…" : "🔔 Subscribe"}
                  </button>
                </form>

                <div className="flex items-center gap-3 mb-5 max-w-md mx-auto">
                  <div className="flex-1 h-px" style={{ background: "rgba(180,120,0,0.15)" }} />
                  <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(80,45,0,0.4)" }}>or follow</span>
                  <div className="flex-1 h-px" style={{ background: "rgba(180,120,0,0.15)" }} />
                </div>

                <div className="flex justify-center">
                  <a
                    href="https://www.facebook.com/profile.php?id=61572987417963"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 px-7 py-3.5 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105"
                    style={{ background: "#1877F2", color: "#ffffff", textDecoration: "none", boxShadow: "0 4px 20px rgba(24,119,242,0.25)" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    Follow us on Facebook
                  </a>
                </div>
              </>
            )}

            <p className="text-xs mt-6 text-center" style={{ color: "rgba(80,45,0,0.35)" }}>
              Unsubscribe anytime. We respect your inbox.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}