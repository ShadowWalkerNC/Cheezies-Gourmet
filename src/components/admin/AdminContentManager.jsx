import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { DEFAULTS } from "@/hooks/usePageContent";

const inputStyle = { background: "#fffbf0", border: "1.5px solid rgba(180,120,0,0.2)", color: "#2a1200" };
const sectionStyle = { background: "#fff", border: "1px solid rgba(180,120,0,0.15)", boxShadow: "0 2px 12px rgba(180,120,0,0.06)" };

// Field definitions for each section — what shows in the admin panel
const FIELD_DEFS = {
  hero: [
    { field: "headline",        label: "Main Headline",         type: "textarea",  hint: "Use \\n for line breaks" },
    { field: "headline_accent", label: "Accent Line",            type: "text" },
    { field: "subline",         label: "Subheadline / Tagline",  type: "textarea" },
    { field: "image_url",       label: "Hero Image URL",         type: "image" },
    { field: "order_url",       label: "Order Online URL",       type: "text" },
    { field: "review_url",      label: "Google Review URL",      type: "text" },
  ],
  about: [
    { field: "eyebrow",      label: "Eyebrow Label",       type: "text" },
    { field: "headline",     label: "Section Headline",    type: "text" },
    { field: "body",         label: "Body Paragraph",      type: "textarea" },
    { field: "image_url",    label: "Mascot Image URL",    type: "image" },
    { field: "fan_fav_text", label: "Fan Favorites Blurb", type: "textarea" },
    { field: "stat1_val",    label: "Stat 1 Title",        type: "text" },
    { field: "stat1_desc",   label: "Stat 1 Description",  type: "text" },
    { field: "stat2_val",    label: "Stat 2 Title",        type: "text" },
    { field: "stat2_desc",   label: "Stat 2 Description",  type: "text" },
    { field: "stat3_val",    label: "Stat 3 Title",        type: "text" },
    { field: "stat3_desc",   label: "Stat 3 Description",  type: "text" },
  ],
  catering: [
    { field: "headline",        label: "Headline",          type: "text" },
    { field: "headline_accent", label: "Accent Line",       type: "text" },
    { field: "body",            label: "Description",       type: "textarea" },
    { field: "stat1_val",       label: "Stat 1 Value",      type: "text" },
    { field: "stat1_label",     label: "Stat 1 Label",      type: "text" },
    { field: "stat2_val",       label: "Stat 2 Value",      type: "text" },
    { field: "stat2_label",     label: "Stat 2 Label",      type: "text" },
    { field: "stat3_val",       label: "Stat 3 Value",      type: "text" },
    { field: "stat3_label",     label: "Stat 3 Label",      type: "text" },
  ],
  video: [
    { field: "eyebrow",   label: "Eyebrow Label", type: "text" },
    { field: "headline",  label: "Headline",      type: "text" },
    { field: "caption",   label: "Caption Text",  type: "textarea" },
    { field: "video_url", label: "Video URL",     type: "text", hint: "Direct .mp4 or video URL" },
  ],
};

const SECTION_LABELS = {
  hero:     "🏠 Hero Section",
  about:    "📖 About Section",
  catering: "🍽️ Catering Section",
  video:    "🎬 Video Section",
};

