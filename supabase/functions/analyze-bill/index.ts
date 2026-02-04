import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { logAIUsage, estimateTokens, calculateCost } from "../_shared/aiUsageLogger.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MODEL = "google/gemini-2.5-flash";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      billTextUrl, 
      billTitle, 
      policyArea,
      // Enhanced context fields
      legislativeSubjects,
      sponsors,
      cosponsorCount,
      latestAction,
      originChamber,
      introducedDate,
      crsSummary,
      committees,
      billStage,
      // Usage tracking
      clientId,
      organizationId
    } = await req.json();
    
    if (!billTitle) {
      return new Response(
        JSON.stringify({ error: "billTitle is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let billText = "";
    let textCharCount = 0;
    let usedFullText = false;
    let usedCRSSummary = false;

    // Try to fetch full bill text first (highest quality)
    if (billTextUrl) {
      console.log(`Fetching bill text from: ${billTextUrl}`);
      try {
        const textResponse = await fetch(billTextUrl);
        if (textResponse.ok) {
          billText = await textResponse.text();
          billText = billText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
          textCharCount = billText.length;
          usedFullText = textCharCount > 500; // Only count as full text if substantial
          console.log(`Successfully fetched ${textCharCount} characters from bill text`);
        } else {
          console.warn(`Failed to fetch bill text: ${textResponse.status}`);
        }
      } catch (fetchError) {
        console.error("Error fetching bill text:", fetchError);
      }
    }

    // Fall back to CRS summary if no full text (second highest quality)
    if (!usedFullText && crsSummary) {
      console.log("Using CRS summary for analysis");
      billText = crsSummary;
      textCharCount = crsSummary.length;
      usedCRSSummary = true;
    }

    // Build context string from all available metadata
    const contextParts: string[] = [];
    
    if (legislativeSubjects && legislativeSubjects.length > 0) {
      contextParts.push(`Legislative Subjects: ${legislativeSubjects.map((s: any) => s.name || s).join(", ")}`);
    }
    
    if (sponsors && sponsors.length > 0) {
      const sponsorInfo = sponsors.map((s: any) => 
        `${s.fullName || s.name} (${s.party}-${s.state})`
      ).join(", ");
      contextParts.push(`Sponsors: ${sponsorInfo}`);
      
      // Analyze bipartisan support
      const parties = new Set(sponsors.map((s: any) => s.party));
      if (parties.size > 1) {
        contextParts.push("Bipartisan Support: Yes");
      }
    }
    
    if (cosponsorCount !== undefined) {
      contextParts.push(`Number of Cosponsors: ${cosponsorCount}`);
    }
    
    if (originChamber) {
      contextParts.push(`Origin Chamber: ${originChamber}`);
    }
    
    if (introducedDate) {
      contextParts.push(`Introduced: ${introducedDate}`);
    }
    
    if (latestAction) {
      contextParts.push(`Latest Action (${latestAction.actionDate}): ${latestAction.text}`);
    }
    
    if (billStage) {
      contextParts.push(`Current Stage: ${billStage}`);
    }
    
    if (committees && committees.length > 0) {
      const committeeNames = committees.map((c: any) => c.name || c).join(", ");
      contextParts.push(`Committees: ${committeeNames}`);
    }

    const additionalContext = contextParts.join("\n");

    // Determine confidence level
    let confidenceLevel: "high" | "medium" | "low" = "low";
    if (usedFullText) {
      confidenceLevel = "high";
    } else if (usedCRSSummary) {
      confidenceLevel = "medium";
    } else if (contextParts.length >= 3) {
      confidenceLevel = "low"; // At least we have some metadata
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Adjust system prompt based on available data
    const analysisMode = usedFullText 
      ? "FULL TEXT MODE: You have access to the complete bill text. Provide a thorough analysis."
      : usedCRSSummary 
        ? "SUMMARY MODE: You have the official CRS summary. Provide a solid analysis based on this authoritative summary."
        : "METADATA MODE: You only have bill metadata (title, subjects, sponsors). Provide a best-effort analysis with appropriate caveats about limited information.";

const systemPrompt = `You are a legislative risk analyst for a company that manufactures smart kettles and espresso machines. 

${analysisMode}

Analyze the given legislation and provide:
1. A risk score from 0-100 (where 100 is highest risk for a smart kitchen appliance manufacturer)
2. A risk category: "Critical", "Urgent", "High", "Medium", "Low", or "Minimal"
3. A detailed explanation of why this legislation poses that level of risk
4. Key stakeholders who would be affected (companies, industries, groups)
5. A 3-line card summary for quick scanning - MUST include relevant dates

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

${!usedFullText && !usedCRSSummary ? `
IMPORTANT - LIMITED DATA WARNING:
Since you only have metadata, be conservative in your assessment:
- Clearly state in your explanation that this is a preliminary analysis
- Use phrases like "Based on available metadata..." or "Pending full text review..."
- If the legislative subjects or title suggest potential relevance, note what additional review would be needed
` : ''}

IMPORTANT: The keyDeadline field MUST include specific dates when available. Use formats like:
- "Effective since Jan 15, 2025" for enacted legislation
- "Compliance required by Mar 1, 2025" for items with deadlines
- "Expected vote by Q2 2025" for pipeline items
- "Introduced Dec 2024 - timeline pending" when no deadline exists

Respond ONLY with valid JSON in this exact format:
{
  "riskScore": <number 0-100>,
  "riskCategory": "<Critical|Urgent|High|Medium|Low|Minimal>",
  "explanation": "<detailed explanation>",
  "cardSummary": {
    "whatChanges": "<1 sentence max 80 chars: what this legislation changes or requires>",
    "whoImpacted": "<1 sentence max 80 chars: who is affected - sectors, entities, activities>",
    "keyDeadline": "<1 sentence max 80 chars: MUST include specific date - effective date, deadline, or expected timeline>"
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

    // Build user prompt with all available information
    let userPrompt = `Bill Title: ${billTitle}
Policy Area: ${policyArea || "Not specified"}`;

    if (additionalContext) {
      userPrompt += `\n\nAdditional Context:\n${additionalContext}`;
    }

    if (billText) {
      const source = usedFullText ? "Bill Text" : usedCRSSummary ? "CRS Summary" : "Content";
      userPrompt += `\n\n${source}:\n${billText.substring(0, 8000)}`;
    }

    console.log(`Analysis mode: ${confidenceLevel}, usedFullText: ${usedFullText}, usedCRSSummary: ${usedCRSSummary}`);

    const inputTokens = estimateTokens(systemPrompt + userPrompt);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
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

    const outputTokens = estimateTokens(content);
    const estimatedCost = calculateCost(MODEL, inputTokens, outputTokens);

    // Log AI usage
    await logAIUsage({
      clientId,
      organizationId,
      functionName: "analyze-bill",
      modelUsed: MODEL,
      inputTokens,
      outputTokens,
      estimatedCost,
      metadata: {
        billTitle,
        policyArea,
        textCharCount,
        usedFullText,
        usedCRSSummary,
        confidenceLevel,
      },
    });

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
        usedFullText,
        usedCRSSummary,
        confidenceLevel,
        contextFieldsUsed: contextParts.length
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
