import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Briefcase, MapPin } from "lucide-react";

export interface AffectedClient {
  id: string;
  name: string;
  sector: string;
  areas: string[];
  matchScore: number; // 0-100
}

interface AffectedClientsListProps {
  clients: AffectedClient[];
  selectedClients: string[];
  onClientToggle: (clientId: string) => void;
}

export function AffectedClientsList({ clients, selectedClients, onClientToggle }: AffectedClientsListProps) {
  if (!clients || clients.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Clientes Afectados
        </h3>
        <Badge variant="secondary" className="ml-auto text-xs">
          {clients.length} clientes
        </Badge>
      </div>
      
      <div className="space-y-2">
        {clients.map((client) => {
          const isSelected = selectedClients.includes(client.id);
          
          return (
            <div 
              key={client.id} 
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => onClientToggle(client.id)}
            >
              <Checkbox 
                checked={isSelected}
                onCheckedChange={() => onClientToggle(client.id)}
                className="mt-0.5"
              />
              
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground truncate">
                    {client.name}
                  </p>
                  <Badge 
                    variant="outline" 
                    className={
                      client.matchScore >= 80 
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" 
                        : client.matchScore >= 50 
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    }
                  >
                    {client.matchScore}% match
                  </Badge>
                </div>
                
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    <span>{client.sector}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {client.areas.slice(0, 3).map((area) => (
                    <Badge key={area} variant="secondary" className="text-xs bg-muted/50">
                      {area}
                    </Badge>
                  ))}
                  {client.areas.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-muted/50">
                      +{client.areas.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
