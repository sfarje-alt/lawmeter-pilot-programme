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
    status: "activating",
    statusLabel: "En proceso de activación",
    description:
      "Fuentes, taxonomía y criterios de relevancia pendientes de calibración.",
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
