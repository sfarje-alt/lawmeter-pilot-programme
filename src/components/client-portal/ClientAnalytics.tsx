import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, TrendingUp, AlertTriangle, Scale, FileText, 
  Eye, Calendar, Target, PieChart
} from "lucide-react";
import { useClientUser } from "@/hooks/useClientUser";
import { ALL_MOCK_ALERTS, IMPACT_LEVELS, PeruAlert } from "@/data/peruAlertsMockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartPie, Pie, Cell } from "recharts";

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export function ClientAnalytics() {
  const { clientId, clientName } = useClientUser();

  // Filter only published alerts for this client
  const clientAlerts = useMemo(() => {
    return ALL_MOCK_ALERTS.filter(alert => 
      alert.status === "published" && 
      (alert.client_id === clientId || alert.primary_client_id === clientId)
    );
  }, [clientId]);

  // KPIs
  const kpis = useMemo(() => {
    const bills = clientAlerts.filter(a => a.legislation_type === "proyecto_de_ley");
    const regulations = clientAlerts.filter(a => a.legislation_type === "norma");
    const highImpact = clientAlerts.filter(a => a.impact_level === "grave" || a.impact_level === "medio");
    
    return {
      total: clientAlerts.length,
      bills: bills.length,
      regulations: regulations.length,
      highImpact: highImpact.length,
    };
  }, [clientAlerts]);

  // Data by area
  const areaData = useMemo(() => {
    const counts: Record<string, number> = {};
    clientAlerts.forEach(alert => {
      alert.affected_areas.forEach(area => {
        counts[area] = (counts[area] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [clientAlerts]);

  // Data by impact
  const impactData = useMemo(() => {
    const counts: Record<string, number> = {};
    clientAlerts.forEach(alert => {
      const level = alert.impact_level || "leve";
      counts[level] = (counts[level] || 0) + 1;
    });
    return IMPACT_LEVELS.map(level => ({
      name: level.label,
      value: counts[level.value] || 0,
    })).filter(d => d.value > 0);
  }, [clientAlerts]);

  // Data by type
  const typeData = useMemo(() => {
    const bills = clientAlerts.filter(a => a.legislation_type === "proyecto_de_ley").length;
    const regulations = clientAlerts.filter(a => a.legislation_type === "norma").length;
    return [
      { name: "Proyectos de Ley", value: bills },
      { name: "Normas", value: regulations },
    ].filter(d => d.value > 0);
  }, [clientAlerts]);

  // Monthly trend (mock)
  const monthlyTrend = useMemo(() => {
    return [
      { month: "Oct", alertas: 8 },
      { month: "Nov", alertas: 12 },
      { month: "Dic", alertas: 15 },
      { month: "Ene", alertas: clientAlerts.length || 10 },
    ];
  }, [clientAlerts]);

  const KPICard = ({ title, value, icon: Icon, description, color }: { 
    title: string; 
    value: number; 
    icon: React.ElementType; 
    description: string;
    color: string;
  }) => (
    <Card className="bg-card/50 border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className={`h-10 w-10 rounded-lg ${color} flex items-center justify-center`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">
            Métricas y análisis de alertas para {clientName || "tu organización"}
          </p>
        </div>
        <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-500">
          <Eye className="h-3 w-3 mr-1" />
          Solo Lectura
        </Badge>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Total Alertas" 
          value={kpis.total} 
          icon={BarChart3} 
          description="Alertas publicadas"
          color="bg-primary/20 text-primary"
        />
        <KPICard 
          title="Proyectos de Ley" 
          value={kpis.bills} 
          icon={Scale} 
          description="En seguimiento"
          color="bg-blue-500/20 text-blue-500"
        />
        <KPICard 
          title="Normas" 
          value={kpis.regulations} 
          icon={FileText} 
          description="Publicadas"
          color="bg-emerald-500/20 text-emerald-500"
        />
        <KPICard 
          title="Alto Impacto" 
          value={kpis.highImpact} 
          icon={AlertTriangle} 
          description="Requieren atención"
          color="bg-red-500/20 text-red-500"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Tendencia de Alertas
            </CardTitle>
            <CardDescription>Alertas publicadas por mes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="alertas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Areas Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Distribución por Área
            </CardTitle>
            <CardDescription>Alertas por área afectada</CardDescription>
          </CardHeader>
          <CardContent>
            {areaData.length > 0 ? (
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={areaData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                      width={100}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                Sin datos disponibles
              </div>
            )}
          </CardContent>
        </Card>

        {/* Type Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <PieChart className="h-4 w-4 text-primary" />
              Tipo de Legislación
            </CardTitle>
            <CardDescription>Proyectos de Ley vs Normas</CardDescription>
          </CardHeader>
          <CardContent>
            {typeData.length > 0 ? (
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartPie>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartPie>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                Sin datos disponibles
              </div>
            )}
          </CardContent>
        </Card>

        {/* Impact Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-primary" />
              Nivel de Impacto
            </CardTitle>
            <CardDescription>Distribución por severidad</CardDescription>
          </CardHeader>
          <CardContent>
            {impactData.length > 0 ? (
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartPie>
                    <Pie
                      data={impactData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {impactData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={
                            entry.name === "Grave" ? "hsl(0, 70%, 50%)" :
                            entry.name === "Medio" ? "hsl(45, 80%, 50%)" :
                            entry.name === "Leve" ? "hsl(220, 20%, 60%)" :
                            "hsl(140, 60%, 50%)"
                          } 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartPie>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                Sin datos disponibles
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
