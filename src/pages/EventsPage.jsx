import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import eventsData from "@/data/events.json";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";
import { Calendar, MapPin, Clock, ExternalLink } from "lucide-react";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function isPast(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr + "T00:00:00") < new Date(new Date().toDateString());
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("upcoming");

  useEffect(() => {
    setEvents(eventsData);
    setLoading(false);
  }, []);

  const upcoming = events.filter(e => !isPast(e.date));
  const past = events.filter(e => isPast(e.date));
  const displayed = tab === "upcoming" ? upcoming : past;

  return (
    <div className="min-h-screen font-sans" style={{ background: "#fdf6e3" }}>
      <NavBar />
      <div style={{ height: "calc(93px + var(--safe-top))" }} />
      <PageTransition>
        <div className="px-6 py-14 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "#c9940a" }}>Where We'll Be</p>
            <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: "Georgia, serif", color: "#2a1200" }}>Events</h1>
            <div className="w-12 h-1 mx-auto rounded-full mb-6" style={{ background: "#c9940a" }} />
            <p className="text-sm max-w-lg mx-auto" style={{ color: "rgba(61,34,0,0.6)" }}>
              Find us at festivals, markets, and private events across Akron and beyond. Follow us on Facebook for real-time updates.
            </p>
            <a
              href="https://www.facebook.com/cheeziesohio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full font-bold text-sm"
              style={{ background: "#1877f2", color: "#fff", textDecoration: "none" }}
            >
              Follow on Facebook ↗
            </a>
          </motion.div>

          <div className="flex rounded-xl overflow-hidden mb-8 max-w-xs mx-auto" style={{ border: "1.5px solid rgba(180,120,0,0.2)" }}>
            {["upcoming", "past"].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="flex-1 py-2.5 text-sm font-black tracking-wide uppercase capitalize"
                style={{ background: tab === t ? "#c9940a" : "#fff", color: tab === t ? "#fff8e8" : "rgba(61,34,0,0.5)", border: "none", cursor: "pointer" }}>
                {t}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
            </div>
          ) : displayed.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📅</div>
              <p className="font-black text-lg mb-2" style={{ color: "#2a1200" }}>
                {tab === "upcoming" ? "No upcoming events yet" : "No past events"}
              </p>
              <p className="text-sm" style={{ color: "rgba(61,34,0,0.5)" }}>
                {tab === "upcoming" ? "Check back soon or follow us on Facebook for announcements!" : ""}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {displayed.map((event, i) => (
                <motion.div key={event.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="rounded-3xl overflow-hidden"
                  style={{ background: "#fff", border: "1.5px solid rgba(180,120,0,0.15)", boxShadow: "0 4px 20px rgba(180,120,0,0.08)" }}>
                  {event.img && (
                    <div className="relative h-44 overflow-hidden">
                      <img src={event.img} alt={event.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(30,12,0,0.6) 0%, transparent 60%)" }} />
                      {event.is_featured && (
                        <span className="absolute top-3 left-3 text-xs font-black px-2.5 py-1 rounded-full" style={{ background: "#c9940a", color: "#fff8e8" }}>⭐ Featured</span>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
                        <h3 className="font-black text-white text-base leading-tight">{event.title}</h3>
                      </div>
                    </div>
                  )}
                  <div className="px-5 py-4">
                    {!event.img && <h3 className="font-black text-lg mb-3" style={{ color: "#2a1200" }}>{event.title}</h3>}
                    <div className="flex flex-col gap-2 mb-3">
                      <div className="flex items-center gap-2 text-sm" style={{ color: "rgba(61,34,0,0.7)" }}>
                        <Calendar size={14} style={{ color: "#c9940a", flexShrink: 0 }} />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      {(event.time_start || event.time_end) && (
                        <div className="flex items-center gap-2 text-sm" style={{ color: "rgba(61,34,0,0.7)" }}>
                          <Clock size={14} style={{ color: "#c9940a", flexShrink: 0 }} />
                          <span>{event.time_start}{event.time_end ? ` – ${event.time_end}` : ""}</span>
                        </div>
                      )}
                      {(event.location_name || event.address) && (
                        <div className="flex items-center gap-2 text-sm" style={{ color: "rgba(61,34,0,0.7)" }}>
                          <MapPin size={14} style={{ color: "#c9940a", flexShrink: 0 }} />
                          <span>{event.location_name}{event.address ? ` · ${event.address}` : ""}</span>
                        </div>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(61,34,0,0.6)" }}>{event.description}</p>
                    )}
                    {event.facebook_event_url && (
                      <a href={event.facebook_event_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm"
                        style={{ background: "#1877f2", color: "#fff", textDecoration: "none" }}>
                        <ExternalLink size={13} /> View on Facebook
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        <Footer />
        <div className="md:hidden" style={{ height: "var(--tab-bar-h)" }} />
      </PageTransition>
    </div>
  );
}
