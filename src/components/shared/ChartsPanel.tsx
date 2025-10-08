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

interface ChartsPanelProps {
  data: Alert[] | BillItem[];
  type: "acts" | "bills";
}

const COLORS = {
  high: "hsl(var(--risk-high))",
  medium: "hsl(var(--risk-medium))",
  low: "hsl(var(--risk-low))",
};

export function ChartsPanel({ data, type }: ChartsPanelProps) {
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

    // Alerts by portfolio (top 10)
    const portfolioCounts: Record<string, number> = {};
    alerts.forEach((a) => {
      if (a.csv_portfolio) {
        portfolioCounts[a.csv_portfolio] = (portfolioCounts[a.csv_portfolio] || 0) + 1;
      }
    });
    const portfolioData = Object.entries(portfolioCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Timeline (weekly aggregation)
    const weekCounts: Record<string, number> = {};
    alerts.forEach((a) => {
      const date = parseDate(a.effective_date) || parseDate(a.registered_date);
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

    // Doc view mix
    const docViewData = [
      {
        name: "Compilation/Principal",
        value: alerts.filter((a) => a.doc_view === "Compilation/Principal").length,
      },
      {
        name: "Amending/As Made",
        value: alerts.filter((a) => a.doc_view === "Amending/As Made").length,
      },
    ].filter((d) => d.value > 0);


    return (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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

          <Card>
            <CardHeader>
              <CardTitle>Document View Mix</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={docViewData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {docViewData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "hsl(var(--primary))" : "hsl(var(--accent))"} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <TextualTrendsChart data={alerts} type="acts" />
          <SentimentAnalysisChart data={alerts} type="acts" />
          <TopicClustersChart data={alerts} type="acts" />
          <EntityMentionsChart data={alerts} type="acts" />
          <SemanticSimilarityMatrix data={alerts} type="acts" />
          <ImpactUrgencyMatrix data={alerts} type="acts" />
          <ComplianceDeadlineCalendar alerts={alerts} />
        </div>
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

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Bills by Status</CardTitle>
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

        <Card>
          <CardHeader>
            <CardTitle>Bills by Chamber</CardTitle>
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

        <Card>
          <CardHeader>
            <CardTitle>Bills by Portfolio (Top 10)</CardTitle>
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
                <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} name="Bills" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        <TextualTrendsChart data={bills} type="bills" />
        <SentimentAnalysisChart data={bills} type="bills" />
        <TopicClustersChart data={bills} type="bills" />
        <EntityMentionsChart data={bills} type="bills" />
        <SemanticSimilarityMatrix data={bills} type="bills" />
        <ImpactUrgencyMatrix data={bills} type="bills" />
        <BillsProgressFunnel bills={bills} />
        <PeopleOfInterestChart bills={bills} />
      </div>
    </>
  );
}
