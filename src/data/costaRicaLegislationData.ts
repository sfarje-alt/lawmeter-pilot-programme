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
      calificadorEstado: "Instrumento en trámite; no aplicable hasta eventual aprobación, sanción y publicación en La Gaceta.",
      
      resumenEjecutivo: "Proyecto que establecería el primer marco legal integral de ciberseguridad en Costa Rica, con énfasis en protección de infraestructura crítica y dispositivos IoT conectados. Afecta directamente a fabricantes de electrodomésticos inteligentes con conectividad WiFi/Bluetooth.",
      
      estadisticas: {
        empresasAfectadasEstimadas: 450,
        costoEstimadoCumplimiento: { min: 15000, max: 85000, moneda: "USD" },
        impactoMercado: "Incremento del 8-15% en costos de certificación para productos IoT en el mercado costarricense",
        tiempoImplementacionMeses: 18,
        rangoSanciones: { min: 5000000, max: 100000000, moneda: "CRC" },
        puntajeComplejidad: 8
      },
      
      analisisRiesgo: {
        puntajeRiesgoGeneral: 88,
        desglosePorCategoria: [
          { categoria: "Riesgo Regulatorio", puntaje: 85, descripcion: "Nuevo marco legal con requisitos técnicos específicos para dispositivos conectados", estrategiaMitigacion: "Adelantar certificación ISO 27001 e implementar controles de seguridad por diseño" },
          { categoria: "Riesgo Operativo", puntaje: 82, descripcion: "Necesidad de sistemas de reporte de incidentes y auditorías periódicas", estrategiaMitigacion: "Establecer equipo interno de respuesta a incidentes y protocolo de notificación" },
          { categoria: "Riesgo Financiero", puntaje: 75, descripcion: "Inversión en certificación y adecuación de productos existentes", estrategiaMitigacion: "Planificar presupuesto de cumplimiento en ciclo 2025-2026" },
          { categoria: "Riesgo Reputacional", puntaje: 70, descripcion: "Exposición por brechas de seguridad en productos IoT", estrategiaMitigacion: "Desarrollar política de divulgación responsable de vulnerabilidades" }
        ],
        probabilidadFiscalizacion: "alta",
        responsabilidadesPotenciales: [
          "Multas administrativas de ₡5 a ₡100 millones",
          "Retiro de productos del mercado por incumplimiento",
          "Prohibición temporal de importación",
          "Publicación de sanciones en medios oficiales"
        ],
        evaluacionRiesgoCompetitivo: "Empresas con productos ya certificados internacionalmente (UL, CE) tendrán ventaja competitiva. Primeros en cumplir pueden diferenciarse en mercado."
      },
      
      analisisActores: [
        { actor: "MICIT", tipo: "regulador", nivelImpacto: "alto", descripcionImpacto: "Autoridad rectora del marco de ciberseguridad nacional", accionesRequeridas: ["Registro en plataforma de incidentes", "Certificación de productos"], cronograma: "Post-aprobación" },
        { actor: "CAMTIC", tipo: "gremio", nivelImpacto: "medio", descripcionImpacto: "Cámara empresarial que representará intereses del sector tecnológico", accionesRequeridas: ["Participar en mesas de trabajo", "Capacitación a asociados"], cronograma: "Inmediato" },
        { actor: "INTECO", tipo: "certificador", nivelImpacto: "alto", descripcionImpacto: "Organismo nacional de normalización que emitirá certificaciones", accionesRequeridas: ["Solicitar certificación de productos IoT"], cronograma: "18 meses post-vigencia" },
        { actor: "Departamento de TI/Producto", tipo: "interno", nivelImpacto: "alto", descripcionImpacto: "Debe evaluar y actualizar firmware de productos conectados", accionesRequeridas: ["Auditoría de seguridad de firmware", "Implementar actualizaciones OTA"], cronograma: "12 meses" }
      ],
      
      requisitosCumplimiento: [
        { requisito: "Certificación de seguridad IoT de productos", prioridad: "critica", fechaLimite: "18 meses post-publicación", esfuerzoEstimado: "12-16 semanas", areaResponsable: "Ingeniería + Calidad" },
        { requisito: "Sistema de reporte de incidentes cibernéticos", prioridad: "critica", fechaLimite: "12 meses post-publicación", esfuerzoEstimado: "8-10 semanas", areaResponsable: "TI + Legal" },
        { requisito: "Auditoría externa de seguridad anual", prioridad: "alta", fechaLimite: "Anual desde vigencia", esfuerzoEstimado: "4-6 semanas/año", areaResponsable: "TI + Cumplimiento" },
        { requisito: "Política de divulgación de vulnerabilidades", prioridad: "media", fechaLimite: "18 meses post-publicación", esfuerzoEstimado: "2-3 semanas", areaResponsable: "Legal + TI" }
      ],
      
      recomendacionesEstrategicas: [
        { titulo: "Auditoría de Seguridad Preventiva", descripcion: "Evaluar postura de seguridad actual de productos IoT para identificar brechas antes de la aprobación de la ley", prioridad: "inmediata", recursosNecesarios: "Consultor de ciberseguridad + equipo de producto (4 semanas)" },
        { titulo: "Certificación ISO 27001 Anticipada", descripcion: "Obtener certificación internacional de seguridad de la información como base para cumplimiento local", prioridad: "corto-plazo", recursosNecesarios: "Gerencia TI + consultor (6-9 meses, presupuesto USD 25,000-40,000)" },
        { titulo: "Programa de Actualización de Firmware", descripcion: "Implementar capacidad de actualizaciones de seguridad remotas (OTA) en línea de productos conectados", prioridad: "mediano-plazo", recursosNecesarios: "Ingeniería de firmware + infraestructura cloud" }
      ],
      
      legislacionRelacionada: [
        { identificador: "Ley N.º 8968", titulo: "Ley de Protección de la Persona frente al Tratamiento de sus Datos Personales", relacion: "relacionada", relevancia: "Marco de protección de datos que complementa requisitos de seguridad." },
        { identificador: "Decreto N.º 37554-MICIT", titulo: "Reglamento de Telecomunicaciones", relacion: "relacionada", relevancia: "Normativa técnica de telecomunicaciones aplicable a dispositivos conectados." }
      ],
      
      benchmarksIndustria: {
        tiempoPromedioCumplimiento: "12-18 meses para empresas con productos IoT existentes",
        nivelPreparacionIndustria: "Bajo - 15% de empresas tienen certificaciones de seguridad IoT, 85% requieren implementación completa",
        tasaAdopcionCompetidores: "Marcas premium (Philips, Bosch) tienen productos certificados en mercados europeos adaptables a CR",
        mejoresPracticas: [
          "Implementar security by design en nuevos desarrollos",
          "Establecer programa de bug bounty para vulnerabilidades",
          "Mantener inventario actualizado de componentes de software (SBOM)"
        ]
      }
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
      calificadorEstado: "Instrumento en trámite; no aplicable hasta eventual aprobación, sanción y publicación en La Gaceta.",
      
      resumenEjecutivo: "Proyecto avanzado que regularía el ecosistema cripto en Costa Rica. Alta probabilidad de aprobación dado consenso bipartidista. Establecería el primer marco regulatorio integral para proveedores de servicios de criptoactivos (PSAV).",
      
      estadisticas: {
        empresasAfectadasEstimadas: 120,
        costoEstimadoCumplimiento: { min: 50000, max: 250000, moneda: "USD" },
        impactoMercado: "Capital mínimo de $500,000 USD eliminará operadores pequeños del mercado, consolidando sector",
        tiempoImplementacionMeses: 6,
        rangoSanciones: { min: 10000000, max: 200000000, moneda: "CRC" },
        puntajeComplejidad: 9
      },
      
      analisisRiesgo: {
        puntajeRiesgoGeneral: 85,
        desglosePorCategoria: [
          { categoria: "Riesgo Regulatorio", puntaje: 90, descripcion: "Nuevo régimen de supervisión SUGEF con requisitos estrictos de licenciamiento", estrategiaMitigacion: "Evaluar tempranamente si operaciones califican como PSAV y preparar documentación de registro" },
          { categoria: "Riesgo Financiero", puntaje: 88, descripcion: "Requisito de capital mínimo elevado y costos de cumplimiento AML", estrategiaMitigacion: "Analizar estructura de capital y explorar alianzas estratégicas si necesario" },
          { categoria: "Riesgo Operativo", puntaje: 78, descripcion: "Implementación de controles KYC/AML y sistemas de reporte", estrategiaMitigacion: "Contratar solución de cumplimiento AML especializada en cripto" },
          { categoria: "Riesgo Legal", puntaje: 75, descripcion: "Responsabilidad personal de directivos por incumplimientos", estrategiaMitigacion: "Revisar estructura de gobierno corporativo y seguros D&O" }
        ],
        probabilidadFiscalizacion: "alta",
        responsabilidadesPotenciales: [
          "Multas hasta ₡200 millones por operación sin licencia",
          "Suspensión de operaciones",
          "Responsabilidad penal por lavado de activos",
          "Inhabilitación de directivos"
        ],
        evaluacionRiesgoCompetitivo: "Empresas con licencias en otras jurisdicciones (Panamá, El Salvador) podrán adaptar procesos. Primeros en obtener licencia SUGEF tendrán ventaja de mercado."
      },
      
      analisisActores: [
        { actor: "SUGEF", tipo: "regulador", nivelImpacto: "alto", descripcionImpacto: "Autoridad supervisora que otorgará licencias y fiscalizará operaciones", accionesRequeridas: ["Solicitud de registro PSAV", "Reportes periódicos de operaciones"], cronograma: "6 meses post-vigencia" },
        { actor: "CONASSIF", tipo: "regulador", nivelImpacto: "alto", descripcionImpacto: "Consejo que emitirá normativa complementaria de detalle", accionesRequeridas: ["Monitorear emisión de reglamentos"], cronograma: "Post-aprobación" },
        { actor: "Exchanges locales", tipo: "sector privado", nivelImpacto: "alto", descripcionImpacto: "Competidores que deberán cumplir mismos requisitos", accionesRequeridas: ["Benchmarking de cumplimiento"], cronograma: "Continuo" },
        { actor: "Departamento Legal/Cumplimiento", tipo: "interno", nivelImpacto: "alto", descripcionImpacto: "Debe diseñar e implementar programa AML/KYC", accionesRequeridas: ["Contratar oficial de cumplimiento", "Implementar sistemas de monitoreo"], cronograma: "4 meses" }
      ],
      
      requisitosCumplimiento: [
        { requisito: "Registro como PSAV ante SUGEF", prioridad: "critica", fechaLimite: "6 meses post-publicación", esfuerzoEstimado: "8-12 semanas", areaResponsable: "Legal + Cumplimiento" },
        { requisito: "Demostración de capital mínimo $500,000", prioridad: "critica", fechaLimite: "Inmediato para nuevos operadores", esfuerzoEstimado: "Variable según situación", areaResponsable: "Finanzas + Legal" },
        { requisito: "Programa AML/KYC documentado", prioridad: "alta", fechaLimite: "Pre-registro", esfuerzoEstimado: "6-8 semanas", areaResponsable: "Cumplimiento" },
        { requisito: "Sistema de reporte de operaciones sospechosas", prioridad: "alta", fechaLimite: "Pre-operación", esfuerzoEstimado: "4-6 semanas", areaResponsable: "TI + Cumplimiento" }
      ],
      
      recomendacionesEstrategicas: [
        { titulo: "Evaluación de Impacto Operacional", descripcion: "Determinar si operaciones actuales o planificadas califican como servicios de criptoactivos bajo la nueva definición legal", prioridad: "inmediata", recursosNecesarios: "Asesor legal especializado en fintech (2 semanas)" },
        { titulo: "Análisis de Viabilidad de Licencia", descripcion: "Si aplica, evaluar capacidad de cumplir requisitos de capital y operativos para obtener licencia PSAV", prioridad: "corto-plazo", recursosNecesarios: "CFO + Legal + consultor regulatorio (4 semanas)" },
        { titulo: "Alternativa de Asociación", descripcion: "Si no viable obtener licencia propia, explorar acuerdos con PSAV licenciados para ofrecer servicios bajo su paraguas regulatorio", prioridad: "mediano-plazo", recursosNecesarios: "Desarrollo de negocios + Legal" }
      ],
      
      legislacionRelacionada: [
        { identificador: "Ley N.º 8204", titulo: "Ley sobre Estupefacientes, Sustancias Psicotrópicas, Drogas de Uso No Autorizado, Actividades Conexas, Legitimación de Capitales y Financiamiento al Terrorismo", relacion: "relacionada", relevancia: "Marco AML/CFT que se aplica a operaciones cripto." },
        { identificador: "Ley N.º 7558", titulo: "Ley Orgánica del Banco Central de Costa Rica", relacion: "relacionada", relevancia: "Define alcance de supervisión del sistema financiero." }
      ],
      
      benchmarksIndustria: {
        tiempoPromedioCumplimiento: "4-6 meses para empresas con experiencia regulatoria financiera",
        nivelPreparacionIndustria: "Medio - 40% de exchanges locales tienen algunos controles AML, 60% operan informalmente",
        tasaAdopcionCompetidores: "Binance y otros exchanges globales ya cumplen estándares similares en otras jurisdicciones",
        mejoresPracticas: [
          "Implementar verificación de identidad biométrica para onboarding",
          "Usar herramientas de análisis blockchain para detección de riesgos",
          "Mantener reservas líquidas 1:1 con activos de clientes"
        ]
      }
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
      calificadorEstado: "Instrumento en trámite; pendiente sanción del Poder Ejecutivo. Posibilidad de veto.",
      
      resumenEjecutivo: "Proyecto de alto impacto directo para fabricantes de hervidores y cafeteras. Ya aprobado por la Asamblea Legislativa, ahora pendiente de sanción presidencial. Existe presión de importadores para veto por costos de certificación.",
      
      estadisticas: {
        empresasAfectadasEstimadas: 85,
        costoEstimadoCumplimiento: { min: 8000, max: 45000, moneda: "USD" },
        impactoMercado: "Eliminación progresiva de productos clase G/F reducirá oferta de equipos económicos en 25-30%",
        tiempoImplementacionMeses: 24,
        rangoSanciones: { min: 2000000, max: 50000000, moneda: "CRC" },
        puntajeComplejidad: 7
      },
      
      analisisRiesgo: {
        puntajeRiesgoGeneral: 92,
        desglosePorCategoria: [
          { categoria: "Riesgo Regulatorio", puntaje: 95, descripcion: "Requisitos de etiquetado y certificación obligatorios para toda la línea de productos", estrategiaMitigacion: "Iniciar proceso de certificación INTECO inmediatamente para productos principales" },
          { categoria: "Riesgo Operativo", puntaje: 88, descripcion: "Necesidad de rediseño de empaques y posible reformulación de productos menos eficientes", estrategiaMitigacion: "Auditar eficiencia de catálogo actual e identificar productos que requieren rediseño" },
          { categoria: "Riesgo Financiero", puntaje: 75, descripcion: "Inversión en certificación y potencial pérdida de inventario no conforme", estrategiaMitigacion: "Liquidar inventario de productos clase G/F antes de entrada en vigencia" },
          { categoria: "Riesgo de Producto", puntaje: 85, descripcion: "Posible discontinuación de SKUs menos eficientes", estrategiaMitigacion: "Evaluar roadmap de productos para priorizar modelos de alta eficiencia" }
        ],
        probabilidadFiscalizacion: "alta",
        responsabilidadesPotenciales: [
          "Multas de ₡2 a ₡50 millones por comercialización sin etiquetado",
          "Decomiso de productos no conformes",
          "Prohibición de importación de productos clase G/F",
          "Publicación en lista de infractores"
        ],
        evaluacionRiesgoCompetitivo: "Fabricantes con líneas premium de alta eficiencia (clase A/B) tendrán ventaja. Productos europeos con etiquetado EU ya cumplen parcialmente."
      },
      
      analisisActores: [
        { actor: "MINAE", tipo: "regulador", nivelImpacto: "alto", descripcionImpacto: "Ministerio responsable de política energética y fiscalización", accionesRequeridas: ["Registro de productos", "Reportes de eficiencia"], cronograma: "12 meses post-vigencia" },
        { actor: "INTECO", tipo: "certificador", nivelImpacto: "alto", descripcionImpacto: "Organismo que emitirá certificaciones de eficiencia energética", accionesRequeridas: ["Solicitud de ensayos", "Obtención de certificado"], cronograma: "18 meses post-vigencia" },
        { actor: "Cámara de Comercio", tipo: "gremio", nivelImpacto: "medio", descripcionImpacto: "Representa intereses de importadores que podrían cabildear por veto", accionesRequeridas: ["Monitorear posición del gremio"], cronograma: "Inmediato" },
        { actor: "Departamento de Calidad", tipo: "interno", nivelImpacto: "alto", descripcionImpacto: "Debe coordinar certificación y actualización de etiquetado", accionesRequeridas: ["Auditar eficiencia de productos", "Coordinar con INTECO"], cronograma: "6 meses" }
      ],
      
      requisitosCumplimiento: [
        { requisito: "Etiquetado energético visible en todos los productos", prioridad: "critica", fechaLimite: "12 meses post-publicación", esfuerzoEstimado: "8-10 semanas", areaResponsable: "Calidad + Marketing" },
        { requisito: "Certificación INTECO de eficiencia energética", prioridad: "critica", fechaLimite: "18 meses post-publicación", esfuerzoEstimado: "12-16 semanas", areaResponsable: "Calidad + I&D" },
        { requisito: "Registro de productos en plataforma MINAE", prioridad: "alta", fechaLimite: "12 meses post-publicación", esfuerzoEstimado: "2-4 semanas", areaResponsable: "Regulatorio" },
        { requisito: "Retiro de productos clase G/F del mercado", prioridad: "alta", fechaLimite: "36 meses post-publicación", esfuerzoEstimado: "Variable según inventario", areaResponsable: "Comercial + Logística" }
      ],
      
      recomendacionesEstrategicas: [
        { titulo: "Auditoría de Eficiencia Energética Urgente", descripcion: "Evaluar consumo energético de toda la línea de hervidores y cafeteras para identificar productos en riesgo de incumplimiento", prioridad: "inmediata", recursosNecesarios: "Laboratorio de ensayos + equipo de I&D (3 semanas)" },
        { titulo: "Pre-Certificación INTECO", descripcion: "Iniciar proceso de certificación anticipada para productos clave antes de promulgación de la ley", prioridad: "corto-plazo", recursosNecesarios: "Calidad + presupuesto de ensayos (USD 5,000-15,000 por modelo)" },
        { titulo: "Rediseño de Productos Clase F/G", descripcion: "Evaluar viabilidad técnica de mejorar eficiencia de modelos actuales o desarrollar reemplazos de mayor eficiencia", prioridad: "mediano-plazo", recursosNecesarios: "I&D + Ingeniería (6-12 meses por modelo)" }
      ],
      
      legislacionRelacionada: [
        { identificador: "Ley N.º 7447", titulo: "Ley de Regulación del Uso Racional de la Energía", relacion: "modifica", relevancia: "Marco legal base que este proyecto complementa con requisitos específicos para electrodomésticos." },
        { identificador: "Decreto N.º 36979-MINAE", titulo: "Reglamento de Etiquetado de Eficiencia Energética", relacion: "relacionada", relevancia: "Normativa vigente de etiquetado que sería ampliada." }
      ],
      
      benchmarksIndustria: {
        tiempoPromedioCumplimiento: "12-18 meses para línea completa de productos",
        nivelPreparacionIndustria: "Medio - 45% de productos importados ya tienen etiquetado EU equivalente, 55% requieren certificación local",
        tasaAdopcionCompetidores: "Marcas premium (Breville, Cuisinart) ya ofrecen productos clase A. Marcas económicas (Hamilton Beach, Black+Decker) tienen mezcla de clases.",
        mejoresPracticas: [
          "Diseñar nuevos productos con eficiencia clase A como objetivo mínimo",
          "Usar etiquetado EU como referencia para adelantar cumplimiento",
          "Comunicar eficiencia como atributo de valor al consumidor"
        ]
      }
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
      calificadorEstado: "Vetado por el Poder Ejecutivo. Pendiente de decisión de la Asamblea Legislativa (resello o archivo).",
      
      resumenEjecutivo: "Proyecto vetado por el Poder Ejecutivo por considerarse que impone cargas desproporcionadas a PYMES. La Asamblea Legislativa puede resellar con 38 votos. De aprobarse, establecería sistema obligatorio de responsabilidad extendida del productor para RAEE.",
      
      estadisticas: {
        empresasAfectadasEstimadas: 200,
        costoEstimadoCumplimiento: { min: 20000, max: 120000, moneda: "USD" },
        impactoMercado: "Incremento de 5-8% en costos operativos por gestión de residuos electrónicos",
        tiempoImplementacionMeses: 12,
        rangoSanciones: { min: 5000000, max: 100000000, moneda: "CRC" },
        puntajeComplejidad: 8
      },
      
      analisisRiesgo: {
        puntajeRiesgoGeneral: 78,
        desglosePorCategoria: [
          { categoria: "Riesgo Regulatorio", puntaje: 75, descripcion: "Proyecto vetado pero posibilidad de resello mantiene incertidumbre", estrategiaMitigacion: "Monitorear votaciones en Asamblea y posiciones de fracciones políticas" },
          { categoria: "Riesgo Operativo", puntaje: 82, descripcion: "Si se resella, necesidad de infraestructura de recolección en cada cantón", estrategiaMitigacion: "Identificar potenciales aliados para gestión compartida de puntos de acopio" },
          { categoria: "Riesgo Financiero", puntaje: 78, descripcion: "Inversión significativa en logística inversa y convenios con gestores", estrategiaMitigacion: "Evaluar modelos de financiamiento colectivo del sector" },
          { categoria: "Riesgo Reputacional", puntaje: 65, descripcion: "Presión de ONGs ambientalistas por cumplimiento proactivo", estrategiaMitigacion: "Considerar programa voluntario de reciclaje para posicionamiento ESG" }
        ],
        probabilidadFiscalizacion: "incierta",
        responsabilidadesPotenciales: [
          "Multas de ₡5 a ₡100 millones por incumplimiento",
          "Obligación de remediación ambiental",
          "Prohibición de comercialización de nuevos productos",
          "Responsabilidad solidaria con gestores de RAEE"
        ],
        evaluacionRiesgoCompetitivo: "Empresas con programas de reciclaje existentes (Sony, Apple) tendrán ventaja. Primeros en implementar pueden capturar mercado de consumidores eco-conscientes."
      },
      
      analisisActores: [
        { actor: "Asamblea Legislativa", tipo: "regulador", nivelImpacto: "alto", descripcionImpacto: "Decidirá si resella el proyecto con mayoría calificada (38 votos)", accionesRequeridas: ["Monitorear votaciones", "Posible incidencia con diputados"], cronograma: "Q1 2025" },
        { actor: "Cámara de Industrias", tipo: "gremio", nivelImpacto: "alto", descripcionImpacto: "Lidera oposición al proyecto por costos para PYMES", accionesRequeridas: ["Participar en mesa técnica del gremio"], cronograma: "Inmediato" },
        { actor: "ONGs Ambientalistas", tipo: "externo", nivelImpacto: "medio", descripcionImpacto: "Presionan por resello y cumplimiento de metas de reciclaje", accionesRequeridas: ["Monitorear campañas públicas"], cronograma: "Continuo" },
        { actor: "Ministerio de Salud / MINAE", tipo: "regulador", nivelImpacto: "alto", descripcionImpacto: "Serían autoridades fiscalizadoras si proyecto se resella", accionesRequeridas: ["Anticipar requerimientos técnicos"], cronograma: "Post-resello" }
      ],
      
      requisitosCumplimiento: [
        { requisito: "Sistema de gestión de RAEE con operadores autorizados", prioridad: "critica", fechaLimite: "12 meses post-publicación (si resello)", esfuerzoEstimado: "16-20 semanas", areaResponsable: "Operaciones + Legal" },
        { requisito: "Puntos de recolección en cada cantón con operaciones", prioridad: "alta", fechaLimite: "18 meses post-publicación (si resello)", esfuerzoEstimado: "20-24 semanas", areaResponsable: "Comercial + Operaciones" },
        { requisito: "Metas de reciclaje: 50% año 1, 70% año 3", prioridad: "alta", fechaLimite: "Anual desde vigencia", esfuerzoEstimado: "Continuo", areaResponsable: "Operaciones + Sostenibilidad" },
        { requisito: "Registro en sistema nacional de gestores RAEE", prioridad: "media", fechaLimite: "6 meses post-publicación (si resello)", esfuerzoEstimado: "2-4 semanas", areaResponsable: "Regulatorio" }
      ],
      
      recomendacionesEstrategicas: [
        { titulo: "Monitoreo Legislativo Activo", descripcion: "Seguir de cerca posiciones de fracciones legislativas y probabilidad de resello para anticipar escenarios", prioridad: "inmediata", recursosNecesarios: "Asesor de asuntos públicos + Legal (continuo)" },
        { titulo: "Alianza Sectorial Preventiva", descripcion: "Explorar alianza con otros fabricantes/importadores para establecer sistema de gestión RAEE compartido que reduzca costos individuales", prioridad: "corto-plazo", recursosNecesarios: "Gerencia + Legal + representante ante Cámara (8 semanas negociación)" },
        { titulo: "Programa Voluntario de Reciclaje", descripcion: "Considerar implementar programa piloto de reciclaje voluntario para posicionamiento ESG y preparación ante eventual obligatoriedad", prioridad: "mediano-plazo", recursosNecesarios: "Marketing + Operaciones + presupuesto piloto" }
      ],
      
      legislacionRelacionada: [
        { identificador: "Ley N.º 8839", titulo: "Ley para la Gestión Integral de Residuos", relacion: "modifica", relevancia: "Marco legal base de gestión de residuos que este proyecto complementa para RAEE." },
        { identificador: "Decreto N.º 35933-S", titulo: "Reglamento para la Gestión Integral de Residuos Electrónicos", relacion: "relacionada", relevancia: "Normativa vigente de gestión de RAEE que sería fortalecida." }
      ],
      
      benchmarksIndustria: {
        tiempoPromedioCumplimiento: "8-12 meses para implementar sistema de gestión RAEE",
        nivelPreparacionIndustria: "Bajo - 20% de empresas tienen programas de reciclaje, 80% sin infraestructura de logística inversa",
        tasaAdopcionCompetidores: "Marcas globales (Samsung, LG, Apple) ya operan programas REP en otros países con modelos adaptables",
        mejoresPracticas: [
          "Establecer convenios con retailers para puntos de acopio en tiendas",
          "Implementar programa de trade-in con incentivo comercial",
          "Aliarse con gestores de RAEE certificados"
        ]
      }
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
      calificadorEstado: "Norma vigente desde 15/12/2024. Cumplimiento inmediato requerido.",
      
      resumenEjecutivo: "Decreto ejecutivo ya en vigor que establece requisitos técnicos obligatorios de seguridad eléctrica para electrodomésticos. Impacto directo e inmediato para fabricantes de hervidores y cafeteras que comercializan en Costa Rica.",
      
      estadisticas: {
        empresasAfectadasEstimadas: 150,
        costoEstimadoCumplimiento: { min: 5000, max: 35000, moneda: "USD" },
        impactoMercado: "Barrera de entrada para productos sin certificación internacional previa. Productos no certificados no pueden comercializarse.",
        tiempoImplementacionMeses: 6,
        rangoSanciones: { min: 1000000, max: 25000000, moneda: "CRC" },
        puntajeComplejidad: 7
      },
      
      analisisRiesgo: {
        puntajeRiesgoGeneral: 90,
        desglosePorCategoria: [
          { categoria: "Riesgo Regulatorio", puntaje: 95, descripcion: "Norma ya vigente con fiscalización activa del MEIC", estrategiaMitigacion: "Verificar inmediatamente certificación de todos los productos en catálogo" },
          { categoria: "Riesgo Operativo", puntaje: 85, descripcion: "Productos sin certificación deben retirarse del mercado", estrategiaMitigacion: "Priorizar certificación de productos de mayor rotación" },
          { categoria: "Riesgo Financiero", puntaje: 78, descripcion: "Costos de certificación y posible pérdida de inventario", estrategiaMitigacion: "Negociar con laboratorios acreditados tarifas preferenciales por volumen" },
          { categoria: "Riesgo Comercial", puntaje: 82, descripcion: "Imposibilidad de comercializar productos no conformes", estrategiaMitigacion: "Comunicar a clientes situación de cumplimiento de cada SKU" }
        ],
        probabilidadFiscalizacion: "alta",
        responsabilidadesPotenciales: [
          "Multas de ₡1 a ₡25 millones por producto no conforme",
          "Decomiso de inventario sin certificación",
          "Prohibición de comercialización",
          "Responsabilidad por daños en caso de accidentes"
        ],
        evaluacionRiesgoCompetitivo: "Productos con certificación CE o UL tienen ventaja pues cumplen estándares IEC. Marcas premium ya certificadas pueden capturar mercado de competidores no conformes."
      },
      
      analisisActores: [
        { actor: "MEIC", tipo: "regulador", nivelImpacto: "alto", descripcionImpacto: "Autoridad fiscalizadora que realiza inspecciones de mercado y procesa denuncias", accionesRequeridas: ["Registro de productos", "Mantener certificados disponibles"], cronograma: "Inmediato" },
        { actor: "INTECO", tipo: "certificador", nivelImpacto: "alto", descripcionImpacto: "Organismo nacional de normalización que emite certificados de conformidad", accionesRequeridas: ["Solicitar ensayos", "Obtener certificados"], cronograma: "Urgente - 60 días" },
        { actor: "Laboratorios Acreditados", tipo: "externo", nivelImpacto: "alto", descripcionImpacto: "Realizan ensayos de conformidad IEC 60335", accionesRequeridas: ["Contratar ensayos", "Enviar muestras"], cronograma: "Inmediato" },
        { actor: "Departamento de Calidad", tipo: "interno", nivelImpacto: "alto", descripcionImpacto: "Debe coordinar proceso de certificación de toda la línea", accionesRequeridas: ["Inventariar productos sin certificar", "Priorizar certificación"], cronograma: "Esta semana" }
      ],
      
      requisitosCumplimiento: [
        { requisito: "Certificación IEC 60335-2-15 para hervidores", prioridad: "critica", fechaLimite: "Vigente ahora", esfuerzoEstimado: "4-8 semanas por modelo", areaResponsable: "Calidad + Ingeniería" },
        { requisito: "Certificación IEC 60335-2-14 para cafeteras", prioridad: "critica", fechaLimite: "Vigente ahora", esfuerzoEstimado: "4-8 semanas por modelo", areaResponsable: "Calidad + Ingeniería" },
        { requisito: "Certificación EMC (compatibilidad electromagnética)", prioridad: "alta", fechaLimite: "Vigente ahora", esfuerzoEstimado: "2-4 semanas por modelo", areaResponsable: "Calidad" },
        { requisito: "Etiquetado de seguridad en productos y empaques", prioridad: "alta", fechaLimite: "Vigente ahora", esfuerzoEstimado: "2 semanas", areaResponsable: "Marketing + Operaciones" }
      ],
      
      recomendacionesEstrategicas: [
        { titulo: "Auditoría de Cumplimiento Urgente", descripcion: "Inventariar inmediatamente todos los productos en catálogo y verificar estado de certificación de cada uno", prioridad: "inmediata", recursosNecesarios: "Calidad + base de datos de productos (1 semana)" },
        { titulo: "Priorización de Certificación", descripcion: "Ordenar productos por volumen de ventas y margen, certificar primero los de mayor impacto comercial", prioridad: "inmediata", recursosNecesarios: "Gerencia + Calidad + presupuesto de ensayos" },
        { titulo: "Gestión de Inventario No Conforme", descripcion: "Definir estrategia para inventario sin certificar: exportar a mercados sin requisito, liquidar con descuento, o destruir", prioridad: "corto-plazo", recursosNecesarios: "Comercial + Legal + Logística" }
      ],
      
      legislacionRelacionada: [
        { identificador: "Ley N.º 8279", titulo: "Ley del Sistema Nacional para la Calidad", relacion: "base", relevancia: "Marco legal que fundamenta los reglamentos técnicos costarricenses." },
        { identificador: "RTCR 478:2015", titulo: "Reglamento Técnico de Seguridad para Electrodomésticos", relacion: "modifica", relevancia: "Reglamento técnico previo que este decreto actualiza y fortalece." }
      ],
      
      benchmarksIndustria: {
        tiempoPromedioCumplimiento: "4-8 semanas por modelo para empresas con productos previamente certificados (CE, UL)",
        nivelPreparacionIndustria: "Medio - 60% de marcas premium ya tienen certificaciones internacionales equivalentes, 40% requiere certificación desde cero",
        tasaAdopcionCompetidores: "Marcas globales (Philips, Bosch, Cuisinart) cumplen automáticamente por certificación CE. Marcas económicas enfrentan mayor reto.",
        mejoresPracticas: [
          "Mantener certificaciones internacionales actualizadas (CE, UL) que facilitan cumplimiento local",
          "Establecer relación con laboratorio acreditado para ensayos recurrentes",
          "Diseñar nuevos productos con cumplimiento IEC desde fase de desarrollo"
        ]
      }
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
      calificadorEstado: "Norma vigente desde 01/03/2025. Cumplimiento obligatorio.",
      
      resumenEjecutivo: "Reglamento vigente que establece estándares de eficiencia energética obligatorios para equipos de calentamiento de agua. Control aduanero activo rechaza productos que no cumplan con eficiencia mínima del 85%.",
      
      estadisticas: {
        empresasAfectadasEstimadas: 80,
        costoEstimadoCumplimiento: { min: 3000, max: 20000, moneda: "USD" },
        impactoMercado: "Eliminación de productos de baja eficiencia del mercado. Incremento de precios promedio en 10-15% por productos de mayor calidad.",
        tiempoImplementacionMeses: 4,
        rangoSanciones: { min: 500000, max: 10000000, moneda: "CRC" },
        puntajeComplejidad: 6
      },
      
      analisisRiesgo: {
        puntajeRiesgoGeneral: 85,
        desglosePorCategoria: [
          { categoria: "Riesgo Regulatorio", puntaje: 90, descripcion: "Control aduanero automático rechaza productos sin certificado", estrategiaMitigacion: "Obtener certificación de eficiencia antes de cualquier importación" },
          { categoria: "Riesgo Operativo", puntaje: 82, descripcion: "Posible rechazo de embarques en aduana", estrategiaMitigacion: "Verificar eficiencia de cada modelo antes de ordenar producción" },
          { categoria: "Riesgo Financiero", puntaje: 75, descripcion: "Costos de re-exportación o destrucción de productos rechazados", estrategiaMitigacion: "Solicitar certificado de eficiencia a fábrica antes de embarque" },
          { categoria: "Riesgo de Cadena de Suministro", puntaje: 78, descripcion: "Retrasos por verificación aduanera", estrategiaMitigacion: "Incluir certificado de eficiencia en documentación de importación" }
        ],
        probabilidadFiscalizacion: "alta",
        responsabilidadesPotenciales: [
          "Rechazo de embarque en aduana",
          "Multas de ₡500,000 a ₡10 millones",
          "Costos de re-exportación o destrucción",
          "Pérdida de mercancía perecedera en puerto"
        ],
        evaluacionRiesgoCompetitivo: "Fabricantes con líneas de alta eficiencia tendrán ventaja. Productos europeos clase A+ ya cumplen. Marcas económicas de baja eficiencia excluidas del mercado."
      },
      
      analisisActores: [
        { actor: "MINAE", tipo: "regulador", nivelImpacto: "alto", descripcionImpacto: "Define estándares de eficiencia y fiscaliza cumplimiento post-importación", accionesRequeridas: ["Registro de productos", "Reportes de eficiencia"], cronograma: "Pre-importación" },
        { actor: "Dirección General de Aduanas", tipo: "regulador", nivelImpacto: "alto", descripcionImpacto: "Verifica certificación en punto de ingreso al país", accionesRequeridas: ["Presentar certificado con documentos de importación"], cronograma: "En cada importación" },
        { actor: "Laboratorios de Ensayo", tipo: "externo", nivelImpacto: "alto", descripcionImpacto: "Emiten certificados de eficiencia energética", accionesRequeridas: ["Contratar ensayos de eficiencia"], cronograma: "Antes de importar" },
        { actor: "Departamento de Importaciones", tipo: "interno", nivelImpacto: "alto", descripcionImpacto: "Debe verificar certificación antes de cada orden", accionesRequeridas: ["Actualizar checklist de documentos", "Verificar cumplimiento por SKU"], cronograma: "Inmediato" }
      ],
      
      requisitosCumplimiento: [
        { requisito: "Certificado de eficiencia ≥85% para hervidores", prioridad: "critica", fechaLimite: "Vigente ahora", esfuerzoEstimado: "2-4 semanas por modelo", areaResponsable: "Calidad + Importaciones" },
        { requisito: "Etiqueta de eficiencia energética visible en producto", prioridad: "alta", fechaLimite: "Vigente ahora", esfuerzoEstimado: "1-2 semanas", areaResponsable: "Marketing + Operaciones" },
        { requisito: "Declaración de eficiencia en documentos aduaneros", prioridad: "alta", fechaLimite: "En cada importación", esfuerzoEstimado: "Permanente", areaResponsable: "Importaciones" },
        { requisito: "Registro en sistema de eficiencia MINAE", prioridad: "media", fechaLimite: "30 días post-primera importación", esfuerzoEstimado: "1 semana", areaResponsable: "Regulatorio" }
      ],
      
      recomendacionesEstrategicas: [
        { titulo: "Verificación de Catálogo de Productos", descripcion: "Auditar eficiencia energética de cada modelo de hervidor y cafetera en catálogo actual", prioridad: "inmediata", recursosNecesarios: "Ingeniería + fichas técnicas de productos (1 semana)" },
        { titulo: "Actualización de Proveedores", descripcion: "Solicitar a fábricas certificados de eficiencia actualizados para todos los modelos", prioridad: "inmediata", recursosNecesarios: "Compras + comunicación con proveedores (2 semanas)" },
        { titulo: "Rediseño de Línea Económica", descripcion: "Evaluar si modelos de baja eficiencia pueden actualizarse o deben descontinuarse", prioridad: "corto-plazo", recursosNecesarios: "Ingeniería + análisis de viabilidad por modelo" }
      ],
      
      legislacionRelacionada: [
        { identificador: "Ley N.º 7447", titulo: "Ley de Regulación del Uso Racional de la Energía", relacion: "base", relevancia: "Marco legal que fundamenta los estándares de eficiencia energética." },
        { identificador: "Decreto N.º 36979-MINAE", titulo: "Reglamento de Etiquetado Energético", relacion: "complementa", relevancia: "Define sistema de etiquetado de eficiencia que este decreto referencia." }
      ],
      
      benchmarksIndustria: {
        tiempoPromedioCumplimiento: "2-4 semanas para productos con documentación de eficiencia del fabricante",
        nivelPreparacionIndustria: "Medio-Alto - 70% de hervidores de marcas reconocidas ya cumplen 85%, productos económicos típicamente no cumplen",
        tasaAdopcionCompetidores: "Marcas premium (Breville, KitchenAid) superan ampliamente 85%. Marcas genéricas asiáticas enfrentan mayor reto.",
        mejoresPracticas: [
          "Especificar eficiencia mínima de 85% en órdenes de compra a fábricas",
          "Solicitar certificado de eficiencia antes de confirmar pedidos",
          "Incluir verificación de eficiencia en proceso de desarrollo de nuevos productos"
        ]
      }
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
      calificadorEstado: "Norma vigente desde 01/05/2025. Plazo transitorio de 18 meses para productos existentes.",
      
      resumenEjecutivo: "Reglamento sanitario crítico que establece requisitos de inocuidad para materiales en contacto con agua y alimentos en electrodomésticos. Requiere certificación BPA-free, pruebas de migración de sustancias, y registro sanitario obligatorio.",
      
      estadisticas: {
        empresasAfectadasEstimadas: 100,
        costoEstimadoCumplimiento: { min: 8000, max: 50000, moneda: "USD" },
        impactoMercado: "Mayor escrutinio de materiales plásticos y recubrimientos internos. Productos con materiales de baja calidad quedarán excluidos.",
        tiempoImplementacionMeses: 18,
        rangoSanciones: { min: 2000000, max: 50000000, moneda: "CRC" },
        puntajeComplejidad: 8
      },
      
      analisisRiesgo: {
        puntajeRiesgoGeneral: 88,
        desglosePorCategoria: [
          { categoria: "Riesgo Regulatorio", puntaje: 88, descripcion: "Requisitos técnicos específicos de composición de materiales", estrategiaMitigacion: "Solicitar certificados de materiales a proveedores de componentes" },
          { categoria: "Riesgo de Salud Pública", puntaje: 92, descripcion: "Materiales en contacto con agua caliente pueden liberar sustancias nocivas", estrategiaMitigacion: "Verificar composición de todos los materiales en contacto con líquidos" },
          { categoria: "Riesgo Operativo", puntaje: 80, descripcion: "Necesidad de pruebas de laboratorio especializadas", estrategiaMitigacion: "Identificar laboratorios acreditados para pruebas de migración" },
          { categoria: "Riesgo Reputacional", puntaje: 85, descripcion: "Exposición mediática por presencia de BPA u otras sustancias", estrategiaMitigacion: "Comunicar proactivamente certificación BPA-free en marketing" }
        ],
        probabilidadFiscalizacion: "media",
        responsabilidadesPotenciales: [
          "Multas de ₡2 a ₡50 millones por incumplimiento",
          "Retiro de productos del mercado por riesgo sanitario",
          "Responsabilidad civil por daños a la salud",
          "Daño reputacional severo por incidentes de salud pública"
        ],
        evaluacionRiesgoCompetitivo: "Marcas premium con materiales certificados (Tritan, acero inoxidable) tienen ventaja. Productos con plásticos genéricos enfrentan mayor escrutinio."
      },
      
      analisisActores: [
        { actor: "Ministerio de Salud", tipo: "regulador", nivelImpacto: "alto", descripcionImpacto: "Autoridad sanitaria que define estándares y fiscaliza cumplimiento", accionesRequeridas: ["Registro sanitario de productos", "Reportes de conformidad"], cronograma: "18 meses para productos existentes" },
        { actor: "ARS (Área Rectora de Salud)", tipo: "regulador", nivelImpacto: "alto", descripcionImpacto: "Realiza inspecciones y procesa denuncias sanitarias", accionesRequeridas: ["Mantener documentación de materiales disponible"], cronograma: "Continuo" },
        { actor: "Laboratorios de Ensayo Sanitario", tipo: "externo", nivelImpacto: "alto", descripcionImpacto: "Realizan pruebas de migración y certifican materiales", accionesRequeridas: ["Contratar ensayos de migración", "Obtener certificados BPA-free"], cronograma: "12 meses" },
        { actor: "Departamento de I+D/Calidad", tipo: "interno", nivelImpacto: "alto", descripcionImpacto: "Debe verificar composición de materiales y coordinar pruebas", accionesRequeridas: ["Auditar materiales de productos", "Solicitar certificados a proveedores"], cronograma: "6 meses" }
      ],
      
      requisitosCumplimiento: [
        { requisito: "Certificación BPA-free de materiales plásticos", prioridad: "critica", fechaLimite: "18 meses para productos existentes", esfuerzoEstimado: "8-12 semanas por línea de producto", areaResponsable: "Calidad + I&D" },
        { requisito: "Pruebas de migración con simulantes de alimentos", prioridad: "critica", fechaLimite: "18 meses para productos existentes", esfuerzoEstimado: "4-6 semanas por modelo", areaResponsable: "Calidad" },
        { requisito: "Registro sanitario ante Ministerio de Salud", prioridad: "alta", fechaLimite: "Antes de comercialización de nuevos productos", esfuerzoEstimado: "4-8 semanas", areaResponsable: "Regulatorio + Legal" },
        { requisito: "Documentación de composición de materiales", prioridad: "alta", fechaLimite: "Permanente", esfuerzoEstimado: "2 semanas inicial, luego continuo", areaResponsable: "Calidad + Compras" }
      ],
      
      recomendacionesEstrategicas: [
        { titulo: "Auditoría de Materiales de Productos", descripcion: "Mapear todos los materiales en contacto con líquidos en hervidores y cafeteras, identificando composición química", prioridad: "inmediata", recursosNecesarios: "I&D + fichas técnicas de proveedores (3 semanas)" },
        { titulo: "Certificación de Proveedores", descripcion: "Solicitar a proveedores de componentes plásticos certificados de composición y conformidad BPA-free", prioridad: "corto-plazo", recursosNecesarios: "Compras + comunicación con proveedores (4 semanas)" },
        { titulo: "Actualización de Especificaciones de Materiales", descripcion: "Incluir requisitos de inocuidad alimentaria en especificaciones de compra de materiales", prioridad: "mediano-plazo", recursosNecesarios: "I&D + Compras + actualización de contratos" }
      ],
      
      legislacionRelacionada: [
        { identificador: "Ley N.º 5395", titulo: "Ley General de Salud", relacion: "base", relevancia: "Marco legal general de salud pública que fundamenta requisitos sanitarios." },
        { identificador: "RTCA 67.04.54:10", titulo: "Reglamento Técnico Centroamericano sobre Aditivos Alimentarios", relacion: "relacionada", relevancia: "Norma regional sobre sustancias en contacto con alimentos." }
      ],
      
      benchmarksIndustria: {
        tiempoPromedioCumplimiento: "12-18 meses para certificación completa de línea de productos",
        nivelPreparacionIndustria: "Medio - 50% de marcas premium ya usan materiales certificados, 50% requiere evaluación y posible cambio de materiales",
        tasaAdopcionCompetidores: "Marcas europeas ya cumplen regulaciones EU más estrictas. Marcas con componentes Tritan (Eastman) tienen ventaja.",
        mejoresPracticas: [
          "Especificar materiales BPA-free en desarrollo de nuevos productos",
          "Mantener trazabilidad completa de materiales en contacto con alimentos",
          "Comunicar certificación de materiales como diferenciador de marketing"
        ]
      }
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
      calificadorEstado: "Norma vigente en jurisdicción municipal de Escazú desde 01/10/2024.",
      
      resumenEjecutivo: "Reglamento de alcance local limitado al cantón de Escazú. Bajo impacto para fabricantes dado que la mayoría de hervidores y cafeteras cumplen con el límite de 55 dB(A). Afecta principalmente a comercios minoristas del cantón.",
      
      estadisticas: {
        empresasAfectadasEstimadas: 25,
        costoEstimadoCumplimiento: { min: 500, max: 2000, moneda: "USD" },
        impactoMercado: "Mínimo - la mayoría de electrodomésticos modernos cumplen naturalmente con los límites establecidos",
        tiempoImplementacionMeses: 1,
        rangoSanciones: { min: 100000, max: 500000, moneda: "CRC" },
        puntajeComplejidad: 2
      },
      
      analisisRiesgo: {
        puntajeRiesgoGeneral: 35,
        desglosePorCategoria: [
          { categoria: "Riesgo Regulatorio", puntaje: 30, descripcion: "Requisito de etiquetado local con alcance limitado", estrategiaMitigacion: "Incluir especificación de ruido en fichas técnicas estándar" },
          { categoria: "Riesgo Operativo", puntaje: 35, descripcion: "Necesidad de verificar niveles de ruido en documentación", estrategiaMitigacion: "Solicitar dato de dB a fabricante si no está en ficha técnica" },
          { categoria: "Riesgo Comercial", puntaje: 25, descripcion: "Alcance muy limitado - solo comercios en Escazú", estrategiaMitigacion: "Comunicar a distribuidores en Escazú sobre requisito" }
        ],
        probabilidadFiscalizacion: "baja",
        responsabilidadesPotenciales: [
          "Multas municipales de ₡100,000 a ₡500,000",
          "Apercibimiento a comerciantes",
          "Clausura temporal de local en caso de reincidencia"
        ],
        evaluacionRiesgoCompetitivo: "Sin impacto competitivo significativo. La mayoría de productos cumplen. Solo afecta a equipos industriales de alto ruido, no electrodomésticos domésticos."
      },
      
      analisisActores: [
        { actor: "Municipalidad de Escazú", tipo: "regulador", nivelImpacto: "medio", descripcionImpacto: "Autoridad local que fiscaliza cumplimiento en comercios del cantón", accionesRequeridas: ["Verificar que distribuidores en Escazú tengan información"], cronograma: "Bajo demanda" },
        { actor: "Comercios en Escazú", tipo: "distribuidor", nivelImpacto: "alto", descripcionImpacto: "Responsables directos de exhibir información de ruido", accionesRequeridas: ["Proveer información de dB a distribuidores"], cronograma: "Continuo" },
        { actor: "Departamento de Marketing", tipo: "interno", nivelImpacto: "bajo", descripcionImpacto: "Puede incluir dato de ruido en materiales de producto", accionesRequeridas: ["Agregar dB a fichas técnicas si no existe"], cronograma: "Siguiente actualización de materiales" }
      ],
      
      requisitosCumplimiento: [
        { requisito: "Información de nivel de ruido (dB) disponible para productos", prioridad: "baja", fechaLimite: "Vigente ahora (solo Escazú)", esfuerzoEstimado: "1-2 días", areaResponsable: "Marketing" },
        { requisito: "Comunicación a distribuidores en Escazú", prioridad: "baja", fechaLimite: "Cuando aplique", esfuerzoEstimado: "1 día", areaResponsable: "Comercial" }
      ],
      
      recomendacionesEstrategicas: [
        { titulo: "Actualización de Fichas Técnicas", descripcion: "Incluir nivel de ruido en dB(A) en fichas técnicas estándar de todos los productos para cumplir con este y futuros requisitos similares", prioridad: "baja", recursosNecesarios: "Marketing + datos de fabricante (2-3 días)" },
        { titulo: "Monitoreo de Expansión Normativa", descripcion: "Vigilar si otros cantones adoptan normativas similares para anticipar cumplimiento a mayor escala", prioridad: "baja", recursosNecesarios: "Regulatorio + monitoreo periódico" }
      ],
      
      legislacionRelacionada: [
        { identificador: "Ley N.º 7554", titulo: "Ley Orgánica del Ambiente", relacion: "base", relevancia: "Marco legal ambiental que fundamenta regulaciones de ruido." },
        { identificador: "Decreto N.º 28718-S", titulo: "Reglamento para el Control de la Contaminación por Ruido", relacion: "relacionada", relevancia: "Normativa nacional de ruido que este reglamento municipal complementa." }
      ],
      
      benchmarksIndustria: {
        tiempoPromedioCumplimiento: "Inmediato para productos con especificación de ruido disponible",
        nivelPreparacionIndustria: "Alto - 90% de fabricantes ya reportan niveles de ruido en especificaciones técnicas",
        tasaAdopcionCompetidores: "Todas las marcas reconocidas incluyen especificaciones de ruido en documentación estándar",
        mejoresPracticas: [
          "Incluir nivel de ruido en especificaciones técnicas de todos los productos",
          "Diseñar productos con reducción de ruido como característica diferenciadora"
        ]
      }
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
      calificadorEstado: "Norma vigente en jurisdicción municipal de Alajuela desde 01/09/2024.",
      
      resumenEjecutivo: "Ordenanza de alcance muy local que regula específicamente la venta de electrodomésticos en el Mercado Central de Alajuela. Afecta principalmente a comerciantes del mercado, con impacto indirecto para fabricantes que deben proveer documentación de cumplimiento a sus distribuidores.",
      
      estadisticas: {
        empresasAfectadasEstimadas: 15,
        costoEstimadoCumplimiento: { min: 200, max: 1000, moneda: "USD" },
        impactoMercado: "Mínimo - afecta canal de distribución muy específico con volumen limitado",
        tiempoImplementacionMeses: 1,
        rangoSanciones: { min: 50000, max: 200000, moneda: "CRC" },
        puntajeComplejidad: 2
      },
      
      analisisRiesgo: {
        puntajeRiesgoGeneral: 25,
        desglosePorCategoria: [
          { categoria: "Riesgo Regulatorio", puntaje: 20, descripcion: "Requisitos básicos de exhibición de documentos existentes", estrategiaMitigacion: "Proveer copias de certificados a distribuidores autorizados" },
          { categoria: "Riesgo Operativo", puntaje: 25, descripcion: "Necesidad de material de apoyo para comerciantes", estrategiaMitigacion: "Crear kit de documentos para punto de venta" },
          { categoria: "Riesgo Comercial", puntaje: 20, descripcion: "Alcance limitado a un mercado municipal específico", estrategiaMitigacion: "Identificar distribuidores en Mercado Central y proveer documentación" }
        ],
        probabilidadFiscalizacion: "baja",
        responsabilidadesPotenciales: [
          "Multas municipales de ₡50,000 a ₡200,000 para comerciantes",
          "Apercibimiento a comerciantes sin documentación",
          "Posible retiro de productos sin certificados exhibidos"
        ],
        evaluacionRiesgoCompetitivo: "Sin impacto competitivo. Beneficia a marcas con documentación completa y certificaciones vigentes."
      },
      
      analisisActores: [
        { actor: "Municipalidad de Alajuela", tipo: "regulador", nivelImpacto: "bajo", descripcionImpacto: "Fiscaliza comerciantes del Mercado Central", accionesRequeridas: ["Verificar que distribuidores tengan documentación"], cronograma: "Bajo demanda" },
        { actor: "Comerciantes del Mercado Central", tipo: "distribuidor", nivelImpacto: "alto", descripcionImpacto: "Responsables directos de exhibir certificados y garantías", accionesRequeridas: ["Proveer copias de certificados", "Asegurar garantía mínima de 6 meses"], cronograma: "Continuo" },
        { actor: "Departamento Comercial", tipo: "interno", nivelImpacto: "bajo", descripcionImpacto: "Debe identificar y apoyar a distribuidores en el mercado", accionesRequeridas: ["Identificar distribuidores", "Proveer material de apoyo"], cronograma: "Única vez" }
      ],
      
      requisitosCumplimiento: [
        { requisito: "Proveer copias de certificados de seguridad a distribuidores", prioridad: "baja", fechaLimite: "Vigente ahora (solo Mercado Central Alajuela)", esfuerzoEstimado: "1-2 días", areaResponsable: "Comercial" },
        { requisito: "Asegurar garantía mínima de 6 meses en productos", prioridad: "baja", fechaLimite: "Ya cumplido (garantía estándar)", esfuerzoEstimado: "0 (ya cumplido)", areaResponsable: "N/A" },
        { requisito: "Material informativo de eficiencia energética", prioridad: "baja", fechaLimite: "Vigente ahora", esfuerzoEstimado: "1 día", areaResponsable: "Marketing" }
      ],
      
      recomendacionesEstrategicas: [
        { titulo: "Kit de Documentos para Distribuidores", descripcion: "Crear paquete estándar con copias de certificados, garantías y fichas de eficiencia energética para entregar a distribuidores autorizados", prioridad: "baja", recursosNecesarios: "Marketing + Comercial (1-2 días)" },
        { titulo: "Mapeo de Canal de Distribución", descripcion: "Identificar si hay distribuidores de la marca en Mercado Central de Alajuela y asegurar que tengan documentación", prioridad: "baja", recursosNecesarios: "Comercial (1 día de verificación)" }
      ],
      
      legislacionRelacionada: [
        { identificador: "Ley N.º 7472", titulo: "Ley de Promoción de la Competencia y Defensa Efectiva del Consumidor", relacion: "base", relevancia: "Marco legal de protección al consumidor que fundamenta requisitos de garantía." },
        { identificador: "Código Municipal", titulo: "Ley N.º 7794 - Código Municipal", relacion: "base", relevancia: "Otorga potestad a municipalidades para emitir ordenanzas locales." }
      ],
      
      benchmarksIndustria: {
        tiempoPromedioCumplimiento: "Inmediato - requiere solo distribución de documentación existente",
        nivelPreparacionIndustria: "Alto - 95% de fabricantes formales ya cuentan con toda la documentación requerida",
        tasaAdopcionCompetidores: "Cumplimiento automático para marcas con procesos comerciales estructurados",
        mejoresPracticas: [
          "Mantener kit de documentos actualizado para distribuidores",
          "Incluir certificados y garantías en empaque de productos"
        ]
      }
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
      calificadorEstado: "Norma vigente desde 01/01/2025. Régimen transitorio para pequeños comercios.",
      
      resumenEjecutivo: "Normativa del regulador financiero SUGEF que establece requisitos de ciberseguridad para procesamiento de pagos electrónicos. Aplica a fabricantes de electrodomésticos solo si operan canales de venta directa al consumidor con procesamiento propio de pagos con tarjeta.",
      
      estadisticas: {
        empresasAfectadasEstimadas: 500,
        costoEstimadoCumplimiento: { min: 15000, max: 80000, moneda: "USD" },
        impactoMercado: "Consolidación de proveedores de servicios de pago. Empresas pequeñas migrarán a pasarelas de pago terceras.",
        tiempoImplementacionMeses: 6,
        rangoSanciones: { min: 5000000, max: 100000000, moneda: "CRC" },
        puntajeComplejidad: 8
      },
      
      analisisRiesgo: {
        puntajeRiesgoGeneral: 65,
        desglosePorCategoria: [
          { categoria: "Riesgo Regulatorio", puntaje: 70, descripcion: "Requisitos técnicos específicos de PCI-DSS y protección de datos", estrategiaMitigacion: "Evaluar si es más viable usar pasarela de pago tercera certificada" },
          { categoria: "Riesgo Operativo", puntaje: 75, descripcion: "Necesidad de sistemas de seguridad especializados y auditorías", estrategiaMitigacion: "Contratar proveedor de pagos certificado si no se procesa directamente" },
          { categoria: "Riesgo Financiero", puntaje: 60, descripcion: "Inversión significativa en seguridad si se procesa directamente", estrategiaMitigacion: "Comparar costo de cumplimiento vs. comisiones de pasarela tercera" },
          { categoria: "Riesgo de Datos", puntaje: 80, descripcion: "Exposición por brechas de datos de pago", estrategiaMitigacion: "Minimizar almacenamiento de datos sensibles, usar tokenización" }
        ],
        probabilidadFiscalizacion: "alta",
        responsabilidadesPotenciales: [
          "Multas de ₡5 a ₡100 millones por incumplimiento",
          "Suspensión de capacidad de procesamiento de pagos",
          "Responsabilidad por fraudes y brechas de datos",
          "Notificación obligatoria a clientes afectados por brechas"
        ],
        evaluacionRiesgoCompetitivo: "Empresas que usan pasarelas de pago certificadas (PayPal, Stripe, BAC) no se ven afectadas directamente. Solo aplica a procesadores directos."
      },
      
      analisisActores: [
        { actor: "SUGEF", tipo: "regulador", nivelImpacto: "alto", descripcionImpacto: "Autoridad supervisora que fiscaliza cumplimiento y procesa denuncias", accionesRequeridas: ["Reportes de cumplimiento", "Notificación de brechas"], cronograma: "Continuo" },
        { actor: "Proveedores de Pasarelas de Pago", tipo: "externo", nivelImpacto: "alto", descripcionImpacto: "Alternativa de cumplimiento al delegar procesamiento", accionesRequeridas: ["Evaluar migración a pasarela tercera"], cronograma: "Si aplica" },
        { actor: "Auditores de Seguridad", tipo: "externo", nivelImpacto: "medio", descripcionImpacto: "Realizan auditorías trimestrales obligatorias", accionesRequeridas: ["Contratar auditoría de seguridad"], cronograma: "Trimestral" },
        { actor: "Departamento de TI/Finanzas", tipo: "interno", nivelImpacto: "alto", descripcionImpacto: "Debe evaluar modelo de procesamiento de pagos actual", accionesRequeridas: ["Determinar si empresa procesa pagos directamente", "Evaluar opciones de cumplimiento"], cronograma: "Inmediato" }
      ],
      
      requisitosCumplimiento: [
        { requisito: "Certificación PCI-DSS si procesa pagos directamente", prioridad: "critica", fechaLimite: "Vigente ahora (si aplica)", esfuerzoEstimado: "16-24 semanas", areaResponsable: "TI + Finanzas" },
        { requisito: "Sistema de notificación de brechas en 48 horas", prioridad: "alta", fechaLimite: "Vigente ahora (si aplica)", esfuerzoEstimado: "4-6 semanas", areaResponsable: "TI + Legal" },
        { requisito: "Auditorías de seguridad trimestrales", prioridad: "alta", fechaLimite: "Cada 3 meses (si aplica)", esfuerzoEstimado: "2-3 semanas por auditoría", areaResponsable: "TI + Cumplimiento" },
        { requisito: "Políticas de retención de datos de transacciones", prioridad: "media", fechaLimite: "Vigente ahora (si aplica)", esfuerzoEstimado: "2-3 semanas", areaResponsable: "Legal + TI" }
      ],
      
      recomendacionesEstrategicas: [
        { titulo: "Evaluación de Modelo de Pagos", descripcion: "Determinar si la empresa procesa pagos con tarjeta directamente o utiliza pasarelas de pago terceras (BAC, PayPal, Stripe, SINPE)", prioridad: "inmediata", recursosNecesarios: "Finanzas + TI (1 semana de análisis)" },
        { titulo: "Migración a Pasarela Certificada", descripcion: "Si procesa pagos directamente, evaluar migración a proveedor de pagos certificado PCI-DSS para eliminar carga de cumplimiento", prioridad: "corto-plazo", recursosNecesarios: "TI + Finanzas + evaluación de proveedores (4-8 semanas)" },
        { titulo: "Revisión de Contratos con Proveedores de Pago", descripcion: "Verificar que contratos con proveedores de pago incluyan cláusulas de cumplimiento PCI-DSS y responsabilidad por brechas", prioridad: "corto-plazo", recursosNecesarios: "Legal + Finanzas (2 semanas)" }
      ],
      
      legislacionRelacionada: [
        { identificador: "Ley N.º 8968", titulo: "Ley de Protección de la Persona frente al Tratamiento de sus Datos Personales", relacion: "complementa", relevancia: "Marco de protección de datos personales aplicable a datos de pago." },
        { identificador: "Ley N.º 9416", titulo: "Ley contra la Delincuencia Organizada", relacion: "relacionada", relevancia: "Marco legal de responsabilidad por fraudes financieros." }
      ],
      
      benchmarksIndustria: {
        tiempoPromedioCumplimiento: "No aplica si usa pasarela tercera. 6+ meses si procesa directamente.",
        nivelPreparacionIndustria: "Alto para empresas que usan pasarelas terceras (85%). Bajo para procesadores directos (15%).",
        tasaAdopcionCompetidores: "Mayoría de comercios electrónicos de electrodomésticos ya usan pasarelas certificadas (BAC, PayPal, Stripe)",
        mejoresPracticas: [
          "Usar pasarelas de pago certificadas PCI-DSS en lugar de procesar directamente",
          "Nunca almacenar datos de tarjeta completos - usar tokenización",
          "Revisar contratos de proveedores de pago para verificar transferencia de riesgo"
        ]
      }
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
  },

  // ========== ADDITIONAL ENRICHED DATA FOR ANALYTICS (15 MORE ITEMS) ==========
  // Recent items (1-7 days ago)
  {
    id: "cr-proy-015",
    identificador: "Expediente N.º 24.567",
    titulo: "Proyecto de Ley de Etiquetado Energético de Electrodomésticos",
    resumen: "Establece requisitos de etiquetado de eficiencia energética para todos los electrodomésticos comercializados en Costa Rica.",
    puntosImportantes: [
      "Escala de eficiencia energética A-G obligatoria",
      "Información de consumo anual en kWh",
      "Sanciones por etiquetado incorrecto"
    ],
    tipoNorma: "proyecto_ley",
    tipoEmisor: "legislativo",
    nivel: "nacional",
    organoEmisor: "Asamblea Legislativa",
    organoCompetente: "MINAE / ARESEP",
    comisionLegislativa: "Comisión de Ambiente",
    estado: "dictamen_comision",
    estadoGenerico: "en_tramite",
    indiceEtapaActual: 2,
    fechaPresentacion: "2024-11-01",
    fechaDictamenComision: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    categoria: "Product Safety",
    sector: "Energía",
    obligacionesAfectadas: ["Etiquetado energético", "Certificación", "Registro de productos"],
    nivelRiesgo: "alto",
    puntajeRiesgo: 82,
    resumenIA: {
      cambiosPropuestos: "Etiquetado energético obligatorio A-G para hervidores y cafeteras. Información de consumo anual.",
      impactosPotenciales: "Fabricantes deberán certificar eficiencia energética y actualizar empaques.",
      fechaClave: `Dictamen de comisión emitido hace 3 días. Pendiente de Primer Debate.`,
      calificadorEstado: "Instrumento en trámite; no aplicable hasta eventual aprobación, sanción y publicación en La Gaceta."
    },
    acciones: [
      { fecha: "2024-11-01", descripcion: "Proyecto presentado a la Asamblea Legislativa", actor: "Diputados proponentes" },
      { fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), descripcion: "Dictamen afirmativo de comisión emitido", actor: "Comisión de Ambiente" }
    ],
    fuenteUrl: "https://www.asamblea.go.cr/expediente/24567"
  },
  {
    id: "cr-exec-015",
    identificador: "Decreto Ejecutivo N.º 44892-MEIC",
    titulo: "Reglamento de Seguridad de Electrodomésticos de Cocina",
    resumen: "Establece requisitos técnicos de seguridad para hervidores eléctricos, cafeteras y otros electrodomésticos de cocina.",
    puntosImportantes: [
      "Certificación UL/IEC obligatoria",
      "Sistemas de apagado automático requeridos",
      "Etiquetado de seguridad en español"
    ],
    tipoNorma: "decreto_ejecutivo",
    tipoEmisor: "ejecutivo",
    nivel: "nacional",
    organoEmisor: "Poder Ejecutivo (MEIC)",
    organoCompetente: "MEIC - Dirección de Apoyo al Consumidor",
    estado: "vigente",
    estadoGenerico: "vigente",
    indiceEtapaActual: 5,
    fechaPublicacionGaceta: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    fechaEntradaVigencia: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    categoria: "Product Safety",
    sector: "Electrodomésticos",
    obligacionesAfectadas: ["Certificación de seguridad", "Etiquetado", "Documentación técnica"],
    nivelRiesgo: "alto",
    puntajeRiesgo: 85,
    resumenIA: {
      cambiosPropuestos: "Certificación UL/IEC obligatoria para hervidores y cafeteras. Sistemas de apagado automático.",
      impactosPotenciales: "Productos sin certificación no podrán comercializarse. Requiere documentación técnica en español.",
      fechaClave: `Vigente desde hace 5 días. Cumplimiento inmediato requerido.`,
      calificadorEstado: "Norma vigente. Cumplimiento obligatorio para todas las importaciones."
    },
    numeroGaceta: "N.º 245",
    acciones: [
      { fecha: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), descripcion: "Firma del Presidente", actor: "Presidencia" },
      { fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), descripcion: "Publicación en La Gaceta", actor: "Imprenta Nacional" }
    ],
    fuenteUrl: "https://www.pgrweb.go.cr/SCIJ/placeholder-44892-meic"
  },
  // Items 8-14 days ago
  {
    id: "cr-proy-016",
    identificador: "Expediente N.º 24.234",
    titulo: "Proyecto de Ley de Economía Circular para Electrodomésticos",
    resumen: "Establece obligaciones de responsabilidad extendida del productor para electrodomésticos.",
    puntosImportantes: [
      "Sistema de recolección de RAEE obligatorio",
      "Metas de reciclaje: 25% (2026), 40% (2028)",
      "Fondo ambiental financiado por productores"
    ],
    tipoNorma: "proyecto_ley",
    tipoEmisor: "legislativo",
    nivel: "nacional",
    organoEmisor: "Asamblea Legislativa",
    organoCompetente: "MINAE / SINAC",
    comisionLegislativa: "Comisión de Ambiente",
    estado: "primer_debate",
    estadoGenerico: "en_tramite",
    indiceEtapaActual: 3,
    fechaPresentacion: "2024-08-15",
    fechaDictamenComision: "2024-11-01",
    fechaPrimerDebate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    categoria: "Product Safety",
    sector: "Medio Ambiente",
    obligacionesAfectadas: ["Sistema REP", "Recolección RAEE", "Contribución a fondo"],
    nivelRiesgo: "alto",
    puntajeRiesgo: 88,
    resumenIA: {
      cambiosPropuestos: "REP obligatorio para electrodomésticos. Sistema de recolección y metas de reciclaje progresivas.",
      impactosPotenciales: "Fabricantes e importadores deberán financiar sistema de gestión de residuos.",
      fechaClave: `Primer Debate realizado hace 10 días. Pendiente de Segundo Debate.`,
      calificadorEstado: "Proyecto avanzado con alto consenso. Alta probabilidad de aprobación en 2025."
    },
    acciones: [
      { fecha: "2024-08-15", descripcion: "Proyecto presentado", actor: "Diputados proponentes" },
      { fecha: "2024-11-01", descripcion: "Dictamen de comisión", actor: "Comisión de Ambiente" },
      { fecha: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), descripcion: "Aprobación en Primer Debate", actor: "Plenario" }
    ],
    fuenteUrl: "https://www.asamblea.go.cr/expediente/24234"
  },
  {
    id: "cr-reg-005",
    identificador: "Resolución N.º SUTEL-001-2024",
    titulo: "Actualización de Requisitos de Homologación RF para Dispositivos IoT",
    resumen: "Actualiza requisitos de homologación de radiofrecuencia para dispositivos conectados del consumidor.",
    puntosImportantes: [
      "Nuevos límites para banda 6 GHz (WiFi 6E)",
      "Certificación SUTEL obligatoria",
      "Período de transición de 180 días"
    ],
    tipoNorma: "normativa_regulatoria",
    tipoEmisor: "regulador",
    nivel: "institucional",
    organoEmisor: "SUTEL - Superintendencia de Telecomunicaciones",
    organoCompetente: "SUTEL",
    estado: "vigente",
    estadoGenerico: "vigente",
    indiceEtapaActual: 5,
    fechaPublicacionGaceta: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    fechaEntradaVigencia: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    categoria: "Radio",
    sector: "Telecomunicaciones",
    obligacionesAfectadas: ["Homologación RF", "Certificación SUTEL", "Documentación técnica"],
    nivelRiesgo: "alto",
    puntajeRiesgo: 78,
    resumenIA: {
      cambiosPropuestos: "Nuevos requisitos RF para WiFi 6E. Homologación SUTEL obligatoria para electrodomésticos conectados.",
      impactosPotenciales: "Hervidores y cafeteras con WiFi deben obtener nueva certificación.",
      fechaClave: `Vigente desde hace 12 días. Cumplimiento en 180 días.`,
      calificadorEstado: "Norma vigente con período de transición de 180 días para productos existentes."
    },
    numeroGaceta: "N.º 238",
    acciones: [
      { fecha: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), descripcion: "Consulta pública", actor: "SUTEL" },
      { fecha: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), descripcion: "Publicación en La Gaceta", actor: "Imprenta Nacional" }
    ],
    fuenteUrl: "https://www.sutel.go.cr/normativa/resolucion-001-2024"
  },
  // Items 15-30 days ago
  {
    id: "cr-exec-016",
    identificador: "Decreto Ejecutivo N.º 44756-MINAE",
    titulo: "Reglamento de Gestión de Baterías y Acumuladores",
    resumen: "Establece el régimen de responsabilidad extendida del productor para baterías.",
    puntosImportantes: [
      "Sistema de recolección obligatorio",
      "Metas de recuperación: 20% (2025), 35% (2027)",
      "Etiquetado con instrucciones de disposición"
    ],
    tipoNorma: "decreto_ejecutivo",
    tipoEmisor: "ejecutivo",
    nivel: "nacional",
    organoEmisor: "Poder Ejecutivo (MINAE)",
    organoCompetente: "MINAE / SETENA",
    estado: "vigente",
    estadoGenerico: "vigente",
    indiceEtapaActual: 5,
    fechaPublicacionGaceta: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    fechaEntradaVigencia: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    categoria: "Battery",
    sector: "Medio Ambiente",
    obligacionesAfectadas: ["Sistema de recolección", "Metas de recuperación", "Etiquetado"],
    nivelRiesgo: "alto",
    puntajeRiesgo: 80,
    resumenIA: {
      cambiosPropuestos: "REP obligatorio para baterías. Sistema de recolección y metas de recuperación progresivas.",
      impactosPotenciales: "Importadores de electrodomésticos con baterías deben implementar logística inversa.",
      fechaClave: `Vigente desde hace 18 días. Meta 20% para 2025.`,
      calificadorEstado: "Norma vigente. Cumplimiento progresivo según metas establecidas."
    },
    numeroGaceta: "N.º 230",
    acciones: [
      { fecha: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), descripcion: "Firma del Presidente", actor: "Presidencia" },
      { fecha: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), descripcion: "Publicación en La Gaceta", actor: "Imprenta Nacional" }
    ],
    fuenteUrl: "https://www.pgrweb.go.cr/SCIJ/placeholder-44756-minae"
  },
  {
    id: "cr-proy-017",
    identificador: "Expediente N.º 24.089",
    titulo: "Proyecto de Ley de Protección de Datos Personales en Dispositivos IoT",
    resumen: "Establece requisitos de protección de datos para dispositivos conectados del consumidor.",
    puntosImportantes: [
      "Consentimiento explícito para recolección de datos",
      "Derecho de eliminación de datos",
      "Notificación de brechas de seguridad"
    ],
    tipoNorma: "proyecto_ley",
    tipoEmisor: "legislativo",
    nivel: "nacional",
    organoEmisor: "Asamblea Legislativa",
    organoCompetente: "PRODHAB",
    comisionLegislativa: "Comisión de Ciencia y Tecnología",
    estado: "presentado",
    estadoGenerico: "en_tramite",
    indiceEtapaActual: 1,
    fechaPresentacion: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    categoria: "Cybersecurity",
    sector: "Tecnología",
    obligacionesAfectadas: ["Políticas de privacidad", "Consentimiento", "Seguridad de datos"],
    nivelRiesgo: "medio",
    puntajeRiesgo: 68,
    resumenIA: {
      cambiosPropuestos: "Requisitos de privacidad para dispositivos IoT. Consentimiento y derecho de eliminación.",
      impactosPotenciales: "Electrodomésticos conectados deberán cumplir políticas de privacidad específicas.",
      fechaClave: `Presentado hace 22 días. En fase de estudio en comisión.`,
      calificadorEstado: "Proyecto en fase temprana. Bajo seguimiento."
    },
    acciones: [
      { fecha: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), descripcion: "Proyecto presentado", actor: "Diputados proponentes" },
      { fecha: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), descripcion: "Asignado a Comisión", actor: "Directorio Legislativo" }
    ],
    fuenteUrl: "https://www.asamblea.go.cr/expediente/24089"
  },
  {
    id: "cr-mun-005",
    identificador: "Ordenanza Municipal N.º 89-2024",
    titulo: "Ordenanza de Eficiencia Hídrica para Comercios de San José",
    resumen: "Regula el uso eficiente del agua en establecimientos comerciales del cantón central de San José.",
    puntosImportantes: [
      "Dispositivos ahorradores de agua obligatorios",
      "Reportes de consumo trimestrales",
      "Incentivos por reducción de consumo"
    ],
    tipoNorma: "ordenanza_municipal",
    tipoEmisor: "municipal",
    nivel: "municipal",
    provincia: "San José",
    canton: "San José (Central)",
    organoEmisor: "Municipalidad de San José",
    organoCompetente: "Municipalidad de San José - Gestión Ambiental",
    estado: "vigente",
    estadoGenerico: "vigente",
    indiceEtapaActual: 5,
    fechaPublicacionGaceta: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    fechaEntradaVigencia: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    categoria: "Product Safety",
    sector: "Medio Ambiente",
    obligacionesAfectadas: ["Dispositivos ahorradores", "Reportes de consumo"],
    nivelRiesgo: "bajo",
    puntajeRiesgo: 42,
    resumenIA: {
      cambiosPropuestos: "Eficiencia hídrica para comercios en San José central. Dispositivos ahorradores obligatorios.",
      impactosPotenciales: "Bajo impacto directo para fabricantes. Aplica a comercios minoristas.",
      fechaClave: `Vigente desde hace 25 días. Cumplimiento inmediato.`,
      calificadorEstado: "Ordenanza municipal vigente en cantón central de San José."
    },
    acciones: [
      { fecha: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), descripcion: "Aprobación por Concejo Municipal", actor: "Concejo Municipal" },
      { fecha: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), descripcion: "Publicación en La Gaceta", actor: "Imprenta Nacional" }
    ],
    fuenteUrl: "https://www.msj.go.cr/ordenanzas/89-2024"
  },
  // Items 31-60 days ago
  {
    id: "cr-exec-017",
    identificador: "Decreto Ejecutivo N.º 44678-S",
    titulo: "Actualización del Reglamento Sanitario de Materiales en Contacto con Alimentos",
    resumen: "Actualiza requisitos sanitarios para materiales que entran en contacto con alimentos y bebidas.",
    puntosImportantes: [
      "Nuevos límites de migración para plásticos",
      "Prohibición de BPA en superficies de contacto",
      "Certificación del Ministerio de Salud"
    ],
    tipoNorma: "decreto_ejecutivo",
    tipoEmisor: "ejecutivo",
    nivel: "nacional",
    organoEmisor: "Poder Ejecutivo (Ministerio de Salud)",
    organoCompetente: "Ministerio de Salud",
    estado: "vigente",
    estadoGenerico: "vigente",
    indiceEtapaActual: 5,
    fechaPublicacionGaceta: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    fechaEntradaVigencia: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    categoria: "Food Contact Material",
    sector: "Salud",
    obligacionesAfectadas: ["Certificación sanitaria", "Pruebas de migración", "Documentación técnica"],
    nivelRiesgo: "alto",
    puntajeRiesgo: 85,
    resumenIA: {
      cambiosPropuestos: "Nuevos límites de migración para hervidores y cafeteras. Prohibición de BPA.",
      impactosPotenciales: "Productos con BPA no podrán comercializarse. Certificación MS obligatoria.",
      fechaClave: `Vigente desde hace 35 días. Cumplimiento inmediato para nuevas importaciones.`,
      calificadorEstado: "Norma vigente. Fiscalización activa del Ministerio de Salud."
    },
    numeroGaceta: "N.º 215",
    acciones: [
      { fecha: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), descripcion: "Firma del Presidente", actor: "Presidencia" },
      { fecha: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), descripcion: "Publicación en La Gaceta", actor: "Imprenta Nacional" }
    ],
    fuenteUrl: "https://www.pgrweb.go.cr/SCIJ/placeholder-44678-s"
  },
  {
    id: "cr-proy-018",
    identificador: "Expediente N.º 23.987",
    titulo: "Proyecto de Ley de Comercio Electrónico y Protección al Consumidor Digital",
    resumen: "Fortalece la protección al consumidor en compras electrónicas de electrodomésticos.",
    puntosImportantes: [
      "Derecho de retracto de 14 días",
      "Información de garantía visible",
      "Sanciones por publicidad engañosa"
    ],
    tipoNorma: "proyecto_ley",
    tipoEmisor: "legislativo",
    nivel: "nacional",
    organoEmisor: "Asamblea Legislativa",
    organoCompetente: "MEIC",
    comisionLegislativa: "Comisión de Asuntos Económicos",
    estado: "segundo_debate",
    estadoGenerico: "en_tramite",
    indiceEtapaActual: 4,
    fechaPresentacion: "2024-05-01",
    fechaDictamenComision: "2024-08-15",
    fechaPrimerDebate: "2024-09-20",
    fechaSegundoDebate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    categoria: "Cybersecurity",
    sector: "Comercio",
    obligacionesAfectadas: ["Políticas de devolución", "Información de garantía", "Publicidad"],
    nivelRiesgo: "medio",
    puntajeRiesgo: 72,
    resumenIA: {
      cambiosPropuestos: "Derecho de retracto 14 días para compras online. Información de garantía obligatoria.",
      impactosPotenciales: "Comercializadores online deberán ajustar políticas de devolución.",
      fechaClave: `Segundo Debate hace 40 días. Pendiente de envío al Ejecutivo.`,
      calificadorEstado: "Proyecto muy avanzado. Alta probabilidad de promulgación próximamente."
    },
    acciones: [
      { fecha: "2024-05-01", descripcion: "Proyecto presentado", actor: "Diputados" },
      { fecha: "2024-08-15", descripcion: "Dictamen de comisión", actor: "Comisión Económica" },
      { fecha: "2024-09-20", descripcion: "Primer Debate", actor: "Plenario" },
      { fecha: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), descripcion: "Segundo Debate", actor: "Plenario" }
    ],
    fuenteUrl: "https://www.asamblea.go.cr/expediente/23987"
  },
  {
    id: "cr-reg-006",
    identificador: "Resolución N.º ARESEP-045-2024",
    titulo: "Tarifas de Servicios de Certificación de Eficiencia Energética",
    resumen: "Establece las tarifas para servicios de certificación de eficiencia energética de electrodomésticos.",
    puntosImportantes: [
      "Tarifa de certificación por tipo de producto",
      "Vigencia de certificados: 3 años",
      "Proceso de renovación simplificado"
    ],
    tipoNorma: "normativa_regulatoria",
    tipoEmisor: "regulador",
    nivel: "institucional",
    organoEmisor: "ARESEP",
    organoCompetente: "ARESEP",
    estado: "vigente",
    estadoGenerico: "vigente",
    indiceEtapaActual: 5,
    fechaPublicacionGaceta: new Date(Date.now() - 48 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    fechaEntradaVigencia: new Date(Date.now() - 48 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    categoria: "Product Safety",
    sector: "Energía",
    obligacionesAfectadas: ["Pago de tarifas de certificación"],
    nivelRiesgo: "bajo",
    puntajeRiesgo: 38,
    resumenIA: {
      cambiosPropuestos: "Tarifas definidas para certificación energética. Vigencia de certificados 3 años.",
      impactosPotenciales: "Costos de certificación conocidos. Planificación presupuestaria facilitada.",
      fechaClave: `Vigente desde hace 48 días. Tarifas aplicables inmediatamente.`,
      calificadorEstado: "Resolución administrativa vigente. Informativa para planificación."
    },
    numeroGaceta: "N.º 205",
    acciones: [
      { fecha: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), descripcion: "Aprobación por Junta Directiva", actor: "ARESEP" },
      { fecha: new Date(Date.now() - 48 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), descripcion: "Publicación en La Gaceta", actor: "Imprenta Nacional" }
    ],
    fuenteUrl: "https://www.aresep.go.cr/normativa/resolucion-045-2024"
  },
  // Items 61-90 days ago
  {
    id: "cr-exec-018",
    identificador: "Decreto Ejecutivo N.º 44589-MINAE-S",
    titulo: "Reglamento de Sustancias Químicas Peligrosas en Productos de Consumo",
    resumen: "Regula el uso de sustancias químicas peligrosas en productos de consumo incluyendo electrodomésticos.",
    puntosImportantes: [
      "Lista de sustancias restringidas (PFAS, ftalatos)",
      "Límites de concentración máxima",
      "Certificación de cumplimiento"
    ],
    tipoNorma: "decreto_ejecutivo",
    tipoEmisor: "ejecutivo",
    nivel: "nacional",
    organoEmisor: "Poder Ejecutivo (MINAE/Salud)",
    organoCompetente: "MINAE / Ministerio de Salud",
    estado: "vigente",
    estadoGenerico: "vigente",
    indiceEtapaActual: 5,
    fechaPublicacionGaceta: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    fechaEntradaVigencia: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    categoria: "Product Safety",
    sector: "Químicos",
    obligacionesAfectadas: ["Análisis de sustancias", "Certificación de cumplimiento", "Documentación"],
    nivelRiesgo: "alto",
    puntajeRiesgo: 78,
    resumenIA: {
      cambiosPropuestos: "Restricciones de PFAS y ftalatos en electrodomésticos. Límites de concentración.",
      impactosPotenciales: "Productos con sustancias restringidas no podrán comercializarse.",
      fechaClave: `Vigente desde hace 65 días. Cumplimiento obligatorio.`,
      calificadorEstado: "Norma vigente. Fiscalización conjunta MINAE/Salud."
    },
    numeroGaceta: "N.º 195",
    acciones: [
      { fecha: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), descripcion: "Firma del Presidente", actor: "Presidencia" },
      { fecha: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), descripcion: "Publicación en La Gaceta", actor: "Imprenta Nacional" }
    ],
    fuenteUrl: "https://www.pgrweb.go.cr/SCIJ/placeholder-44589-minae-s"
  },
  {
    id: "cr-proy-019",
    identificador: "Expediente N.º 23.876",
    titulo: "Proyecto de Ley de Garantías Extendidas para Productos Electrónicos",
    resumen: "Establece garantías mínimas extendidas para productos electrónicos y electrodomésticos.",
    puntosImportantes: [
      "Garantía mínima de 2 años para electrodomésticos",
      "Repuestos disponibles por 7 años",
      "Derecho a reparación"
    ],
    tipoNorma: "proyecto_ley",
    tipoEmisor: "legislativo",
    nivel: "nacional",
    organoEmisor: "Asamblea Legislativa",
    organoCompetente: "MEIC",
    comisionLegislativa: "Comisión de Asuntos Económicos",
    estado: "presentado",
    estadoGenerico: "en_tramite",
    indiceEtapaActual: 1,
    fechaPresentacion: new Date(Date.now() - 72 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    categoria: "Product Safety",
    sector: "Comercio",
    obligacionesAfectadas: ["Garantías extendidas", "Disponibilidad de repuestos", "Servicio técnico"],
    nivelRiesgo: "medio",
    puntajeRiesgo: 65,
    resumenIA: {
      cambiosPropuestos: "Garantía mínima 2 años. Repuestos disponibles 7 años. Derecho a reparación.",
      impactosPotenciales: "Fabricantes deberán mantener repuestos y servicio técnico extendido.",
      fechaClave: `Presentado hace 72 días. En estudio en comisión.`,
      calificadorEstado: "Proyecto en fase temprana. Seguimiento de mediano plazo."
    },
    acciones: [
      { fecha: new Date(Date.now() - 72 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), descripcion: "Proyecto presentado", actor: "Diputados" },
      { fecha: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), descripcion: "Asignado a Comisión", actor: "Directorio" }
    ],
    fuenteUrl: "https://www.asamblea.go.cr/expediente/23876"
  },
  {
    id: "cr-mun-006",
    identificador: "Ordenanza Municipal N.º 45-2024",
    titulo: "Ordenanza de Comercio de Electrodomésticos en Liberia",
    resumen: "Regula la venta de electrodomésticos en el cantón de Liberia, Guanacaste.",
    puntosImportantes: [
      "Registro municipal de comercios",
      "Información de eficiencia energética visible",
      "Garantía mínima de 1 año"
    ],
    tipoNorma: "ordenanza_municipal",
    tipoEmisor: "municipal",
    nivel: "municipal",
    provincia: "Guanacaste",
    canton: "Liberia",
    organoEmisor: "Municipalidad de Liberia",
    organoCompetente: "Municipalidad de Liberia",
    estado: "vigente",
    estadoGenerico: "vigente",
    indiceEtapaActual: 5,
    fechaPublicacionGaceta: new Date(Date.now() - 78 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    fechaEntradaVigencia: new Date(Date.now() - 78 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    categoria: "Product Safety",
    sector: "Comercio",
    obligacionesAfectadas: ["Registro municipal", "Información de eficiencia"],
    nivelRiesgo: "bajo",
    puntajeRiesgo: 35,
    resumenIA: {
      cambiosPropuestos: "Requisitos locales para comercios de electrodomésticos en Liberia.",
      impactosPotenciales: "Bajo impacto directo para fabricantes. Aplica a comercios minoristas.",
      fechaClave: `Vigente desde hace 78 días.`,
      calificadorEstado: "Ordenanza municipal vigente en Liberia, Guanacaste."
    },
    acciones: [
      { fecha: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), descripcion: "Aprobación por Concejo", actor: "Concejo Municipal" },
      { fecha: new Date(Date.now() - 78 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), descripcion: "Publicación", actor: "Imprenta Nacional" }
    ],
    fuenteUrl: "https://www.muniliberia.go.cr/ordenanzas/45-2024"
  },
  {
    id: "cr-reg-007",
    identificador: "Directriz N.º INTECO-12-2024",
    titulo: "Directriz sobre Aplicación de Normas INTE para Electrodomésticos",
    resumen: "Orienta sobre la aplicación de normas técnicas INTE para electrodomésticos importados.",
    puntosImportantes: [
      "Reconocimiento de normas internacionales equivalentes",
      "Proceso de certificación simplificado",
      "Equivalencias con UL, IEC, CE"
    ],
    tipoNorma: "normativa_regulatoria",
    tipoEmisor: "regulador",
    nivel: "institucional",
    organoEmisor: "INTECO",
    organoCompetente: "INTECO",
    estado: "vigente",
    estadoGenerico: "vigente",
    indiceEtapaActual: 5,
    fechaPublicacionGaceta: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    fechaEntradaVigencia: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    categoria: "Product Safety",
    sector: "Normalización",
    obligacionesAfectadas: ["Certificación INTE", "Equivalencias de normas"],
    nivelRiesgo: "bajo",
    puntajeRiesgo: 32,
    resumenIA: {
      cambiosPropuestos: "Simplificación de certificación con reconocimiento de normas internacionales.",
      impactosPotenciales: "Positivo - reduce barreras para productos con certificaciones UL/IEC/CE.",
      fechaClave: `Vigente desde hace 85 días. Aplicable inmediatamente.`,
      calificadorEstado: "Directriz técnica favorable que facilita importaciones."
    },
    acciones: [
      { fecha: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), descripcion: "Publicación de directriz", actor: "INTECO" }
    ],
    fuenteUrl: "https://www.inteco.org/directriz-12-2024"
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
    aiSummary: item.resumenIA ? {
      whatChanges: item.resumenIA.cambiosPropuestos,
      whoImpacted: item.resumenIA.impactosPotenciales,
      keyDeadline: item.resumenIA.fechaClave,
      riskExplanation: item.resumenIA.calificadorEstado,
      executiveSummary: item.resumenIA.resumenEjecutivo,
      statistics: item.resumenIA.estadisticas ? {
        estimatedAffectedCompanies: item.resumenIA.estadisticas.empresasAfectadasEstimadas,
        estimatedComplianceCost: item.resumenIA.estadisticas.costoEstimadoCumplimiento ? {
          min: item.resumenIA.estadisticas.costoEstimadoCumplimiento.min,
          max: item.resumenIA.estadisticas.costoEstimadoCumplimiento.max,
          currency: item.resumenIA.estadisticas.costoEstimadoCumplimiento.moneda
        } : undefined,
        marketSizeImpact: item.resumenIA.estadisticas.impactoMercado,
        implementationTimeMonths: item.resumenIA.estadisticas.tiempoImplementacionMeses,
        penaltyRange: item.resumenIA.estadisticas.rangoSanciones ? {
          min: item.resumenIA.estadisticas.rangoSanciones.min,
          max: item.resumenIA.estadisticas.rangoSanciones.max,
          currency: item.resumenIA.estadisticas.rangoSanciones.moneda
        } : undefined,
        complianceComplexityScore: item.resumenIA.estadisticas.puntajeComplejidad
      } : undefined,
      riskAnalysis: item.resumenIA.analisisRiesgo ? {
        overallRiskScore: item.resumenIA.analisisRiesgo.puntajeRiesgoGeneral,
        riskBreakdown: item.resumenIA.analisisRiesgo.desglosePorCategoria?.map(r => ({
          category: r.categoria,
          score: r.puntaje,
          description: r.descripcion,
          mitigationStrategy: r.estrategiaMitigacion
        })),
        probabilityOfEnforcement: item.resumenIA.analisisRiesgo.probabilidadFiscalizacion === "alta" ? "high" : item.resumenIA.analisisRiesgo.probabilidadFiscalizacion === "media" ? "medium" : "low",
        potentialLiabilities: item.resumenIA.analisisRiesgo.responsabilidadesPotenciales,
        competitiveRiskAssessment: item.resumenIA.analisisRiesgo.evaluacionRiesgoCompetitivo
      } : undefined,
      stakeholderAnalysis: item.resumenIA.analisisActores?.map(a => ({
        stakeholder: a.actor,
        type: (a.tipo === "regulador" ? "regulatory" : a.tipo === "gremio" ? "industry" : a.tipo === "certificador" ? "external" : a.tipo === "interno" ? "internal" : "external") as "regulatory" | "industry" | "internal" | "external",
        impactLevel: a.nivelImpacto === "alto" ? "high" : a.nivelImpacto === "medio" ? "medium" : "low",
        impactDescription: a.descripcionImpacto,
        requiredActions: a.accionesRequeridas,
        timeline: a.cronograma
      })),
      complianceRequirements: item.resumenIA.requisitosCumplimiento?.map(r => ({
        requirement: r.requisito,
        priority: (r.prioridad === "critica" ? "critical" : r.prioridad === "alta" ? "high" : r.prioridad === "media" ? "medium" : "low") as "critical" | "high" | "medium" | "low",
        deadline: r.fechaLimite,
        estimatedEffort: r.esfuerzoEstimado,
        responsibleDepartment: r.areaResponsable
      })),
      strategicRecommendations: item.resumenIA.recomendacionesEstrategicas?.map(r => ({
        title: r.titulo,
        description: r.descripcion,
        priority: r.prioridad === "inmediata" ? "immediate" : r.prioridad === "corto-plazo" ? "short-term" : r.prioridad === "mediano-plazo" ? "medium-term" : "long-term",
        resourcesRequired: r.recursosNecesarios
      })),
      relatedLegislation: item.resumenIA.legislacionRelacionada?.map(l => ({
        identifier: l.identificador,
        title: l.titulo,
        relationship: l.relacion === "modifica" ? "amends" : l.relacion === "deroga" ? "repeals" : l.relacion === "implementa" ? "implements" : l.relacion === "conflicto" ? "conflicts" : "related",
        relevance: l.relevancia
      })),
      industryBenchmarks: item.resumenIA.benchmarksIndustria ? {
        averageComplianceTime: item.resumenIA.benchmarksIndustria.tiempoPromedioCumplimiento,
        industryReadinessLevel: item.resumenIA.benchmarksIndustria.nivelPreparacionIndustria,
        competitorAdoptionRate: item.resumenIA.benchmarksIndustria.tasaAdopcionCompetidores,
        bestPractices: item.resumenIA.benchmarksIndustria.mejoresPracticas
      } : undefined
    } : undefined,
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
NIVEL: ${item.nivel === "nacional" ? "Nacional" : item.nivel === "municipal" ? "Municipal" : "Institucional/Regulatorio"}
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
