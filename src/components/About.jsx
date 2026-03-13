import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        
        {/* Image side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-3xl bg-[#f5c518]/10 blur-2xl" />
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_690e03ca6954e9eb9fa1a6ef/73dfd6e87_IMG_0805.png"
            alt="Cheezies Food Truck"
            className="relative rounded-2xl w-full object-cover shadow-2xl border border-white/5"
          />
        </motion.div>

        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-[#f5c518] text-xs font-bold tracking-[0.3em] uppercase mb-4">Our Story</p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            Gourmet Grilled<br />
            <span className="text-[#f5c518]">Done Right</span>
          </h2>
          <p className="text-white/60 text-lg leading-relaxed mb-6">
            Cheezies is Akron's premier gourmet grilled cheese food truck, serving up bold, 
            creative sandwiches made with premium ingredients and a whole lot of cheese.
          </p>
          <p className="text-white/50 text-base leading-relaxed mb-8">
            From classic comfort to adventurous flavors, every sandwich is crafted fresh to order.
            Follow us on social media to catch us at our next location — we're always on the move!
          </p>

          <div className="grid grid-cols-2 gap-6">
            {[
              { value: "100%", label: "Fresh Ingredients" },
              { value: "Made", label: "To Order" },
              { value: "Akron", label: "Ohio Based" },
              { value: "Gourmet", label: "Grilled Creations" },
            ].map((stat) => (
              <div key={stat.label} className="border border-white/10 rounded-xl p-4">
                <div className="text-[#f5c518] text-xl font-black">{stat.value}</div>
                <div className="text-white/50 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}