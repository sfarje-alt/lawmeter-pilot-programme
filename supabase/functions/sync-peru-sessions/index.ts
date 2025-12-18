import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Dictionary of complete commission names (truncated -> complete)
const COMISIONES_COMPLETAS: Record<string, string> = {
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
  "DEFENSA NACIONAL, ORDEN INTERNO, DESARROLLO ALTERNATIVO Y LUCHA CONTRA LAS": 
    "DEFENSA NACIONAL, ORDEN INTERNO, DESARROLLO ALTERNATIVO Y LUCHA CONTRA LAS DROGAS",
  "DEFENSA NACIONAL, ORDEN INTERNO, DESARROLLO ALTERNATIVO Y LUCHA CONTRA": 
    "DEFENSA NACIONAL, ORDEN INTERNO, DESARROLLO ALTERNATIVO Y LUCHA CONTRA LAS DROGAS",
  "DEFENSA NACIONAL, ORDEN INTERNO, DESARROLLO ALTERNATIVO Y LUCHA": 
    "DEFENSA NACIONAL, ORDEN INTERNO, DESARROLLO ALTERNATIVO Y LUCHA CONTRA LAS DROGAS",
  "DEFENSA NACIONAL, ORDEN INTERNO, DESARROLLO ALTERNATIVO Y": 
    "DEFENSA NACIONAL, ORDEN INTERNO, DESARROLLO ALTERNATIVO Y LUCHA CONTRA LAS DROGAS",
  "DEFENSA DEL CONSUMIDOR Y ORGANISMOS REGULADORES DE LOS SERVICIOS": 
    "DEFENSA DEL CONSUMIDOR Y ORGANISMOS REGULADORES DE LOS SERVICIOS PÚBLICOS",
  "DEFENSA DEL CONSUMIDOR Y ORGANISMOS REGULADORES DE LOS": 
    "DEFENSA DEL CONSUMIDOR Y ORGANISMOS REGULADORES DE LOS SERVICIOS PÚBLICOS",
  "PUEBLOS ANDINOS, AMAZÓNICOS Y AFROPERUANOS, AMBIENTE Y": 
    "PUEBLOS ANDINOS, AMAZÓNICOS Y AFROPERUANOS, AMBIENTE Y ECOLOGÍA",
  "PUEBLOS ANDINOS, AMAZÓNICOS Y AFROPERUANOS, AMBIENTE": 
    "PUEBLOS ANDINOS, AMAZÓNICOS Y AFROPERUANOS, AMBIENTE Y ECOLOGÍA",
  "PUEBLOS ANDINOS, AMAZÓNICOS Y AFROPERUANOS,": 
    "PUEBLOS ANDINOS, AMAZÓNICOS Y AFROPERUANOS, AMBIENTE Y ECOLOGÍA",
  "PRODUCCIÓN, MICRO Y PEQUEÑA EMPRESA Y": 
    "PRODUCCIÓN, MICRO Y PEQUEÑA EMPRESA Y COOPERATIVAS",
  "PRODUCCIÓN, MICRO Y PEQUEÑA EMPRESA": 
    "PRODUCCIÓN, MICRO Y PEQUEÑA EMPRESA Y COOPERATIVAS",
  "PRESUPUESTO Y CUENTA GENERAL DE LA": 
    "PRESUPUESTO Y CUENTA GENERAL DE LA REPÚBLICA",
  "PRESUPUESTO Y CUENTA GENERAL DE": 
    "PRESUPUESTO Y CUENTA GENERAL DE LA REPÚBLICA",
  "ECONOMÍA, BANCA, FINANZAS E INTELIGENCIA": 
    "ECONOMÍA, BANCA, FINANZAS E INTELIGENCIA FINANCIERA",
  "ECONOMÍA, BANCA, FINANZAS E": 
    "ECONOMÍA, BANCA, FINANZAS E INTELIGENCIA FINANCIERA",
  "INCLUSIÓN SOCIAL Y PERSONAS CON": 
    "INCLUSIÓN SOCIAL Y PERSONAS CON DISCAPACIDAD",
  "INCLUSIÓN SOCIAL Y PERSONAS": 
    "INCLUSIÓN SOCIAL Y PERSONAS CON DISCAPACIDAD",
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
};

interface ParsedSession {
  externalSessionId: string;
  commissionName: string;
  sessionTitle: string;
  scheduledAt: string | null;
  scheduledDateText: string;
  agendaUrl: string | null;
  source: string;
  sourceFileName: string;
}

