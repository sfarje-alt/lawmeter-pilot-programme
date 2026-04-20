// Chips reutilizables para el workspace de Sesiones.
// Todos los colores usan tokens semánticos (tailwind.config.ts).

import { cn } from '@/lib/utils';
import { Loader2, CheckCircle2, AlertTriangle, Circle, Clock } from 'lucide-react';
import type {
  SesionAgendaState,
  SesionChatbotState,
  SesionEditorialState,
  SesionImpactLevel,
  SesionRiskLevel,
  SesionTranscriptionState,
  SesionUrgencyLevel,
  SesionVideoState,
} from '@/types/peruSessions';

// ── Estado editorial ────────────────────────────────────────────────────────
const EDITORIAL_LABELS: Record<SesionEditorialState, string> = {
  nueva: 'Nueva',
  en_revision: 'En revisión',
  pineada: 'Pineada',
  en_seguimiento: 'En seguimiento',
  archivada: 'Archivada',
};

const EDITORIAL_CLASSES: Record<SesionEditorialState, string> = {
  nueva: 'bg-muted/40 text-muted-foreground border-border',
  en_revision: 'bg-primary/10 text-primary border-primary/30',
  pineada: 'bg-primary text-primary-foreground border-transparent',
  en_seguimiento: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  archivada: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
};

export function EditorialChip({ state }: { state: SesionEditorialState }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border',
        EDITORIAL_CLASSES[state],
      )}
    >
      {EDITORIAL_LABELS[state]}
    </span>
  );
}

// ── Estado de proceso (agenda / video / transcripción / chatbot) ──────────────
type ProcessTone = 'idle' | 'queue' | 'processing' | 'ready' | 'error';

const TONE_CLASSES: Record<ProcessTone, string> = {
  idle: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  queue: 'bg-slate-500/15 text-slate-200 border-slate-500/40',
  processing: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
  ready: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  error: 'bg-destructive/15 text-destructive border-destructive/40',
};

function ProcessChip({
  label,
  tone,
  prefix,
}: {
  label: string;
  tone: ProcessTone;
  prefix?: string;
}) {
  const Icon =
    tone === 'processing'
      ? Loader2
      : tone === 'ready'
        ? CheckCircle2
        : tone === 'error'
          ? AlertTriangle
          : tone === 'queue'
            ? Clock
            : Circle;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border',
        TONE_CLASSES[tone],
      )}
    >
      <Icon className={cn('h-3 w-3', tone === 'processing' && 'animate-spin')} />
      {prefix && <span className="opacity-70">{prefix}:</span>}
      <span>{label}</span>
    </span>
  );
}

export function AgendaChip({ state }: { state: SesionAgendaState }) {
  const map: Record<SesionAgendaState, { label: string; tone: ProcessTone }> = {
    lista: { label: 'Agenda lista', tone: 'ready' },
    pendiente: { label: 'Agenda pendiente', tone: 'queue' },
    error: { label: 'Error agenda', tone: 'error' },
  };
  const m = map[state];
  return <ProcessChip label={m.label} tone={m.tone} />;
}

export function VideoChip({ state }: { state: SesionVideoState }) {
  const map: Record<SesionVideoState, { label: string; tone: ProcessTone }> = {
    vinculado: { label: 'Video vinculado', tone: 'ready' },
    pendiente: { label: 'Video pendiente', tone: 'queue' },
    error: { label: 'Error video', tone: 'error' },
  };
  const m = map[state];
  return <ProcessChip label={m.label} tone={m.tone} />;
}

export function TranscriptionChip({ state }: { state: SesionTranscriptionState }) {
  const map: Record<SesionTranscriptionState, { label: string; tone: ProcessTone }> = {
    no_solicitada: { label: 'No solicitada', tone: 'idle' },
    en_cola: { label: 'En cola', tone: 'queue' },
    procesando: { label: 'Procesando', tone: 'processing' },
    lista: { label: 'Lista', tone: 'ready' },
    error: { label: 'Error', tone: 'error' },
  };
  const m = map[state];
  return <ProcessChip prefix="Transcripción" label={m.label} tone={m.tone} />;
}

export function ChatbotChip({ state }: { state: SesionChatbotState }) {
  const map: Record<SesionChatbotState, { label: string; tone: ProcessTone }> = {
    no_solicitado: { label: 'No solicitado', tone: 'idle' },
    en_cola: { label: 'En cola', tone: 'queue' },
    procesando: { label: 'Procesando', tone: 'processing' },
    listo: { label: 'Listo', tone: 'ready' },
    error: { label: 'Error', tone: 'error' },
  };
  const m = map[state];
  return <ProcessChip prefix="Chatbot" label={m.label} tone={m.tone} />;
}

// ── Riesgo / Urgencia / Impacto ─────────────────────────────────────────────
export function RiskChip({ level }: { level: SesionRiskLevel }) {
  const cls =
    level === 'alto'
      ? 'bg-destructive/15 text-destructive border-destructive/40'
      : level === 'medio'
        ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
        : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40';
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border', cls)}>
      Riesgo: {level === 'alto' ? 'Alto' : level === 'medio' ? 'Medio' : 'Bajo'}
    </span>
  );
}

export function UrgencyChip({ level }: { level: SesionUrgencyLevel }) {
  const cls =
    level === 'alta'
      ? 'bg-destructive/15 text-destructive border-destructive/40'
      : level === 'media'
        ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
        : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40';
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border', cls)}>
      Urgencia: {level === 'alta' ? 'Alta' : level === 'media' ? 'Media' : 'Baja'}
    </span>
  );
}

export function ImpactChip({ level }: { level: SesionImpactLevel }) {
  const cls =
    level === 'alto'
      ? 'bg-destructive/20 text-destructive border-destructive/50'
      : level === 'medio_alto'
        ? 'bg-orange-500/15 text-orange-300 border-orange-500/40'
        : level === 'medio'
          ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
          : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40';
  const label =
    level === 'alto'
      ? 'Alto'
      : level === 'medio_alto'
        ? 'Medio-alto'
        : level === 'medio'
          ? 'Medio'
          : 'Bajo';
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border', cls)}>
      Impacto: {label}
    </span>
  );
}

export function EtiquetaIAChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border bg-primary/10 text-primary border-primary/30">
      🏷 {label}
    </span>
  );
}
