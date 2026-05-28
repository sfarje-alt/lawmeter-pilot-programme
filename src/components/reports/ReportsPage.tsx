import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText, Mail, Send, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { useReports, type ReportArchivo } from "@/hooks/useReports";
import { RecipientsManager } from "./RecipientsManager";
import { GenerateReportDialog } from "./GenerateReportDialog";

function useClients() {
  return useQuery({
    queryKey: ["clients-for-reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id, client_name, internal_code")
        .order("client_name");
      if (error) throw error;
      return data ?? [];
    },
  });
}

function downloadFile(archivo: ReportArchivo) {
  const url = archivo.signed_url || archivo.public_url;
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
}

function FormatChip({ archivo }: { archivo: ReportArchivo }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => downloadFile(archivo)}
      disabled={!archivo.public_url && !archivo.signed_url}
      className="h-7 gap-1"
    >
      <Download className="h-3 w-3" />
      {archivo.format?.toUpperCase() || "ARCHIVO"}
    </Button>
  );
}

export function ReportsPage() {
  const { profile } = useAuth();
  const userClientId = profile?.client_id ?? null;
  const isRestrictedToOwnClient = !!userClientId;

  const [clientFilter, setClientFilter] = useState<string>(
    userClientId ?? "all"
  );
  const [generateOpen, setGenerateOpen] = useState(false);

  const { data: allClients = [] } = useClients();
  // Restrict client list to the user's own client when profile.client_id is set
  const clients = useMemo(
    () =>
      isRestrictedToOwnClient
        ? allClients.filter((c) => c.id === userClientId)
        : allClients,
    [allClients, isRestrictedToOwnClient, userClientId]
  );

  // Keep filter synced if profile loads after first render
  useEffect(() => {
    if (isRestrictedToOwnClient && clientFilter !== userClientId) {
      setClientFilter(userClientId);
    }
  }, [isRestrictedToOwnClient, userClientId, clientFilter]);

  const { data: reports = [], isLoading } = useReports(
    clientFilter === "all" ? null : clientFilter
  );

  const recipientsClientId = clientFilter === "all" ? null : clientFilter;
  const selectedClient = useMemo(
    () => clients.find((c) => c.id === clientFilter) ?? null,
    [clients, clientFilter]
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Reportes</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Reportes regulatorios generados por el backend de LawMeter. PDF y DOCX descargables, distribución por email configurable.
          </p>
        </div>
        <Button onClick={() => setGenerateOpen(true)} className="gap-2">
          <Send className="h-4 w-4" />
          Generar reporte ahora
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Cliente:</span>
        <Select value={clientFilter} onValueChange={setClientFilter}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Todos los clientes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los clientes</SelectItem>
            {clients.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.client_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList>
          <TabsTrigger value="history" className="gap-2">
            <FileText className="h-4 w-4" />
            Histórico
          </TabsTrigger>
          <TabsTrigger value="distribution" className="gap-2" disabled={!recipientsClientId}>
            <Mail className="h-4 w-4" />
            Distribución{selectedClient ? ` · ${selectedClient.client_name}` : ""}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reportes históricos</CardTitle>
              <CardDescription>
                {isLoading ? "Cargando..." : `${reports.length} reporte(s)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : reports.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  No hay reportes todavía. El backend los publicará automáticamente cada lunes o cuando los generes manualmente.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Modelo</TableHead>
                      <TableHead className="text-right">PL</TableHead>
                      <TableHead className="text-right">Normas</TableHead>
                      <TableHead className="text-right">Sesiones</TableHead>
                      <TableHead className="text-right">Decisiones</TableHead>
                      <TableHead>Generado</TableHead>
                      <TableHead>Descargas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.cliente_nombre}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {format(new Date(r.periodo_desde), "dd MMM", { locale: es })} – {format(new Date(r.periodo_hasta), "dd MMM yyyy", { locale: es })}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Modelo {r.modelo.toUpperCase()}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{r.total_pl}</TableCell>
                        <TableCell className="text-right">{r.total_normas}</TableCell>
                        <TableCell className="text-right">{r.total_sesiones}</TableCell>
                        <TableCell className="text-right">{r.decisiones_requeridas}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {format(new Date(r.generated_at), "dd MMM HH:mm", { locale: es })}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {r.archivos.length === 0 ? (
                              <span className="text-xs text-muted-foreground">—</span>
                            ) : (
                              r.archivos.map((a, i) => <FormatChip key={i} archivo={a} />)
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="mt-4">
          {selectedClient && (
            <RecipientsManager clientId={selectedClient.id} clientName={selectedClient.client_name} />
          )}
        </TabsContent>
      </Tabs>

      <GenerateReportDialog
        open={generateOpen}
        onOpenChange={setGenerateOpen}
        clients={clients}
        defaultClientId={clientFilter === "all" ? undefined : clientFilter}
      />
    </div>
  );
}
