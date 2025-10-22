import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, BillItem } from "@/types/legislation";
import { Calendar as CalendarIcon, Clock, AlertTriangle, FileText, Download, RefreshCw, CheckCircle2 } from "lucide-react";
import { format, isSameDay, parseISO, addDays, addWeeks, addMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface LegislativeCalendarProps {
  alerts: Alert[];
  bills: BillItem[];
  tenders?: Array<{ title: string; closeDateTime: string; riskLevel: string }>;
}

interface CalendarEvent {
  date: Date;
  title: string;
  type: "deadline" | "tender" | "action";
  riskLevel: "low" | "medium" | "high";
  source: "alert" | "bill" | "tender";
  details?: string;
}

export function LegislativeCalendar({ alerts, bills, tenders = [] }: LegislativeCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState<"daily" | "weekly" | "monthly">("weekly");
  const { toast } = useToast();

  // Generate mock future events
  const generateFutureEvents = (): CalendarEvent[] => {
    const futureEvents: CalendarEvent[] = [];
    const today = new Date();
    
    // Generate events for the next 90 days
    const eventTemplates = [
      { title: "Healthcare Standards Review", type: "deadline" as const, riskLevel: "high" as const },
      { title: "Medical Device Regulation Update", type: "deadline" as const, riskLevel: "medium" as const },
      { title: "Privacy Compliance Audit", type: "action" as const, riskLevel: "high" as const },
      { title: "Pharmaceutical Licensing Renewal", type: "deadline" as const, riskLevel: "medium" as const },
      { title: "Mental Health Services Review", type: "action" as const, riskLevel: "low" as const },
      { title: "Aged Care Quality Standards", type: "deadline" as const, riskLevel: "high" as const },
      { title: "NDIS Provider Registration", type: "tender" as const, riskLevel: "medium" as const },
      { title: "Clinical Trial Authorization", type: "deadline" as const, riskLevel: "high" as const },
      { title: "Health IT Infrastructure Tender", type: "tender" as const, riskLevel: "low" as const },
      { title: "Blood Safety Protocol Review", type: "action" as const, riskLevel: "medium" as const },
      { title: "Telehealth Licensing Update", type: "deadline" as const, riskLevel: "low" as const },
      { title: "Hospital Accreditation Review", type: "action" as const, riskLevel: "high" as const },
    ];
    
    // Create events every 3-7 days
    for (let i = 0; i < 30; i++) {
      const daysToAdd = Math.floor(Math.random() * 5) + 3; // 3-7 days
      const eventDate = addDays(today, i * daysToAdd);
      const template = eventTemplates[i % eventTemplates.length];
      
      futureEvents.push({
        date: eventDate,
        title: template.title,
        type: template.type,
        riskLevel: template.riskLevel,
        source: "alert",
        details: `Scheduled compliance ${template.type}`,
      });
    }
    
    return futureEvents;
  };

  // Extract events from all sources
  const extractEvents = (): CalendarEvent[] => {
    const events: CalendarEvent[] = [];

    // Extract deadline events from alerts
    alerts.forEach((alert) => {
      if (alert.AI_triage?.deadline_detected) {
        try {
          const deadlineDate = parseISO(alert.AI_triage.deadline_detected);
          if (!isNaN(deadlineDate.getTime())) {
            events.push({
              date: deadlineDate,
              title: alert.title || "Alert Deadline",
              type: "deadline",
              riskLevel: alert.AI_triage.risk_level,
              source: "alert",
              details: alert.AI_triage.summary || undefined,
            });
          }
        } catch (e) {
          // Skip invalid dates
        }
      }
    });

    // Extract action dates from bills
    bills.forEach((bill) => {
      try {
        const actionDate = parseISO(bill.lastActionDate);
        if (!isNaN(actionDate.getTime())) {
          events.push({
            date: actionDate,
            title: bill.title,
            type: "action",
            riskLevel: bill.risk_level,
            source: "bill",
            details: `${bill.chamber} - ${bill.status}`,
          });
        }
      } catch (e) {
        // Skip invalid dates
      }
    });

    // Extract tender closing dates
    tenders.forEach((tender) => {
      try {
        const closeDate = parseISO(tender.closeDateTime);
        if (!isNaN(closeDate.getTime())) {
          events.push({
            date: closeDate,
            title: tender.title,
            type: "tender",
            riskLevel: tender.riskLevel as "low" | "medium" | "high",
            source: "tender",
            details: "Tender closing",
          });
        }
      } catch (e) {
        // Skip invalid dates
      }
    });

    // Add generated future events
    events.push(...generateFutureEvents());

    return events;
  };

  const events = extractEvents();

  // Get events for selected date or date range
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    if (calendarView === "daily") {
      return events.filter((event) => isSameDay(event.date, date));
    } else if (calendarView === "weekly") {
      const weekStart = startOfWeek(date);
      const weekEnd = endOfWeek(date);
      return events.filter((event) => event.date >= weekStart && event.date <= weekEnd);
    } else {
      // monthly
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      return events.filter((event) => event.date >= monthStart && event.date <= monthEnd);
    }
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  // Get dates with events for calendar highlighting
  const datesWithEvents = events.map((e) => e.date);

  // Get highest risk level for each date
  const getDateRiskLevel = (date: Date): "high" | "medium" | "low" | null => {
    const dateEvents = events.filter(e => isSameDay(e.date, date));
    if (dateEvents.length === 0) return null;
    
    if (dateEvents.some(e => e.riskLevel === "high")) return "high";
    if (dateEvents.some(e => e.riskLevel === "medium")) return "medium";
    return "low";
  };

  const highRiskDates = events.filter(e => e.riskLevel === "high").map(e => e.date);
  const mediumRiskDates = events.filter(e => e.riskLevel === "medium").map(e => e.date);
  const lowRiskDates = events.filter(e => e.riskLevel === "low").map(e => e.date);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "text-risk-high border-risk-high";
      case "medium":
        return "text-risk-medium border-risk-medium";
      default:
        return "text-risk-low border-risk-low";
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "deadline":
        return <Clock className="w-4 h-4" />;
      case "tender":
        return <FileText className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "deadline":
        return "Compliance Deadline";
      case "tender":
        return "Tender Closing";
      default:
        return "Legislative Action";
    }
  };

  const handleExport = (format: string) => {
    toast({
      title: "Calendar Export",
      description: `Exporting ${selectedDateEvents.length} events to ${format}...`,
    });
  };

  const handleSync = (provider: string) => {
    toast({
      title: "Calendar Sync",
      description: `Syncing with ${provider}...`,
      duration: 3000,
    });
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
                  Track important dates, deadlines, and legislative actions
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
            
            {/* Calendar Integration Options */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
              <span className="text-sm font-medium text-muted-foreground mr-2">Sync with:</span>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleSync('Google Calendar')}
                className="gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 15l-3.5-3.5 1.41-1.41L10.5 14l5.59-5.59L17.5 9.5l-7 7z"/>
                </svg>
                Google Calendar
                <CheckCircle2 className="w-3 h-3 text-green-500" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleSync('Outlook')}
                className="gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 22h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1z"/>
                </svg>
                Outlook
                <CheckCircle2 className="w-3 h-3 text-green-500" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleSync('Office 365')}
                className="gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z"/>
                </svg>
                Office 365
                <CheckCircle2 className="w-3 h-3 text-green-500" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Export Calendar</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleExport('iCal (.ics)')}>
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    iCal Format (.ics)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('CSV')}>
                    <FileText className="w-4 h-4 mr-2" />
                    CSV Export
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('PDF')}>
                    <FileText className="w-4 h-4 mr-2" />
                    PDF Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 ml-auto"
                onClick={() => {
                  toast({
                    title: "Calendar Refreshed",
                    description: "Events synchronized across all calendars",
                  });
                }}
              >
                <RefreshCw className="w-4 h-4" />
                Sync Now
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
                highRisk: highRiskDates,
                mediumRisk: mediumRiskDates,
                lowRisk: lowRiskDates,
              }}
              modifiersClassNames={{
                highRisk: "bg-risk-high/20 border-2 border-risk-high text-risk-high font-bold hover:bg-risk-high/30",
                mediumRisk: "bg-risk-medium/20 border-2 border-risk-medium text-risk-medium font-bold hover:bg-risk-medium/30",
                lowRisk: "bg-risk-low/20 border-2 border-risk-low text-risk-low font-bold hover:bg-risk-low/30",
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
            {selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? "s" : ""} scheduled
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            {selectedDateEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No events in this {calendarView === "daily" ? "date" : calendarView === "weekly" ? "week" : "month"}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDateEvents
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map((event, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-4 rounded-lg border-l-4 bg-card hover:shadow-md transition-shadow",
                      getRiskColor(event.riskLevel)
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("mt-1", getRiskColor(event.riskLevel))}>
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="font-semibold text-sm line-clamp-2">
                          {event.title}
                        </h4>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {getEventTypeLabel(event.type)}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={cn("text-xs", getRiskColor(event.riskLevel))}
                          >
                            {event.riskLevel.toUpperCase()} RISK
                          </Badge>
                        </div>
                        {event.details && (
                          <p className="text-xs text-muted-foreground">
                            {event.details}
                          </p>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {format(event.date, "MMM d, yyyy 'at' h:mm a")}
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

      {/* Summary Stats */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Upcoming Events Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-risk-high/10 border border-risk-high/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">High Priority</span>
                <Clock className="w-4 h-4 text-risk-high" />
              </div>
              <div className="text-2xl font-bold mt-2 text-risk-high">
                {events.filter((e) => e.riskLevel === "high").length}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-risk-medium/10 border border-risk-medium/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Medium Priority</span>
                <Clock className="w-4 h-4 text-risk-medium" />
              </div>
              <div className="text-2xl font-bold mt-2 text-risk-medium">
                {events.filter((e) => e.riskLevel === "medium").length}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-risk-low/10 border border-risk-low/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Low Priority</span>
                <Clock className="w-4 h-4 text-risk-low" />
              </div>
              <div className="text-2xl font-bold mt-2 text-risk-low">
                {events.filter((e) => e.riskLevel === "low").length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
