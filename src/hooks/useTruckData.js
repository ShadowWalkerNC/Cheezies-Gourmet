import { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';

const DEFAULT = {
  status: 'closed',
  address: 'Akron, Ohio',
  home_address: 'Akron, Ohio',
  latitude: null,
  longitude: null,
  hours_open: '11:00 AM',
  hours_close: '6:00 PM',
  open_days: ['Wednesday', 'Thursday', 'Friday', 'Saturday'],
  note: '',
};

export function useTruckData() {
  const [truckData, setTruckData] = useState(DEFAULT);

  useEffect(() => {
    supabase
      .from('truck_status')
      .select('*')
      .eq('id', 1)
      .single()
      .then(({ data }) => { if (data) setTruckData(data); });

    const channel = supabase
      .channel('truck_status_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'truck_status' }, (payload) => {
        if (payload.new) setTruckData(payload.new);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return truckData;
}

export async function saveTruckData(updates) {
  const { error } = await supabase
    .from('truck_status')
    .upsert({ id: 1, ...updates, updated_at: new Date().toISOString() });
  return !error;
}
