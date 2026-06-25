import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function GiftCardTeaser() {
  const navigate = useNavigate();

  return (
    <section className="px-6 py-10" style={{ background: '#fffbf0' }}>
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl p-8"
          style={{
            background: 'linear-gradient(135deg, #1a0800 0%, #3d1a00 100%)',
            boxShadow: '0 8px 40px rgba(26,8,0,0.2)',
          }}
        >
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full" style={{ background: 'rgba(201,148,10,0.12)' }} />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full" style={{ background: 'rgba(201,148,10,0.08)' }} />

          <div className="relative">
            <div className="text-4xl mb-4">🎁</div>
            <p className="text-xs font-black tracking-[0.25em] uppercase mb-2" style={{ color: 'rgba(232,184,0,0.6)' }}>
              Give the Gift of
            </p>
            <h2
              className="text-3xl font-black mb-3 leading-tight"
              style={{ fontFamily: 'Georgia, serif', color: '#e8b800' }}
            >
              Gourmet Grilled Cheese
            </h2>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: 'rgba(232,184,0,0.55)' }}>
              Cheezies gift cards — perfect for birthdays, holidays, or just because. Redeemable at the truck any day.
            </p>
            <button
              onClick={() => navigate('/GiftCards')}
              className="px-7 py-3.5 rounded-full font-black text-sm uppercase tracking-widest transition-opacity hover:opacity-85 active:opacity-70"
              style={{
                background: '#c9940a',
                color: '#fff8e8',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(201,148,10,0.35)',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              Buy a Gift Card →
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
