// Session Pipeline View - Visual workflow showing session stages

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  CheckCircle2, 
  Video, 
  Brain,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

interface PipelineStats {
  recommended: number;
  selected: number;
  withVideo: number;
  analyzed: number;
}

interface SessionPipelineViewProps {
  stats: PipelineStats;
  activeStage: 'all' | 'recommended' | 'selected' | 'video' | 'analyzed';
  onStageClick: (stage: 'all' | 'recommended' | 'selected' | 'video' | 'analyzed') => void;
}

export function SessionPipelineView({
  stats,
  activeStage,
  onStageClick,
}: SessionPipelineViewProps) {
  const stages = [
    {
      id: 'recommended' as const,
      label: 'Recommended',
      icon: Star,
      count: stats.recommended,
      color: 'amber',
      bgClass: 'bg-amber-500/10',
      textClass: 'text-amber-600',
      borderClass: 'border-amber-500/30',
      activeClass: 'bg-amber-500 text-white',
    },
    {
      id: 'selected' as const,
      label: 'Selected',
      icon: CheckCircle2,
      count: stats.selected,
      color: 'blue',
      bgClass: 'bg-blue-500/10',
      textClass: 'text-blue-600',
      borderClass: 'border-blue-500/30',
      activeClass: 'bg-blue-500 text-white',
    },
    {
      id: 'video' as const,
      label: 'Video Found',
      icon: Video,
      count: stats.withVideo,
      color: 'green',
      bgClass: 'bg-green-500/10',
      textClass: 'text-green-600',
      borderClass: 'border-green-500/30',
      activeClass: 'bg-green-500 text-white',
    },
    {
      id: 'analyzed' as const,
      label: 'Analyzed',
      icon: Brain,
      count: stats.analyzed,
      color: 'purple',
      bgClass: 'bg-purple-500/10',
      textClass: 'text-purple-600',
      borderClass: 'border-purple-500/30',
      activeClass: 'bg-purple-500 text-white',
    },
  ];

  return (
    <Card className="bg-gradient-to-r from-slate-500/5 to-slate-600/5 border-border/50">
      <CardContent className="py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">📊 Monitoring Pipeline</span>
          </div>
          <Button
            variant={activeStage === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onStageClick('all')}
            className="text-xs"
          >
            View All
          </Button>
        </div>

        {/* Pipeline Visualization */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {stages.map((stage, index) => (
            <React.Fragment key={stage.id}>
              <Button
                variant="ghost"
                className={`flex-1 min-w-[120px] h-auto py-3 px-4 rounded-lg border transition-all ${
                  activeStage === stage.id
                    ? stage.activeClass + ' border-transparent shadow-lg'
                    : `${stage.bgClass} ${stage.borderClass} hover:${stage.bgClass}`
                }`}
                onClick={() => onStageClick(stage.id)}
              >
                <div className="flex flex-col items-center gap-1.5">
                  <stage.icon className={`h-5 w-5 ${activeStage === stage.id ? '' : stage.textClass}`} />
                  <span className={`text-xs font-medium ${activeStage === stage.id ? '' : stage.textClass}`}>
                    {stage.label}
                  </span>
                  <Badge 
                    variant={activeStage === stage.id ? 'secondary' : 'outline'}
                    className={`text-xs ${activeStage === stage.id ? 'bg-white/20 text-white border-white/30' : ''}`}
                  >
                    {stage.count}
                  </Badge>
                </div>
              </Button>
              
              {index < stages.length - 1 && (
                <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Stage Description */}
        <div className="mt-3 pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            {activeStage === 'all' && 'Showing all sessions in the pipeline'}
            {activeStage === 'recommended' && 'Sessions recommended based on your monitoring preferences'}
            {activeStage === 'selected' && 'Sessions you have selected for monitoring'}
            {activeStage === 'video' && 'Sessions with resolved video recordings'}
            {activeStage === 'analyzed' && 'Sessions that have been analyzed by AI'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
