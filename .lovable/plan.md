
# Plan: Fix FarmaSalud Client User Account Configuration

## Problem Summary

The FarmaSalud user account (`farmasaludperu@test.com`) is incorrectly acting as an admin because:

1. **Database Profile Data is Incorrect**:
   - Current: `account_type: 'admin'`, `client_id: null`
   - Expected: `account_type: 'user'`, `client_id: 'client-farmasalud'`

2. **Client ID Mismatch in Code**:
   - `INVITATION_CODES` uses `'farmasalud-peru'`
   - `PRIMARY_CLIENT_ID` constant is `'client-farmasalud'`
   - These must match for filtering to work

3. **Database Trigger Doesn't Save client_id**:
   - The `handle_new_user()` trigger only extracts `full_name` and `account_type` from user metadata, ignoring `client_id`

---

## Implementation Steps

### Step 1: Fix the Existing FarmaSalud Profile in Database

Update the existing profile to have the correct values:

```sql
UPDATE profiles 
SET 
  account_type = 'user',
  client_id = 'client-farmasalud'
WHERE email = 'farmasaludperu@test.com';
```

### Step 2: Align Client IDs in SignUpForm

**File: `src/components/auth/SignUpForm.tsx`**

Update the `INVITATION_CODES` to use the correct `PRIMARY_CLIENT_ID`:

```typescript
// Before:
const INVITATION_CODES: Record<string, { clientId: string; clientName: string }> = {
  'FARMA2024': { clientId: 'farmasalud-peru', clientName: 'FarmaSalud Perú S.A.C.' },
  ...
};

// After:
const INVITATION_CODES: Record<string, { clientId: string; clientName: string }> = {
  'FARMA2024': { clientId: 'client-farmasalud', clientName: 'FarmaSalud Perú S.A.C.' },
  ...
};
```

### Step 3: Update Database Trigger to Include client_id

**Database Migration**: Update `handle_new_user()` function:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, account_type, client_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'account_type')::app_role, 'user'),
    NEW.raw_user_meta_data->>'client_id'
  );
  RETURN NEW;
END;
$function$;
```

### Step 4: Verify Client Portal Logic

Confirm the `useClientUser` hook correctly identifies client users:

**File: `src/hooks/useClientUser.ts`** (no changes needed, logic is correct):
- `isClientUser = account_type === 'user' && !!client_id`
- `clientName` is derived from `PRIMARY_CLIENT_ID` match

### Step 5: Verify Component Data Filtering

The following components already filter correctly once the profile data is fixed:

| Component | Filter Logic |
|-----------|--------------|
| `ClientInbox.tsx` | Shows alerts where `status === 'published'` AND `client_id` or `primary_client_id` matches |
| `ClientCalendar.tsx` | Uses same published alerts filter |
| `ClientAnalytics.tsx` | Filters data specific to clientId |
| `ClientReports.tsx` | Shows reports filtered by client |
| `ClientProfileView.tsx` | Displays client config in read-only mode |
| `ClientSettings.tsx` | Shows account, notifications, invoicing (terms), and Calendly embed |

### Step 6: Verify Navigation Routing

**File: `src/components/layout/AppSidebar.tsx`**
- Uses `isClientUser` from hook to show client menu items
- Shows "Portal Cliente" header and "Solo Lectura" badge

**File: `src/pages/LawMeterDashboard.tsx`**
- Switches between admin and client views based on `isClientUser`
- Sets default tab to `"client-inbox"` for client users

---

## Technical Details

### Files to Modify

1. **Database Migration** (SQL):
   - Update existing FarmaSalud profile
   - Update `handle_new_user()` trigger to include `client_id`

2. **`src/components/auth/SignUpForm.tsx`**:
   - Change `FARMA2024` clientId from `'farmasalud-peru'` to `'client-farmasalud'`

### Expected Behavior After Fix

When user logs in as `farmasaludperu@test.com`:

| Feature | Behavior |
|---------|----------|
| **Sidebar** | Shows client menu: Alertas, Mi Perfil, Reportes, Analytics, Calendario |
| **Header** | Shows "Portal Cliente" and "Solo Lectura" badge |
| **Inbox** | Only shows published alerts with `client_id = 'client-farmasalud'` |
| **Profile** | Read-only view of client monitoring configuration |
| **Reports** | View-only history and scheduled reports |
| **Analytics** | Filtered charts specific to this client |
| **Calendar** | Only published alert dates for this client |
| **Settings** | Account info, notifications toggles, invoicing terms, Calendly embed |

---

## Testing Checklist

After implementation:

1. Log in as `farmasaludperu@test.com` / `FarmaSaludPeru`
2. Verify sidebar shows "Portal Cliente" header
3. Verify "Solo Lectura" badge appears
4. Navigate through each section and confirm read-only behavior
5. Create a new client user with `FARMA2024` code and verify profile is created correctly
