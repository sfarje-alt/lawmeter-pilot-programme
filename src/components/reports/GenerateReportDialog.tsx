import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ClientLite {
  id: string;
  client_name: string;
  internal_code?: string | null;
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  clients: ClientLite[];
  defaultClientId?: string;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function GenerateReportDialog({ open, onOpenChange, clients, defaultClientId }: Props) {
  const [clientId, setClientId] = useState(defaultClientId ?? "");
  const [ultimosDias, setUltimosDias] = useState("15");
  const [modelo, setModelo] = useState<"" | "a" | "b">("");
  const [formato, setFormato] = useState<"pdf" | "docx" | "both">("pdf");
  const [idioma, setIdioma] = useState("es");
  const [paises, setPaises] = useState("PE");
  const [enviarEmail, setEnviarEmail] = useState(true);
  const [destinatarios, setDestinatarios] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (defaultClientId) setClientId(defaultClientId);
  }, [defaultClientId]);

  const handleSubmit = async () => {
    if (!clientId) {
      toast({ title: "Selecciona un cliente", variant: "destructive" });
      return;
    }
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("trigger-report-generation", {
        body: {
          client_id: clientId,
          cliente: client.internal_code || slugify(client.client_name),
          ultimos_dias: ultimosDias,
          desde: null,
          hasta: null,
          modelo,
          formato,
          idioma,
          paises,
          enviar_email: enviarEmail ? "yes" : "no",
          destinatarios,
        },
      });
      if (error) throw error;
      toast({
        title: "Reporte en cola",
        description: "El backend lo generará en unos minutos y aparecerá en el histórico.",
      });
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: "Error", description: e.message ?? "No se pudo encolar", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Generar reporte ahora</DialogTitle>
          <DialogDescription>
            Dispara una generación on-demand. El backend procesará y enviará por email si corresponde.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label className="text-xs">Cliente</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.client_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Últimos días</Label>
              <Input
                type="number"
                min="1"
                max="365"
                value={ultimosDias}
                onChange={(e) => setUltimosDias(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Idioma</Label>
              <Select value={idioma} onValueChange={setIdioma}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Modelo</Label>
              <Select value={modelo} onValueChange={(v) => setModelo(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Ambos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">Ambos</SelectItem>
                  <SelectItem value="a">Modelo A (tipográfico + charts)</SelectItem>
                  <SelectItem value="b">Modelo B (tabular sobrio)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Formato</Label>
              <Select value={formato} onValueChange={(v) => setFormato(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="docx">DOCX</SelectItem>
                  <SelectItem value="both">PDF + DOCX</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Países (códigos separados por coma)</Label>
            <Input value={paises} onChange={(e) => setPaises(e.target.value)} placeholder="PE" />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm">Enviar por email</Label>
            <Switch checked={enviarEmail} onCheckedChange={setEnviarEmail} />
          </div>

          {enviarEmail && (
            <div className="space-y-1">
              <Label className="text-xs">
                Destinatarios extra (opcional, separados por coma)
              </Label>
              <Textarea
                value={destinatarios}
                onChange={(e) => setDestinatarios(e.target.value)}
                placeholder="email1@empresa.com, email2@empresa.com"
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                Se sumarán a los destinatarios configurados en Distribución.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Generar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
