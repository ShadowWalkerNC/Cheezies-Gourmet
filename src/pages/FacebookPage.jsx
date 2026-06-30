import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";
import { motion } from "framer-motion";

const APP_ID = "1523309282633633";
const FB_PAGE_URL = encodeURIComponent("https://www.facebook.com/cheeziesohio");

export default function FacebookPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans" style={{ background: "#fdf6e3" }}>
      <NavBar />
      <div style={{ height: "calc(93px + var(--safe-top))" }} />
      <PageTransition>
        <div className="px-4 py-12 max-w-3xl mx-auto w-full">

          {/* Header */}
          <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-2" style={{ color: "#c9940a" }}>Stay Connected</p>
            <h1 className="text-4xl font-black mb-3" style={{ fontFamily: "Georgia, serif", color: "#2a1200" }}>Facebook</h1>
            <div className="w-12 h-1 mx-auto rounded-full mb-4" style={{ background: "#c9940a" }} />
            <p className="text-sm" style={{ color: "rgba(61,34,0,0.6)" }}>
              Real-time updates, daily specials, and event announcements.
            </p>
            <a
              href="https://www.facebook.com/cheeziesohio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full font-bold text-sm"
              style={{ background: "#1877f2", color: "#fff", textDecoration: "none" }}
            >
              Open in Facebook
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          </motion.div>

          {/* Facebook Page Plugin embed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="w-full rounded-3xl overflow-hidden"
            style={{
              border: "1.5px solid rgba(180,120,0,0.15)",
              boxShadow: "0 4px 20px rgba(180,120,0,0.08)",
              minHeight: 600,
              background: "#fff",
            }}
          >
            <div
              className="fb-page"
              data-href="https://www.facebook.com/cheeziesohio"
              data-tabs="timeline"
              data-width=""
              data-height="700"
              data-small-header="false"
              data-adapt-container-width="true"
              data-hide-cover="false"
              data-show-facepile="false"
            />
          </motion.div>

          <p className="text-center text-xs mt-4" style={{ color: "rgba(61,34,0,0.35)" }}>
            Feed not loading?{" "}
            <a
              href="https://www.facebook.com/cheeziesohio"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1877f2" }}
            >
              Visit us directly on Facebook
            </a>
          </p>
        </div>
        <Footer />
        <div className="md:hidden" style={{ height: "var(--tab-bar-h)" }} />
      </PageTransition>
    </div>
  );
}
