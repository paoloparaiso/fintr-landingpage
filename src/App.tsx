import { Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Auth from "./pages/auth";
import Waitlist from "./pages/waitlist";
import Dashboard from "./pages/dashboard";
import WhatsNextPage from "./pages/whats-next";
import DiscoverPage from "./pages/discover";
import Settings from "./pages/settings";
import AccountSetupFlow from "./components/auth/AccountSetupFlow";
import SignupSuccessRedirect from "./components/auth/SignupSuccessRedirect";

function App() {
  // Check for required environment variables
  useEffect(() => {
    const requiredEnvVars = [
      "VITE_PICA_SECRET_KEY",
      "VITE_PICA_OPENAI_CONNECTION_KEY",
    ];

    const missingVars = requiredEnvVars.filter(
      (varName) => !import.meta.env[varName],
    );

    if (missingVars.length > 0) {
      console.warn(
        `Missing required environment variables: ${missingVars.join(", ")}`,
      );
    }
  }, []);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/whats-next" element={<WhatsNextPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/account-setup" element={<AccountSetupFlow />} />
          <Route path="/signup-success" element={<SignupSuccessRedirect />} />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
      </>
    </Suspense>
  );
}

export default App;
