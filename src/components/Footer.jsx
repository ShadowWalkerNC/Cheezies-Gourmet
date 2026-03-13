export default function Footer() {
  return (
    <footer
      className="py-12 px-6 text-center"
      style={{ background: "#fdf3d8", borderTop: "1px solid rgba(180,120,0,0.12)" }}
    >
      <p
        className="font-black text-3xl mb-1"
        style={{ fontFamily: "Georgia, serif", color: "#c9940a" }}
      >
        Cheezies
      </p>
      <p className="text-sm mb-1" style={{ color: "rgba(255,235,180,0.35)" }}>
        Gourmet Grilled Creations · Akron, Ohio
      </p>
      <p className="text-sm mb-6" style={{ color: "rgba(255,235,180,0.25)" }}>
        330-510-8875
      </p>
      <div className="w-16 h-px mx-auto mb-6" style={{ background: "rgba(245,197,24,0.15)" }} />
      <p className="text-xs" style={{ color: "rgba(255,235,180,0.2)" }}>
        © {new Date().getFullYear()} Cheezies Food Truck. All rights reserved.
      </p>
    </footer>
  );
}