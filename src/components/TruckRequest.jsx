import { useState } from "react";
import { base44 } from "@/api/base44Client";

export default function TruckRequest() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", type: "location", details: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await base44.functions.invoke("sendNotification", { type: "truck_request", data: form });
    setSending(false);
    setSent(true);
  };

  return (
    <section className="py-16 px-6" style={{ background: "#fff8e8" }}>
      <div className="max-w-xl mx-auto">
        <p className="text-xs font-bold tracking-[0.3em] uppercase mb-2 text-center" style={{ color: "#c9940a" }}>Book the Truck</p>
        <h2 className="text-3xl font-black text-center mb-2" style={{ fontFamily: "Georgia, serif", color: "#2a1200" }}>
          Request a Location or Event
        </h2>
        <p className="text-sm text-center mb-8" style={{ color: "rgba(61,34,0,0.55)" }}>
          Want Cheezies at your neighborhood, office, or event? Send us a request and we'll be in touch!
        </p>

        {sent ? (
          <div className="text-center py-10 rounded-2xl" style={{ background: "#fffbf0", border: "1.5px solid rgba(180,120,0,0.18)" }}>
            <div className="text-5xl mb-3">🧀</div>
            <p className="font-black text-xl mb-1" style={{ color: "#2a1200" }}>Request Received!</p>
            <p className="text-sm" style={{ color: "rgba(61,34,0,0.55)" }}>We'll reach out soon. Thanks for the invite!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl p-6" style={{ background: "#fffbf0", border: "1.5px solid rgba(180,120,0,0.18)" }}>
            {/* Type toggle */}
            <div className="flex gap-2">
              {[{ value: "location", label: "📍 Location Request" }, { value: "event", label: "🎉 Event Booking" }].map(opt => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setForm(f => ({ ...f, type: opt.value }))}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: form.type === opt.value ? "#c9940a" : "rgba(201,148,10,0.08)",
                    color: form.type === opt.value ? "#fff8e8" : "#7a4f00",
                    border: `1.5px solid ${form.type === opt.value ? "#c9940a" : "rgba(180,120,0,0.2)"}`,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <input
              required
              placeholder="Your name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: "#fff", border: "1.5px solid rgba(180,120,0,0.2)", color: "#2a1200" }}
            />
            <input
              required
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: "#fff", border: "1.5px solid rgba(180,120,0,0.2)", color: "#2a1200" }}
            />
            <input
              placeholder="Phone number (optional)"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: "#fff", border: "1.5px solid rgba(180,120,0,0.2)", color: "#2a1200" }}
            />
            <textarea
              required
              rows={3}
              placeholder={form.type === "location" ? "Where would you like us? (neighborhood, street, business, etc.)" : "Tell us about your event — date, location, estimated guests…"}
              value={form.details}
              onChange={e => setForm(f => ({ ...f, details: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
              style={{ background: "#fff", border: "1.5px solid rgba(180,120,0,0.2)", color: "#2a1200" }}
            />
            <button
              type="submit"
              disabled={sending}
              className="w-full py-3.5 rounded-xl font-black text-base transition-all hover:scale-[1.02]"
              style={{ background: "#c9940a", color: "#fff8e8", boxShadow: "0 4px 20px rgba(180,120,0,0.25)" }}
            >
              {sending ? "Sending…" : "Send Request"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}