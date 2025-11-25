import { useState, useEffect } from "react";
import { CongressBill, CongressApiResponse } from "@/types/congress";

const CONGRESS_API_BASE = "https://api.congress.gov/v3";
const CURRENT_CONGRESS = 119; // 119th Congress (2025-2027)

const API_KEY = "KD2m5YgyIPMtxMOweZ6Tb57c1W8pD7Zr5eaDrM86";

export type SortOption = 
  | "introducedDate-desc" 
  | "introducedDate-asc"
  | "latestAction-desc" 
  | "latestAction-asc" 
  | "number-asc" 
  | "number-desc"
  | "title"
  | "lawNumber-asc"
  | "lawNumber-desc"
  | "cosponsorCount-desc"
  | "cosponsorCount-asc";

export function useCongressBills(sortBy: SortOption = "latestAction-desc") {
  const [bills, setBills] = useState<CongressBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBills() {
      try {
        // Fetch with sort parameter - the API supports sort by updateDate
        const response = await fetch(
          `${CONGRESS_API_BASE}/bill/${CURRENT_CONGRESS}?format=json&limit=250&sort=updateDate+desc&api_key=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data: CongressApiResponse = await response.json();
        let sortedBills = data.bills || [];
        
        // Apply client-side sorting based on the sortBy parameter
        sortedBills = sortBills(sortedBills, sortBy);
        
        setBills(sortedBills);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch bills");
        setBills([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBills();
  }, [sortBy]);

  return { bills, loading, error };
}

function sortBills(bills: CongressBill[], sortBy: SortOption): CongressBill[] {
  const sorted = [...bills];
  
  switch (sortBy) {
    case "introducedDate-desc":
      return sorted.sort((a, b) => {
        const aDate = a.introducedDate || a.updateDate;
        const bDate = b.introducedDate || b.updateDate;
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      });
    case "introducedDate-asc":
      return sorted.sort((a, b) => {
        const aDate = a.introducedDate || a.updateDate;
        const bDate = b.introducedDate || b.updateDate;
        return new Date(aDate).getTime() - new Date(bDate).getTime();
      });
    case "latestAction-desc":
      return sorted.sort((a, b) => 
        new Date(b.latestAction.actionDate).getTime() - new Date(a.latestAction.actionDate).getTime()
      );
    case "latestAction-asc":
      return sorted.sort((a, b) => 
        new Date(a.latestAction.actionDate).getTime() - new Date(b.latestAction.actionDate).getTime()
      );
    case "number-asc":
      return sorted.sort((a, b) => parseInt(a.number) - parseInt(b.number));
    case "number-desc":
      return sorted.sort((a, b) => parseInt(b.number) - parseInt(a.number));
    case "title":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "lawNumber-asc":
      return sorted.sort((a, b) => {
        const aLaw = a.laws?.[0]?.number || "";
        const bLaw = b.laws?.[0]?.number || "";
        if (!aLaw && !bLaw) return 0;
        if (!aLaw) return 1;
        if (!bLaw) return -1;
        return aLaw.localeCompare(bLaw);
      });
    case "lawNumber-desc":
      return sorted.sort((a, b) => {
        const aLaw = a.laws?.[0]?.number || "";
        const bLaw = b.laws?.[0]?.number || "";
        if (!aLaw && !bLaw) return 0;
        if (!aLaw) return 1;
        if (!bLaw) return -1;
        return bLaw.localeCompare(aLaw);
      });
    case "cosponsorCount-desc":
      return sorted.sort((a, b) => {
        const aCount = a.cosponsors?.count || 0;
        const bCount = b.cosponsors?.count || 0;
        return bCount - aCount;
      });
    case "cosponsorCount-asc":
      return sorted.sort((a, b) => {
        const aCount = a.cosponsors?.count || 0;
        const bCount = b.cosponsors?.count || 0;
        return aCount - bCount;
      });
    default:
      return sorted;
  }
}

export async function fetchBillDetails(
  congress: number,
  billType: string,
  billNumber: string
): Promise<any> {
  try {
    const response = await fetch(
      `${CONGRESS_API_BASE}/bill/${congress}/${billType.toLowerCase()}/${billNumber}?format=json&api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.bill;
  } catch (err) {
    console.error("Error fetching bill details:", err);
    throw err;
  }
}

export async function fetchBillCosponsors(
  congress: number,
  billType: string,
  billNumber: string
): Promise<any> {
  try {
    const response = await fetch(
      `${CONGRESS_API_BASE}/bill/${congress}/${billType.toLowerCase()}/${billNumber}/cosponsors?format=json&api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.cosponsors || [];
  } catch (err) {
    console.error("Error fetching bill cosponsors:", err);
    return [];
  }
}

// Fetch all actions for a bill
export async function fetchBillActions(
  congress: number,
  billType: string,
  billNumber: string
): Promise<any[]> {
  try {
    const response = await fetch(
      `${CONGRESS_API_BASE}/bill/${congress}/${billType.toLowerCase()}/${billNumber}/actions?format=json&api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.actions || [];
  } catch (error) {
    console.error("Error fetching bill actions:", error);
    return [];
  }
}

// Fetch bill summaries (CRS summaries)
export async function fetchBillSummaries(
  congress: number,
  billType: string,
  billNumber: string
): Promise<any[]> {
  try {
    const response = await fetch(
      `${CONGRESS_API_BASE}/bill/${congress}/${billType.toLowerCase()}/${billNumber}/summaries?format=json&api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.summaries || [];
  } catch (error) {
    console.error("Error fetching bill summaries:", error);
    return [];
  }
}

// Fetch bill amendments
export async function fetchBillAmendments(
  congress: number,
  billType: string,
  billNumber: string
): Promise<any[]> {
  try {
    const response = await fetch(
      `${CONGRESS_API_BASE}/bill/${congress}/${billType.toLowerCase()}/${billNumber}/amendments?format=json&api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.amendments || [];
  } catch (error) {
    console.error("Error fetching bill amendments:", error);
    return [];
  }
}

// Fetch bill text versions
export async function fetchBillTextVersions(
  congress: number,
  billType: string,
  billNumber: string
): Promise<any[]> {
  try {
    const response = await fetch(
      `${CONGRESS_API_BASE}/bill/${congress}/${billType.toLowerCase()}/${billNumber}/text?format=json&api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.textVersions || [];
  } catch (error) {
    console.error("Error fetching bill text versions:", error);
    return [];
  }
}

// Fetch detailed member information by bioguideId
export async function fetchMemberDetails(bioguideId: string): Promise<any> {
  try {
    const response = await fetch(
      `${CONGRESS_API_BASE}/member/${bioguideId}?format=json&api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.member;
  } catch (error) {
    console.error("Error fetching member details:", error);
    return null;
  }
}

// Fetch bill subjects (legislative subjects)
export async function fetchBillSubjects(
  congress: number,
  billType: string,
  billNumber: string
): Promise<any> {
  try {
    const response = await fetch(
      `${CONGRESS_API_BASE}/bill/${congress}/${billType.toLowerCase()}/${billNumber}/subjects?format=json&api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.subjects || null;
  } catch (error) {
    console.error("Error fetching bill subjects:", error);
    return null;
  }
}

// Fetch bill committees
export async function fetchBillCommittees(
  congress: number,
  billType: string,
  billNumber: string
): Promise<any[]> {
  try {
    const response = await fetch(
      `${CONGRESS_API_BASE}/bill/${congress}/${billType.toLowerCase()}/${billNumber}/committees?format=json&api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.committees || [];
  } catch (error) {
    console.error("Error fetching bill committees:", error);
    return [];
  }
}

// Fetch bill titles (all versions)
export async function fetchBillTitles(
  congress: number,
  billType: string,
  billNumber: string
): Promise<any[]> {
  try {
    const response = await fetch(
      `${CONGRESS_API_BASE}/bill/${congress}/${billType.toLowerCase()}/${billNumber}/titles?format=json&api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.titles || [];
  } catch (error) {
    console.error("Error fetching bill titles:", error);
    return [];
  }
}

// Scrape bill status from Congress.gov (client-side) and cache in database
export async function scrapeBillStatus(
  congress: number,
  billType: string,
  billNumber: string
): Promise<{ currentStage: string; stages: string[] } | null> {
  try {
    // First check database cache
    const { supabase } = await import("@/integrations/supabase/client");
    
    const { data: cached } = await supabase
      .from('congress_bill_statuses')
      .select('current_stage, stages, scraped_at')
      .eq('congress', congress)
      .eq('bill_type', billType)
      .eq('bill_number', billNumber)
      .maybeSingle();

    // If cached and less than 1 hour old, use it
    if (cached) {
      const scrapedAt = new Date(cached.scraped_at);
      const now = new Date();
      const hoursSinceLastScrape = (now.getTime() - scrapedAt.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceLastScrape < 1) {
        console.log("Using cached status from database");
        return {
          currentStage: cached.current_stage,
          stages: cached.stages as string[]
        };
      }
    }

    // Scrape from Congress.gov (client-side to avoid 403)
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
      // Return cached data even if old, better than nothing
      if (cached) {
        return {
          currentStage: cached.current_stage,
          stages: cached.stages as string[]
        };
      }
      return null;
    }

    const html = await response.text();
    
    // Parse the bill_progress ordered list
    const progressMatch = html.match(/<ol class="bill_progress">([\s\S]*?)<\/ol>/);
    if (!progressMatch) {
      console.error("No bill_progress element found");
      if (cached) {
        return {
          currentStage: cached.current_stage,
          stages: cached.stages as string[]
        };
      }
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

    const result = { currentStage, stages };
    
    // Cache in database for future use
    await supabase
      .from('congress_bill_statuses')
      .upsert({
        congress,
        bill_type: billType,
        bill_number: billNumber,
        current_stage: currentStage,
        stages: stages,
        scraped_at: new Date().toISOString()
      }, {
        onConflict: 'congress,bill_type,bill_number'
      });

    console.log(`Scraped and cached: ${currentStage}`);
    return result;
  } catch (error) {
    console.error("Error scraping bill status:", error);
    
    // Try to return cached data as fallback
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: fallback } = await supabase
        .from('congress_bill_statuses')
        .select('current_stage, stages')
        .eq('congress', congress)
        .eq('bill_type', billType)
        .eq('bill_number', billNumber)
        .maybeSingle();

      if (fallback) {
        console.log("Using stale cache as fallback");
        return {
          currentStage: fallback.current_stage,
          stages: fallback.stages as string[]
        };
      }
    } catch (dbError) {
      console.error("Database fallback failed:", dbError);
    }
    
    return null;
  }
}
