import { useState, useEffect } from 'react';
import { supabase } from '@/api/supabaseClient';

export function useWeeklySpecials(limit = 3) {
  const [specials, setSpecials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('specials')
      .select('id, title, price_text, price, badge, badge_color, is_top_seller, sort_order')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .limit(limit)
      .then(({ data, error }) => {
        if (!error && data) setSpecials(data);
        setLoading(false);
      });
  }, [limit]);

  return { specials, loading };
}
