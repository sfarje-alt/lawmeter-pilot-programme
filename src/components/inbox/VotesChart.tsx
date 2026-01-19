import { Badge } from "@/components/ui/badge";
import { Vote, ThumbsUp, ThumbsDown, MinusCircle } from "lucide-react";

export interface VoteRecord {
  favor: number;
  against: number;
  abstention: number;
  date?: string;
}

interface VotesChartProps {
  votes: VoteRecord;
}

export function VotesChart({ votes }: VotesChartProps) {
  const total = votes.favor + votes.against + votes.abstention;
  if (total === 0) return null;

  const favorPercent = (votes.favor / total) * 100;
  const againstPercent = (votes.against / total) * 100;
  const abstentionPercent = (votes.abstention / total) * 100;

  const passed = votes.favor > votes.against;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Vote className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Votación
        </h3>
        <Badge variant={passed ? "default" : "destructive"} className="ml-auto text-xs">
          {passed ? "Aprobado" : "Rechazado"}
        </Badge>
      </div>
      
      {/* Stacked bar chart */}
      <div className="h-6 rounded-full overflow-hidden flex bg-muted/30">
        <div 
          className="bg-green-500 transition-all flex items-center justify-center"
          style={{ width: `${favorPercent}%` }}
        >
          {favorPercent > 10 && (
            <span className="text-xs font-medium text-white">{votes.favor}</span>
          )}
        </div>
        <div 
          className="bg-red-500 transition-all flex items-center justify-center"
          style={{ width: `${againstPercent}%` }}
        >
          {againstPercent > 10 && (
            <span className="text-xs font-medium text-white">{votes.against}</span>
          )}
        </div>
        <div 
          className="bg-gray-400 transition-all flex items-center justify-center"
          style={{ width: `${abstentionPercent}%` }}
        >
          {abstentionPercent > 10 && (
            <span className="text-xs font-medium text-white">{votes.abstention}</span>
          )}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <ThumbsUp className="h-3 w-3 text-green-500" />
          <span className="text-muted-foreground">A favor: {votes.favor}</span>
        </div>
        <div className="flex items-center gap-1">
          <ThumbsDown className="h-3 w-3 text-red-500" />
          <span className="text-muted-foreground">En contra: {votes.against}</span>
        </div>
        <div className="flex items-center gap-1">
          <MinusCircle className="h-3 w-3 text-gray-400" />
          <span className="text-muted-foreground">Abstención: {votes.abstention}</span>
        </div>
      </div>
    </div>
  );
}
