import NavBar from "../components/NavBar";
import Menu from "../components/Menu.jsx";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";
import PullToRefresh from "../components/PullToRefresh";

export default function MenuPage() {
  const handleRefresh = () =>
    new Promise((resolve) => setTimeout(resolve, 900));

  return (
    <div className="min-h-screen font-sans" style={{ background: "#1c1008" }}>
      <NavBar />
      <PageTransition>
        <PullToRefresh onRefresh={handleRefresh}>
          <div style={{ paddingTop: "80px" }}>
            <Menu />
          </div>
          <Footer />
          <div className="md:hidden" style={{ height: "var(--tab-bar-h)" }} />
        </PullToRefresh>
      </PageTransition>
    </div>
  );
}