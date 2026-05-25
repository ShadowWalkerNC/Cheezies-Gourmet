import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const GIFT_ORDER_URL = "https://app.squareup.com/gift/MLVDKYK6QRWEF/order";
const GIFT_BALANCE_URL = "https://app.squareup.com/gift/MLVDKYK6QRWEF/check-balance";

export default function GiftCards() {
  return (
    <PageTransition>
      <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
        <NavBar />

        {/* Top spacing for fixed NavBar */}
        <div style={{ height: "96px" }} />

        <div className="max-w-4xl mx-auto px-6 py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-xs font-black tracking-[0.25em] uppercase mb-2" style={{ color: "#c9940a" }}>
              The Perfect Gift
            </p>
            <h1
              className="font-black uppercase leading-tight mb-4"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: "#1a0800" }}
            >
              Cheezies<br />Gift Cards
            </h1>
            <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: "rgba(61,34,0,0.6)" }}>
              Give the gift of gourmet grilled cheese. Perfect for birthdays, holidays, or just because — redeemable at the Cheezies food truck.
            </p>
          </motion.div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buy a Gift Card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col rounded-3xl overflow-hidden"
              style={{ background: "#1a0800", border: "1.5px solid #1a0800" }}
            >
              <div className="px-8 py-10 flex-1">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: "rgba(201,148,10,0.15)" }}>
                  <span className="text-3xl">🎁</span>
                </div>
                <h2 className="font-black text-2xl uppercase mb-3" style={{ color: "#fff8e8" }}>Buy a Gift Card</h2>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,248,232,0.6)" }}>
                  Send an e-gift card instantly via email. Choose any amount and personalize your message — delivered straight to their inbox.
                </p>
                <ul className="mt-5 space-y-2">
                  {["Instant email delivery", "Any dollar amount", "Never expires", "Easy to redeem at the truck"].map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,248,232,0.7)" }}>
                      <span style={{ color: "#c9940a" }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-8 pb-8">
                <a
                  href={GIFT_ORDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-4 rounded-full font-black text-sm tracking-widest uppercase transition-opacity hover:opacity-85"
                  style={{ background: "#c9940a", color: "#fff", textDecoration: "none" }}
                >
                  Buy Gift Card →
                </a>
              </div>
            </motion.div>

            {/* Check Balance */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col rounded-3xl overflow-hidden"
              style={{ background: "#fff", border: "1.5px solid #e8e0d0" }}
            >
              <div className="px-8 py-10 flex-1">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: "#fff8e8" }}>
                  <span className="text-3xl">💳</span>
                </div>
                <h2 className="font-black text-2xl uppercase mb-3" style={{ color: "#1a0800" }}>Check Balance</h2>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(61,34,0,0.6)" }}>
                  Already have a Cheezies gift card? Check your remaining balance anytime — quick and easy, no account needed.
                </p>
                <ul className="mt-5 space-y-2">
                  {["Instant balance lookup", "Works for all gift card types", "No login required", "Accepted at every visit"].map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs" style={{ color: "rgba(61,34,0,0.55)" }}>
                      <span style={{ color: "#c9940a" }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-8 pb-8">
                <a
                  href={GIFT_BALANCE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-4 rounded-full font-black text-sm tracking-widest uppercase transition-opacity hover:opacity-85"
                  style={{ background: "#1a0800", color: "#fff8e8", textDecoration: "none" }}
                >
                  Check Balance →
                </a>
              </div>
            </motion.div>
          </div>

          {/* Bottom note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-xs mt-10"
            style={{ color: "rgba(61,34,0,0.4)" }}
          >
            Gift cards are powered by Square and redeemable at the Cheezies food truck in Akron, Ohio.
          </motion.p>
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
}