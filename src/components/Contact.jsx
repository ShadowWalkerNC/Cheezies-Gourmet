import { motion } from "framer-motion";
import { Phone, Instagram, Facebook, Twitter, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#f5c518] text-xs font-bold tracking-[0.3em] uppercase mb-3">Get In Touch</p>
          <h2 className="text-5xl md:text-6xl font-black text-white">Find Us</h2>
          <div className="mt-4 w-16 h-1 bg-[#f5c518] mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/[0.03] border border-white/10 rounded-3xl p-8"
          >
            <h3 className="text-white font-bold text-xl mb-6">Contact Info</h3>

            <div className="space-y-5">
              <a
                href="tel:3305108875"
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#f5c518]/10 flex items-center justify-center group-hover:bg-[#f5c518]/20 transition-colors">
                  <Phone className="w-5 h-5 text-[#f5c518]" />
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-0.5">Call Us</p>
                  <p className="text-white font-bold text-lg group-hover:text-[#f5c518] transition-colors">
                    330-510-8875
                  </p>
                </div>
              </a>

              <a
                href="http://CheeziesGourmet.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#f5c518]/10 flex items-center justify-center group-hover:bg-[#f5c518]/20 transition-colors">
                  <MapPin className="w-5 h-5 text-[#f5c518]" />
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-0.5">Website</p>
                  <p className="text-white font-bold text-base group-hover:text-[#f5c518] transition-colors">
                    CheeziesGourmet.com
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#f5c518]/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#f5c518]" />
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-0.5">Based In</p>
                  <p className="text-white font-bold text-base">Akron, Ohio</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Social card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/[0.03] border border-white/10 rounded-3xl p-8"
          >
            <h3 className="text-white font-bold text-xl mb-2">Stay Updated</h3>
            <p className="text-white/40 text-sm mb-8 leading-relaxed">
              Follow us on social media to find out where we're parked today, 
              see daily specials, and stay in the loop.
            </p>

            <div className="space-y-4">
              <a
                href="https://twitter.com/CheeziesOhio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#1da1f2]/40 hover:bg-[#1da1f2]/5 transition-all duration-200 group"
              >
                <Twitter className="w-5 h-5 text-[#1da1f2]" />
                <div>
                  <p className="text-white font-medium group-hover:text-[#1da1f2] transition-colors">Twitter</p>
                  <p className="text-white/40 text-sm">@CheeziesOhio</p>
                </div>
              </a>

              <a
                href="https://facebook.com/CheeziesOhio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#1877f2]/40 hover:bg-[#1877f2]/5 transition-all duration-200 group"
              >
                <Facebook className="w-5 h-5 text-[#1877f2]" />
                <div>
                  <p className="text-white font-medium group-hover:text-[#1877f2] transition-colors">Facebook</p>
                  <p className="text-white/40 text-sm">Follow for location updates</p>
                </div>
              </a>

              <a
                href="https://instagram.com/CheeziesOhio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-pink-500/40 hover:bg-pink-500/5 transition-all duration-200 group"
              >
                <Instagram className="w-5 h-5 text-pink-500" />
                <div>
                  <p className="text-white font-medium group-hover:text-pink-400 transition-colors">Instagram</p>
                  <p className="text-white/40 text-sm">See our daily creations</p>
                </div>
              </a>
            </div>
          </motion.div>
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 rounded-3xl bg-gradient-to-r from-[#f5c518]/20 via-[#f5c518]/10 to-[#f5c518]/5 border border-[#f5c518]/20 p-8 text-center"
        >
          <p className="text-white/60 text-sm uppercase tracking-widest mb-2">Ready to Order?</p>
          <h3 className="text-white text-3xl font-black mb-4">
            Give Us a Call <span className="text-[#f5c518]">330-510-8875</span>
          </h3>
          <a
            href="tel:3305108875"
            className="inline-block px-8 py-4 rounded-full bg-[#f5c518] text-black font-bold text-base hover:bg-yellow-400 hover:scale-105 transition-all duration-200 shadow-lg shadow-yellow-500/20"
          >
            Call Now
          </a>
        </motion.div>
      </div>
    </section>
  );
}