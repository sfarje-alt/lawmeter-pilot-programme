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

  // Build jurisdiction line - special handling for Peru
  const jurisdictionLine = useMemo(() => {
    if (!item) return "";
    
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
            </TabsContent>

            {/* AI Analysis Tab - Enhanced Deep Analysis */}
            <TabsContent value="analysis" className="space-y-6 mt-6">
              {item.aiSummary ? (
                <>
                  {/* Executive Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2" style={{ color: theme.primaryColor }}>
                        <Sparkles className="h-5 w-5" />
                        AI-Powered Deep Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {item.aiSummary.executiveSummary && (
                        <div className="p-4 rounded-lg border" style={{ borderColor: `${theme.primaryColor}30`, backgroundColor: `${theme.primaryColor}05` }}>
                          <h4 className="text-sm font-semibold mb-2">Executive Summary</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">{item.aiSummary.executiveSummary}</p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-muted/50">
                          <h4 className="text-sm font-semibold mb-2">What Changes</h4>
                          <p className="text-sm text-muted-foreground">{item.aiSummary.whatChanges}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                          <h4 className="text-sm font-semibold mb-2">Who Is Impacted</h4>
                          <p className="text-sm text-muted-foreground">{item.aiSummary.whoImpacted}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                          <h4 className="text-sm font-semibold mb-2">Key Deadline</h4>
                          <p className="text-sm text-muted-foreground">{item.aiSummary.keyDeadline}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Statistical Analysis */}
                  {item.aiSummary.statistics && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Statistical Impact Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {item.aiSummary.statistics.estimatedAffectedCompanies && (
                            <div className="text-center p-4 rounded-lg bg-muted/50">
                              <p className="text-2xl font-bold" style={{ color: theme.primaryColor }}>
                                {item.aiSummary.statistics.estimatedAffectedCompanies.toLocaleString()}+
                              </p>
                              <p className="text-xs text-muted-foreground">Companies Affected</p>
                            </div>
                          )}
                          {item.aiSummary.statistics.estimatedComplianceCost && (
                            <div className="text-center p-4 rounded-lg bg-muted/50">
                              <p className="text-2xl font-bold text-warning">
                                {item.aiSummary.statistics.estimatedComplianceCost.currency}{item.aiSummary.statistics.estimatedComplianceCost.min.toLocaleString()}-{item.aiSummary.statistics.estimatedComplianceCost.max.toLocaleString()}
                              </p>
                              <p className="text-xs text-muted-foreground">Compliance Cost Range</p>
                            </div>
                          )}
                          {item.aiSummary.statistics.implementationTimeMonths && (
                            <div className="text-center p-4 rounded-lg bg-muted/50">
                              <p className="text-2xl font-bold text-info">
                                {item.aiSummary.statistics.implementationTimeMonths} months
                              </p>
                              <p className="text-xs text-muted-foreground">Avg. Implementation Time</p>
                            </div>
                          )}
                          {item.aiSummary.statistics.complianceComplexityScore && (
                            <div className="text-center p-4 rounded-lg bg-muted/50">
                              <p className="text-2xl font-bold text-destructive">
                                {item.aiSummary.statistics.complianceComplexityScore}/10
                              </p>
                              <p className="text-xs text-muted-foreground">Complexity Score</p>
                            </div>
                          )}
                        </div>
                        {item.aiSummary.statistics.penaltyRange && (
                          <div className="mt-4 p-3 rounded-lg border border-destructive/30 bg-destructive/5">
                            <p className="text-sm font-medium text-destructive flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4" />
                              Penalty Range: {item.aiSummary.statistics.penaltyRange.currency}{item.aiSummary.statistics.penaltyRange.min.toLocaleString()} - {item.aiSummary.statistics.penaltyRange.currency}{item.aiSummary.statistics.penaltyRange.max.toLocaleString()}
                            </p>
                          </div>
                        )}
                        {item.aiSummary.statistics.marketSizeImpact && (
                          <p className="mt-3 text-sm text-muted-foreground">
                            <span className="font-medium">Market Impact:</span> {item.aiSummary.statistics.marketSizeImpact}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Detailed Risk Assessment */}
                  {(item.aiSummary.riskAnalysis || item.aiSummary.riskExplanation) && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2 text-warning">
                          <AlertTriangle className="h-4 w-4" />
                          Comprehensive Risk Assessment
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {item.aiSummary.riskAnalysis ? (
                          <>
                            <div className="flex items-center gap-4 mb-4">
                              <div className="text-center p-4 rounded-lg bg-warning/10 border border-warning/30">
                                <p className="text-3xl font-bold text-warning">{item.aiSummary.riskAnalysis.overallRiskScore}</p>
                                <p className="text-xs text-muted-foreground">Overall Risk Score</p>
                              </div>
                              {item.aiSummary.riskAnalysis.probabilityOfEnforcement && (
                                <div className="flex-1">
                                  <p className="text-sm text-muted-foreground">Enforcement Probability</p>
                                  <Badge className={cn(
                                    item.aiSummary.riskAnalysis.probabilityOfEnforcement === "high" ? "bg-destructive" :
                                    item.aiSummary.riskAnalysis.probabilityOfEnforcement === "medium" ? "bg-warning" : "bg-success"
                                  )}>
                                    {item.aiSummary.riskAnalysis.probabilityOfEnforcement.toUpperCase()}
                                  </Badge>
                                </div>
                              )}
                            </div>
                            
                            {item.aiSummary.riskAnalysis.riskBreakdown.length > 0 && (
                              <div className="space-y-3">
                                <h5 className="text-sm font-semibold">Risk Breakdown by Category</h5>
                                {item.aiSummary.riskAnalysis.riskBreakdown.map((risk, idx) => (
                                  <div key={idx} className="p-3 rounded-lg bg-muted/50">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-medium text-sm">{risk.category}</span>
                                      <Badge variant="outline" className={cn(
                                        risk.score >= 70 ? "border-destructive text-destructive" :
                                        risk.score >= 40 ? "border-warning text-warning" : "border-success text-success"
                                      )}>
                                        {risk.score}/100
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-2">{risk.description}</p>
                                    {risk.mitigationStrategy && (
                                      <p className="text-xs text-info">
                                        <span className="font-medium">Mitigation:</span> {risk.mitigationStrategy}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {item.aiSummary.riskAnalysis.potentialLiabilities && item.aiSummary.riskAnalysis.potentialLiabilities.length > 0 && (
                              <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/5">
                                <h5 className="text-sm font-semibold text-destructive mb-2">Potential Liabilities</h5>
                                <ul className="list-disc list-inside space-y-1">
                                  {item.aiSummary.riskAnalysis.potentialLiabilities.map((liability, idx) => (
                                    <li key={idx} className="text-sm text-muted-foreground">{liability}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {item.aiSummary.riskAnalysis.competitiveRiskAssessment && (
                              <div className="p-3 rounded-lg bg-muted/50">
                                <h5 className="text-sm font-semibold mb-1">Competitive Risk</h5>
                                <p className="text-sm text-muted-foreground">{item.aiSummary.riskAnalysis.competitiveRiskAssessment}</p>
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground">{item.aiSummary.riskExplanation}</p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Stakeholder Impact Analysis */}
                  {item.aiSummary.stakeholderAnalysis && item.aiSummary.stakeholderAnalysis.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Stakeholder Impact Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {item.aiSummary.stakeholderAnalysis.map((stakeholder, idx) => (
                            <div key={idx} className="p-4 rounded-lg bg-muted/50 border-l-4" style={{
                              borderLeftColor: stakeholder.impactLevel === "high" ? "hsl(var(--destructive))" :
                                              stakeholder.impactLevel === "medium" ? "hsl(var(--warning))" : "hsl(var(--success))"
                            }}>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">{stakeholder.stakeholder}</span>
                                  <Badge variant="outline" className="text-xs">{stakeholder.type}</Badge>
                                </div>
                                <Badge className={cn(
                                  stakeholder.impactLevel === "high" ? "bg-destructive" :
                                  stakeholder.impactLevel === "medium" ? "bg-warning" : "bg-success"
                                )}>
                                  {stakeholder.impactLevel.toUpperCase()} IMPACT
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{stakeholder.impactDescription}</p>
                              {stakeholder.requiredActions && stakeholder.requiredActions.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs font-medium mb-1">Required Actions:</p>
                                  <ul className="list-disc list-inside text-xs text-muted-foreground">
                                    {stakeholder.requiredActions.map((action, aidx) => (
                                      <li key={aidx}>{action}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {stakeholder.timeline && (
                                <p className="text-xs text-info mt-2">Timeline: {stakeholder.timeline}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Compliance Requirements */}
                  {item.aiSummary.complianceRequirements && item.aiSummary.complianceRequirements.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Check className="h-4 w-4" />
                          Compliance Requirements Checklist
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {item.aiSummary.complianceRequirements.map((req, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                              <Badge className={cn(
                                "mt-0.5 flex-shrink-0",
                                req.priority === "critical" ? "bg-destructive" :
                                req.priority === "high" ? "bg-warning" :
                                req.priority === "medium" ? "bg-info" : "bg-muted"
                              )}>
                                {req.priority.toUpperCase()}
                              </Badge>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{req.requirement}</p>
                                <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                                  {req.deadline && <span>⏰ {req.deadline}</span>}
                                  {req.estimatedEffort && <span>⚡ {req.estimatedEffort}</span>}
                                  {req.responsibleDepartment && <span>👥 {req.responsibleDepartment}</span>}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Strategic Recommendations */}
                  {item.aiSummary.strategicRecommendations && item.aiSummary.strategicRecommendations.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Sparkles className="h-4 w-4" style={{ color: theme.primaryColor }} />
                          Strategic Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {item.aiSummary.strategicRecommendations.map((rec, idx) => (
                            <div key={idx} className="p-4 rounded-lg border" style={{ borderColor: `${theme.primaryColor}30` }}>
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-semibold text-sm">{rec.title}</h5>
                                <Badge variant="outline" className={cn(
                                  rec.priority === "immediate" ? "border-destructive text-destructive" :
                                  rec.priority === "short-term" ? "border-warning text-warning" :
                                  rec.priority === "medium-term" ? "border-info text-info" : "border-muted text-muted-foreground"
                                )}>
                                  {rec.priority.replace("-", " ").toUpperCase()}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{rec.description}</p>
                              {rec.resourcesRequired && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  <span className="font-medium">Resources:</span> {rec.resourcesRequired}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Related Legislation */}
                  {item.aiSummary.relatedLegislation && item.aiSummary.relatedLegislation.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Scale className="h-4 w-4" />
                          Related Legislation & Precedents
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {item.aiSummary.relatedLegislation.map((rel, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                              <Badge variant="outline" className="flex-shrink-0">
                                {rel.relationship}
                              </Badge>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{rel.identifier}</p>
                                <p className="text-xs text-muted-foreground">{rel.title}</p>
                                <p className="text-xs text-info mt-1">{rel.relevance}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Industry Benchmarks */}
                  {item.aiSummary.industryBenchmarks && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Industry Benchmarks
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {item.aiSummary.industryBenchmarks.averageComplianceTime && (
                            <div className="p-3 rounded-lg bg-muted/50 text-center">
                              <p className="text-lg font-bold">{item.aiSummary.industryBenchmarks.averageComplianceTime}</p>
                              <p className="text-xs text-muted-foreground">Avg. Compliance Time</p>
                            </div>
                          )}
                          {item.aiSummary.industryBenchmarks.industryReadinessLevel && (
                            <div className="p-3 rounded-lg bg-muted/50 text-center">
                              <p className="text-lg font-bold">{item.aiSummary.industryBenchmarks.industryReadinessLevel}</p>
                              <p className="text-xs text-muted-foreground">Industry Readiness</p>
                            </div>
                          )}
                          {item.aiSummary.industryBenchmarks.competitorAdoptionRate && (
                            <div className="p-3 rounded-lg bg-muted/50 text-center">
                              <p className="text-lg font-bold">{item.aiSummary.industryBenchmarks.competitorAdoptionRate}</p>
                              <p className="text-xs text-muted-foreground">Competitor Adoption</p>
                            </div>
                          )}
                        </div>
                        {item.aiSummary.industryBenchmarks.bestPractices && item.aiSummary.industryBenchmarks.bestPractices.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-2">Industry Best Practices:</p>
                            <ul className="list-disc list-inside space-y-1">
                              {item.aiSummary.industryBenchmarks.bestPractices.map((practice, idx) => (
                                <li key={idx} className="text-sm text-muted-foreground">{practice}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Key Stakeholders Badges */}
                  {item.aiSummary.stakeholders && item.aiSummary.stakeholders.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Key Stakeholders</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {item.aiSummary.stakeholders.map((stakeholder, idx) => (
                            <Badge key={idx} variant="outline">{stakeholder}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                    <p className="text-muted-foreground">AI analysis not yet generated for this item.</p>
                  </CardContent>
                </Card>
              )}
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
