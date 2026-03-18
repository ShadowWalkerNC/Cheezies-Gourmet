import Hero from "../components/Hero";
import Menu from "../components/Menu";
import About from "../components/About";
import Catering from "../components/Catering";
import Newsletter from "../components/Newsletter";
import Contact from "../components/Contact";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";
import PullToRefresh from "../components/PullToRefresh";
import NewsletterPopup from "../components/NewsletterPopup";
import SocialDiscount from "../components/SocialDiscount";
import MerchTeaser from "../components/MerchTeaser";

export default function Home() {
  const handleRefresh = () =>
    new Promise((resolve) => setTimeout(resolve, 900));

  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--color-bg)" }}>
      <NavBar />
      <NewsletterPopup />
      <PageTransition>
        <PullToRefresh onRefresh={handleRefresh}>
          <Hero />
          <About />
          <Menu />
          <SocialDiscount />
          <Catering />
          <MerchTeaser />
          <Newsletter />
          <Contact />
          <Footer />
          <div className="md:hidden" style={{ height: "var(--tab-bar-h)" }} />
        </PullToRefresh>
      </PageTransition>
    </div>
  );
}