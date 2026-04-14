import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import LiquidEther from "./components/layout/LiquidEther";
import Dock from "./components/layout/Dock";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Learning from "./pages/Learning";
import Compensation from "./pages/Compensation";
import Settings from "./pages/Settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 30_000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* Mouse-reactive background — z-0, pointer-events: none */}
        <LiquidEther />

        {/* All page content sits above background */}
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/compensation" element={<Compensation />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </AnimatePresence>

        {/* Bottom navigation dock */}
        <Dock />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
