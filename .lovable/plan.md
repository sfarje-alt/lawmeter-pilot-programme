

# Plan: Fix Instant Update of Client Tags and Cross-Portal Synchronization

## Issues Identified

### Issue 1: Admin Side - Client Badge Not Appearing Instantly
After publishing an alert, the client badge should appear immediately on the alert card. Currently, the logic is correct but there might be a re-render issue or the card is not receiving the updated alert data correctly.

### Issue 2: Client Portal - Not Filtering By `client_commentaries`
The `getPublishedAlertsForClient` function only checks `client_id` and `primary_client_id`, but when publishing to multiple clients, only the first client ID is stored in `client_id`. The function should also check if the client exists in the `client_commentaries` array.

## Root Cause Analysis

**In `AlertsContext.tsx`:**
```tsx
// publishAlert stores only first client
client_id: clientIds[0] || null,
client_commentaries: commentaries, // All clients are here

// getPublishedAlertsForClient doesn't check client_commentaries
return alerts.filter(
  (alert) =>
    alert.status === "published" &&
    (alert.client_id === clientId || alert.primary_client_id === clientId)
  // Missing: || alert.client_commentaries.some(c => c.clientId === clientId)
);
```

## Solution

### Fix 1: Update `getPublishedAlertsForClient` Filter Logic

Modify the function to also check `client_commentaries` array:

**File: `src/contexts/AlertsContext.tsx`**

```tsx
// Current (broken)
const getPublishedAlertsForClient = useCallback((clientId: string): PeruAlert[] => {
  return alerts.filter(
    (alert) =>
      alert.status === "published" &&
      (alert.client_id === clientId || alert.primary_client_id === clientId)
  );
}, [alerts]);

// Fixed
const getPublishedAlertsForClient = useCallback((clientId: string): PeruAlert[] => {
  return alerts.filter(
    (alert) =>
      alert.status === "published" &&
      (
        alert.client_id === clientId || 
        alert.primary_client_id === clientId ||
        alert.client_commentaries.some(c => c.clientId === clientId)
      )
  );
}, [alerts]);
```

This ensures that an alert is visible to a client if:
1. The alert's `client_id` matches (first client)
2. The alert's `primary_client_id` matches (pre-assigned client)
3. The client exists in `client_commentaries` (multi-client publishing)

### Fix 2: Ensure `BillsInbox` Properly Passes Updated Alerts

The current flow should work since `alerts` comes from context and flows through props. However, we should verify the `BillsInbox` is using the most current alert data from props, not from a stale local copy.

The current implementation already receives `alerts` as a prop and uses it in `useMemo` with `alerts` as a dependency, so this should be correct.

### Fix 3: Add Key Prop Refresh (Optional)

If the issue persists, we might need to ensure React knows to re-render the specific card by using a compound key that includes status:

```tsx
// In KanbanColumn.tsx
<InboxAlertCard
  key={`${alert.id}-${alert.status}-${alert.client_commentaries.length}`}
  alert={alert}
  // ...
/>
```

## Files to Modify

| File | Change |
|------|--------|
| `src/contexts/AlertsContext.tsx` | Update `getPublishedAlertsForClient` to check `client_commentaries` |
| `src/components/inbox/KanbanColumn.tsx` | (Optional) Add compound key for force re-render |

## Expected Behavior After Fix

1. **Admin publishes alert to FarmaSalud**
   - Toast shows "Publicado a 1 cliente"
   - Alert card IMMEDIATELY shows "FarmaSalud Perú S.A.C." badge
   - No page refresh needed

2. **Client logs in (FarmaSalud)**
   - Alert appears in their inbox immediately
   - Expert commentary is visible
   - Read-only view shows all metadata

3. **Multi-client publishing**
   - If admin publishes to 2 clients, both badges appear on admin card
   - Each client sees the alert in their respective portal

## Testing Steps

1. Login as admin (sfarje@lawmeter.io)
2. Open an unpublished alert (one without client badge)
3. Add expert commentary
4. Select "FarmaSalud Perú S.A.C." as client
5. Click "Publicar"
6. **Verify**: Client badge appears instantly on the card
7. Logout and login as client (farmasaludperu@test.com)
8. **Verify**: Alert appears in client inbox with commentary

## Technical Details

The fix is minimal - only one line change in the filter function. The React state updates from `setAlerts` in `publishAlert` will automatically trigger re-renders in all components consuming the `alerts` array from context.

