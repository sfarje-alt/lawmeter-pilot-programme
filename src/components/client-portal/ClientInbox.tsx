import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scale, FileText, Search, Eye, Calendar, User, Building2, ExternalLink, Lightbulb } from "lucide-react";
import { ALL_MOCK_ALERTS, PeruAlert, MOCK_CLIENTS, IMPACT_LEVELS } from "@/data/peruAlertsMockData";
import { useClientUser } from "@/hooks/useClientUser";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function ClientInbox() {
  const { clientId, clientName } = useClientUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAlert, setSelectedAlert] = useState<PeruAlert | null>(null);

  // Filter only published alerts for this client
  const publishedAlerts = useMemo(() => {
    return ALL_MOCK_ALERTS.filter(alert => 
      alert.status === "published" && 
      (alert.client_id === clientId || alert.primary_client_id === clientId)
    );
  }, [clientId]);

  // Further filter by search
  const filteredAlerts = useMemo(() => {
    if (!searchQuery.trim()) return publishedAlerts;
    const query = searchQuery.toLowerCase();
    return publishedAlerts.filter(alert =>
      alert.legislation_title.toLowerCase().includes(query) ||
      alert.affected_areas.some(area => area.toLowerCase().includes(query)) ||
      alert.author?.toLowerCase().includes(query) ||
      alert.entity?.toLowerCase().includes(query)
    );
  }, [publishedAlerts, searchQuery]);

  // Split by type
  const bills = filteredAlerts.filter(a => a.legislation_type === "proyecto_de_ley");
  const regulations = filteredAlerts.filter(a => a.legislation_type === "norma");

  const getImpactBadge = (level?: string) => {
    const impact = IMPACT_LEVELS.find(i => i.value === level);
    if (!impact) return null;
    return <Badge className={impact.color}>{impact.label}</Badge>;
  };

  const AlertCard = ({ alert }: { alert: PeruAlert }) => {
    const clientCommentary = alert.client_commentaries?.find(c => c.clientId === clientId);
    const commentary = clientCommentary?.commentary || alert.expert_commentary;

    return (
      <Card 
        className="bg-card/50 border-border/50 hover:border-primary/30 transition-all cursor-pointer"
        onClick={() => setSelectedAlert(alert)}
      >
        <CardContent className="p-4 space-y-3">
          {/* Title */}
          <h3 className="font-medium text-foreground line-clamp-2 text-sm">
            {alert.legislation_title}
          </h3>

          {/* Metadata Row */}
          <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
            {alert.legislation_type === "proyecto_de_ley" ? (
              <>
                {alert.legislation_id && (
                  <Badge variant="outline" className="text-xs">
                    {alert.legislation_id}
                  </Badge>
                )}
                {alert.current_stage && (
                  <Badge variant="secondary" className="text-xs">
                    {alert.current_stage}
                  </Badge>
                )}
              </>
            ) : (
              <>
                {alert.entity && (
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {alert.entity}
                  </span>
                )}
              </>
            )}
            {getImpactBadge(alert.impact_level)}
          </div>

          {/* Areas */}
          <div className="flex flex-wrap gap-1">
            {alert.affected_areas.slice(0, 3).map((area, i) => (
              <Badge key={i} variant="outline" className="text-xs bg-primary/10 border-primary/30">
                {area}
              </Badge>
            ))}
            {alert.affected_areas.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{alert.affected_areas.length - 3}
              </Badge>
            )}
          </div>

          {/* Commentary Preview */}
          {commentary && (
            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded">
              <Lightbulb className="h-3 w-3 mt-0.5 text-yellow-500 shrink-0" />
              <span className="line-clamp-2">{commentary}</span>
            </div>
          )}

          {/* Date */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>
              {alert.stage_date || alert.publication_date || alert.project_date
                ? format(new Date(alert.stage_date || alert.publication_date || alert.project_date!), "dd MMM yyyy", { locale: es })
                : "Sin fecha"}
            </span>
            {alert.source_url && (
              <a 
                href={alert.source_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-auto text-primary hover:underline flex items-center gap-1"
                onClick={e => e.stopPropagation()}
              >
                <ExternalLink className="h-3 w-3" />
                Fuente
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const AlertDetailView = ({ alert }: { alert: PeruAlert }) => {
    const clientCommentary = alert.client_commentaries?.find(c => c.clientId === clientId);
    const commentary = clientCommentary?.commentary || alert.expert_commentary;

    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{alert.legislation_title}</CardTitle>
            <Badge variant="outline" className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              Solo Lectura
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {alert.legislation_id && (
              <div>
                <span className="text-muted-foreground">ID:</span>
                <span className="ml-2 font-medium">{alert.legislation_id}</span>
              </div>
            )}
            {alert.current_stage && (
              <div>
                <span className="text-muted-foreground">Estado:</span>
                <Badge variant="secondary" className="ml-2">{alert.current_stage}</Badge>
              </div>
            )}
            {alert.author && (
              <div>
                <span className="text-muted-foreground">Autor:</span>
                <span className="ml-2">{alert.author}</span>
              </div>
            )}
            {alert.parliamentary_group && (
              <div>
                <span className="text-muted-foreground">Grupo:</span>
                <span className="ml-2">{alert.parliamentary_group}</span>
              </div>
            )}
            {alert.entity && (
              <div>
                <span className="text-muted-foreground">Institución:</span>
                <span className="ml-2">{alert.entity}</span>
              </div>
            )}
            {alert.impact_level && (
              <div>
                <span className="text-muted-foreground">Impacto:</span>
                <span className="ml-2">{getImpactBadge(alert.impact_level)}</span>
              </div>
            )}
          </div>

          {/* Areas */}
          <div>
            <span className="text-sm text-muted-foreground block mb-2">Áreas Afectadas:</span>
            <div className="flex flex-wrap gap-1">
              {alert.affected_areas.map((area, i) => (
                <Badge key={i} variant="outline" className="bg-primary/10 border-primary/30">
                  {area}
                </Badge>
              ))}
            </div>
          </div>

          {/* Expert Commentary */}
          {commentary && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                <span className="font-medium text-sm">Comentario Experto</span>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{commentary}</p>
            </div>
          )}

          {/* Source Link */}
          {alert.source_url && (
            <a 
              href={alert.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
            >
              <ExternalLink className="h-4 w-4" />
              Ver Fuente Oficial
            </a>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alertas Publicadas</h1>
          <p className="text-muted-foreground">
            Alertas legislativas publicadas para {clientName || "tu organización"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-500">
            <Eye className="h-3 w-3 mr-1" />
            Solo Lectura
          </Badge>
          <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary">
            {filteredAlerts.length} alertas
          </Badge>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar alertas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alert List */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="bills">
            <TabsList className="bg-muted/30">
              <TabsTrigger value="bills" className="gap-2">
                <Scale className="h-4 w-4" />
                Proyectos de Ley
                <Badge variant="secondary">{bills.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="regulations" className="gap-2">
                <FileText className="h-4 w-4" />
                Normas
                <Badge variant="secondary">{regulations.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bills" className="mt-4">
              {bills.length === 0 ? (
                <Card className="bg-muted/20 border-dashed">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <Scale className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay proyectos de ley publicados</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {bills.map(alert => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="regulations" className="mt-4">
              {regulations.length === 0 ? (
                <Card className="bg-muted/20 border-dashed">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay normas publicadas</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {regulations.map(alert => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          {selectedAlert ? (
            <AlertDetailView alert={selectedAlert} />
          ) : (
            <Card className="bg-muted/20 border-dashed h-full min-h-[300px]">
              <CardContent className="p-8 text-center text-muted-foreground h-full flex flex-col items-center justify-center">
                <Eye className="h-12 w-12 mb-4 opacity-50" />
                <p>Selecciona una alerta para ver los detalles</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
