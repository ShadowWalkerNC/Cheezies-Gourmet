import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useFeaturedItems } from '@/hooks/useMenuItems';

export default function FeaturedMenu() {
  const navigate = useNavigate();
  const { items, loading } = useFeaturedItems();

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
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="rounded-3xl overflow-hidden group"
                style={{ background: '#fff', border: '1.5px solid #e8e0d0', boxShadow: '0 4px 24px rgba(180,120,0,0.1)' }}>
                <div className="relative h-48 overflow-hidden">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,8,0,0.8) 0%, transparent 55%)' }} />
                  {item.badge && (
                    <span className="absolute top-3 left-3 text-xs font-black px-2.5 py-1 rounded-full" style={{ background: item.badge_color || '#c9940a', color: '#fff' }}>{item.badge}</span>
                  )}
                  <span className="absolute top-3 right-3 font-black text-sm px-2.5 py-1 rounded-full" style={{ background: '#1a0800', color: '#e8b800' }}>{item.price_text || `$${item.price}`}</span>
                  <h4 className="absolute bottom-3 left-4 font-black text-base text-white uppercase tracking-tight">{item.name}</h4>
                </div>
                <div className="px-4 py-4" style={{ borderTop: '1.5px solid #e8e0d0' }}>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(61,34,0,0.65)', minHeight: '40px' }}>{item.description}</p>
                  <a href="https://cheeziesgourmetohio.square.site/" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-5 py-2.5 rounded-full font-bold text-sm transition-opacity hover:opacity-85"
                    style={{ background: '#c9940a', color: '#fff', textDecoration: 'none' }}>Order This →</a>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center">
          <button onClick={() => { navigate('/Menu'); window.scrollTo({ top: 0, behavior: 'instant' }); }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-black text-sm transition-opacity hover:opacity-85"
            style={{ background: '#1a0800', color: '#fff' }}>View Full Menu →</button>
        </div>
      </div>
    </section>
  );
}
