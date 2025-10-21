import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, BillItem } from "@/types/legislation";
import { Calendar as CalendarIcon, Clock, AlertTriangle, FileText } from "lucide-react";
import { format, isSameDay, parseISO, addDays, addWeeks, addMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [calendarView, setCalendarView] = useState<"daily" | "weekly" | "monthly">("monthly");

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
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
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className={cn("rounded-md border pointer-events-auto text-lg scale-125")}
            modifiers={{
              hasEvents: datesWithEvents,
            }}
            modifiersStyles={{
              hasEvents: {
                fontWeight: "bold",
                textDecoration: "underline",
                color: "hsl(var(--primary))",
              },
            }}
          />
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
          <ScrollArea className="h-[400px] pr-4">
            {selectedDateEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No events on this date</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDateEvents.map((event, index) => (
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
                          {format(event.date, "h:mm a")}
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
