import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Clock, Target, Users } from "lucide-react";
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

// Criteria the system CAN actually evaluate
const URGENCY_CRITERIA = [
  { id: 'deadline_30', label: 'Plazos de cumplimiento menores a 30 días', description: 'Normas con fecha límite próxima' },
  { id: 'deadline_60', label: 'Plazos de cumplimiento menores a 60 días', description: 'Normas con fecha límite cercana' },
  { id: 'stage_pleno', label: 'Proyectos en etapa de Pleno', description: 'Alta probabilidad de aprobación inminente' },
  { id: 'stage_final', label: 'Proyectos en Trámite Final', description: 'Última etapa antes de publicación' },
  { id: 'immediate_effect', label: 'Normas con vigencia inmediata', description: 'Entran en vigor al día siguiente de publicación' },
  { id: 'licitacion', label: 'Licitaciones en proceso', description: 'Convocatorias con plazos activos' },
];

const IMPACT_CRITERIA = [
  { id: 'regulator_direct', label: 'Emitido por autoridad supervisora directa', description: 'Normas de DIGEMID, SBS, SUNAT, etc.' },
  { id: 'core_sector', label: 'Afecta sector primario del cliente', description: 'Impacto directo en actividad principal' },
  { id: 'multiple_areas', label: 'Afecta múltiples áreas internas', description: '3+ departamentos impactados' },
  { id: 'compliance_required', label: 'Requiere cambios de compliance', description: 'Nuevas obligaciones regulatorias' },
  { id: 'licensing', label: 'Afecta licencias o permisos', description: 'Cambios en requisitos de operación' },
  { id: 'pricing', label: 'Impacta precios o tarifas reguladas', description: 'Cambios en estructura de costos' },
];

export function Step5PriorityLogic({ data, onChange }: Step5Props) {
  const toggleStakeholder = (stakeholder: string) => {
    if (data.stakeholdersAffected.includes(stakeholder)) {
      onChange({ stakeholdersAffected: data.stakeholdersAffected.filter(s => s !== stakeholder) });
    } else {
      onChange({ stakeholdersAffected: [...data.stakeholdersAffected, stakeholder] });
    }
  };

  // Parse criteria from the definition strings (stored as comma-separated IDs)
  const urgencyCriteria = data.highUrgencyDefinition?.split(',').filter(Boolean) || [];
  const impactCriteria = data.highImpactDefinition?.split(',').filter(Boolean) || [];

  const toggleUrgencyCriteria = (criteriaId: string) => {
    const newCriteria = urgencyCriteria.includes(criteriaId)
      ? urgencyCriteria.filter(c => c !== criteriaId)
      : [...urgencyCriteria, criteriaId];
    onChange({ highUrgencyDefinition: newCriteria.join(',') });
  };

  const toggleImpactCriteria = (criteriaId: string) => {
    const newCriteria = impactCriteria.includes(criteriaId)
      ? impactCriteria.filter(c => c !== criteriaId)
      : [...impactCriteria, criteriaId];
    onChange({ highImpactDefinition: newCriteria.join(',') });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Priority Logic</h2>
        <p className="text-sm text-muted-foreground">
          Define how alerts are prioritized based on criteria we can automatically evaluate
        </p>
      </div>

      {/* Stakeholders Affected */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <Label>Stakeholders to Consider</Label>
        </div>
        <p className="text-xs text-muted-foreground mb-2">
          Alerts mentioning these groups will be flagged for review
        </p>
        <div className="flex flex-wrap gap-2">
          {STAKEHOLDERS.map((stakeholder) => (
            <Badge
              key={stakeholder}
              variant={data.stakeholdersAffected.includes(stakeholder) ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/80 transition-colors"
              onClick={() => toggleStakeholder(stakeholder)}
            >
              {stakeholder}
            </Badge>
          ))}
        </div>
      </div>

      {/* High Urgency Criteria */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-orange-500" />
          <Label>High Urgency Criteria</Label>
        </div>
        <p className="text-xs text-muted-foreground">
          Alerts matching these conditions will be marked as urgent
        </p>
        <div className="grid gap-2">
          {URGENCY_CRITERIA.map((criteria) => (
            <div
              key={criteria.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:border-orange-500/50 hover:bg-orange-500/5 transition-colors cursor-pointer"
              onClick={() => toggleUrgencyCriteria(criteria.id)}
            >
              <Checkbox
                checked={urgencyCriteria.includes(criteria.id)}
                onCheckedChange={() => toggleUrgencyCriteria(criteria.id)}
                className="mt-0.5"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{criteria.label}</p>
                <p className="text-xs text-muted-foreground">{criteria.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* High Impact Criteria */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-red-500" />
          <Label>High Impact Criteria</Label>
        </div>
        <p className="text-xs text-muted-foreground">
          Alerts matching these conditions will be marked as high impact
        </p>
        <div className="grid gap-2">
          {IMPACT_CRITERIA.map((criteria) => (
            <div
              key={criteria.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:border-red-500/50 hover:bg-red-500/5 transition-colors cursor-pointer"
              onClick={() => toggleImpactCriteria(criteria.id)}
            >
              <Checkbox
                checked={impactCriteria.includes(criteria.id)}
                onCheckedChange={() => toggleImpactCriteria(criteria.id)}
                className="mt-0.5"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{criteria.label}</p>
                <p className="text-xs text-muted-foreground">{criteria.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Preview */}
      {(urgencyCriteria.length > 0 || impactCriteria.length > 0 || data.stakeholdersAffected.length > 0) && (
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium text-foreground">Priority Configuration Summary</h3>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            {data.stakeholdersAffected.length > 0 && (
              <p>
                <span className="font-medium text-foreground">Stakeholders: </span>
                {data.stakeholdersAffected.join(', ')}
              </p>
            )}
            {urgencyCriteria.length > 0 && (
              <p>
                <span className="font-medium text-foreground">Urgencia Alta: </span>
                {urgencyCriteria.length} criterio{urgencyCriteria.length > 1 ? 's' : ''} seleccionado{urgencyCriteria.length > 1 ? 's' : ''}
              </p>
            )}
            {impactCriteria.length > 0 && (
              <p>
                <span className="font-medium text-foreground">Impacto Alto: </span>
                {impactCriteria.length} criterio{impactCriteria.length > 1 ? 's' : ''} seleccionado{impactCriteria.length > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
