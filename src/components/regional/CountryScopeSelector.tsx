import { useState } from "react";
import { Globe2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  BETSSON_COUNTRIES,
  type BetssonCountryScope,
} from "@/lib/betssonCountries";
import { CountryFlag } from "./CountryFlag";

interface CountryScopeSelectorProps {
  value: BetssonCountryScope;
  onChange: (scope: BetssonCountryScope) => void;
  className?: string;
}

export function CountryScopeSelector({
  value,
  onChange,
  className,
}: CountryScopeSelectorProps) {
  const { toast } = useToast();

  const handleClick = (next: BetssonCountryScope, disabled: boolean) => {
    if (disabled) {
      toast({
        title: "Jurisdicción en proceso de activación",
        description:
          "Fuentes, taxonomía y criterios de relevancia pendientes de calibración.",
      });
      return;
    }
    onChange(next);
  };

  const btn = (active: boolean, disabled: boolean) =>
    cn(
      "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs transition-colors",
      active
        ? "bg-primary/15 border-primary/40 text-primary"
        : "bg-white/[0.02] border-white/10 text-foreground hover:bg-white/[0.06]",
      disabled && "opacity-40 cursor-not-allowed hover:bg-transparent",
    );

  return (
    <div className={cn("flex items-center gap-1.5 flex-wrap", className)}>
      <button
        type="button"
        onClick={() => handleClick("ALL", false)}
        className={btn(value === "ALL", false)}
        aria-pressed={value === "ALL"}
      >
        <Globe2 className="h-3.5 w-3.5" />
        Todos
      </button>
      {BETSSON_COUNTRIES.map((c) => {
        const disabled = c.status === "activating";
        const active = value === c.code;
        return (
          <button
            key={c.code}
            type="button"
            onClick={() => handleClick(c.code, disabled)}
            className={btn(active, disabled)}
            aria-pressed={active}
            aria-disabled={disabled}
            title={disabled ? "En proceso de activación" : undefined}
          >
            <CountryFlag country={c.code} size={16} showName={false} />
            <span>{c.name}</span>
          </button>
        );
      })}
    </div>
  );
}
