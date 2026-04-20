// Chatbot global persistente para el workspace de Sesiones.
// Lee SOLO de las alertas habilitadas (chatbot_state === 'listo').
// Responde a partir de metadata + agenda + transcripción cuando exista.
// Es UI prototipo: las respuestas son simuladas a partir de los campos source-backed.

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
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

const SUGGESTED = [
  '¿Qué proyectos están en agenda?',
  '¿Qué sesiones tienen transcripción lista?',
  'Resumen de los ítems de la sesión',
];

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

  return (
    <div className="fixed bottom-4 right-4 z-40 w-[360px] max-w-[calc(100vw-2rem)]">
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
            {/* Helper */}
            <div className="px-4 py-2 bg-muted/30 border-b border-border/50">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Responde solo a partir de las alertas habilitadas. Las respuestas
                mejoran cuando existe transcripción cargada.
              </p>
            </div>

            {/* Mensajes */}
            <ScrollArea className="h-[280px]">
              <div className="p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="space-y-3">
                    {enabled.length === 0 ? (
                      <div className="rounded-md border border-dashed border-border/60 bg-muted/20 p-4 text-center text-xs text-muted-foreground">
                        <MessageSquare className="h-5 w-5 mx-auto mb-2 opacity-50" />
                        No hay alertas habilitadas para chatbot.
                        <br />
                        Habilita una desde la pestaña <strong>IA</strong> de cualquier sesión.
                      </div>
                    ) : (
                      <>
                        <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
                          Sugerencias
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {SUGGESTED.map((s) => (
                            <button
                              key={s}
                              onClick={() => send(s)}
                              className="text-[11px] px-2 py-1 rounded-md border border-border/60 bg-background/40 hover:bg-primary/10 hover:border-primary/40 transition-colors"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </>
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

            {enabled.length > 0 && (
              <div className="px-3 py-2 border-t border-border/50 bg-muted/20">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
                  Alertas habilitadas
                </div>
                <div className="flex flex-wrap gap-1">
                  {enabled.map((s) => (
                    <Badge
                      key={s.id}
                      variant="outline"
                      className="text-[10px] font-mono border-border/60"
                    >
                      Ítem {s.agenda_item?.item_number ?? '—'}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
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
    return 'No hay alertas habilitadas para chatbot. Habilita al menos una sesión desde su pestaña IA.';
  }

  const q = question.toLowerCase();
  const lines: string[] = [];

  if (q.includes('proyecto') || q.includes('bill')) {
    const bills = new Set<string>();
    enabled.forEach((s) => s.agenda_item?.bill_numbers?.forEach((b) => bills.add(b)));
    if (bills.size === 0) return 'Las alertas habilitadas no tienen proyectos vinculados en su agenda.';
    lines.push('Proyectos vinculados a las alertas habilitadas:');
    bills.forEach((b) => lines.push(`• ${b}`));
    return lines.join('\n');
  }

  if (q.includes('transcripción') || q.includes('transcripcion')) {
    if (withTranscript.length === 0) {
      return 'Ninguna alerta habilitada tiene transcripción cargada en este momento.';
    }
    lines.push(`${withTranscript.length} alerta(s) con transcripción lista:`);
    withTranscript.forEach((s) =>
      lines.push(`• Ítem ${s.agenda_item?.item_number ?? '—'} — ${s.commission_name}`),
    );
    return lines.join('\n');
  }

  if (q.includes('resumen') || q.includes('agenda') || q.includes('item') || q.includes('ítem')) {
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

  // Respuesta por defecto: enumerar contexto disponible
  lines.push(
    `Tengo contexto de ${enabled.length} alerta(s) habilitada(s)` +
      (withTranscript.length > 0
        ? ` y ${withTranscript.length} con transcripción cargada.`
        : '. Aún no hay transcripciones cargadas.'),
  );
  lines.push('');
  lines.push(
    'Puedo responder sobre: ítems de agenda, proyectos vinculados, comisión, fechas y estado de transcripción/chatbot.',
  );
  return lines.join('\n');
}
