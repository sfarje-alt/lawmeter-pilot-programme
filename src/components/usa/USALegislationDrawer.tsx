import { USLegislationItem, documentTypeLabels, authorityLabels } from "@/types/usaLegislation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  X,
  ExternalLink,
  Calendar,
  Building2,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
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
  { id: "introduced", label: "Introduced", icon: FileText },
  { id: "committee", label: "Committee", icon: Building2 },
  { id: "floor", label: "Floor Vote", icon: CheckCircle },
  { id: "other-chamber", label: "Other Chamber", icon: Building2 },
  { id: "conference", label: "Conference", icon: Building2 },
  { id: "president", label: "President", icon: CheckCircle },
  { id: "enacted", label: "Enacted", icon: CheckCircle },
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
                <DrawerDescription>{item.summary}</DrawerDescription>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="px-4 pb-4 space-y-6">
            {/* Progress Tracker - only for bills */}
            {item.documentType === "bill" && (
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Legislative Progress
                </h3>
                <div className="space-y-2">
                  <Progress value={progressPercent} className="h-2" />
                  <div className="flex justify-between text-xs">
                    {legislativeStages.map((stage, idx) => {
                      const isComplete = idx <= currentStageIndex;
                      const isCurrent = idx === currentStageIndex;
                      return (
                        <div
                          key={stage.id}
                          className={cn(
                            "flex flex-col items-center gap-1 flex-1",
                            isComplete ? "text-primary" : "text-muted-foreground",
                            isCurrent && "font-semibold"
                          )}
                        >
                          <div className={cn(
                            "h-3 w-3 rounded-full border-2",
                            isComplete ? "bg-primary border-primary" : "border-muted-foreground",
                            isCurrent && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                          )} />
                          <span className="text-[10px] text-center leading-tight">
                            {stage.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
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
