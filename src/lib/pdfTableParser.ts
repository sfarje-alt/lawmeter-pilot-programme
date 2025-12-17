import * as pdfjsLib from 'pdfjs-dist';

// Configure worker for v3
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

// Dictionary of complete commission names (truncated -> complete)
const COMISIONES_COMPLETAS: Record<string, string> = {
  // === COMISIONES ORDINARIAS ===
  // Descentralización
  "DESCENTRALIZACIÓN, REGIONALIZACIÓN, GOBIERNOS LOCALES Y MODERNIZACIÓN DE LA GESTIÓN": 
    "DESCENTRALIZACIÓN, REGIONALIZACIÓN, GOBIERNOS LOCALES Y MODERNIZACIÓN DE LA GESTIÓN DEL ESTADO",
  "DESCENTRALIZACIÓN, REGIONALIZACIÓN, GOBIERNOS LOCALES Y MODERNIZACIÓN DE LA": 
    "DESCENTRALIZACIÓN, REGIONALIZACIÓN, GOBIERNOS LOCALES Y MODERNIZACIÓN DE LA GESTIÓN DEL ESTADO",
  "DESCENTRALIZACIÓN, REGIONALIZACIÓN, GOBIERNOS LOCALES Y MODERNIZACIÓN": 
    "DESCENTRALIZACIÓN, REGIONALIZACIÓN, GOBIERNOS LOCALES Y MODERNIZACIÓN DE LA GESTIÓN DEL ESTADO",
  "DESCENTRALIZACIÓN, REGIONALIZACIÓN, GOBIERNOS LOCALES Y": 
    "DESCENTRALIZACIÓN, REGIONALIZACIÓN, GOBIERNOS LOCALES Y MODERNIZACIÓN DE LA GESTIÓN DEL ESTADO",
  "DESCENTRALIZACIÓN, REGIONALIZACIÓN, GOBIERNOS LOCALES": 
    "DESCENTRALIZACIÓN, REGIONALIZACIÓN, GOBIERNOS LOCALES Y MODERNIZACIÓN DE LA GESTIÓN DEL ESTADO",
  "DESCENTRALIZACIÓN, REGIONALIZACIÓN, GOBIERNOS": 
    "DESCENTRALIZACIÓN, REGIONALIZACIÓN, GOBIERNOS LOCALES Y MODERNIZACIÓN DE LA GESTIÓN DEL ESTADO",
  "DESCENTRALIZACIÓN, REGIONALIZACIÓN,": 
    "DESCENTRALIZACIÓN, REGIONALIZACIÓN, GOBIERNOS LOCALES Y MODERNIZACIÓN DE LA GESTIÓN DEL ESTADO",
  
  // Defensa Nacional
  "DEFENSA NACIONAL, ORDEN INTERNO, DESARROLLO ALTERNATIVO Y LUCHA CONTRA LAS": 
    "DEFENSA NACIONAL, ORDEN INTERNO, DESARROLLO ALTERNATIVO Y LUCHA CONTRA LAS DROGAS",
  "DEFENSA NACIONAL, ORDEN INTERNO, DESARROLLO ALTERNATIVO Y LUCHA CONTRA": 
    "DEFENSA NACIONAL, ORDEN INTERNO, DESARROLLO ALTERNATIVO Y LUCHA CONTRA LAS DROGAS",
  "DEFENSA NACIONAL, ORDEN INTERNO, DESARROLLO ALTERNATIVO Y LUCHA": 
    "DEFENSA NACIONAL, ORDEN INTERNO, DESARROLLO ALTERNATIVO Y LUCHA CONTRA LAS DROGAS",
  "DEFENSA NACIONAL, ORDEN INTERNO, DESARROLLO ALTERNATIVO Y": 
    "DEFENSA NACIONAL, ORDEN INTERNO, DESARROLLO ALTERNATIVO Y LUCHA CONTRA LAS DROGAS",
  "DEFENSA NACIONAL, ORDEN INTERNO, DESARROLLO ALTERNATIVO": 
    "DEFENSA NACIONAL, ORDEN INTERNO, DESARROLLO ALTERNATIVO Y LUCHA CONTRA LAS DROGAS",
  "DEFENSA NACIONAL, ORDEN INTERNO, DESARROLLO": 
    "DEFENSA NACIONAL, ORDEN INTERNO, DESARROLLO ALTERNATIVO Y LUCHA CONTRA LAS DROGAS",
  "DEFENSA NACIONAL, ORDEN INTERNO,": 
    "DEFENSA NACIONAL, ORDEN INTERNO, DESARROLLO ALTERNATIVO Y LUCHA CONTRA LAS DROGAS",
  
  // Defensa del Consumidor
  "DEFENSA DEL CONSUMIDOR Y ORGANISMOS REGULADORES DE LOS SERVICIOS": 
    "DEFENSA DEL CONSUMIDOR Y ORGANISMOS REGULADORES DE LOS SERVICIOS PÚBLICOS",
  "DEFENSA DEL CONSUMIDOR Y ORGANISMOS REGULADORES DE LOS": 
    "DEFENSA DEL CONSUMIDOR Y ORGANISMOS REGULADORES DE LOS SERVICIOS PÚBLICOS",
  "DEFENSA DEL CONSUMIDOR Y ORGANISMOS REGULADORES DE": 
    "DEFENSA DEL CONSUMIDOR Y ORGANISMOS REGULADORES DE LOS SERVICIOS PÚBLICOS",
  "DEFENSA DEL CONSUMIDOR Y ORGANISMOS REGULADORES": 
    "DEFENSA DEL CONSUMIDOR Y ORGANISMOS REGULADORES DE LOS SERVICIOS PÚBLICOS",
  "DEFENSA DEL CONSUMIDOR Y ORGANISMOS": 
    "DEFENSA DEL CONSUMIDOR Y ORGANISMOS REGULADORES DE LOS SERVICIOS PÚBLICOS",
  
  // Pueblos Andinos
  "PUEBLOS ANDINOS, AMAZÓNICOS Y AFROPERUANOS, AMBIENTE Y": 
    "PUEBLOS ANDINOS, AMAZÓNICOS Y AFROPERUANOS, AMBIENTE Y ECOLOGÍA",
  "PUEBLOS ANDINOS, AMAZÓNICOS Y AFROPERUANOS, AMBIENTE": 
    "PUEBLOS ANDINOS, AMAZÓNICOS Y AFROPERUANOS, AMBIENTE Y ECOLOGÍA",
  "PUEBLOS ANDINOS, AMAZÓNICOS Y AFROPERUANOS,": 
    "PUEBLOS ANDINOS, AMAZÓNICOS Y AFROPERUANOS, AMBIENTE Y ECOLOGÍA",
  "PUEBLOS ANDINOS, AMAZÓNICOS Y AFROPERUANOS": 
    "PUEBLOS ANDINOS, AMAZÓNICOS Y AFROPERUANOS, AMBIENTE Y ECOLOGÍA",
  "PUEBLOS ANDINOS, AMAZÓNICOS Y": 
    "PUEBLOS ANDINOS, AMAZÓNICOS Y AFROPERUANOS, AMBIENTE Y ECOLOGÍA",
  
  // Producción
  "PRODUCCIÓN, MICRO Y PEQUEÑA EMPRESA Y": 
    "PRODUCCIÓN, MICRO Y PEQUEÑA EMPRESA Y COOPERATIVAS",
  "PRODUCCIÓN, MICRO Y PEQUEÑA EMPRESA": 
    "PRODUCCIÓN, MICRO Y PEQUEÑA EMPRESA Y COOPERATIVAS",
  
  // Presupuesto
  "PRESUPUESTO Y CUENTA GENERAL DE LA": 
    "PRESUPUESTO Y CUENTA GENERAL DE LA REPÚBLICA",
  "PRESUPUESTO Y CUENTA GENERAL DE": 
    "PRESUPUESTO Y CUENTA GENERAL DE LA REPÚBLICA",
  
  // Economía
  "ECONOMÍA, BANCA, FINANZAS E INTELIGENCIA": 
    "ECONOMÍA, BANCA, FINANZAS E INTELIGENCIA FINANCIERA",
  "ECONOMÍA, BANCA, FINANZAS E": 
    "ECONOMÍA, BANCA, FINANZAS E INTELIGENCIA FINANCIERA",
  
  // Inclusión Social
  "INCLUSIÓN SOCIAL Y PERSONAS CON": 
    "INCLUSIÓN SOCIAL Y PERSONAS CON DISCAPACIDAD",
  "INCLUSIÓN SOCIAL Y PERSONAS": 
    "INCLUSIÓN SOCIAL Y PERSONAS CON DISCAPACIDAD",
  
  // Otras comisiones (variantes cortas)
  "CULTURA Y PATRIMONIO": "CULTURA Y PATRIMONIO CULTURAL",
  "COMERCIO EXTERIOR Y": "COMERCIO EXTERIOR Y TURISMO",
  "EDUCACIÓN, JUVENTUD Y": "EDUCACIÓN, JUVENTUD Y DEPORTE",
  "CIENCIA, INNOVACIÓN Y": "CIENCIA, INNOVACIÓN Y TECNOLOGÍA",
  "JUSTICIA Y DERECHOS": "JUSTICIA Y DERECHOS HUMANOS",
  "CONSTITUCIÓN Y": "CONSTITUCIÓN Y REGLAMENTO",
  "VIVIENDA Y": "VIVIENDA Y CONSTRUCCIÓN",
  "TRANSPORTES Y": "TRANSPORTES Y COMUNICACIONES",
  "FISCALIZACIÓN Y": "FISCALIZACIÓN Y CONTRALORÍA",
  "TRABAJO Y SEGURIDAD": "TRABAJO Y SEGURIDAD SOCIAL",
  "SALUD Y": "SALUD Y POBLACIÓN",
  "MUJER Y": "MUJER Y FAMILIA",
  "ENERGÍA Y": "ENERGÍA Y MINAS",
  "RELACIONES": "RELACIONES EXTERIORES",
  
  // === SUBCOMISIONES Y COMISIONES ESPECIALES ===
  "ACUSACIONES": "ACUSACIONES CONSTITUCIONALES",
  "SC ACUSACIONES": "ACUSACIONES CONSTITUCIONALES",
  
  // Comisiones especiales largas
  "SEGUIMIENTO A LA ORGANIZACIÓN DE LOS JUEGOS PANAMERICANOS Y PARAPANAMERICANOS LIMA": 
    "SEGUIMIENTO A LA ORGANIZACIÓN DE LOS JUEGOS PANAMERICANOS Y PARAPANAMERICANOS LIMA 2027",
  "SEGUIMIENTO INCORPORACIÓN DEL PERÚ A ORGANIZACIÓN PARA LA COOPERACIÓN Y EL DESARROLLO ECONÓMICO": 
    "SEGUIMIENTO INCORPORACIÓN DEL PERÚ A ORGANIZACIÓN PARA LA COOPERACIÓN Y EL DESARROLLO ECONÓMICO OCDE",
  "NIÑOS Y FAMILIAS AFECTADAS EXCESO DE PLOMO EN SANGRE Y TÓXICOS EN ZONAS MINERAS DE PASCO Y EL": 
    "NIÑOS Y FAMILIAS AFECTADAS EXCESO DE PLOMO EN SANGRE Y TÓXICOS EN ZONAS MINERAS DE PASCO Y EL PERÚ",
  "IRREGULARIDADES EN MTC, PROVIAS, GOB. REGIONALES Y LOCALES EN OBRAS REALIZADAS POR EMPRESAS": 
    "IRREGULARIDADES EN MTC, PROVIAS, GOB. REGIONALES Y LOCALES EN OBRAS REALIZADAS POR EMPRESAS CHINAS",
  "CONTROL DEL MINISTERIO DE EDUCACIÓN, SUNEDU, SINEACE, CONCYTEC Y Y": 
    "CONTROL DEL MINISTERIO DE EDUCACIÓN, SUNEDU, SINEACE, CONCYTEC Y ADSCRITOS",
  "EVALUAR, PROPONER, FISCALIZAR E IMPULSAR TERCERA ETAPA PROYECTO ESPECIAL": 
    "EVALUAR, PROPONER, FISCALIZAR E IMPULSAR TERCERA ETAPA PROYECTO ESPECIAL CHAVIMOCHIC",
  "A FAVOR DE LOS VALLES DE LOS RÍOS APURIMAC, ENE Y MANTARO": 
    "A FAVOR DE LOS VALLES DE LOS RÍOS APURIMAC, ENE Y MANTARO VRAEM",
  "TRABAJO CONJUNTO CON COM. NAC. DESARROLLO Y VIDA SIN DROGAS -": 
    "TRABAJO CONJUNTO CON COM. NAC. DESARROLLO Y VIDA SIN DROGAS - DEVIDA",
  "SEGUIMIENTO, COORDINACIÓN MONITOREO Y FISCALIZACIÓN SOBRE RESULTADOS EN PREVENCIÓN DEL": 
    "SEGUIMIENTO, COORDINACIÓN MONITOREO Y FISCALIZACIÓN SOBRE RESULTADOS EN PREVENCIÓN DEL CANCER",
  "PROMOVER INVESTIG. PUBLICACIONES Y CONSERVAC. PATRIMONIO CULTURAL JUNÍN Y AYACUCHO POR": 
    "PROMOVER INVESTIG. PUBLICACIONES Y CONSERVAC. PATRIMONIO CULTURAL JUNÍN Y AYACUCHO POR BICENTENARIO",
  "ANÁLISIS SEGUIMIENTO COORDINACIÓN Y FORMULACIÓN PROPUESTAS PARA PROYECTO BINACIONAL PUYANGO": 
    "ANÁLISIS SEGUIMIENTO COORDINACIÓN Y FORMULACIÓN PROPUESTAS PARA PROYECTO BINACIONAL PUYANGO TUMBES",
  "IMPULSO Y SEGUIMIENTO DEL PROYECTO TERMINAL MULTIPROPOSITO DE": 
    "IMPULSO Y SEGUIMIENTO DEL PROYECTO TERMINAL MULTIPROPOSITO DE CHANCAY",
  "PROYECTO ESPECIAL CHINECAS, PARA QUE CONJUNTAMENTE CON EL": 
    "PROYECTO ESPECIAL CHINECAS, PARA QUE CONJUNTAMENTE CON EL EJECUTIVO",
  "REVISORA DEL CÓDIGO DE EJECUCIÓN PENAL LEY": 
    "REVISORA DEL CÓDIGO DE EJECUCIÓN PENAL LEY 31588",
};

