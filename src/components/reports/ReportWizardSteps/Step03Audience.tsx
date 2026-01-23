import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ReportConfig } from "../types";
import { MOCK_CLIENTS } from "@/data/peruAlertsMockData";
import { Building2, Search, Users } from "lucide-react";

interface Step03Props {
  config: ReportConfig;
  onUpdate: (updates: Partial<ReportConfig>) => void;
}

export function Step03Audience({ config, onUpdate }: Step03Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = MOCK_CLIENTS.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleClient = (clientId: string) => {
    const newClientIds = config.clientIds.includes(clientId)
      ? config.clientIds.filter(id => id !== clientId)
      : [...config.clientIds, clientId];
    onUpdate({ clientIds: newClientIds });
  };

  const selectAll = () => {
    onUpdate({ clientIds: MOCK_CLIENTS.map(c => c.id) });
  };

  const clearAll = () => {
    onUpdate({ clientIds: [] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Audiencia</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Seleccione los clientes para los que generará el reporte
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <button
          onClick={selectAll}
          className="text-sm text-primary hover:underline"
        >
          Seleccionar todos
        </button>
        <button
          onClick={clearAll}
          className="text-sm text-muted-foreground hover:underline"
        >
          Limpiar
        </button>
      </div>

      {config.clientIds.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {config.clientIds.map(clientId => {
            const client = MOCK_CLIENTS.find(c => c.id === clientId);
            return client ? (
              <Badge key={clientId} variant="secondary" className="gap-1">
                <Building2 className="h-3 w-3" />
                {client.name}
              </Badge>
            ) : null;
          })}
        </div>
      )}

      <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2">
        {filteredClients.map((client) => (
          <Label
            key={client.id}
            htmlFor={`client-${client.id}`}
            className="cursor-pointer"
          >
            <Card className={`transition-all hover:border-primary/50 ${
              config.clientIds.includes(client.id) 
                ? 'border-primary bg-primary/5' 
                : 'border-border/50'
            }`}>
              <CardContent className="flex items-center gap-4 p-4">
                <Checkbox
                  id={`client-${client.id}`}
                  checked={config.clientIds.includes(client.id)}
                  onCheckedChange={() => toggleClient(client.id)}
                />
                <div className="p-2 rounded-lg bg-primary/10">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-foreground">{client.name}</div>
                  <div className="text-sm text-muted-foreground">{client.sector}</div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{client.areas?.length || 0} áreas</span>
                </div>
              </CardContent>
            </Card>
          </Label>
        ))}
      </div>
    </div>
  );
}
