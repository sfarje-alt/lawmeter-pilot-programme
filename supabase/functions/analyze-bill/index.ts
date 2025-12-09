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
    const { billTextUrl, billTitle, policyArea } = await req.json();
    
    if (!billTextUrl && !billTitle) {
      return new Response(
        JSON.stringify({ error: "billTextUrl or billTitle is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let billText = "";
    let textCharCount = 0;

    // Fetch bill text from Congress.gov (server-side, no CORS issues)
    if (billTextUrl) {
      console.log(`Fetching bill text from: ${billTextUrl}`);
      try {
        const textResponse = await fetch(billTextUrl);
        if (textResponse.ok) {
          billText = await textResponse.text();
          // Clean HTML tags if present
          billText = billText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
          textCharCount = billText.length;
          console.log(`Successfully fetched ${textCharCount} characters from bill text`);
        } else {
          console.warn(`Failed to fetch bill text: ${textResponse.status}`);
        }
      } catch (fetchError) {
        console.error("Error fetching bill text:", fetchError);
      }
    }

    if (!billText) {
      console.log("No bill text available, using title only");
      billText = billTitle;
      textCharCount = 0;
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

const systemPrompt = `You are a legislative risk analyst for a company that manufactures smart kettles and espresso machines. Analyze the given legislation and provide:
1. A risk score from 0-100 (where 100 is highest risk for a smart kitchen appliance manufacturer)
2. A risk category: "Critical", "Urgent", "High", "Medium", "Low", or "Minimal"
3. A detailed explanation of why this legislation poses that level of risk
4. Key stakeholders who would be affected (companies, industries, groups)
5. A 3-line card summary for quick scanning

Risk Categories:
- Critical (90-100): Immediate existential threat to operations
- Urgent (80-89): Time-sensitive major operational threat
- High (60-79): Significant operational or financial impact
- Medium (40-59): Moderate impact requiring attention
- Low (20-39): Minor impact or indirect effects
- Minimal (0-19): No significant impact

Consider impacts on:
- Product safety regulations (electrical, thermal, mechanical)
- Radio/RF emissions and wireless connectivity (WiFi, Bluetooth)
- Food contact materials and chemical safety
- Battery regulations (for cordless devices)
- Cybersecurity requirements for IoT/connected devices
- Energy efficiency and eco-design standards
- Labeling and certification requirements

Respond ONLY with valid JSON in this exact format:
{
  "riskScore": <number 0-100>,
  "riskCategory": "<Critical|Urgent|High|Medium|Low|Minimal>",
  "explanation": "<detailed explanation>",
  "cardSummary": {
    "whatChanges": "<1 sentence max 80 chars: what this legislation changes or requires>",
    "whoImpacted": "<1 sentence max 80 chars: who is affected - sectors, entities, activities>",
    "keyDeadline": "<1 sentence max 80 chars: next milestone, deadline, or effective date>"
  },
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

    // Add metadata about the analysis
    const result = {
      ...analysis,
      metadata: {
        textCharCount,
        usedFullText: textCharCount > 0
      }
    };

    return new Response(
      JSON.stringify(result),
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
