import { useState, useMemo } from "react";
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
  ChevronDown,
  Home,
  Scale
} from "lucide-react";
import { usaLegislationData } from "@/data/usaLegislationMockData";
import { USALegislationCard } from "./USALegislationCard";
import { USALegislationDrawer } from "./USALegislationDrawer";
import { useReadAlerts } from "@/hooks/useReadAlerts";
import { useStarredBills } from "@/hooks/useStarredBills";
import { useToast } from "@/hooks/use-toast";
import { LifecycleStatus, USDocumentType, Authority, USLegislationItem, documentTypeLabels, authorityLabels } from "@/types/usaLegislation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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

export function USALegislationSection() {
  const [lifecycleFilter, setLifecycleFilter] = useState<LifecycleStatus>("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedDocTypes, setSelectedDocTypes] = useState<USDocumentType[]>([]);
  const [selectedAuthorities, setSelectedAuthorities] = useState<Authority[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedChamber, setSelectedChamber] = useState<string[]>([]);
  const [jurisdictionLevel, setJurisdictionLevel] = useState<"all" | "federal" | "state">("all");
  const [selectedItem, setSelectedItem] = useState<USLegislationItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const { markAsRead, toggleRead, isRead, getUnreadCount, deleteAlert, isDeleted } = useReadAlerts();
  const { isStarred, toggleStar } = useStarredBills();
  const { toast } = useToast();

  // Filter data
  const filteredData = useMemo(() => {
    return usaLegislationData.filter(item => {
      // Exclude deleted items
      if (isDeleted(item.id)) return false;

      // Lifecycle filter
      if (lifecycleFilter === "in-force" && !item.isInForce) return false;
      if (lifecycleFilter === "pipeline" && !item.isPipeline) return false;

      // Document type filter
      if (selectedDocTypes.length > 0 && !selectedDocTypes.includes(item.documentType)) return false;

      // Authority filter
      if (selectedAuthorities.length > 0 && !selectedAuthorities.includes(item.authority)) return false;

      // Regulatory category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(item.regulatoryCategory)) return false;

      // Jurisdiction level filter
      if (jurisdictionLevel === "federal" && item.subJurisdiction) return false;
      if (jurisdictionLevel === "state" && !item.subJurisdiction) return false;

      // State filter
      if (selectedStates.length > 0 && item.subJurisdiction && !selectedStates.includes(item.subJurisdiction)) return false;

      // Chamber filter (for bills)
      if (selectedChamber.length > 0 && item.documentType === "bill") {
        const chamberMatch = selectedChamber.some(chamber => {
          if (chamber === "house") return item.regulatoryBody?.toLowerCase().includes("house");
          if (chamber === "senate") return item.regulatoryBody?.toLowerCase().includes("senate");
          return false;
        });
        if (!chamberMatch) return false;
      }

      return true;
    });
  }, [lifecycleFilter, selectedDocTypes, selectedAuthorities, selectedCategories, jurisdictionLevel, selectedStates, selectedChamber, isDeleted]);

  // Count by lifecycle
  const allIds = usaLegislationData.filter(i => !isDeleted(i.id)).map(i => i.id);
  const inForceIds = usaLegislationData.filter(i => i.isInForce && !isDeleted(i.id)).map(i => i.id);
  const pipelineIds = usaLegislationData.filter(i => i.isPipeline && !isDeleted(i.id)).map(i => i.id);

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

  const handleViewDetails = (item: USLegislationItem) => {
    markAsRead(item.id);
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const regulatoryCategories = ["Radio", "Product Safety", "Cybersecurity", "Battery", "Food Contact Material"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          🇺🇸 USA Legislation
        </h2>
        <p className="text-muted-foreground">
          All document types: Bills, Statutes, Regulations, Treaties, and Local Ordinances
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
              {allIds.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="in-force" 
            className="gap-2 data-[state=active]:bg-success data-[state=active]:text-success-foreground"
          >
            {lifecycleIcons["in-force"]}
            <span>In Force</span>
            <Badge variant="outline" className="ml-1 bg-background/50 text-foreground border-border">
              {inForceIds.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="pipeline" 
            className="gap-2 data-[state=active]:bg-warning data-[state=active]:text-warning-foreground"
          >
            {lifecycleIcons.pipeline}
            <span>Pipeline</span>
            <Badge variant="outline" className="ml-1 bg-background/50 text-foreground border-border">
              {pipelineIds.length}
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
              {filteredData.filter(i => i.riskLevel === "high").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-risk-medium/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Medium Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-risk-medium">
              {filteredData.filter(i => i.riskLevel === "medium").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-risk-low/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Low Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-risk-low">
              {filteredData.filter(i => i.riskLevel === "low").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredData.length} items ({getUnreadCount(filteredData.map(i => i.id))} unread)
      </div>

      {/* Cards */}
      {filteredData.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No items match your filters
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" : "space-y-4"}>
          {filteredData.map(item => (
            <USALegislationCard
              key={item.id}
              item={item}
              isRead={isRead(item.id)}
              isStarred={isStarred(item.id)}
              isGridView={viewMode === "grid"}
              onMarkRead={() => toggleRead(item.id)}
              onToggleStar={() => toggleStar(item.id)}
              onDelete={() => handleDelete(item.id)}
              onRefresh={() => handleRefresh(item.id)}
              onReport={() => handleReport(item.id)}
              onViewDetails={() => handleViewDetails(item)}
            />
          ))}
        </div>
      )}

      {/* Detail Drawer */}
      <USALegislationDrawer
        item={selectedItem}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
