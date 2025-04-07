import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Auth from "./pages/auth";
import Waitlist from "./pages/waitlist";
import Dashboard from "./pages/dashboard";
import WhatsNextPage from "./pages/whats-next";
import DiscoverPage from "./pages/discover";
import DatabasePage from "./pages/database";
import AccountSetupFlow from "./components/auth/AccountSetupFlow";
import SignupSuccessRedirect from "./components/auth/SignupSuccessRedirect";

function App() {
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
          <Route path="/database" element={<DatabasePage />} />
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
