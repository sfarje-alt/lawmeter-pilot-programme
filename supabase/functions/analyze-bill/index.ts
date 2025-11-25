import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { billText, billTitle, policyArea } = await req.json();
    
    if (!billText) {
      return new Response(
        JSON.stringify({ error: "billText is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a legislative risk analyst for a data center company. Analyze the given US Congress bill and provide:
1. A risk score from 0-100 (where 100 is highest risk for a data center business)
2. A risk category: "Critical", "High", "Medium", or "Low"
3. A detailed explanation of why this bill poses that level of risk to a data center company
4. Key stakeholders who would be affected (companies, industries, groups)

Consider impacts on:
- Energy regulations and costs
- Data privacy and security requirements
- Infrastructure and real estate
- Environmental regulations
- Tax implications
- Technology standards and compliance
- Labor and workforce regulations

Respond ONLY with valid JSON in this exact format:
{
  "riskScore": <number 0-100>,
  "riskCategory": "<Critical|High|Medium|Low>",
  "explanation": "<detailed explanation>",
  "stakeholders": [
    {
      "name": "<stakeholder name>",
      "type": "<Industry|Company|Government|Public>",
      "position": "<Support|Oppose|Neutral>",
      "impact": "<description of how they're affected>"
    }
  ]
}`;

    const userPrompt = `Bill Title: ${billTitle}
Policy Area: ${policyArea || "Not specified"}

Bill Text:
${billText.substring(0, 8000)}`; // Limit to avoid token limits

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits required. Please add funds to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI analysis failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in response");
    }

    const analysis = JSON.parse(jsonMatch[0]);

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-bill:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        details: error instanceof Error ? error.stack : undefined
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
