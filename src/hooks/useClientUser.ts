import { useAuth } from "@/contexts/AuthContext";

export interface ClientUserInfo {
  isClientUser: boolean;
  isAdmin: boolean;
  clientId: string | null;
  clientName: string | null;
}

/**
 * LawMeter is now a self-service corporate compliance platform.
 * There is no longer a distinction between "admin" (law firm) and "client"
 * (read-only consumer). Every authenticated user is an internal operator
 * with full access to alerts, profiles, reports and analytics for their
 * organization.
 *
 * This hook is kept for backwards compatibility with components that still
 * reference it, but it always reports the user as a non-client operator.
 */
export function useClientUser(): ClientUserInfo {
  const { profile } = useAuth();

  return {
    isClientUser: false,
    isAdmin: !!profile,
    clientId: null,
    clientName: null,
  };
}
