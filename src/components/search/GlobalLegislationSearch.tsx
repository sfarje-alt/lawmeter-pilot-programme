import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, X, MapPin, Globe, Calendar, FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CountryFlag } from "@/components/shared/CountryFlag";
import { UnifiedLegislationItem } from "@/types/unifiedLegislation";

// Jurisdiction options with countryKey for flag lookup
const jurisdictions = [
  { id: "all", label: "All Jurisdictions", countryKey: "" },
  { id: "usa", label: "USA", countryKey: "USA" },
  { id: "canada", label: "Canada", countryKey: "CA" },
  { id: "costa-rica", label: "Costa Rica", countryKey: "CR" },
  { id: "peru", label: "Perú", countryKey: "PE" },
  { id: "eu", label: "European Union", countryKey: "EU" },
  { id: "uae", label: "UAE", countryKey: "UAE" },
  { id: "saudi", label: "Saudi Arabia", countryKey: "KSA" },
  { id: "oman", label: "Oman", countryKey: "OM" },
  { id: "kuwait", label: "Kuwait", countryKey: "KW" },
  { id: "bahrain", label: "Bahrain", countryKey: "BH" },
  { id: "qatar", label: "Qatar", countryKey: "QA" },
  { id: "japan", label: "Japan", countryKey: "JP" },
  { id: "korea", label: "Korea", countryKey: "KR" },
  { id: "taiwan", label: "Taiwan", countryKey: "TW" },
];

interface SearchResult {
  id: string;
  title: string;
  jurisdiction: string;
  countryKey: string;
  subJurisdiction?: string;
  riskLevel: "low" | "medium" | "high";
  documentType: string;
  effectiveDate?: string;
  deadline?: string;
  originalItem?: UnifiedLegislationItem;
}

interface GlobalLegislationSearchProps {
  onSearch?: (query: string, jurisdiction: string) => void;
  onSelectResult?: (result: SearchResult) => void;
  allData?: UnifiedLegislationItem[];
}

// Fuzzy search helper - returns relevance score (higher = better match)
function fuzzyMatch(text: string, query: string): number {
  if (!text || !query) return 0;
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  
  // Exact match
  if (lowerText === lowerQuery) return 100;
  
  // Contains exact query
  if (lowerText.includes(lowerQuery)) return 80;
  
  // Word starts with query
  const words = lowerText.split(/\s+/);
  if (words.some(word => word.startsWith(lowerQuery))) return 70;
  
  // All query words found somewhere
  const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 1);
  const foundWords = queryWords.filter(qw => lowerText.includes(qw));
  if (foundWords.length === queryWords.length) return 60;
  if (foundWords.length > 0) return 40 * (foundWords.length / queryWords.length);
  
  return 0;
}

// Convert UnifiedLegislationItem to SearchResult
function toSearchResult(item: UnifiedLegislationItem): SearchResult {
  return {
    id: item.id,
    title: item.title,
    jurisdiction: item.jurisdictionCode,
    countryKey: item.jurisdictionCode,
    subJurisdiction: item.subnationalUnit,
    riskLevel: (item.riskLevel?.toLowerCase() || "medium") as "low" | "medium" | "high",
    documentType: item.instrumentType || "Legislation",
    effectiveDate: item.effectiveDate,
    deadline: item.complianceDeadline,
    originalItem: item,
  };
}

