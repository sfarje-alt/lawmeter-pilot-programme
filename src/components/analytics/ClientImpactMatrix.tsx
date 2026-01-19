import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface MatrixItem {
  id: string;
  title: string;
  impact: 'high' | 'medium' | 'low';
  urgency: 'high' | 'medium' | 'low';
}

interface ClientData {
  id: string;
  name: string;
  sector: string;
  matrix: MatrixItem[];
}

interface ClientImpactMatrixProps {
  client: ClientData;
  compact?: boolean;
}

export function ClientImpactMatrix({ client, compact = false }: ClientImpactMatrixProps) {
  const getItemsForCell = (impact: string, urgency: string) => {
    return client.matrix.filter(item => item.impact === impact && item.urgency === urgency);
  };

  const getCellColor = (impact: string, urgency: string) => {
    if (impact === 'high' && urgency === 'high') return 'bg-red-500/20 border-red-500/30';
    if (impact === 'high' && urgency === 'medium') return 'bg-orange-500/20 border-orange-500/30';
    if (impact === 'high' && urgency === 'low') return 'bg-amber-500/20 border-amber-500/30';
    if (impact === 'medium' && urgency === 'high') return 'bg-orange-500/20 border-orange-500/30';
    if (impact === 'medium' && urgency === 'medium') return 'bg-yellow-500/20 border-yellow-500/30';
    if (impact === 'medium' && urgency === 'low') return 'bg-emerald-500/20 border-emerald-500/30';
    if (impact === 'low' && urgency === 'high') return 'bg-amber-500/20 border-amber-500/30';
    if (impact === 'low' && urgency === 'medium') return 'bg-emerald-500/20 border-emerald-500/30';
    return 'bg-emerald-500/10 border-emerald-500/20';
  };

  const impacts = ['high', 'medium', 'low'];
  const urgencies = ['high', 'medium', 'low'];

  return (
    <Card className="glass-card border-border/30">
      <CardHeader className={compact ? 'pb-2' : ''}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={compact ? 'text-sm' : 'text-lg'}>
              {compact ? client.name.split(' ').slice(0, 2).join(' ') : `${client.name} - Impact vs Urgency Matrix`}
            </CardTitle>
            {!compact && <p className="text-sm text-muted-foreground">{client.sector}</p>}
          </div>
          <Badge variant="outline" className="text-xs">
            {client.matrix.length} items
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Y-axis label */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-muted-foreground font-medium">
            IMPACT
          </div>
          
          {/* X-axis label */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 text-xs text-muted-foreground font-medium">
            URGENCY →
          </div>

          <div className="ml-8">
            {/* Header row */}
            <div className="grid grid-cols-4 gap-1 mb-1">
              <div></div>
              <div className="text-center text-xs text-muted-foreground py-1">High</div>
              <div className="text-center text-xs text-muted-foreground py-1">Medium</div>
              <div className="text-center text-xs text-muted-foreground py-1">Low</div>
            </div>

            {/* Matrix rows */}
            {impacts.map((impact) => (
              <div key={impact} className="grid grid-cols-4 gap-1 mb-1">
                <div className="flex items-center justify-end pr-2 text-xs text-muted-foreground capitalize">
                  {impact}
                </div>
                {urgencies.map((urgency) => {
                  const items = getItemsForCell(impact, urgency);
                  return (
                    <div
                      key={`${impact}-${urgency}`}
                      className={`${getCellColor(impact, urgency)} border rounded-md ${
                        compact ? 'min-h-[50px] p-1' : 'min-h-[80px] p-2'
                      } transition-colors hover:opacity-80`}
                    >
                      {items.length > 0 ? (
                        <div className={`flex flex-wrap gap-1 ${compact ? 'text-[10px]' : 'text-xs'}`}>
                          {items.slice(0, compact ? 2 : 4).map((item) => (
                            <Tooltip key={item.id}>
                              <TooltipTrigger asChild>
                                <Badge 
                                  variant="secondary" 
                                  className={`cursor-default ${compact ? 'text-[9px] px-1 py-0' : 'text-[10px]'} line-clamp-1 max-w-full`}
                                >
                                  {compact ? item.title.substring(0, 10) + '...' : item.title.substring(0, 20) + (item.title.length > 20 ? '...' : '')}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-[200px]">{item.title}</p>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                          {items.length > (compact ? 2 : 4) && (
                            <Badge variant="outline" className={`${compact ? 'text-[9px] px-1 py-0' : 'text-[10px]'}`}>
                              +{items.length - (compact ? 2 : 4)}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground/50 text-xs">
                          -
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        {!compact && (
          <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-500/30" />
              <span className="text-muted-foreground">Critical</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-orange-500/30" />
              <span className="text-muted-foreground">High Priority</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-yellow-500/30" />
              <span className="text-muted-foreground">Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-emerald-500/30" />
              <span className="text-muted-foreground">Low</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
