import { useState, useMemo, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
  Filter,
  Home,
  Scale,
  Loader2
} from "lucide-react";
import { usaLegislationData } from "@/data/usaLegislationMockData";
import { USALegislationCard } from "./USALegislationCard";
import { USALegislationDrawer } from "./USALegislationDrawer";
import { CongressBillCard } from "@/components/congress/CongressBillCard";
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

// Union type for combined items
type CombinedLegislationItem = 
  | { type: "mock"; data: USLegislationItem }
  | { type: "congress"; data: CongressBill };

export function USALegislationSection() {
  const [lifecycleFilter, setLifecycleFilter] = useState<LifecycleStatus>("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedDocTypes, setSelectedDocTypes] = useState<USDocumentType[]>([]);
  const [selectedAuthorities, setSelectedAuthorities] = useState<Authority[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedChamber, setSelectedChamber] = useState<string[]>([]);
  const [jurisdictionLevel, setJurisdictionLevel] = useState<"all" | "federal" | "state">("all");
  
  // Separate states for different drawer types
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
    // Mock data items (non-bill types mainly)
    const mockItems: CombinedLegislationItem[] = usaLegislationData
      .filter(item => !isDeleted(item.id))
      .map(item => ({ type: "mock" as const, data: item }));
    
    // Congress bills (real API data)
    const congressItems: CombinedLegislationItem[] = congressBills.map(bill => ({
      type: "congress" as const,
      data: bill
    }));
    
    return [...mockItems, ...congressItems];
  }, [congressBills, isDeleted]);

  // Filter combined data
  const filteredData = useMemo(() => {
    return combinedData.filter(item => {
      if (item.type === "mock") {
        const mockItem = item.data;
        
        // Lifecycle filter
        if (lifecycleFilter === "in-force" && !mockItem.isInForce) return false;
        if (lifecycleFilter === "pipeline" && !mockItem.isPipeline) return false;

        // Document type filter
        if (selectedDocTypes.length > 0 && !selectedDocTypes.includes(mockItem.documentType)) return false;

        // Authority filter
        if (selectedAuthorities.length > 0 && !selectedAuthorities.includes(mockItem.authority)) return false;

        // Regulatory category filter
        if (selectedCategories.length > 0 && !selectedCategories.includes(mockItem.regulatoryCategory)) return false;

        // Jurisdiction level filter
        if (jurisdictionLevel === "federal" && mockItem.subJurisdiction) return false;
        if (jurisdictionLevel === "state" && !mockItem.subJurisdiction) return false;

        // State filter
        if (selectedStates.length > 0 && mockItem.subJurisdiction && !selectedStates.includes(mockItem.subJurisdiction)) return false;

        // Chamber filter (for bills)
        if (selectedChamber.length > 0 && mockItem.documentType === "bill") {
          const chamberMatch = selectedChamber.some(chamber => {
            if (chamber === "house") return mockItem.regulatoryBody?.toLowerCase().includes("house");
            if (chamber === "senate") return mockItem.regulatoryBody?.toLowerCase().includes("senate");
            return false;
          });
          if (!chamberMatch) return false;
        }

        return true;
      } else {
        // Congress bill
        const bill = item.data;
        
        // Congress bills are always in pipeline (not enacted yet as laws)
        if (lifecycleFilter === "in-force") return false;
        
        // Document type filter - Congress bills are "bill" type
        if (selectedDocTypes.length > 0 && !selectedDocTypes.includes("bill")) return false;
        
        // Authority filter - Congress bills are from "congress"
        if (selectedAuthorities.length > 0 && !selectedAuthorities.includes("congress")) return false;
        
        // Jurisdiction level - Congress bills are federal
        if (jurisdictionLevel === "state") return false;
        
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
          // Map Congress policy areas to our regulatory categories
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
        
        return true;
      }
    });
  }, [combinedData, lifecycleFilter, selectedDocTypes, selectedAuthorities, selectedCategories, jurisdictionLevel, selectedStates, selectedChamber]);

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

  const clearFilters = () => {
    setSelectedDocTypes([]);
    setSelectedAuthorities([]);
    setSelectedCategories([]);
    setSelectedStates([]);
    setSelectedChamber([]);
    setJurisdictionLevel("all");
  };

  const hasActiveFilters = selectedDocTypes.length > 0 || selectedAuthorities.length > 0 || selectedCategories.length > 0 || selectedStates.length > 0 || selectedChamber.length > 0 || jurisdictionLevel !== "all";

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
        // For Congress bills, check cached analysis
        const billId = `${item.data.congress}-${item.data.type}-${item.data.number}`;
        const cached = localStorage.getItem(`bill_analysis_${billId}`);
        if (cached) {
          const analysis = JSON.parse(cached);
          const score = analysis.riskScore;
          if (score >= 70) high++;
          else if (score >= 40) medium++;
          else low++;
        } else {
          medium++; // Default to medium if no analysis
        }
      }
    });
    
    return { high, medium, low };
  }, [filteredData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          🇺🇸 USA Legislation
        </h2>
        <p className="text-muted-foreground">
          {congressLoading ? "Loading Congress bills..." : `${allCount} items: ${totalCongress} Congress bills + ${totalMock} other documents`}
        </p>
      </div>

      {/* Lifecycle Tabs - Macro Filter */}
      <Tabs value={lifecycleFilter} onValueChange={(v) => setLifecycleFilter(v as LifecycleStatus)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4 bg-muted/50 p-1">
          <TabsTrigger 
            value="all" 
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {lifecycleIcons.all}
            <span>All</span>
            <Badge variant="outline" className="ml-1 bg-background/50 text-foreground border-border">
              {allCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="in-force" 
            className="gap-2 data-[state=active]:bg-success data-[state=active]:text-success-foreground"
          >
            {lifecycleIcons["in-force"]}
            <span>In Force</span>
            <Badge variant="outline" className="ml-1 bg-background/50 text-foreground border-border">
              {inForceCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="pipeline" 
            className="gap-2 data-[state=active]:bg-warning data-[state=active]:text-warning-foreground"
          >
            {lifecycleIcons.pipeline}
            <span>Pipeline</span>
            <Badge variant="outline" className="ml-1 bg-background/50 text-foreground border-border">
              {pipelineCount}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Secondary Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Jurisdiction Level Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Scale className="h-4 w-4" />
              Level
              {jurisdictionLevel !== "all" && (
                <Badge variant="secondary">1</Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 bg-background border border-border">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="level-all"
                  checked={jurisdictionLevel === "all"}
                  onCheckedChange={() => setJurisdictionLevel("all")}
                />
                <label htmlFor="level-all" className="text-sm cursor-pointer">All Levels</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="level-federal"
                  checked={jurisdictionLevel === "federal"}
                  onCheckedChange={() => setJurisdictionLevel("federal")}
                />
                <label htmlFor="level-federal" className="text-sm cursor-pointer flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Federal
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="level-state"
                  checked={jurisdictionLevel === "state"}
                  onCheckedChange={() => setJurisdictionLevel("state")}
                />
                <label htmlFor="level-state" className="text-sm cursor-pointer flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  State
                </label>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* State Filter (shows when state level selected) */}
        {(jurisdictionLevel === "state" || jurisdictionLevel === "all") && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <MapPin className="h-4 w-4" />
                States
                {selectedStates.length > 0 && (
                  <Badge variant="secondary">{selectedStates.length}</Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 bg-background border border-border max-h-80 overflow-y-auto">
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

        {/* Document Type Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <ScrollText className="h-4 w-4" />
              Document Type
              {selectedDocTypes.length > 0 && (
                <Badge variant="secondary">{selectedDocTypes.length}</Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 bg-background border border-border">
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

        {/* Authority Filter with nested options */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Building2 className="h-4 w-4" />
              Authority
              {selectedAuthorities.length > 0 && (
                <Badge variant="secondary">{selectedAuthorities.length}</Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 bg-background border border-border">
            <div className="space-y-3">
              {(Object.keys(authorityLabels) as Authority[]).map(auth => (
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

        {/* Chamber Filter (for Bills) */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Home className="h-4 w-4" />
              Chamber
              {selectedChamber.length > 0 && (
                <Badge variant="secondary">{selectedChamber.length}</Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 bg-background border border-border">
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

        {/* Regulatory Category Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Category
              {selectedCategories.length > 0 && (
                <Badge variant="secondary">{selectedCategories.length}</Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 bg-background border border-border">
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

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}

        {/* View Toggle */}
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {jurisdictionLevel !== "all" && (
            <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setJurisdictionLevel("all")}>
              {jurisdictionLevel === "federal" ? "Federal" : "State"} ×
            </Badge>
          )}
          {selectedStates.map(state => (
            <Badge key={state} variant="secondary" className="gap-1 cursor-pointer" onClick={() => toggleState(state)}>
              {state} ×
            </Badge>
          ))}
          {selectedDocTypes.map(type => (
            <Badge key={type} variant="secondary" className="gap-1 cursor-pointer" onClick={() => toggleDocType(type)}>
              {documentTypeLabels[type]} ×
            </Badge>
          ))}
          {selectedAuthorities.map(auth => (
            <Badge key={auth} variant="secondary" className="gap-1 cursor-pointer" onClick={() => toggleAuthority(auth)}>
              {authorityLabels[auth]} ×
            </Badge>
          ))}
          {selectedChamber.map(chamber => (
            <Badge key={chamber} variant="secondary" className="gap-1 cursor-pointer" onClick={() => toggleChamber(chamber)}>
              {chamber === "house" ? "House" : "Senate"} ×
            </Badge>
          ))}
          {selectedCategories.map(cat => (
            <Badge key={cat} variant="secondary" className="gap-1 cursor-pointer" onClick={() => toggleCategory(cat)}>
              {cat} ×
            </Badge>
          ))}
        </div>
      )}

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
          {filteredData.map((item, index) => {
            if (item.type === "mock") {
              return (
                <USALegislationCard
                  key={item.data.id}
                  item={item.data}
                  isRead={isRead(item.data.id)}
                  isStarred={isStarred(item.data.id)}
                  isGridView={viewMode === "grid"}
                  onMarkRead={() => toggleRead(item.data.id)}
                  onToggleStar={() => toggleStar(item.data.id)}
                  onDelete={() => handleDelete(item.data.id)}
                  onRefresh={() => handleRefresh(item.data.id)}
                  onReport={() => handleReport(item.data.id)}
                  onViewDetails={() => handleViewMockDetails(item.data)}
                />
              );
            } else {
              // Congress bill - use the rich CongressBillCard
              return (
                <CongressBillCard
                  key={`congress-${item.data.congress}-${item.data.type}-${item.data.number}`}
                  bill={item.data}
                  onViewDetails={() => handleViewCongressDetails(item.data)}
                />
              );
            }
          })}
        </div>
      )}

      {/* Mock Data Detail Drawer */}
      <USALegislationDrawer
        item={selectedMockItem}
        open={mockDrawerOpen}
        onClose={() => setMockDrawerOpen(false)}
      />

      {/* Congress Bill Detail Drawer (with 7 tabs) */}
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
