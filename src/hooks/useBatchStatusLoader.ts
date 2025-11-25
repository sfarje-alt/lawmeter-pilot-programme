import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const CONGRESS_API_BASE = "https://api.congress.gov/v3";
const API_KEY = "KD2m5YgyIPMtxMOweZ6Tb57c1W8pD7Zr5eaDrM86";
const CURRENT_CONGRESS = 119;

export function useBatchStatusLoader() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, status: "" });

  const loadAllStatuses = async () => {
    setLoading(true);
    setProgress({ current: 0, total: 0, status: "Fetching bills..." });

    try {
      // Fetch all bills from Congress API
      const response = await fetch(
        `${CONGRESS_API_BASE}/bill/${CURRENT_CONGRESS}?format=json&limit=50&sort=updateDate+desc&api_key=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Congress API Error: ${response.status}`);
      }

      const data = await response.json();
      const bills = data.bills || [];
      
      setProgress({ current: 0, total: bills.length, status: "Starting..." });

      let successCount = 0;
      let errorCount = 0;

      // Process bills sequentially with delay to avoid rate limiting
      for (let i = 0; i < bills.length; i++) {
        const bill = bills[i];
        setProgress({ 
          current: i + 1, 
          total: bills.length, 
          status: `Processing ${bill.type} ${bill.number}...` 
        });

        try {
          // Check if already cached recently (< 6 hours)
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
            
            if (hoursSinceLastScrape < 6) {
              console.log(`Skipping ${bill.type} ${bill.number} - recently cached`);
              successCount++;
              continue;
            }
          }

          // Scrape status from Congress.gov
          const chamberName = bill.type.toLowerCase() === 'hr' ? 'house-bill' : 
                              bill.type.toLowerCase() === 's' ? 'senate-bill' :
                              bill.type.toLowerCase() === 'hjres' ? 'house-joint-resolution' :
                              bill.type.toLowerCase() === 'sjres' ? 'senate-joint-resolution' :
                              bill.type.toLowerCase() === 'hconres' ? 'house-concurrent-resolution' :
                              bill.type.toLowerCase() === 'sconres' ? 'senate-concurrent-resolution' :
                              bill.type.toLowerCase() === 'hres' ? 'house-resolution' : 'senate-resolution';
          
          const url = `https://www.congress.gov/bill/${bill.congress}th-congress/${chamberName}/${bill.number}`;
          
          const pageResponse = await fetch(url);
          
          if (!pageResponse.ok) {
            console.error(`Failed to fetch ${bill.type} ${bill.number}: ${pageResponse.status}`);
            errorCount++;
            await new Promise(resolve => setTimeout(resolve, 200));
            continue;
          }

          const html = await pageResponse.text();
          
          // Parse the bill_progress ordered list
          const progressMatch = html.match(/<ol class="bill_progress">([\s\S]*?)<\/ol>/);
          if (!progressMatch) {
            console.error(`No bill_progress found for ${bill.type} ${bill.number}`);
            errorCount++;
            await new Promise(resolve => setTimeout(resolve, 200));
            continue;
          }

          const progressHtml = progressMatch[1];
          
          // Extract all stages and find the selected one
          const stageMatches = [...progressHtml.matchAll(/<li(?:\s+class="([^"]*)")?>([^<]+)/g)];
          const stages = stageMatches.map(match => match[2].trim());
          
          const selectedStage = stageMatches.find(match => 
            match[1] && (match[1].includes('selected') || match[1] === 'selected')
          );
          
          const currentStage = selectedStage ? selectedStage[2].trim() : stages[0];

          // Save to database
          const { error: dbError } = await supabase
            .from('congress_bill_statuses')
            .upsert({
              congress: bill.congress,
              bill_type: bill.type,
              bill_number: bill.number,
              current_stage: currentStage,
              stages: stages,
              scraped_at: new Date().toISOString()
            }, {
              onConflict: 'congress,bill_type,bill_number'
            });

          if (dbError) {
            console.error(`DB error for ${bill.type} ${bill.number}:`, dbError);
            errorCount++;
          } else {
            console.log(`✓ Cached ${bill.type} ${bill.number}: ${currentStage}`);
            successCount++;
          }

          // Rate limiting - wait 200ms between requests
          await new Promise(resolve => setTimeout(resolve, 200));

        } catch (error) {
          console.error(`Error processing ${bill.type} ${bill.number}:`, error);
          errorCount++;
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      setProgress({ 
        current: bills.length, 
        total: bills.length, 
        status: `Complete: ${successCount} cached, ${errorCount} errors` 
      });

      return { success: true, successCount, errorCount, total: bills.length };

    } catch (error) {
      console.error("Batch loading error:", error);
      setProgress({ current: 0, total: 0, status: "Error occurred" });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    } finally {
      setLoading(false);
    }
  };

  return { loadAllStatuses, loading, progress };
}
