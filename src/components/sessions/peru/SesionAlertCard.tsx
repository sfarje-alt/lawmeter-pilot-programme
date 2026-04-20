// Tarjeta minimal de Sesión — mismo lenguaje visual que la bandeja de Alertas Regulatorias.
// Solo muestra clasificación source-backed y estados operativos clave.
// Sin chips de Agenda lista / Video vinculado (eso vive en Fuente y evidencia).
// Acciones: Pin / Archivar.

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Pin,
  Archive,
  ArchiveRestore,
  Building2,
  Clock,
  Tag,
  Gavel,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatbotChip, TranscriptionChip } from './SesionChips';
import type { PeruSession } from '@/types/peruSessions';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  session: PeruSession;
  isUnread?: boolean;
  onTogglePin: (id: string) => void;
  onArchive: (id: string) => void;
  onOpen: (s: PeruSession) => void;
}

// Detecta el tipo de actuación parlamentaria desde el texto del ítem.
function detectActionType(title: string): string | null {
  const t = title.toLowerCase();
  if (t.includes('votación') && t.includes('debate')) return 'Debate y votación';
  if (t.includes('votación')) return 'Votación';
  if (t.includes('debate')) return 'Debate';
  if (t.includes('predictamen')) return 'Predictamen';
  if (t.includes('presentación') || t.includes('sustentar')) return 'Presentación';
  return null;
}

export function SesionAlertCard({
  session,
  isUnread,
  onTogglePin,
  onArchive,
  onOpen,
}: Props) {
  const item = session.agenda_item;
  const isPinned = !!session.is_pinned;
  const isArchived = !!session.is_archived;
  const actionType = item ? detectActionType(item.title) : null;

  const dateLabel = session.scheduled_at
    ? format(new Date(session.scheduled_at), "d MMM yyyy · HH:mm 'h'", { locale: es })
    : session.scheduled_date_text ?? 'Fecha por confirmar';

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTogglePin(session.id);
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    onArchive(session.id);
  };

  return (
    <Card
      className={cn(
        'p-3 border-border/30 hover:bg-card/90 transition-all cursor-pointer group w-full min-w-0 max-w-full overflow-hidden',
        isUnread && !isArchived
          ? 'bg-gradient-to-br from-primary/[0.08] via-card to-card border-l-2 border-l-primary/60 shadow-[inset_0_1px_0_0_hsl(var(--primary)/0.12)]'
          : 'bg-card',
        isPinned && !isArchived && 'border-l-4 border-l-primary',
        isArchived && 'opacity-70 border-dashed',
      )}
      onClick={() => onOpen(session)}
    >
      {/* Header — ítem + acciones */}
      <div className="flex items-start justify-between gap-2 mb-2 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap min-w-0 flex-1">
          {item?.item_number && (
            <Badge variant="outline" className="text-xs font-mono bg-primary/10 text-primary border-primary/30">
              Ítem {item.item_number}
            </Badge>
          )}
          {actionType && (
            <Badge variant="secondary" className="text-[10px] py-0 bg-muted/50 text-muted-foreground">
              <Gavel className="h-2.5 w-2.5 mr-1" />
              {actionType}
            </Badge>
          )}
          {isUnread && !isArchived && (
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" aria-label="Nueva" />
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {!isArchived && (
            <button
              onClick={handlePin}
              className={cn(
                'p-1 rounded transition-colors',
                isPinned ? 'bg-primary/20 hover:bg-primary/30' : 'hover:bg-white/10',
              )}
              title={isPinned ? 'Quitar fijación' : 'Fijar arriba'}
            >
              <Pin
                className={cn(
                  'h-3.5 w-3.5 transition-colors',
                  isPinned ? 'fill-primary text-primary' : 'text-muted-foreground',
                )}
              />
            </button>
          )}
          <button
            onClick={handleArchive}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title={isArchived ? 'Restaurar del archivo' : 'Archivar'}
          >
            {isArchived ? (
              <ArchiveRestore className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
            ) : (
              <Archive className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
            )}
          </button>
        </div>
      </div>

      {/* Título — directo de la agenda */}
      <h4 className="text-sm font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
        {item?.title ?? session.session_title ?? 'Sesión sin título'}
      </h4>

      {/* Comisión */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2 min-w-0">
        <Building2 className="h-3 w-3 shrink-0" />
        <span className="truncate">Comisión de {session.commission_name}</span>
      </div>

      {/* Materia temática + proyectos vinculados */}
      {(item?.thematic_area || (item?.bill_numbers?.length ?? 0) > 0) && (
        <div className="flex items-center gap-1.5 flex-wrap mb-2">
          {item?.thematic_area && (
            <Badge variant="secondary" className="text-xs bg-muted/50 py-0">
              <Tag className="h-3 w-3 mr-1" />
              {item.thematic_area}
            </Badge>
          )}
          {item?.bill_numbers?.slice(0, 3).map((b) => (
            <Badge key={b} variant="outline" className="text-[11px] font-mono py-0 border-border/60 bg-background/40">
              {b}
            </Badge>
          ))}
          {(item?.bill_numbers?.length ?? 0) > 3 && (
            <Badge variant="outline" className="text-[11px] py-0 border-border/60">
              +{(item?.bill_numbers?.length ?? 0) - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Solo chips de IA (transcripción + chatbot) */}
      <div className="flex items-center gap-1 flex-wrap mb-2">
        <TranscriptionChip state={session.transcription_state ?? 'no_solicitada'} />
        <ChatbotChip state={session.chatbot_state ?? 'no_solicitado'} />
      </div>

      {/* Footer — fecha */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t border-border/30">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{dateLabel}</span>
        </div>
      </div>
    </Card>
  );
}
