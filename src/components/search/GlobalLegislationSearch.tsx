import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, X, MapPin, Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Jurisdiction flags and labels
const jurisdictions = [
  { id: "all", label: "All Jurisdictions", flag: "" },
  { id: "usa", label: "USA", flag: "🇺🇸" },
  { id: "canada", label: "Canada", flag: "🇨🇦" },
  { id: "costa-rica", label: "Costa Rica", flag: "🇨🇷" },
  { id: "peru", label: "Perú", flag: "🇵🇪" },
  { id: "eu", label: "European Union", flag: "🇪🇺" },
  { id: "uae", label: "UAE", flag: "🇦🇪" },
  { id: "saudi", label: "Saudi Arabia", flag: "🇸🇦" },
  { id: "oman", label: "Oman", flag: "🇴🇲" },
  { id: "kuwait", label: "Kuwait", flag: "🇰🇼" },
  { id: "bahrain", label: "Bahrain", flag: "🇧🇭" },
  { id: "qatar", label: "Qatar", flag: "🇶🇦" },
  { id: "japan", label: "Japan", flag: "🇯🇵" },
  { id: "korea", label: "Korea", flag: "🇰🇷" },
  { id: "taiwan", label: "Taiwan", flag: "🇹🇼" },
];

interface SearchResult {
  id: string;
  title: string;
  jurisdiction: string;
  flag: string;
  subJurisdiction?: string;
  riskLevel: "low" | "medium" | "high";
  documentType: string;
}

interface GlobalLegislationSearchProps {
  onSearch?: (query: string, jurisdiction: string) => void;
  onSelectResult?: (result: SearchResult) => void;
  allData?: any[];
}

export function GlobalLegislationSearch({ onSearch, onSelectResult, allData = [] }: GlobalLegislationSearchProps) {
  const [query, setQuery] = useState("");
  const [selectedJurisdiction, setSelectedJurisdiction] = useState("all");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Record<string, SearchResult[]>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate mock suggestions based on query
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions({});
      return;
    }

    // Group results by jurisdiction
    const mockResults: Record<string, SearchResult[]> = {
      "🇺🇸 USA": [
        { id: "us-1", title: `Smart Appliance Safety Act - ${query}`, jurisdiction: "USA", flag: "🇺🇸", riskLevel: "high", documentType: "Bill" },
        { id: "us-2", title: `FCC RF Standards Update - ${query}`, jurisdiction: "USA", flag: "🇺🇸", subJurisdiction: "Federal", riskLevel: "medium", documentType: "Regulation" },
      ],
      "🇨🇦 Canada": [
        { id: "ca-1", title: `ISED Wireless Requirements - ${query}`, jurisdiction: "Canada", flag: "🇨🇦", riskLevel: "medium", documentType: "Regulation" },
      ],
      "🇪🇺 EU": [
        { id: "eu-1", title: `Radio Equipment Directive Amendment - ${query}`, jurisdiction: "EU", flag: "🇪🇺", riskLevel: "high", documentType: "Directive" },
      ],
      "🇯🇵 Japan": [
        { id: "jp-1", title: `電波法改正 - ${query}`, jurisdiction: "Japan", flag: "🇯🇵", riskLevel: "low", documentType: "Law" },
      ],
    };

    // Filter by selected jurisdiction
    if (selectedJurisdiction !== "all") {
      const jurisdictionInfo = jurisdictions.find(j => j.id === selectedJurisdiction);
      if (jurisdictionInfo) {
        const key = `${jurisdictionInfo.flag} ${jurisdictionInfo.label}`;
        setSuggestions({ [key]: mockResults[key] || [] });
      }
    } else {
      setSuggestions(mockResults);
    }
  }, [query, selectedJurisdiction]);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query, selectedJurisdiction);
    }
    setShowSuggestions(false);
  };

  const getRiskBadgeClass = (level: string) => {
    switch (level) {
      case "high": return "bg-risk-high text-risk-high-foreground";
      case "medium": return "bg-risk-medium text-risk-medium-foreground";
      case "low": return "bg-risk-low text-risk-low-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const hasResults = Object.values(suggestions).some(arr => arr.length > 0);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-lg border border-border p-2">
        {/* Jurisdiction Selector */}
        <Select value={selectedJurisdiction} onValueChange={setSelectedJurisdiction}>
          <SelectTrigger className="w-[180px] border-none bg-transparent">
            <div className="flex items-center gap-2">
              <span>{jurisdictions.find(j => j.id === selectedJurisdiction)?.flag}</span>
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-background border border-border">
            {jurisdictions.map(j => (
              <SelectItem key={j.id} value={j.id}>
                <span className="flex items-center gap-2">
                  <span>{j.flag}</span>
                  {j.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="h-6 w-px bg-border" />

        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search legislation across all jurisdictions..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10 border-none bg-transparent focus-visible:ring-0"
          />
        </div>

        {query && (
          <Button variant="ghost" size="icon" onClick={() => setQuery("")}>
            <X className="h-4 w-4" />
          </Button>
        )}

        <Button onClick={handleSearch}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && query.length >= 2 && (
        <Card className="absolute top-full mt-2 left-0 right-0 z-50 max-h-96 overflow-auto bg-background border border-border shadow-lg">
          {hasResults ? (
            <div className="p-2 space-y-4">
              {Object.entries(suggestions).map(([jurisdiction, results]) => (
                results.length > 0 && (
                  <div key={jurisdiction}>
                    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {jurisdiction}
                    </div>
                    <div className="space-y-1">
                      {results.map(result => (
                        <div
                          key={result.id}
                          className="px-3 py-2 rounded-md hover:bg-muted cursor-pointer flex items-center justify-between gap-2"
                          onClick={() => {
                            if (onSelectResult) onSelectResult(result);
                            setShowSuggestions(false);
                            setQuery(result.title);
                          }}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span>{result.flag}</span>
                              <span className="truncate font-medium">{result.title}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{result.documentType}</span>
                              {result.subJurisdiction && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {result.subJurisdiction}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <Badge className={getRiskBadgeClass(result.riskLevel)}>
                            {result.riskLevel}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No results found for "{query}"
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
