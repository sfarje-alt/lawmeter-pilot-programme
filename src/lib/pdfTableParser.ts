import * as pdfjsLib from 'pdfjs-dist';

// Configure worker for v3
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

interface TextItem {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PDFLink {
  url: string;
  x: number;
  y: number;
}

export interface ParsedSession {
  tipoSesion: string;           // "Ordinaria" / "Extraordinaria"
  commissionName: string;       // "Comisión de Educación..."
  sessionTitle: string;         // "SÉPTIMA SESIÓN EXTRAORDINARIA..."
  caracteristicas: string | null; // "Descentralizada" / "Virtual"
  scheduledDate: string;        // "18/12/2025"
  scheduledTime: string;        // "9:00AM"
  agendaUrl: string | null;     // Link vinculado por posición
}

// Column boundaries based on typical Peru Congress PDF structure
interface ColumnBounds {
  tipoComision: { min: number; max: number };
  comision: { min: number; max: number };
  sesion: { min: number; max: number };
  caracteristicas: { min: number; max: number };
  fechaHora: { min: number; max: number };
  agenda: { min: number; max: number };
}

// Extract all text items from PDF
async function extractAllText(pdf: any): Promise<TextItem[]> {
  const allItems: TextItem[] = [];
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const viewport = page.getViewport({ scale: 1 });
    
    for (const item of textContent.items) {
      if ('str' in item && item.str.trim()) {
        const transform = item.transform as number[];
        allItems.push({
          text: item.str.trim(),
          x: transform[4],
          y: viewport.height - transform[5],
          width: item.width || 0,
          height: item.height || 10
        });
      }
    }
  }
  
  return allItems;
}

// Extract links from PDF
async function extractLinks(pdf: any): Promise<PDFLink[]> {
  const links: PDFLink[] = [];
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const annotations = await page.getAnnotations();
    const viewport = page.getViewport({ scale: 1 });
    
    for (const annot of annotations) {
      if (annot.subtype === 'Link' && annot.url) {
        links.push({
          url: annot.url,
          x: annot.rect[0],
          y: viewport.height - annot.rect[3]
        });
      }
    }
  }
  
  return links;
}

// Detect column boundaries from header row
function detectColumns(items: TextItem[]): ColumnBounds | null {
  // Find header row by looking for "TIPO COMISIÓN" text
  const tipoHeader = items.find(i => i.text.includes('TIPO COMISI'));
  const comisionHeader = items.find(i => i.text === 'COMISIÓN');
  const sesionHeader = items.find(i => i.text === 'SESIÓN');
  const caracteristicasHeader = items.find(i => i.text.includes('CARACTER'));
  const fechaHeader = items.find(i => i.text.includes('FECHA'));
  const agendaHeader = items.find(i => i.text === 'AGENDA');
  
  if (!tipoHeader) {
    console.log('Could not find header row');
    return null;
  }
  
  // Define column boundaries with some buffer
  const pageWidth = 1200; // Approximate
  return {
    tipoComision: { min: 0, max: (comisionHeader?.x || 150) - 10 },
    comision: { min: (comisionHeader?.x || 150) - 10, max: (sesionHeader?.x || 300) - 10 },
    sesion: { min: (sesionHeader?.x || 300) - 10, max: (caracteristicasHeader?.x || 750) - 10 },
    caracteristicas: { min: (caracteristicasHeader?.x || 750) - 10, max: (fechaHeader?.x || 900) - 10 },
    fechaHora: { min: (fechaHeader?.x || 900) - 10, max: (agendaHeader?.x || 1050) - 10 },
    agenda: { min: (agendaHeader?.x || 1050) - 10, max: pageWidth }
  };
}

// Group text items into rows by Y position
function groupByRow(items: TextItem[], yThreshold: number = 8): Map<number, TextItem[]> {
  const rows = new Map<number, TextItem[]>();
  
  // Sort by Y first
  const sorted = [...items].sort((a, b) => a.y - b.y);
  
  for (const item of sorted) {
    // Find existing row within threshold
    let foundRow = false;
    for (const [rowY, rowItems] of rows) {
      if (Math.abs(item.y - rowY) <= yThreshold) {
        rowItems.push(item);
        foundRow = true;
        break;
      }
    }
    
    if (!foundRow) {
      rows.set(item.y, [item]);
    }
  }
  
  return rows;
}

// Get column content for a row
function getColumnText(rowItems: TextItem[], bounds: { min: number; max: number }): string {
  const inColumn = rowItems
    .filter(item => item.x >= bounds.min && item.x < bounds.max)
    .sort((a, b) => a.x - b.x);
  return inColumn.map(i => i.text).join(' ').trim();
}

// Find closest link by Y position
function findLinkForRow(rowY: number, links: PDFLink[], threshold: number = 15): string | null {
  for (const link of links) {
    if (Math.abs(link.y - rowY) <= threshold) {
      return link.url;
    }
  }
  return null;
}

// Parse date and time from text
function parseDateTimeFromText(text: string): { date: string; time: string } {
  const dateMatch = text.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
  const timeMatch = text.match(/(\d{1,2}:\d{2}\s*[APap][Mm]?)/);
  
  return {
    date: dateMatch ? dateMatch[1] : '',
    time: timeMatch ? timeMatch[1].toUpperCase() : ''
  };
}

