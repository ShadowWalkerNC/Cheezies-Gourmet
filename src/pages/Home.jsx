import Hero from "../components/Hero";
import About from "../components/About";
import FeaturedMenu from "../components/FeaturedMenu";
import Newsletter from "../components/Newsletter";
import SocialDiscount from "../components/SocialDiscount";
import CateringPreview from "../components/CateringPreview";
import ContactPreview from "../components/ContactPreview";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";
import PullToRefresh from "../components/PullToRefresh";
import NewsletterPopup from "../components/NewsletterPopup";

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
          <FeaturedMenu />
          <Newsletter />
          <SocialDiscount />
          <CateringPreview />
          <ContactPreview />
          <Footer />
          <div className="md:hidden" style={{ height: "var(--tab-bar-h)" }} />
        </PullToRefresh>
      </PageTransition>
    </div>
  );
}