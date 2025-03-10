import React from "react";
import WaitlistSurvey from "../components/landing/WaitlistSurvey";
import { Toaster } from "../components/ui/toaster";

const Waitlist = () => {
  const handleBack = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12" id="waitlist">
      <div className="container mx-auto px-4">
        <WaitlistSurvey onBack={handleBack} />
      </div>
      <Toaster />
    </div>
  );
};

export default Waitlist;
