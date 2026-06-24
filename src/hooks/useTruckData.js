import { useState, useEffect } from "react";

// Default static truck info — edit here or via the Admin page
const STATIC_DEFAULT = {
  status: "closed",
  address: "Akron, Ohio",
  home_address: "Akron, Ohio",
  hours_open: "11:00 AM",
  hours_close: "6:00 PM",
  open_days: ["Wednesday", "Thursday", "Friday", "Saturday"],
  note: "",
  latitude: null,
  longitude: null,
};

function getTruckData() {
  try {
    const saved = localStorage.getItem("cheezies_truck");
    if (saved) return { ...STATIC_DEFAULT, ...JSON.parse(saved) };
  } catch {}
  return STATIC_DEFAULT;
}

let listeners = [];

export function notifyTruckUpdate(data) {
  try { localStorage.setItem("cheezies_truck", JSON.stringify(data)); } catch {}
  listeners.forEach(fn => fn(data));
}

export function useTruckData() {
  const [truckData, setTruckData] = useState(getTruckData);

  useEffect(() => {
    listeners.push(setTruckData);
    return () => { listeners = listeners.filter(fn => fn !== setTruckData); };
  }, []);

  return truckData;
}
