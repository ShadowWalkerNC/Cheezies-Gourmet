import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useFeaturedItems } from '@/hooks/useMenuItems';

function FeaturedCard({ item, i }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.08 }}
      className="rounded-3xl overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        border: hovered ? '1.5px solid rgba(201,148,10,0.4)' : '1.5px solid #e8e0d0',
        boxShadow: hovered
          ? '0 12px 36px rgba(180,120,0,0.18)'
          : '0 4px 24px rgba(180,120,0,0.1)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease',
      }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-full object-cover"
          style={{
            transform: hovered ? 'scale(1.07)' : 'scale(1)',
            transition: 'transform 0.6s ease',
          }}
          loading="lazy"
        />
        <div
          className="absolute inset-0"
          style={{
            background: hovered
              ? 'linear-gradient(to top, rgba(26,8,0,0.88) 0%, transparent 55%)'
              : 'linear-gradient(to top, rgba(26,8,0,0.72) 0%, transparent 55%)',
            transition: 'background 0.3s ease',
          }}
        />
        {item.badge && (
          <span
            className="absolute top-3 left-3 text-xs font-black px-2.5 py-1 rounded-full"
            style={{ background: item.badge_color || '#c9940a', color: '#fff' }}
          >
            {item.badge}
          </span>
        )}
        <span
          className="absolute top-3 right-3 font-black text-sm px-2.5 py-1 rounded-full"
          style={{
            background: hovered ? 'rgba(201,148,10,0.92)' : '#1a0800',
            color: hovered ? '#fff8e8' : '#e8b800',
            transition: 'background 0.25s ease, color 0.25s ease',
          }}
        >
          {item.price}
        </span>
        <h4 className="absolute bottom-3 left-4 font-black text-base text-white uppercase tracking-tight">
          {item.name}
        </h4>
      </div>
      <div className="px-4 py-4" style={{ borderTop: '1.5px solid #e8e0d0' }}>
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(61,34,0,0.65)', minHeight: '40px' }}>
          {item.description}
        </p>
        <a
          href="https://cheeziesgourmetohio.square.site/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-5 py-2.5 rounded-full font-bold text-sm"
          style={{
            background: '#c9940a',
            color: '#fff',
            textDecoration: 'none',
            transition: 'background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#b8820a';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(201,148,10,0.45)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#c9940a';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Order This →
        </a>
      </div>
    </motion.div>
  );
}

export default function FeaturedMenu() {
  const navigate = useNavigate();
  const { items, loading } = useFeaturedItems();
  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <section className="py-16 px-6" style={{ background: '#fff', borderTop: '1.5px solid #e8e0d0' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <p className="text-xs font-black tracking-[0.25em] uppercase mb-2" style={{ color: '#c9940a' }}>Fan Favorite</p>
          <h2 className="font-black uppercase" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: '#1a0800', letterSpacing: '-0.01em' }}>Try This</h2>
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full" style={{ background: '#fff8e8', border: '1.5px solid #c9940a' }}>
            <span>🧀</span>
            <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#7a4f00' }}>All sandwiches include Chips and a Drink</p>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
            {items.map((item, i) => (
              <FeaturedCard key={item.id} item={item} i={i} />
            ))}
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => { navigate('/Menu'); window.scrollTo({ top: 0, behavior: 'instant' }); }}
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => setBtnHovered(false)}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-black text-sm"
            style={{
              background: btnHovered ? '#2d1200' : '#1a0800',
              color: '#fff',
              transform: btnHovered ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: btnHovered ? '0 8px 24px rgba(26,8,0,0.3)' : 'none',
              transition: 'background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            View Full Menu →
          </button>
        </div>
      </div>
    </section>
  );
}
