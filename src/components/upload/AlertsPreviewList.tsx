import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import type { NormalizedItem } from "@/lib/manualAlertSchema";

interface AlertsPreviewListProps {
  items: NormalizedItem[];
}

function categoriaColor(c?: string) {
  switch ((c ?? "").toLowerCase()) {
    case "grave":
      return "bg-destructive/20 text-destructive border-destructive/30";
    case "alto":
    case "alta":
      return "bg-orange-500/20 text-orange-500 border-orange-500/30";
    case "medio":
    case "media":
      return "bg-amber-500/20 text-amber-500 border-amber-500/30";
    case "leve":
    case "bajo":
    case "baja":
      return "bg-emerald-500/20 text-emerald-500 border-emerald-500/30";
    case "positivo":
      return "bg-sky-500/20 text-sky-500 border-sky-500/30";
    default:
      return "bg-muted/40 text-muted-foreground border-white/10";
  }
}

export function AlertsPreviewList({ items }: AlertsPreviewListProps) {
  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const isPL = item.tipo === "pl";
        const ref = isPL
          ? item.num_proyecto ?? item.external_id
          : item.num_norma ?? item.external_id;
        const fecha = isPL ? item.fecha_proyecto : item.fecha;
        const titulo = isPL
          ? `Proyecto de Ley N° ${item.num_proyecto ?? item.external_id}`
          : `${item.num_norma ?? item.external_id}`;
        const entidad = isPL ? item.grupo_parlamentario : item.institucion;
        const ann = item.annotation;
        return (
          <Card key={`${item.external_id}-${idx}`} className="bg-card/60">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {ref}
                    </Badge>
                    {fecha && (
                      <span className="text-xs text-muted-foreground">
                        {fecha}
                      </span>
                    )}
                    {entidad && (
                      <Badge variant="secondary" className="text-xs">
                        {entidad}
                      </Badge>
                    )}
                    {isPL && item.ult_estado && (
                      <Badge variant="outline" className="text-xs">
                        {item.ult_estado}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-medium text-foreground leading-snug">
                    {titulo}
                  </h3>
                  {isPL && item.autor && (
                    <p className="text-xs text-muted-foreground">
                      Autor: {item.autor}
                    </p>
                  )}
                  {item.texto_completo && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.texto_completo}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {ann?.impacto && (
                    <Badge
                      variant="outline"
                      className={categoriaColor(ann.impacto)}
                    >
                      Impacto {ann.impacto}
                    </Badge>
                  )}
                  {ann?.urgencia && (
                    <Badge
                      variant="outline"
                      className={categoriaColor(ann.urgencia)}
                    >
                      Urgencia {ann.urgencia}
                    </Badge>
                  )}
                </div>
              </div>
              {ann?.comentario_experto && (
                <p className="text-xs italic text-muted-foreground border-l-2 border-primary/40 pl-2">
                  {ann.client_key}: {ann.comentario_experto}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {ann?.area_interes.map((a) => (
                  <Badge key={a} variant="secondary" className="text-xs">
                    {a}
                  </Badge>
                ))}
                {item.enlace && (
                  <a
                    href={item.enlace}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-auto inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Fuente
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
