# Plan: Quick Alert Feedback ("¿Qué tal esta alerta?")

## Goal
Lightweight micro-feedback (<15 s) on every regulatory alert, stored as a learning signal — never auto-applied to keywords, scoring, or classification. Aggregated view inside **Operaciones internas** for the legal team.

---

## 1. Database — new `alert_feedback` table (migration)

Create one record per submission:

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | `gen_random_uuid()` |
| `alert_id` | uuid | logical link to `alerts.id` (no FK to keep flexibility) |
| `user_id` | uuid | `auth.uid()` |
| `profile_id` | uuid | `profiles.id` (same as user) |
| `client_id` | uuid | nullable (admin may have none) |
| `organization_id` | uuid | required for RLS scoping |
| `rating` | text | `'very_useful' \| 'useful' \| 'not_relevant'` (CHECK) |
| `reason_selected` | text | nullable, single chip |
| `optional_comment` | text | nullable |
| `alert_keywords_detected` | text[] | snapshot from `alerts.area_de_interes` ∪ matched keywords |
| `alert_area` | text | snapshot |
| `alert_subarea` | text | nullable snapshot |
| `alert_jurisdiction` | text | default `'PERU'` |
| `alert_risk_score` | int | snapshot from `alerts.impacto` |
| `alert_urgency` | int | snapshot from `alerts.urgencia` |
| `status` | text | default `'pending_review'` |
| `created_at` | timestamptz | `now()` |

**RLS:**
- INSERT: any authenticated user whose `organization_id` matches their profile.
- SELECT: org members (mirrors existing alerts policy). Admins see all; clients only see their own rows (added predicate `user_id = auth.uid() OR has_role(auth.uid(),'admin')`).
- No UPDATE/DELETE policies (immutable signal).

Index on `(organization_id, created_at desc)`, `(alert_id)`, `(rating)`.

---

## 2. Reusable UI: `AlertFeedbackPopover`

New file: `src/components/inbox/feedback/AlertFeedbackPopover.tsx`

- Trigger: `<Button variant="ghost" size="icon">` with `MessageSquarePlus` icon (small, dark-mode), tooltip **"Dar feedback"**.
- Wraps shadcn `Popover` (compact, ~320 px). Stops click propagation so it doesn't open the alert drawer when used on the card.
- Internal state: `step` (`rating` → `reason` → `done`), `rating`, `reason`, `comment`.
- **Step 1 — Title** *"¿Qué tal esta alerta?"* + 3 large stacked buttons:
  - Muy útil (👍 emerald)
  - Útil (✅ neutral)
  - No relevante (⚠ amber)
- **Step 2 — Reason chips** (Badge buttons, single-select, optional). Chip set depends on rating:
  - Positive: *Buen match con mis keywords / Tema importante para mi perfil / Buen nivel de prioridad / Debe aparecer más contenido similar*.
  - Negative: *Keyword demasiado amplia / No aplica a mi perfil / Área legal incorrecta / Prioridad exagerada / Fuente no relevante / Otro*.
- **Step 3 — Optional `<Textarea>`** label *"Comentario opcional"*, placeholder per spec.
- Submit button **"Enviar feedback"** active from Step 1 onward (rating-only submit allowed).
- After insert: replace content with success state *"Gracias. Usaremos este feedback para mejorar futuras alertas."* + auto-close after 1.8 s.
- Uses `supabase.from('alert_feedback').insert(...)` with snapshot fields pulled from the alert prop.

Submission helper: `src/lib/alertFeedback.ts` exporting `submitAlertFeedback(alert, payload, ctx)` that builds the snapshot and inserts.

---

## 3. Mount points

1. **`InboxAlertCard.tsx`** — add the feedback icon next to existing Pin/Archive buttons in the card header action group. Same pattern as those buttons (stopPropagation).
2. **`AlertDetailDrawer.tsx`** — add a `AlertFeedbackPopover` button inside `SheetHeader` actions (top-right), next to existing actions.
3. **Client portal**: same in `ClientAlertCard.tsx` and `ClientAlertDetailDrawer.tsx`. Clients see only their own ratings; admin aggregates everyone.

