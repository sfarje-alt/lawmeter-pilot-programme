import { useState, useMemo, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Clock, BarChart3, Star, Users, AlertTriangle, Receipt, Settings, Calendar, BookOpen, Grid, List, Building2, Shield } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, useSearchParams } from "react-router-dom";
import lawmeterLogo from "@/assets/logo-legal-tech.png";
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
import { LegislativeSessionsCalendar } from "@/components/calendar/LegislativeSessionsCalendar";
import { useNavigate as useReactRouterNavigate } from "react-router-dom";
import { ContactForm } from "@/components/ContactForm";
import { TendersSection } from "@/components/tenders/TendersSection";
import { MediaMonitoringDemo } from "@/components/media/MediaMonitoringDemo";
import { SocialListeningDemo } from "@/components/media/SocialListeningDemo";
import { isUpcomingDeadline } from "@/lib/dateUtils";
import { CongressBillsSection } from "@/components/congress/CongressBillsSection";
import { CertificateFilters as CertFilters } from '@/components/certificates/CertificateFilters';
import { SummaryCards } from '@/components/certificates/SummaryCards';
import { CertificateTable } from '@/components/certificates/CertificateTable';
import { useCertificates } from '@/hooks/useCertificates';
import { CertificateFilters as CertificateFiltersType } from '@/types/certificates';
import { Download, Plus } from "lucide-react";
import { InternationalLegislationSection } from "@/components/legislation/InternationalLegislationSection";
import { GCCRegionMap } from "@/components/maps";
import { 
  usStateBills, 
  canadaLegislation, 
  japanLegislation, 
  koreaLegislation, 
  taiwanLegislation,
  euRegulations,
  euDirectives,
  euParliament,
  euCouncil,
  uaeLegislation,
  saudiLegislation,
  omanLegislation,
  kuwaitLegislation,
  bahrainLegislation,
  qatarLegislation
} from "@/data/mockInternationalLegislation";

