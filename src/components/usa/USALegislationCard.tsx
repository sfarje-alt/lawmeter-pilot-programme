import { USLegislationItem, documentTypeLabels, authorityLabels } from "@/types/usaLegislation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  RefreshCw, 
  Trash2, 
  Flag, 
  Mail, 
  MailOpen,
  Calendar,
  Building2,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface USALegislationCardProps {
  item: USLegislationItem;
  isRead: boolean;
  isStarred: boolean;
  isGridView?: boolean;
  onMarkRead: () => void;
  onToggleStar: () => void;
  onDelete: () => void;
  onRefresh: () => void;
  onReport: () => void;
  onViewDetails: () => void;
}

export function USALegislationCard({
  item,
  isRead,
  isStarred,
  isGridView = false,
  onMarkRead,
  onToggleStar,
  onDelete,
  onRefresh,
  onReport,
  onViewDetails
}: USALegislationCardProps) {
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

  const getStatusIcon = () => {
    if (item.isInForce) {
      return <CheckCircle className="h-3 w-3 text-success" />;
    }
    return <Clock className="h-3 w-3 text-warning" />;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  // Grid view - simplified
  if (isGridView) {
    return (
      <Card 
        className={cn(
          "cursor-pointer transition-all hover:shadow-lg",
          !isRead && "bg-primary/5 border-primary/20"
        )}
        onClick={() => {
          onMarkRead();
          onViewDetails();
        }}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getDocTypeIcon()}</span>
              <Badge className={getRiskBadgeClass(item.riskLevel)}>
                {item.riskLevel.toUpperCase()}
              </Badge>
              {!isRead && (
                <Badge variant="secondary" className="bg-primary/20 text-primary text-xs">
                  NEW
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              {getStatusIcon()}
              <span className="text-xs text-muted-foreground">
                {item.isInForce ? "In Force" : "Pipeline"}
              </span>
            </div>
          </div>
          <h3 className="text-sm font-semibold line-clamp-2 mt-2">{item.title}</h3>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {item.subJurisdiction && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {item.subJurisdiction}
              </span>
            )}
            <span>{item.status}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // List view - full details
  return (
    <Card 
      className={cn(
        "transition-all hover:shadow-lg",
        !isRead && "bg-primary/5 border-primary/20 border-l-4 border-l-primary"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-xl">{getDocTypeIcon()}</span>
              <Badge variant="outline" className="font-mono text-xs">
                {item.localTerminology || documentTypeLabels[item.documentType]}
              </Badge>
              <Badge className={getRiskBadgeClass(item.riskLevel)}>
                {item.riskScore}
              </Badge>
              <Badge variant="secondary">
                {item.regulatoryCategory}
              </Badge>
              {item.subJurisdiction && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  🇺🇸 {item.subJurisdiction}
                </Badge>
              )}
              {!item.subJurisdiction && (
                <Badge variant="outline" className="flex items-center gap-1">
                  🇺🇸 Federal
                </Badge>
              )}
              {!isRead && (
                <Badge className="bg-primary text-primary-foreground animate-pulse">
                  UNREAD
                </Badge>
              )}
            </div>
            <h3 
              className="text-lg font-semibold cursor-pointer hover:text-primary transition-colors"
              onClick={() => {
                onMarkRead();
                onViewDetails();
              }}
            >
              {item.title}
            </h3>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => { e.stopPropagation(); onMarkRead(); }}
              title={isRead ? "Mark as unread" : "Mark as read"}
            >
              {isRead ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => { e.stopPropagation(); onToggleStar(); }}
            >
              <Star className={cn("h-4 w-4", isStarred && "fill-yellow-500 text-yellow-500")} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => { e.stopPropagation(); onRefresh(); }}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => { e.stopPropagation(); onReport(); }}
            >
              <Flag className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{item.summary}</p>
        
        <ul className="text-sm space-y-1">
          {item.bullets.slice(0, 2).map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
          <div className="flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            <span>{item.regulatoryBody}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Published: {formatDate(item.publishedDate)}</span>
          </div>
          {item.effectiveDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Effective: {formatDate(item.effectiveDate)}</span>
            </div>
          )}
          {item.complianceDeadline && (
            <div className="flex items-center gap-1 text-warning">
              <AlertTriangle className="h-3 w-3" />
              <span>Deadline: {formatDate(item.complianceDeadline)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className={cn(
              "text-sm font-medium",
              item.isInForce ? "text-success" : "text-warning"
            )}>
              {item.status}
            </span>
          </div>
          <Button 
            size="sm"
            onClick={() => {
              onMarkRead();
              onViewDetails();
            }}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
