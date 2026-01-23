import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ReportConfig, REPORT_ACTION_OPTIONS } from "../types";
import { FileDown, Calendar, History } from "lucide-react";

interface Step02Props {
  config: ReportConfig;
  onUpdate: (updates: Partial<ReportConfig>) => void;
}

const iconMap = {
  generate_now: FileDown,
  schedule: Calendar,
  view_history: History,
};

export function Step02ChooseAction({ config, onUpdate }: Step02Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">¿Qué desea hacer?</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Elija la acción a realizar con el reporte
        </p>
      </div>

      <RadioGroup
        value={config.action}
        onValueChange={(value) => onUpdate({ action: value as ReportConfig['action'] })}
        className="grid gap-4"
      >
        {REPORT_ACTION_OPTIONS.map((option) => {
          const Icon = iconMap[option.value];
          return (
            <Label
              key={option.value}
              htmlFor={`action-${option.value}`}
              className="cursor-pointer"
            >
              <Card className={`transition-all hover:border-primary/50 ${
                config.action === option.value 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border/50'
              }`}>
                <CardContent className="flex items-center gap-4 p-4">
                  <RadioGroupItem value={option.value} id={`action-${option.value}`} />
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{option.label}</div>
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
