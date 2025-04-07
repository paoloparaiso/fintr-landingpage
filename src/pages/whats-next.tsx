import React from "react";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import WhatsNext from "../components/landing/WhatsNext";

const WhatsNextPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="mt-20">
        {" "}
        {/* Add margin to account for fixed navbar */}
        <WhatsNext />
      </div>
      <Footer />
    </div>
  );
};

export default WhatsNextPage;
