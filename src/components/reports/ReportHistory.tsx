import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Download, 
  Mail, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Search,
  Building2,
  FileText,
  RefreshCw
} from "lucide-react";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";

interface ReportHistoryEntry {
  id: string;
  generatedAt: Date;
  clientId: string;
  clientName: string;
  reportType: 'daily' | 'weekly';
  status: 'sent' | 'failed' | 'downloaded';
  channels: ('email' | 'whatsapp' | 'download')[];
  alertCount: number;
  billsCount: number;
  normsCount: number;
}

// Mock history data
const MOCK_HISTORY: ReportHistoryEntry[] = [
  {
    id: '1',
    generatedAt: new Date(),
    clientId: 'client-1',
    clientName: 'FarmaSalud Perú S.A.C.',
    reportType: 'weekly',
    status: 'sent',
    channels: ['email', 'whatsapp'],
    alertCount: 15,
    billsCount: 10,
    normsCount: 5,
  },
  {
    id: '2',
    generatedAt: subDays(new Date(), 1),
    clientId: 'client-2',
    clientName: 'Minera Andina Corp',
    reportType: 'daily',
    status: 'sent',
    channels: ['email'],
    alertCount: 8,
    billsCount: 5,
    normsCount: 3,
  },
  {
    id: '3',
    generatedAt: subDays(new Date(), 2),
    clientId: 'client-1',
    clientName: 'FarmaSalud Perú S.A.C.',
    reportType: 'weekly',
    status: 'downloaded',
    channels: ['download'],
    alertCount: 12,
    billsCount: 8,
    normsCount: 4,
  },
  {
    id: '4',
    generatedAt: subDays(new Date(), 3),
    clientId: 'client-2',
    clientName: 'Minera Andina Corp',
    reportType: 'daily',
    status: 'failed',
    channels: ['email'],
    alertCount: 0,
    billsCount: 0,
    normsCount: 0,
  },
  {
    id: '5',
    generatedAt: subDays(new Date(), 7),
    clientId: 'client-1',
    clientName: 'FarmaSalud Perú S.A.C.',
    reportType: 'weekly',
    status: 'sent',
    channels: ['email', 'whatsapp'],
    alertCount: 18,
    billsCount: 12,
    normsCount: 6,
  },
];

const statusConfig = {
  sent: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Enviado' },
  downloaded: { icon: Download, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Descargado' },
  failed: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Fallido' },
};

export function ReportHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string>("all");

  const uniqueClients = [...new Set(MOCK_HISTORY.map(h => h.clientName))];

  const filteredHistory = MOCK_HISTORY.filter(entry => {
    if (searchTerm && !entry.clientName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (statusFilter !== 'all' && entry.status !== statusFilter) return false;
    if (clientFilter !== 'all' && entry.clientName !== clientFilter) return false;
    return true;
  });

  const totalSent = MOCK_HISTORY.filter(h => h.status === 'sent').length;
  const totalFailed = MOCK_HISTORY.filter(h => h.status === 'failed').length;
  const totalAlerts = MOCK_HISTORY.reduce((sum, h) => sum + h.alertCount, 0);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-foreground">{MOCK_HISTORY.length}</div>
            <div className="text-sm text-muted-foreground">Reportes Generados</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-emerald-400">{totalSent}</div>
            <div className="text-sm text-muted-foreground">Enviados Exitosamente</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-red-400">{totalFailed}</div>
            <div className="text-sm text-muted-foreground">Fallidos</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-400">{totalAlerts}</div>
            <div className="text-sm text-muted-foreground">Alertas Incluidas</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="sent">Enviados</SelectItem>
            <SelectItem value="downloaded">Descargados</SelectItem>
            <SelectItem value="failed">Fallidos</SelectItem>
          </SelectContent>
        </Select>
        <Select value={clientFilter} onValueChange={setClientFilter}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los clientes</SelectItem>
            {uniqueClients.map(client => (
              <SelectItem key={client} value={client}>{client}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* History List */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Historial de Reportes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredHistory.map(entry => {
              const status = statusConfig[entry.status];
              const StatusIcon = status.icon;

              return (
                <div key={entry.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{entry.clientName}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(entry.generatedAt, "PPP 'a las' p", { locale: es })}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs capitalize">
                          {entry.reportType}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {entry.billsCount} PLs • {entry.normsCount} Normas
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {entry.channels.includes('email') && (
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      )}
                      {entry.channels.includes('whatsapp') && (
                        <Phone className="h-4 w-4 text-muted-foreground" />
                      )}
                      {entry.channels.includes('download') && (
                        <Download className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    
                    <Badge className={`${status.bg} ${status.color} border-0`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.label}
                    </Badge>

                    {(entry.status === 'sent' || entry.status === 'downloaded') && (
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredHistory.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No se encontraron reportes con los filtros aplicados.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
