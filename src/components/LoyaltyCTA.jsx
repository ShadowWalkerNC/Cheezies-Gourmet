import { motion } from "framer-motion";
import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

export default function LoyaltyCTA() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await base44.functions.invoke("sendNotification", {
        type: "loyalty_signup",
        data: { email },
      });
      setSubmitted(true);
      setEmail("");
      toast({ title: "Welcome to the crew!", description: "We'll enroll you in Square Loyalty." });
    } catch (err) {
      toast({ title: "Something went wrong", description: "Please try again or DM us on Instagram." });
    }
    setLoading(false);
  };

  return (
    <section className="py-14 px-6" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center gap-8"
        >
          {/* Left copy */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-xs font-black tracking-[0.25em] uppercase mb-2" style={{ color: "#c9940a" }}>
              Rewards Program
            </p>
            <h2 className="font-black uppercase mb-3" style={{ fontSize: "clamp(1.6rem,3.5vw,2.4rem)", color: "#1a0800" }}>
              Earn Points.<br />Get Free Food.
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(61,34,0,0.55)" }}>
              Join the Cheezies loyalty program through Square — earn points on every order and redeem them for free menu items. The more you eat, the more you save.
            </p>
            {submitted ? (
              <div className="p-4 rounded-2xl" style={{ background: "#dcfce7", border: "1.5px solid #86efac" }}>
                <p className="font-black text-sm" style={{ color: "#15803d" }}>You're on the list! 🧀</p>
                <p className="text-xs mt-1" style={{ color: "#166534" }}>We'll enroll you at the truck — points start earning on your next visit.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-full text-sm outline-none"
                  style={{ background: "#fff", border: "1.5px solid #e8e0d0", color: "#1a0800" }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-full font-black text-xs tracking-widest uppercase transition-opacity hover:opacity-85 disabled:opacity-50"
                  style={{ background: "#c9940a", color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer" }}
                >
                  {loading ? "Joining..." : "Join Now →"}
                </button>
              </form>
            )}
            <div className="flex flex-wrap gap-3 mt-4">
              <a
                href="https://www.facebook.com/cheeziesohio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold underline-offset-2 hover:underline"
                style={{ color: "rgba(61,34,0,0.5)" }}
              >
                Follow on Facebook ↗
              </a>
              <a
                href="https://instagram.com/cheeziesohio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold underline-offset-2 hover:underline"
                style={{ color: "rgba(61,34,0,0.5)" }}
              >
                DM on Instagram ↗
              </a>
            </div>
          </div>

          {/* Right — perks */}
          <div className="flex-1 w-full grid grid-cols-1 gap-3">
            {[
              { icon: "🧀", title: "Earn on Every Order", desc: "Points added automatically when you pay with Square." },
              { icon: "🎁", title: "Redeem for Free Items", desc: "Use points toward menu items — no minimum." },
              { icon: "🎂", title: "Birthday Loyalty Bonus", desc: "Add your birthday when you sign up for exclusive birthday deals." },
              { icon: "📣", title: "Exclusive Facebook Deals", desc: "Follow us for flash specials and loyalty bonus days." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 px-5 py-4 rounded-2xl" style={{ background: "#f9f4ea", border: "1px solid #e8e0d0" }}>
                <span className="text-2xl shrink-0">{icon}</span>
                <div>
                  <p className="font-black text-sm mb-0.5" style={{ color: "#1a0800" }}>{title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(61,34,0,0.55)" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}