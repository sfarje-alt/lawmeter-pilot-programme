import { useState, useEffect } from "react";
import { Alert, BillItem } from "@/types/legislation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { parseDate } from "@/lib/dateUtils";
import { TextualTrendsChart } from "@/components/analytics/TextualTrendsChart";
import { SentimentAnalysisChart } from "@/components/analytics/SentimentAnalysisChart";
import { TopicClustersChart } from "@/components/analytics/TopicClustersChart";
import { EntityMentionsChart } from "@/components/analytics/EntityMentionsChart";
import { SemanticSimilarityMatrix } from "@/components/analytics/SemanticSimilarityMatrix";
import { PeopleOfInterestChart } from "@/components/analytics/PeopleOfInterestChart";
import { ComplianceDeadlineCalendar } from "@/components/analytics/ComplianceDeadlineCalendar";
import { ImpactUrgencyMatrix } from "@/components/analytics/ImpactUrgencyMatrix";
import { BillsProgressFunnel } from "@/components/analytics/BillsProgressFunnel";
import { VotingAnalyticsChart } from "@/components/analytics/VotingAnalyticsChart";
import { StakeholderAnalysisChart } from "@/components/analytics/StakeholderAnalysisChart";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ChartsPanelProps {
  data: Alert[] | BillItem[];
  type: "acts" | "bills";
}

const COLORS = {
  high: "hsl(var(--risk-high))",
  medium: "hsl(var(--risk-medium))",
  low: "hsl(var(--risk-low))",
};

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
];

interface DraggableChartProps {
  id: string;
  children: React.ReactNode;
  isGrid?: boolean;
}

function DraggableChart({ id, children, isGrid }: DraggableChartProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group",
        isDragging && "opacity-50 z-50",
        !isDragging && "transition-all duration-200"
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className={cn(
          "absolute top-3 right-3 z-10 p-1.5 rounded-md bg-muted/80 backdrop-blur-sm cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity",
          isDragging && "cursor-grabbing opacity-100"
        )}
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>
      {children}
    </div>
  );
}

