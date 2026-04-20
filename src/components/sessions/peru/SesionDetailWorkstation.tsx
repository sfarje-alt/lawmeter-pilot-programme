// SesionDetailWorkstation — Sheet con header sticky + 5 tabs.

import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Pin,
  PinOff,
  Eye,
  EyeOff,
  Archive,
  ExternalLink,
  Sparkles,
  Loader2,
  CheckCircle2,
  Search,
  FileDown,
  Building2,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
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
import { SesionesEmptyState } from './SesionesEmptyStates';
import { ReportesConnector } from './ReportesConnector';
import type { PeruSession, SesionLegalReview } from '@/types/peruSessions';

interface Props {
  session: PeruSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTogglePin: (id: string) => void;
  onToggleFollowUp: (id: string) => void;
  onArchive: (id: string) => void;
  onRequestTranscription: (id: string) => void;
  onRequestChatbot: (id: string) => void;
  onUpdateLegalReview: (id: string, review: SesionLegalReview) => void;
}

const SUGGESTED_PROMPTS = [
  'Resume lo discutido',
  '¿Qué riesgos regulatorios aparecen?',
  '¿Qué temas podrían impactar a la compañía?',
  '¿Qué proyectos fueron debatidos?',
];

export function SesionDetailWorkstation({
  session,
  open,
  onOpenChange,
  onTogglePin,
  onToggleFollowUp,
  onArchive,
  onRequestTranscription,
  onRequestChatbot,
  onUpdateLegalReview,
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
                {session.is_pinned ? <PinOff className="h-3.5 w-3.5 mr-1" /> : <Pin className="h-3.5 w-3.5 mr-1" />}
                {session.is_pinned ? 'Quitar pin' : 'Pin'}
              </Button>
              <Button
                size="sm"
                variant={session.is_follow_up ? 'secondary' : 'outline'}
                className={cn(session.is_follow_up && 'bg-amber-500/20 text-amber-200 hover:bg-amber-500/30')}
                onClick={() => onToggleFollowUp(session.id)}
              >
                {session.is_follow_up ? <EyeOff className="h-3.5 w-3.5 mr-1" /> : <Eye className="h-3.5 w-3.5 mr-1" />}
                {session.is_follow_up ? 'Quitar seguimiento' : 'Dar seguimiento'}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onArchive(session.id)}>
                <Archive className="h-3.5 w-3.5 mr-1" />
                {session.is_archived ? 'Restaurar' : 'Archivar'}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="p-5">
          <Tabs defaultValue="resumen">
            <TabsList className="grid grid-cols-5 bg-muted/40">
              <TabsTrigger value="resumen">Resumen</TabsTrigger>
              <TabsTrigger value="agenda">Orden del día</TabsTrigger>
              <TabsTrigger value="video">Video y fuente</TabsTrigger>
              <TabsTrigger value="ia">IA</TabsTrigger>
              <TabsTrigger value="legal">Revisión legal</TabsTrigger>
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
            <TabsContent value="legal" className="mt-4">
              <TabLegal session={session} onUpdate={onUpdateLegalReview} />
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <ReportesConnector
              pinned={session.is_pinned ? 1 : 0}
              followUp={session.is_follow_up ? 1 : 0}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── Tab Resumen ──────────────────────────────────────────────────────────────
function TabResumen({ session }: { session: PeruSession }) {
  return (
    <div className="space-y-4 text-sm">
      <Section title="Resumen ejecutivo">
        <p className="text-foreground/90 leading-relaxed">
          {session.executive_summary ?? 'Sin resumen disponible.'}
        </p>
      </Section>

      <div className="flex flex-wrap items-center gap-1.5">
        {session.etiqueta_ia && <EtiquetaIAChip label={session.etiqueta_ia} />}
        {session.impact_level && <ImpactChip level={session.impact_level} />}
        {session.urgency_level && <UrgencyChip level={session.urgency_level} />}
        {session.risk_level && <RiskChip level={session.risk_level} />}
      </div>

      <Section title="Por qué importa">
        <p className="text-foreground/90 leading-relaxed">
          {session.why_it_matters ?? '—'}
        </p>
      </Section>

      <Section title="Próximo paso sugerido">
        <p className="text-foreground/90 leading-relaxed">
          {session.suggested_next_step ?? '—'}
        </p>
      </Section>
    </div>
  );
}

// ── Tab Agenda ───────────────────────────────────────────────────────────────
function TabAgenda({ session }: { session: PeruSession }) {
  const item = session.agenda_item;
  if (!item) return <SesionesEmptyState variant="all" />;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border/50 bg-card/40 p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="inline-flex items-center px-2 h-5 rounded bg-primary/15 text-primary text-[11px] font-mono font-semibold">
              Ítem {item.item_number}
            </span>
            <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
          </div>
          {session.impact_level && <ImpactChip level={session.impact_level} />}
        </div>

        {item.thematic_area && (
          <Badge variant="outline" className="text-[11px]">
            Área: {item.thematic_area}
          </Badge>
        )}

        {item.bill_numbers.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wide">
              Proyectos:
            </span>
            {item.bill_numbers.map((b) => (
              <Badge key={b} variant="outline" className="font-mono text-[11px]">
                {b}
              </Badge>
            ))}
          </div>
        )}

        <p className="text-sm text-foreground/85 leading-relaxed">
          {session.preliminary_impact ?? session.executive_summary ?? '—'}
        </p>
      </div>
    </div>
  );
}

