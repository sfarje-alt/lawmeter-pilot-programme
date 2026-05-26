## Goal
Add a **Panel / Morning Brief** as the executive entry point for the Betsson Group organization and surface country activation status (Perú activo; Chile, Colombia, Argentina en activación). Frontend-only, scoped to Betsson, zero changes to operational modules, data layer, auth, or backend.

## Scope guard (Betsson only)
Gate every new piece of UI behind:
```
profile?.organization_id === 'b7e15500-0001-4000-8000-000000000001'
```
For any other org the app renders exactly as today. Add a tiny helper `isBetssonOrg(orgId)` in `src/lib/orgDataIsolation.ts` (alongside existing `isEmptyDataOrg` / `isManualIngestOrg`) to centralize the check.

## 1. Flag assets + component
- Add SVG flags: `src/assets/flags/peru.svg`, `chile.svg`, `colombia.svg`, `argentina.svg` (downloaded from flagcdn / inlined SVG, ~24×16).
- New component `src/components/regional/CountryFlag.tsx`:
  - Props: `country: 'PE'|'CL'|'CO'|'AR'`, `size?: number` (default 20), `showName?: boolean`.
  - Renders `<img>` with the local SVG + Spanish country name. On `onError`, hides the image and falls back to the name alone (no ISO code, no emoji).
- New component `src/components/regional/CountryStatusChip.tsx`: flag + name + small status pill (`Activo` / `En activación`) using existing semantic tokens (`bg-success/20 text-success-foreground` vs `bg-muted/40 text-muted-foreground`).

## 2. Country status data
New file `src/lib/betssonCountries.ts`:
```ts
export const BETSSON_COUNTRIES = [
  { code: 'PE', name: 'Perú', status: 'active',
    description: 'Monitoreo operativo habilitado.' },
  { code: 'CL', name: 'Chile', status: 'activating',
    description: 'Fuentes, taxonomía y criterios de relevancia pendientes de calibración.' },
  { code: 'CO', name: 'Colombia', status: 'activating',
    description: 'Fuentes, taxonomía y criterios de relevancia pendientes de calibración.' },
  { code: 'AR', name: 'Argentina', status: 'activating',
    description: 'Fuentes, taxonomía y criterios de relevancia pendientes de calibración.' },
] as const;
```

## 3. Morning Brief page
New folder `src/components/panel/`:
- `MorningBriefPage.tsx` — main container.
- `MorningBriefHeader.tsx` — title "Betsson · Morning Brief", subtitle "Perú activo · Chile, Colombia y Argentina en activación", executive summary paragraph from the spec.
- `KpiStrip.tsx` — derives values **only** from the existing `useInboxAlerts()` / sessions / calendar hooks already used by the operational tabs. Cards:
  - Alertas activas (count of non-archived)
  - Críticas sin revisar (high-risk + unread)
  - Nuevas últimas 24h (filter by `created_at`)
  - Próximos vencimientos (next 7 days from existing deadlines)
  - Sesiones próximas (from existing sessions hook)
  - Países en activación (= 3, static)
  - If any value cannot be derived safely → render `—` / `Pendiente`. **No hardcoded numbers.**
- `TopAlertsToMonitor.tsx` — pulls from `useInboxAlerts().allAlerts`, sorts by `(risk_score desc, urgency desc, deadline asc, unread first)`, slices top 5. Each card shows title, source/authority, reference, risk, urgency, deadline, status, recommended action when present. CTA `Ver alerta` calls `navigate('/?section=inbox&alertId=' + alert.id + '&t=' + Date.now())` — same deep-link pattern already supported in `LawMeterDashboard`. No new alert-detail logic.
- `WhereToLookFirst.tsx` — four link cards routing to existing tabs via the same `setActiveTab` mechanism (passed in as props): Alertas críticas → inbox, Sesiones próximas → sessions, Vencimientos → calendar, Resumen ejecutivo → reports.
- `CountryStatusSection.tsx` — renders four `CountryStatusChip` rows with descriptions per spec.
- `UpcomingItemsSection.tsx` — reads existing sessions + calendar arrays; if empty, shows compact "Pendiente" state. No invented events.

All styling uses existing dark-mode tokens (`bg-card`, `border-white/10`, gradients matching `LawMeterDashboard` shell). No new color tokens.

## 4. Wiring into the shell
Edit two files only:

**`src/components/layout/AppSidebar.tsx`**
- Import `isBetssonOrg`.
- If Betsson, prepend a menu item `{ id: 'panel', title: 'Panel', icon: LayoutDashboard }` to `menuItems`. Otherwise sidebar is unchanged.

**`src/pages/LawMeterDashboard.tsx`**
- Add `import { MorningBriefPage } from '@/components/panel/MorningBriefPage'`.
- In admin `renderContent()` switch, add `case 'panel': return <MorningBriefPage onNavigate={setActiveTab} />;`.
- For Betsson admins only, change the default initial tab from `'inbox'` to `'panel'` (the existing default-tab `useEffect`). Non-Betsson behavior untouched.
- Add `panel: 'Panel'` to `getTabDisplayName` map.
- Optional: in the top header, when `isBetssonOrg`, render a compact row of four `CountryStatusChip`s next to the existing "Perú" badge. Strictly read-only — no click handlers, no filter wiring.

## 5. Explicit non-changes
- `useInboxAlerts`, `AlertsContext`, sessions hooks, calendar, analytics, reports, auth, Supabase, edge functions, scrapers, RLS: untouched.
- No country selector added to Alertas / Sesiones / Calendario / Analíticas / Reportes.
- No new alerts/sessions/analytics fixtures. No demo/mock/placeholder copy.
- Other orgs (ISA, Diez Canseco, etc.) see zero UI change.

## Technical notes
- `src/lib/orgDataIsolation.ts` gains `BETSSON_ORG_ID` constant + `isBetssonOrg()` helper; existing `EMPTY_DATA_ORG_IDS` set is **not** modified (Betsson stays empty-data per current behavior — the Morning Brief simply renders `—` / `Pendiente` blocks if `useInboxAlerts` returns zero rows, which is the spec's intended fallback).
- Sort/derivation helpers for the KPI strip and Top Alerts live inside the panel components — no changes to shared hooks.
- All flag rendering goes through `CountryFlag`; on image error it falls back to plain country name (never ISO code, never emoji).

## Deliverables
New files:
- `src/assets/flags/{peru,chile,colombia,argentina}.svg`
- `src/components/regional/CountryFlag.tsx`
- `src/components/regional/CountryStatusChip.tsx`
- `src/lib/betssonCountries.ts`
- `src/components/panel/MorningBriefPage.tsx` (+ subcomponents listed above)

Edited files (additive only):
- `src/lib/orgDataIsolation.ts` — add Betsson constant + helper
- `src/components/layout/AppSidebar.tsx` — conditional `Panel` entry
- `src/pages/LawMeterDashboard.tsx` — register `panel` case, default tab for Betsson, optional header chips
