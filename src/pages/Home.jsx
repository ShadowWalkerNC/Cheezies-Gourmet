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
    <div className="min-h-screen font-sans" style={{ background: "#1c1008" }}>
      <NavBar />
      <Hero />
      <About />
      <Menu />
      <Catering />
      <Newsletter />
      <Contact />
      <Footer />
    </div>
  );
}