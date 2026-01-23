import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Filter, TrendingUp } from "lucide-react";

// Alert time series data point
interface AlertTimePoint {
  date: string;
  [clientKey: string]: number | string;
}

// Client data structure
interface ClientData {
  id: string;
  name: string;
  sector: string;
  alerts: {
    total: number;
    highImpact: number;
    highUrgency: number;
    pending: number;
    published: number;
    declined: number;
  };
}

interface ClientAlertTimelineChartProps {
  clients: ClientData[];
}

// Generate mock time series data for each client
function generateMockTimeSeriesData(clients: ClientData[]): {
  total: AlertTimePoint[];
  highImpact: AlertTimePoint[];
  highUrgency: AlertTimePoint[];
  pending: AlertTimePoint[];
  published: AlertTimePoint[];
} {
  const months = [
    "Ago 2024", "Sep 2024", "Oct 2024", "Nov 2024", "Dic 2024",
    "Ene 2025"
  ];

  const generateSeries = (baseMultiplier: (client: ClientData) => number): AlertTimePoint[] => {
    return months.map((month, idx) => {
      const point: AlertTimePoint = { date: month };
      clients.forEach((client) => {
        const base = baseMultiplier(client);
        // Add some variance to make it look realistic
        const variance = Math.sin(idx * 0.8 + parseInt(client.id)) * (base * 0.3);
        const trend = idx * (base * 0.05); // Slight upward trend
        point[client.name.split(" ")[0]] = Math.max(0, Math.round(base + variance + trend));
      });
      return point;
    });
  };

  return {
    total: generateSeries((c) => c.alerts.total / 6),
    highImpact: generateSeries((c) => c.alerts.highImpact / 6),
    highUrgency: generateSeries((c) => c.alerts.highUrgency / 6),
    pending: generateSeries((c) => c.alerts.pending / 6),
    published: generateSeries((c) => c.alerts.published / 6),
  };
}

const COLORS = [
  "hsl(var(--primary))",
  "#f59e0b",
  "#10b981",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f43f5e",
];

type MetricType = "total" | "highImpact" | "highUrgency" | "pending" | "published";

const METRIC_OPTIONS: { value: MetricType; label: string; description: string }[] = [
  { value: "total", label: "Total de Alertas", description: "Todas las alertas" },
  { value: "highImpact", label: "Alto Impacto", description: "Alertas de alto impacto" },
  { value: "highUrgency", label: "Alta Urgencia", description: "Alertas de alta urgencia" },
  { value: "pending", label: "Pendientes", description: "Alertas en revisión" },
  { value: "published", label: "Publicadas", description: "Alertas publicadas" },
];

const TIME_RANGES = [
  { value: "3m", label: "3 meses" },
  { value: "6m", label: "6 meses" },
  { value: "1y", label: "1 año" },
];

export function ClientAlertTimelineChart({ clients }: ClientAlertTimelineChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("total");
  const [timeRange, setTimeRange] = useState<string>("6m");
  const [visibleClients, setVisibleClients] = useState<string[]>(
    clients.map((c) => c.name.split(" ")[0])
  );

  const timeSeriesData = useMemo(() => generateMockTimeSeriesData(clients), [clients]);

  const chartData = useMemo(() => {
    const data = timeSeriesData[selectedMetric];
    // Filter by time range
    if (timeRange === "3m") {
      return data.slice(-3);
    } else if (timeRange === "6m") {
      return data.slice(-6);
    }
    return data;
  }, [timeSeriesData, selectedMetric, timeRange]);

  const clientKeys = clients.map((c) => c.name.split(" ")[0]);

  const toggleClient = (clientKey: string) => {
    setVisibleClients((prev) =>
      prev.includes(clientKey)
        ? prev.filter((c) => c !== clientKey)
        : [...prev, clientKey]
    );
  };

  if (clients.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        Seleccione clientes para comparar
      </div>
    );
  }

  const currentMetric = METRIC_OPTIONS.find((m) => m.value === selectedMetric);

  return (
    <div className="space-y-4">
      {/* Header with title and description */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <div>
            <h4 className="text-sm font-medium text-foreground">
              Evolución Temporal de Alertas
            </h4>
            <p className="text-xs text-muted-foreground">
              {currentMetric?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filtrar por:</span>
        </div>

        {/* Metric selector */}
        <Select value={selectedMetric} onValueChange={(v) => setSelectedMetric(v as MetricType)}>
          <SelectTrigger className="w-[180px] h-8">
            <SelectValue placeholder="Métrica" />
          </SelectTrigger>
          <SelectContent>
            {METRIC_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Time range selector */}
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[120px] h-8">
            <Calendar className="h-3 w-3 mr-2" />
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            {TIME_RANGES.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Client toggles */}
        <div className="flex items-center gap-2 ml-auto flex-wrap">
          <span className="text-xs text-muted-foreground">Clientes:</span>
          {clientKeys.map((key, index) => (
            <Badge
              key={key}
              variant={visibleClients.includes(key) ? "default" : "outline"}
              className="cursor-pointer text-xs"
              style={{
                backgroundColor: visibleClients.includes(key)
                  ? COLORS[index % COLORS.length]
                  : undefined,
                borderColor: COLORS[index % COLORS.length],
                color: visibleClients.includes(key) ? "white" : COLORS[index % COLORS.length],
              }}
              onClick={() => toggleClient(key)}
            >
              {key}
            </Badge>
          ))}
        </div>
      </div>

      {/* Line Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            dataKey="date"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <YAxis
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
          {clientKeys.map((key, index) =>
            visibleClients.includes(key) ? (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={{ fill: COLORS[index % COLORS.length], strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: "white" }}
                name={key}
              />
            ) : null
          )}
        </LineChart>
      </ResponsiveContainer>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {clients.slice(0, 4).map((client, index) => {
          const clientKey = client.name.split(" ")[0];
          const lastValue = chartData.length > 0 
            ? (chartData[chartData.length - 1][clientKey] as number) || 0 
            : 0;
          const firstValue = chartData.length > 1 
            ? (chartData[0][clientKey] as number) || 0 
            : 0;
          const change = firstValue > 0 ? Math.round(((lastValue - firstValue) / firstValue) * 100) : 0;

          return (
            <div
              key={client.id}
              className="p-3 rounded-lg bg-muted/20 border border-border/30"
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-xs font-medium truncate">{clientKey}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold">{lastValue}</span>
                <span
                  className={`text-xs ${
                    change > 0 ? "text-red-400" : change < 0 ? "text-emerald-400" : "text-muted-foreground"
                  }`}
                >
                  {change > 0 ? "+" : ""}
                  {change}%
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{currentMetric?.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
