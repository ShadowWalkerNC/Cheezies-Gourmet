import NavBar from "../components/NavBar";
import Menu from "../components/Menu.jsx";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";
import PullToRefresh from "../components/PullToRefresh";

export default function MenuPage() {
  const handleRefresh = () =>
    new Promise((resolve) => setTimeout(resolve, 900));

  return (
    <div className="min-h-screen font-sans" style={{ background: "#fdf6e3" }}>
      <NavBar />
      <div style={{ height: "calc(93px + var(--safe-top))" }} />
      <PageTransition>
        <PullToRefresh onRefresh={handleRefresh}>
          <Menu />
          <Footer />
          <div className="md:hidden" style={{ height: "var(--tab-bar-h)" }} />
        </PullToRefresh>
      </PageTransition>
    </div>
  );
}
