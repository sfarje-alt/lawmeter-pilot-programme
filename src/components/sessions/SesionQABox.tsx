// Q&A box for analyzed sessions — uses transcript context.
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Sesion } from "@/hooks/useSesiones";
import { useAICredits } from "@/hooks/useAICredits";

interface QAMessage {
  role: "user" | "assistant";
  content: string;
  credits?: number;
}

interface Props {
  sesion: Sesion;
}

const EXAMPLES = [
  "¿Cuáles fueron los puntos principales de debate?",
  "¿Qué se dijo sobre el sector iGaming?",
  "¿Hubo alguna mención sobre regulación tributaria?",
];

export function SesionQABox({ sesion }: Props) {
  const { balance } = useAICredits();
  const [messages, setMessages] = useState<QAMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const transcript = sesion.transcript_excerpt;
  const hasTranscript = !!transcript;
  const insufficient = balance < 1;

  const send = useCallback(
    async (q?: string) => {
      const question = (q ?? input).trim();
      if (!question || !transcript) return;
      if (insufficient) {
        toast.error("Créditos insuficientes", {
          description: "Necesitas al menos 1 crédito para hacer una pregunta.",
        });
        return;
      }

      const userMsg: QAMessage = { role: "user", content: question };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);

      try {
        const { data, error } = await supabase.functions.invoke("session-qa", {
          body: {
            question,
            transcription: transcript,
            commissionName: sesion.commission_name,
            sessionTitle: sesion.session_title,
            sessionDate: sesion.scheduled_at,
            previousMessages: messages,
            organizationId: sesion.organization_id,
            clientId: sesion.client_id,
            sessionExternalId: sesion.external_id,
          },
        });

        if (error) throw error;
        if (data?.error) throw new Error(data.error);

        const credits = data?.creditsUsed ?? 1;
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data?.answer ?? "No se pudo obtener respuesta.",
            credits,
          },
        ]);
        toast.success(`${credits} crédito${credits > 1 ? "s" : ""} consumido${credits > 1 ? "s" : ""}`, {
          description: `Saldo restante: ${data?.newBalance ?? "—"}`,
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Error desconocido";
        toast.error("No se pudo procesar", { description: msg });
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setLoading(false);
      }
    },
    [input, transcript, sesion, messages, insufficient],
  );

  if (!hasTranscript) {
    return (
      <div className="rounded-lg border border-dashed p-4 text-center">
        <p className="text-sm text-muted-foreground">
          No hay transcripción disponible para hacer preguntas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-semibold">Preguntas sobre la sesión</h4>
        <span className="ml-auto text-xs text-muted-foreground">
          1–3 créditos por pregunta
        </span>
      </div>

      {messages.length === 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Ejemplos:
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((q, i) => (
              <Button
                key={i}
                size="sm"
                variant="outline"
                className="text-xs h-auto py-1.5"
                onClick={() => send(q)}
                disabled={loading || insufficient}
              >
                {q}
              </Button>
            ))}
          </div>
        </div>
      )}

      {messages.length > 0 && (
        <ScrollArea className="h-[260px] rounded-lg border bg-muted/20 p-3">
          <div className="space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  {m.credits && (
                    <p className="text-[10px] opacity-70 mt-1">
                      {m.credits} crédito{m.credits > 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-card border rounded-lg px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      )}

      <div className="flex gap-2">
        <Input
          placeholder={
            insufficient
              ? "Sin créditos disponibles"
              : "Escribe tu pregunta sobre la sesión…"
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          disabled={loading || insufficient}
        />
        <Button
          size="icon"
          onClick={() => send()}
          disabled={!input.trim() || loading || insufficient}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
