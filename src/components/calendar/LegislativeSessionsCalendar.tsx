import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar as CalendarIcon, Clock, Building2, Users, FileText, ChevronDown, Scale, Download, Globe, Filter, X } from "lucide-react";
import { format, isSameDay, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
import {
  unifiedUSACombinedData,
  unifiedCanadaData,
  unifiedJapanData,
  unifiedKoreaData,
  unifiedTaiwanData,
  unifiedEUData,
  unifiedGCCData
} from "@/data/unifiedMockData";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";

// Jurisdiction definitions for filtering
const JURISDICTIONS = [
  { code: "USA", name: "United States", flag: "🇺🇸", region: "NAM" },
  { code: "CAN", name: "Canada", flag: "🇨🇦", region: "NAM" },
  { code: "CRI", name: "Costa Rica", flag: "🇨🇷", region: "LATAM" },
  { code: "EU", name: "European Union", flag: "🇪🇺", region: "EU" },
  { code: "UAE", name: "UAE", flag: "🇦🇪", region: "GCC" },
  { code: "SAU", name: "Saudi Arabia", flag: "🇸🇦", region: "GCC" },
  { code: "JPN", name: "Japan", flag: "🇯🇵", region: "JAPAN" },
  { code: "KOR", name: "South Korea", flag: "🇰🇷", region: "APAC" },
  { code: "TWN", name: "Taiwan", flag: "🇹🇼", region: "APAC" },
] as const;

interface LegislativeSession {
  date: Date;
  sessionNumber: string;
  time: string;
  organType: string;
  organName: string;
  sessionType: string;
  status: string;
  agenda?: string[];
  jurisdiction?: string;
}

interface EffectiveDate {
  date: Date;
  lawName: string;
  lawNumber: string;
  type: "efectiva" | "vigencia" | "plazo";
  description?: string;
  riskLevel: "high" | "medium" | "low";
  alertId: string;
  jurisdiction: string;
  jurisdictionFlag?: string;
}

interface LegislativeSessionsCalendarProps {
  alerts?: any[];
  clientInterests?: string[];
  onNavigateToAlert?: (alertId: string) => void;
}

export function LegislativeSessionsCalendar({ alerts = [], clientInterests = [], onNavigateToAlert }: LegislativeSessionsCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [filterOrganType, setFilterOrganType] = useState<string>("all");
  const [filterSessionType, setFilterSessionType] = useState<string>("all");
  const [showSessions, setShowSessions] = useState<boolean>(true);
  const [showEffectiveDates, setShowEffectiveDates] = useState<boolean>(true);
  const [showDeadlines, setShowDeadlines] = useState<boolean>(true);
  const [selectedJurisdictions, setSelectedJurisdictions] = useState<string[]>(JURISDICTIONS.map(j => j.code));

  // Helper to toggle jurisdiction selection
  const toggleJurisdiction = (code: string) => {
    setSelectedJurisdictions(prev => 
      prev.includes(code) 
        ? prev.filter(j => j !== code)
        : [...prev, code]
    );
  };

  const selectAllJurisdictions = () => setSelectedJurisdictions(JURISDICTIONS.map(j => j.code));
  const clearAllJurisdictions = () => setSelectedJurisdictions([]);

  // Get jurisdiction flag by code
  const getJurisdictionFlag = (code: string): string => {
    const jurisdiction = JURISDICTIONS.find(j => j.code === code);
    return jurisdiction?.flag || "🌐";
  };

  // Convert unified legislation data to EffectiveDate format
  const convertUnifiedToEffectiveDates = (items: UnifiedLegislationItem[], jurisdictionCode: string): EffectiveDate[] => {
    const results: EffectiveDate[] = [];
    const flag = getJurisdictionFlag(jurisdictionCode);

    items.forEach(item => {
      // Add effective dates
      if (item.effectiveDate) {
        try {
          const date = parseISO(item.effectiveDate);
          if (!isNaN(date.getTime())) {
            results.push({
              date,
              lawName: item.title,
              lawNumber: item.identifier,
              type: "efectiva",
              riskLevel: item.riskLevel || "low",
              alertId: item.id,
              description: item.summary?.substring(0, 150),
              jurisdiction: jurisdictionCode,
              jurisdictionFlag: flag
            });
          }
        } catch {}
      }

      // Add compliance deadlines
      if (item.complianceDeadline) {
        try {
          const date = parseISO(item.complianceDeadline);
          if (!isNaN(date.getTime())) {
            results.push({
              date,
              lawName: item.title,
              lawNumber: item.identifier,
              type: "plazo",
              riskLevel: item.riskLevel || "low",
              alertId: item.id,
              description: item.summary?.substring(0, 150),
              jurisdiction: jurisdictionCode,
              jurisdictionFlag: flag
            });
          }
        } catch {}
      }
    });

    return results;
  };

  // Generate effective dates from all sources
  const allEffectiveDates = useMemo((): EffectiveDate[] => {
    const results: EffectiveDate[] = [];

    // Add Costa Rica alerts (original data)
    if (alerts && alerts.length > 0) {
      alerts.forEach(alert => {
        // Effective dates
        if (alert.effective_date) {
          let effectiveDate: Date;
          const dateStr = alert.effective_date;
          
          try {
            if (dateStr.includes('/')) {
              const [day, month, year] = dateStr.split('/');
              effectiveDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            } else {
              effectiveDate = parseISO(dateStr);
            }
            
            if (!isNaN(effectiveDate.getTime())) {
              results.push({
                date: effectiveDate,
                lawName: alert.title || alert.law_number || "Sin título",
                lawNumber: alert.law_number || alert.title_id || "",
                type: "efectiva",
                riskLevel: alert.AI_triage?.risk_level || "low",
                alertId: alert.title_id,
                description: alert.AI_triage?.summary?.substring(0, 150),
                jurisdiction: "CRI",
                jurisdictionFlag: "🇨🇷"
              });
            }
          } catch {}
        }

        // Deadlines
        if (alert.AI_triage?.deadline_detected) {
          let deadlineDate: Date;
          const dateStr = alert.AI_triage.deadline_detected;
          
          try {
            if (dateStr.includes('/')) {
              const [day, month, year] = dateStr.split('/');
              deadlineDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            } else {
              deadlineDate = parseISO(dateStr);
            }
            
            if (!isNaN(deadlineDate.getTime())) {
              results.push({
                date: deadlineDate,
                lawName: alert.title || alert.law_number || "Sin título",
                lawNumber: alert.law_number || alert.title_id || "",
                type: "plazo",
                riskLevel: alert.AI_triage?.risk_level || "low",
                alertId: alert.title_id,
                description: alert.AI_triage?.summary?.substring(0, 150),
                jurisdiction: "CRI",
                jurisdictionFlag: "🇨🇷"
              });
            }
          } catch {}
        }
      });
    }

    // Add unified data from all jurisdictions
    results.push(...convertUnifiedToEffectiveDates(unifiedUSACombinedData, "USA"));
    results.push(...convertUnifiedToEffectiveDates(unifiedCanadaData, "CAN"));
    results.push(...convertUnifiedToEffectiveDates(unifiedEUData, "EU"));
    results.push(...convertUnifiedToEffectiveDates(unifiedGCCData, "UAE")); // GCC mapped to UAE for simplicity
    results.push(...convertUnifiedToEffectiveDates(unifiedJapanData, "JPN"));
    results.push(...convertUnifiedToEffectiveDates(unifiedKoreaData, "KOR"));
    results.push(...convertUnifiedToEffectiveDates(unifiedTaiwanData, "TWN"));

    return results;
  }, [alerts]);

  // Filter effective dates by selected jurisdictions
  const filteredEffectiveDates = useMemo(() => {
    return allEffectiveDates.filter(ed => selectedJurisdictions.includes(ed.jurisdiction));
  }, [allEffectiveDates, selectedJurisdictions]);

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
        agenda: ["Analysis of regional bills"]
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
        agenda: ["Voting on pending bills", "Ley Fintech"]
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
    if (!showSessions) return [];
    
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
    const filtered = filteredEffectiveDates.filter((ed) => {
      if (ed.type === "efectiva" && !showEffectiveDates) return false;
      if (ed.type === "plazo" && !showDeadlines) return false;
      return true;
    });
    
    if (calendarView === "daily") {
      return filtered.filter((ed) => isSameDay(ed.date, date));
    } else if (calendarView === "weekly") {
      const weekStart = startOfWeek(date);
      const weekEnd = endOfWeek(date);
      return filtered.filter((ed) => ed.date >= weekStart && ed.date <= weekEnd);
    } else {
      // monthly
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      return filtered.filter((ed) => ed.date >= monthStart && ed.date <= monthEnd);
    }
  };

  const selectedEffectiveDates = getEffectiveDatesForDate(selectedDate);

  // Obtener fechas con sesiones y fechas de vigencia para resaltar en el calendario
  const datesWithSessions = showSessions ? filteredSessions.map((s) => s.date) : [];
  const datesWithVigencias = filteredEffectiveDates
    .filter(ed => ed.type === "efectiva" && showEffectiveDates)
    .map((ed) => ed.date);
  const datesWithDeadlines = filteredEffectiveDates
    .filter(ed => ed.type === "plazo" && showDeadlines)
    .map((ed) => ed.date);

  // Función para obtener indicadores de colores múltiples para cada fecha
  const getDateIndicators = (date: Date) => {
    const indicators: { color: string; type: string }[] = [];
    
    if (showSessions && datesWithSessions.some(d => isSameDay(d, date))) {
      indicators.push({ color: 'bg-blue-500', type: 'session' });
    }
    if (showEffectiveDates && datesWithVigencias.some(d => isSameDay(d, date))) {
      indicators.push({ color: 'bg-purple-500', type: 'vigencia' });
    }
    if (showDeadlines && datesWithDeadlines.some(d => isSameDay(d, date))) {
      indicators.push({ color: 'bg-orange-500', type: 'deadline' });
    }
    
    return indicators;
  };

  // Función para generar contenido ICS
  const generateICSContent = () => {
    const icsEvents: string[] = [];
    
    // Agregar sesiones
    if (showSessions) {
      filteredSessions.forEach(session => {
        const dateStr = format(session.date, "yyyyMMdd'T'HHmmss");
        const agenda = session.agenda ? `\\n\\nAgenda:\\n${session.agenda.join('\\n')}` : '';
        
        icsEvents.push(
          `BEGIN:VEVENT`,
          `DTSTART:${dateStr}`,
          `SUMMARY:${session.organName}`,
          `DESCRIPTION:Sesión ${session.sessionType} - ${session.organType}${agenda}`,
          `LOCATION:Asamblea Legislativa`,
          `STATUS:${session.status === 'REALIZADA' ? 'CONFIRMED' : session.status === 'CANCELADA' ? 'CANCELLED' : 'TENTATIVE'}`,
          `END:VEVENT`
        );
      });
    }

    // Agregar fechas de vigencia
    if (showEffectiveDates) {
      filteredEffectiveDates
        .filter(ed => ed.type === "efectiva")
        .forEach(item => {
          const dateStr = format(item.date, "yyyyMMdd");
          
          icsEvents.push(
            `BEGIN:VEVENT`,
            `DTSTART;VALUE=DATE:${dateStr}`,
            `SUMMARY:${item.jurisdictionFlag} Effective: ${item.lawName}`,
            `DESCRIPTION:Enters into force - ${item.lawNumber} (${item.jurisdiction})${item.description ? '\\n\\n' + item.description : ''}`,
            `CATEGORIES:Effective Date`,
            `END:VEVENT`
          );
        });
    }

    // Agregar plazos de cumplimiento
    if (showDeadlines) {
      filteredEffectiveDates
        .filter(ed => ed.type === "plazo")
        .forEach(item => {
          const dateStr = format(item.date, "yyyyMMdd");
          
          icsEvents.push(
            `BEGIN:VEVENT`,
            `DTSTART;VALUE=DATE:${dateStr}`,
            `SUMMARY:${item.jurisdictionFlag} Deadline: ${item.lawName}`,
            `DESCRIPTION:Compliance deadline - ${item.lawNumber} (${item.jurisdiction})${item.description ? '\\n\\n' + item.description : ''}`,
            `CATEGORIES:Compliance Deadline`,
            `END:VEVENT`
          );
        });
    }

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//LawMeter//Calendario Legislativo//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      ...icsEvents,
      'END:VCALENDAR'
    ].join('\r\n');

    return icsContent;
  };

  // Función para exportar a .ics
  const exportToICS = () => {
    const icsContent = generateICSContent();
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'calendario-legislativo.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
                  Legislative Calendar
                </CardTitle>
                <CardDescription>
                  Legislative sessions, effective dates & compliance deadlines across jurisdictions
                </CardDescription>
              </div>
              <Tabs value={calendarView} onValueChange={(v) => setCalendarView(v as typeof calendarView)}>
                <TabsList>
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Filtros */}
            <div className="flex flex-col gap-3 pt-2 border-t">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">Filter by:</span>
                
                <Select value={filterOrganType} onValueChange={setFilterOrganType}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Organ Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Organs</SelectItem>
                    <SelectItem value="PLENARIO">Plenary</SelectItem>
                    <SelectItem value="ESPECIAL">Special Committee</SelectItem>
                    <SelectItem value="PERMANENTE ESPECIAL">Permanent Special</SelectItem>
                    <SelectItem value="PERMANENTE ORDINARIA">Permanent Ordinary</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterSessionType} onValueChange={setFilterSessionType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Session Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sessions</SelectItem>
                    <SelectItem value="ORDINARIA">Ordinary</SelectItem>
                    <SelectItem value="EXTRAORDINARIA">Extraordinary</SelectItem>
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
                  Clear Filters
                </Button>

                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportToICS}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download .ics
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      exportToICS();
                      const blob = new Blob([generateICSContent()], { type: 'text/calendar;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      window.open(`https://calendar.google.com/calendar/render?cid=${encodeURIComponent(url)}`, '_blank');
                      URL.revokeObjectURL(url);
                    }}
                    className="flex items-center gap-2"
                  >
                    <CalendarIcon className="w-4 h-4" />
                    Google Calendar
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const icsContent = generateICSContent();
                      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = 'calendario-legislativo.ics';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                      window.open('https://outlook.office.com/calendar/', '_blank');
                    }}
                    className="flex items-center gap-2"
                  >
                    <CalendarIcon className="w-4 h-4" />
                    Outlook
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 p-3 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium text-muted-foreground">Show:</span>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="show-sessions" 
                    checked={showSessions} 
                    onCheckedChange={(checked) => setShowSessions(checked === true)}
                  />
                  <Label htmlFor="show-sessions" className="cursor-pointer text-sm flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500 border border-blue-600" />
                    Sessions
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="show-effective" 
                    checked={showEffectiveDates} 
                    onCheckedChange={(checked) => setShowEffectiveDates(checked === true)}
                  />
                  <Label htmlFor="show-effective" className="cursor-pointer text-sm flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500 border border-purple-600" />
                    Effective Dates
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="show-deadlines" 
                    checked={showDeadlines} 
                    onCheckedChange={(checked) => setShowDeadlines(checked === true)}
                  />
                  <Label htmlFor="show-deadlines" className="cursor-pointer text-sm flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500 border border-orange-600" />
                    Compliance Deadlines
                  </Label>
                </div>
              </div>

              {/* Jurisdiction filter */}
              <div className="flex flex-col gap-2 p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Jurisdictions ({selectedJurisdictions.length}/{JURISDICTIONS.length})
                  </span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={selectAllJurisdictions} className="text-xs h-7">
                      Select All
                    </Button>
                    <Button variant="ghost" size="sm" onClick={clearAllJurisdictions} className="text-xs h-7">
                      Clear
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {JURISDICTIONS.map((jurisdiction) => {
                    const isSelected = selectedJurisdictions.includes(jurisdiction.code);
                    const count = allEffectiveDates.filter(ed => ed.jurisdiction === jurisdiction.code).length;
                    return (
                      <Button
                        key={jurisdiction.code}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "h-8 text-xs gap-1.5",
                          isSelected && "bg-primary text-primary-foreground"
                        )}
                        onClick={() => toggleJurisdiction(jurisdiction.code)}
                      >
                        <span>{jurisdiction.flag}</span>
                        <span>{jurisdiction.name}</span>
                        {count > 0 && (
                          <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                            {count}
                          </Badge>
                        )}
                      </Button>
                    );
                  })}
                </div>
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
                day: cn(buttonVariants({ variant: "ghost" }), "h-16 w-16 p-0 font-semibold text-2xl flex flex-col items-center justify-center aria-selected:opacity-100 relative"),
                day_selected: "bg-primary text-primary-foreground hover:bg-primary focus:bg-primary rounded-md",
              }}
              modifiers={{
                hasEvents: (date) => {
                  const indicators = getDateIndicators(date);
                  return indicators.length > 0;
                }
              }}
              modifiersStyles={{
                hasEvents: {}
              }}
              components={{
                DayContent: ({ date }) => {
                  const indicators = getDateIndicators(date);
                  const dayNumber = format(date, 'd');
                  
                  return (
                    <div className="relative flex flex-col items-center justify-center w-full h-full">
                      <span>{dayNumber}</span>
                      {indicators.length > 0 && (
                        <div className="flex gap-0.5 mt-1 absolute bottom-1">
                          {indicators.map((indicator, idx) => (
                            <div
                              key={idx}
                              className={cn("w-1.5 h-1.5 rounded-full", indicator.color)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                },
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {calendarView === "daily" && format(selectedDate, "MMMM d, yyyy")}
            {calendarView === "weekly" && `Week of ${format(startOfWeek(selectedDate), "MMM d")} - ${format(endOfWeek(selectedDate), "MMM d, yyyy")}`}
            {calendarView === "monthly" && format(selectedDate, "MMMM yyyy")}
          </CardTitle>
          <CardDescription>
            {selectedSessions.length} session{selectedSessions.length !== 1 ? "s" : ""} scheduled
            {showEffectiveDates && selectedEffectiveDates.length > 0 && (
              <> • {selectedEffectiveDates.length} legislative date{selectedEffectiveDates.length !== 1 ? "s" : ""}</>
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
                              {effectiveDate.jurisdictionFlag && (
                                <Badge variant="outline" className="text-xs">
                                  {effectiveDate.jurisdictionFlag} {effectiveDate.jurisdiction}
                                </Badge>
                              )}
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
                                {effectiveDate.type === "plazo" ? "Compliance Deadline" : effectiveDate.type === "efectiva" ? "Effective Date" : "In Force"}
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
                              {format(effectiveDate.date, "MMM d, yyyy")}
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
                          {format(session.date, "MMM d, yyyy 'at' HH:mm")}
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
