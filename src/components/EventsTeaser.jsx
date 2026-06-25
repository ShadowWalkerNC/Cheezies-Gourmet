import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/api/supabaseClient';

export default function EventsTeaser() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from('events')
      .select('id, title, event_date, time_start, time_end, location_name')
      .eq('is_active', true)
      .gte('event_date', new Date().toISOString().slice(0, 10))
      .order('event_date', { ascending: true })
      .limit(3)
      .then(({ data }) => { if (data?.length) setEvents(data); });
  }, []);

  if (!events.length) return null;

  const fmt = (iso) =>
    new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
    });

  return (
    <section className="py-14 px-6" style={{ background: '#fffbf0' }}>
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-black tracking-[0.25em] uppercase" style={{ color: '#c9940a' }}>Upcoming</p>
            <h2 className="text-2xl font-black" style={{ fontFamily: 'Georgia, serif', color: '#1a0800' }}>Events</h2>
          </div>
          <button
            onClick={() => navigate('/Events')}
            className="text-xs font-black uppercase tracking-wider px-4 py-2 rounded-full"
            style={{ background: 'rgba(201,148,10,0.1)', color: '#c9940a', border: 'none', cursor: 'pointer' }}
          >
            See All →
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {events.map((ev, i) => (
            <motion.button
              key={ev.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              onClick={() => navigate('/Events')}
              className="w-full flex items-center gap-4 p-4 rounded-2xl text-left"
              style={{
                background: '#fff',
                border: '1.5px solid rgba(180,120,0,0.15)',
                boxShadow: '0 2px 12px rgba(180,120,0,0.06)',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {/* Date badge */}
              <div
                className="w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0"
                style={{ background: '#1a0800' }}
              >
                <span className="text-xs font-black" style={{ color: '#e8b800', lineHeight: 1 }}>
                  {new Date(ev.event_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                </span>
                <span className="text-lg font-black leading-none" style={{ color: '#fff8e8' }}>
                  {new Date(ev.event_date + 'T00:00:00').getDate()}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-black text-sm truncate" style={{ color: '#1a0800' }}>{ev.title}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(61,34,0,0.5)' }}>
                  {fmt(ev.event_date)}{ev.time_start ? ` · ${ev.time_start}` : ''}{ev.location_name ? ` · ${ev.location_name}` : ''}
                </p>
              </div>

              <span style={{ color: 'rgba(61,34,0,0.25)', fontSize: 14 }}>›</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
