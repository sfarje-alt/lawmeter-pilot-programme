import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_CLIENTS } from "@/data/peruAlertsMockData";
import { Calendar, Clock, Building2, CheckCircle2, AlertCircle } from "lucide-react";
import { format, addDays, startOfWeek, addWeeks } from "date-fns";
import { es } from "date-fns/locale";

// Mock scheduled reports
const MOCK_SCHEDULED_REPORTS = [
  {
    clientId: 'client-1',
    clientName: 'FarmaSalud Perú S.A.C.',
    frequency: 'weekly' as const,
    weeklyDay: 1,
    time: '08:00',
    nextRun: addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 7),
    status: 'active',
  },
  {
    clientId: 'client-2',
    clientName: 'Minera Andina Corp',
    frequency: 'daily' as const,
    time: '07:00',
    nextRun: addDays(new Date(), 1),
    status: 'active',
  },
];

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function ReportScheduleDashboard() {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weeks = [0, 1, 2, 3].map(w => {
    const start = addWeeks(weekStart, w);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  });

  // Get reports for a specific date
  const getReportsForDate = (date: Date) => {
    return MOCK_SCHEDULED_REPORTS.filter(report => {
      if (report.frequency === 'daily') return true;
      if (report.frequency === 'weekly') {
        return date.getDay() === report.weeklyDay;
      }
      return false;
    });
  };

  const activeCount = MOCK_SCHEDULED_REPORTS.filter(r => r.status === 'active').length;
  const pendingCount = MOCK_CLIENTS.length - MOCK_SCHEDULED_REPORTS.length;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-foreground">{MOCK_SCHEDULED_REPORTS.length}</div>
            <div className="text-sm text-muted-foreground">Reportes Programados</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-emerald-400">{activeCount}</div>
            <div className="text-sm text-muted-foreground">Activos</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-400">
              {MOCK_SCHEDULED_REPORTS.filter(r => r.frequency === 'daily').length}
            </div>
            <div className="text-sm text-muted-foreground">Diarios</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-purple-400">
              {MOCK_SCHEDULED_REPORTS.filter(r => r.frequency === 'weekly').length}
            </div>
            <div className="text-sm text-muted-foreground">Semanales</div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar View */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendario de Envíos (Próximas 4 semanas)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Header */}
            <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-muted-foreground">
              {WEEKDAYS.map(day => (
                <div key={day}>{day}</div>
              ))}
            </div>

            {/* Weeks */}
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-2">
                {week.map((date, dayIndex) => {
                  const reports = getReportsForDate(date);
                  const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
                  const isPast = date < today;

                  return (
                    <div
                      key={dayIndex}
                      className={`min-h-[80px] p-2 rounded-lg border ${
                        isToday 
                          ? 'border-primary bg-primary/5' 
                          : isPast
                            ? 'border-border/30 bg-muted/30 opacity-50'
                            : 'border-border/50'
                      }`}
                    >
                      <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : 'text-foreground'}`}>
                        {format(date, 'd')}
                      </div>
                      <div className="space-y-1">
                        {reports.slice(0, 2).map((report, i) => (
                          <div 
                            key={i}
                            className="text-xs p-1 rounded bg-primary/10 text-primary truncate"
                            title={report.clientName}
                          >
                            {report.time} - {report.clientName.split(' ')[0]}
                          </div>
                        ))}
                        {reports.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{reports.length - 2} más
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Reports List */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Próximos Envíos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MOCK_SCHEDULED_REPORTS.map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{report.clientName}</div>
                    <div className="text-sm text-muted-foreground">
                      {report.frequency === 'daily' ? 'Diario' : 'Semanal'} a las {report.time}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">
                      {format(report.nextRun, "EEEE d 'de' MMMM", { locale: es })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(report.nextRun, "HH:mm")}
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-0">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Activo
                  </Badge>
                </div>
              </div>
            ))}

            {pendingCount > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-lg border border-amber-500/30 bg-amber-500/5">
                <AlertCircle className="h-4 w-4 text-amber-400" />
                <span className="text-sm text-amber-400">
                  {pendingCount} cliente(s) sin configuración de reportes
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
