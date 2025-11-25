import { useState, useEffect } from "react";
import { CongressBill, CongressApiResponse } from "@/types/congress";

const CONGRESS_API_BASE = "https://api.congress.gov/v3";
const CURRENT_CONGRESS = 119; // 119th Congress (2025-2027)

const API_KEY = "KD2m5YgyIPMtxMOweZ6Tb57c1W8pD7Zr5eaDrM86";

export type SortOption = "latestAction-desc" | "latestAction-asc" | "title-asc" | "title-desc";

export function useCongressBills(sortBy: SortOption = "latestAction-desc") {
  const [bills, setBills] = useState<CongressBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBills() {
      try {
        // Fetch with sort parameter - the API supports sort by updateDate
        const response = await fetch(
          `${CONGRESS_API_BASE}/bill/${CURRENT_CONGRESS}?format=json&limit=50&sort=updateDate+desc&api_key=${API_KEY}`
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
    case "latestAction-desc":
      return sorted.sort((a, b) => 
        new Date(b.latestAction.actionDate).getTime() - new Date(a.latestAction.actionDate).getTime()
      );
    case "latestAction-asc":
      return sorted.sort((a, b) => 
        new Date(a.latestAction.actionDate).getTime() - new Date(b.latestAction.actionDate).getTime()
      );
    case "title-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "title-desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
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
      `${CONGRESS_API_BASE}/bill/${congress}/${billType}/${billNumber}?format=json&api_key=${API_KEY}`
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
      `${CONGRESS_API_BASE}/bill/${congress}/${billType}/${billNumber}/cosponsors?format=json&api_key=${API_KEY}`
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
      `${CONGRESS_API_BASE}/bill/${congress}/${billType}/${billNumber}/actions?format=json&api_key=${API_KEY}`
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
      `${CONGRESS_API_BASE}/bill/${congress}/${billType}/${billNumber}/summaries?format=json&api_key=${API_KEY}`
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
      `${CONGRESS_API_BASE}/bill/${congress}/${billType}/${billNumber}/amendments?format=json&api_key=${API_KEY}`
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
      `${CONGRESS_API_BASE}/bill/${congress}/${billType}/${billNumber}/text?format=json&api_key=${API_KEY}`
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
