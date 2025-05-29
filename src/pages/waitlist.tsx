import React, { useEffect, useState } from "react";
import WaitlistSurvey from "../components/landing/WaitlistSurvey";
import { Toaster } from "../components/ui/toaster";

const Waitlist = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    // Get query parameters from URL
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    const firstNameParam = params.get("firstName");
    const lastNameParam = params.get("lastName");

    if (emailParam) setEmail(emailParam);
    if (firstNameParam) setFirstName(firstNameParam);
    if (lastNameParam) setLastName(lastNameParam);
  }, []);

  const handleBack = () => {
    window.location.href = "/";
  };

  return (
    <div className="fixed inset-0 overflow-hidden" id="waitlist">
      <WaitlistSurvey
        onBack={handleBack}
        email={email}
        firstName={firstName}
        lastName={lastName}
      />
    </div>
  );
};

export default Waitlist;
