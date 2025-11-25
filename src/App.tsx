import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LawMeterDashboard from "./pages/LawMeterDashboard";
import Documentation from "./pages/Documentation";
import BusinessIntelligence from "./pages/BusinessIntelligence";
import CertificatesDashboard from "./pages/CertificatesDashboard";
import CertificateDetail from "./pages/CertificateDetail";
import CertificateForm from "./pages/CertificateForm";
import ClientsList from "./pages/ClientsList";
import ClientProfile from "./pages/ClientProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LawMeterDashboard />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/business-intelligence" element={<BusinessIntelligence />} />
          <Route path="/certificates" element={<CertificatesDashboard />} />
          <Route path="/certificates/new" element={<CertificateForm />} />
          <Route path="/certificates/:id" element={<CertificateDetail />} />
          <Route path="/certificates/:id/edit" element={<CertificateForm />} />
          <Route path="/clients" element={<ClientsList />} />
          <Route path="/clients/:id" element={<ClientProfile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
