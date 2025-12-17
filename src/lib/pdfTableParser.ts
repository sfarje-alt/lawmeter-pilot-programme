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

// Extract all text items with positions
async function extractTextWithPositions(pdf: any): Promise<TextItem[]> {
  const items: TextItem[] = [];
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const viewport = page.getViewport({ scale: 1 });
    
    for (const item of textContent.items) {
      if ('str' in item && item.str.trim()) {
        const transform = item.transform as number[];
        items.push({
          text: item.str.trim(),
          // X is horizontal position
          x: transform[4],
          // Y inverted so 0 is at top
          y: viewport.height - transform[5]
        });
      }
    }
  }
  
  return items;
}

// Extract links with positions
async function extractLinksWithPositions(pdf: any): Promise<PDFLink[]> {
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

// Group text items by Y coordinate (each Y = one row)
function groupByY(items: TextItem[], threshold: number = 5): Map<number, TextItem[]> {
  const groups = new Map<number, TextItem[]>();
  const sortedItems = [...items].sort((a, b) => a.y - b.y);
  
  for (const item of sortedItems) {
    let addedToGroup = false;
    
    for (const [groupY, groupItems] of groups) {
      if (Math.abs(item.y - groupY) <= threshold) {
        groupItems.push(item);
        addedToGroup = true;
        break;
      }
    }
    
    if (!addedToGroup) {
      groups.set(item.y, [item]);
    }
  }
  
  return groups;
}

// Get text within an X coordinate range
function getTextInXRange(items: TextItem[], minX: number, maxX: number): string {
  const matching = items
    .filter(item => item.x >= minX && item.x < maxX)
    .sort((a, b) => a.x - b.x);
  
  return matching.map(item => item.text).join(' ').trim();
}

// Find link closest to a given Y position
function findLinkForY(links: PDFLink[], targetY: number, threshold: number = 10): string | null {
  for (const link of links) {
    if (Math.abs(link.y - targetY) <= threshold) {
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

// Detect column boundaries from header items
function detectColumnBoundaries(items: TextItem[]): { [key: string]: { min: number; max: number } } | null {
  // Find header row - look for "TIPO" or "COMISIÓN" at low Y (top of page)
  const headerItems = items.filter(item => item.y < 50);
  
  console.log('Header items found:', headerItems.map(i => `"${i.text}" x=${i.x.toFixed(0)}`));
  
  // Find specific headers
  const tipoHeader = headerItems.find(i => i.text.includes('TIPO'));
  const comisionHeader = headerItems.find(i => i.text === 'COMISIÓN');
  const sesionHeader = headerItems.find(i => i.text === 'SESIÓN');
  const caracteristicasHeader = headerItems.find(i => i.text.includes('CARACTER'));
  const fechaHeader = headerItems.find(i => i.text.includes('FECHA'));
  const agendaHeader = headerItems.find(i => i.text === 'AGENDA');
  
  if (!tipoHeader && !comisionHeader) {
    console.log('No header row detected');
    return null;
  }
  
  // Build column boundaries
  const pageWidth = 850;
  const cols: { [key: string]: { min: number; max: number } } = {
    tipo: { min: 0, max: (comisionHeader?.x || 100) - 5 },
    comision: { min: (comisionHeader?.x || 100) - 5, max: (sesionHeader?.x || 200) - 5 },
    sesion: { min: (sesionHeader?.x || 200) - 5, max: (caracteristicasHeader?.x || 500) - 5 },
    caracteristicas: { min: (caracteristicasHeader?.x || 500) - 5, max: (fechaHeader?.x || 600) - 5 },
    fecha: { min: (fechaHeader?.x || 600) - 5, max: (agendaHeader?.x || 700) - 5 },
    agenda: { min: (agendaHeader?.x || 700) - 5, max: pageWidth }
  };
  
  console.log('Detected columns:', cols);
  return cols;
}

// Check if row is a header row
function isHeaderRow(items: TextItem[]): boolean {
  const text = items.map(i => i.text).join(' ').toLowerCase();
  return text.includes('tipo comisi') || 
         (text.includes('comisión') && text.includes('sesión') && text.includes('agenda'));
}

// Main parser
export async function parsePeruSessionsPdf(file: File): Promise<ParsedSession[]> {
  console.log('=== PDF Parser (Standard Coordinates) ===');
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
  
  // Log sample items for debugging
  console.log('\nSample items (sorted by Y, first 30):');
  const sampleByY = [...textItems].sort((a, b) => a.y - b.y).slice(0, 30);
  sampleByY.forEach(item => {
    console.log(`  Y=${item.y.toFixed(0).padStart(4)} X=${item.x.toFixed(0).padStart(4)} "${item.text}"`);
  });
  
  // Detect column structure from first page headers
  const columns = detectColumnBoundaries(textItems);
  if (!columns) {
    throw new Error('No se pudo detectar la estructura del PDF');
  }
  
  // Group items by Y (each Y = one row)
  const yGroups = groupByY(textItems, 5);
  console.log('\nY groups (rows):', yGroups.size);
  
  const sessions: ParsedSession[] = [];
  
  // Process each row (sorted by Y ascending = top to bottom)
  const sortedGroups = Array.from(yGroups.entries()).sort((a, b) => a[0] - b[0]);
  
  for (const [groupY, items] of sortedGroups) {
    // Skip header rows
    if (isHeaderRow(items)) {
      console.log(`Y=${groupY.toFixed(0)}: [SKIP: Header]`);
      continue;
    }
    
    // Skip rows with too few items
    if (items.length < 2) {
      continue;
    }
    
    // Extract column data using X ranges
    const tipo = getTextInXRange(items, columns.tipo.min, columns.tipo.max);
    const comision = getTextInXRange(items, columns.comision.min, columns.comision.max);
    const sesion = getTextInXRange(items, columns.sesion.min, columns.sesion.max);
    const caracteristicas = getTextInXRange(items, columns.caracteristicas.min, columns.caracteristicas.max);
    const fechaText = getTextInXRange(items, columns.fecha.min, columns.fecha.max);
    
    // Skip if no meaningful data
    if (!sesion && !comision && !tipo) {
      continue;
    }
    
    // Skip "PROGRAMADA" only rows
    if (tipo === 'PROGRAMADA' && !comision && !sesion) {
      continue;
    }
    
    const { date, time } = parseDateTime(fechaText);
    const agendaUrl = findLinkForY(links, groupY, 10);
    
    // Build commission name
    let fullCommission = comision;
    if (!fullCommission && sesion) {
      const match = sesion.match(/COMISI[ÓO]N DE ([^,]+)/i);
      if (match) {
        fullCommission = `Comisión de ${match[1].trim()}`;
      }
    }
    
    console.log(`Y=${groupY.toFixed(0)}: tipo="${tipo}" comision="${comision?.substring(0, 20)}..." sesion="${sesion?.substring(0, 30)}..." fecha="${date}" hora="${time}"`);
    
    if (fullCommission || sesion) {
      sessions.push({
        tipoSesion: tipo || 'Ordinaria',
        commissionName: fullCommission || 'Comisión no identificada',
        sessionTitle: sesion || 'Sesión',
        caracteristicas: caracteristicas || null,
        scheduledDate: date,
        scheduledTime: time,
        agendaUrl
      });
    }
  }
  
  console.log(`\n=== Result: ${sessions.length} sessions ===`);
  sessions.slice(0, 5).forEach((s, i) => {
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
