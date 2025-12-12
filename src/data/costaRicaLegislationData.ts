// Datos mock de Costa Rica - Sistema jurídico correcto (Estado unitario)
import { 
  CostaRicaLegislationItem, 
  generarCalificadorEstado,
  ETAPAS_PROCESO_LEGISLATIVO_CR
} from "@/types/costaRicaLegislation";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";

// ========== 10 ALERTAS MOCK PARA COSTA RICA ==========
// 4 Proyectos de Ley (distintas etapas, 2 con posibilidad de veto)
// 3 Instrumentos del Poder Ejecutivo
// 2 Municipales (con provincia y cantón)
// 1 Regulatoria/Institucional

export const costaRicaLegislationData: CostaRicaLegislationItem[] = [
  // ========== PROYECTOS DE LEY (4) ==========
  {
    id: "cr-proy-001",
    identificador: "Expediente N.º 24.123",
    titulo: "Proyecto de Ley de Ciberseguridad Nacional",
    resumen: "Establece el marco jurídico para la protección de infraestructura crítica digital del Estado y la coordinación interinstitucional ante incidentes cibernéticos.",
    puntosImportantes: [
      "Creación de la Agencia Nacional de Ciberseguridad",
      "Obligación de reporte de incidentes en 72 horas",
      "Certificación obligatoria para proveedores críticos",
      "Régimen sancionatorio por incumplimiento"
    ],
    tipoNorma: "proyecto_ley",
    tipoEmisor: "legislativo",
    nivel: "nacional",
    organoEmisor: "Asamblea Legislativa",
    organoCompetente: "MICIT / Agencia de Ciberseguridad (propuesta)",
    comisionLegislativa: "Comisión de Ciencia y Tecnología",
    estado: "dictamen_comision",
    estadoGenerico: "en_tramite",
    indiceEtapaActual: 2,
    fechaPresentacion: "2024-09-15",
    fechaDictamenComision: "2025-01-20",
    categoria: "Cybersecurity",
    sector: "Tecnología y Telecomunicaciones",
    obligacionesAfectadas: ["Notificación de brechas", "Auditorías de seguridad", "Planes de continuidad"],
    plazosTransitorios: "18 meses para adecuación de sistemas una vez aprobada la ley",
    nivelRiesgo: "alto",
    puntajeRiesgo: 88,
    resumenIA: {
      cambiosPropuestos: "Si se aprueba, obligaría a empresas con infraestructura crítica a implementar controles de ciberseguridad certificados y reportar incidentes.",
      impactosPotenciales: "Fabricantes de electrodomésticos conectados (IoT) deberían cumplir estándares de ciberseguridad para comercializar en CR.",
      fechaClave: "En comisión con dictamen (Ene 2025). Estimado: Primer Debate Q2 2025.",
      calificadorEstado: "Instrumento en trámite; no aplicable hasta eventual aprobación, sanción y publicación en La Gaceta."
    },
    analisisIA: {
      resumenEjecutivo: "Proyecto que establecería el primer marco legal integral de ciberseguridad en Costa Rica, con énfasis en protección de infraestructura crítica y dispositivos IoT conectados.",
      estadisticas: {
        empresasAfectadas: 450,
        complejidadCumplimiento: 78,
        rangoSanciones: { min: 5000000, max: 100000000, moneda: "CRC" }
      },
      analisisRiesgo: {
        puntuacionGeneral: 88,
        desglose: [
          { categoria: "Regulatorio", nivel: "alto", porcentaje: 35 },
          { categoria: "Operativo", nivel: "alto", porcentaje: 30 },
          { categoria: "Financiero", nivel: "medio", porcentaje: 20 },
          { categoria: "Reputacional", nivel: "medio", porcentaje: 15 }
        ],
        probabilidadFiscalizacion: "Alta una vez aprobada - MICIT tiene capacidad técnica"
      },
      stakeholders: [
        { nombre: "CAMTIC", tipo: "Gremio", impacto: "Deberán certificar a sus asociados", posicion: "neutral" },
        { nombre: "Importadores de electrónica", tipo: "Sector privado", impacto: "Certificación obligatoria de productos IoT", posicion: "en_contra" },
        { nombre: "MICIT", tipo: "Gobierno", impacto: "Asume rol rector en ciberseguridad", posicion: "a_favor" }
      ],
      requisitosCumplimiento: [
        { requisito: "Certificación de productos IoT", plazo: "18 meses post-publicación", criticidad: "alta" },
        { requisito: "Sistema de reporte de incidentes", plazo: "12 meses post-publicación", criticidad: "alta" },
        { requisito: "Auditoría externa anual", plazo: "Anual desde vigencia", criticidad: "media" }
      ],
      recomendaciones: [
        "Monitorear avance legislativo mensualmente",
        "Evaluar cumplimiento de productos actuales con estándares ISO 27001",
        "Identificar laboratorios de certificación en CR"
      ]
    },
    acciones: [
      { fecha: "2024-09-15", descripcion: "Proyecto presentado a la Asamblea Legislativa", actor: "Diputados proponentes" },
      { fecha: "2024-10-01", descripcion: "Asignado a Comisión de Ciencia y Tecnología", actor: "Directorio Legislativo" },
      { fecha: "2024-11-15", descripcion: "Audiencia con CAMTIC y sector tecnológico", actor: "Comisión de Ciencia y Tecnología" },
      { fecha: "2025-01-20", descripcion: "Dictamen afirmativo de comisión emitido", actor: "Comisión de Ciencia y Tecnología" }
    ],
    proponentes: [
      { nombre: "Carolina Delgado Ramírez", partido: "Liberación Nacional", provincia: "San José", rol: "firmante_principal" },
      { nombre: "Andrés Mora Solís", partido: "Partido Liberal Progresista", provincia: "Heredia", rol: "coproponente" }
    ],
    stakeholders: [
      { nombre: "CAMTIC", organizacion: "Cámara de Tecnologías de Información y Comunicación", posicion: "neutral", declaracion: "Apoyamos la iniciativa pero solicitamos plazos de implementación razonables." },
      { nombre: "Defensoría de los Habitantes", organizacion: "Defensoría Pública", posicion: "a_favor", declaracion: "Es fundamental proteger la infraestructura digital del país." }
    ],
    fuenteUrl: "https://www.asamblea.go.cr/expediente/24123"
  },
  
  {
    id: "cr-proy-002",
    identificador: "Expediente N.º 24.089",
    titulo: "Proyecto de Ley de Regulación de Criptoactivos y Servicios Financieros Digitales",
    resumen: "Establece el marco regulatorio para la emisión, custodia y comercialización de criptoactivos en el sistema financiero costarricense.",
    puntosImportantes: [
      "Registro obligatorio de proveedores de servicios de criptoactivos (PSAV)",
      "Requisitos de capital mínimo para exchanges",
      "Protección al consumidor de servicios cripto",
      "Coordinación con normativa AML/CFT existente"
    ],
    tipoNorma: "proyecto_ley",
    tipoEmisor: "legislativo",
    nivel: "nacional",
    organoEmisor: "Asamblea Legislativa",
    organoCompetente: "CONASSIF / SUGEF",
    comisionLegislativa: "Comisión de Asuntos Hacendarios",
    estado: "primer_debate",
    estadoGenerico: "en_tramite",
    indiceEtapaActual: 3,
    fechaPresentacion: "2024-08-01",
    fechaDictamenComision: "2024-11-15",
    fechaPrimerDebate: "2025-02-10",
    categoria: "Product Safety",
    sector: "Servicios Financieros",
    obligacionesAfectadas: ["Registro de exchanges", "KYC/AML", "Reportes a SUGEF"],
    nivelRiesgo: "alto",
    puntajeRiesgo: 85,
    resumenIA: {
      cambiosPropuestos: "Crearía obligaciones de registro, capital mínimo y cumplimiento AML para cualquier empresa que ofrezca servicios de criptoactivos en CR.",
      impactosPotenciales: "Empresas fintech y cualquier comercio que acepte pagos en cripto deberán cumplir requisitos regulatorios.",
      fechaClave: "Aprobado en Primer Debate (Feb 2025). Pendiente Segundo Debate.",
      calificadorEstado: "Instrumento en trámite; no aplicable hasta eventual aprobación, sanción y publicación en La Gaceta."
    },
    analisisIA: {
      resumenEjecutivo: "Proyecto avanzado que regularía el ecosistema cripto en CR. Alta probabilidad de aprobación dado consenso bipartidista.",
      estadisticas: {
        empresasAfectadas: 120,
        complejidadCumplimiento: 82,
        rangoSanciones: { min: 10000000, max: 200000000, moneda: "CRC" }
      },
      analisisRiesgo: {
        puntuacionGeneral: 85,
        desglose: [
          { categoria: "Regulatorio", nivel: "alto", porcentaje: 40 },
          { categoria: "Financiero", nivel: "alto", porcentaje: 35 },
          { categoria: "Operativo", nivel: "medio", porcentaje: 25 }
        ],
        probabilidadFiscalizacion: "Alta - SUGEF tiene experiencia en supervisión financiera"
      },
      stakeholders: [
        { nombre: "SUGEF", tipo: "Regulador", impacto: "Asumiría supervisión de PSAV", posicion: "a_favor" },
        { nombre: "Exchanges locales", tipo: "Sector privado", impacto: "Requisitos de capital y licencia", posicion: "neutral" }
      ],
      requisitosCumplimiento: [
        { requisito: "Registro ante SUGEF", plazo: "6 meses post-publicación", criticidad: "alta" },
        { requisito: "Capital mínimo $500,000", plazo: "Inmediato para nuevos operadores", criticidad: "alta" }
      ],
      recomendaciones: [
        "Evaluar si la empresa planea aceptar pagos en cripto",
        "Consultar con asesor legal especializado en fintech"
      ]
    },
    acciones: [
      { fecha: "2024-08-01", descripcion: "Proyecto presentado a la Asamblea Legislativa", actor: "Diputados proponentes" },
      { fecha: "2024-09-01", descripcion: "Asignado a Comisión de Asuntos Hacendarios", actor: "Directorio Legislativo" },
      { fecha: "2024-11-15", descripcion: "Dictamen afirmativo de comisión", actor: "Comisión de Asuntos Hacendarios" },
      { fecha: "2025-02-10", descripcion: "Aprobado en Primer Debate con 38 votos a favor", actor: "Plenario Legislativo" }
    ],
    registrosVotacion: [
      {
        fecha: "2025-02-10",
        etapa: "Primer Debate Plenario",
        aFavor: 38,
        enContra: 15,
        abstenciones: 4,
        aprobado: true
      }
    ],
    proponentes: [
      { nombre: "Roberto Méndez Vargas", partido: "Unidad Social Cristiana", provincia: "Cartago", rol: "firmante_principal" }
    ],
    fuenteUrl: "https://www.asamblea.go.cr/expediente/24089"
  },
  
  {
    id: "cr-proy-003",
    identificador: "Expediente N.º 24.201",
    titulo: "Proyecto de Ley para la Promoción de Electrodomésticos Eficientes",
    resumen: "Establece estándares de eficiencia energética obligatorios para la importación y comercialización de electrodomésticos, incluyendo hervidores y máquinas de café.",
    puntosImportantes: [
      "Etiquetado energético obligatorio",
      "Estándares mínimos de eficiencia",
      "Prohibición progresiva de equipos clase G y F",
      "Incentivos fiscales para equipos clase A"
    ],
    tipoNorma: "proyecto_ley",
    tipoEmisor: "legislativo",
    nivel: "nacional",
    organoEmisor: "Asamblea Legislativa",
    organoCompetente: "MINAE / INTECO",
    comisionLegislativa: "Comisión de Ambiente",
    estado: "enviado_ejecutivo",
    estadoGenerico: "en_tramite",
    indiceEtapaActual: 5,
    fechaPresentacion: "2024-06-01",
    fechaDictamenComision: "2024-09-15",
    fechaPrimerDebate: "2024-11-20",
    fechaSegundoDebate: "2025-01-15",
    fechaEnvioEjecutivo: "2025-01-25",
    categoria: "Battery Regulations",
    sector: "Electrodomésticos y Eficiencia Energética",
    obligacionesAfectadas: ["Etiquetado energético", "Certificación de eficiencia", "Registro de productos"],
    plazosTransitorios: "24 meses para productos en inventario; 36 meses para eliminación de clases G/F",
    nivelRiesgo: "alto",
    puntajeRiesgo: 92,
    resumenIA: {
      cambiosPropuestos: "Requeriría etiquetado energético y certificación de eficiencia para hervidores y cafeteras antes de comercialización.",
      impactosPotenciales: "IMPACTO DIRECTO: Fabricantes de hervidores y cafeteras deberán certificar productos ante INTECO. Posible reformulación de líneas menos eficientes.",
      fechaClave: "Enviado al Ejecutivo (Ene 2025). Pendiente sanción o veto presidencial.",
      calificadorEstado: "Instrumento en trámite; pendiente sanción del Poder Ejecutivo. Posibilidad de veto."
    },
    analisisIA: {
      resumenEjecutivo: "Proyecto de alto impacto para fabricantes de electrodomésticos. Enviado al Ejecutivo para sanción. Posibilidad de veto por presión de importadores.",
      estadisticas: {
        empresasAfectadas: 85,
        complejidadCumplimiento: 75,
        rangoSanciones: { min: 2000000, max: 50000000, moneda: "CRC" }
      },
      analisisRiesgo: {
        puntuacionGeneral: 92,
        desglose: [
          { categoria: "Regulatorio", nivel: "alto", porcentaje: 45 },
          { categoria: "Operativo", nivel: "alto", porcentaje: 35 },
          { categoria: "Financiero", nivel: "medio", porcentaje: 20 }
        ],
        probabilidadFiscalizacion: "Alta - MINAE activo en temas ambientales"
      },
      stakeholders: [
        { nombre: "Importadores de electrodomésticos", tipo: "Sector privado", impacto: "Certificación obligatoria de productos", posicion: "en_contra" },
        { nombre: "MINAE", tipo: "Gobierno", impacto: "Rol fiscalizador de eficiencia", posicion: "a_favor" },
        { nombre: "INTECO", tipo: "Certificador", impacto: "Emisión de certificados de conformidad", posicion: "a_favor" }
      ],
      requisitosCumplimiento: [
        { requisito: "Etiquetado energético en productos", plazo: "12 meses post-publicación", criticidad: "alta" },
        { requisito: "Certificación INTECO de eficiencia", plazo: "18 meses post-publicación", criticidad: "alta" },
        { requisito: "Retiro de productos clase G/F", plazo: "36 meses post-publicación", criticidad: "alta" }
      ],
      recomendaciones: [
        "ACCIÓN INMEDIATA: Auditar eficiencia energética de línea de hervidores y cafeteras",
        "Evaluar certificación previa ante INTECO",
        "Monitorear decisión del Ejecutivo (sanción o veto)"
      ]
    },
    acciones: [
      { fecha: "2024-06-01", descripcion: "Proyecto presentado a la Asamblea Legislativa", actor: "Diputados proponentes" },
      { fecha: "2024-09-15", descripcion: "Dictamen afirmativo de Comisión de Ambiente", actor: "Comisión de Ambiente" },
      { fecha: "2024-11-20", descripcion: "Aprobado en Primer Debate", actor: "Plenario Legislativo" },
      { fecha: "2025-01-15", descripcion: "Aprobado en Segundo Debate con 42 votos a favor", actor: "Plenario Legislativo" },
      { fecha: "2025-01-25", descripcion: "Enviado al Poder Ejecutivo para sanción", actor: "Asamblea Legislativa" }
    ],
    registrosVotacion: [
      {
        fecha: "2025-01-15",
        etapa: "Segundo Debate Plenario",
        aFavor: 42,
        enContra: 12,
        abstenciones: 3,
        aprobado: true
      }
    ],
    proponentes: [
      { nombre: "María Elena Gómez Arias", partido: "Acción Ciudadana", provincia: "San José", rol: "firmante_principal" }
    ],
    fuenteUrl: "https://www.asamblea.go.cr/expediente/24201"
  },
  
  {
    id: "cr-proy-004",
    identificador: "Expediente N.º 23.987",
    titulo: "Proyecto de Ley de Responsabilidad Extendida del Productor para Aparatos Eléctricos",
    resumen: "Establece la obligación de fabricantes e importadores de gestionar el ciclo de vida completo de aparatos eléctricos y electrónicos, incluyendo su disposición final.",
    puntosImportantes: [
      "Sistema de gestión de RAEE obligatorio",
      "Puntos de recolección obligatorios por cantón",
      "Metas de reciclaje progresivas (50% año 1, 70% año 3)",
      "Registro de productores e importadores"
    ],
    tipoNorma: "proyecto_ley",
    tipoEmisor: "legislativo",
    nivel: "nacional",
    organoEmisor: "Asamblea Legislativa",
    organoCompetente: "Ministerio de Salud / MINAE",
    comisionLegislativa: "Comisión de Ambiente",
    estado: "vetado",
    estadoGenerico: "en_tramite",
    indiceEtapaActual: 6,
    fechaPresentacion: "2024-03-01",
    fechaDictamenComision: "2024-06-15",
    fechaPrimerDebate: "2024-08-20",
    fechaSegundoDebate: "2024-10-15",
    fechaEnvioEjecutivo: "2024-10-25",
    fechaSancionOVeto: "2024-11-20",
    categoria: "Battery Regulations",
    sector: "Gestión de Residuos",
    obligacionesAfectadas: ["Gestión de RAEE", "Puntos de recolección", "Reportes anuales de reciclaje"],
    nivelRiesgo: "alto",
    puntajeRiesgo: 78,
    resumenIA: {
      cambiosPropuestos: "Obligaría a fabricantes de electrodomésticos a establecer sistemas de recolección y reciclaje de productos al fin de su vida útil.",
      impactosPotenciales: "Fabricantes de hervidores y cafeteras deberían implementar programas de responsabilidad extendida y financiar gestión de RAEE.",
      fechaClave: "VETADO por Poder Ejecutivo (Nov 2024). Pendiente resello o archivo.",
      calificadorEstado: "Vetado por el Poder Ejecutivo. Pendiente de decisión de la Asamblea Legislativa (resello o archivo)."
    },
    analisisIA: {
      resumenEjecutivo: "Proyecto vetado por considerarse que impone cargas desproporcionadas a PYMES. La Asamblea puede resellar con 38 votos.",
      estadisticas: {
        empresasAfectadas: 200,
        complejidadCumplimiento: 85,
        rangoSanciones: { min: 5000000, max: 100000000, moneda: "CRC" }
      },
      analisisRiesgo: {
        puntuacionGeneral: 78,
        desglose: [
          { categoria: "Regulatorio", nivel: "alto", porcentaje: 40 },
          { categoria: "Operativo", nivel: "alto", porcentaje: 40 },
          { categoria: "Financiero", nivel: "medio", porcentaje: 20 }
        ],
        probabilidadFiscalizacion: "Incierta - depende de resultado de resello"
      },
      stakeholders: [
        { nombre: "Cámara de Industrias", tipo: "Gremio", impacto: "Costos de gestión RAEE", posicion: "en_contra" },
        { nombre: "Organizaciones ambientalistas", tipo: "ONG", impacto: "Apoyan normativa", posicion: "a_favor" }
      ],
      recomendaciones: [
        "Monitorear votación de resello en Asamblea",
        "Si se resella, preparar plan de gestión RAEE"
      ]
    },
    acciones: [
      { fecha: "2024-03-01", descripcion: "Proyecto presentado a la Asamblea Legislativa", actor: "Diputados proponentes" },
      { fecha: "2024-10-15", descripcion: "Aprobado en Segundo Debate", actor: "Plenario Legislativo" },
      { fecha: "2024-10-25", descripcion: "Enviado al Poder Ejecutivo para sanción", actor: "Asamblea Legislativa" },
      { fecha: "2024-11-20", descripcion: "VETO EJECUTIVO: Presidente rechaza proyecto por impacto en PYMES", actor: "Poder Ejecutivo" },
      { fecha: "2025-01-10", descripcion: "Proyecto devuelto a Asamblea para resello o archivo", actor: "Directorio Legislativo" }
    ],
    proponentes: [
      { nombre: "José Pablo Campos Mora", partido: "Frente Amplio", provincia: "San José", rol: "firmante_principal" }
    ],
    fuenteUrl: "https://www.asamblea.go.cr/expediente/23987"
  },
  
  // ========== PODER EJECUTIVO (3) ==========
  {
    id: "cr-dec-001",
    identificador: "Decreto Ejecutivo N.º 44.567-MEIC-MICIT",
    titulo: "Reglamento Técnico para Seguridad de Electrodomésticos",
    resumen: "Establece los requisitos técnicos de seguridad eléctrica y compatibilidad electromagnética para electrodomésticos comercializados en Costa Rica.",
    puntosImportantes: [
      "Cumplimiento obligatorio de normas IEC 60335 para electrodomésticos",
      "Certificación de compatibilidad electromagnética (EMC)",
      "Etiquetado de seguridad obligatorio",
      "Registro de productos ante MEIC"
    ],
    tipoNorma: "decreto_ejecutivo",
    tipoEmisor: "ejecutivo",
    nivel: "nacional",
    organoEmisor: "Poder Ejecutivo (MEIC + MICIT)",
    organoCompetente: "MEIC (Oficina de Defensa del Consumidor) / INTECO",
    estado: "vigente",
    estadoGenerico: "vigente",
    indiceEtapaActual: 7,
    fechaPublicacionGaceta: "2024-06-15",
    fechaEntradaVigencia: "2024-12-15",
    categoria: "Product Safety",
    sector: "Electrodomésticos",
    obligacionesAfectadas: ["Certificación IEC 60335", "Etiquetado de seguridad", "Registro de productos"],
    plazosTransitorios: "Productos en inventario al 15/12/2024 tienen 12 meses adicionales",
    nivelRiesgo: "alto",
    puntajeRiesgo: 90,
    resumenIA: {
      cambiosPropuestos: "Exige certificación de seguridad IEC 60335 y EMC para hervidores y cafeteras antes de comercialización.",
      impactosPotenciales: "IMPACTO DIRECTO: Fabricantes de hervidores y cafeteras deben obtener certificación de conformidad con IEC 60335-2-15 (hervidores) e IEC 60335-2-14 (cafeteras).",
      fechaClave: "Vigente desde 15 de diciembre de 2024.",
      calificadorEstado: "Norma vigente desde 15/12/2024. Cumplimiento inmediato requerido."
    },
    analisisIA: {
      resumenEjecutivo: "Decreto ya vigente que afecta directamente hervidores y cafeteras. Requiere acción inmediata de cumplimiento.",
      estadisticas: {
        empresasAfectadas: 150,
        complejidadCumplimiento: 70,
        rangoSanciones: { min: 1000000, max: 25000000, moneda: "CRC" }
      },
      analisisRiesgo: {
        puntuacionGeneral: 90,
        desglose: [
          { categoria: "Regulatorio", nivel: "alto", porcentaje: 50 },
          { categoria: "Operativo", nivel: "medio", porcentaje: 30 },
          { categoria: "Financiero", nivel: "medio", porcentaje: 20 }
        ],
        probabilidadFiscalizacion: "Alta - MEIC realiza inspecciones de mercado"
      },
      stakeholders: [
        { nombre: "MEIC", tipo: "Gobierno", impacto: "Fiscaliza cumplimiento", posicion: "a_favor" },
        { nombre: "INTECO", tipo: "Certificador", impacto: "Emite certificados de conformidad", posicion: "a_favor" }
      ],
      requisitosCumplimiento: [
        { requisito: "Certificación IEC 60335 para productos", plazo: "Vigente ahora", criticidad: "alta" },
        { requisito: "Etiquetado de seguridad en empaques", plazo: "Vigente ahora", criticidad: "alta" },
        { requisito: "Registro de productos ante MEIC", plazo: "Vigente ahora", criticidad: "alta" }
      ],
      recomendaciones: [
        "URGENTE: Verificar certificación de productos actuales",
        "Obtener certificado de conformidad de laboratorio acreditado",
        "Actualizar etiquetado de productos"
      ]
    },
    acciones: [
      { fecha: "2024-05-01", descripcion: "Consulta pública del proyecto de decreto", actor: "MEIC" },
      { fecha: "2024-06-10", descripcion: "Firma del Decreto Ejecutivo", actor: "Poder Ejecutivo" },
      { fecha: "2024-06-15", descripcion: "Publicación en La Gaceta N.º 115", actor: "Imprenta Nacional" },
      { fecha: "2024-12-15", descripcion: "Entrada en vigencia", actor: "N/A" }
    ],
    numeroGaceta: "N.º 115, Alcance N.º 42",
    fuenteUrl: "http://www.pgrweb.go.cr/scij/Busqueda/Normativa/Normas/nrm_texto_completo.aspx?param1=NRTC&nValor1=1&nValor2=99567"
  },
  
  {
    id: "cr-dec-002",
    identificador: "Decreto Ejecutivo N.º 44.789-MINAE",
    titulo: "Reglamento de Eficiencia Energética para Equipos de Calentamiento de Agua",
    resumen: "Establece estándares mínimos de eficiencia energética para calentadores de agua, incluyendo hervidores eléctricos, cafeteras y dispensadores de agua caliente.",
    puntosImportantes: [
      "Eficiencia mínima de 85% para hervidores eléctricos",
      "Etiquetado de eficiencia energética obligatorio",
      "Prohibición de importación de equipos bajo estándar mínimo",
      "Sistema de verificación en aduanas"
    ],
    tipoNorma: "reglamento",
    tipoEmisor: "ejecutivo",
    nivel: "nacional",
    organoEmisor: "Poder Ejecutivo (MINAE)",
    organoCompetente: "MINAE / Dirección General de Aduanas",
    estado: "vigente",
    estadoGenerico: "vigente",
    indiceEtapaActual: 7,
    fechaPublicacionGaceta: "2024-09-01",
    fechaEntradaVigencia: "2025-03-01",
    categoria: "Battery Regulations",
    sector: "Eficiencia Energética",
    obligacionesAfectadas: ["Certificación de eficiencia", "Etiquetado energético", "Verificación aduanera"],
    plazosTransitorios: "Productos fabricados antes del 01/03/2025 exentos por 12 meses",
    nivelRiesgo: "alto",
    puntajeRiesgo: 85,
    resumenIA: {
      cambiosPropuestos: "Establece eficiencia mínima de 85% para hervidores. Productos sin certificación no podrán importarse.",
      impactosPotenciales: "IMPACTO DIRECTO: Hervidores con eficiencia menor a 85% serán rechazados en aduana. Cafeteras también sujetas a verificación.",
      fechaClave: "Vigente desde 1 de marzo de 2025.",
      calificadorEstado: "Norma vigente desde 01/03/2025. Cumplimiento obligatorio."
    },
    analisisIA: {
      resumenEjecutivo: "Reglamento vigente que requiere certificación de eficiencia para hervidores y cafeteras. Verificación en aduanas activa.",
      estadisticas: {
        empresasAfectadas: 80,
        complejidadCumplimiento: 65,
        rangoSanciones: { min: 500000, max: 10000000, moneda: "CRC" }
      },
      analisisRiesgo: {
        puntuacionGeneral: 85,
        desglose: [
          { categoria: "Regulatorio", nivel: "alto", porcentaje: 45 },
          { categoria: "Operativo", nivel: "alto", porcentaje: 35 },
          { categoria: "Financiero", nivel: "medio", porcentaje: 20 }
        ],
        probabilidadFiscalizacion: "Alta - Control aduanero automático"
      },
      requisitosCumplimiento: [
        { requisito: "Certificado de eficiencia ≥85%", plazo: "Vigente ahora", criticidad: "alta" },
        { requisito: "Etiqueta de eficiencia visible", plazo: "Vigente ahora", criticidad: "alta" }
      ],
      recomendaciones: [
        "Verificar especificaciones de eficiencia de productos actuales",
        "Obtener certificación de laboratorio acreditado",
        "Coordinar con agente aduanal para documentación requerida"
      ]
    },
    acciones: [
      { fecha: "2024-09-01", descripcion: "Publicación en La Gaceta", actor: "Imprenta Nacional" },
      { fecha: "2025-03-01", descripcion: "Entrada en vigencia", actor: "N/A" }
    ],
    numeroGaceta: "N.º 168",
    fuenteUrl: "http://www.pgrweb.go.cr/scij/decreto/44789"
  },
  
  {
    id: "cr-dec-003",
    identificador: "Decreto Ejecutivo N.º 44.890-S",
    titulo: "Reglamento sobre Materiales en Contacto con Alimentos para Electrodomésticos",
    resumen: "Establece requisitos sanitarios para materiales que entran en contacto con alimentos en electrodomésticos de cocina, incluyendo hervidores y cafeteras.",
    puntosImportantes: [
      "Límites de migración para metales pesados",
      "Certificación de materiales BPA-free",
      "Pruebas de simulantes de alimentos",
      "Registro sanitario de productos"
    ],
    tipoNorma: "reglamento",
    tipoEmisor: "ejecutivo",
    nivel: "nacional",
    organoEmisor: "Poder Ejecutivo (Ministerio de Salud)",
    organoCompetente: "Ministerio de Salud / ARS",
    estado: "vigente",
    estadoGenerico: "vigente",
    indiceEtapaActual: 7,
    fechaPublicacionGaceta: "2024-11-01",
    fechaEntradaVigencia: "2025-05-01",
    categoria: "Food Contact Material",
    sector: "Seguridad Alimentaria",
    obligacionesAfectadas: ["Certificación de materiales", "Pruebas de migración", "Registro sanitario"],
    plazosTransitorios: "Productos registrados antes del 01/05/2025 tienen 18 meses para adecuación",
    nivelRiesgo: "alto",
    puntajeRiesgo: 88,
    resumenIA: {
      cambiosPropuestos: "Requiere certificación de materiales en contacto con alimentos (BPA-free, límites de migración) para hervidores y cafeteras.",
      impactosPotenciales: "IMPACTO DIRECTO: Hervidores y cafeteras requieren certificación de materiales. Registro sanitario obligatorio.",
      fechaClave: "Vigente desde 1 de mayo de 2025.",
      calificadorEstado: "Norma vigente desde 01/05/2025. Plazo transitorio de 18 meses para productos existentes."
    },
    analisisIA: {
      resumenEjecutivo: "Reglamento crítico para hervidores y cafeteras. Requiere certificación de materiales en contacto con agua/café.",
      estadisticas: {
        empresasAfectadas: 100,
        complejidadCumplimiento: 80,
        rangoSanciones: { min: 2000000, max: 50000000, moneda: "CRC" }
      },
      analisisRiesgo: {
        puntuacionGeneral: 88,
        desglose: [
          { categoria: "Regulatorio", nivel: "alto", porcentaje: 45 },
          { categoria: "Operativo", nivel: "alto", porcentaje: 30 },
          { categoria: "Reputacional", nivel: "medio", porcentaje: 25 }
        ],
        probabilidadFiscalizacion: "Media - Ministerio de Salud con recursos limitados pero activo en temas de salud pública"
      },
      requisitosCumplimiento: [
        { requisito: "Certificación BPA-free de materiales", plazo: "18 meses para productos existentes", criticidad: "alta" },
        { requisito: "Pruebas de migración", plazo: "18 meses para productos existentes", criticidad: "alta" },
        { requisito: "Registro sanitario", plazo: "Antes de comercialización", criticidad: "alta" }
      ],
      recomendaciones: [
        "Solicitar certificados de materiales a proveedores",
        "Evaluar necesidad de pruebas de laboratorio",
        "Iniciar trámite de registro sanitario"
      ]
    },
    acciones: [
      { fecha: "2024-11-01", descripcion: "Publicación en La Gaceta", actor: "Imprenta Nacional" },
      { fecha: "2025-05-01", descripcion: "Entrada en vigencia", actor: "N/A" }
    ],
    numeroGaceta: "N.º 210",
    fuenteUrl: "http://www.pgrweb.go.cr/scij/decreto/44890"
  },
  
  // ========== MUNICIPALES (2) ==========
  {
    id: "cr-mun-001",
    identificador: "Reglamento Municipal N.º 45-2024",
    titulo: "Reglamento sobre Ruido de Equipos Eléctricos en Zonas Residenciales",
    resumen: "Establece límites de emisión de ruido para equipos eléctricos y electrodomésticos en zonas residenciales del cantón de Escazú.",
    puntosImportantes: [
      "Límite de 55 dB(A) para equipos de uso doméstico",
      "Horarios restringidos para equipos ruidosos (22:00-07:00)",
      "Etiquetado de decibeles obligatorio en comercios del cantón",
      "Multas por incumplimiento"
    ],
    tipoNorma: "reglamento_municipal",
    tipoEmisor: "municipal",
    nivel: "municipal",
    organoEmisor: "Municipalidad de Escazú (Concejo Municipal)",
    organoCompetente: "Municipalidad de Escazú / Ministerio de Salud",
    provincia: "San José",
    canton: "Escazú",
    estado: "vigente",
    estadoGenerico: "vigente",
    indiceEtapaActual: 7,
    fechaPublicacionGaceta: "2024-08-15",
    fechaEntradaVigencia: "2024-10-01",
    categoria: "Product Safety",
    sector: "Medio Ambiente Urbano",
    obligacionesAfectadas: ["Etiquetado de ruido", "Verificación de decibeles"],
    nivelRiesgo: "bajo",
    puntajeRiesgo: 35,
    resumenIA: {
      cambiosPropuestos: "Requiere que comercios en Escazú etiqueten nivel de ruido de electrodomésticos vendidos.",
      impactosPotenciales: "Impacto limitado a operaciones comerciales en cantón de Escazú. Hervidores y cafeteras generalmente cumplen límite de 55 dB.",
      fechaClave: "Vigente desde 1 de octubre de 2024.",
      calificadorEstado: "Norma vigente en jurisdicción municipal de Escazú desde 01/10/2024."
    },
    analisisIA: {
      resumenEjecutivo: "Reglamento de alcance local (Escazú). Bajo impacto para fabricantes ya que mayoría de hervidores/cafeteras cumplen límites.",
      estadisticas: {
        empresasAfectadas: 25,
        complejidadCumplimiento: 30,
        rangoSanciones: { min: 100000, max: 500000, moneda: "CRC" }
      },
      analisisRiesgo: {
        puntuacionGeneral: 35,
        desglose: [
          { categoria: "Regulatorio", nivel: "bajo", porcentaje: 50 },
          { categoria: "Operativo", nivel: "bajo", porcentaje: 50 }
        ],
        probabilidadFiscalizacion: "Baja - Recursos municipales limitados"
      },
      recomendaciones: [
        "Verificar especificaciones de ruido de productos",
        "Incluir dato de decibeles en ficha técnica"
      ]
    },
    acciones: [
      { fecha: "2024-07-01", descripcion: "Aprobación por Concejo Municipal", actor: "Concejo Municipal de Escazú" },
      { fecha: "2024-08-15", descripcion: "Publicación en La Gaceta", actor: "Imprenta Nacional" },
      { fecha: "2024-10-01", descripcion: "Entrada en vigencia", actor: "N/A" }
    ],
    fuenteUrl: "https://www.escazu.go.cr/reglamentos/45-2024"
  },
  
  {
    id: "cr-mun-002",
    identificador: "Ordenanza Municipal N.º 12-2024",
    titulo: "Ordenanza sobre Comercialización de Electrodomésticos en Mercado Central de Alajuela",
    resumen: "Regula la venta de electrodomésticos en el Mercado Central de Alajuela, estableciendo requisitos de seguridad y garantía para comerciantes.",
    puntosImportantes: [
      "Exhibición obligatoria de certificado de seguridad",
      "Garantía mínima de 6 meses",
      "Información de eficiencia energética visible",
      "Registro de comerciantes ante Municipalidad"
    ],
    tipoNorma: "ordenanza_municipal",
    tipoEmisor: "municipal",
    nivel: "municipal",
    organoEmisor: "Municipalidad de Alajuela (Concejo Municipal)",
    organoCompetente: "Municipalidad de Alajuela",
    provincia: "Alajuela",
    canton: "Alajuela Central",
    estado: "vigente",
    estadoGenerico: "vigente",
    indiceEtapaActual: 7,
    fechaPublicacionGaceta: "2024-07-01",
    fechaEntradaVigencia: "2024-09-01",
    categoria: "Product Safety",
    sector: "Comercio Local",
    obligacionesAfectadas: ["Garantía mínima", "Exhibición de certificados"],
    nivelRiesgo: "bajo",
    puntajeRiesgo: 25,
    resumenIA: {
      cambiosPropuestos: "Requisitos específicos para comerciantes del Mercado Central de Alajuela. Afecta canal de distribución local.",
      impactosPotenciales: "Impacto indirecto: distribuidores en Mercado Central deben exhibir certificados de productos vendidos.",
      fechaClave: "Vigente desde 1 de septiembre de 2024.",
      calificadorEstado: "Norma vigente en jurisdicción municipal de Alajuela desde 01/09/2024."
    },
    analisisIA: {
      resumenEjecutivo: "Ordenanza de alcance muy local. Afecta solo comerciantes del Mercado Central de Alajuela.",
      estadisticas: {
        empresasAfectadas: 15,
        complejidadCumplimiento: 20,
        rangoSanciones: { min: 50000, max: 200000, moneda: "CRC" }
      },
      analisisRiesgo: {
        puntuacionGeneral: 25,
        desglose: [
          { categoria: "Regulatorio", nivel: "bajo", porcentaje: 60 },
          { categoria: "Operativo", nivel: "bajo", porcentaje: 40 }
        ],
        probabilidadFiscalizacion: "Baja"
      },
      recomendaciones: [
        "Si distribuye en Mercado Central Alajuela, verificar cumplimiento",
        "Proporcionar material de apoyo a distribuidores"
      ]
    },
    acciones: [
      { fecha: "2024-06-01", descripcion: "Aprobación por Concejo Municipal", actor: "Concejo Municipal de Alajuela" },
      { fecha: "2024-07-01", descripcion: "Publicación en La Gaceta", actor: "Imprenta Nacional" },
      { fecha: "2024-09-01", descripcion: "Entrada en vigencia", actor: "N/A" }
    ],
    fuenteUrl: "https://www.munialajuela.go.cr/ordenanzas/12-2024"
  },
  
  // ========== REGULATORIA/INSTITUCIONAL (1) ==========
  {
    id: "cr-reg-001",
    identificador: "Acuerdo SUGEF N.º 5-2024",
    titulo: "Lineamientos sobre Protección de Datos en Sistemas de Pago Electrónico",
    resumen: "Establece requisitos de protección de datos personales y ciberseguridad para entidades financieras y comercios que procesen pagos electrónicos.",
    puntosImportantes: [
      "Cifrado obligatorio de datos de pago (PCI-DSS)",
      "Políticas de retención de datos de transacciones",
      "Notificación de brechas en 48 horas",
      "Auditorías de seguridad trimestrales"
    ],
    tipoNorma: "normativa_regulatoria",
    tipoEmisor: "regulador",
    nivel: "institucional",
    organoEmisor: "SUGEF (Superintendencia General de Entidades Financieras)",
    organoCompetente: "SUGEF",
    estado: "vigente",
    estadoGenerico: "vigente",
    indiceEtapaActual: 7,
    fechaPublicacionGaceta: "2024-10-01",
    fechaEntradaVigencia: "2025-01-01",
    categoria: "Cybersecurity",
    sector: "Servicios Financieros",
    obligacionesAfectadas: ["Cumplimiento PCI-DSS", "Notificación de brechas", "Auditorías de seguridad"],
    plazosTransitorios: "Entidades con menos de 1000 transacciones/mes tienen 12 meses adicionales",
    nivelRiesgo: "medio",
    puntajeRiesgo: 65,
    resumenIA: {
      cambiosPropuestos: "Requisitos de ciberseguridad para procesamiento de pagos electrónicos. Aplica si empresa procesa pagos directamente.",
      impactosPotenciales: "Impacto si empresa vende directamente y procesa pagos con tarjeta. Si usa pasarelas de pago terceras, impacto reducido.",
      fechaClave: "Vigente desde 1 de enero de 2025.",
      calificadorEstado: "Norma vigente desde 01/01/2025. Régimen transitorio para pequeños comercios."
    },
    analisisIA: {
      resumenEjecutivo: "Normativa de SUGEF que aplica a procesadores de pagos. Fabricantes de electrodomésticos afectados solo si venden directo al consumidor y procesan pagos.",
      estadisticas: {
        empresasAfectadas: 500,
        complejidadCumplimiento: 75,
        rangoSanciones: { min: 5000000, max: 100000000, moneda: "CRC" }
      },
      analisisRiesgo: {
        puntuacionGeneral: 65,
        desglose: [
          { categoria: "Regulatorio", nivel: "medio", porcentaje: 40 },
          { categoria: "Operativo", nivel: "alto", porcentaje: 35 },
          { categoria: "Financiero", nivel: "medio", porcentaje: 25 }
        ],
        probabilidadFiscalizacion: "Alta - SUGEF es regulador activo"
      },
      requisitosCumplimiento: [
        { requisito: "Certificación PCI-DSS", plazo: "Vigente ahora", criticidad: "alta" },
        { requisito: "Sistema de notificación de brechas", plazo: "Vigente ahora", criticidad: "alta" }
      ],
      recomendaciones: [
        "Evaluar si empresa procesa pagos directamente",
        "Si usa pasarela de terceros (SINPE, etc.), verificar su cumplimiento",
        "Revisar contratos con proveedores de pago"
      ]
    },
    acciones: [
      { fecha: "2024-08-01", descripcion: "Consulta pública del proyecto de acuerdo", actor: "SUGEF" },
      { fecha: "2024-09-15", descripcion: "Aprobación por Junta Directiva SUGEF", actor: "Junta Directiva SUGEF" },
      { fecha: "2024-10-01", descripcion: "Publicación en La Gaceta", actor: "Imprenta Nacional" },
      { fecha: "2025-01-01", descripcion: "Entrada en vigencia", actor: "N/A" }
    ],
    numeroGaceta: "N.º 189",
    fuenteUrl: "https://www.sugef.fi.cr/normativa/acuerdo-5-2024"
  }
];

