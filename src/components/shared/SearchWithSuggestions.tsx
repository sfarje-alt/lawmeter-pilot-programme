import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Alert, BillItem } from "@/types/legislation";

interface SearchWithSuggestionsProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  data: Alert[] | BillItem[];
  onSelectItem?: (item: Alert | BillItem) => void;
  type: "acts" | "bills";
}

interface GroupedSuggestions {
  [portfolio: string]: Array<Alert | BillItem>;
}

export function SearchWithSuggestions({
  value,
  onChange,
  placeholder = "Search...",
  data,
  onSelectItem,
  type,
}: SearchWithSuggestionsProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter and group suggestions
  const groupedSuggestions: GroupedSuggestions = {};
  
  if (value.trim().length >= 2) {
    const searchLower = value.toLowerCase();
    
    const filtered = data.filter((item) => {
      if (type === "acts") {
        const act = item as Alert;
        return (
          act.title?.toLowerCase().includes(searchLower) ||
          act.csv_portfolio?.toLowerCase().includes(searchLower) ||
          act.doc_view?.toLowerCase().includes(searchLower) ||
          act.csv_collection?.toLowerCase().includes(searchLower)
        );
      } else {
        const bill = item as BillItem;
        return (
          bill.title?.toLowerCase().includes(searchLower) ||
          bill.portfolio?.toLowerCase().includes(searchLower) ||
          bill.summary?.toLowerCase().includes(searchLower)
        );
      }
    }).slice(0, 20); // Limit to 20 results

    // Group by portfolio
    filtered.forEach((item) => {
      const portfolio = type === "acts" 
        ? (item as Alert).csv_portfolio || "Other"
        : (item as BillItem).portfolio || "Other";
      
      if (!groupedSuggestions[portfolio]) {
        groupedSuggestions[portfolio] = [];
      }
      groupedSuggestions[portfolio].push(item);
    });
  }

  const hasResults = Object.keys(groupedSuggestions).length > 0;

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: Alert | BillItem) => {
    if (type === "acts") {
      onChange((item as Alert).title || "");
    } else {
      onChange((item as BillItem).title || "");
    }
    setShowSuggestions(false);
    if (onSelectItem) {
      onSelectItem(item);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setShowSuggestions(true);
    setFocusedIndex(-1);
  };

  const getItemTitle = (item: Alert | BillItem): string => {
    return type === "acts" ? (item as Alert).title || "" : (item as BillItem).title || "";
  };

  const getItemType = (item: Alert | BillItem): string => {
    return type === "acts" 
      ? (item as Alert).doc_view || (item as Alert).csv_collection || "Act"
      : (item as BillItem).status || "Bill";
  };

  return (
    <div className="relative flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={() => value.length >= 2 && setShowSuggestions(true)}
          className="pl-9"
        />
      </div>

      {showSuggestions && hasResults && (
        <Card
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 max-h-[500px] overflow-y-auto shadow-lg z-50 bg-background border"
        >
          <div className="p-2">
            {Object.entries(groupedSuggestions)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([portfolio, items]) => (
                <div key={portfolio} className="mb-4 last:mb-0">
                  <div className="px-3 py-2 text-sm font-semibold text-muted-foreground border-b mb-2">
                    {portfolio}
                  </div>
                  <div className="space-y-1">
                    {items.map((item, idx) => {
                      const itemId = type === "acts" 
                        ? `${(item as Alert).title_id || ''}-${idx}` 
                        : (item as BillItem).id;
                      return (
                        <button
                          key={itemId}
                          onClick={() => handleSelect(item)}
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate group-hover:text-primary">
                                {getItemTitle(item)}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {getItemType(item)}
                              </p>
                            </div>
                            {type === "acts" && (item as Alert).AI_triage?.risk_level && (
                              <Badge
                                variant="outline"
                                className={
                                  (item as Alert).AI_triage?.risk_level === "high"
                                    ? "bg-risk-high/10 text-risk-high border-risk-high/20"
                                    : (item as Alert).AI_triage?.risk_level === "medium"
                                    ? "bg-risk-medium/10 text-risk-medium border-risk-medium/20"
                                    : "bg-risk-low/10 text-risk-low border-risk-low/20"
                                }
                              >
                                {(item as Alert).AI_triage?.risk_level}
                              </Badge>
                            )}
                            {type === "bills" && (item as BillItem).risk_level && (
                              <Badge
                                variant="outline"
                                className={
                                  (item as BillItem).risk_level === "high"
                                    ? "bg-risk-high/10 text-risk-high border-risk-high/20"
                                    : (item as BillItem).risk_level === "medium"
                                    ? "bg-risk-medium/10 text-risk-medium border-risk-medium/20"
                                    : "bg-risk-low/10 text-risk-low border-risk-low/20"
                                }
                              >
                                {(item as BillItem).risk_level}
                              </Badge>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            <div className="px-3 py-2 text-xs text-muted-foreground border-t mt-2">
              Showing {Object.values(groupedSuggestions).flat().length} result(s)
            </div>
          </div>
        </Card>
      )}

      {showSuggestions && !hasResults && value.length >= 2 && (
        <Card
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 p-4 shadow-lg z-50 bg-background border"
        >
          <p className="text-sm text-muted-foreground text-center">
            No results found for "{value}"
          </p>
        </Card>
      )}
    </div>
  );
}
