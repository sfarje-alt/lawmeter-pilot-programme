import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ReportConfig, NORM_TYPE_OPTIONS } from "../types";
import { ENTITIES } from "@/data/peruAlertsMockData";
import { Scale, Building2, FileText } from "lucide-react";

interface Step07Props {
  config: ReportConfig;
  onUpdate: (updates: Partial<ReportConfig>) => void;
}

export function Step07TypeOfLaws({ config, onUpdate }: Step07Props) {
  const toggleNormType = (type: string) => {
    const newTypes = config.normTypes.includes(type)
      ? config.normTypes.filter(t => t !== type)
      : [...config.normTypes, type];
    onUpdate({ normTypes: newTypes });
  };

  const toggleEntity = (entity: string) => {
    const newEntities = config.entities.includes(entity)
      ? config.entities.filter(e => e !== entity)
      : [...config.entities, entity];
    onUpdate({ entities: newEntities });
  };

  // Skip this step if only_bills is selected
  if (config.legislationStage === 'only_bills') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Tipos de Normas</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Este paso no aplica porque solo se incluirán proyectos de ley
          </p>
        </div>
        <Card className="border-border/50">
          <CardContent className="p-6 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Ha seleccionado "Solo Proyectos de Ley" en el paso anterior.</p>
            <p className="text-sm mt-2">Continue al siguiente paso.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Tipos de Normas</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Filtre por tipos de normas e instituciones emisoras
        </p>
      </div>

      {/* Norm Types */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Scale className="h-4 w-4 text-primary" />
            <span className="font-medium">Tipo de Instrumento</span>
            {config.normTypes.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {config.normTypes.length} seleccionados
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {NORM_TYPE_OPTIONS.map(type => (
              <Label
                key={type}
                htmlFor={`norm-${type}`}
                className="flex items-center gap-2 text-sm cursor-pointer hover:text-foreground text-muted-foreground"
              >
                <Checkbox
                  id={`norm-${type}`}
                  checked={config.normTypes.includes(type)}
                  onCheckedChange={() => toggleNormType(type)}
                />
                <span>{type}</span>
              </Label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Entities */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="font-medium">Entidad Emisora</span>
            {config.entities.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {config.entities.length} seleccionados
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 max-h-[250px] overflow-y-auto">
            {ENTITIES.map(entity => (
              <Label
                key={entity}
                htmlFor={`entity-${entity}`}
                className="flex items-center gap-2 text-sm cursor-pointer hover:text-foreground text-muted-foreground"
              >
                <Checkbox
                  id={`entity-${entity}`}
                  checked={config.entities.includes(entity)}
                  onCheckedChange={() => toggleEntity(entity)}
                />
                <span className="truncate">{entity}</span>
              </Label>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
