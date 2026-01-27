
# Plan: Fix Instant Client Tag Display After Publishing

## Problem Analysis

After tracing through the code, I've identified the issue: When an alert is published, the state in `AlertsContext` is correctly updated, but the `InboxAlertCard` component may not be re-rendering properly to show the new client tag.

The current compound key in `KanbanColumn.tsx` is:
```tsx
key={`${alert.id}-${alert.status}-${alert.client_commentaries.length}`}
```

This should work, but there appears to be a timing/reference issue where the component isn't picking up the new state immediately.

## Root Causes Identified

1. **Stale Reference in BillsInbox.handlePublish**: The `handlePublish` function loops through `clientIds` and calls `onPublish` multiple times, but `onPublish` comes from context and should still work correctly.

2. **Missing Dependency or Closure Issue**: The functions in `BillsInbox` might be capturing stale references.

3. **useMemo Caching**: The `alertsByStage` memo depends on `filteredAlerts`, which depends on `billAlerts`, which depends on `alerts`. This chain should update, but we need to verify the dependencies are complete.

## Solution

### Fix 1: Enhance Key with Published Clients Count

Update the compound key to include more specific published client information:

**File: `src/components/inbox/KanbanColumn.tsx`**

```tsx
// Current
key={`${alert.id}-${alert.status}-${alert.client_commentaries.length}`}

// Enhanced - include stringified client IDs for complete reactivity
key={`${alert.id}-${alert.status}-${JSON.stringify(alert.client_commentaries.map(c => c.clientId))}`}
```

### Fix 2: Add Force Update via updated_at Timestamp

The `publishAlert` in context already sets `updated_at: new Date().toISOString()`. We should include this in the key:

**File: `src/components/inbox/KanbanColumn.tsx`**

```tsx
key={`${alert.id}-${alert.status}-${alert.updated_at}`}
```

This is simpler and more effective - every state change updates the timestamp, forcing a re-render.

### Fix 3: Fix BillsInbox handlePublish to Not Loop Unnecessarily

The current implementation loops through clients and calls `onPublish` multiple times:

**File: `src/components/inbox/BillsInbox.tsx`**

```tsx
// Current (potentially problematic)
const handlePublish = (alert, clientIds, commentaries) => {
  clientIds.forEach(clientId => {
    onPublish(alert, [clientId], commentaries);
  });
  ...
};

// Fixed - call onPublish once with all clients
const handlePublish = (alert, clientIds, commentaries) => {
  onPublish(alert, clientIds, commentaries);
  ...
};
```

The context's `publishAlert` already handles multiple clients correctly.

### Fix 4: Apply Same Fix to RegulationsInbox

Apply the same fix to `RegulationsInbox.tsx` for consistency.

## Files to Modify

| File | Change |
|------|--------|
| `src/components/inbox/KanbanColumn.tsx` | Update key to use `updated_at` |
| `src/components/inbox/BillsInbox.tsx` | Fix `handlePublish` to not loop |
| `src/components/inbox/RegulationsInbox.tsx` | Fix `handlePublish` to not loop |

## Implementation Summary

1. Change the key in `KanbanColumn.tsx` to include `updated_at` timestamp
2. Remove the unnecessary loop in `BillsInbox.handlePublish` 
3. Remove the unnecessary loop in `RegulationsInbox.handlePublish`

## Expected Behavior After Fix

1. Admin clicks "Publicar" for an alert
2. Context state updates immediately with new `status`, `client_commentaries`, and `updated_at`
3. The key change (`updated_at` is new) forces React to unmount/remount the card
4. New card renders with client badge visible
5. No page refresh needed

## Testing Steps

1. Login as admin (sfarje@lawmeter.io)
2. Open any unpublished alert (no client badge visible)
3. Select FarmaSalud as client
4. Add expert commentary
5. Click "Publicar"
6. **Verify**: Client badge "FarmaSalud Perú S.A.C." appears INSTANTLY on the card
7. Verify the card stays in the same Kanban column (tramite_final for published bills)
