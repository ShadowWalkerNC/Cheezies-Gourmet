import NavBar from "../components/NavBar";
import Menu from "../components/Menu";
import Footer from "../components/Footer";

export default function MenuPage() {
  return (
    <div className="min-h-screen font-sans" style={{ background: "#1c1008" }}>
      <NavBar />
      <div style={{ paddingTop: "80px" }}>
        <Menu />
      </div>
      <Footer />
      {/* Space for mobile bottom tab bar */}
      <div className="md:hidden" style={{ height: "var(--tab-bar-h)" }} />
    </div>
  );
}