// Centralized country flag configuration using CDN images
// All flag images from flagcdn.com (free, high-quality SVG flags)

import { RegionCode } from "@/components/regions/RegionConfig";

export interface CountryFlagInfo {
  code: string;       // ISO 2-letter code (US, JP, etc.)
  name: string;       // Full country name
  flagUrl: string;    // CDN URL for SVG flag
  emoji: string;      // Emoji fallback
  region: RegionCode | "EU"; // Commercial region
}

// Map various country key formats to standardized data
export const COUNTRY_FLAGS: Record<string, CountryFlagInfo> = {
  // North America (NAM)
  "USA": { code: "US", name: "United States", flagUrl: "https://flagcdn.com/us.svg", emoji: "🇺🇸", region: "NAM" },
  "Canada": { code: "CA", name: "Canada", flagUrl: "https://flagcdn.com/ca.svg", emoji: "🇨🇦", region: "NAM" },
  "CAN": { code: "CA", name: "Canada", flagUrl: "https://flagcdn.com/ca.svg", emoji: "🇨🇦", region: "NAM" },
  
  // Latin America (LATAM)
  "Peru": { code: "PE", name: "Peru", flagUrl: "https://flagcdn.com/pe.svg", emoji: "🇵🇪", region: "LATAM" },
  "Costa Rica": { code: "CR", name: "Costa Rica", flagUrl: "https://flagcdn.com/cr.svg", emoji: "🇨🇷", region: "LATAM" },
  "CRI": { code: "CR", name: "Costa Rica", flagUrl: "https://flagcdn.com/cr.svg", emoji: "🇨🇷", region: "LATAM" },
  
  // European Union (EU)
  "EU": { code: "EU", name: "European Union", flagUrl: "https://flagcdn.com/eu.svg", emoji: "🇪🇺", region: "EU" },
  
  // Gulf Cooperation Council (GCC)
  "UAE": { code: "AE", name: "United Arab Emirates", flagUrl: "https://flagcdn.com/ae.svg", emoji: "🇦🇪", region: "GCC" },
  "Saudi Arabia": { code: "SA", name: "Saudi Arabia", flagUrl: "https://flagcdn.com/sa.svg", emoji: "🇸🇦", region: "GCC" },
  "SAU": { code: "SA", name: "Saudi Arabia", flagUrl: "https://flagcdn.com/sa.svg", emoji: "🇸🇦", region: "GCC" },
  "KSA": { code: "SA", name: "Saudi Arabia", flagUrl: "https://flagcdn.com/sa.svg", emoji: "🇸🇦", region: "GCC" },
  "Oman": { code: "OM", name: "Oman", flagUrl: "https://flagcdn.com/om.svg", emoji: "🇴🇲", region: "GCC" },
  "OM": { code: "OM", name: "Oman", flagUrl: "https://flagcdn.com/om.svg", emoji: "🇴🇲", region: "GCC" },
  "Kuwait": { code: "KW", name: "Kuwait", flagUrl: "https://flagcdn.com/kw.svg", emoji: "🇰🇼", region: "GCC" },
  "KW": { code: "KW", name: "Kuwait", flagUrl: "https://flagcdn.com/kw.svg", emoji: "🇰🇼", region: "GCC" },
  "Bahrain": { code: "BH", name: "Bahrain", flagUrl: "https://flagcdn.com/bh.svg", emoji: "🇧🇭", region: "GCC" },
  "BH": { code: "BH", name: "Bahrain", flagUrl: "https://flagcdn.com/bh.svg", emoji: "🇧🇭", region: "GCC" },
  "Qatar": { code: "QA", name: "Qatar", flagUrl: "https://flagcdn.com/qa.svg", emoji: "🇶🇦", region: "GCC" },
  "QA": { code: "QA", name: "Qatar", flagUrl: "https://flagcdn.com/qa.svg", emoji: "🇶🇦", region: "GCC" },
  
  // Asia-Pacific (APAC)
  "Japan": { code: "JP", name: "Japan", flagUrl: "https://flagcdn.com/jp.svg", emoji: "🇯🇵", region: "APAC" },
  "JPN": { code: "JP", name: "Japan", flagUrl: "https://flagcdn.com/jp.svg", emoji: "🇯🇵", region: "APAC" },
  "Korea": { code: "KR", name: "South Korea", flagUrl: "https://flagcdn.com/kr.svg", emoji: "🇰🇷", region: "APAC" },
  "KOR": { code: "KR", name: "South Korea", flagUrl: "https://flagcdn.com/kr.svg", emoji: "🇰🇷", region: "APAC" },
  "Taiwan": { code: "TW", name: "Taiwan", flagUrl: "https://flagcdn.com/tw.svg", emoji: "🇹🇼", region: "APAC" },
  "TWN": { code: "TW", name: "Taiwan", flagUrl: "https://flagcdn.com/tw.svg", emoji: "🇹🇼", region: "APAC" },
};

// Helper to get flag info by any key format
export function getCountryFlagInfo(countryKey: string): CountryFlagInfo | null {
  return COUNTRY_FLAGS[countryKey] || null;
}

// Helper to get all unique countries (deduplicated)
export function getAllCountries(): CountryFlagInfo[] {
  const seen = new Set<string>();
  const result: CountryFlagInfo[] = [];
  
  Object.values(COUNTRY_FLAGS).forEach(info => {
    if (!seen.has(info.code)) {
      seen.add(info.code);
      result.push(info);
    }
  });
  
  return result;
}
