import { useState } from "react";
import { supabase } from "@/api/supabaseClient";

const FORMSPREE_CONTACT = "https://formspree.io/f/xpqgqoaa";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("idle");

  const inputStyle = {
    background: "#fffbf0", border: "1.5px solid rgba(180,120,0,0.22)", color: "#2a1200",
    borderRadius: "0.75rem", padding: "0.75rem 1rem", width: "100%", fontSize: "0.9rem", outline: "none",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      // Primary: Formspree (email notification)
      const res = await fetch(FORMSPREE_CONTACT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        const submitted = { ...form };
        setForm({ name: "", email: "", phone: "", message: "" });
        // Secondary: Supabase log (fire-and-forget — never blocks the user)
        supabase
          .from("contact_submissions")
          .insert([{ name: submitted.name, email: submitted.email, phone: submitted.phone || null, message: submitted.message, source: "contact_form" }])
          .then(({ error }) => { if (error) console.warn("[Supabase] contact_submissions:", error.message); });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl p-8 text-center" style={{ background: "#fff", border: "1.5px solid rgba(180,120,0,0.18)" }}>
        <div className="text-4xl mb-3">🧀</div>
        <h3 className="font-black text-xl mb-2" style={{ color: "#2a1200" }}>Message Sent!</h3>
        <p className="text-sm" style={{ color: "rgba(61,34,0,0.6)" }}>We got it and will get back to you soon.</p>
        <button onClick={() => setStatus("idle")} className="mt-5 px-6 py-2.5 rounded-full font-bold text-sm" style={{ background: "#c9940a", color: "#fff8e8" }}>Send Another</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl p-6 flex flex-col gap-4" style={{ background: "#fff", border: "1.5px solid rgba(180,120,0,0.18)" }}>
      <div>
        <p className="text-xs font-black tracking-[0.2em] uppercase mb-1" style={{ color: "#c9940a" }}>Send Us a Message</p>
        <p className="text-xs" style={{ color: "rgba(61,34,0,0.5)" }}>We'll reply to your email within 24 hours.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(61,34,0,0.5)" }}>Name *</label>
          <input type="text" required placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(61,34,0,0.5)" }}>Email *</label>
          <input type="email" required placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(61,34,0,0.5)" }}>Phone (optional)</label>
        <input type="tel" placeholder="330-xxx-xxxx" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} style={inputStyle} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(61,34,0,0.5)" }}>Message *</label>
        <textarea required rows={4} placeholder="What's on your mind?" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} style={{ ...inputStyle, resize: "none" }} />
      </div>
      {status === "error" && <p className="text-sm text-red-500">Something went wrong. Please try again or call us at 330-510-8875.</p>}
      <button type="submit" disabled={status === "sending"} className="w-full py-3.5 rounded-xl font-black text-sm tracking-widest uppercase transition-opacity hover:opacity-85" style={{ background: "#c9940a", color: "#fff8e8", opacity: status === "sending" ? 0.7 : 1 }}>{status === "sending" ? "Sending…" : "Send Message →"}</button>
    </form>
  );
}
