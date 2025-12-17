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
  Building
} from 'lucide-react';
import { PeruSession } from '@/types/peruSessions';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PeruSessionCardProps {
  session: PeruSession;
  onToggleSelection: (sessionId: string) => void;
  onResolveVideo: (sessionId: string) => void;
  onSetManualUrl: (sessionId: string, url: string) => void;
}

export function PeruSessionCard({
  session,
  onToggleSelection,
  onResolveVideo,
  onSetManualUrl,
}: PeruSessionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [manualUrl, setManualUrl] = useState('');

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

  const getFormattedDate = () => {
    if (session.scheduled_at) {
      const date = new Date(session.scheduled_at);
      if (!isNaN(date.getTime())) {
        return format(date, "EEEE, d 'de' MMMM yyyy, HH:mm", { locale: es });
      }
    }
    return session.scheduled_date_text || 'Fecha no disponible';
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
                  <Button
                    variant="default"
                    size="sm"
                    className="gap-2 bg-green-600 hover:bg-green-700"
                    onClick={() => window.open(session.recording!.video_url, '_blank')}
                  >
                    <Video className="h-4 w-4" />
                    Open Video
                  </Button>
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

                {/* Video Resolution Info */}
                {session.recording && (
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Video Information</p>
                    <div className="space-y-1 text-sm">
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
