import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";

export default function Newsletter() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const captured = email.trim().toLowerCase();
    setEmail("");

    const { error } = await supabase
      .from("newsletter_subscribers")
      .upsert(
        { email: captured, source: "newsletter_section", subscribed_at: new Date().toISOString() },
        { onConflict: "email", ignoreDuplicates: true }
      );

    setSubmitting(false);

    if (error) {
      toast({ title: "Something went wrong", description: "Please try again." });
    } else {
      setDone(true);
      toast({ title: "You're on the list!", description: "We'll let you know when we're rolling your way." });
    }
  };

  return (
    <section className="py-20 px-6" style={{ background: "#fff8e8", borderTop: "1px solid rgba(180,120,0,0.1)" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "#c9940a" }}>Stay Connected</p>
          <h2 className="text-4xl md:text-5xl font-black mb-3" style={{ fontFamily: "Georgia, serif", color: "#2a1200" }}>Know Where We Are</h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: "rgba(61,34,0,0.55)" }}>
            Follow us on Facebook or sign up for email updates — we’ll keep you in the loop.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0 }}
            className="rounded-2xl p-7 flex flex-col"
            style={{ background: "#fff", border: "2px solid rgba(201,148,10,0.4)", boxShadow: "0 4px 24px rgba(201,148,10,0.12)" }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 flex-shrink-0 text-2xl" style={{ background: "rgba(201,148,10,0.1)" }}>📍</div>
            <h3 className="font-black text-lg mb-1" style={{ color: "#2a1200" }}>Live Truck Tracker</h3>
            <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: "rgba(61,34,0,0.55)" }}>See exactly where the truck is right now on an interactive map — updated in real time by the crew.</p>
            <button onClick={() => { navigate("/FindUs"); window.scrollTo({ top: 0, behavior: "instant" }); }}
              className="flex items-center justify-center gap-2 py-3 rounded-full font-bold text-sm transition-opacity duration-200 hover:opacity-85 select-none"
              style={{ background: "#c9940a", color: "#fff8e8", border: "none", cursor: "pointer", minHeight: "44px" }}>
              Find the Truck →
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="rounded-2xl p-7 flex flex-col"
            style={{ background: "#fff", border: "1px solid rgba(180,120,0,0.15)", boxShadow: "0 2px 16px rgba(180,120,0,0.06)" }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 flex-shrink-0" style={{ background: "rgba(201,148,10,0.1)", color: "#c9940a" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
            <h3 className="font-black text-lg mb-1" style={{ color: "#2a1200" }}>Email Newsletter</h3>
            <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: "rgba(61,34,0,0.55)" }}>Weekly location roundups, seasonal specials, and new menu announcements straight to your inbox.</p>
            {done ? (
              <div className="py-2">
                <p className="font-black text-base" style={{ color: "#c9940a" }}>You're on the list!</p>
                <p className="text-sm mt-1" style={{ color: "rgba(61,34,0,0.45)" }}>No spam — just cheese.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <input
                  required type="email" placeholder="your@email.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full outline-none"
                  style={{ background: "#fffbf0", border: "1.5px solid rgba(180,120,0,0.2)", borderRadius: "10px", color: "#2a1200", padding: "11px 16px", fontSize: "14px" }}
                  onFocus={e => (e.target.style.borderColor = "#c9940a")}
                  onBlur={e => (e.target.style.borderColor = "rgba(180,120,0,0.2)")}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="py-3 rounded-full font-bold text-sm transition-opacity duration-200 hover:opacity-85 disabled:opacity-60"
                  style={{ background: "#c9940a", color: "#fff8e8", minHeight: "44px" }}
                >
                  {submitting ? "Subscribing…" : "Subscribe"}
                </button>
              </form>
            )}
            <p className="text-xs mt-3" style={{ color: "rgba(61,34,0,0.3)" }}>Unsubscribe anytime.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="rounded-2xl p-7 flex flex-col"
            style={{ background: "#fff", border: "1px solid rgba(180,120,0,0.15)", boxShadow: "0 2px 16px rgba(180,120,0,0.06)" }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 flex-shrink-0" style={{ background: "rgba(24,119,242,0.1)", color: "#1877F2" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </div>
            <h3 className="font-black text-lg mb-1" style={{ color: "#2a1200" }}>Follow for Daily Spots</h3>
            <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: "rgba(61,34,0,0.55)" }}>We post our exact location every morning on Facebook and Instagram. Follow us so you always know where to find the truck.</p>
            <div className="flex flex-col gap-2">
              <a href="https://www.facebook.com/cheeziesohio" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 rounded-full font-bold text-sm transition-opacity duration-200 hover:opacity-85 select-none"
                style={{ background: "#1877F2", color: "#fff", textDecoration: "none", minHeight: "44px" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </a>
              <a href="https://instagram.com/cheeziesohio" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 rounded-full font-bold text-sm transition-opacity duration-200 hover:opacity-85 select-none"
                style={{ background: "linear-gradient(135deg, #f09433, #dc2743, #bc1888)", color: "#fff", textDecoration: "none", minHeight: "44px" }}>
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
