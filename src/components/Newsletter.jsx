import { motion } from "framer-motion";
import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

const WHATSAPP_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function Newsletter() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const whatsappUrl = base44.agents.getWhatsAppConnectURL("cheezies_assistant");

  const handleSubmit = (e) => {
    e.preventDefault();
    setDone(true);
    const captured = email;
    setEmail("");
    toast({ title: "You're on the list!", description: "We'll let you know when we're rolling your way." });
    base44.integrations.Core.SendEmail({
      to: "cheeziesgourmet@gmail.com",
      subject: "New Newsletter Subscriber",
      body: `New subscriber: ${captured}`,
    });
  };

  return (
    <section
      className="py-20 px-6"
      style={{ background: "#fffbf0", borderTop: "1px solid rgba(180,120,0,0.1)" }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "#c9940a" }}>Stay Connected</p>
          <h2 className="text-4xl md:text-5xl font-black mb-3" style={{ fontFamily: "Georgia, serif", color: "#2a1200" }}>
            Know Where We Are
          </h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: "rgba(61,34,0,0.55)" }}>
            Never miss the truck — get daily location drops your way.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">

          {/* WhatsApp */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
            className="rounded-2xl p-7 flex flex-col"
            style={{ background: "#fff", border: "2px solid rgba(37,211,102,0.25)", boxShadow: "0 2px 20px rgba(37,211,102,0.08)" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
              style={{ background: "rgba(37,211,102,0.12)", color: "#25D366" }}
            >
              {WHATSAPP_ICON}
            </div>
            <h3 className="font-black text-lg mb-1" style={{ color: "#2a1200" }}>WhatsApp Updates</h3>
            <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: "rgba(61,34,0,0.55)" }}>
              Get real-time location alerts, specials, and menu drops sent directly to your WhatsApp — the fastest way to find us.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all duration-200 hover:scale-105 select-none"
              style={{ background: "#25D366", color: "#fff", textDecoration: "none", boxShadow: "0 4px 16px rgba(37,211,102,0.3)" }}
            >
              {WHATSAPP_ICON}
              Connect on WhatsApp
            </a>
            <p className="text-xs text-center mt-3" style={{ color: "rgba(61,34,0,0.3)" }}>Free · No spam · Opt out anytime</p>
          </motion.div>

          {/* Email Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl p-7 flex flex-col"
            style={{ background: "#fff", border: "1px solid rgba(180,120,0,0.15)", boxShadow: "0 2px 16px rgba(180,120,0,0.06)" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
              style={{ background: "rgba(201,148,10,0.1)", color: "#c9940a" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </div>
            <h3 className="font-black text-lg mb-1" style={{ color: "#2a1200" }}>Email Newsletter</h3>
            <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: "rgba(61,34,0,0.55)" }}>
              Weekly location roundups, seasonal specials, and new menu announcements straight to your inbox.
            </p>
            {done ? (
              <div className="py-2">
                <p className="font-black text-base" style={{ color: "#c9940a" }}>You're on the list!</p>
                <p className="text-sm mt-1" style={{ color: "rgba(61,34,0,0.45)" }}>No spam — just cheese.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <input
                  required
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full outline-none"
                  style={{
                    background: "#fffbf0",
                    border: "1.5px solid rgba(180,120,0,0.2)",
                    borderRadius: "10px",
                    color: "#2a1200",
                    padding: "11px 16px",
                    fontSize: "14px",
                  }}
                  onFocus={e => (e.target.style.borderColor = "#c9940a")}
                  onBlur={e => (e.target.style.borderColor = "rgba(180,120,0,0.2)")}
                />
                <button
                  type="submit"
                  className="py-3 rounded-lg font-bold text-sm transition-all duration-200 hover:scale-105"
                  style={{ background: "#c9940a", color: "#fff8e8" }}
                >
                  Subscribe
                </button>
              </form>
            )}
            <p className="text-xs mt-3" style={{ color: "rgba(61,34,0,0.3)" }}>Unsubscribe anytime.</p>
          </motion.div>

          {/* Social Follow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl p-7 flex flex-col"
            style={{ background: "#fff", border: "1px solid rgba(180,120,0,0.15)", boxShadow: "0 2px 16px rgba(180,120,0,0.06)" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
              style={{ background: "rgba(24,119,242,0.1)", color: "#1877F2" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </div>
            <h3 className="font-black text-lg mb-1" style={{ color: "#2a1200" }}>Follow for Daily Spots</h3>
            <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: "rgba(61,34,0,0.55)" }}>
              We post our exact location every morning on Facebook and Instagram. Follow us so you always know where to find the truck.
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="https://www.facebook.com/profile.php?id=61572987417963"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 hover:scale-105 select-none"
                style={{ background: "#1877F2", color: "#fff", textDecoration: "none" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </a>
              <a
                href="https://instagram.com/cheeziesohio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 hover:scale-105 select-none"
                style={{ background: "linear-gradient(135deg, #f09433, #dc2743, #bc1888)", color: "#fff", textDecoration: "none" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                Instagram
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}