import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Filter
} from "lucide-react";
import { usaLegislationData } from "@/data/usaLegislationMockData";
import { USALegislationCard } from "./USALegislationCard";
import { useReadAlerts } from "@/hooks/useReadAlerts";
import { useStarredBills } from "@/hooks/useStarredBills";
import { useToast } from "@/hooks/use-toast";
import { LifecycleStatus, USDocumentType, Authority, documentTypeLabels, authorityLabels } from "@/types/usaLegislation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export function USALegislationSection() {
  const [lifecycleFilter, setLifecycleFilter] = useState<LifecycleStatus>("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedDocTypes, setSelectedDocTypes] = useState<USDocumentType[]>([]);
  const [selectedAuthorities, setSelectedAuthorities] = useState<Authority[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const { markAsRead, markAsUnread, toggleRead, isRead, getUnreadCount, deleteAlert, isDeleted } = useReadAlerts();
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

      return true;
    });
  }, [lifecycleFilter, selectedDocTypes, selectedAuthorities, selectedCategories, isDeleted]);

  // Count by lifecycle
  const allIds = usaLegislationData.filter(i => !isDeleted(i.id)).map(i => i.id);
  const inForceIds = usaLegislationData.filter(i => i.isInForce && !isDeleted(i.id)).map(i => i.id);
  const pipelineIds = usaLegislationData.filter(i => i.isPipeline && !isDeleted(i.id)).map(i => i.id);

  const allUnread = getUnreadCount(allIds);
  const inForceUnread = getUnreadCount(inForceIds);
  const pipelineUnread = getUnreadCount(pipelineIds);

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

  const clearFilters = () => {
    setSelectedDocTypes([]);
    setSelectedAuthorities([]);
    setSelectedCategories([]);
  };

  const hasActiveFilters = selectedDocTypes.length > 0 || selectedAuthorities.length > 0 || selectedCategories.length > 0;

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
        <TabsList className="grid w-full grid-cols-3 mb-4 glass-card p-1">
          <TabsTrigger value="all" className="gap-2 data-[state=active]:bg-accent">
            {lifecycleIcons.all}
            All
            {allUnread > 0 && (
              <Badge variant="secondary" className="ml-1 bg-primary/20 text-primary">
                {allUnread}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="in-force" className="gap-2 data-[state=active]:bg-success/20 data-[state=active]:text-success">
            {lifecycleIcons["in-force"]}
            In Force
            {inForceUnread > 0 && (
              <Badge variant="secondary" className="ml-1 bg-success/20 text-success">
                {inForceUnread}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="gap-2 data-[state=active]:bg-warning/20 data-[state=active]:text-warning">
            {lifecycleIcons.pipeline}
            Pipeline
            {pipelineUnread > 0 && (
              <Badge variant="secondary" className="ml-1 bg-warning/20 text-warning">
                {pipelineUnread}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Secondary Filters */}
      <div className="flex flex-wrap items-center gap-3">
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

        {/* Authority Filter */}
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
          <PopoverContent className="w-56 bg-background border border-border">
            <div className="space-y-2">
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
              onViewDetails={() => {
                markAsRead(item.id);
                toast({ title: "Opening details", description: item.title });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
