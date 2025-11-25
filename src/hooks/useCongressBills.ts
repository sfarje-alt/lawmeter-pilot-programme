import { useState, useEffect } from "react";
import { CongressBill, CongressApiResponse } from "@/types/congress";

const CONGRESS_API_BASE = "https://api.congress.gov/v3";
const CURRENT_CONGRESS = 118; // 118th Congress (2023-2025)

const API_KEY = "KD2m5YgyIPMtxMOweZ6Tb57c1W8pD7Zr5eaDrM86";

export function useCongressBills() {
  const [bills, setBills] = useState<CongressBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBills() {
      try {
        const response = await fetch(
          `${CONGRESS_API_BASE}/bill/${CURRENT_CONGRESS}?format=json&limit=50&api_key=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data: CongressApiResponse = await response.json();
        setBills(data.bills || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch bills");
        // Set some mock data for development/demo
        setBills([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBills();
  }, []);

  return { bills, loading, error };
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
