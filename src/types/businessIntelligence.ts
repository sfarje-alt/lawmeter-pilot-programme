export interface Entity {
  cedula_juridica: string;
  nombre: string;
  logo?: string;
  domicilio: string;
  industria_unspsc?: string[];
  fecha_constitucion?: string;
  kpis: EntityKPIs;
  ovt?: OVTData;
  rn?: RNData;
  propiedades?: Property[];
  vehiculos?: Vehicle[];
  ccss?: CCSSData;
  ai_summary?: string;
}

export interface EntityKPIs {
  estado_tributario: "Al día" | "Incumplido" | "Desconocido";
  ccss: "Al día" | "Moroso" | "N/A";
  movimientos_rn_12m: number;
  propiedades: number;
  vehiculos: number;
  riesgo: number; // 0-100
}

export interface OVTData {
  estado_cumplimiento: "Al día" | "Incumplido" | "Desconocido";
  actividades_economicas: Array<{
    codigo: string;
    descripcion: string;
    desde: string;
  }>;
  regimen_tributario: {
    tipo: string;
    desde: string;
  };
  representantes_tributarios: Array<{
    nombre: string;
    cargo: string;
    cedula?: string;
  }>;
  factores_retencion: string[];
}

export interface RNData {
  estado: "Activo" | "Inactivo" | "Cancelado";
  objeto_social: string;
  movimientos_historicos: RNMovement[];
}

export interface RNMovement {
  fecha: string;
  tipo: string;
  cita: string;
  enlace_documento?: string;
  oficina?: string;
  detalle?: string;
}

export interface Property {
  finca: string;
  titulares: string[];
  gravamenes: Array<{
    tipo: string;
    fecha: string;
    monto_crc?: number;
    acreedor?: string;
  }>;
  anotaciones: Array<{
    tipo: string;
    fecha: string;
    detalle?: string;
  }>;
  ubicacion: {
    provincia: string;
    canton: string;
    distrito?: string;
  };
  plano?: {
    numero: string;
    area_m2: number;
  };
  uso?: string;
}

export interface Vehicle {
  placa: string;
  marca: string;
  modelo: string;
  year: number;
  infracciones_12m: Array<{
    fecha: string;
    tipo: string;
    estado: "Pendiente" | "Pagada" | "Prescrita";
    monto_crc?: number;
  }>;
}

export interface CCSSData {
  estado: "Al día" | "Moroso" | "N/A";
  ultima_actualizacion: string;
  inscrito_patrono: boolean;
  monto_deuda?: number;
}

export interface SearchFilters {
  estado_tributario?: ("Al día" | "Incumplido" | "Desconocido")[];
  ccss?: ("Al día" | "Moroso")[];
  tipo_movimiento_rn?: string[];
  gravamenes?: boolean;
  infracciones_12m?: boolean;
  provincia?: string[];
  canton?: string[];
  fecha_desde?: string;
  fecha_hasta?: string;
}

export interface AlertConfig {
  entity_id: string;
  tipos: Array<"RN" | "OVT" | "CCSS" | "Propiedades" | "Cosevi">;
  frecuencia: "instantaneo" | "diario" | "semanal";
  canal: "in-app" | "email" | "ambos";
  condiciones?: {
    movimiento_rn?: boolean;
    cambio_cumplimiento?: boolean;
    nuevo_gravamen?: boolean;
    nueva_infraccion?: boolean;
  };
}
