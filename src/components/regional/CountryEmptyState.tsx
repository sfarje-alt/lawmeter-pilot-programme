import { Clock, Globe2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CountryFlag } from "./CountryFlag";
import type { BetssonCountryCode } from "@/lib/betssonCountries";

interface CountryEmptyStateProps {
  country: BetssonCountryCode;
  message: string;
  hint?: string;
  variant?: "active-empty" | "activating";
  className?: string;
}

/**
 * Empty/active state for countries that are structurally enabled in the
 * frontend but have no data connected yet (Chile), or for countries that
 * are still in activation (Colombia, Argentina).
 */
export function CountryEmptyState({
  country,
  message,
  hint,
  variant = "active-empty",
  className,
}: CountryEmptyStateProps) {
  const isActivating = variant === "activating";
  return (
    <Card
      className={cn(
        "border-dashed",
        isActivating
          ? "bg-amber-500/5 border-amber-500/20"
          : "bg-white/[0.02] border-white/10",
        className,
      )}
    >
      <CardContent className="p-8 flex flex-col items-center justify-center text-center gap-3">
        <div className="flex items-center gap-2">
          <CountryFlag country={country} size={28} showName={false} />
          <span className="text-base font-semibold text-foreground">
            {country === "PE"
              ? "Perú"
              : country === "CL"
              ? "Chile"
              : country === "CO"
              ? "Colombia"
              : "Argentina"}
          </span>
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] uppercase tracking-wide",
              isActivating
                ? "bg-amber-500/10 border-amber-500/25 text-amber-300/90"
                : "bg-emerald-500/10 border-emerald-500/25 text-emerald-300",
            )}
          >
            {isActivating ? (
              <Clock className="h-3 w-3 mr-1" />
            ) : (
              <Globe2 className="h-3 w-3 mr-1" />
            )}
            {isActivating ? "En activación" : "Activo"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground max-w-md">{message}</p>
        {hint && (
          <p className="text-xs text-muted-foreground/70 max-w-md">{hint}</p>
        )}
      </CardContent>
    </Card>
  );
}