export default function AdminContentManager() {
  const [records, setRecords] = useState({}); // { section: { field: { id, value } } }
  const [values, setValues]   = useState({}); // { section: { field: string } }
  const [activeSection, setActiveSection] = useState("hero");
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [uploading, setUploading] = useState(null); // field name being uploaded
  const fileRefs = useRef({});

  useEffect(() => { load(); }, []);

  const load = async () => {
    const data = await base44.entities.SiteContent.list("section", 200);
    const rec = {};
    const vals = {};
    for (const r of data) {
      if (!rec[r.section]) rec[r.section] = {};
      if (!vals[r.section]) vals[r.section] = {};
      rec[r.section][r.field] = r;
      vals[r.section][r.field] = r.value;
    }
    // Fill missing with defaults
    for (const [section, fields] of Object.entries(DEFAULTS)) {
      if (!vals[section]) vals[section] = {};
      for (const [field, defaultVal] of Object.entries(fields)) {
        if (vals[section][field] === undefined) vals[section][field] = defaultVal;
      }
    }
    setRecords(rec);
    setValues(vals);
  };

  const handleChange = (section, field, value) => {
    setValues(prev => ({
      ...prev,
      [section]: { ...(prev[section] || {}), [field]: value },
    }));
  };

  const handleImageUpload = async (section, field, file) => {
    if (!file) return;
    setUploading(field);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    handleChange(section, field, file_url);
    setUploading(null);
  };

  const handleSave = async () => {
    setSaving(true);
    const section = activeSection;
    const sectionVals = values[section] || {};
    const sectionRecs = records[section] || {};

    for (const [field, value] of Object.entries(sectionVals)) {
      const existing = sectionRecs[field];
      if (existing) {
        await base44.entities.SiteContent.update(existing.id, { value: String(value) });
      } else {
        const label = FIELD_DEFS[section]?.find(f => f.field === field)?.label || field;
        await base44.entities.SiteContent.create({ section, field, value: String(value), label });
      }
    }

    await load();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = async (section, field) => {
    const defaultVal = DEFAULTS[section]?.[field] || "";
    handleChange(section, field, defaultVal);
  };

  const fields = FIELD_DEFS[activeSection] || [];
  const sectionVals = values[activeSection] || {};

  return (
    <div className="flex flex-col gap-6">
      {/* Section tabs */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(SECTION_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveSection(key)}
            className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
            style={{
              background: activeSection === key ? "#c9940a" : "rgba(201,148,10,0.08)",
              color: activeSection === key ? "#fff8e8" : "#7a4f00",
              border: `1.5px solid ${activeSection === key ? "#c9940a" : "rgba(180,120,0,0.2)"}`,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Fields */}
      <section className="rounded-2xl p-6" style={sectionStyle}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-black text-lg" style={{ color: "#2a1200" }}>{SECTION_LABELS[activeSection]}</h2>
            <p className="text-xs mt-0.5" style={{ color: "rgba(61,34,0,0.45)" }}>Changes go live instantly after saving.</p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {fields.map(({ field, label, type, hint }) => {
            const value = sectionVals[field] ?? "";
            const isDefault = value === (DEFAULTS[activeSection]?.[field] ?? "");

            return (
              <div key={field}>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(61,34,0,0.5)" }}>
                    {label}
                  </label>
                  {!isDefault && (
                    <button
                      onClick={() => handleReset(activeSection, field)}
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ background: "rgba(0,0,0,0.05)", color: "#888" }}
                    >
                      Reset
                    </button>
                  )}
                </div>

                {type === "textarea" ? (
                  <textarea
                    rows={3}
                    value={value}
                    onChange={e => handleChange(activeSection, field, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                    style={inputStyle}
                  />
                ) : type === "image" ? (
                  <div>
                    {value && (
                      <div className="relative mb-2 rounded-xl overflow-hidden" style={{ height: 120 }}>
                        <img src={value} alt="preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={() => fileRefs.current[field]?.click()}
                        disabled={uploading === field}
                        className="px-4 py-2 rounded-xl font-bold text-sm flex-shrink-0"
                        style={{ background: "rgba(201,148,10,0.12)", color: "#7a4f00", border: "1.5px solid rgba(180,120,0,0.25)" }}
                      >
                        {uploading === field ? "Uploading…" : "📷 Upload"}
                      </button>
                      <input
                        type="text"
                        value={value}
                        onChange={e => handleChange(activeSection, field, e.target.value)}
                        placeholder="Or paste image URL"
                        className="flex-1 px-4 py-2 rounded-xl text-sm outline-none"
                        style={inputStyle}
                      />
                    </div>
                    <input
                      ref={el => fileRefs.current[field] = el}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => handleImageUpload(activeSection, field, e.target.files[0])}
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={e => handleChange(activeSection, field, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={inputStyle}
                  />
                )}
                {hint && <p className="text-xs mt-1" style={{ color: "rgba(61,34,0,0.4)" }}>{hint}</p>}
              </div>
            );
          })}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 rounded-2xl font-black text-lg mt-6 transition-all"
          style={{
            background: saved ? "#22c55e" : "#c9940a",
            color: "#fff8e8",
            boxShadow: "0 4px 20px rgba(180,120,0,0.3)",
          }}
        >
          {saving ? "Saving…" : saved ? "✓ Saved & Published!" : "Save & Publish"}
        </button>
      </section>
    </div>
  );
}