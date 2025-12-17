import * as pdfjsLib from 'pdfjs-dist';

// Configure worker for v3
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

interface TextItem {
  text: string;
  x: number;
  y: number;
}

interface PDFLink {
  url: string;
  x: number;
  y: number;
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

// Extract all text items with raw coordinates (no transformation)
async function extractTextWithPositions(pdf: any): Promise<TextItem[]> {
  const items: TextItem[] = [];
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    for (const item of textContent.items) {
      if ('str' in item && item.str.trim()) {
        const transform = item.transform as number[];
        items.push({
          text: item.str.trim(),
          x: transform[4],
          y: transform[5]
        });
      }
    }
  }
  
  return items;
}

// Extract links with raw coordinates
async function extractLinksWithPositions(pdf: any): Promise<PDFLink[]> {
  const links: PDFLink[] = [];
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const annotations = await page.getAnnotations();
    
    for (const annot of annotations) {
      if (annot.subtype === 'Link' && annot.url) {
        links.push({
          url: annot.url,
          x: annot.rect[0],
          y: annot.rect[1]
        });
      }
    }
  }
  
  return links;
}

// Group text items by X coordinate (each X = one session row in transposed PDF)
function groupByX(items: TextItem[], threshold: number = 12): Map<number, TextItem[]> {
  const groups = new Map<number, TextItem[]>();
  const sortedItems = [...items].sort((a, b) => a.x - b.x);
  
  for (const item of sortedItems) {
    let addedToGroup = false;
    
    for (const [groupX, groupItems] of groups) {
      if (Math.abs(item.x - groupX) <= threshold) {
        groupItems.push(item);
        addedToGroup = true;
        break;
      }
    }
    
    if (!addedToGroup) {
      groups.set(item.x, [item]);
    }
  }
  
  return groups;
}

// Get text within a Y coordinate range
function getTextInYRange(items: TextItem[], minY: number, maxY: number): string {
  const matching = items
    .filter(item => item.y >= minY && item.y <= maxY)
    .sort((a, b) => b.y - a.y); // Sort descending (top to bottom in PDF view)
  
  return matching.map(item => item.text).join(' ').trim();
}

// Find link closest to a given X position
function findLinkForX(links: PDFLink[], targetX: number, threshold: number = 25): string | null {
  for (const link of links) {
    if (Math.abs(link.x - targetX) <= threshold) {
      return link.url;
    }
  }
  return null;
}

// Parse date and time from combined text
function parseDateTime(text: string): { date: string; time: string } {
  const dateMatch = text.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
  const timeMatch = text.match(/(\d{1,2}:\d{2}\s*(?:AM|PM)?)/i);
  
  return {
    date: dateMatch ? dateMatch[1] : '',
    time: timeMatch ? timeMatch[1].toUpperCase() : ''
  };
}

// Check if group represents header row
function isHeaderGroup(items: TextItem[]): boolean {
  const combinedText = items.map(i => i.text.toLowerCase()).join(' ');
  return combinedText.includes('tipo') || 
         combinedText.includes('comisión') && combinedText.includes('sesión') ||
         combinedText.includes('agenda') ||
         combinedText.includes('características');
}

