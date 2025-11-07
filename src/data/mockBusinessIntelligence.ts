import { Entity } from "@/types/businessIntelligence";

export const mockEntities: Entity[] = [
  {
    cedula_juridica: "3-101-693322",
    nombre: "Servicios Tecnológicos XYZ S.A.",
    domicilio: "San José, Montes de Oca, de la Rotonda de la Bandera 200m norte",
    industria_unspsc: ["721015", "811115"],
    fecha_constitucion: "2018-03-15",
    kpis: {
      estado_tributario: "Al día",
      ccss: "Al día",
      movimientos_rn_12m: 3,
      propiedades: 2,
      vehiculos: 1,
      riesgo: 78,
    },
    ovt: {
      estado_cumplimiento: "Al día",
      actividades_economicas: [
        {
          codigo: "62010",
          descripcion: "Desarrollo y publicación de software",
          desde: "2022-03-01",
        },
        {
          codigo: "62020",
          descripcion: "Consultoría de informática",
          desde: "2018-03-15",
        },
      ],
      regimen_tributario: {
        tipo: "Régimen General",
        desde: "2021-01-01",
      },
      representantes_tributarios: [
        {
          nombre: "Ana María Pérez Solís",
          cargo: "Representante Legal Tributaria",
          cedula: "1-0987-0654",
        },
        {
          nombre: "Carlos Jiménez Mora",
          cargo: "Apoderado Generalísimo",
          cedula: "1-1234-0987",
        },
      ],
      factores_retencion: ["Profesionales", "Alquileres", "Servicios"],
    },
    rn: {
      estado: "Activo",
      objeto_social: "Desarrollo, implementación y comercialización de soluciones tecnológicas, consultoría en sistemas informáticos, venta de hardware y software.",
      movimientos_historicos: [
        {
          fecha: "2025-02-14",
          tipo: "Nombramiento de Gerente General",
          cita: "2025-12345",
          oficina: "Oficina Central San José",
          detalle: "Nombramiento de nuevo gerente general por renuncia del anterior",
        },
        {
          fecha: "2024-10-02",
          tipo: "Aumento de Capital Social",
          cita: "2024-88721",
          oficina: "Oficina Central San José",
          detalle: "Aumento de capital de ₡50,000,000 a ₡150,000,000",
        },
        {
          fecha: "2024-06-18",
          tipo: "Modificación de Domicilio Social",
          cita: "2024-56789",
          oficina: "Oficina Central San José",
          detalle: "Cambio de domicilio social a Montes de Oca",
        },
      ],
    },
    propiedades: [
      {
        finca: "SJ-123456-000",
        titulares: ["Servicios Tecnológicos XYZ S.A."],
        gravamenes: [
          {
            tipo: "Hipoteca",
            fecha: "2024-11-05",
            monto_crc: 85000000,
            acreedor: "Banco Nacional de Costa Rica",
          },
        ],
        anotaciones: [],
        ubicacion: {
          provincia: "San José",
          canton: "Montes de Oca",
          distrito: "San Pedro",
        },
        plano: {
          numero: "P-09876-2020",
          area_m2: 540.2,
        },
        uso: "Oficinas administrativas",
      },
      {
        finca: "SJ-234567-000",
        titulares: ["Servicios Tecnológicos XYZ S.A."],
        gravamenes: [],
        anotaciones: [],
        ubicacion: {
          provincia: "San José",
          canton: "Escazú",
          distrito: "San Rafael",
        },
        plano: {
          numero: "P-11234-2019",
          area_m2: 320.5,
        },
        uso: "Bodega",
      },
    ],
    vehiculos: [
      {
        placa: "BDR954",
        marca: "Toyota",
        modelo: "Hilux",
        year: 2019,
        infracciones_12m: [
          {
            fecha: "2025-03-03",
            tipo: "Exceso de velocidad (20 km/h sobre límite)",
            estado: "Pendiente",
            monto_crc: 72000,
          },
        ],
      },
    ],
    ccss: {
      estado: "Al día",
      ultima_actualizacion: "2025-04-20",
      inscrito_patrono: true,
    },
    ai_summary: "Servicios Tecnológicos XYZ S.A. presenta un perfil de riesgo moderado-bajo (78/100). La empresa mantiene cumplimiento tributario y laboral al día según OVT y CCSS. Registra actividad societaria normal con 3 movimientos en 12 meses, incluyendo aumento de capital reciente. Cuenta con 2 propiedades, una con hipoteca activa del BNCR. Se detecta una infracción de tránsito reciente pendiente de pago. Recomendación: proveedor confiable con historial estable.",
  },
  {
    cedula_juridica: "3-101-845621",
    nombre: "Construcciones y Proyectos ABC Ltda.",
    domicilio: "Heredia, Barva, Centro",
    industria_unspsc: ["301517", "721015"],
    fecha_constitucion: "2015-07-22",
    kpis: {
      estado_tributario: "Incumplido",
      ccss: "Moroso",
      movimientos_rn_12m: 7,
      propiedades: 5,
      vehiculos: 3,
      riesgo: 42,
    },
    ovt: {
      estado_cumplimiento: "Incumplido",
      actividades_economicas: [
        {
          codigo: "43210",
          descripcion: "Instalaciones eléctricas",
          desde: "2015-07-22",
        },
        {
          codigo: "43290",
          descripcion: "Otras instalaciones especializadas",
          desde: "2016-02-10",
        },
      ],
      regimen_tributario: {
        tipo: "Régimen Tradicional",
        desde: "2015-07-22",
      },
      representantes_tributarios: [
        {
          nombre: "Roberto Sánchez Vargas",
          cargo: "Representante Legal",
          cedula: "2-0456-0789",
        },
      ],
      factores_retencion: ["Construcción", "Servicios"],
    },
    rn: {
      estado: "Activo",
      objeto_social: "Construcción de obras civiles, instalaciones eléctricas y mecánicas, consultoría en ingeniería.",
      movimientos_historicos: [
        {
          fecha: "2025-04-12",
          tipo: "Anotación judicial - Embargo preventivo",
          cita: "2025-34567",
          oficina: "Oficina Central Heredia",
          detalle: "Embargo preventivo por demanda laboral",
        },
        {
          fecha: "2025-03-08",
          tipo: "Cambio de Junta Directiva",
          cita: "2025-28901",
          oficina: "Oficina Central Heredia",
        },
        {
          fecha: "2025-01-15",
          tipo: "Revocatoria de Poderes",
          cita: "2025-09876",
          oficina: "Oficina Central Heredia",
        },
        {
          fecha: "2024-11-22",
          tipo: "Nombramiento de Fiscal",
          cita: "2024-95432",
          oficina: "Oficina Central Heredia",
        },
        {
          fecha: "2024-09-30",
          tipo: "Modificación de Capital",
          cita: "2024-81234",
          oficina: "Oficina Central Heredia",
        },
        {
          fecha: "2024-07-14",
          tipo: "Traslado de Domicilio",
          cita: "2024-67890",
          oficina: "Oficina Central Heredia",
        },
        {
          fecha: "2024-05-20",
          tipo: "Otorgamiento de Poderes Especiales",
          cita: "2024-54321",
          oficina: "Oficina Central Heredia",
        },
      ],
    },
    propiedades: [
      {
        finca: "H-345678-000",
        titulares: ["Construcciones y Proyectos ABC Ltda."],
        gravamenes: [
          {
            tipo: "Hipoteca",
            fecha: "2023-05-10",
            monto_crc: 250000000,
            acreedor: "Banco de Costa Rica",
          },
        ],
        anotaciones: [
          {
            tipo: "Embargo",
            fecha: "2025-04-12",
            detalle: "Embargo preventivo por demanda laboral",
          },
        ],
        ubicacion: {
          provincia: "Heredia",
          canton: "Barva",
          distrito: "Barva",
        },
        plano: {
          numero: "H-23456-2015",
          area_m2: 1240.8,
        },
        uso: "Oficinas y bodega",
      },
      {
        finca: "H-456789-000",
        titulares: ["Construcciones y Proyectos ABC Ltda."],
        gravamenes: [],
        anotaciones: [],
        ubicacion: {
          provincia: "Heredia",
          canton: "Santo Domingo",
        },
        plano: {
          numero: "H-34567-2018",
          area_m2: 820.3,
        },
      },
      {
        finca: "A-567890-000",
        titulares: ["Construcciones y Proyectos ABC Ltda."],
        gravamenes: [
          {
            tipo: "Hipoteca",
            fecha: "2024-09-15",
            monto_crc: 180000000,
            acreedor: "BAC San José",
          },
        ],
        anotaciones: [],
        ubicacion: {
          provincia: "Alajuela",
          canton: "Alajuela",
          distrito: "San José",
        },
        plano: {
          numero: "A-45678-2020",
          area_m2: 950.0,
        },
      },
      {
        finca: "H-678901-000",
        titulares: ["Construcciones y Proyectos ABC Ltda.", "Roberto Sánchez Vargas"],
        gravamenes: [],
        anotaciones: [],
        ubicacion: {
          provincia: "Heredia",
          canton: "Barva",
        },
        plano: {
          numero: "H-56789-2017",
          area_m2: 600.2,
        },
      },
      {
        finca: "H-789012-000",
        titulares: ["Construcciones y Proyectos ABC Ltda."],
        gravamenes: [],
        anotaciones: [],
        ubicacion: {
          provincia: "Heredia",
          canton: "San Pablo",
        },
        plano: {
          numero: "H-67890-2019",
          area_m2: 450.5,
        },
      },
    ],
    vehiculos: [
      {
        placa: "CRT123",
        marca: "Mitsubishi",
        modelo: "L200",
        year: 2020,
        infracciones_12m: [
          {
            fecha: "2025-04-10",
            tipo: "Estacionamiento indebido",
            estado: "Pendiente",
            monto_crc: 45000,
          },
          {
            fecha: "2025-02-20",
            tipo: "Exceso de velocidad",
            estado: "Pagada",
            monto_crc: 72000,
          },
        ],
      },
      {
        placa: "DFG456",
        marca: "Isuzu",
        modelo: "D-Max",
        year: 2018,
        infracciones_12m: [],
      },
      {
        placa: "HJK789",
        marca: "Nissan",
        modelo: "Frontier",
        year: 2017,
        infracciones_12m: [
          {
            fecha: "2024-12-05",
            tipo: "Revisión técnica vencida",
            estado: "Pagada",
            monto_crc: 150000,
          },
        ],
      },
    ],
    ccss: {
      estado: "Moroso",
      ultima_actualizacion: "2025-04-18",
      inscrito_patrono: true,
      monto_deuda: 8500000,
    },
    ai_summary: "⚠️ ALTO RIESGO (42/100): Construcciones ABC presenta incumplimiento tributario activo según OVT y morosidad CCSS de ₡8.5M. Se detecta actividad societaria anómala (7 movimientos/12m) incluyendo embargo preventivo reciente (2025-04-12) por demanda laboral. Portafolio de 5 propiedades con 2 hipotecas activas y 1 embargo vigente. Múltiples infracciones vehiculares. NO recomendado como proveedor - solicitar garantías adicionales.",
  },
  {
    cedula_juridica: "3-101-567890",
    nombre: "Distribuidora El Buen Precio S.A.",
    domicilio: "Cartago, Cartago Centro, 100m sur de la Basílica",
    industria_unspsc: ["461012", "781215"],
    fecha_constitucion: "2010-05-12",
    kpis: {
      estado_tributario: "Al día",
      ccss: "Al día",
      movimientos_rn_12m: 1,
      propiedades: 3,
      vehiculos: 5,
      riesgo: 85,
    },
    ovt: {
      estado_cumplimiento: "Al día",
      actividades_economicas: [
        {
          codigo: "46392",
          descripcion: "Venta al por mayor de productos alimenticios",
          desde: "2010-05-12",
        },
        {
          codigo: "47110",
          descripcion: "Venta al por menor en comercios no especializados",
          desde: "2012-08-20",
        },
      ],
      regimen_tributario: {
        tipo: "Régimen General",
        desde: "2010-05-12",
      },
      representantes_tributarios: [
        {
          nombre: "María Fernanda Castro López",
          cargo: "Representante Legal",
          cedula: "3-0234-0567",
        },
      ],
      factores_retencion: ["Alquileres"],
    },
    rn: {
      estado: "Activo",
      objeto_social: "Comercialización, distribución y venta al por mayor y menor de productos alimenticios, bebidas y artículos de consumo masivo.",
      movimientos_historicos: [
        {
          fecha: "2024-08-15",
          tipo: "Nombramiento de Secretario",
          cita: "2024-72345",
          oficina: "Oficina Cartago",
          detalle: "Nombramiento de secretario de junta directiva",
        },
      ],
    },
    propiedades: [
      {
        finca: "C-234567-000",
        titulares: ["Distribuidora El Buen Precio S.A."],
        gravamenes: [],
        anotaciones: [],
        ubicacion: {
          provincia: "Cartago",
          canton: "Cartago",
          distrito: "Oriental",
        },
        plano: {
          numero: "C-12345-2010",
          area_m2: 2800.5,
        },
        uso: "Local comercial y bodega",
      },
      {
        finca: "C-345678-000",
        titulares: ["Distribuidora El Buen Precio S.A."],
        gravamenes: [],
        anotaciones: [],
        ubicacion: {
          provincia: "Cartago",
          canton: "La Unión",
        },
        plano: {
          numero: "C-23456-2015",
          area_m2: 1500.0,
        },
        uso: "Centro de distribución",
      },
      {
        finca: "C-456789-000",
        titulares: ["Distribuidora El Buen Precio S.A."],
        gravamenes: [],
        anotaciones: [],
        ubicacion: {
          provincia: "Cartago",
          canton: "Cartago",
        },
        plano: {
          numero: "C-34567-2018",
          area_m2: 850.0,
        },
        uso: "Oficinas administrativas",
      },
    ],
    vehiculos: [
      {
        placa: "TRP234",
        marca: "Hino",
        modelo: "Serie 300",
        year: 2021,
        infracciones_12m: [],
      },
      {
        placa: "UVW567",
        marca: "Hino",
        modelo: "Serie 300",
        year: 2021,
        infracciones_12m: [],
      },
      {
        placa: "XYZ890",
        marca: "Isuzu",
        modelo: "NQR",
        year: 2019,
        infracciones_12m: [],
      },
      {
        placa: "ABC123",
        marca: "Hyundai",
        modelo: "H100",
        year: 2020,
        infracciones_12m: [],
      },
      {
        placa: "DEF456",
        marca: "Toyota",
        modelo: "Hiace",
        year: 2018,
        infracciones_12m: [
          {
            fecha: "2024-11-15",
            tipo: "Marchamo vencido",
            estado: "Pagada",
            monto_crc: 125000,
          },
        ],
      },
    ],
    ccss: {
      estado: "Al día",
      ultima_actualizacion: "2025-04-22",
      inscrito_patrono: true,
    },
    ai_summary: "✅ BAJO RIESGO (85/100): Distribuidora El Buen Precio es un proveedor confiable con 15 años de operación. Cumplimiento tributario y laboral impecable según OVT y CCSS. Actividad societaria estable (1 movimiento/12m). Portafolio de 3 propiedades libre de gravámenes. Flota de 5 vehículos de distribución con historial limpio. Recomendación: proveedor ideal para contratos de mediano y largo plazo.",
  },
];

export const provinciasCostaRica = [
  "San José",
  "Alajuela",
  "Cartago",
  "Heredia",
  "Guanacaste",
  "Puntarenas",
  "Limón",
];

export const tiposMovimientoRN = [
  "Nombramiento de Gerente General",
  "Nombramiento de Presidente",
  "Nombramiento de Secretario",
  "Nombramiento de Fiscal",
  "Cambio de Junta Directiva",
  "Aumento de Capital Social",
  "Reducción de Capital",
  "Modificación de Capital",
  "Modificación de Domicilio Social",
  "Traslado de Domicilio",
  "Otorgamiento de Poderes Especiales",
  "Otorgamiento de Poderes Generalísimos",
  "Revocatoria de Poderes",
  "Disolución",
  "Fusión",
  "Modificación de Estatutos",
  "Anotación judicial - Embargo preventivo",
  "Anotación judicial - Demanda",
];
