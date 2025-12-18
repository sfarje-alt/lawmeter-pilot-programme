import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are an expert analyst for a company that manufactures and sells smart kettles and espresso machines globally. Your role is to analyze legislative session transcriptions and identify content relevant to this business.

Focus areas for the client:
1. Product Safety regulations (electrical, thermal, mechanical)
2. Radio/RF regulations (WiFi, Bluetooth connectivity)
3. Cybersecurity requirements (IoT security, data protection)
4. Energy efficiency standards
5. Food contact material regulations
6. Consumer protection laws
7. Import/export regulations
8. Environmental/eco-design requirements

Analyze the transcription and provide a structured JSON response with:
- Overall relevance score (0-100)
- Executive summary
- Key topics discussed and their relevance
- Specific regulatory mentions with implications
- Recommended action items
- Speaker sentiments on key issues`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transcriptionText, commissionName, sessionTitle, sessionDate } = await req.json();

    if (!transcriptionText) {
      throw new Error('Transcription text is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`Analyzing session: ${commissionName} - ${sessionTitle || 'No title'}`);
    console.log(`Transcription length: ${transcriptionText.length} characters`);

    // Truncate very long transcriptions to stay within token limits
    const maxChars = 50000;
    const truncatedText = transcriptionText.length > maxChars 
      ? transcriptionText.substring(0, maxChars) + '...[truncated]'
      : transcriptionText;

    const userPrompt = `Analyze the following legislative session transcription from the Peru Congress.

Commission: ${commissionName}
Session Title: ${sessionTitle || 'Not specified'}
Date: ${sessionDate || 'Not specified'}

TRANSCRIPTION:
${truncatedText}

Provide your analysis in the following JSON format:
{
  "relevanceScore": <number 0-100>,
  "relevanceCategory": "<High|Medium|Low|None>",
  "executiveSummary": "<2-3 sentence summary>",
  "keyTopics": [
    {
      "topic": "<topic name>",
      "relevance": "<Direct|Indirect|None>",
      "details": "<explanation>"
    }
  ],
  "regulatoryMentions": [
    {
      "type": "<Product Safety|Cybersecurity|Radio/RF|Energy|Food Contact|Consumer Protection|Environmental|Import/Export|Other>",
      "quote": "<relevant quote from transcription>",
      "implication": "<what this means for the client>"
    }
  ],
  "actionItems": ["<recommended follow-up action>"],
  "speakerSentiments": [
    {
      "speaker": "<speaker name or role if identifiable>",
      "position": "<Supportive|Opposed|Neutral>",
      "keyStatement": "<notable statement>"
    }
  ],
  "clientImpact": {
    "productSafety": "<impact assessment>",
    "radioRegulations": "<impact assessment>",
    "cybersecurity": "<impact assessment>",
    "energyEfficiency": "<impact assessment>",
    "overallAssessment": "<summary of overall impact on smart kitchen appliances>"
  }
}

Return ONLY valid JSON, no markdown or other text.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0]?.message?.content;

    if (!analysisText) {
      throw new Error('No analysis returned from AI');
    }

    // Parse the JSON response
    let analysis;
    try {
      // Clean up the response - remove markdown code blocks if present
      let cleanedText = analysisText.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\n?/, '').replace(/\n?```$/, '');
      }
      analysis = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', analysisText);
      // Return a structured error response
      analysis = {
        relevanceScore: 0,
        relevanceCategory: 'None',
        executiveSummary: 'Analysis could not be completed. The AI response was not properly formatted.',
        keyTopics: [],
        regulatoryMentions: [],
        actionItems: ['Review transcription manually'],
        speakerSentiments: [],
        clientImpact: {
          productSafety: 'Unable to assess',
          radioRegulations: 'Unable to assess',
          cybersecurity: 'Unable to assess',
          energyEfficiency: 'Unable to assess',
          overallAssessment: 'Manual review required'
        },
        rawResponse: analysisText
      };
    }

    console.log(`Analysis complete. Relevance score: ${analysis.relevanceScore}`);

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error analyzing transcript:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      analysis: null 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
