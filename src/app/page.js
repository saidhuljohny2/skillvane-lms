import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Curriculum from "@/components/Curriculum";
import Instructor from "@/components/Instructor";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <Curriculum />
      <Instructor />
      <Pricing />
      <Footer />
    </main>
  );
}
