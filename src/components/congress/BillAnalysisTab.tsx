import { BillAnalysis } from "@/types/congress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, Users, Building2, Landmark, Globe, CheckCircle2, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface BillAnalysisTabProps {
  analysis: BillAnalysis | null;
  loading?: boolean;
}

export function BillAnalysisTab({ analysis, loading }: BillAnalysisTabProps) {
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <Card>
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analysis) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">
            No analysis available for this bill. Analysis is generated automatically when loading bill text.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getRiskColor = (category: string) => {
    switch (category) {
      case "Critical":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      case "High":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20";
      case "Medium":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
      case "Low":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getProgressColor = (score: number) => {
    if (score >= 75) return "bg-red-500";
    if (score >= 50) return "bg-orange-500";
    if (score >= 25) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStakeholderIcon = (type: string) => {
    switch (type) {
      case "Industry":
        return <Building2 className="h-4 w-4" />;
      case "Company":
        return <Building2 className="h-4 w-4" />;
      case "Government":
        return <Landmark className="h-4 w-4" />;
      case "Public":
        return <Globe className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case "Support":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "Oppose":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      case "Neutral":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Analysis Metadata */}
      {analysis.metadata && (
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              {analysis.metadata.usedFullText ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              ) : (
                <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {analysis.metadata.usedFullText 
                    ? "✓ Analysis based on full bill text" 
                    : "⚠ Analysis based on title only"}
                </p>
                {analysis.metadata.usedFullText && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Analyzed {analysis.metadata.textCharCount.toLocaleString()} characters from bill text
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Score Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Risk Assessment for Data Centers
            </CardTitle>
            <Badge variant="outline" className={getRiskColor(analysis.riskCategory)}>
              {analysis.riskCategory} Risk
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Risk Score</span>
              <span className="font-bold text-lg">{analysis.riskScore}/100</span>
            </div>
            <Progress 
              value={analysis.riskScore} 
              className="h-3"
              style={{
                // @ts-ignore - Custom CSS variable
                "--progress-background": getProgressColor(analysis.riskScore)
              }}
            />
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Impact Analysis
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {analysis.explanation}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stakeholders Card */}
      {analysis.stakeholders && analysis.stakeholders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Stakeholder Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.stakeholders.map((stakeholder, index) => (
                <div 
                  key={index} 
                  className="p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {getStakeholderIcon(stakeholder.type)}
                      <div>
                        <h4 className="font-semibold">{stakeholder.name}</h4>
                        <Badge variant="outline" className="mt-1">
                          {stakeholder.type}
                        </Badge>
                      </div>
                    </div>
                    <Badge className={getPositionColor(stakeholder.position)}>
                      {stakeholder.position}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {stakeholder.impact}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-xs text-muted-foreground text-center pt-2">
        <p>AI-generated analysis based on bill text</p>
      </div>
    </div>
  );
}
