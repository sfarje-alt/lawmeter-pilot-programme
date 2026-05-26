import { ReactNode, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { isBetssonOrg } from "@/lib/orgDataIsolation";
import { CountryScopeSelector } from "./CountryScopeSelector";
import { CountryEmptyState } from "./CountryEmptyState";
import type {
  BetssonCountryCode,
  BetssonCountryScope,
} from "@/lib/betssonCountries";

type ModuleKey = "alerts" | "sessions" | "calendar" | "analytics";

const EMPTY_COPY: Record<ModuleKey, string> = {
  alerts: "No hay alertas activas para Chile todavía.",
  sessions: "No hay sesiones registradas para Chile todavía.",
  calendar: "No hay hitos registrados para Chile todavía.",
  analytics: "No hay datos analíticos disponibles para Chile todavía.",
};

const EMPTY_HINT =
  "La estructura frontend está habilitada. Aparecerán datos en cuanto se conecte la fuente.";

interface BetssonCountryScopeWrapperProps {
  module: ModuleKey;
  children: ReactNode;
}

/**
 * Adds a Betsson-only country scope selector above an operational module.
 * - "Todos" and "Perú" → render the original module untouched.
 * - "Chile" → render empty active state (structure ready, no data yet).
 * - "Colombia" / "Argentina" → render activation state (and are disabled in selector).
 *
 * Non-Betsson users see the original module without any wrapper UI.
 */
export function BetssonCountryScopeWrapper({
  module,
  children,
}: BetssonCountryScopeWrapperProps) {
  const { profile } = useAuth();
  const isBetsson = isBetssonOrg(profile?.organization_id);
  const [scope, setScope] = useState<BetssonCountryScope>("ALL");

  if (!isBetsson) return <>{children}</>;

  const renderScopedContent = () => {
    if (scope === "ALL" || scope === "PE") return children;
    const code = scope as BetssonCountryCode;
    const activating = code === "CO" || code === "AR";
    return (
      <CountryEmptyState
        country={code}
        message={
          activating
            ? "Jurisdicción en proceso de activación."
            : EMPTY_COPY[module]
        }
        hint={activating ? undefined : EMPTY_HINT}
        variant={activating ? "activating" : "active-empty"}
      />
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <CountryScopeSelector value={scope} onChange={setScope} />
      </div>
      {renderScopedContent()}
    </div>
  );
}
