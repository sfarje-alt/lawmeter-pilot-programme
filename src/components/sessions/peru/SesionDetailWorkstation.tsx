// SesionDetailWorkstation — Sheet con header sticky + 6 secciones en orden:
// 1. Resumen y labels   2. Campos de enrichment   3. Información general
// 4. Sesión y orden del día   5. Fuente y evidencia   6. Procesamiento IA
//
// SIN risk en ningún campo.
// Solo Pin / Archivar como acciones.
// Enrichment fields son placeholders editables; se completan vía chatbot/IA futura.

import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { IMPACT_LEVELS, type ImpactLevel } from '@/data/peruAlertsMockData';
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
  Tag,
  X,
  Plus,
  Gavel,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChatbotChip, TranscriptionChip } from './SesionChips';
import { getCommissionColor } from './commissionColors';
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

function detectActionType(title: string): string | null {
  const t = title.toLowerCase();
  if (t.includes('votación') && t.includes('debate')) return 'Debate y votación';
  if (t.includes('votación')) return 'Votación';
  if (t.includes('debate')) return 'Debate';
  if (t.includes('predictamen')) return 'Predictamen';
  if (t.includes('presentación') || t.includes('sustentar')) return 'Presentación';
  return null;
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
  const actionType = item ? detectActionType(item.title) : null;
  const dateLabel = session.scheduled_at
    ? format(new Date(session.scheduled_at), "d 'de' MMMM yyyy · HH:mm 'h'", { locale: es })
    : session.scheduled_date_text ?? 'Fecha por confirmar';
  const commissionColor = getCommissionColor(session.commission_name);
  const tState = session.transcription_state ?? 'no_solicitada';
  const classificationUnlocked = tState === 'lista';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl p-0 overflow-y-auto bg-background">
        {/* Header sticky */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border/50">
          <div className="p-5 space-y-3">
            <div className="flex items-start gap-2">
              <Badge
                variant="outline"
                className="text-[10px] uppercase tracking-wide bg-primary/10 text-primary border-primary/30 shrink-0 mt-0.5"
              >
                Sesiones
              </Badge>
              <h2 className="text-lg font-semibold text-foreground leading-snug">
                {item?.title ?? session.session_title}
              </h2>
            </div>

            {/* Comisión + fecha + source — discretos */}
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

        {/* Contenido — 4 tabs: Contenido / Procesamiento IA / Clasificatoria IA / Transcripción */}
        <Tabs defaultValue="contenido" className="px-5 pt-4 pb-5">
          <TabsList className="grid grid-cols-4 w-full mb-4">
            <TabsTrigger value="contenido" className="text-xs">
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              Contenido
            </TabsTrigger>
            <TabsTrigger value="ia" className="text-xs">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Procesamiento IA
            </TabsTrigger>
            <TabsTrigger value="clasificatoria" className="text-xs">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Clasificatoria IA
            </TabsTrigger>
            <TabsTrigger
              value="transcripcion"
              className="text-xs"
              disabled={!classificationUnlocked}
              title={
                classificationUnlocked
                  ? 'Transcripción disponible'
                  : 'Se desbloquea cuando la transcripción esté lista'
              }
            >
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              Transcripción
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contenido" className="space-y-6 mt-0">
            <Section1ResumenLabels
              session={session}
              actionType={actionType}
              commissionColor={commissionColor}
            />
            <Section3InformacionGeneral session={session} />
            <Section4SesionAgenda session={session} actionType={actionType} />
            <Section5FuenteEvidencia session={session} />
          </TabsContent>

          <TabsContent value="ia" className="space-y-6 mt-0">
            <Section6ProcesamientoIA
              session={session}
              onRequestTranscription={onRequestTranscription}
              onRequestChatbot={onRequestChatbot}
            />
          </TabsContent>

          <TabsContent value="clasificatoria" className="space-y-6 mt-0">
            <SectionClasificatoriaIA
              session={session}
              unlocked={classificationUnlocked}
              commissionColor={commissionColor}
            />
          </TabsContent>

          <TabsContent value="transcripcion" className="space-y-6 mt-0">
            <SectionTranscripcion session={session} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

// ── 1. Resumen y labels ─────────────────────────────────────────────────────
function Section1ResumenLabels({
  session,
  actionType,
  commissionColor,
}: {
  session: PeruSession;
  actionType: string | null;
  commissionColor: { bg: string; ring: string; text: string };
}) {
  const item = session.agenda_item;

  // Labels prefijados solo desde clasificación source-backed
  const baseLabels = useMemo(() => {
    const arr: { value: string; type: 'commission' | 'action' | 'area' | 'bill' }[] = [];
    arr.push({ value: `Comisión de ${session.commission_name}`, type: 'commission' });
    if (actionType) arr.push({ value: actionType, type: 'action' });
    if (item?.thematic_area) arr.push({ value: item.thematic_area, type: 'area' });
    item?.bill_numbers?.forEach((b) => arr.push({ value: b, type: 'bill' }));
    return arr;
  }, [actionType, item, session.commission_name]);

  const [customLabels, setCustomLabels] = useState<string[]>([]);
  const [draft, setDraft] = useState('');

  const addLabel = () => {
    const v = draft.trim();
    if (!v) return;
    setCustomLabels((p) => (p.includes(v) ? p : [...p, v]));
    setDraft('');
  };
  const removeLabel = (v: string) =>
    setCustomLabels((p) => p.filter((x) => x !== v));

  return (
    <SectionShell title="1 · Resumen y labels" icon={<Tag className="h-3.5 w-3.5" />}>
      {/* Labels source-backed (solo lectura) */}
      <div className="space-y-2">
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
          Labels base (source-backed)
        </div>
        <div className="flex flex-wrap gap-1.5">
          {baseLabels.length === 0 && (
            <span className="text-xs text-muted-foreground">Sin clasificación derivable.</span>
          )}
          {baseLabels.map((l) => {
            if (l.type === 'commission') {
              return (
                <Badge
                  key={`${l.type}-${l.value}`}
                  variant="outline"
                  className="text-[11px] font-semibold border shadow-sm gap-1"
                  style={{
                    backgroundColor: commissionColor.bg,
                    color: commissionColor.text,
                    borderColor: commissionColor.ring,
                  }}
                >
                  <Building2 className="h-2.5 w-2.5" style={{ color: commissionColor.text }} />
                  {l.value}
                </Badge>
              );
            }
            return (
              <Badge
                key={`${l.type}-${l.value}`}
                variant="outline"
                className={
                  l.type === 'bill'
                    ? 'font-mono text-[11px] border-border/60 bg-background/40'
                    : l.type === 'area'
                      ? 'text-[11px] bg-muted/50'
                      : 'text-[11px] bg-primary/10 text-primary border-primary/30'
                }
              >
                {l.type === 'action' && <Gavel className="h-2.5 w-2.5 mr-1" />}
                {l.value}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Labels manuales */}
      <div className="space-y-2 pt-3 border-t border-border/30">
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
          Etiquetas manuales
        </div>
        <div className="flex flex-wrap gap-1.5">
          {customLabels.map((l) => (
            <Badge key={l} variant="secondary" className="text-[11px] gap-1 pr-1">
              {l}
              <button
                onClick={() => removeLabel(l)}
                className="hover:bg-destructive/20 rounded p-0.5"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </Badge>
          ))}
          <div className="flex items-center gap-1">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLabel())}
              placeholder="Agregar etiqueta…"
              className="h-7 text-xs w-36"
            />
            <Button size="sm" variant="ghost" className="h-7 px-2" onClick={addLabel}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Resumen base del ítem (solo del agenda item, sin invención) */}
      <div className="space-y-2 pt-3 border-t border-border/30">
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
          Resumen base del ítem
        </div>
        {item ? (
          <div className="rounded-md border border-border/40 bg-card/40 p-3 space-y-1">
            <p className="text-sm text-foreground/90 leading-relaxed">{item.title}</p>
            <p className="text-[11px] text-muted-foreground">
              Texto exacto extraído del orden del día. El resumen analítico aparecerá
              cuando se ejecute la capa de enriquecimiento.
            </p>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Sin ítem de agenda asociado.</p>
        )}
      </div>
    </SectionShell>
  );
}

// ── Clasificatoria IA — misma lógica que Alertas Regulatorias ─────────────
const URGENCY_OPTIONS = [
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
  { value: 'critical', label: 'Crítica' },
];

function SectionClasificatoriaIA({
  session,
  unlocked,
  commissionColor,
}: {
  session: PeruSession;
  unlocked: boolean;
  commissionColor: { bg: string; ring: string; text: string };
}) {
  const [impact, setImpact] = useState<ImpactLevel | undefined>(undefined);
  const [urgency, setUrgency] = useState<string>('medium');
  const [tagsText, setTagsText] = useState<string>(
    session.agenda_item?.thematic_area ?? ''
  );

  return (
    <SectionShell
      title="Clasificación interna"
      icon={<Sparkles className="h-3.5 w-3.5 text-primary" />}
      hint={
        unlocked
          ? 'Generada por IA a partir de la transcripción. Editable por el equipo legal.'
          : 'La IA completará estos campos automáticamente cuando la transcripción esté lista. Puedes adelantar valores manualmente.'
      }
    >
      {!unlocked && (
        <div className="rounded-md border border-dashed border-border/60 bg-muted/20 p-3 mb-3 text-[11px] text-muted-foreground flex items-start gap-2">
          <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
          <span>
            <strong className="text-foreground">Pendiente de transcripción.</strong>{' '}
            Solicita la transcripción desde <strong>Procesamiento IA</strong>.
          </span>
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Impacto</Label>
            <Select value={impact} onValueChange={(v) => setImpact(v as ImpactLevel)}>
              <SelectTrigger className="bg-muted/30 border-border/50">
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                {IMPACT_LEVELS.map((lvl) => (
                  <SelectItem key={lvl.value} value={lvl.value}>
                    {lvl.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Urgencia</Label>
            <Select value={urgency} onValueChange={setUrgency}>
              <SelectTrigger className="bg-muted/30 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {URGENCY_OPTIONS.map((u) => (
                  <SelectItem key={u.value} value={u.value}>
                    {u.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-primary" />
            Etiquetas (asignadas automáticamente por IA según el perfil)
          </Label>
          <Input
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            placeholder="p. ej. Salud, Datos personales, Tributario"
            className="bg-muted/30 border-border/50"
          />
          <p className="text-[11px] text-muted-foreground">
            La IA sugiere etiquetas basadas en las etiquetas configuradas en el perfil.
            Puedes editarlas si necesitas ajustar.
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tagsText
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
              .map((t, i) => (
                <Badge
                  key={`${t}-${i}`}
                  variant="outline"
                  className="bg-primary/10 border-primary/30 text-primary"
                >
                  {t}
                </Badge>
              ))}
          </div>
        </div>

        {/* Análisis acumulado del chatbot — se actualiza con cada interacción */}
        <div className="space-y-1.5 pt-3 border-t border-border/30">
          <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-primary" />
            Análisis del chatbot (se actualiza con cada interacción)
          </Label>
          {session.chatbot_summary?.trim() ? (
            <div className="rounded-md border border-border/50 bg-background/50 p-3 text-xs whitespace-pre-wrap text-foreground/85 max-h-64 overflow-y-auto">
              {session.chatbot_summary}
            </div>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              Aún no hay interacciones del chatbot sobre esta sesión. Cada pregunta y
              respuesta del asistente quedará registrada aquí y se incluirá en el reporte.
            </p>
          )}
        </div>
      </div>
    </SectionShell>
  );
}

// ── Transcripción (4to tab) — solo visible cuando está lista ──────────────
function SectionTranscripcion({ session }: { session: PeruSession }) {
  const [search, setSearch] = useState('');
  const transcript = session.recording?.transcription_text;
  const r = session.recording;

  const filteredTranscript = useMemo(() => {
    if (!transcript) return '';
    if (!search) return transcript;
    const lines = transcript.split('\n');
    return (
      lines.filter((l) => l.toLowerCase().includes(search.toLowerCase())).join('\n') ||
      transcript
    );
  }, [transcript, search]);

  if (!transcript) {
    return (
      <SectionShell
        title="Transcripción"
        icon={<FileText className="h-3.5 w-3.5" />}
      >
        <div className="rounded-md border border-dashed border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground text-center">
          No hay transcripción disponible cargada en este prototipo.
        </div>
      </SectionShell>
    );
  }

  return (
    <SectionShell
      title="Transcripción"
      icon={<FileText className="h-3.5 w-3.5" />}
      hint="Texto completo generado por la IA. Buscable."
    >
      <div className="grid grid-cols-2 gap-3 text-xs mb-3">
        <Field label="transcription_status" value={r?.transcription_status ?? 'lista'} mono />
        <Field label="transcription_tier" value={(r as any)?.transcription_tier ?? '—'} mono />
        <Field label="transcription_chars" value={(r as any)?.transcription_chars ?? transcript.length} mono />
        <Field label="transcribed_at" value={fmt((r as any)?.transcribed_at)} />
      </div>

      <div className="relative mb-2">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar en la transcripción…"
          className="pl-8 h-8 text-xs"
        />
      </div>
      <div className="rounded-md bg-background/50 border border-border/50 p-3 max-h-[480px] overflow-y-auto text-xs whitespace-pre-wrap text-foreground/85">
        {filteredTranscript}
      </div>
    </SectionShell>
  );
}

// ── 3. Información general ─────────────────────────────────────────────────
function Section3InformacionGeneral({ session }: { session: PeruSession }) {
  return (
    <SectionShell
      title="2 · Información general"
      icon={<FileText className="h-3.5 w-3.5" />}
    >
      <div className="grid grid-cols-2 gap-3 text-xs">
        <Field label="external_id" value={session.external_session_id} mono />
        <Field label="status" value={session.status} />
        <Field label="commission_name" value={session.commission_name} />
        <Field label="scheduled_date_text" value={session.scheduled_date_text} />
        <Field label="source" value={session.source} mono />
        <Field label="created_at" value={fmt(session.created_at)} />
        <Field label="updated_at" value={fmt(session.updated_at)} />
      </div>
      {session.session_title && (
        <div className="mt-3">
          <Field label="session_title" value={session.session_title} block />
        </div>
      )}
    </SectionShell>
  );
}

// ── 4. Sesión y orden del día ──────────────────────────────────────────────
function Section4SesionAgenda({
  session,
  actionType,
}: {
  session: PeruSession;
  actionType: string | null;
}) {
  const item = session.agenda_item;

  return (
    <SectionShell
      title="3 · Sesión y orden del día"
      icon={<Gavel className="h-3.5 w-3.5" />}
    >
      {!item ? (
        <p className="text-xs text-muted-foreground">
          Sin ítem de agenda asociado a esta sesión.
        </p>
      ) : (
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <span className="inline-flex items-center px-2 h-5 rounded bg-primary/15 text-primary text-[11px] font-mono font-semibold shrink-0 mt-0.5">
              Ítem {item.item_number}
            </span>
            <h3 className="font-semibold text-foreground text-sm leading-snug">
              {item.title}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {actionType && (
              <Badge variant="secondary" className="text-[11px] bg-muted/50">
                <Gavel className="h-2.5 w-2.5 mr-1" />
                {actionType}
              </Badge>
            )}
            {item.thematic_area && (
              <Badge variant="outline" className="text-[11px]">
                Área: {item.thematic_area}
              </Badge>
            )}
          </div>

          {item.bill_numbers.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] text-muted-foreground uppercase tracking-wide">
                Proyectos vinculados ({item.bill_numbers.length})
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
      )}
    </SectionShell>
  );
}

// ── 5. Fuente y evidencia ──────────────────────────────────────────────────
function Section5FuenteEvidencia({ session }: { session: PeruSession }) {
  const r = session.recording;
  return (
    <SectionShell
      title="4 · Fuente y evidencia"
      icon={<ExternalLink className="h-3.5 w-3.5" />}
    >
      <div className="space-y-4">
        {/* Agenda */}
        <div className="space-y-2">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
            Agenda oficial
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <Field label="agenda_url" value={session.agenda_url} link />
            <Field label="source_file_name" value={session.source_file_name} mono />
            <Field label="agenda.status" value={session.agenda_state ?? 'lista'} mono />
          </div>
          {session.agenda_url && (
            <Button asChild size="sm" variant="outline" className="mt-1">
              <a href={session.agenda_url} target="_blank" rel="noreferrer">
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                Abrir agenda oficial
              </a>
            </Button>
          )}
        </div>

        {/* Recording */}
        <div className="space-y-2 pt-3 border-t border-border/30">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
            Grabación (recording)
          </div>
          {r ? (
            <>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <Field label="recording.provider" value={r.provider} mono />
                <Field label="recording.channel_name" value={r.channel_name} />
                <Field label="recording.channel_id" value={r.channel_id} mono />
                <Field label="recording.video_id" value={r.video_id} mono />
                <Field
                  label="recording.resolution_confidence"
                  value={r.resolution_confidence}
                  mono
                />
                <Field
                  label="recording.resolution_method"
                  value={r.resolution_method}
                  mono
                />
                <Field label="recording.resolved_at" value={fmt(r.resolved_at)} />
                <Field label="recording.last_error" value={r.last_error ?? '—'} />
              </div>
              <Field
                label="recording.expected_title"
                value={r.expected_title ?? '—'}
                block
              />
              {r.video_url && (
                <Button asChild size="sm" variant="outline" className="mt-1">
                  <a href={r.video_url} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    Abrir video en YouTube
                  </a>
                </Button>
              )}
            </>
          ) : (
            <p className="text-muted-foreground text-xs">Sin grabación registrada.</p>
          )}
        </div>
      </div>
    </SectionShell>
  );
}

// ── 6. Procesamiento IA ────────────────────────────────────────────────────
function Section6ProcesamientoIA({
  session,
  onRequestTranscription,
  onRequestChatbot,
}: {
  session: PeruSession;
  onRequestTranscription: (id: string) => void;
  onRequestChatbot: (id: string) => void;
}) {
  const tState = session.transcription_state ?? 'no_solicitada';
  const cState = session.chatbot_state ?? 'no_solicitado';
  const r = session.recording;

  return (
    <SectionShell
      title="Procesamiento IA"
      icon={<Sparkles className="h-3.5 w-3.5" />}
    >
      <div className="space-y-5">
        {/* Transcripción */}
        <div className="rounded-md border border-border/40 bg-card/40 p-3 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Solicitar transcripción
            </h3>
            <TranscriptionChip state={tState} />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <Field
              label="transcription_status"
              value={r?.transcription_status ?? tState}
              mono
            />
            <Field
              label="transcription_tier"
              value={(r as any)?.transcription_tier ?? '—'}
              mono
            />
            <Field
              label="transcription_chars"
              value={(r as any)?.transcription_chars ?? '—'}
              mono
            />
            <Field label="transcribed_at" value={fmt((r as any)?.transcribed_at)} />
          </div>

          {tState === 'no_solicitada' && (
            <div className="space-y-2 pt-1">
              <div className="rounded-md border border-primary/30 bg-primary/5 p-2.5 text-[11px] text-foreground/85 leading-relaxed">
                <strong className="text-primary">Importante:</strong> al solicitar la transcripción
                también se genera el <strong>enrichment regulatorio</strong> (etiquetas, impacto, áreas
                afectadas, comentario y próximo paso) en un solo acto. No es necesario pedirlo al chatbot.
              </div>
              <p className="text-xs text-muted-foreground">
                Tiempo estimado: ~20 minutos.
              </p>
              <Button size="sm" onClick={() => onRequestTranscription(session.id)}>
                Solicitar transcripción + enrichment
              </Button>
            </div>
          )}

          {(tState === 'en_cola' || tState === 'procesando') && (
            <div className="flex items-center gap-2 text-sm text-primary">
              <Loader2 className="h-4 w-4 animate-spin" />
              {tState === 'en_cola' ? 'En cola · ~20 min' : 'Procesando · ~20 min'}
            </div>
          )}

          {tState === 'lista' && (
            <div className="flex items-center gap-2 text-sm text-success pt-1">
              <CheckCircle2 className="h-4 w-4" />
              Transcripción lista — disponible en la pestaña <strong>Transcripción</strong>.
            </div>
          )}
        </div>

        {/* Habilitar para chatbot global */}
        <div className="rounded-md border border-border/40 bg-card/40 p-3 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Habilitar para chatbot global
            </h3>
            <ChatbotChip state={cState} />
          </div>

          <p className="text-xs text-muted-foreground">
            El asistente de Sesiones es <strong>global</strong>: responde sobre todas
            las alertas habilitadas. Habilita esta sesión para que el chatbot pueda
            leer su metadata, agenda y transcripción cuando esté disponible.
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
    </SectionShell>
  );
}

// ── helpers ─────────────────────────────────────────────────────────────────
function SectionShell({
  title,
  icon,
  hint,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2">
        {icon && <span className="text-primary">{icon}</span>}
        <h4 className="text-xs uppercase tracking-wide text-foreground font-semibold">
          {title}
        </h4>
      </div>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      <div className="rounded-lg border border-border/50 bg-card/40 p-4 space-y-3">
        {children}
      </div>
    </section>
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
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground/80">
        {label}
      </div>
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
        <div
          className={
            mono
              ? 'text-xs font-mono text-foreground/85 break-all'
              : 'text-xs text-foreground/90 break-words'
          }
        >
          {v}
        </div>
      )}
    </div>
  );
}

function fmt(date?: string | null): string | undefined {
  if (!date) return undefined;
  try {
    return format(new Date(date), 'd MMM yyyy · HH:mm', { locale: es });
  } catch {
    return date;
  }
}
