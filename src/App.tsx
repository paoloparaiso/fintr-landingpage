import { Suspense } from "react";
import { Routes, Route, useRoutes } from "react-router-dom";
import Home from "./components/home";
import Waitlist from "./pages/waitlist";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        {/* Tempo routes */}
        {import.meta.env.VITE_TEMPO && useRoutes(routes)}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/waitlist" element={<Waitlist />} />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
      </>
    </Suspense>
  );
}

export default App;
