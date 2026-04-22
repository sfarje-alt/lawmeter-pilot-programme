import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { logAIUsage, estimateTokens, calculateCost } from "../_shared/aiUsageLogger.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are an expert analyst helping users understand legislative session transcriptions. 
You answer questions about the session content based on the provided transcription.
Always respond in Spanish as the sessions are from the Peruvian Congress.
Be specific and cite relevant parts of the transcription when possible.
If the information requested is not in the transcription, say so clearly.
Keep responses concise but informative.`;

const MODEL = "google/gemini-3-flash-preview";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, transcription, commissionName, sessionTitle, sessionDate, previousMessages, clientId, organizationId } = await req.json();

    if (!question || !transcription) {
      throw new Error('Question and transcription are required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`Q&A for session: ${commissionName} - Question: ${question.substring(0, 50)}...`);

    // Build conversation history
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { 
        role: 'user', 
        content: `Contexto de la sesión:
- Comisión: ${commissionName}
- Título: ${sessionTitle || 'No especificado'}
- Fecha: ${sessionDate || 'No especificada'}

TRANSCRIPCIÓN DE LA SESIÓN:
${transcription.substring(0, 30000)}${transcription.length > 30000 ? '\n...[transcripción truncada por longitud]' : ''}

---
Por favor, responde las preguntas del usuario basándote únicamente en esta transcripción.`
      }
    ];

    // Add previous Q&A messages for context
    if (previousMessages && previousMessages.length > 0) {
      for (const msg of previousMessages) {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      }
    }

    // Add current question
    messages.push({ role: 'user', content: question });

    // Estimate input tokens from all messages
    const inputText = messages.map(m => m.content).join(' ');
    const inputTokens = estimateTokens(inputText);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices[0]?.message?.content;

    if (!answer) {
      throw new Error('No answer returned from AI');
    }

    const outputTokens = estimateTokens(answer);
    const estimatedCost = calculateCost(MODEL, inputTokens, outputTokens);

    // Log AI usage
    await logAIUsage({
      clientId,
      organizationId,
      functionName: "session-qa",
      modelUsed: MODEL,
      inputTokens,
      outputTokens,
      estimatedCost,
      metadata: {
        commissionName,
        questionLength: question.length,
        previousMessagesCount: previousMessages?.length || 0,
      },
    });

    console.log(`Q&A answer received, length: ${answer.length}`);

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in session Q&A:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      answer: null 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
