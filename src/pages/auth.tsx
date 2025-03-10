import React from "react";
import AuthPage from "../components/landing/AuthPage";
import { Toaster } from "../components/ui/toaster";

const Auth = () => {
  const handleBack = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12">
      <div className="container mx-auto px-4">
        <AuthPage onBack={handleBack} />
      </div>
      <Toaster />
    </div>
  );
};

export default Auth;
