import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";
import { motion } from "framer-motion";

const FB_PAGE = "https://www.facebook.com/cheeziesohio";

const RECENT_POSTS = [
  {
    label: "Daily Location",
    desc: "Where the truck is today — updated every morning.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
    ),
  },
  {
    label: "Daily Specials",
    desc: "What’s fresh and featured on the menu today.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
    ),
  },
  {
    label: "Events & Pop-Ups",
    desc: "Upcoming appearances, catering events, and markets.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    ),
  },
];

export default function FacebookPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans" style={{ background: "#fdf6e3" }}>
      <NavBar />
      <div style={{ height: "calc(93px + var(--safe-top))" }} />
      <PageTransition>
        <div className="px-4 py-12 max-w-2xl mx-auto w-full">

          {/* Header */}
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-2" style={{ color: "#c9940a" }}>Stay Connected</p>
            <h1 className="text-4xl font-black mb-3" style={{ fontFamily: "Georgia, serif", color: "#2a1200" }}>Follow Us on Facebook</h1>
            <div className="w-12 h-1 mx-auto rounded-full mb-5" style={{ background: "#c9940a" }} />
            <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: "rgba(61,34,0,0.6)" }}>
              We post our location, daily specials, and event updates every morning.
              Facebook is the fastest way to know where the truck is.
            </p>
          </motion.div>

          {/* Big follow CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-3xl p-8 text-center mb-8"
            style={{ background: "#1877f2", boxShadow: "0 8px 32px rgba(24,119,242,0.3)" }}
          >
            <div className="flex justify-center mb-4">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </div>
            <h2 className="text-2xl font-black text-white mb-2">@cheeziesohio</h2>
            <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.75)" }}>Follow for daily location drops, specials, and event announcements.</p>
            <a
              href={FB_PAGE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-black text-sm tracking-widest uppercase"
              style={{ background: "#fff", color: "#1877f2", textDecoration: "none", transition: "opacity 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              Open Facebook Page
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          </motion.div>

          {/* What we post */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <p className="text-xs font-black tracking-[0.2em] uppercase mb-4" style={{ color: "rgba(61,34,0,0.4)" }}>What We Post</p>
            <div className="flex flex-col gap-3">
              {RECENT_POSTS.map(({ label, desc, icon }) => (
                <a
                  key={label}
                  href={FB_PAGE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 rounded-2xl transition-all duration-200"
                  style={{
                    background: "#fff",
                    border: "1px solid rgba(180,120,0,0.12)",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "rgba(201,148,10,0.35)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(180,120,0,0.1)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "rgba(180,120,0,0.12)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(201,148,10,0.1)", color: "#c9940a" }}>
                    {icon}
                  </div>
                  <div>
                    <p className="font-black text-sm" style={{ color: "#2a1200" }}>{label}</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(61,34,0,0.55)" }}>{desc}</p>
                  </div>
                  <svg className="ml-auto shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9940a" strokeWidth="2"><polyline points="9,18 15,12 9,6"/></svg>
                </a>
              ))}
            </div>
          </motion.div>

          <p className="text-center text-xs mt-8" style={{ color: "rgba(61,34,0,0.3)" }}>
            Tap any card above to open the Cheezies Facebook page.
          </p>
        </div>
        <Footer />
        <div className="md:hidden" style={{ height: "var(--tab-bar-h)" }} />
      </PageTransition>
    </div>
  );
}
