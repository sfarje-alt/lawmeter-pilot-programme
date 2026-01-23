import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReportAuditEntry } from "../types";
import { 
  Download, 
  Mail, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  Clock,
  FileText,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Step15Props {
  showHistory: boolean;
}

// Mock audit data
const MOCK_AUDIT_ENTRIES: ReportAuditEntry[] = [
  {
    id: '1',
    generatedAt: new Date().toISOString(),
    generatedBy: 'admin@lawmeter.pe',
    reportType: 'weekly',
    clientIds: ['client-1'],
    clientNames: ['FarmaSalud Perú S.A.C.'],
    filters: { dateMode: 'last_7', legislationStage: 'bills_and_enacted' },
    status: 'sent',
    channels: ['email'],
    alertCount: 12,
  },
  {
    id: '2',
    generatedAt: new Date(Date.now() - 86400000).toISOString(),
    generatedBy: 'admin@lawmeter.pe',
    reportType: 'daily',
    clientIds: ['client-2'],
    clientNames: ['Minera Andina Corp'],
    filters: { dateMode: 'today', legislationStage: 'only_bills' },
    status: 'downloaded',
    channels: ['download'],
    alertCount: 5,
  },
  {
    id: '3',
    generatedAt: new Date(Date.now() - 172800000).toISOString(),
    generatedBy: 'legal@lawmeter.pe',
    reportType: 'weekly',
    clientIds: ['client-1', 'client-3'],
    clientNames: ['FarmaSalud Perú S.A.C.', 'Banco del Pacífico'],
    filters: { dateMode: 'last_7', legislationStage: 'bills_and_enacted' },
    status: 'failed',
    channels: ['email', 'whatsapp'],
    alertCount: 0,
  },
];

const statusConfig = {
  sent: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Enviado' },
  downloaded: { icon: Download, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Descargado' },
  failed: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Fallido' },
  pending: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Pendiente' },
};

export function Step15AuditTrail({ showHistory }: Step15Props) {
  const [entries] = useState<ReportAuditEntry[]>(MOCK_AUDIT_ENTRIES);

  if (!showHistory) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Historial de Reportes</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Seleccione "Ver Historial" en el paso 2 para ver reportes anteriores
          </p>
        </div>
        <Card className="border-border/50">
          <CardContent className="p-6 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>El historial estará disponible después de generar reportes.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Historial de Reportes</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Reportes generados anteriormente
          </p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      <div className="space-y-3">
        {entries.map(entry => {
          const status = statusConfig[entry.status];
          const StatusIcon = status.icon;

          return (
            <Card key={entry.id} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {entry.reportType}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(entry.generatedAt), "PPP 'a las' p", { locale: es })}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {entry.clientNames.map(name => (
                        <Badge key={name} variant="secondary" className="text-xs">
                          {name}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{entry.alertCount} alertas</span>
                      <span>•</span>
                      <span>{entry.generatedBy}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {entry.channels.includes('email') && (
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      )}
                      {entry.channels.includes('whatsapp') && (
                        <Phone className="h-4 w-4 text-muted-foreground" />
                      )}
                      {entry.channels.includes('download') && (
                        <Download className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    
                    <Badge className={`${status.bg} ${status.color} border-0`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.label}
                    </Badge>

                    {entry.status === 'sent' || entry.status === 'downloaded' ? (
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
