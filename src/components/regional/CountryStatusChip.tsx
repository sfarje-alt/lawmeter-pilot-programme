import { cn } from "@/lib/utils";
import { CountryFlag } from "./CountryFlag";
import type { BetssonCountry } from "@/lib/betssonCountries";

interface CountryStatusChipProps {
  country: BetssonCountry;
  compact?: boolean;
  className?: string;
}

export function CountryStatusChip({
  country,
  compact = false,
  className,
}: CountryStatusChipProps) {
  const isActive = country.status === "active";
  const pillLabel = compact
    ? isActive
      ? "Activo"
      : "En activación"
    : country.statusLabel;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs",
        "bg-white/[0.03] border-white/10",
        className,
      )}
    >
      <CountryFlag country={country.code} size={18} showName />
      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
          isActive
            ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
            : "bg-amber-500/10 text-amber-300/90 border border-amber-500/25",
        )}
      >
        {pillLabel}
      </span>
    </span>
  );
}
