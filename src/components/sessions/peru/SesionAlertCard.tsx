// Card de alerta del workspace de Sesiones (densidad compacta · dark premium).

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Pin,
  PinOff,
  Eye,
  EyeOff,
  Archive,
  ArchiveRestore,
  ArrowUpRight,
  Calendar as CalendarIcon,
  Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AgendaChip,
  ChatbotChip,
  EditorialChip,
  EtiquetaIAChip,
  ImpactChip,
  RiskChip,
  TranscriptionChip,
  UrgencyChip,
  VideoChip,
} from './SesionChips';
import type { PeruSession } from '@/types/peruSessions';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  session: PeruSession;
  onTogglePin: (id: string) => void;
  onToggleFollowUp: (id: string) => void;
  onArchive: (id: string) => void;
  onOpen: (s: PeruSession) => void;
}

export function SesionAlertCard({
  session,
  onTogglePin,
  onToggleFollowUp,
  onArchive,
  onOpen,
}: Props) {
  const item = session.agenda_item;
  const dateLabel = session.scheduled_at
    ? format(new Date(session.scheduled_at), "d 'de' MMM yyyy · HH:mm 'h'", { locale: es })
    : session.scheduled_date_text ?? 'Fecha por confirmar';

  return (
    <Card
      className={cn(
        'group relative overflow-hidden border-border/60 bg-card/60 hover:bg-card/80 hover:border-primary/40 transition-all cursor-pointer',
        session.is_pinned && 'border-l-4 border-l-primary',
        session.is_follow_up && !session.is_pinned && 'border-l-4 border-l-amber-500',
        session.is_archived && 'opacity-60',
      )}
      onClick={() => onOpen(session)}
    >
      <div className="p-4 space-y-3">
        {/* Línea 1 — chips de clasificación */}
        <div className="flex flex-wrap items-center gap-1.5">
          <EditorialChip state={session.editorial_state ?? 'nueva'} />
          {session.etiqueta_ia && <EtiquetaIAChip label={session.etiqueta_ia} />}
          {session.impact_level && <ImpactChip level={session.impact_level} />}
          {session.risk_level && <RiskChip level={session.risk_level} />}
          {session.urgency_level && <UrgencyChip level={session.urgency_level} />}
        </div>

        {/* Línea 2 — título */}
        <div className="space-y-1">
          <div className="flex items-start gap-2">
            {item?.item_number && (
              <span className="inline-flex items-center justify-center px-1.5 h-5 rounded bg-primary/15 text-primary text-[11px] font-mono font-semibold shrink-0 mt-0.5">
                Ítem {item.item_number}
              </span>
            )}
            <h3 className="font-semibold text-foreground text-sm leading-snug">
              {item?.title ?? session.session_title ?? 'Sesión sin título'}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Building2 className="h-3 w-3 shrink-0" />
            <span className="truncate">Comisión de {session.commission_name}</span>
          </p>
        </div>

        {/* Línea 3 — meta + chips de proceso */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarIcon className="h-3.5 w-3.5" />
            {dateLabel}
          </span>
          <span className="text-muted-foreground/60">·</span>
          <AgendaChip state={session.agenda_state ?? 'lista'} />
          <VideoChip state={session.video_state ?? (session.recording?.video_id ? 'vinculado' : 'pendiente')} />
          <TranscriptionChip state={session.transcription_state ?? 'no_solicitada'} />
          <ChatbotChip state={session.chatbot_state ?? 'no_solicitado'} />
        </div>

        {/* Línea 4 — bills */}
        {item?.bill_numbers && item.bill_numbers.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wide">
              Proyectos:
            </span>
            {item.bill_numbers.map((b) => (
              <Badge
                key={b}
                variant="outline"
                className="font-mono text-[11px] border-border/70 bg-background/50"
              >
                {b}
              </Badge>
            ))}
            {item.thematic_area && (
              <Badge variant="outline" className="text-[11px] ml-1 border-border/40 bg-muted/30">
                {item.thematic_area}
              </Badge>
            )}
          </div>
        )}

        {/* Acciones rápidas */}
        <div
          className="flex items-center gap-1 pt-2 border-t border-border/40"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            size="sm"
            variant={session.is_pinned ? 'default' : 'ghost'}
            className="h-7 text-xs"
            onClick={() => onTogglePin(session.id)}
          >
            {session.is_pinned ? (
              <>
                <PinOff className="h-3.5 w-3.5 mr-1" />
                Quitar pin
              </>
            ) : (
              <>
                <Pin className="h-3.5 w-3.5 mr-1" />
                Pin
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant={session.is_follow_up ? 'secondary' : 'ghost'}
            className={cn(
              'h-7 text-xs',
              session.is_follow_up && 'bg-amber-500/20 text-amber-200 hover:bg-amber-500/30',
            )}
            onClick={() => onToggleFollowUp(session.id)}
          >
            {session.is_follow_up ? (
              <>
                <EyeOff className="h-3.5 w-3.5 mr-1" />
                Quitar seguimiento
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5 mr-1" />
                Dar seguimiento
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => onArchive(session.id)}
          >
            {session.is_archived ? (
              <>
                <ArchiveRestore className="h-3.5 w-3.5 mr-1" />
                Restaurar
              </>
            ) : (
              <>
                <Archive className="h-3.5 w-3.5 mr-1" />
                Archivar
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs ml-auto"
            onClick={() => onOpen(session)}
          >
            Abrir
            <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
