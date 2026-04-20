// Banda discreta que conecta Sesiones con Reportes.

import { Button } from '@/components/ui/button';
import { ArrowRight, FileDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  pinned: number;
  followUp: number;
}

export function ReportesConnector({ pinned, followUp }: Props) {
  const navigate = useNavigate();
  const total = pinned + followUp;

  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3 rounded-lg border border-primary/20 bg-primary/5">
      <FileDown className="h-4 w-4 text-primary shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">
          Las alertas <span className="font-semibold text-primary">pineadas</span> y{' '}
          <span className="font-semibold text-amber-300">en seguimiento</span> pueden incluirse desde Reportes.
        </p>
        {total > 0 && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {pinned} pineadas · {followUp} en seguimiento disponibles para el próximo reporte.
          </p>
        )}
      </div>
      <Button
        size="sm"
        variant="outline"
        className="border-primary/40 text-primary hover:bg-primary/10"
        onClick={() => navigate('/?section=reports')}
      >
        Ir a Reportes
        <ArrowRight className="h-3.5 w-3.5 ml-1" />
      </Button>
    </div>
  );
}
