import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ReportConfig, ANALYTICS_SECTION_OPTIONS } from "../types";
import { BarChart3, TrendingUp, PieChart, Grid3X3, Clock } from "lucide-react";

interface Step10Props {
  config: ReportConfig;
  onUpdate: (updates: Partial<ReportConfig>) => void;
}

const sectionIcons: Record<string, React.ElementType> = {
  volume_trends: TrendingUp,
  stage_distribution: PieChart,
  sector_breakdown: BarChart3,
  impact_matrix: Grid3X3,
  timeline: Clock,
};

export function Step10AnalyticsOptions({ config, onUpdate }: Step10Props) {
  const toggleSection = (section: string) => {
    const newSections = config.analyticsSections.includes(section)
      ? config.analyticsSections.filter(s => s !== section)
      : [...config.analyticsSections, section];
    onUpdate({ analyticsSections: newSections });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Opciones de Analytics</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Incluya visualizaciones y estadísticas en el reporte
        </p>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <Label htmlFor="include-analytics" className="font-medium cursor-pointer">
                  Incluir Sección de Analytics
                </Label>
                <p className="text-sm text-muted-foreground">
                  Agregar gráficos y estadísticas al final del reporte
                </p>
              </div>
            </div>
            <Switch
              id="include-analytics"
              checked={config.includeAnalytics}
              onCheckedChange={(checked) => {
                onUpdate({ 
                  includeAnalytics: checked,
                  analyticsSections: checked ? config.analyticsSections : []
                });
              }}
            />
          </div>
        </CardContent>
      </Card>

      {config.includeAnalytics && (
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="mb-4">
              <span className="font-medium">Secciones a incluir</span>
              <p className="text-sm text-muted-foreground">
                Seleccione qué visualizaciones agregar
              </p>
            </div>
            <div className="space-y-3">
              {ANALYTICS_SECTION_OPTIONS.map(option => {
                const Icon = sectionIcons[option.value] || BarChart3;
                return (
                  <Label
                    key={option.value}
                    htmlFor={`analytics-${option.value}`}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={`analytics-${option.value}`}
                      checked={config.analyticsSections.includes(option.value)}
                      onCheckedChange={() => toggleSection(option.value)}
                    />
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span>{option.label}</span>
                  </Label>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
