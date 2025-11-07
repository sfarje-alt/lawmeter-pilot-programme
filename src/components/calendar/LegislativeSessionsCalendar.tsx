import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar as CalendarIcon, Clock, Building2, Users, FileText, ChevronDown, Scale } from "lucide-react";
import { format, isSameDay, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LegislativeSession {
  date: Date;
  sessionNumber: string;
  time: string;
  organType: string; // "PLENARIO", "ESPECIAL", "PERMANENTE ESPECIAL", "PERMANENTE ORDINARIA"
  organName: string;
  sessionType: string; // "ORDINARIA", "EXTRAORDINARIA"
  status: string; // "PENDIENTE", "REALIZADA", "CANCELADA"
  agenda?: string[];
}

interface EffectiveDate {
  date: Date;
  lawName: string;
  lawNumber: string;
  type: "efectiva" | "vigencia" | "plazo";
  description?: string;
  riskLevel: "high" | "medium" | "low";
  alertId: string;
}

interface LegislativeSessionsCalendarProps {
  alerts?: any[]; // Alertas de legislaciones
  clientInterests?: string[];
  onNavigateToAlert?: (alertId: string) => void;
}

export function LegislativeSessionsCalendar({ alerts = [], clientInterests = [], onNavigateToAlert }: LegislativeSessionsCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [filterOrganType, setFilterOrganType] = useState<string>("all");
  const [filterSessionType, setFilterSessionType] = useState<string>("all");
  const [showEffectiveDates, setShowEffectiveDates] = useState<boolean>(true);

  // Generar fechas de vigencia y plazos desde las alertas reales
  const generateEffectiveDates = (): EffectiveDate[] => {
    if (!alerts || alerts.length === 0) return [];
    
    const vigencias = alerts
      .filter(alert => alert.effective_date)
      .map(alert => {
        // Parsear la fecha de vigencia (formato puede ser DD/MM/YYYY o YYYY-MM-DD)
        let effectiveDate: Date;
        const dateStr = alert.effective_date;
        
        try {
          // Intentar parsear como DD/MM/YYYY
          if (dateStr.includes('/')) {
            const [day, month, year] = dateStr.split('/');
            effectiveDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          } else {
            // Intentar parsear como ISO
            effectiveDate = parseISO(dateStr);
          }
        } catch {
          effectiveDate = new Date();
        }
        
        return {
          date: effectiveDate,
          lawName: alert.title || alert.law_number || "Sin título",
          lawNumber: alert.law_number || alert.title_id || "",
          type: "efectiva" as const,
          riskLevel: alert.AI_triage?.risk_level || "low",
          alertId: alert.title_id,
          description: alert.AI_triage?.summary?.substring(0, 150)
        };
      })
      .filter(ed => !isNaN(ed.date.getTime())); // Filtrar fechas inválidas

    // Generar plazos de cumplimiento desde AI_triage.deadline_detected
    const plazos = alerts
      .filter(alert => alert.AI_triage?.deadline_detected)
      .map(alert => {
        let deadlineDate: Date;
        const dateStr = alert.AI_triage.deadline_detected;
        
        try {
          // Intentar parsear como DD/MM/YYYY
          if (dateStr.includes('/')) {
            const [day, month, year] = dateStr.split('/');
            deadlineDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          } else {
            // Intentar parsear como ISO
            deadlineDate = parseISO(dateStr);
          }
        } catch {
          deadlineDate = new Date();
        }
        
        return {
          date: deadlineDate,
          lawName: alert.title || alert.law_number || "Sin título",
          lawNumber: alert.law_number || alert.title_id || "",
          type: "plazo" as const,
          riskLevel: alert.AI_triage?.risk_level || "low",
          alertId: alert.title_id,
          description: alert.AI_triage?.summary?.substring(0, 150)
        };
      })
      .filter(ed => !isNaN(ed.date.getTime())); // Filtrar fechas inválidas

    return [...vigencias, ...plazos];
  };

  // Datos de ejemplo basados en la imagen
  const generateMockSessions = (): LegislativeSession[] => {
    return [
      {
        date: parseISO("2025-11-04T14:45:00"),
        sessionNumber: "",
        time: "14:45",
        organType: "PLENARIO",
        organName: "PLENARIO",
        sessionType: "ORDINARIA",
        status: "PENDIENTE",
        agenda: ["Proyecto de Ley Regulación Fintech 2025"]
      },
      {
        date: parseISO("2025-11-03T18:05:00"),
        sessionNumber: "",
        time: "18:05",
        organType: "ESPECIAL",
        organName: "COMISIÓN ESP. DE LA PROVINCIA DE GUANACASTE, ENCARGADA DE ANÁLISIS, INVESTIGACIÓN...",
        sessionType: "ORDINARIA",
        status: "PENDIENTE",
        agenda: ["Análisis de proyectos regionales"]
      },
      {
        date: parseISO("2025-11-02T18:05:00"),
        sessionNumber: "",
        time: "18:05",
        organType: "ESPECIAL",
        organName: "COMISIÓN ESPECIAL DE LA PROVINCIA DE ALAJUELA, QUE SE ENCARGARÁ DEL ANÁLISIS, INVEST...",
        sessionType: "ORDINARIA",
        status: "PENDIENTE",
      },
      {
        date: parseISO("2025-10-31T09:00:00"),
        sessionNumber: "18",
        time: "9:00",
        organType: "PERMANENTE ESPECIAL",
        organName: "DE AMBIENTE",
        sessionType: "EXTRAORDINARIA",
        status: "PENDIENTE",
        agenda: ["Ley de Cambio Climático", "Regulaciones Ambientales Bancarias"]
      },
      {
        date: parseISO("2025-10-30T08:00:00"),
        sessionNumber: "91",
        time: "8:00",
        organType: "ESPECIAL",
        organName: "COMISIÓN ESPECIAL DE LA PROVINCIA DE LIMÓN, QUE ESTARÁ ENCARGADA DEL ANÁLISIS, INVES...",
        sessionType: "EXTRAORDINARIA",
        status: "PENDIENTE",
      },
      {
        date: parseISO("2025-10-30T13:15:00"),
        sessionNumber: "13",
        time: "13:15",
        organType: "PERMANENTE ESPECIAL",
        organName: "DE ASUNTOS MUNICIPALES Y DESARROLLO LOCAL PARTICIPATIVO",
        sessionType: "ORDINARIA",
        status: "PENDIENTE",
      },
      {
        date: parseISO("2025-10-30T07:30:00"),
        sessionNumber: "14",
        time: "7:30",
        organType: "PERMANENTE ESPECIAL",
        organName: "DE LA MUJER",
        sessionType: "EXTRAORDINARIA",
        status: "PENDIENTE",
      },
      {
        date: parseISO("2025-10-30T08:00:00"),
        sessionNumber: "36",
        time: "8:00",
        organType: "PERMANENTE ESPECIAL",
        organName: "DE SEGURIDAD Y NARCOTRÁFICO",
        sessionType: "EXTRAORDINARIA",
        status: "PENDIENTE",
      },
      {
        date: parseISO("2025-10-30T09:00:00"),
        sessionNumber: "37",
        time: "9:00",
        organType: "PERMANENTE ESPECIAL",
        organName: "DE SEGURIDAD Y NARCOTRÁFICO",
        sessionType: "ORDINARIA",
        status: "CANCELADA",
      },
      {
        date: parseISO("2025-10-30T13:15:00"),
        sessionNumber: "13",
        time: "13:15",
        organType: "PERMANENTE ESPECIAL",
        organName: "DE DERECHOS HUMANOS",
        sessionType: "ORDINARIA",
        status: "PENDIENTE",
      },
      {
        date: parseISO("2025-10-30T13:00:00"),
        sessionNumber: "24",
        time: "13:00",
        organType: "PERMANENTE ESPECIAL",
        organName: "DE CONTROL DE INGRESO Y GASTO PÚBLICO",
        sessionType: "ORDINARIA",
        status: "PENDIENTE",
        agenda: ["Presupuesto Nacional 2026", "Regulaciones Fiscales Sector Financiero"]
      },
      {
        date: parseISO("2025-10-30T13:15:00"),
        sessionNumber: "15",
        time: "13:15",
        organType: "PERMANENTE ESPECIAL",
        organName: "DE CIENCIA Y TECNOLOGÍA Y EDUCACIÓN",
        sessionType: "ORDINARIA",
        status: "PENDIENTE",
      },
      {
        date: parseISO("2025-10-30T09:00:00"),
        sessionNumber: "",
        time: "9:00",
        organType: "PLENARIO",
        organName: "PLENARIO",
        sessionType: "EXTRAORDINARIA",
        status: "PENDIENTE",
        agenda: ["Votaciones de proyectos pendientes", "Ley Fintech"]
      },
      {
        date: parseISO("2025-10-30T14:45:00"),
        sessionNumber: "",
        time: "14:45",
        organType: "PLENARIO",
        organName: "PLENARIO",
        sessionType: "ORDINARIA",
        status: "PENDIENTE",
      },
      {
        date: parseISO("2025-10-29T18:05:00"),
        sessionNumber: "13",
        time: "18:05",
        organType: "PERMANENTE ESPECIAL",
        organName: "DE NOMBRAMIENTOS",
        sessionType: "EXTRAORDINARIA",
        status: "PENDIENTE",
      },
      {
        date: parseISO("2025-10-29T18:05:00"),
        sessionNumber: "14",
        time: "18:05",
        organType: "PERMANENTE ESPECIAL",
        organName: "DE CIENCIA Y TECNOLOGÍA Y EDUCACIÓN",
        sessionType: "EXTRAORDINARIA",
        status: "PENDIENTE",
      },
      {
        date: parseISO("2025-10-29T12:06:00"),
        sessionNumber: "22",
        time: "12:06",
        organType: "PERMANENTE ESPECIAL",
        organName: "DE REDACCIÓN",
        sessionType: "ORDINARIA",
        status: "REALIZADA",
      },
      {
        date: parseISO("2025-10-29T13:15:00"),
        sessionNumber: "51",
        time: "13:15",
        organType: "PERMANENTE ORDINARIA",
        organName: "ASUNTOS HACENDARIOS",
        sessionType: "ORDINARIA",
        status: "PENDIENTE",
        agenda: ["Regulación Financiera", "Impuestos al Sector Bancario", "Ley Fintech"]
      },
      {
        date: parseISO("2025-10-29T13:15:00"),
        sessionNumber: "14",
        time: "13:15",
        organType: "PERMANENTE ORDINARIA",
        organName: "DE ASUNTOS AGROPECUARIOS",
        sessionType: "ORDINARIA",
        status: "CANCELADA",
      },
      {
        date: parseISO("2025-10-29T13:15:00"),
        sessionNumber: "27",
        time: "13:15",
        organType: "PERMANENTE ORDINARIA",
        organName: "DE ASUNTOS SOCIALES",
        sessionType: "ORDINARIA",
        status: "PENDIENTE",
      },
      {
        date: parseISO("2025-10-29T13:15:00"),
        sessionNumber: "37",
        time: "13:15",
        organType: "PERMANENTE ORDINARIA",
        organName: "DE GOBIERNO Y ADMINISTRACIÓN",
        sessionType: "ORDINARIA",
        status: "PENDIENTE",
      },
      {
        date: parseISO("2025-10-29T12:05:00"),
        sessionNumber: "37",
        time: "12:05",
        organType: "PERMANENTE ORDINARIA",
        organName: "DE ASUNTOS ECONÓMICOS",
        sessionType: "EXTRAORDINARIA",
        status: "PENDIENTE",
        agenda: ["Regulación Fintech", "Competencia en Sector Financiero", "Protección al Consumidor Financiero"]
      },
    ];
  };

  const sessions = generateMockSessions();
  const effectiveDates = generateEffectiveDates();

  // Filtrar sesiones según los filtros seleccionados
  const getFilteredSessions = () => {
    return sessions.filter(session => {
      if (filterOrganType !== "all" && session.organType !== filterOrganType) {
        return false;
      }
      if (filterSessionType !== "all" && session.sessionType !== filterSessionType) {
        return false;
      }
      return true;
    });
  };

  const filteredSessions = getFilteredSessions();

  // Obtener sesiones para la fecha o rango seleccionado
  const getSessionsForDate = (date: Date): LegislativeSession[] => {
    if (calendarView === "daily") {
      return filteredSessions.filter((session) => isSameDay(session.date, date));
    } else if (calendarView === "weekly") {
      const weekStart = startOfWeek(date);
      const weekEnd = endOfWeek(date);
      return filteredSessions.filter((session) => session.date >= weekStart && session.date <= weekEnd);
    } else {
      // monthly
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      return filteredSessions.filter((session) => session.date >= monthStart && session.date <= monthEnd);
    }
  };

  const selectedSessions = getSessionsForDate(selectedDate);

  // Obtener fechas de vigencia para el rango seleccionado
  const getEffectiveDatesForDate = (date: Date): EffectiveDate[] => {
    if (!showEffectiveDates) return [];
    
    if (calendarView === "daily") {
      return effectiveDates.filter((ed) => isSameDay(ed.date, date));
    } else if (calendarView === "weekly") {
      const weekStart = startOfWeek(date);
      const weekEnd = endOfWeek(date);
      return effectiveDates.filter((ed) => ed.date >= weekStart && ed.date <= weekEnd);
    } else {
      // monthly
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      return effectiveDates.filter((ed) => ed.date >= monthStart && ed.date <= monthEnd);
    }
  };

  const selectedEffectiveDates = getEffectiveDatesForDate(selectedDate);

  // Obtener fechas con sesiones y fechas de vigencia para resaltar en el calendario
  const datesWithSessions = filteredSessions.map((s) => s.date);
  const datesWithEffectiveDates = showEffectiveDates ? effectiveDates.map((ed) => ed.date) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "REALIZADA":
        return "text-green-600 border-green-600";
      case "CANCELADA":
        return "text-red-600 border-red-600";
      default:
        return "text-blue-600 border-blue-600";
    }
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "REALIZADA":
        return "default";
      case "CANCELADA":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getOrganIcon = (organType: string) => {
    switch (organType) {
      case "PLENARIO":
        return <Users className="w-4 h-4" />;
      case "ESPECIAL":
        return <Building2 className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Calendario de Sesiones de la Asamblea Legislativa
                </CardTitle>
                <CardDescription>
                  Programación de sesiones y agenda legislativa
                </CardDescription>
              </div>
              <Tabs value={calendarView} onValueChange={(v) => setCalendarView(v as typeof calendarView)}>
                <TabsList>
                  <TabsTrigger value="daily">Diario</TabsTrigger>
                  <TabsTrigger value="weekly">Semanal</TabsTrigger>
                  <TabsTrigger value="monthly">Mensual</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Filtros */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t">
              <span className="text-sm font-medium text-muted-foreground">Filtrar por:</span>
              
              <Select value={filterOrganType} onValueChange={setFilterOrganType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Tipo de órgano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los órganos</SelectItem>
                  <SelectItem value="PLENARIO">Plenario</SelectItem>
                  <SelectItem value="ESPECIAL">Comisión Especial</SelectItem>
                  <SelectItem value="PERMANENTE ESPECIAL">Permanente Especial</SelectItem>
                  <SelectItem value="PERMANENTE ORDINARIA">Permanente Ordinaria</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterSessionType} onValueChange={setFilterSessionType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de sesión" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las sesiones</SelectItem>
                  <SelectItem value="ORDINARIA">Ordinaria</SelectItem>
                  <SelectItem value="EXTRAORDINARIA">Extraordinaria</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setFilterOrganType("all");
                  setFilterSessionType("all");
                }}
              >
                Limpiar filtros
              </Button>

              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant={showEffectiveDates ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowEffectiveDates(!showEffectiveDates)}
                  className="flex items-center gap-2"
                >
                  <Scale className="w-4 h-4" />
                  {showEffectiveDates ? "Ocultar" : "Mostrar"} vigencias
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex justify-center p-8">
          <div className="w-full max-w-2xl">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className={cn("rounded-md border pointer-events-auto w-full")}
              classNames={{
                caption_label: "text-2xl font-semibold",
                head_cell: "text-muted-foreground rounded-md w-16 font-medium text-lg",
                row: "flex w-full mt-3",
                cell: "h-16 w-16 p-0 text-center align-middle",
                day: cn(buttonVariants({ variant: "ghost" }), "h-16 w-16 p-0 font-semibold text-2xl flex items-center justify-center aria-selected:opacity-100"),
                day_selected: "bg-primary text-primary-foreground hover:bg-primary focus:bg-primary rounded-md",
              }}
              modifiers={{
                hasSessions: datesWithSessions,
                hasEffectiveDates: datesWithEffectiveDates,
              }}
              modifiersClassNames={{
                hasSessions: "bg-blue-500/20 border-2 border-blue-500 text-blue-600 font-bold hover:bg-blue-500/30",
                hasEffectiveDates: "bg-purple-500/20 border-2 border-purple-500 text-purple-600 font-bold hover:bg-purple-500/30",
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {calendarView === "daily" && format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })}
            {calendarView === "weekly" && `Semana del ${format(startOfWeek(selectedDate), "d MMM", { locale: es })} - ${format(endOfWeek(selectedDate), "d MMM, yyyy", { locale: es })}`}
            {calendarView === "monthly" && format(selectedDate, "MMMM yyyy", { locale: es })}
          </CardTitle>
          <CardDescription>
            {selectedSessions.length} sesión{selectedSessions.length !== 1 ? "es" : ""} programada{selectedSessions.length !== 1 ? "s" : ""}
            {showEffectiveDates && selectedEffectiveDates.length > 0 && (
              <> • {selectedEffectiveDates.length} norma{selectedEffectiveDates.length !== 1 ? "s" : ""} vigente{selectedEffectiveDates.length !== 1 ? "s" : ""}</>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            {selectedSessions.length === 0 && selectedEffectiveDates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No hay sesiones ni normas vigentes</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Fechas de vigencia */}
                {selectedEffectiveDates
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map((effectiveDate, index) => {
                    const getRiskColor = (level: string) => {
                      switch (level) {
                        case "high": return "bg-red-500";
                        case "medium": return "bg-yellow-500";
                        case "low": return "bg-green-500";
                        default: return "bg-gray-500";
                      }
                    };

                    return (
                      <div
                        key={`effective-${index}`}
                        onClick={() => effectiveDate.alertId && onNavigateToAlert?.(effectiveDate.alertId)}
                        className={cn(
                          "p-4 rounded-lg border-l-4 hover:shadow-md transition-shadow",
                          effectiveDate.type === "plazo" 
                            ? "border-orange-600 bg-orange-50 dark:bg-orange-950/20" 
                            : "border-purple-600 bg-purple-50 dark:bg-purple-950/20",
                          effectiveDate.alertId && onNavigateToAlert && "cursor-pointer",
                          effectiveDate.type === "plazo" 
                            ? "hover:bg-orange-100 dark:hover:bg-orange-900/30" 
                            : "hover:bg-purple-100 dark:hover:bg-purple-900/30"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "mt-1 flex items-center gap-2",
                            effectiveDate.type === "plazo" ? "text-orange-600" : "text-purple-600"
                          )}>
                            {effectiveDate.type === "plazo" ? (
                              <Clock className="w-4 h-4" />
                            ) : (
                              <Scale className="w-4 h-4" />
                            )}
                            <div 
                              className={cn(
                                "w-3 h-3 rounded-full",
                                getRiskColor(effectiveDate.riskLevel)
                              )}
                              title={`Riesgo ${effectiveDate.riskLevel === "high" ? "alto" : effectiveDate.riskLevel === "medium" ? "medio" : "bajo"}`}
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <h4 className={cn(
                              "font-semibold text-sm",
                              effectiveDate.type === "plazo" 
                                ? "text-orange-900 dark:text-orange-100" 
                                : "text-purple-900 dark:text-purple-100"
                            )}>
                              {effectiveDate.lawName}
                            </h4>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className={cn(
                                "text-xs",
                                effectiveDate.type === "plazo" 
                                  ? "border-orange-600 text-orange-600" 
                                  : "border-purple-600 text-purple-600"
                              )}>
                                {effectiveDate.lawNumber}
                              </Badge>
                              <Badge 
                                variant={effectiveDate.type === "efectiva" ? "default" : "secondary"} 
                                className={cn(
                                  "text-xs",
                                  effectiveDate.type === "plazo"
                                    ? "bg-orange-600 text-white hover:bg-orange-700"
                                    : effectiveDate.type === "efectiva" 
                                      ? "bg-purple-600 text-white hover:bg-purple-700" 
                                      : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                                )}
                              >
                                {effectiveDate.type === "plazo" ? "Plazo de cumplimiento" : effectiveDate.type === "efectiva" ? "Entra en vigor" : "Vigente"}
                              </Badge>
                            </div>
                            {effectiveDate.description && (
                              <p className="text-xs text-muted-foreground mt-2">
                                {effectiveDate.description}
                              </p>
                            )}
                            <div className={cn(
                              "flex items-center gap-1 text-xs",
                              effectiveDate.type === "plazo" ? "text-orange-600" : "text-purple-600"
                            )}>
                              <CalendarIcon className="w-3 h-3" />
                              {format(effectiveDate.date, "d 'de' MMMM, yyyy", { locale: es })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {/* Sesiones legislativas */}
                {selectedSessions
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map((session, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-4 rounded-lg border-l-4 bg-card hover:shadow-md transition-shadow",
                      getStatusColor(session.status)
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("mt-1", getStatusColor(session.status))}>
                        {getOrganIcon(session.organType)}
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="font-semibold text-sm">
                          {session.organName}
                        </h4>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {session.organType}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {session.sessionType}
                          </Badge>
                          <Badge
                            variant={getStatusBadgeVariant(session.status)}
                            className="text-xs"
                          >
                            {session.status}
                          </Badge>
                          {session.sessionNumber && (
                            <Badge variant="outline" className="text-xs">
                              Sesión #{session.sessionNumber}
                            </Badge>
                          )}
                        </div>
                        {session.agenda && session.agenda.length > 0 && (
                          <div className="mt-2 pt-2 border-t">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Agenda:</p>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {session.agenda.map((item, i) => (
                                <li key={i} className="flex items-start gap-1">
                                  <ChevronDown className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {format(session.date, "d 'de' MMM, yyyy 'a las' HH:mm", { locale: es })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Tabla resumen de todas las sesiones */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Lista completa de sesiones</CardTitle>
          <CardDescription>
            Todas las sesiones programadas en la Asamblea Legislativa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo de órgano</TableHead>
                  <TableHead>Órgano legislativo</TableHead>
                  <TableHead>Fecha sesión</TableHead>
                  <TableHead>Sesión n.º</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Tipo sesión</TableHead>
                  <TableHead>Estado sesión</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedSessions
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map((session, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{session.organType}</TableCell>
                    <TableCell className="max-w-[300px] truncate" title={session.organName}>
                      {session.organName}
                    </TableCell>
                    <TableCell>{format(session.date, "dd/MM/yyyy")}</TableCell>
                    <TableCell>{session.sessionNumber || "-"}</TableCell>
                    <TableCell>{session.time}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {session.sessionType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(session.status)} className="text-xs">
                        {session.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
