import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  FileText, 
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react";
import { ClientImpactMatrix } from "./ClientImpactMatrix";
import { ClientComparisonChart } from "./ClientComparisonChart";
import { ClientDistributionCharts } from "./ClientDistributionCharts";
import { 
  AnalyticsGlobalFilters, 
  AnalyticsFilters, 
  DEFAULT_ANALYTICS_FILTERS 
} from "./AnalyticsGlobalFilters";

// Type definitions for matrix items
type ImpactLevel = 'high' | 'medium' | 'low';
type UrgencyLevel = 'high' | 'medium' | 'low';

interface MatrixItem {
  id: string;
  title: string;
  impact: ImpactLevel;
  urgency: UrgencyLevel;
}

interface ClientAnalyticsData {
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
  distribution: {
    byType: Record<string, number>;
    byArea: Record<string, number>;
    byStage: Record<string, number>;
  };
  matrix: MatrixItem[];
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

// Mock client data for analytics
const MOCK_CLIENTS_ANALYTICS: ClientAnalyticsData[] = [
  {
    id: '1',
    name: 'Banco del Pacífico S.A.',
    sector: 'Banca y Finanzas',
    alerts: {
      total: 47,
      highImpact: 12,
      highUrgency: 8,
      pending: 15,
      published: 28,
      declined: 4
    },
    distribution: {
      byType: { 'Proyecto de Ley': 23, 'Decreto Supremo': 12, 'Resolución': 8, 'Otro': 4 },
      byArea: { 'Legal': 18, 'Compliance': 15, 'Finanzas': 10, 'Operaciones': 4 },
      byStage: { 'Comisión': 12, 'Pleno': 8, 'Publicado': 20, 'Presentado': 7 }
    },
    matrix: [
      { id: '1', title: 'Ley de Protección de Datos Financieros', impact: 'high' as ImpactLevel, urgency: 'high' as UrgencyLevel },
      { id: '2', title: 'Modificación Ley de Bancos', impact: 'high' as ImpactLevel, urgency: 'medium' as UrgencyLevel },
      { id: '3', title: 'Normativa Ciberseguridad', impact: 'high' as ImpactLevel, urgency: 'low' as UrgencyLevel },
      { id: '4', title: 'Regulación Fintech', impact: 'medium' as ImpactLevel, urgency: 'high' as UrgencyLevel },
      { id: '5', title: 'Tasas de Interés', impact: 'medium' as ImpactLevel, urgency: 'medium' as UrgencyLevel },
      { id: '6', title: 'Reporting BCRP', impact: 'low' as ImpactLevel, urgency: 'high' as UrgencyLevel },
      { id: '7', title: 'Actualización KYC', impact: 'medium' as ImpactLevel, urgency: 'low' as UrgencyLevel },
      { id: '8', title: 'Formato Estados Financieros', impact: 'low' as ImpactLevel, urgency: 'low' as UrgencyLevel },
    ],
    trend: 'up',
    trendValue: 12
  },
  {
    id: '2',
    name: 'Minera Andina Corp.',
    sector: 'Minería',
    alerts: {
      total: 32,
      highImpact: 8,
      highUrgency: 5,
      pending: 10,
      published: 19,
      declined: 3
    },
    distribution: {
      byType: { 'Proyecto de Ley': 15, 'Decreto Supremo': 10, 'Resolución': 5, 'Otro': 2 },
      byArea: { 'Legal': 12, 'Operaciones': 10, 'Ambiental': 8, 'Comunidades': 2 },
      byStage: { 'Comisión': 8, 'Pleno': 5, 'Publicado': 15, 'Presentado': 4 }
    },
    matrix: [
      { id: '1', title: 'Ley de Canon Minero', impact: 'high' as ImpactLevel, urgency: 'high' as UrgencyLevel },
      { id: '2', title: 'Regulación Ambiental Minería', impact: 'high' as ImpactLevel, urgency: 'medium' as UrgencyLevel },
      { id: '3', title: 'Consulta Previa', impact: 'high' as ImpactLevel, urgency: 'low' as UrgencyLevel },
      { id: '4', title: 'Fiscalización OEFA', impact: 'medium' as ImpactLevel, urgency: 'high' as UrgencyLevel },
      { id: '5', title: 'Regalías Mineras', impact: 'medium' as ImpactLevel, urgency: 'medium' as UrgencyLevel },
      { id: '6', title: 'Cierre de Minas', impact: 'low' as ImpactLevel, urgency: 'medium' as UrgencyLevel },
    ],
    trend: 'down',
    trendValue: 5
  },
  {
    id: '3',
    name: 'Telecom Perú S.A.C.',
    sector: 'Telecomunicaciones',
    alerts: {
      total: 28,
      highImpact: 6,
      highUrgency: 4,
      pending: 8,
      published: 18,
      declined: 2
    },
    distribution: {
      byType: { 'Proyecto de Ley': 12, 'Decreto Supremo': 8, 'Resolución': 6, 'Otro': 2 },
      byArea: { 'Legal': 10, 'Regulatorio': 8, 'IT': 6, 'Operaciones': 4 },
      byStage: { 'Comisión': 6, 'Pleno': 4, 'Publicado': 14, 'Presentado': 4 }
    },
    matrix: [
      { id: '1', title: 'Ley de Banda Ancha', impact: 'high' as ImpactLevel, urgency: 'medium' as UrgencyLevel },
      { id: '2', title: 'Espectro 5G', impact: 'high' as ImpactLevel, urgency: 'high' as UrgencyLevel },
      { id: '3', title: 'Protección al Consumidor Telecom', impact: 'medium' as ImpactLevel, urgency: 'medium' as UrgencyLevel },
      { id: '4', title: 'Portabilidad Numérica', impact: 'low' as ImpactLevel, urgency: 'high' as UrgencyLevel },
      { id: '5', title: 'Tarifas de Interconexión', impact: 'medium' as ImpactLevel, urgency: 'low' as UrgencyLevel },
    ],
    trend: 'stable',
    trendValue: 0
  },
  {
    id: '4',
    name: 'Seguros Continental',
    sector: 'Seguros',
    alerts: {
      total: 21,
      highImpact: 5,
      highUrgency: 3,
      pending: 6,
      published: 13,
      declined: 2
    },
    distribution: {
      byType: { 'Proyecto de Ley': 8, 'Decreto Supremo': 7, 'Resolución': 4, 'Otro': 2 },
      byArea: { 'Legal': 8, 'Compliance': 6, 'Actuarial': 4, 'Comercial': 3 },
      byStage: { 'Comisión': 4, 'Pleno': 3, 'Publicado': 12, 'Presentado': 2 }
    },
    matrix: [
      { id: '1', title: 'Solvencia II Adaptación', impact: 'high' as ImpactLevel, urgency: 'high' as UrgencyLevel },
      { id: '2', title: 'Seguros Obligatorios', impact: 'high' as ImpactLevel, urgency: 'medium' as UrgencyLevel },
      { id: '3', title: 'Protección Asegurado', impact: 'medium' as ImpactLevel, urgency: 'medium' as UrgencyLevel },
      { id: '4', title: 'Reservas Técnicas', impact: 'medium' as ImpactLevel, urgency: 'low' as UrgencyLevel },
    ],
    trend: 'up',
    trendValue: 8
  }
];

export function ClientAnalyticsDashboard() {
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [comparisonClients, setComparisonClients] = useState<string[]>(['1', '2']);
  const [globalFilters, setGlobalFilters] = useState<AnalyticsFilters>(DEFAULT_ANALYTICS_FILTERS);

  // Convert mock clients for filter component
  const availableClients = MOCK_CLIENTS_ANALYTICS.map(c => ({ id: c.id, name: c.name }));

  // Apply global filters to data (for now, filters affect the display context)
  const filteredClientsData = useMemo(() => {
    let data = MOCK_CLIENTS_ANALYTICS;
    
    // Filter by selected clients
    if (globalFilters.clients.length > 0) {
      data = data.filter(c => globalFilters.clients.includes(c.id));
    }
    
    // Filter by sectors
    if (globalFilters.sectors.length > 0) {
      data = data.filter(c => globalFilters.sectors.includes(c.sector));
    }

    return data;
  }, [globalFilters]);

  const selectedClientData = selectedClient === 'all' 
    ? null 
    : filteredClientsData.find(c => c.id === selectedClient);

  const comparisonData = filteredClientsData.filter(c => comparisonClients.includes(c.id));

  const totalStats = useMemo(() => ({
    totalAlerts: filteredClientsData.reduce((sum, c) => sum + c.alerts.total, 0),
    highImpact: filteredClientsData.reduce((sum, c) => sum + c.alerts.highImpact, 0),
    highUrgency: filteredClientsData.reduce((sum, c) => sum + c.alerts.highUrgency, 0),
    pending: filteredClientsData.reduce((sum, c) => sum + c.alerts.pending, 0),
  }), [filteredClientsData]);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="h-4 w-4 text-emerald-400" />;
      case 'down': return <ArrowDownRight className="h-4 w-4 text-red-400" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Comparación de clientes y análisis de impacto</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="w-[250px] bg-background/50">
              <SelectValue placeholder="Seleccionar cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Clientes (Vista General)</SelectItem>
              {filteredClientsData.map(client => (
                <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="outline" className="bg-primary/10 border-primary/30">
            Perú
          </Badge>
        </div>
      </div>

      {/* Global Filters */}
      <AnalyticsGlobalFilters
        filters={globalFilters}
        onFiltersChange={setGlobalFilters}
        availableClients={availableClients}
      />

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="glass-card border-border/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-foreground">
                  {selectedClientData ? selectedClientData.alerts.total : totalStats.totalAlerts}
                </div>
                <div className="text-sm text-muted-foreground">Total Alerts</div>
              </div>
              <FileText className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-red-400">
                  {selectedClientData ? selectedClientData.alerts.highImpact : totalStats.highImpact}
                </div>
                <div className="text-sm text-muted-foreground">High Impact</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-amber-400">
                  {selectedClientData ? selectedClientData.alerts.highUrgency : totalStats.highUrgency}
                </div>
                <div className="text-sm text-muted-foreground">High Urgency</div>
              </div>
              <TrendingUp className="h-8 w-8 text-amber-400/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-400">
                  {selectedClientData ? selectedClientData.alerts.pending : totalStats.pending}
                </div>
                <div className="text-sm text-muted-foreground">Pending Review</div>
              </div>
              <Users className="h-8 w-8 text-blue-400/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="matrix" className="space-y-4">
        <TabsList className="bg-background/50">
          <TabsTrigger value="matrix">Impact Matrix</TabsTrigger>
          <TabsTrigger value="comparison">Client Comparison</TabsTrigger>
          <TabsTrigger value="distribution">Distribution Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="matrix" className="space-y-4">
          {selectedClient === 'all' ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredClientsData.map(client => (
                <ClientImpactMatrix 
                  key={client.id} 
                  client={client} 
                  compact 
                />
              ))}
            </div>
          ) : selectedClientData ? (
            <ClientImpactMatrix client={selectedClientData} />
          ) : null}
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card className="glass-card border-border/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Comparación de Clientes
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Comparar:</span>
                  {filteredClientsData.map(client => (
                    <Badge
                      key={client.id}
                      variant={comparisonClients.includes(client.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        if (comparisonClients.includes(client.id)) {
                          setComparisonClients(comparisonClients.filter(id => id !== client.id));
                        } else {
                          setComparisonClients([...comparisonClients, client.id]);
                        }
                      }}
                    >
                      {client.name.split(' ')[0]}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ClientComparisonChart clients={comparisonData} />
            </CardContent>
          </Card>

          {/* Client Cards for Quick Comparison */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredClientsData.map(client => (
              <Card 
                key={client.id} 
                className={`glass-card border-border/30 cursor-pointer transition-all ${
                  comparisonClients.includes(client.id) ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => {
                  if (comparisonClients.includes(client.id)) {
                    setComparisonClients(comparisonClients.filter(id => id !== client.id));
                  } else {
                    setComparisonClients([...comparisonClients, client.id]);
                  }
                }}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-sm text-foreground line-clamp-1">{client.name}</h3>
                      <p className="text-xs text-muted-foreground">{client.sector}</p>
                    </div>
                    {getTrendIcon(client.trend)}
                  </div>
                  <div className="space-y-1 mt-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Alertas</span>
                      <span className="font-medium">{client.alerts.total}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Alto Impacto</span>
                      <span className="font-medium text-red-400">{client.alerts.highImpact}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Alta Urgencia</span>
                      <span className="font-medium text-amber-400">{client.alerts.highUrgency}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Pendientes</span>
                      <span className="font-medium text-blue-400">{client.alerts.pending}</span>
                    </div>
                  </div>
                  {client.trendValue !== 0 && (
                    <div className={`mt-2 text-xs ${client.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {client.trend === 'up' ? '+' : '-'}{Math.abs(client.trendValue)}% vs mes anterior
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <ClientDistributionCharts 
            clients={filteredClientsData} 
            selectedClient={selectedClient}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
