import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, Download, Calendar, Clock, Eye, 
  CheckCircle2, AlertCircle, History, CalendarClock 
} from "lucide-react";
import { useClientUser } from "@/hooks/useClientUser";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";

// Mock report history
const MOCK_REPORT_HISTORY = [
  {
    id: "report-001",
    title: "Reporte Semanal - Semana 4",
    type: "weekly",
    periodStart: "2026-01-20",
    periodEnd: "2026-01-26",
    generatedAt: "2026-01-26T08:00:00Z",
    sentAt: "2026-01-26T08:05:00Z",
    status: "sent",
    alertCount: 12,
    pdfUrl: "#",
  },
  {
    id: "report-002",
    title: "Reporte Semanal - Semana 3",
    type: "weekly",
    periodStart: "2026-01-13",
    periodEnd: "2026-01-19",
    generatedAt: "2026-01-19T08:00:00Z",
    sentAt: "2026-01-19T08:05:00Z",
    status: "sent",
    alertCount: 8,
    pdfUrl: "#",
  },
  {
    id: "report-003",
    title: "Reporte Diario - 25 Enero",
    type: "daily",
    periodStart: "2026-01-25",
    periodEnd: "2026-01-25",
    generatedAt: "2026-01-25T18:00:00Z",
    sentAt: "2026-01-25T18:05:00Z",
    status: "sent",
    alertCount: 3,
    pdfUrl: "#",
  },
  {
    id: "report-004",
    title: "Reporte Diario - 24 Enero",
    type: "daily",
    periodStart: "2026-01-24",
    periodEnd: "2026-01-24",
    generatedAt: "2026-01-24T18:00:00Z",
    sentAt: "2026-01-24T18:05:00Z",
    status: "sent",
    alertCount: 5,
    pdfUrl: "#",
  },
];

// Mock scheduled reports
const MOCK_SCHEDULED_REPORTS = [
  {
    id: "scheduled-001",
    title: "Reporte Semanal",
    frequency: "weekly",
    nextRun: "2026-02-02T08:00:00Z",
    dayOfWeek: "Lunes",
    time: "08:00",
    channels: ["email"],
    isActive: true,
  },
  {
    id: "scheduled-002",
    title: "Reporte Diario",
    frequency: "daily",
    nextRun: "2026-01-27T18:00:00Z",
    time: "18:00",
    channels: ["email"],
    isActive: true,
  },
];

export function ClientReports() {
  const { clientName } = useClientUser();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30"><CheckCircle2 className="h-3 w-3 mr-1" />Enviado</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
      case "failed":
        return <Badge className="bg-red-500/20 text-red-500 border-red-500/30"><AlertCircle className="h-3 w-3 mr-1" />Error</Badge>;
      default:
        return null;
    }
  };

  const ReportCard = ({ report }: { report: typeof MOCK_REPORT_HISTORY[0] }) => (
    <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-all">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">{report.title}</span>
              {getStatusBadge(report.status)}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(report.periodStart), "dd MMM", { locale: es })} - {format(new Date(report.periodEnd), "dd MMM yyyy", { locale: es })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Enviado: {format(new Date(report.sentAt), "dd MMM, HH:mm", { locale: es })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {report.alertCount} alertas
              </Badge>
              <Badge variant="outline" className="text-xs">
                {report.type === "weekly" ? "Semanal" : "Diario"}
              </Badge>
            </div>
          </div>

          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ScheduledCard = ({ schedule }: { schedule: typeof MOCK_SCHEDULED_REPORTS[0] }) => (
    <Card className="bg-card/50 border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">{schedule.title}</span>
              {schedule.isActive ? (
                <Badge className="bg-green-500/20 text-green-500 border-green-500/30 text-xs">Activo</Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">Pausado</Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>
                {schedule.frequency === "weekly" 
                  ? `Cada ${schedule.dayOfWeek} a las ${schedule.time}`
                  : `Diario a las ${schedule.time}`
                }
              </span>
            </div>

            <div className="text-xs text-muted-foreground">
              Próxima ejecución: {format(new Date(schedule.nextRun), "EEEE dd MMM, HH:mm", { locale: es })}
            </div>
          </div>

          <Badge variant="outline" className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            Solo Lectura
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reportes</h1>
          <p className="text-muted-foreground">
            Historial y programación de reportes para {clientName || "tu organización"}
          </p>
        </div>
        <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-500">
          <Eye className="h-3 w-3 mr-1" />
          Solo Lectura
        </Badge>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="history">
        <TabsList className="bg-muted/30">
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            Historial
            <Badge variant="secondary">{MOCK_REPORT_HISTORY.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="gap-2">
            <CalendarClock className="h-4 w-4" />
            Programados
            <Badge variant="secondary">{MOCK_SCHEDULED_REPORTS.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="mt-6 space-y-4">
          <Card className="bg-muted/20 border-dashed">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                Aquí encontrarás todos los reportes generados y enviados a tu equipo. 
                Puedes descargar cualquier reporte en formato PDF.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {MOCK_REPORT_HISTORY.map(report => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="mt-6 space-y-4">
          <Card className="bg-muted/20 border-dashed">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                La configuración de reportes programados es gestionada por tu equipo legal en LawMeter.
                Contacta a tu representante para solicitar cambios.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {MOCK_SCHEDULED_REPORTS.map(schedule => (
              <ScheduledCard key={schedule.id} schedule={schedule} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
