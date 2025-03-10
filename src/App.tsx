import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Auth from "./pages/auth";
import Waitlist from "./pages/waitlist";
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
      </>
    </Suspense>
  );
}

export default App;
