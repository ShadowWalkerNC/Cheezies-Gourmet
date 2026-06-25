import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const stats = [
  { value: "Akron, OH", label: "Home Base", icon: "📍" },
  { value: "150+",      label: "Events Catered", icon: "🎉" },
  { value: "Est. 2020", label: "Year Founded", icon: "🧀" },
];

const socials = [
  { href: "https://www.facebook.com/cheeziesohio",         label: "Facebook",        color: "#1877F2" },
  { href: "https://instagram.com/cheeziesohio",            label: "Instagram",       color: "#e1306c" },
  { href: "https://tiktok.com/@cheeziesohio",              label: "TikTok",          color: "#010101" },
  { href: "https://maps.app.goo.gl/dUyof854YsHaKcNE9",    label: "Google Business", color: "#4285F4" },
];

const story = [
  "Cheezies Gourmet is Akron, Ohio\u2019s premier gourmet grilled cheese food truck, crafting elevated comfort food with locally sourced ingredients and bold, unexpected flavor combinations. What started as a passion for transforming a childhood classic into a true culinary experience has grown into one of Northeast Ohio\u2019s most beloved mobile kitchens.",
  "Our menu features Signature Creations, Gourmet Melts, and an ever-rotating selection of sides and seasonal specials. Every sandwich is pressed to golden perfection on artisan bread, loaded with premium cheeses, and paired with carefully chosen complementary ingredients \u2014 from slow-braised meats to truffle aioli and fresh herbs.",
  "We cater across the Akron\u2013Canton\u2013Cleveland corridor \u2014 private events, corporate lunches, weddings, festivals, and farmers markets. Our catering packages are fully customizable, making us the perfect partner for any gathering, large or small.",
  "Cheezies Gourmet is operated by a small, dedicated team who believes great food doesn\u2019t have to be complicated \u2014 it just has to be made with the right ingredients and real care. We\u2019re proud to be a local, independent business and grateful for every customer who\u2019s followed the truck, tagged us in a photo, or shared our sandwiches with a friend.",
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

export default function AboutPage() {
  return (
    <PageTransition>
      <NavBar />
      <main style={{ background: "#fffbf0" }}>

        {/* ── Hero ── */}
        <div
          className="pt-24 pb-14 px-6 text-center"
          style={{ background: "linear-gradient(160deg, #1a0800 0%, #3d1a00 100%)" }}
        >
          <motion.div {...fade()}>
            <p className="text-xs font-black tracking-[0.35em] uppercase mb-4" style={{ color: "rgba(232,184,0,0.6)" }}>
              Our Story
            </p>
            <h1
              className="text-4xl md:text-5xl font-black mb-4 leading-tight"
              style={{ fontFamily: "Georgia, serif", color: "#e8b800" }}
            >
              About Cheezies Gourmet
            </h1>
            <p className="text-base max-w-md mx-auto leading-relaxed" style={{ color: "rgba(232,184,0,0.55)" }}>
              Akron\u2019s premier gourmet grilled cheese food truck \u2014 made with intention, served with love.
            </p>
          </motion.div>
        </div>

        {/* ── Stat cards ── */}
        <div className="px-6 -mt-6 mb-12">
          <div className="max-w-lg mx-auto grid grid-cols-3 gap-3">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                {...fade(i * 0.1)}
                className="rounded-2xl p-4 text-center"
                style={{ background: "#fff", border: "1.5px solid rgba(180,120,0,0.15)", boxShadow: "0 4px 20px rgba(180,120,0,0.07)" }}
              >
                <div className="text-2xl mb-1">{s.icon}</div>
                <p className="font-black text-sm leading-tight" style={{ color: "#1a0800" }}>{s.value}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(61,34,0,0.45)" }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Story ── */}
        <div className="max-w-2xl mx-auto px-6 pb-12 flex flex-col gap-5">
          {story.map((para, i) => (
            <motion.p
              key={i}
              {...fade(i * 0.08)}
              className="text-base leading-relaxed"
              style={{ color: "rgba(61,34,0,0.8)" }}
            >
              {para}
            </motion.p>
          ))}
        </div>

        {/* ── Social links ── */}
        <motion.div {...fade(0.2)} className="max-w-2xl mx-auto px-6 pb-12">
          <p className="text-xs font-black tracking-[0.25em] uppercase mb-4" style={{ color: "rgba(61,34,0,0.4)" }}>
            Follow the Truck
          </p>
          <div className="flex flex-wrap gap-3">
            {socials.map(({ href, label, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105"
                style={{
                  background: `${color}12`,
                  color,
                  border: `1.5px solid ${color}30`,
                  textDecoration: "none",
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </motion.div>

        {/* ── CTAs ── */}
        <motion.div {...fade(0.25)} className="max-w-2xl mx-auto px-6 pb-20 flex flex-wrap gap-4">
          <a
            href="/Menu"
            className="px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
            style={{ background: "#c9940a", color: "#fff8e8", textDecoration: "none" }}
          >
            View Our Menu →
          </a>
          <a
            href="/Catering"
            className="px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
            style={{ background: "rgba(201,148,10,0.1)", color: "#7a4f00", border: "1.5px solid rgba(180,120,0,0.25)", textDecoration: "none" }}
          >
            Catering Inquiries →
          </a>
        </motion.div>

      </main>
      <Footer />
    </PageTransition>
  );
}
