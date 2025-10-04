import { Alert, BillItem, FilterState } from "@/types/legislation";
import { AlertActCard } from "@/components/acts/AlertActCard";
import { BillCard } from "@/components/bills/BillCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Grid, List } from "lucide-react";
import { useState } from "react";
import { getOneYearAgo, parseDate } from "@/lib/dateUtils";

interface FeedViewProps {
  alerts: Alert[];
  bills: BillItem[];
  type: "acts" | "bills";
  isStarred: (scope: "ACTS" | "BILLS", key: string) => boolean;
  onToggleStar: (scope: "ACTS" | "BILLS", key: string) => void;
  onOpenAlertDrawer: (alert: Alert) => void;
  onOpenBillDrawer: (bill: BillItem) => void;
}

export function FeedView({
  alerts,
  bills,
  type,
  isStarred,
  onToggleStar,
  onOpenAlertDrawer,
  onOpenBillDrawer,
}: FeedViewProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Filter to show only items from the last year
  const oneYearAgo = getOneYearAgo();
  
  const filteredAlerts = alerts.filter((alert) => {
    const date = parseDate(alert.effective_date) || parseDate(alert.registered_date);
    return date && date >= oneYearAgo;
  });

  const filteredBills = bills.filter((bill) => {
    const date = new Date(bill.lastActionDate);
    return date >= oneYearAgo;
  });

  const itemsToShow = type === "acts" ? filteredAlerts : filteredBills;

  return (
    <div className="space-y-6">
      <div className="bg-warning/10 border border-warning rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-warning">Data Retention Policy</p>
            <p className="text-sm text-muted-foreground mt-1">
              Data is retained for a maximum of 1 year from the alert date. Non-starred alerts
              older than 1 year are automatically purged. Starred alerts are retained
              indefinitely.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {type === "acts" ? "Acts & Instruments Feed" : "Bills Feed"} (1 Year History)
        </h3>
        <div className="flex gap-2">
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
        <span>Showing {itemsToShow.length} items from the last year</span>
        {type === "acts" && (
          <Badge variant="outline">
            {filteredAlerts.filter((a) => isStarred("ACTS", a.title_id)).length} starred
          </Badge>
        )}
        {type === "bills" && (
          <Badge variant="outline">
            {filteredBills.filter((b) => isStarred("BILLS", b.id)).length} starred
          </Badge>
        )}
      </div>

      {itemsToShow.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No items found in the last year</p>
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
          {type === "acts"
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
