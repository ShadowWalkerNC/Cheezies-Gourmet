import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

export default function Footer() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setDone(true);
    const captured = email;
    setEmail("");
    toast({ title: "You're subscribed!", description: "We'll keep you in the loop." });
    base44.integrations.Core.SendEmail({
      to: "cheeziesgourmet@gmail.com",
      subject: "New Newsletter Subscriber",
      body: `New subscriber: ${captured}`,
    });
  };

  return (
    <footer style={{ background: "#2a1200" }}>
      {/* Main footer row */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <p className="font-black text-3xl mb-2" style={{ fontFamily: "Georgia, serif", color: "#e8b800" }}>
            Chee<span style={{ color: "#fff8e8" }}>zies</span>
          </p>
          <p className="text-sm mb-4 leading-relaxed" style={{ color: "rgba(255,248,232,0.5)" }}>
            Gourmet Grilled Creations<br />Akron, Ohio
          </p>
          <div className="flex gap-3">
            {[
              { href: "https://www.facebook.com/profile.php?id=61572987417963", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
              { href: "https://instagram.com/cheeziesohio", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
              { href: "https://twitter.com/cheeziesohio", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
              { href: "https://tiktok.com/@cheeziesohio", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.27 8.27 0 004.84 1.54V6.84a4.85 4.85 0 01-1.07-.15z"/></svg> },
            ].map(({ href, icon }) => (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{ background: "rgba(255,248,232,0.08)", color: "rgba(255,248,232,0.6)" }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Hours */}
        <div>
          <p className="font-bold text-sm tracking-widest uppercase mb-4" style={{ color: "rgba(255,248,232,0.4)" }}>Hours of Operation</p>
          <div className="space-y-1.5 text-sm" style={{ color: "rgba(255,248,232,0.65)" }}>
            <p>Mon – Fri &nbsp;&nbsp; 11:00 AM – 7:00 PM</p>
            <p>Sat – Sun &nbsp;&nbsp; 11:00 AM – 5:00 PM</p>
            <p className="mt-3 text-xs" style={{ color: "rgba(255,248,232,0.35)" }}>
              * Hours vary by location.<br />Follow social media for daily updates.
            </p>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <p className="font-bold text-sm tracking-widest uppercase mb-4" style={{ color: "rgba(255,248,232,0.4)" }}>Sign up newsletter</p>
          {done ? (
            <p className="text-sm" style={{ color: "#e8b800" }}>You're subscribed! See you at the truck.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                required
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 text-sm px-4 py-2.5 rounded-lg outline-none"
                style={{ background: "rgba(255,248,232,0.08)", border: "1px solid rgba(255,248,232,0.12)", color: "#fff8e8" }}
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 hover:scale-105 whitespace-nowrap"
                style={{ background: "#c9940a", color: "#fff8e8" }}
              >
                Join
              </button>
            </form>
          )}
          <p className="text-xs mt-3" style={{ color: "rgba(255,248,232,0.25)" }}>No spam. Unsubscribe anytime.</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-3 text-xs"
        style={{ borderTop: "1px solid rgba(255,248,232,0.08)", color: "rgba(255,248,232,0.3)" }}
      >
        <p>© {new Date().getFullYear()} Cheezies Gourmet Food Truck. All rights reserved.</p>
        <div className="flex gap-4">
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </div>
    </footer>
  );
}