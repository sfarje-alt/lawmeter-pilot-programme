import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ReportConfig, DATE_MODE_OPTIONS } from "../types";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Step04Props {
  config: ReportConfig;
  onUpdate: (updates: Partial<ReportConfig>) => void;
}

export function Step04DateRange({ config, onUpdate }: Step04Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Rango de Fechas</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Defina el período que cubrirá el reporte
        </p>
      </div>

      <RadioGroup
        value={config.dateMode}
        onValueChange={(value) => onUpdate({ dateMode: value as ReportConfig['dateMode'] })}
        className="grid grid-cols-2 gap-3"
      >
        {DATE_MODE_OPTIONS.map((option) => (
          <Label
            key={option.value}
            htmlFor={`date-${option.value}`}
            className="cursor-pointer"
          >
            <Card className={`transition-all hover:border-primary/50 ${
              config.dateMode === option.value 
                ? 'border-primary bg-primary/5' 
                : 'border-border/50'
            }`}>
              <CardContent className="flex items-center gap-3 p-3">
                <RadioGroupItem value={option.value} id={`date-${option.value}`} />
                <span className="text-sm font-medium">{option.label}</span>
              </CardContent>
            </Card>
          </Label>
        ))}
      </RadioGroup>

      {config.dateMode === 'custom' && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label>Fecha de inicio</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !config.customDateFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {config.customDateFrom ? (
                    format(config.customDateFrom, "PPP", { locale: es })
                  ) : (
                    <span>Seleccionar fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={config.customDateFrom}
                  onSelect={(date) => onUpdate({ customDateFrom: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Fecha de fin</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !config.customDateTo && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {config.customDateTo ? (
                    format(config.customDateTo, "PPP", { locale: es })
                  ) : (
                    <span>Seleccionar fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={config.customDateTo}
                  onSelect={(date) => onUpdate({ customDateTo: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
}
