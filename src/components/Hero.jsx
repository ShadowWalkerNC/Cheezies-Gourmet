import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1200] via-[#0a0a0a] to-[#0a0a0a]" />

      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#f5c518]/5 blur-3xl pointer-events-none" />

      {/* Food truck image */}
      <div className="absolute inset-0 opacity-10">
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_690e03ca6954e9eb9fa1a6ef/558419bfd_IMG_0804.png"
          alt="Cheezies Food Truck"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-[#0a0a0a]/40" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[#f5c518] text-sm font-bold tracking-[0.3em] uppercase mb-4">
            Gourmet Grilled Creations
          </p>

          <h1 className="text-7xl md:text-9xl font-black text-white mb-4 leading-none tracking-tight">
            Chee<span className="text-[#f5c518]">zies</span>
          </h1>

          <p className="text-white/60 text-lg md:text-xl mb-2 tracking-wide">
            Akron, Ohio
          </p>

          <p className="text-white/40 text-base md:text-lg mb-10 max-w-xl mx-auto">
            Handcrafted gourmet grilled cheese sandwiches made fresh on our food truck.
            Follow us on social media to find us today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#menu"
              className="px-8 py-4 rounded-full bg-[#f5c518] text-black font-bold text-base hover:bg-yellow-400 hover:scale-105 transition-all duration-200 shadow-lg shadow-yellow-500/20"
            >
              View Our Menu
            </a>
            <a
              href="#contact"
              className="px-8 py-4 rounded-full border border-white/20 text-white font-medium text-base hover:border-[#f5c518] hover:text-[#f5c518] transition-all duration-200"
            >
              Find Us Today
            </a>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-px h-16 bg-gradient-to-b from-[#f5c518]/50 to-transparent mx-auto" />
        </motion.div>
      </div>
    </section>
  );
}