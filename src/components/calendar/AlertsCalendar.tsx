import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  ExternalLink, 
  Settings, 
  Share2,
  X,
  Building2,
  FileText,
  Clock,
  AlertTriangle
} from "lucide-react";
import { format, isSameDay, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isToday, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { MOCK_BILLS, MOCK_REGULATIONS, MOCK_CLIENTS, PeruAlert } from "@/data/peruAlertsMockData";

interface AlertCalendarEvent {
  id: string;
  title: string;
  date: Date;
  dateType: 'stage_entry' | 'publication' | 'in_force' | 'manual';
  type: 'bill' | 'regulation';
  stage?: string;
  entity?: string;
  riskLevel?: 'high' | 'medium' | 'low';
  affectedAreas: string[];
  clients: string[];
}

interface DateRuleConfig {
  showStageEntry: boolean;
  showPublication: boolean;
  showInForce: boolean;
  showManual: boolean;
}

// Helper to parse date strings (supports both ISO "YYYY-MM-DD" and "DD/MM/YYYY" formats)
const parseAlertDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  
  // Try ISO format first (YYYY-MM-DD)
  if (dateStr.includes('-') && dateStr.split('-')[0].length === 4) {
    const date = parseISO(dateStr);
    if (!isNaN(date.getTime())) return date;
  }
  
  // Try DD/MM/YYYY format
  const dateParts = dateStr.split('/');
  if (dateParts.length === 3) {
    const date = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));
    if (!isNaN(date.getTime())) return date;
  }
  
  return null;
};

// Assign risk levels based on alert characteristics
const getAlertRiskLevel = (alert: PeruAlert): 'high' | 'medium' | 'low' => {
  const title = alert.legislation_title.toLowerCase();
  const areas = alert.affected_areas;
  
  // High risk indicators
  if (title.includes('obligatoriedad') || title.includes('sanciones') || 
      title.includes('prohibe') || title.includes('declara de necesidad') ||
      areas.includes('Oncológico') || areas.includes('Raras y huérfanas')) {
    return 'high';
  }
  
  // Low risk indicators  
  if (title.includes('designa') || title.includes('renuncia') || 
      title.includes('agradece') || alert.current_stage === 'ARCHIVADO') {
    return 'low';
  }
  
  return 'medium';
};

// Convert alerts to calendar events
const convertToCalendarEvents = (alerts: PeruAlert[]): AlertCalendarEvent[] => {
  const events: AlertCalendarEvent[] = [];
  
  alerts.forEach(alert => {
    const isBill = alert.legislation_type === 'proyecto_de_ley';
    const riskLevel = getAlertRiskLevel(alert);
    
    // For bills - use stage_date or project_date
    if (isBill) {
      const dateStr = alert.stage_date || alert.project_date;
      const date = parseAlertDate(dateStr || '');
      
      if (date) {
        events.push({
          id: alert.id,
          title: alert.legislation_title,
          date,
          dateType: 'stage_entry',
          type: 'bill',
          stage: alert.current_stage,
          riskLevel,
          affectedAreas: alert.affected_areas,
          clients: []
        });
      }
    }
    
    // For regulations - use publication_date
    if (!isBill && alert.publication_date) {
      const date = parseAlertDate(alert.publication_date);
      
      if (date) {
        events.push({
          id: alert.id,
          title: alert.legislation_title,
          date,
          dateType: 'publication',
          type: 'regulation',
          entity: alert.entity,
          riskLevel,
          affectedAreas: alert.affected_areas,
          clients: []
        });
      }
    }
  });
  
  return events;
};

// Get unique values for filters
const getUniqueValues = (alerts: PeruAlert[], key: string): string[] => {
  const values = new Set<string>();
  alerts.forEach(alert => {
    const value = (alert as any)[key];
    if (value) values.add(value);
  });
  return Array.from(values).sort();
};

const getUniqueAreas = (alerts: PeruAlert[]): string[] => {
  const areas = new Set<string>();
  alerts.forEach(alert => {
    alert.affected_areas.forEach(area => areas.add(area));
  });
  return Array.from(areas).sort();
};

