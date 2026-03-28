import { motion } from "framer-motion";
import { ShoppingBag, Bell } from "lucide-react";
import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

const items = [
  { emoji: "👕", label: "Tees & Hoodies" },
  { emoji: "🧢", label: "Hats & Caps" },
  { emoji: "🫙", label: "Signature Sauces" },
  { emoji: "🎁", label: "Gift Bundles" },
];

export default function MerchTeaser() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const handleNotify = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.functions.invoke("sendNotification", { type: "merch_notify", data: { email } });
    setSubmitting(false);
    setDone(true);
    toast({ title: "🛍️ We'll notify you!", description: "Be the first to grab Cheezies merch." });
  };

  return (
    <section
      className="py-20 px-6 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #fff8e8 0%, #fdf3d8 100%)" }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl overflow-hidden"
          style={{ border: "1.5px solid rgba(180,120,0,0.2)", boxShadow: "0 8px 40px rgba(180,120,0,0.1)" }}
        >
          {/* Header band */}
          <div
            className="px-8 py-8 text-center relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #c9940a 0%, #e8b800 60%, #f5c518 100%)" }}
          >
            <div className="absolute inset-0 opacity-10 text-[18rem] flex items-center justify-center select-none pointer-events-none">
              🛍️
            </div>
            <div className="relative z-10">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-bold tracking-[0.25em] uppercase"
                style={{ background: "rgba(61,34,0,0.2)", color: "#fff8e8" }}
              >
                🛍️ Coming Soon
              </div>
              <h2
                className="text-4xl md:text-5xl font-black leading-tight"
                style={{ fontFamily: "Georgia, serif", color: "#3d2200", textShadow: "0 2px 8px rgba(100,50,0,0.2)" }}
              >
                Cheezies Merch Shop
              </h2>
              <p className="text-base mt-3 font-medium" style={{ color: "rgba(61,34,0,0.7)" }}>
                Rep the truck. Wear the cheese. Live the melt.
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-8" style={{ background: "#fffbf0" }}>
            {/* Item previews */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {items.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl text-center"
                  style={{ background: "rgba(201,148,10,0.07)", border: "1px solid rgba(180,120,0,0.12)" }}
                >
                  <span className="text-3xl">{item.emoji}</span>
                  <span className="text-xs font-bold" style={{ color: "rgba(80,45,0,0.75)" }}>{item.label}</span>
                  <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full" style={{ background: "rgba(201,148,10,0.15)", color: "#c9940a" }}>
                    Coming Soon
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Notify form */}
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center mb-4">
                <Bell size={16} style={{ color: "#c9940a" }} />
                <p className="font-bold text-base" style={{ color: "#3d2200" }}>
                  Get notified when the shop drops!
                </p>
              </div>

              {done ? (
                <div className="py-3">
                  <p className="font-bold text-base" style={{ color: "#c9940a" }}>🎉 You'll be the first to know!</p>
                </div>
              ) : (
                <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
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
                      padding: "12px 20px",
                      outline: "none",
                      fontSize: "14px",
                    }}
                    onFocus={e => (e.target.style.borderColor = "#c9940a")}
                    onBlur={e => (e.target.style.borderColor = "rgba(180,120,0,0.2)")}
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105 disabled:opacity-60 whitespace-nowrap"
                    style={{ background: "#c9940a", color: "#fff8e8", boxShadow: "0 6px 20px rgba(180,120,0,0.25)" }}
                  >
                    <ShoppingBag size={15} />
                    {submitting ? "Saving…" : "Notify Me"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}