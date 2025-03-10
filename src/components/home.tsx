import React from "react";
import Navbar from "./landing/Navbar";
import HeroSection from "./landing/HeroSection";
import DashboardPreview from "./landing/DashboardPreview";
import CoreFeatures from "./landing/CoreFeatures";
import WhatsNext from "./landing/WhatsNext";
import Pricing from "./landing/Pricing";
import HowToUse from "./landing/HowToUse";
import ChatbotWidget from "./landing/ChatbotWidget";

import Footer from "./landing/Footer";
import { Toaster } from "./ui/toaster";

function Home() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="pt-20">
        <HeroSection />
        <DashboardPreview />
        <div id="core-features">
          <CoreFeatures />
        </div>
        <div id="whats-next">
          <WhatsNext />
        </div>
        <div id="pricing">
          <Pricing />
        </div>
        <div id="how-to-use">
          <HowToUse />
        </div>
        <Footer />
      </main>
      <Toaster />
    </div>
  );
}

export default Home;
