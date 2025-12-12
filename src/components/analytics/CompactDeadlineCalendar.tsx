import { useMemo, useState } from "react";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CompactDeadlineCalendarProps {
  data: UnifiedLegislationItem[];
}

export function CompactDeadlineCalendar({ data }: CompactDeadlineCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const deadlineMap = useMemo(() => {
    const map = new Map<string, UnifiedLegislationItem[]>();
    
    data.forEach((item) => {
      if (!item.complianceDeadline) return;
      const dateKey = item.complianceDeadline.split("T")[0];
      
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(item);
    });
    
    return map;
  }, [data]);

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    
    const days: Array<{ date: Date; items: UnifiedLegislationItem[]; isCurrentMonth: boolean }> = [];
    
    // Add padding days from previous month
    for (let i = startPadding - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      const dateKey = date.toISOString().split("T")[0];
      days.push({
        date,
        items: deadlineMap.get(dateKey) || [],
        isCurrentMonth: false,
      });
    }
    
    // Add current month days
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      const dateKey = date.toISOString().split("T")[0];
      days.push({
        date,
        items: deadlineMap.get(dateKey) || [],
        isCurrentMonth: true,
      });
    }
    
    // Add padding days for next month to complete the grid
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(year, month + 1, i);
      const dateKey = date.toISOString().split("T")[0];
      days.push({
        date,
        items: deadlineMap.get(dateKey) || [],
        isCurrentMonth: false,
      });
    }
    
    return days;
  }, [currentMonth, deadlineMap]);

  const navigateMonth = (delta: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1));
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getMaxRisk = (items: UnifiedLegislationItem[]) => {
    if (items.some((i) => i.riskLevel === "high")) return "high";
    if (items.some((i) => i.riskLevel === "medium")) return "medium";
    return "low";
  };

  return (
    <Card className="glass-card border-border/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-base">
            <Calendar className="h-5 w-5 text-primary" />
            Deadline Calendar
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => navigateMonth(-1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[100px] text-center">
              {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => navigateMonth(1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          <TooltipProvider>
            {calendarDays.map((day, idx) => {
              const isToday = day.date.getTime() === today.getTime();
              const hasDeadlines = day.items.length > 0;
              const maxRisk = hasDeadlines ? getMaxRisk(day.items) : null;

              return (
                <Tooltip key={idx}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "aspect-square flex flex-col items-center justify-center rounded-md text-xs relative cursor-default transition-colors",
                        !day.isCurrentMonth && "text-muted-foreground/40",
                        day.isCurrentMonth && "text-foreground",
                        isToday && "ring-1 ring-primary bg-primary/10",
                        hasDeadlines && "cursor-pointer hover:bg-muted/50"
                      )}
                    >
                      <span>{day.date.getDate()}</span>
                      {hasDeadlines && (
                        <div
                          className={cn(
                            "w-1.5 h-1.5 rounded-full mt-0.5",
                            maxRisk === "high" && "bg-risk-high",
                            maxRisk === "medium" && "bg-risk-medium",
                            maxRisk === "low" && "bg-risk-low"
                          )}
                        />
                      )}
                    </div>
                  </TooltipTrigger>
                  {hasDeadlines && (
                    <TooltipContent side="top" className="max-w-[250px]">
                      <div className="space-y-1">
                        <p className="font-medium text-xs">
                          {day.items.length} deadline{day.items.length > 1 ? "s" : ""}
                        </p>
                        {day.items.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center gap-1 text-xs">
                            <div
                              className={cn(
                                "w-1.5 h-1.5 rounded-full flex-shrink-0",
                                item.riskLevel === "high" && "bg-risk-high",
                                item.riskLevel === "medium" && "bg-risk-medium",
                                item.riskLevel === "low" && "bg-risk-low"
                              )}
                            />
                            <span className="truncate">{item.title}</span>
                          </div>
                        ))}
                        {day.items.length > 3 && (
                          <p className="text-xs text-muted-foreground">
                            +{day.items.length - 3} more
                          </p>
                        )}
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-risk-high" />
            <span className="text-muted-foreground">High</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-risk-medium" />
            <span className="text-muted-foreground">Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-risk-low" />
            <span className="text-muted-foreground">Low</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
