import NavBar from "../components/NavBar";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";

export default function ContactPage() {
  return (
    <div className="min-h-screen font-sans" style={{ background: "#1c1008" }}>
      <NavBar />
      <PageTransition>
        <div style={{ paddingTop: "80px" }}>
          <Contact />
        </div>
        <Footer />
        <div className="md:hidden" style={{ height: "var(--tab-bar-h)" }} />
      </PageTransition>
    </div>
  );
}