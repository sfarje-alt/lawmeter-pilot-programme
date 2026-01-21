// Session Q&A Panel - Ask questions about session transcription

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Send, 
  Loader2, 
  Sparkles, 
  HelpCircle,
  BookOpen,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PeruSession, SessionAnalysis } from '@/types/peruSessions';

interface QAMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface SessionQAPanelProps {
  session: PeruSession;
  analysis: SessionAnalysis | null;
  transcription: string | null;
  mode: 'summary' | 'qa';
  onModeChange: (mode: 'summary' | 'qa') => void;
}

const EXAMPLE_QUESTIONS = [
  "¿Qué dijo el presidente de la comisión sobre la propuesta?",
  "¿Cuáles fueron los puntos principales de debate?",
  "¿Qué posición tomó el representante del ministerio?",
  "¿Hubo alguna mención sobre regulaciones de seguridad?",
  "¿Cuáles fueron las conclusiones de la sesión?",
];

export function SessionQAPanel({
  session,
  analysis,
  transcription,
  mode,
  onModeChange,
}: SessionQAPanelProps) {
  const [messages, setMessages] = useState<QAMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendQuestion = useCallback(async (question?: string) => {
    const questionToSend = question || inputValue.trim();
    if (!questionToSend || !transcription) return;

    const userMessage: QAMessage = { role: 'user', content: questionToSend };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('session-qa', {
        body: {
          question: questionToSend,
          transcription,
          commissionName: session.commission_name,
          sessionTitle: session.session_title,
          sessionDate: session.scheduled_at,
          previousMessages: messages,
        },
      });

      if (error) throw error;

      const assistantMessage: QAMessage = { 
        role: 'assistant', 
        content: data.answer || 'No se pudo obtener una respuesta.' 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error asking question:', error);
      toast({
        title: "Error",
        description: "No se pudo procesar la pregunta. Intenta de nuevo.",
        variant: "destructive",
      });
      // Remove the user message if error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, transcription, session, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuestion();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const hasTranscription = !!transcription;

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-lg w-fit">
        <Button
          variant={mode === 'summary' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onModeChange('summary')}
          className="gap-2"
        >
          <BookOpen className="h-4 w-4" />
          Resumen
        </Button>
        <Button
          variant={mode === 'qa' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onModeChange('qa')}
          className="gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          Preguntas
        </Button>
      </div>

      {/* Summary Mode */}
      {mode === 'summary' && analysis && (
        <Card className="bg-gradient-to-br from-purple-500/5 to-indigo-500/5 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              Resumen Ejecutivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground">{analysis.executiveSummary}</p>
          </CardContent>
        </Card>
      )}

      {mode === 'summary' && !analysis && (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <Sparkles className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">
              No hay análisis disponible. Ejecuta el análisis de AI primero.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Q&A Mode */}
      {mode === 'qa' && (
        <div className="space-y-4">
          {!hasTranscription ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center">
                <HelpCircle className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                  No hay transcripción disponible. Ejecuta el análisis de AI primero para generar la transcripción.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Example Questions */}
              {messages.length === 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Ejemplos de preguntas:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {EXAMPLE_QUESTIONS.map((q, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendQuestion(q)}
                        className="text-xs"
                        disabled={isLoading}
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              {messages.length > 0 && (
                <Card>
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm">Conversación</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearChat}
                      className="text-muted-foreground"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Limpiar
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-4">
                        {messages.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`flex ${
                              msg.role === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg px-3 py-2 ${
                                msg.role === 'user'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex justify-start">
                            <div className="bg-muted rounded-lg px-3 py-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Escribe tu pregunta sobre la sesión..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={() => handleSendQuestion()}
                  disabled={!inputValue.trim() || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
