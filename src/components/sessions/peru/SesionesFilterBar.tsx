// Filtros y chips rápidos para el workspace de Sesiones.

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import type { PeruSession } from '@/types/peruSessions';
import { useMemo } from 'react';

export interface SesionesFilters {
  search: string;
  commission: string;       // '' = todas
  dateRange: 'all' | '7d' | '15d' | '30d';
  aiState: 'all' | 'idle' | 'processing' | 'ready';
  editorial: 'all' | 'nueva' | 'pineada' | 'en_seguimiento' | 'archivada';
  tag: string;              // '' = todas
  impact: 'all' | 'bajo' | 'medio' | 'medio_alto' | 'alto';
  onlyPinned: boolean;
  onlyFollowUp: boolean;
}

export const DEFAULT_FILTERS: SesionesFilters = {
  search: '',
  commission: '',
  dateRange: 'all',
  aiState: 'all',
  editorial: 'all',
  tag: '',
  impact: 'all',
  onlyPinned: false,
  onlyFollowUp: false,
};

interface Props {
  filters: SesionesFilters;
  onChange: (next: SesionesFilters) => void;
  sessions: PeruSession[];
}

export function SesionesFilterBar({ filters, onChange, sessions }: Props) {
  const commissions = useMemo(() => {
    return Array.from(new Set(sessions.map((s) => s.commission_name))).sort();
  }, [sessions]);

  const tags = useMemo(() => {
    return Array.from(
      new Set(
        sessions
          .map((s) => s.etiqueta_ia)
          .filter((x): x is string => !!x),
      ),
    ).sort();
  }, [sessions]);

  const update = <K extends keyof SesionesFilters>(key: K, value: SesionesFilters[K]) =>
    onChange({ ...filters, [key]: value });

  const reset = () => onChange(DEFAULT_FILTERS);

  const activeChips = [
    filters.search && `"${filters.search}"`,
    filters.commission,
    filters.dateRange !== 'all' && `Últimos ${filters.dateRange.replace('d', ' días')}`,
    filters.aiState !== 'all' && `IA: ${filters.aiState}`,
    filters.editorial !== 'all' && `Editorial: ${filters.editorial}`,
    filters.tag,
    filters.impact !== 'all' && `Impacto: ${filters.impact}`,
    filters.onlyPinned && 'Solo pineadas',
    filters.onlyFollowUp && 'Solo seguimiento',
  ].filter(Boolean);

  return (
    <div className="space-y-3">
      {/* Línea principal */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(e) => update('search', e.target.value)}
            placeholder="Buscar por comisión, ítem o tema…"
            className="pl-8 bg-card/40 border-border/60"
          />
        </div>

        <Select value={filters.commission || 'all'} onValueChange={(v) => update('commission', v === 'all' ? '' : v)}>
          <SelectTrigger className="w-[200px] bg-card/40 border-border/60">
            <SelectValue placeholder="Comisión" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las comisiones</SelectItem>
            {commissions.map((c) => (
              <SelectItem key={c} value={c}>
                {c.length > 40 ? `${c.slice(0, 40)}…` : c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.dateRange} onValueChange={(v) => update('dateRange', v as SesionesFilters['dateRange'])}>
          <SelectTrigger className="w-[150px] bg-card/40 border-border/60">
            <SelectValue placeholder="Fecha" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todo el período</SelectItem>
            <SelectItem value="7d">Últimos 7 días</SelectItem>
            <SelectItem value="15d">Últimos 15 días</SelectItem>
            <SelectItem value="30d">Últimos 30 días</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.aiState} onValueChange={(v) => update('aiState', v as SesionesFilters['aiState'])}>
          <SelectTrigger className="w-[150px] bg-card/40 border-border/60">
            <SelectValue placeholder="Estado IA" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Estado IA</SelectItem>
            <SelectItem value="idle">No solicitada</SelectItem>
            <SelectItem value="processing">Procesando</SelectItem>
            <SelectItem value="ready">Lista</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.editorial} onValueChange={(v) => update('editorial', v as SesionesFilters['editorial'])}>
          <SelectTrigger className="w-[170px] bg-card/40 border-border/60">
            <SelectValue placeholder="Estado editorial" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Editorial</SelectItem>
            <SelectItem value="nueva">Nuevas</SelectItem>
            <SelectItem value="pineada">Pineadas</SelectItem>
            <SelectItem value="en_seguimiento">En seguimiento</SelectItem>
            <SelectItem value="archivada">Archivadas</SelectItem>
          </SelectContent>
        </Select>

        {tags.length > 0 && (
          <Select value={filters.tag || 'all'} onValueChange={(v) => update('tag', v === 'all' ? '' : v)}>
            <SelectTrigger className="w-[180px] bg-card/40 border-border/60">
              <SelectValue placeholder="Etiqueta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las etiquetas</SelectItem>
              {tags.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select value={filters.impact} onValueChange={(v) => update('impact', v as SesionesFilters['impact'])}>
          <SelectTrigger className="w-[150px] bg-card/40 border-border/60">
            <SelectValue placeholder="Impacto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Impacto</SelectItem>
            <SelectItem value="bajo">Bajo</SelectItem>
            <SelectItem value="medio">Medio</SelectItem>
            <SelectItem value="medio_alto">Medio-alto</SelectItem>
            <SelectItem value="alto">Alto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Chips rápidos */}
      <div className="flex flex-wrap items-center gap-2">
        {(['7d', '15d', '30d'] as const).map((d) => (
          <Button
            key={d}
            size="sm"
            variant={filters.dateRange === d ? 'default' : 'outline'}
            className="h-7 text-xs"
            onClick={() => update('dateRange', filters.dateRange === d ? 'all' : d)}
          >
            Últimos {d.replace('d', ' días')}
          </Button>
        ))}
        <Button
          size="sm"
          variant={filters.onlyPinned ? 'default' : 'outline'}
          className="h-7 text-xs"
          onClick={() => update('onlyPinned', !filters.onlyPinned)}
        >
          Solo pineadas
        </Button>
        <Button
          size="sm"
          variant={filters.onlyFollowUp ? 'default' : 'outline'}
          className="h-7 text-xs"
          onClick={() => update('onlyFollowUp', !filters.onlyFollowUp)}
        >
          Solo seguimiento
        </Button>

        {activeChips.length > 0 && (
          <Button size="sm" variant="ghost" className="h-7 text-xs ml-auto" onClick={reset}>
            <X className="h-3 w-3 mr-1" />
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );
}

// Aplica filtros a la lista
export function applySesionesFilters(
  sessions: PeruSession[],
  filters: SesionesFilters,
): PeruSession[] {
  const now = Date.now();
  const days =
    filters.dateRange === '7d' ? 7 : filters.dateRange === '15d' ? 15 : filters.dateRange === '30d' ? 30 : null;

  return sessions.filter((s) => {
    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const hay = [
        s.commission_name,
        s.session_title,
        s.etiqueta_ia,
        s.agenda_item?.title,
        s.agenda_item?.thematic_area,
        ...(s.agenda_item?.bill_numbers ?? []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }

    if (filters.commission && s.commission_name !== filters.commission) return false;

    if (days != null) {
      if (!s.scheduled_at) return false;
      const ts = new Date(s.scheduled_at).getTime();
      const diff = (now - ts) / (1000 * 60 * 60 * 24);
      if (Math.abs(diff) > days) return false;
    }

    if (filters.aiState !== 'all') {
      const t = s.transcription_state ?? 'no_solicitada';
      const c = s.chatbot_state ?? 'no_solicitado';
      const isProcessing = ['en_cola', 'procesando'].includes(t) || ['en_cola', 'procesando'].includes(c);
      const isReady = t === 'lista' || c === 'listo';
      if (filters.aiState === 'processing' && !isProcessing) return false;
      if (filters.aiState === 'ready' && !isReady) return false;
      if (filters.aiState === 'idle' && (isProcessing || isReady)) return false;
    }

    if (filters.editorial !== 'all') {
      if ((s.editorial_state ?? 'nueva') !== filters.editorial) return false;
    }

    if (filters.tag && s.etiqueta_ia !== filters.tag) return false;
    if (filters.impact !== 'all' && s.impact_level !== filters.impact) return false;
    if (filters.onlyPinned && !s.is_pinned) return false;
    if (filters.onlyFollowUp && !s.is_follow_up) return false;

    return true;
  });
}
