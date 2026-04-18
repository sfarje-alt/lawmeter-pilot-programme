import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useClientUser } from "@/hooks/useClientUser";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DailySummaryPopup } from "@/components/landing/DailySummaryPopup";
import { SessionsPage } from "@/components/sessions";
import { AlertsCalendar } from "@/components/calendar/AlertsCalendar";
import { SocialListeningDemo } from "@/components/media/SocialListeningDemo";
import { ContactForm } from "@/components/ContactForm";
import { AlertSettingsDialog } from "@/components/alerts/AlertSettingsDialog";
import { ClientsPage } from "@/components/clients/ClientsPage";
import { ClientAnalyticsDashboard } from "@/components/analytics/ClientAnalyticsDashboard";
import { LegalTeamAnalyticsDashboard } from "@/components/analytics/LegalTeamAnalyticsDashboard";
import { ReportsPage } from "@/components/reports/ReportsPage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Info, X } from "lucide-react";
import Inbox from "@/pages/Inbox";

// Client Portal Components
import {
  ClientInbox,
  ClientProfileView,
  ClientReports,
  ClientAnalytics,
  ClientCalendar,
  ClientSettings,
} from "@/components/client-portal";

export default function LawMeterDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { shouldShowDailyPopup, profile } = useAuth();
  const { isClientUser, clientName } = useClientUser();
  const [activeTab, setActiveTab] = useState(""); 
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showDailyPopup, setShowDailyPopup] = useState(false);
  const [aiDisclaimerVisible, setAiDisclaimerVisible] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("lm:hide-ai-disclaimer") !== "1";
  });

  const dismissAiDisclaimer = () => {
    setAiDisclaimerVisible(false);
    try { localStorage.setItem("lm:hide-ai-disclaimer", "1"); } catch {}
  };

  // Get URL parameters for navigation from calendar
  const sectionParam = searchParams.get('section');
  const tabParam = searchParams.get('tab');
  const alertIdParam = searchParams.get('alertId');
  const sessionIdParam = searchParams.get('sessionId');
  const timestampParam = searchParams.get('t'); // Unique timestamp to force re-render

  // Handle URL parameters for deep linking from calendar
  useEffect(() => {
    if (sectionParam === 'inbox') {
      setActiveTab('inbox');
    } else if (sectionParam === 'sessions') {
      setActiveTab('sessions');
    }
  }, [sectionParam, timestampParam]); // Also react to timestamp changes

  // Set default tab based on user type
  useEffect(() => {
    if (activeTab === "" && !sectionParam) {
      setActiveTab(isClientUser ? "client-inbox" : "inbox");
    }
  }, [isClientUser, activeTab, sectionParam]);

  // Show daily popup on first render if needed (only for admin users)
  useEffect(() => {
    if (shouldShowDailyPopup && !isClientUser) {
      setShowDailyPopup(true);
    }
  }, [shouldShowDailyPopup, isClientUser]);

  const renderContent = () => {
    // Client user views
    if (isClientUser) {
      switch (activeTab) {
        case "client-inbox":
          return <ClientInbox />;
        case "client-profile":
          return <ClientProfileView />;
        case "client-reports":
          return <ClientReports />;
        case "client-analytics":
          return <ClientAnalytics />;
        case "client-calendar":
          return <ClientCalendar />;
        case "client-settings":
          return <ClientSettings />;
        default:
          return <ClientInbox />;
      }
    }

    // Admin user views
    switch (activeTab) {
      case "sessions":
        // Include sessionId and timestamp in key to force re-mount when navigating from calendar
        return <SessionsPage key={`sessions-${sessionIdParam}-${timestampParam}`} initialSessionId={sessionIdParam} />;
      case "inbox":
        // Include timestamp in key to force re-mount when navigating from calendar multiple times
        return <Inbox key={`inbox-${alertIdParam}-${tabParam}-${timestampParam}`} initialTab={tabParam} initialAlertId={alertIdParam} />;
      case "clients":
        return <ClientsPage />;
      case "reports":
        return <ReportsPage />;
      case "analytics":
        return <LegalTeamAnalyticsDashboard />;
      case "calendar":
        return <AlertsCalendar />;
      case "social":
        return <SocialListeningDemo />;
      case "contact":
        return <ContactForm />;
      default:
        return <Inbox key={`inbox-default-${alertIdParam}-${tabParam}-${timestampParam}`} initialTab={tabParam} initialAlertId={alertIdParam} />;
    }
  };

  // Get display name for current tab
  const getTabDisplayName = () => {
    const tabNames: Record<string, string> = {
      sessions: "Sesiones",
      inbox: "Alertas",
      clients: "Perfiles",
      reports: "Reportes",
      analytics: "Analíticas",
      calendar: "Calendario",
    };
    return tabNames[activeTab] || activeTab;
  };

  // Handle tab changes - clear URL params when manually switching tabs
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Clear deep-link parameters when switching tabs manually via sidebar
    if (searchParams.has('alertId') || searchParams.has('sessionId') || searchParams.has('section') || searchParams.has('tab') || searchParams.has('t')) {
      setSearchParams({});
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-[hsl(220,40%,8%)] via-[hsl(220,45%,6%)] to-[hsl(220,50%,4%)]">
        <AppSidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
          onSettingsOpen={() => setSettingsOpen(true)} 
        />
        
        <SidebarInset className="bg-transparent">
          <header className="sticky top-0 z-10 flex h-12 items-center gap-4 border-b border-white/10 bg-[hsl(220,40%,8%)]/80 backdrop-blur-sm px-4">
            <SidebarTrigger className="text-foreground hover:bg-white/10" />
            <span className="text-sm font-medium text-muted-foreground">{getTabDisplayName()}</span>

            <div className="ml-auto flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary text-xs">
                Perú
              </Badge>
            </div>
          </header>

          {/* AI Disclaimer banner — dismissible */}
          {aiDisclaimerVisible && (
            <div className="border-b border-blue-500/20 bg-blue-500/10 px-6 py-2 flex items-start gap-2">
              <Info className="h-3.5 w-3.5 text-blue-300 shrink-0 mt-0.5" />
              <p className="text-[11px] text-blue-100/90 leading-relaxed flex-1">
                <span className="font-semibold">Aviso:</span> Los análisis, resúmenes y clasificaciones generados por
                inteligencia artificial son informativos y no constituyen asesoría legal. La validación final y la toma
                de decisiones corresponden siempre al equipo interno de compliance.
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-blue-200/80 hover:text-blue-100 hover:bg-blue-500/20 shrink-0"
                onClick={dismissAiDisclaimer}
                aria-label="Ocultar aviso"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}

          <div className="flex-1 px-6 py-6 overflow-auto">
            {renderContent()}
          </div>
        </SidebarInset>

        <AlertSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
        {!isClientUser && (
          <DailySummaryPopup 
            open={showDailyPopup} 
            onOpenChange={setShowDailyPopup} 
          />
        )}
      </div>
    </SidebarProvider>
  );
}
