import { useState, useEffect } from 'react';
import { supabase } from '@/api/supabaseClient';

const FALLBACK = {
  status: 'closed',
  address: 'Akron, Ohio',
  home_address: 'Akron, Ohio',
  hours_open: '11:00 AM',
  hours_close: '6:00 PM',
  open_days: ['Wednesday', 'Thursday', 'Friday', 'Saturday'],
  note: '',
  latitude: null,
  longitude: null,
};

let cache = null;
let listeners = [];

function notify(data) {
  cache = data;
  listeners.forEach(fn => fn(data));
}

async function fetchTruck() {
  const { data, error } = await supabase
    .from('truck_status')
    .select('*')
    .limit(1)
    .single();
  if (!error && data) notify(data);
}

let subStarted = false;
function startSub() {
  if (subStarted) return;
  subStarted = true;
  fetchTruck();
  supabase
    .channel('truck_status_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'truck_status' }, payload => {
      if (payload.new) notify(payload.new);
    })
    .subscribe();
}

export function useTruckData() {
  const [truckData, setTruckData] = useState(cache || FALLBACK);

  useEffect(() => {
    if (cache) setTruckData(cache);
    listeners.push(setTruckData);
    startSub();
    return () => { listeners = listeners.filter(fn => fn !== setTruckData); };
  }, []);

  return truckData;
}

export async function saveTruckData(data) {
  const { error } = await supabase
    .from('truck_status')
    .update(data)
    .neq('id', '00000000-0000-0000-0000-000000000000');
  if (!error) notify(data);
  return !error;
}
