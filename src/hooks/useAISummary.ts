import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AISummary {
  whatChanges: string;
  whoImpacted: string;
  keyDeadline: string;
  generatedAt: string;
  riskScore: number;
  riskCategory: string;
  comparedToPrevious?: string;
}

interface UseAISummaryResult {
  summary: AISummary | null;
  isGenerating: boolean;
  error: string | null;
  generateSummary: () => Promise<void>;
}

interface CachedSummary {
  summary: AISummary;
  timestamp: number;
  version: number;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_VERSION = 2; // Increment when format changes

export function useAISummary(
  itemId: string,
  title: string,
  billTextUrl?: string,
  policyArea?: string
): UseAISummaryResult {
  const [summary, setSummary] = useState<AISummary | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheKey = `ai_summary_v${CACHE_VERSION}_${itemId}`;

  // Load from cache on mount
  useEffect(() => {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed: CachedSummary = JSON.parse(cached);
        if (
          parsed.version === CACHE_VERSION &&
          Date.now() - parsed.timestamp < CACHE_DURATION
        ) {
          setSummary(parsed.summary);
        }
      } catch {
        localStorage.removeItem(cacheKey);
      }
    }
  }, [cacheKey]);

  const generateSummary = useCallback(async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    setError(null);

    try {
      // Get previous analysis for comparison
      const previousCacheKey = `ai_summary_history_${itemId}`;
      const previousAnalysis = localStorage.getItem(previousCacheKey);
      let previousRiskScore: number | null = null;
      let previousRiskCategory: string | null = null;

      if (previousAnalysis) {
        try {
          const parsed = JSON.parse(previousAnalysis);
          previousRiskScore = parsed.riskScore;
          previousRiskCategory = parsed.riskCategory;
        } catch {
          // Ignore parse errors
        }
      }

      const { data, error: fnError } = await supabase.functions.invoke("analyze-bill", {
        body: {
          billTextUrl,
          billTitle: title,
          policyArea,
          generateSummary: true
        }
      });

      if (fnError) throw fnError;

      if (data && !data.error) {
        // Build comparison message if previous analysis exists
        let comparedToPrevious: string | undefined;
        if (previousRiskScore !== null && previousRiskCategory !== null) {
          if (data.riskScore !== previousRiskScore) {
            const direction = data.riskScore > previousRiskScore ? "increased" : "decreased";
            comparedToPrevious = `Risk ${direction} from ${previousRiskCategory} (${previousRiskScore}) to ${data.riskCategory} (${data.riskScore})`;
          }
        }

        // Extract summary from AI response
        const newSummary: AISummary = {
          whatChanges: data.cardSummary?.whatChanges || extractWhatChanges(data.explanation),
          whoImpacted: data.cardSummary?.whoImpacted || extractWhoImpacted(data.stakeholders, data.explanation),
          keyDeadline: data.cardSummary?.keyDeadline || "Check details for timeline",
          generatedAt: new Date().toISOString(),
          riskScore: data.riskScore,
          riskCategory: data.riskCategory,
          comparedToPrevious
        };

        // Save current as history for next comparison
        localStorage.setItem(previousCacheKey, JSON.stringify({
          riskScore: data.riskScore,
          riskCategory: data.riskCategory,
          timestamp: Date.now()
        }));

        // Cache the new summary
        const cacheData: CachedSummary = {
          summary: newSummary,
          timestamp: Date.now(),
          version: CACHE_VERSION
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));

        setSummary(newSummary);
      } else if (data?.error) {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error("Error generating AI summary:", err);
      setError(err instanceof Error ? err.message : "Failed to generate summary");
    } finally {
      setIsGenerating(false);
    }
  }, [itemId, title, billTextUrl, policyArea, cacheKey, isGenerating]);

  return { summary, isGenerating, error, generateSummary };
}

// Helper functions to extract summary lines from explanation
function extractWhatChanges(explanation: string): string {
  const sentences = explanation.split(/[.!?]+/).filter(s => s.trim());
  if (sentences.length > 0) {
    const first = sentences[0].trim();
    return first.length > 100 ? first.substring(0, 100) + "..." : first;
  }
  return "View details for more information";
}

function extractWhoImpacted(stakeholders: any[], explanation: string): string {
  if (stakeholders && stakeholders.length > 0) {
    const impacted = stakeholders
      .filter(s => s.impact)
      .slice(0, 2)
      .map(s => s.name)
      .join(", ");
    if (impacted) return `Affects: ${impacted}`;
  }
  
  // Try to extract from explanation
  const impactMatch = explanation.match(/(?:impact|affect|apply to)[:\s]+([^.]+)/i);
  if (impactMatch) {
    return impactMatch[1].trim().substring(0, 80);
  }
  
  return "Multiple stakeholders affected";
}
