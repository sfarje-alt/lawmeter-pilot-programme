import { useMemo, memo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar,
  AlertTriangle,
  Sparkles,
  Building2,
  MapPin,
  Loader2,
  ChevronRight,
  Star,
  FileText
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Spanish translations for LATAM regions
const LATAM_LABELS = {
  inForce: "Vigente",
  pipeline: "En Trámite",
  details: "Detalles",
  aiSummary: "Resumen IA",
  generate: "Generar",
  whatChanges: "Qué Cambia",
  whoImpacted: "Afectados",
  keyDeadline: "Fecha Clave",
  analyzing: "Analizando contenido...",
  clickToGenerate: "Haga clic para generar análisis IA",
  legislativeProgress: "Progreso Legislativo",
  due: "Vence",
  effective: "Vigente desde",
  published: "Publicado",
  riskHigh: "Alto",
  riskMedium: "Medio",
  riskLow: "Bajo",
  starred: "Quitar de favoritos",
  notStarred: "Agregar a favoritos",
  // Peru-specific
  fiscalizacion: "Fiscalización",
  voluntario: "Voluntario",
  obligatorio: "Obligatorio",
  nacional: "Nacional",
  regional: "Regional",
  municipal: "Municipal/Local",
  // Costa Rica-specific
  institucional: "Institucional/Regulatorio",
  organoCompetente: "Órgano Competente",
  comision: "Comisión",
  vetado: "Vetado",
  proyectoLey: "Proyecto de Ley",
  ley: "Ley",
  decretoEjecutivo: "Decreto Ejecutivo",
  reglamento: "Reglamento",
  resolucion: "Resolución",
  ordenanzaMunicipal: "Ordenanza Municipal",
  reglamentoMunicipal: "Reglamento Municipal",
  normativaRegulatoria: "Normativa Regulatoria",
  circular: "Circular",
  gaceta: "La Gaceta"
};

interface UnifiedLegislationCardProps {
  item: UnifiedLegislationItem;
  config: JurisdictionConfig;
  isRead: boolean;
  isStarred: boolean;
  onMarkRead: () => void;
  onToggleStar: () => void;
  onDelete: () => void;
  onViewDetails: () => void;
  viewMode?: "list" | "grid";
  isGeneratingAI?: boolean;
}

export const UnifiedLegislationCard = memo(function UnifiedLegislationCard({
  item,
  config,
  isRead,
  isStarred,
  onMarkRead,
  onToggleStar,
  onDelete,
  onViewDetails,
  viewMode = "list",
  isGeneratingAI = false
}: UnifiedLegislationCardProps) {
  const theme = regionThemes[item.region];
  const instrumentType = getInstrumentType(config, item.instrumentType);
  const pipelineStages = getPipelineStages(config, item.instrumentType);
  
  // Determine if this is a LATAM jurisdiction (use Spanish)
  const isLatam = item.region === "LATAM";
  const labels = isLatam ? LATAM_LABELS : null;
  
  // Check if this is Peru data with specific legal structure
  const isPeru = item.jurisdictionCode === "PE" && item.peruData;
  const peruData = item.peruData;
  
  // Check if this is Costa Rica data with specific legal structure
  const isCostaRica = item.jurisdictionCode === "CR" && item.costaRicaData;
  const crData = item.costaRicaData;

  // Build jurisdiction line - special handling for Peru and Costa Rica
  const jurisdictionLine = useMemo(() => {
    // Costa Rica handling - NO "Federal" label
    if (isCostaRica && crData) {
      const parts = [];
      // Use CR levels: Nacional, Municipal (Cantonal), Institucional (NEVER "Federal")
      const nivelLabel = crData.nivel === "nacional" ? LATAM_LABELS.nacional :
                        crData.nivel === "municipal" ? LATAM_LABELS.municipal :
                        LATAM_LABELS.institucional;
      parts.push(nivelLabel);
      
      // Add canton/province only if municipal
      if (crData.nivel === "municipal") {
        if (crData.canton) {
          parts.push(crData.canton);
        } else if (crData.provincia) {
          parts.push(crData.provincia);
        }
      }
      
      // Add issuing authority (órgano emisor)
      parts.push(crData.organoEmisor);
      
      return parts.filter(Boolean).join(" · ");
    }
    
    // Peru handling
    if (isPeru && peruData) {
      const parts = [];
      const nivelLabel = peruData.nivel === "nacional" ? LATAM_LABELS.nacional :
                        peruData.nivel === "regional" ? LATAM_LABELS.regional :
                        LATAM_LABELS.municipal;
      parts.push(nivelLabel);
      
      if (peruData.departamento) {
        parts.push(peruData.departamento);
      }
      if (peruData.municipio) {
        parts.push(peruData.municipio);
      }
      
      parts.push(item.authorityLabel || item.authority);
      
      return parts.filter(Boolean).join(" · ");
    }
    
    // Default for non-LATAM (translate "Federal" for CR would be wrong, but this is fallback)
    const parts = [
      item.jurisdictionLevel.charAt(0).toUpperCase() + item.jurisdictionLevel.slice(1),
      item.subnationalUnit || config.code,
      item.authorityLabel || item.authority
    ].filter(Boolean);
    return parts.join(" · ");
  }, [item, config, isPeru, peruData, isCostaRica, crData]);

  // Calculate current stage index for pipeline items
  const currentStageIndex = useMemo(() => {
    if (item.isInForce) return pipelineStages.length - 1;
    if (item.currentStageIndex !== undefined) return item.currentStageIndex;
    
    // Try to match status to stage
    const statusLower = item.status.toLowerCase();
    const idx = pipelineStages.findIndex(stage => 
      statusLower.includes(stage.toLowerCase())
    );
    return idx >= 0 ? idx : 0;
  }, [item, pipelineStages]);

  // Compute the most relevant date and label based on lifecycle status
  const relevantDate = useMemo(() => {
    if (item.isInForce) {
      // For enacted legislation, show effective date
      if (item.effectiveDate) {
        return { 
          label: isLatam ? labels!.effective : "Effective", 
          date: item.effectiveDate 
        };
      }
      // Fallback to published date if no effective date
      return { 
        label: isLatam ? labels!.published : "Published", 
        date: item.publishedDate 
      };
    }
    
    // For pipeline items, find the most recent action with a date
    if (item.actions && item.actions.length > 0) {
      const sortedActions = [...item.actions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const latestAction = sortedActions[0];
      // Create a concise label from the action description
      const actionLabel = latestAction.description
        .replace(/Legislative process advanced/i, item.status)
        .replace(/ - Legislative process advanced/i, "")
        .split(" - ")[0]
        .substring(0, 25);
      return { label: actionLabel, date: latestAction.date };
    }
    
    // Use status as label with published date
    const statusLabel = item.status || (isLatam ? "Alerta" : "Alert");
    return { label: statusLabel, date: item.publishedDate };
  }, [item, isLatam, labels]);
  
  // Get risk level label (Spanish for LATAM)
  const getRiskLabel = (level: string) => {
    if (!isLatam) return level.charAt(0).toUpperCase() + level.slice(1);
    switch (level) {
      case "high": return labels!.riskHigh;
      case "medium": return labels!.riskMedium;
      case "low": return labels!.riskLow;
      default: return level;
    }
  };

  return (
    <Card 
      className={cn(
        "transition-all hover:shadow-lg cursor-pointer group",
        !isRead && "border-l-4"
      )}
      style={{
        borderLeftColor: !isRead ? theme.primaryColor : undefined,
        background: !isRead 
          ? `linear-gradient(135deg, ${theme.primaryColor}08 0%, transparent 100%)` 
          : undefined
      }}
      onClick={onViewDetails}
    >
      <CardHeader className="pb-2 pt-3">
        {/* Row 1: Region + Lifecycle + Identifier + Star */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Region badge */}
            <Badge 
              variant="outline" 
              className="text-[10px] font-bold tracking-wider px-1.5 py-0 gap-1"
              style={{ 
                borderColor: theme.primaryColor,
                color: theme.primaryColor
              }}
            >
              <RegionIcon region={item.region} size={10} showCode={false} />
              {item.region}
            </Badge>
            
            {/* Lifecycle badge */}
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs font-medium",
                item.isInForce 
                  ? "bg-success/10 text-success border-success/30" 
                  : "bg-warning/10 text-warning border-warning/30"
              )}
            >
              {item.isInForce 
                ? (isLatam ? labels!.inForce : "In Force") 
                : (isLatam ? labels!.pipeline : "Pipeline")}
            </Badge>
            
            {/* Identifier */}
            <Badge variant="outline" className="text-xs font-mono text-muted-foreground">
              {item.identifier}
            </Badge>
            
            {/* Document type badge - Costa Rica shows tipo de norma */}
            {isCostaRica && crData ? (
              <Badge variant="secondary" className="text-[10px]">
                {crData.tipoNorma === "proyecto_ley" ? "📝 " + LATAM_LABELS.proyectoLey :
                 crData.tipoNorma === "ley" ? "⚖️ " + LATAM_LABELS.ley :
                 crData.tipoNorma === "decreto_ejecutivo" ? "📜 " + LATAM_LABELS.decretoEjecutivo :
                 crData.tipoNorma === "reglamento" ? "📋 " + LATAM_LABELS.reglamento :
                 crData.tipoNorma === "resolucion" ? "📄 " + LATAM_LABELS.resolucion :
                 crData.tipoNorma === "ordenanza_municipal" ? "🏘️ " + LATAM_LABELS.ordenanzaMunicipal :
                 crData.tipoNorma === "reglamento_municipal" ? "🏘️ " + LATAM_LABELS.reglamentoMunicipal :
                 crData.tipoNorma === "normativa_regulatoria" ? "🏛️ " + LATAM_LABELS.normativaRegulatoria :
                 crData.tipoNorma === "circular" ? "📢 " + LATAM_LABELS.circular :
                 crData.tipoNorma}
              </Badge>
            ) : isPeru && peruData ? (
              <Badge variant="secondary" className="text-[10px]">
                {peruData.esVinculante ? "📋" : "📝"} {
                  peruData.tipoNorma === "ley" ? "Ley" :
                  peruData.tipoNorma === "decreto-legislativo" ? "Decreto Legislativo" :
                  peruData.tipoNorma === "decreto-supremo" ? "Decreto Supremo" :
                  peruData.tipoNorma === "resolucion-ministerial" ? "Resolución Ministerial" :
                  peruData.tipoNorma === "resolucion-directoral" ? "Resolución Directoral" :
                  peruData.tipoNorma === "ordenanza-regional" ? "Ordenanza Regional" :
                  peruData.tipoNorma === "ordenanza-municipal" ? "Ordenanza Municipal" :
                  peruData.tipoNorma === "ntp" ? "NTP" : peruData.tipoNorma
                }
              </Badge>
            ) : instrumentType && (
              <Badge variant="secondary" className="text-[10px]">
                {instrumentType.emoji} {instrumentType.label}
              </Badge>
            )}
            
            {/* Costa Rica: Vetado indicator */}
            {isCostaRica && crData && item.status === "vetado" && (
              <Badge variant="outline" className="text-[10px] bg-red-50 text-red-700 border-red-200">
                ⚠️ {LATAM_LABELS.vetado}
              </Badge>
            )}
            
            {/* Peru: Voluntary/Binding indicator for NTP */}
            {isPeru && peruData && !peruData.esVinculante && (
              <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
                {labels!.voluntario}
              </Badge>
            )}
          </div>

          {/* Star Button */}
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => { e.stopPropagation(); onToggleStar(); }}
                  >
                    <Star className={cn(
                      "h-4 w-4",
                      isStarred ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"
                    )} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  {isStarred 
                    ? (isLatam ? labels!.starred : "Remove from starred") 
                    : (isLatam ? labels!.notStarred : "Add to starred")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Row 2: Title with truncation and hover tooltip */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <h3 
                className="text-base font-semibold leading-tight hover:text-primary transition-colors line-clamp-2 cursor-pointer"
                style={{ color: !isRead ? theme.primaryColor : undefined }}
              >
                {item.title}
              </h3>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-md text-sm p-3">
              {item.title}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Row 3: Jurisdiction line */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5">
          {(isCostaRica && crData?.nivel === "municipal") || (isPeru && peruData?.nivel !== "nacional") || item.jurisdictionLevel !== "federal" ? (
            <MapPin className="h-3 w-3" />
          ) : (
            <Building2 className="h-3 w-3" />
          )}
          <span>{jurisdictionLine}</span>
        </div>
        
        {/* Row 4: Costa Rica competent authority / legislative committee (when applicable) */}
        {isCostaRica && crData?.organoCompetente && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <span className="font-medium">{LATAM_LABELS.organoCompetente}:</span>
            <span>{crData.organoCompetente}</span>
          </div>
        )}
        {isCostaRica && crData?.comisionLegislativa && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <span className="font-medium">{LATAM_LABELS.comision}:</span>
            <span>{crData.comisionLegislativa}</span>
          </div>
        )}
        
        {/* Row 4: Peru supervisory authority (when applicable) */}
        {isPeru && peruData?.autoridadFiscalizadora && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <span className="font-medium">{labels!.fiscalizacion}:</span>
            <span>{peruData.autoridadFiscalizadora}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        {/* AI Summary Block */}
        <div 
          className="rounded-md p-3 border"
          style={{ 
            backgroundColor: `${theme.primaryColor}08`,
            borderColor: `${theme.primaryColor}20`
          }}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="h-3.5 w-3.5" style={{ color: theme.primaryColor }} />
            <span className="text-xs font-medium" style={{ color: theme.primaryColor }}>
              {isLatam ? labels!.aiSummary : "AI Summary"}
            </span>
            {isGeneratingAI && (
              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground ml-1" />
            )}
          </div>
          
          {item.aiSummary ? (
            <div className="space-y-1.5 text-sm">
              <TooltipProvider delayDuration={300}>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground font-medium min-w-[60px] flex-shrink-0">
                    {isLatam ? "Cambios:" : "Changes:"}
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-foreground line-clamp-1 cursor-pointer">{item.aiSummary.whatChanges}</span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-md text-sm p-3">
                      {item.aiSummary.whatChanges}
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground font-medium min-w-[60px] flex-shrink-0">
                    {isLatam ? "Afecta:" : "Impacts:"}
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-foreground line-clamp-1 cursor-pointer">{item.aiSummary.whoImpacted}</span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-md text-sm p-3">
                      {item.aiSummary.whoImpacted}
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground font-medium min-w-[60px] flex-shrink-0">
                    {isLatam ? "Fecha:" : "Timeline:"}
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-foreground line-clamp-1 cursor-pointer">{item.aiSummary.keyDeadline}</span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-md text-sm p-3">
                      {item.aiSummary.keyDeadline}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              {isGeneratingAI 
                ? (isLatam ? labels!.analyzing : "Analyzing content...") 
                : (isLatam ? labels!.clickToGenerate : "Click to generate AI analysis")}
            </div>
          )}
        </div>

        {/* Legislative Status Tracker - Only for Pipeline items in list mode */}
        {!item.isInForce && pipelineStages.length > 0 && viewMode === "list" && (
          <div 
            className="p-3 rounded-md border"
            style={{ 
              backgroundColor: `${theme.primaryColor}05`,
              borderColor: `${theme.primaryColor}15`
            }}
          >
            <div className="text-xs font-medium text-muted-foreground mb-2">
              {isLatam ? labels!.legislativeProgress : "Legislative Progress"}
            </div>
            <div className="flex items-center gap-0.5">
              {pipelineStages.map((stage, index) => (
                <div key={`stage-${index}`} className="flex items-center gap-0.5 flex-1">
                  {index > 0 && (
                    <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  )}
                  <div className="flex flex-col items-center flex-1">
                    <div 
                      className={cn(
                        "w-full h-2 rounded-full transition-colors",
                        index < currentStageIndex 
                          ? "" 
                          : index === currentStageIndex 
                            ? "animate-pulse" 
                            : "bg-muted"
                      )}
                      style={{
                        backgroundColor: index <= currentStageIndex ? theme.primaryColor : undefined
                      }}
                    />
                    <span className={cn(
                      "text-[9px] mt-1 text-center leading-tight",
                      index === currentStageIndex 
                        ? "font-semibold" 
                        : index < currentStageIndex 
                          ? "text-foreground" 
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

        {/* Footer Row: Date + Deadline + Category + Risk + Details */}
        <div className="flex items-center justify-between gap-2 flex-wrap text-xs pt-1">
          <div className="flex items-center gap-3 text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                {relevantDate.label}: {formatLegislationDate(relevantDate.date)}
              </span>
            </div>
            
            {item.complianceDeadline && (
              <div className="flex items-center gap-1 text-warning">
                <AlertTriangle className="h-3 w-3" />
                <span>{isLatam ? labels!.due : "Due"}: {formatLegislationDate(item.complianceDeadline)}</span>
              </div>
            )}
            
            {item.policyArea && (
              <Badge variant="outline" className="text-[10px]">
                {item.policyArea}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Risk badge - larger and more visible */}
            <Badge className={cn("text-sm font-semibold px-3 py-1", getRiskBadgeClass(item.riskLevel))}>
              {getRiskLabel(item.riskLevel)}
              {item.riskScore && ` (${item.riskScore})`}
            </Badge>
            
            {/* Details button - larger and always visible */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-4 text-sm font-medium border-2"
              style={{ 
                color: theme.primaryColor,
                borderColor: theme.primaryColor
              }}
              onClick={(e) => { e.stopPropagation(); onViewDetails(); }}
            >
              <FileText className="h-4 w-4 mr-1.5" />
              {isLatam ? labels!.details : "Details"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export default UnifiedLegislationCard;