// Main parsing function
export async function parsePeruSessionsPdf(file: File): Promise<ParsedSession[]> {
  console.log('Starting PDF parse for:', file.name);
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  console.log(`PDF loaded: ${pdf.numPages} pages`);
  
  // Extract text and links
  const [allText, links] = await Promise.all([
    extractAllText(pdf),
    extractLinks(pdf)
  ]);
  
  console.log(`Extracted ${allText.length} text items, ${links.length} links`);
  console.log('Sample texts:', allText.slice(0, 20).map(t => `"${t.text}" x:${t.x.toFixed(0)} y:${t.y.toFixed(0)}`));
  
  // Detect column structure
  const columns = detectColumns(allText);
  if (!columns) {
    console.error('Failed to detect column structure');
    throw new Error('No se pudo detectar la estructura del PDF. Asegúrate de que sea un reporte de sesiones del Congreso.');
  }
  
  console.log('Detected columns:', columns);
  
  // Find header Y position to skip header row
  const headerItem = allText.find(i => i.text.includes('TIPO COMISI'));
  const headerY = headerItem?.y || 0;
  
  // Group text into rows
  const rows = groupByRow(allText);
  console.log(`Grouped into ${rows.size} rows`);
  
  const sessions: ParsedSession[] = [];
  
  // Process each row
  for (const [rowY, rowItems] of rows) {
    // Skip header row and rows above it
    if (rowY <= headerY + 10) continue;
    
    // Extract content from each column
    const tipoText = getColumnText(rowItems, columns.tipoComision);
    const comisionText = getColumnText(rowItems, columns.comision);
    const sesionText = getColumnText(rowItems, columns.sesion);
    const caracteristicasText = getColumnText(rowItems, columns.caracteristicas);
    const fechaText = getColumnText(rowItems, columns.fechaHora);
    const agendaText = getColumnText(rowItems, columns.agenda);
    
    // Skip empty rows or rows without session info
    if (!sesionText && !comisionText) continue;
    
    // Skip if this looks like a continuation or header
    if (tipoText.includes('TIPO') || tipoText.includes('COMISIÓN')) continue;
    
    const { date, time } = parseDateTimeFromText(fechaText);
    const agendaUrl = findLinkForRow(rowY, links);
    
    // Determine full commission name - prefer session text as it's more complete
    let fullCommissionName = '';
    if (sesionText.includes('COMISIÓN DE')) {
      // Extract from session text: "SÉPTIMA SESIÓN... DE LA COMISIÓN DE X" -> "Comisión de X"
      const match = sesionText.match(/COMISI[ÓO]N DE ([^,]+)/i);
      if (match) {
        fullCommissionName = `Comisión de ${match[1].trim()}`;
      }
    }
    if (!fullCommissionName && comisionText) {
      fullCommissionName = comisionText;
    }
    
    sessions.push({
      tipoSesion: tipoText || 'Ordinaria',
      commissionName: fullCommissionName || comisionText || 'Comisión no identificada',
      sessionTitle: sesionText || 'Sesión',
      caracteristicas: caracteristicasText || null,
      scheduledDate: date,
      scheduledTime: time,
      agendaUrl: agendaUrl
    });
  }
  
  console.log(`Parsed ${sessions.length} sessions:`, sessions.slice(0, 3));
  
  return sessions;
}

// Alternative: Parse from pasted table text
export function parseFromPastedText(text: string): ParsedSession[] {
  const lines = text.split('\n').filter(line => line.trim());
  const sessions: ParsedSession[] = [];
  
  for (const line of lines) {
    // Skip headers
    if (line.includes('TIPO COMISIÓN') || line.includes('AGENDA')) continue;
    
    const session: Partial<ParsedSession> = {};
    
    // Extract date
    const dateMatch = line.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
    session.scheduledDate = dateMatch ? dateMatch[1] : '';
    
    // Extract time
    const timeMatch = line.match(/(\d{1,2}:\d{2}\s*[APap][Mm])/i);
    session.scheduledTime = timeMatch ? timeMatch[1].toUpperCase() : '';
    
    // Detect tipo
    if (line.toLowerCase().includes('extraordinaria')) {
      session.tipoSesion = 'Extraordinaria';
    } else if (line.toLowerCase().includes('ordinaria')) {
      session.tipoSesion = 'Ordinaria';
    }
    
    // Detect characteristics
    if (line.toLowerCase().includes('descentralizada')) {
      session.caracteristicas = 'Descentralizada';
    } else if (line.toLowerCase().includes('virtual')) {
      session.caracteristicas = 'Virtual';
    }
    
    // Extract commission name
    const comisionMatch = line.match(/COMISI[ÓO]N DE ([^,\d]+)/i);
    if (comisionMatch) {
      session.commissionName = `Comisión de ${comisionMatch[1].trim()}`;
    }
    
    // Extract session title (look for ordinal + SESIÓN pattern)
    const sesionMatch = line.match(/((?:PRIMERA|SEGUNDA|TERCERA|CUARTA|QUINTA|SEXTA|SÉPTIMA|OCTAVA|NOVENA|DÉCIMA|UNDÉCIMA|DUODÉCIMA|VIGÉSIMA)[A-Z\s]*SESI[ÓO]N[^,]+)/i);
    if (sesionMatch) {
      session.sessionTitle = sesionMatch[1].trim();
    }
    
    // Extract URL
    const urlMatch = line.match(/https?:\/\/[^\s]+/);
    session.agendaUrl = urlMatch ? urlMatch[0] : null;
    
    if (session.scheduledDate || session.commissionName || session.sessionTitle) {
      sessions.push({
        tipoSesion: session.tipoSesion || 'Ordinaria',
        commissionName: session.commissionName || 'Comisión no identificada',
        sessionTitle: session.sessionTitle || 'Sesión',
        caracteristicas: session.caracteristicas || null,
        scheduledDate: session.scheduledDate || '',
        scheduledTime: session.scheduledTime || '',
        agendaUrl: session.agendaUrl || null
      });
    }
  }
  
  return sessions;
}
