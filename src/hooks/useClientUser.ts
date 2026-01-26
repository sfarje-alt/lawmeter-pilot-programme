import { useAuth } from "@/contexts/AuthContext";
import { PRIMARY_CLIENT_ID } from "@/data/peruAlertsMockData";

export interface ClientUserInfo {
  isClientUser: boolean;
  isAdmin: boolean;
  clientId: string | null;
  clientName: string | null;
}

/**
 * Hook to determine if the current user is a client user (view-only access)
 * A client user has account_type = 'user' AND client_id is set
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
  
  // Client users have account_type = 'user' AND a client_id set
  const isClientUser = profile.account_type === 'user' && !!profile.client_id;

  // For demo purposes, map client_id to name
  const clientName = profile.client_id === PRIMARY_CLIENT_ID 
    ? "FarmaSalud Perú S.A.C."
    : null;

  return {
    isClientUser,
    isAdmin,
    clientId: profile.client_id,
    clientName,
  };
}