// ========== CONVERTIDOR A FORMATO UNIFICADO ==========
export function convertCostaRicaToUnified(items: CostaRicaLegislationItem[]): UnifiedLegislationItem[] {
  return items.map(item => ({
    id: item.id,
    title: item.titulo,
    identifier: item.identificador,
    summary: item.resumen,
    bullets: item.puntosImportantes,
    region: "LATAM" as const,
    jurisdictionCode: "CR",
    jurisdictionLevel: item.nivel === "nacional" ? "federal" as const : 
                       item.nivel === "municipal" ? "local" as const : 
                       "federal" as const, // institucional maps to federal for display
    subnationalUnit: item.canton || item.provincia,
    authority: item.organoEmisor,
    authorityLabel: item.organoEmisor,
    instrumentType: mapTipoNormaToInstrumentType(item.tipoNorma),
    hierarchyLevel: mapTipoNormaToHierarchy(item.tipoNorma),
    status: item.estado,
    genericStatus: item.estadoGenerico === "vigente" ? "in-force" as const : "proposal" as const,
    isInForce: item.estadoGenerico === "vigente",
    isPipeline: item.estadoGenerico === "en_tramite",
    publishedDate: item.fechaPublicacionGaceta || item.fechaPresentacion,
    effectiveDate: item.fechaEntradaVigencia,
    complianceDeadline: item.plazosTransitorios ? calculateDeadline(item) : undefined,
    riskLevel: item.nivelRiesgo === "alto" ? "high" : item.nivelRiesgo === "medio" ? "medium" : "low",
    riskScore: item.puntajeRiesgo,
    policyArea: item.sector,
    regulatoryCategory: item.categoria,
    impactAreas: [item.sector, item.categoria],
    currentStageIndex: item.indiceEtapaActual,
    aiSummary: {
      whatChanges: item.resumenIA.cambiosPropuestos,
      whoImpacted: item.resumenIA.impactosPotenciales,
      keyDeadline: item.resumenIA.fechaClave,
      riskExplanation: item.resumenIA.calificadorEstado
    },
    votingRecords: item.registrosVotacion?.map(v => ({
      chamber: v.etapa,
      date: v.fecha,
      yea: v.aFavor,
      nay: v.enContra,
      abstain: v.abstenciones,
      passed: v.aprobado
    })),
    sponsors: item.proponentes?.map(p => ({
      name: p.nombre,
      party: p.partido,
      state: p.provincia,
      role: p.rol === "firmante_principal" ? "Firmante Principal" : "Co-proponente"
    })),
    actions: item.acciones.map(a => ({
      date: a.fecha,
      description: a.descripcion,
      chamber: a.actor
    })),
    summaries: [{
      versionName: "Resumen",
      text: item.resumen
    }],
    fullText: generateCostaRicaFullText(item),
    sourceUrl: item.fuenteUrl,
    // Costa Rica specific data
    costaRicaData: {
      tipoNorma: item.tipoNorma,
      tipoEmisor: item.tipoEmisor,
      nivel: item.nivel,
      provincia: item.provincia,
      canton: item.canton,
      organoEmisor: item.organoEmisor,
      organoCompetente: item.organoCompetente,
      comisionLegislativa: item.comisionLegislativa,
      numeroGaceta: item.numeroGaceta,
      plazosTransitorios: item.plazosTransitorios,
      calificadorEstado: item.resumenIA.calificadorEstado,
      // Fechas del proceso legislativo
      fechaPresentacion: item.fechaPresentacion,
      fechaDictamenComision: item.fechaDictamenComision,
      fechaPrimerDebate: item.fechaPrimerDebate,
      fechaSegundoDebate: item.fechaSegundoDebate,
      fechaEnvioEjecutivo: item.fechaEnvioEjecutivo,
      fechaSancionOVeto: item.fechaSancionOVeto,
      fechaPublicacionGaceta: item.fechaPublicacionGaceta
    }
  }));
}

