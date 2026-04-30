import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const socials = [
  { href: "https://www.facebook.com/cheeziesohio", label: "Facebook", color: "#1877F2" },
  { href: "https://instagram.com/cheeziesohio", label: "Instagram", color: "#e1306c" },
  { href: "https://tiktok.com/@cheeziesohio", label: "TikTok", color: "#010101" },
  { href: "https://maps.app.goo.gl/dUyof854YsHaKcNE9", label: "Google Business", color: "#4285F4" },
];

export default function ContactPage2() {
  return (
    <PageTransition>
      <NavBar />
      <main style={{ background: "#fffbf0", paddingTop: "6rem", paddingBottom: "4rem" }}>
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "#c9940a" }}>Get In Touch</p>
          <h1 className="text-4xl md:text-5xl font-black mb-6" style={{ fontFamily: "Georgia, serif", color: "#2a1200" }}>
            Contact Cheezies Gourmet
          </h1>
          <div className="w-12 h-1 rounded-full mb-10" style={{ background: "#c9940a" }} />

          <div className="grid md:grid-cols-2 gap-6">
            {/* Phone */}
            <a
              href="tel:3305108875"
              className="rounded-2xl p-6 flex items-center gap-4 transition-all hover:scale-[1.02]"
              style={{ background: "#c9940a", boxShadow: "0 4px 20px rgba(180,120,0,0.25)", textDecoration: "none" }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,248,232,0.2)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff8e8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,248,232,0.65)" }}>Call Us</p>
                <p className="font-black text-xl" style={{ color: "#fff8e8" }}>330-510-8875</p>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:cheeziesgourmet@gmail.com"
              className="rounded-2xl p-6 flex items-center gap-4 transition-all hover:scale-[1.02]"
              style={{ background: "#fff", border: "1.5px solid rgba(180,120,0,0.18)", boxShadow: "0 2px 16px rgba(180,120,0,0.06)", textDecoration: "none" }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(201,148,10,0.1)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9940a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(61,34,0,0.45)" }}>Email</p>
                <p className="font-black text-base" style={{ color: "#2a1200" }}>cheeziesgourmet@gmail.com</p>
              </div>
            </a>
          </div>

          {/* Social Links */}
          <div className="mt-8">
            <p className="text-xs font-bold tracking-[0.25em] uppercase mb-4" style={{ color: "rgba(61,34,0,0.45)" }}>Follow Us</p>
            <div className="flex flex-wrap gap-3">
              {socials.map(({ href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105"
                  style={{ background: `${color}12`, color, border: `1.5px solid ${color}30`, textDecoration: "none" }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="mt-8 rounded-2xl p-6" style={{ background: "#fff", border: "1.5px solid rgba(180,120,0,0.18)" }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(61,34,0,0.45)" }}>Area Served</p>
            <p className="font-black text-lg" style={{ color: "#2a1200" }}>Akron, Ohio & Surrounding Areas</p>
            <p className="text-sm mt-1" style={{ color: "rgba(61,34,0,0.55)" }}>
              We operate throughout the Akron–Canton–Cleveland corridor. Follow our social pages for daily location updates.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
}