// Complete truncated commission name
function completarComision(comision: string): string {
  let cleaned = comision.trim();
  
  // Clean trailing junk
  cleaned = cleaned.replace(/\s+DE FECHA.*$/i, '');
  cleaned = cleaned.replace(/\s+Conjunta.*$/i, '');
  cleaned = cleaned.replace(/\s+\d{1,2}\/\d{1,2}\/\d{4}.*$/, '');
  cleaned = cleaned.replace(/\s+\d{1,2}:\d{2}\s*[AP]M.*$/i, '');
  cleaned = cleaned.trim();
  
  const comisionUpper = cleaned.toUpperCase();
  
  // Exact match
  for (const [parcial, completo] of Object.entries(COMISIONES_COMPLETAS)) {
    if (comisionUpper === parcial.toUpperCase()) {
      return completo;
    }
  }
  
  // Starts with match (sorted by length descending)
  const sortedEntries = Object.entries(COMISIONES_COMPLETAS)
    .sort((a, b) => b[0].length - a[0].length);
  
  for (const [parcial, completo] of sortedEntries) {
    const parcialUpper = parcial.toUpperCase();
    if (comisionUpper.startsWith(parcialUpper)) {
      if (!comisionUpper.includes(completo.toUpperCase())) {
        return completo;
      }
    }
  }
  
  // Check if ends with incomplete preposition/conjunction
  if (/[,]$| Y$| DE$| E$| LA$| DEL$| LOS$| CON$/.test(cleaned)) {
    const cleanComision = cleaned.replace(/,$/, '').trim();
    for (const [parcial, completo] of Object.entries(COMISIONES_COMPLETAS)) {
      if (cleanComision.toUpperCase().includes(parcial.toUpperCase()) || 
          parcial.toUpperCase().startsWith(cleanComision.toUpperCase())) {
        return completo;
      }
    }
  }
  
  return cleaned;
}

