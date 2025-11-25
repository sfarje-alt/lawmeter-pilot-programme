import { CongressBill } from "@/types/congress";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, Users } from "lucide-react";

interface CongressBillCardProps {
  bill: CongressBill;
  onViewDetails: () => void;
}

export function CongressBillCard({ bill, onViewDetails }: CongressBillCardProps) {
  const getBillTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      hr: "H.R.",
      s: "S.",
      hjres: "H.J.Res.",
      sjres: "S.J.Res.",
      hconres: "H.Con.Res.",
      sconres: "S.Con.Res.",
      hres: "H.Res.",
      sres: "S.Res.",
    };
    return types[type.toLowerCase()] || type.toUpperCase();
  };

  const getChamberColor = (chamber: string) => {
    return chamber === "House" 
      ? "bg-blue-500/10 text-blue-700 dark:text-blue-400" 
      : "bg-purple-500/10 text-purple-700 dark:text-purple-400";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="font-mono">
              {getBillTypeLabel(bill.type)} {bill.number}
            </Badge>
            <Badge className={getChamberColor(bill.originChamber)}>
              {bill.originChamber}
            </Badge>
            {bill.policyArea && (
              <Badge variant="secondary">{bill.policyArea.name}</Badge>
            )}
          </div>
        </div>
        <h3 className="text-lg font-semibold mt-2 line-clamp-2">{bill.title}</h3>
        
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(bill.latestAction.actionDate)}</span>
          </div>
          {bill.sponsors && bill.sponsors.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>
                {bill.sponsors[0].fullName} ({bill.sponsors[0].party}-{bill.sponsors[0].state})
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Última Acción:</p>
          <p className="line-clamp-2">{bill.latestAction.text}</p>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button variant="outline" size="sm" asChild>
            <a 
              href={`https://www.congress.gov/bill/${bill.congress}th-congress/${bill.type.toLowerCase() === 'hr' ? 'house' : 'senate'}-bill/${bill.number}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Ver en Congress.gov
            </a>
          </Button>
          <Button variant="default" size="sm" onClick={onViewDetails}>
            Ver Detalles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
