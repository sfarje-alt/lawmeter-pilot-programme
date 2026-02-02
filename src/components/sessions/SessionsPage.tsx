// Sessions / Hearing Intelligence - Main Page Component (Peru Only)

import React from 'react';
import { Video } from 'lucide-react';
import { PeruSessionsSection } from './peru/PeruSessionsSection';
import { CountryFlag } from '@/components/shared/CountryFlag';

export interface SessionsPageProps {
  className?: string;
  initialSessionId?: string | null;
}

export function SessionsPage({ className, initialSessionId }: SessionsPageProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Video className="h-6 w-6 text-primary" />
          </div>
          <div className="flex items-center gap-3">
            <CountryFlag 
              countryKey="PE" 
              variant="flag" 
              size="md" 
              showTooltip={false}
            />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Sesiones del Congreso del Perú</h1>
              <p className="text-sm text-muted-foreground">
                Monitorea las sesiones de comisiones del Congreso y accede a grabaciones de video
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Peru Sessions Content */}
      <PeruSessionsSection initialSessionId={initialSessionId} />
    </div>
  );
}

export default SessionsPage;
