
# Plan: Mirror Admin Inbox UI for Client Portal (Read-Only)

## Objective
Make the Client Portal's Inbox ("Alertas") an exact visual copy of the Admin's Inbox, but with two key differences:
1. **Read-Only Mode**: Remove all editorial actions (pin, publish, edit commentary)
2. **Filtered Data**: Show only alerts published specifically to that client

## Current Gap Analysis

### Admin Inbox (Reference)
- Kanban layout for "Proyectos de Ley" (3 columns: Comisión, Pleno, Trámite Final)
- Grid layout for "Normas" 
- Rich `InboxAlertCard` showing: type badge, impact level, ID, title, author, parliamentary group, current stage, summary/commentary preview, area tags, client badge, dates
- KPI cards (Pendientes, En Comisión, En Pleno, Trámite Final, Pineados)
- Multi-select filters bar (search, areas, stages, sectors, groups, impact, date range)
- `AlertDetailDrawer` for full details and publishing workflow

### Client Inbox (Current State)
- Simple tab layout with basic grid cards
- Simplified card design missing many fields
- No Kanban columns
- No KPI cards
- No advanced filters
- Different detail view component

## Implementation Plan

### Phase 1: Create Read-Only Versions of Admin Components

**1.1 Create `ClientBillsInbox.tsx`**
- Copy structure from `BillsInbox.tsx`
- Use Kanban layout with 3 columns
- Include KPI cards (without "Pineados" - not relevant for clients)
- Include filter bar (adapted - remove pinned filter)
- Read-only mode: no `onTogglePin` prop passed to cards

**1.2 Create `ClientRegulationsInbox.tsx`**
- Copy structure from `RegulationsInbox.tsx`
- Use grid layout
- Include KPI cards (without "Pineados")
- Include filter bar (adapted)
- Read-only mode

**1.3 Create `ClientAlertCard.tsx`**
- Base on `InboxAlertCard.tsx` but:
  - Remove pin button
  - Remove commentary status badges (green/amber circles)
  - Add "Solo Lectura" visual indicator
  - Keep all metadata display (impact, stage, author, etc.)

**1.4 Create `ClientAlertDetailDrawer.tsx`**
- Base on `AlertDetailDrawer.tsx` but:
  - Remove "Publicar para Cliente" section
  - Remove "Comentario Experto" editing
  - Display expert commentary as read-only
  - Add prominent "Solo Lectura" badge
  - Keep all metadata display

### Phase 2: Update ClientInbox to Use New Components

**2.1 Refactor `ClientInbox.tsx`**
- Replace current tabs/cards structure with:
  - `ClientBillsInbox` for "Proyectos de Ley" tab
  - `ClientRegulationsInbox` for "Normas" tab
- Pass filtered alerts from `AlertsContext` (only published for this client)

### Phase 3: Data Flow Verification

**3.1 Ensure Expert Commentary Sync**
- When admin updates `expert_commentary` or `client_commentaries`, it should reflect immediately
- The `AlertsContext` already handles this with `updateSharedCommentary` and `updateAlertCommentary`
- Client views pull from the same shared state

**3.2 Verify Publishing Logic**
- `publishAlert` sets `status: "published"` and `client_id: clientId`
- `getPublishedAlertsForClient(clientId)` filters correctly
- Expert commentary is stored in `client_commentaries` array per client

### Phase 4: UI Polish

**4.1 Add Visual Read-Only Indicators**
- Global "Solo Lectura" badge in header (already exists)
- Subtle disabled styling on cards (pointer cursor instead of interactive)
- No hover states that suggest editability

**4.2 Filter Bar Adaptation**
- Remove "Pineados" toggle from client filters
- Keep all other filters functional

## Technical Approach

### Option A: Create New Read-Only Components (Recommended)
- Pros: Clean separation, no complex conditional logic, easier maintenance
- Cons: Some code duplication

### Option B: Add `readOnly` Prop to Existing Components
- Pros: Single source of truth
- Cons: Components become complex with many conditionals

**Selected: Option A** - Create dedicated client components for clarity and maintainability

## File Changes Summary

| Action | File | Description |
|--------|------|-------------|
| Create | `src/components/client-portal/ClientBillsInbox.tsx` | Kanban layout for client bills (read-only) |
| Create | `src/components/client-portal/ClientRegulationsInbox.tsx` | Grid layout for client regulations (read-only) |
| Create | `src/components/client-portal/ClientAlertCard.tsx` | Read-only alert card with full metadata |
| Create | `src/components/client-portal/ClientAlertDetailDrawer.tsx` | Read-only detail drawer |
| Create | `src/components/client-portal/ClientBillsFilterBar.tsx` | Filter bar without pinned toggle |
| Create | `src/components/client-portal/ClientRegulationsFilterBar.tsx` | Filter bar for regulations |
| Update | `src/components/client-portal/ClientInbox.tsx` | Use new components, remove old implementation |
| Update | `src/components/client-portal/index.ts` | Export new components |

## Expected Result

After implementation, the FarmaSalud client (farmasaludperu@test.com) will see:
1. Same Kanban layout as admin for bills
2. Same grid layout as admin for regulations
3. Same rich card design with all metadata
4. Same filter capabilities (minus pinning)
5. Same detail drawer view (minus editing/publishing)
6. Only alerts published specifically to "client-farmasalud"
7. Expert commentary added by admin visible in read-only mode
8. Clear "Solo Lectura" indicators throughout

## Testing Verification

1. Login as admin (sfarje@lawmeter.io)
2. Publish an alert with expert commentary to FarmaSalud
3. Login as client (farmasaludperu@test.com)
4. Verify: Same visual layout, alert visible, commentary visible, no edit actions
