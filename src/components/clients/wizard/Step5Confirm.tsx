import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ClientProfile } from "../types";
import { CheckCircle, AlertCircle, Sparkles, AlertTriangle, Zap } from "lucide-react";

interface Step5Props {
  data: ClientProfile;
  onChange: (data: Partial<ClientProfile>) => void;
}

export function Step5Confirm({ data, onChange }: Step5Props) {
  const validationItems = [
    { label: 'Razón Social', valid: !!data.legalName },
    { label: 'Sector', valid: !!data.primarySector },
    { label: 'Palabras Clave', valid: data.keywords.length > 0 },
    { label: 'Criterio de Impacto', valid: !!data.highImpactCriteria?.trim() },
    { label: 'Criterio de Urgencia', valid: !!data.highUrgencyCriteria?.trim() },
    { label: 'Reconocimiento', valid: data.sourceAcknowledgement },
  ];

  const completionPercent = Math.round(
    (validationItems.filter(i => i.valid).length / validationItems.length) * 100
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Criterios de Clasificación IA y Confirmación</h2>
        <p className="text-sm text-muted-foreground">
          Define cómo la IA debe clasificar las alertas para este perfil. Estos criterios son obligatorios.
        </p>
      </div>

      {/* AI explanation banner */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-[hsl(var(--primary)/0.08)] border border-[hsl(var(--primary)/0.25)]">
        <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">¿Cómo se usan estos criterios?</p>
          <p className="text-xs text-muted-foreground">
            La IA evalúa cada alerta entrante contra estas definiciones para asignar automáticamente el nivel de Impacto y Urgencia. Cuanto más específicos sean, más precisa será la clasificación.
          </p>
        </div>
      </div>

      {/* High Impact Criteria */}
      <div className="space-y-2">
        <Label htmlFor="highImpactCriteria" className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-[hsl(var(--destructive))]" />
          Criterios de Alto Impacto <span className="text-destructive">*</span>
        </Label>
        <p className="text-xs text-muted-foreground">
          ¿Qué hace que una norma o proyecto de ley tenga alto impacto en tu operación? Sé específico: áreas, productos, autoridades, montos, etc.
        </p>
        <Textarea
          id="highImpactCriteria"
          value={data.highImpactCriteria || ""}
          onChange={(e) => onChange({ highImpactCriteria: e.target.value })}
          placeholder="Ej., Cambios a obligaciones tributarias del IGV; modificaciones al régimen laboral en planillas; nuevas restricciones a importación de insumos clave; sanciones que superen 50 UIT..."
          className="bg-background/50 resize-none min-h-[100px]"
          rows={4}
        />
      </div>

      {/* High Urgency Criteria */}
      <div className="space-y-2">
        <Label htmlFor="highUrgencyCriteria" className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-[hsl(var(--warning))]" />
          Criterios de Alta Urgencia <span className="text-destructive">*</span>
        </Label>
        <p className="text-xs text-muted-foreground">
          ¿Qué hace que una alerta sea urgente y requiera acción inmediata? Considera plazos de adecuación, vigencias, riesgos sancionatorios.
        </p>
        <Textarea
          id="highUrgencyCriteria"
          value={data.highUrgencyCriteria || ""}
          onChange={(e) => onChange({ highUrgencyCriteria: e.target.value })}
          placeholder="Ej., Vigencia inmediata o plazos de adecuación menores a 30 días; resoluciones que requieran reporte obligatorio en el corto plazo; cierre de procesos administrativos en curso..."
          className="bg-background/50 resize-none min-h-[100px]"
          rows={4}
        />
      </div>

      {/* Source Acknowledgement */}
      <div className="flex items-start gap-4 p-4 rounded-lg bg-background/30 border border-border/30">
        <div className="flex-1">
          <Label htmlFor="sourceAcknowledgement" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-[hsl(var(--success))]" />
            Reconocimiento de Fuentes Oficiales
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Reconozco que la información legislativa proviene de fuentes oficiales y el análisis es solo con fines informativos.
          </p>
        </div>
        <Switch
          id="sourceAcknowledgement"
          checked={data.sourceAcknowledgement}
          onCheckedChange={(checked) => onChange({ sourceAcknowledgement: checked })}
        />
      </div>

      {/* Internal Notes */}
      <div className="space-y-2">
        <Label htmlFor="internalNotes">Notas Internas</Label>
        <Textarea
          id="internalNotes"
          value={data.internalNotes || ""}
          onChange={(e) => onChange({ internalNotes: e.target.value })}
          placeholder="Notas internas sobre este perfil de monitoreo..."
          className="bg-background/50 resize-none"
          rows={3}
        />
      </div>

      {/* Summary */}
      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-3">
        <h3 className="text-sm font-medium text-foreground">Resumen del Perfil</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Perfil:</span>
            <span className="ml-2 font-medium">{data.legalName || 'No definido'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Sector:</span>
            <span className="ml-2">{data.primarySector || 'No definido'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Palabras Clave:</span>
            <span className="ml-2">{data.keywords.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Categorías de Etiquetas:</span>
            <span className="ml-2">{data.tagCategories.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Instrumentos:</span>
            <span className="ml-2">{data.instrumentTypes.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Comisiones:</span>
            <span className="ml-2">{data.watchedCommissions.length}</span>
          </div>
        </div>
      </div>

      {/* Validation Status */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Estado de Completitud</Label>
          <span className={`text-sm font-medium ${completionPercent === 100 ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--warning))]'}`}>
            {completionPercent}%
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {validationItems.map((item) => (
            <div
              key={item.label}
              className={`p-2 rounded text-xs flex items-center gap-1 ${
                item.valid
                  ? 'bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success))] border border-[hsl(var(--success)/0.25)]'
                  : 'bg-[hsl(var(--warning)/0.12)] text-[hsl(var(--warning))] border border-[hsl(var(--warning)/0.25)]'
              }`}
            >
              {item.valid ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
              <span className="truncate">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
