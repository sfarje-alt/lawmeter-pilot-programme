import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Clock, BarChart3, Star, Users, AlertTriangle, Receipt, Settings, Calendar, BookOpen, Grid, List } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import lawmeterLogo from "@/assets/lawmeter-logo-white.png";
import { useLegislationData, useFilteredAlerts } from "@/hooks/useLegislationData";
import { useStarredAlerts } from "@/hooks/useStarredAlerts";
import { mockBills } from "@/data/mockBills";
import { FilterState, Alert, BillItem } from "@/types/legislation";
import { FilterBar } from "@/components/shared/FilterBar";
import { ChartsPanel } from "@/components/shared/ChartsPanel";
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
  const [starredFilter, setStarredFilter] = useState<"all" | "acts" | "bills">("all");
  
  // Independent state for Acts
  const [actsFilters, setActsFilters] = useState<FilterState>({
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
    chambers: [],
    sortBy: "registered",
    sortOrder: "desc",
  });
  const [actsViewMode, setActsViewMode] = useState<"list" | "grid">("list");
  const [actsPage, setActsPage] = useState(1);
  const [actsPerPage, setActsPerPage] = useState(25);
  
  // Independent state for Bills
  const [billsFilters, setBillsFilters] = useState<FilterState>({
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
    chambers: [],
    sortBy: "registered",
    sortOrder: "desc",
  });
  const [billsViewMode, setBillsViewMode] = useState<"list" | "grid">("list");
  const [billsPage, setBillsPage] = useState(1);
  const [billsPerPage, setBillsPerPage] = useState(25);

  const starredHooks = useStarredAlerts();
  const filteredAlerts = useFilteredAlerts(alerts, actsFilters);

  // Extract unique values for filters
  const portfolios = useMemo(() => [...new Set(alerts.map(a => a.ministry).filter(Boolean))], [alerts]);
  const types = useMemo(() => {
    return [...new Set(alerts.map(a => a.norm_type).filter(Boolean))];
  }, [alerts]);
  const parties = useMemo(() => [...new Set(mockBills.map(b => b.party).filter(Boolean))], []);

  // KPIs for Acts
  const actsKPIs = {
    total: filteredAlerts.length,
    highRisk: filteredAlerts.filter(a => a.AI_triage?.risk_level === "high").length,
    mediumRisk: filteredAlerts.filter(a => a.AI_triage?.risk_level === "medium").length,
    lowRisk: filteredAlerts.filter(a => a.AI_triage?.risk_level === "low").length,
    upcomingDeadlines: filteredAlerts.filter(a => isUpcomingDeadline(a.AI_triage?.deadline_detected)).length,
    portfolios: new Set(filteredAlerts.map(a => a.ministry)).size,
  };

  // Filter bills
  const filteredBills = mockBills.filter(bill => {
    if (billsFilters.portfolios.length > 0 && bill.portfolio && !billsFilters.portfolios.includes(bill.portfolio)) return false;
    if (billsFilters.parties.length > 0 && bill.party && !billsFilters.parties.includes(bill.party)) return false;
    if (bill.risk_score < billsFilters.riskScoreRange[0] || bill.risk_score > billsFilters.riskScoreRange[1]) return false;
    if (billsFilters.riskLevels.length > 0 && !billsFilters.riskLevels.includes(bill.risk_level)) return false;
    if (billsFilters.chambers.length > 0 && !billsFilters.chambers.includes(bill.chamber)) return false;
    if (billsFilters.searchText) {
      const search = billsFilters.searchText.toLowerCase();
      if (!bill.title.toLowerCase().includes(search) && 
          !bill.summary.toLowerCase().includes(search) &&
          !bill.bullets.some(b => b.toLowerCase().includes(search))) return false;
    }
    return true;
  }).sort((a, b) => {
    if (billsFilters.sortBy === "risk") {
      return billsFilters.sortOrder === "desc" ? b.risk_score - a.risk_score : a.risk_score - b.risk_score;
    }
    // Default sort by last action date (registered)
    const dateA = new Date(a.lastActionDate).getTime();
    const dateB = new Date(b.lastActionDate).getTime();
    return billsFilters.sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  const billsKPIs = {
    total: filteredBills.length,
    highRisk: filteredBills.filter(b => b.risk_level === "high").length,
    mediumRisk: filteredBills.filter(b => b.risk_level === "medium").length,
    lowRisk: filteredBills.filter(b => b.risk_level === "low").length,
    house: filteredBills.filter(b => b.chamber === "House").length,
    senate: filteredBills.filter(b => b.chamber === "Senate").length,
  };

  // Pagination
  const paginatedAlerts = useMemo(() => {
    const startIndex = (actsPage - 1) * actsPerPage;
    return filteredAlerts.slice(startIndex, startIndex + actsPerPage);
  }, [filteredAlerts, actsPage, actsPerPage]);

  const paginatedBills = useMemo(() => {
    const startIndex = (billsPage - 1) * billsPerPage;
    return filteredBills.slice(startIndex, startIndex + billsPerPage);
  }, [filteredBills, billsPage, billsPerPage]);

  const totalActsPages = Math.ceil(filteredAlerts.length / actsPerPage);
  const totalBillsPages = Math.ceil(filteredBills.length / billsPerPage);

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
                <h1 className="text-2xl font-bold text-foreground leading-tight">Costa Rica 🇨🇷</h1>
                <p className="text-sm text-muted-foreground mt-0.5">Monitoreo Regulatorio</p>
              </div>
              
              {/* Separator */}
              <div className="border-l border-border h-14"></div>
              
              {/* Powered by */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">Powered by</span>
                <img src={lawmeterLogo} alt="LawMeter" className="h-8" />
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
            <TabsTrigger value="bills"><FileText className="h-4 w-4 mr-2" />Proyectos</TabsTrigger>
            <TabsTrigger value="media"><FileText className="h-4 w-4 mr-2" />Media</TabsTrigger>
            <TabsTrigger value="social"><Users className="h-4 w-4 mr-2" />Social</TabsTrigger>
            <TabsTrigger value="starred"><Star className="h-4 w-4 mr-2" />Starred</TabsTrigger>
            <TabsTrigger value="calendar"><Calendar className="h-4 w-4 mr-2" />Calendar</TabsTrigger>
            <TabsTrigger value="analytics"><BarChart3 className="h-4 w-4 mr-2" />Analytics</TabsTrigger>
            <TabsTrigger value="tenders"><Receipt className="h-4 w-4 mr-2" />Tenders</TabsTrigger>
            <TabsTrigger value="contact"><Users className="h-4 w-4 mr-2" />Contact</TabsTrigger>
          </TabsList>

          {activeTab === "acts" && (
            <FilterBar
              filters={actsFilters}
              onFiltersChange={setActsFilters}
              portfolios={portfolios}
              types={types}
              showPartyFilters={false}
              showRiskScore={true}
              searchData={alerts}
              searchType="acts"
              onSelectSearchItem={(item) => setSelectedAlert(item as Alert)}
            />
          )}
          
          {activeTab === "bills" && (
            <FilterBar
              filters={billsFilters}
              onFiltersChange={setBillsFilters}
              portfolios={portfolios}
              types={types}
              parties={parties}
              showPartyFilters={true}
              showRiskScore={true}
              searchData={mockBills}
              searchType="bills"
              onSelectSearchItem={(item) => setSelectedBill(item as BillItem)}
            />
          )}

          <TabsContent value="acts" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Alerts</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{actsKPIs.total}</div></CardContent></Card>
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${actsFilters.riskLevels.includes("high") ? "ring-2 ring-risk-high" : ""}`}
                onClick={() => {
                  setActsFilters(prev => ({
                    ...prev,
                    riskLevels: prev.riskLevels.includes("high") 
                      ? prev.riskLevels.filter(r => r !== "high")
                      : [...prev.riskLevels, "high"]
                  }));
                  setActsPage(1);
                }}
              >
                <CardHeader className="pb-2"><CardTitle className="text-sm">High Risk</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold text-risk-high">{actsKPIs.highRisk}</div></CardContent>
              </Card>
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${actsFilters.riskLevels.includes("medium") ? "ring-2 ring-risk-medium" : ""}`}
                onClick={() => {
                  setActsFilters(prev => ({
                    ...prev,
                    riskLevels: prev.riskLevels.includes("medium") 
                      ? prev.riskLevels.filter(r => r !== "medium")
                      : [...prev.riskLevels, "medium"]
                  }));
                  setActsPage(1);
                }}
              >
                <CardHeader className="pb-2"><CardTitle className="text-sm">Medium Risk</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold text-risk-medium">{actsKPIs.mediumRisk}</div></CardContent>
              </Card>
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${actsFilters.riskLevels.includes("low") ? "ring-2 ring-risk-low" : ""}`}
                onClick={() => {
                  setActsFilters(prev => ({
                    ...prev,
                    riskLevels: prev.riskLevels.includes("low") 
                      ? prev.riskLevels.filter(r => r !== "low")
                      : [...prev.riskLevels, "low"]
                  }));
                  setActsPage(1);
                }}
              >
                <CardHeader className="pb-2"><CardTitle className="text-sm">Low Risk</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold text-risk-low">{actsKPIs.lowRisk}</div></CardContent>
              </Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Portfolios</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{actsKPIs.portfolios}</div></CardContent></Card>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Showing {((actsPage - 1) * actsPerPage) + 1}-{Math.min(actsPage * actsPerPage, filteredAlerts.length)} of {filteredAlerts.length}
                </span>
                <Select value={String(actsPerPage)} onValueChange={(v) => { setActsPerPage(Number(v)); setActsPage(1); }}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={actsViewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setActsViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={actsViewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setActsViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className={actsViewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
              {paginatedAlerts.map(alert => (
                <AlertActCard
                  key={alert.title_id}
                  alert={alert}
                  isStarred={starredHooks.isStarred("ACTS", alert.title_id)}
                  onToggleStar={() => starredHooks.toggleStar("ACTS", alert.title_id)}
                  onOpenDrawer={() => setSelectedAlert(alert)}
                  isPronouncementRead={(id) => starredHooks.isPronouncementRead("ACTS", alert.title_id, id)}
                />
              ))}
            </div>

            {totalActsPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setActsPage(p => Math.max(1, p - 1))}
                  disabled={actsPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {actsPage} of {totalActsPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setActsPage(p => Math.min(totalActsPages, p + 1))}
                  disabled={actsPage === totalActsPages}
                >
                  Next
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="bills" className="space-y-6 mt-6">
            <div className="bg-warning/10 border border-warning rounded-lg p-4 mb-4">
              <div className="flex gap-2"><AlertTriangle className="h-5 w-5 text-warning" /><div><p className="font-semibold">Datos de demostración</p><p className="text-sm">Los proyectos son ficticios para propósitos de demostración.</p></div></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${billsFilters.riskLevels.includes("high") ? "ring-2 ring-risk-high" : ""}`}
                onClick={() => {
                  setBillsFilters(prev => ({
                    ...prev,
                    riskLevels: prev.riskLevels.includes("high") 
                      ? prev.riskLevels.filter(r => r !== "high")
                      : [...prev.riskLevels, "high"]
                  }));
                  setBillsPage(1);
                }}
              >
                <CardHeader className="pb-2"><CardTitle className="text-sm">High Risk</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold text-risk-high">{billsKPIs.highRisk}</div></CardContent>
              </Card>
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${billsFilters.riskLevels.includes("medium") ? "ring-2 ring-risk-medium" : ""}`}
                onClick={() => {
                  setBillsFilters(prev => ({
                    ...prev,
                    riskLevels: prev.riskLevels.includes("medium") 
                      ? prev.riskLevels.filter(r => r !== "medium")
                      : [...prev.riskLevels, "medium"]
                  }));
                  setBillsPage(1);
                }}
              >
                <CardHeader className="pb-2"><CardTitle className="text-sm">Medium Risk</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold text-risk-medium">{billsKPIs.mediumRisk}</div></CardContent>
              </Card>
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${billsFilters.riskLevels.includes("low") ? "ring-2 ring-risk-low" : ""}`}
                onClick={() => {
                  setBillsFilters(prev => ({
                    ...prev,
                    riskLevels: prev.riskLevels.includes("low") 
                      ? prev.riskLevels.filter(r => r !== "low")
                      : [...prev.riskLevels, "low"]
                  }));
                  setBillsPage(1);
                }}
              >
                <CardHeader className="pb-2"><CardTitle className="text-sm">Low Risk</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold text-risk-low">{billsKPIs.lowRisk}</div></CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${billsFilters.chambers.includes("House") ? "ring-2 ring-primary" : ""}`}
                onClick={() => {
                  setBillsFilters(prev => ({
                    ...prev,
                    chambers: prev.chambers.includes("House") 
                      ? prev.chambers.filter(c => c !== "House")
                      : [...prev.chambers, "House"]
                  }));
                  setBillsPage(1);
                }}
              >
                <CardHeader className="pb-2"><CardTitle className="text-sm">House</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold">{billsKPIs.house}</div></CardContent>
              </Card>
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${billsFilters.chambers.includes("Senate") ? "ring-2 ring-primary" : ""}`}
                onClick={() => {
                  setBillsFilters(prev => ({
                    ...prev,
                    chambers: prev.chambers.includes("Senate") 
                      ? prev.chambers.filter(c => c !== "Senate")
                      : [...prev.chambers, "Senate"]
                  }));
                  setBillsPage(1);
                }}
              >
                <CardHeader className="pb-2"><CardTitle className="text-sm">Senate</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold">{billsKPIs.senate}</div></CardContent>
              </Card>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Showing {((billsPage - 1) * billsPerPage) + 1}-{Math.min(billsPage * billsPerPage, filteredBills.length)} of {filteredBills.length}
                </span>
                <Select value={String(billsPerPage)} onValueChange={(v) => { setBillsPerPage(Number(v)); setBillsPage(1); }}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={billsViewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setBillsViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={billsViewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setBillsViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className={billsViewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
              {paginatedBills.map(bill => (
                <BillCard
                  key={bill.id}
                  bill={bill}
                  isStarred={starredHooks.isStarred("BILLS", bill.id)}
                  onToggleStar={() => starredHooks.toggleStar("BILLS", bill.id)}
                  onOpenDrawer={() => setSelectedBill(bill)}
                />
              ))}
            </div>

            {totalBillsPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setBillsPage(p => Math.max(1, p - 1))}
                  disabled={billsPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {billsPage} of {totalBillsPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setBillsPage(p => Math.min(totalBillsPages, p + 1))}
                  disabled={billsPage === totalBillsPages}
                >
                  Next
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="starred" className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Starred Items</h3>
              <Select 
                value={starredFilter} 
                onValueChange={(value: "all" | "acts" | "bills") => setStarredFilter(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="acts">Acts Only</SelectItem>
                  <SelectItem value="bills">Solo Proyectos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {starredHooks.starred.length === 0 ? (
              <Card><CardContent className="py-12 text-center"><Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p>No starred items yet</p></CardContent></Card>
            ) : (
              <div className="space-y-4">
                {(starredFilter === "all" || starredFilter === "acts") && starredHooks.starred.filter(s => s.startsWith("ACTS:")).map(key => {
                  const id = key.replace("ACTS:", "");
                  const alert = alerts.find(a => a.title_id === id);
                  return alert ? (
                    <AlertActCard 
                      key={id} 
                      alert={alert} 
                      isStarred 
                      onToggleStar={() => starredHooks.toggleStar("ACTS", id)} 
                      onOpenDrawer={() => setSelectedAlert(alert)}
                      isPronouncementRead={(pronouncementId) => starredHooks.isPronouncementRead("ACTS", id, pronouncementId)}
                    />
                  ) : null;
                })}
                {(starredFilter === "all" || starredFilter === "bills") && starredHooks.starred.filter(s => s.startsWith("BILLS:")).map(key => {
                  const id = key.replace("BILLS:", "");
                  const bill = mockBills.find(b => b.id === id);
                  return bill ? <BillCard key={id} bill={bill} isStarred onToggleStar={() => starredHooks.toggleStar("BILLS", id)} onOpenDrawer={() => setSelectedBill(bill)} /> : null;
                })}
                {((starredFilter === "acts" && !starredHooks.starred.some(s => s.startsWith("ACTS:"))) ||
                  (starredFilter === "bills" && !starredHooks.starred.some(s => s.startsWith("BILLS:")))) && (
                  <Card><CardContent className="py-12 text-center"><Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p>No starred {starredFilter} yet</p></CardContent></Card>
                )}
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
        isStarred={selectedAlert ? starredHooks.isStarred("ACTS", selectedAlert.title_id) : false}
        onMarkPronouncementsRead={(ids) => selectedAlert && starredHooks.markPronouncementsAsRead("ACTS", selectedAlert.title_id, ids)}
        isPronouncementRead={(id) => selectedAlert ? starredHooks.isPronouncementRead("ACTS", selectedAlert.title_id, id) : false}
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
