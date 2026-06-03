import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { X, ChevronRight, ChevronLeft, Check } from "lucide-react";

const GOLD = "#c9940a";
const STORAGE_KEY = "cheezies_checklist_week";

function getThisWeek() {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split("T")[0];
}

export default function WeeklyChecklistDialog({ onClose, onNavigate }) {
  const [step, setStep] = useState(0);
  const [checks, setChecks] = useState({});
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    // Load analytics snapshot for the dialog
    const load = async () => {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const [subscribers, events, menuItems, pageViews, truckLocations] = await Promise.all([
        base44.entities.NewsletterSubscriber.list("-created_date", 2000),
        base44.entities.Event.list("-date", 20),
        base44.entities.MenuItem.list(),
        base44.entities.PageView.list("-created_date", 500),
        base44.entities.TruckLocation.list("-updated_date", 1),
      ]);

      const newSubs = subscribers.filter(s => new Date(s.created_date) >= oneWeekAgo).length;
      const recentViews = pageViews.filter(v => new Date(v.created_date) >= oneWeekAgo).length;
      const uniqueSessions = new Set(pageViews.filter(v => new Date(v.created_date) >= oneWeekAgo).map(v => v.session_id)).size;
      const upcomingEvents = events.filter(e => new Date(e.date) >= new Date() && e.is_active !== false).length;
      const activeMenu = menuItems.filter(i => i.is_active !== false).length;
      const truck = truckLocations[0];

      setAnalytics({ newSubs, recentViews, uniqueSessions, upcomingEvents, activeMenu, truck, totalSubs: subscribers.length });
    };
    load();
  }, []);

  const toggle = (key) => setChecks(prev => ({ ...prev, [key]: !prev[key] }));

  const STEPS = [
    {
      id: "analytics",
      title: "📊 Weekly Analytics Review",
      subtitle: "How did the week go?",
      content: () => (
        <div className="flex flex-col gap-3">
          {analytics ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Site Visitors (7d)", value: analytics.recentViews, sub: `${analytics.uniqueSessions} unique` },
                  { label: "New Subscribers", value: analytics.newSubs, sub: `${analytics.totalSubs} total` },
                  { label: "Active Menu Items", value: analytics.activeMenu, sub: "on the menu" },
                  { label: "Upcoming Events", value: analytics.upcomingEvents, sub: "scheduled" },
                ].map(({ label, value, sub }) => (
                  <div key={label} className="rounded-xl p-4" style={{ background: "#fffbf0", border: "1px solid rgba(180,120,0,0.12)" }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "rgba(61,34,0,0.4)" }}>{label}</p>
                    <p className="text-2xl font-black" style={{ color: GOLD }}>{value}</p>
                    <p className="text-xs" style={{ color: "rgba(61,34,0,0.45)" }}>{sub}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl p-4" style={{ background: analytics.truck?.status === "open" ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.06)", border: "1px solid rgba(180,120,0,0.12)" }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "rgba(61,34,0,0.4)" }}>Truck Status</p>
                <p className="font-black" style={{ color: analytics.truck?.status === "open" ? "#22c55e" : "#ef4444" }}>
                  {analytics.truck?.status === "open" ? "🟢 Open" : analytics.truck?.status === "en_route" ? "🟡 En Route" : "🔴 Closed"}
                </p>
                {analytics.truck?.address && <p className="text-xs mt-0.5" style={{ color: "rgba(61,34,0,0.5)" }}>{analytics.truck.address}</p>}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-sm" style={{ color: "rgba(61,34,0,0.4)" }}>Loading your weekly data…</div>
          )}
        </div>
      ),
    },
    {
      id: "menu",
      title: "🍽️ Menu Check",
      subtitle: "Is your menu up to date?",
      items: [
        { key: "menu_active", label: "All active items are available and in stock" },
        { key: "menu_special", label: "Weekly specials are updated (max 3 shown)" },
        { key: "menu_prices", label: "Prices are correct and up to date" },
        { key: "menu_featured", label: "Featured items on homepage look good" },
      ],
      action: { label: "→ Go to Menu Manager", tab: "menu" },
    },
    {
      id: "events",
      title: "📅 Events & Schedule",
      subtitle: "Keep your calendar current",
      items: [
        { key: "events_upcoming", label: "Upcoming events are posted and active" },
        { key: "events_featured", label: "Best event is featured on the homepage" },
        { key: "events_past", label: "Past events have been reviewed/archived" },
        { key: "events_location", label: "Truck location is set for today" },
      ],
      action: { label: "→ Go to Events Manager", tab: "events" },
    },
    {
      id: "social",
      title: "📣 Social Media Checklist",
      subtitle: "Stay active on your channels",
      items: [
        { key: "social_fb_location", label: "Posted today's location on Facebook" },
        { key: "social_ig_story", label: "Posted a Story on Instagram" },
        { key: "social_tiktok", label: "Uploaded or scheduled a TikTok" },
        { key: "social_google", label: "Responded to any new Google Reviews" },
        { key: "social_fb_event", label: "Created Facebook Event for next pop-up (if applicable)" },
      ],
    },
    {
      id: "crm",
      title: "📬 CRM & Subscribers",
      subtitle: "Engage your audience",
      items: [
        { key: "crm_new_subs", label: "Reviewed new subscriber signups" },
        { key: "crm_email", label: "Sent or scheduled a newsletter to subscribers" },
        { key: "crm_promo", label: "Reminded unclaimed promo holders to redeem" },
      ],
      action: { label: "→ Go to CRM", tab: "crm" },
    },
    {
      id: "financials",
      title: "💰 Log This Week's Finances",
      subtitle: "Track your P&L while it's fresh",
      items: [
        { key: "fin_sales", label: "Entered this week's gross sales" },
        { key: "fin_labor", label: "Logged labor/wages paid" },
        { key: "fin_food", label: "Logged food and ingredient costs" },
        { key: "fin_other", label: "Logged fuel and any other expenses" },
      ],
      action: { label: "→ Go to Financials", tab: "financials" },
    },
  ];

  const currentStep = STEPS[step];
  const totalChecked = Object.values(checks).filter(Boolean).length;
  const totalCheckable = STEPS.reduce((acc, s) => acc + (s.items?.length || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col" style={{ background: "#fff", maxHeight: "90vh" }}>
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between shrink-0" style={{ background: "#2a1200", borderBottom: "2px solid #c9940a" }}>
          <div>
            <p className="font-black text-base" style={{ color: "#fff8e8" }}>Weekly Mission Briefing 🎯</p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,248,232,0.5)" }}>
              Step {step + 1} of {STEPS.length} · {totalChecked}/{totalCheckable} complete
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full transition-opacity hover:opacity-70" style={{ color: "rgba(255,248,232,0.6)" }}>
            <X size={18} />
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: "rgba(180,120,0,0.15)" }}>
          <div style={{ height: 3, background: GOLD, width: `${((step + 1) / STEPS.length) * 100}%`, transition: "width 0.3s" }} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <h2 className="font-black text-xl mb-1" style={{ color: "#2a1200" }}>{currentStep.title}</h2>
          <p className="text-sm mb-5" style={{ color: "rgba(61,34,0,0.5)" }}>{currentStep.subtitle}</p>

          {currentStep.content ? (
            currentStep.content()
          ) : (
            <div className="flex flex-col gap-3">
              {currentStep.items?.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => toggle(key)}
                  className="flex items-center gap-3 p-4 rounded-xl text-left transition-all"
                  style={{
                    background: checks[key] ? "rgba(34,197,94,0.08)" : "#fffbf0",
                    border: `1.5px solid ${checks[key] ? "#22c55e40" : "rgba(180,120,0,0.15)"}`,
                  }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: checks[key] ? "#22c55e" : "rgba(180,120,0,0.1)", border: checks[key] ? "none" : "1.5px solid rgba(180,120,0,0.25)" }}>
                    {checks[key] && <Check size={12} color="white" strokeWidth={3} />}
                  </div>
                  <span className="text-sm font-semibold" style={{ color: checks[key] ? "#166534" : "#3d2200" }}>{label}</span>
                </button>
              ))}

              {currentStep.action && (
                <button
                  onClick={() => { onNavigate(currentStep.action.tab); onClose(); }}
                  className="mt-2 text-sm font-black px-4 py-3 rounded-xl text-left"
                  style={{ background: `${GOLD}18`, color: GOLD, border: `1.5px solid ${GOLD}40` }}>
                  {currentStep.action.label}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div className="px-6 py-4 flex items-center justify-between gap-3 shrink-0" style={{ borderTop: "1px solid rgba(180,120,0,0.1)" }}>
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-30"
            style={{ background: "rgba(0,0,0,0.05)", color: "#555" }}>
            <ChevronLeft size={16} /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold"
              style={{ background: GOLD, color: "#fff8e8" }}>
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={() => { localStorage.setItem(STORAGE_KEY, getThisWeek()); onClose(); }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold"
              style={{ background: "#22c55e", color: "#fff" }}>
              <Check size={16} /> Done for This Week!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}