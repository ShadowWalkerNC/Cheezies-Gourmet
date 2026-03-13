import Hero from "../components/Hero";
import Menu from "../components/Menu";
import About from "../components/About";
import Catering from "../components/Catering";
import Newsletter from "../components/Newsletter";
import Contact from "../components/Contact";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--color-bg)" }}>
      <NavBar />
      <Hero />
      <About />
      <Menu />
      <Catering />
      <Newsletter />
      <Contact />
      <Footer />
      {/* Space for mobile bottom tab bar */}
      <div className="md:hidden" style={{ height: "var(--tab-bar-h)" }} />
    </div>
  );
}