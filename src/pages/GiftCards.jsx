export default function GiftCards() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: "var(--color-bg)" }}>
      <div className="text-6xl mb-6">🎁</div>
      <h1 className="font-black uppercase text-4xl mb-4" style={{ color: "#1a0800" }}>Gift Cards</h1>
      <p className="text-base mb-8 max-w-sm" style={{ color: "rgba(61,34,0,0.6)" }}>
        Give the gift of gourmet grilled cheese. Purchase Cheezies gift cards directly through Square.
      </p>
      <a
        href="https://cheeziesgourmetohio.square.site/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest transition-opacity hover:opacity-85"
        style={{ background: "#c9940a", color: "#fff", textDecoration: "none" }}
      >
        Buy Gift Cards →
      </a>
    </div>
  );
}
