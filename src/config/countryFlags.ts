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
  "USA": { code: "US", name: "United States", flagUrl: "https://flagcdn.com/w80/us.png", emoji: "🇺🇸", region: "NAM" },
  "US": { code: "US", name: "United States", flagUrl: "https://flagcdn.com/w80/us.png", emoji: "🇺🇸", region: "NAM" },
  "Canada": { code: "CA", name: "Canada", flagUrl: "https://flagcdn.com/w80/ca.png", emoji: "🇨🇦", region: "NAM" },
  "CA": { code: "CA", name: "Canada", flagUrl: "https://flagcdn.com/w80/ca.png", emoji: "🇨🇦", region: "NAM" },
  "CAN": { code: "CA", name: "Canada", flagUrl: "https://flagcdn.com/w80/ca.png", emoji: "🇨🇦", region: "NAM" },
  
  // Latin America (LATAM)
  "Peru": { code: "PE", name: "Peru", flagUrl: "https://flagcdn.com/w80/pe.png", emoji: "🇵🇪", region: "LATAM" },
  "PE": { code: "PE", name: "Peru", flagUrl: "https://flagcdn.com/w80/pe.png", emoji: "🇵🇪", region: "LATAM" },
  "Costa Rica": { code: "CR", name: "Costa Rica", flagUrl: "https://flagcdn.com/w80/cr.png", emoji: "🇨🇷", region: "LATAM" },
  "CR": { code: "CR", name: "Costa Rica", flagUrl: "https://flagcdn.com/w80/cr.png", emoji: "🇨🇷", region: "LATAM" },
  "CRI": { code: "CR", name: "Costa Rica", flagUrl: "https://flagcdn.com/w80/cr.png", emoji: "🇨🇷", region: "LATAM" },
  
  // European Union (EU) and European Countries
  "EU": { code: "EU", name: "European Union", flagUrl: "https://flagcdn.com/w80/eu.png", emoji: "🇪🇺", region: "EU" },
  "UK": { code: "GB", name: "United Kingdom", flagUrl: "https://flagcdn.com/w80/gb.png", emoji: "🇬🇧", region: "EU" },
  "GB": { code: "GB", name: "United Kingdom", flagUrl: "https://flagcdn.com/w80/gb.png", emoji: "🇬🇧", region: "EU" },
  "Germany": { code: "DE", name: "Germany", flagUrl: "https://flagcdn.com/w80/de.png", emoji: "🇩🇪", region: "EU" },
  "DE": { code: "DE", name: "Germany", flagUrl: "https://flagcdn.com/w80/de.png", emoji: "🇩🇪", region: "EU" },
  "France": { code: "FR", name: "France", flagUrl: "https://flagcdn.com/w80/fr.png", emoji: "🇫🇷", region: "EU" },
  "FR": { code: "FR", name: "France", flagUrl: "https://flagcdn.com/w80/fr.png", emoji: "🇫🇷", region: "EU" },
  "Spain": { code: "ES", name: "Spain", flagUrl: "https://flagcdn.com/w80/es.png", emoji: "🇪🇸", region: "EU" },
  "ES": { code: "ES", name: "Spain", flagUrl: "https://flagcdn.com/w80/es.png", emoji: "🇪🇸", region: "EU" },
  "Switzerland": { code: "CH", name: "Switzerland", flagUrl: "https://flagcdn.com/w80/ch.png", emoji: "🇨🇭", region: "EU" },
  "CH": { code: "CH", name: "Switzerland", flagUrl: "https://flagcdn.com/w80/ch.png", emoji: "🇨🇭", region: "EU" },
  
  // Gulf Cooperation Council (GCC)
  "UAE": { code: "AE", name: "United Arab Emirates", flagUrl: "https://flagcdn.com/w80/ae.png", emoji: "🇦🇪", region: "GCC" },
  "AE": { code: "AE", name: "United Arab Emirates", flagUrl: "https://flagcdn.com/w80/ae.png", emoji: "🇦🇪", region: "GCC" },
  "Saudi Arabia": { code: "SA", name: "Saudi Arabia", flagUrl: "https://flagcdn.com/w80/sa.png", emoji: "🇸🇦", region: "GCC" },
  "SA": { code: "SA", name: "Saudi Arabia", flagUrl: "https://flagcdn.com/w80/sa.png", emoji: "🇸🇦", region: "GCC" },
  "SAU": { code: "SA", name: "Saudi Arabia", flagUrl: "https://flagcdn.com/w80/sa.png", emoji: "🇸🇦", region: "GCC" },
  "KSA": { code: "SA", name: "Saudi Arabia", flagUrl: "https://flagcdn.com/w80/sa.png", emoji: "🇸🇦", region: "GCC" },
  "Oman": { code: "OM", name: "Oman", flagUrl: "https://flagcdn.com/w80/om.png", emoji: "🇴🇲", region: "GCC" },
  "OM": { code: "OM", name: "Oman", flagUrl: "https://flagcdn.com/w80/om.png", emoji: "🇴🇲", region: "GCC" },
  "Kuwait": { code: "KW", name: "Kuwait", flagUrl: "https://flagcdn.com/w80/kw.png", emoji: "🇰🇼", region: "GCC" },
  "KW": { code: "KW", name: "Kuwait", flagUrl: "https://flagcdn.com/w80/kw.png", emoji: "🇰🇼", region: "GCC" },
  "Bahrain": { code: "BH", name: "Bahrain", flagUrl: "https://flagcdn.com/w80/bh.png", emoji: "🇧🇭", region: "GCC" },
  "BH": { code: "BH", name: "Bahrain", flagUrl: "https://flagcdn.com/w80/bh.png", emoji: "🇧🇭", region: "GCC" },
  "Qatar": { code: "QA", name: "Qatar", flagUrl: "https://flagcdn.com/w80/qa.png", emoji: "🇶🇦", region: "GCC" },
  "QA": { code: "QA", name: "Qatar", flagUrl: "https://flagcdn.com/w80/qa.png", emoji: "🇶🇦", region: "GCC" },
  
  // Asia-Pacific (APAC)
  "Japan": { code: "JP", name: "Japan", flagUrl: "https://flagcdn.com/w80/jp.png", emoji: "🇯🇵", region: "APAC" },
  "JP": { code: "JP", name: "Japan", flagUrl: "https://flagcdn.com/w80/jp.png", emoji: "🇯🇵", region: "APAC" },
  "JPN": { code: "JP", name: "Japan", flagUrl: "https://flagcdn.com/w80/jp.png", emoji: "🇯🇵", region: "APAC" },
  "Korea": { code: "KR", name: "South Korea", flagUrl: "https://flagcdn.com/w80/kr.png", emoji: "🇰🇷", region: "APAC" },
  "KR": { code: "KR", name: "South Korea", flagUrl: "https://flagcdn.com/w80/kr.png", emoji: "🇰🇷", region: "APAC" },
  "KOR": { code: "KR", name: "South Korea", flagUrl: "https://flagcdn.com/w80/kr.png", emoji: "🇰🇷", region: "APAC" },
  "Taiwan": { code: "TW", name: "Taiwan", flagUrl: "https://flagcdn.com/w80/tw.png", emoji: "🇹🇼", region: "APAC" },
  "TW": { code: "TW", name: "Taiwan", flagUrl: "https://flagcdn.com/w80/tw.png", emoji: "🇹🇼", region: "APAC" },
  "TWN": { code: "TW", name: "Taiwan", flagUrl: "https://flagcdn.com/w80/tw.png", emoji: "🇹🇼", region: "APAC" },
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
