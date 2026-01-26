import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Eye, Scale, FileText, AlertTriangle } from "lucide-react";
import { useClientUser } from "@/hooks/useClientUser";
import { ALL_MOCK_ALERTS, IMPACT_LEVELS, PeruAlert } from "@/data/peruAlertsMockData";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  addMonths,
  subMonths,
  getDay,
  startOfWeek,
  endOfWeek
} from "date-fns";
import { es } from "date-fns/locale";

export function ClientCalendar() {
  const { clientId, clientName } = useClientUser();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Filter only published alerts for this client
  const clientAlerts = useMemo(() => {
    return ALL_MOCK_ALERTS.filter(alert => 
      alert.status === "published" && 
      (alert.client_id === clientId || alert.primary_client_id === clientId)
    );
  }, [clientId]);

  // Group alerts by date
  const alertsByDate = useMemo(() => {
    const map = new Map<string, PeruAlert[]>();
    clientAlerts.forEach(alert => {
      const dateStr = alert.stage_date || alert.publication_date || alert.project_date;
      if (dateStr) {
        const key = format(new Date(dateStr), "yyyy-MM-dd");
        const existing = map.get(key) || [];
        map.set(key, [...existing, alert]);
      }
    });
    return map;
  }, [clientAlerts]);

  // Get alerts for selected date
  const selectedDateAlerts = useMemo(() => {
    if (!selectedDate) return [];
    const key = format(selectedDate, "yyyy-MM-dd");
    return alertsByDate.get(key) || [];
  }, [selectedDate, alertsByDate]);

  // Calendar days
  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const getImpactBadge = (level?: string) => {
    const impact = IMPACT_LEVELS.find(i => i.value === level);
    if (!impact) return null;
    return <Badge className={`${impact.color} text-xs`}>{impact.label}</Badge>;
  };

  const getDayAlerts = (day: Date) => {
    const key = format(day, "yyyy-MM-dd");
    return alertsByDate.get(key) || [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendario</h1>
          <p className="text-muted-foreground">
            Fechas importantes de alertas para {clientName || "tu organización"}
          </p>
        </div>
        <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-500">
          <Eye className="h-3 w-3 mr-1" />
          Solo Lectura
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                {format(currentDate, "MMMM yyyy", { locale: es })}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Hoy
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Week headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(day => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, idx) => {
                const dayAlerts = getDayAlerts(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());
                const hasHighImpact = dayAlerts.some(a => a.impact_level === "grave" || a.impact_level === "medio");

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      relative h-16 p-1 rounded-lg text-sm transition-all
                      ${!isCurrentMonth ? "text-muted-foreground/50" : "text-foreground"}
                      ${isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted/50"}
                      ${isToday && !isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}
                    `}
                  >
                    <span className="block">{format(day, "d")}</span>
                    {dayAlerts.length > 0 && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {hasHighImpact && (
                          <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        )}
                        {dayAlerts.length > 0 && (
                          <div className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-primary-foreground" : "bg-primary"}`} />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-primary" />
                Alertas
              </span>
              <span className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                Alto Impacto
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Details */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {selectedDate 
                ? format(selectedDate, "EEEE, dd MMMM", { locale: es })
                : "Selecciona una fecha"
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              selectedDateAlerts.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateAlerts.map(alert => (
                    <Card key={alert.id} className="bg-muted/30">
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-start gap-2">
                          {alert.legislation_type === "proyecto_de_ley" ? (
                            <Scale className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                          ) : (
                            <FileText className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                          )}
                          <span className="text-sm font-medium line-clamp-2">
                            {alert.legislation_title}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          {alert.legislation_id && (
                            <Badge variant="outline" className="text-xs">
                              {alert.legislation_id}
                            </Badge>
                          )}
                          {getImpactBadge(alert.impact_level)}
                        </div>

                        {alert.current_stage && (
                          <Badge variant="secondary" className="text-xs">
                            {alert.current_stage}
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No hay alertas para esta fecha</p>
                </div>
              )
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Selecciona una fecha en el calendario</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
