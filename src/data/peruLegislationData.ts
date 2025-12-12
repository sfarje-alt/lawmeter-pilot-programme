// ========== PERU LEGISLATION MOCK DATA ==========
// 10 alertas jurídicamente correctas para el sistema legal peruano
// 4 normas vinculantes nacionales, 3 ordenanzas regionales/municipales, 3 NTP

import { 
  PeruLegislationItem, 
  PeruNivelTerritorial,
  PERU_UI_LABELS 
} from "@/types/peruLegislation";

// Helpers de fecha
function diasAtras(dias: number): string {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  return d.toISOString().slice(0, 10);
}

function diasAdelante(dias: number): string {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
}

// ========== 10 ALERTAS MOCK DE PERÚ ==========
export const peruLegislationData: PeruLegislationItem[] = [
  
  // =========================================
  // 1-4: NORMAS VINCULANTES NACIONALES
  // =========================================
  
  // 1. Decreto Supremo - MINAM/OEFA (demuestra separación emisor/fiscalizador)
  {
    id: "pe-ds-012-2024-minam",
    identificador: "Decreto Supremo N° 012-2024-MINAM",
    titulo: "Reglamento de Gestión de Residuos de Aparatos Eléctricos y Electrónicos (RAEE)",
    resumen: "Establece obligaciones de responsabilidad extendida del productor para fabricantes e importadores de aparatos eléctricos y electrónicos, incluyendo electrodomésticos de cocina.",
    puntosClave: [
      "Obligación de sistemas de recolección y tratamiento de RAEE",
      "Metas progresivas de valorización: 20% (2025), 35% (2027), 50% (2030)",
      "Registro obligatorio en el Sistema de Información de RAEE del MINAM"
    ],
    pais: "PE",
    nivel: "nacional",
    tipoNorma: "decreto-supremo",
    esVinculante: true,
    autoridadEmisora: "MINAM - Ministerio del Ambiente",
    autoridadFiscalizadora: "OEFA - Organismo de Evaluación y Fiscalización Ambiental",
    autoridadesCompetentes: ["MINAM", "OEFA", "Municipalidades"],
    estado: "en-tramite",
    estadoGenerico: "pipeline",
    indiceEtapaActual: 3,
    fechaPublicacion: diasAtras(45),
    fuentePublicacion: "El Peruano",
    fechaLimiteCumplimiento: diasAdelante(180),
    regimenTransitorio: "Los obligados tendrán 180 días desde la entrada en vigencia para adecuar sus sistemas de gestión.",
    nivelRiesgo: "alto",
    puntajeRiesgo: 85,
    categoria: "Medio Ambiente",
    sector: "Electrodomésticos",
    obligacionesAfectadas: ["Registro RAEE", "Plan de manejo", "Reporte anual"],
    areasImpacto: ["Producción", "Importación", "Distribución", "Post-venta"],
    resumenIA: {
      queCambia: "Implementa sistema obligatorio de responsabilidad extendida del productor para electrodomésticos. Exige sistemas de recolección, metas de valorización progresivas y registro en plataforma MINAM.",
      afectados: "Fabricantes e importadores de hervidores eléctricos y máquinas de café. OEFA fiscalizará cumplimiento con multas hasta 10,000 UIT.",
      fechaClave: `Proyecto publicado ${diasAtras(45)}. Pendiente de aprobación final.`,
      explicacionRiesgo: "Alto impacto operativo y financiero. Requiere infraestructura de recolección y acuerdos con operadores de RAEE autorizados.",
      actoresClave: ["MINAM", "OEFA", "DIGESA", "Operadores RAEE autorizados"],
      
      resumenEjecutivo: "Este decreto establece un sistema integral de responsabilidad extendida del productor (REP) para aparatos eléctricos y electrónicos, incluyendo electrodomésticos de cocina. Obliga a fabricantes e importadores a implementar sistemas de recolección, establecer metas de valorización progresivas y registrarse en plataformas del MINAM.",
      
      estadisticas: {
        empresasAfectadasEstimadas: 380,
        costoEstimadoCumplimiento: { min: 25000, max: 150000, moneda: "USD" },
        impactoMercado: "Incremento estimado del 12-18% en costos logísticos para el sector de electrodomésticos por implementación de logística inversa",
        tiempoImplementacionMeses: 8,
        rangoSanciones: { min: 1, max: 10000, moneda: "UIT", unidad: "UIT (S/ 5,150 cada UIT)" },
        puntajeComplejidad: 8
      },
      
      analisisRiesgo: {
        puntajeRiesgoGeneral: 85,
        desglosePorCategoria: [
          { categoria: "Riesgo Operativo", puntaje: 90, descripcion: "Necesidad de implementar infraestructura de recolección y convenios con operadores RAEE", estrategiaMitigacion: "Asociarse con operadores RAEE autorizados y establecer puntos de acopio en distribuidores" },
          { categoria: "Riesgo Financiero", puntaje: 82, descripcion: "Inversión significativa en sistemas de gestión y logística inversa", estrategiaMitigacion: "Evaluar modelos de responsabilidad compartida con otros productores del sector" },
          { categoria: "Riesgo de Cumplimiento", puntaje: 88, descripcion: "OEFA realizará fiscalizaciones periódicas con sanciones severas", estrategiaMitigacion: "Implementar sistema de trazabilidad y reportes automatizados al MINAM" },
          { categoria: "Riesgo Reputacional", puntaje: 75, descripcion: "Exposición mediática por incumplimiento ambiental", estrategiaMitigacion: "Desarrollar programa de comunicación de sostenibilidad proactivo" }
        ],
        probabilidadFiscalizacion: "alta",
        responsabilidadesPotenciales: [
          "Multas administrativas hasta 10,000 UIT (aprox. S/ 51,500,000)",
          "Obligación de remediación ambiental",
          "Suspensión de registro de importador",
          "Publicación de sanciones en plataforma MINAM"
        ],
        evaluacionRiesgoCompetitivo: "Empresas con sistemas de logística inversa existentes tendrán ventaja competitiva. Marcas premium pueden diferenciarse con programas de reciclaje."
      },
      
      analisisActores: [
        { actor: "MINAM", tipo: "regulador", nivelImpacto: "alto", descripcionImpacto: "Autoridad normativa que define metas y supervisa registro de productores", accionesRequeridas: ["Registro en Sistema RAEE", "Reportes trimestrales de gestión"], cronograma: "Inmediato post-aprobación" },
        { actor: "OEFA", tipo: "regulador", nivelImpacto: "alto", descripcionImpacto: "Fiscalizador principal que realizará inspecciones y procesará denuncias", accionesRequeridas: ["Mantener documentación de cumplimiento actualizada", "Preparar para auditorías"], cronograma: "Continuo" },
        { actor: "Operadores RAEE", tipo: "externo", nivelImpacto: "alto", descripcionImpacto: "Empresas autorizadas para tratamiento de residuos electrónicos", accionesRequeridas: ["Negociar contratos de servicio", "Establecer flujos de entrega"], cronograma: "90 días pre-vigencia" },
        { actor: "Departamento de Supply Chain", tipo: "interno", nivelImpacto: "alto", descripcionImpacto: "Debe diseñar e implementar logística inversa", accionesRequeridas: ["Diseñar red de puntos de acopio", "Implementar sistema de tracking"], cronograma: "180 días" }
      ],
      
      requisitosCumplimiento: [
        { requisito: "Registro en Sistema Nacional de RAEE del MINAM", prioridad: "critica", fechaLimite: "30 días post-vigencia", esfuerzoEstimado: "2 semanas", areaResponsable: "Legal + Ambiental" },
        { requisito: "Plan de Manejo de RAEE aprobado", prioridad: "critica", fechaLimite: "90 días post-vigencia", esfuerzoEstimado: "6-8 semanas", areaResponsable: "Ambiental + Operaciones" },
        { requisito: "Convenios con operadores RAEE autorizados", prioridad: "alta", fechaLimite: "120 días post-vigencia", esfuerzoEstimado: "4-6 semanas", areaResponsable: "Legal + Compras" },
        { requisito: "Sistema de recolección en puntos de venta", prioridad: "alta", fechaLimite: "180 días post-vigencia", esfuerzoEstimado: "10-12 semanas", areaResponsable: "Comercial + Operaciones" }
      ],
      
      recomendacionesEstrategicas: [
        { titulo: "Evaluación de Infraestructura Actual", descripcion: "Auditar capacidades logísticas existentes para determinar brecha de implementación de logística inversa", prioridad: "inmediata", recursosNecesarios: "Consultor ambiental + equipo operaciones (2-3 semanas)" },
        { titulo: "Alianza Sectorial", descripcion: "Explorar alianza con otros fabricantes de electrodomésticos para compartir costos de infraestructura RAEE", prioridad: "corto-plazo", recursosNecesarios: "Gerencia + Legal (negociación 8 semanas)" },
        { titulo: "Programa de Incentivos", descripcion: "Crear programa de trade-in donde clientes entreguen producto viejo al comprar nuevo, convirtiendo obligación en ventaja comercial", prioridad: "mediano-plazo", recursosNecesarios: "Marketing + Comercial (presupuesto campaña)" }
      ],
      
      legislacionRelacionada: [
        { identificador: "D.S. N° 001-2012-MINAM", titulo: "Reglamento Nacional para la Gestión y Manejo de los RAEE", relacion: "modifica", relevancia: "Norma base que este decreto complementa y actualiza." },
        { identificador: "Ley N° 27314", titulo: "Ley General de Residuos Sólidos", relacion: "relacionada", relevancia: "Marco legal general de gestión de residuos en Perú." }
      ],
      
      benchmarksIndustria: {
        tiempoPromedioCumplimiento: "6-8 meses para empresas con presencia logística nacional",
        nivelPreparacionIndustria: "Bajo - 25% de empresas tienen programas piloto de reciclaje, 75% requieren implementación completa",
        tasaAdopcionCompetidores: "Líderes globales (Samsung, LG) tienen programas REP en otros países adaptables a Perú",
        mejoresPracticas: [
          "Aliarse con retailers para puntos de acopio compartidos",
          "Implementar programa de canje con incentivo al consumidor",
          "Digitalizar trazabilidad con códigos QR en productos"
        ]
      }
    },
    linkFuente: "https://busquedas.elperuano.pe/placeholder-ds-012-2024-minam",
    acciones: [
      { fecha: diasAtras(90), descripcion: "Prepublicación de proyecto para comentarios", organo: "MINAM" },
      { fecha: diasAtras(60), descripcion: "Fin de plazo de comentarios públicos", organo: "MINAM" },
      { fecha: diasAtras(45), descripcion: "Informe técnico de evaluación de comentarios", organo: "MINAM" }
    ]
  },

  // 2. Decreto Legislativo - Ciberseguridad (norma con rango de ley)
  {
    id: "pe-dl-1567-2024",
    identificador: "Decreto Legislativo N° 1567",
    titulo: "Ley de Ciberseguridad para Dispositivos Conectados del Consumidor",
    resumen: "Establece requisitos mínimos de ciberseguridad para dispositivos IoT comercializados en el mercado peruano, incluyendo electrodomésticos inteligentes.",
    puntosClave: [
      "Prohibición de contraseñas por defecto - credenciales únicas obligatorias",
      "Soporte mínimo de actualizaciones de seguridad por 3 años",
      "Política de divulgación de vulnerabilidades obligatoria para fabricantes"
    ],
    pais: "PE",
    nivel: "nacional",
    tipoNorma: "decreto-legislativo",
    esVinculante: true,
    autoridadEmisora: "Poder Ejecutivo (delegación del Congreso)",
    autoridadFiscalizadora: "INDECOPI - Instituto Nacional de Defensa de la Competencia y de la Protección de la Propiedad Intelectual",
    autoridadesCompetentes: ["PCM", "INDECOPI", "MTC"],
    estado: "en-tramite",
    estadoGenerico: "pipeline",
    indiceEtapaActual: 2,
    fechaPublicacion: diasAtras(25),
    fuentePublicacion: "El Peruano (proyecto)",
    fechaLimiteCumplimiento: diasAdelante(365),
    nivelRiesgo: "alto",
    puntajeRiesgo: 82,
    categoria: "Telecomunicaciones",
    sector: "IoT/Electrodomésticos Inteligentes",
    obligacionesAfectadas: ["Seguridad por diseño", "Actualizaciones", "Divulgación"],
    areasImpacto: ["Firmware", "Software", "Documentación técnica"],
    resumenIA: {
      queCambia: "Impone requisitos de ciberseguridad obligatorios para dispositivos IoT. Prohíbe credenciales por defecto y exige soporte de seguridad mínimo de 3 años.",
      afectados: "Fabricantes e importadores de hervidores y cafeteras con conectividad WiFi/Bluetooth. Multas INDECOPI por incumplimiento.",
      fechaClave: `Proyecto publicado ${diasAtras(25)}. Pendiente de promulgación.`,
      explicacionRiesgo: "Impacto significativo en desarrollo de producto y ciclo de vida. Requiere actualización de firmware y procesos de seguridad.",
      actoresClave: ["PCM", "INDECOPI", "Secretaría de Gobierno Digital"],
      
      resumenEjecutivo: "Este decreto legislativo establece el primer marco integral de ciberseguridad para dispositivos IoT en Perú, afectando directamente a electrodomésticos inteligentes conectados. Requiere seguridad por diseño, actualizaciones de seguridad por 3 años mínimo, y política de divulgación de vulnerabilidades.",
      
      estadisticas: {
        empresasAfectadasEstimadas: 220,
        costoEstimadoCumplimiento: { min: 35000, max: 180000, moneda: "USD" },
        impactoMercado: "Incremento del 15-25% en costos de desarrollo para productos IoT por implementación de security by design",
        tiempoImplementacionMeses: 12,
        rangoSanciones: { min: 1, max: 1000, moneda: "UIT", unidad: "UIT (S/ 5,150 cada UIT)" },
        puntajeComplejidad: 9
      },
      
      analisisRiesgo: {
        puntajeRiesgoGeneral: 82,
        desglosePorCategoria: [
          { categoria: "Riesgo Técnico", puntaje: 92, descripcion: "Requiere rediseño de arquitectura de seguridad en productos existentes", estrategiaMitigacion: "Evaluar firmware actual y planificar roadmap de actualización de seguridad" },
          { categoria: "Riesgo Operativo", puntaje: 78, descripcion: "Necesidad de equipo especializado en ciberseguridad IoT", estrategiaMitigacion: "Contratar consultoría de seguridad o capacitar equipo interno" },
          { categoria: "Riesgo de Cumplimiento", puntaje: 85, descripcion: "INDECOPI fiscalizará con apoyo técnico de la Secretaría de Gobierno Digital", estrategiaMitigacion: "Obtener certificaciones de seguridad internacionales como referencia" },
          { categoria: "Riesgo de Producto", puntaje: 80, descripcion: "Productos sin actualizaciones de seguridad no podrán comercializarse", estrategiaMitigacion: "Implementar sistema de actualización OTA (Over-The-Air)" }
        ],
        probabilidadFiscalizacion: "media",
        responsabilidadesPotenciales: [
          "Multas hasta 1,000 UIT (aprox. S/ 5,150,000)",
          "Retiro de productos del mercado",
          "Obligación de recall para productos vulnerables",
          "Daños y perjuicios por brechas de seguridad"
        ],
        evaluacionRiesgoCompetitivo: "Marcas con equipos de desarrollo de firmware propios tendrán ventaja. Productos OEM enfrentarán desafíos para asegurar cumplimiento de proveedores."
      },
      
      analisisActores: [
        { actor: "PCM", tipo: "regulador", nivelImpacto: "alto", descripcionImpacto: "Órgano rector que define estándares técnicos de ciberseguridad", accionesRequeridas: ["Monitorear reglamento técnico", "Participar en consultas públicas"], cronograma: "Continuo" },
        { actor: "INDECOPI", tipo: "regulador", nivelImpacto: "alto", descripcionImpacto: "Fiscalizador que procesará denuncias y realizará inspecciones de mercado", accionesRequeridas: ["Documentar cumplimiento de requisitos técnicos"], cronograma: "Post-vigencia" },
        { actor: "Equipo de Desarrollo", tipo: "interno", nivelImpacto: "alto", descripcionImpacto: "Debe implementar security by design en productos nuevos y actualizar existentes", accionesRequeridas: ["Auditoría de seguridad de firmware", "Implementar OTA updates"], cronograma: "12 meses" },
        { actor: "Proveedores de Componentes", tipo: "externo", nivelImpacto: "medio", descripcionImpacto: "Proveedores de módulos WiFi/Bluetooth deben cumplir requisitos", accionesRequeridas: ["Solicitar certificados de seguridad de componentes"], cronograma: "Inmediato" }
      ],
      
      requisitosCumplimiento: [
        { requisito: "Eliminar contraseñas por defecto - credenciales únicas por dispositivo", prioridad: "critica", fechaLimite: "Vigencia del DL", esfuerzoEstimado: "8-12 semanas", areaResponsable: "Desarrollo + Producción" },
        { requisito: "Sistema de actualizaciones de seguridad por 3 años", prioridad: "critica", fechaLimite: "Vigencia del DL", esfuerzoEstimado: "16-20 semanas", areaResponsable: "Desarrollo + IT" },
        { requisito: "Política pública de divulgación de vulnerabilidades", prioridad: "alta", fechaLimite: "90 días post-vigencia", esfuerzoEstimado: "4 semanas", areaResponsable: "Legal + Seguridad" },
        { requisito: "Documentación técnica de seguridad para fiscalización", prioridad: "alta", fechaLimite: "Vigencia del DL", esfuerzoEstimado: "6 semanas", areaResponsable: "Ingeniería + Legal" }
      ],
      
      recomendacionesEstrategicas: [
        { titulo: "Auditoría de Seguridad Inmediata", descripcion: "Contratar pentesting de todos los productos IoT actuales para identificar vulnerabilidades", prioridad: "inmediata", recursosNecesarios: "Firma de ciberseguridad externa (2-4 semanas por producto)" },
        { titulo: "Roadmap de Firmware Seguro", descripcion: "Desarrollar plan de actualización de firmware con ciclo de vida de 3+ años por producto", prioridad: "corto-plazo", recursosNecesarios: "Equipo de desarrollo (planificación 4 semanas)" },
        { titulo: "Certificación Internacional", descripcion: "Obtener certificación de ciberseguridad IoT internacional (ETSI EN 303 645 o similar) como evidencia de cumplimiento", prioridad: "mediano-plazo", recursosNecesarios: "Laboratorio acreditado + equipo técnico" }
      ],
      
      legislacionRelacionada: [
        { identificador: "D.L. N° 1412", titulo: "Ley de Gobierno Digital", relacion: "relacionada", relevancia: "Marco general de gobierno digital que fundamenta requisitos de ciberseguridad." },
        { identificador: "Ley N° 29733", titulo: "Ley de Protección de Datos Personales", relacion: "relacionada", relevancia: "Dispositivos IoT que capturan datos deben cumplir también con esta ley." }
      ],
      
      benchmarksIndustria: {
        tiempoPromedioCumplimiento: "10-14 meses para empresas con equipos de desarrollo propios",
        nivelPreparacionIndustria: "Muy bajo - menos del 15% de productos IoT en el mercado peruano cumplen estos requisitos actualmente",
        tasaAdopcionCompetidores: "Marcas europeas (Philips, Bosch) ya cumplen por ETSI EN 303 645; marcas asiáticas requieren adaptación significativa",
        mejoresPracticas: [
          "Implementar módulos de seguridad (TEE/Secure Element) en hardware",
          "Establecer programa de bug bounty para detección temprana de vulnerabilidades",
          "Certificar con ETSI EN 303 645 para facilitar cumplimiento en múltiples mercados"
        ]
      }
    },
    linkFuente: "https://busquedas.elperuano.pe/placeholder-dl-1567",
    acciones: [
      { fecha: diasAtras(60), descripcion: "Delegación de facultades al Ejecutivo", organo: "Congreso" },
      { fecha: diasAtras(25), descripcion: "Publicación del proyecto de DL", organo: "PCM" }
    ]
  },

  // 3. Resolución Ministerial - MTC (homologación RF)
  {
    id: "pe-rm-0456-2024-mtc",
    identificador: "Resolución Ministerial N° 0456-2024-MTC/01.03",
    titulo: "Actualización del Reglamento de Homologación de Equipos de Telecomunicaciones",
    resumen: "Actualiza requisitos técnicos para la homologación de equipos con módulos de radiofrecuencia, incluyendo dispositivos WiFi 6E y Bluetooth 5.3.",
    puntosClave: [
      "Nuevas bandas de frecuencia habilitadas: 5925-6425 MHz (WiFi 6E)",
      "Límites de potencia actualizados conforme a UIT-R",
      "Procedimiento simplificado para equipos previamente homologados en la región"
    ],
    pais: "PE",
    nivel: "nacional",
    tipoNorma: "resolucion-ministerial",
    esVinculante: true,
    autoridadEmisora: "MTC - Ministerio de Transportes y Comunicaciones",
    autoridadFiscalizadora: "OSIPTEL - Organismo Supervisor de Inversión Privada en Telecomunicaciones",
    estado: "vigente",
    estadoGenerico: "vigente",
    fechaPublicacion: diasAtras(30),
    fuentePublicacion: "El Peruano",
    fechaEntradaVigencia: diasAtras(15),
    nivelRiesgo: "medio",
    puntajeRiesgo: 68,
    categoria: "Telecomunicaciones",
    sector: "Equipos de Radiofrecuencia",
    obligacionesAfectadas: ["Certificación RF", "Etiquetado", "Documentación técnica"],
    areasImpacto: ["Homologación", "Importación", "Comercialización"],
    resumenIA: {
      queCambia: "Habilita nuevas bandas de frecuencia WiFi 6E para Perú y actualiza límites de potencia. Simplifica homologación para equipos ya certificados regionalmente.",
      afectados: "Importadores de electrodomésticos con conectividad WiFi/Bluetooth. Certificación MTC obligatoria antes de comercialización.",
      fechaClave: `Vigente desde ${diasAtras(15)}. Aplicable inmediatamente a nuevas importaciones.`,
      actoresClave: ["MTC", "OSIPTEL", "Laboratorios acreditados"],
      
      resumenEjecutivo: "Esta resolución ministerial actualiza el marco regulatorio de homologación de equipos de telecomunicaciones en Perú, habilitando nuevas bandas de frecuencia y simplificando procedimientos para equipos previamente certificados en la región.",
      
      estadisticas: {
        empresasAfectadasEstimadas: 180,
        costoEstimadoCumplimiento: { min: 5000, max: 25000, moneda: "USD" },
        impactoMercado: "Reducción del 20-30% en tiempos de homologación para equipos con certificaciones regionales previas",
        tiempoImplementacionMeses: 3,
        rangoSanciones: { min: 1, max: 100, moneda: "UIT", unidad: "UIT (S/ 5,150 cada UIT)" },
        puntajeComplejidad: 5
      },
      
      analisisRiesgo: {
        puntajeRiesgoGeneral: 68,
        desglosePorCategoria: [
          { categoria: "Riesgo Técnico", puntaje: 72, descripcion: "Productos con WiFi 6E requieren actualización de certificación", estrategiaMitigacion: "Verificar compatibilidad de módulos actuales con nuevas bandas de frecuencia" },
          { categoria: "Riesgo Operativo", puntaje: 65, descripcion: "Proceso de homologación puede retrasar importaciones", estrategiaMitigacion: "Iniciar trámites de homologación anticipadamente con laboratorios acreditados" },
          { categoria: "Riesgo de Cumplimiento", puntaje: 70, descripcion: "OSIPTEL fiscaliza equipos no homologados", estrategiaMitigacion: "Mantener registro actualizado de homologaciones vigentes" }
        ],
        probabilidadFiscalizacion: "media",
        responsabilidadesPotenciales: [
          "Multas por comercialización sin homologación",
          "Decomiso de equipos no conformes",
          "Suspensión de importaciones"
        ],
        evaluacionRiesgoCompetitivo: "Empresas con relaciones establecidas con laboratorios acreditados tendrán ventaja en tiempos de homologación."
      },
      
      analisisActores: [
        { actor: "MTC", tipo: "regulador", nivelImpacto: "alto", descripcionImpacto: "Autoridad que otorga homologaciones", accionesRequeridas: ["Presentar solicitud de homologación", "Mantener documentación técnica"], cronograma: "Continuo" },
        { actor: "OSIPTEL", tipo: "regulador", nivelImpacto: "medio", descripcionImpacto: "Fiscaliza cumplimiento en mercado", accionesRequeridas: ["Exhibir certificados de homologación"], cronograma: "Continuo" },
        { actor: "Laboratorios Acreditados", tipo: "externo", nivelImpacto: "alto", descripcionImpacto: "Realizan pruebas de conformidad", accionesRequeridas: ["Contratar servicios de certificación"], cronograma: "Previo a importación" }
      ],
      
      requisitosCumplimiento: [
        { requisito: "Homologación MTC para productos con WiFi/Bluetooth", prioridad: "critica", fechaLimite: "Previo a comercialización", esfuerzoEstimado: "4-6 semanas", areaResponsable: "Regulatorio" },
        { requisito: "Documentación técnica de conformidad RF", prioridad: "alta", fechaLimite: "Con solicitud de homologación", esfuerzoEstimado: "2 semanas", areaResponsable: "Ingeniería" },
        { requisito: "Etiquetado de homologación en productos", prioridad: "alta", fechaLimite: "Antes de venta", esfuerzoEstimado: "1 semana", areaResponsable: "Producción + Regulatorio" }
      ],
      
      recomendacionesEstrategicas: [
        { titulo: "Auditoría de Productos RF", descripcion: "Revisar todos los productos con conectividad WiFi/Bluetooth para verificar estado de homologación", prioridad: "inmediata", recursosNecesarios: "Equipo regulatorio (1 semana)" },
        { titulo: "Relación con Laboratorio Acreditado", descripcion: "Establecer relación comercial preferencial con laboratorio de ensayos para agilizar procesos", prioridad: "corto-plazo", recursosNecesarios: "Gerencia + Regulatorio (negociación)" }
      ],
      
      legislacionRelacionada: [
        { identificador: "D.S. N° 020-2007-MTC", titulo: "Reglamento General de la Ley de Telecomunicaciones", relacion: "relacionada", relevancia: "Marco general de telecomunicaciones que fundamenta requisitos de homologación." }
      ],
      
      benchmarksIndustria: {
        tiempoPromedioCumplimiento: "4-6 semanas para equipos con certificaciones regionales previas",
        nivelPreparacionIndustria: "Alto - mayoría de importadores ya tienen procesos de homologación establecidos",
        tasaAdopcionCompetidores: "Competidores establecidos tienen homologaciones vigentes; nuevos entrantes requieren proceso completo",
        mejoresPracticas: [
          "Mantener relación continua con laboratorio acreditado preferido",
          "Iniciar proceso de homologación 3 meses antes de lanzamiento de producto",
          "Utilizar certificaciones FCC/CE como base para agilizar proceso peruano"
        ]
      }
    },
    linkFuente: "https://busquedas.elperuano.pe/placeholder-rm-0456-2024"
  },

  // 4. Ley - Protección al Consumidor (norma primaria)
  {
    id: "pe-ley-31890-2024",
    identificador: "Ley N° 31890",
    titulo: "Ley que Modifica el Código de Protección y Defensa del Consumidor en Materia de Electrodomésticos",
    resumen: "Modifica la Ley 29571 para incorporar obligaciones específicas de información y garantía para electrodomésticos de cocina.",
    puntosClave: [
      "Garantía mínima legal de 2 años para electrodomésticos sobre los S/ 500",
      "Obligación de disponibilidad de repuestos por 5 años desde última comercialización",
      "Información obligatoria de eficiencia energética y consumo de agua"
    ],
    pais: "PE",
    nivel: "nacional",
    tipoNorma: "ley",
    esVinculante: true,
    autoridadEmisora: "Congreso de la República",
    autoridadFiscalizadora: "INDECOPI",
    estado: "vigente",
    estadoGenerico: "vigente",
    fechaPublicacion: diasAtras(90),
    fuentePublicacion: "El Peruano",
    fechaEntradaVigencia: diasAtras(60),
    nivelRiesgo: "alto",
    puntajeRiesgo: 78,
    categoria: "Protección al Consumidor",
    sector: "Electrodomésticos",
    obligacionesAfectadas: ["Garantía", "Repuestos", "Etiquetado energético"],
    areasImpacto: ["Ventas", "Post-venta", "Servicio técnico", "Etiquetado"],
    resumenIA: {
      queCambia: "Amplía garantía legal mínima a 2 años y obliga disponibilidad de repuestos por 5 años. Refuerza obligaciones de información al consumidor.",
      afectados: "Fabricantes, importadores y comercializadores de hervidores y cafeteras. INDECOPI fiscaliza con multas hasta 450 UIT.",
      fechaClave: `Vigente desde ${diasAtras(60)}. Aplicable a productos comercializados desde esa fecha.`,
      explicacionRiesgo: "Alto impacto en cadena de suministro de repuestos y costos de servicio técnico.",
      actoresClave: ["INDECOPI", "Asociación de Consumidores", "Comercializadores", "ASPEC", "Cámara de Comercio"],
      
      resumenEjecutivo: "Esta ley representa un cambio significativo en el marco regulatorio de protección al consumidor para electrodomésticos en Perú. Extiende la garantía legal mínima de 1 a 2 años y establece obligaciones de disponibilidad de repuestos por 5 años, afectando directamente la cadena de suministro y costos operativos de fabricantes e importadores de hervidores eléctricos y cafeteras.",
      
      estadisticas: {
        empresasAfectadasEstimadas: 450,
        costoEstimadoCumplimiento: { min: 15000, max: 85000, moneda: "USD" },
        impactoMercado: "Incremento estimado del 8-12% en costos de post-venta y servicio técnico para el sector de electrodomésticos de cocina",
        tiempoImplementacionMeses: 6,
        rangoSanciones: { min: 1, max: 450, moneda: "UIT", unidad: "UIT (S/ 5,150 cada UIT)" },
        puntajeComplejidad: 7
      },
      
      analisisRiesgo: {
        puntajeRiesgoGeneral: 78,
        desglosePorCategoria: [
          { categoria: "Riesgo Operativo", puntaje: 82, descripcion: "Necesidad de restructurar cadena de repuestos y servicio técnico", estrategiaMitigacion: "Establecer acuerdos con proveedores locales de repuestos y ampliar red de servicio técnico autorizado" },
          { categoria: "Riesgo Financiero", puntaje: 75, descripcion: "Incremento en costos de garantía y almacenamiento de repuestos", estrategiaMitigacion: "Revisar política de precios y evaluar opciones de seguro de garantía extendida" },
          { categoria: "Riesgo de Cumplimiento", puntaje: 85, descripcion: "Fiscalización activa por INDECOPI con sanciones significativas", estrategiaMitigacion: "Implementar sistema de trazabilidad de productos y protocolo de respuesta a reclamos" },
          { categoria: "Riesgo Reputacional", puntaje: 65, descripcion: "Exposición mediática en caso de incumplimiento", estrategiaMitigacion: "Comunicación proactiva de cumplimiento y programa de satisfacción al cliente" }
        ],
        probabilidadFiscalizacion: "alta",
        responsabilidadesPotenciales: [
          "Multas administrativas hasta 450 UIT (aprox. S/ 2,317,500)",
          "Obligación de reparación o reposición del producto",
          "Indemnización por daños y perjuicios al consumidor",
          "Publicación de sanciones en medios de comunicación",
          "Restricción temporal de importación en casos graves"
        ],
        evaluacionRiesgoCompetitivo: "Competidores con infraestructura de servicio técnico establecida tendrán ventaja. Marcas sin presencia local de repuestos enfrentarán mayores costos de cumplimiento."
      },
      
      analisisActores: [
        { actor: "INDECOPI", tipo: "regulador", nivelImpacto: "alto", descripcionImpacto: "Autoridad fiscalizadora principal. Realizará inspecciones y procesará denuncias de consumidores.", accionesRequeridas: ["Mantener documentación de garantías actualizada", "Registrar sistema de gestión de repuestos"], cronograma: "Fiscalización activa desde entrada en vigencia" },
        { actor: "Departamento Legal Interno", tipo: "interno", nivelImpacto: "alto", descripcionImpacto: "Debe actualizar contratos de garantía y términos de venta", accionesRequeridas: ["Revisar términos de garantía", "Actualizar manuales de producto", "Capacitar a equipo de ventas"], cronograma: "30 días desde entrada en vigencia" },
        { actor: "Cadena de Suministro", tipo: "interno", nivelImpacto: "alto", descripcionImpacto: "Requiere planificación de inventario de repuestos a 5 años", accionesRequeridas: ["Proyectar demanda de repuestos", "Negociar contratos de suministro largo plazo", "Establecer almacén dedicado"], cronograma: "90 días para implementación completa" },
        { actor: "Distribuidores Autorizados", tipo: "externo", nivelImpacto: "medio", descripcionImpacto: "Deben cumplir obligaciones de información y canalizar reclamos", accionesRequeridas: ["Actualizar materiales de punto de venta", "Capacitar personal de atención"], cronograma: "60 días" },
        { actor: "ASPEC", tipo: "externo", nivelImpacto: "medio", descripcionImpacto: "Asociación de consumidores que monitorea cumplimiento y canaliza denuncias", accionesRequeridas: [], cronograma: "Monitoreo continuo" }
      ],
      
      requisitosCumplimiento: [
        { requisito: "Actualizar certificados de garantía para reflejar 2 años mínimo", prioridad: "critica", fechaLimite: "Inmediato", esfuerzoEstimado: "2-4 semanas", areaResponsable: "Legal + Marketing" },
        { requisito: "Implementar sistema de gestión de inventario de repuestos a 5 años", prioridad: "critica", fechaLimite: "90 días", esfuerzoEstimado: "8-12 semanas", areaResponsable: "Supply Chain" },
        { requisito: "Actualizar etiquetado de productos con información de eficiencia energética", prioridad: "alta", fechaLimite: "60 días", esfuerzoEstimado: "4-6 semanas", areaResponsable: "Producto + Regulatorio" },
        { requisito: "Capacitar a red de servicio técnico autorizado", prioridad: "alta", fechaLimite: "45 días", esfuerzoEstimado: "3-4 semanas", areaResponsable: "Servicio Post-Venta" },
        { requisito: "Establecer protocolo de respuesta a reclamos INDECOPI", prioridad: "alta", fechaLimite: "30 días", esfuerzoEstimado: "2 semanas", areaResponsable: "Legal" }
      ],
      
      recomendacionesEstrategicas: [
        { titulo: "Auditoría de Cumplimiento Inmediata", descripcion: "Realizar auditoría interna de toda la documentación de garantía, etiquetado e inventario de repuestos para identificar brechas", prioridad: "inmediata", recursosNecesarios: "Equipo legal + operaciones (2-3 personas, 2 semanas)" },
        { titulo: "Alianza con Proveedores de Repuestos", descripcion: "Negociar contratos de suministro a largo plazo con proveedores de componentes críticos para asegurar disponibilidad de repuestos por 5 años", prioridad: "corto-plazo", recursosNecesarios: "Procurement + Legal (negociación 4-6 semanas)" },
        { titulo: "Programa de Fidelización Post-Venta", descripcion: "Convertir la obligación de garantía extendida en ventaja competitiva mediante programa de servicio premium", prioridad: "mediano-plazo", recursosNecesarios: "Marketing + Servicio (presupuesto campaña)" },
        { titulo: "Digitalización de Trazabilidad", descripcion: "Implementar sistema digital de registro de productos vendidos y solicitudes de garantía para facilitar cumplimiento y fiscalización", prioridad: "mediano-plazo", recursosNecesarios: "IT + Operaciones (inversión en software)" }
      ],
      
      legislacionRelacionada: [
        { identificador: "Ley N° 29571", titulo: "Código de Protección y Defensa del Consumidor", relacion: "modifica", relevancia: "Ley base que esta norma modifica. Establece el marco general de derechos del consumidor." },
        { identificador: "D.S. N° 006-2009-PCM", titulo: "Reglamento del Libro de Reclamaciones", relacion: "relacionada", relevancia: "Mecanismo de reclamo que los consumidores pueden usar para exigir cumplimiento de garantía." },
        { identificador: "NTP 399.482:2024", titulo: "Eficiencia Energética - Electrodomésticos de Cocina", relacion: "relacionada", relevancia: "Norma técnica de referencia para el etiquetado de eficiencia energética exigido por esta ley." }
      ],
      
      benchmarksIndustria: {
        tiempoPromedioCumplimiento: "4-6 meses para empresas con infraestructura local establecida",
        nivelPreparacionIndustria: "Medio - 60% de empresas tienen sistemas de garantía actualizables, 40% requieren reestructuración significativa",
        tasaAdopcionCompetidores: "Principales marcas internacionales (Samsung, LG, Philips) ya cumplen por políticas globales de garantía",
        mejoresPracticas: [
          "Establecer centro de servicio técnico propio o alianza exclusiva con red autorizada",
          "Mantener inventario de repuestos críticos equivalente a 18 meses de demanda proyectada",
          "Implementar sistema CRM para seguimiento de casos de garantía",
          "Ofrecer extensión de garantía como servicio adicional de valor agregado"
        ]
      }
    },
    linkFuente: "https://busquedas.elperuano.pe/placeholder-ley-31890",
    votaciones: [
      { 
        camara: "Pleno del Congreso", 
        fecha: diasAtras(120), 
        aFavor: 95, 
        enContra: 12, 
        abstenciones: 8, 
        aprobado: true 
      }
    ]
  },

  // =========================================
  // 5-7: ORDENANZAS REGIONALES/MUNICIPALES
  // =========================================

  // 5. Ordenanza Regional - Arequipa (con departamento)
  {
    id: "pe-or-435-2024-gra",
    identificador: "Ordenanza Regional N° 435-2024-GRA/CR",
    titulo: "Ordenanza que Regula la Gestión de Residuos de Electrodomésticos en la Región Arequipa",
    resumen: "Establece normas complementarias regionales para la gestión de residuos de aparatos eléctricos en el ámbito de la Región Arequipa.",
    puntosClave: [
      "Puntos de acopio obligatorios en centros comerciales mayores a 5,000 m²",
      "Convenios con municipalidades distritales para recolección",
      "Incentivos tributarios para operadores de reciclaje formalizados"
    ],
    pais: "PE",
    nivel: "regional",
    departamento: "ARE",
    tipoNorma: "ordenanza-regional",
    esVinculante: true,
    autoridadEmisora: "Gobierno Regional de Arequipa",
    autoridadFiscalizadora: "OEFA (en coordinación con Gerencia Regional de Ambiente)",
    autoridadesCompetentes: ["GRA", "OEFA", "Municipalidades distritales"],
    estado: "en-tramite",
    estadoGenerico: "pipeline",
    indiceEtapaActual: 2,
    fechaPublicacion: diasAtras(40),
    fuentePublicacion: "Diario Oficial El Peruano (Normas Regionales)",
    nivelRiesgo: "medio",
    puntajeRiesgo: 55,
    categoria: "Medio Ambiente",
    sector: "Gestión de Residuos",
    obligacionesAfectadas: ["Puntos de acopio", "Convenios municipales"],
    areasImpacto: ["Comercialización regional", "Logística inversa"],
    resumenIA: {
      queCambia: "Complementa normativa nacional RAEE con requisitos específicos para Arequipa. Obliga puntos de acopio en centros comerciales grandes.",
      afectados: "Comercializadores con presencia en Región Arequipa. Centros comerciales deben habilitar puntos de acopio.",
      fechaClave: `Proyecto publicado ${diasAtras(40)}. Pendiente de aprobación por Consejo Regional.`,
      actoresClave: ["GRA", "OEFA", "Municipalidades distritales de Arequipa"],
      
      resumenEjecutivo: "Esta ordenanza regional complementa la normativa nacional de gestión de RAEE con requisitos específicos para la Región Arequipa, estableciendo puntos de acopio obligatorios e incentivos para operadores de reciclaje.",
      
      estadisticas: {
        empresasAfectadasEstimadas: 45,
        costoEstimadoCumplimiento: { min: 3000, max: 15000, moneda: "USD" },
        impactoMercado: "Impacto local en operaciones de comercialización en la Región Arequipa",
        tiempoImplementacionMeses: 4,
        rangoSanciones: { min: 1, max: 50, moneda: "UIT", unidad: "UIT regional" },
        puntajeComplejidad: 4
      },
      
      analisisRiesgo: {
        puntajeRiesgoGeneral: 55,
        desglosePorCategoria: [
          { categoria: "Riesgo Operativo", puntaje: 60, descripcion: "Necesidad de coordinar con centros comerciales para puntos de acopio", estrategiaMitigacion: "Negociar espacios compartidos con otros productores" },
          { categoria: "Riesgo de Cumplimiento", puntaje: 55, descripcion: "Fiscalización coordinada entre OEFA y gobierno regional", estrategiaMitigacion: "Mantener registros de gestión RAEE actualizado" },
          { categoria: "Riesgo Financiero", puntaje: 45, descripcion: "Costos moderados de implementación local", estrategiaMitigacion: "Aprovechar incentivos tributarios disponibles" }
        ],
        probabilidadFiscalizacion: "media",
        responsabilidadesPotenciales: [
          "Multas regionales por incumplimiento",
          "Revocación de licencias de funcionamiento locales"
        ],
        evaluacionRiesgoCompetitivo: "Empresas con presencia nacional pueden aprovechar infraestructura existente; nuevos entrantes a la región enfrentarán costos adicionales."
      },
      
      analisisActores: [
        { actor: "GRA", tipo: "regulador", nivelImpacto: "alto", descripcionImpacto: "Gobierno Regional que emite y fiscaliza la ordenanza", accionesRequeridas: ["Registro en sistema regional", "Reportes periódicos"], cronograma: "Post-aprobación" },
        { actor: "OEFA", tipo: "regulador", nivelImpacto: "medio", descripcionImpacto: "Coordina fiscalización ambiental", accionesRequeridas: ["Mantener conformidad con normativa nacional RAEE"], cronograma: "Continuo" },
        { actor: "Centros Comerciales", tipo: "externo", nivelImpacto: "medio", descripcionImpacto: "Deben habilitar espacios para puntos de acopio", accionesRequeridas: ["Coordinar ubicación de puntos de acopio"], cronograma: "90 días post-vigencia" }
      ],
      
      requisitosCumplimiento: [
        { requisito: "Convenio con centro comercial para punto de acopio", prioridad: "alta", fechaLimite: "90 días post-vigencia", esfuerzoEstimado: "4-6 semanas", areaResponsable: "Comercial + Legal" },
        { requisito: "Registro en sistema regional de gestión RAEE", prioridad: "alta", fechaLimite: "30 días post-vigencia", esfuerzoEstimado: "1 semana", areaResponsable: "Ambiental" }
      ],
      
      recomendacionesEstrategicas: [
        { titulo: "Evaluación de Presencia Regional", descripcion: "Determinar volumen de ventas en Arequipa para evaluar impacto real de la ordenanza", prioridad: "inmediata", recursosNecesarios: "Equipo comercial (1 semana)" },
        { titulo: "Alianza con Competidores", descripcion: "Explorar puntos de acopio compartidos con otros fabricantes para reducir costos", prioridad: "corto-plazo", recursosNecesarios: "Gerencia comercial" }
      ]
    },
    linkFuente: "https://busquedas.elperuano.pe/placeholder-or-435-gra"
  },

  // 6. Ordenanza Municipal - Lima Metropolitana
  {
    id: "pe-om-2567-2024-mml",
    identificador: "Ordenanza N° 2567-MML",
    titulo: "Ordenanza que Regula el Uso de Agua en Establecimientos Comerciales de Lima Metropolitana",
    resumen: "Establece límites de consumo de agua y obligaciones de eficiencia hídrica para establecimientos comerciales, incluyendo fabricantes de alimentos y bebidas.",
    puntosClave: [
      "Límite máximo de consumo de agua por m² de área productiva",
      "Obligación de instalar medidores diferenciados por proceso",
      "Incentivo de reducción de arbitrios para certificación de eficiencia hídrica"
    ],
    pais: "PE",
    nivel: "municipal",
    departamento: "LIM",
    municipio: "Lima Metropolitana",
    tipoNorma: "ordenanza-municipal",
    esVinculante: true,
    autoridadEmisora: "Municipalidad Metropolitana de Lima",
    autoridadFiscalizadora: "Gerencia de Fiscalización y Control - MML",
    estado: "vigente",
    estadoGenerico: "vigente",
    fechaPublicacion: diasAtras(60),
    fuentePublicacion: "El Peruano (Normas Municipales)",
    fechaEntradaVigencia: diasAtras(45),
    fechaLimiteCumplimiento: diasAdelante(120),
    nivelRiesgo: "bajo",
    puntajeRiesgo: 42,
    categoria: "Medio Ambiente",
    sector: "Gestión del Agua",
    obligacionesAfectadas: ["Medidores", "Límites de consumo", "Reportes"],
    areasImpacto: ["Operaciones en Lima", "Costos de servicios"],
    resumenIA: {
      queCambia: "Impone límites de consumo de agua para establecimientos comerciales e industriales en Lima Metropolitana. Incentivos por eficiencia.",
      afectados: "Fabricantes con plantas de producción en Lima Metropolitana. Multas municipales por exceso de consumo.",
      fechaClave: `Vigente desde ${diasAtras(45)}. Plazo de adecuación de medidores: ${diasAdelante(120)}.`,
      actoresClave: ["MML", "SEDAPAL", "Gerencia de Fiscalización"],
      
      resumenEjecutivo: "Esta ordenanza municipal establece regulaciones de eficiencia hídrica para establecimientos comerciales en Lima Metropolitana, con incentivos tributarios para quienes demuestren certificación de eficiencia.",
      
      estadisticas: {
        empresasAfectadasEstimadas: 120,
        costoEstimadoCumplimiento: { min: 2000, max: 8000, moneda: "USD" },
        impactoMercado: "Reducción de costos operativos del 5-15% para empresas que optimicen consumo hídrico",
        tiempoImplementacionMeses: 4,
        rangoSanciones: { min: 1, max: 10, moneda: "UIT", unidad: "UIT municipal" },
        puntajeComplejidad: 3
      },
      
      analisisRiesgo: {
        puntajeRiesgoGeneral: 42,
        desglosePorCategoria: [
          { categoria: "Riesgo Operativo", puntaje: 45, descripcion: "Instalación de medidores diferenciados", estrategiaMitigacion: "Programar instalación en horarios de menor producción" },
          { categoria: "Riesgo Financiero", puntaje: 35, descripcion: "Inversión moderada en infraestructura de medición", estrategiaMitigacion: "Aprovechar incentivos de reducción de arbitrios" },
          { categoria: "Riesgo de Cumplimiento", puntaje: 40, descripcion: "Fiscalización municipal periódica", estrategiaMitigacion: "Mantener reportes de consumo actualizados" }
        ],
        probabilidadFiscalizacion: "baja",
        responsabilidadesPotenciales: [
          "Multas municipales por exceso de consumo",
          "Pérdida de incentivos tributarios"
        ],
        evaluacionRiesgoCompetitivo: "Empresas con procesos eficientes pueden convertir cumplimiento en ventaja de costos."
      },
      
      analisisActores: [
        { actor: "MML", tipo: "regulador", nivelImpacto: "medio", descripcionImpacto: "Municipalidad que fiscaliza cumplimiento", accionesRequeridas: ["Reportar consumo hídrico", "Solicitar certificación de eficiencia"], cronograma: "Trimestral" },
        { actor: "SEDAPAL", tipo: "externo", nivelImpacto: "bajo", descripcionImpacto: "Proveedor de agua que puede proporcionar datos de consumo", accionesRequeridas: ["Coordinar instalación de medidores"], cronograma: "120 días" }
      ],
      
      requisitosCumplimiento: [
        { requisito: "Instalación de medidores diferenciados", prioridad: "alta", fechaLimite: diasAdelante(120), esfuerzoEstimado: "2-3 semanas", areaResponsable: "Operaciones" },
        { requisito: "Reporte mensual de consumo hídrico", prioridad: "media", fechaLimite: "Mensual post-vigencia", esfuerzoEstimado: "1 día/mes", areaResponsable: "Operaciones + Ambiental" }
      ],
      
      recomendacionesEstrategicas: [
        { titulo: "Auditoría de Consumo Hídrico", descripcion: "Evaluar procesos productivos para identificar oportunidades de eficiencia", prioridad: "inmediata", recursosNecesarios: "Consultor ambiental (1 semana)" },
        { titulo: "Certificación de Eficiencia", descripcion: "Obtener certificación para acceder a reducción de arbitrios", prioridad: "corto-plazo", recursosNecesarios: "Operaciones + Ambiental" }
      ]
    },
    linkFuente: "https://busquedas.elperuano.pe/placeholder-om-2567-mml"
  },

  // 7. Ordenanza Regional - Cusco (laboral/salud)
  {
    id: "pe-or-198-2024-grc",
    identificador: "Ordenanza Regional N° 198-2024-CR/GRC.CUSCO",
    titulo: "Ordenanza que Promueve Condiciones de Seguridad y Salud en el Trabajo en Empresas de la Región Cusco",
    resumen: "Establece requisitos adicionales de SST para empresas manufactureras y de servicios en la Región Cusco, complementando la normativa nacional.",
    puntosClave: [
      "Capacitación obligatoria semestral en prevención de riesgos",
      "Comités de SST obligatorios desde 10 trabajadores (nacional: 20)",
      "Registro regional de accidentes e incidentes laborales"
    ],
    pais: "PE",
    nivel: "regional",
    departamento: "CUS",
    tipoNorma: "ordenanza-regional",
    esVinculante: true,
    autoridadEmisora: "Gobierno Regional del Cusco",
    autoridadFiscalizadora: "SUNAFIL (en coordinación con Dirección Regional de Trabajo)",
    autoridadesCompetentes: ["GRC", "SUNAFIL", "DRTPE Cusco"],
    estado: "en-tramite",
    estadoGenerico: "pipeline",
    indiceEtapaActual: 1,
    fechaPublicacion: diasAtras(35),
    fuentePublicacion: "Diario Oficial El Peruano (Normas Regionales)",
    nivelRiesgo: "medio",
    puntajeRiesgo: 58,
    categoria: "Salud y Seguridad Laboral",
    sector: "Manufactura",
    obligacionesAfectadas: ["Capacitación SST", "Comités SST", "Registro de accidentes"],
    areasImpacto: ["Recursos humanos", "Operaciones en Cusco"],
    resumenIA: {
      queCambia: "Refuerza requisitos de SST en Cusco. Reduce umbral para comités de SST de 20 a 10 trabajadores. Capacitación semestral obligatoria.",
      afectados: "Empresas con operaciones en Región Cusco. SUNAFIL fiscaliza en coordinación con gobierno regional.",
      fechaClave: `Proyecto en primera lectura ${diasAtras(35)}. Pendiente de dictamen de comisión.`,
      actoresClave: ["GRC", "SUNAFIL", "DRTPE Cusco"],
      
      resumenEjecutivo: "Esta ordenanza regional refuerza los requisitos de seguridad y salud en el trabajo en la Región Cusco, reduciendo umbrales para comités de SST y estableciendo capacitaciones semestrales obligatorias.",
      
      estadisticas: {
        empresasAfectadasEstimadas: 85,
        costoEstimadoCumplimiento: { min: 1500, max: 6000, moneda: "USD" },
        impactoMercado: "Incremento del 10-15% en costos de capacitación SST para empresas con 10-19 trabajadores",
        tiempoImplementacionMeses: 3,
        rangoSanciones: { min: 1, max: 100, moneda: "UIT", unidad: "UIT (vía SUNAFIL)" },
        puntajeComplejidad: 4
      },
      
      analisisRiesgo: {
        puntajeRiesgoGeneral: 58,
        desglosePorCategoria: [
          { categoria: "Riesgo de Cumplimiento", puntaje: 65, descripcion: "SUNAFIL puede fiscalizar con base en ordenanza regional", estrategiaMitigacion: "Actualizar programa de SST con frecuencia semestral" },
          { categoria: "Riesgo Operativo", puntaje: 55, descripcion: "Creación de comités SST en unidades más pequeñas", estrategiaMitigacion: "Capacitar supervisores como representantes de SST" },
          { categoria: "Riesgo Financiero", puntaje: 50, descripcion: "Costos adicionales de capacitación", estrategiaMitigacion: "Utilizar capacitaciones virtuales para reducir costos" }
        ],
        probabilidadFiscalizacion: "media",
        responsabilidadesPotenciales: [
          "Multas SUNAFIL por incumplimiento de SST",
          "Responsabilidad penal en caso de accidentes graves",
          "Sanciones administrativas regionales"
        ],
        evaluacionRiesgoCompetitivo: "Empresas con programas SST robustos ya cumplen; empresas informales enfrentarán mayores costos de formalización."
      },
      
      analisisActores: [
        { actor: "GRC", tipo: "regulador", nivelImpacto: "medio", descripcionImpacto: "Gobierno Regional que emite ordenanza", accionesRequeridas: ["Registro de comités SST en sistema regional"], cronograma: "Post-aprobación" },
        { actor: "SUNAFIL", tipo: "regulador", nivelImpacto: "alto", descripcionImpacto: "Fiscalizador nacional que puede actuar en coordinación", accionesRequeridas: ["Documentar cumplimiento de capacitaciones", "Mantener actas de comité SST"], cronograma: "Continuo" },
        { actor: "RRHH", tipo: "interno", nivelImpacto: "alto", descripcionImpacto: "Debe implementar programa de capacitación semestral", accionesRequeridas: ["Diseñar calendario de capacitaciones", "Documentar asistencias"], cronograma: "Semestral" }
      ],
      
      requisitosCumplimiento: [
        { requisito: "Establecer comité SST (si aplica umbral de 10 trabajadores)", prioridad: "alta", fechaLimite: "30 días post-vigencia", esfuerzoEstimado: "2 semanas", areaResponsable: "RRHH" },
        { requisito: "Calendario de capacitaciones semestrales", prioridad: "alta", fechaLimite: "60 días post-vigencia", esfuerzoEstimado: "2 semanas", areaResponsable: "RRHH + SST" },
        { requisito: "Registro en sistema regional de accidentes", prioridad: "media", fechaLimite: "Continuo", esfuerzoEstimado: "1 día por evento", areaResponsable: "SST" }
      ],
      
      recomendacionesEstrategicas: [
        { titulo: "Revisión de Dotación en Cusco", descripcion: "Verificar número de trabajadores en operaciones de Cusco para determinar si aplica umbral de comité", prioridad: "inmediata", recursosNecesarios: "RRHH (1 día)" },
        { titulo: "Actualización de Programa SST", descripcion: "Adaptar programa de capacitación a frecuencia semestral", prioridad: "corto-plazo", recursosNecesarios: "SST + proveedor de capacitación" }
      ]
    },
    linkFuente: "https://busquedas.elperuano.pe/placeholder-or-198-grc"
  },

  // =========================================
  // 8-10: NORMAS TÉCNICAS PERUANAS (NTP)
  // =========================================

  // 8. NTP - Hervidores eléctricos (voluntaria, con calificador explícito)
  {
    id: "pe-ntp-iec-60335-2-15-2024",
    identificador: "NTP-IEC 60335-2-15:2024",
    titulo: "Aparatos Electrodomésticos y Análogos. Seguridad. Parte 2-15: Requisitos Particulares para Aparatos de Calentamiento de Líquidos",
    resumen: "Adopción de la norma internacional IEC 60335-2-15 con modificaciones nacionales para hervidores eléctricos, cafeteras y aparatos similares.",
    puntosClave: [
      "Requisitos de protección contra sobrecalentamiento y funcionamiento en seco",
      "Ensayos de estabilidad y protección contra derrames",
      "Marcado y documentación técnica en español"
    ],
    pais: "PE",
    nivel: "nacional",
    tipoNorma: "ntp",
    esVinculante: false, // NTP es voluntaria por defecto
    autoridadEmisora: "INACAL - Instituto Nacional de Calidad",
    // No tiene autoridad fiscalizadora porque es voluntaria
    estado: "vigente",
    estadoGenerico: "vigente",
    fechaPublicacion: diasAtras(50),
    fuentePublicacion: "INACAL - Catálogo de Normas Técnicas",
    fechaEntradaVigencia: diasAtras(50),
    nivelRiesgo: "medio",
    puntajeRiesgo: 65,
    categoria: "Seguridad de Producto",
    sector: "Electrodomésticos de Calentamiento",
    obligacionesAfectadas: ["Evaluación de conformidad", "Ensayos de seguridad"],
    areasImpacto: ["Diseño de producto", "Certificación", "Documentación"],
    resumenIA: {
      queCambia: "Actualiza requisitos técnicos de seguridad para hervidores eléctricos conforme a estándar internacional IEC 60335-2-15 con modificaciones peruanas.",
      afectados: "Fabricantes e importadores de hervidores y cafeteras que busquen certificación voluntaria o requieran cumplimiento por referencia en otro instrumento.",
      fechaClave: `NTP publicada ${diasAtras(50)}. Aplicable desde publicación.`,
      calificadorVoluntariedad: PERU_UI_LABELS.calificadorNTP,
      actoresClave: ["INACAL", "Organismos de certificación acreditados", "Laboratorios de ensayo"],
      
      resumenEjecutivo: "Esta NTP adopta la norma internacional IEC 60335-2-15 para hervidores eléctricos con modificaciones nacionales, estableciendo requisitos de seguridad para protección contra sobrecalentamiento, funcionamiento en seco y estabilidad.",
      
      estadisticas: {
        empresasAfectadasEstimadas: 200,
        costoEstimadoCumplimiento: { min: 8000, max: 35000, moneda: "USD" },
        impactoMercado: "Certificación voluntaria puede generar ventaja competitiva y facilitar exportaciones",
        tiempoImplementacionMeses: 4,
        puntajeComplejidad: 6
      },
      
      analisisRiesgo: {
        puntajeRiesgoGeneral: 65,
        desglosePorCategoria: [
          { categoria: "Riesgo Técnico", puntaje: 70, descripcion: "Productos deben cumplir ensayos específicos de seguridad", estrategiaMitigacion: "Verificar conformidad con IEC 60335-2-15 antes de certificación" },
          { categoria: "Riesgo de Mercado", puntaje: 60, descripcion: "Grandes compradores pueden exigir certificación NTP", estrategiaMitigacion: "Obtener certificación proactivamente para acceder a licitaciones" },
          { categoria: "Riesgo de Cumplimiento", puntaje: 55, descripcion: "Puede volverse obligatoria si se referencia en reglamento técnico", estrategiaMitigacion: "Monitorear propuestas de reglamentos técnicos del INDECOPI" }
        ],
        probabilidadFiscalizacion: "baja",
        responsabilidadesPotenciales: [
          "Pérdida de acceso a grandes clientes que exigen certificación",
          "Posible obligatoriedad futura si se incorpora en reglamento técnico"
        ],
        evaluacionRiesgoCompetitivo: "Marcas certificadas tendrán ventaja en licitaciones públicas y con grandes retailers."
      },
      
      analisisActores: [
        { actor: "INACAL", tipo: "regulador", nivelImpacto: "alto", descripcionImpacto: "Organismo que emite y administra la NTP", accionesRequeridas: ["Adquirir texto oficial de la NTP"], cronograma: "Inmediato" },
        { actor: "Laboratorios Acreditados", tipo: "externo", nivelImpacto: "alto", descripcionImpacto: "Realizan ensayos de conformidad", accionesRequeridas: ["Contratar ensayos de seguridad según NTP"], cronograma: "Previo a certificación" },
        { actor: "Organismos de Certificación", tipo: "externo", nivelImpacto: "medio", descripcionImpacto: "Emiten certificados de conformidad", accionesRequeridas: ["Solicitar certificación de producto"], cronograma: "Post-ensayos" }
      ],
      
      requisitosCumplimiento: [
        { requisito: "Ensayos de seguridad según IEC 60335-2-15", prioridad: "alta", fechaLimite: "Voluntario", esfuerzoEstimado: "4-6 semanas", areaResponsable: "Ingeniería + Calidad" },
        { requisito: "Documentación técnica en español", prioridad: "media", fechaLimite: "Con solicitud de certificación", esfuerzoEstimado: "2 semanas", areaResponsable: "Ingeniería" },
        { requisito: "Marcado conforme a NTP", prioridad: "media", fechaLimite: "Post-certificación", esfuerzoEstimado: "1 semana", areaResponsable: "Producción" }
      ],
      
      recomendacionesEstrategicas: [
        { titulo: "Evaluación de Gap", descripcion: "Comparar productos actuales contra requisitos de la NTP para identificar brechas", prioridad: "inmediata", recursosNecesarios: "Ingeniería de producto (2 semanas)" },
        { titulo: "Certificación Proactiva", descripcion: "Obtener certificación NTP para diferenciación en mercado y preparación para posible obligatoriedad", prioridad: "corto-plazo", recursosNecesarios: "Laboratorio + organismo de certificación" }
      ],
      
      legislacionRelacionada: [
        { identificador: "IEC 60335-2-15", titulo: "Household electrical appliances - Safety - Part 2-15: Particular requirements for appliances for heating liquids", relacion: "implementa", relevancia: "Norma internacional base que la NTP adopta con modificaciones nacionales." }
      ],
      
      benchmarksIndustria: {
        tiempoPromedioCumplimiento: "2-4 meses para productos ya conformes con IEC internacional",
        nivelPreparacionIndustria: "Medio - productos de marcas internacionales generalmente cumplen; productos locales/económicos requieren evaluación",
        tasaAdopcionCompetidores: "Marcas premium ya cuentan con certificaciones IEC; certificación NTP adicional como diferenciador local",
        mejoresPracticas: [
          "Utilizar resultados de ensayos IEC previos como base para certificación NTP",
          "Mantener relación continua con laboratorio acreditado para actualizaciones"
        ]
      }
    },
    linkFuente: "https://catalogo.inacal.gob.pe/placeholder-ntp-60335-2-15"
  },

  // 9. NTP - Eficiencia energética (voluntaria)
  {
    id: "pe-ntp-eficiencia-electro-2024",
    identificador: "NTP 399.482:2024",
    titulo: "Eficiencia Energética. Electrodomésticos de Cocina. Métodos de Ensayo y Etiquetado",
    resumen: "Establece métodos de ensayo para determinar la eficiencia energética de electrodomésticos de cocina y requisitos de etiquetado energético.",
    puntosClave: [
      "Metodología de medición de consumo energético en condiciones estándar",
      "Clasificación de eficiencia energética (A+++ a G)",
      "Diseño de etiqueta energética para el mercado peruano"
    ],
    pais: "PE",
    nivel: "nacional",
    tipoNorma: "ntp",
    esVinculante: false,
    autoridadEmisora: "INACAL - Instituto Nacional de Calidad",
    estado: "en-tramite",
    estadoGenerico: "pipeline",
    indiceEtapaActual: 1,
    fechaPublicacion: diasAtras(30),
    fuentePublicacion: "INACAL - Consulta Pública",
    nivelRiesgo: "bajo",
    puntajeRiesgo: 45,
    categoria: "Energía",
    sector: "Electrodomésticos",
    obligacionesAfectadas: ["Ensayos de eficiencia", "Etiquetado voluntario"],
    areasImpacto: ["Laboratorios", "Marketing", "Etiquetado"],
    resumenIA: {
      queCambia: "Propone metodología de ensayo y etiquetado de eficiencia energética para electrodomésticos de cocina. Adopta clasificación A+++ a G.",
      afectados: "Fabricantes que deseen certificar eficiencia energética voluntariamente o por requerimiento de grandes compradores.",
      fechaClave: `NTP en consulta pública desde ${diasAtras(30)}. Pendiente de aprobación final.`,
      calificadorVoluntariedad: PERU_UI_LABELS.calificadorNTP,
      actoresClave: ["INACAL", "MINEM", "Laboratorios de eficiencia energética"]
    },
    linkFuente: "https://catalogo.inacal.gob.pe/placeholder-ntp-399-482"
  },

  // 10. NTP - Materiales en contacto con alimentos (voluntaria, referenciada en reglamento)
  {
    id: "pe-ntp-fcm-2024",
    identificador: "NTP 399.163-1:2024",
    titulo: "Materiales y Objetos en Contacto con Alimentos. Materiales Plásticos. Parte 1: Requisitos Generales",
    resumen: "Especifica requisitos generales para materiales plásticos destinados a entrar en contacto con alimentos, incluyendo componentes de electrodomésticos de cocina.",
    puntosClave: [
      "Límites de migración global y específica para componentes plásticos",
      "Lista positiva de sustancias autorizadas para contacto alimentario",
      "Condiciones de ensayo para temperaturas elevadas (hasta 175°C)"
    ],
    pais: "PE",
    nivel: "nacional",
    tipoNorma: "ntp",
    esVinculante: false, // Voluntaria, pero referenciada en R.M. MINSA
    autoridadEmisora: "INACAL - Instituto Nacional de Calidad",
    autoridadFiscalizadora: "DIGESA (cuando es referenciada en reglamento sanitario)",
    estado: "revisada",
    estadoGenerico: "vigente",
    fechaPublicacion: diasAtras(20),
    fuentePublicacion: "INACAL - Catálogo de Normas Técnicas",
    fechaEntradaVigencia: diasAtras(20),
    nivelRiesgo: "alto",
    puntajeRiesgo: 75,
    categoria: "Materiales en Contacto con Alimentos",
    sector: "Electrodomésticos de Cocina",
    obligacionesAfectadas: ["Ensayos de migración", "Declaración de conformidad"],
    areasImpacto: ["Materiales", "Diseño", "Proveedores", "Documentación"],
    resumenIA: {
      queCambia: "Actualiza requisitos de migración y lista de sustancias autorizadas para plásticos en contacto con alimentos. Incluye condiciones para temperaturas elevadas típicas de cafeteras.",
      afectados: "Fabricantes de hervidores y cafeteras con componentes plásticos en contacto con agua/café caliente. DIGESA fiscaliza cuando aplica Reglamento Sanitario.",
      fechaClave: `NTP revisada ${diasAtras(20)}. Aplicable voluntariamente salvo referencia en reglamento técnico.`,
      calificadorVoluntariedad: "De aplicación voluntaria. NOTA: Esta NTP es referenciada por la R.M. N° 451-2023/MINSA (Reglamento Sanitario de Alimentos), por lo que su cumplimiento puede ser exigido por DIGESA para productos alimentarios.",
      explicacionRiesgo: "Alto riesgo por referencia en reglamento sanitario. DIGESA puede fiscalizar cumplimiento en productos alimentarios.",
      actoresClave: ["INACAL", "DIGESA", "MINSA", "Laboratorios acreditados"]
    },
    linkFuente: "https://catalogo.inacal.gob.pe/placeholder-ntp-399-163-1"
  }
];

