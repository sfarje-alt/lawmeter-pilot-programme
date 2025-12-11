import { USLegislationItem, documentTypeLabels, authorityLabels } from "@/types/usaLegislation";
import { ExtendedUSLegislationItem } from "@/data/usaLegislationMockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  X,
  ExternalLink,
  Calendar,
  Building2,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Users,
  History,
  Scale,
  Info,
  TrendingUp,
  ThumbsUp,
  ChevronRight,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface USALegislationDrawerProps {
  item: USLegislationItem | null;
  open: boolean;
  onClose: () => void;
}

// Legislative stages for progress tracking
const legislativeStages = [
  { id: "introduced", label: "Introduced" },
  { id: "committee", label: "Committee" },
  { id: "floor", label: "Floor Vote" },
  { id: "other-chamber", label: "Other Chamber" },
  { id: "conference", label: "Conference" },
  { id: "president", label: "President" },
  { id: "enacted", label: "Enacted" },
];

// Map status to stage index
function getStageIndex(status: string): number {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus.includes("enacted") || lowerStatus.includes("in force") || lowerStatus.includes("effective")) return 6;
  if (lowerStatus.includes("president") || lowerStatus.includes("signed")) return 5;
  if (lowerStatus.includes("conference")) return 4;
  if (lowerStatus.includes("passed") && lowerStatus.includes("senate")) return 3;
  if (lowerStatus.includes("passed") && lowerStatus.includes("house")) return 3;
  if (lowerStatus.includes("floor") || lowerStatus.includes("vote")) return 2;
  if (lowerStatus.includes("committee") || lowerStatus.includes("referred")) return 1;
  return 0;
}

