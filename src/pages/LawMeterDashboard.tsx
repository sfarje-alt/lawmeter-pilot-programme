import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Clock, BarChart3, Star, Users, AlertTriangle, Receipt, Settings, Calendar, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import lawmeterLogo from "@/assets/lawmeter-logo-white.png";
import { useLegislationData, useFilteredAlerts } from "@/hooks/useLegislationData";
import { useStarredAlerts } from "@/hooks/useStarredAlerts";
import { mockBills } from "@/data/mockBills";
import { FilterState, Alert, BillItem } from "@/types/legislation";
import { FilterBar } from "@/components/shared/FilterBar";
import { ChartsPanel } from "@/components/shared/ChartsPanel";
import { TextualTrendsChart } from "@/components/analytics/TextualTrendsChart";
import { AlertActCard } from "@/components/acts/AlertActCard";
import { AlertActDrawer } from "@/components/acts/AlertActDrawer";
import { BillCard } from "@/components/bills/BillCard";
import { BillDrawer } from "@/components/bills/BillDrawer";
import { AlertSettingsDialog } from "@/components/alerts/AlertSettingsDialog";
import { LegislativeCalendar } from "@/components/calendar/LegislativeCalendar";
import { ContactForm } from "@/components/ContactForm";
import { TendersSection } from "@/components/tenders/TendersSection";
import { MediaMonitoringDemo } from "@/components/media/MediaMonitoringDemo";
import { SocialListeningDemo } from "@/components/media/SocialListeningDemo";
import { isUpcomingDeadline } from "@/lib/dateUtils";

