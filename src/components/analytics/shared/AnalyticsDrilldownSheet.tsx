import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, ExternalLink, FileText, Scale, Shield } from "lucide-react";
import { ALL_MOCK_ALERTS, type PeruAlert } from "@/data/peruAlertsMockData";
import { getImpactColor, getLegislationTypeColor } from "@/lib/analyticsColors";
import { useClientUser } from "@/hooks/useClientUser";

interface DrilldownItem {
  id: string;
  title: string;
  type: string;
  date?: string;
  impact?: string;
  stage?: string;
  sourceUrl?: string;
}

interface AnalyticsDrilldownSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  alertIds: string[];
  /**
   * Optional: pass the actual alert objects so the drilldown does not need to
   * look them up in mock data. When provided, this takes precedence over
   * `alertIds` lookup against ALL_MOCK_ALERTS.
   */
  alertsData?: PeruAlert[];
  onAlertClick?: (alertId: string) => void;
}

/**
 * Drill-down sheet that shows the list of alerts that generated a chart/metric.
 * Opens from any clickable analytics element.
 * 
 * SECURITY: For client users, only published alerts are shown.
 */
export function AnalyticsDrilldownSheet({
  open,
  onOpenChange,
  title,
  description,
  alertIds,
  alertsData,
  onAlertClick,
}: AnalyticsDrilldownSheetProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const { isClientUser, clientId } = useClientUser();
  
  // Resolve alert objects: prefer live `alertsData` (real data), fall back to
  // mock lookup by ID for legacy callers.
  const alerts = React.useMemo(() => {
    const idSet = new Set(alertIds);
    const sourceAlerts: PeruAlert[] = alertsData
      ? alertsData.filter(a => idSet.has(a.id))
      : (alertIds
          .map(id => ALL_MOCK_ALERTS.find(a => a.id === id))
          .filter((a): a is PeruAlert => !!a));

    return sourceAlerts
      .filter((a) => {
        // SECURITY: Client users can only see published alerts for their client
        if (isClientUser) {
          if (a.status !== 'published') return false;
          if (clientId && a.client_id !== clientId && (a as any).primary_client_id !== clientId) return false;
        }
        return true;
      })
      .map(alert => ({
        id: alert.id,
        title: alert.legislation_title,
        type: alert.legislation_type === 'proyecto_de_ley' ? 'Proyecto de Ley' : 'Norma',
        date: (alert as any).project_date || (alert as any).publication_date || (alert as any).stage_date || (alert as any).created_at,
        impact: (alert as any).impact_level || (alert as any).impacto_categoria,
        stage: (alert as any).current_stage || (alert as any).estado_actual,
        sourceUrl: (alert as any).source_url || (alert as any).url,
      }));
  }, [alertIds, alertsData, isClientUser, clientId]);
  
  // Filter by search
  const filteredAlerts = React.useMemo(() => {
    if (!searchQuery) return alerts;
    const query = searchQuery.toLowerCase();
    return alerts.filter(a => 
      a.title.toLowerCase().includes(query) ||
      a.type.toLowerCase().includes(query) ||
      a.stage?.toLowerCase().includes(query)
    );
  }, [alerts, searchQuery]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader className="mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onOpenChange(false)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <SheetTitle className="text-lg">{title}</SheetTitle>
          </div>
          {description && (
            <p className="text-sm text-muted-foreground pl-10">{description}</p>
          )}
        </SheetHeader>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar alertas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Security notice for client users */}
        {isClientUser && (
          <div className="flex items-start gap-2 p-2 mb-4 rounded-lg bg-muted/30 border border-border/30">
            <Shield className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Solo se muestran alertas publicadas para su organización.
            </p>
          </div>
        )}
        
        {/* Count */}
        <div className="text-sm text-muted-foreground mb-4">
          {filteredAlerts.length} de {alerts.length} alertas
        </div>
        
        {/* List */}
        <ScrollArea className="h-[calc(100vh-220px)]">
          <div className="space-y-3 pr-4">
            {filteredAlerts.map((alert) => (
              <DrilldownAlertCard
                key={alert.id}
                alert={alert}
                onClick={() => onAlertClick?.(alert.id)}
              />
            ))}
            
            {filteredAlerts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No se encontraron alertas</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function DrilldownAlertCard({
  alert,
  onClick,
}: {
  alert: DrilldownItem;
  onClick?: () => void;
}) {
  const isBill = alert.type === 'Proyecto de Ley';
  const typeColor = getLegislationTypeColor(isBill ? 'bills' : 'regulations');
  const impactColor = alert.impact ? getImpactColor(alert.impact) : undefined;
  
  return (
    <div
      className="p-3 rounded-lg border border-border/50 bg-card/50 hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div 
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${typeColor}20` }}
        >
          {isBill ? (
            <Scale className="h-4 w-4" style={{ color: typeColor }} />
          ) : (
            <FileText className="h-4 w-4" style={{ color: typeColor }} />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-foreground line-clamp-2 mb-1">
            {alert.title}
          </h4>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Badge 
              variant="outline" 
              className="text-xs"
              style={{ 
                borderColor: typeColor,
                color: typeColor,
              }}
            >
              {alert.type}
            </Badge>
            
            {alert.impact && (
              <Badge 
                variant="outline" 
                className="text-xs capitalize"
                style={{ 
                  borderColor: impactColor,
                  color: impactColor,
                }}
              >
                {alert.impact}
              </Badge>
            )}
            
            {alert.stage && (
              <Badge variant="secondary" className="text-xs">
                {alert.stage}
              </Badge>
            )}
          </div>
          
          {alert.date && (
            <p className="text-xs text-muted-foreground mt-1">
              {alert.date}
            </p>
          )}
        </div>
        
        {alert.sourceUrl && (
          <a
            href={alert.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 p-1.5 rounded hover:bg-muted"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </a>
        )}
      </div>
    </div>
  );
}
