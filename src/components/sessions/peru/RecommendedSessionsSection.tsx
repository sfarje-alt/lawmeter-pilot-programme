// Recommended Sessions Section - Explains recommendation engine and shows featured sessions

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  Building2, 
  FileText, 
  Users, 
  CheckCircle2,
  Star,
  Sparkles,
  Info
} from 'lucide-react';
import { PeruSession } from '@/types/peruSessions';

interface RecommendedSessionsSectionProps {
  recommendedSessions: PeruSession[];
  selectedSessionIds: Set<string>;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onToggleSelection: (sessionId: string) => void;
}

export function RecommendedSessionsSection({
  recommendedSessions,
  selectedSessionIds,
  onSelectAll,
  onClearSelection,
  onToggleSelection,
}: RecommendedSessionsSectionProps) {
  const selectedCount = recommendedSessions.filter(s => selectedSessionIds.has(s.id)).length;

  return (
    <Card className="bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-yellow-500/5 border-amber-500/20">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Lightbulb className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                Recommended Sessions
                <Badge variant="secondary" className="ml-2">{recommendedSessions.length}</Badge>
              </CardTitle>
              <CardDescription>
                Sessions matching your monitoring preferences
              </CardDescription>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={onSelectAll}
              className="gap-2 bg-amber-600 hover:bg-amber-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              Select All ({recommendedSessions.length})
            </Button>
            {selectedCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearSelection}
                className="gap-2"
              >
                Clear Selection
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* How Recommendations Work */}
        <div className="bg-background/60 rounded-lg p-4 border border-amber-500/10">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-4 w-4 text-amber-600" />
            <span className="font-medium text-sm text-foreground">How the Recommendation Engine Works</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3 p-3 bg-amber-500/5 rounded-lg">
              <div className="p-1.5 bg-amber-500/10 rounded">
                <Building2 className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-foreground">Committees & Chambers</p>
                <p className="text-muted-foreground text-xs mt-1">
                  Sessions from your watched commissions in Congress, Senate, or Parliament bodies configured in Monitoring Settings.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-orange-500/5 rounded-lg">
              <div className="p-1.5 bg-orange-500/10 rounded">
                <FileText className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-foreground">Agenda Content</p>
                <p className="text-muted-foreground text-xs mt-1">
                  Sessions whose agenda mentions topics related to your starred bills, keywords, or regulatory areas of interest.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-yellow-500/5 rounded-lg">
              <div className="p-1.5 bg-yellow-500/10 rounded">
                <Users className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-foreground">AI Relevance Scoring</p>
                <p className="text-muted-foreground text-xs mt-1">
                  Our AI analyzes session content against your business profile to score relevance and prioritize high-impact sessions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Recommended Sessions */}
        {recommendedSessions.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium text-foreground">Featured Recommendations</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {recommendedSessions.slice(0, 6).map(session => (
                <div
                  key={session.id}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedSessionIds.has(session.id)
                      ? 'bg-primary/10 border-primary'
                      : 'bg-background/50 border-border/50 hover:border-amber-500/50'
                  }`}
                  onClick={() => onToggleSelection(session.id)}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="outline" className="text-xs truncate max-w-[180px]">
                      {session.commission_name}
                    </Badge>
                    <CheckCircle2 
                      className={`h-4 w-4 flex-shrink-0 ${
                        selectedSessionIds.has(session.id) 
                          ? 'text-primary fill-primary/20' 
                          : 'text-muted-foreground'
                      }`}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {session.session_title || session.scheduled_date_text || 'Session pending details'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
