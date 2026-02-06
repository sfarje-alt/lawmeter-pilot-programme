import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ReportConfig } from "../types";
import { ReportLayoutBuilder } from "../ReportLayoutBuilder";
import { BarChart3 } from "lucide-react";
import { CLIENT_ANALYTICS_BLOCKS, AnalyticsBlockConfig } from "@/types/analytics";

interface Step10Props {
  config: ReportConfig;
  onUpdate: (updates: Partial<ReportConfig>) => void;
}

export function Step10AnalyticsOptions({ config, onUpdate }: Step10Props) {
  // Initialize blocks from config or defaults
  const initialBlocks = useMemo(() => {
    if (config.analyticsBlocks && config.analyticsBlocks.length > 0) {
      return config.analyticsBlocks;
    }
    // Default: enable blocks that have renderPDF = true
    return CLIENT_ANALYTICS_BLOCKS.map((block, index) => ({
      ...block,
      order: index,
      enabled: block.renderPDF,
    }));
  }, [config.analyticsBlocks]);

  const handleBlocksChange = (newBlocks: AnalyticsBlockConfig[]) => {
    onUpdate({ 
      analyticsBlocks: newBlocks,
      includeAnalytics: newBlocks.some(b => b.enabled),
    });
  };

  const handleToggleAnalytics = (checked: boolean) => {
    if (checked) {
      // Enable with default blocks
      const defaultBlocks = CLIENT_ANALYTICS_BLOCKS.map((block, index) => ({
        ...block,
        order: index,
        enabled: block.renderPDF,
      }));
      onUpdate({ 
        includeAnalytics: true,
        analyticsBlocks: defaultBlocks,
      });
    } else {
      // Disable all blocks
      const disabledBlocks = (config.analyticsBlocks || initialBlocks).map(b => ({
        ...b,
        enabled: false,
      }));
      onUpdate({ 
        includeAnalytics: false,
        analyticsBlocks: disabledBlocks,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Opciones de Analytics</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure qué visualizaciones incluir en el reporte y su orden
        </p>
      </div>

      {/* Master Toggle */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <Label htmlFor="include-analytics" className="font-medium cursor-pointer">
                  Incluir Página de Analytics
                </Label>
                <p className="text-sm text-muted-foreground">
                  Agregar una página de analíticas después de la portada
                </p>
              </div>
            </div>
            <Switch
              id="include-analytics"
              checked={config.includeAnalytics}
              onCheckedChange={handleToggleAnalytics}
            />
          </div>
        </CardContent>
      </Card>

      {/* Layout Builder (only when analytics enabled) */}
      {config.includeAnalytics && (
        <ReportLayoutBuilder
          blocks={config.analyticsBlocks || initialBlocks}
          onChange={handleBlocksChange}
          showInternalBlocks={false}
        />
      )}

      {/* Info about structure */}
      {config.includeAnalytics && (
        <Card className="border-border/50 bg-muted/30">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Estructura del reporte:</strong> Portada → Analíticas (1 página) → Alertas
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Las analíticas se renderizan como tarjetas estáticas sin tooltips interactivos.
              Cada tarjeta incluye el título, insight principal y los datos del período seleccionado.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
