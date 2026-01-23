import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { ClientAlertTimelineChart } from './ClientAlertTimelineChart';

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

interface ClientComparisonChartProps {
  clients: ClientData[];
}

const COLORS = ['hsl(var(--primary))', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'];

export function ClientComparisonChart({ clients }: ClientComparisonChartProps) {
  if (clients.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        Select clients to compare
      </div>
    );
  }

  // Bar chart data
  const barData = clients.map((client, index) => ({
    name: client.name.split(' ')[0],
    fullName: client.name,
    total: client.alerts.total,
    highImpact: client.alerts.highImpact,
    highUrgency: client.alerts.highUrgency,
    pending: client.alerts.pending,
    published: client.alerts.published,
  }));

  // Radar chart data
  const radarData = [
    { metric: 'Total Alerts', ...Object.fromEntries(clients.map(c => [c.name.split(' ')[0], c.alerts.total])) },
    { metric: 'High Impact', ...Object.fromEntries(clients.map(c => [c.name.split(' ')[0], c.alerts.highImpact * 5])) },
    { metric: 'High Urgency', ...Object.fromEntries(clients.map(c => [c.name.split(' ')[0], c.alerts.highUrgency * 5])) },
    { metric: 'Pending', ...Object.fromEntries(clients.map(c => [c.name.split(' ')[0], c.alerts.pending * 3])) },
    { metric: 'Published', ...Object.fromEntries(clients.map(c => [c.name.split(' ')[0], c.alerts.published])) },
  ];

  const clientKeys = clients.map(c => c.name.split(' ')[0]);

  return (
    <div className="space-y-8">
      {/* Timeline Chart - Alert Evolution */}
      <ClientAlertTimelineChart clients={clients} />

      {/* Bar Chart - Alerts Comparison */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-4">Alert Volume Comparison</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend />
            <Bar dataKey="total" name="Total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="highImpact" name="High Impact" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="highUrgency" name="High Urgency" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pending" name="Pending" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Radar Chart - Profile Comparison */}
      {clients.length >= 2 && (
        <div>
          <h4 className="text-sm font-medium text-foreground mb-4">Profile Comparison (Radar)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis 
                dataKey="metric" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 'auto']}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              />
              {clientKeys.map((key, index) => (
                <Radar
                  key={key}
                  name={key}
                  dataKey={key}
                  stroke={COLORS[index % COLORS.length]}
                  fill={COLORS[index % COLORS.length]}
                  fillOpacity={0.2}
                />
              ))}
              <Legend />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Summary Table */}
      <div className="overflow-x-auto">
        <h4 className="text-sm font-medium text-foreground mb-4">Detailed Comparison</h4>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left py-2 px-3 text-muted-foreground font-medium">Client</th>
              <th className="text-center py-2 px-3 text-muted-foreground font-medium">Total</th>
              <th className="text-center py-2 px-3 text-muted-foreground font-medium">High Impact</th>
              <th className="text-center py-2 px-3 text-muted-foreground font-medium">High Urgency</th>
              <th className="text-center py-2 px-3 text-muted-foreground font-medium">Pending</th>
              <th className="text-center py-2 px-3 text-muted-foreground font-medium">Published</th>
              <th className="text-center py-2 px-3 text-muted-foreground font-medium">Declined</th>
              <th className="text-center py-2 px-3 text-muted-foreground font-medium">% Critical</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => {
              const criticalPercent = client.alerts.total > 0 
                ? Math.round((client.alerts.highImpact / client.alerts.total) * 100) 
                : 0;
              return (
                <tr key={client.id} className="border-b border-border/20 hover:bg-muted/10">
                  <td className="py-2 px-3">
                    <div className="font-medium text-foreground">{client.name.split(' ').slice(0, 2).join(' ')}</div>
                    <div className="text-xs text-muted-foreground">{client.sector}</div>
                  </td>
                  <td className="text-center py-2 px-3 font-medium">{client.alerts.total}</td>
                  <td className="text-center py-2 px-3 text-red-400 font-medium">{client.alerts.highImpact}</td>
                  <td className="text-center py-2 px-3 text-amber-400 font-medium">{client.alerts.highUrgency}</td>
                  <td className="text-center py-2 px-3 text-blue-400 font-medium">{client.alerts.pending}</td>
                  <td className="text-center py-2 px-3 text-emerald-400 font-medium">{client.alerts.published}</td>
                  <td className="text-center py-2 px-3 text-muted-foreground">{client.alerts.declined}</td>
                  <td className="text-center py-2 px-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      criticalPercent > 30 ? 'bg-red-500/20 text-red-400' :
                      criticalPercent > 15 ? 'bg-amber-500/20 text-amber-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {criticalPercent}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
