import { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('date', { ascending: true });
      if (!error && data) setEvents(data);
      setLoading(false);
    }
    fetch();
  }, []);

  return { events, loading };
}
