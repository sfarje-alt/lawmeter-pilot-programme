import { Badge } from "@/components/ui/badge";
import { Users, ThumbsUp, ThumbsDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Stakeholder {
  name: string;
  role: string;
  position: "favor" | "against" | "neutral";
}

interface StakeholdersListProps {
  stakeholders: Stakeholder[];
}

const positionConfig = {
  favor: { icon: ThumbsUp, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30", label: "A favor" },
  against: { icon: ThumbsDown, color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30", label: "En contra" },
  neutral: { icon: Minus, color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-900/30", label: "Neutral" },
};

export function StakeholdersList({ stakeholders }: StakeholdersListProps) {
  if (!stakeholders || stakeholders.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Actores Clave
        </h3>
      </div>
      <div className="space-y-2">
        {stakeholders.map((stakeholder, index) => {
          const config = positionConfig[stakeholder.position];
          const Icon = config.icon;
          
          return (
            <div 
              key={index} 
              className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/30"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {stakeholder.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stakeholder.role}
                </p>
              </div>
              <Badge variant="outline" className={cn("gap-1", config.bg, config.color)}>
                <Icon className="h-3 w-3" />
                {config.label}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}
