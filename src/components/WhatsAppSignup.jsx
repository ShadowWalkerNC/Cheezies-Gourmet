import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

export default function WhatsAppSignup() {
  const { toast } = useToast();
  const whatsappUrl = base44.agents.getWhatsAppConnectURL("cheezies_assistant");

  const handleClick = () => {
    toast({ title: "Opening WhatsApp...", description: "You'll get live updates on our location and menu." });
  };

  return (
    <section
      className="py-20 px-6"
      style={{ background: "#fdf6e3", borderTop: "1px solid rgba(180,120,0,0.1)" }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl overflow-hidden flex flex-col md:flex-row"
          style={{ border: "1.5px solid rgba(180,120,0,0.2)", boxShadow: "0 4px 40px rgba(180,120,0,0.08)" }}
        >
          {/* Image side */}
          <div className="md:w-80 h-52 md:h-auto flex-shrink-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80"
              alt="Stay connected with Cheezies Gourmet on WhatsApp"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content side */}
          <div className="flex-1 px-8 py-10" style={{ background: "#fffbf0" }}>
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "#c9940a" }}>
              Never Miss Us
            </p>
            <h2
              className="text-3xl md:text-4xl font-black mb-3 leading-tight"
              style={{ fontFamily: "Georgia, serif", color: "#3d2200" }}
            >
              Get Updates on<br />
              <span style={{ color: "#25D366" }}>WhatsApp</span>
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(80,45,0,0.65)" }}>
              Be the first to know where we're parked, what's on special, and when new menu items drop — straight to your WhatsApp.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className="flex items-center gap-3 px-7 py-3.5 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105 select-none"
                style={{
                  background: "#25D366",
                  color: "#ffffff",
                  textDecoration: "none",
                  boxShadow: "0 6px 24px rgba(37,211,102,0.3)",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Connect on WhatsApp
              </a>
              <p className="text-xs" style={{ color: "rgba(80,45,0,0.45)" }}>
                Free · No spam · Opt out anytime
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}