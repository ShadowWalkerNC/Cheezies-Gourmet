import { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';

export function useMenuItems({ featuredOnly = false } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      let query = supabase
        .from('menu_items')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (featuredOnly) query = query.eq('is_featured', true);
      const { data, error } = await query;
      if (!error && data) setItems(data);
      setLoading(false);
    }
    fetch();
  }, [featuredOnly]);

  return { items, loading };
}
