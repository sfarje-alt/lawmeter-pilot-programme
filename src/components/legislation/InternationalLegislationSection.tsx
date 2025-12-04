import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InternationalLegislation } from "@/data/mockInternationalLegislation";
import { InternationalLegislationCard } from "./InternationalLegislationCard";

interface InternationalLegislationSectionProps {
  legislation: InternationalLegislation[];
  title?: string;
  showDemo?: boolean;
}

export function InternationalLegislationSection({ 
  legislation, 
  title,
  showDemo = true 
}: InternationalLegislationSectionProps) {
  const kpis = {
    total: legislation.length,
    high: legislation.filter(l => l.riskLevel === "high").length,
    medium: legislation.filter(l => l.riskLevel === "medium").length,
    low: legislation.filter(l => l.riskLevel === "low").length,
  };

  return (
    <div className="space-y-6">
      {showDemo && (
        <div className="bg-warning/10 border border-warning rounded-lg p-4">
          <div className="flex gap-2">
            <span className="text-warning">⚡</span>
            <div>
              <p className="font-semibold">Smart Kettle & Espresso Machine Compliance</p>
              <p className="text-sm text-muted-foreground">
                Legislation filtered for relevance to smart kettles and espresso machine manufacturers.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.total}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-risk-high">{kpis.high}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Medium Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-risk-medium">{kpis.medium}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Low Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-risk-low">{kpis.low}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {legislation.map((item) => (
          <InternationalLegislationCard key={item.id} legislation={item} />
        ))}
      </div>

      {legislation.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No legislation found for this jurisdiction.
        </div>
      )}
    </div>
  );
}