function mapTipoNormaToInstrumentType(tipo: string): string {
  const mapping: Record<string, string> = {
    "proyecto_ley": "proyecto",
    "ley": "ley",
    "decreto_ejecutivo": "decreto",
    "reglamento": "reglamento",
    "resolucion": "resolucion",
    "acuerdo": "resolucion",
    "ordenanza_municipal": "reglamento",
    "reglamento_municipal": "reglamento",
    "normativa_regulatoria": "resolucion",
    "circular": "circular"
  };
  return mapping[tipo] || "ley";
}

function mapTipoNormaToHierarchy(tipo: string): "primary" | "secondary" | "tertiary" | "soft-law" {
  const mapping: Record<string, "primary" | "secondary" | "tertiary" | "soft-law"> = {
    "proyecto_ley": "primary",
    "ley": "primary",
    "decreto_ejecutivo": "secondary",
    "reglamento": "secondary",
    "resolucion": "tertiary",
    "acuerdo": "tertiary",
    "ordenanza_municipal": "tertiary",
    "reglamento_municipal": "tertiary",
    "normativa_regulatoria": "secondary",
    "circular": "soft-law"
  };
  return mapping[tipo] || "primary";
}

function calculateDeadline(item: CostaRicaLegislationItem): string | undefined {
  if (item.fechaEntradaVigencia && item.plazosTransitorios) {
    // Parse months from transitorio text
    const match = item.plazosTransitorios.match(/(\d+)\s*meses/);
    if (match) {
      const months = parseInt(match[1]);
      const vigencia = new Date(item.fechaEntradaVigencia);
      vigencia.setMonth(vigencia.getMonth() + months);
      return vigencia.toISOString().slice(0, 10);
    }
  }
  return undefined;
}

