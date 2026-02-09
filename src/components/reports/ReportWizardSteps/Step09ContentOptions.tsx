import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ReportConfig } from "../types";
import { Video, MessageSquare, FileText, Users, BarChart3 } from "lucide-react";

interface Step09Props {
  config: ReportConfig;
  onUpdate: (updates: Partial<ReportConfig>) => void;
}

export function Step09ContentOptions({ config, onUpdate }: Step09Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Opciones de Contenido</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure qué información adicional incluir en el reporte
        </p>
      </div>

      <div className="space-y-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Video className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <Label htmlFor="include-sessions" className="font-medium cursor-pointer">
                    Incluir Sesiones de Comisión
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Añadir sesiones parlamentarias relevantes al período
                  </p>
                </div>
              </div>
              <Switch
                id="include-sessions"
                checked={config.includeSessions}
                onCheckedChange={(checked) => onUpdate({ includeSessions: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <MessageSquare className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <Label htmlFor="include-commentary" className="font-medium cursor-pointer">
                    Incluir Comentario Experto
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Mostrar análisis y recomendaciones del equipo legal
                  </p>
                </div>
              </div>
              <Switch
                id="include-commentary"
                checked={config.includeExpertCommentary}
                onCheckedChange={(checked) => onUpdate({ includeExpertCommentary: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <BarChart3 className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <Label htmlFor="include-analytics" className="font-medium cursor-pointer">
                    Incluir Página de Analíticas
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Agregar gráficos y métricas del período al reporte
                  </p>
                </div>
              </div>
              <Switch
                id="include-analytics"
                checked={config.includeAnalytics}
                onCheckedChange={(checked) => onUpdate({ includeAnalytics: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 opacity-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <FileText className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <Label className="font-medium">
                    Incluir Resumen Ejecutivo AI
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Generar resumen automático con AI (próximamente)
                  </p>
                </div>
              </div>
              <Switch disabled />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 opacity-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Users className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <Label className="font-medium">
                    Incluir Análisis de Stakeholders
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Información sobre autores y promotores (próximamente)
                  </p>
                </div>
              </div>
              <Switch disabled />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
