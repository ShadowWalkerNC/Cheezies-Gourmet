import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

export default function AboutPage() {
  return (
    <PageTransition>
      <NavBar />
      <main style={{ background: "#fffbf0", paddingTop: "6rem", paddingBottom: "4rem" }}>
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "#c9940a" }}>Our Story</p>
          <h1 className="text-4xl md:text-5xl font-black mb-6" style={{ fontFamily: "Georgia, serif", color: "#2a1200" }}>
            About Cheezies Gourmet
          </h1>
          <div className="w-12 h-1 rounded-full mb-8" style={{ background: "#c9940a" }} />

          <div className="prose max-w-none space-y-5 text-base leading-relaxed" style={{ color: "rgba(61,34,0,0.8)" }}>
            <p>
              Cheezies Gourmet is Akron, Ohio's premier gourmet grilled cheese food truck, crafting elevated comfort food
              with locally sourced ingredients and bold, unexpected flavor combinations. What started as a passion for
              transforming a childhood classic into a true culinary experience has grown into one of Northeast Ohio's
              most beloved mobile kitchens.
            </p>
            <p>
              Our menu features Signature Creations, Gourmet Melts, and an ever-rotating selection of sides and
              seasonal specials. Every sandwich is pressed to golden perfection on artisan bread, loaded with premium
              cheeses, and paired with carefully chosen complementary ingredients — from slow-braised meats to truffle
              aioli and fresh herbs. Whether you're stopping by on your lunch break or tracking us down at a weekend
              event, every bite is made with intention and love.
            </p>
            <p>
              We cater to food lovers across the Akron–Canton–Cleveland corridor — at private events, corporate
              lunches, weddings, festivals, and farmers markets. Our catering packages are fully customizable, making
              us the perfect partner for any gathering, large or small. If you're looking for a crowd-pleasing,
              unforgettable food experience, Cheezies Gourmet delivers every time.
            </p>
            <p>
              Cheezies Gourmet is operated by a small, dedicated team who believes great food doesn't have to be
              complicated — it just has to be made with the right ingredients and real care. We are proud to be a
              local, independent business serving our community, and we're grateful for every customer who has
              followed the truck, tagged us in a photo, or shared our sandwiches with a friend.
            </p>
            <p>
              Follow us on Facebook, Instagram, and TikTok for daily location updates, specials, and behind-the-scenes
              content. We can't wait to feed you!
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="/Menu"
              className="px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
              style={{ background: "#c9940a", color: "#fff8e8", textDecoration: "none" }}
            >
              View Our Menu →
            </a>
            <a
              href="/Catering"
              className="px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
              style={{ background: "rgba(201,148,10,0.1)", color: "#7a4f00", border: "1.5px solid rgba(180,120,0,0.25)", textDecoration: "none" }}
            >
              Catering Inquiries →
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
}