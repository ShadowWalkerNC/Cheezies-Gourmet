import { motion } from "framer-motion";
import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { ChevronDown } from "lucide-react";
import BottomSheet from "./BottomSheet";

const packages = [
  {
    icon: "🎉",
    name: "Party Pack",
    size: "Up to 50 guests",
    desc: "Perfect for birthday parties, family gatherings, or casual office lunches.",
    includes: ["2-hour service window", "3 sandwich varieties", "Sides & drinks add-on available", "Setup & breakdown included"],
  },
  {
    icon: "🏢",
    name: "Corporate Melt",
    size: "50–150 guests",
    featured: true,
    desc: "Fuel your team with something way better than boxed sandwiches. We bring the truck to you.",
    includes: ["3-hour service window", "Full menu available", "Branded signage optional", "Invoice-friendly billing"],
  },
  {
    icon: "💍",
    name: "Grand Event",
    size: "150+ guests",
    desc: "Weddings, festivals, large corporate events — we scale up and show up.",
    includes: ["Custom hours", "Custom menu collaboration", "Dedicated event coordinator", "Full logistics support"],
  },
];

const EVENT_TYPES = [
  "Birthday Party",
  "Corporate Lunch",
  "Wedding",
  "Festival / Outdoor Event",
  "School / Campus Event",
  "Office Catering",
  "Private Party",
  "Other",
];

const GUEST_RANGES = [
  "Under 25",
  "25–50",
  "50–100",
  "100–150",
  "150–300",
  "300+",
];

const inputStyle = {
  background: "#fffbf0",
  border: "1px solid rgba(180,120,0,0.2)",
  borderRadius: "12px",
  color: "#3d2200",
  padding: "12px 16px",
  width: "100%",
  outline: "none",
  fontSize: "15px",
  appearance: "none",
  WebkitAppearance: "none",
};

function SheetSelect({ label, value, onChange, options, placeholder, required }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <label className="block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "rgba(120,70,0,0.7)" }}>
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-between select-none active:opacity-70 transition-opacity"
        style={{
          ...inputStyle,
          paddingRight: "40px",
          cursor: "pointer",
          color: value ? "#3d2200" : "rgba(80,45,0,0.35)",
          textAlign: "left",
          position: "relative",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <span>{value || placeholder}</span>
        <ChevronDown
          size={16}
          style={{ color: "rgba(180,120,0,0.5)", position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}
        />
      </button>
      {/* Hidden native input for form validation */}
      {required && (
        <input
          tabIndex={-1}
          required
          value={value}
          onChange={() => {}}
          style={{ position: "absolute", opacity: 0, height: 0, width: 0, pointerEvents: "none" }}
        />
      )}
      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title={label}
        options={options}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default function Catering() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", event_type: "", date: "", guests: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.integrations.Core.SendEmail({
      to: "cheeziesgourmet@gmail.com",
      subject: `Catering Inquiry from ${form.name}`,
      body: `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nEvent Type: ${form.event_type}\nDate: ${form.date}\nGuests: ${form.guests}\n\nMessage:\n${form.message}`,
    });
    setSubmitting(false);
    setForm({ name: "", email: "", phone: "", event_type: "", date: "", guests: "", message: "" });
    toast({ title: "Inquiry Sent!", description: "We'll be in touch within 24 hours." });
  };

  return (
    <section
      id="catering"
      className="py-28 px-6"
      style={{ background: "linear-gradient(180deg, #faecc4 0%, #fdf3d8 100%)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: "#f5c518" }}>
            Bring Cheezies To You
          </p>
          <h2
            className="text-5xl md:text-6xl font-black mb-5 leading-tight"
            style={{ fontFamily: "Georgia, serif", color: "#3d2200" }}
          >
            Catering &<br />
            <span style={{ color: "#c9940a" }}>Private Events</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "rgba(255,220,120,0.85)" }}>
            From intimate backyard parties to large corporate events — we bring the grill, the cheese, and the good vibes right to your door.
          </p>
        </motion.div>

        {/* Packages */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="rounded-2xl p-7 flex flex-col relative"
              style={{
                background: pkg.featured ? "rgba(201,148,10,0.08)" : "#ffffff",
                border: pkg.featured ? "1.5px solid rgba(180,120,0,0.35)" : "1px solid rgba(180,120,0,0.15)",
                boxShadow: "0 2px 16px rgba(180,120,0,0.06)",
              }}
            >
              {pkg.featured && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase"
                  style={{ background: "#c9940a", color: "#fff8e8" }}
                >
                  Most Popular
                </div>
              )}
              <div className="text-3xl mb-3">{pkg.icon}</div>
              <h3 className="text-xl font-black mb-1" style={{ color: "#3d2200" }}>{pkg.name}</h3>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#c9940a" }}>{pkg.size}</p>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(80,45,0,0.6)" }}>{pkg.desc}</p>
              <ul className="space-y-2 mt-auto">
                {pkg.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "rgba(80,45,0,0.65)" }}>
                    <span style={{ color: "#c9940a" }}>✓</span> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Inquiry form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl p-8 md:p-12"
          style={{ background: "#ffffff", border: "1px solid rgba(180,120,0,0.15)", boxShadow: "0 2px 20px rgba(180,120,0,0.06)" }}
        >
          <div className="text-center mb-10">
            <h3 className="text-3xl font-black mb-2" style={{ fontFamily: "Georgia, serif", color: "#3d2200" }}>
              Request a Quote
            </h3>
            <p className="text-sm" style={{ color: "rgba(80,45,0,0.5)" }}>
              Fill out the form and we'll get back to you within 24 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "rgba(120,70,0,0.7)" }}>Your Name</label>
              <input
                required
                style={inputStyle}
                placeholder="Jane Smith"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "rgba(120,70,0,0.7)" }}>Email</label>
              <input
                required
                type="email"
                style={inputStyle}
                placeholder="jane@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "rgba(120,70,0,0.7)" }}>Phone</label>
              <input
                type="tel"
                style={inputStyle}
                placeholder="330-000-0000"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <SheetSelect
              label="Event Type"
              value={form.event_type}
              onChange={val => setForm({ ...form, event_type: val })}
              options={EVENT_TYPES}
              placeholder="Select event type…"
              required
            />

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "rgba(120,70,0,0.7)" }}>Event Date</label>
              <input
                type="date"
                required
                style={inputStyle}
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
              />
            </div>

            <SheetSelect
              label="Estimated Guests"
              value={form.guests}
              onChange={val => setForm({ ...form, guests: val })}
              options={GUEST_RANGES}
              placeholder="Select guest range…"
            />

            <div className="md:col-span-2">
              <label className="block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "rgba(120,70,0,0.7)" }}>Additional Details</label>
              <textarea
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
                placeholder="Tell us about your event, location, dietary needs, etc."
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
              />
            </div>
            <div className="md:col-span-2 text-center">
              <button
                type="submit"
                disabled={submitting}
                className="px-10 py-4 rounded-full font-bold text-base transition-all duration-300 hover:scale-105 disabled:opacity-60 select-none"
                style={{ background: "#c9940a", color: "#fff8e8", boxShadow: "0 8px 32px rgba(180,120,0,0.25)", WebkitTapHighlightColor: "transparent" }}
              >
                {submitting ? "Sending…" : "Send Catering Inquiry"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}