No changes to other workflows. Feedback button never blocks navigation.

---

## 4. Operaciones internas — new analytics block

New block: `src/components/analytics/blocks/ops/AlertFeedbackBlock.tsx`
- Title: **"Feedback de alertas"**, subtitle *"Señal de relevancia enviada por usuarios — no afecta scoring automáticamente."*
- Data hook: `src/hooks/useAlertFeedbackStats.ts` — single query against `alert_feedback` filtered by org + timeframe; aggregates client-side.
- KPIs row:
  - Total feedback recibido
  - % Muy útil / Útil / No relevante (stacked bar)
  - Alertas marcadas "No relevante"
  - Alertas marcadas "Muy útil"
- Lists (3-tab `Tabs`):
  - **Por keyword** — top keywords linked to "No relevante" (groups feedback rows by `alert_keywords_detected` unnested). Shows count + chip *"Posible keyword demasiado amplia"* when ≥3 negatives.
  - **Por perfil/cliente** — clients with repeated low-relevance feedback. Chip *"Perfil requiere ajuste"* when ≥3 negatives in the period.
  - **Por área legal** — areas with concentration of "Muy útil". Chip *"Área de alta relevancia para este perfil"* when ≥3 positives.
- Drilldown: click a row → opens existing `AnalyticsDrilldownSheet` with the underlying alerts (reusing the inbox-derived alert collection — same source-of-truth rule as Sesiones).
- Register block in `src/components/analytics/blocks/ops/index.ts` and add to `LegalTeamAnalyticsDashboard.tsx` Operaciones internas grid behind `isEnabled("alert_feedback")`. Default: enabled. Add to `ReportLayoutBuilder` block catalog so it can be toggled.

**Rule-based flags** (computed in the hook, no LLM):
- keyword with ≥3 `not_relevant` → `"Posible keyword demasiado amplia"`
- profile with ≥3 `not_relevant` over period → `"Perfil requiere ajuste"`
- area with ≥3 `very_useful` → `"Área de alta relevancia para este perfil"`

These are surfaced as chips/badges only — no automatic write-back to `clients.keywords`, `alerts`, or scoring fields.

---

## 5. Guarantees & non-goals
- **No** automatic mutation of keywords, scores, or classifications anywhere.
- **No** new full-page form — only the popover.
- **No** required fields beyond rating.
- Spanish UI throughout, consistent with existing dark-mode tokens (`bg-card`, `border-border/30`, `text-muted-foreground`, etc.).
- Client portal users can submit; only admin sees the aggregated Operaciones internas block (controlled by existing `account_type === 'admin'` gate around `LegalTeamAnalyticsDashboard`).

---

## Files to create
- `supabase/migrations/<ts>_alert_feedback.sql`
- `src/components/inbox/feedback/AlertFeedbackPopover.tsx`
- `src/lib/alertFeedback.ts`
- `src/hooks/useAlertFeedbackStats.ts`
- `src/components/analytics/blocks/ops/AlertFeedbackBlock.tsx`

## Files to edit
- `src/components/inbox/InboxAlertCard.tsx` — add feedback trigger
- `src/components/inbox/AlertDetailDrawer.tsx` — add feedback trigger in header
- `src/components/client-portal/ClientAlertCard.tsx` — add feedback trigger
- `src/components/client-portal/ClientAlertDetailDrawer.tsx` — add feedback trigger
- `src/components/analytics/blocks/ops/index.ts` — export new block
- `src/components/analytics/LegalTeamAnalyticsDashboard.tsx` — render new block
- `src/components/reports/ReportLayoutBuilder.tsx` — register `alert_feedback` block id

## Acceptance
- One-click rating submit works from card and drawer.
- Row appears in `alert_feedback` with all snapshot metadata.
- Operaciones internas shows live aggregates, drilldowns to real alerts.
- No keyword / scoring / classification side effects.
