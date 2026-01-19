import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { ClientProfile } from "../types";

interface Step5Props {
  data: ClientProfile;
  onChange: (data: Partial<ClientProfile>) => void;
}

const STAKEHOLDERS = [
  'Accionistas',
  'Clientes',
  'Empleados',
  'Proveedores',
  'Reguladores',
  'Comunidad',
  'Inversionistas',
  'Socios comerciales',
  'Directorio',
  'Gerencia',
];

export function Step5PriorityLogic({ data, onChange }: Step5Props) {
  const toggleStakeholder = (stakeholder: string) => {
    if (data.stakeholdersAffected.includes(stakeholder)) {
      onChange({ stakeholdersAffected: data.stakeholdersAffected.filter(s => s !== stakeholder) });
    } else {
      onChange({ stakeholdersAffected: [...data.stakeholdersAffected, stakeholder] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Priority Logic</h2>
        <p className="text-sm text-muted-foreground">
          Define how to prioritize alerts based on stakeholders and business impact
        </p>
      </div>

      {/* Stakeholders Affected */}
      <div className="space-y-2">
        <Label>Stakeholders Affected</Label>
        <p className="text-xs text-muted-foreground mb-2">
          Select the stakeholders whose interests should be considered when prioritizing alerts
        </p>
        <div className="flex flex-wrap gap-2">
          {STAKEHOLDERS.map((stakeholder) => (
            <Badge
              key={stakeholder}
              variant={data.stakeholdersAffected.includes(stakeholder) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleStakeholder(stakeholder)}
            >
              {stakeholder}
            </Badge>
          ))}
        </div>
      </div>

      {/* High Impact Definition */}
      <div className="space-y-2">
        <Label htmlFor="highImpact">High Impact Definition</Label>
        <p className="text-xs text-muted-foreground mb-1">
          Define what constitutes a "high impact" alert for this client
        </p>
        <Textarea
          id="highImpact"
          value={data.highImpactDefinition || ""}
          onChange={(e) => onChange({ highImpactDefinition: e.target.value })}
          placeholder="e.g., Any legislation that affects core business operations, requires significant compliance investment, or impacts more than 20% of revenue..."
          className="bg-background/50 resize-none"
          rows={4}
        />
      </div>

      {/* High Urgency Definition */}
      <div className="space-y-2">
        <Label htmlFor="highUrgency">High Urgency Definition</Label>
        <p className="text-xs text-muted-foreground mb-1">
          Define what constitutes a "high urgency" alert for this client
        </p>
        <Textarea
          id="highUrgency"
          value={data.highUrgencyDefinition || ""}
          onChange={(e) => onChange({ highUrgencyDefinition: e.target.value })}
          placeholder="e.g., Legislation with compliance deadline within 30 days, regulatory changes requiring immediate action, or bills in final voting stage..."
          className="bg-background/50 resize-none"
          rows={4}
        />
      </div>

      {/* Summary Preview */}
      {(data.stakeholdersAffected.length > 0 || data.highImpactDefinition || data.highUrgencyDefinition) && (
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <h3 className="text-sm font-medium text-foreground mb-2">Priority Logic Summary</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            {data.stakeholdersAffected.length > 0 && (
              <p>
                <span className="font-medium text-foreground">Stakeholders: </span>
                {data.stakeholdersAffected.join(', ')}
              </p>
            )}
            {data.highImpactDefinition && (
              <p>
                <span className="font-medium text-foreground">High Impact: </span>
                {data.highImpactDefinition.substring(0, 100)}
                {data.highImpactDefinition.length > 100 && '...'}
              </p>
            )}
            {data.highUrgencyDefinition && (
              <p>
                <span className="font-medium text-foreground">High Urgency: </span>
                {data.highUrgencyDefinition.substring(0, 100)}
                {data.highUrgencyDefinition.length > 100 && '...'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
