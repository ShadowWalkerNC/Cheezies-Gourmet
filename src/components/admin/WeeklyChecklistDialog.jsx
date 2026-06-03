import { useState } from "react";
import { X, Check } from "lucide-react";

const CHECKLIST_KEY = "cheezies_checklist_week";

function getThisWeek() {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split("T")[0];
}

const STEPS = [
  {
    id: "analytics",
    emoji: "📊",
    title: "Review Analytics",
    desc: "Check your visitor stats, top pages, and subscriber growth from last week.",
    action: "View Analytics",
    tab: "analytics",
  },
  {
    id: "menu",
    emoji: "🍽️",
    title: "Menu Check",
    desc: "Are all active items still available? Any 86'd items to hide? Add weekly specials.",
    action: "Manage Menu",
    tab: "menu",
  },
  {
    id: "events",
    emoji: "📅",
    title: "Events & Schedule",
    desc: "Any upcoming events to add or promote? Update the truck location for today.",
    action: "Manage Events",
    tab: "events",
  },
  {
    id: "social",
    emoji: "📣",
    title: "Social Media",
    desc: "Post today's location on Facebook & Instagram. Reply to any DMs or comments.",
    action: null,
    links: [
      { label: "Facebook", url: "https://www.facebook.com/cheeziesohio" },
      { label: "Instagram", url: "https://instagram.com/cheeziesohio" },
    ],
  },
  {
    id: "crm",
    emoji: "📬",
    title: "CRM Check",
    desc: "Review new subscribers, send a weekly email blast if you have something to share.",
    action: "Open CRM",
    tab: "crm",
  },
  {
    id: "financials",
    emoji: "💰",
    title: "Log This Week's Numbers",
    desc: "Enter sales and costs so you can track profitability over time.",
    action: "Log Financials",
    tab: "financials",
  },
];

export default function WeeklyChecklistDialog({ onClose, onNavigate }) {
  const [checked, setChecked] = useState(new Set());

  const toggle = (id) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDone = () => {
    localStorage.setItem(CHECKLIST_KEY, getThisWeek());
    onClose();
  };

  const allDone = checked.size === STEPS.length;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4" style={{ background: "rgba(26,8,0,0.65)", backdropFilter: "blur(6px)" }}>
      <div className="w-full max-w-lg rounded-3xl overflow-hidden" style={{ background: "#fff", boxShadow: "0 32px 80px rgba(100,50,0,0.35)", maxHeight: "90vh" }}>
        {/* Header */}
        <div className="px-7 pt-7 pb-5 flex items-start justify-between" style={{ background: "linear-gradient(135deg, #c9940a 0%, #f5c518 100%)" }}>
          <div>
            <p className="text-xs font-black tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(255,248,232,0.75)" }}>Weekly Brief</p>
            <h2 className="font-black text-2xl leading-tight" style={{ fontFamily: "Georgia, serif", color: "#fff8e8" }}>
              🎯 Admin Checklist
            </h2>
            <p className="text-sm mt-1" style={{ color: "rgba(255,248,232,0.8)" }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
          <button onClick={handleDone} className="p-2 rounded-full hover:bg-white/20 transition-all" style={{ color: "#fff8e8" }}>
            <X size={20} />
          </button>
        </div>

        {/* Steps */}
        <div className="overflow-y-auto px-6 py-5 flex flex-col gap-3" style={{ maxHeight: "calc(90vh - 200px)" }}>
          {STEPS.map((step) => {
            const done = checked.has(step.id);
            return (
              <div
                key={step.id}
                className="rounded-2xl p-4 flex gap-4 items-start transition-all"
                style={{
                  background: done ? "rgba(34,197,94,0.06)" : "#fffbf0",
                  border: `1.5px solid ${done ? "#86efac" : "rgba(180,120,0,0.15)"}`,
                }}
              >
                <button
                  onClick={() => toggle(step.id)}
                  className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all"
                  style={{
                    background: done ? "#22c55e" : "rgba(201,148,10,0.1)",
                    border: `2px solid ${done ? "#22c55e" : "rgba(180,120,0,0.25)"}`,
                  }}
                >
                  {done && <Check size={14} color="#fff" strokeWidth={3} />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{step.emoji}</span>
                    <p className={`font-black text-sm ${done ? "line-through opacity-50" : ""}`} style={{ color: "#2a1200" }}>
                      {step.title}
                    </p>
                  </div>
                  <p className="text-xs mb-2" style={{ color: "rgba(61,34,0,0.55)" }}>{step.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {step.action && step.tab && (
                      <button
                        onClick={() => { toggle(step.id); onNavigate(step.tab); }}
                        className="text-xs px-3 py-1.5 rounded-lg font-bold transition-all hover:opacity-80"
                        style={{ background: "#c9940a", color: "#fff8e8" }}
                      >
                        {step.action} →
                      </button>
                    )}
                    {step.links?.map(l => (
                      <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
                        onClick={() => toggle(step.id)}
                        className="text-xs px-3 py-1.5 rounded-lg font-bold transition-all hover:opacity-80"
                        style={{ background: "rgba(201,148,10,0.12)", color: "#7a4f00", textDecoration: "none" }}>
                        {l.label} ↗
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-5" style={{ borderTop: "1px solid rgba(180,120,0,0.12)" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(180,120,0,0.1)" }}>
              <div className="h-2 rounded-full transition-all" style={{ width: `${(checked.size / STEPS.length) * 100}%`, background: allDone ? "#22c55e" : "#c9940a" }} />
            </div>
            <span className="text-xs font-black" style={{ color: allDone ? "#22c55e" : "#c9940a" }}>
              {checked.size}/{STEPS.length}
            </span>
          </div>
          <button
            onClick={handleDone}
            className="w-full py-3.5 rounded-2xl font-black text-base transition-all"
            style={{ background: allDone ? "#22c55e" : "#2a1200", color: "#fff8e8" }}
          >
            {allDone ? "✓ All Done — Great Week!" : "Dismiss for This Week"}
          </button>
        </div>
      </div>
    </div>
  );
}