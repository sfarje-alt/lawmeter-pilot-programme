import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ReportConfig } from "../types";
import { ALL_LEGISLATIVE_STAGES } from "@/data/peruAlertsMockData";
import { CheckCircle2, Clock, FileText, Archive, AlertCircle } from "lucide-react";

interface Step06Props {
  config: ReportConfig;
  onUpdate: (updates: Partial<ReportConfig>) => void;
}

// Categorize stages for better UX
const STAGE_CATEGORIES = {
  'En Trámite': ['PRESENTADO', 'EN COMISIÓN', 'DICTAMEN', 'ORDEN DEL DÍA', 'EN AGENDA DEL PLENO'],
  'En Votación': ['APROBADO 1ERA. VOTACIÓN', 'PENDIENTE 2DA. VOTACIÓN', 'EN CUARTO INTERMEDIO', 'EN RECONSIDERACIÓN'],
  'Finalizados': ['APROBADO', 'PUBLICADA EN EL DIARIO OFICIAL EL PERUANO'],
  'Archivados': ['AL ARCHIVO', 'DECRETO DE ARCHIVO', 'RETIRADO POR SU AUTOR'],
  'Otros': ['ACLARACIÓN'],
};

const categoryIcons = {
  'En Trámite': Clock,
  'En Votación': FileText,
  'Finalizados': CheckCircle2,
  'Archivados': Archive,
  'Otros': AlertCircle,
};

const categoryColors = {
  'En Trámite': 'bg-blue-500/10 text-blue-400',
  'En Votación': 'bg-amber-500/10 text-amber-400',
  'Finalizados': 'bg-emerald-500/10 text-emerald-400',
  'Archivados': 'bg-slate-500/10 text-slate-400',
  'Otros': 'bg-purple-500/10 text-purple-400',
};

export function Step06BillsStatus({ config, onUpdate }: Step06Props) {
  const toggleStatus = (status: string) => {
    const newStatuses = config.billsStatuses.includes(status)
      ? config.billsStatuses.filter(s => s !== status)
      : [...config.billsStatuses, status];
    onUpdate({ billsStatuses: newStatuses });
  };

  const toggleCategory = (category: keyof typeof STAGE_CATEGORIES) => {
    const categoryStatuses = STAGE_CATEGORIES[category];
    const allSelected = categoryStatuses.every(s => config.billsStatuses.includes(s));
    
    if (allSelected) {
      onUpdate({ 
        billsStatuses: config.billsStatuses.filter(s => !categoryStatuses.includes(s)) 
      });
    } else {
      const newStatuses = [...new Set([...config.billsStatuses, ...categoryStatuses])];
      onUpdate({ billsStatuses: newStatuses });
    }
  };

  const selectAll = () => {
    onUpdate({ billsStatuses: [...ALL_LEGISLATIVE_STAGES] });
  };

  const clearAll = () => {
    onUpdate({ billsStatuses: [] });
  };

  // Skip this step if only_enacted is selected
  if (config.legislationStage === 'only_enacted') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Estados de Proyectos de Ley</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Este paso no aplica porque solo se incluirán normas publicadas
          </p>
        </div>
        <Card className="border-border/50">
          <CardContent className="p-6 text-center text-muted-foreground">
            <Archive className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Ha seleccionado "Solo Normas Publicadas" en el paso anterior.</p>
            <p className="text-sm mt-2">Continue al siguiente paso.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Estados Procesales</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Filtre por estados específicos de los proyectos de ley
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={selectAll} className="text-sm text-primary hover:underline">
            Todos
          </button>
          <span className="text-muted-foreground">|</span>
          <button onClick={clearAll} className="text-sm text-muted-foreground hover:underline">
            Ninguno
          </button>
        </div>
      </div>

      {config.billsStatuses.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Seleccionados:</span>
          {config.billsStatuses.slice(0, 5).map(status => (
            <Badge key={status} variant="secondary" className="text-xs">
              {status}
            </Badge>
          ))}
          {config.billsStatuses.length > 5 && (
            <Badge variant="outline" className="text-xs">
              +{config.billsStatuses.length - 5} más
            </Badge>
          )}
        </div>
      )}

      <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
        {Object.entries(STAGE_CATEGORIES).map(([category, stages]) => {
          const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons];
          const colorClass = categoryColors[category as keyof typeof categoryColors];
          const allSelected = stages.every(s => config.billsStatuses.includes(s));
          const someSelected = stages.some(s => config.billsStatuses.includes(s));

          return (
            <Card key={category} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Checkbox
                    id={`cat-${category}`}
                    checked={allSelected}
                    // @ts-ignore
                    indeterminate={someSelected && !allSelected}
                    onCheckedChange={() => toggleCategory(category as keyof typeof STAGE_CATEGORIES)}
                  />
                  <div className={`p-1.5 rounded ${colorClass}`}>
                    <CategoryIcon className="h-4 w-4" />
                  </div>
                  <Label htmlFor={`cat-${category}`} className="font-medium cursor-pointer">
                    {category}
                  </Label>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {stages.filter(s => config.billsStatuses.includes(s)).length}/{stages.length}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 ml-8">
                  {stages.map(status => (
                    <Label
                      key={status}
                      htmlFor={`status-${status}`}
                      className="flex items-center gap-2 text-sm cursor-pointer hover:text-foreground text-muted-foreground"
                    >
                      <Checkbox
                        id={`status-${status}`}
                        checked={config.billsStatuses.includes(status)}
                        onCheckedChange={() => toggleStatus(status)}
                      />
                      <span className="truncate">{status}</span>
                    </Label>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