export function USALegislationDrawer({ item, open, onClose }: USALegislationDrawerProps) {
  if (!item) return null;

  // Cast to extended type to access additional fields
  const extendedItem = item as ExtendedUSLegislationItem;

  const getRiskBadgeClass = (level: string) => {
    switch (level) {
      case "high": return "bg-risk-high text-risk-high-foreground";
      case "medium": return "bg-risk-medium text-risk-medium-foreground";
      case "low": return "bg-risk-low text-risk-low-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getDocTypeIcon = () => {
    switch (item.documentType) {
      case "bill": return "📜";
      case "statute": return "⚖️";
      case "regulation": return "📋";
      case "treaty": return "🤝";
      case "ordinance": return "🏛️";
      default: return "📄";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  };

  const currentStageIndex = getStageIndex(item.status);
  const progressPercent = ((currentStageIndex + 1) / legislativeStages.length) * 100;

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-4xl overflow-y-auto">
          <DrawerHeader className="text-left">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-2xl">{getDocTypeIcon()}</span>
                  <Badge variant="outline" className="font-mono">
                    {item.localTerminology || documentTypeLabels[item.documentType]}
                  </Badge>
                  <Badge className={getRiskBadgeClass(item.riskLevel)}>
                    Risk: {item.riskScore}
                  </Badge>
                  <Badge variant="secondary">{item.regulatoryCategory}</Badge>
                  {item.subJurisdiction ? (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      🇺🇸 {item.subJurisdiction}
                    </Badge>
                  ) : (
                    <Badge variant="outline">🇺🇸 Federal</Badge>
                  )}
                </div>
                <DrawerTitle className="text-xl">{item.title}</DrawerTitle>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="px-4 pb-4">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="overview">
                  <Info className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="analysis">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  AI Analysis
                </TabsTrigger>
                <TabsTrigger value="votes">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Votes
                </TabsTrigger>
                <TabsTrigger value="sponsors">
                  <Users className="h-4 w-4 mr-2" />
                  Sponsors
                </TabsTrigger>
                <TabsTrigger value="actions">
                  <History className="h-4 w-4 mr-2" />
                  Actions
                </TabsTrigger>
                <TabsTrigger value="summaries">
                  <FileText className="h-4 w-4 mr-2" />
                  Summaries
                </TabsTrigger>
                <TabsTrigger value="amendments">
                  <Scale className="h-4 w-4 mr-2" />
                  Details
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 mt-6">
                {/* Progress Tracker - only for bills */}
                {item.documentType === "bill" && (
                  <div className="p-6 rounded-lg bg-muted/50 border">
                    <p className="text-sm font-semibold text-muted-foreground mb-4">Legislative Status</p>
                    <div className="flex items-center gap-1">
                      {legislativeStages.map((stage, index) => (
                        <div key={stage.id} className="flex items-center flex-1">
                          {index > 0 && (
                            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mx-1" />
                          )}
                          <div className="flex flex-col items-center flex-1">
                            <div className={cn(
                              "w-full h-2 rounded-full transition-colors",
                              index <= currentStageIndex ? "bg-primary" : "bg-muted"
                            )} />
                            <span className={cn(
                              "text-xs mt-2 font-medium text-center",
                              index === currentStageIndex ? "text-foreground" : "text-muted-foreground"
                            )}>
                              {stage.label}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-4">
                      {item.isInForce ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : (
                        <Clock className="h-4 w-4 text-warning" />
                      )}
                      <span className={item.isInForce ? "text-success" : "text-warning"}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Summary</h3>
                  <p className="text-sm text-muted-foreground">{item.summary}</p>
                </div>

                {/* Key Points */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Key Points</h3>
                  <ul className="space-y-2">
                    {item.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-1">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Impact Areas */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Impact Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.impactAreas.map((area, idx) => (
                      <Badge key={idx} variant="outline">{area}</Badge>
                    ))}
                  </div>
                </div>

                {/* Dates & Details */}
                <Separator />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Published: {formatDate(item.publishedDate)}</span>
                    </div>
                    {item.effectiveDate && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Effective: {formatDate(item.effectiveDate)}</span>
                      </div>
                    )}
                    {item.complianceDeadline && (
                      <div className="flex items-center gap-2 text-warning">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Deadline: {formatDate(item.complianceDeadline)}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{item.regulatoryBody}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{authorityLabels[item.authority]}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* AI Analysis Tab */}
              <TabsContent value="analysis" className="space-y-4 mt-6">
                <div className="p-6 rounded-lg bg-muted/50 border space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Risk Assessment
                    </h3>
                    <Badge className={getRiskBadgeClass(item.riskLevel)}>
                      Score: {item.riskScore}/100
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Risk Level</h4>
                      <Progress value={item.riskScore} className="h-2" />
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        This {documentTypeLabels[item.documentType].toLowerCase()} has been assessed as {item.riskLevel} risk 
                        for smart appliance manufacturers. Key concerns include compliance with {item.regulatoryCategory.toLowerCase()} requirements
                        and potential impacts on {item.impactAreas.slice(0, 2).join(" and ").toLowerCase()}.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-1">Recommended Actions</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Review {item.regulatoryCategory} compliance requirements</li>
                        <li>• Assess impact on current product lines</li>
                        {item.complianceDeadline && (
                          <li>• Plan for compliance by {formatDate(item.complianceDeadline)}</li>
                        )}
                        <li>• Monitor for updates and amendments</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Votes Tab */}
              <TabsContent value="votes" className="space-y-4 mt-6">
                {item.documentType === "bill" ? (
                  <div className="p-6 rounded-lg bg-muted/50 border text-center">
                    <ThumbsUp className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Voting records will be available once this bill proceeds to a floor vote.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Current status: {item.status}
                    </p>
                  </div>
                ) : (
                  <div className="p-6 rounded-lg bg-muted/50 border text-center">
                    <ThumbsUp className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Voting records are not applicable for {documentTypeLabels[item.documentType].toLowerCase()}s.
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Sponsors Tab */}
              <TabsContent value="sponsors" className="space-y-4 mt-6">
                {extendedItem.sponsors && extendedItem.sponsors.length > 0 ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted/50 border">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Primary Sponsor
                      </h3>
                      {extendedItem.sponsors.map((sponsor, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{sponsor.name}</p>
                            <p className="text-sm text-muted-foreground">{sponsor.party} - {sponsor.state}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {extendedItem.cosponsors && extendedItem.cosponsors.length > 0 && (
                      <div className="p-4 rounded-lg bg-muted/50 border">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Cosponsors ({extendedItem.cosponsors.length})
                        </h3>
                        <div className="space-y-2">
                          {extendedItem.cosponsors.map((cosponsor, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <span className="text-primary">•</span>
                              <span>{cosponsor.name}</span>
                              <span className="text-muted-foreground">({cosponsor.party}-{cosponsor.state})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 rounded-lg bg-muted/50 border text-center">
                    <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Sponsor information not available for this {documentTypeLabels[item.documentType].toLowerCase()}.
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Actions Tab */}
              <TabsContent value="actions" className="space-y-4 mt-6">
                {extendedItem.actions && extendedItem.actions.length > 0 ? (
                  <div className="space-y-3">
                    {extendedItem.actions.map((action, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-muted/50 border">
                        <div className="flex items-start gap-3">
                          <div className="text-sm font-medium text-primary min-w-[100px]">
                            {formatDate(action.date)}
                          </div>
                          <div className="text-sm text-foreground">{action.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-lg bg-muted/50 border text-center">
                    <History className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Action history not available.
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Summaries Tab */}
              <TabsContent value="summaries" className="space-y-4 mt-6">
                {extendedItem.overview ? (
                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <h3 className="font-semibold mb-3">Overview</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{extendedItem.overview}</p>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <h3 className="font-semibold mb-3">Summary</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.summary}</p>
                  </div>
                )}

                {extendedItem.subjects && extendedItem.subjects.length > 0 && (
                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <h3 className="font-semibold mb-3">Subjects</h3>
                    <div className="flex flex-wrap gap-2">
                      {extendedItem.subjects.map((subject, idx) => (
                        <Badge key={idx} variant="outline">{subject}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Details/Amendments Tab */}
              <TabsContent value="amendments" className="space-y-4 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <h3 className="font-semibold mb-2">Document Type</h3>
                    <p className="text-sm text-muted-foreground">{documentTypeLabels[item.documentType]}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <h3 className="font-semibold mb-2">Authority</h3>
                    <p className="text-sm text-muted-foreground">{authorityLabels[item.authority]}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <h3 className="font-semibold mb-2">Regulatory Body</h3>
                    <p className="text-sm text-muted-foreground">{item.regulatoryBody}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <h3 className="font-semibold mb-2">Category</h3>
                    <p className="text-sm text-muted-foreground">{item.regulatoryCategory}</p>
                  </div>
                </div>

                {extendedItem.committees && extendedItem.committees.length > 0 && (
                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <h3 className="font-semibold mb-3">Committees</h3>
                    <ul className="space-y-1">
                      {extendedItem.committees.map((committee, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                          <Building2 className="h-3 w-3" />
                          {committee}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {extendedItem.costEstimate && (
                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <h3 className="font-semibold mb-2">Cost Estimate</h3>
                    <p className="text-sm text-muted-foreground">{extendedItem.costEstimate.amount}</p>
                    <p className="text-xs text-muted-foreground mt-1">Source: {extendedItem.costEstimate.source}</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <DrawerFooter>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Original Source
              </Button>
              <DrawerClose asChild>
                <Button variant="secondary" className="flex-1">Close</Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
