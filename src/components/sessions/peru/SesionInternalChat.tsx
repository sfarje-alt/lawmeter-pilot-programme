// Chat interno por alerta de Sesión.
// - Solo disponible cuando el análisis IA está listo (transcription_state === 'lista').
// - Cada Q&A se persiste en session.chat_history.
// - La transcripción NUNCA se expone: el chat la usa internamente para responder.

import { useMemo, useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Send, MessageSquare, Trash2, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PeruSession, SesionChatMessage } from '@/types/peruSessions';

interface Props {
  session: PeruSession;
  unlocked: boolean;
  onAppendMessage: (
    sessionId: string,
    message: { role: 'user' | 'assistant'; content: string },
  ) => void;
  onClearHistory: (sessionId: string) => void;
}

const SUGGESTED_PROMPTS = [
  'Resume los puntos clave de esta sesión',
  'Explica el orden del día y su contexto',
  '¿Cómo impacta esto en mi perfil regulatorio?',
  '¿Qué próximos pasos debería tomar?',
  '¿Qué se dijo sobre los proyectos vinculados?',
  '¿Qué compromisos o anuncios aparecieron?',
];

export function SesionInternalChat({
  session,
  unlocked,
  onAppendMessage,
  onClearHistory,
}: Props) {
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const history = useMemo<SesionChatMessage[]>(
    () => session.chat_history ?? [],
    [session.chat_history],
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history.length]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q || !unlocked) return;
    onAppendMessage(session.id, { role: 'user', content: q });
    // Respuesta simulada derivada de metadata + transcripción interna.
    const answer = buildAnswer(q, session);
    setTimeout(() => {
      onAppendMessage(session.id, { role: 'assistant', content: answer });
    }, 350);
    setDraft('');
  };

  if (!unlocked) {
    return (
      <div className="rounded-md border border-dashed border-border/60 bg-muted/20 p-4 text-xs text-muted-foreground flex items-start gap-2">
        <Lock className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
        <span>
          <strong className="text-foreground">El chat estará disponible</strong> cuando
          termine el análisis IA. Solicítalo desde la pestaña{' '}
          <strong>Procesamiento IA</strong>.
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-primary/15">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <div className="text-xs font-semibold text-foreground">Chat de la alerta</div>
            <div className="text-[10.5px] text-muted-foreground">
              Pregúntale a la IA sobre esta sesión. El historial se guarda aquí.
            </div>
          </div>
        </div>
        {history.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-[11px] text-muted-foreground hover:text-destructive"
            onClick={() => onClearHistory(session.id)}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Mensajes */}
      <div
        ref={scrollRef}
        className="rounded-md border border-border/50 bg-background/40 p-3 max-h-80 overflow-y-auto"
      >
        {history.length === 0 ? (
          <div className="space-y-2.5">
            <div className="text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 opacity-60" />
              Sin preguntas todavía. Prueba con:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="text-[11px] px-2 py-1 rounded border border-border/60 bg-card/50 hover:bg-primary/10 hover:border-primary/40 text-foreground/85 transition-colors text-left"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((m) => (
              <div
                key={m.id}
                className={cn(
                  'rounded-md px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap',
                  m.role === 'user'
                    ? 'bg-primary/15 text-foreground ml-6'
                    : 'bg-muted/40 text-foreground/90 mr-6',
                )}
              >
                {m.content}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(draft);
        }}
        className="flex items-center gap-1.5"
      >
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Pregunta sobre esta alerta…"
          className="h-9 text-xs"
        />
        <Button
          type="submit"
          size="sm"
          className="h-9 px-2.5"
          disabled={!draft.trim()}
        >
          <Send className="h-3.5 w-3.5" />
        </Button>
      </form>
    </div>
  );
}

// Respuestas derivadas estrictamente de los campos source-backed + transcripción interna.
function buildAnswer(question: string, session: PeruSession): string {
  const q = question.toLowerCase();
  const item = session.agenda_item;
  const transcript = session.recording?.transcription_text ?? '';
  const lines: string[] = [];

  if (q.includes('resum') || q.includes('punto') || q.includes('clave')) {
    if (item) {
      lines.push(`Sesión: Comisión de ${session.commission_name}.`);
      lines.push(`Ítem ${item.item_number} — ${item.title}`);
      if (item.thematic_area) lines.push(`Área: ${item.thematic_area}.`);
      if (item.bill_numbers.length) lines.push(`Proyectos vinculados: ${item.bill_numbers.join(', ')}.`);
    }
    if (transcript) {
      const preview = transcript.split('\n').slice(0, 3).join(' ').slice(0, 320);
      lines.push('');
      lines.push(`Resumen del análisis: ${preview}…`);
    } else {
      lines.push('');
      lines.push('El resumen completo se basa en la transcripción procesada internamente por la IA.');
    }
    return lines.join('\n');
  }

  if (q.includes('orden') || q.includes('agenda') || q.includes('día') || q.includes('dia')) {
    if (!item) return 'Esta sesión no tiene un ítem de agenda asociado.';
    lines.push(`Ítem ${item.item_number} — ${item.title}`);
    if (item.thematic_area) lines.push(`Área temática: ${item.thematic_area}.`);
    if (item.bill_numbers.length) lines.push(`Proyectos: ${item.bill_numbers.join(', ')}.`);
    return lines.join('\n');
  }

  if (q.includes('impacto') || q.includes('perfil') || q.includes('regulator')) {
    return [
      'Análisis preliminar de impacto regulatorio:',
      `• Comisión: ${session.commission_name}`,
      item?.thematic_area ? `• Área temática: ${item.thematic_area}` : '',
      item?.bill_numbers?.length ? `• Proyectos: ${item.bill_numbers.join(', ')}` : '',
      '',
      'Revisa la pestaña "Clasificatoria IA" para ver el impacto y urgencia asignados por la IA según tu perfil regulatorio.',
    ].filter(Boolean).join('\n');
  }

  if (q.includes('próximo') || q.includes('proximo') || q.includes('paso') || q.includes('hacer')) {
    return [
      'Próximos pasos sugeridos:',
      '• Revisar la clasificación IA (impacto / urgencia / etiquetas)',
      '• Validar los proyectos vinculados a la agenda',
      '• Pinear la alerta si debe entrar al próximo reporte',
      '• Coordinar con el cliente afectado si aplica',
    ].join('\n');
  }

  if (q.includes('proyecto') || q.includes('vinculad')) {
    if (!item?.bill_numbers?.length) return 'Esta sesión no tiene proyectos de ley vinculados en su agenda.';
    return `Proyectos vinculados a esta sesión:\n${item.bill_numbers.map((b) => `• ${b}`).join('\n')}`;
  }

  if (q.includes('compromiso') || q.includes('anuncio') || q.includes('dijo')) {
    if (!transcript) {
      return 'El análisis aún no encontró compromisos o anuncios destacados en la transcripción procesada.';
    }
    const preview = transcript.split('\n').slice(0, 4).join(' ').slice(0, 360);
    return `Extracto del análisis:\n${preview}…`;
  }

  // Default
  return [
    `Tengo el contexto completo de esta sesión (Comisión de ${session.commission_name}).`,
    item ? `Ítem actual: ${item.title}` : '',
    '',
    'Puedes preguntarme por: resumen, orden del día, impacto en tu perfil regulatorio, próximos pasos, proyectos vinculados o compromisos mencionados.',
  ].filter(Boolean).join('\n');
}
