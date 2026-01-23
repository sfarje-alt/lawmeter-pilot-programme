import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ReportConfig, DATE_MODE_OPTIONS, LEGISLATION_STAGE_OPTIONS } from "../types";
import { MOCK_CLIENTS, ALL_MOCK_ALERTS } from "@/data/peruAlertsMockData";
import { 
  Calendar, 
  Building2, 
  FileText, 
  Scale, 
  MessageSquare,
  BarChart3,
  Mail,
  Phone,
  Clock,
  CheckCircle2
} from "lucide-react";

interface Step14Props {
  config: ReportConfig;
  onUpdate: (updates: Partial<ReportConfig>) => void;
}

export function Step14PreviewConfirm({ config }: Step14Props) {
  const selectedClients = useMemo(() => 
    MOCK_CLIENTS.filter(c => config.clientIds.includes(c.id)),
    [config.clientIds]
  );

  const dateModeLabel = DATE_MODE_OPTIONS.find(d => d.value === config.dateMode)?.label || config.dateMode;
  const stageLabel = LEGISLATION_STAGE_OPTIONS.find(s => s.value === config.legislationStage)?.label || config.legislationStage;

  // Estimate alert count based on config
  const estimatedAlerts = useMemo(() => {
    return ALL_MOCK_ALERTS.filter(alert => {
      // Filter by legislation type
      if (config.legislationStage === 'only_bills' && alert.legislation_type !== 'proyecto_de_ley') return false;
      if (config.legislationStage === 'only_enacted' && alert.legislation_type !== 'norma') return false;
      
      // Filter by status
      if (alert.legislation_type === 'proyecto_de_ley' && config.billsStatuses.length > 0) {
        if (!config.billsStatuses.includes(alert.current_stage || '')) return false;
      }
      
      return true;
    }).length;
  }, [config]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Vista Previa y Confirmación</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Revise la configuración antes de generar el reporte
        </p>
      </div>

      {/* Summary Card */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Resumen del Reporte
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Clients */}
          <div className="flex items-start gap-3">
            <Building2 className="h-4 w-4 text-muted-foreground mt-1" />
            <div>
              <span className="text-sm font-medium">Clientes:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedClients.map(client => (
                  <Badge key={client.id} variant="secondary" className="text-xs">
                    {client.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Date Range */}
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <span className="text-sm font-medium">Período: </span>
              <span className="text-sm text-muted-foreground">{dateModeLabel}</span>
            </div>
          </div>

          {/* Content Type */}
          <div className="flex items-center gap-3">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div>
              <span className="text-sm font-medium">Contenido: </span>
              <span className="text-sm text-muted-foreground">{stageLabel}</span>
            </div>
          </div>

          {/* Bills statuses */}
          {config.billsStatuses.length > 0 && (
            <div className="flex items-start gap-3">
              <Scale className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <span className="text-sm font-medium">Estados: </span>
                <span className="text-sm text-muted-foreground">
                  {config.billsStatuses.length} estados seleccionados
                </span>
              </div>
            </div>
          )}

          <Separator className="bg-border/50" />

          {/* Options */}
          <div className="flex items-center gap-3">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-2">
              {config.includeExpertCommentary && (
                <Badge variant="outline" className="text-xs">Comentario Experto</Badge>
              )}
              {config.includeSessions && (
                <Badge variant="outline" className="text-xs">Sesiones</Badge>
              )}
              {config.includeAnalytics && (
                <Badge variant="outline" className="text-xs">Analytics</Badge>
              )}
            </div>
          </div>

          {/* Recipients */}
          {(config.emailRecipients.length > 0 || config.whatsappRecipients.length > 0) && (
            <>
              <Separator className="bg-border/50" />
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <span className="text-sm font-medium">Destinatarios:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {config.emailRecipients.map(email => (
                      <Badge key={email} variant="secondary" className="text-xs gap-1">
                        <Mail className="h-3 w-3" />
                        {email}
                      </Badge>
                    ))}
                    {config.whatsappRecipients.map(phone => (
                      <Badge key={phone} variant="secondary" className="text-xs gap-1">
                        <Phone className="h-3 w-3" />
                        {phone}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Schedule */}
          {config.action === 'schedule' && (
            <>
              <Separator className="bg-border/50" />
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-sm font-medium">Programación: </span>
                  <span className="text-sm text-muted-foreground">
                    {config.frequency === 'daily' ? 'Diario' : 'Semanal'} a las {config.scheduleTime}
                  </span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Estimated Content */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="font-medium">Contenido estimado</span>
            </div>
            <Badge variant="secondary" className="text-lg px-3">
              ~{estimatedAlerts} alertas
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            El reporte incluirá aproximadamente {estimatedAlerts} alertas legislativas basado en los filtros seleccionados.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
