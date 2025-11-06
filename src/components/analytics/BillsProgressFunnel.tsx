import { BillItem } from "@/types/legislation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitBranch } from "lucide-react";

interface BillsProgressFunnelProps {
  bills: BillItem[];
}

export function BillsProgressFunnel({ bills }: BillsProgressFunnelProps) {
  // Define the stages in order
  const stages = [
    { key: "First Reading", label: "First Reading" },
    { key: "Second Reading", label: "Second Reading" },
    { key: "Committee", label: "Committee Stage" },
    { key: "Third Reading", label: "Third Reading" },
    { key: "Passed", label: "Passed" },
    { key: "Royal Assent", label: "Royal Assent" },
  ];

  const stageData = stages.map(stage => {
    const count = bills.filter(bill => bill.status.includes(stage.key)).length;
    return {
      ...stage,
      count,
      percentage: bills.length > 0 ? (count / bills.length) * 100 : 0
    };
  });

  const maxCount = Math.max(...stageData.map(s => s.count), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          Progreso de Proyectos legislativos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {stageData.map((stage, index) => (
            <div key={stage.key} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{stage.label}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{stage.count}</Badge>
                  <span className="text-muted-foreground text-xs">
                    {stage.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="relative h-8 bg-muted rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500 rounded-full flex items-center justify-center text-white text-xs font-medium"
                  style={{ 
                    width: `${Math.max((stage.count / maxCount) * 100, stage.count > 0 ? 8 : 0)}%`,
                  }}
                >
                  {stage.count > 0 && (
                    <span className="px-2">{stage.count}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Proyectos:</span>
              <span className="font-semibold">{bills.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Completed (Royal Assent):</span>
              <span className="font-semibold">{stageData[stageData.length - 1].count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Completion Rate:</span>
              <span className="font-semibold">
                {bills.length > 0 ? ((stageData[stageData.length - 1].count / bills.length) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
