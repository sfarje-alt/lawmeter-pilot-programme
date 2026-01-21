// Peru Session Card Component - Updated for pinning workflow

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { 
  Video, 
  ExternalLink, 
  Star, 
  Pin, 
  Clock, 
  RefreshCw,
  ChevronDown,
  Calendar,
  Building,
  Brain,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Minus,
  MessageSquare
} from 'lucide-react';
import { PeruSession, SessionAnalysis } from '@/types/peruSessions';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useSessionAnalysis } from '@/hooks/useSessionAnalysis';
import { cn } from '@/lib/utils';

interface PeruSessionCardProps {
  session: PeruSession;
  onTogglePin: (sessionId: string) => void;
  onResolveVideo: (sessionId: string) => void;
  onSetManualUrl: (sessionId: string, url: string) => void;
  onUpdateRecording?: (sessionId: string, recordingUpdate: Partial<PeruSession['recording']>) => void;
  onOpenDetail?: (session: PeruSession) => void;
  showPinButton?: boolean;
}

export function PeruSessionCard({
  session,
  onTogglePin,
  onResolveVideo,
  onSetManualUrl,
  onUpdateRecording,
  onOpenDetail,
  showPinButton = true,
}: PeruSessionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const { isAnalyzing, analyzeSession } = useSessionAnalysis();

  // Get analysis from recording if available
  const analysis = session.recording?.analysis_result as SessionAnalysis | undefined;
  const analysisStatus = session.recording?.analysis_status;

  const getVideoStatusBadge = () => {
    switch (session.video_status) {
      case 'FOUND_HIGH':
      case 'FOUND_MEDIUM':
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
            <Video className="h-3 w-3 mr-1" />
            Video
          </Badge>
        );
      case 'FOUND_LOW':
      case 'MANUAL':
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
            <Video className="h-3 w-3 mr-1" />
            Manual
          </Badge>
        );
      case 'RESOLVING':
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            Buscando...
          </Badge>
        );
      case 'NOT_FOUND':
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
            <Video className="h-3 w-3 mr-1" />
            No encontrado
          </Badge>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = () => {
    switch (session.status) {
      case 'completed':
        return (
          <Badge className="bg-slate-500/10 text-slate-600 border-slate-500/20">
            Completada
          </Badge>
        );
      case 'scheduled':
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            Programada
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
            Cancelada
          </Badge>
        );
      default:
        return null;
    }
  };

  const getRelevanceBadge = (score: number, category: string) => {
    const config = {
      High: { bg: 'bg-green-500/10', text: 'text-green-600', border: 'border-green-500/20', icon: CheckCircle },
      Medium: { bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-500/20', icon: AlertTriangle },
      Low: { bg: 'bg-slate-500/10', text: 'text-slate-600', border: 'border-slate-500/20', icon: Minus },
      None: { bg: 'bg-red-500/10', text: 'text-red-600', border: 'border-red-500/20', icon: XCircle },
    }[category] || { bg: 'bg-slate-500/10', text: 'text-slate-600', border: 'border-slate-500/20', icon: Minus };
    
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.bg} ${config.text} ${config.border}`}>
        <Icon className="h-3 w-3 mr-1" />
        {category} ({score}/100)
      </Badge>
    );
  };

  const getFormattedDate = () => {
    if (session.scheduled_at) {
      const date = new Date(session.scheduled_at);
      if (!isNaN(date.getTime())) {
        return format(date, "EEEE, d 'de' MMMM yyyy, HH:mm", { locale: es });
      }
    }
    return session.scheduled_date_text || 'Fecha no disponible';
  };

  const handleAnalyze = async () => {
    if (!session.recording?.video_url) return;
    
    const result = await analyzeSession(
      session.id,
      session.recording.video_url,
      session.commission_name,
      session.session_title,
      session.scheduled_at
    );
    
    if (result && onUpdateRecording) {
      onUpdateRecording(session.id, {
        analysis_result: result,
        analysis_status: 'COMPLETED',
        analyzed_at: new Date().toISOString(),
        transcription_status: 'COMPLETED',
      });
    }
  };

  const handleSetManualUrl = () => {
    if (manualUrl.trim()) {
      onSetManualUrl(session.id, manualUrl.trim());
      setManualUrl('');
    }
  };

  const handleCardClick = () => {
    if (onOpenDetail) {
      onOpenDetail(session);
    }
  };
  
  const formattedDate = getFormattedDate();
  const hasCommentary = !!session.expert_commentary;

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <Card className={cn(
        "transition-all cursor-pointer hover:border-border",
        session.is_pinned_for_publication 
          ? 'border-primary bg-primary/5' 
          : session.is_recommended 
            ? 'border-amber-500/30 bg-amber-500/5'
            : 'border-border/50'
      )}>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-3">
            {/* Header Row */}
            <div className="flex items-start justify-between gap-4" onClick={handleCardClick}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  {session.is_pinned_for_publication && (
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      <Pin className="h-3 w-3 mr-1" />
                      Pineada
                    </Badge>
                  )}
                  {session.is_recommended && !session.is_pinned_for_publication && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Recomendada - Comisión en tu lista de monitoreo</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {getStatusBadge()}
                  {getVideoStatusBadge()}
                  {analysis && getRelevanceBadge(analysis.relevanceScore, analysis.relevanceCategory)}
                  {hasCommentary && (
                    <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Comentado
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <h3 className="font-semibold text-foreground line-clamp-1">
                    Comisión de {session.commission_name}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span className="capitalize">{formattedDate}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                {showPinButton && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={session.is_pinned_for_publication ? "default" : "outline"}
                          size="sm"
                          onClick={() => onTogglePin(session.id)}
                        >
                          <Pin className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{session.is_pinned_for_publication ? 'Quitar pin' : 'Pinear para publicación'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {session.recording?.video_url ? (
                  <>
                    <Button
                      variant="default"
                      size="sm"
                      className="gap-2 bg-green-600 hover:bg-green-700"
                      onClick={() => window.open(session.recording!.video_url, '_blank')}
                    >
                      <Video className="h-4 w-4" />
                      Video
                    </Button>
                    
                    {/* AI Analysis Button */}
                    {analysisStatus === 'COMPLETED' ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2 border-purple-500/50 text-purple-600"
                              onClick={() => setIsExpanded(true)}
                            >
                              <Sparkles className="h-4 w-4" />
                              Ver Análisis
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ver resultados del análisis AI</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || analysisStatus === 'PROCESSING'}
                      >
                        {isAnalyzing || analysisStatus === 'PROCESSING' ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Analizando...
                          </>
                        ) : (
                          <>
                            <Brain className="h-4 w-4" />
                            AI Analysis
                          </>
                        )}
                      </Button>
                    )}
                  </>
                ) : session.video_status === 'RESOLVING' ? (
                  <Button variant="outline" size="sm" disabled>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    Buscando...
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => onResolveVideo(session.id)}
                  >
                    <Video className="h-4 w-4" />
                    Buscar Video
                  </Button>
                )}

                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>

            {/* Expanded Content */}
            <CollapsibleContent>
              <div className="pt-4 border-t border-border/50 space-y-4">
                {/* AI Analysis Summary */}
                {analysis && (
                  <div className="bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-lg p-4 border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                      <h4 className="font-semibold text-foreground">Resumen Ejecutivo</h4>
                    </div>
                    <p className="text-sm text-foreground">{analysis.executiveSummary}</p>
                  </div>
                )}

                {/* Manual URL input */}
                {!session.recording?.video_url && session.video_status !== 'RESOLVING' && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Agregar enlace de video manualmente:</p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://youtube.com/watch?v=..."
                        value={manualUrl}
                        onChange={(e) => setManualUrl(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={handleSetManualUrl}
                        disabled={!manualUrl.trim()}
                      >
                        Guardar
                      </Button>
                    </div>
                  </div>
                )}

                {/* Session Info */}
                <div className="flex flex-wrap gap-2">
                  {session.agenda_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-primary"
                      asChild
                    >
                      <a href={session.agenda_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ver Agenda
                      </a>
                    </Button>
                  )}
                  {session.documents_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-primary"
                      asChild
                    >
                      <a href={session.documents_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ver Documentos
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </CardContent>
      </Card>
    </Collapsible>
  );
}