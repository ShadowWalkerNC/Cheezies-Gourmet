import { useState, useEffect } from 'react';
import { supabase } from '@/api/supabaseClient';

export function useMenuItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    const { data } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);
  return { items, loading, refetch: fetch };
}

export function useFeaturedItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('menu_items')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data) setItems(data);
        setLoading(false);
      });
  }, []);

  return { items, loading };
}
