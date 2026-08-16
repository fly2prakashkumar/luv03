import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeatureBar from "../components/FeatureBar";
import FeaturedProducts from "../components/FeaturedProducts";
import SkinConcerns from "../components/SkinConcerns";
import RitualSection from "../components/RitualSection";
import BestSellers from "../components/BestSellers";
import WhyLuv03 from "../components/WhyLuv03";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="min-h-screen bg-[#f8f6f1]">
      <Navbar />

      <Hero />

      <FeatureBar />

      <FeaturedProducts />

      <SkinConcerns />

      <RitualSection />

      <BestSellers />

      <WhyLuv03 />

      <Testimonials />

      <Newsletter />

      <Footer />
    </div>
  );
}

export default Home;