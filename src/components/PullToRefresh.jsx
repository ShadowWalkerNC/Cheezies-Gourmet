import { useState, useRef, useEffect } from "react";

const THRESHOLD = 72;  // px of overscroll before triggering
const RESISTANCE = 0.4; // damping factor

export default function PullToRefresh({ onRefresh, children }) {
  const [pullY, setPullY] = useState(0);       // current pull distance (clamped)
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(null);
  const pulling = useRef(false);

  const canPull = () => window.scrollY === 0;

  const onTouchStart = (e) => {
    if (!canPull()) return;
    startY.current = e.touches[0].clientY;
    pulling.current = true;
  };

  const onTouchMove = (e) => {
    if (!pulling.current || startY.current === null) return;
    const delta = (e.touches[0].clientY - startY.current) * RESISTANCE;
    if (delta > 0) {
      setPullY(Math.min(delta, THRESHOLD * 1.4));
    }
  };

  const onTouchEnd = async () => {
    if (!pulling.current) return;
    pulling.current = false;
    if (pullY >= THRESHOLD && !refreshing) {
      setRefreshing(true);
      setPullY(THRESHOLD * 0.7);
      await onRefresh();
      setRefreshing(false);
    }
    setPullY(0);
    startY.current = null;
  };

  const progress = Math.min(pullY / THRESHOLD, 1);
  const showIndicator = pullY > 4;

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ position: "relative" }}
    >
      {/* Indicator */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          height: Math.max(pullY, refreshing ? THRESHOLD * 0.7 : 0),
          overflow: "hidden",
          zIndex: 10,
          transition: pulling.current ? "none" : "height 0.3s ease",
          pointerEvents: "none",
        }}
      >
        {(showIndicator || refreshing) && (
          <div
            style={{
              marginBottom: 12,
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "rgba(245,197,24,0.12)",
              border: "1.5px solid rgba(245,197,24,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: Math.max(progress, refreshing ? 1 : 0),
              transform: `scale(${0.6 + progress * 0.4})`,
              transition: pulling.current ? "none" : "opacity 0.2s, transform 0.2s",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className={refreshing ? "ptr-spinner" : ""}
              style={{
                transform: refreshing ? undefined : `rotate(${progress * 360}deg)`,
                transition: refreshing ? "none" : "transform 0.05s linear",
              }}
            >
              <circle cx="8" cy="8" r="6" stroke="rgba(245,197,24,0.25)" strokeWidth="2" />
              <path
                d="M8 2 A6 6 0 0 1 14 8"
                stroke="#f5c518"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content shifted down during pull */}
      <div
        style={{
          transform: `translateY(${refreshing ? THRESHOLD * 0.7 : pullY}px)`,
          transition: pulling.current ? "none" : "transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
      >
        {children}
      </div>
    </div>
  );
}