import { BillItem } from "@/types/legislation";

export const costaRicaBills: BillItem[] = [
  {
    id: "24001",
    titulo: "Ley de Transparencia en Servicios Financieros Digitales",
    title: "Ley de Transparencia en Servicios Financieros Digitales",
    proposito: "Establecer requisitos de transparencia para bancos y entidades financieras en la comercialización de productos digitales, incluyendo divulgación clara de comisiones, tasas de interés y términos contractuales.",
    tipoProyecto: "Proyecto de Ley",
    estado: "En comisión",
    status: "En comisión",
    fechaPresentacion: "15 ENE, 2025",
    presentationDate: "15 ENE, 2025",
    fechaUltimaAccion: "20 ENE, 2025",
    lastActionDate: "20 ENE, 2025",
    comisionAsignada: "Comisión Permanente de Asuntos Económicos",
    assignedCommission: "Comisión Permanente de Asuntos Económicos",
    categorias: ["Banca", "Protección al Consumidor", "Transformación Digital"],
    categories: ["Banca", "Protección al Consumidor", "Transformación Digital"],
    cartera: "Ministerio de Economía",
    portfolio: "Ministerio de Economía",
    stageLocation: "Comisión de Asuntos Económicos",
    firmantePrincipal: {
      numero: "01",
      numeroDeputado: "01",
      nombre: "Ariel Robles Barrantes",
      partidoPolitico: "Frente Amplio",
      fraccion: "Frente Amplio",
      provincia: "San José",
      edad: 34,
      cedula: "1-1477-0155",
      email: "ariel.robles@asamblea.go.cr",
      telefonos: ["2531 6386", "2531 6387"],
      foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      educacion: [
        "Primaria: Escuela Laboratorio, 2003",
        "Secundaria: Liceo Aeropuerto Jerusalén, 2009",
        "Universitaria: Bachillerato en la Enseñanza del Inglés, Universidad Nacional, 2014",
        "Maestría en Gestión Educativa con Énfasis en Liderazgo (2016) y con Énfasis en Aprendizaje del Inglés (2022), UNA"
      ],
      experienciaLaboral: [
        "2012 - 2016 Comentarista en inglés para la Compañía de Deportes",
        "2015 – 2016 Asistente en el proyecto Promoviendo el Capital Social Comunitario de la UNA, sede Regional Brunca",
        "2016- Profesor en el Programa CI-UNA de la Universidad Nacional, sede Regional Brunca"
      ],
      comisiones: [
        "De Asuntos Agropecuarios",
        "De Ambiente",
        "De Asuntos Municipales y Desarrollo Local Participativo"
      ]
    },
    coProponentes: [
      {
        numero: "12",
        numeroDeputado: "12",
        nombre: "María Fernanda Jiménez",
        partidoPolitico: "Liberación Nacional",
        provincia: "Alajuela",
        edad: 42,
        cedula: "2-0567-0892",
        email: "mf.jimenez@asamblea.go.cr",
        telefonos: ["2531 7001"],
        foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
        educacion: ["Licenciatura en Economía, UCR, 2008"],
        comisiones: ["De Asuntos Económicos"]
      },
      {
        numero: "23",
        numeroDeputado: "23",
        nombre: "Carlos Alvarado Mora",
        partidoPolitico: "Acción Ciudadana",
        provincia: "Cartago",
        edad: 38,
        cedula: "3-0412-0765",
        email: "c.alvarado@asamblea.go.cr",
        telefonos: ["2531 7102"],
        foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
        educacion: ["MBA, INCAE, 2015"],
        comisiones: ["De Asuntos Económicos", "De Ambiente"]
      }
    ],
    resumen: "Reforma integral para garantizar la transparencia en servicios bancarios digitales",
    summary: "Reforma integral para garantizar la transparencia en servicios bancarios digitales",
    puntosImportantes: [
      "Obligación de divulgar todas las comisiones antes de la contratación",
      "Derecho de reversión de transacciones dentro de 24 horas",
      "Prohibición de cambios unilaterales en condiciones contractuales",
      "Sanciones por incumplimiento de hasta ₡50 millones"
    ],
    bullets: [
      "Obligación de divulgar todas las comisiones antes de la contratación",
      "Derecho de reversión de transacciones dentro de 24 horas",
      "Prohibición de cambios unilaterales en condiciones contractuales",
      "Sanciones por incumplimiento de hasta ₡50 millones"
    ],
    nivelRiesgo: "alto",
    puntajeRiesgo: 85,
    risk_level: "high",
    risk_score: 85,
    votingRecords: [
      {
        date: "2025-01-22",
        stage: "Comisión de Asuntos Económicos",
        votesFor: 8,
        votesAgainst: 3,
        abstentions: 1,
        passed: true,
        mpVotes: [
          { mpName: "Ariel Robles Barrantes", party: "Frente Amplio", vote: "for" },
          { mpName: "María Fernanda Jiménez", party: "Liberación Nacional", vote: "for" },
          { mpName: "Carlos Alvarado Mora", party: "Acción Ciudadana", vote: "for" },
        ]
      }
    ],
    stakeholders: [
      {
        name: "Asociación Bancaria Costarricense",
        organization: "Gremio Bancario",
        position: "oppose",
        statement: "Estas disposiciones de transparencia imponen cargas operativas desproporcionadas que afectarán la eficiencia del sector y podrían trasladarse en costos al consumidor."
      },
      {
        name: "Defensoría de los Habitantes",
        organization: "Defensoría Pública",
        position: "support",
        statement: "Aplaudimos esta iniciativa que fortalece los derechos de los consumidores financieros y promueve la transparencia en un sector vital para la economía."
      },
      {
        name: "Instituto Costarricense del Consumidor",
        organization: "Protección al Consumidor",
        position: "support",
        statement: "Esta ley representa un avance significativo en la protección de los derechos de los usuarios de servicios financieros digitales."
      },
      {
        name: "Cámara de Comercio de Costa Rica",
        organization: "Sector Empresarial",
        position: "neutral",
        statement: "Reconocemos la importancia de la transparencia, pero solicitamos plazos razonables para la implementación y claridad en los requisitos técnicos."
      }
    ]
  },
  {
    id: "24002",
    titulo: "Ley de Protección de Datos Personales en el Sector Financiero",
    title: "Ley de Protección de Datos Personales en el Sector Financiero",
    proposito: "Fortalecer la protección de datos personales de clientes bancarios, estableciendo requisitos específicos para el tratamiento, almacenamiento y transferencia de información financiera sensible.",
    tipoProyecto: "Proyecto de Ley",
    estado: "Presentado",
    status: "Presentado",
    fechaPresentacion: "20 ENE, 2025",
    presentationDate: "20 ENE, 2025",
    fechaUltimaAccion: "20 ENE, 2025",
    lastActionDate: "20 ENE, 2025",
    comisionAsignada: "Pendiente",
    assignedCommission: "Pendiente",
    categorias: ["Privacidad", "Banca", "Ciberseguridad"],
    categories: ["Privacidad", "Banca", "Ciberseguridad"],
    cartera: "Ministerio de Ciencia y Tecnología",
    portfolio: "Ministerio de Ciencia y Tecnología",
    stageLocation: "Primera Lectura Pendiente",
    firmantePrincipal: {
      numero: "05",
      numeroDeputado: "05",
      nombre: "Laura Montero Cascante",
      partidoPolitico: "Progreso Social Democrático",
      fraccion: "Progreso Social Democrático",
      provincia: "Heredia",
      edad: 45,
      cedula: "4-0234-0567",
      email: "l.montero@asamblea.go.cr",
      telefonos: ["2531 6500", "2531 6501"],
      foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
      educacion: [
        "Licenciatura en Derecho, Universidad de Costa Rica, 2005",
        "Maestría en Derecho Informático, Universidad Estatal a Distancia, 2010"
      ],
      experienciaLaboral: [
        "2010-2015 Abogada en bufete especializado en derecho digital",
        "2015-2020 Asesora legal en PRODHAB"
      ],
      comisiones: ["De Ciencia y Tecnología", "De Asuntos Jurídicos"]
    },
    coProponentes: [
      {
        numero: "18",
        numeroDeputado: "18",
        nombre: "Roberto Fernández Quesada",
        partidoPolitico: "Nueva República",
        provincia: "San José",
        edad: 51,
        cedula: "1-0823-0445",
        email: "r.fernandez@asamblea.go.cr",
        telefonos: ["2531 7203"],
        foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
        comisiones: ["De Ciencia y Tecnología"]
      }
    ],
    resumen: "Marco regulatorio para proteger datos personales en transacciones financieras",
    summary: "Marco regulatorio para proteger datos personales en transacciones financieras",
    puntosImportantes: [
      "Consentimiento explícito requerido para compartir datos con terceros",
      "Derecho al olvido digital después de finalizar relación contractual",
      "Notificación obligatoria de brechas de seguridad en 72 horas",
      "Auditorías anuales de seguridad obligatorias"
    ],
    bullets: [
      "Consentimiento explícito requerido para compartir datos con terceros",
      "Derecho al olvido digital después de finalizar relación contractual",
      "Notificación obligatoria de brechas de seguridad en 72 horas",
      "Auditorías anuales de seguridad obligatorias"
    ],
    nivelRiesgo: "alto",
    puntajeRiesgo: 90,
    risk_level: "high",
    risk_score: 90,
    votingRecords: [],
    stakeholders: [
      {
        name: "SUGEF",
        organization: "Superintendencia General de Entidades Financieras",
        position: "support",
        statement: "Esta normativa se alinea con las mejores prácticas internacionales de protección de datos y fortalecerá la confianza en el sistema financiero."
      },
      {
        name: "Fundación Acceso",
        organization: "Derechos Digitales",
        position: "support",
        statement: "Es fundamental que Costa Rica cuente con regulaciones robustas de privacidad de datos en el sector financiero. Apoyamos plenamente esta iniciativa."
      },
      {
        name: "Asociación Bancaria Costarricense",
        organization: "Gremio Bancario",
        position: "neutral",
        statement: "Compartimos el objetivo de proteger datos personales, pero requerimos mayor claridad sobre los plazos de implementación y las inversiones tecnológicas necesarias."
      },
      {
        name: "Colegio de Abogados de Costa Rica",
        organization: "Colegio Profesional",
        position: "support",
        statement: "Esta ley fortalece el marco jurídico de protección de datos y está en línea con estándares internacionales como el GDPR europeo."
      }
    ]
  },
  {
    id: "24003",
    titulo: "Ley de Prevención de Lavado de Activos en Criptomonedas",
    title: "Ley de Prevención de Lavado de Activos en Criptomonedas",
    proposito: "Regular las operaciones con criptomonedas y activos digitales en el sistema financiero costarricense, estableciendo medidas de prevención de lavado de activos y financiamiento del terrorismo.",
    tipoProyecto: "Proyecto de Ley",
    estado: "Aprobado en Primer Debate",
    status: "Aprobado en Primer Debate",
    fechaPresentacion: "10 DIC, 2024",
    presentationDate: "10 DIC, 2024",
    fechaUltimaAccion: "28 ENE, 2025",
    lastActionDate: "28 ENE, 2025",
    comisionAsignada: "Comisión Permanente de Asuntos Económicos",
    assignedCommission: "Comisión Permanente de Asuntos Económicos",
    categorias: ["Lavado de Activos", "Criptomonedas", "Regulación Financiera"],
    categories: ["Lavado de Activos", "Criptomonedas", "Regulación Financiera"],
    cartera: "Ministerio de Hacienda",
    portfolio: "Ministerio de Hacienda",
    stageLocation: "Pendiente Segundo Debate",
    firmantePrincipal: {
      numero: "08",
      numeroDeputado: "08",
      nombre: "Diego Vargas Solano",
      partidoPolitico: "Liberación Nacional",
      fraccion: "Liberación Nacional",
      provincia: "Guanacaste",
      edad: 47,
      cedula: "5-0456-0789",
      email: "d.vargas@asamblea.go.cr",
      telefonos: ["2531 6700"],
      foto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
      educacion: [
        "Licenciatura en Economía, Universidad de Costa Rica, 2002",
        "MBA, INCAE Business School, 2007"
      ],
      experienciaLaboral: [
        "2007-2015 Analista económico en Banco Central",
        "2015-2022 Consultor en temas de regulación financiera"
      ],
      comisiones: ["De Asuntos Económicos", "De Hacienda y Presupuesto"]
    },
    coProponentes: [
      {
        numero: "29",
        numeroDeputado: "29",
        nombre: "Ana Gabriela Rojas",
        partidoPolitico: "Restauración Nacional",
        provincia: "Puntarenas",
        edad: 39,
        cedula: "6-0712-0334",
        email: "ag.rojas@asamblea.go.cr",
        telefonos: ["2531 7304"],
        foto: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
        educacion: ["Licenciatura en Administración de Empresas, ULACIT, 2009"],
        comisiones: ["De Asuntos Económicos"]
      },
      {
        numero: "31",
        numeroDeputado: "31",
        nombre: "Fernando Castillo Pérez",
        partidoPolitico: "Unidad Social Cristiana",
        provincia: "Limón",
        edad: 44,
        cedula: "7-0334-0556",
        email: "f.castillo@asamblea.go.cr",
        telefonos: ["2531 7405"],
        foto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
        educacion: ["Licenciatura en Contaduría Pública, UCR, 2006"],
        comisiones: ["De Hacienda y Presupuesto"]
      }
    ],
    resumen: "Regulación integral de criptomonedas para prevenir lavado de dinero",
    summary: "Regulación integral de criptomonedas para prevenir lavado de dinero",
    puntosImportantes: [
      "Registro obligatorio de exchanges de criptomonedas",
      "Reporte de transacciones superiores a $10,000",
      "Verificación KYC obligatoria para todas las operaciones",
      "Prohibición de operaciones con monedas de privacidad extrema"
    ],
    bullets: [
      "Registro obligatorio de exchanges de criptomonedas",
      "Reporte de transacciones superiores a $10,000",
      "Verificación KYC obligatoria para todas las operaciones",
      "Prohibición de operaciones con monedas de privacidad extrema"
    ],
    nivelRiesgo: "alto",
    puntajeRiesgo: 88,
    risk_level: "high",
    risk_score: 88,
    votingRecords: [
      {
        date: "2025-01-12",
        stage: "Comisión de Asuntos Económicos",
        votesFor: 9,
        votesAgainst: 2,
        abstentions: 1,
        passed: true,
        mpVotes: [
          { mpName: "Diego Vargas Solano", party: "Liberación Nacional", vote: "for" },
          { mpName: "Ana Gabriela Rojas", party: "Restauración Nacional", vote: "for" },
          { mpName: "Fernando Castillo Pérez", party: "Unidad Social Cristiana", vote: "for" },
        ]
      },
      {
        date: "2025-01-28",
        stage: "Primer Debate Plenario",
        votesFor: 38,
        votesAgainst: 15,
        abstentions: 4,
        passed: true,
        mpVotes: [
          { mpName: "Diego Vargas Solano", party: "Liberación Nacional", vote: "for" },
          { mpName: "Ana Gabriela Rojas", party: "Restauración Nacional", vote: "for" },
          { mpName: "Fernando Castillo Pérez", party: "Unidad Social Cristiana", vote: "for" },
          { mpName: "Ariel Robles Barrantes", party: "Frente Amplio", vote: "for" },
        ]
      }
    ],
    stakeholders: [
      {
        name: "CONASSIF",
        organization: "Consejo Nacional de Supervisión del Sistema Financiero",
        position: "support",
        statement: "La regulación de criptomonedas es esencial para prevenir el lavado de activos y garantizar la estabilidad del sistema financiero costarricense."
      },
      {
        name: "ICD (Instituto Costarricense sobre Drogas)",
        organization: "Instituto Gubernamental",
        position: "support",
        statement: "Esta ley es fundamental para combatir el uso de criptomonedas en el financiamiento de actividades ilícitas."
      },
      {
        name: "Cámara de Tecnología de Información y Comunicación (CAMTIC)",
        organization: "Sector Tecnológico",
        position: "neutral",
        statement: "Apoyamos la regulación pero advertimos que requisitos muy estrictos podrían frenar la innovación en blockchain y tecnologías emergentes."
      },
      {
        name: "Asociación Bancaria Costarricense",
        organization: "Gremio Bancario",
        position: "support",
        statement: "Es necesario establecer reglas claras para las operaciones con activos digitales y garantizar un campo de juego equilibrado."
      }
    ]
  },
  {
    id: "24004",
    titulo: "Reforma Tributaria para Instituciones Financieras",
    title: "Reforma Tributaria para Instituciones Financieras",
    proposito: "Modernizar el régimen tributario aplicable a bancos y entidades financieras, estableciendo nuevas obligaciones de reporte y ajustando tasas impositivas.",
    tipoProyecto: "Proyecto de Ley",
    estado: "En comisión",
    status: "En comisión",
    fechaPresentacion: "05 ENE, 2025",
    presentationDate: "05 ENE, 2025",
    fechaUltimaAccion: "15 ENE, 2025",
    lastActionDate: "15 ENE, 2025",
    comisionAsignada: "Comisión de Asuntos Hacendarios",
    assignedCommission: "Comisión de Asuntos Hacendarios",
    categorias: ["Tributación", "Banca", "Política Fiscal"],
    categories: ["Tributación", "Banca", "Política Fiscal"],
    cartera: "Ministerio de Hacienda",
    portfolio: "Ministerio de Hacienda",
    stageLocation: "Comisión de Asuntos Hacendarios",
    firmantePrincipal: {
      numero: "14",
      numeroDeputado: "14",
      nombre: "Patricia Villalobos Rojas",
      partidoPolitico: "Acción Ciudadana",
      fraccion: "Acción Ciudadana",
      provincia: "San José",
      edad: 50,
      cedula: "1-0678-0912",
      email: "p.villalobos@asamblea.go.cr",
      telefonos: ["2531 6800"],
      foto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      educacion: [
        "Licenciatura en Contaduría Pública, UCR, 1998",
        "Maestría en Tributación Internacional, Universidad Latina, 2005"
      ],
      experienciaLaboral: [
        "1998-2010 Auditora en Deloitte Costa Rica",
        "2010-2020 Consultora independiente en temas tributarios"
      ],
      comisiones: ["De Hacienda y Presupuesto", "De Asuntos Económicos"]
    },
    coProponentes: [
      {
        numero: "27",
        numeroDeputado: "27",
        nombre: "Esteban Mora Jiménez",
        partidoPolitico: "Liberación Nacional",
        provincia: "Cartago",
        edad: 43,
        cedula: "3-0556-0223",
        email: "e.mora@asamblea.go.cr",
        telefonos: ["2531 7506"],
        foto: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400",
        educacion: ["Licenciatura en Economía, UCR, 2007"],
        comisiones: ["De Hacienda y Presupuesto"]
      }
    ],
    resumen: "Ajustes tributarios para el sector financiero con enfoque en transparencia fiscal",
    summary: "Ajustes tributarios para el sector financiero con enfoque en transparencia fiscal",
    puntosImportantes: [
      "Incremento gradual de tasa impositiva del 30% al 33% en 3 años",
      "Obligación de reportar operaciones internacionales trimestralmente",
      "Impuesto sobre transacciones financieras del 0.05%",
      "Eliminación de exenciones fiscales injustificadas"
    ],
    bullets: [
      "Incremento gradual de tasa impositiva del 30% al 33% en 3 años",
      "Obligación de reportar operaciones internacionales trimestralmente",
      "Impuesto sobre transacciones financieras del 0.05%",
      "Eliminación de exenciones fiscales injustificadas"
    ],
    nivelRiesgo: "medio",
    puntajeRiesgo: 72,
    risk_level: "medium",
    risk_score: 72,
    votingRecords: [
      {
        date: "2025-01-18",
        stage: "Comisión de Asuntos Hacendarios",
        votesFor: 7,
        votesAgainst: 4,
        abstentions: 0,
        passed: true,
        mpVotes: [
          { mpName: "Patricia Villalobos Rojas", party: "Acción Ciudadana", vote: "for" },
          { mpName: "Esteban Mora Jiménez", party: "Liberación Nacional", vote: "for" },
        ]
      }
    ],
    stakeholders: [
      {
        name: "Asociación Bancaria Costarricense",
        organization: "Gremio Bancario",
        position: "oppose",
        statement: "El incremento de la tasa impositiva afectará la competitividad del sector financiero y podría reducir la disponibilidad de crédito para la economía."
      },
      {
        name: "Ministerio de Hacienda",
        organization: "Gobierno Central",
        position: "support",
        statement: "Esta reforma es necesaria para fortalecer las finanzas públicas y garantizar que el sector financiero contribuya equitativamente al desarrollo del país."
      },
      {
        name: "UCCAEP",
        organization: "Unión de Cámaras Empresariales",
        position: "oppose",
        statement: "Los nuevos impuestos sobre transacciones financieras encarecerán el costo del dinero y afectarán negativamente la inversión privada."
      },
      {
        name: "Colegio de Contadores Públicos",
        organization: "Colegio Profesional",
        position: "neutral",
        statement: "Reconocemos la necesidad de modernizar el régimen tributario, pero solicitamos mayor claridad en los requisitos de reporte trimestral."
      }
    ]
  },
  {
    id: "24005",
    titulo: "Ley de Regulación de Fintech y Banca Digital",
    title: "Ley de Regulación de Fintech y Banca Digital",
    proposito: "Crear un marco legal para startups fintech y servicios de banca digital, promoviendo la innovación con supervisión adecuada.",
    tipoProyecto: "Proyecto de Ley",
    estado: "Aprobado en Primer Debate",
    status: "Aprobado en Primer Debate",
    fechaPresentacion: "15 NOV, 2024",
    presentationDate: "15 NOV, 2024",
    fechaUltimaAccion: "25 ENE, 2025",
    lastActionDate: "25 ENE, 2025",
    comisionAsignada: "Comisión de Ciencia y Tecnología",
    assignedCommission: "Comisión de Ciencia y Tecnología",
    categorias: ["Fintech", "Innovación", "Banca Digital"],
    categories: ["Fintech", "Innovación", "Banca Digital"],
    cartera: "Ministerio de Ciencia y Tecnología",
    portfolio: "Ministerio de Ciencia y Tecnología",
    stageLocation: "Pendiente Segundo Debate",
    firmantePrincipal: {
      numero: "09",
      numeroDeputado: "09",
      nombre: "Andrés Jiménez Castro",
      partidoPolitico: "Frente Amplio",
      fraccion: "Frente Amplio",
      provincia: "Alajuela",
      edad: 36,
      cedula: "2-0445-0678",
      email: "a.jimenez@asamblea.go.cr",
      telefonos: ["2531 6900"],
      foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      educacion: [
        "Licenciatura en Ingeniería en Computación, TEC, 2013",
        "Maestría en Administración de Tecnologías de Información, TEC, 2017"
      ],
      experienciaLaboral: [
        "2013-2018 Desarrollador en startup de pagos electrónicos",
        "2018-2022 CTO en empresa fintech costarricense"
      ],
      comisiones: ["De Ciencia y Tecnología", "De Asuntos Económicos"]
    },
    coProponentes: [
      {
        numero: "22",
        numeroDeputado: "22",
        nombre: "Silvia Hernández Mora",
        partidoPolitico: "Acción Ciudadana",
        provincia: "Heredia",
        edad: 41,
        cedula: "4-0667-0445",
        email: "s.hernandez@asamblea.go.cr",
        telefonos: ["2531 7607"],
        foto: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
        educacion: ["MBA con énfasis en Innovación, INCAE, 2012"],
        comisiones: ["De Ciencia y Tecnología"]
      }
    ],
    resumen: "Marco legal para promover innovación fintech con regulación proporcional",
    summary: "Marco legal para promover innovación fintech con regulación proporcional",
    puntosImportantes: [
      "Sandbox regulatorio para startups fintech por 24 meses",
      "Requerimientos de capital reducidos para empresas en fase inicial",
      "Open Banking obligatorio para facilitar competencia",
      "Protección a consumidores de servicios fintech"
    ],
    bullets: [
      "Sandbox regulatorio para startups fintech por 24 meses",
      "Requerimientos de capital reducidos para empresas en fase inicial",
      "Open Banking obligatorio para facilitar competencia",
      "Protección a consumidores de servicios fintech"
    ],
    nivelRiesgo: "medio",
    puntajeRiesgo: 68,
    risk_level: "medium",
    risk_score: 68,
    votingRecords: [
      {
        date: "2024-12-05",
        stage: "Comisión de Ciencia y Tecnología",
        votesFor: 10,
        votesAgainst: 1,
        abstentions: 1,
        passed: true,
        mpVotes: [
          { mpName: "Andrés Jiménez Castro", party: "Frente Amplio", vote: "for" },
          { mpName: "Silvia Hernández Mora", party: "Acción Ciudadana", vote: "for" },
        ]
      },
      {
        date: "2025-01-25",
        stage: "Primer Debate Plenario",
        votesFor: 41,
        votesAgainst: 10,
        abstentions: 6,
        passed: true,
        mpVotes: [
          { mpName: "Andrés Jiménez Castro", party: "Frente Amplio", vote: "for" },
          { mpName: "Silvia Hernández Mora", party: "Acción Ciudadana", vote: "for" },
          { mpName: "Laura Montero Cascante", party: "Progreso Social Democrático", vote: "for" },
        ]
      }
    ],
    stakeholders: [
      {
        name: "CAMTIC",
        organization: "Cámara de Tecnología",
        position: "support",
        statement: "Esta ley es un paso fundamental para posicionar a Costa Rica como hub de innovación fintech en América Latina."
      },
      {
        name: "SUGEF",
        organization: "Superintendencia General de Entidades Financieras",
        position: "support",
        statement: "El sandbox regulatorio permitirá innovar con supervisión adecuada, equilibrando desarrollo tecnológico y protección al consumidor."
      },
      {
        name: "Asociación Bancaria Costarricense",
        organization: "Gremio Bancario",
        position: "neutral",
        statement: "Apoyamos la innovación pero solicitamos garantías de que el Open Banking respete la seguridad de datos y la privacidad de clientes."
      },
      {
        name: "Cámara de Comercio de Costa Rica",
        organization: "Sector Empresarial",
        position: "support",
        statement: "La regulación fintech promoverá la competencia y mejorará el acceso a financiamiento para pequeñas y medianas empresas."
      }
    ]
  },
  {
    id: "24006",
    titulo: "Reforma al Código de Trabajo - Derechos Laborales en Sector Bancario",
    title: "Reforma al Código de Trabajo - Derechos Laborales en Sector Bancario",
    proposito: "Actualizar normas laborales específicas para el sector bancario, considerando teletrabajo y nuevas modalidades de empleo.",
    tipoProyecto: "Proyecto de Ley",
    estado: "Presentado",
    status: "Presentado",
    fechaPresentacion: "22 ENE, 2025",
    presentationDate: "22 ENE, 2025",
    fechaUltimaAccion: "22 ENE, 2025",
    lastActionDate: "22 ENE, 2025",
    comisionAsignada: "Comisión de Asuntos Sociales",
    assignedCommission: "Comisión de Asuntos Sociales",
    categorias: ["Derecho Laboral", "Banca", "Teletrabajo"],
    categories: ["Derecho Laboral", "Banca", "Teletrabajo"],
    cartera: "Ministerio de Trabajo",
    portfolio: "Ministerio de Trabajo",
    stageLocation: "Primera Lectura Pendiente",
    firmantePrincipal: {
      numero: "16",
      numeroDeputado: "16",
      nombre: "Gabriela Soto Ramírez",
      partidoPolitico: "Liberación Nacional",
      fraccion: "Liberación Nacional",
      provincia: "San José",
      edad: 48,
      cedula: "1-0789-0334",
      email: "g.soto@asamblea.go.cr",
      telefonos: ["2531 7000"],
      foto: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400",
      educacion: [
        "Licenciatura en Derecho, UCR, 2001",
        "Especialización en Derecho Laboral, Universidad de Salamanca, 2006"
      ],
      experienciaLaboral: [
        "2001-2010 Abogada laboralista en bufete privado",
        "2010-2020 Asesora legal del Ministerio de Trabajo"
      ],
      comisiones: ["De Asuntos Sociales", "De Asuntos Jurídicos"]
    },
    coProponentes: [
      {
        numero: "33",
        numeroDeputado: "33",
        nombre: "Manuel Solís Vargas",
        partidoPolitico: "Frente Amplio",
        provincia: "Cartago",
        edad: 37,
        cedula: "3-0889-0556",
        email: "m.solis@asamblea.go.cr",
        telefonos: ["2531 7708"],
        foto: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400",
        educacion: ["Licenciatura en Trabajo Social, UCR, 2012"],
        comisiones: ["De Asuntos Sociales"]
      }
    ],
    resumen: "Actualización de normativa laboral para sector bancario incluyendo teletrabajo",
    summary: "Actualización de normativa laboral para sector bancario incluyendo teletrabajo",
    puntosImportantes: [
      "Derecho a desconexión digital fuera del horario laboral",
      "Regulación de jornadas mixtas presenciales y remotas",
      "Obligación del empleador de proveer equipos para teletrabajo",
      "Protección contra despido durante implementación de teletrabajo"
    ],
    bullets: [
      "Derecho a desconexión digital fuera del horario laboral",
      "Regulación de jornadas mixtas presenciales y remotas",
      "Obligación del empleador de proveer equipos para teletrabajo",
      "Protección contra despido durante implementación de teletrabajo"
    ],
    nivelRiesgo: "medio",
    puntajeRiesgo: 65,
    risk_level: "medium",
    risk_score: 65,
    votingRecords: [],
    stakeholders: [
      {
        name: "ANEP",
        organization: "Asociación Nacional de Empleados Públicos",
        position: "support",
        statement: "Los derechos laborales deben adaptarse a las nuevas realidades del trabajo digital. Esta ley protege a trabajadores bancarios en modalidades remotas."
      },
      {
        name: "Asociación Bancaria Costarricense",
        organization: "Gremio Bancario",
        position: "neutral",
        statement: "Reconocemos la necesidad de regular el teletrabajo, pero requerimos flexibilidad para implementar modelos híbridos eficientes."
      },
      {
        name: "Ministerio de Trabajo",
        organization: "Gobierno Central",
        position: "support",
        statement: "Esta reforma actualiza el marco laboral para garantizar condiciones dignas en las nuevas modalidades de trabajo del sector financiero."
      },
      {
        name: "UCCAEP",
        organization: "Unión de Cámaras Empresariales",
        position: "oppose",
        statement: "Las disposiciones sobre provisión de equipos y restricciones de jornada aumentarán significativamente los costos operativos del sector."
      }
    ]
  },
  {
    id: "24007",
    titulo: "Ley de Transparencia en Operaciones Financieras Internacionales",
    title: "Ley de Transparencia en Operaciones Financieras Internacionales",
    proposito: "Fortalecer los mecanismos de reporte y transparencia en operaciones financieras internacionales para combatir evasión fiscal.",
    tipoProyecto: "Proyecto de Ley",
    estado: "En comisión",
    status: "En comisión",
    fechaPresentacion: "12 DIC, 2024",
    presentationDate: "12 DIC, 2024",
    fechaUltimaAccion: "18 ENE, 2025",
    lastActionDate: "18 ENE, 2025",
    comisionAsignada: "Comisión de Asuntos Hacendarios",
    assignedCommission: "Comisión de Asuntos Hacendarios",
    categorias: ["Transparencia Fiscal", "Banca Internacional", "Cumplimiento"],
    categories: ["Transparencia Fiscal", "Banca Internacional", "Cumplimiento"],
    cartera: "Ministerio de Hacienda",
    portfolio: "Ministerio de Hacienda",
    stageLocation: "Comisión de Asuntos Hacendarios",
    firmantePrincipal: {
      numero: "19",
      numeroDeputado: "19",
      nombre: "Ricardo Campos Monge",
      partidoPolitico: "Unidad Social Cristiana",
      fraccion: "Unidad Social Cristiana",
      provincia: "Puntarenas",
      edad: 52,
      cedula: "6-0445-0778",
      email: "r.campos@asamblea.go.cr",
      telefonos: ["2531 7100"],
      foto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
      educacion: [
        "Licenciatura en Administración de Empresas, UCR, 1997",
        "Maestría en Finanzas Internacionales, Georgetown University, 2003"
      ],
      experienciaLaboral: [
        "1997-2005 Analista financiero en banco internacional",
        "2005-2020 Director financiero en empresa exportadora"
      ],
      comisiones: ["De Hacienda y Presupuesto", "De Relaciones Internacionales"]
    },
    coProponentes: [
      {
        numero: "25",
        numeroDeputado: "25",
        nombre: "Luisa Cordero Vargas",
        partidoPolitico: "Acción Ciudadana",
        provincia: "Limón",
        edad: 46,
        cedula: "7-0556-0889",
        email: "l.cordero@asamblea.go.cr",
        telefonos: ["2531 7809"],
        foto: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400",
        educacion: ["Licenciatura en Derecho Tributario, UCR, 2004"],
        comisiones: ["De Hacienda y Presupuesto"]
      }
    ],
    resumen: "Implementación de estándares internacionales de transparencia fiscal",
    summary: "Implementación de estándares internacionales de transparencia fiscal",
    puntosImportantes: [
      "Adhesión a estándar FATCA y CRS para intercambio automático de información",
      "Reporte obligatorio de cuentas bancarias de residentes en el extranjero",
      "Identificación de beneficiario final en todas las transacciones internacionales",
      "Sanciones de hasta ₡100 millones por incumplimiento de reporte"
    ],
    bullets: [
      "Adhesión a estándar FATCA y CRS para intercambio automático de información",
      "Reporte obligatorio de cuentas bancarias de residentes en el extranjero",
      "Identificación de beneficiario final en todas las transacciones internacionales",
      "Sanciones de hasta ₡100 millones por incumplimiento de reporte"
    ],
    nivelRiesgo: "alto",
    puntajeRiesgo: 82,
    risk_level: "high",
    risk_score: 82,
    votingRecords: [
      {
        date: "2025-01-20",
        stage: "Comisión de Asuntos Hacendarios",
        votesFor: 8,
        votesAgainst: 3,
        abstentions: 0,
        passed: true,
        mpVotes: [
          { mpName: "Ricardo Campos Monge", party: "Unidad Social Cristiana", vote: "for" },
          { mpName: "Luisa Cordero Vargas", party: "Acción Ciudadana", vote: "for" },
        ]
      }
    ],
    stakeholders: [
      {
        name: "Ministerio de Hacienda",
        organization: "Gobierno Central",
        position: "support",
        statement: "La adhesión a estándares internacionales de transparencia fiscal es esencial para combatir la evasión y fortalecer la credibilidad del país."
      },
      {
        name: "Asociación Bancaria Costarricense",
        organization: "Gremio Bancario",
        position: "neutral",
        statement: "Apoyamos la transparencia fiscal pero requerimos tiempo y recursos para implementar los sistemas de reporte automático de información."
      },
      {
        name: "Colegio de Contadores Públicos",
        organization: "Colegio Profesional",
        position: "support",
        statement: "Esta ley alinea a Costa Rica con mejores prácticas internacionales y fortalecerá la lucha contra la evasión fiscal transfronteriza."
      },
      {
        name: "UCCAEP",
        organization: "Unión de Cámaras Empresariales",
        position: "neutral",
        statement: "Entendemos la importancia de la transparencia, pero preocupa el impacto en la competitividad y la confidencialidad de información comercial sensible."
      }
    ]
  },
  {
    id: "24008",
    titulo: "Ley de Educación Financiera y Protección al Consumidor Bancario",
    title: "Ley de Educación Financiera y Protección al Consumidor Bancario",
    proposito: "Establecer programas de educación financiera y fortalecer los derechos de consumidores de servicios bancarios.",
    tipoProyecto: "Proyecto de Ley",
    estado: "Aprobado en Segundo Debate",
    status: "Aprobado en Segundo Debate",
    fechaPresentacion: "08 OCT, 2024",
    presentationDate: "08 OCT, 2024",
    fechaUltimaAccion: "30 ENE, 2025",
    lastActionDate: "30 ENE, 2025",
    comisionAsignada: "Comisión de Educación",
    assignedCommission: "Comisión de Educación",
    categorias: ["Educación Financiera", "Protección al Consumidor", "Inclusión Financiera"],
    categories: ["Educación Financiera", "Protección al Consumidor", "Inclusión Financiera"],
    cartera: "Ministerio de Educación",
    portfolio: "Ministerio de Educación",
    stageLocation: "Pendiente Sanción Ejecutiva",
    firmantePrincipal: {
      numero: "11",
      numeroDeputado: "11",
      nombre: "Carolina Hidalgo Herrera",
      partidoPolitico: "Acción Ciudadana",
      fraccion: "Acción Ciudadana",
      provincia: "Heredia",
      edad: 40,
      cedula: "4-0334-0667",
      email: "c.hidalgo@asamblea.go.cr",
      telefonos: ["2531 7200"],
      foto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
      educacion: [
        "Licenciatura en Educación, Universidad Nacional, 2010",
        "Maestría en Administración Educativa, UNED, 2015"
      ],
      experienciaLaboral: [
        "2010-2018 Docente de secundaria en educación pública",
        "2018-2022 Coordinadora de programas educativos en MEP"
      ],
      comisiones: ["De Educación, Ciencia y Tecnología", "De Asuntos Sociales"]
    },
    coProponentes: [
      {
        numero: "28",
        numeroDeputado: "28",
        nombre: "Jorge Rojas Paniagua",
        partidoPolitico: "Liberación Nacional",
        provincia: "Guanacaste",
        edad: 44,
        cedula: "5-0667-0334",
        email: "j.rojas@asamblea.go.cr",
        telefonos: ["2531 7910"],
        foto: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400",
        educacion: ["Licenciatura en Economía, UCR, 2006"],
        comisiones: ["De Educación, Ciencia y Tecnología"]
      }
    ],
    resumen: "Programa nacional de educación financiera y fortalecimiento de derechos del consumidor",
    summary: "Programa nacional de educación financiera y fortalecimiento de derechos del consumidor",
    puntosImportantes: [
      "Inclusión de educación financiera en currículo escolar desde primaria",
      "Creación de Centro Nacional de Educación Financiera",
      "Derecho a información clara sobre productos financieros",
      "Procedimientos simplificados para resolución de conflictos con bancos"
    ],
    bullets: [
      "Inclusión de educación financiera en currículo escolar desde primaria",
      "Creación de Centro Nacional de Educación Financiera",
      "Derecho a información clara sobre productos financieros",
      "Procedimientos simplificados para resolución de conflictos con bancos"
    ],
    nivelRiesgo: "bajo",
    puntajeRiesgo: 45,
    risk_level: "low",
    risk_score: 45,
    votingRecords: [
      {
        date: "2024-11-15",
        stage: "Comisión de Educación",
        votesFor: 11,
        votesAgainst: 0,
        abstentions: 1,
        passed: true,
        mpVotes: [
          { mpName: "Carolina Hidalgo Herrera", party: "Acción Ciudadana", vote: "for" },
          { mpName: "Jorge Rojas Paniagua", party: "Liberación Nacional", vote: "for" },
        ]
      },
      {
        date: "2025-01-18",
        stage: "Primer Debate Plenario",
        votesFor: 48,
        votesAgainst: 3,
        abstentions: 6,
        passed: true,
        mpVotes: [
          { mpName: "Carolina Hidalgo Herrera", party: "Acción Ciudadana", vote: "for" },
          { mpName: "Jorge Rojas Paniagua", party: "Liberación Nacional", vote: "for" },
          { mpName: "Ariel Robles Barrantes", party: "Frente Amplio", vote: "for" },
        ]
      },
      {
        date: "2025-01-30",
        stage: "Segundo Debate Plenario",
        votesFor: 46,
        votesAgainst: 2,
        abstentions: 9,
        passed: true,
        mpVotes: [
          { mpName: "Carolina Hidalgo Herrera", party: "Acción Ciudadana", vote: "for" },
          { mpName: "Jorge Rojas Paniagua", party: "Liberación Nacional", vote: "for" },
          { mpName: "Mónica Varela Solís", party: "Frente Amplio", vote: "for" },
        ]
      }
    ],
    stakeholders: [
      {
        name: "Ministerio de Educación Pública",
        organization: "Gobierno Central",
        position: "support",
        statement: "La educación financiera es fundamental para formar ciudadanos capaces de tomar decisiones económicas informadas."
      },
      {
        name: "Instituto Costarricense del Consumidor",
        organization: "Protección al Consumidor",
        position: "support",
        statement: "Esta ley empoderará a los consumidores con conocimientos para navegar el sistema financiero y defender sus derechos."
      },
      {
        name: "Asociación Bancaria Costarricense",
        organization: "Gremio Bancario",
        position: "support",
        statement: "Bancos tendrán clientes más informados que toman mejores decisiones financieras. Apoyamos esta iniciativa de educación."
      },
      {
        name: "Defensoría de los Habitantes",
        organization: "Defensoría Pública",
        position: "support",
        statement: "La educación financiera y los mecanismos simplificados de resolución de conflictos fortalecen significativamente los derechos del consumidor."
      }
    ]
  },
  {
    id: "24009",
    titulo: "Ley de Inclusión Financiera Digital",
    title: "Ley de Inclusión Financiera Digital",
    proposito: "Promover el acceso universal a servicios financieros digitales, especialmente en zonas rurales y poblaciones vulnerables.",
    tipoProyecto: "Proyecto de Ley",
    estado: "En comisión",
    status: "En comisión",
    fechaPresentacion: "18 ENE, 2025",
    presentationDate: "18 ENE, 2025",
    fechaUltimaAccion: "23 ENE, 2025",
    lastActionDate: "23 ENE, 2025",
    comisionAsignada: "Comisión de Asuntos Sociales",
    assignedCommission: "Comisión de Asuntos Sociales",
    categorias: ["Inclusión Financiera", "Digitalización", "Desarrollo Social"],
    categories: ["Inclusión Financiera", "Digitalización", "Desarrollo Social"],
    cartera: "Ministerio de Desarrollo Humano e Inclusión Social",
    portfolio: "Ministerio de Desarrollo Humano e Inclusión Social",
    stageLocation: "Comisión de Asuntos Sociales",
    firmantePrincipal: {
      numero: "20",
      numeroDeputado: "20",
      nombre: "Mónica Varela Solís",
      partidoPolitico: "Frente Amplio",
      fraccion: "Frente Amplio",
      provincia: "Limón",
      edad: 39,
      cedula: "7-0445-0889",
      email: "m.varela@asamblea.go.cr",
      telefonos: ["2531 7300"],
      foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      educacion: [
        "Licenciatura en Trabajo Social, UCR, 2011",
        "Maestría en Políticas Públicas, UCR, 2016"
      ],
      experienciaLaboral: [
        "2011-2018 Trabajadora social en IMAS",
        "2018-2022 Directora de programas de inclusión social en ONG"
      ],
      comisiones: ["De Asuntos Sociales", "De Asuntos Municipales"]
    },
    coProponentes: [
      {
        numero: "30",
        numeroDeputado: "30",
        nombre: "Alberto Fonseca Morales",
        partidoPolitico: "Acción Ciudadana",
        provincia: "Puntarenas",
        edad: 35,
        cedula: "6-0778-0445",
        email: "a.fonseca@asamblea.go.cr",
        telefonos: ["2531 8011"],
        foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        educacion: ["Licenciatura en Sociología, UNA, 2015"],
        comisiones: ["De Asuntos Sociales"]
      }
    ],
    resumen: "Programa integral de acceso a servicios financieros digitales para todos",
    summary: "Programa integral de acceso a servicios financieros digitales para todos",
    puntosImportantes: [
      "Subvención para conectividad en zonas rurales sin acceso bancario",
      "Cuentas básicas digitales gratuitas para población vulnerable",
      "Capacitación en uso de servicios financieros digitales",
      "Incentivos fiscales para bancos que expandan servicios en zonas rurales"
    ],
    bullets: [
      "Subvención para conectividad en zonas rurales sin acceso bancario",
      "Cuentas básicas digitales gratuitas para población vulnerable",
      "Capacitación en uso de servicios financieros digitales",
      "Incentivos fiscales para bancos que expandan servicios en zonas rurales"
    ],
    nivelRiesgo: "bajo",
    puntajeRiesgo: 50,
    risk_level: "low",
    risk_score: 50,
    votingRecords: [
      {
        date: "2025-01-25",
        stage: "Comisión de Asuntos Sociales",
        votesFor: 9,
        votesAgainst: 1,
        abstentions: 2,
        passed: true,
        mpVotes: [
          { mpName: "Mónica Varela Solís", party: "Frente Amplio", vote: "for" },
          { mpName: "Alberto Fonseca Morales", party: "Acción Ciudadana", vote: "for" },
        ]
      }
    ],
    stakeholders: [
      {
        name: "MICITT",
        organization: "Ministerio de Ciencia, Innovación, Tecnología y Telecomunicaciones",
        position: "support",
        statement: "La inclusión financiera digital es clave para reducir la brecha digital y promover el desarrollo equitativo en todo el territorio nacional."
      },
      {
        name: "Asociación Bancaria Costarricense",
        organization: "Gremio Bancario",
        position: "support",
        statement: "Los incentivos fiscales para expansión rural son bienvenidos. Estamos comprometidos con ampliar el acceso a servicios financieros digitales."
      },
      {
        name: "IMAS",
        organization: "Instituto Mixto de Ayuda Social",
        position: "support",
        statement: "Las cuentas básicas gratuitas para población vulnerable permitirán que más personas accedan a servicios financieros y programas sociales digitales."
      },
      {
        name: "Defensoría de los Habitantes",
        organization: "Defensoría Pública",
        position: "support",
        statement: "Esta ley promueve la igualdad de oportunidades al garantizar acceso financiero para poblaciones históricamente excluidas."
      }
    ]
  },
  {
    id: "24010",
    titulo: "Ley de Responsabilidad Social y Ambiental para el Sector Financiero",
    title: "Ley de Responsabilidad Social y Ambiental para el Sector Financiero",
    proposito: "Establecer requisitos de sostenibilidad ambiental y responsabilidad social corporativa para bancos y entidades financieras.",
    tipoProyecto: "Proyecto de Ley",
    estado: "Presentado",
    status: "Presentado",
    fechaPresentacion: "25 ENE, 2025",
    presentationDate: "25 ENE, 2025",
    fechaUltimaAccion: "25 ENE, 2025",
    lastActionDate: "25 ENE, 2025",
    comisionAsignada: "Comisión de Ambiente",
    assignedCommission: "Comisión de Ambiente",
    categorias: ["Sostenibilidad", "ESG", "Responsabilidad Corporativa"],
    categories: ["Sostenibilidad", "ESG", "Responsabilidad Corporativa"],
    cartera: "Ministerio de Ambiente y Energía",
    portfolio: "Ministerio de Ambiente y Energía",
    stageLocation: "Primera Lectura Pendiente",
    firmantePrincipal: {
      numero: "13",
      numeroDeputado: "13",
      nombre: "Rodrigo Arias Sánchez",
      partidoPolitico: "Liberación Nacional",
      fraccion: "Liberación Nacional",
      provincia: "Alajuela",
      edad: 41,
      cedula: "2-0556-0779",
      email: "r.arias@asamblea.go.cr",
      telefonos: ["2531 7400"],
      foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      educacion: [
        "Licenciatura en Ciencias Ambientales, UNA, 2009",
        "Maestría en Desarrollo Sostenible, UCR, 2014"
      ],
      experienciaLaboral: [
        "2009-2016 Investigador en temas de cambio climático",
        "2016-2022 Consultor ambiental para sector privado"
      ],
      comisiones: ["De Ambiente", "De Asuntos Agropecuarios"]
    },
    coProponentes: [
      {
        numero: "26",
        numeroDeputado: "26",
        nombre: "Karina Bolaños Esquivel",
        partidoPolitico: "Acción Ciudadana",
        provincia: "San José",
        edad: 38,
        cedula: "1-0667-0993",
        email: "k.bolanos@asamblea.go.cr",
        telefonos: ["2531 8112"],
        foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
        educacion: ["Licenciatura en Gestión Ambiental, EARTH, 2011"],
        comisiones: ["De Ambiente"]
      }
    ],
    resumen: "Marco de sostenibilidad ESG para operaciones financieras en Costa Rica",
    summary: "Marco de sostenibilidad ESG para operaciones financieras en Costa Rica",
    puntosImportantes: [
      "Evaluación de impacto ambiental obligatoria para créditos grandes",
      "Requisitos de divulgación de huella de carbono de portafolio de inversiones",
      "Incentivos para financiamiento de proyectos sostenibles",
      "Prohibición de financiar proyectos con alto impacto ambiental negativo"
    ],
    bullets: [
      "Evaluación de impacto ambiental obligatoria para créditos grandes",
      "Requisitos de divulgación de huella de carbono de portafolio de inversiones",
      "Incentivos para financiamiento de proyectos sostenibles",
      "Prohibición de financiar proyectos con alto impacto ambiental negativo"
    ],
    nivelRiesgo: "medio",
    puntajeRiesgo: 60,
    risk_level: "medium",
    risk_score: 60,
    votingRecords: [],
    stakeholders: [
      {
        name: "Ministerio de Ambiente y Energía",
        organization: "Gobierno Central",
        position: "support",
        statement: "El sector financiero debe alinear sus operaciones con los compromisos climáticos del país y promover el financiamiento sostenible."
      },
      {
        name: "Asociación Bancaria Costarricense",
        organization: "Gremio Bancario",
        position: "neutral",
        statement: "Compartimos el compromiso con la sostenibilidad, pero requerimos metodologías claras y plazos razonables para evaluar huella de carbono de portafolios."
      },
      {
        name: "Cámara Costarricense de la Construcción",
        organization: "Sector Construcción",
        position: "oppose",
        statement: "La prohibición absoluta de financiar ciertos proyectos podría paralizar desarrollos importantes para la economía y el empleo."
      },
      {
        name: "Fundación para el Desarrollo Sostenible",
        organization: "ONG Ambiental",
        position: "support",
        statement: "Costa Rica debe liderar en finanzas sostenibles. Esta ley es un paso importante hacia una economía verde y resiliente al clima."
      }
    ]
  }
];
