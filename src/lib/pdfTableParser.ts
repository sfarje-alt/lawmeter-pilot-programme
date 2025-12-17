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
  width: number;
  height: number;
}

export interface ParsedSession {
  tipoSesion: string;           // "Ordinaria" / "Extraordinaria"
  commissionName: string;       // "Comisión de Educación..."
  sessionTitle: string;         // "Séptima sesión ordinaria"
  caracteristicas: string | null; // "Descentralizada" / "Virtual"
  scheduledDate: string;        // "18/12/2025"
  scheduledTime: string;        // "9:00AM"
  agendaUrl: string | null;     // Link vinculado por posición
}

// Extract text items with positions from PDF
async function extractTextWithPositions(pdf: any): Promise<TextItem[]> {
  const textItems: TextItem[] = [];
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const viewport = page.getViewport({ scale: 1 });
    
    for (const item of textContent.items) {
      if ('str' in item && item.str.trim()) {
        // Get position from transform matrix [a, b, c, d, e, f] where e=x, f=y
        const transform = item.transform as number[];
        const x = transform[4];
        const y = viewport.height - transform[5]; // Invert Y for top-to-bottom
        
        textItems.push({
          text: item.str.trim(),
          x,
          y,
          width: item.width || 0,
          height: item.height || 10
        });
      }
    }
  }
  
  console.log('Sample text items:', textItems.slice(0, 10).map(t => t.text));
  return textItems;
}

// Extract links with positions from PDF
async function extractLinksWithPositions(pdf: any): Promise<PDFLink[]> {
  const links: PDFLink[] = [];
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const annotations = await page.getAnnotations();
    const viewport = page.getViewport({ scale: 1 });
    
    for (const annot of annotations) {
      if (annot.subtype === 'Link' && annot.url) {
        const rect = annot.rect;
        links.push({
          url: annot.url,
          x: rect[0],
          y: viewport.height - rect[3], // Invert Y
          width: rect[2] - rect[0],
          height: rect[3] - rect[1]
        });
      }
    }
  }
  
  console.log('Found links:', links.map(l => l.url));
  return links;
}

// Group text items into rows based on Y position
function groupIntoRows(textItems: TextItem[], threshold: number = 5): TextItem[][] {
  if (textItems.length === 0) return [];
  
  // Sort by Y position (top to bottom)
  const sorted = [...textItems].sort((a, b) => a.y - b.y);
  
  const rows: TextItem[][] = [];
  let currentRow: TextItem[] = [sorted[0]];
  let currentY = sorted[0].y;
  
  for (let i = 1; i < sorted.length; i++) {
    const item = sorted[i];
    if (Math.abs(item.y - currentY) <= threshold) {
      currentRow.push(item);
    } else {
      // Sort row items by X position (left to right)
      currentRow.sort((a, b) => a.x - b.x);
      rows.push(currentRow);
      currentRow = [item];
      currentY = item.y;
    }
  }
  
  // Don't forget the last row
  if (currentRow.length > 0) {
    currentRow.sort((a, b) => a.x - b.x);
    rows.push(currentRow);
  }
  
  return rows;
}

// Find link closest to a Y position
function findClosestLink(y: number, links: PDFLink[], threshold: number = 30): string | null {
  let closest: PDFLink | null = null;
  let minDistance = Infinity;
  
  for (const link of links) {
    const distance = Math.abs(link.y - y);
    if (distance < minDistance && distance <= threshold) {
      minDistance = distance;
      closest = link;
    }
  }
  
  return closest?.url || null;
}

