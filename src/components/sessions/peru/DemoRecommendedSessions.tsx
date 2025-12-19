// Demo Recommended Sessions - Shows when Recommended filter is active

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
  Clock,
  FileText
} from 'lucide-react';

interface DemoRecommendedSession {
  id: string;
  commission: string;
  date: string;
  videoStatus: 'found' | 'pending';
  hasAgenda: boolean;
}

const demoRecommendedSessions: DemoRecommendedSession[] = [
  {
    id: 'rec-1',
    commission: 'CIENCIA, INNOVACIÓN Y TECNOLOGÍA',
    date: 'Viernes, 27 De Diciembre 2025, 10:00',
    videoStatus: 'pending',
    hasAgenda: true,
  },
  {
    id: 'rec-2',
    commission: 'SALUD Y POBLACIÓN',
    date: 'Jueves, 26 De Diciembre 2025, 15:00',
    videoStatus: 'pending',
    hasAgenda: true,
  },
  {
    id: 'rec-3',
    commission: 'CIENCIA, INNOVACIÓN Y TECNOLOGÍA',
    date: 'Miércoles, 25 De Diciembre 2025, 09:30',
    videoStatus: 'found',
    hasAgenda: false,
  },
  {
    id: 'rec-4',
    commission: 'SALUD Y POBLACIÓN',
    date: 'Martes, 24 De Diciembre 2025, 11:00',
    videoStatus: 'found',
    hasAgenda: true,
  },
  {
    id: 'rec-5',
    commission: 'CIENCIA, INNOVACIÓN Y TECNOLOGÍA',
    date: 'Lunes, 23 De Diciembre 2025, 14:30',
    videoStatus: 'found',
    hasAgenda: true,
  },
];

function DemoRecommendedCard({ session }: { session: DemoRecommendedSession }) {
  return (
    <Card className="border-amber-500/30 bg-amber-500/5">
      <CardContent className="pt-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
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
                <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                  <Calendar className="h-3 w-3 mr-1" />
                  Scheduled
                </Badge>
                {session.videoStatus === 'found' ? (
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                    <Video className="h-3 w-3 mr-1" />
                    Video Found
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                )}
                {session.hasAgenda && (
                  <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">
                    <FileText className="h-3 w-3 mr-1" />
                    Agenda Available
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
                    <Button variant="outline" size="sm">
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add to Monitoring</p>
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
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DemoRecommendedSessions() {
  return (
    <div className="space-y-3">
      {demoRecommendedSessions.map(session => (
        <DemoRecommendedCard key={session.id} session={session} />
      ))}
    </div>
  );
}
