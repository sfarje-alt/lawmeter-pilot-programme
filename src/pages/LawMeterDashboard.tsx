import { useState, useMemo, useEffect, useTransition, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Clock, Star, Users, AlertTriangle, Settings, Calendar, BookOpen, Grid, List, Building2, X, Globe } from "lucide-react";
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
import { UnifiedLegislationSection, UnifiedLegislationDrawer, UnifiedCongressSection, AllLegislationSection } from "@/components/legislation";
import { LegislationViewToggle, LegislationViewMode } from "@/components/legislation/LegislationViewToggle";
import { GCCRegionMap, WorldMap } from "@/components/maps";
import { MapInsightsPanel } from "@/components/analytics/MapInsightsPanel";
import { CountryFlag } from "@/components/shared/CountryFlag";
import { AnalyticsFilters } from "@/components/analytics/AnalyticsFilterBar";
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
import { SidebarProvider, SidebarTrigger, SidebarInset, useSidebar } from "@/components/ui/sidebar";
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
import { mergeWithComprehensiveData } from "@/data/comprehensiveMockData";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";

// Jurisdiction key to region mapping
const JURISDICTION_TO_REGION: Record<string, RegionCode> = {
  "USA": "NAM",
  "Canada": "NAM",
  "Japan": "APAC",
  "Korea": "APAC",
  "Taiwan": "APAC",
  "EU": "EU",
  "UAE": "GCC",
  "Saudi Arabia": "GCC",
  "Oman": "GCC",
  "Kuwait": "GCC",
  "Bahrain": "GCC",
  "Qatar": "GCC",
  "Peru": "LATAM",
  "Costa Rica": "LATAM",
};

// Jurisdiction key to country mapping
const JURISDICTION_TO_COUNTRY: Record<string, "usa" | "canada" | "costa-rica" | "peru" | "japan" | "korea" | "taiwan" | "gcc" | "eu"> = {
  "USA": "usa",
  "Canada": "canada",
  "Japan": "japan",
  "Korea": "korea",
  "Taiwan": "taiwan",
  "EU": "eu",
  "UAE": "gcc",
  "Saudi Arabia": "gcc",
  "Oman": "gcc",
  "Kuwait": "gcc",
  "Bahrain": "gcc",
  "Qatar": "gcc",
  "Peru": "peru",
  "Costa Rica": "costa-rica",
};

