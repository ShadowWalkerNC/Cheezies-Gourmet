export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 py-10 px-6 text-center">
      <p className="text-[#f5c518] font-black text-2xl mb-1">Cheezies</p>
      <p className="text-white/30 text-sm mb-4">Gourmet Grilled Creations · Akron, Ohio</p>
      <p className="text-white/20 text-xs">
        © {new Date().getFullYear()} Cheezies Food Truck. All rights reserved.
      </p>
    </footer>
  );
}