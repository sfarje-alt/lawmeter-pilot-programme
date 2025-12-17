import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExtractedLink {
  url: string;
  index: number;
}

interface ParseResult {
  links: ExtractedLink[];
  totalLinks: number;
  message: string;
}

// Lightweight link extraction - only extracts URIs without full PDF parsing
function extractLinksFromPdf(pdfBytes: Uint8Array): ExtractedLink[] {
  const links: ExtractedLink[] = [];
  
  // Convert to string for pattern matching (use latin1 to preserve bytes)
  const decoder = new TextDecoder('latin1');
  const pdfString = decoder.decode(pdfBytes);
  
  // Pattern 1: /URI (http://...) - standard format
  const uriPattern1 = /\/URI\s*\(([^)]+)\)/g;
  let match;
  let index = 0;
  
  while ((match = uriPattern1.exec(pdfString)) !== null) {
    const url = match[1]
      .replace(/\\/g, '') // Remove escape chars
      .replace(/\x00/g, ''); // Remove null bytes
    
    if (url.startsWith('http')) {
      links.push({ url, index: index++ });
    }
  }
  
  // Pattern 2: /URI <hex encoded> - alternative format
  const uriPattern2 = /\/URI\s*<([0-9A-Fa-f]+)>/g;
  while ((match = uriPattern2.exec(pdfString)) !== null) {
    try {
      const hex = match[1];
      let url = '';
      for (let i = 0; i < hex.length; i += 2) {
        const charCode = parseInt(hex.substring(i, i + 2), 16);
        if (charCode > 0) url += String.fromCharCode(charCode);
      }
      if (url.startsWith('http')) {
        links.push({ url, index: index++ });
      }
    } catch {
      // Skip malformed hex
    }
  }
  
  // Pattern 3: /A << /URI (...) >> format
  const uriPattern3 = /\/A\s*<<[^>]*\/URI\s*\(([^)]+)\)/g;
  while ((match = uriPattern3.exec(pdfString)) !== null) {
    const url = match[1].replace(/\\/g, '').replace(/\x00/g, '');
    if (url.startsWith('http') && !links.some(l => l.url === url)) {
      links.push({ url, index: index++ });
    }
  }
  
  console.log(`Extracted ${links.length} links from PDF`);
  
  return links;
}

serve(async (req) => {
  // Handle CORS preflight
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
    
    // Check file size - limit to 5MB to avoid memory issues
    if (file.size > 5 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: 'PDF file too large. Maximum size is 5MB.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    const links = extractLinksFromPdf(uint8Array);
    
    // Filter to only congress.gob.pe agenda links
    const agendaLinks = links.filter(l => 
      l.url.includes('congreso.gob.pe') || 
      l.url.includes('/agenda')
    );
    
    const result: ParseResult = {
      links: agendaLinks.length > 0 ? agendaLinks : links,
      totalLinks: links.length,
      message: agendaLinks.length > 0 
        ? `Found ${agendaLinks.length} agenda links from Peru Congress`
        : `Found ${links.length} links (no Congress-specific links detected)`,
    };
    
    console.log(result.message);
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error: unknown) {
    console.error('Error extracting links:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process PDF';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
