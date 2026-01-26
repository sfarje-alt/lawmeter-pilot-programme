import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { ReportsPage } from "@/components/reports/ReportsPage";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
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
  const { shouldShowDailyPopup, profile } = useAuth();
  const { isClientUser, clientName } = useClientUser();
  const [activeTab, setActiveTab] = useState(""); 
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showDailyPopup, setShowDailyPopup] = useState(false);

  // Set default tab based on user type
  useEffect(() => {
    if (activeTab === "") {
      setActiveTab(isClientUser ? "client-inbox" : "inbox");
    }
  }, [isClientUser, activeTab]);

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
        return <SessionsPage />;
      case "inbox":
        return <Inbox />;
      case "clients":
        return <ClientsPage />;
      case "reports":
        return <ReportsPage />;
      case "analytics":
        return <ClientAnalyticsDashboard />;
      case "calendar":
        return <AlertsCalendar />;
      case "social":
        return <SocialListeningDemo />;
      case "contact":
        return <ContactForm />;
      default:
        return <Inbox />;
    }
  };

  // Get display name for current tab
  const getTabDisplayName = () => {
    const tabNames: Record<string, string> = {
      // Admin tabs
      sessions: "Sessions",
      inbox: "Inbox",
      clients: "Clients",
      reports: "Reports",
      analytics: "Analytics",
      calendar: "Calendar",
      // Client tabs
      "client-inbox": "Alertas",
      "client-profile": "Mi Perfil",
      "client-reports": "Reportes",
      "client-analytics": "Analytics",
      "client-calendar": "Calendario",
      "client-settings": "Configuración",
    };
    return tabNames[activeTab] || activeTab;
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-[hsl(220,40%,8%)] via-[hsl(220,45%,6%)] to-[hsl(220,50%,4%)]">
        <AppSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          onSettingsOpen={() => setSettingsOpen(true)} 
        />
        
        <SidebarInset className="bg-transparent">
          <header className="sticky top-0 z-10 flex h-12 items-center gap-4 border-b border-white/10 bg-[hsl(220,40%,8%)]/80 backdrop-blur-sm px-4">
            <SidebarTrigger className="text-foreground hover:bg-white/10" />
            <span className="text-sm font-medium text-muted-foreground">{getTabDisplayName()}</span>
            
            <div className="ml-auto flex items-center gap-2">
              {isClientUser && (
                <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-500 text-xs gap-1">
                  <Eye className="h-3 w-3" />
                  Solo Lectura
                </Badge>
              )}
              <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary text-xs">
                Peru
              </Badge>
            </div>
          </header>

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
