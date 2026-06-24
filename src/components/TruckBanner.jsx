import { useNavigate } from "react-router-dom";
import { useTruckData } from "../hooks/useTruckData";
import { MapPin } from "lucide-react";

const statusConfig = {
  open:     { label: "Open Now", bg: "#dcfce7", color: "#15803d" },
  closed:   { label: "Closed",   bg: "#fee2e2", color: "#b91c1c" },
  en_route: { label: "En Route", bg: "#fef9c3", color: "#a16207" },
};

export default function TruckBanner() {
  const truckData = useTruckData();
  const navigate = useNavigate();

  const status = truckData?.status || "closed";
  const sc = statusConfig[status] || statusConfig.closed;
  const isClosed = status === "closed";
  const address = !isClosed && truckData?.address ? truckData.address : (truckData?.home_address || "Akron, Ohio");

  return (
    <div
      className="w-full px-4 py-3 flex items-center justify-between gap-4"
      style={{ background: "#1a0800", borderBottom: "2px solid #c9940a" }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <MapPin className="w-4 h-4 shrink-0" style={{ color: "#c9940a" }} />
        <span className="text-sm font-black truncate" style={{ color: "#fff8e8" }}>
          {address}
        </span>
        <span
          className="shrink-0 text-xs font-black px-2 py-0.5 rounded"
          style={{ background: sc.bg, color: sc.color }}
        >
          {sc.label}
        </span>
        {truckData?.note && (
          <span className="hidden md:inline text-xs truncate" style={{ color: "rgba(255,248,232,0.5)" }}>
            — {truckData.note}
          </span>
        )}
      </div>
      <button
        onClick={() => { navigate("/FindUs"); window.scrollTo({ top: 0, behavior: "instant" }); }}
        className="shrink-0 text-xs font-black tracking-widest uppercase px-4 py-2 transition-opacity hover:opacity-80"
        style={{ background: "#c9940a", color: "#fff", border: "none", cursor: "pointer" }}
      >
        Live Tracker →
      </button>
    </div>
  );
}
