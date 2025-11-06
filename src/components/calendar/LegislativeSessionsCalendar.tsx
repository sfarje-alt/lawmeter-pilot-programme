import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar as CalendarIcon, Clock, Building2, Users, FileText, ChevronDown } from "lucide-react";
import { format, isSameDay, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
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

interface LegislativeSessionsCalendarProps {
  clientInterests?: string[]; // Areas de interés del cliente para filtrar
}

export function LegislativeSessionsCalendar({ clientInterests = [] }: LegislativeSessionsCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [filterOrganType, setFilterOrganType] = useState<string>("all");
  const [filterSessionType, setFilterSessionType] = useState<string>("all");

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

  // Obtener fechas con sesiones para resaltar en el calendario
  const datesWithSessions = filteredSessions.map((s) => s.date);

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
                className="ml-auto"
                onClick={() => {
                  setFilterOrganType("all");
                  setFilterSessionType("all");
                }}
              >
                Limpiar filtros
              </Button>
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
              }}
              modifiersClassNames={{
                hasSessions: "bg-blue-500/20 border-2 border-blue-500 text-blue-600 font-bold hover:bg-blue-500/30",
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {calendarView === "daily" && format(selectedDate, "d 'de' MMMM, yyyy", { locale: require('date-fns/locale/es') })}
            {calendarView === "weekly" && `Semana del ${format(startOfWeek(selectedDate), "d MMM")} - ${format(endOfWeek(selectedDate), "d MMM, yyyy")}`}
            {calendarView === "monthly" && format(selectedDate, "MMMM yyyy")}
          </CardTitle>
          <CardDescription>
            {selectedSessions.length} sesión{selectedSessions.length !== 1 ? "es" : ""} programada{selectedSessions.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            {selectedSessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No hay sesiones programadas</p>
              </div>
            ) : (
              <div className="space-y-4">
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
                          {format(session.date, "d 'de' MMM, yyyy 'a las' HH:mm", { locale: require('date-fns/locale/es') })}
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
