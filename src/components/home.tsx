import React from "react";
import Navbar from "./landing/Navbar";
import HeroSection from "./landing/HeroSection";
import DashboardPreview from "./landing/DashboardPreview";
import CoreFeatures from "./landing/CoreFeatures";

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
        <Footer />
      </main>
      <Toaster />
    </div>
  );
}

export default Home;
