import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReportConfig, TIMEZONE_OPTIONS, WEEKDAY_OPTIONS } from "../types";
import { Clock, Calendar } from "lucide-react";

interface Step12Props {
  config: ReportConfig;
  onUpdate: (updates: Partial<ReportConfig>) => void;
}

export function Step12ScheduleSettings({ config, onUpdate }: Step12Props) {
  // Skip this step if not scheduling
  if (config.action !== 'schedule') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Configuración de Programación</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Este paso no aplica para generación inmediata
          </p>
        </div>
        <Card className="border-border/50">
          <CardContent className="p-6 text-center text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Ha seleccionado "Generar Ahora".</p>
            <p className="text-sm mt-2">Para programar reportes, seleccione "Programar" en el paso 2.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Configuración de Programación</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Defina cuándo y cómo se generarán los reportes automáticamente
        </p>
      </div>

      {/* Frequency */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="mb-4">
            <span className="font-medium">Frecuencia</span>
          </div>
          <RadioGroup
            value={config.frequency || 'weekly'}
            onValueChange={(value) => onUpdate({ frequency: value as 'daily' | 'weekly' })}
            className="grid grid-cols-2 gap-3"
          >
            <Label htmlFor="freq-daily" className="cursor-pointer">
              <Card className={`transition-all ${
                config.frequency === 'daily' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border/50'
              }`}>
                <CardContent className="flex items-center gap-3 p-3">
                  <RadioGroupItem value="daily" id="freq-daily" />
                  <span className="font-medium">Diario</span>
                </CardContent>
              </Card>
            </Label>
            <Label htmlFor="freq-weekly" className="cursor-pointer">
              <Card className={`transition-all ${
                config.frequency === 'weekly' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border/50'
              }`}>
                <CardContent className="flex items-center gap-3 p-3">
                  <RadioGroupItem value="weekly" id="freq-weekly" />
                  <span className="font-medium">Semanal</span>
                </CardContent>
              </Card>
            </Label>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Weekly Day (if weekly) */}
      {config.frequency === 'weekly' && (
        <Card className="border-border/50">
          <CardContent className="p-4">
            <Label className="font-medium mb-3 block">Día de la semana</Label>
            <Select
              value={String(config.weeklyDay ?? 1)}
              onValueChange={(value) => onUpdate({ weeklyDay: Number(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WEEKDAY_OPTIONS.map(day => (
                  <SelectItem key={day.value} value={String(day.value)}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Time and Timezone */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <Label className="font-medium mb-3 block">Hora de envío</Label>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Input
                type="time"
                value={config.scheduleTime || '08:00'}
                onChange={(e) => onUpdate({ scheduleTime: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <Label className="font-medium mb-3 block">Zona horaria</Label>
            <Select
              value={config.timezone || 'America/Lima'}
              onValueChange={(value) => onUpdate({ timezone: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONE_OPTIONS.map(tz => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Send only if alerts */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="send-only-if" className="font-medium cursor-pointer">
                Enviar solo si hay alertas
              </Label>
              <p className="text-sm text-muted-foreground">
                Omitir el envío si no hay novedades en el período
              </p>
            </div>
            <Switch
              id="send-only-if"
              checked={config.sendOnlyIfAlerts ?? true}
              onCheckedChange={(checked) => onUpdate({ sendOnlyIfAlerts: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
