import React from "react";
import Navbar from "./landing/Navbar";
import HeroSection from "./landing/HeroSection";
import ProblemSection from "./landing/ProblemSection";
import SolutionSection from "./landing/SolutionSection";
import Footer from "./landing/Footer";
import { Toaster } from "./ui/toaster";

function Home() {
  return (
    <div className="w-full h-screen overflow-hidden flex flex-col">
      <Navbar />
      <main className="flex-1 overflow-y-auto pt-20">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <Footer />
      </main>
      <Toaster />
    </div>
  );
}

export default Home;
