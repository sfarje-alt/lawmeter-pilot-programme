// Peru Session Card Component

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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Video, 
  ExternalLink, 
  Star, 
  CheckCircle2, 
  Clock, 
  RefreshCw,
  ChevronDown,
  FileText,
  Link2,
  Calendar,
  Building,
  Brain,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Minus,
  Target,
  Users,
  MessageSquare,
  Zap
} from 'lucide-react';
import { PeruSession, SessionAnalysis } from '@/types/peruSessions';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useSessionAnalysis } from '@/hooks/useSessionAnalysis';

interface PeruSessionCardProps {
  session: PeruSession;
  onToggleSelection: (sessionId: string) => void;
  onResolveVideo: (sessionId: string) => void;
  onSetManualUrl: (sessionId: string, url: string) => void;
  onUpdateRecording?: (sessionId: string, recordingUpdate: Partial<PeruSession['recording']>) => void;
}

export function PeruSessionCard({
  session,
  onToggleSelection,
  onResolveVideo,
  onSetManualUrl,
  onUpdateRecording,
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
            Video Found
          </Badge>
        );
      case 'FOUND_LOW':
      case 'MANUAL':
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
            <Link2 className="h-3 w-3 mr-1" />
            Manual Link
          </Badge>
        );
      case 'RESOLVING':
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            Resolving...
          </Badge>
        );
      case 'NOT_FOUND':
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
            <Video className="h-3 w-3 mr-1" />
            Not Found
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const getStatusBadge = () => {
    switch (session.status) {
      case 'completed':
        return (
          <Badge className="bg-slate-500/10 text-slate-600 border-slate-500/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'scheduled':
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            <Calendar className="h-3 w-3 mr-1" />
            Scheduled
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
            Cancelled
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
        {category} Relevance ({score}/100)
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

  // Helper to extract video ID from YouTube URL
  const extractVideoIdFromUrl = (url: string): string => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return url; // Return as-is if no match
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
    
    // Update local state immediately with the result
    if (result && onUpdateRecording) {
      onUpdateRecording(session.id, {
        analysis_result: result,
        analysis_status: 'COMPLETED',
        analyzed_at: new Date().toISOString(),
        transcription_status: 'COMPLETED',
      });
    }
  };
  
  const formattedDate = getFormattedDate();

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <Card className={`transition-all ${
        session.is_selected 
          ? 'border-primary bg-primary/5' 
          : session.is_recommended 
            ? 'border-amber-500/30 bg-amber-500/5'
            : 'border-border/50'
      }`}>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-3">
            {/* Header Row */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  {session.is_recommended && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Recommended - Commission in your watchlist</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {getStatusBadge()}
                  {getVideoStatusBadge()}
                  {analysis && getRelevanceBadge(analysis.relevanceScore, analysis.relevanceCategory)}
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <h3 className="font-semibold text-foreground line-clamp-1">
                    {session.commission_name}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span className="capitalize">{formattedDate}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={session.is_selected ? "default" : "outline"}
                        size="sm"
                        onClick={() => onToggleSelection(session.id)}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{session.is_selected ? 'Deselect' : 'Select for Monitoring'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {session.recording?.video_url ? (
                  <>
                    <Button
                      variant="default"
                      size="sm"
                      className="gap-2 bg-green-600 hover:bg-green-700"
                      onClick={() => window.open(session.recording!.video_url, '_blank')}
                    >
                      <Video className="h-4 w-4" />
                      Open Video
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
                              View Analysis
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View AI analysis results</p>
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
                            Analyzing...
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
                    Resolving...
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => onResolveVideo(session.id)}
                  >
                    <Video className="h-4 w-4" />
                    Resolve Video
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
                {/* AI Analysis Results */}
                {analysis && (
                  <div className="bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-lg p-4 border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                      <h4 className="font-semibold text-foreground">AI Analysis</h4>
                      {session.recording?.analyzed_at && (
                        <span className="text-xs text-muted-foreground ml-auto">
                          Analyzed: {format(new Date(session.recording.analyzed_at), 'MMM d, yyyy HH:mm')}
                        </span>
                      )}
                    </div>
                    
                    {/* Executive Summary */}
                    <div className="bg-background/50 rounded-md p-3 mb-4">
                      <p className="text-sm text-foreground">{analysis.executiveSummary}</p>
                    </div>

                    <Accordion type="single" collapsible className="space-y-2">
                      {/* Key Topics */}
                      {analysis.keyTopics.length > 0 && (
                        <AccordionItem value="topics" className="border border-border/50 rounded-lg px-3">
                          <AccordionTrigger className="py-2 text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <Target className="h-4 w-4 text-blue-500" />
                              Key Topics ({analysis.keyTopics.length})
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-3">
                            <div className="space-y-2">
                              {analysis.keyTopics.map((topic, idx) => (
                                <div key={idx} className="bg-background/50 rounded-md p-2">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline" className={
                                      topic.relevance === 'Direct' ? 'border-green-500/50 text-green-600' :
                                      topic.relevance === 'Indirect' ? 'border-amber-500/50 text-amber-600' :
                                      'border-slate-500/50 text-slate-600'
                                    }>
                                      {topic.relevance}
                                    </Badge>
                                    <span className="font-medium text-sm">{topic.topic}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{topic.details}</p>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )}

                      {/* Regulatory Mentions */}
                      {analysis.regulatoryMentions.length > 0 && (
                        <AccordionItem value="regulatory" className="border border-border/50 rounded-lg px-3">
                          <AccordionTrigger className="py-2 text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                              Regulatory Mentions ({analysis.regulatoryMentions.length})
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-3">
                            <div className="space-y-2">
                              {analysis.regulatoryMentions.map((mention, idx) => (
                                <div key={idx} className="bg-background/50 rounded-md p-2">
                                  <Badge variant="outline" className="mb-1">{mention.type}</Badge>
                                  <p className="text-xs text-muted-foreground italic mb-1">"{mention.quote}"</p>
                                  <p className="text-xs font-medium text-foreground">{mention.implication}</p>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )}

                      {/* Client Impact */}
                      {analysis.clientImpact && (
                        <AccordionItem value="impact" className="border border-border/50 rounded-lg px-3">
                          <AccordionTrigger className="py-2 text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <Zap className="h-4 w-4 text-orange-500" />
                              Client Impact Assessment
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-3">
                            <div className="grid gap-2">
                              {Object.entries(analysis.clientImpact).map(([key, value]) => (
                                <div key={key} className="bg-background/50 rounded-md p-2">
                                  <span className="text-xs font-medium text-muted-foreground capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                                  </span>
                                  <p className="text-sm text-foreground">{value}</p>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )}

                      {/* Speaker Sentiments */}
                      {analysis.speakerSentiments.length > 0 && (
                        <AccordionItem value="speakers" className="border border-border/50 rounded-lg px-3">
                          <AccordionTrigger className="py-2 text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-indigo-500" />
                              Speaker Sentiments ({analysis.speakerSentiments.length})
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-3">
                            <div className="space-y-2">
                              {analysis.speakerSentiments.map((speaker, idx) => (
                                <div key={idx} className="bg-background/50 rounded-md p-2">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm">{speaker.speaker}</span>
                                    <Badge variant="outline" className={
                                      speaker.position === 'Supportive' ? 'border-green-500/50 text-green-600' :
                                      speaker.position === 'Opposed' ? 'border-red-500/50 text-red-600' :
                                      'border-slate-500/50 text-slate-600'
                                    }>
                                      {speaker.position}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground italic">"{speaker.keyStatement}"</p>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )}

                      {/* Action Items */}
                      {analysis.actionItems.length > 0 && (
                        <AccordionItem value="actions" className="border border-border/50 rounded-lg px-3">
                          <AccordionTrigger className="py-2 text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              Recommended Actions ({analysis.actionItems.length})
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-3">
                            <ul className="space-y-1">
                              {analysis.actionItems.map((item, idx) => (
                                <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                                  <span className="text-green-500 mt-0.5">•</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      )}
                    </Accordion>
                  </div>
                )}

                {/* Session Title */}
                {session.session_title && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Session Title</p>
                    <p className="text-sm text-foreground">{session.session_title}</p>
                  </div>
                )}

                {/* Links */}
                <div className="flex flex-wrap gap-2">
                  {session.agenda_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => window.open(session.agenda_url, '_blank')}
                    >
                      <FileText className="h-4 w-4" />
                      View Agenda
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                  {session.documents_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => window.open(session.documents_url, '_blank')}
                    >
                      <FileText className="h-4 w-4" />
                      View Documents
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                {/* Embedded Video Player */}
                {session.recording?.video_url && (
                  <div className="rounded-lg overflow-hidden border border-border/50">
                    <div className="aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${extractVideoIdFromUrl(session.recording.video_url)}`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={`Video: ${session.commission_name}`}
                      />
                    </div>
                  </div>
                )}

                {/* Video Resolution Info */}
                {session.recording && (
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Video Information</p>
                    <div className="space-y-1 text-sm">
                      {session.recording.expected_title && (
                        <p><span className="text-muted-foreground">Expected Title:</span> <span className="font-mono text-xs">{session.recording.expected_title}</span></p>
                      )}
                      <p><span className="text-muted-foreground">Channel:</span> {session.recording.channel_name}</p>
                      <p><span className="text-muted-foreground">Confidence:</span> {session.recording.resolution_confidence}</p>
                      <p><span className="text-muted-foreground">Method:</span> {session.recording.resolution_method}</p>
                    </div>
                  </div>
                )}

                {/* Manual URL Input */}
                {(session.video_status === 'NOT_FOUND' || !session.video_status) && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Add Manual Video Link</p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={manualUrl}
                        onChange={(e) => setManualUrl(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (manualUrl) {
                            onSetManualUrl(session.id, manualUrl);
                            setManualUrl('');
                          }
                        }}
                        disabled={!manualUrl}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  {session.external_session_id && (
                    <span>Session ID: {session.external_session_id}</span>
                  )}
                  <span>Source: {session.source}</span>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </CardContent>
      </Card>
    </Collapsible>
  );
}
