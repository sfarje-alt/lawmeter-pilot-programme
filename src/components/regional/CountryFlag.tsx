import { useState } from "react";
import { cn } from "@/lib/utils";
import peruFlag from "@/assets/flags/peru.svg";
import chileFlag from "@/assets/flags/chile.svg";
import colombiaFlag from "@/assets/flags/colombia.svg";
import argentinaFlag from "@/assets/flags/argentina.svg";
import type { BetssonCountryCode } from "@/lib/betssonCountries";

const FLAG_MAP: Record<BetssonCountryCode, string> = {
  PE: peruFlag,
  CL: chileFlag,
  CO: colombiaFlag,
  AR: argentinaFlag,
};

const NAME_MAP: Record<BetssonCountryCode, string> = {
  PE: "Perú",
  CL: "Chile",
  CO: "Colombia",
  AR: "Argentina",
};

interface CountryFlagProps {
  country: BetssonCountryCode;
  size?: number;
  showName?: boolean;
  className?: string;
}

export function CountryFlag({
  country,
  size = 20,
  showName = true,
  className,
}: CountryFlagProps) {
  const [error, setError] = useState(false);
  const name = NAME_MAP[country];

  return (
    <span className={cn("inline-flex items-center gap-2 leading-none", className)}>
      {!error && (
        <img
          src={FLAG_MAP[country]}
          alt={`Bandera de ${name}`}
          onError={() => setError(true)}
          className="inline-block rounded-[2px] border border-white/10 shadow-sm shrink-0"
          style={{
            width: size,
            height: Math.round((size * 2) / 3),
            objectFit: "cover",
          }}
        />
      )}
      {showName && <span className="text-sm font-medium">{name}</span>}
    </span>
  );
}
