import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Building2, 
  Settings, 
  Search, 
  CheckCircle2, 
  XCircle,
  Clock,
  Mail,
  Phone
} from "lucide-react";
import { MOCK_CLIENTS } from "@/data/peruAlertsMockData";
import { ReportConfigDialog } from "./ReportConfigDialog";

// Mock report configs per client
const MOCK_REPORT_CONFIGS: Record<string, {
  isConfigured: boolean;
  frequency: 'daily' | 'weekly';
  weeklyDay?: number;
  scheduleTime: string;
  emailRecipients: string[];
  whatsappRecipients: string[];
  lastSent?: string;
}> = {
  'client-1': {
    isConfigured: true,
    frequency: 'weekly',
    weeklyDay: 1,
    scheduleTime: '08:00',
    emailRecipients: ['legal@farmasalud.pe', 'compliance@farmasalud.pe'],
    whatsappRecipients: ['+51 999 123 456'],
    lastSent: '20/01/2026',
  },
  'client-2': {
    isConfigured: true,
    frequency: 'daily',
    scheduleTime: '07:00',
    emailRecipients: ['regulatorio@mineraandina.com'],
    whatsappRecipients: [],
    lastSent: '22/01/2026',
  },
  'client-3': {
    isConfigured: false,
    frequency: 'weekly',
    scheduleTime: '08:00',
    emailRecipients: [],
    whatsappRecipients: [],
  },
};

const WEEKDAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export function ReportClientConfigs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const filteredClients = MOCK_CLIENTS.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const configuredCount = Object.values(MOCK_REPORT_CONFIGS).filter(c => c.isConfigured).length;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-foreground">{MOCK_CLIENTS.length}</div>
            <div className="text-sm text-muted-foreground">Clientes Totales</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-emerald-400">{configuredCount}</div>
            <div className="text-sm text-muted-foreground">Reportes Configurados</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-amber-400">{MOCK_CLIENTS.length - configuredCount}</div>
            <div className="text-sm text-muted-foreground">Pendientes de Configurar</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Client List */}
      <div className="space-y-3">
        {filteredClients.map(client => {
          const config = MOCK_REPORT_CONFIGS[client.id];
          const isConfigured = config?.isConfigured || false;

          return (
            <Card key={client.id} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{client.name}</div>
                      <div className="text-sm text-muted-foreground">{client.sector}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {isConfigured ? (
                      <>
                        <div className="text-right text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {config.frequency === 'daily' 
                              ? `Diario a las ${config.scheduleTime}`
                              : `${WEEKDAYS[config.weeklyDay || 1]} a las ${config.scheduleTime}`
                            }
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {config.emailRecipients.length > 0 && (
                              <Badge variant="outline" className="text-xs gap-1">
                                <Mail className="h-3 w-3" />
                                {config.emailRecipients.length}
                              </Badge>
                            )}
                            {config.whatsappRecipients.length > 0 && (
                              <Badge variant="outline" className="text-xs gap-1">
                                <Phone className="h-3 w-3" />
                                {config.whatsappRecipients.length}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-0">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Configurado
                        </Badge>
                      </>
                    ) : (
                      <Badge className="bg-amber-500/10 text-amber-400 border-0">
                        <XCircle className="h-3 w-3 mr-1" />
                        Sin Configurar
                      </Badge>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedClientId(client.id)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configurar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Config Dialog */}
      <ReportConfigDialog
        clientId={selectedClientId}
        clientName={MOCK_CLIENTS.find(c => c.id === selectedClientId)?.name || ''}
        open={!!selectedClientId}
        onOpenChange={(open) => !open && setSelectedClientId(null)}
      />
    </div>
  );
}
