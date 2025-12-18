import { useState, useMemo } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ExternalLink, 
  Calendar, 
  Users, 
  Building, 
  FileText,
  History,
  Scale,
  Info,
  ChevronRight,
  ThumbsUp,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Copy,
  Check,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  UnifiedLegislationItem, 
  getRiskBadgeClass, 
  formatLegislationDate 
} from "@/types/unifiedLegislation";
import { 
  JurisdictionConfig, 
  getInstrumentType,
  getPipelineStages 
} from "@/config/jurisdictionConfig";
import { regionThemes, RegionIcon } from "@/components/regions/RegionConfig";

interface UnifiedLegislationDrawerProps {
  item: UnifiedLegislationItem | null;
  config: JurisdictionConfig;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UnifiedLegislationDrawer({ 
  item, 
  config, 
  open, 
  onOpenChange 
}: UnifiedLegislationDrawerProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // All hooks must be called before any conditional returns
  const theme = item ? regionThemes[item.region] : regionThemes.NAM;
  const instrumentType = item ? getInstrumentType(config, item.instrumentType) : null;
  const pipelineStages = item ? getPipelineStages(config, item.instrumentType) : [];
  
  // Check if Peru data
  const isPeru = item?.jurisdictionCode === "PE" && item?.peruData;
  const peruData = item?.peruData;
  const isLatam = item?.region === "LATAM";
  
  // Check if Costa Rica data
  const isCostaRica = item?.jurisdictionCode === "CR" && item?.costaRicaData;
  const crData = item?.costaRicaData;

  // Calculate current stage index for pipeline items
  const currentStageIndex = useMemo(() => {
    if (!item) return 0;
    if (item.isInForce) return pipelineStages.length - 1;
    if (item.currentStageIndex !== undefined) return item.currentStageIndex;
    
    const statusLower = item.status.toLowerCase();
    const idx = pipelineStages.findIndex(stage => 
      statusLower.includes(stage.toLowerCase())
    );
    return idx >= 0 ? idx : 0;
  }, [item, pipelineStages]);

  // Build jurisdiction line - special handling for Peru and Costa Rica
  const jurisdictionLine = useMemo(() => {
    if (!item) return "";
    
    // Costa Rica: NO "Federal" label
    if (isCostaRica && crData) {
      const parts = [];
      const nivelLabel = crData.nivel === "nacional" ? "Nacional" :
                        crData.nivel === "municipal" ? "Municipal" :
                        "Institucional/Regulatorio";
      parts.push(nivelLabel);
      if (crData.nivel === "municipal" && crData.canton) {
        parts.push(crData.canton);
      }
      parts.push(crData.organoEmisor);
      return parts.filter(Boolean).join(" · ");
    }
    
    // Peru handling
    if (isPeru && peruData) {
      const parts = [];
      const nivelLabel = peruData.nivel === "nacional" ? "Nacional" :
                        peruData.nivel === "regional" ? "Regional" :
                        "Municipal/Local";
      parts.push(nivelLabel);
      if (peruData.departamento) parts.push(peruData.departamento);
      if (peruData.municipio) parts.push(peruData.municipio);
      parts.push(item.authorityLabel || item.authority);
      return parts.filter(Boolean).join(" · ");
    }
    
    const parts = [
      item.jurisdictionLevel.charAt(0).toUpperCase() + item.jurisdictionLevel.slice(1),
      item.subnationalUnit || config.code,
      item.authorityLabel || item.authority
    ].filter(Boolean);
    return parts.join(" · ");
  }, [item, config, isPeru, peruData]);

  // Early return after all hooks
  if (!item) return null;

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(id);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] flex flex-col">
        <DrawerHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Region badge */}
                <Badge 
                  variant="outline" 
                  className="text-xs font-bold tracking-wider gap-1"
                  style={{ 
                    borderColor: theme.primaryColor,
                    color: theme.primaryColor
                  }}
                >
                  <RegionIcon region={item.region} size={12} showCode={false} />
                  {item.region}
                </Badge>
                
                {/* Identifier */}
                <Badge variant="outline" className="font-mono">
                  {item.identifier}
                </Badge>
                
                {/* Lifecycle */}
                <Badge 
                  variant="outline"
                  className={cn(
                    item.isInForce 
                      ? "bg-success/10 text-success border-success/30" 
                      : "bg-warning/10 text-warning border-warning/30"
                  )}
                >
                  {item.isInForce ? "In Force" : "Pipeline"}
                </Badge>
                
                {/* Document type */}
                {instrumentType && (
                  <Badge variant="secondary">
                    {instrumentType.emoji} {instrumentType.label}
                  </Badge>
                )}
              </div>
              <DrawerTitle className="text-left">{item.title}</DrawerTitle>
              
              {/* Jurisdiction line */}
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                {item.jurisdictionLevel !== "federal" ? (
                  <MapPin className="h-4 w-4" />
                ) : (
                  <Building className="h-4 w-4" />
                )}
                <span>{jurisdictionLine}</span>
              </div>
            </div>
            
            {item.sourceUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Source
                </a>
              </Button>
            )}
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview">
                <Info className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="analysis">
                <TrendingUp className="h-4 w-4 mr-2" />
                AI Analysis
              </TabsTrigger>
              <TabsTrigger value="votes">
                <ThumbsUp className="h-4 w-4 mr-2" />
                Votes
              </TabsTrigger>
              <TabsTrigger value="sponsors">
                <Users className="h-4 w-4 mr-2" />
                Sponsors
              </TabsTrigger>
              <TabsTrigger value="actions">
                <History className="h-4 w-4 mr-2" />
                Actions
              </TabsTrigger>
              <TabsTrigger value="summaries">
                <FileText className="h-4 w-4 mr-2" />
                Summaries
              </TabsTrigger>
              <TabsTrigger value="fulltext">
                <Scale className="h-4 w-4 mr-2" />
                Full Text
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Status Tracker */}
              {!item.isInForce && pipelineStages.length > 0 && (
                <div 
                  className="p-6 rounded-lg border"
                  style={{ 
                    backgroundColor: `${theme.primaryColor}08`,
                    borderColor: `${theme.primaryColor}20`
                  }}
                >
                  <p className="text-sm font-semibold text-muted-foreground mb-4">Legislative Status</p>
                  <div className="flex items-center gap-1">
                    {pipelineStages.map((stage, index) => (
                      <div key={stage} className="flex items-center flex-1">
                        {index > 0 && (
                          <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mx-1" />
                        )}
                        <div className="flex flex-col items-center flex-1">
                          <div 
                            className={cn(
                              "w-full h-2 rounded-full transition-colors",
                              index <= currentStageIndex ? "" : "bg-muted"
                            )}
                            style={{
                              backgroundColor: index <= currentStageIndex ? theme.primaryColor : undefined
                            }}
                          />
                          <span className={cn(
                            "text-xs mt-2 font-medium text-center",
                            index === currentStageIndex 
                              ? "text-foreground font-semibold" 
                              : "text-muted-foreground"
                          )}
                          style={{
                            color: index === currentStageIndex ? theme.primaryColor : undefined
                          }}
                          >
                            {stage}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Dates */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Key Dates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {item.publishedDate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Published:</span>
                      <span className="font-medium">{formatLegislationDate(item.publishedDate)}</span>
                    </div>
                  )}
                  {item.effectiveDate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Effective Date:</span>
                      <span className="font-medium">{formatLegislationDate(item.effectiveDate)}</span>
                    </div>
                  )}
                  {item.complianceDeadline && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground text-warning flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Compliance Deadline:
                      </span>
                      <span className="font-medium text-warning">{formatLegislationDate(item.complianceDeadline)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Summary */}
              {item.summary && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.summary}</p>
                  </CardContent>
                </Card>
              )}

              {/* Risk Assessment */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Badge className={cn("text-sm px-3 py-1", getRiskBadgeClass(item.riskLevel))}>
                      {item.riskLevel.charAt(0).toUpperCase() + item.riskLevel.slice(1)} Risk
                    </Badge>
                    {item.riskScore !== undefined && (
                      <span className="text-sm text-muted-foreground">
                        Score: <span className="font-semibold">{item.riskScore}</span>/100
                      </span>
                    )}
                  </div>
                  {item.policyArea && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Policy Area: <span className="font-medium text-foreground">{item.policyArea}</span>
                    </p>
                  )}
                  {item.regulatoryCategory && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Category: <span className="font-medium text-foreground">{item.regulatoryCategory}</span>
                    </p>
                  )}
                </CardContent>
              </Card>
              
              {/* Peru-specific Legal Details */}
              {isPeru && peruData && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      {isLatam ? "Información Jurídica" : "Legal Information"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">País:</span>
                        <span className="font-medium ml-2">Perú</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Nivel:</span>
                        <span className="font-medium ml-2">
                          {peruData.nivel === "nacional" ? "Nacional" :
                           peruData.nivel === "regional" ? "Regional" : "Municipal/Local"}
                        </span>
                      </div>
                      {peruData.departamento && (
                        <div>
                          <span className="text-muted-foreground">Departamento:</span>
                          <span className="font-medium ml-2">{peruData.departamento}</span>
                        </div>
                      )}
                      {peruData.municipio && (
                        <div>
                          <span className="text-muted-foreground">Municipio:</span>
                          <span className="font-medium ml-2">{peruData.municipio}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground">Tipo de Norma:</span>
                        <span className="font-medium ml-2">
                          {peruData.tipoNorma === "ley" ? "Ley" :
                           peruData.tipoNorma === "decreto-legislativo" ? "Decreto Legislativo" :
                           peruData.tipoNorma === "decreto-supremo" ? "Decreto Supremo" :
                           peruData.tipoNorma === "resolucion-ministerial" ? "Resolución Ministerial" :
                           peruData.tipoNorma === "resolucion-directoral" ? "Resolución Directoral" :
                           peruData.tipoNorma === "ordenanza-regional" ? "Ordenanza Regional" :
                           peruData.tipoNorma === "ordenanza-municipal" ? "Ordenanza Municipal" :
                           peruData.tipoNorma === "ntp" ? "Norma Técnica Peruana (NTP)" : peruData.tipoNorma}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Carácter:</span>
                        <span className="font-medium ml-2">
                          {peruData.esVinculante ? "Obligatorio" : "Voluntario"}
                        </span>
                      </div>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Autoridad Emisora:</span>
                        <span className="font-medium ml-2">{item.authority}</span>
                      </div>
                      {peruData.autoridadFiscalizadora && (
                        <div>
                          <span className="text-muted-foreground">Fiscalización/Supervisión:</span>
                          <span className="font-medium ml-2">{peruData.autoridadFiscalizadora}</span>
                        </div>
                      )}
                      {peruData.fuentePublicacion && (
                        <div>
                          <span className="text-muted-foreground">Fuente de Publicación:</span>
                          <span className="font-medium ml-2">{peruData.fuentePublicacion}</span>
                        </div>
                      )}
                    </div>
                    
                    {peruData.regimenTransitorio && (
                      <>
                        <Separator className="my-3" />
                        <div className="text-sm">
                          <span className="text-muted-foreground font-medium">Régimen Transitorio:</span>
                          <p className="mt-1">{peruData.regimenTransitorio}</p>
                        </div>
                      </>
                    )}
                    
                    {peruData.obligacionesAfectadas && peruData.obligacionesAfectadas.length > 0 && (
                      <>
                        <Separator className="my-3" />
                        <div className="text-sm">
                          <span className="text-muted-foreground font-medium">Obligaciones Afectadas:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {peruData.obligacionesAfectadas.map((obligacion, idx) => (
                              <Badge key={idx} variant="outline">{obligacion}</Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    
                    {/* NTP Voluntariness Qualifier */}
                    {!peruData.esVinculante && peruData.calificadorVoluntariedad && (
                      <>
                        <Separator className="my-3" />
                        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-sm">
                          <p className="text-blue-800 font-medium mb-1">⚠️ Nota sobre Aplicación</p>
                          <p className="text-blue-700">{peruData.calificadorVoluntariedad}</p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {/* Costa Rica-specific Legal Details */}
              {isCostaRica && crData && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Información Jurídica
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">País:</span>
                        <span className="font-medium ml-2">Costa Rica</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Nivel:</span>
                        <span className="font-medium ml-2">
                          {crData.nivel === "nacional" ? "Nacional" :
                           crData.nivel === "municipal" ? "Municipal" : "Institucional/Regulatorio"}
                        </span>
                      </div>
                      {crData.provincia && (
                        <div>
                          <span className="text-muted-foreground">Provincia:</span>
                          <span className="font-medium ml-2">{crData.provincia}</span>
                        </div>
                      )}
                      {crData.canton && (
                        <div>
                          <span className="text-muted-foreground">Cantón:</span>
                          <span className="font-medium ml-2">{crData.canton}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground">Tipo de Norma:</span>
                        <span className="font-medium ml-2">
                          {crData.tipoNorma === "proyecto_ley" ? "Proyecto de Ley" :
                           crData.tipoNorma === "ley" ? "Ley" :
                           crData.tipoNorma === "decreto_ejecutivo" ? "Decreto Ejecutivo" :
                           crData.tipoNorma === "reglamento" ? "Reglamento" :
                           crData.tipoNorma === "ordenanza_municipal" ? "Ordenanza Municipal" :
                           crData.tipoNorma === "normativa_regulatoria" ? "Normativa Regulatoria" :
                           crData.tipoNorma}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tipo Emisor:</span>
                        <span className="font-medium ml-2">
                          {crData.tipoEmisor === "legislativo" ? "Legislativo" :
                           crData.tipoEmisor === "ejecutivo" ? "Ejecutivo" :
                           crData.tipoEmisor === "municipal" ? "Municipal" :
                           crData.tipoEmisor === "regulador" ? "Regulador" : "Institución Autónoma"}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Órgano Emisor:</span>
                        <span className="font-medium ml-2">{crData.organoEmisor}</span>
                      </div>
                      {crData.organoCompetente && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Órgano Competente/Fiscalizador:</span>
                          <span className="font-medium ml-2">{crData.organoCompetente}</span>
                        </div>
                      )}
                      {crData.comisionLegislativa && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Comisión Legislativa:</span>
                          <span className="font-medium ml-2">{crData.comisionLegislativa}</span>
                        </div>
                      )}
                      {crData.numeroGaceta && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Publicación en La Gaceta:</span>
                          <span className="font-medium ml-2">{crData.numeroGaceta}</span>
                        </div>
                      )}
                    </div>
                    
                    {crData.plazosTransitorios && (
                      <>
                        <Separator className="my-3" />
                        <div className="text-sm">
                          <span className="text-muted-foreground font-medium">Régimen Transitorio:</span>
                          <p className="mt-1">{crData.plazosTransitorios}</p>
                        </div>
                      </>
                    )}
                    
                    {/* State Qualifier for Projects */}
                    {crData.calificadorEstado && item.isPipeline && (
                      <>
                        <Separator className="my-3" />
                        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm">
                          <p className="text-amber-800 font-medium mb-1">⚠️ Estado del Instrumento</p>
                          <p className="text-amber-700">{crData.calificadorEstado}</p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* AI Analysis Tab - Simplified like US Federal */}
            <TabsContent value="analysis" className="space-y-6 mt-6">
              {/* Risk Assessment Card - Always show with mock fallback */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Risk Assessment for Smart Kitchen Appliances
                    </CardTitle>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "px-3 py-1",
                        item.riskLevel === "high" ? "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20" :
                        item.riskLevel === "medium" ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20" :
                        "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                      )}
                    >
                      {item.riskLevel.charAt(0).toUpperCase() + item.riskLevel.slice(1)} Risk
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Risk Score</span>
                      <span className="font-bold text-lg">{item.riskScore || 0}/100</span>
                    </div>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all",
                          (item.riskScore || 0) >= 75 ? "bg-red-500" :
                          (item.riskScore || 0) >= 50 ? "bg-orange-500" :
                          (item.riskScore || 0) >= 25 ? "bg-yellow-500" : "bg-green-500"
                        )}
                        style={{ width: `${item.riskScore || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Impact Analysis
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {item.aiSummary?.riskExplanation && item.aiSummary.riskExplanation.length > 100 
                        ? item.aiSummary.riskExplanation 
                        : item.aiSummary?.executiveSummary && item.aiSummary.executiveSummary.length > 100
                        ? item.aiSummary.executiveSummary
                        : `This regulation presents significant compliance implications for smart kitchen appliance manufacturers operating in ${item.jurisdictionCode === "PE" ? "Peru" : item.jurisdictionCode === "CR" ? "Costa Rica" : "this jurisdiction"}.

Key Business Impacts:
• Product Compliance: May require modifications to product design, safety features, labeling requirements, or technical documentation to meet new regulatory standards.
• Certification Requirements: Potential need for new product certifications, testing by accredited laboratories, and registration with regulatory authorities before market entry.
• Supply Chain Considerations: Suppliers and components may need to be re-evaluated to ensure compliance with material restrictions, safety standards, or traceability requirements.
• Operational Changes: Internal processes for quality control, documentation, and compliance monitoring may require updates.

Financial Considerations:
• Compliance costs estimated between $15,000-$75,000 depending on product portfolio size and current compliance status.
• Potential penalties for non-compliance range from administrative fines to product recalls and market access restrictions.
• Timeline for compliance typically 6-12 months from effective date.

Recommended Actions:
• Conduct gap analysis against current product portfolio
• Engage with local regulatory consultants for interpretation guidance
• Budget for certification and testing requirements
• Monitor for implementing regulations and technical standards`}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Stakeholder Analysis Card - Always show with mock fallback */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Stakeholder Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(item.aiSummary?.stakeholderAnalysis && item.aiSummary.stakeholderAnalysis.length > 0) ? (
                      item.aiSummary.stakeholderAnalysis.map((stakeholder, index) => (
                        <div 
                          key={index} 
                          className="p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              {stakeholder.type === "industry" || stakeholder.type === "internal" ? (
                                <Building className="h-4 w-4" />
                              ) : stakeholder.type === "regulatory" ? (
                                <Scale className="h-4 w-4" />
                              ) : (
                                <Users className="h-4 w-4" />
                              )}
                              <div>
                                <h4 className="font-semibold">{stakeholder.stakeholder}</h4>
                                <Badge variant="outline" className="mt-1 capitalize">
                                  {stakeholder.type}
                                </Badge>
                              </div>
                            </div>
                            <Badge className={cn(
                              stakeholder.impactLevel === "high" ? "bg-red-500/10 text-red-700 dark:text-red-400" :
                              stakeholder.impactLevel === "medium" ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400" :
                              "bg-green-500/10 text-green-700 dark:text-green-400"
                            )}>
                              {stakeholder.impactLevel.charAt(0).toUpperCase() + stakeholder.impactLevel.slice(1)} Impact
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {stakeholder.impactDescription}
                          </p>
                        </div>
                      ))
                    ) : (
                      /* Mock stakeholder data as fallback */
                      <>
                        <div className="p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <Scale className="h-4 w-4" />
                              <div>
                                <h4 className="font-semibold">{item.jurisdictionCode === "PE" ? "INDECOPI / DIGESA" : item.jurisdictionCode === "CR" ? "MEIC / Ministerio de Salud" : "Regulatory Authority"}</h4>
                                <Badge variant="outline" className="mt-1">Regulatory</Badge>
                              </div>
                            </div>
                            <Badge className="bg-red-500/10 text-red-700 dark:text-red-400">High Impact</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Primary enforcement authority responsible for compliance verification, product registration, and sanctions for non-compliance.
                          </p>
                        </div>
                        <div className="p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              <div>
                                <h4 className="font-semibold">Smart Kitchen Appliance Manufacturers</h4>
                                <Badge variant="outline" className="mt-1">Industry</Badge>
                              </div>
                            </div>
                            <Badge className="bg-red-500/10 text-red-700 dark:text-red-400">High Impact</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Must adapt product designs, update documentation, obtain new certifications, and potentially modify supply chain to meet new requirements.
                          </p>
                        </div>
                        <div className="p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <div>
                                <h4 className="font-semibold">Importers & Distributors</h4>
                                <Badge variant="outline" className="mt-1">External</Badge>
                              </div>
                            </div>
                            <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">Medium Impact</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Must verify compliance documentation, update import registrations, and ensure products meet local market requirements before distribution.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="text-xs text-muted-foreground text-center pt-2">
                <p>AI-generated analysis based on legislation text</p>
              </div>
            </TabsContent>

            {/* Votes Tab */}
            <TabsContent value="votes" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ThumbsUp className="h-5 w-5" />
                    Voting Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {item.votingRecords && item.votingRecords.length > 0 ? (
                    <div className="space-y-4">
                      {item.votingRecords.map((vote, idx) => (
                        <div key={idx} className="p-4 rounded-lg bg-muted/50">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-medium">{vote.chamber}</p>
                              <p className="text-xs text-muted-foreground">{formatLegislationDate(vote.date)}</p>
                            </div>
                            <Badge variant={vote.passed ? "default" : "destructive"}>
                              {vote.passed ? "Passed" : "Failed"}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-2xl font-bold text-success">{vote.yea}</p>
                              <p className="text-xs text-muted-foreground">Yea</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-destructive">{vote.nay}</p>
                              <p className="text-xs text-muted-foreground">Nay</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-muted-foreground">{vote.abstain}</p>
                              <p className="text-xs text-muted-foreground">Abstain</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <ThumbsUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No voting records available for this legislation.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sponsors Tab */}
            <TabsContent value="sponsors" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Sponsors & Cosponsors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {item.sponsors && item.sponsors.length > 0 ? (
                    <div className="space-y-4">
                      {item.sponsors.map((sponsor, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{sponsor.name}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              {sponsor.party && <Badge variant="outline" className="text-xs">{sponsor.party}</Badge>}
                              {sponsor.state && <span>{sponsor.state}</span>}
                              {sponsor.role && <span>• {sponsor.role}</span>}
                            </div>
                          </div>
                          <Badge variant={idx === 0 ? "default" : "secondary"}>
                            {idx === 0 ? "Primary Sponsor" : "Cosponsor"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No sponsor information available.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Actions Tab */}
            <TabsContent value="actions" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Action History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {item.actions && item.actions.length > 0 ? (
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                      <div className="space-y-4">
                        {item.actions.map((action, idx) => (
                          <div key={idx} className="relative pl-10">
                            <div 
                              className="absolute left-2.5 w-3 h-3 rounded-full border-2 border-background"
                              style={{ backgroundColor: idx === 0 ? theme.primaryColor : 'hsl(var(--muted))' }}
                            />
                            <div className="p-3 rounded-lg bg-muted/50">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-xs text-muted-foreground">{formatLegislationDate(action.date)}</p>
                                {action.chamber && (
                                  <Badge variant="outline" className="text-xs">{action.chamber}</Badge>
                                )}
                              </div>
                              <p className="text-sm">{action.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No action history available.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Summaries Tab */}
            <TabsContent value="summaries" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Official Summaries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {item.summaries && item.summaries.length > 0 ? (
                    <div className="space-y-4">
                      {item.summaries.map((summary, idx) => (
                        <div key={idx} className="p-4 rounded-lg bg-muted/50">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{summary.versionName || `Version ${idx + 1}`}</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(summary.text, `summary-${idx}`)}
                            >
                              {copiedText === `summary-${idx}` ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{summary.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No official summaries available.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Full Text Tab */}
            <TabsContent value="fulltext" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="h-5 w-5" />
                      Full Legislative Text
                    </CardTitle>
                    {item.fullText && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(item.fullText!, "fulltext")}
                      >
                        {copiedText === "fulltext" ? (
                          <Check className="h-4 w-4 mr-2" />
                        ) : (
                          <Copy className="h-4 w-4 mr-2" />
                        )}
                        Copy
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {item.fullText ? (
                    <div className="p-4 rounded-lg bg-muted/50 max-h-[500px] overflow-y-auto">
                      <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">
                        {item.fullText}
                      </pre>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Scale className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Full text not available.</p>
                      {item.sourceUrl && (
                        <Button variant="link" asChild className="mt-2">
                          <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
                            View on official source
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default UnifiedLegislationDrawer;