// Parse date from various formats
function parseDate(text: string): { date: string; time: string } | null {
  // Pattern: DD/MM/YYYY or DD-MM-YYYY
  const dateMatch = text.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (!dateMatch) return null;
  
  const date = `${dateMatch[1].padStart(2, '0')}/${dateMatch[2].padStart(2, '0')}/${dateMatch[3]}`;
  
  // Look for time pattern
  const timeMatch = text.match(/(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?/i);
  const time = timeMatch 
    ? `${timeMatch[1]}:${timeMatch[2]}${timeMatch[3]?.toUpperCase() || ''}` 
    : '';
  
  return { date, time };
}

// Detect session type from text
function detectSessionType(text: string): string | null {
  const lower = text.toLowerCase();
  if (lower.includes('ordinaria')) return 'Ordinaria';
  if (lower.includes('extraordinaria')) return 'Extraordinaria';
  if (lower.includes('permanente')) return 'Permanente';
  return null;
}

// Detect characteristics from text
function detectCharacteristics(text: string): string | null {
  const lower = text.toLowerCase();
  if (lower.includes('descentralizada')) return 'Descentralizada';
  if (lower.includes('virtual')) return 'Virtual';
  if (lower.includes('presencial')) return 'Presencial';
  if (lower.includes('semipresencial')) return 'Semipresencial';
  return null;
}

// Check if text looks like a commission name
function isCommissionName(text: string): boolean {
  const lower = text.toLowerCase();
  return lower.includes('comisión') || 
         lower.includes('comision') ||
         lower.includes('subcomisión') ||
         lower.includes('grupo de trabajo');
}

// Parse a row of text into session data
function parseRow(rowTexts: string[], rowY: number, links: PDFLink[]): Partial<ParsedSession> | null {
  const fullText = rowTexts.join(' ');
  
  // Skip header rows or empty content
  if (fullText.toLowerCase().includes('tipo de comisión') || 
      fullText.toLowerCase().includes('fecha y hora') ||
      fullText.toLowerCase().includes('características')) {
    return null;
  }
  
  const session: Partial<ParsedSession> = {};
  
  // Extract date and time
  const dateInfo = parseDate(fullText);
  if (dateInfo) {
    session.scheduledDate = dateInfo.date;
    session.scheduledTime = dateInfo.time;
  }
  
  // Extract session type
  session.tipoSesion = detectSessionType(fullText) || 'Ordinaria';
  
  // Extract characteristics
  session.caracteristicas = detectCharacteristics(fullText);
  
  // Find commission name
  for (const text of rowTexts) {
    if (isCommissionName(text)) {
      session.commissionName = text;
      break;
    }
  }
  
  // If no explicit commission name, look for longer text segments
  if (!session.commissionName) {
    const longestText = rowTexts.reduce((a, b) => a.length > b.length ? a : b, '');
    if (longestText.length > 20) {
      session.commissionName = longestText;
    }
  }
  
  // Find closest link
  session.agendaUrl = findClosestLink(rowY, links);
  
  // Generate session title
  if (session.tipoSesion) {
    session.sessionTitle = `Sesión ${session.tipoSesion.toLowerCase()}`;
  }
  
  return session;
}

// Main function to parse Peru sessions PDF
export async function parsePeruSessionsPdf(file: File): Promise<ParsedSession[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  console.log(`PDF loaded: ${pdf.numPages} pages`);
  
  // Extract text and links
  const [textItems, links] = await Promise.all([
    extractTextWithPositions(pdf),
    extractLinksWithPositions(pdf)
  ]);
  
  console.log(`Extracted ${textItems.length} text items and ${links.length} links`);
  
  // Group text into rows
  const rows = groupIntoRows(textItems);
  console.log(`Grouped into ${rows.length} rows`);
  
  // Parse each row
  const sessions: ParsedSession[] = [];
  
  for (const row of rows) {
    const rowTexts = row.map(item => item.text);
    const avgY = row.reduce((sum, item) => sum + item.y, 0) / row.length;
    
    const parsed = parseRow(rowTexts, avgY, links);
    
    // Only include rows that have meaningful data
    if (parsed && (parsed.commissionName || parsed.scheduledDate)) {
      sessions.push({
        tipoSesion: parsed.tipoSesion || 'Ordinaria',
        commissionName: parsed.commissionName || 'Comisión no identificada',
        sessionTitle: parsed.sessionTitle || 'Sesión',
        caracteristicas: parsed.caracteristicas || null,
        scheduledDate: parsed.scheduledDate || '',
        scheduledTime: parsed.scheduledTime || '',
        agendaUrl: parsed.agendaUrl || null
      });
    }
  }
  
  console.log(`Parsed ${sessions.length} sessions`);
  
  return sessions;
}

// Alternative: Parse from pasted table text
export function parseFromPastedText(text: string): ParsedSession[] {
  const lines = text.split('\n').filter(line => line.trim());
  const sessions: ParsedSession[] = [];
  
  for (const line of lines) {
    const session: Partial<ParsedSession> = {};
    
    // Extract date
    const dateInfo = parseDate(line);
    if (dateInfo) {
      session.scheduledDate = dateInfo.date;
      session.scheduledTime = dateInfo.time;
    }
    
    // Extract session type
    session.tipoSesion = detectSessionType(line) || 'Ordinaria';
    
    // Extract characteristics
    session.caracteristicas = detectCharacteristics(line);
    
    // Extract URL
    const urlMatch = line.match(/https?:\/\/[^\s]+/);
    session.agendaUrl = urlMatch ? urlMatch[0] : null;
    
    // Look for commission name pattern
    const comisionMatch = line.match(/Comisi[oó]n\s+[^,\d]+/i);
    session.commissionName = comisionMatch ? comisionMatch[0].trim() : undefined;
    
    if (session.scheduledDate || session.commissionName) {
      sessions.push({
        tipoSesion: session.tipoSesion || 'Ordinaria',
        commissionName: session.commissionName || 'Comisión no identificada',
        sessionTitle: `Sesión ${(session.tipoSesion || 'ordinaria').toLowerCase()}`,
        caracteristicas: session.caracteristicas || null,
        scheduledDate: session.scheduledDate || '',
        scheduledTime: session.scheduledTime || '',
        agendaUrl: session.agendaUrl || null
      });
    }
  }
  
  return sessions;
}
