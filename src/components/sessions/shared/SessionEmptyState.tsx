// Session Empty State Component for non-implemented countries

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, Clock, Globe } from 'lucide-react';

interface SessionEmptyStateProps {
  countryName: string;
  countryFlag: string;
}

export function SessionEmptyState({ countryName, countryFlag }: SessionEmptyStateProps) {
  return (
    <Card className="border-dashed border-2 border-border/50">
      <CardContent className="py-16">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl">{countryFlag}</span>
            <Video className="h-12 w-12 text-muted-foreground/50" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              {countryName} Sessions
            </h3>
            <Badge variant="outline" className="mt-2">
              <Clock className="h-3 w-3 mr-1" />
              Coming Soon
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Legislative session monitoring for {countryName} is currently under development. 
            This feature will allow you to track committee hearings, access video recordings, 
            and receive alerts for sessions related to your starred legislation.
          </p>
          
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Globe className="h-4 w-4" />
            <span>Part of our global legislative intelligence expansion</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
