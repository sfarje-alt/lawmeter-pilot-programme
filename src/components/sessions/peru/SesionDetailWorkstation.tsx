// SesionDetailWorkstation — Sheet con header sticky + 4 tabs.
// Tabs: Resumen · Orden del día · Video y fuente · IA.
// Sin tab de Revisión legal. Sin "Dar seguimiento". Solo Pin / Archivar.
// Solo muestra datos source-backed; los enriquecimientos se reservan como placeholders.

import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Pin,
  PinOff,
  Archive,
  ArchiveRestore,
  ExternalLink,
  Sparkles,
  Loader2,
  CheckCircle2,
  Search,
  Building2,
  Calendar as CalendarIcon,
  FileText,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  AgendaChip,
  ChatbotChip,
  EditorialChip,
  TranscriptionChip,
  VideoChip,
} from './SesionChips';
import type { PeruSession } from '@/types/peruSessions';

interface Props {
  session: PeruSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTogglePin: (id: string) => void;
  onArchive: (id: string) => void;
  onRequestTranscription: (id: string) => void;
  onRequestChatbot: (id: string) => void;
}

export function SesionDetailWorkstation({
  session,
  open,
  onOpenChange,
  onTogglePin,
  onArchive,
  onRequestTranscription,
  onRequestChatbot,
}: Props) {
  if (!session) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-3xl" />
      </Sheet>
    );
  }

  const item = session.agenda_item;
  const dateLabel = session.scheduled_at
    ? format(new Date(session.scheduled_at), "d 'de' MMMM yyyy · HH:mm 'h'", { locale: es })
    : session.scheduled_date_text ?? 'Fecha por confirmar';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl p-0 overflow-y-auto bg-background">
        {/* Header sticky */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border/50">
          <div className="p-5 space-y-3">
            <div className="flex items-start gap-2">
              {item?.item_number && (
                <span className="inline-flex items-center justify-center px-2 h-6 rounded bg-primary/15 text-primary text-xs font-mono font-semibold shrink-0 mt-0.5">
                  Ítem {item.item_number}
                </span>
              )}
              <h2 className="text-lg font-semibold text-foreground leading-snug">
                {item?.title ?? session.session_title}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                Comisión de {session.commission_name}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-3.5 w-3.5" />
                {dateLabel}
              </span>
              <Badge variant="outline" className="text-[10px] font-mono ml-1">
                {session.source}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <EditorialChip state={session.editorial_state ?? 'nueva'} />
              <AgendaChip state={session.agenda_state ?? 'lista'} />
              <VideoChip state={session.video_state ?? 'pendiente'} />
              <TranscriptionChip state={session.transcription_state ?? 'no_solicitada'} />
              <ChatbotChip state={session.chatbot_state ?? 'no_solicitado'} />
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Button
                size="sm"
                variant={session.is_pinned ? 'default' : 'outline'}
                onClick={() => onTogglePin(session.id)}
              >
                {session.is_pinned ? (
                  <PinOff className="h-3.5 w-3.5 mr-1" />
                ) : (
                  <Pin className="h-3.5 w-3.5 mr-1" />
                )}
                {session.is_pinned ? 'Quitar pin' : 'Pin'}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onArchive(session.id)}>
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
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="p-5">
          <Tabs defaultValue="resumen">
            <TabsList className="grid grid-cols-4 bg-muted/40">
              <TabsTrigger value="resumen">Resumen</TabsTrigger>
              <TabsTrigger value="agenda">Orden del día</TabsTrigger>
              <TabsTrigger value="video">Video y fuente</TabsTrigger>
              <TabsTrigger value="ia">IA</TabsTrigger>
            </TabsList>

            <TabsContent value="resumen" className="mt-4">
              <TabResumen session={session} />
            </TabsContent>
            <TabsContent value="agenda" className="mt-4">
              <TabAgenda session={session} />
            </TabsContent>
            <TabsContent value="video" className="mt-4">
              <TabVideo session={session} />
            </TabsContent>
            <TabsContent value="ia" className="mt-4">
              <TabIA
                session={session}
                onRequestTranscription={onRequestTranscription}
                onRequestChatbot={onRequestChatbot}
              />
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── Tab Resumen ──────────────────────────────────────────────────────────────
function TabResumen({ session }: { session: PeruSession }) {
  const r = session.recording;
  return (
    <div className="space-y-4 text-sm">
      <Section title="Metadata de la sesión">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <Field label="external_id" value={session.external_session_id} mono />
          <Field label="status" value={session.status} />
          <Field label="commission_name" value={session.commission_name} />
          <Field label="scheduled_date_text" value={session.scheduled_date_text} />
          <Field label="source" value={session.source} mono />
          <Field label="source_file_name" value={session.source_file_name} mono />
          <Field label="created_at" value={fmt(session.created_at)} />
          <Field label="updated_at" value={fmt(session.updated_at)} />
        </div>
        {session.session_title && (
          <div className="mt-3">
            <Field label="session_title" value={session.session_title} block />
          </div>
        )}
      </Section>

      <Section title="Estado de workflow">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <Field label="agenda" value={session.agenda_state ?? '—'} />
          <Field label="video" value={session.video_state ?? '—'} />
          <Field label="transcription" value={session.transcription_state ?? '—'} />
          <Field label="chatbot" value={session.chatbot_state ?? '—'} />
          {r?.transcription_status && (
            <Field label="recording.transcription_status" value={r.transcription_status} mono />
          )}
          {r?.analysis_status && (
            <Field label="recording.analysis_status" value={r.analysis_status} mono />
          )}
          {r?.analyzed_at && <Field label="recording.analyzed_at" value={fmt(r.analyzed_at)} />}
        </div>
      </Section>

      <Section title="Análisis enriquecido">
        <div className="rounded-md border border-dashed border-border/60 bg-muted/20 p-4 space-y-2">
          <p className="text-sm text-muted-foreground">
            No hay resumen enriquecido todavía.
          </p>
          <p className="text-xs text-muted-foreground">
            Esta sesión solo cuenta con metadata estructurada y agenda. El análisis
            adicional aparecerá cuando exista transcripción o cuando se ejecute la
            capa de análisis.
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <Badge variant="outline" className="text-[11px] text-muted-foreground border-border/60">
              Clasificación IA: pendiente
            </Badge>
            <Badge variant="outline" className="text-[11px] text-muted-foreground border-border/60">
              Comentario regulatorio: disponible con análisis posterior
            </Badge>
          </div>
        </div>
      </Section>
    </div>
  );
}

