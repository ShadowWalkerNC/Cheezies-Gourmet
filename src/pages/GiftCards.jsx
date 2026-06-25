import { motion } from "framer-motion";

const SQUARE_URL = "https://cheeziesgourmetohio.square.site/";

const DENOMINATIONS = [
  { amount: "$10", desc: "A great starter gift", icon: "🧀" },
  { amount: "$25", desc: "Perfect for lunch on us", icon: "🥪", popular: true },
  { amount: "$50", desc: "Treat the whole crew", icon: "🎉" },
  { amount: "$100", desc: "Go all out", icon: "👑" },
];

export default function GiftCards() {
  return (
    <div className="min-h-screen pb-28" style={{ background: "#fffbf0" }}>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-6 pt-14 pb-10 text-center"
        style={{ background: "linear-gradient(160deg, #1a0800 0%, #3d1a00 100%)" }}
      >
        <div className="text-5xl mb-4">🎁</div>
        <h1
          className="font-black text-4xl mb-3 leading-tight"
          style={{ fontFamily: "Georgia, serif", color: "#e8b800" }}
        >
          Cheezies Gift Cards
        </h1>
        <p className="text-base max-w-xs mx-auto leading-relaxed" style={{ color: "rgba(232,184,0,0.65)" }}>
          Give the gift of gourmet grilled cheese. Redeemable at the truck — any day, any order.
        </p>
      </motion.div>

      <div className="max-w-lg mx-auto px-6 py-10 flex flex-col gap-10">

        {/* Denomination cards */}
        <div>
          <p className="text-xs font-black tracking-[0.25em] uppercase mb-5 text-center" style={{ color: "#c9940a" }}>
            Choose an Amount
          </p>
          <div className="grid grid-cols-2 gap-4">
            {DENOMINATIONS.map((d, i) => (
              <motion.a
                key={d.amount}
                href={SQUARE_URL}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="relative flex flex-col items-center justify-center gap-2 rounded-2xl py-7 px-4 text-center no-underline"
                style={{
                  background: d.popular ? "#1a0800" : "#fff",
                  border: d.popular ? "none" : "1.5px solid rgba(180,120,0,0.18)",
                  boxShadow: d.popular ? "0 8px 32px rgba(26,8,0,0.18)" : "0 2px 12px rgba(180,120,0,0.07)",
                  textDecoration: "none",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {d.popular && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-black tracking-widest uppercase"
                    style={{ background: "#c9940a", color: "#fff8e8" }}
                  >
                    Most Popular
                  </span>
                )}
                <span className="text-3xl">{d.icon}</span>
                <span
                  className="font-black text-3xl"
                  style={{ color: d.popular ? "#e8b800" : "#1a0800" }}
                >
                  {d.amount}
                </span>
                <span
                  className="text-xs leading-snug"
                  style={{ color: d.popular ? "rgba(232,184,0,0.6)" : "rgba(61,34,0,0.5)" }}
                >
                  {d.desc}
                </span>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Main CTA */}
        <motion.a
          href={SQUARE_URL}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full py-5 rounded-2xl font-black text-base uppercase tracking-widest text-center block transition-opacity hover:opacity-85 active:opacity-70"
          style={{
            background: "#c9940a",
            color: "#fff8e8",
            textDecoration: "none",
            boxShadow: "0 8px 32px rgba(201,148,10,0.3)",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          Buy a Gift Card on Square →
        </motion.a>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl p-6"
          style={{ background: "#fff", border: "1.5px solid rgba(180,120,0,0.15)" }}
        >
          <p className="text-xs font-black tracking-[0.25em] uppercase mb-4" style={{ color: "#c9940a" }}>
            How It Works
          </p>
          <div className="flex flex-col gap-3">
            {[
              ["1", "Purchase your gift card on Square in any amount"],
              ["2", "A digital card is emailed to you or your recipient instantly"],
              ["3", "Show the code at the truck — we'll scan it right there"],
            ].map(([num, text]) => (
              <div key={num} className="flex items-start gap-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5"
                  style={{ background: "#1a0800", color: "#e8b800" }}
                >
                  {num}
                </span>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(61,34,0,0.7)" }}>{text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Check balance */}
        <div className="text-center">
          <p className="text-xs mb-2" style={{ color: "rgba(61,34,0,0.45)" }}>Already have a gift card?</p>
          <a
            href={SQUARE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-black underline"
            style={{ color: "#c9940a" }}
          >
            Check your balance →
          </a>
        </div>

      </div>
    </div>
  );
}