export default function LawMeterDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { alerts, loading } = useLegislationData();
  const [activeTab, setActiveTab] = useState("legislation");
  const [selectedCountry, setSelectedCountry] = useState<"usa" | "costa-rica" | "japan" | "korea" | "taiwan" | "canada" | "gcc" | "eu">("usa");
  const [usaSubTab, setUsaSubTab] = useState<"federal" | "state">("federal");
  const [costaRicaSubTab, setCostaRicaSubTab] = useState<"normas" | "proyectos">("normas");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
  const [gccSubTab, setGccSubTab] = useState<"uae" | "saudi" | "oman" | "kuwait" | "bahrain" | "qatar">("uae");
  const [euSubTab, setEuSubTab] = useState<"regulations" | "directives" | "parliament" | "council">("regulations");
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
  
  // Certificates state
  const [certificateFilters, setCertificateFilters] = useState<CertificateFiltersType>({});
  const { data: certificates = [], isLoading: certificatesLoading } = useCertificates(certificateFilters);

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

  // Handle URL tab parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading legislation data...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(220,40%,8%)] via-[hsl(220,45%,6%)] to-[hsl(220,50%,4%)]">
      <header className="border-b border-white/10 sticky top-0 z-10 glass-card shadow-lg">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between gap-12">
            {/* Left side - Title */}
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground leading-tight">Intelligence Hub</h1>
              </div>
              
              {/* Separator */}
              <div className="border-l border-white/20 h-14"></div>
              
              {/* Powered by */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">Developed by</span>
                <img src={lawmeterLogo} alt="LawMeter" className="h-32" />
              </div>
            </div>

            {/* Right side - Buttons and Badge */}
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/business-intelligence")}
                className="gap-2 hover:bg-white/10"
              >
                <Users className="w-4 h-4" />
                Business Intelligence
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/documentation")}
                className="gap-2 hover:bg-white/10"
              >
                <BookOpen className="w-4 h-4" />
                Documentation
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setSettingsOpen(true)}
                className="gap-2 hover:bg-white/10"
              >
                <Settings className="w-4 h-4" />
                Alert Settings
              </Button>
              <Badge variant="outline" className="bg-success/20 border-success/30 text-success-foreground">
                <Clock className="h-3 w-3 mr-1" />
                Updated: Now
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-9 mb-8 glass-card p-1 gap-1">
            <TabsTrigger value="legislation" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"><FileText className="h-4 w-4 mr-2" />Legislation</TabsTrigger>
            <TabsTrigger value="media" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"><FileText className="h-4 w-4 mr-2" />Media</TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"><Users className="h-4 w-4 mr-2" />Social</TabsTrigger>
            <TabsTrigger value="starred" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"><Star className="h-4 w-4 mr-2" />Starred</TabsTrigger>
            <TabsTrigger value="certificates" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"><Shield className="h-4 w-4 mr-2" />Certificates</TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"><Calendar className="h-4 w-4 mr-2" />Calendar</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"><BarChart3 className="h-4 w-4 mr-2" />Analytics</TabsTrigger>
            <TabsTrigger value="tenders" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"><Receipt className="h-4 w-4 mr-2" />Tenders</TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"><Users className="h-4 w-4 mr-2" />Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="legislation" className="space-y-6 mt-6">
            {/* Country Selector */}
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <span className="text-sm font-medium text-muted-foreground">Select Region:</span>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedCountry === "usa" ? "default" : "outline"}
                  onClick={() => setSelectedCountry("usa")}
                  className="gap-2"
                >
                  🇺🇸 USA
                </Button>
                <Button
                  variant={selectedCountry === "canada" ? "default" : "outline"}
                  onClick={() => setSelectedCountry("canada")}
                  className="gap-2"
                >
                  🇨🇦 Canada
                </Button>
                <Button
                  variant={selectedCountry === "costa-rica" ? "default" : "outline"}
                  onClick={() => setSelectedCountry("costa-rica")}
                  className="gap-2"
                >
                  🇨🇷 Costa Rica
                </Button>
                <Button
                  variant={selectedCountry === "eu" ? "default" : "outline"}
                  onClick={() => setSelectedCountry("eu")}
                  className="gap-2"
                >
                  🇪🇺 EU
                </Button>
                <Button
                  variant={selectedCountry === "gcc" ? "default" : "outline"}
                  onClick={() => setSelectedCountry("gcc")}
                  className="gap-2"
                >
                  🏛️ GCC
                </Button>
                <Button
                  variant={selectedCountry === "japan" ? "default" : "outline"}
                  onClick={() => setSelectedCountry("japan")}
                  className="gap-2"
                >
                  🇯🇵 Japan
                </Button>
                <Button
                  variant={selectedCountry === "korea" ? "default" : "outline"}
                  onClick={() => setSelectedCountry("korea")}
                  className="gap-2"
                >
                  🇰🇷 Korea
                </Button>
                <Button
                  variant={selectedCountry === "taiwan" ? "default" : "outline"}
                  onClick={() => setSelectedCountry("taiwan")}
                  className="gap-2"
                >
                  🇹🇼 Taiwan
                </Button>
              </div>
            </div>

            {/* USA Section */}
            {selectedCountry === "usa" && (
              <Tabs value={usaSubTab} onValueChange={(v) => setUsaSubTab(v as "federal" | "state")} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 glass-card p-1 gap-1">
                  <TabsTrigger value="federal" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                    <Building2 className="h-4 w-4 mr-2" />
                    US Federal Bills
                  </TabsTrigger>
                  <TabsTrigger value="state" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                    <FileText className="h-4 w-4 mr-2" />
                    State Bills
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="federal" className="space-y-6 mt-6">
                  <CongressBillsSection />
                </TabsContent>

                <TabsContent value="state" className="space-y-6 mt-6">
                  {/* State Filter */}
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm font-medium">Filter by State:</span>
                    <Select
                      value={selectedStates.length === 1 ? selectedStates[0] : ""}
                      onValueChange={(value) => {
                        if (value === "all") {
                          setSelectedStates([]);
                        } else {
                          setSelectedStates(prev => 
                            prev.includes(value) 
                              ? prev.filter(s => s !== value)
                              : [...prev, value]
                          );
                        }
                      }}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder={selectedStates.length > 0 ? `${selectedStates.length} selected` : "All States"} />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border">
                        <SelectItem value="all">All States</SelectItem>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                        <SelectItem value="IL">Illinois</SelectItem>
                        <SelectItem value="PA">Pennsylvania</SelectItem>
                        <SelectItem value="OH">Ohio</SelectItem>
                        <SelectItem value="GA">Georgia</SelectItem>
                        <SelectItem value="NC">North Carolina</SelectItem>
                        <SelectItem value="MI">Michigan</SelectItem>
                      </SelectContent>
                    </Select>
                    {selectedStates.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedStates.map(state => (
                          <Badge 
                            key={state} 
                            variant="secondary" 
                            className="cursor-pointer"
                            onClick={() => setSelectedStates(prev => prev.filter(s => s !== state))}
                          >
                            {state} ×
                          </Badge>
                        ))}
                        <Button variant="ghost" size="sm" onClick={() => setSelectedStates([])}>
                          Clear all
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <InternationalLegislationSection 
                    legislation={selectedStates.length > 0 
                      ? usStateBills.filter(l => selectedStates.includes(l.subJurisdiction || ""))
                      : usStateBills
                    }
                    showMaps={true}
                    mapType="usa"
                  />
                </TabsContent>
              </Tabs>
            )}

            {/* Costa Rica Section */}
            {selectedCountry === "costa-rica" && (
              <Tabs value={costaRicaSubTab} onValueChange={(v) => setCostaRicaSubTab(v as "normas" | "proyectos")} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 glass-card p-1 gap-1">
                  <TabsTrigger value="normas" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                    <FileText className="h-4 w-4 mr-2" />
                    Normas (Legislations)
                  </TabsTrigger>
                  <TabsTrigger value="proyectos" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                    <FileText className="h-4 w-4 mr-2" />
                    Proyectos (Bills)
                  </TabsTrigger>
                </TabsList>

                {/* Normas Filter Bar */}
                {costaRicaSubTab === "normas" && (
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
                
                {/* Proyectos Filter Bar */}
                {costaRicaSubTab === "proyectos" && (
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

                <TabsContent value="normas" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Active Alerts</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{actsKPIs.total}</div></CardContent></Card>
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
                        <SelectContent className="bg-background border border-border">
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

                <TabsContent value="proyectos" className="space-y-6 mt-6">
                  <div className="bg-warning/10 border border-warning rounded-lg p-4 mb-4">
                    <div className="flex gap-2"><AlertTriangle className="h-5 w-5 text-warning" /><div><p className="font-semibold">Demo Data</p><p className="text-sm">Bills are fictional for demonstration purposes.</p></div></div>
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
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Showing {((billsPage - 1) * billsPerPage) + 1}-{Math.min(billsPage * billsPerPage, filteredBills.length)} of {filteredBills.length}
                      </span>
                      <Select value={String(billsPerPage)} onValueChange={(v) => { setBillsPerPage(Number(v)); setBillsPage(1); }}>
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background border border-border">
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
              </Tabs>
            )}

            {/* Japan Section */}
            {selectedCountry === "japan" && (
              <InternationalLegislationSection legislation={japanLegislation} />
            )}

            {/* Korea Section */}
            {selectedCountry === "korea" && (
              <InternationalLegislationSection legislation={koreaLegislation} />
            )}

            {/* Taiwan Section */}
            {selectedCountry === "taiwan" && (
              <InternationalLegislationSection legislation={taiwanLegislation} />
            )}

            {/* Canada Section */}
            {selectedCountry === "canada" && (
              <div className="space-y-6">
                {/* Province Filter */}
                <div className="flex items-center gap-4 mb-4 flex-wrap">
                  <span className="text-sm font-medium">Filter by Province:</span>
                  <Select
                    value={selectedProvinces.length === 1 ? selectedProvinces[0] : ""}
                    onValueChange={(value) => {
                      if (value === "all") {
                        setSelectedProvinces([]);
                      } else {
                        setSelectedProvinces(prev => 
                          prev.includes(value) 
                            ? prev.filter(s => s !== value)
                            : [...prev, value]
                        );
                      }
                    }}
                  >
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder={selectedProvinces.length > 0 ? `${selectedProvinces.length} selected` : "All Provinces/Territories"} />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border">
                      <SelectItem value="all">All Provinces/Territories</SelectItem>
                      <SelectItem value="AB">Alberta</SelectItem>
                      <SelectItem value="BC">British Columbia</SelectItem>
                      <SelectItem value="MB">Manitoba</SelectItem>
                      <SelectItem value="NB">New Brunswick</SelectItem>
                      <SelectItem value="NL">Newfoundland and Labrador</SelectItem>
                      <SelectItem value="NS">Nova Scotia</SelectItem>
                      <SelectItem value="NT">Northwest Territories</SelectItem>
                      <SelectItem value="NU">Nunavut</SelectItem>
                      <SelectItem value="ON">Ontario</SelectItem>
                      <SelectItem value="PE">Prince Edward Island</SelectItem>
                      <SelectItem value="QC">Quebec</SelectItem>
                      <SelectItem value="SK">Saskatchewan</SelectItem>
                      <SelectItem value="YT">Yukon</SelectItem>
                    </SelectContent>
                  </Select>
                  {selectedProvinces.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedProvinces.map(prov => (
                        <Badge 
                          key={prov} 
                          variant="secondary" 
                          className="cursor-pointer"
                          onClick={() => setSelectedProvinces(prev => prev.filter(s => s !== prov))}
                        >
                          {prov} ×
                        </Badge>
                      ))}
                      <Button variant="ghost" size="sm" onClick={() => setSelectedProvinces([])}>
                        Clear all
                      </Button>
                    </div>
                  )}
                </div>
                
                <InternationalLegislationSection 
                  legislation={selectedProvinces.length > 0 
                    ? canadaLegislation.filter(l => selectedProvinces.includes(l.subJurisdiction || ""))
                    : canadaLegislation
                  }
                  showMaps={true}
                  mapType="canada"
                />
              </div>
            )}

            {/* GCC Section */}
            {selectedCountry === "gcc" && (
              <div className="space-y-6">
                <GCCRegionMap legislation={[...uaeLegislation, ...saudiLegislation, ...omanLegislation, ...kuwaitLegislation, ...bahrainLegislation, ...qatarLegislation]} />
                
                <Tabs value={gccSubTab} onValueChange={(v) => setGccSubTab(v as "uae" | "saudi" | "oman" | "kuwait" | "bahrain" | "qatar")} className="w-full">
                <TabsList className="grid w-full grid-cols-6 mb-6 glass-card p-1 gap-1">
                  <TabsTrigger value="uae" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                    🇦🇪 UAE
                  </TabsTrigger>
                  <TabsTrigger value="saudi" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                    🇸🇦 Saudi Arabia
                  </TabsTrigger>
                  <TabsTrigger value="oman" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                    🇴🇲 Oman
                  </TabsTrigger>
                  <TabsTrigger value="kuwait" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                    🇰🇼 Kuwait
                  </TabsTrigger>
                  <TabsTrigger value="bahrain" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                    🇧🇭 Bahrain
                  </TabsTrigger>
                  <TabsTrigger value="qatar" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                    🇶🇦 Qatar
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="uae" className="space-y-6 mt-6">
                  <InternationalLegislationSection legislation={uaeLegislation} />
                </TabsContent>

                <TabsContent value="saudi" className="space-y-6 mt-6">
                  <InternationalLegislationSection legislation={saudiLegislation} />
                </TabsContent>

                <TabsContent value="oman" className="space-y-6 mt-6">
                  <InternationalLegislationSection legislation={omanLegislation} />
                </TabsContent>

                <TabsContent value="kuwait" className="space-y-6 mt-6">
                  <InternationalLegislationSection legislation={kuwaitLegislation} />
                </TabsContent>

                <TabsContent value="bahrain" className="space-y-6 mt-6">
                  <InternationalLegislationSection legislation={bahrainLegislation} />
                </TabsContent>

                <TabsContent value="qatar" className="space-y-6 mt-6">
                  <InternationalLegislationSection legislation={qatarLegislation} />
                </TabsContent>
              </Tabs>
              </div>
            )}

            {/* EU Section */}
            {selectedCountry === "eu" && (
              <Tabs value={euSubTab} onValueChange={(v) => setEuSubTab(v as "regulations" | "directives" | "parliament" | "council")} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6 glass-card p-1 gap-1">
                  <TabsTrigger value="regulations" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                    <FileText className="h-4 w-4 mr-2" />
                    Regulations
                  </TabsTrigger>
                  <TabsTrigger value="directives" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                    <FileText className="h-4 w-4 mr-2" />
                    Directives
                  </TabsTrigger>
                  <TabsTrigger value="parliament" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                    <Building2 className="h-4 w-4 mr-2" />
                    Parliament
                  </TabsTrigger>
                  <TabsTrigger value="council" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                    <Building2 className="h-4 w-4 mr-2" />
                    Council
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="regulations" className="space-y-6 mt-6">
                  <InternationalLegislationSection legislation={euRegulations} />
                </TabsContent>

                <TabsContent value="directives" className="space-y-6 mt-6">
                  <InternationalLegislationSection legislation={euDirectives} />
                </TabsContent>

                <TabsContent value="parliament" className="space-y-6 mt-6">
                  <InternationalLegislationSection legislation={euParliament} />
                </TabsContent>

                <TabsContent value="council" className="space-y-6 mt-6">
                  <InternationalLegislationSection legislation={euCouncil} />
                </TabsContent>
              </Tabs>
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
                  <SelectItem value="bills">Bills Only</SelectItem>
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

          <TabsContent value="certificates" className="space-y-6 mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Certificate Repository</h2>
                <p className="text-muted-foreground">
                  Go Global Compliance - Manage and track all certifications
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const headers = ['Client', 'Product', 'Model', 'Type', 'Country/Region', 'Standard', 'Cert Body', 'Cert Number', 'Issue Date', 'Expiration', 'Status'];
                    const rows = certificates.map(cert => [
                      cert.clients?.client_name || '',
                      cert.product_name,
                      cert.product_model || '',
                      cert.certificate_type,
                      cert.country_or_region,
                      cert.regulatory_standard || '',
                      cert.certification_body || '',
                      cert.certificate_number || '',
                      cert.issue_date,
                      cert.expiration_date || '',
                      cert.status,
                    ]);
                    const csv = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `certificates-export-${new Date().toISOString().split('T')[0]}.csv`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button onClick={() => navigate('/certificates/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Certificate
                </Button>
              </div>
            </div>

            <CertFilters filters={certificateFilters} onFiltersChange={setCertificateFilters} />

            {certificatesLoading ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i} className="glass-card"><CardContent className="h-32" /></Card>
                  ))}
                </div>
                <Card className="glass-card"><CardContent className="h-96" /></Card>
              </div>
            ) : (
              <>
                <SummaryCards certificates={certificates} />
                <CertificateTable certificates={certificates} />
              </>
            )}
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <LegislativeSessionsCalendar
              alerts={alerts}
              onNavigateToAlert={(alertId) => {
                // Buscar la alerta correspondiente
                const alert = alerts.find(a => a.title_id === alertId);
                if (alert) {
                  setSelectedAlert(alert);
                  setActiveTab("acts");
                }
              }}
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
              className="h-56 opacity-90 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