// Generate consistent external ID for deduplication
function generateExternalId(commissionName: string, scheduledDate: string, sessionTitle: string): string {
  const dateStr = scheduledDate.replace(/\//g, '-');
  // Create a simple hash from commission + title
  const content = `${commissionName}|${sessionTitle}`.toLowerCase();
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const hashHex = Math.abs(hash).toString(16).slice(0, 8);
  return `PERU-${dateStr}-${hashHex}`;
}

// Complete truncated commission name
function completarComision(comision: string): string {
  let cleaned = comision.trim();
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
  
  // Starts with match
  const sortedEntries = Object.entries(COMISIONES_COMPLETAS)
    .sort((a, b) => b[0].length - a[0].length);
  
  for (const [parcial, completo] of sortedEntries) {
    if (comisionUpper.startsWith(parcial.toUpperCase())) {
      return completo;
    }
  }
  
  return cleaned;
}

// Parse DD/MM/YYYY HH:MM AM/PM to ISO timestamp
function parseDateTime(dateStr: string, timeStr: string): string | null {
  if (!dateStr) return null;
  
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  
  let hours = 0;
  let minutes = 0;
  
  if (timeStr) {
    const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (timeMatch) {
      hours = parseInt(timeMatch[1], 10);
      minutes = parseInt(timeMatch[2], 10);
      const isPM = timeMatch[3].toUpperCase() === 'PM';
      if (isPM && hours !== 12) hours += 12;
      if (!isPM && hours === 12) hours = 0;
    }
  }
  
  const date = new Date(year, month, day, hours, minutes);
  return date.toISOString();
}

// Lightweight text-based PDF parsing (extract text without heavy PDF.js)
// This works because the Congress PDF has structured text we can parse
async function parseSessionsFromText(text: string, sourceFileName: string): Promise<ParsedSession[]> {
  console.log(`[Sync] Parsing text of length: ${text.length}`);
  
  const sessions: ParsedSession[] = [];
  
  // Extract ALL hours in order
  const horaPattern = /(\d{1,2}:\d{2}\s*[AP]M)/gi;
  const allHoras = text.match(horaPattern) || [];
  console.log(`[Sync] Found ${allHoras.length} hours in text`);
  
  // Split by "Ver agenda"
  const blocks = text.split(/Ver\s+agend(?:a)?/i);
  console.log(`[Sync] Split into ${blocks.length} blocks`);
  
  let horaIdx = 0;
  
  for (const block of blocks) {
    const normalizedText = block.replace(/\s+/g, ' ').trim();
    
    // Extract date
    const fechaMatch = normalizedText.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
    const fecha = fechaMatch ? fechaMatch[1] : '';
    
    // Extract session pattern
    const sesionPattern = /((?:PRIMERA|SEGUNDA|TERCERA|CUARTA|QUINTA|SEXTA|SÉPTIMA|SEPTIMA|OCTAVA|NOVENA|DÉCIMA|DECIMA|UNDÉCIMA|DUODÉCIMA|DÉCIM[OA]\s*PRIMER[OA]|DÉCIM[OA]\s*SEGUND[OA]|DÉCIM[OA]\s*TERCER[OA]|DÉCIM[OA]\s*CUART[OA]|DÉCIM[OA]\s*QUINT[OA]|VIGÉSIM[OA]|VIGESIM[OA]|ELECCIÓN)\s+(?:SESIÓN\s+)?(?:DE\s+LA\s+MESA\s+DIRECTIVA\s+E\s+INSTALACIÓN\s+DE\s+LA\s+)?(?:ORDINARIA|EXTRAORDINARIA)?\s*DE\s+LA\s+(?:COMISIÓN|SUBCOMISIÓN)(?:\s+DE)?\s+[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ,\s\-]+)/i;
    
    const sesionMatch = normalizedText.match(sesionPattern);
    
    if (sesionMatch && fecha) {
      let sesion = sesionMatch[1].trim();
      sesion = sesion.replace(/\s+/g, ' ');
      sesion = sesion.replace(/\s*\d{1,2}\/\d{1,2}\/\d{4}.*$/, '');
      sesion = sesion.replace(/\s*\d{1,2}:\d{2}\s*[AP]M.*$/i, '');
      sesion = sesion.replace(/\s*(Descentralizada|Continuada|Virtual).*$/i, '');
      
      // Extract commission from session
      const comisionMatch = sesion.match(/(?:COMISIÓN|SUBCOMISIÓN)\s+(?:DE\s+)?(.+?)$/i);
      let comision = comisionMatch ? comisionMatch[1].trim() : 'Comisión no identificada';
      comision = completarComision(comision);
      
      // Get hour in order
      const hora = horaIdx < allHoras.length ? allHoras[horaIdx].toUpperCase() : '';
      horaIdx++;
      
      const externalId = generateExternalId(comision, fecha, sesion);
      
      sessions.push({
        externalSessionId: externalId,
        commissionName: comision,
        sessionTitle: sesion,
        scheduledAt: parseDateTime(fecha, hora),
        scheduledDateText: `${fecha} ${hora}`.trim(),
        agendaUrl: null, // URLs need PDF annotation extraction which is complex
        source: 'PERU_CONGRESS_SYNC',
        sourceFileName: sourceFileName,
      });
    }
  }
  
  console.log(`[Sync] Parsed ${sessions.length} sessions`);
  return sessions;
}

// Build Congress PDF URL with Base64 encoded params
function buildCongressUrl(periodoParlamentario: number, periodoLegislativo: string): string {
  const params = {
    periodoParlamentario,
    periodoLegislativo,
    tipoComision: null,
    comision: null,
    fecha: null,
    sesion: null,
    descentralizada: null,
    conjunta: null,
    continuada: null
  };
  
  const base64Params = btoa(JSON.stringify(params));
  return `https://wb2server.congreso.gob.pe/service-portal-publico-ext/x-pdf/sesiones/archivo/pdf/${base64Params}/reporte-sesiones.pdf`;
}

// Extract text from PDF using pdfjs-dist in Deno
async function extractTextFromPdf(pdfBytes: ArrayBuffer): Promise<string> {
  // Use pdf-parse-fork which works in Deno
  const { default: pdfParse } = await import('https://esm.sh/pdf-parse@1.1.1');
  
  const buffer = new Uint8Array(pdfBytes);
  const data = await pdfParse(buffer);
  
  console.log(`[Sync] Extracted ${data.numpages} pages, ${data.text.length} chars`);
  return data.text;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[Sync Peru Sessions] Starting sync...');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get current year for periodo legislativo
    const currentYear = new Date().getFullYear();
    const periodoLegislativo = currentYear.toString();
    const periodoParlamentario = 2021; // Current parliament period
    
    // Build URL and download PDF
    const pdfUrl = buildCongressUrl(periodoParlamentario, periodoLegislativo);
    console.log(`[Sync] Fetching PDF from Congress: ${pdfUrl.slice(0, 100)}...`);
    
    const pdfResponse = await fetch(pdfUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/pdf',
      }
    });
    
    if (!pdfResponse.ok) {
      throw new Error(`Failed to download PDF: ${pdfResponse.status} ${pdfResponse.statusText}`);
    }
    
    const pdfBytes = await pdfResponse.arrayBuffer();
    console.log(`[Sync] Downloaded PDF: ${pdfBytes.byteLength} bytes`);
    
    // Extract text from PDF
    const pdfText = await extractTextFromPdf(pdfBytes);
    
    // Parse sessions from text
    const sourceFileName = `reporte-sesiones-${periodoLegislativo}.pdf`;
    const parsedSessions = await parseSessionsFromText(pdfText, sourceFileName);
    
    if (parsedSessions.length === 0) {
      console.log('[Sync] No sessions parsed from PDF');
      return new Response(JSON.stringify({
        success: true,
        message: 'No sessions found in PDF',
        stats: { parsed: 0, inserted: 0, updated: 0, unchanged: 0 }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Upsert sessions
    let inserted = 0;
    let updated = 0;
    let unchanged = 0;
    
    for (const session of parsedSessions) {
      // Check if session exists
      const { data: existing, error: selectError } = await supabase
        .from('peru_sessions')
        .select('id, scheduled_at, agenda_url, session_title')
        .eq('external_session_id', session.externalSessionId)
        .maybeSingle();
      
      if (selectError) {
        console.error(`[Sync] Error checking session ${session.externalSessionId}:`, selectError);
        continue;
      }
      
      if (existing) {
        // Check if there are changes
        const hasChanges = 
          existing.scheduled_at !== session.scheduledAt ||
          existing.agenda_url !== session.agendaUrl ||
          existing.session_title !== session.sessionTitle;
        
        if (hasChanges) {
          // Update only changed fields, preserve the ID
          const { error: updateError } = await supabase
            .from('peru_sessions')
            .update({
              scheduled_at: session.scheduledAt,
              scheduled_date_text: session.scheduledDateText,
              agenda_url: session.agendaUrl,
              session_title: session.sessionTitle,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id);
          
          if (updateError) {
            console.error(`[Sync] Error updating session ${session.externalSessionId}:`, updateError);
          } else {
            updated++;
            console.log(`[Sync] Updated: ${session.commissionName} - ${session.scheduledDateText}`);
          }
        } else {
          unchanged++;
        }
      } else {
        // Insert new session
        const { error: insertError } = await supabase
          .from('peru_sessions')
          .insert({
            external_session_id: session.externalSessionId,
            commission_name: session.commissionName,
            session_title: session.sessionTitle,
            scheduled_at: session.scheduledAt,
            scheduled_date_text: session.scheduledDateText,
            agenda_url: session.agendaUrl,
            source: session.source,
            source_file_name: session.sourceFileName,
            jurisdiction: 'PERU',
            status: 'scheduled',
          });
        
        if (insertError) {
          console.error(`[Sync] Error inserting session:`, insertError);
        } else {
          inserted++;
          console.log(`[Sync] Inserted: ${session.commissionName} - ${session.scheduledDateText}`);
        }
      }
    }
    
    const stats = {
      parsed: parsedSessions.length,
      inserted,
      updated,
      unchanged,
    };
    
    console.log(`[Sync] Completed. Stats:`, stats);
    
    return new Response(JSON.stringify({
      success: true,
      message: `Sync completed: ${inserted} inserted, ${updated} updated, ${unchanged} unchanged`,
      stats,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Sync Peru Sessions] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
