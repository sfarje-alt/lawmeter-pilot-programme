import { useState, useMemo, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Clock, BarChart3, Star, Users, AlertTriangle, Settings, Calendar, BookOpen, Grid, List, Building2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLegislationData, useFilteredAlerts } from "@/hooks/useLegislationData";
import { useStarredAlerts } from "@/hooks/useStarredAlerts";
import { mockBills } from "@/data/mockBills";
import { FilterState, Alert, BillItem } from "@/types/legislation";
import { FilterBar } from "@/components/shared/FilterBar";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { ComplianceTimeline } from "@/components/analytics/ComplianceTimeline";
import { AlertActCard } from "@/components/acts/AlertActCard";
import { AlertActDrawer } from "@/components/acts/AlertActDrawer";
import { BillCard } from "@/components/bills/BillCard";
import { BillDrawer } from "@/components/bills/BillDrawer";
import { AlertSettingsDialog } from "@/components/alerts/AlertSettingsDialog";
import { LegislativeSessionsCalendar } from "@/components/calendar/LegislativeSessionsCalendar";
import { ContactForm } from "@/components/ContactForm";
import { MediaSection } from "@/components/media/MediaSection";
import { SocialListeningDemo } from "@/components/media/SocialListeningDemo";
import { isUpcomingDeadline } from "@/lib/dateUtils";
import { CongressBillsSection } from "@/components/congress/CongressBillsSection";
import { CongressBillDrawer } from "@/components/congress/CongressBillDrawer";
import { CongressBill } from "@/types/congress";
import { UnifiedLegislationSection, UnifiedLegislationDrawer, UnifiedCongressSection } from "@/components/legislation";
import { GCCRegionMap, WorldMap } from "@/components/maps";
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
  qatarLegislation,
  peruLegislation,
  costaRicaLegislation
} from "@/data/mockInternationalLegislation";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { GlobalLegislationSearch } from "@/components/search/GlobalLegislationSearch";
import { 
  RegionSelector, 
  RegionHeader, 
  RegionEmptyState,
  regionThemes 
} from "@/components/regions";
import type { RegionCode } from "@/components/regions/RegionConfig";
import { 
  usaConfig, 
  euConfig, 
  latamConfig, 
  gccConfig, 
  japanConfig, 
  apacConfig, 
  canadaConfig 
} from "@/config/jurisdictionConfig";
import {
  uaeConfig,
  saudiConfig,
  omanConfig,
  kuwaitConfig,
  bahrainConfig,
  qatarConfig,
  costaRicaConfig,
  koreaConfig,
  taiwanConfig,
  peruConfig,
  GCCCountryCode
} from "@/config/countryConfigs";
import {
  enrichedUSAData,
  enrichedCanadaData,
  enrichedJapanData,
  enrichedKoreaData,
  enrichedTaiwanData,
  enrichedEUData,
  enrichedUAEData,
  enrichedSaudiData,
  enrichedOmanData,
  enrichedKuwaitData,
  enrichedBahrainData,
  enrichedQatarData,
  enrichedPeruData,
  regulatoryCategories,
  defaultPresets,
  convertToEnrichedUnified
} from "@/data/enrichedMockData";
import { enrichedCostaRicaData } from "@/data/enrichedMockData";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";

