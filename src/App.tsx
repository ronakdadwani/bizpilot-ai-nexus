import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import MarketResearch from "./pages/MarketResearch";
import Analytics from "./pages/Analytics";
import Forecast from "./pages/Forecast";
import UploadData from "./pages/UploadData";
import Files from "./pages/Files";
import AIChat from "./pages/AIChat";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import Customers from "./pages/Customers";
import Alerts from "./pages/Alerts";
import Help from "./pages/Help";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/market-research" element={<MarketResearch />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/upload-data" element={<UploadData />} />
          <Route path="/files" element={<Files />} />
          <Route path="/ai-chat" element={<AIChat />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/help" element={<Help />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
