import NavBar from "../components/NavBar";
import Catering from "../components/Catering";
import Footer from "../components/Footer";

export default function CateringPage() {
  return (
    <div className="min-h-screen font-sans" style={{ background: "#1c1008" }}>
      <NavBar />
      <div style={{ paddingTop: "80px" }}>
        <Catering />
      </div>
      <Footer />
    </div>
  );
}