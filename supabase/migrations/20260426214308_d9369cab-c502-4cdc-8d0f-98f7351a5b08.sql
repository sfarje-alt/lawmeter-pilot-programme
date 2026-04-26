-- Create alert_feedback table for micro-feedback signals
CREATE TABLE public.alert_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id uuid NOT NULL,
  user_id uuid NOT NULL,
  profile_id uuid NOT NULL,
  client_id uuid,
  organization_id uuid NOT NULL,
  rating text NOT NULL,
  reason_selected text,
  optional_comment text,
  alert_keywords_detected text[] DEFAULT '{}'::text[],
  alert_area text,
  alert_subarea text,
  alert_jurisdiction text DEFAULT 'PERU',
  alert_risk_score integer,
  alert_urgency integer,
  status text NOT NULL DEFAULT 'pending_review',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT alert_feedback_rating_check CHECK (rating IN ('very_useful','useful','not_relevant'))
);

CREATE INDEX idx_alert_feedback_org_created ON public.alert_feedback(organization_id, created_at DESC);
CREATE INDEX idx_alert_feedback_alert ON public.alert_feedback(alert_id);
CREATE INDEX idx_alert_feedback_rating ON public.alert_feedback(rating);

ALTER TABLE public.alert_feedback ENABLE ROW LEVEL SECURITY;

-- INSERT: any authenticated org member can submit feedback (their own row only)
CREATE POLICY "Users can insert their own feedback"
ON public.alert_feedback
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND organization_id IN (
    SELECT profiles.organization_id FROM public.profiles WHERE profiles.id = auth.uid()
  )
);

-- SELECT: admins see all org feedback; non-admins see only their own
CREATE POLICY "Org members can view feedback (admin all, user own)"
ON public.alert_feedback
FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT profiles.organization_id FROM public.profiles WHERE profiles.id = auth.uid()
  )
  AND (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR user_id = auth.uid()
  )
);
