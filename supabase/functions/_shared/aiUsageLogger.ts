import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface UsageLogParams {
  clientId?: string;
  organizationId?: string;
  userId?: string;
  functionName: string;
  modelUsed: string;
  inputTokens?: number;
  outputTokens?: number;
  estimatedCost?: number;
  metadata?: Record<string, unknown>;
}

// Cost estimates per model (per 1K tokens)
const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  "google/gemini-2.5-flash": { input: 0.00001875, output: 0.000075 },
  "google/gemini-2.5-flash-lite": { input: 0.000009, output: 0.0000375 },
  "google/gemini-3-flash-preview": { input: 0.00001875, output: 0.000075 },
  "google/gemini-2.5-pro": { input: 0.0001875, output: 0.00075 },
};

export function estimateTokens(text: string): number {
  // Rough estimate: ~4 characters per token for Spanish/English text
  return Math.ceil(text.length / 4);
}

export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const costs = MODEL_COSTS[model] || MODEL_COSTS["google/gemini-2.5-flash"];
  return (inputTokens / 1000) * costs.input + (outputTokens / 1000) * costs.output;
}

export async function logAIUsage(params: UsageLogParams): Promise<void> {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn("AI Usage Logger: Missing Supabase credentials");
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabase.from("ai_usage_logs").insert({
      client_id: params.clientId || null,
      organization_id: params.organizationId || null,
      user_id: params.userId || null,
      function_name: params.functionName,
      model_used: params.modelUsed,
      input_tokens: params.inputTokens || null,
      output_tokens: params.outputTokens || null,
      estimated_cost: params.estimatedCost || null,
      metadata: params.metadata || {},
    });

    if (error) {
      console.error("AI Usage Logger: Failed to log usage:", error.message);
    } else {
      console.log(`AI Usage logged: ${params.functionName} (${params.modelUsed})`);
    }
  } catch (err) {
    console.error("AI Usage Logger: Unexpected error:", err);
  }
}
