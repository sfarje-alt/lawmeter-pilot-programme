import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { logAIUsage, estimateTokens, calculateCost } from "../_shared/aiUsageLogger.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const MODEL = "google/gemini-2.5-flash-lite";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { currentKeywords, sector, description, partialInput, clientId, organizationId } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an expert in Peruvian regulatory compliance and legislative monitoring.
Given context about a company, suggest relevant regulatory keywords to monitor.

Keywords should be:
- Specific terms that would appear in legislation, decrees, resolutions
- Names of regulatory bodies (DIGEMID, SBS, SMV, SUNAT, INDECOPI, OSINERGMIN, etc.)
- Industry-specific regulatory terms
- Legal concepts relevant to the business

Return ONLY a JSON array of suggested keywords. Max 10 suggestions.
Example: ["medicamentos", "DIGEMID", "registro sanitario", "farmacovigilancia"]`;

    const userContext = `
Sector: ${sector || 'Not specified'}
Description: ${description || 'Not specified'}
Current keywords: ${currentKeywords?.join(', ') || 'None yet'}
${partialInput ? `User is typing: "${partialInput}"` : ''}

Suggest relevant regulatory keywords${partialInput ? ` related to "${partialInput}"` : ''}.`;

    const inputTokens = estimateTokens(systemPrompt + userContext);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContext }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded', suggestions: [] }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI request failed: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || '[]';
    
    const outputTokens = estimateTokens(content);
    const estimatedCost = calculateCost(MODEL, inputTokens, outputTokens);

    // Log AI usage
    await logAIUsage({
      clientId,
      organizationId,
      functionName: "suggest-keywords",
      modelUsed: MODEL,
      inputTokens,
      outputTokens,
      estimatedCost,
      metadata: {
        sector,
        currentKeywordsCount: currentKeywords?.length || 0,
        hasPartialInput: !!partialInput,
      },
    });

    let suggestions: string[] = [];
    try {
      // Try to parse as JSON
      const parsed = JSON.parse(content.replace(/```json\n?|\n?```/g, '').trim());
      suggestions = Array.isArray(parsed) ? parsed : [];
    } catch {
      // If parsing fails, try to extract keywords from text
      const matches = content.match(/"([^"]+)"/g);
      if (matches) {
        suggestions = matches.map((m: string) => m.replace(/"/g, ''));
      }
    }

    // Filter out already selected keywords
    const filtered = suggestions
      .filter((s: string) => !currentKeywords?.includes(s))
      .slice(0, 10);

    return new Response(
      JSON.stringify({ suggestions: filtered }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error suggesting keywords:', error);
    return new Response(
      JSON.stringify({ suggestions: [], error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
