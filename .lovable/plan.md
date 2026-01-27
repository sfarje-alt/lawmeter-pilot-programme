
# Plan: Show Client Badge Only When Alert is Published to Client

## Problem
Currently, the admin inbox shows the client badge ("FarmaSalud Perú S.A.C.") on ALL alerts based on `primary_client_id`, which is pre-assigned by default. This makes it impossible to track which alerts have actually been published to which clients.

## Solution
Modify `InboxAlertCard.tsx` to show client badge(s) ONLY when:
1. The alert has `status === "published"`, AND
2. The alert has `client_commentaries` for specific clients (indicating it was published to them)

This way, the admin can easily see at a glance which alerts are published to which clients.

## Technical Changes

### File: `src/components/inbox/InboxAlertCard.tsx`

**Current Logic (lines 206-214):**
```tsx
{/* Client Tag */}
{primaryClient && (
  <div className="flex items-center gap-1.5 mb-2">
    <Briefcase className="h-3 w-3 text-primary/70" />
    <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30 py-0">
      {primaryClient.name}
    </Badge>
  </div>
)}
```

**New Logic:**
- Get list of published clients from `client_commentaries` array (only when `status === "published"`)
- Display a badge for EACH client the alert is published to
- Show nothing if alert is not published to any client

```tsx
{/* Published Client Tags - Only show when alert is published */}
{alert.status === "published" && alert.client_commentaries.length > 0 && (
  <div className="flex items-center gap-1.5 mb-2 flex-wrap">
    <Briefcase className="h-3 w-3 text-primary/70" />
    {alert.client_commentaries
      .map(cc => MOCK_CLIENTS.find(c => c.id === cc.clientId))
      .filter(Boolean)
      .map(client => (
        <Badge 
          key={client.id}
          variant="outline" 
          className="text-xs bg-primary/10 text-primary border-primary/30 py-0"
        >
          {client.name}
        </Badge>
      ))
    }
  </div>
)}
```

## Expected Result

| Alert State | Client Badge Display |
|-------------|---------------------|
| Inbox (not published) | No badge shown |
| Reviewed (not published) | No badge shown |
| Published to FarmaSalud | Shows "FarmaSalud Perú S.A.C." badge |
| Published to multiple clients | Shows badge for EACH client |

## Visual Example

**Before (current behavior):**
- ALL alerts show "FarmaSalud Perú S.A.C." badge

**After (new behavior):**
- Only alerts with `status: "published"` and entries in `client_commentaries` show client badges
- Admin can easily identify: "These 5 bills are published to FarmaSalud, the rest are not yet published"

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/inbox/InboxAlertCard.tsx` | Update client badge logic to check publication status |

## Implementation Details

1. Replace the `primaryClient` lookup with a check of `client_commentaries`
2. Only render client badges when `alert.status === "published"`
3. Map through all clients in `client_commentaries` to show multiple badges if published to multiple clients
4. Use `flex-wrap` to handle multiple client badges gracefully
