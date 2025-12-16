import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegionSelector, RegionHeader, RegionEmptyState } from "@/components/regions";
import type { RegionCode } from "@/components/regions/RegionConfig";
import { MediaMonitoringDemo } from "./MediaMonitoringDemo";
import { CountryFlag } from "@/components/shared/CountryFlag";

// Country options for each region (countryKey maps to COUNTRY_FLAGS keys)
const REGION_COUNTRIES: Record<RegionCode, { code: string; countryKey: string; name: string }[]> = {
  NAM: [
    { code: "usa", countryKey: "USA", name: "United States" },
    { code: "canada", countryKey: "Canada", name: "Canada" },
  ],
  LATAM: [
    { code: "costa-rica", countryKey: "Costa Rica", name: "Costa Rica" },
  ],
  EU: [
    { code: "eu", countryKey: "EU", name: "European Union" },
  ],
  GCC: [
    { code: "uae", countryKey: "UAE", name: "UAE" },
    { code: "saudi", countryKey: "Saudi Arabia", name: "Saudi Arabia" },
    { code: "oman", countryKey: "Oman", name: "Oman" },
    { code: "kuwait", countryKey: "Kuwait", name: "Kuwait" },
    { code: "bahrain", countryKey: "Bahrain", name: "Bahrain" },
    { code: "qatar", countryKey: "Qatar", name: "Qatar" },
  ],
  APAC: [
    { code: "japan", countryKey: "Japan", name: "Japan" },
    { code: "korea", countryKey: "Korea", name: "Korea" },
    { code: "taiwan", countryKey: "Taiwan", name: "Taiwan" },
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
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all inline-flex items-center gap-2 ${
                    selectedCountry === country.code
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted border-border"
                  }`}
                >
                  <CountryFlag countryKey={country.countryKey} variant="full" size="sm" showTooltip={false} />
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
