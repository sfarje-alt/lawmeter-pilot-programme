import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ParsedSession {
  tipo_comision: string;
  commission_name: string;
  session_title: string;
  caracteristicas: string | null;
  scheduled_date: string;
  scheduled_time: string;
  agenda_url: string | null;
  external_session_id: string | null;
}

interface ParseResult {
  sessions: ParsedSession[];
  linksExtracted: number;
  totalRows: number;
}

// Helper to convert ArrayBuffer to base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Parse date in format "DD/MM/YYYY H:MMAM/PM" or "DD/MM/YYYY"
function parsePeruvianDate(dateStr: string): { date: string; time: string } {
  const parts = dateStr.trim().split(/\s+/);
  const datePart = parts[0] || '';
  const timePart = parts[1] || '';
  
  // Parse date DD/MM/YYYY to YYYY-MM-DD
  const dateMatch = datePart.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  let isoDate = '';
  if (dateMatch) {
    const [, day, month, year] = dateMatch;
    isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  // Parse time like "9:00AM" or "10:30PM"
  let time24 = '';
  if (timePart) {
    const timeMatch = timePart.match(/(\d{1,2}):(\d{2})(AM|PM)?/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1], 10);
      const minutes = timeMatch[2];
      const ampm = timeMatch[3]?.toUpperCase();
      
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      
      time24 = `${hours.toString().padStart(2, '0')}:${minutes}`;
    }
  }
  
  return { date: isoDate, time: time24 };
}

// Extract session ID from agenda URL
function extractSessionId(agendaUrl: string | null): string | null {
  if (!agendaUrl) return null;
  
  // Pattern: /agenda/XXXX or OpenDocument/XXXX
  const match = agendaUrl.match(/(?:agenda|OpenDocument)[\/=]([A-Z0-9]+)/i);
  return match ? match[1] : null;
}

// Parse text rows from PDF content
function parseTableRows(textContent: string): string[][] {
  const lines = textContent.split('\n').filter(line => line.trim());
  const rows: string[][] = [];
  
  // Look for patterns that indicate table rows
  // Expected columns: TIPO COMISIÓN | COMISIÓN | SESIÓN | CARACTERISTICAS | FECHA/HORA | AGENDA
  
  let currentRow: string[] = [];
  let inTable = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip header row
    if (trimmed.includes('TIPO COMISIÓN') || trimmed.includes('COMISION')) {
      inTable = true;
      continue;
    }
    
    // Detect start of a new session row (starts with "Ordinaria" or "Extraordinaria")
    if (/^(Ordinaria|Extraordinaria)/i.test(trimmed)) {
      if (currentRow.length > 0) {
        rows.push(currentRow);
      }
      currentRow = [trimmed];
    } else if (currentRow.length > 0) {
      // Check if this looks like a date (indicates we're at FECHA/HORA column)
      if (/\d{1,2}\/\d{1,2}\/\d{4}/.test(trimmed)) {
        currentRow.push(trimmed);
      } else if (trimmed === 'Ver agenda' || trimmed === 'Ver Agenda') {
        currentRow.push(trimmed);
      } else if (trimmed === 'Descentralizada' || trimmed === '-') {
        currentRow.push(trimmed);
      } else if (trimmed.length > 0 && !trimmed.startsWith('Nro')) {
        // This is likely commission name or session title
        currentRow.push(trimmed);
      }
    }
  }
  
  // Don't forget the last row
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }
  
  return rows;
}

