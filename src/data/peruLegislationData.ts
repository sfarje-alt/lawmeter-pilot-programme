// ========== PERU LEGISLATION MOCK DATA ==========
// 10 alertas jurídicamente correctas para el sistema legal peruano
// 4 normas vinculantes nacionales, 3 ordenanzas regionales/municipales, 3 NTP

import { 
  PeruLegislationItem, 
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
    estado: "vigente",
    estadoGenerico: "vigente",
    fechaPublicacion: diasAtras(45),
    fuentePublicacion: "El Peruano",
    fechaEntradaVigencia: diasAtras(30),
    fechaLimiteCumplimiento: diasAdelante(180),
    regimenTransitorio: "Los obligados tienen 180 días para adecuar sus sistemas de gestión y registrarse en el SIGERSOL.",
    nivelRiesgo: "alto",
    puntajeRiesgo: 85,
    categoria: "Medio Ambiente",
    sector: "Electrodomésticos",
    obligacionesAfectadas: ["Registro RAEE", "Plan de manejo", "Reporte anual"],
    areasImpacto: ["Producción", "Importación", "Distribución", "Post-venta"],
    resumenIA: {
      queCambia: "Implementa sistema obligatorio de responsabilidad extendida del productor para electrodomésticos. Exige sistemas de recolección, metas de valorización progresivas y registro en plataforma MINAM.",
      afectados: "Fabricantes e importadores de hervidores eléctricos y máquinas de café. OEFA fiscalizará cumplimiento con multas hasta 10,000 UIT.",
      fechaClave: `Vigente desde ${diasAtras(30)}. Plazo de adecuación: ${diasAdelante(180)}.`,
      explicacionRiesgo: "Alto impacto operativo y financiero. Requiere infraestructura de recolección y acuerdos con operadores de RAEE autorizados.",
      actoresClave: ["MINAM", "OEFA", "DIGESA", "Operadores RAEE autorizados"]
    },
    linkFuente: "https://busquedas.elperuano.pe/placeholder-ds-012-2024-minam",
    acciones: [
      { fecha: diasAtras(60), descripcion: "Proyecto de decreto publicado para comentarios", organo: "MINAM" },
      { fecha: diasAtras(45), descripcion: "Publicación en El Peruano", organo: "El Peruano" },
      { fecha: diasAtras(30), descripcion: "Entrada en vigencia", organo: "MINAM" }
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
      actoresClave: ["PCM", "INDECOPI", "Secretaría de Gobierno Digital"]
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
      actoresClave: ["MTC", "OSIPTEL", "Laboratorios acreditados"]
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
      actoresClave: ["INDECOPI", "Asociación de Consumidores", "Comercializadores"]
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
    estado: "vigente",
    estadoGenerico: "vigente",
    fechaPublicacion: diasAtras(40),
    fuentePublicacion: "Diario Oficial El Peruano (Normas Regionales)",
    fechaEntradaVigencia: diasAtras(25),
    nivelRiesgo: "medio",
    puntajeRiesgo: 55,
    categoria: "Medio Ambiente",
    sector: "Gestión de Residuos",
    obligacionesAfectadas: ["Puntos de acopio", "Convenios municipales"],
    areasImpacto: ["Comercialización regional", "Logística inversa"],
    resumenIA: {
      queCambia: "Complementa normativa nacional RAEE con requisitos específicos para Arequipa. Obliga puntos de acopio en centros comerciales grandes.",
      afectados: "Comercializadores con presencia en Región Arequipa. Centros comerciales deben habilitar puntos de acopio.",
      fechaClave: `Vigente desde ${diasAtras(25)}. Aplica solo en Región Arequipa.`,
      actoresClave: ["GRA", "OEFA", "Municipalidades distritales de Arequipa"]
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
      actoresClave: ["MML", "SEDAPAL", "Gerencia de Fiscalización"]
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
    estado: "vigente",
    estadoGenerico: "vigente",
    fechaPublicacion: diasAtras(35),
    fuentePublicacion: "Diario Oficial El Peruano (Normas Regionales)",
    fechaEntradaVigencia: diasAtras(20),
    nivelRiesgo: "medio",
    puntajeRiesgo: 58,
    categoria: "Salud y Seguridad Laboral",
    sector: "Manufactura",
    obligacionesAfectadas: ["Capacitación SST", "Comités SST", "Registro de accidentes"],
    areasImpacto: ["Recursos humanos", "Operaciones en Cusco"],
    resumenIA: {
      queCambia: "Refuerza requisitos de SST en Cusco. Reduce umbral para comités de SST de 20 a 10 trabajadores. Capacitación semestral obligatoria.",
      afectados: "Empresas con operaciones en Región Cusco. SUNAFIL fiscaliza en coordinación con gobierno regional.",
      fechaClave: `Vigente desde ${diasAtras(20)}. Aplica solo en Región Cusco.`,
      actoresClave: ["GRC", "SUNAFIL", "DRTPE Cusco"]
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
      actoresClave: ["INACAL", "Organismos de certificación acreditados", "Laboratorios de ensayo"]
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
    estado: "publicada",
    estadoGenerico: "vigente",
    fechaPublicacion: diasAtras(30),
    fuentePublicacion: "INACAL - Catálogo de Normas Técnicas",
    fechaEntradaVigencia: diasAtras(30),
    nivelRiesgo: "bajo",
    puntajeRiesgo: 45,
    categoria: "Energía",
    sector: "Electrodomésticos",
    obligacionesAfectadas: ["Ensayos de eficiencia", "Etiquetado voluntario"],
    areasImpacto: ["Laboratorios", "Marketing", "Etiquetado"],
    resumenIA: {
      queCambia: "Define metodología de ensayo y etiquetado de eficiencia energética para electrodomésticos de cocina. Adopta clasificación A+++ a G.",
      afectados: "Fabricantes que deseen certificar eficiencia energética voluntariamente o por requerimiento de grandes compradores.",
      fechaClave: `NTP publicada ${diasAtras(30)}. Aplicación voluntaria.`,
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
export function convertirPeruAUnificado(item: PeruLegislationItem) {
  return {
    id: item.id,
    identifier: item.identificador,
    title: item.titulo,
    summary: item.resumen,
    bullets: item.puntosClave,
    region: "LATAM" as const,
    jurisdictionCode: "PE",
    jurisdictionLevel: item.nivel === "nacional" ? "federal" : item.nivel === "regional" ? "state" : "local",
    subnationalUnit: item.departamento,
    instrumentType: item.tipoNorma,
    hierarchyLevel: item.esVinculante ? "primary" : "soft-law",
    status: item.estado,
    genericStatus: item.estadoGenerico === "vigente" ? "in-force" : item.estadoGenerico === "pipeline" ? "proposal" : "repealed",
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
      stakeholders: item.resumenIA.actoresClave
    } : undefined,
    // Campos específicos de Perú para el drawer
    originalData: {
      ...item,
      _peruSpecific: true
    }
  };
}

// Datos convertidos listos para usar
export const enrichedPeruDataNew = peruLegislationData.map(convertirPeruAUnificado);
