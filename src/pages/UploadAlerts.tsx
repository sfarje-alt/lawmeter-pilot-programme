import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scale, FileText, Download, ArrowLeft, CheckCircle2 } from "lucide-react";
import { JsonDropzone } from "@/components/upload/JsonDropzone";
import { AlertsPreviewList } from "@/components/upload/AlertsPreviewList";
import {
  parseManualPayload,
  PL_TEMPLATE,
  NORMA_TEMPLATE,
  type NormalizedItem,
} from "@/lib/manualAlertSchema";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics/mixpanel";
import { AnalyticsEvents } from "@/lib/analytics/events";

type Tipo = "pl" | "norma";

interface UploadAlertsProps {
  onGoToInbox?: (tab: "bills" | "regulations") => void;
}

export default function UploadAlerts({ onGoToInbox }: UploadAlertsProps) {
  const [activeTipo, setActiveTipo] = useState<Tipo>("pl");
  const [items, setItems] = useState<NormalizedItem[] | null>(null);
  const [itemsTipo, setItemsTipo] = useState<Tipo>("pl");
  const [filename, setFilename] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFile = (text: string, name: string, tipo: Tipo) => {
    let raw: unknown;
    try {
      raw = JSON.parse(text);
    } catch (e) {
      toast({
        title: "JSON inválido",
        description: e instanceof Error ? e.message : "No se pudo parsear el archivo",
        variant: "destructive",
      });
      return;
    }
    const result = parseManualPayload(raw, tipo);
    if (result.ok === false) {
      toast({
        title: "Schema inválido",
        description: result.error,
        variant: "destructive",
      });
      return;
    }
    setItems(result.items);
    setItemsTipo(tipo);
    setFilename(name);
    trackEvent(AnalyticsEvents.ManualAlertsUploadStarted, {
      tipo,
      count: result.items.length,
    });
  };

  const downloadTemplate = (tipo: Tipo) => {
    const data = tipo === "pl" ? PL_TEMPLATE : NORMA_TEMPLATE;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `plantilla-${tipo}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const confirmUpload = async () => {
    if (!items) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "ingest-alerts-manual",
        { body: { tipo: itemsTipo, items } },
      );
      if (error) throw error;
      const result = data as {
        processed: number;
        inserted: number;
        updated: number;
        failed: { external_id: string; error: string }[];
      };
      toast({
        title: "Alertas cargadas",
        description: `${result.inserted} nuevas · ${result.updated} actualizadas${
          result.failed?.length ? ` · ${result.failed.length} fallidas` : ""
        }`,
      });
      trackEvent(AnalyticsEvents.ManualAlertsUploadConfirmed, {
        tipo: itemsTipo,
        inserted: result.inserted,
        updated: result.updated,
        failed: result.failed?.length ?? 0,
      });
      const goTo = itemsTipo;
      setItems(null);
      setFilename("");
      onGoToInbox?.(goTo === "pl" ? "bills" : "regulations");
    } catch (e) {
      toast({
        title: "Error al cargar",
        description: e instanceof Error ? e.message : "Error desconocido",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderTabContent = (tipo: Tipo) => {
    const isPreview = items && itemsTipo === tipo;
    if (isPreview && items) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setItems(null);
                  setFilename("");
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Cancelar
              </Button>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {items.length}{" "}
                  {tipo === "pl" ? "proyecto(s) de ley" : "norma(s)"} detectada(s)
                </p>
                {filename && (
                  <p className="text-xs text-muted-foreground">{filename}</p>
                )}
              </div>
            </div>
            <Button onClick={confirmUpload} disabled={submitting}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {submitting
                ? "Cargando..."
                : "Confirmar e ingresar al inbox"}
            </Button>
          </div>
          <AlertsPreviewList items={items} />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Sube un archivo JSON con{" "}
            {tipo === "pl" ? "proyectos de ley" : "normas"} para previsualizar
            antes de ingresarlos al inbox.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => downloadTemplate(tipo)}
          >
            <Download className="h-4 w-4 mr-1" />
            Descargar plantilla
          </Button>
        </div>
        <JsonDropzone
          onFile={(text, name) => handleFile(text, name, tipo)}
          disabled={submitting}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cargar alertas</h1>
          <p className="text-muted-foreground">
            Subida manual de proyectos de ley y normas vía JSON.
          </p>
        </div>
        <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary">
          Subida manual
        </Badge>
      </div>

      <Tabs
        value={activeTipo}
        onValueChange={(v) => {
          setActiveTipo(v as Tipo);
          setItems(null);
          setFilename("");
        }}
      >
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted/30">
          <TabsTrigger value="pl" className="flex items-center gap-2">
            <Scale className="h-4 w-4" />
            Proyectos de Ley
          </TabsTrigger>
          <TabsTrigger value="norma" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Normas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pl" className="mt-6">
          {renderTabContent("pl")}
        </TabsContent>
        <TabsContent value="norma" className="mt-6">
          {renderTabContent("norma")}
        </TabsContent>
      </Tabs>
    </div>
  );
}
