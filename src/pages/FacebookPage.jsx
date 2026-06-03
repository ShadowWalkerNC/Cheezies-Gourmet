import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";

export default function FacebookPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans" style={{ background: "#fdf6e3" }}>
      <NavBar />
      <div style={{ height: "calc(93px + var(--safe-top))" }} />
      <PageTransition>
        <div className="px-4 py-8 max-w-3xl mx-auto w-full">
          <div className="text-center mb-6">
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
              Open in Facebook ↗
            </a>
          </div>

          {/* Responsive iframe wrapper */}
          <div
            className="w-full rounded-3xl overflow-hidden"
            style={{
              border: "1.5px solid rgba(180,120,0,0.15)",
              boxShadow: "0 4px 20px rgba(180,120,0,0.08)",
              minHeight: 600,
            }}
          >
            <iframe
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fcheeziesohio&tabs=timeline&width=800&height=800&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false&appId"
              width="100%"
              height="800"
              style={{ border: "none", display: "block" }}
              scrolling="yes"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              title="Cheezies Facebook Feed"
            />
          </div>

          <p className="text-center text-xs mt-4" style={{ color: "rgba(61,34,0,0.35)" }}>
            Feed not loading?{" "}
            <a
              href="https://www.facebook.com/cheeziesohio"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1877f2" }}
            >
              Visit us on Facebook ↗
            </a>
          </p>
        </div>
        <Footer />
        <div className="md:hidden" style={{ height: "var(--tab-bar-h)" }} />
      </PageTransition>
    </div>
  );
}