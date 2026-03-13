import { motion } from "framer-motion";
import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

export default function Newsletter() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
    toast({ title: "You're on the list! 🧀", description: "We'll let you know when we're rolling your way." });
  };

  return (
    <section
      className="py-24 px-6"
      style={{ background: "linear-gradient(180deg, #1a0e05 0%, #2a1505 100%)" }}
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl p-10 md:p-14 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(245,197,24,0.1) 0%, rgba(180,90,20,0.08) 100%)",
            border: "1.5px solid rgba(245,197,24,0.2)",
            boxShadow: "0 0 60px rgba(245,197,24,0.06)",
          }}
        >
          <div className="text-5xl mb-5">📍</div>
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "#f5c518" }}>
            Stay in the Loop
          </p>
          <h2
            className="text-4xl md:text-5xl font-black mb-4 leading-tight"
            style={{ fontFamily: "Georgia, serif", color: "#fff8e8" }}
          >
            Know Where We Are
          </h2>
          <p className="text-base leading-relaxed mb-8 max-w-md mx-auto" style={{ color: "rgba(255,235,180,0.5)" }}>
            Subscribe to get notified about our locations, upcoming events, and exclusive specials.
            No spam — just cheese.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              required
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1.5px solid rgba(245,197,24,0.2)",
                borderRadius: "999px",
                color: "#fff8e8",
                padding: "14px 22px",
                outline: "none",
                fontSize: "15px",
              }}
              onFocus={e => (e.target.style.borderColor = "rgba(245,197,24,0.5)")}
              onBlur={e => (e.target.style.borderColor = "rgba(245,197,24,0.2)")}
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-7 py-3.5 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105 disabled:opacity-60 whitespace-nowrap"
              style={{ background: "#f5c518", color: "#1c1008", boxShadow: "0 6px 24px rgba(245,197,24,0.25)" }}
            >
              {submitting ? "Subscribing..." : "Subscribe"}
            </button>
          </form>

          <p className="text-xs mt-5" style={{ color: "rgba(255,235,180,0.25)" }}>
            Unsubscribe anytime. We respect your inbox.
          </p>
        </motion.div>
      </div>
    </section>
  );
}