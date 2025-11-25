import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { TechStackList } from "@/components/TechStackList";
import { BlockchainIntegration } from "@/components/BlockchainIntegration";
import { Footer } from "@/components/Footer";
import { ScrollProgressIndicator } from "@/components/ScrollProgressIndicator";

const Index = () => {
  useEffect(() => {
    // Disable scroll restoration
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative w-full overflow-x-hidden">
      <ScrollProgressIndicator />
      <Header />
      <main>
        <Hero />
        <Features />
        <TechStackList />
        <BlockchainIntegration />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
