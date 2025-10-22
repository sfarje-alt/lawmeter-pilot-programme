import { BillItem } from "@/types/legislation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ExternalLink, FileText, Calendar } from "lucide-react";
import { getPortfolioColor } from "@/lib/portfolioColors";

interface BillCardProps {
  bill: BillItem;
  isStarred: boolean;
  onToggleStar: () => void;
  onOpenDrawer: () => void;
}

export function BillCard({ bill, isStarred, onToggleStar, onOpenDrawer }: BillCardProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case "high": return "bg-risk-high text-white";
      case "medium": return "bg-risk-medium text-white";
      case "low": return "bg-risk-low text-white";
      default: return "bg-muted";
    }
  };

  const statusStages = [
    "Introduced",
    "Second Reading",
    "Committee",
    "Consideration in Detail",
    "Passed House",
    "Passed Senate",
    "Royal Assent Pending"
  ];

  const currentStageIndex = statusStages.indexOf(bill.status);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={getRiskColor(bill.risk_level)}>
              {bill.risk_level.toUpperCase()} RISK
            </Badge>
            <Badge variant="outline">{bill.risk_score}/100</Badge>
            {bill.portfolio && (
              <Badge className={getPortfolioColor(bill.portfolio)}>
                {bill.portfolio}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleStar}
              className={isStarred ? "text-yellow-500" : ""}
            >
              <Star className="h-4 w-4" fill={isStarred ? "currentColor" : "none"} />
            </Button>
          </div>
        </div>
        <h3 className="text-lg font-semibold mt-2">{bill.title}</h3>
        
        <div className="flex items-center gap-1.5 mt-2 text-sm text-foreground font-medium">
          <Calendar className="h-4 w-4" />
          <span>Last Action: {new Date(bill.lastActionDate).toLocaleDateString("en-AU", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {bill.party && <Badge variant="secondary">{bill.party}</Badge>}
          <Badge variant="outline">{bill.chamber}</Badge>
          <Badge variant="outline">{bill.status}</Badge>
        </div>

        {/* Status Timeline */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">Progress Timeline</p>
          <div className="flex items-center gap-1">
            {statusStages.map((stage, index) => {
              const isComplete = index < currentStageIndex;
              const isCurrent = index === currentStageIndex;
              const isPending = index > currentStageIndex;
              
              return (
                <div key={stage} className="flex items-center flex-1">
                  <div
                    className={`h-2 flex-1 rounded-full transition-colors ${
                      isComplete
                        ? "bg-success"
                        : isCurrent
                        ? "bg-primary animate-pulse"
                        : "bg-muted"
                    }`}
                    title={stage}
                  />
                  {index < statusStages.length - 1 && (
                    <div className="w-0.5 h-2 bg-border mx-0.5" />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Introduced</span>
            <span>Royal Assent</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3">{bill.summary}</p>

        {bill.bullets.length > 0 && (
          <ul className="text-sm space-y-1">
            {bill.bullets.slice(0, 3).map((bullet, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-primary">•</span>
                <span className="text-muted-foreground">{bullet}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          {bill.motherActLink && (
            <Button variant="outline" size="sm" asChild>
              <a href={bill.motherActLink} target="_blank" rel="noopener noreferrer">
                <FileText className="h-3 w-3 mr-1" />
                Mother Act
              </a>
            </Button>
          )}
          {bill.amendmentActLink && (
            <Button variant="outline" size="sm" asChild>
              <a href={bill.amendmentActLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Amendment Act
              </a>
            </Button>
          )}
          <Button variant="default" size="sm" onClick={onOpenDrawer}>
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
