// Helper to submit a single feedback row for an alert.
// Stores feedback as a learning signal — never mutates keywords/scores/classifications.

import { supabase } from "@/integrations/supabase/client";
import type { PeruAlert } from "@/data/peruAlertsMockData";

export type FeedbackRating = "very_useful" | "useful" | "not_relevant";

export interface FeedbackPayload {
  rating: FeedbackRating;
  reason?: string | null;
  comment?: string | null;
}

export interface FeedbackContext {
  userId: string;
  organizationId: string;
  clientId?: string | null;
}

/**
 * Build a snapshot of the alert at the time of feedback so later analysis
 * is not affected by changes to the underlying alert.
 */
function snapshotAlert(alert: Partial<PeruAlert> & { id: string; affected_areas?: string[] }) {
  const keywords = (alert.affected_areas ?? []).filter(Boolean);
  return {
    alert_id: alert.id,
    alert_keywords_detected: keywords,
    alert_area: keywords[0] ?? null,
    alert_subarea: keywords[1] ?? null,
    alert_jurisdiction: "PERU",
    // PeruAlert exposes risk/urgency via different fields depending on the source.
    alert_risk_score: (alert as any).impacto ?? null,
    alert_urgency: (alert as any).urgencia ?? null,
  };
}

export async function submitAlertFeedback(
  alert: Partial<PeruAlert> & { id: string; affected_areas?: string[] },
  payload: FeedbackPayload,
  ctx: FeedbackContext,
) {
  const snapshot = snapshotAlert(alert);

  const { error } = await supabase.from("alert_feedback").insert({
    user_id: ctx.userId,
    profile_id: ctx.userId,
    organization_id: ctx.organizationId,
    client_id: ctx.clientId ?? null,
    rating: payload.rating,
    reason_selected: payload.reason ?? null,
    optional_comment: payload.comment?.trim() ? payload.comment.trim() : null,
    status: "pending_review",
    ...snapshot,
  });

  if (error) throw error;
}

export const POSITIVE_REASONS = [
  "Buen match con mis keywords",
  "Tema importante para mi perfil",
  "Buen nivel de prioridad",
  "Debe aparecer más contenido similar",
] as const;

export const NEGATIVE_REASONS = [
  "Keyword demasiado amplia",
  "No aplica a mi perfil",
  "Área legal incorrecta",
  "Prioridad exagerada",
  "Fuente no relevante",
  "Otro",
] as const;