export function AlertsCalendar() {
  // Set initial date to November 2025 where most mock data exists
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<'day' | 'week' | 'month'>('month');
  const [showFilters, setShowFilters] = useState(false);
  const [showDateRules, setShowDateRules] = useState(false);
  
  // Filters
  const [filterClient, setFilterClient] = useState<string>('all');
  const [filterSector, setFilterSector] = useState<string>('all');
  const [filterArea, setFilterArea] = useState<string>('all');
  const [filterTopic, setFilterTopic] = useState<string>('all');
  const [filterInstrumentType, setFilterInstrumentType] = useState<string>('all');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  
  // Date rules
  const [dateRules, setDateRules] = useState<DateRuleConfig>({
    showStageEntry: true,
    showPublication: true,
    showInForce: true,
    showManual: true
  });

  const allAlerts = [...MOCK_BILLS, ...MOCK_REGULATIONS];
  const allEvents = useMemo(() => convertToCalendarEvents(allAlerts), []);
  
  // Get filter options
  const stages = getUniqueValues(MOCK_BILLS, 'current_stage');
  const entities = getUniqueValues(MOCK_REGULATIONS, 'entity');
  const areas = getUniqueAreas(allAlerts);
  
  // Apply filters
  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      // Date type filter
      if (event.dateType === 'stage_entry' && !dateRules.showStageEntry) return false;
      if (event.dateType === 'publication' && !dateRules.showPublication) return false;
      if (event.dateType === 'in_force' && !dateRules.showInForce) return false;
      if (event.dateType === 'manual' && !dateRules.showManual) return false;
      
      // Type filter
      if (filterInstrumentType !== 'all') {
        if (filterInstrumentType === 'bill' && event.type !== 'bill') return false;
        if (filterInstrumentType === 'regulation' && event.type !== 'regulation') return false;
      }
      
      // Stage filter
      if (filterStage !== 'all' && event.stage !== filterStage) return false;
      
      // Area filter
      if (filterArea !== 'all' && !event.affectedAreas.includes(filterArea)) return false;
      
      // Risk filter
      if (filterRisk !== 'all' && event.riskLevel !== filterRisk) return false;
      
      return true;
    });
  }, [allEvents, dateRules, filterInstrumentType, filterStage, filterArea, filterRisk]);

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => isSameDay(event.date, date));
  };
  
  // Get dates in current view
  const getViewDates = () => {
    if (view === 'day') {
      return [currentDate];
    } else if (view === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return eachDayOfInterval({ start, end });
    } else {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      return eachDayOfInterval({ start, end });
    }
  };

  const navigatePrev = () => {
    if (view === 'day') {
      setCurrentDate(addDays(currentDate, -1));
    } else if (view === 'week') {
      setCurrentDate(addDays(currentDate, -7));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const navigateNext = () => {
    if (view === 'day') {
      setCurrentDate(addDays(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const handleEventClick = (event: AlertCalendarEvent) => {
    toast.info(`Navigating to ${event.type === 'bill' ? 'Proyecto de Ley' : 'Norma'} in Inbox`, {
      description: event.title.substring(0, 50) + '...',
      action: {
        label: "Go to Inbox",
        onClick: () => console.log("Navigate to alert:", event.id)
      }
    });
  };

  const handlePublishToClient = (event: AlertCalendarEvent) => {
    toast.success("Published to client calendar", {
      description: "Event added to client's external calendar"
    });
  };

  const getEventColor = (event: AlertCalendarEvent) => {
    if (event.type === 'bill') {
      if (event.stage?.includes('Pleno')) return 'bg-amber-500/20 border-amber-500/50 text-amber-300';
      if (event.stage?.includes('Comisión')) return 'bg-blue-500/20 border-blue-500/50 text-blue-300';
      return 'bg-primary/20 border-primary/50 text-primary';
    }
    return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300';
  };

  const getRiskBadge = (risk?: string) => {
    switch (risk) {
      case 'high': return <Badge className="bg-red-500/20 text-red-400 text-[10px]">Alto</Badge>;
      case 'medium': return <Badge className="bg-amber-500/20 text-amber-400 text-[10px]">Medio</Badge>;
      case 'low': return <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">Bajo</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground">Aggregation of all alerts and deadlines</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowDateRules(true)}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            Date Rules
          </Button>
          <Button 
            variant={showFilters ? "default" : "outline"} 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Connect Calendar
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="glass-card border-border/30">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-sm">Filter & Views</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-4 lg:grid-cols-7 gap-3">
              <Select value={filterClient} onValueChange={setFilterClient}>
                <SelectTrigger className="bg-background/50 text-xs">
                  <SelectValue placeholder="Client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  {MOCK_CLIENTS.map(client => (
                    <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterSector} onValueChange={setFilterSector}>
                <SelectTrigger className="bg-background/50 text-xs">
                  <SelectValue placeholder="Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  <SelectItem value="banking">Banca</SelectItem>
                  <SelectItem value="healthcare">Salud</SelectItem>
                  <SelectItem value="energy">Energía</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterArea} onValueChange={setFilterArea}>
                <SelectTrigger className="bg-background/50 text-xs">
                  <SelectValue placeholder="Area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  {areas.map(area => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterTopic} onValueChange={setFilterTopic}>
                <SelectTrigger className="bg-background/50 text-xs">
                  <SelectValue placeholder="Topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  <SelectItem value="laboral">Derecho Laboral</SelectItem>
                  <SelectItem value="tributario">Derecho Tributario</SelectItem>
                  <SelectItem value="ambiental">Derecho Ambiental</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterInstrumentType} onValueChange={setFilterInstrumentType}>
                <SelectTrigger className="bg-background/50 text-xs">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="bill">Proyectos de Ley</SelectItem>
                  <SelectItem value="regulation">Normas</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterStage} onValueChange={setFilterStage}>
                <SelectTrigger className="bg-background/50 text-xs">
                  <SelectValue placeholder="Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  {stages.map(stage => (
                    <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterRisk} onValueChange={setFilterRisk}>
                <SelectTrigger className="bg-background/50 text-xs">
                  <SelectValue placeholder="Risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risks</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={navigatePrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold ml-2">
            {format(currentDate, view === 'day' ? "EEEE, d MMMM yyyy" : view === 'week' ? "'Semana del' d MMMM" : "MMMM yyyy", { locale: es })}
          </h2>
        </div>
        <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
          <TabsList className="bg-background/50">
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Calendar Grid */}
      <Card className="glass-card border-border/30">
        <CardContent className="p-4">
          {view === 'month' ? (
            <div className="grid grid-cols-7 gap-1">
              {/* Week day headers */}
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                <div key={day} className="p-2 text-center text-xs font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {(() => {
                const monthStart = startOfMonth(currentDate);
                const monthEnd = endOfMonth(currentDate);
                const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
                const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
                const days = eachDayOfInterval({ start: startDate, end: endDate });
                
                return days.map(day => {
                  const dayEvents = getEventsForDate(day);
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  
                  return (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        "min-h-[100px] p-1 border border-border/20 rounded-md cursor-pointer hover:bg-muted/20 transition-colors",
                        !isCurrentMonth && "opacity-40",
                        isToday(day) && "bg-primary/10 border-primary/30",
                        selectedDate && isSameDay(day, selectedDate) && "ring-2 ring-primary"
                      )}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div className={cn(
                        "text-xs font-medium mb-1",
                        isToday(day) && "text-primary"
                      )}>
                        {format(day, 'd')}
                      </div>
                      <div className="space-y-0.5">
                        {dayEvents.slice(0, 3).map(event => (
                          <div
                            key={event.id}
                            className={cn(
                              "text-[10px] px-1 py-0.5 rounded border truncate cursor-pointer",
                              getEventColor(event)
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventClick(event);
                            }}
                            title={event.title}
                          >
                            {event.title.substring(0, 20)}...
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-[10px] text-muted-foreground text-center">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          ) : view === 'week' ? (
            <div className="grid grid-cols-7 gap-2">
              {getViewDates().map(day => {
                const dayEvents = getEventsForDate(day);
                return (
                  <div key={day.toISOString()} className="space-y-2">
                    <div className={cn(
                      "text-center p-2 rounded-lg",
                      isToday(day) && "bg-primary/20"
                    )}>
                      <div className="text-xs text-muted-foreground">
                        {format(day, 'EEE', { locale: es })}
                      </div>
                      <div className={cn(
                        "text-lg font-medium",
                        isToday(day) && "text-primary"
                      )}>
                        {format(day, 'd')}
                      </div>
                    </div>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-2 pr-2">
                        {dayEvents.map(event => (
                          <div
                            key={event.id}
                            className={cn(
                              "p-2 rounded border text-xs cursor-pointer hover:opacity-80 transition-opacity",
                              getEventColor(event)
                            )}
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="font-medium line-clamp-2">{event.title}</div>
                            <div className="flex items-center gap-1 mt-1 text-[10px] opacity-80">
                              {event.type === 'bill' ? (
                                <FileText className="h-3 w-3" />
                              ) : (
                                <Building2 className="h-3 w-3" />
                              )}
                              {event.stage || event.entity}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Day view */
            <div className="space-y-4">
              <div className="text-center py-4">
                <div className={cn(
                  "inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold",
                  isToday(currentDate) ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  {format(currentDate, 'd')}
                </div>
              </div>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {getEventsForDate(currentDate).length > 0 ? (
                    getEventsForDate(currentDate).map(event => (
                      <Card key={event.id} className={cn("border cursor-pointer hover:opacity-90", getEventColor(event))}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {event.type === 'bill' ? (
                                  <Badge variant="outline" className="text-xs">Proyecto de Ley</Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs">Norma</Badge>
                                )}
                                {getRiskBadge(event.riskLevel)}
                              </div>
                              <h3 className="font-medium">{event.title}</h3>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                {event.stage && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {event.stage}
                                  </span>
                                )}
                                {event.entity && (
                                  <span className="flex items-center gap-1">
                                    <Building2 className="h-3 w-3" />
                                    {event.entity}
                                  </span>
                                )}
                              </div>
                              {event.affectedAreas.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {event.affectedAreas.slice(0, 3).map(area => (
                                    <Badge key={area} variant="secondary" className="text-[10px]">{area}</Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-1">
                              <Button size="sm" variant="outline" onClick={() => handleEventClick(event)}>
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Go to Inbox
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handlePublishToClient(event)}>
                                <Share2 className="h-3 w-3 mr-1" />
                                Publish
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No events on this day</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Date Panel */}
      {selectedDate && view === 'month' && (
        <Card className="glass-card border-border/30">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setSelectedDate(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-[300px]">
              <div className="space-y-2">
                {getEventsForDate(selectedDate).length > 0 ? (
                  getEventsForDate(selectedDate).map(event => (
                    <div
                      key={event.id}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer hover:opacity-90 transition-opacity",
                        getEventColor(event)
                      )}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {event.type === 'bill' ? (
                              <FileText className="h-4 w-4" />
                            ) : (
                              <Building2 className="h-4 w-4" />
                            )}
                            <span className="text-xs opacity-80">
                              {event.type === 'bill' ? 'Proyecto de Ley' : 'Norma'}
                            </span>
                            {getRiskBadge(event.riskLevel)}
                          </div>
                          <h4 className="font-medium text-sm">{event.title}</h4>
                          <p className="text-xs opacity-80 mt-1">
                            {event.stage || event.entity}
                          </p>
                        </div>
                        <Button size="sm" variant="ghost" onClick={(e) => {
                          e.stopPropagation();
                          handlePublishToClient(event);
                        }}>
                          <Share2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No events on this date
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Date Rules Dialog */}
      <Dialog open={showDateRules} onOpenChange={setShowDateRules}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configure Date Rules
            </DialogTitle>
            <DialogDescription>
              Choose which date types to display in the calendar
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="stageEntry" 
                checked={dateRules.showStageEntry}
                onCheckedChange={(checked) => setDateRules({...dateRules, showStageEntry: !!checked})}
              />
              <Label htmlFor="stageEntry" className="flex-1">
                <span className="font-medium">Stage Entry Date</span>
                <p className="text-xs text-muted-foreground">When the alert entered its current stage</p>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="publication" 
                checked={dateRules.showPublication}
                onCheckedChange={(checked) => setDateRules({...dateRules, showPublication: !!checked})}
              />
              <Label htmlFor="publication" className="flex-1">
                <span className="font-medium">Publication Date</span>
                <p className="text-xs text-muted-foreground">When the regulation was officially published</p>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="inForce" 
                checked={dateRules.showInForce}
                onCheckedChange={(checked) => setDateRules({...dateRules, showInForce: !!checked})}
              />
              <Label htmlFor="inForce" className="flex-1">
                <span className="font-medium">In-Force Date</span>
                <p className="text-xs text-muted-foreground">When the regulation becomes effective</p>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="manual" 
                checked={dateRules.showManual}
                onCheckedChange={(checked) => setDateRules({...dateRules, showManual: !!checked})}
              />
              <Label htmlFor="manual" className="flex-1">
                <span className="font-medium">Manual Dates</span>
                <p className="text-xs text-muted-foreground">Custom dates added by the legal team</p>
              </Label>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
