export default function SquareSetup() {
  const sectionStyle = { background: "#fff", border: "1px solid rgba(180,120,0,0.15)", boxShadow: "0 2px 12px rgba(180,120,0,0.06)" };

  return (
    <div className="flex flex-col gap-5">
      {/* Status Banner */}
      <div className="rounded-2xl p-5 flex items-start gap-4" style={{ background: "#fff3cd", border: "1.5px solid #e8b800" }}>
        <span className="text-2xl shrink-0">⚠️</span>
        <div>
          <p className="font-black text-sm mb-1" style={{ color: "#7a4f00" }}>Square API Not Connected to Your POS</p>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(80,50,0,0.7)" }}>
            The current Square API key is a sandbox/test key not linked to your actual Square seller account. To pull real orders, sales, and customers, you need to connect your Square seller account via OAuth.
          </p>
        </div>
      </div>

      {/* How to connect */}
      <section className="rounded-2xl p-6" style={sectionStyle}>
        <h2 className="font-black text-lg mb-1" style={{ color: "#2a1200" }}>How to Connect Square to Your POS</h2>
        <p className="text-xs mb-5" style={{ color: "rgba(61,34,0,0.5)" }}>Follow these steps to link your real Square seller account.</p>

        <div className="flex flex-col gap-4">
          {[
            {
              step: "1",
              title: "Create a Square Developer App",
              desc: "Go to developer.squareup.com → Sign in with your Square account → Create a new Application.",
              link: "https://developer.squareup.com/apps",
              linkLabel: "Open Square Developer →",
            },
            {
              step: "2",
              title: "Get Your Production Access Token",
              desc: "In your app dashboard, go to Credentials → switch to Production → copy your Production Access Token. This is tied to YOUR seller account.",
              link: null,
            },
            {
              step: "3",
              title: "Update the SQUARE_ACCESS_TOKEN Secret",
              desc: "In this app's Base44 dashboard → Settings → Secrets, paste your Production Access Token as SQUARE_ACCESS_TOKEN (replace the current test token).",
              link: null,
            },
            {
              step: "4",
              title: "Get Your Location ID",
              desc: "In the Square Developer Dashboard, go to Locations and copy your Location ID. This is needed to pull orders from the correct POS register.",
              link: "https://developer.squareup.com/explorer/square/locations-api/list-locations",
              linkLabel: "Find My Location ID →",
            },
          ].map(({ step, title, desc, link, linkLabel }) => (
            <div key={step} className="flex gap-4 p-4 rounded-xl" style={{ background: "#fffbf0", border: "1px solid rgba(180,120,0,0.12)" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0" style={{ background: "#c9940a", color: "#fff" }}>
                {step}
              </div>
              <div className="flex-1">
                <p className="font-black text-sm mb-1" style={{ color: "#2a1200" }}>{title}</p>
                <p className="text-xs leading-relaxed mb-2" style={{ color: "rgba(61,34,0,0.6)" }}>{desc}</p>
                {link && (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-black tracking-widest uppercase transition-opacity hover:opacity-75"
                    style={{ color: "#c9940a", textDecoration: "none" }}
                  >
                    {linkLabel}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What you'll get */}
      <section className="rounded-2xl p-6" style={sectionStyle}>
        <h2 className="font-black text-base mb-3" style={{ color: "#2a1200" }}>What You'll Get Once Connected</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "🧾", label: "Today's Orders", desc: "Live from your Square POS" },
            { icon: "💰", label: "Sales Reports", desc: "Daily & weekly revenue" },
            { icon: "👥", label: "Customer List", desc: "Names, emails, spend history" },
            { icon: "⭐", label: "Loyalty Data", desc: "Points & redemptions" },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="p-4 rounded-xl" style={{ background: "#fffbf0", border: "1px solid rgba(180,120,0,0.1)" }}>
              <p className="text-xl mb-1">{icon}</p>
              <p className="font-black text-xs" style={{ color: "#2a1200" }}>{label}</p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(61,34,0,0.5)" }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick link to Square Dashboard */}
      <a
        href="https://squareup.com/dashboard"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-base transition-opacity hover:opacity-85"
        style={{ background: "#1a0800", color: "#fff8e8", textDecoration: "none" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
        Open Square Dashboard →
      </a>
    </div>
  );
}