import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CONGRESS_API_BASE = "https://api.congress.gov/v3";
const API_KEY = "KD2m5YgyIPMtxMOweZ6Tb57c1W8pD7Zr5eaDrM86";
const CURRENT_CONGRESS = 119;

interface BillStatus {
  currentStage: string;
  stages: string[];
}

async function scrapeBillStatus(
  congress: number,
  billType: string,
  billNumber: string
): Promise<BillStatus | null> {
  try {
    const chamberName = billType.toLowerCase() === 'hr' ? 'house-bill' : 
                        billType.toLowerCase() === 's' ? 'senate-bill' :
                        billType.toLowerCase() === 'hjres' ? 'house-joint-resolution' :
                        billType.toLowerCase() === 'sjres' ? 'senate-joint-resolution' :
                        billType.toLowerCase() === 'hconres' ? 'house-concurrent-resolution' :
                        billType.toLowerCase() === 'sconres' ? 'senate-concurrent-resolution' :
                        billType.toLowerCase() === 'hres' ? 'house-resolution' : 'senate-resolution';
    
    const url = `https://www.congress.gov/bill/${congress}th-congress/${chamberName}/${billNumber}`;
    console.log(`Scraping ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Failed to fetch page: ${response.status}`);
      return null;
    }

    const html = await response.text();
    
    // Parse the bill_progress ordered list
    const progressMatch = html.match(/<ol class="bill_progress">([\s\S]*?)<\/ol>/);
    if (!progressMatch) {
      console.error("No bill_progress element found");
      return null;
    }

    const progressHtml = progressMatch[1];
    
    // Extract all stages and find the selected one
    const stageMatches = [...progressHtml.matchAll(/<li(?:\s+class="([^"]*)")?>([^<]+)/g)];
    const stages = stageMatches.map(match => match[2].trim());
    
    const selectedStage = stageMatches.find(match => 
      match[1] && (match[1].includes('selected') || match[1] === 'selected')
    );
    
    const currentStage = selectedStage ? selectedStage[2].trim() : stages[0];

    return { currentStage, stages };
  } catch (error) {
    console.error("Error scraping bill status:", error);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Fetching bills from Congress API");
    
    // Fetch all bills from Congress API
    const response = await fetch(
      `${CONGRESS_API_BASE}/bill/${CURRENT_CONGRESS}?format=json&limit=50&sort=updateDate+desc&api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Congress API Error: ${response.status}`);
    }

    const data = await response.json();
    const bills = data.bills || [];
    
    console.log(`Found ${bills.length} bills to scrape`);

    let successCount = 0;
    let errorCount = 0;

    // Process bills in batches to avoid rate limiting
    for (const bill of bills) {
      try {
        console.log(`Processing ${bill.type} ${bill.number}`);
        
        // Check if status already exists and is recent (< 1 hour old)
        const { data: existing } = await supabase
          .from('congress_bill_statuses')
          .select('scraped_at')
          .eq('congress', bill.congress)
          .eq('bill_type', bill.type)
          .eq('bill_number', bill.number)
          .maybeSingle();

        if (existing) {
          const scrapedAt = new Date(existing.scraped_at);
          const now = new Date();
          const hoursSinceLastScrape = (now.getTime() - scrapedAt.getTime()) / (1000 * 60 * 60);
          
          if (hoursSinceLastScrape < 1) {
            console.log(`Skipping ${bill.type} ${bill.number} - recently scraped`);
            continue;
          }
        }

        const status = await scrapeBillStatus(bill.congress, bill.type, bill.number);
        
        if (status) {
          const { error } = await supabase
            .from('congress_bill_statuses')
            .upsert({
              congress: bill.congress,
              bill_type: bill.type,
              bill_number: bill.number,
              current_stage: status.currentStage,
              stages: status.stages,
              scraped_at: new Date().toISOString()
            }, {
              onConflict: 'congress,bill_type,bill_number'
            });

          if (error) {
            console.error(`Error upserting ${bill.type} ${bill.number}:`, error);
            errorCount++;
          } else {
            console.log(`Successfully scraped ${bill.type} ${bill.number}: ${status.currentStage}`);
            successCount++;
          }
        } else {
          console.error(`Failed to scrape ${bill.type} ${bill.number}`);
          errorCount++;
        }

        // Rate limiting - wait 100ms between requests
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`Error processing ${bill.type} ${bill.number}:`, error);
        errorCount++;
      }
    }

    console.log(`Scraping complete: ${successCount} success, ${errorCount} errors`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        scrapedCount: successCount,
        errorCount: errorCount,
        totalBills: bills.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error("Edge function error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