// ── Tab Video ────────────────────────────────────────────────────────────────
function TabVideo({ session }: { session: PeruSession }) {
  const r = session.recording;
  return (
    <div className="space-y-4 text-sm">
      <Section title="Fuente oficial">
        {session.agenda_url ? (
          <a
            href={session.agenda_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Abrir agenda oficial
          </a>
        ) : (
          <p className="text-muted-foreground">Sin enlace oficial registrado.</p>
        )}
      </Section>

      <Section title="Grabación YouTube">
        {r?.video_url ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <Field label="Proveedor" value={r.provider} />
              <Field label="Canal" value={r.channel_name} />
              <Field label="Confianza" value={r.resolution_confidence ?? '—'} />
              <Field label="Método" value={r.resolution_method ?? '—'} />
            </div>
            <Field label="Título esperado" value={r.expected_title ?? '—'} />
            <Button asChild size="sm" variant="outline">
              <a href={r.video_url} target="_blank" rel="noreferrer">
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                Abrir video
              </a>
            </Button>
          </div>
        ) : (
          <p className="text-muted-foreground">Video pendiente de vincular.</p>
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
    if (!transcript || !search) return transcript;
    return transcript;
  }, [transcript, search]);

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

        {tState === 'no_solicitada' && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              La transcripción no ha sido solicitada. Toma aproximadamente 20 minutos.
            </p>
            <Button size="sm" onClick={() => onRequestTranscription(session.id)}>
              Solicitar transcripción
            </Button>
          </div>
        )}

        {(tState === 'en_cola' || tState === 'procesando') && (
          <div className="flex items-center gap-2 text-sm text-blue-300">
            <Loader2 className="h-4 w-4 animate-spin" />
            {tState === 'en_cola' ? 'En cola · ~20 min' : 'Procesando · ~20 min'}
          </div>
        )}

        {tState === 'lista' && transcript && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-emerald-300">
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
      </div>

      {/* Módulo Chatbot */}
      <div className="rounded-lg border border-border/50 bg-card/40 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Chatbot de la sesión
          </h3>
          <ChatbotChip state={cState} />
        </div>

        {cState === 'no_solicitado' && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              El chatbot no ha sido preparado. Toma aproximadamente 20 minutos.
            </p>
            <Button size="sm" onClick={() => onRequestChatbot(session.id)}>
              Preparar chatbot
            </Button>
          </div>
        )}

        {(cState === 'en_cola' || cState === 'procesando') && (
          <div className="flex items-center gap-2 text-sm text-blue-300">
            <Loader2 className="h-4 w-4 animate-spin" />
            {cState === 'en_cola' ? 'En cola · ~20 min' : 'Procesando · ~20 min'}
          </div>
        )}

        {cState === 'listo' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              Chatbot listo
            </div>
            <p className="text-xs text-muted-foreground">Prompts sugeridos:</p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_PROMPTS.map((p) => (
                <Badge key={p} variant="outline" className="text-[11px] cursor-pointer hover:bg-primary/10">
                  {p}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tab Legal ────────────────────────────────────────────────────────────────
function TabLegal({
  session,
  onUpdate,
}: {
  session: PeruSession;
  onUpdate: (id: string, review: SesionLegalReview) => void;
}) {
  const [draft, setDraft] = useState<SesionLegalReview>(
    session.legal_review ?? {
      resumen_legal: '',
      riesgo: '',
      urgencia: '',
      impacto: '',
      areas_afectadas: [],
      proximos_pasos: '',
      comentario_experto: '',
    },
  );

  // Auto-save con debounce
  useEffect(() => {
    const t = setTimeout(() => onUpdate(session.id, draft), 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  const set = <K extends keyof SesionLegalReview>(k: K, v: SesionLegalReview[K]) =>
    setDraft((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="space-y-4 text-sm">
      <FormField label="Resumen legal">
        <Textarea rows={3} value={draft.resumen_legal} onChange={(e) => set('resumen_legal', e.target.value)} />
      </FormField>

      <div className="grid grid-cols-3 gap-3">
        <FormField label="Riesgo">
          <Input value={draft.riesgo} onChange={(e) => set('riesgo', e.target.value)} />
        </FormField>
        <FormField label="Urgencia">
          <Input value={draft.urgencia} onChange={(e) => set('urgencia', e.target.value)} />
        </FormField>
        <FormField label="Impacto">
          <Input value={draft.impacto} onChange={(e) => set('impacto', e.target.value)} />
        </FormField>
      </div>

      <FormField label="Áreas afectadas (separadas por coma)">
        <Input
          value={draft.areas_afectadas.join(', ')}
          onChange={(e) =>
            set(
              'areas_afectadas',
              e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            )
          }
        />
      </FormField>

      <FormField label="Próximos pasos">
        <Textarea rows={2} value={draft.proximos_pasos} onChange={(e) => set('proximos_pasos', e.target.value)} />
      </FormField>

      <FormField label="Comentario experto">
        <Textarea rows={4} value={draft.comentario_experto} onChange={(e) => set('comentario_experto', e.target.value)} />
      </FormField>

      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
        Auto-guardado al editar.
      </p>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <h4 className="text-xs uppercase tracking-wide text-muted-foreground font-medium">{title}</h4>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-xs text-foreground break-words">{value ?? '—'}</p>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