export function ChartsPanel({ data, type }: ChartsPanelProps) {
  const storageKey = `charts-order-${type}`;
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Define default chart order
  const getDefaultOrder = () => {
    if (type === "acts") {
      return [
        "textual-trends", // Keyword trends at top
        "impact-urgency", // Matrix below
        "portfolio-top10",
        "risk-distribution",
        "timeline-weekly",
        "doc-view-mix",
        "sentiment-analysis",
        "topic-clusters",
        "entity-mentions",
        "semantic-similarity",
        "compliance-deadline",
      ];
    } else {
      return [
        "textual-trends", // Keyword trends at top
        "impact-urgency", // Matrix below
        "portfolio-top10",
        "bills-status",
        "bills-chamber",
        "risk-distribution",
        "timeline-weekly",
        "voting-analytics",
        "stakeholder-analysis",
        "sentiment-analysis",
        "topic-clusters",
        "entity-mentions",
        "semantic-similarity",
        "bills-progress",
        "people-of-interest",
      ];
    }
  };

  const [chartOrder, setChartOrder] = useState<string[]>(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return getDefaultOrder();
      }
    }
    return getDefaultOrder();
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(chartOrder));
  }, [chartOrder, storageKey]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setChartOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (type === "acts") {
    const alerts = data as Alert[];

    // Risk distribution
    const riskData = [
      {
        name: "High",
        value: alerts.filter((a) => a.AI_triage?.risk_level === "high").length,
      },
      {
        name: "Medium",
        value: alerts.filter((a) => a.AI_triage?.risk_level === "medium").length,
      },
      {
        name: "Low",
        value: alerts.filter((a) => a.AI_triage?.risk_level === "low").length,
      },
    ].filter((d) => d.value > 0);

    // Alerts by ministry (top 10)
    const portfolioCounts: Record<string, number> = {};
    alerts.forEach((a) => {
      if (a.ministry) {
        portfolioCounts[a.ministry] = (portfolioCounts[a.ministry] || 0) + 1;
      }
    });
    const portfolioData = Object.entries(portfolioCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Timeline (weekly aggregation)
    const weekCounts: Record<string, number> = {};
    alerts.forEach((a) => {
      const date = parseDate(a.effective_date) || parseDate(a.publication_date);
      if (date) {
        const weekStart = new Date(date);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const key = weekStart.toISOString().split("T")[0];
        weekCounts[key] = (weekCounts[key] || 0) + 1;
      }
    });
    const timelineData = Object.entries(weekCounts)
      .map(([date, count]) => ({ date: new Date(date).toLocaleDateString("en-AU", { month: "short", day: "numeric" }), count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Norm type distribution
    const normTypeData = [
      {
        name: "Leyes",
        value: alerts.filter((a) => a.norm_type === "Ley").length,
      },
      {
        name: "Decretos Ejecutivos",
        value: alerts.filter((a) => a.norm_type === "Decreto Ejecutivo").length,
      },
      {
        name: "Reglamentos",
        value: alerts.filter((a) => a.norm_type === "Reglamento").length,
      },
    ].filter((d) => d.value > 0);

    const chartComponents: Record<string, React.ReactNode> = {
      "risk-distribution": (
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ),
      "portfolio-top10": (
        <Card>
          <CardHeader>
            <CardTitle>Alerts by Portfolio (Top 10)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={portfolioData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 'dataMax']} allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ),
      "timeline-weekly": (
        <Card>
          <CardHeader>
            <CardTitle>Timeline (Weekly)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 'dataMax']} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} name="Alerts" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ),
      "doc-view-mix": (
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Tipo de Norma</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={normTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {normTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ),
      "textual-trends": <TextualTrendsChart data={alerts} type="acts" />,
      "sentiment-analysis": <SentimentAnalysisChart data={alerts} type="acts" />,
      "topic-clusters": <TopicClustersChart data={alerts} type="acts" />,
      "entity-mentions": <EntityMentionsChart data={alerts} type="acts" />,
      "semantic-similarity": <SemanticSimilarityMatrix data={alerts} type="acts" />,
      "impact-urgency": <ImpactUrgencyMatrix data={alerts} type="acts" />,
      "compliance-deadline": <ComplianceDeadlineCalendar alerts={alerts} />,
    };

    // Split: first two charts full-width, then grid for the rest
    const topCharts = chartOrder.slice(0, 2);
    const gridCharts = chartOrder.slice(2);

    return (
        <>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          {/* Top two full-width charts (Keyword Trends + Impact vs Urgency Matrix) */}
          <SortableContext items={topCharts} strategy={verticalListSortingStrategy}>
            <div className="space-y-6 mb-6">
              {topCharts.map((chartId) => (
                <DraggableChart key={chartId} id={chartId}>
                  {chartComponents[chartId]}
                </DraggableChart>
              ))}
            </div>
          </SortableContext>

          {/* Grid charts for the rest */}
          <SortableContext items={gridCharts} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {gridCharts.map((chartId) => (
                <DraggableChart key={chartId} id={chartId} isGrid>
                  {chartComponents[chartId]}
                </DraggableChart>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </>
    );
  }

  // Bills charts
  const bills = data as BillItem[];

  // Bills by status
  const statusCounts: Record<string, number> = {};
  bills.forEach((b) => {
    statusCounts[b.status] = (statusCounts[b.status] || 0) + 1;
  });
  const statusData = Object.entries(statusCounts).map(([name, count]) => ({ name, count }));

  // Bills by chamber
  const chamberData = [
    { name: "House", value: bills.filter((b) => b.chamber === "House").length },
    { name: "Senate", value: bills.filter((b) => b.chamber === "Senate").length },
  ];

  // Risk distribution
  const riskData = [
    { name: "High", value: bills.filter((b) => b.risk_level === "high").length },
    { name: "Medium", value: bills.filter((b) => b.risk_level === "medium").length },
    { name: "Low", value: bills.filter((b) => b.risk_level === "low").length },
  ].filter((d) => d.value > 0);

  // Bills by portfolio (top 10)
  const portfolioCounts: Record<string, number> = {};
  bills.forEach((b) => {
    if (b.portfolio) {
      portfolioCounts[b.portfolio] = (portfolioCounts[b.portfolio] || 0) + 1;
    }
  });
  const portfolioData = Object.entries(portfolioCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Timeline (weekly aggregation)
  const weekCounts: Record<string, number> = {};
  bills.forEach((b) => {
    const date = new Date(b.lastActionDate);
    const weekStart = new Date(date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const key = weekStart.toISOString().split("T")[0];
    weekCounts[key] = (weekCounts[key] || 0) + 1;
  });
  const timelineData = Object.entries(weekCounts)
    .map(([date, count]) => ({ 
      date: new Date(date).toLocaleDateString("en-AU", { month: "short", day: "numeric" }), 
      count 
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const chartComponents: Record<string, React.ReactNode> = {
    "bills-status": (
      <Card>
        <CardHeader>
          <CardTitle>Proyectos por Estado</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 'dataMax']} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    ),
    "bills-chamber": (
      <Card>
        <CardHeader>
          <CardTitle>Proyectos por Cámara</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chamberData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chamberData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? "hsl(var(--primary))" : "hsl(var(--accent))"} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    ),
    "risk-distribution": (
      <Card>
        <CardHeader>
          <CardTitle>Risk Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    ),
    "portfolio-top10": (
      <Card>
        <CardHeader>
          <CardTitle>Proyectos por Cartera (Top 10)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={portfolioData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 'dataMax']} allowDecimals={false} />
              <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    ),
    "timeline-weekly": (
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Timeline (Weekly)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 'dataMax']} allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} name="Proyectos" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    ),
    "voting-analytics": <VotingAnalyticsChart bills={bills} />,
    "stakeholder-analysis": <StakeholderAnalysisChart bills={bills} />,
    "textual-trends": <TextualTrendsChart data={bills} type="bills" />,
    "sentiment-analysis": <SentimentAnalysisChart data={bills} type="bills" />,
    "topic-clusters": <TopicClustersChart data={bills} type="bills" />,
    "entity-mentions": <EntityMentionsChart data={bills} type="bills" />,
    "semantic-similarity": <SemanticSimilarityMatrix data={bills} type="bills" />,
    "impact-urgency": <ImpactUrgencyMatrix data={bills} type="bills" />,
    "bills-progress": <BillsProgressFunnel bills={bills} />,
    "people-of-interest": <PeopleOfInterestChart bills={bills} />,
  };

  // Split: first two charts full-width, then grid for the rest
  const topCharts = chartOrder.slice(0, 2);
  const gridCharts = chartOrder.slice(2);

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {/* Top two full-width charts (Keyword Trends + Impact vs Urgency Matrix) */}
        <SortableContext items={topCharts} strategy={verticalListSortingStrategy}>
          <div className="space-y-6 mb-6">
            {topCharts.map((chartId) => (
              <DraggableChart key={chartId} id={chartId}>
                {chartComponents[chartId]}
              </DraggableChart>
            ))}
          </div>
        </SortableContext>

        {/* Grid charts for the rest */}
        <SortableContext items={gridCharts} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {gridCharts.map((chartId) => (
              <DraggableChart key={chartId} id={chartId} isGrid>
                {chartComponents[chartId]}
              </DraggableChart>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </>
  );
}
