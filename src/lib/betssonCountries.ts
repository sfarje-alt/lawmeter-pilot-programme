export type BetssonCountryCode = "PE" | "CL" | "CO" | "AR";
export type BetssonCountryStatus = "active" | "activating";

export interface BetssonCountry {
  code: BetssonCountryCode;
  name: string;
  status: BetssonCountryStatus;
  statusLabel: string;
  description: string;
}

export const BETSSON_COUNTRIES: BetssonCountry[] = [
  {
    code: "PE",
    name: "Perú",
    status: "active",
    statusLabel: "Activo",
    description: "Monitoreo operativo habilitado.",
  },
  {
    code: "CL",
    name: "Chile",
    status: "active",
    statusLabel: "Activo",
    description:
      "Estructura frontend habilitada para conexión de fuentes y datos.",
  },
  {
    code: "CO",
    name: "Colombia",
    status: "activating",
    statusLabel: "En proceso de activación",
    description:
      "Fuentes, taxonomía y criterios de relevancia pendientes de calibración.",
  },
  {
    code: "AR",
    name: "Argentina",
    status: "activating",
    statusLabel: "En proceso de activación",
    description:
      "Fuentes, taxonomía y criterios de relevancia pendientes de calibración.",
  },
];

export const BETSSON_ACTIVE_COUNTRIES = BETSSON_COUNTRIES.filter(
  (c) => c.status === "active",
);
export const BETSSON_ACTIVATING_COUNTRIES = BETSSON_COUNTRIES.filter(
  (c) => c.status === "activating",
);

/**
 * Country that holds real connected data today. The rest are frontend-only
 * structural placeholders (Chile) or activation-only stubs (Colombia, Argentina).
 */
export const BETSSON_DATA_CONNECTED_COUNTRIES: BetssonCountryCode[] = ["PE"];

export type BetssonCountryScope = "ALL" | BetssonCountryCode;