// Exportar función para convertir a formato unificado
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";

export function convertirPeruAUnificado(item: PeruLegislationItem): UnifiedLegislationItem {
  // Mapear nivel peruano a jurisdictionLevel del sistema unificado
  const jurisdictionLevelMap: Record<PeruNivelTerritorial, "federal" | "state" | "local"> = {
    "nacional": "federal",   // Nacional = nivel federal en el sistema unificado
    "regional": "state",     // Regional = nivel state
    "municipal": "local"     // Municipal = nivel local
  };

  return {
    id: item.id,
    identifier: item.identificador,
    title: item.titulo,
    summary: item.resumen,
    bullets: item.puntosClave,
    region: "LATAM" as const,
    jurisdictionCode: "PE",
    jurisdictionLevel: jurisdictionLevelMap[item.nivel],
    subnationalUnit: item.departamento,
    instrumentType: item.tipoNorma,
    hierarchyLevel: item.esVinculante ? "primary" : "soft-law" as any,
    status: item.estado,
    genericStatus: item.estadoGenerico === "vigente" ? "in-force" : item.estadoGenerico === "pipeline" ? "proposal" : "repealed" as any,
    isInForce: item.estadoGenerico === "vigente",
    isPipeline: item.estadoGenerico === "pipeline",
    currentStageIndex: item.indiceEtapaActual,
    authority: item.autoridadEmisora,
    authorityLabel: item.autoridadEmisora,
    publishedDate: item.fechaPublicacion,
    effectiveDate: item.fechaEntradaVigencia,
    complianceDeadline: item.fechaLimiteCumplimiento,
    riskLevel: item.nivelRiesgo === "alto" ? "high" : item.nivelRiesgo === "medio" ? "medium" : "low",
    riskScore: item.puntajeRiesgo,
    policyArea: item.categoria,
    regulatoryCategory: item.categoria,
    impactAreas: item.areasImpacto,
    sourceUrl: item.linkFuente,
    actions: item.acciones?.map(a => ({
      date: a.fecha,
      description: a.descripcion,
      chamber: a.organo
    })),
    votingRecords: item.votaciones?.map(v => ({
      chamber: v.camara,
      date: v.fecha,
      yea: v.aFavor,
      nay: v.enContra,
      abstain: v.abstenciones,
      passed: v.aprobado
    })),
    aiSummary: item.resumenIA ? {
      whatChanges: item.resumenIA.queCambia,
      whoImpacted: item.resumenIA.afectados,
      keyDeadline: item.resumenIA.fechaClave,
      riskExplanation: item.resumenIA.explicacionRiesgo,
      stakeholders: item.resumenIA.actoresClave,
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
        riskBreakdown: item.resumenIA.analisisRiesgo.desglosePorCategoria.map(r => ({
          category: r.categoria, score: r.puntaje, description: r.descripcion, mitigationStrategy: r.estrategiaMitigacion
        })),
        probabilityOfEnforcement: item.resumenIA.analisisRiesgo.probabilidadFiscalizacion === "alta" ? "high" : item.resumenIA.analisisRiesgo.probabilidadFiscalizacion === "media" ? "medium" : "low",
        potentialLiabilities: item.resumenIA.analisisRiesgo.responsabilidadesPotenciales,
        competitiveRiskAssessment: item.resumenIA.analisisRiesgo.evaluacionRiesgoCompetitivo
      } : undefined,
      stakeholderAnalysis: item.resumenIA.analisisActores?.map(a => ({
        stakeholder: a.actor, type: a.tipo === "regulador" ? "regulatory" : a.tipo === "industria" ? "industry" : a.tipo,
        impactLevel: a.nivelImpacto === "alto" ? "high" : a.nivelImpacto === "medio" ? "medium" : "low",
        impactDescription: a.descripcionImpacto, requiredActions: a.accionesRequeridas, timeline: a.cronograma
      })),
      complianceRequirements: item.resumenIA.requisitosCumplimiento?.map(r => ({
        requirement: r.requisito, priority: r.prioridad === "critica" ? "critical" : r.prioridad,
        deadline: r.fechaLimite, estimatedEffort: r.esfuerzoEstimado, responsibleDepartment: r.areaResponsable
      })),
      strategicRecommendations: item.resumenIA.recomendacionesEstrategicas?.map(r => ({
        title: r.titulo, description: r.descripcion,
        priority: r.prioridad === "inmediata" ? "immediate" : r.prioridad === "corto-plazo" ? "short-term" : r.prioridad === "mediano-plazo" ? "medium-term" : "long-term",
        resourcesRequired: r.recursosNecesarios
      })),
      relatedLegislation: item.resumenIA.legislacionRelacionada?.map(l => ({
        identifier: l.identificador, title: l.titulo,
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
    // Campos específicos de Perú para renderizado especial
    peruData: {
      tipoNorma: item.tipoNorma,
      esVinculante: item.esVinculante,
      nivel: item.nivel,
      departamento: item.departamento,
      municipio: item.municipio,
      autoridadFiscalizadora: item.autoridadFiscalizadora,
      autoridadesCompetentes: item.autoridadesCompetentes,
      fuentePublicacion: item.fuentePublicacion,
      regimenTransitorio: item.regimenTransitorio,
      sector: item.sector,
      obligacionesAfectadas: item.obligacionesAfectadas,
      calificadorVoluntariedad: item.resumenIA?.calificadorVoluntariedad
    }
  } as UnifiedLegislationItem;
}

// Función para convertir array de items peruanos a formato unificado
export function convertPeruToUnified(items: PeruLegislationItem[]): UnifiedLegislationItem[] {
  return items.map(convertirPeruAUnificado);
}

// Datos convertidos listos para usar
export const enrichedPeruDataNew = convertPeruToUnified(peruLegislationData);
