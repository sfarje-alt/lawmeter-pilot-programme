import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { logAIUsage, estimateTokens, calculateCost } from "../_shared/aiUsageLogger.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const MODEL = "google/gemini-2.5-flash";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentText, documentType, clientId, organizationId } = await req.json();

    if (!documentText) {
      return new Response(
        JSON.stringify({ error: 'Document text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an expert legal and business analyst specializing in Peruvian regulatory compliance.
Your task is to analyze company documents and extract relevant information for setting up regulatory monitoring.

Based on the document provided, extract:
1. **Keywords**: Relevant regulatory keywords, industry terms, regulatory bodies, legal concepts that should be monitored. These should be specific terms that would appear in legislation affecting this company.
2. **Sector**: The primary business sector and any secondary sectors.
3. **Products/Services**: Key products or services the company offers.
4. **Regulatory Context**: Brief description of the company's regulatory exposure.
5. **Suggested Exclusions**: Terms that might appear but are NOT relevant to monitor.

Return your analysis as valid JSON with this exact structure:
{
  "keywords": ["keyword1", "keyword2", ...],
  "suggestedSector": "Primary Sector Name",
  "secondarySectors": ["Sector1", "Sector2"],
  "productsServices": [{"name": "Product 1", "description": "Brief description"}],
  "regulatoryContext": "Brief description of regulatory exposure",
  "suggestedExclusions": ["exclusion1", "exclusion2"],
  "confidence": "high" | "medium" | "low"
}

Focus on Peruvian regulatory context. Include keywords for relevant regulators (DIGEMID, SBS, SMV, SUNAT, INDECOPI, etc.) if applicable.`;

    const userContent = `Document type: ${documentType || 'Unknown'}\n\nDocument content:\n${documentText.substring(0, 15000)}`;
    const inputTokens = estimateTokens(systemPrompt + userContent);

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
          { role: 'user', content: userContent }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'document_analysis',
            schema: {
              type: 'object',
              properties: {
                keywords: { type: 'array', items: { type: 'string' } },
                suggestedSector: { type: 'string' },
                secondarySectors: { type: 'array', items: { type: 'string' } },
                productsServices: { 
                  type: 'array', 
                  items: { 
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      description: { type: 'string' }
                    }
                  }
                },
                regulatoryContext: { type: 'string' },
                suggestedExclusions: { type: 'array', items: { type: 'string' } },
                confidence: { type: 'string', enum: ['high', 'medium', 'low'] }
              },
              required: ['keywords', 'confidence']
            }
          }
        }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI request failed: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    const outputTokens = estimateTokens(content || '');
    const estimatedCost = calculateCost(MODEL, inputTokens, outputTokens);

    // Log AI usage
    await logAIUsage({
      clientId,
      organizationId,
      functionName: "analyze-client-document",
      modelUsed: MODEL,
      inputTokens,
      outputTokens,
      estimatedCost,
      metadata: {
        documentType,
        documentLength: documentText.length,
      },
    });

    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch {
      // If JSON parsing fails, return a basic structure
      analysis = {
        keywords: [],
        confidence: 'low',
        error: 'Failed to parse AI response'
      };
    }

    console.log('Document analysis completed:', { 
      keywordsCount: analysis.keywords?.length,
      confidence: analysis.confidence 
    });

    return new Response(
      JSON.stringify({ success: true, analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error analyzing document:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
