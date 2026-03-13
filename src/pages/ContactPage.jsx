import NavBar from "../components/NavBar";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen font-sans" style={{ background: "#1c1008" }}>
      <NavBar />
      <div style={{ paddingTop: "80px" }}>
        <Contact />
      </div>
      <Footer />
      {/* Space for mobile bottom tab bar */}
      <div className="md:hidden" style={{ height: "var(--tab-bar-h)" }} />
    </div>
  );
}