export function GlobalLegislationSearch({ onSearch, onSelectResult, allData = [] }: GlobalLegislationSearchProps) {
  const [query, setQuery] = useState("");
  const [selectedJurisdiction, setSelectedJurisdiction] = useState("all");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Search and group results by jurisdiction
  const groupedResults = useMemo(() => {
    if (query.length < 2) return {};
    
    const results: Record<string, SearchResult[]> = {};
    const maxPerJurisdiction = 5;
    const maxTotal = 20;
    let totalCount = 0;

    // Get jurisdiction filter
    const jurisdictionInfo = jurisdictions.find(j => j.id === selectedJurisdiction);
    const filterCountryKey = selectedJurisdiction !== "all" ? jurisdictionInfo?.countryKey : null;

    // Score and filter items
    const scoredItems: Array<{ item: UnifiedLegislationItem; score: number }> = [];
    
    for (const item of allData) {
      // Filter by jurisdiction if selected
      if (filterCountryKey && item.jurisdictionCode !== filterCountryKey) continue;
      
      // Calculate relevance score across multiple fields
      let score = 0;
      score += fuzzyMatch(item.title, query) * 2; // Title has highest weight
      score += fuzzyMatch(item.identifier || "", query) * 1.5;
      score += fuzzyMatch(item.summary || "", query);
      score += fuzzyMatch(item.policyArea || "", query) * 0.8;
      score += fuzzyMatch(item.regulatoryCategory || "", query) * 0.8;
      score += fuzzyMatch(item.instrumentType || "", query) * 0.5;
      
      if (score > 0) {
        scoredItems.push({ item, score });
      }
    }

    // Sort by score descending
    scoredItems.sort((a, b) => b.score - a.score);

    // Group by jurisdiction
    for (const { item } of scoredItems) {
      if (totalCount >= maxTotal) break;
      
      const jurisdictionKey = item.jurisdictionCode;
      if (!results[jurisdictionKey]) {
        results[jurisdictionKey] = [];
      }
      
      if (results[jurisdictionKey].length < maxPerJurisdiction) {
        results[jurisdictionKey].push(toSearchResult(item));
        totalCount++;
      }
    }

    return results;
  }, [query, selectedJurisdiction, allData]);

  // Flatten results for keyboard navigation
  const flatResults = useMemo(() => {
    return Object.values(groupedResults).flat();
  }, [groupedResults]);

  const handleSearch = useCallback(() => {
    if (onSearch) {
      onSearch(query, selectedJurisdiction);
    }
    setShowSuggestions(false);
  }, [onSearch, query, selectedJurisdiction]);

  const handleSelectResult = useCallback((result: SearchResult) => {
    if (onSelectResult) onSelectResult(result);
    setShowSuggestions(false);
    setQuery("");
  }, [onSelectResult]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showSuggestions || flatResults.length === 0) {
      if (e.key === "Enter") handleSearch();
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < flatResults.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : flatResults.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < flatResults.length) {
          handleSelectResult(flatResults[focusedIndex]);
        } else {
          handleSearch();
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setFocusedIndex(-1);
        break;
    }
  }, [showSuggestions, flatResults, focusedIndex, handleSelectResult, handleSearch]);

  // Reset focused index when results change
  useEffect(() => {
    setFocusedIndex(-1);
  }, [groupedResults]);

  const getRiskBadgeClass = (level: string) => {
    switch (level) {
      case "high": return "bg-risk-high text-risk-high-foreground";
      case "medium": return "bg-risk-medium text-risk-medium-foreground";
      case "low": return "bg-risk-low text-risk-low-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const hasResults = Object.values(groupedResults).some(arr => arr.length > 0);
  const selectedJurisdictionInfo = jurisdictions.find(j => j.id === selectedJurisdiction);

  // Get flat index for a result
  const getFlatIndex = (jurisdictionKey: string, resultIndex: number): number => {
    let index = 0;
    for (const [key, results] of Object.entries(groupedResults)) {
      if (key === jurisdictionKey) {
        return index + resultIndex;
      }
      index += results.length;
    }
    return -1;
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-lg border border-border p-2">
        {/* Jurisdiction Selector - Fixed: removed duplicate icon */}
        <Select value={selectedJurisdiction} onValueChange={setSelectedJurisdiction}>
          <SelectTrigger className="w-[200px] border-none bg-transparent">
            <SelectValue placeholder="All Jurisdictions">
              <span className="flex items-center gap-2">
                {selectedJurisdictionInfo?.countryKey ? (
                  <CountryFlag 
                    countryKey={selectedJurisdictionInfo.countryKey} 
                    variant="flag" 
                    size="sm" 
                    showTooltip={false} 
                  />
                ) : (
                  <Globe className="w-4 h-4" />
                )}
                {selectedJurisdictionInfo?.label || "All Jurisdictions"}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-background border border-border">
            {jurisdictions.map(j => (
              <SelectItem key={j.id} value={j.id}>
                <span className="flex items-center gap-2">
                  {j.countryKey ? (
                    <CountryFlag countryKey={j.countryKey} variant="flag" size="sm" showTooltip={false} />
                  ) : (
                    <Globe className="w-4 h-4" />
                  )}
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
            ref={inputRef}
            placeholder="Search legislation by title, ID, category, or keyword..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
              setFocusedIndex(-1);
            }}
            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            className="pl-10 border-none bg-transparent focus-visible:ring-0"
          />
        </div>

        {query && (
          <Button variant="ghost" size="icon" onClick={() => { setQuery(""); setShowSuggestions(false); }}>
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
        <Card className="absolute top-full mt-2 left-0 right-0 z-50 max-h-[420px] overflow-auto bg-background border border-border shadow-lg">
          {hasResults ? (
            <div className="p-2 space-y-3">
              {Object.entries(groupedResults).map(([jurisdictionKey, results]) => (
                results.length > 0 && (
                  <div key={jurisdictionKey}>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border/50 mb-1">
                      <CountryFlag countryKey={jurisdictionKey} variant="flag" size="sm" showTooltip={false} />
                      <span>{jurisdictionKey}</span>
                      <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0">
                        {results.length}
                      </Badge>
                    </div>
                    <div className="space-y-0.5">
                      {results.map((result, idx) => {
                        const flatIdx = getFlatIndex(jurisdictionKey, idx);
                        const isFocused = flatIdx === focusedIndex;
                        
                        return (
                          <div
                            key={result.id}
                            className={`px-3 py-2 rounded-md cursor-pointer flex items-center justify-between gap-2 transition-colors ${
                              isFocused ? "bg-accent" : "hover:bg-muted"
                            }`}
                            onClick={() => handleSelectResult(result)}
                            onMouseEnter={() => setFocusedIndex(flatIdx)}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="truncate font-medium text-sm">{result.title}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                <span className="flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  {result.documentType}
                                </span>
                                {result.subJurisdiction && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {result.subJurisdiction}
                                    </span>
                                  </>
                                )}
                                {(result.effectiveDate || result.deadline) && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {result.deadline || result.effectiveDate}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <Badge className={`${getRiskBadgeClass(result.riskLevel)} text-[10px]`}>
                              {result.riskLevel}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              ))}
              
              {/* Keyboard hint */}
              <div className="px-2 pt-2 border-t border-border/50 text-[10px] text-muted-foreground flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>Esc Close</span>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No results found for "{query}"
              {selectedJurisdiction !== "all" && (
                <span className="block text-xs mt-1">Try searching in "All Jurisdictions"</span>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
