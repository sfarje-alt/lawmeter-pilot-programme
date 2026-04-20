// KPI row del workspace de Sesiones (4 principales + 1 secundario).

import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Pin, Eye, Brain, FileDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SesionesKPIRowProps {
  total: number;
  pinned: number;
  followUp: number;
  processingAI: number;
  eligibleForReport: number;
}

interface KPIProps {
  label: string;
  value: number;
  icon: React.ElementType;
  tone: 'neutral' | 'primary' | 'amber' | 'blue' | 'emerald';
  hint?: string;
  secondary?: boolean;
}

const TONES: Record<KPIProps['tone'], { ring: string; icon: string; bg: string }> = {
  neutral: { ring: 'border-l-slate-400/60', icon: 'text-slate-300', bg: 'from-slate-500/10 to-slate-500/0' },
  primary: { ring: 'border-l-primary', icon: 'text-primary', bg: 'from-primary/10 to-primary/0' },
  amber: { ring: 'border-l-amber-500', icon: 'text-amber-400', bg: 'from-amber-500/10 to-amber-500/0' },
  blue: { ring: 'border-l-blue-500', icon: 'text-blue-400', bg: 'from-blue-500/10 to-blue-500/0' },
  emerald: { ring: 'border-l-emerald-500', icon: 'text-emerald-400', bg: 'from-emerald-500/10 to-emerald-500/0' },
};

function KPI({ label, value, icon: Icon, tone, hint, secondary }: KPIProps) {
  const t = TONES[tone];
  return (
    <Card
      className={cn(
        'border-l-4 bg-gradient-to-br',
        t.ring,
        t.bg,
        secondary && 'opacity-90',
      )}
    >
      <CardContent className="py-4 px-4">
        <div className="flex items-center gap-2">
          <Icon className={cn('h-4 w-4', t.icon)} />
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
        </div>
        <p className={cn('font-bold text-foreground mt-1', secondary ? 'text-2xl' : 'text-3xl')}>
          {value}
        </p>
        {hint && <p className="text-[11px] text-muted-foreground mt-0.5">{hint}</p>}
      </CardContent>
    </Card>
  );
}

export function SesionesKPIRow({
  total,
  pinned,
  followUp,
  processingAI,
  eligibleForReport,
}: SesionesKPIRowProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
      <KPI label="Total sesiones" value={total} icon={Calendar} tone="neutral" />
      <KPI label="Pineadas" value={pinned} icon={Pin} tone="primary" />
      <KPI label="En seguimiento" value={followUp} icon={Eye} tone="amber" />
      <KPI label="Procesando IA" value={processingAI} icon={Brain} tone="blue" />
      <KPI
        label="Elegibles para reporte"
        value={eligibleForReport}
        icon={FileDown}
        tone="emerald"
        secondary
        hint="Pineadas + seguimiento"
      />
    </div>
  );
}
