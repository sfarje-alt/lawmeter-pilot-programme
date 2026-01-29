import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus, Sparkles, Loader2 } from "lucide-react";
import { ClientProfile, INSTRUMENT_TYPES, PERU_COMMISSIONS } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Step2Props {
  data: ClientProfile;
  onChange: (data: Partial<ClientProfile>) => void;
}

export function Step2Monitoring({ data, onChange }: Step2Props) {
  const [newKeyword, setNewKeyword] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);

  // Debounced keyword suggestions
  const fetchSuggestions = useCallback(async (input?: string) => {
    setIsLoadingSuggestions(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('suggest-keywords', {
        body: { 
          currentKeywords: data.keywords,
          sector: data.primarySector,
          description: data.shortDescription,
          partialInput: input 
        }
      });

      if (!error && result?.suggestions) {
        setSuggestions(result.suggestions);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, [data.keywords, data.primarySector, data.shortDescription]);

  // Load initial suggestions
  useEffect(() => {
    if (!hasLoadedInitial && (data.primarySector || data.shortDescription)) {
      setHasLoadedInitial(true);
      fetchSuggestions();
    }
  }, [data.primarySector, data.shortDescription, hasLoadedInitial, fetchSuggestions]);

  // Debounce input for suggestions
  useEffect(() => {
    if (newKeyword.length >= 2) {
      const timer = setTimeout(() => fetchSuggestions(newKeyword), 500);
      return () => clearTimeout(timer);
    }
  }, [newKeyword, fetchSuggestions]);

  const instrumentTypes = data.instrumentTypes || [];
  const watchedCommissions = data.watchedCommissions || [];
  const keywords = data.keywords || [];

  const toggleInstrumentType = (type: string) => {
    if (instrumentTypes.includes(type)) {
      onChange({ instrumentTypes: instrumentTypes.filter(t => t !== type) });
    } else {
      onChange({ instrumentTypes: [...instrumentTypes, type] });
    }
  };

  const toggleCommission = (commission: string) => {
    if (watchedCommissions.includes(commission)) {
      onChange({ watchedCommissions: watchedCommissions.filter(c => c !== commission) });
    } else {
      onChange({ watchedCommissions: [...watchedCommissions, commission] });
    }
  };

  const addKeyword = (keyword?: string) => {
    const kw = keyword || newKeyword.trim();
    if (kw && !keywords.includes(kw)) {
      onChange({ keywords: [...keywords, kw] });
      setNewKeyword("");
      // Remove from suggestions
      setSuggestions(prev => prev.filter(s => s !== kw));
    }
  };

  const removeKeyword = (keyword: string) => {
    onChange({ keywords: keywords.filter(k => k !== keyword) });
  };

  const selectAllInstruments = () => {
    onChange({ instrumentTypes: [...INSTRUMENT_TYPES] });
  };

  const clearAllInstruments = () => {
    onChange({ instrumentTypes: [] });
  };

  const selectAllCommissions = () => {
    onChange({ watchedCommissions: [...PERU_COMMISSIONS] });
  };

  const clearAllCommissions = () => {
    onChange({ watchedCommissions: [] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Monitoring Scope</h2>
        <p className="text-sm text-muted-foreground">
          Define keywords, instrument types, and commissions to monitor
        </p>
      </div>

      {/* Keywords */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Keywords</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fetchSuggestions()}
            disabled={isLoadingSuggestions}
            className="text-xs"
          >
            {isLoadingSuggestions ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
            ) : (
              <Sparkles className="h-3 w-3 mr-1" />
            )}
            Get AI Suggestions
          </Button>
        </div>

        {/* Current Keywords */}
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-background/30 border border-border/30">
            {keywords.map((keyword) => (
              <Badge key={keyword} variant="secondary" className="gap-1">
                {keyword}
                <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removeKeyword(keyword)} />
              </Badge>
            ))}
          </div>
        )}

        {/* AI Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> AI Suggestions (click to add)
            </Label>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <Badge
                  key={suggestion}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/20 border-primary/30"
                  onClick={() => addKeyword(suggestion)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Add keyword input */}
        <div className="flex gap-2">
          <Input
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="Type a keyword..."
            className="bg-background/50"
            onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
          />
          <Button type="button" variant="outline" onClick={() => addKeyword()} disabled={!newKeyword.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Instrument Types */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Instrument Types</Label>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={selectAllInstruments} className="text-xs">
              Select All
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={clearAllInstruments} className="text-xs">
              Clear
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-background/30 border border-border/30">
          {INSTRUMENT_TYPES.map((type) => (
            <Badge
              key={type}
              variant={instrumentTypes.includes(type) ? "default" : "outline"}
              className="cursor-pointer text-xs"
              onClick={() => toggleInstrumentType(type)}
            >
              {type}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {instrumentTypes.length} of {INSTRUMENT_TYPES.length} selected
        </p>
      </div>

      {/* Congressional Commissions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Label>Congressional Commissions</Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select commissions to monitor for session alerts
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={selectAllCommissions} className="text-xs">
              Select All
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={clearAllCommissions} className="text-xs">
              Clear
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-background/30 border border-border/30 max-h-48 overflow-y-auto">
          {PERU_COMMISSIONS.map((commission) => (
            <Badge
              key={commission}
              variant={watchedCommissions.includes(commission) ? "default" : "outline"}
              className="cursor-pointer text-xs"
              onClick={() => toggleCommission(commission)}
            >
              {commission}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {watchedCommissions.length} of {PERU_COMMISSIONS.length} commissions selected
        </p>
      </div>
    </div>
  );
}
