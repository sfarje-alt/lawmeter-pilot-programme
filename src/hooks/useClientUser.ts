import { useAuth } from "@/contexts/AuthContext";
import { PRIMARY_CLIENT_ID, MOCK_CLIENTS } from "@/data/peruAlertsMockData";

// Email-to-client mapping for demo purposes
// In production, this would be stored in the database
const EMAIL_CLIENT_MAPPING: Record<string, string> = {
  'farmasaludperu@test.com': PRIMARY_CLIENT_ID,
};

export interface ClientUserInfo {
  isClientUser: boolean;
  isAdmin: boolean;
  clientId: string | null;
  clientName: string | null;
}

/**
 * Hook to determine if the current user is a client user (view-only access)
 * A client user has account_type = 'user'
 */
export function useClientUser(): ClientUserInfo {
  const { profile } = useAuth();

  if (!profile) {
    return {
      isClientUser: false,
      isAdmin: false,
      clientId: null,
      clientName: null,
    };
  }

  // Admin users have account_type = 'admin'
  const isAdmin = profile.account_type === 'admin';
  
  // Client users have account_type = 'user'
  const isClientUser = profile.account_type === 'user';

  // Determine client ID:
  // 1. First check email mapping (for demo/existing users)
  // 2. Then check if client_id is set (for future users with UUID)
  // 3. Default to null
  let clientId: string | null = null;
  
  if (profile.email && EMAIL_CLIENT_MAPPING[profile.email.toLowerCase()]) {
    clientId = EMAIL_CLIENT_MAPPING[profile.email.toLowerCase()];
  } else if (profile.client_id) {
    // For future users where client_id might be stored as string in metadata
    clientId = profile.client_id as unknown as string;
  }

  // Get client name from MOCK_CLIENTS
  const client = clientId ? MOCK_CLIENTS.find(c => c.id === clientId) : null;
  const clientName = client?.name || null;

  return {
    isClientUser,
    isAdmin,
    clientId,
    clientName,
  };
}