// ── Tab Agenda ───────────────────────────────────────────────────────────────
function TabAgenda({ session }: { session: PeruSession }) {
  const item = session.agenda_item;
  if (!item) {
    return (
      <div className="rounded-md border border-dashed border-border/60 bg-muted/20 p-6 text-center text-sm text-muted-foreground">
        Sin ítem de agenda asociado a esta sesión.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border/50 bg-card/40 p-4 space-y-3">
        <div className="flex items-start gap-2">
          <span className="inline-flex items-center px-2 h-5 rounded bg-primary/15 text-primary text-[11px] font-mono font-semibold shrink-0 mt-0.5">
            Ítem {item.item_number}
          </span>
          <h3 className="font-semibold text-foreground text-sm leading-snug">{item.title}</h3>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {item.thematic_area && (
            <Badge variant="outline" className="text-[11px]">
              Área: {item.thematic_area}
            </Badge>
          )}
          {detectActionType(item.title) && (
            <Badge variant="secondary" className="text-[11px] bg-muted/50">
              {detectActionType(item.title)}
            </Badge>
          )}
        </div>

        {item.bill_numbers.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wide">
              Proyectos vinculados
            </span>
            <div className="flex flex-wrap gap-1.5">
              {item.bill_numbers.map((b) => (
                <Badge
                  key={b}
                  variant="outline"
                  className="font-mono text-[11px] border-border/60 bg-background/40"
                >
                  {b}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-md border border-dashed border-border/60 bg-muted/20 p-4 text-xs text-muted-foreground">
        Solo se muestra contenido directamente derivable del título y los proyectos
        listados en la agenda. Resúmenes y análisis aparecerán cuando exista
        transcripción o capa de análisis.
      </div>
    </div>
  );
}

// ── Tab Video y fuente ───────────────────────────────────────────────────────
function TabVideo({ session }: { session: PeruSession }) {
  const r = session.recording;
  return (
    <div className="space-y-4 text-sm">
      <Section title="Agenda oficial">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <Field label="agenda_url" value={session.agenda_url} link />
          <Field label="documents_url" value={session.documents_url} link />
          <Field label="source" value={session.source} mono />
          <Field label="source_file_name" value={session.source_file_name} mono />
        </div>
        {session.agenda_url && (
          <Button asChild size="sm" variant="outline" className="mt-3">
            <a href={session.agenda_url} target="_blank" rel="noreferrer">
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              Abrir agenda oficial
            </a>
          </Button>
        )}
      </Section>

      <Section title="Grabación (recording)">
        {r ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <Field label="recording.provider" value={r.provider} mono />
              <Field label="recording.channel_name" value={r.channel_name} />
              <Field label="recording.channel_id" value={r.channel_id} mono />
              <Field label="recording.video_id" value={r.video_id} mono />
              <Field label="recording.resolution_confidence" value={r.resolution_confidence} mono />
              <Field label="recording.resolution_method" value={r.resolution_method} mono />
              <Field label="recording.resolved_at" value={fmt(r.resolved_at)} />
              <Field label="recording.last_error" value={r.last_error ?? '—'} />
            </div>
            <Field label="recording.expected_title" value={r.expected_title ?? '—'} block />
            {r.video_url && (
              <Button asChild size="sm" variant="outline">
                <a href={r.video_url} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-3.5 w-3.5 mr-1" />
                  Abrir video en YouTube
                </a>
              </Button>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground text-xs">Sin grabación registrada.</p>
        )}
      </Section>
    </div>
  );
}

// ── Tab IA ───────────────────────────────────────────────────────────────────
function TabIA({
  session,
  onRequestTranscription,
  onRequestChatbot,
}: {
  session: PeruSession;
  onRequestTranscription: (id: string) => void;
  onRequestChatbot: (id: string) => void;
}) {
  const [search, setSearch] = useState('');
  const tState = session.transcription_state ?? 'no_solicitada';
  const cState = session.chatbot_state ?? 'no_solicitado';
  const transcript = session.recording?.transcription_text;

  const filteredTranscript = useMemo(() => {
    if (!transcript) return '';
    if (!search) return transcript;
    const lines = transcript.split('\n');
    return lines.filter((l) => l.toLowerCase().includes(search.toLowerCase())).join('\n') || transcript;
  }, [transcript, search]);

  const r = session.recording;

  return (
    <div className="space-y-5">
      {/* Módulo Transcripción */}
      <div className="rounded-lg border border-border/50 bg-card/40 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Transcripción
          </h3>
          <TranscriptionChip state={tState} />
        </div>

        {/* Metadata source-backed */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <Field label="transcription_status" value={r?.transcription_status ?? tState} mono />
          <Field label="transcription_tier" value={(r as any)?.transcription_tier ?? '—'} mono />
          <Field label="transcription_chars" value={(r as any)?.transcription_chars ?? '—'} mono />
          <Field label="transcribed_at" value={fmt((r as any)?.transcribed_at)} />
        </div>

        {tState === 'no_solicitada' && (
          <div className="space-y-2 pt-1">
            <p className="text-sm text-muted-foreground">
              La transcripción no ha sido solicitada. Toma aproximadamente 20 minutos.
            </p>
            <Button size="sm" onClick={() => onRequestTranscription(session.id)}>
              Solicitar transcripción
            </Button>
          </div>
        )}

        {(tState === 'en_cola' || tState === 'procesando') && (
          <div className="flex items-center gap-2 text-sm text-primary">
            <Loader2 className="h-4 w-4 animate-spin" />
            {tState === 'en_cola' ? 'En cola · ~20 min' : 'Procesando · ~20 min'}
          </div>
        )}

        {tState === 'lista' && transcript && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2 text-sm text-success">
              <CheckCircle2 className="h-4 w-4" />
              Transcripción lista
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar en la transcripción…"
                className="pl-8 h-8 text-xs"
              />
            </div>
            <div className="rounded-md bg-background/50 border border-border/50 p-3 max-h-64 overflow-y-auto text-xs whitespace-pre-wrap text-foreground/85">
              {filteredTranscript}
            </div>
          </div>
        )}

        {tState === 'lista' && !transcript && (
          <div className="rounded-md border border-dashed border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground">
            Hay metadata de transcripción pero el texto no está cargado en este prototipo.
          </div>
        )}
      </div>

      {/* Módulo Chatbot global */}
      <div className="rounded-lg border border-border/50 bg-card/40 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Habilitar para chatbot global
          </h3>
          <ChatbotChip state={cState} />
        </div>

        <p className="text-xs text-muted-foreground">
          El asistente de Sesiones es <strong>global</strong>: responde sobre todas las
          alertas habilitadas. Habilita esta sesión para que el chatbot pueda leer
          su metadata, agenda y transcripción cuando esté disponible.
        </p>

        {cState === 'no_solicitado' && (
          <Button size="sm" onClick={() => onRequestChatbot(session.id)}>
            Habilitar para chatbot
          </Button>
        )}
        {(cState === 'en_cola' || cState === 'procesando') && (
          <div className="flex items-center gap-2 text-sm text-primary">
            <Loader2 className="h-4 w-4 animate-spin" />
            {cState === 'en_cola' ? 'En cola · ~20 min' : 'Procesando · ~20 min'}
          </div>
        )}
        {cState === 'listo' && (
          <div className="flex items-center gap-2 text-sm text-success">
            <CheckCircle2 className="h-4 w-4" />
            Habilitada para el chatbot global
          </div>
        )}
      </div>
    </div>
  );
}

// ── helpers ─────────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h4 className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
        {title}
      </h4>
      <div className="rounded-lg border border-border/50 bg-card/40 p-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  mono,
  block,
  link,
}: {
  label: string;
  value?: string | number | null;
  mono?: boolean;
  block?: boolean;
  link?: boolean;
}) {
  const v = value === null || value === undefined || value === '' ? '—' : String(value);
  return (
    <div className={block ? 'col-span-2 space-y-0.5' : 'space-y-0.5'}>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground/80">{label}</div>
      {link && v !== '—' ? (
        <a
          href={v}
          target="_blank"
          rel="noreferrer"
          className="text-primary hover:underline text-xs break-all inline-flex items-center gap-1"
        >
          <FileText className="h-3 w-3" />
          {v}
        </a>
      ) : (
        <div className={mono ? 'text-xs font-mono text-foreground/85 break-all' : 'text-xs text-foreground/90 break-words'}>
          {v}
        </div>
      )}
    </div>
  );
}

function fmt(date?: string | null): string | undefined {
  if (!date) return undefined;
  try {
    return format(new Date(date), "d MMM yyyy · HH:mm", { locale: es });
  } catch {
    return date;
  }
}

function detectActionType(title: string): string | null {
  const t = title.toLowerCase();
  if (t.includes('votación') && t.includes('debate')) return 'Debate y votación';
  if (t.includes('votación')) return 'Votación';
  if (t.includes('debate')) return 'Debate';
  if (t.includes('predictamen')) return 'Predictamen';
  if (t.includes('presentación') || t.includes('sustentar')) return 'Presentación';
  return null;
}