export default function LawMeterDashboard() {
  const navigate = useNavigate();
  const { alerts, loading } = useLegislationData();
  const [activeTab, setActiveTab] = useState("acts");
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [selectedBill, setSelectedBill] = useState<BillItem | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    timeWindow: "all",
    portfolios: [],
    regulators: [],
    types: [],
    riskScoreRange: [0, 100],
    parties: [],
    mpSearch: "",
    searchText: "",
    riskLevels: [],
    urgencyLevels: [],
    hasDeadline: null,
    sortBy: "date",
    sortOrder: "desc",
  });

  const starredHooks = useStarredAlerts();
  const filteredAlerts = useFilteredAlerts(alerts, filters);

  // Extract unique values for filters
  const portfolios = useMemo(() => [...new Set(alerts.map(a => a.csv_portfolio).filter(Boolean))], [alerts]);
  const types = useMemo(() => {
    const collections = alerts.map(a => a.csv_collection).filter(Boolean);
    const docViews = alerts.map(a => a.doc_view).filter(Boolean);
    return [...new Set([...collections, ...docViews])];
  }, [alerts]);
  const parties = useMemo(() => [...new Set(mockBills.map(b => b.party).filter(Boolean))], []);

  // KPIs for Acts
  const actsKPIs = {
    total: filteredAlerts.length,
    highRisk: filteredAlerts.filter(a => a.AI_triage?.risk_level === "high").length,
    upcomingDeadlines: filteredAlerts.filter(a => isUpcomingDeadline(a.AI_triage?.deadline_detected)).length,
    portfolios: new Set(filteredAlerts.map(a => a.csv_portfolio)).size,
  };

  // Filter bills
  const filteredBills = mockBills.filter(bill => {
    if (filters.portfolios.length > 0 && bill.portfolio && !filters.portfolios.includes(bill.portfolio)) return false;
    if (filters.parties.length > 0 && bill.party && !filters.parties.includes(bill.party)) return false;
    if (bill.risk_score < filters.riskScoreRange[0] || bill.risk_score > filters.riskScoreRange[1]) return false;
    if (filters.searchText) {
      const search = filters.searchText.toLowerCase();
      if (!bill.title.toLowerCase().includes(search) && 
          !bill.summary.toLowerCase().includes(search) &&
          !bill.bullets.some(b => b.toLowerCase().includes(search))) return false;
    }
    return true;
  });

  const billsKPIs = {
    total: filteredBills.length,
    house: filteredBills.filter(b => b.chamber === "House").length,
    senate: filteredBills.filter(b => b.chamber === "Senate").length,
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading legislation data...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b shadow-sm sticky top-0 z-10 bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Left side - Title */}
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground leading-tight">Macquarie Hospital Group Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-0.5">Regulatory Monitoring</p>
              </div>
              
              {/* Separator */}
              <div className="border-l border-border h-14"></div>
              
              {/* Powered by */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">Powered by</span>
                <img src={lawmeterLogo} alt="LawMeter" className="h-16" />
              </div>
            </div>

            {/* Right side - Buttons and Badge */}
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate("/documentation")}
                className="gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Documentation
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSettingsOpen(true)}
                className="gap-2"
              >
                <Settings className="w-4 h-4" />
                Alert Settings
              </Button>
              <Badge variant="outline" className="bg-success/10">
                <Clock className="h-3 w-3 mr-1" />
                Updated: Just now
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-9 mb-6">
            <TabsTrigger value="acts"><FileText className="h-4 w-4 mr-2" />Acts</TabsTrigger>
            <TabsTrigger value="bills"><FileText className="h-4 w-4 mr-2" />Bills</TabsTrigger>
            <TabsTrigger value="media"><FileText className="h-4 w-4 mr-2" />Media</TabsTrigger>
            <TabsTrigger value="social"><Users className="h-4 w-4 mr-2" />Social</TabsTrigger>
            <TabsTrigger value="starred"><Star className="h-4 w-4 mr-2" />Starred</TabsTrigger>
            <TabsTrigger value="calendar"><Calendar className="h-4 w-4 mr-2" />Calendar</TabsTrigger>
            <TabsTrigger value="analytics"><BarChart3 className="h-4 w-4 mr-2" />Analytics</TabsTrigger>
            <TabsTrigger value="tenders"><Receipt className="h-4 w-4 mr-2" />Tenders</TabsTrigger>
            <TabsTrigger value="contact"><Users className="h-4 w-4 mr-2" />Contact</TabsTrigger>
          </TabsList>

          <FilterBar
            filters={filters}
            onFiltersChange={setFilters}
            portfolios={portfolios}
            types={types}
            parties={parties}
            showPartyFilters={activeTab === "bills"}
            showRiskScore={activeTab !== "tenders"}
          />

          <TabsContent value="acts" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Alerts</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{actsKPIs.total}</div></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm">High Risk</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-risk-high">{actsKPIs.highRisk}</div></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Deadlines (30d)</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-warning">{actsKPIs.upcomingDeadlines}</div></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Portfolios</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{actsKPIs.portfolios}</div></CardContent></Card>
            </div>
            
            <TextualTrendsChart data={filteredAlerts} type="acts" />
            
            <div className="space-y-4">
              {filteredAlerts.map(alert => (
                <AlertActCard
                  key={alert.title_id}
                  alert={alert}
                  isStarred={starredHooks.isStarred("ACTS", alert.title_id)}
                  onToggleStar={() => starredHooks.toggleStar("ACTS", alert.title_id)}
                  onOpenDrawer={() => setSelectedAlert(alert)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bills" className="space-y-6 mt-6">
            <div className="bg-warning/10 border border-warning rounded-lg p-4 mb-4">
              <div className="flex gap-2"><AlertTriangle className="h-5 w-5 text-warning" /><div><p className="font-semibold">Mock Data</p><p className="text-sm">Bills are fictitious for demonstration purposes.</p></div></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Bills</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{billsKPIs.total}</div></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm">House</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{billsKPIs.house}</div></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Senate</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{billsKPIs.senate}</div></CardContent></Card>
            </div>
            
            <TextualTrendsChart data={filteredBills} type="bills" />
            
            <div className="space-y-4">
              {filteredBills.map(bill => (
                <BillCard
                  key={bill.id}
                  bill={bill}
                  isStarred={starredHooks.isStarred("BILLS", bill.id)}
                  onToggleStar={() => starredHooks.toggleStar("BILLS", bill.id)}
                  onOpenDrawer={() => setSelectedBill(bill)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="starred" className="space-y-6 mt-6">
            <h3 className="text-lg font-semibold">Starred Alerts & Bills</h3>
            {starredHooks.starred.length === 0 ? (
              <Card><CardContent className="py-12 text-center"><Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p>No starred items yet</p></CardContent></Card>
            ) : (
              <div className="space-y-4">
                {starredHooks.starred.filter(s => s.startsWith("ACTS:")).map(key => {
                  const id = key.replace("ACTS:", "");
                  const alert = alerts.find(a => a.title_id === id);
                  return alert ? <AlertActCard key={id} alert={alert} isStarred onToggleStar={() => starredHooks.toggleStar("ACTS", id)} onOpenDrawer={() => setSelectedAlert(alert)} /> : null;
                })}
                {starredHooks.starred.filter(s => s.startsWith("BILLS:")).map(key => {
                  const id = key.replace("BILLS:", "");
                  const bill = mockBills.find(b => b.id === id);
                  return bill ? <BillCard key={id} bill={bill} isStarred onToggleStar={() => starredHooks.toggleStar("BILLS", id)} onOpenDrawer={() => setSelectedBill(bill)} /> : null;
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <LegislativeCalendar 
              alerts={filteredAlerts} 
              bills={filteredBills}
            />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <ChartsPanel 
              data={activeTab === "bills" ? filteredBills : filteredAlerts} 
              type={activeTab === "bills" ? "bills" : "acts"} 
            />
          </TabsContent>

          <TabsContent value="tenders" className="mt-6">
            <TendersSection />
          </TabsContent>

          <TabsContent value="media" className="mt-6">
            <MediaMonitoringDemo />
          </TabsContent>

          <TabsContent value="social" className="mt-6">
            <SocialListeningDemo />
          </TabsContent>

          <TabsContent value="contact" className="mt-6">
            <ContactForm />
          </TabsContent>
        </Tabs>
      </div>

      <AlertActDrawer
        alert={selectedAlert}
        isOpen={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
        comments={selectedAlert ? starredHooks.getComments("ACTS", selectedAlert.title_id) : []}
        onAddComment={(vis, body) => selectedAlert && starredHooks.addComment("ACTS", selectedAlert.title_id, vis, body)}
        onDeleteComment={(id) => selectedAlert && starredHooks.deleteComment("ACTS", selectedAlert.title_id, id)}
      />

      <BillDrawer
        bill={selectedBill}
        isOpen={!!selectedBill}
        onClose={() => setSelectedBill(null)}
        comments={selectedBill ? starredHooks.getComments("BILLS", selectedBill.id) : []}
        onAddComment={(vis, body) => selectedBill && starredHooks.addComment("BILLS", selectedBill.id, vis, body)}
        onDeleteComment={(id) => selectedBill && starredHooks.deleteComment("BILLS", selectedBill.id, id)}
      />

      <AlertSettingsDialog 
        open={settingsOpen} 
        onOpenChange={setSettingsOpen} 
      />

      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center">
            <img 
              src={lawmeterLogo} 
              alt="LawMeter - Legal Tech" 
              className="h-20 opacity-90 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
