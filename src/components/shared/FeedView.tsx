import { Alert, BillItem } from "@/types/legislation";
import { AlertActCard } from "@/components/acts/AlertActCard";
import { BillCard } from "@/components/bills/BillCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Grid, List, FileText, Receipt } from "lucide-react";
import { useState } from "react";
import { getOneYearAgo, parseDate } from "@/lib/dateUtils";

interface FeedViewProps {
  alerts: Alert[];
  bills: BillItem[];
  isStarred: (scope: "ACTS" | "BILLS", key: string) => boolean;
  onToggleStar: (scope: "ACTS" | "BILLS", key: string) => void;
  onOpenAlertDrawer: (alert: Alert) => void;
  onOpenBillDrawer: (bill: BillItem) => void;
}

export function FeedView({
  alerts,
  bills,
  isStarred,
  onToggleStar,
  onOpenAlertDrawer,
  onOpenBillDrawer,
}: FeedViewProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [feedType, setFeedType] = useState<"acts" | "bills">("acts");

  // Filter to show only items from the last year
  const oneYearAgo = getOneYearAgo();
  
  const filteredAlerts = alerts.filter((alert) => {
    const date = parseDate(alert.effective_date) || parseDate(alert.publication_date);
    return date && date >= oneYearAgo;
  });

  const filteredBills = bills.filter((bill) => {
    const date = new Date(bill.lastActionDate);
    return date >= oneYearAgo;
  });

  const itemsToShow = feedType === "acts" ? filteredAlerts : filteredBills;
  const itemCount = itemsToShow.length;

  return (
    <div className="space-y-6">
      <div className="bg-warning/10 border border-warning rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-warning">Política de Retención de Datos</p>
            <p className="text-sm text-muted-foreground mt-1">
              Los datos se retienen por un máximo de 1 año desde la fecha de alerta. Las alertas no destacadas
              con más de 1 año se eliminan automáticamente. Las alertas destacadas se retienen
              indefinidamente.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h3 className="text-lg font-semibold">
          {feedType === "acts" ? "Actos e Instrumentos" : "Proyectos de Ley"} (Historial de 1 Año)
        </h3>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={feedType === "acts" ? "default" : "outline"}
            size="sm"
            onClick={() => setFeedType("acts")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Actos
          </Button>
          <Button
            variant={feedType === "bills" ? "default" : "outline"}
            size="sm"
            onClick={() => setFeedType("bills")}
          >
            <Receipt className="h-4 w-4 mr-2" />
            Proyectos
          </Button>
          <div className="border-l mx-2"></div>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Mostrando {itemCount} elementos del último año</span>
        {feedType === "acts" && (
          <Badge variant="outline">
            {filteredAlerts.filter((a) => isStarred("ACTS", a.title_id)).length} destacados
          </Badge>
        )}
        {feedType === "bills" && (
          <Badge variant="outline">
            {filteredBills.filter((b) => isStarred("BILLS", b.id)).length} destacados
          </Badge>
        )}
      </div>

      {itemCount === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No se encontraron elementos en el último año</p>
          </CardContent>
        </Card>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-4"
          }
        >
          {feedType === "acts"
            ? filteredAlerts.map((alert) => (
                <AlertActCard
                  key={alert.title_id}
                  alert={alert}
                  isStarred={isStarred("ACTS", alert.title_id)}
                  onToggleStar={() => onToggleStar("ACTS", alert.title_id)}
                  onOpenDrawer={() => onOpenAlertDrawer(alert)}
                />
              ))
            : filteredBills.map((bill) => (
                <BillCard
                  key={bill.id}
                  bill={bill}
                  isStarred={isStarred("BILLS", bill.id)}
                  onToggleStar={() => onToggleStar("BILLS", bill.id)}
                  onOpenDrawer={() => onOpenBillDrawer(bill)}
                />
              ))}
        </div>
      )}
    </div>
  );
}