export default function LawMeterDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { alerts, loading } = useLegislationData();
  const [activeTab, setActiveTab] = useState("legislation");
  const [selectedRegion, setSelectedRegion] = useState<RegionCode>("NAM");
  const [selectedCountry, setSelectedCountry] = useState<"usa" | "canada" | "costa-rica" | "peru" | "japan" | "korea" | "taiwan" | "gcc" | "eu">("usa");
  const [selectedGCCCountry, setSelectedGCCCountry] = useState<GCCCountryCode>("uae");
  const [usaDataSource, setUsaDataSource] = useState<"congress" | "mock">("congress");
  const [selectedSubJurisdiction, setSelectedSubJurisdiction] = useState<string | null>(null);
  
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [selectedBill, setSelectedBill] = useState<BillItem | null>(null);
  const [selectedUnifiedItem, setSelectedUnifiedItem] = useState<UnifiedLegislationItem | null>(null);
  const [selectedCongressBill, setSelectedCongressBill] = useState<CongressBill | null>(null);
  const [unifiedDrawerConfig, setUnifiedDrawerConfig] = useState<any>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [starredFilter, setStarredFilter] = useState<"all" | "acts" | "bills">("all");
  const [starredCountryFilter, setStarredCountryFilter] = useState<string>("all");
  
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
          </header>

          <div className="container mx-auto px-6 py-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

          <TabsContent value="legislation" className="space-y-6 mt-6">
            {/* World Map - National/Federal Overview */}
            <WorldMap
              legislation={[
                ...usStateBills,
                ...canadaLegislation,
                ...japanLegislation,
                ...koreaLegislation,
                ...taiwanLegislation,
                ...euRegulations,
                ...euDirectives,
                ...euParliament,
                ...euCouncil,
                ...uaeLegislation,
                ...saudiLegislation,
                ...omanLegislation,
                ...kuwaitLegislation,
                ...bahrainLegislation,
                ...qatarLegislation,
                ...peruLegislation,
                ...costaRicaLegislation
              ]}
              onSelectRegion={(region) => {
                // Map region to our region groups and navigate
                if (region === "usa" || region === "canada") setSelectedRegion("NAM");
                else if (region === "costa-rica" || region === "peru") setSelectedRegion("LATAM");
                else if (region === "eu") setSelectedRegion("EU");
                else if (["uae", "saudi", "oman", "kuwait", "bahrain", "qatar", "gcc"].includes(region)) setSelectedRegion("GCC");
                else if (region === "japan" || region === "korea" || region === "taiwan") setSelectedRegion("APAC");
                setSelectedCountry(region as typeof selectedCountry);
                setSelectedSubJurisdiction(null); // Clear sub-jurisdiction when changing country
              }}
              onSelectSubJurisdiction={(jurisdiction, subJurisdiction) => {
                // Handle state/province/department selection from map - auto-select and filter
                if (jurisdiction === "usa") {
                  setSelectedRegion("NAM");
                  setSelectedCountry("usa");
                  setSelectedSubJurisdiction(subJurisdiction);
                } else if (jurisdiction === "canada") {
                  setSelectedRegion("NAM");
                  setSelectedCountry("canada");
                  setSelectedSubJurisdiction(subJurisdiction);
                } else if (jurisdiction === "japan") {
                  setSelectedRegion("APAC");
                  setSelectedCountry("japan");
                  setSelectedSubJurisdiction(subJurisdiction);
                } else if (jurisdiction === "korea") {
                  setSelectedRegion("APAC");
                  setSelectedCountry("korea");
                  setSelectedSubJurisdiction(subJurisdiction);
                } else if (jurisdiction === "taiwan") {
                  setSelectedRegion("APAC");
                  setSelectedCountry("taiwan");
                  setSelectedSubJurisdiction(subJurisdiction);
                } else if (jurisdiction === "peru") {
                  setSelectedRegion("LATAM");
                  setSelectedCountry("peru");
                  setSelectedSubJurisdiction(subJurisdiction);
                } else if (jurisdiction === "costa-rica") {
                  setSelectedRegion("LATAM");
                  setSelectedCountry("costa-rica");
                  setSelectedSubJurisdiction(subJurisdiction);
                }
              }}
            />

            {/* Global Search Bar - Below map, above regions */}
            <GlobalLegislationSearch 
              onSearch={(query, jurisdiction) => console.log("Search:", query, jurisdiction)}
            />

            {/* Regional Selector with themed icons */}
            <RegionSelector
              selectedRegion={selectedRegion}
              onSelectRegion={(region) => {
                setSelectedRegion(region);
                // Auto-select first country in region
                if (region === "NAM") setSelectedCountry("usa");
                else if (region === "LATAM") setSelectedCountry("costa-rica");
                else if (region === "EU") setSelectedCountry("eu");
                else if (region === "GCC") setSelectedCountry("gcc");
                else if (region === "APAC") setSelectedCountry("japan");
              }}
              alertCounts={{
                NAM: 268,
                LATAM: 45,
                EU: 89,
                GCC: 34,
                APAC: 79
              }}
            />

            {/* Country Selector - Themed by region */}
            {(selectedRegion === "NAM" || selectedRegion === "LATAM" || selectedRegion === "APAC") && (
              <div className="flex items-center gap-4 px-4 py-3 rounded-lg border" style={{
                borderColor: `color-mix(in srgb, ${regionThemes[selectedRegion].primaryColor} 30%, transparent)`,
                backgroundColor: `color-mix(in srgb, ${regionThemes[selectedRegion].primaryColor} 5%, transparent)`,
              }}>
                <span className="text-sm font-medium text-muted-foreground">Select a Country:</span>
                <div className="flex gap-2 flex-wrap">
                  {selectedRegion === "NAM" && (
                    <>
                      <Button
                        variant={selectedCountry === "usa" ? "default" : "outline"}
                        onClick={() => setSelectedCountry("usa")}
                        size="sm"
                        className="gap-2"
                        style={selectedCountry === "usa" ? { backgroundColor: regionThemes.NAM.primaryColor } : undefined}
                      >
                        🇺🇸 USA
                      </Button>
                      <Button
                        variant={selectedCountry === "canada" ? "default" : "outline"}
                        onClick={() => setSelectedCountry("canada")}
                        size="sm"
                        className="gap-2"
                        style={selectedCountry === "canada" ? { backgroundColor: regionThemes.NAM.primaryColor } : undefined}
                      >
                        🇨🇦 Canada
                      </Button>
                    </>
                  )}
                  {selectedRegion === "LATAM" && (
                    <>
                      <Button
                        variant={selectedCountry === "costa-rica" ? "default" : "outline"}
                        onClick={() => setSelectedCountry("costa-rica")}
                        size="sm"
                        className="gap-2"
                        style={selectedCountry === "costa-rica" ? { backgroundColor: regionThemes.LATAM.primaryColor } : undefined}
                      >
                        🇨🇷 Costa Rica
                      </Button>
                      <Button
                        variant={selectedCountry === "peru" ? "default" : "outline"}
                        onClick={() => setSelectedCountry("peru")}
                        size="sm"
                        className="gap-2"
                        style={selectedCountry === "peru" ? { backgroundColor: regionThemes.LATAM.primaryColor } : undefined}
                      >
                        🇵🇪 Perú
                      </Button>
                    </>
                  )}
                  {selectedRegion === "APAC" && (
                    <>
                      <Button
                        variant={selectedCountry === "japan" ? "default" : "outline"}
                        onClick={() => setSelectedCountry("japan")}
                        size="sm"
                        className="gap-2"
                        style={selectedCountry === "japan" ? { backgroundColor: regionThemes.APAC.primaryColor } : undefined}
                      >
                        🇯🇵 Japan
                      </Button>
                      <Button
                        variant={selectedCountry === "korea" ? "default" : "outline"}
                        onClick={() => setSelectedCountry("korea")}
                        size="sm"
                        className="gap-2"
                        style={selectedCountry === "korea" ? { backgroundColor: regionThemes.APAC.primaryColor } : undefined}
                      >
                        🇰🇷 Korea
                      </Button>
                      <Button
                        variant={selectedCountry === "taiwan" ? "default" : "outline"}
                        onClick={() => setSelectedCountry("taiwan")}
                        size="sm"
                        className="gap-2"
                        style={selectedCountry === "taiwan" ? { backgroundColor: regionThemes.APAC.primaryColor } : undefined}
                      >
                        🇹🇼 Taiwan
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}


            {/* USA Section - Live Congress API with unified cards */}
            {selectedCountry === "usa" && (
              <UnifiedCongressSection
                initialSubnationalFilter={selectedSubJurisdiction}
                onClearSubnationalFilter={() => setSelectedSubJurisdiction(null)}
                onItemClick={(item) => {
                  setSelectedUnifiedItem(item);
                  setUnifiedDrawerConfig(usaConfig);
                }}
                onCongressBillClick={(bill) => {
                  setSelectedCongressBill(bill);
                }}
              />
            )}

            {/* Peru Section - Unified System */}
            {selectedCountry === "peru" && (
              <UnifiedLegislationSection
                config={peruConfig}
                items={enrichedPeruData}
                presets={defaultPresets}
                categories={regulatoryCategories}
                title="Perú Legislation"
                subtitle="Congreso de la República - Regulatory Monitoring"
                initialSubnationalFilter={selectedSubJurisdiction}
                onClearSubnationalFilter={() => setSelectedSubJurisdiction(null)}
                onItemClick={(item) => {
                  setSelectedUnifiedItem(item);
                  setUnifiedDrawerConfig(peruConfig);
                }}
              />
            )}

            {/* Canada Section */}
            {selectedCountry === "canada" && (
              <UnifiedLegislationSection
                config={canadaConfig}
                items={enrichedCanadaData}
                presets={defaultPresets}
                categories={regulatoryCategories}
                title="Canada Legislation"
                subtitle="Federal and Provincial legislation monitoring"
                initialSubnationalFilter={selectedSubJurisdiction}
                onClearSubnationalFilter={() => setSelectedSubJurisdiction(null)}
                onItemClick={(item) => {
                  setSelectedUnifiedItem(item);
                  setUnifiedDrawerConfig(canadaConfig);
                }}
              />
            )}

            {/* Costa Rica Section - Unified System */}
            {selectedCountry === "costa-rica" && (
              <UnifiedLegislationSection
                config={costaRicaConfig}
                items={enrichedCostaRicaData}
                presets={defaultPresets}
                categories={regulatoryCategories}
                title="Costa Rica Legislation"
                subtitle="Proyectos de Ley - Asamblea Legislativa"
                initialSubnationalFilter={selectedSubJurisdiction}
                onClearSubnationalFilter={() => setSelectedSubJurisdiction(null)}
                onItemClick={(item) => {
                  setSelectedUnifiedItem(item);
                  setUnifiedDrawerConfig(costaRicaConfig);
                }}
              />
            )}

            {/* GCC Section - With country selector */}
            {selectedCountry === "gcc" && (
              <div className="space-y-4">
                {/* GCC Country Selector */}
                <div className="flex items-center gap-4 px-4 py-3 rounded-lg border" style={{
                  borderColor: `hsl(var(--warning) / 0.3)`,
                  backgroundColor: `hsl(var(--warning) / 0.05)`,
                }}>
                  <span className="text-sm font-medium text-muted-foreground">Select Country:</span>
                  <div className="flex gap-2 flex-wrap">
                    <Button variant={selectedGCCCountry === "uae" ? "default" : "outline"} onClick={() => setSelectedGCCCountry("uae")} size="sm" className="gap-2">🇦🇪 UAE</Button>
                    <Button variant={selectedGCCCountry === "saudi" ? "default" : "outline"} onClick={() => setSelectedGCCCountry("saudi")} size="sm" className="gap-2">🇸🇦 Saudi</Button>
                    <Button variant={selectedGCCCountry === "oman" ? "default" : "outline"} onClick={() => setSelectedGCCCountry("oman")} size="sm" className="gap-2">🇴🇲 Oman</Button>
                    <Button variant={selectedGCCCountry === "kuwait" ? "default" : "outline"} onClick={() => setSelectedGCCCountry("kuwait")} size="sm" className="gap-2">🇰🇼 Kuwait</Button>
                    <Button variant={selectedGCCCountry === "bahrain" ? "default" : "outline"} onClick={() => setSelectedGCCCountry("bahrain")} size="sm" className="gap-2">🇧🇭 Bahrain</Button>
                    <Button variant={selectedGCCCountry === "qatar" ? "default" : "outline"} onClick={() => setSelectedGCCCountry("qatar")} size="sm" className="gap-2">🇶🇦 Qatar</Button>
                  </div>
                </div>
                
                {/* Render country-specific section */}
                {selectedGCCCountry === "uae" && (
                  <UnifiedLegislationSection config={uaeConfig} items={enrichedUAEData} presets={defaultPresets} categories={regulatoryCategories} title="UAE Legislation" subtitle="United Arab Emirates regulatory monitoring" onItemClick={(item) => { setSelectedUnifiedItem(item); setUnifiedDrawerConfig(uaeConfig); }} />
                )}
                {selectedGCCCountry === "saudi" && (
                  <UnifiedLegislationSection config={saudiConfig} items={enrichedSaudiData} presets={defaultPresets} categories={regulatoryCategories} title="Saudi Arabia Legislation" subtitle="Kingdom of Saudi Arabia regulatory monitoring" onItemClick={(item) => { setSelectedUnifiedItem(item); setUnifiedDrawerConfig(saudiConfig); }} />
                )}
                {selectedGCCCountry === "oman" && (
                  <UnifiedLegislationSection config={omanConfig} items={enrichedOmanData} presets={defaultPresets} categories={regulatoryCategories} title="Oman Legislation" subtitle="Sultanate of Oman regulatory monitoring" onItemClick={(item) => { setSelectedUnifiedItem(item); setUnifiedDrawerConfig(omanConfig); }} />
                )}
                {selectedGCCCountry === "kuwait" && (
                  <UnifiedLegislationSection config={kuwaitConfig} items={enrichedKuwaitData} presets={defaultPresets} categories={regulatoryCategories} title="Kuwait Legislation" subtitle="State of Kuwait regulatory monitoring" onItemClick={(item) => { setSelectedUnifiedItem(item); setUnifiedDrawerConfig(kuwaitConfig); }} />
                )}
                {selectedGCCCountry === "bahrain" && (
                  <UnifiedLegislationSection config={bahrainConfig} items={enrichedBahrainData} presets={defaultPresets} categories={regulatoryCategories} title="Bahrain Legislation" subtitle="Kingdom of Bahrain regulatory monitoring" onItemClick={(item) => { setSelectedUnifiedItem(item); setUnifiedDrawerConfig(bahrainConfig); }} />
                )}
                {selectedGCCCountry === "qatar" && (
                  <UnifiedLegislationSection config={qatarConfig} items={enrichedQatarData} presets={defaultPresets} categories={regulatoryCategories} title="Qatar Legislation" subtitle="State of Qatar regulatory monitoring" onItemClick={(item) => { setSelectedUnifiedItem(item); setUnifiedDrawerConfig(qatarConfig); }} />
                )}
              </div>
            )}

            {/* Japan Section */}
            {selectedCountry === "japan" && (
              <UnifiedLegislationSection
                config={japanConfig}
                items={enrichedJapanData}
                presets={defaultPresets}
                categories={regulatoryCategories}
                title="Japan Legislation"
                subtitle="Japanese regulatory monitoring"
                initialSubnationalFilter={selectedSubJurisdiction}
                onClearSubnationalFilter={() => setSelectedSubJurisdiction(null)}
                onItemClick={(item) => { setSelectedUnifiedItem(item); setUnifiedDrawerConfig(japanConfig); }}
              />
            )}

            {/* Korea Section */}
            {selectedCountry === "korea" && (
              <UnifiedLegislationSection
                config={koreaConfig}
                items={enrichedKoreaData}
                presets={defaultPresets}
                categories={regulatoryCategories}
                title="Korea Legislation"
                subtitle="대한민국 법률 모니터링 (South Korean regulatory monitoring)"
                initialSubnationalFilter={selectedSubJurisdiction}
                onClearSubnationalFilter={() => setSelectedSubJurisdiction(null)}
                onItemClick={(item) => { setSelectedUnifiedItem(item); setUnifiedDrawerConfig(koreaConfig); }}
              />
            )}

            {/* Taiwan Section */}
            {selectedCountry === "taiwan" && (
              <UnifiedLegislationSection
                config={taiwanConfig}
                items={enrichedTaiwanData}
                presets={defaultPresets}
                categories={regulatoryCategories}
                title="Taiwan Legislation"
                subtitle="臺灣法規監測 (Taiwanese regulatory monitoring)"
                initialSubnationalFilter={selectedSubJurisdiction}
                onClearSubnationalFilter={() => setSelectedSubJurisdiction(null)}
                onItemClick={(item) => { setSelectedUnifiedItem(item); setUnifiedDrawerConfig(taiwanConfig); }}
              />
            )}

            {/* EU Section */}
            {selectedCountry === "eu" && (
              <UnifiedLegislationSection
                config={euConfig}
                items={enrichedEUData}
                presets={defaultPresets}
                categories={regulatoryCategories}
                title="European Union Legislation"
                subtitle="EU regulations, directives, and decisions"
                onItemClick={(item) => { setSelectedUnifiedItem(item); setUnifiedDrawerConfig(euConfig); }}
              />
            )}
          </TabsContent>

          <TabsContent value="starred" className="space-y-6 mt-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h3 className="text-lg font-semibold">Starred Items</h3>
              <div className="flex items-center gap-3">
                <Select 
                  value={starredCountryFilter} 
                  onValueChange={setStarredCountryFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">🌍 All Countries</SelectItem>
                    <SelectItem value="usa">🇺🇸 USA</SelectItem>
                    <SelectItem value="canada">🇨🇦 Canada</SelectItem>
                    <SelectItem value="costa-rica">🇨🇷 Costa Rica</SelectItem>
                    <SelectItem value="eu">🇪🇺 European Union</SelectItem>
                    <SelectItem value="uae">🇦🇪 UAE</SelectItem>
                    <SelectItem value="saudi">🇸🇦 Saudi Arabia</SelectItem>
                    <SelectItem value="japan">🇯🇵 Japan</SelectItem>
                    <SelectItem value="korea">🇰🇷 Korea</SelectItem>
                    <SelectItem value="taiwan">🇹🇼 Taiwan</SelectItem>
                  </SelectContent>
                </Select>
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
            </div>
            {starredHooks.starred.length === 0 ? (
              <Card><CardContent className="py-12 text-center"><Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p>No starred items yet</p></CardContent></Card>
            ) : (
              <div className="space-y-4">
                {(starredFilter === "all" || starredFilter === "acts") && starredHooks.starred.filter(s => s.startsWith("ACTS:")).map(key => {
                  const id = key.replace("ACTS:", "");
                  const alert = alerts.find(a => a.title_id === id);
                  // Filter by country - Costa Rica alerts are the default ACTS
                  if (starredCountryFilter !== "all" && starredCountryFilter !== "costa-rica") return null;
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
                  // Filter by country - mockBills are Costa Rica bills
                  if (starredCountryFilter !== "all" && starredCountryFilter !== "costa-rica") return null;
                  return bill ? <BillCard key={id} bill={bill} isStarred onToggleStar={() => starredHooks.toggleStar("BILLS", id)} onOpenDrawer={() => setSelectedBill(bill)} /> : null;
                })}
                {((starredFilter === "acts" && !starredHooks.starred.some(s => s.startsWith("ACTS:"))) ||
                  (starredFilter === "bills" && !starredHooks.starred.some(s => s.startsWith("BILLS:")))) && (
                  <Card><CardContent className="py-12 text-center"><Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p>No starred {starredFilter} yet</p></CardContent></Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="calendar" className="mt-6 space-y-6">
            <ComplianceTimeline 
              data={[
                ...enrichedUSAData,
                ...enrichedCanadaData,
                ...enrichedJapanData,
                ...enrichedKoreaData,
                ...enrichedTaiwanData,
                ...enrichedEUData,
                ...enrichedUAEData,
                ...enrichedSaudiData,
                ...enrichedOmanData,
                ...enrichedKuwaitData,
                ...enrichedBahrainData,
                ...enrichedQatarData,
                ...enrichedCostaRicaData,
              ]} 
            />
            <LegislativeSessionsCalendar
              alerts={alerts}
              onNavigateToAlert={(alertId) => {
                const alert = alerts.find(a => a.title_id === alertId);
                if (alert) {
                  setSelectedAlert(alert);
                  setActiveTab("acts");
                }
              }}
            />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="media" className="mt-6">
            <MediaSection />
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

          {/* Unified Legislation Drawer for all jurisdictions */}
          <UnifiedLegislationDrawer
            item={selectedUnifiedItem}
            config={unifiedDrawerConfig || usaConfig}
            open={!!selectedUnifiedItem}
            onOpenChange={(open) => !open && setSelectedUnifiedItem(null)}
          />

          {/* Congress Bill Drawer for real US Congress bills with live API data */}
          {selectedCongressBill && (
            <CongressBillDrawer
              bill={selectedCongressBill}
              open={!!selectedCongressBill}
              onOpenChange={(open) => !open && setSelectedCongressBill(null)}
            />
          )}

          <AlertSettingsDialog 
            open={settingsOpen} 
            onOpenChange={setSettingsOpen} 
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
