import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import type { ManualItem } from "@/lib/manualAlertSchema";

interface AlertsPreviewListProps {
  items: ManualItem[];
  tipo: "pl" | "norma";
}

function impactColor(c?: string) {
  switch (c) {
    case "Alta":
      return "bg-destructive/20 text-destructive border-destructive/30";
    case "Media":
      return "bg-amber-500/20 text-amber-500 border-amber-500/30";
    case "Baja":
      return "bg-emerald-500/20 text-emerald-500 border-emerald-500/30";
    default:
      return "bg-muted/40 text-muted-foreground border-white/10";
  }
}

export function AlertsPreviewList({ items, tipo }: AlertsPreviewListProps) {
  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const anyItem = item as any;
        const ref =
          tipo === "pl" ? anyItem.codigo : anyItem.reference_number;
        const fecha =
          tipo === "pl" ? anyItem.fecha_presentacion : anyItem.fecha_publicacion;
        return (
          <Card key={`${item.external_id}-${idx}`} className="bg-card/60">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {ref && (
                      <Badge variant="outline" className="font-mono text-xs">
                        {ref}
                      </Badge>
                    )}
                    {fecha && (
                      <span className="text-xs text-muted-foreground">
                        {fecha}
                      </span>
                    )}
                    {anyItem.entity && (
                      <Badge variant="secondary" className="text-xs">
                        {anyItem.entity}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-medium text-foreground leading-snug">
                    {item.titulo}
                  </h3>
                  {item.resumen && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.resumen}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {item.impacto_categoria && (
                    <Badge
                      variant="outline"
                      className={impactColor(item.impacto_categoria)}
                    >
                      Impacto {item.impacto_categoria}
                    </Badge>
                  )}
                  {item.urgencia_categoria && (
                    <Badge variant="outline" className="text-xs">
                      Urgencia {item.urgencia_categoria}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {item.area_de_interes?.map((a) => (
                  <Badge key={a} variant="secondary" className="text-xs">
                    {a}
                  </Badge>
                ))}
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-auto inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {item.fuente ?? "fuente"}
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
