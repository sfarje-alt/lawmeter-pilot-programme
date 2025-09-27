import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface FilterPanelProps {
  filters: {
    timeframe: string;
    portfolios: string[];
    riskLevel: string;
    party: string;
    type: string;
  };
  onFiltersChange: (filters: any) => void;
}

export function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const timeframes = [
    { value: "1-week", label: "1 Week" },
    { value: "2-weeks", label: "2 Weeks" },
    { value: "3-weeks", label: "3 Weeks" },
    { value: "4-weeks", label: "4 Weeks" }
  ];

  const portfolios = [
    "Treasury",
    "Environment and Energy",
    "Employment and Workplace Relations",
    "Health and Aged Care",
    "Defence",
    "Immigration and Citizenship",
    "Education",
    "Infrastructure and Transport"
  ];

  const riskLevels = [
    { value: "all", label: "All Risk Levels" },
    { value: "high", label: "High Risk" },
    { value: "medium", label: "Medium Risk" },
    { value: "low", label: "Low Risk" }
  ];

  const parties = [
    { value: "all", label: "All Parties" },
    { value: "labor", label: "Labor Party" },
    { value: "liberal", label: "Liberal Party" },
    { value: "greens", label: "Greens" },
    { value: "crossbench", label: "Crossbench" }
  ];

  const legislationTypes = [
    { value: "all", label: "All Types" },
    { value: "bill", label: "Bills" },
    { value: "act", label: "Acts" },
    { value: "regulation", label: "Regulations" },
    { value: "instrument", label: "Legislative Instruments" }
  ];

  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const togglePortfolio = (portfolio: string) => {
    const current = filters.portfolios || [];
    const updated = current.includes(portfolio)
      ? current.filter(p => p !== portfolio)
      : [...current, portfolio];
    updateFilter('portfolios', updated);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      timeframe: "1-week",
      portfolios: [],
      riskLevel: "all",
      party: "all",
      type: "all"
    });
  };

  const activeFilterCount = [
    filters.timeframe !== "1-week",
    filters.portfolios.length > 0,
    filters.riskLevel !== "all",
    filters.party !== "all",
    filters.type !== "all"
  ].filter(Boolean).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {activeFilterCount > 0 && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{activeFilterCount} active</Badge>
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timeframe */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Timeframe</label>
          <Select value={filters.timeframe} onValueChange={(value) => updateFilter('timeframe', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeframes.map((tf) => (
                <SelectItem key={tf.value} value={tf.value}>{tf.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Portfolios */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Portfolio</label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {portfolios.map((portfolio) => (
              <div key={portfolio} className="flex items-center space-x-2">
                <Checkbox
                  id={portfolio}
                  checked={filters.portfolios.includes(portfolio)}
                  onCheckedChange={() => togglePortfolio(portfolio)}
                />
                <label
                  htmlFor={portfolio}
                  className="text-sm text-foreground cursor-pointer"
                >
                  {portfolio}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Level */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Risk Score</label>
          <Select value={filters.riskLevel} onValueChange={(value) => updateFilter('riskLevel', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {riskLevels.map((risk) => (
                <SelectItem key={risk.value} value={risk.value}>{risk.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Political Party */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Political Party</label>
          <Select value={filters.party} onValueChange={(value) => updateFilter('party', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {parties.map((party) => (
                <SelectItem key={party.value} value={party.value}>{party.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Legislation Type */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Type of Legislation</label>
          <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {legislationTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}