// Main PDF parsing using pdf.js worker via API
async function parsePdfWithLinks(pdfBytes: ArrayBuffer): Promise<ParseResult> {
  // We'll use pdf.js via a different approach - extract raw content
  // Since Deno doesn't fully support pdf.js, we'll parse the raw PDF structure
  
  const uint8Array = new Uint8Array(pdfBytes);
  const pdfString = new TextDecoder('latin1').decode(uint8Array);
  
  const sessions: ParsedSession[] = [];
  const links: { url: string; position: number }[] = [];
  
  // Extract URLs from PDF (they appear as /URI patterns)
  const uriPattern = /\/URI\s*\((https?:\/\/[^)]+)\)/g;
  let uriMatch;
  while ((uriMatch = uriPattern.exec(pdfString)) !== null) {
    links.push({ 
      url: uriMatch[1].replace(/\\/g, ''), // Remove escape chars
      position: uriMatch.index 
    });
  }
  
  // Also try alternative URI format
  const uriPattern2 = /\/URI\s*<([0-9A-Fa-f]+)>/g;
  while ((uriMatch = uriPattern2.exec(pdfString)) !== null) {
    try {
      // Decode hex to string
      const hex = uriMatch[1];
      let url = '';
      for (let i = 0; i < hex.length; i += 2) {
        url += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      }
      if (url.startsWith('http')) {
        links.push({ url, position: uriMatch.index });
      }
    } catch (e) {
      console.log('Failed to decode hex URL:', e);
    }
  }
  
  console.log(`Found ${links.length} links in PDF`);
  
  // Extract text content between stream...endstream
  let textContent = '';
  const streamPattern = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  let streamMatch;
  while ((streamMatch = streamPattern.exec(pdfString)) !== null) {
    // Try to decode the stream content (often compressed)
    const streamContent = streamMatch[1];
    
    // Look for text operators: Tj, TJ, ' (quote)
    // These contain the actual text in PDFs
    const textPattern = /\(([^)]*)\)\s*Tj/g;
    let textMatch;
    while ((textMatch = textPattern.exec(streamContent)) !== null) {
      textContent += textMatch[1] + '\n';
    }
    
    // TJ operator (array of text)
    const tjArrayPattern = /\[((?:[^[\]]*|\[[^\]]*\])*)\]\s*TJ/gi;
    let tjMatch;
    while ((tjMatch = tjArrayPattern.exec(streamContent)) !== null) {
      const arrayContent = tjMatch[1];
      const textParts = arrayContent.match(/\(([^)]*)\)/g);
      if (textParts) {
        textContent += textParts.map(p => p.slice(1, -1)).join('') + '\n';
      }
    }
  }
  
  console.log('Extracted text preview:', textContent.substring(0, 500));
  
  // Parse the text content into table rows
  const tableRows = parseTableRows(textContent);
  console.log(`Parsed ${tableRows.length} table rows`);
  
  // Associate links with rows (one link per row with "Ver agenda")
  let linkIndex = 0;
  
  for (const row of tableRows) {
    // Try to extract fields from the row
    // Expected order: tipo, comision, sesion, caracteristicas, fecha/hora, agenda
    
    const tipo = row.find(cell => /^(Ordinaria|Extraordinaria)/i.test(cell)) || 'Ordinaria';
    const hasVerAgenda = row.some(cell => /ver\s*agenda/i.test(cell));
    
    // Find date/time cell
    const dateTimeCell = row.find(cell => /\d{1,2}\/\d{1,2}\/\d{4}/.test(cell)) || '';
    const { date, time } = parsePeruvianDate(dateTimeCell);
    
    // Find caracteristicas
    const caracteristicas = row.find(cell => cell === 'Descentralizada') || null;
    
    // Commission and session are typically the longer text cells
    const textCells = row.filter(cell => 
      cell.length > 10 && 
      !/^(Ordinaria|Extraordinaria)/i.test(cell) &&
      !/\d{1,2}\/\d{1,2}\/\d{4}/.test(cell) &&
      !/ver\s*agenda/i.test(cell) &&
      cell !== 'Descentralizada'
    );
    
    const commission = textCells[0] || 'Unknown Commission';
    const sessionTitle = textCells[1] || textCells[0] || '';
    
    // Assign link if available
    let agendaUrl: string | null = null;
    if (hasVerAgenda && linkIndex < links.length) {
      agendaUrl = links[linkIndex].url;
      linkIndex++;
    }
    
    if (date) { // Only add if we have a valid date
      sessions.push({
        tipo_comision: tipo,
        commission_name: commission,
        session_title: sessionTitle,
        caracteristicas,
        scheduled_date: date,
        scheduled_time: time,
        agenda_url: agendaUrl,
        external_session_id: extractSessionId(agendaUrl),
      });
    }
  }
  
  // If we didn't get sessions from text parsing, try a simpler approach
  // Just create sessions from the links we found
  if (sessions.length === 0 && links.length > 0) {
    console.log('Fallback: creating sessions from links only');
    for (const link of links) {
      if (link.url.includes('congreso.gob.pe') || link.url.includes('agenda')) {
        sessions.push({
          tipo_comision: 'Ordinaria',
          commission_name: 'Comisión (pendiente de identificar)',
          session_title: 'Sesión importada',
          caracteristicas: null,
          scheduled_date: new Date().toISOString().split('T')[0],
          scheduled_time: '',
          agenda_url: link.url,
          external_session_id: extractSessionId(link.url),
        });
      }
    }
  }
  
  return {
    sessions,
    linksExtracted: links.length,
    totalRows: tableRows.length,
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const contentType = req.headers.get('content-type') || '';
    
    if (!contentType.includes('multipart/form-data')) {
      return new Response(
        JSON.stringify({ error: 'Expected multipart/form-data with PDF file' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Processing PDF: ${file.name}, size: ${file.size} bytes`);
    
    const arrayBuffer = await file.arrayBuffer();
    const result = await parsePdfWithLinks(arrayBuffer);
    
    console.log(`Parsed ${result.sessions.length} sessions with ${result.linksExtracted} links`);
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error: unknown) {
    console.error('Error parsing PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to parse PDF';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: String(error)
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
