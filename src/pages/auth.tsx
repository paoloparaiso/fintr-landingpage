import React, { useState } from "react";
import AuthPage from "../components/landing/AuthPage";
import { Toaster } from "../components/ui/toaster";
import AuthToggle from "../components/landing/AuthToggle";

const Auth = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  const handleBack = () => {
    window.location.href = "/";
  };

  const handleToggle = (tab: "login" | "signup") => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12">
      <div className="container mx-auto px-4">
        <AuthPage
          onBack={handleBack}
          isLogin={activeTab === "login"}
          authToggle={
            <AuthToggle activeTab={activeTab} onToggle={handleToggle} />
          }
        />
      </div>
      <Toaster />
    </div>
  );
};

export default Auth;
