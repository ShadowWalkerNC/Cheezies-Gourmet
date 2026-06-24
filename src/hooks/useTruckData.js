import { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';

const DEFAULT = {
  status: 'closed',
  address: '',
  latitude: null,
  longitude: null,
  hours_open: '11:00 AM',
  hours_close: '6:00 PM',
  open_days: [],
  note: '',
};

export function useTruckData() {
  const [data, setData] = useState(DEFAULT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatus() {
      const { data: rows, error } = await supabase
        .from('truck_status')
        .select('*')
        .eq('id', 1)
        .single();
      if (!error && rows) setData(rows);
      setLoading(false);
    }
    fetchStatus();

    const channel = supabase
      .channel('truck_status_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'truck_status' }, (payload) => {
        if (payload.new) setData(payload.new);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  async function updateTruckData(updates) {
    const { data: updated, error } = await supabase
      .from('truck_status')
      .upsert({ id: 1, ...updates })
      .select()
      .single();
    if (!error && updated) setData(updated);
    return { error };
  }

  return { data, loading, updateTruckData };
}