// Complete commission name within session text
function completarSesion(sesion: string): string {
  let cleaned = sesion.trim();
  
  // Clean trailing junk
  cleaned = cleaned.replace(/\s+DE FECHA.*$/i, '');
  cleaned = cleaned.replace(/\s+Conjunta.*$/i, '');
  cleaned = cleaned.trim();
  
  let sesionUpper = cleaned.toUpperCase();
  
  // Replace truncated versions (sorted by length descending)
  const sortedEntries = Object.entries(COMISIONES_COMPLETAS)
    .sort((a, b) => b[0].length - a[0].length);
  
  for (const [parcial, completo] of sortedEntries) {
    const parcialUpper = parcial.toUpperCase();
    if (sesionUpper.includes(parcialUpper)) {
      // Check not already complete
      if (!sesionUpper.includes(completo.toUpperCase())) {
        // Case-insensitive replace
        const regex = new RegExp(parcial.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        cleaned = cleaned.replace(regex, completo);
        sesionUpper = cleaned.toUpperCase();
      }
    }
  }
  
  return cleaned;
}

export interface ParsedSession {
  tipoSesion: string;
  commissionName: string;
  sessionTitle: string;
  caracteristicas: string | null;
  scheduledDate: string;
  scheduledTime: string;
  agendaUrl: string | null;
}

interface PDFLink {
  url: string;
  y: number;
  page: number;
}

/**
 * Extract all URLs from PDF ordered by page and Y position (like Python script)
 */
async function extractLinksOrdered(pdf: any): Promise<string[]> {
  const allLinks: PDFLink[] = [];
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const annotations = await page.getAnnotations();
    
    for (const annot of annotations) {
      if (annot.subtype === 'Link' && annot.url) {
        const y = annot.rect ? (annot.rect[1] + annot.rect[3]) / 2 : 0;
        allLinks.push({
          url: annot.url,
          y: y,
          page: pageNum
        });
      }
    }
  }
  
  // Sort by page, then by Y descending (higher Y = higher on page in PDF coords)
  allLinks.sort((a, b) => {
    if (a.page !== b.page) return a.page - b.page;
    return b.y - a.y;
  });
  
  console.log(`[PDF Parser] Extracted ${allLinks.length} URLs`);
  return allLinks.map(l => l.url);
}

