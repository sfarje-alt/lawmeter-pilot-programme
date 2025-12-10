import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Grid, 
  List, 
  Gavel, 
  Clock, 
  FileText,
  Building2,
  MapPin,
  ScrollText,
  Handshake,
  Landmark,
  Scale,
  Loader2,
  ChevronDown,
  SlidersHorizontal,
  Home,
  X
} from "lucide-react";
import { usaLegislationData } from "@/data/usaLegislationMockData";
import { UnifiedAlertCard } from "./UnifiedAlertCard";
import { USALegislationDrawer } from "./USALegislationDrawer";
import { CongressBillDrawer } from "@/components/congress/CongressBillDrawer";
import { useReadAlerts } from "@/hooks/useReadAlerts";
import { useStarredBills } from "@/hooks/useStarredBills";
import { useToast } from "@/hooks/use-toast";
import { useCongressBills } from "@/hooks/useCongressBills";
import { LifecycleStatus, USDocumentType, Authority, USLegislationItem, documentTypeLabels, authorityLabels } from "@/types/usaLegislation";
import { CongressBill } from "@/types/congress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const lifecycleIcons = {
  all: <FileText className="h-4 w-4" />,
  "in-force": <Gavel className="h-4 w-4" />,
  pipeline: <Clock className="h-4 w-4" />
};

const documentTypeIcons: Record<USDocumentType, JSX.Element> = {
  bill: <ScrollText className="h-4 w-4" />,
  statute: <Gavel className="h-4 w-4" />,
  regulation: <FileText className="h-4 w-4" />,
  treaty: <Handshake className="h-4 w-4" />,
  ordinance: <Landmark className="h-4 w-4" />
};

