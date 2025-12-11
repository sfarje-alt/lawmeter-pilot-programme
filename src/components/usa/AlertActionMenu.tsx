import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  MoreVertical,
  Mail, 
  MailOpen,
  RefreshCw, 
  Trash2, 
  Flag
} from "lucide-react";

interface AlertActionMenuProps {
  isRead: boolean;
  isStarred: boolean;
  onMarkRead: () => void;
  onToggleStar: () => void;
  onDelete: () => void;
  onRefresh: () => void;
  onReport: () => void;
}

export function AlertActionMenu({
  isRead,
  onMarkRead,
  onDelete,
  onRefresh,
  onReport
}: AlertActionMenuProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }
    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isExpanded]);

  return (
    <TooltipProvider delayDuration={200}>
      <div ref={menuRef} className="relative">
        {/* Collapsed state - clickable dots icon */}
        {!isExpanded && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        )}
        
        {/* Expanded state - show all actions (without star, which is now outside) */}
        {isExpanded && (
          <div className="flex items-center gap-0.5 bg-muted/80 backdrop-blur-sm rounded-md p-0.5 animate-in fade-in-0 zoom-in-95 duration-150">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => { e.stopPropagation(); onMarkRead(); }}
                >
                  {isRead ? (
                    <MailOpen className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : (
                    <Mail className="h-3.5 w-3.5 text-primary" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {isRead ? "Mark as unread" : "Mark as read"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => { e.stopPropagation(); onRefresh(); }}
                >
                  <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                Refresh data
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => { e.stopPropagation(); onDelete(); }}
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                Delete alert
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => { e.stopPropagation(); onReport(); }}
                >
                  <Flag className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                Report issue
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
