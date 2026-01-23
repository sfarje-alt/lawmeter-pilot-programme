import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ReportConfig, LEGISLATION_STAGE_OPTIONS } from "../types";
import { FileText, Scale, Layers } from "lucide-react";

interface Step05Props {
  config: ReportConfig;
  onUpdate: (updates: Partial<ReportConfig>) => void;
}

const iconMap = {
  only_bills: FileText,
  bills_and_enacted: Layers,
  only_enacted: Scale,
};

export function Step05Stage({ config, onUpdate }: Step05Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Etapa Legislativa</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Seleccione qué tipos de legislación incluir en el reporte
        </p>
      </div>

      <RadioGroup
        value={config.legislationStage}
        onValueChange={(value) => onUpdate({ legislationStage: value as ReportConfig['legislationStage'] })}
        className="grid gap-4"
      >
        {LEGISLATION_STAGE_OPTIONS.map((option) => {
          const Icon = iconMap[option.value];
          return (
            <Label
              key={option.value}
              htmlFor={`stage-${option.value}`}
              className="cursor-pointer"
            >
              <Card className={`transition-all hover:border-primary/50 ${
                config.legislationStage === option.value 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border/50'
              }`}>
                <CardContent className="flex items-center gap-4 p-4">
                  <RadioGroupItem value={option.value} id={`stage-${option.value}`} />
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{option.label}</div>
                    <div className="text-sm text-muted-foreground">{option.description}</div>
                  </div>
                </CardContent>
              </Card>
            </Label>
          );
        })}
      </RadioGroup>
    </div>
  );
}