/**
 * Extract full text from all pages
 */
async function extractFullText(pdf: any): Promise<string> {
  let fullText = '';
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }
  
  return fullText;
}

/**
 * Parse the Peru Congress sessions PDF following the Python script approach:
 * - Split text by "Ver agenda"
 * - Extract hours in order and assign them sequentially
 * - Assign URLs in order
 * - Complete truncated commission names
 */
export async function parsePeruSessionsPdf(file: File): Promise<ParsedSession[]> {
  console.log('[PDF Parser] Starting PDF parsing with Ver agenda split approach...');
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  console.log(`[PDF Parser] PDF loaded: ${pdf.numPages} pages`);
  
  // 1. Extract all URLs in order
  const urls = await extractLinksOrdered(pdf);
  console.log(`[PDF Parser] Found ${urls.length} URLs`);
  
  // 2. Extract full text
  const fullText = await extractFullText(pdf);
  console.log(`[PDF Parser] Full text length: ${fullText.length} characters`);
  
  // 3. Extract ALL hours in order
  const horaPattern = /(\d{1,2}:\d{2}\s*[AP]M)/gi;
  const allHoras = fullText.match(horaPattern) || [];
  console.log(`[PDF Parser] Found ${allHoras.length} hours in text`);
  
  // 4. Split by "Ver agenda"
  const blocks = fullText.split(/Ver\s+agend(?:a)?/i);
  console.log(`[PDF Parser] Split into ${blocks.length} blocks by "Ver agenda"`);
  
  const sessions: ParsedSession[] = [];
  let horaIdx = 0;
  
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    // Normalize whitespace
    const text = block.replace(/\s+/g, ' ').trim();
    
    // Extract FECHA
    const fechaMatch = text.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
    const fecha = fechaMatch ? fechaMatch[1] : '';
    
    // Extract CARACTERÍSTICAS
    const caracteristicas: string[] = [];
    if (/Descentralizada/i.test(text)) caracteristicas.push('Descentralizada');
    if (/Continuada/i.test(text)) caracteristicas.push('Continuada');
    if (/Virtual/i.test(text)) caracteristicas.push('Virtual');
    
    // Extract SESIÓN - complex pattern from Python script
    const sesionPattern = /((?:PRIMERA|SEGUNDA|TERCERA|CUARTA|QUINTA|SEXTA|SÉPTIMA|SEPTIMA|OCTAVA|NOVENA|DÉCIMA|DECIMA|UNDÉCIMA|DUODÉCIMA|DÉCIM[OA]\s*PRIMER[OA]|DÉCIM[OA]\s*SEGUND[OA]|DÉCIM[OA]\s*TERCER[OA]|DÉCIM[OA]\s*CUART[OA]|DÉCIM[OA]\s*QUINT[OA]|DÉCIM[OA]\s*SEXT[OA]|DÉCIM[OA]\s*SÉPTIM[OA]|DÉCIM[OA]\s*OCTAV[OA]|DÉCIM[OA]\s*NOVEN[OA]|VIGÉSIM[OA]|VIGESIM[OA]|ELECCIÓN)\s+(?:SESIÓN\s+)?(?:DE\s+LA\s+MESA\s+DIRECTIVA\s+E\s+INSTALACIÓN\s+DE\s+LA\s+)?(?:ORDINARIA|EXTRAORDINARIA)?\s*DE\s+LA\s+(?:COMISIÓN|SUBCOMISIÓN)(?:\s+DE)?\s+[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ,\s\-]+)/i;
    
    let sesionMatch = text.match(sesionPattern);
    let sesion = '';
    let comision = '';
    
    if (sesionMatch) {
      sesion = sesionMatch[1].trim();
      // Clean up sesion
      sesion = sesion.replace(/\s+/g, ' ');
      sesion = sesion.replace(/\s*\d{1,2}\/\d{1,2}\/\d{4}.*$/, '');
      sesion = sesion.replace(/\s*\d{1,2}:\d{2}\s*[AP]M.*$/i, '');
      sesion = sesion.replace(/\s*(Descentralizada|Continuada|Virtual).*$/i, '');
      
      // Extract comision from sesion
      const comisionMatch = sesion.match(/(?:COMISIÓN|SUBCOMISIÓN)\s+(?:DE\s+)?(.+?)$/i);
      if (comisionMatch) {
        comision = comisionMatch[1].trim();
      }
    } else {
      // Alternative pattern for ELECCIÓN DE MESA DIRECTIVA
      const altPattern = /(ELECCIÓN\s+DE\s+LA\s+MESA\s+DIRECTIVA\s+E\s+INSTALACIÓN\s+DE\s+LA\s+(?:COMISIÓN|SUBCOMISIÓN)\s+(?:DE\s+)?[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ,\s\-]+)/i;
      const altMatch = text.match(altPattern);
      if (altMatch) {
        sesion = altMatch[1].trim();
        const comisionMatch = sesion.match(/(?:COMISIÓN|SUBCOMISIÓN)\s+(?:DE\s+)?(.+?)$/i);
        if (comisionMatch) {
          comision = comisionMatch[1].trim();
        }
      }
    }
    
    // Only add if we found a valid session
    if (sesion) {
      // Assign hora in order
      const hora = horaIdx < allHoras.length ? allHoras[horaIdx].toUpperCase() : '';
      horaIdx++;
      
      // Complete truncated names
      comision = completarComision(comision);
      sesion = completarSesion(sesion);
      
      // Determine tipo (Ordinaria/Extraordinaria)
      let tipo = 'Ordinaria';
      if (/extraordinaria/i.test(sesion)) {
        tipo = 'Extraordinaria';
      }
      
      sessions.push({
        tipoSesion: tipo,
        commissionName: comision || 'Comisión no identificada',
        sessionTitle: sesion,
        caracteristicas: caracteristicas.length > 0 ? caracteristicas.join(', ') : null,
        scheduledDate: fecha,
        scheduledTime: hora,
        agendaUrl: null // Will be assigned below
      });
    }
  }
  
  console.log(`[PDF Parser] Parsed ${sessions.length} sessions`);
  
  // 5. Assign URLs in order
  for (let i = 0; i < sessions.length; i++) {
    if (i < urls.length) {
      sessions[i].agendaUrl = urls[i];
    }
  }
  
  // Verify complete names
  let incomplete = 0;
  for (const session of sessions) {
    if (/[,]$| Y$| DE$| E$| LA$| DEL$| LOS$| CON$/.test(session.commissionName)) {
      incomplete++;
      console.warn(`[PDF Parser] Incomplete commission: ${session.commissionName}`);
    }
  }
  if (incomplete === 0) {
    console.log('[PDF Parser] ✅ All commission names are complete');
  } else {
    console.log(`[PDF Parser] ⚠️ ${incomplete} incomplete commission names`);
  }
  
  // Log sample for debugging
  if (sessions.length > 0) {
    console.log('[PDF Parser] Sample sessions:');
    [0, 1, 2, Math.min(10, sessions.length - 1)].forEach(idx => {
      if (idx < sessions.length) {
        const s = sessions[idx];
        console.log(`[${idx}] Comisión: ${s.commissionName?.substring(0, 60)}`);
        console.log(`     Sesión: ${s.sessionTitle?.substring(0, 80)}`);
        console.log(`     Fecha: ${s.scheduledDate} | Hora: ${s.scheduledTime}`);
        console.log(`     URL: ${s.agendaUrl?.substring(0, 50) || 'none'}`);
      }
    });
  }
  
  return sessions;
}

