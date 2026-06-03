import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

// Cache shared across all hook consumers within the same session
let cache = null;
let listeners = [];
let subscribed = false;

function notify(data) {
  cache = data;
  listeners.forEach(fn => fn(data));
}

function subscribe() {
  if (subscribed) return;
  subscribed = true;
  // Initial fetch
  base44.entities.TruckLocation.list("-updated_date", 1).then(records => {
    if (records.length > 0) notify(records[0]);
  });
  // Real-time updates — one shared subscription
  base44.entities.TruckLocation.subscribe(event => {
    if (event.type === "create" || event.type === "update") notify(event.data);
  });
}

export function useTruckData() {
  const [truckData, setTruckData] = useState(cache);

  useEffect(() => {
    // If already cached, use it immediately
    if (cache) setTruckData(cache);

    // Register listener
    listeners.push(setTruckData);
    subscribe();

    return () => {
      listeners = listeners.filter(fn => fn !== setTruckData);
    };
  }, []);

  return truckData;
}