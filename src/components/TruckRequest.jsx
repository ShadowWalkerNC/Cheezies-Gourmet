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
    <section className="py-16 px-6" style={{ background: "#f9f4ea", borderTop: "1.5px solid #e8e0d0" }}>
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-start">
        {/* Form */}
        <div className="flex-1 w-full">
          <p className="text-xs font-black tracking-[0.25em] uppercase mb-2" style={{ color: "#c9940a" }}>Request a Location or Event</p>
          <h2 className="font-black mb-2" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", color: "#1a0800", lineHeight: 1.1 }}>
            Request a Location or Event
          </h2>
          <p className="text-sm mb-8" style={{ color: "rgba(61,34,0,0.55)" }}>
            Want Cheezies at your neighborhood, office, or event? Send us a request and we'll be in touch.
          </p>

          {sent ? (
            <div className="text-center py-10" style={{ background: "#fff", border: "1.5px solid #e8e0d0" }}>
              <div className="text-5xl mb-3">🧀</div>
              <p className="font-black text-xl mb-1" style={{ color: "#1a0800" }}>Request Received!</p>
              <p className="text-sm" style={{ color: "rgba(61,34,0,0.55)" }}>We'll reach out soon. Thanks for the invite!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {/* Type toggle */}
              <div className="flex gap-2 mb-1">
                {[{ value: "location", label: "📍 Location Request" }, { value: "event", label: "🎉 Event Booking" }].map(opt => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setForm(f => ({ ...f, type: opt.value }))}
                    className="flex-1 py-2.5 text-xs font-black tracking-widest uppercase transition-all"
                    style={{
                      background: form.type === opt.value ? "#c9940a" : "#fff",
                      color: form.type === opt.value ? "#fff" : "#7a4f00",
                      border: `1.5px solid ${form.type === opt.value ? "#c9940a" : "#e8e0d0"}`,
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
                className="w-full px-4 py-3 text-sm outline-none"
                style={{ background: "#fff", border: "1.5px solid #e8e0d0", color: "#1a0800" }}
              />
              <input
                required
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-3 text-sm outline-none"
                style={{ background: "#fff", border: "1.5px solid #e8e0d0", color: "#1a0800" }}
              />
              <input
                placeholder="Phone number (optional)"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full px-4 py-3 text-sm outline-none"
                style={{ background: "#fff", border: "1.5px solid #e8e0d0", color: "#1a0800" }}
              />
              <textarea
                required
                rows={3}
                placeholder={form.type === "location" ? "Where would you like us? (neighborhood, street, business, etc.)" : "Tell us about your event — date, location, estimated guests…"}
                value={form.details}
                onChange={e => setForm(f => ({ ...f, details: e.target.value }))}
                className="w-full px-4 py-3 text-sm outline-none resize-none"
                style={{ background: "#fff", border: "1.5px solid #e8e0d0", color: "#1a0800" }}
              />
              <button
                type="submit"
                disabled={sending}
                className="w-full py-4 font-black text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-85"
                style={{ background: "#c9940a", color: "#fff", border: "none", cursor: "pointer" }}
              >
                {sending ? "Sending…" : "Send Request"}
              </button>
            </form>
          )}
        </div>

        {/* Side callout — bold brand text */}
        <div className="hidden lg:flex flex-col justify-center w-80 flex-shrink-0">
          <h3
            className="font-black uppercase leading-none"
            style={{ fontSize: "3.8rem", color: "#1a0800", letterSpacing: "-0.02em", lineHeight: 0.9 }}
          >
            WE GO<br />WHERE<br />YOU ARE.<br />
            <span style={{ color: "#c9940a" }}>BRING<br />THE<br />TRUCK<br />TO YOU.</span>
          </h3>
          <p className="mt-6 text-sm leading-relaxed" style={{ color: "rgba(61,34,0,0.55)", maxWidth: "260px" }}>
            Office lunches, birthday parties, block parties — we scale up for any crowd, any occasion.
          </p>
        </div>
      </div>
    </section>
  );
}