// Main parser - handles transposed coordinate system
export async function parsePeruSessionsPdf(file: File): Promise<ParsedSession[]> {
  console.log('=== PDF Parser (Transposed Coordinate System) ===');
  console.log('File:', file.name);
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  console.log('Pages:', pdf.numPages);
  
  const [textItems, links] = await Promise.all([
    extractTextWithPositions(pdf),
    extractLinksWithPositions(pdf)
  ]);
  
  console.log('Text items:', textItems.length);
  console.log('Links:', links.length);
  
  // Analyze Y distribution to find column boundaries
  const yValues = textItems.map(i => i.y).sort((a, b) => b - a);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  console.log(`Y range: ${minY.toFixed(1)} to ${maxY.toFixed(1)}`);
  
  // Log sample items for debugging
  console.log('\nSample items (sorted by Y desc):');
  const sampleByY = [...textItems].sort((a, b) => b.y - a.y).slice(0, 25);
  sampleByY.forEach(item => {
    console.log(`  Y=${item.y.toFixed(0).padStart(4)} X=${item.x.toFixed(0).padStart(4)} "${item.text}"`);
  });
  
  // Define Y ranges for columns based on typical Peru Congress PDF
  // These are dynamically adjusted based on actual Y distribution
  const yRange = maxY - minY;
  const COLUMN_RANGES = {
    tipoSesion: { min: maxY - yRange * 0.1, max: maxY + 50 },        // Top ~10%: "Ordinaria"
    comision: { min: maxY - yRange * 0.25, max: maxY - yRange * 0.08 }, // ~8-25%: Commission name
    sesion: { min: maxY - yRange * 0.55, max: maxY - yRange * 0.22 },   // ~22-55%: Session title
    caracteristicas: { min: maxY - yRange * 0.75, max: maxY - yRange * 0.52 }, // ~52-75%
    fechaHora: { min: minY - 50, max: maxY - yRange * 0.72 }           // Bottom: Date/time
  };
  
  console.log('\nColumn Y ranges:');
  Object.entries(COLUMN_RANGES).forEach(([col, range]) => {
    console.log(`  ${col}: ${range.min.toFixed(0)} to ${range.max.toFixed(0)}`);
  });
  
  // Group items by X (each X group = one session)
  const xGroups = groupByX(textItems, 12);
  console.log('\nX groups:', xGroups.size);
  
  const sessions: ParsedSession[] = [];
  
  // Process each X group (sorted by X ascending)
  const sortedGroups = Array.from(xGroups.entries()).sort((a, b) => a[0] - b[0]);
  
  for (const [groupX, items] of sortedGroups) {
    console.log(`\n--- X=${groupX.toFixed(0)} (${items.length} items) ---`);
    
    // Skip header groups
    if (isHeaderGroup(items)) {
      console.log('  [SKIP: Header row]');
      continue;
    }
    
    // Skip groups with too few items
    if (items.length < 3) {
      console.log('  [SKIP: Too few items]');
      continue;
    }
    
    // Extract column data using Y ranges
    const tipoSesion = getTextInYRange(items, COLUMN_RANGES.tipoSesion.min, COLUMN_RANGES.tipoSesion.max);
    const comision = getTextInYRange(items, COLUMN_RANGES.comision.min, COLUMN_RANGES.comision.max);
    const sesion = getTextInYRange(items, COLUMN_RANGES.sesion.min, COLUMN_RANGES.sesion.max);
    const caracteristicas = getTextInYRange(items, COLUMN_RANGES.caracteristicas.min, COLUMN_RANGES.caracteristicas.max);
    const fechaHoraText = getTextInYRange(items, COLUMN_RANGES.fechaHora.min, COLUMN_RANGES.fechaHora.max);
    
    const { date, time } = parseDateTime(fechaHoraText);
    const agendaUrl = findLinkForX(links, groupX, 25);
    
    console.log(`  tipo: "${tipoSesion}"`);
    console.log(`  comision: "${comision}"`);
    console.log(`  sesion: "${sesion.substring(0, 50)}..."`);
    console.log(`  caracteristicas: "${caracteristicas}"`);
    console.log(`  fechaHora: "${fechaHoraText}" -> date="${date}" time="${time}"`);
    console.log(`  agendaUrl: ${agendaUrl ? 'found' : 'none'}`);
    
    // Build full commission name
    let fullCommission = comision;
    if (!fullCommission && sesion) {
      const match = sesion.match(/COMISI[ÓO]N DE ([^,]+)/i);
      if (match) {
        fullCommission = `Comisión de ${match[1].trim()}`;
      }
    }
    
    // Only add if we have meaningful data
    if (fullCommission || sesion) {
      sessions.push({
        tipoSesion: tipoSesion || 'Ordinaria',
        commissionName: fullCommission || 'Comisión no identificada',
        sessionTitle: sesion || 'Sesión',
        caracteristicas: caracteristicas || null,
        scheduledDate: date,
        scheduledTime: time,
        agendaUrl
      });
      console.log('  [ADDED]');
    } else {
      console.log('  [SKIP: No meaningful data]');
    }
  }
  
  console.log(`\n=== Result: ${sessions.length} sessions ===`);
  sessions.forEach((s, i) => {
    console.log(`${i + 1}. ${s.commissionName} | ${s.scheduledDate} ${s.scheduledTime}`);
  });
  
  return sessions;
}

// Fallback: Parse from pasted text
export function parseFromPastedText(text: string): ParsedSession[] {
  const lines = text.split('\n').filter(line => line.trim());
  const sessions: ParsedSession[] = [];
  
  for (const line of lines) {
    if (line.includes('TIPO COMISIÓN') || line.includes('AGENDA')) continue;
    
    const session: Partial<ParsedSession> = {};
    
    const dateMatch = line.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
    session.scheduledDate = dateMatch ? dateMatch[1] : '';
    
    const timeMatch = line.match(/(\d{1,2}:\d{2}\s*[APap][Mm])/i);
    session.scheduledTime = timeMatch ? timeMatch[1].toUpperCase() : '';
    
    if (line.toLowerCase().includes('extraordinaria')) {
      session.tipoSesion = 'Extraordinaria';
    } else if (line.toLowerCase().includes('ordinaria')) {
      session.tipoSesion = 'Ordinaria';
    }
    
    if (line.toLowerCase().includes('descentralizada')) {
      session.caracteristicas = 'Descentralizada';
    } else if (line.toLowerCase().includes('virtual')) {
      session.caracteristicas = 'Virtual';
    }
    
    const comisionMatch = line.match(/COMISI[ÓO]N DE ([^,\d]+)/i);
    if (comisionMatch) {
      session.commissionName = `Comisión de ${comisionMatch[1].trim()}`;
    }
    
    const sesionMatch = line.match(/((?:PRIMERA|SEGUNDA|TERCERA|CUARTA|QUINTA|SEXTA|SÉPTIMA|OCTAVA|NOVENA|DÉCIMA|UNDÉCIMA|DUODÉCIMA|VIGÉSIMA)[A-Z\s]*SESI[ÓO]N[^,]+)/i);
    if (sesionMatch) {
      session.sessionTitle = sesionMatch[1].trim();
    }
    
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