export default function LawMeterDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { alerts, loading } = useLegislationData();
  const [activeTab, setActiveTab] = useState("legislation");
  const [selectedRegion, setSelectedRegion] = useState<RegionCode | "ALL">("ALL");
  const [selectedCountry, setSelectedCountry] = useState<"usa" | "canada" | "costa-rica" | "peru" | "japan" | "korea" | "taiwan" | "gcc" | "eu">("usa");
  const [selectedGCCCountry, setSelectedGCCCountry] = useState<GCCCountryCode>("uae");
  const [usaDataSource, setUsaDataSource] = useState<"congress" | "mock">("congress");
  const [selectedSubJurisdiction, setSelectedSubJurisdiction] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  
  // New: Legislation view mode (alerts, map-insights, focus)
  const [legislationViewMode, setLegislationViewModeState] = useState<LegislationViewMode>("alerts");
  const [analyticsFilters, setAnalyticsFiltersState] = useState<AnalyticsFilters>({
    dateRange: "90",
    jurisdictions: [],
    riskLevels: [],
    lifecycle: "all",
    categories: [],
  });
  const [mapInsightsExpanded, setMapInsightsExpanded] = useState(false);
  const [mapJurisdictionFilter, setMapJurisdictionFilterState] = useState<string | null>(null);
  const [mapSubdivisionFilter, setMapSubdivisionFilterState] = useState<string | null>(null);

  // URL-synced setters
  const updateUrlParams = (updates: Record<string, string | null>) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === "all" || value === "90") {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      });
      return newParams;
    }, { replace: true });
  };

  const setLegislationViewMode = (mode: LegislationViewMode) => {
    setLegislationViewModeState(mode);
    updateUrlParams({ view: mode === "alerts" ? null : mode });
  };

  const setAnalyticsFilters = (filters: AnalyticsFilters) => {
    setAnalyticsFiltersState(filters);
    updateUrlParams({
      period: filters.dateRange,
      jurisdictions: filters.jurisdictions.length > 0 ? filters.jurisdictions.join(",") : null,
      risk: filters.riskLevels.length > 0 ? filters.riskLevels.join(",") : null,
      lifecycle: filters.lifecycle,
      categories: filters.categories.length > 0 ? filters.categories.join(",") : null,
    });
  };

  const setMapJurisdictionFilter = (jurisdiction: string | null) => {
    setMapJurisdictionFilterState(jurisdiction);
    updateUrlParams({ country: jurisdiction });
  };

  const setMapSubdivisionFilter = (subdivision: string | null) => {
    setMapSubdivisionFilterState(subdivision);
    updateUrlParams({ subdivision });
  };
  
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

  // All enriched data for analytics - merged with comprehensive data for full filter coverage
  const allEnrichedData = useMemo<UnifiedLegislationItem[]>(() => {
    const baseData = [
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
      ...enrichedPeruData,
    ];
    // Merge with comprehensive mock data to ensure all filter combinations are covered
    return mergeWithComprehensiveData(baseData);
  }, []);

  // Wrapped setters with startTransition for smooth navigation
  const handleSelectCountry = useCallback((country: typeof selectedCountry) => {
    startTransition(() => {
      setSelectedCountry(country);
    });
  }, []);

  // Handler for navigating to alerts from map
  const handleNavigateToAlerts = (jurisdiction?: string, subdivision?: string) => {
    setLegislationViewMode("alerts");
    if (jurisdiction) {
      const region = JURISDICTION_TO_REGION[jurisdiction];
      const country = JURISDICTION_TO_COUNTRY[jurisdiction];
      startTransition(() => {
        if (region) setSelectedRegion(region);
        if (country) setSelectedCountry(country);
      });
      setMapJurisdictionFilter(jurisdiction);
    }
    if (subdivision) {
      setSelectedSubJurisdiction(subdivision);
      setMapSubdivisionFilter(subdivision);
    }
  };

  // Clear map filters
  const handleClearMapFilters = () => {
    setMapJurisdictionFilter(null);
    setMapSubdivisionFilter(null);
  };

  // Handle URL parameters on mount
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
    
    // View mode
    const viewModeParam = searchParams.get('view');
    if (viewModeParam && ['alerts', 'map-insights', 'focus'].includes(viewModeParam)) {
      setLegislationViewModeState(viewModeParam as LegislationViewMode);
    }
    
    // Analytics filters
    const periodParam = searchParams.get('period');
    const jurisdictionsParam = searchParams.get('jurisdictions');
    const riskParam = searchParams.get('risk');
    const lifecycleParam = searchParams.get('lifecycle');
    const categoriesParam = searchParams.get('categories');
    
    if (periodParam || jurisdictionsParam || riskParam || lifecycleParam || categoriesParam) {
      setAnalyticsFiltersState({
        dateRange: periodParam || "90",
        jurisdictions: jurisdictionsParam ? jurisdictionsParam.split(",") : [],
        riskLevels: riskParam ? riskParam.split(",") as ("high" | "medium" | "low")[] : [],
        lifecycle: (lifecycleParam as "all" | "in-force" | "pipeline") || "all",
        categories: categoriesParam ? categoriesParam.split(",") : [],
      });
    }
    
    // Map filters
    const countryParam = searchParams.get('country');
    const subdivisionParam = searchParams.get('subdivision');
    if (countryParam) {
      setMapJurisdictionFilterState(countryParam);
    }
    if (subdivisionParam) {
      setMapSubdivisionFilterState(subdivisionParam);
    }
  }, []); // Only run on mount

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
            {/* View Mode Toggle with watermark background */}
            <div className="relative flex items-center justify-between">
              {/* Subtle watermark background */}
              <div className="absolute -inset-x-4 -inset-y-2 pointer-events-none overflow-hidden -z-10 rounded-lg">
                <img 
                  src="/legislation-header-watermark.png" 
                  alt="" 
                  className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
              </div>
              <LegislationViewToggle 
                mode={legislationViewMode} 
                onModeChange={setLegislationViewMode} 
              />
              {(mapJurisdictionFilter || mapSubdivisionFilter) && (
                <div className="flex items-center gap-2">
                  {mapJurisdictionFilter && (
                    <Badge variant="secondary" className="gap-2 pl-3 pr-1 py-1">
                      Country: {mapJurisdictionFilter}
                      <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => setMapJurisdictionFilter(null)}>
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  )}
                  {mapSubdivisionFilter && (
                    <Badge variant="secondary" className="gap-2 pl-3 pr-1 py-1">
                      Subdivision: {mapSubdivisionFilter}
                      <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => setMapSubdivisionFilter(null)}>
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" onClick={handleClearMapFilters}>
                    Clear filters
                  </Button>
                </div>
              )}
            </div>

            {/* Map + Insights Mode */}
            {legislationViewMode === "map-insights" && (
              <MapInsightsPanel
                data={allEnrichedData}
                filters={analyticsFilters}
                onFiltersChange={setAnalyticsFilters}
                onNavigateToAlerts={handleNavigateToAlerts}
                onItemClick={(item) => {
                  // Determine config based on item's region
                  const itemRegion = item.region;
                  let config = usaConfig;
                  if (itemRegion === "LATAM") {
                    if (item.jurisdictionCode === "Peru") config = peruConfig;
                    else config = costaRicaConfig;
                  } else if (itemRegion === "APAC") {
                    if (item.jurisdictionCode === "Japan") config = japanConfig;
                    else if (item.jurisdictionCode === "Korea") config = koreaConfig;
                    else config = taiwanConfig;
                  } else if (itemRegion === "EU") {
                    config = euConfig;
                  } else if (itemRegion === "GCC") {
                    config = gccConfig;
                  } else if (item.jurisdictionCode === "Canada") {
                    config = canadaConfig;
                  }
                  setSelectedUnifiedItem(item);
                  setUnifiedDrawerConfig(config);
                }}
              />
            )}

            {/* Regular Alerts Mode */}
            {legislationViewMode === "alerts" && (
              <>

            {/* Global Search Bar - Below map, above regions */}
            <GlobalLegislationSearch 
              allData={allEnrichedData}
              onSearch={(query, jurisdiction) => console.log("Search:", query, jurisdiction)}
              onSelectResult={(result) => {
                // Navigate to the item's jurisdiction and open drawer
                if (result.originalItem) {
                  const region = JURISDICTION_TO_REGION[result.jurisdiction] || "NAM";
                  const country = JURISDICTION_TO_COUNTRY[result.jurisdiction] || "usa";
                  startTransition(() => setSelectedRegion(region));
                  startTransition(() => setSelectedCountry(country));
                  setSelectedUnifiedItem(result.originalItem);
                }
              }}
            />

            {/* Regional Selector with themed icons */}
            <RegionSelector
              selectedRegion={selectedRegion}
              onSelectRegion={(region) => {
                startTransition(() => {
                  setSelectedRegion(region);
                  // Clear map filters when switching to ALL
                  if (region === "ALL") {
                    handleClearMapFilters();
                    return;
                  }
                  // Auto-select first country in region
                  if (region === "NAM") setSelectedCountry("usa");
                  else if (region === "LATAM") setSelectedCountry("costa-rica");
                  else if (region === "EU") setSelectedCountry("eu");
                  else if (region === "GCC") setSelectedCountry("gcc");
                  else if (region === "APAC") setSelectedCountry("japan");
                });
              }}
              alertCounts={{
                ALL: allEnrichedData.length,
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
                        onClick={() => handleSelectCountry("usa")}
                        size="sm"
                        className="gap-2"
                        style={selectedCountry === "usa" ? { backgroundColor: regionThemes.NAM.primaryColor } : undefined}
                      >
                        <CountryFlag countryKey="USA" variant="full" size="sm" showTooltip={false} />
                      </Button>
                      <Button
                        variant={selectedCountry === "canada" ? "default" : "outline"}
                        onClick={() => handleSelectCountry("canada")}
                        size="sm"
                        className="gap-2"
                        style={selectedCountry === "canada" ? { backgroundColor: regionThemes.NAM.primaryColor } : undefined}
                      >
                        <CountryFlag countryKey="Canada" variant="full" size="sm" showTooltip={false} />
                      </Button>
                    </>
                  )}
                  {selectedRegion === "LATAM" && (
                    <>
                      <Button
                        variant={selectedCountry === "costa-rica" ? "default" : "outline"}
                        onClick={() => handleSelectCountry("costa-rica")}
                        size="sm"
                        className="gap-2"
                        style={selectedCountry === "costa-rica" ? { backgroundColor: regionThemes.LATAM.primaryColor } : undefined}
                      >
                        <CountryFlag countryKey="Costa Rica" variant="full" size="sm" showTooltip={false} />
                      </Button>
                      <Button
                        variant={selectedCountry === "peru" ? "default" : "outline"}
                        onClick={() => handleSelectCountry("peru")}
                        size="sm"
                        className="gap-2"
                        style={selectedCountry === "peru" ? { backgroundColor: regionThemes.LATAM.primaryColor } : undefined}
                      >
                        <CountryFlag countryKey="Peru" variant="full" size="sm" showTooltip={false} />
                      </Button>
                    </>
                  )}
                  {selectedRegion === "APAC" && (
                    <>
                      <Button
                        variant={selectedCountry === "japan" ? "default" : "outline"}
                        onClick={() => handleSelectCountry("japan")}
                        size="sm"
                        className="gap-2"
                        style={selectedCountry === "japan" ? { backgroundColor: regionThemes.APAC.primaryColor } : undefined}
                      >
                        <CountryFlag countryKey="Japan" variant="full" size="sm" showTooltip={false} />
                      </Button>
                      <Button
                        variant={selectedCountry === "korea" ? "default" : "outline"}
                        onClick={() => handleSelectCountry("korea")}
                        size="sm"
                        className="gap-2"
                        style={selectedCountry === "korea" ? { backgroundColor: regionThemes.APAC.primaryColor } : undefined}
                      >
                        <CountryFlag countryKey="Korea" variant="full" size="sm" showTooltip={false} />
                      </Button>
                      <Button
                        variant={selectedCountry === "taiwan" ? "default" : "outline"}
                        onClick={() => handleSelectCountry("taiwan")}
                        size="sm"
                        className="gap-2"
                        style={selectedCountry === "taiwan" ? { backgroundColor: regionThemes.APAC.primaryColor } : undefined}
                      >
                        <CountryFlag countryKey="Taiwan" variant="full" size="sm" showTooltip={false} />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ALL Regions Section - Mixed alerts from all jurisdictions */}
            {selectedRegion === "ALL" && (
              <AllLegislationSection
                items={allEnrichedData}
                onItemClick={(item) => {
                  // Determine config based on item's region
                  const itemRegion = item.region;
                  let config = usaConfig;
                  if (itemRegion === "LATAM") {
                    if (item.jurisdictionCode === "Peru") config = peruConfig;
                    else config = costaRicaConfig;
                  } else if (itemRegion === "APAC") {
                    if (item.jurisdictionCode === "Japan") config = japanConfig;
                    else if (item.jurisdictionCode === "Korea") config = koreaConfig;
                    else config = taiwanConfig;
                  } else if (itemRegion === "EU") {
                    config = euConfig;
                  } else if (itemRegion === "GCC") {
                    config = gccConfig;
                  } else if (item.jurisdictionCode === "Canada") {
                    config = canadaConfig;
                  }
                  setSelectedUnifiedItem(item);
                  setUnifiedDrawerConfig(config);
                }}
              />
            )}

            {/* USA Section - Live Congress API with unified cards */}
            {selectedRegion !== "ALL" && selectedCountry === "usa" && (
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
            {selectedRegion !== "ALL" && selectedCountry === "peru" && (
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
            {selectedRegion !== "ALL" && selectedCountry === "canada" && (
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
            {selectedRegion !== "ALL" && selectedCountry === "costa-rica" && (
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
            {selectedRegion !== "ALL" && selectedCountry === "gcc" && (
              <div className="space-y-4">
                {/* GCC Country Selector */}
                <div className="flex items-center gap-4 px-4 py-3 rounded-lg border" style={{
                  borderColor: `hsl(var(--warning) / 0.3)`,
                  backgroundColor: `hsl(var(--warning) / 0.05)`,
                }}>
                  <span className="text-sm font-medium text-muted-foreground">Select Country:</span>
                  <div className="flex gap-2 flex-wrap">
                    <Button variant={selectedGCCCountry === "uae" ? "default" : "outline"} onClick={() => setSelectedGCCCountry("uae")} size="sm" className="gap-2">
                      <CountryFlag countryKey="UAE" variant="full" size="sm" showTooltip={false} />
                    </Button>
                    <Button variant={selectedGCCCountry === "saudi" ? "default" : "outline"} onClick={() => setSelectedGCCCountry("saudi")} size="sm" className="gap-2">
                      <CountryFlag countryKey="Saudi Arabia" variant="full" size="sm" showTooltip={false} />
                    </Button>
                    <Button variant={selectedGCCCountry === "oman" ? "default" : "outline"} onClick={() => setSelectedGCCCountry("oman")} size="sm" className="gap-2">
                      <CountryFlag countryKey="Oman" variant="full" size="sm" showTooltip={false} />
                    </Button>
                    <Button variant={selectedGCCCountry === "kuwait" ? "default" : "outline"} onClick={() => setSelectedGCCCountry("kuwait")} size="sm" className="gap-2">
                      <CountryFlag countryKey="Kuwait" variant="full" size="sm" showTooltip={false} />
                    </Button>
                    <Button variant={selectedGCCCountry === "bahrain" ? "default" : "outline"} onClick={() => setSelectedGCCCountry("bahrain")} size="sm" className="gap-2">
                      <CountryFlag countryKey="Bahrain" variant="full" size="sm" showTooltip={false} />
                    </Button>
                    <Button variant={selectedGCCCountry === "qatar" ? "default" : "outline"} onClick={() => setSelectedGCCCountry("qatar")} size="sm" className="gap-2">
                      <CountryFlag countryKey="Qatar" variant="full" size="sm" showTooltip={false} />
                    </Button>
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
            {selectedRegion !== "ALL" && selectedCountry === "japan" && (
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
            {selectedRegion !== "ALL" && selectedCountry === "korea" && (
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
            {selectedRegion !== "ALL" && selectedCountry === "taiwan" && (
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
            {selectedRegion !== "ALL" && selectedCountry === "eu" && (
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
              </>
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
                    <SelectItem value="all"><span className="flex items-center gap-2"><Globe className="h-4 w-4" /> All Countries</span></SelectItem>
                    <SelectItem value="usa"><CountryFlag countryKey="USA" variant="full" size="sm" showTooltip={false} /></SelectItem>
                    <SelectItem value="canada"><CountryFlag countryKey="Canada" variant="full" size="sm" showTooltip={false} /></SelectItem>
                    <SelectItem value="costa-rica"><CountryFlag countryKey="Costa Rica" variant="full" size="sm" showTooltip={false} /></SelectItem>
                    <SelectItem value="eu"><CountryFlag countryKey="EU" variant="full" size="sm" showTooltip={false} /></SelectItem>
                    <SelectItem value="uae"><CountryFlag countryKey="UAE" variant="full" size="sm" showTooltip={false} /></SelectItem>
                    <SelectItem value="saudi"><CountryFlag countryKey="Saudi Arabia" variant="full" size="sm" showTooltip={false} /></SelectItem>
                    <SelectItem value="japan"><CountryFlag countryKey="Japan" variant="full" size="sm" showTooltip={false} /></SelectItem>
                    <SelectItem value="korea"><CountryFlag countryKey="Korea" variant="full" size="sm" showTooltip={false} /></SelectItem>
                    <SelectItem value="taiwan"><CountryFlag countryKey="Taiwan" variant="full" size="sm" showTooltip={false} /></SelectItem>
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

          {/* Analytics tab removed - now integrated into Legislation */}

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
