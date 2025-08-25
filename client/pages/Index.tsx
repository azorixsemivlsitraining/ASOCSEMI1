import { useEffect } from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import ContentSections from "../components/ContentSections";
import Footer from "../components/Footer";

export default function Index() {
  useEffect(() => {
    // Set dark mode by default
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ContentSections />
      <Footer />
    </div>
  );
}
