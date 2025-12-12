import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegionSelector, RegionHeader, RegionEmptyState } from "@/components/regions";
import type { RegionCode } from "@/components/regions/RegionConfig";
import { MediaMonitoringDemo } from "./MediaMonitoringDemo";

// Country options for each region
const REGION_COUNTRIES: Record<RegionCode, { code: string; name: string; flag: string }[]> = {
  NAM: [
    { code: "usa", name: "United States", flag: "🇺🇸" },
    { code: "canada", name: "Canada", flag: "🇨🇦" },
  ],
  LATAM: [
    { code: "costa-rica", name: "Costa Rica", flag: "🇨🇷" },
  ],
  EU: [
    { code: "eu", name: "European Union", flag: "🇪🇺" },
  ],
  GCC: [
    { code: "uae", name: "UAE", flag: "🇦🇪" },
    { code: "saudi", name: "Saudi Arabia", flag: "🇸🇦" },
    { code: "oman", name: "Oman", flag: "🇴🇲" },
    { code: "kuwait", name: "Kuwait", flag: "🇰🇼" },
    { code: "bahrain", name: "Bahrain", flag: "🇧🇭" },
    { code: "qatar", name: "Qatar", flag: "🇶🇦" },
  ],
  APAC: [
    { code: "japan", name: "Japan", flag: "🇯🇵" },
    { code: "korea", name: "Korea", flag: "🇰🇷" },
    { code: "taiwan", name: "Taiwan", flag: "🇹🇼" },
  ],
};

export function MediaSection() {
  const [selectedRegion, setSelectedRegion] = useState<RegionCode>("LATAM");
  const [selectedCountry, setSelectedCountry] = useState<string>("costa-rica");

  const handleRegionChange = (region: RegionCode) => {
    setSelectedRegion(region);
    // Reset to first country in the region
    const countries = REGION_COUNTRIES[region];
    if (countries.length > 0) {
      setSelectedCountry(countries[0].code);
    }
  };

  const countries = REGION_COUNTRIES[selectedRegion] || [];

  // Check if this is Costa Rica (the only one with content)
  const hasContent = selectedRegion === "LATAM" && selectedCountry === "costa-rica";

  return (
    <div className="space-y-6">
      {/* Region Selector */}
      <RegionSelector
        selectedRegion={selectedRegion}
        onSelectRegion={handleRegionChange}
      />

      {/* Region Header */}
      <RegionHeader region={selectedRegion} />

      {/* Country Selector */}
      {countries.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Select a Country</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {countries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => setSelectedCountry(country.code)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    selectedCountry === country.code
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted border-border"
                  }`}
                >
                  <span className="mr-2">{country.flag}</span>
                  {country.name}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Area */}
      {hasContent ? (
        <MediaMonitoringDemo />
      ) : (
        <RegionEmptyState region={selectedRegion} />
      )}
    </div>
  );
}
