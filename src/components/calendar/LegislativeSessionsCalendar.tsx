import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar as CalendarIcon, Clock, Building2, Users, FileText, ChevronDown, Scale, Download, Globe, Filter, X, Link2, Copy, Check } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { CountryFlag } from "@/components/shared/CountryFlag";

// Jurisdiction definitions for filtering (with countryKey for CountryFlag)
const JURISDICTIONS = [
  { code: "USA", name: "United States", countryKey: "USA", region: "NAM" },
  { code: "CAN", name: "Canada", countryKey: "Canada", region: "NAM" },
  { code: "CRI", name: "Costa Rica", countryKey: "Costa Rica", region: "LATAM" },
  { code: "EU", name: "European Union", countryKey: "EU", region: "EU" },
  { code: "UAE", name: "UAE", countryKey: "UAE", region: "GCC" },
  { code: "SAU", name: "Saudi Arabia", countryKey: "Saudi Arabia", region: "GCC" },
  { code: "JPN", name: "Japan", countryKey: "Japan", region: "APAC" },
  { code: "KOR", name: "South Korea", countryKey: "Korea", region: "APAC" },
  { code: "TWN", name: "Taiwan", countryKey: "Taiwan", region: "APAC" },
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

// Subscribe Dialog Component
function SubscribeDialog() {
  const [copied, setCopied] = useState(false);
  
  // This would be your actual calendar feed URL in production
  const subscribeUrl = "webcal://lawmeter.app/api/calendar/legislative-feed.ics";
  const httpsUrl = "https://lawmeter.app/api/calendar/legislative-feed.ics";
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(httpsUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Link2 className="w-4 h-4" />
          Subscribe
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Subscribe to Legislative Calendar
          </DialogTitle>
          <DialogDescription>
            Add this calendar to your preferred app to receive automatic updates
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          {/* Subscribe URL */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Calendar Feed URL</Label>
            <div className="flex gap-2">
              <Input 
                value={httpsUrl} 
                readOnly 
                className="text-xs font-mono"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={copyToClipboard}
                className="shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="space-y-4 pt-2">
            {/* Google Calendar */}
            <div className="p-3 rounded-lg bg-muted/50 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">📅</span>
                <span className="font-medium text-sm">Google Calendar</span>
              </div>
              <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Open Google Calendar on web</li>
                <li>Click the + next to "Other calendars"</li>
                <li>Select "From URL"</li>
                <li>Paste the calendar feed URL above</li>
                <li>Click "Add calendar"</li>
              </ol>
            </div>
            
            {/* Apple Calendar */}
            <div className="p-3 rounded-lg bg-muted/50 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🍎</span>
                <span className="font-medium text-sm">Apple Calendar (Mac/iPhone)</span>
              </div>
              <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Open Calendar app</li>
                <li>Go to File → New Calendar Subscription</li>
                <li>Paste the calendar feed URL</li>
                <li>Configure refresh frequency and click Subscribe</li>
              </ol>
            </div>
            
            {/* Outlook */}
            <div className="p-3 rounded-lg bg-muted/50 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">📧</span>
                <span className="font-medium text-sm">Outlook</span>
              </div>
              <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Open Outlook Calendar</li>
                <li>Click "Add calendar" → "Subscribe from web"</li>
                <li>Paste the calendar feed URL</li>
                <li>Name it "LawMeter Legislative Calendar"</li>
                <li>Click "Import"</li>
              </ol>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground text-center pt-2">
            Subscribed calendars automatically sync when new sessions or deadlines are added
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
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

  // Get jurisdiction countryKey for flag display
  const getJurisdictionCountryKey = (code: string): string => {
    const jurisdiction = JURISDICTIONS.find(j => j.code === code);
    return jurisdiction?.countryKey || code;
  };

  // Convert unified legislation data to EffectiveDate format
  const convertUnifiedToEffectiveDates = (items: UnifiedLegislationItem[], jurisdictionCode: string): EffectiveDate[] => {
    const results: EffectiveDate[] = [];
    const countryKey = getJurisdictionCountryKey(jurisdictionCode);

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
              jurisdictionFlag: countryKey
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
              jurisdictionFlag: countryKey
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
                jurisdictionFlag: "Costa Rica"
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
                jurisdictionFlag: "Costa Rica"
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

  // Generate mock sessions across all jurisdictions and months
  const generateMockSessions = (): LegislativeSession[] => {
    return [
      // ========== USA Sessions ==========
      {
        date: parseISO("2025-01-15T10:00:00"),
        sessionNumber: "1",
        time: "10:00",
        organType: "COMMITTEE",
        organName: "House Energy & Commerce Committee",
        sessionType: "HEARING",
        status: "SCHEDULED",
        agenda: ["Smart Appliance Safety Standards", "IoT Device Regulations"],
        jurisdiction: "USA"
      },
      {
        date: parseISO("2025-01-22T14:00:00"),
        sessionNumber: "2",
        time: "14:00",
        organType: "SUBCOMMITTEE",
        organName: "Senate Commerce Subcommittee on Consumer Protection",
        sessionType: "MARKUP",
        status: "SCHEDULED",
        agenda: ["Consumer Product Safety Act Amendments"],
        jurisdiction: "USA"
      },
      {
        date: parseISO("2025-02-05T09:30:00"),
        sessionNumber: "5",
        time: "09:30",
        organType: "PLENARY",
        organName: "House of Representatives Floor Session",
        sessionType: "VOTE",
        status: "SCHEDULED",
        agenda: ["H.R. 1234 - Cybersecurity Standards for Consumer Electronics"],
        jurisdiction: "USA"
      },
      {
        date: parseISO("2025-02-18T11:00:00"),
        sessionNumber: "8",
        time: "11:00",
        organType: "COMMITTEE",
        organName: "Senate Judiciary Committee",
        sessionType: "HEARING",
        status: "SCHEDULED",
        agenda: ["Data Privacy in Smart Home Devices"],
        jurisdiction: "USA"
      },
      {
        date: parseISO("2025-03-10T10:00:00"),
        sessionNumber: "12",
        time: "10:00",
        organType: "AGENCY",
        organName: "FCC Open Commission Meeting",
        sessionType: "REGULATORY",
        status: "SCHEDULED",
        agenda: ["RF Emissions Standards Update", "Wireless Device Certification"],
        jurisdiction: "USA"
      },
      {
        date: parseISO("2025-03-25T14:30:00"),
        sessionNumber: "15",
        time: "14:30",
        organType: "AGENCY",
        organName: "CPSC Public Hearing",
        sessionType: "PUBLIC HEARING",
        status: "SCHEDULED",
        agenda: ["Kitchen Appliance Safety Standards Review"],
        jurisdiction: "USA"
      },
      
      // ========== EU Sessions ==========
      {
        date: parseISO("2025-01-20T09:00:00"),
        sessionNumber: "EP-001",
        time: "09:00",
        organType: "PARLIAMENT",
        organName: "European Parliament IMCO Committee",
        sessionType: "ORDINARY",
        status: "SCHEDULED",
        agenda: ["Product Safety Regulation Review", "CE Marking Updates"],
        jurisdiction: "EU"
      },
      {
        date: parseISO("2025-02-12T10:00:00"),
        sessionNumber: "EC-045",
        time: "10:00",
        organType: "COMMISSION",
        organName: "European Commission DG GROW",
        sessionType: "REGULATORY",
        status: "SCHEDULED",
        agenda: ["Ecodesign Regulation for Small Appliances"],
        jurisdiction: "EU"
      },
      {
        date: parseISO("2025-03-05T14:00:00"),
        sessionNumber: "EP-012",
        time: "14:00",
        organType: "PARLIAMENT",
        organName: "European Parliament Plenary",
        sessionType: "VOTE",
        status: "SCHEDULED",
        agenda: ["Cyber Resilience Act Final Vote"],
        jurisdiction: "EU"
      },
      {
        date: parseISO("2025-04-15T09:30:00"),
        sessionNumber: "COU-008",
        time: "09:30",
        organType: "COUNCIL",
        organName: "Council of the EU - Competitiveness",
        sessionType: "ORDINARY",
        status: "SCHEDULED",
        agenda: ["AI Act Implementation Guidelines"],
        jurisdiction: "EU"
      },
      
      // ========== Japan Sessions ==========
      {
        date: parseISO("2025-01-28T10:00:00"),
        sessionNumber: "211-15",
        time: "10:00",
        organType: "DIET",
        organName: "House of Representatives Economy Committee",
        sessionType: "ORDINARY",
        status: "SCHEDULED",
        agenda: ["Product Safety Law Amendments"],
        jurisdiction: "JPN"
      },
      {
        date: parseISO("2025-02-20T13:00:00"),
        sessionNumber: "211-28",
        time: "13:00",
        organType: "MINISTRY",
        organName: "METI Technical Standards Council",
        sessionType: "REGULATORY",
        status: "SCHEDULED",
        agenda: ["JIS Standards for Electric Appliances"],
        jurisdiction: "JPN"
      },
      {
        date: parseISO("2025-03-15T09:00:00"),
        sessionNumber: "211-42",
        time: "09:00",
        organType: "DIET",
        organName: "House of Councillors Plenary",
        sessionType: "VOTE",
        status: "SCHEDULED",
        agenda: ["Electrical Appliance Safety Act Revision"],
        jurisdiction: "JPN"
      },
      
      // ========== Korea Sessions ==========
      {
        date: parseISO("2025-01-25T14:00:00"),
        sessionNumber: "KNA-101",
        time: "14:00",
        organType: "ASSEMBLY",
        organName: "National Assembly Trade Committee",
        sessionType: "ORDINARY",
        status: "SCHEDULED",
        agenda: ["KC Mark Certification Updates"],
        jurisdiction: "KOR"
      },
      {
        date: parseISO("2025-02-28T10:00:00"),
        sessionNumber: "KATS-015",
        time: "10:00",
        organType: "AGENCY",
        organName: "Korean Agency for Technology and Standards",
        sessionType: "REGULATORY",
        status: "SCHEDULED",
        agenda: ["KS Standards Review - Household Appliances"],
        jurisdiction: "KOR"
      },
      {
        date: parseISO("2025-04-10T09:00:00"),
        sessionNumber: "KNA-145",
        time: "09:00",
        organType: "ASSEMBLY",
        organName: "National Assembly Plenary",
        sessionType: "VOTE",
        status: "SCHEDULED",
        agenda: ["Consumer Safety Framework Act"],
        jurisdiction: "KOR"
      },
      
      // ========== Taiwan Sessions ==========
      {
        date: parseISO("2025-02-10T09:00:00"),
        sessionNumber: "LY-2025-01",
        time: "09:00",
        organType: "LEGISLATURE",
        organName: "Legislative Yuan Economics Committee",
        sessionType: "ORDINARY",
        status: "SCHEDULED",
        agenda: ["BSMI Certification Requirements"],
        jurisdiction: "TWN"
      },
      {
        date: parseISO("2025-03-20T14:00:00"),
        sessionNumber: "BSMI-008",
        time: "14:00",
        organType: "AGENCY",
        organName: "Bureau of Standards - Technical Review",
        sessionType: "REGULATORY",
        status: "SCHEDULED",
        agenda: ["CNS Standards for Small Kitchen Appliances"],
        jurisdiction: "TWN"
      },
      
      // ========== UAE Sessions ==========
      {
        date: parseISO("2025-01-30T11:00:00"),
        sessionNumber: "FNC-45",
        time: "11:00",
        organType: "COUNCIL",
        organName: "Federal National Council",
        sessionType: "ORDINARY",
        status: "SCHEDULED",
        agenda: ["Consumer Protection Law Amendments"],
        jurisdiction: "UAE"
      },
      {
        date: parseISO("2025-03-12T10:00:00"),
        sessionNumber: "ESMA-012",
        time: "10:00",
        organType: "AUTHORITY",
        organName: "Emirates Authority for Standardization",
        sessionType: "REGULATORY",
        status: "SCHEDULED",
        agenda: ["UAE.S Standards for Electrical Appliances"],
        jurisdiction: "UAE"
      },
      
      // ========== Canada Sessions ==========
      {
        date: parseISO("2025-02-15T13:00:00"),
        sessionNumber: "HC-2025-08",
        time: "13:00",
        organType: "COMMITTEE",
        organName: "House of Commons Industry Committee",
        sessionType: "HEARING",
        status: "SCHEDULED",
        agenda: ["Product Safety Canada Act Review"],
        jurisdiction: "CAN"
      },
      {
        date: parseISO("2025-03-28T10:00:00"),
        sessionNumber: "SCC-015",
        time: "10:00",
        organType: "AGENCY",
        organName: "Standards Council of Canada",
        sessionType: "REGULATORY",
        status: "SCHEDULED",
        agenda: ["CSA Standards Harmonization with US/EU"],
        jurisdiction: "CAN"
      },
      {
        date: parseISO("2025-04-22T14:00:00"),
        sessionNumber: "SEN-042",
        time: "14:00",
        organType: "SENATE",
        organName: "Senate Standing Committee on Banking",
        sessionType: "ORDINARY",
        status: "SCHEDULED",
        agenda: ["Consumer Product Regulations Update"],
        jurisdiction: "CAN"
      },
      
      // ========== Costa Rica Sessions (original data with jurisdiction) ==========
      {
        date: parseISO("2025-01-10T14:45:00"),
        sessionNumber: "",
        time: "14:45",
        organType: "PLENARIO",
        organName: "Asamblea Legislativa - Plenario",
        sessionType: "ORDINARIA",
        status: "PENDIENTE",
        agenda: ["Proyecto de Ley Regulación Fintech 2025"],
        jurisdiction: "CRI"
      },
      {
        date: parseISO("2025-02-03T18:05:00"),
        sessionNumber: "",
        time: "18:05",
        organType: "ESPECIAL",
        organName: "Comisión de Ciencia y Tecnología",
        sessionType: "ORDINARIA",
        status: "PENDIENTE",
        agenda: ["Ley de Ciberseguridad Nacional"],
        jurisdiction: "CRI"
      },
      {
        date: parseISO("2025-02-25T09:00:00"),
        sessionNumber: "18",
        time: "09:00",
        organType: "PERMANENTE",
        organName: "Comisión de Ambiente",
        sessionType: "EXTRAORDINARIA",
        status: "PENDIENTE",
        agenda: ["Ley de Electrodomésticos Eficientes"],
        jurisdiction: "CRI"
      },
      {
        date: parseISO("2025-03-18T13:15:00"),
        sessionNumber: "51",
        time: "13:15",
        organType: "PERMANENTE",
        organName: "Comisión de Asuntos Hacendarios",
        sessionType: "ORDINARIA",
        status: "PENDIENTE",
        agenda: ["Regulación de Criptoactivos"],
        jurisdiction: "CRI"
      },
      {
        date: parseISO("2025-04-08T14:45:00"),
        sessionNumber: "",
        time: "14:45",
        organType: "PLENARIO",
        organName: "Asamblea Legislativa - Segundo Debate",
        sessionType: "ORDINARIA",
        status: "PENDIENTE",
        agenda: ["Votación Ley de Electrodomésticos Eficientes"],
        jurisdiction: "CRI"
      },
      {
        date: parseISO("2025-05-12T09:00:00"),
        sessionNumber: "22",
        time: "09:00",
        organType: "PERMANENTE",
        organName: "Comisión de Asuntos Económicos",
        sessionType: "EXTRAORDINARIA",
        status: "PENDIENTE",
        agenda: ["Regulación Fintech - Dictamen Final"],
        jurisdiction: "CRI"
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
                  
                  <SubscribeDialog />
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
                        <CountryFlag countryKey={jurisdiction.countryKey} variant="compact" size="sm" showTooltip={false} />
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

      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
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
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="max-h-[580px] pr-4">
            {selectedSessions.length === 0 && selectedEffectiveDates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No sessions or effective dates scheduled</p>
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

                    // Get jurisdiction-specific gradient colors
                    const getJurisdictionGradient = (jurisdiction: string) => {
                      switch (jurisdiction) {
                        case "USA":
                        case "CAN":
                          return "bg-gradient-to-r from-blue-950/90 to-blue-900/80 dark:from-blue-950 dark:to-blue-900"; // NAM
                        case "CRI":
                          return "bg-gradient-to-r from-emerald-950/90 to-teal-900/80 dark:from-emerald-950 dark:to-teal-900"; // LATAM
                        case "EU":
                          return "bg-gradient-to-r from-indigo-950/90 to-violet-900/80 dark:from-indigo-950 dark:to-violet-900"; // EU
                        case "UAE":
                        case "SAU":
                          return "bg-gradient-to-r from-amber-950/90 to-orange-900/80 dark:from-amber-950 dark:to-orange-900"; // GCC
                        case "JPN":
                        case "KOR":
                        case "TWN":
                          return "bg-gradient-to-r from-rose-950/90 to-pink-900/80 dark:from-rose-950 dark:to-pink-900"; // APAC
                        default:
                          return "bg-gradient-to-r from-slate-950/90 to-slate-900/80 dark:from-slate-950 dark:to-slate-900";
                      }
                    };

                    const getBorderColor = (jurisdiction: string) => {
                      switch (jurisdiction) {
                        case "USA":
                        case "CAN":
                          return "border-blue-500"; // NAM
                        case "CRI":
                          return "border-emerald-500"; // LATAM
                        case "EU":
                          return "border-indigo-500"; // EU
                        case "UAE":
                        case "SAU":
                          return "border-amber-500"; // GCC
                        case "JPN":
                        case "KOR":
                        case "TWN":
                          return "border-rose-500"; // APAC
                        default:
                          return "border-purple-500";
                      }
                    };

                    return (
                      <div
                        key={`effective-${index}`}
                        onClick={() => effectiveDate.alertId && onNavigateToAlert?.(effectiveDate.alertId)}
                        className={cn(
                          "p-4 rounded-lg border-l-4 hover:shadow-md transition-shadow",
                          getJurisdictionGradient(effectiveDate.jurisdiction),
                          getBorderColor(effectiveDate.jurisdiction),
                          effectiveDate.alertId && onNavigateToAlert && "cursor-pointer"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1 flex items-center gap-2 text-white/80">
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
                              title={`Risk: ${effectiveDate.riskLevel}`}
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <h4 className="font-semibold text-sm text-white">
                              {effectiveDate.lawName}
                            </h4>
                            <div className="flex items-center gap-2 flex-wrap">
                              {effectiveDate.jurisdictionFlag && (
                                <Badge variant="outline" className="text-xs border-white/30 text-white/90 flex items-center gap-1">
                                  <CountryFlag countryKey={effectiveDate.jurisdictionFlag} variant="compact" size="xs" showTooltip={false} />
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs border-white/30 text-white/90">
                                {effectiveDate.lawNumber}
                              </Badge>
                              <Badge 
                                className={cn(
                                  "text-xs",
                                  effectiveDate.type === "plazo"
                                    ? "bg-orange-500 text-white hover:bg-orange-600"
                                    : "bg-purple-500 text-white hover:bg-purple-600"
                                )}
                              >
                                {effectiveDate.type === "plazo" ? "Compliance Deadline" : effectiveDate.type === "efectiva" ? "Effective Date" : "In Force"}
                              </Badge>
                            </div>
                            {effectiveDate.description && (
                              <p className="text-xs text-white/70 mt-2">
                                {effectiveDate.description}
                              </p>
                            )}
                            <div className="flex items-center gap-1 text-xs text-white/80">
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

      {/* Complete Sessions Table */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Complete Sessions List</CardTitle>
          <CardDescription>
            All scheduled legislative sessions across jurisdictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Jurisdiction</TableHead>
                  <TableHead>Body Type</TableHead>
                  <TableHead>Legislative Body</TableHead>
                  <TableHead className="min-w-[110px]">Session Date</TableHead>
                  <TableHead>Session #</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Session Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map((session, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <CountryFlag 
                        countryKey={getJurisdictionCountryKey(session.jurisdiction || "USA")} 
                        variant="compact" 
                        size="sm" 
                        showTooltip={false} 
                      />
                    </TableCell>
                    <TableCell className="font-medium">{session.organType}</TableCell>
                    <TableCell className="max-w-[300px] truncate" title={session.organName}>
                      {session.organName}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{format(session.date, "MMM d, yyyy")}</TableCell>
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
