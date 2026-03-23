import { motion } from "framer-motion";
import { useState } from "react";

const socials = [
  {
    href: "https://www.facebook.com/profile.php?id=61572987417963",
    label: "Facebook",
    sub: "Daily location updates",
    color: "#1877F2",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  },
  {
    href: "https://instagram.com/cheeziesohio",
    label: "Instagram",
    sub: "Behind the scenes",
    color: "#e1306c",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
  },
  {
    href: "https://twitter.com/cheeziesohio",
    label: "X (Twitter)",
    sub: "News and updates",
    color: "#000000",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  },
  {
    href: "https://tiktok.com/@cheeziesohio",
    label: "TikTok",
    sub: "Truck life videos",
    color: "#010101",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.27 8.27 0 004.84 1.54V6.84a4.85 4.85 0 01-1.07-.15z"/></svg>,
  },
];

const hours = [
  { day: "Monday – Friday", time: "11:00 AM – 7:00 PM" },
  { day: "Saturday – Sunday", time: "11:00 AM – 5:00 PM" },
];

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyPhone = () => {
    navigator.clipboard.writeText("3305108875");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="contact"
      className="py-20 px-6"
      style={{ background: "#fdf6e3", borderTop: "1px solid rgba(180,120,0,0.1)" }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "#c9940a" }}>Get In Touch</p>
          <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily: "Georgia, serif", color: "#2a1200" }}>
            Find Us
          </h2>
          <div className="mt-3 w-12 h-1 mx-auto rounded-full" style={{ background: "#c9940a" }} />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Map - large left column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 rounded-2xl overflow-hidden"
            style={{ minHeight: "400px", border: "1px solid rgba(180,120,0,0.15)", boxShadow: "0 4px 24px rgba(180,120,0,0.1)" }}
          >
            <iframe
              title="Cheezies Gourmet location area"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d95836.42234567!2d-81.57890!3d41.08144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8836f98fa9e9bedf%3A0xfcdfe8b36a347c0!2sAkron%2C%20OH!5e0!3m2!1sen!2sus!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "400px", display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>

          {/* Right column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 flex flex-col gap-5"
          >
            {/* Location info */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "#ffffff", border: "1px solid rgba(180,120,0,0.15)", boxShadow: "0 2px 16px rgba(180,120,0,0.06)" }}
            >
              <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "rgba(80,45,0,0.4)" }}>Location</p>
              <p className="font-black text-xl mb-1" style={{ color: "#2a1200" }}>Akron, Ohio</p>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: "rgba(61,34,0,0.55)" }}>
                We move daily — follow our social pages for today's exact spot.
              </p>
              <a
                href="https://www.facebook.com/profile.php?id=61572987417963"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-2.5 rounded-lg font-bold text-sm transition-all duration-200 hover:scale-105"
                style={{ background: "#1877F2", color: "#fff", textDecoration: "none" }}
              >
                Today's Location on Facebook
              </a>
            </div>

            {/* Hours */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "#ffffff", border: "1px solid rgba(180,120,0,0.15)", boxShadow: "0 2px 16px rgba(180,120,0,0.06)" }}
            >
              <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "rgba(80,45,0,0.4)" }}>Hours</p>
              <div className="space-y-2">
                {hours.map(({ day, time }) => (
                  <div key={day} className="flex justify-between items-center text-sm gap-4">
                    <span style={{ color: "rgba(61,34,0,0.65)" }}>{day}</span>
                    <span className="font-bold whitespace-nowrap" style={{ color: "#2a1200" }}>{time}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-4" style={{ color: "rgba(61,34,0,0.35)" }}>Hours vary by event. Check social for details.</p>
            </div>

            {/* Phone */}
            <div
              className="rounded-2xl p-6 flex items-center justify-between gap-4 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
              style={{ background: "#c9940a", boxShadow: "0 4px 20px rgba(180,120,0,0.3)" }}
              onClick={copyPhone}
            >
              <div>
                <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "rgba(255,248,232,0.6)" }}>Call Us</p>
                <p className="font-black text-xl" style={{ color: "#fff8e8" }}>330-510-8875</p>
              </div>
              <a
                href="tel:3305108875"
                onClick={e => e.stopPropagation()}
                className="px-5 py-2.5 rounded-lg font-bold text-sm transition-all hover:scale-105 whitespace-nowrap"
                style={{ background: "rgba(255,248,232,0.2)", color: "#fff8e8", textDecoration: "none" }}
              >
                {copied ? "Copied!" : "Call Now"}
              </a>
            </div>
          </motion.div>
        </div>

        {/* Social cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {socials.map(({ href, label, sub, color, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 py-6 px-4 rounded-xl text-center transition-all duration-200 hover:scale-105 select-none"
              style={{ background: "#fff", border: `1.5px solid ${color}20`, boxShadow: "0 2px 12px rgba(0,0,0,0.05)", textDecoration: "none" }}
              onMouseEnter={e => { e.currentTarget.style.background = `${color}08`; e.currentTarget.style.borderColor = `${color}40`; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = `${color}20`; }}
            >
              <span style={{ color }}>{icon}</span>
              <div>
                <p className="font-black text-sm" style={{ color: "#2a1200" }}>{label}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(61,34,0,0.45)" }}>{sub}</p>
              </div>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}