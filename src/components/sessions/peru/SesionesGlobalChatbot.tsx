// Chatbot global persistente para el workspace de Sesiones.
// Lee SOLO de las alertas habilitadas (chatbot_state === 'listo').
// Responde a partir de metadata + agenda + transcripción cuando exista.
// IMPORTANTE: el enrichment se genera junto con la transcripción (un solo acto),
// por lo que NO es responsabilidad del chatbot. El chatbot solo ayuda a
// interpretar lo que ya está cargado: agenda, transcripción y estado.
// Panel redimensionable (ancho + alto) por el usuario.

import { useState, useMemo, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  GripHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PeruSession } from '@/types/peruSessions';

interface Props {
  sessions: PeruSession[];
  onInteraction?: (sessionId: string, snippet: string) => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Prompts agrupados por intención. Sin tab "Enrichment": el enrichment se
// genera con la transcripción, no se pide al chatbot.
const PROMPTS = {
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

const MIN_W = 360;
const MAX_W = 880;
const MIN_H = 280;
const MAX_H = 720;

export function SesionesGlobalChatbot({ sessions, onInteraction }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Tamaño persistente
  const [size, setSize] = useState<{ w: number; h: number }>(() => {
    try {
      const raw = localStorage.getItem('sesiones-chatbot-size');
      if (raw) return JSON.parse(raw);
    } catch {}
    return { w: 520, h: 520 };
  });
  useEffect(() => {
    try {
      localStorage.setItem('sesiones-chatbot-size', JSON.stringify(size));
    } catch {}
  }, [size]);

  // Resizers
  const startRef = useRef<{ x: number; y: number; w: number; h: number } | null>(null);
  const cornerRef = useRef<HTMLDivElement>(null);
  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    startRef.current = { x: e.clientX, y: e.clientY, w: size.w, h: size.h };
    const onMove = (ev: MouseEvent) => {
      const s = startRef.current;
      if (!s) return;
      // Crece hacia arriba/izquierda (panel anclado en bottom-right)
      const nextW = Math.min(MAX_W, Math.max(MIN_W, s.w + (s.x - ev.clientX)));
      const nextH = Math.min(MAX_H, Math.max(MIN_H, s.h + (s.y - ev.clientY)));
      setSize({ w: nextW, h: nextH });
    };
    const onUp = () => {
      startRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

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
    const answer = buildAnswer(q, enabled, withTranscript);
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: q },
      { role: 'assistant', content: answer },
    ]);
    setDraft('');
    // Acumular el intercambio en el chatbot_summary de cada sesión habilitada,
    // para que el reporte y el tab "Clasificatoria IA" reflejen el análisis vivo.
    if (onInteraction) {
      const stamp = new Date().toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' });
      const snippet = `[${stamp}] P: ${q}\nR: ${answer}`;
      enabled.forEach((s) => onInteraction(s.id, snippet));
    }
  };

  const renderPromptGroup = (label: string, list: string[]) => (
    <div className="space-y-1.5">
      <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {list.map((p) => (
          <button
            key={p}
            onClick={() => send(p)}
            className="text-xs px-2.5 py-1.5 rounded-md border border-border/60 bg-background/40 hover:bg-primary/10 hover:border-primary/40 transition-colors text-left"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );

  // Cuando está cerrado se reduce a la barra del header
  const collapsedH = 56;
  const panelStyle = open
    ? { width: `${size.w}px`, height: `${size.h}px` }
    : { width: '380px', height: `${collapsedH}px` };

  return (
    <div
      className="fixed bottom-4 right-4 z-40 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]"
      style={panelStyle}
    >
      <Card className="bg-card/95 backdrop-blur border-border/60 shadow-xl overflow-hidden h-full flex flex-col relative">
        {/* Resizer en la esquina superior izquierda (crece hacia arriba/izquierda) */}
        {open && (
          <div
            ref={cornerRef}
            onMouseDown={startResize}
            title="Arrastra para redimensionar"
            className="absolute top-0 left-0 z-20 w-5 h-5 cursor-nwse-resize flex items-center justify-center group"
          >
            <GripHorizontal className="h-3 w-3 text-muted-foreground/60 group-hover:text-primary rotate-45" />
          </div>
        )}

        {/* Header */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-primary/10 hover:bg-primary/15 transition-colors shrink-0"
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
          <div className="flex-1 min-h-0 flex flex-col border-t border-border/50">
            {/* Helper / scope */}
            <div className="px-4 py-2 bg-muted/30 border-b border-border/50 space-y-1 shrink-0">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Responde a partir de las alertas habilitadas (agenda + transcripción).
                <span className="block text-[10.5px] text-muted-foreground/80">
                  El enrichment regulatorio se genera junto con la transcripción y no se pide aquí.
                </span>
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

            {/* Mensajes (ocupan todo el alto restante) */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="p-3 space-y-3">
                {messages.length === 0 && (
                  <div className="space-y-3">
                    {enabled.length === 0 ? (
                      <div className="rounded-md border border-dashed border-border/60 bg-muted/20 p-4 text-center text-xs text-muted-foreground">
                        <MessageSquare className="h-5 w-5 mx-auto mb-2 opacity-50" />
                        No hay alertas habilitadas para chatbot.
                        <br />
                        Habilita una desde la pestaña{' '}
                        <strong>Procesamiento IA</strong> del detalle de la alerta.
                      </div>
                    ) : (
                      <Tabs defaultValue="transcription">
                        <TabsList className="grid grid-cols-3 h-7 bg-muted/40">
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
                      'rounded-md px-3 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
                      m.role === 'user'
                        ? 'bg-primary/15 text-foreground ml-8'
                        : 'bg-muted/40 text-foreground/90 mr-8',
                    )}
                  >
                    {m.content}
                  </div>
                ))}
              </div>
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(draft);
              }}
              className="flex items-center gap-1.5 p-2 border-t border-border/50 bg-background/60 shrink-0"
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
                className="h-9 text-sm"
              />
              <Button
                type="submit"
                size="sm"
                className="h-9 px-2.5"
                disabled={enabled.length === 0 || !draft.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </Card>
    </div>
  );
}

// Prototipo: respuestas derivadas estrictamente de los campos source-backed.
// Sin enrichment: si el usuario pide etiquetas/impacto/comentarios, se le
// redirige a solicitar la transcripción (que ya genera el enrichment).
function buildAnswer(
  question: string,
  enabled: PeruSession[],
  withTranscript: PeruSession[],
): string {
  if (enabled.length === 0) {
    return 'No hay alertas habilitadas para chatbot. Habilítalas desde la pestaña Procesamiento IA del detalle de cada alerta.';
  }

  const q = question.toLowerCase();
  const lines: string[] = [];

  // Redirección: el enrichment NO se pide al chatbot
  const isEnrichmentAsk =
    q.includes('etiqueta') ||
    q.includes('label') ||
    q.includes('clasifi') ||
    q.includes('impacto') ||
    q.includes('regulatorio') ||
    q.includes('área') ||
    q.includes('areas') ||
    q.includes('próximo') ||
    q.includes('proximo') ||
    q.includes('paso') ||
    q.includes('comentario');

  if (isEnrichmentAsk) {
    return [
      'El enrichment regulatorio (etiquetas, impacto, áreas afectadas, comentario, próximo paso)',
      'se genera automáticamente junto con la transcripción, en un solo acto.',
      '',
      'Aquí no se solicita: pídelo desde la pestaña "Procesamiento IA" → "Solicitar transcripción".',
      'Cuando la transcripción esté lista, los campos de enrichment aparecerán completados en la alerta.',
    ].join('\n');
  }

  // Transcription
  if (
    q.includes('transcripción') ||
    q.includes('transcripcion') ||
    q.includes('resumir') ||
    q.includes('compromiso') ||
    q.includes('punto') ||
    q.includes('proyecto') ||
    q.includes('anuncio')
  ) {
    if (withTranscript.length === 0) {
      return 'Ninguna alerta habilitada tiene transcripción cargada en este momento. Solicítala desde la pestaña Procesamiento IA.';
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
  if (
    q.includes('agenda') ||
    q.includes('orden') ||
    q.includes('ítem') ||
    q.includes('item') ||
    q.includes('explicar') ||
    q.includes('actuación') ||
    q.includes('actuacion')
  ) {
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
  if (q.includes('habilitad') || q.includes('listas') || q.includes('estado') || q.includes('comparar')) {
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
    'Puedo ayudar con: transcripción, orden del día y estado de las alertas. El enrichment se entrega junto con la transcripción.',
  );
  return lines.join('\n');
}
