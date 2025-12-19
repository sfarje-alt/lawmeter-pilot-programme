// Demo Session Cards - Simple collapsed cards without expandable details

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Video, 
  Star, 
  CheckCircle2, 
  Calendar,
  Building,
  Sparkles,
  CheckCircle,
  Clock,
  RefreshCw,
  Brain
} from 'lucide-react';

interface DemoSession {
  id: string;
  commission: string;
  date: string;
  status: 'scheduled' | 'completed';
  videoStatus: 'found' | 'pending' | 'resolving';
  analysisStatus: 'completed' | 'pending' | 'processing';
  relevanceScore?: number;
  isRecommended: boolean;
}

const demoSessions: DemoSession[] = [
  {
    id: 'demo-2',
    commission: 'CIENCIA, INNOVACIÓN Y TECNOLOGÍA',
    date: 'Jueves, 19 De Diciembre 2025, 10:00',
    status: 'scheduled',
    videoStatus: 'found',
    analysisStatus: 'completed',
    relevanceScore: 92,
    isRecommended: true,
  },
  {
    id: 'demo-3',
    commission: 'SALUD Y POBLACIÓN',
    date: 'Viernes, 20 De Diciembre 2025, 15:30',
    status: 'scheduled',
    videoStatus: 'found',
    analysisStatus: 'processing',
    isRecommended: true,
  },
  {
    id: 'demo-4',
    commission: 'CIENCIA, INNOVACIÓN Y TECNOLOGÍA',
    date: 'Lunes, 23 De Diciembre 2025, 11:00',
    status: 'scheduled',
    videoStatus: 'pending',
    analysisStatus: 'pending',
    isRecommended: true,
  },
  {
    id: 'demo-5',
    commission: 'SALUD Y POBLACIÓN',
    date: 'Martes, 24 De Diciembre 2025, 09:00',
    status: 'scheduled',
    videoStatus: 'resolving',
    analysisStatus: 'pending',
    isRecommended: false,
  },
];

function DemoSessionCard({ session }: { session: DemoSession }) {
  const getVideoStatusBadge = () => {
    switch (session.videoStatus) {
      case 'found':
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
            <Video className="h-3 w-3 mr-1" />
            Video Found
          </Badge>
        );
      case 'resolving':
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            Resolving...
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

  const getAnalysisButton = () => {
    switch (session.analysisStatus) {
      case 'completed':
        return (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-purple-500/50 text-purple-600"
          >
            <Sparkles className="h-4 w-4" />
            AI Analysis
          </Button>
        );
      case 'processing':
        return (
          <Button variant="outline" size="sm" className="gap-2" disabled>
            <RefreshCw className="h-4 w-4 animate-spin" />
            Analyzing...
          </Button>
        );
      default:
        return (
          <Button variant="outline" size="sm" className="gap-2">
            <Brain className="h-4 w-4" />
            AI Analysis
          </Button>
        );
    }
  };

  return (
    <Card className="border-primary bg-primary/5">
      <CardContent className="pt-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                {session.isRecommended && (
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
                <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                  <Calendar className="h-3 w-3 mr-1" />
                  Scheduled
                </Badge>
                {getVideoStatusBadge()}
                {session.analysisStatus === 'completed' && (
                  <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Analyzed
                  </Badge>
                )}
                {session.relevanceScore && (
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    High Relevance ({session.relevanceScore}/100)
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 mb-1">
                <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <h3 className="font-semibold text-foreground line-clamp-1">
                  {session.commission}
                </h3>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="capitalize">{session.date}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="default" size="sm">
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Selected for Monitoring</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {session.videoStatus === 'found' && (
                <Button
                  variant="default"
                  size="sm"
                  className="gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Video className="h-4 w-4" />
                  Open Video
                </Button>
              )}
              
              {getAnalysisButton()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DemoSessionCards() {
  return (
    <div className="space-y-3">
      {demoSessions.map(session => (
        <DemoSessionCard key={session.id} session={session} />
      ))}
    </div>
  );
}
