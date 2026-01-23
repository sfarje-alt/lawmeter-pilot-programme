import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
import { ReportGenerator } from "@/components/reports/ReportGenerator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, FileText, BarChart3, Plus } from "lucide-react";
import Inbox from "@/pages/Inbox";

function ClientsPlaceholder() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground">Manage client profiles and monitoring rules</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Client Profile
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="glass-card border-border/30">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-foreground">0</div>
            <div className="text-sm text-muted-foreground">Active Clients</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/30">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-foreground">0</div>
            <div className="text-sm text-muted-foreground">Client Users</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/30">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-foreground">0</div>
            <div className="text-sm text-muted-foreground">Monitoring Rules</div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-border/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Client Profiles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No client profiles yet.</p>
            <p className="text-sm mt-1">Create your first client profile to start monitoring legislation.</p>
            <Button className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Create Client Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ReportsPlaceholder() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground">Generate and manage client reports</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Report
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="glass-card border-border/30">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-foreground">0</div>
            <div className="text-sm text-muted-foreground">Reports Generated</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/30">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-foreground">0</div>
            <div className="text-sm text-muted-foreground">Pending Delivery</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/30">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-foreground">0</div>
            <div className="text-sm text-muted-foreground">Sent This Week</div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-border/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Report History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No reports generated yet.</p>
            <p className="text-sm mt-1">Compile published alerts into client reports.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AnalyticsPlaceholder() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Peru legislation intelligence dashboard</p>
        </div>
        <Badge variant="outline" className="bg-primary/10 border-primary/30">
          Peru Focus
        </Badge>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="glass-card border-border/30">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-foreground">47</div>
            <div className="text-sm text-muted-foreground">Laws Analyzed (30d)</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/30">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-foreground">23</div>
            <div className="text-sm text-muted-foreground">Bills in Progress</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/30">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-foreground">8</div>
            <div className="text-sm text-muted-foreground">Sessions This Week</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/30">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-foreground">5</div>
            <div className="text-sm text-muted-foreground">Commissions Tracked</div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-border/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Legislative Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Analytics dashboard coming soon.</p>
            <p className="text-sm mt-1">View trends, patterns, and insights from Peru legislation.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LawMeterDashboard() {
  const navigate = useNavigate();
  const { shouldShowDailyPopup, profile } = useAuth();
  const [activeTab, setActiveTab] = useState("inbox"); // Default to inbox for legal team
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showDailyPopup, setShowDailyPopup] = useState(false);

  // Show daily popup on first render if needed
  useEffect(() => {
    if (shouldShowDailyPopup) {
      setShowDailyPopup(true);
    }
  }, [shouldShowDailyPopup]);

  const renderContent = () => {
    switch (activeTab) {
      case "sessions":
        return <SessionsPage />;
      case "inbox":
        return <Inbox />;
      case "clients":
        return <ClientsPage />;
      case "reports":
        return <ReportGenerator />;
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
            <span className="text-sm font-medium text-muted-foreground capitalize">{activeTab}</span>
            <Badge variant="outline" className="ml-auto bg-primary/10 border-primary/30 text-primary text-xs">
              Peru
            </Badge>
          </header>

          <div className="container mx-auto px-6 py-8">
            {renderContent()}
          </div>
        </SidebarInset>

        <AlertSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
        <DailySummaryPopup 
          open={showDailyPopup} 
          onOpenChange={setShowDailyPopup} 
        />
      </div>
    </SidebarProvider>
  );
}
