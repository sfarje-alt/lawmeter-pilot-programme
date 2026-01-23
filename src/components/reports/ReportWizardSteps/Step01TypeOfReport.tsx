import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ReportConfig, REPORT_TYPE_OPTIONS } from "../types";
import { FileText, Calendar, Settings2 } from "lucide-react";

interface Step01Props {
  config: ReportConfig;
  onUpdate: (updates: Partial<ReportConfig>) => void;
}

const iconMap = {
  daily: FileText,
  weekly: Calendar,
  custom: Settings2,
};

export function Step01TypeOfReport({ config, onUpdate }: Step01Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Tipo de Reporte</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Seleccione la frecuencia o tipo de reporte que desea generar
        </p>
      </div>

      <RadioGroup
        value={config.reportType}
        onValueChange={(value) => onUpdate({ reportType: value as ReportConfig['reportType'] })}
        className="grid gap-4"
      >
        {REPORT_TYPE_OPTIONS.map((option) => {
          const Icon = iconMap[option.value];
          return (
            <Label
              key={option.value}
              htmlFor={option.value}
              className="cursor-pointer"
            >
              <Card className={`transition-all hover:border-primary/50 ${
                config.reportType === option.value 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border/50'
              }`}>
                <CardContent className="flex items-center gap-4 p-4">
                  <RadioGroupItem value={option.value} id={option.value} />
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
