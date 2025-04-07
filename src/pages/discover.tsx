import React from "react";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import HowToUse from "../components/landing/HowToUse";

const DiscoverPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="mt-20">
        {" "}
        {/* Add margin to account for fixed navbar */}
        <HowToUse />
      </div>
      <Footer />
    </div>
  );
};

export default DiscoverPage;