// US States list
const usStates = [
  { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" }, { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" }, { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" }, { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" }, { code: "HI", name: "Hawaii" }, { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" }, { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" }, { code: "KY", name: "Kentucky" }, { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" }, { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" }, { code: "MN", name: "Minnesota" }, { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" }, { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" }, { code: "NH", name: "New Hampshire" }, { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" }, { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" }, { code: "OH", name: "Ohio" }, { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" }, { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" }, { code: "SD", name: "South Dakota" }, { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" }, { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" }, { code: "WA", name: "Washington" }, { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" }, { code: "DC", name: "District of Columbia" }
];

type JurisdictionLevel = "all" | "federal" | "state" | "local";
type RiskLevel = "high" | "medium" | "low";

// Union type for combined items
type CombinedLegislationItem = 
  | { type: "mock"; data: USLegislationItem }
  | { type: "congress"; data: CongressBill };

export function USALegislationSection() {
  // Primary Filters - Row 1 (Scope)
  const [lifecycleFilter, setLifecycleFilter] = useState<LifecycleStatus>("all");
  const [jurisdictionLevel, setJurisdictionLevel] = useState<JurisdictionLevel>("all");
  
  // Main Filters - Row 2
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDocTypes, setSelectedDocTypes] = useState<USDocumentType[]>([]);
  
  // Advanced Filters - Row 3 (collapsible)
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [selectedAuthorities, setSelectedAuthorities] = useState<Authority[]>([]);
  const [selectedChamber, setSelectedChamber] = useState<string[]>([]);
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<RiskLevel[]>([]);
  
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  
  // Drawer states
  const [selectedMockItem, setSelectedMockItem] = useState<USLegislationItem | null>(null);
  const [selectedCongressBill, setSelectedCongressBill] = useState<CongressBill | null>(null);
  const [mockDrawerOpen, setMockDrawerOpen] = useState(false);
  const [congressDrawerOpen, setCongressDrawerOpen] = useState(false);
  
  const { markAsRead, toggleRead, isRead, getUnreadCount, deleteAlert, isDeleted } = useReadAlerts();
  const { isStarred, toggleStar } = useStarredBills();
  const { toast } = useToast();
  
  // Fetch Congress bills
  const { bills: congressBills, loading: congressLoading, error: congressError } = useCongressBills("latestAction-desc");

  // Combine mock data with Congress API data
  const combinedData = useMemo((): CombinedLegislationItem[] => {
    const mockItems: CombinedLegislationItem[] = usaLegislationData
      .filter(item => !isDeleted(item.id))
      .map(item => ({ type: "mock" as const, data: item }));
    
    const congressItems: CombinedLegislationItem[] = congressBills.map(bill => ({
      type: "congress" as const,
      data: bill
    }));
    
    return [...mockItems, ...congressItems];
  }, [congressBills, isDeleted]);

  // Get jurisdiction level for mock item
  const getMockJurisdictionLevel = (item: USLegislationItem): JurisdictionLevel => {
    if (item.authority === "city") return "local";
    if (item.subJurisdiction) return "state";
    return "federal";
  };

  // Filter combined data with smart dependencies
  const filteredData = useMemo(() => {
    return combinedData.filter(item => {
      if (item.type === "mock") {
        const mockItem = item.data;
        const itemLevel = getMockJurisdictionLevel(mockItem);
        
        // Lifecycle filter
        if (lifecycleFilter === "in-force" && !mockItem.isInForce) return false;
        if (lifecycleFilter === "pipeline" && !mockItem.isPipeline) return false;

        // Jurisdiction Level filter
        if (jurisdictionLevel !== "all" && itemLevel !== jurisdictionLevel) return false;

        // Geography filter (states) - only applies to state/local level
        if (selectedStates.length > 0) {
          if (itemLevel === "federal") return false;
          const stateCode = mockItem.subJurisdiction?.includes(",") 
            ? mockItem.subJurisdiction.split(",").pop()?.trim()
            : mockItem.subJurisdiction;
          if (!stateCode || !selectedStates.includes(stateCode)) return false;
        }

        // Document type filter
        if (selectedDocTypes.length > 0 && !selectedDocTypes.includes(mockItem.documentType)) return false;

        // Regulatory category filter
        if (selectedCategories.length > 0 && !selectedCategories.includes(mockItem.regulatoryCategory)) return false;

        // Advanced: Authority filter
        if (selectedAuthorities.length > 0 && !selectedAuthorities.includes(mockItem.authority)) return false;

        // Advanced: Chamber filter (for bills)
        if (selectedChamber.length > 0 && mockItem.documentType === "bill") {
          const chamberMatch = selectedChamber.some(chamber => {
            if (chamber === "house") return mockItem.regulatoryBody?.toLowerCase().includes("house");
            if (chamber === "senate") return mockItem.regulatoryBody?.toLowerCase().includes("senate");
            return false;
          });
          if (!chamberMatch) return false;
        }

        // Advanced: Risk level filter
        if (selectedRiskLevels.length > 0 && !selectedRiskLevels.includes(mockItem.riskLevel)) return false;

        return true;
      } else {
        // Congress bill
        const bill = item.data;
        
        // Congress bills are always in pipeline (not enacted yet as laws)
        if (lifecycleFilter === "in-force") return false;
        
        // Congress bills are federal
        if (jurisdictionLevel === "state" || jurisdictionLevel === "local") return false;

        // Geography filter doesn't apply to federal
        if (selectedStates.length > 0) return false;
        
        // Document type filter - Congress bills are "bill" type
        if (selectedDocTypes.length > 0 && !selectedDocTypes.includes("bill")) return false;
        
        // Authority filter - Congress bills are from "congress"
        if (selectedAuthorities.length > 0 && !selectedAuthorities.includes("congress")) return false;
        
        // Chamber filter
        if (selectedChamber.length > 0) {
          const chamberMatch = selectedChamber.some(chamber => {
            if (chamber === "house") return bill.originChamber === "House";
            if (chamber === "senate") return bill.originChamber === "Senate";
            return false;
          });
          if (!chamberMatch) return false;
        }
        
        // Regulatory category filter - check policy area
        if (selectedCategories.length > 0 && bill.policyArea) {
          const policyName = bill.policyArea.name.toLowerCase();
          const categoryMatch = selectedCategories.some(cat => {
            const catLower = cat.toLowerCase();
            return policyName.includes(catLower) || 
                   (catLower === "product safety" && policyName.includes("consumer")) ||
                   (catLower === "cybersecurity" && (policyName.includes("science") || policyName.includes("technology"))) ||
                   (catLower === "radio" && policyName.includes("communications"));
          });
          if (!categoryMatch) return false;
        }

        // Advanced: Risk level filter (check cached analysis)
        if (selectedRiskLevels.length > 0) {
          const billId = `${bill.congress}-${bill.type}-${bill.number}`;
          const cached = localStorage.getItem(`ai_summary_v3_${billId}`);
          if (cached) {
            try {
              const analysis = JSON.parse(cached);
              const score = analysis.summary?.riskScore || 50;
              const level: RiskLevel = score >= 70 ? "high" : score >= 40 ? "medium" : "low";
              if (!selectedRiskLevels.includes(level)) return false;
            } catch {
              if (!selectedRiskLevels.includes("medium")) return false;
            }
          } else {
            if (!selectedRiskLevels.includes("medium")) return false;
          }
        }
        
        return true;
      }
    });
  }, [combinedData, lifecycleFilter, jurisdictionLevel, selectedStates, selectedDocTypes, selectedAuthorities, selectedCategories, selectedChamber, selectedRiskLevels]);

  // Count totals
  const totalMock = usaLegislationData.filter(i => !isDeleted(i.id)).length;
  const totalCongress = congressBills.length;
  const allCount = totalMock + totalCongress;
  
  const inForceCount = usaLegislationData.filter(i => i.isInForce && !isDeleted(i.id)).length;
  const pipelineCount = usaLegislationData.filter(i => i.isPipeline && !isDeleted(i.id)).length + totalCongress;

  // Toggle filters
  const toggleDocType = (type: USDocumentType) => {
    setSelectedDocTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleAuthority = (auth: Authority) => {
    setSelectedAuthorities(prev => 
      prev.includes(auth) ? prev.filter(a => a !== auth) : [...prev, auth]
    );
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleState = (state: string) => {
    setSelectedStates(prev =>
      prev.includes(state) ? prev.filter(s => s !== state) : [...prev, state]
    );
  };

  const toggleChamber = (chamber: string) => {
    setSelectedChamber(prev =>
      prev.includes(chamber) ? prev.filter(c => c !== chamber) : [...prev, chamber]
    );
  };

  const toggleRiskLevel = (level: RiskLevel) => {
    setSelectedRiskLevels(prev =>
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  const clearAllFilters = () => {
    setSelectedDocTypes([]);
    setSelectedAuthorities([]);
    setSelectedCategories([]);
    setSelectedStates([]);
    setSelectedChamber([]);
    setSelectedRiskLevels([]);
    setJurisdictionLevel("all");
    setLifecycleFilter("all");
  };

  // Filter state helpers
  const hasRow2Filters = selectedStates.length > 0 || selectedCategories.length > 0 || selectedDocTypes.length > 0;
  const hasAdvancedFilters = selectedAuthorities.length > 0 || selectedChamber.length > 0 || selectedRiskLevels.length > 0;
  const advancedFilterCount = selectedAuthorities.length + selectedChamber.length + selectedRiskLevels.length;
  const hasAnyFilters = hasRow2Filters || hasAdvancedFilters || jurisdictionLevel !== "all" || lifecycleFilter !== "all";

  const handleReport = (id: string) => {
    toast({ title: "Reported", description: "This item has been flagged for review." });
  };

  const handleRefresh = (id: string) => {
    toast({ title: "Refreshed", description: "Item data has been updated." });
  };

  const handleDelete = (id: string) => {
    deleteAlert(id);
    toast({ title: "Deleted", description: "Item has been removed from your view." });
  };

  const handleViewMockDetails = (item: USLegislationItem) => {
    markAsRead(item.id);
    setSelectedMockItem(item);
    setMockDrawerOpen(true);
  };

  const handleViewCongressDetails = (bill: CongressBill) => {
    const billId = `${bill.congress}-${bill.type}-${bill.number}`;
    markAsRead(billId);
    setSelectedCongressBill(bill);
    setCongressDrawerOpen(true);
  };

  const regulatoryCategories = ["Radio", "Product Safety", "Cybersecurity", "Battery", "Food Contact Material"];

  // Calculate risk counts from filtered data
  const riskCounts = useMemo(() => {
    let high = 0, medium = 0, low = 0;
    
    filteredData.forEach(item => {
      if (item.type === "mock") {
        if (item.data.riskLevel === "high") high++;
        else if (item.data.riskLevel === "medium") medium++;
        else if (item.data.riskLevel === "low") low++;
      } else {
        const billId = `${item.data.congress}-${item.data.type}-${item.data.number}`;
        const cached = localStorage.getItem(`ai_summary_v3_${billId}`);
        if (cached) {
          try {
            const analysis = JSON.parse(cached);
            const score = analysis.summary?.riskScore || 50;
            if (score >= 70) high++;
            else if (score >= 40) medium++;
            else low++;
          } catch {
            medium++;
          }
        } else {
          medium++;
        }
      }
    });
    
    return { high, medium, low };
  }, [filteredData]);

  // Smart filter: get available authorities based on jurisdiction level
  const availableAuthorities = useMemo((): Authority[] => {
    if (jurisdictionLevel === "federal") return ["congress", "federal-agency"];
    if (jurisdictionLevel === "state") return ["state"];
    if (jurisdictionLevel === "local") return ["city"];
    return ["congress", "federal-agency", "state", "city"];
  }, [jurisdictionLevel]);

  // Smart filter: chamber only shows for bills at federal/state level
  const showChamberFilter = useMemo(() => {
    if (selectedDocTypes.length > 0 && !selectedDocTypes.includes("bill")) return false;
    if (jurisdictionLevel === "local") return false;
    return true;
  }, [selectedDocTypes, jurisdictionLevel]);

  // Smart filter: geography only shows for state/local or all
  const showGeographyFilter = jurisdictionLevel !== "federal";

  // Get jurisdiction chip label
  const getJurisdictionLabel = () => {
    if (selectedStates.length === 0) return "Jurisdiction · All US";
    if (selectedStates.length <= 3) return `Jurisdiction · ${selectedStates.join(", ")}`;
    return `Jurisdiction · ${selectedStates.length} states`;
  };

  // Get category chip label
  const getCategoryLabel = () => {
    if (selectedCategories.length === 0) return "Category · All";
    if (selectedCategories.length === 1) return `Category · ${selectedCategories[0]}`;
    return `Category · ${selectedCategories.length} selected`;
  };

  // Get document type chip label
  const getDocTypeLabel = () => {
    if (selectedDocTypes.length === 0) return "Document type · All";
    if (selectedDocTypes.length <= 2) return `Document type · ${selectedDocTypes.map(t => documentTypeLabels[t]).join(", ")}`;
    return `Document type · ${selectedDocTypes.length} selected`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          🇺🇸 USA Legislation
        </h2>
        <p className="text-muted-foreground">
          {congressLoading ? "Loading Congress bills..." : `${allCount} items: ${totalCongress} Congress bills + ${totalMock} other documents`}
        </p>
      </div>

      {/* ========== ROW 1: SCOPE (Lifecycle + Level) - Strongest visual weight ========== */}
      <div className="bg-muted/50 border border-border rounded-lg p-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Lifecycle Tabs */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Lifecycle</span>
            <Tabs value={lifecycleFilter} onValueChange={(v) => setLifecycleFilter(v as LifecycleStatus)}>
              <TabsList className="bg-background p-1 shadow-sm">
                <TabsTrigger 
                  value="all" 
                  className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {lifecycleIcons.all}
                  All
                  <Badge variant="outline" className="ml-1 bg-background/50 text-foreground border-border text-[10px] px-1">
                    {allCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger 
                  value="in-force" 
                  className="gap-1.5 text-xs data-[state=active]:bg-success data-[state=active]:text-success-foreground"
                >
                  {lifecycleIcons["in-force"]}
                  In Force
                  <Badge variant="outline" className="ml-1 bg-background/50 text-foreground border-border text-[10px] px-1">
                    {inForceCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger 
                  value="pipeline" 
                  className="gap-1.5 text-xs data-[state=active]:bg-warning data-[state=active]:text-warning-foreground"
                >
                  {lifecycleIcons.pipeline}
                  Pipeline
                  <Badge variant="outline" className="ml-1 bg-background/50 text-foreground border-border text-[10px] px-1">
                    {pipelineCount}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Jurisdiction Level Tabs */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Level</span>
            <Tabs value={jurisdictionLevel} onValueChange={(v) => {
              setJurisdictionLevel(v as JurisdictionLevel);
              // Clear geography when switching to federal
              if (v === "federal") {
                setSelectedStates([]);
              }
            }}>
              <TabsList className="bg-background p-1 shadow-sm">
                <TabsTrigger value="all" className="gap-1.5 text-xs">
                  <Scale className="h-3.5 w-3.5" />
                  All
                </TabsTrigger>
                <TabsTrigger value="federal" className="gap-1.5 text-xs">
                  <Building2 className="h-3.5 w-3.5" />
                  Federal
                </TabsTrigger>
                <TabsTrigger value="state" className="gap-1.5 text-xs">
                  <MapPin className="h-3.5 w-3.5" />
                  State
                </TabsTrigger>
                <TabsTrigger value="local" className="gap-1.5 text-xs">
                  <Home className="h-3.5 w-3.5" />
                  Local
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* View Toggle */}
            <div className="flex items-center gap-1 ml-4">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ========== ROW 2: MAIN FILTERS (Jurisdiction, Category, Document Type) ========== */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Jurisdiction Filter (States) - shows when level is state/local/all */}
        {showGeographyFilter && (
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant={selectedStates.length > 0 ? "secondary" : "outline"} 
                size="sm" 
                className={cn("gap-2 h-9", selectedStates.length > 0 && "pr-2")}
              >
                <MapPin className="h-3.5 w-3.5" />
                {getJurisdictionLabel()}
                {selectedStates.length > 0 && (
                  <span 
                    className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStates([]);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-background border border-border max-h-80 overflow-y-auto z-50">
              <div className="text-xs font-medium text-muted-foreground mb-2 uppercase">
                Select {jurisdictionLevel === "local" ? "Cities" : "States"}
              </div>
              <div className="grid grid-cols-2 gap-1">
                {usStates.map(state => (
                  <div key={state.code} className="flex items-center gap-2">
                    <Checkbox
                      id={`state-${state.code}`}
                      checked={selectedStates.includes(state.code)}
                      onCheckedChange={() => toggleState(state.code)}
                    />
                    <label htmlFor={`state-${state.code}`} className="text-xs cursor-pointer">
                      {state.code} - {state.name}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Category Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant={selectedCategories.length > 0 ? "secondary" : "outline"} 
              size="sm" 
              className={cn("gap-2 h-9", selectedCategories.length > 0 && "pr-2")}
            >
              {getCategoryLabel()}
              {selectedCategories.length > 0 && (
                <span 
                  className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategories([]);
                  }}
                >
                  <X className="h-3 w-3" />
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 bg-background border border-border z-50">
            <div className="space-y-2">
              {regulatoryCategories.map(cat => (
                <div key={cat} className="flex items-center gap-2">
                  <Checkbox
                    id={`cat-${cat}`}
                    checked={selectedCategories.includes(cat)}
                    onCheckedChange={() => toggleCategory(cat)}
                  />
                  <label htmlFor={`cat-${cat}`} className="text-sm cursor-pointer">
                    {cat}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Document Type Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant={selectedDocTypes.length > 0 ? "secondary" : "outline"} 
              size="sm" 
              className={cn("gap-2 h-9", selectedDocTypes.length > 0 && "pr-2")}
            >
              <ScrollText className="h-3.5 w-3.5" />
              {getDocTypeLabel()}
              {selectedDocTypes.length > 0 && (
                <span 
                  className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDocTypes([]);
                  }}
                >
                  <X className="h-3 w-3" />
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 bg-background border border-border z-50">
            <div className="space-y-2">
              {(Object.keys(documentTypeLabels) as USDocumentType[]).map(type => (
                <div key={type} className="flex items-center gap-2">
                  <Checkbox
                    id={`doc-${type}`}
                    checked={selectedDocTypes.includes(type)}
                    onCheckedChange={() => toggleDocType(type)}
                  />
                  <label htmlFor={`doc-${type}`} className="text-sm flex items-center gap-2 cursor-pointer">
                    {documentTypeIcons[type]}
                    {documentTypeLabels[type]}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Advanced Filters Toggle */}
        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant={hasAdvancedFilters ? "secondary" : "ghost"} 
              size="sm" 
              className="gap-2 h-9 text-muted-foreground"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Advanced filters
              {hasAdvancedFilters && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {advancedFilterCount} active
                </Badge>
              )}
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", advancedOpen && "rotate-180")} />
            </Button>
          </CollapsibleTrigger>
        </Collapsible>

        {hasAnyFilters && (
          <Button variant="ghost" size="sm" className="h-9 text-muted-foreground" onClick={clearAllFilters}>
            Clear all
          </Button>
        )}
      </div>

      {/* ========== ROW 3: ADVANCED FILTERS (Collapsible) ========== */}
      <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
        <CollapsibleContent>
          <div className="bg-muted/20 border border-border/50 rounded-lg p-3 space-y-3">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Advanced Filters</div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Authority Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant={selectedAuthorities.length > 0 ? "secondary" : "outline"} 
                    size="sm" 
                    className={cn("gap-2 h-8", selectedAuthorities.length > 0 && "pr-2")}
                  >
                    <Building2 className="h-3.5 w-3.5" />
                    Authority
                    {selectedAuthorities.length > 0 && (
                      <>
                        <Badge variant="secondary" className="text-[10px] px-1">{selectedAuthorities.length}</Badge>
                        <span 
                          className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAuthorities([]);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </span>
                      </>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 bg-background border border-border z-50">
                  <div className="space-y-2">
                    {availableAuthorities.map(auth => (
                      <div key={auth} className="flex items-center gap-2">
                        <Checkbox
                          id={`auth-${auth}`}
                          checked={selectedAuthorities.includes(auth)}
                          onCheckedChange={() => toggleAuthority(auth)}
                        />
                        <label htmlFor={`auth-${auth}`} className="text-sm cursor-pointer">
                          {authorityLabels[auth]}
                        </label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Chamber Filter (only for bills) */}
              {showChamberFilter && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant={selectedChamber.length > 0 ? "secondary" : "outline"} 
                      size="sm" 
                      className={cn("gap-2 h-8", selectedChamber.length > 0 && "pr-2")}
                    >
                      <Landmark className="h-3.5 w-3.5" />
                      Chamber
                      {selectedChamber.length > 0 && (
                        <>
                          <Badge variant="secondary" className="text-[10px] px-1">{selectedChamber.length}</Badge>
                          <span 
                            className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedChamber([]);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </span>
                        </>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 bg-background border border-border z-50">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="chamber-house"
                          checked={selectedChamber.includes("house")}
                          onCheckedChange={() => toggleChamber("house")}
                        />
                        <label htmlFor="chamber-house" className="text-sm cursor-pointer">House</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="chamber-senate"
                          checked={selectedChamber.includes("senate")}
                          onCheckedChange={() => toggleChamber("senate")}
                        />
                        <label htmlFor="chamber-senate" className="text-sm cursor-pointer">Senate</label>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}

              {/* Risk Level Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant={selectedRiskLevels.length > 0 ? "secondary" : "outline"} 
                    size="sm" 
                    className={cn("gap-2 h-8", selectedRiskLevels.length > 0 && "pr-2")}
                  >
                    <Scale className="h-3.5 w-3.5" />
                    Risk Level
                    {selectedRiskLevels.length > 0 && (
                      <>
                        <Badge variant="secondary" className="text-[10px] px-1">{selectedRiskLevels.length}</Badge>
                        <span 
                          className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRiskLevels([]);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </span>
                      </>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 bg-background border border-border z-50">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="risk-high"
                        checked={selectedRiskLevels.includes("high")}
                        onCheckedChange={() => toggleRiskLevel("high")}
                      />
                      <label htmlFor="risk-high" className="text-sm cursor-pointer flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-risk-high" />
                        High
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="risk-medium"
                        checked={selectedRiskLevels.includes("medium")}
                        onCheckedChange={() => toggleRiskLevel("medium")}
                      />
                      <label htmlFor="risk-medium" className="text-sm cursor-pointer flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-risk-medium" />
                        Medium
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="risk-low"
                        checked={selectedRiskLevels.includes("low")}
                        onCheckedChange={() => toggleRiskLevel("low")}
                      />
                      <label htmlFor="risk-low" className="text-sm cursor-pointer flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-risk-low" />
                        Low
                      </label>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredData.length}</div>
          </CardContent>
        </Card>
        <Card className="border-risk-high/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-risk-high">
              {riskCounts.high}
            </div>
          </CardContent>
        </Card>
        <Card className="border-risk-medium/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Medium Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-risk-medium">
              {riskCounts.medium}
            </div>
          </CardContent>
        </Card>
        <Card className="border-risk-low/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Low Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-risk-low">
              {riskCounts.low}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {congressLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading Congress bills...</span>
        </div>
      )}

      {/* Error State */}
      {congressError && (
        <div className="text-center py-4 text-destructive">
          Error loading Congress bills: {congressError}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredData.length} items
      </div>

      {/* Cards */}
      {filteredData.length === 0 && !congressLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          No items match your filters
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
          {filteredData.map((item) => {
            if (item.type === "mock") {
              const itemId = item.data.id;
              return (
                <UnifiedAlertCard
                  key={itemId}
                  mockItem={item.data}
                  isRead={isRead(itemId)}
                  isStarred={isStarred(itemId)}
                  onMarkRead={() => markAsRead(itemId)}
                  onToggleStar={() => toggleStar(itemId)}
                  onDelete={() => handleDelete(itemId)}
                  onRefresh={() => handleRefresh(itemId)}
                  onReport={() => handleReport(itemId)}
                  onViewDetails={() => handleViewMockDetails(item.data)}
                />
              );
            } else {
              const bill = item.data;
              const billId = `${bill.congress}-${bill.type}-${bill.number}`;
              return (
                <UnifiedAlertCard
                  key={billId}
                  congressBill={bill}
                  isRead={isRead(billId)}
                  isStarred={isStarred(billId)}
                  onMarkRead={() => markAsRead(billId)}
                  onToggleStar={() => toggleStar(billId)}
                  onDelete={() => handleDelete(billId)}
                  onRefresh={() => handleRefresh(billId)}
                  onReport={() => handleReport(billId)}
                  onViewDetails={() => handleViewCongressDetails(bill)}
                />
              );
            }
          })}
        </div>
      )}

      {/* Drawers */}
      {selectedMockItem && (
        <USALegislationDrawer
          item={selectedMockItem}
          open={mockDrawerOpen}
          onOpenChange={setMockDrawerOpen}
        />
      )}

      {selectedCongressBill && (
        <CongressBillDrawer
          bill={selectedCongressBill}
          open={congressDrawerOpen}
          onOpenChange={setCongressDrawerOpen}
        />
      )}
    </div>
  );
}