function generateCostaRicaFullText(item: CostaRicaLegislationItem): string {
  const tipoLabel = item.tipoNorma === "proyecto_ley" ? "PROYECTO DE LEY" : 
                    item.tipoNorma.toUpperCase().replace("_", " ");
  
  return `
${item.titulo.toUpperCase()}

REPÚBLICA DE COSTA RICA
${tipoLabel}
${item.identificador}

═══════════════════════════════════════════════════════════════

ÓRGANO EMISOR: ${item.organoEmisor}
${item.organoCompetente ? `ÓRGANO COMPETENTE/FISCALIZADOR: ${item.organoCompetente}` : ""}
${item.comisionLegislativa ? `COMISIÓN LEGISLATIVA: ${item.comisionLegislativa}` : ""}
NIVEL: ${item.nivel === "nacional" ? "Nacional" : item.nivel === "municipal" ? "Municipal (Cantonal)" : "Institucional/Regulatorio"}
${item.provincia ? `PROVINCIA: ${item.provincia}` : ""}
${item.canton ? `CANTÓN: ${item.canton}` : ""}

═══════════════════════════════════════════════════════════════

SECCIÓN 1. PROPÓSITO
${item.resumen}

SECCIÓN 2. PUNTOS PRINCIPALES
${item.puntosImportantes.map((p, i) => `(${i + 1}) ${p}`).join("\n")}

SECCIÓN 3. ESTADO ACTUAL
Estado: ${item.estado}
${item.resumenIA.calificadorEstado}

${item.plazosTransitorios ? `RÉGIMEN TRANSITORIO: ${item.plazosTransitorios}` : ""}

═══════════════════════════════════════════════════════════════

FECHAS RELEVANTES:
${item.fechaPresentacion ? `• Presentación: ${item.fechaPresentacion}` : ""}
${item.fechaDictamenComision ? `• Dictamen de Comisión: ${item.fechaDictamenComision}` : ""}
${item.fechaPrimerDebate ? `• Primer Debate: ${item.fechaPrimerDebate}` : ""}
${item.fechaSegundoDebate ? `• Segundo Debate: ${item.fechaSegundoDebate}` : ""}
${item.fechaEnvioEjecutivo ? `• Envío al Ejecutivo: ${item.fechaEnvioEjecutivo}` : ""}
${item.fechaSancionOVeto ? `• Sanción/Veto: ${item.fechaSancionOVeto}` : ""}
${item.fechaPublicacionGaceta ? `• Publicación en La Gaceta: ${item.fechaPublicacionGaceta}` : ""}
${item.fechaEntradaVigencia ? `• Entrada en Vigencia: ${item.fechaEntradaVigencia}` : ""}
${item.numeroGaceta ? `• Número de Gaceta: ${item.numeroGaceta}` : ""}

═══════════════════════════════════════════════════════════════

FUENTE: ${item.fuenteUrl || "No disponible"}
`.trim();
}

// Pre-converted data
export const enrichedCostaRicaLegislation = convertCostaRicaToUnified(costaRicaLegislationData);