/**
 * Fallback: Parse from pasted text using same approach
 */
export function parseFromPastedText(text: string): ParsedSession[] {
  console.log('[Text Parser] Parsing pasted text with Ver agenda split...');
  
  // Extract all hours in order
  const horaPattern = /(\d{1,2}:\d{2}\s*[AP]M)/gi;
  const allHoras = text.match(horaPattern) || [];
  
  // Split by "Ver agenda"
  const blocks = text.split(/Ver\s+agend(?:a)?/i);
  
  const sessions: ParsedSession[] = [];
  let horaIdx = 0;
  
  for (const block of blocks) {
    const normalizedText = block.replace(/\s+/g, ' ').trim();
    
    const fechaMatch = normalizedText.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
    const fecha = fechaMatch ? fechaMatch[1] : '';
    
    const caracteristicas: string[] = [];
    if (/Descentralizada/i.test(normalizedText)) caracteristicas.push('Descentralizada');
    if (/Continuada/i.test(normalizedText)) caracteristicas.push('Continuada');
    if (/Virtual/i.test(normalizedText)) caracteristicas.push('Virtual');
    
    const sesionPattern = /((?:PRIMERA|SEGUNDA|TERCERA|CUARTA|QUINTA|SEXTA|SÉPTIMA|SEPTIMA|OCTAVA|NOVENA|DÉCIMA|DECIMA|UNDÉCIMA|DUODÉCIMA|DÉCIM[OA]\s*PRIMER[OA]|DÉCIM[OA]\s*SEGUND[OA]|DÉCIM[OA]\s*TERCER[OA]|DÉCIM[OA]\s*CUART[OA]|DÉCIM[OA]\s*QUINT[OA]|DÉCIM[OA]\s*SEXT[OA]|DÉCIM[OA]\s*SÉPTIM[OA]|DÉCIM[OA]\s*OCTAV[OA]|DÉCIM[OA]\s*NOVEN[OA]|VIGÉSIM[OA]|VIGESIM[OA]|ELECCIÓN)\s+(?:SESIÓN\s+)?(?:DE\s+LA\s+MESA\s+DIRECTIVA\s+E\s+INSTALACIÓN\s+DE\s+LA\s+)?(?:ORDINARIA|EXTRAORDINARIA)?\s*DE\s+LA\s+(?:COMISIÓN|SUBCOMISIÓN)(?:\s+DE)?\s+[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ,\s\-]+)/i;
    
    const sesionMatch = normalizedText.match(sesionPattern);
    let sesion = '';
    let comision = '';
    
    if (sesionMatch) {
      sesion = sesionMatch[1].trim().replace(/\s+/g, ' ');
      sesion = sesion.replace(/\s*\d{1,2}\/\d{1,2}\/\d{4}.*$/, '');
      sesion = sesion.replace(/\s*\d{1,2}:\d{2}\s*[AP]M.*$/i, '');
      sesion = sesion.replace(/\s*(Descentralizada|Continuada|Virtual).*$/i, '');
      
      const comisionMatch = sesion.match(/(?:COMISIÓN|SUBCOMISIÓN)\s+(?:DE\s+)?(.+?)$/i);
      if (comisionMatch) {
        comision = comisionMatch[1].trim();
      }
    }
    
    if (sesion) {
      const hora = horaIdx < allHoras.length ? allHoras[horaIdx].toUpperCase() : '';
      horaIdx++;
      
      // Complete truncated names
      comision = completarComision(comision);
      sesion = completarSesion(sesion);
      
      let tipo = 'Ordinaria';
      if (/extraordinaria/i.test(sesion)) {
        tipo = 'Extraordinaria';
      }
      
      sessions.push({
        tipoSesion: tipo,
        commissionName: comision || 'Comisión no identificada',
        sessionTitle: sesion,
        caracteristicas: caracteristicas.length > 0 ? caracteristicas.join(', ') : null,
        scheduledDate: fecha,
        scheduledTime: hora,
        agendaUrl: null
      });
    }
  }
  
  console.log(`[Text Parser] Parsed ${sessions.length} sessions`);
  return sessions;
}
