import Hero from "../components/Hero";
import Menu from "../components/Menu";
import About from "../components/About";
import Contact from "../components/Contact";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <NavBar />
      <Hero />
      <About />
      <Menu />
      <Contact />
      <Footer />
    </div>
  );
}