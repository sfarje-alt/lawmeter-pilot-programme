// Chatbot global persistente para el workspace de Sesiones.
// Lee SOLO de las alertas habilitadas (chatbot_state === 'listo').
// Responde a partir de metadata + agenda + transcripción cuando exista.
// Ofrece quick prompts para enrichment, transcripción y agenda.
// Es UI prototipo: respuestas derivadas estrictamente de campos source-backed.

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import {
  Sparkles,
  Send,
  ChevronDown,
  ChevronUp,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PeruSession } from '@/types/peruSessions';

interface Props {
  sessions: PeruSession[];
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Prompts agrupados por intención
const PROMPTS = {
  enrichment: [
    'Sugerir etiquetas para esta alerta',
    'Agregar etiquetas internas',
    'Proponer impacto regulatorio',
    'Sugerir áreas afectadas',
    'Redactar comentario regulatorio',
    'Sugerir próximo paso',
  ],
  transcription: [
    'Resumir la transcripción',
    'Extraer puntos clave de la transcripción',
    '¿Qué se dijo sobre el proyecto?',
    '¿Qué compromisos o anuncios aparecen?',
  ],
  agenda: [
    'Explicar este punto del orden del día',
    '¿Qué proyectos están vinculados a este ítem?',
    'Comparar este ítem con otros del orden del día',
    '¿Qué tipo de actuación parlamentaria es esta?',
  ],
  scope: [
    '¿Qué alertas están habilitadas para chatbot?',
    '¿Qué alertas ya están listas para usar con IA?',
    'Comparar las alertas habilitadas',
    'Resumir todas las alertas listas',
  ],
};

export function SesionesGlobalChatbot({ sessions }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const enabled = useMemo(
    () => sessions.filter((s) => s.chatbot_state === 'listo' && !s.is_archived),
    [sessions],
  );
  const withTranscript = useMemo(
    () =>
      enabled.filter(
        (s) => s.transcription_state === 'lista' && !!s.recording?.transcription_text,
      ),
    [enabled],
  );

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: q },
      { role: 'assistant', content: buildAnswer(q, enabled, withTranscript) },
    ]);
    setDraft('');
  };

  const renderPromptGroup = (label: string, list: string[]) => (
    <div className="space-y-1.5">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <div className="flex flex-wrap gap-1">
        {list.map((p) => (
          <button
            key={p}
            onClick={() => send(p)}
            className="text-[10.5px] px-2 py-1 rounded-md border border-border/60 bg-background/40 hover:bg-primary/10 hover:border-primary/40 transition-colors text-left"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed bottom-4 right-4 z-40 w-[380px] max-w-[calc(100vw-2rem)]">
      <Card className="bg-card/95 backdrop-blur border-border/60 shadow-xl overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-primary/10 hover:bg-primary/15 transition-colors"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded-md bg-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div className="text-left min-w-0">
              <div className="text-sm font-semibold text-foreground truncate">
                Asistente de Sesiones
              </div>
              <div className="text-[11px] text-muted-foreground truncate">
                {enabled.length} {enabled.length === 1 ? 'alerta habilitada' : 'alertas habilitadas'}
                {withTranscript.length > 0 &&
                  ` · ${withTranscript.length} con transcripción`}
              </div>
            </div>
          </div>
          {open ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
          ) : (
            <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
          )}
        </button>

        {open && (
          <div className="border-t border-border/50">
            {/* Helper / scope */}
            <div className="px-4 py-2 bg-muted/30 border-b border-border/50 space-y-1">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Responde solo a partir de las alertas habilitadas. Mejora cuando hay
                transcripción cargada.
              </p>
              {enabled.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {enabled.map((s) => (
                    <Badge
                      key={s.id}
                      variant="outline"
                      className="text-[10px] font-mono border-border/60"
                      title={
                        s.transcription_state === 'lista'
                          ? 'con transcripción'
                          : 'solo metadata + agenda'
                      }
                    >
                      Ítem {s.agenda_item?.item_number ?? '—'}
                      {s.transcription_state === 'lista' ? ' · T' : ''}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Mensajes */}
            <ScrollArea className="h-[300px]">
              <div className="p-3 space-y-3">
                {messages.length === 0 && (
                  <div className="space-y-3">
                    {enabled.length === 0 ? (
                      <div className="rounded-md border border-dashed border-border/60 bg-muted/20 p-4 text-center text-xs text-muted-foreground">
                        <MessageSquare className="h-5 w-5 mx-auto mb-2 opacity-50" />
                        No hay alertas habilitadas para chatbot.
                        <br />
                        Habilita una desde la sección{' '}
                        <strong>Procesamiento IA</strong>.
                      </div>
                    ) : (
                      <Tabs defaultValue="enrichment">
                        <TabsList className="grid grid-cols-4 h-7 bg-muted/40">
                          <TabsTrigger value="enrichment" className="text-[10px] px-1">
                            Enrichment
                          </TabsTrigger>
                          <TabsTrigger value="transcription" className="text-[10px] px-1">
                            Transcripción
                          </TabsTrigger>
                          <TabsTrigger value="agenda" className="text-[10px] px-1">
                            Agenda
                          </TabsTrigger>
                          <TabsTrigger value="scope" className="text-[10px] px-1">
                            Alertas
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="enrichment" className="mt-2">
                          {renderPromptGroup('Para enriquecer la alerta', PROMPTS.enrichment)}
                        </TabsContent>
                        <TabsContent value="transcription" className="mt-2">
                          {renderPromptGroup('Sobre la transcripción', PROMPTS.transcription)}
                        </TabsContent>
                        <TabsContent value="agenda" className="mt-2">
                          {renderPromptGroup('Sobre el orden del día', PROMPTS.agenda)}
                        </TabsContent>
                        <TabsContent value="scope" className="mt-2">
                          {renderPromptGroup('Estado de las alertas', PROMPTS.scope)}
                        </TabsContent>
                      </Tabs>
                    )}
                  </div>
                )}

                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={cn(
                      'rounded-md px-3 py-2 text-xs whitespace-pre-wrap',
                      m.role === 'user'
                        ? 'bg-primary/15 text-foreground ml-8'
                        : 'bg-muted/40 text-foreground/90 mr-8',
                    )}
                  >
                    {m.content}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(draft);
              }}
              className="flex items-center gap-1.5 p-2 border-t border-border/50 bg-background/60"
            >
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={
                  enabled.length === 0
                    ? 'Habilita al menos una alerta…'
                    : 'Pregunta sobre las sesiones habilitadas…'
                }
                disabled={enabled.length === 0}
                className="h-8 text-xs"
              />
              <Button
                type="submit"
                size="sm"
                className="h-8 px-2"
                disabled={enabled.length === 0 || !draft.trim()}
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          </div>
        )}
      </Card>
    </div>
  );
}

// Prototipo: respuestas derivadas estrictamente de los campos source-backed.
function buildAnswer(
  question: string,
  enabled: PeruSession[],
  withTranscript: PeruSession[],
): string {
  if (enabled.length === 0) {
    return 'No hay alertas habilitadas para chatbot. Habilita al menos una sesión desde su sección de Procesamiento IA.';
  }

  const q = question.toLowerCase();
  const lines: string[] = [];

  // Enrichment helpers
  if (q.includes('etiqueta') || q.includes('label') || q.includes('clasifi')) {
    lines.push('Etiquetas sugeridas a partir de la agenda source-backed:');
    enabled.forEach((s) => {
      const it = s.agenda_item;
      if (!it) return;
      const tags = [it.thematic_area, ...(it.bill_numbers ?? [])].filter(Boolean);
      lines.push(`• Ítem ${it.item_number} → ${tags.join(' · ')}`);
    });
    lines.push('');
    lines.push(
      'Sugerencia: tipos de actuación (Debate, Votación, Predictamen, Presentación) se infieren del título del ítem.',
    );
    return lines.join('\n');
  }

  if (q.includes('impacto') || q.includes('regulatorio')) {
    return [
      'No puedo inferir impacto regulatorio sin enrichment cargado.',
      '',
      'Lo que sí está disponible para apoyar el análisis:',
      ...enabled.map(
        (s) =>
          `• Ítem ${s.agenda_item?.item_number ?? '—'} · ${s.agenda_item?.thematic_area ?? '—'} · proyectos: ${s.agenda_item?.bill_numbers?.join(', ') || '—'}`,
      ),
    ].join('\n');
  }

  if (q.includes('área') || q.includes('areas')) {
    const areas = new Set<string>();
    enabled.forEach((s) => s.agenda_item?.thematic_area && areas.add(s.agenda_item.thematic_area));
    if (areas.size === 0) return 'Sin áreas temáticas en las alertas habilitadas.';
    lines.push('Áreas temáticas presentes en las alertas habilitadas:');
    areas.forEach((a) => lines.push(`• ${a}`));
    return lines.join('\n');
  }

  if (q.includes('próximo') || q.includes('proximo') || q.includes('paso') || q.includes('comentario')) {
    return [
      'Sugerencia editorial basada en estado actual:',
      ...enabled.map((s) => {
        const t = s.transcription_state ?? 'no_solicitada';
        const action =
          t === 'lista'
            ? 'revisar la transcripción y redactar comentario regulatorio'
            : t === 'procesando' || t === 'en_cola'
              ? 'esperar la transcripción para enriquecer'
              : 'solicitar transcripción para análisis profundo';
        return `• Ítem ${s.agenda_item?.item_number ?? '—'} → ${action}`;
      }),
    ].join('\n');
  }

  // Transcription
  if (q.includes('transcripción') || q.includes('transcripcion') || q.includes('resumir') || q.includes('compromiso')) {
    if (withTranscript.length === 0) {
      return 'Ninguna alerta habilitada tiene transcripción cargada en este momento.';
    }
    lines.push(`${withTranscript.length} alerta(s) con transcripción lista:`);
    withTranscript.forEach((s) => {
      const it = s.agenda_item;
      lines.push(`• Ítem ${it?.item_number ?? '—'} — ${it?.title ?? ''}`);
      const text = s.recording?.transcription_text ?? '';
      const preview = text.split('\n').slice(0, 2).join(' ').slice(0, 220);
      if (preview) lines.push(`  ${preview}…`);
    });
    return lines.join('\n');
  }

  // Agenda / orden del día
  if (q.includes('agenda') || q.includes('orden') || q.includes('ítem') || q.includes('item') || q.includes('explicar')) {
    lines.push('Ítems de agenda en las alertas habilitadas:');
    enabled.forEach((s) => {
      const it = s.agenda_item;
      if (!it) return;
      lines.push(`• Ítem ${it.item_number} — ${it.title}`);
      if (it.thematic_area) lines.push(`  Área: ${it.thematic_area}`);
      if (it.bill_numbers.length) lines.push(`  Proyectos: ${it.bill_numbers.join(', ')}`);
    });
    return lines.join('\n');
  }

  // Bills
  if (q.includes('proyecto') || q.includes('bill')) {
    const bills = new Set<string>();
    enabled.forEach((s) => s.agenda_item?.bill_numbers?.forEach((b) => bills.add(b)));
    if (bills.size === 0) return 'Las alertas habilitadas no tienen proyectos vinculados en su agenda.';
    lines.push('Proyectos vinculados a las alertas habilitadas:');
    bills.forEach((b) => lines.push(`• ${b}`));
    return lines.join('\n');
  }

  // Scope: qué está habilitado / listo
  if (q.includes('habilitad') || q.includes('listas') || q.includes('estado')) {
    lines.push(
      `${enabled.length} alerta(s) habilitada(s) para chatbot · ${withTranscript.length} con transcripción.`,
    );
    enabled.forEach((s) =>
      lines.push(
        `• Ítem ${s.agenda_item?.item_number ?? '—'} — transcripción: ${s.transcription_state ?? 'no_solicitada'}`,
      ),
    );
    return lines.join('\n');
  }

  // Default
  lines.push(
    `Tengo contexto de ${enabled.length} alerta(s) habilitada(s)` +
      (withTranscript.length > 0
        ? ` y ${withTranscript.length} con transcripción cargada.`
        : '. Aún no hay transcripciones cargadas.'),
  );
  lines.push('');
  lines.push(
    'Puedo ayudar con: enrichment (etiquetas, impacto, comentarios), transcripción, orden del día y estado de las alertas.',
  );
  return lines.join('\n');
}
