import { motion } from "framer-motion";
import { Phone, Instagram, Facebook, Twitter, Globe, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-28 px-6"
      style={{ background: "linear-gradient(180deg, #2a1505 0%, #1c1008 100%)" }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: "#f5c518" }}>Get In Touch</p>
          <h2
            className="text-5xl md:text-6xl font-black"
            style={{ fontFamily: "Georgia, serif", color: "#fff8e8" }}
          >
            Find Us
          </h2>
          <div className="mt-4 w-16 h-1 mx-auto rounded-full" style={{ background: "#f5c518" }} />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-8"
            style={{ background: "rgba(255,200,60,0.04)", border: "1px solid rgba(245,197,24,0.1)" }}
          >
            <h3 className="text-xl font-bold mb-7" style={{ color: "#fff8e8" }}>Contact Info</h3>
            <div className="space-y-5">
              {[
                { href: "tel:3305108875", Icon: Phone, label: "Call Us", value: "330-510-8875" },
                { href: "http://CheeziesGourmet.com", Icon: Globe, label: "Website", value: "CheeziesGourmet.com" },
                { href: null, Icon: MapPin, label: "Based In", value: "Akron, Ohio" },
              ].map(({ href, Icon, label, value }) => {
                const inner = (
                  <div className="flex items-center gap-4 group">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                      style={{ background: "rgba(245,197,24,0.1)" }}
                    >
                      <Icon className="w-5 h-5" style={{ color: "#f5c518" }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold tracking-widest uppercase mb-0.5" style={{ color: "rgba(255,235,180,0.35)" }}>{label}</p>
                      <p className="font-bold text-base" style={{ color: "#fff8e8" }}>{value}</p>
                    </div>
                  </div>
                );
                return href ? (
                  <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
                    {inner}
                  </a>
                ) : (
                  <div key={label}>{inner}</div>
                );
              })}
            </div>
          </motion.div>

          {/* Social card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-8"
            style={{ background: "rgba(255,200,60,0.04)", border: "1px solid rgba(245,197,24,0.1)" }}
          >
            <h3 className="text-xl font-bold mb-2" style={{ color: "#fff8e8" }}>Follow for Locations</h3>
            <p className="text-sm mb-7 leading-relaxed" style={{ color: "rgba(255,235,180,0.4)" }}>
              We post our daily location on social media. Give us a follow so you never miss us.
            </p>
            <div className="space-y-4">
              {[
                { href: "https://twitter.com/CheeziesOhio", Icon: Twitter, label: "Twitter", sub: "@CheeziesOhio", hoverColor: "#1da1f2" },
                { href: "https://facebook.com/CheeziesOhio", Icon: Facebook, label: "Facebook", sub: "Daily location updates", hoverColor: "#1877f2" },
                { href: "https://instagram.com/CheeziesOhio", Icon: Instagram, label: "Instagram", sub: "See our daily creations", hoverColor: "#e1306c" },
              ].map(({ href, Icon, label, sub, hoverColor }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = `${hoverColor}40`;
                    e.currentTarget.style.background = `${hoverColor}0d`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: hoverColor }} />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "#fff8e8" }}>{label}</p>
                    <p className="text-xs" style={{ color: "rgba(255,235,180,0.4)" }}>{sub}</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 rounded-2xl p-10 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(245,197,24,0.12), rgba(180,90,20,0.08))",
            border: "1.5px solid rgba(245,197,24,0.2)",
          }}
        >
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ color: "rgba(245,197,24,0.6)" }}>Ready for a melt?</p>
          <h3 className="text-3xl md:text-4xl font-black mb-6" style={{ fontFamily: "Georgia, serif", color: "#fff8e8" }}>
            Call <span style={{ color: "#f5c518" }}>330-510-8875</span>
          </h3>
          <a
            href="tel:3305108875"
            className="inline-block px-10 py-4 rounded-full font-bold text-base transition-all duration-300 hover:scale-105"
            style={{ background: "#f5c518", color: "#1c1008", boxShadow: "0 8px 32px rgba(245,197,24,0.25)" }}
          >
            Call Now
          </a>
        </motion.div>
      </div>
    </section>
  );
}