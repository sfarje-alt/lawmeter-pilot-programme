// Empty states pulidos para el workspace de Sesiones.

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pin, Archive, Sparkles, FileText } from 'lucide-react';

interface EmptyProps {
  variant: 'pinned' | 'archived' | 'all' | 'transcription' | 'chatbot';
  onAction?: () => void;
  actionLabel?: string;
}

const COPY: Record<
  EmptyProps['variant'],
  { icon: React.ElementType; title: string; description: string }
> = {
  pinned: {
    icon: Pin,
    title: 'No hay sesiones pineadas',
    description:
      'Marca como pineada una alerta que quieras destacar para el próximo reporte regulatorio.',
  },
  archived: {
    icon: Archive,
    title: 'No hay sesiones archivadas',
    description:
      'Las sesiones que archives manualmente aparecerán aquí. El archivo es siempre manual.',
  },
  all: {
    icon: FileText,
    title: 'No se encontraron sesiones',
    description:
      'Ajusta los filtros o sincroniza nuevas sesiones desde el portal del Congreso.',
  },
  transcription: {
    icon: Sparkles,
    title: 'La transcripción no ha sido solicitada',
    description:
      'Solicita la transcripción para acceder al texto completo de la sesión. Toma aproximadamente 20 minutos.',
  },
  chatbot: {
    icon: Sparkles,
    title: 'El chatbot no ha sido preparado',
    description:
      'Prepara el chatbot para hacer preguntas específicas sobre la sesión. Toma aproximadamente 20 minutos.',
  },
};

export function SesionesEmptyState({ variant, onAction, actionLabel }: EmptyProps) {
  const { icon: Icon, title, description } = COPY[variant];
  return (
    <Card className="border-dashed border-border/60 bg-card/30">
      <CardContent className="py-12 text-center space-y-3">
        <div className="mx-auto h-12 w-12 rounded-full bg-muted/40 flex items-center justify-center">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-base font-medium text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">{description}</p>
        {onAction && actionLabel && (
          <Button variant="default" size="sm" className="mt-2" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
