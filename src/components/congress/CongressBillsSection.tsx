import { useState } from "react";
import { useCongressBills, SortOption, fetchBillTextVersions } from "@/hooks/useCongressBills";
import { CongressBillCard } from "./CongressBillCard";
import { CongressBillDrawer } from "./CongressBillDrawer";
import { EmailSetupDialog } from "./EmailSetupDialog";
import { CongressBill } from "@/types/congress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, ArrowUpDown, Database, Mail, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useBatchStatusLoader } from "@/hooks/useBatchStatusLoader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CongressBillsSection() {
  const [sortBy, setSortBy] = useState<SortOption>("latestAction-desc");
  const { bills, loading, error } = useCongressBills(sortBy);
  const [selectedBill, setSelectedBill] = useState<CongressBill | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChamber, setSelectedChamber] = useState<string | null>(null);
  const [emailSetupOpen, setEmailSetupOpen] = useState(false);
  const [keywordSearch, setKeywordSearch] = useState("");
  const [activeKeywords, setActiveKeywords] = useState<string[]>([]);
  const [keywordSearching, setKeywordSearching] = useState(false);
  const [billKeywordHits, setBillKeywordHits] = useState<Record<string, { keyword: string; count: number; snippets: string[] }[]>>({});
  const { loadAllStatuses, loading: batchLoading, progress } = useBatchStatusLoader();
  const { toast } = useToast();

  const handleBatchLoad = async () => {
    const result = await loadAllStatuses();
    
    if (result.success) {
      toast({
        title: "Database updated",
        description: `${result.successCount} of ${result.total} bills updated successfully`,
      });
    } else {
      toast({
        title: "Error",
        description: "Could not complete the update",
        variant: "destructive",
      });
    }
  };

  const handleAddKeyword = async () => {
    if (!keywordSearch.trim()) return;
    
    const newKeyword = keywordSearch.trim();
    if (activeKeywords.includes(newKeyword)) {
      toast({
        title: "Keyword already exists",
        description: "This keyword is already in the search",
        variant: "destructive"
      });
      return;
    }

    setKeywordSearching(true);
    const newActiveKeywords = [...activeKeywords, newKeyword];
    setActiveKeywords(newActiveKeywords);
    setKeywordSearch("");

    try {
      // Search through all bills
      const hits: Record<string, { keyword: string; count: number; snippets: string[] }[]> = {};
      
      for (const bill of bills) {
        const billId = `${bill.congress}-${bill.type}-${bill.number}`;
        
        // Fetch bill text versions
        const versions = await fetchBillTextVersions(bill.congress, bill.type, bill.number);
        if (!versions || versions.length === 0) continue;

        const latestVersion = versions[0];
        const formattedText = latestVersion?.formats?.find((f: any) => f.type === "Formatted Text");
        
        if (!formattedText?.url) continue;

        // Fetch the full text
        const response = await fetch(formattedText.url);
        const html = await response.text();
        
        // Remove HTML tags for searching
        const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

        // Search for all active keywords
        const billHits: { keyword: string; count: number; snippets: string[] }[] = [];
        
        for (const keyword of newActiveKeywords) {
          const regex = new RegExp(keyword, 'gi');
          const matches = textContent.match(regex);
          
          if (matches && matches.length > 0) {
            // Extract snippets
            const snippets: string[] = [];
            let match;
            const snippetRegex = new RegExp(`.{0,50}${keyword}.{0,50}`, 'gi');
            
            while ((match = snippetRegex.exec(textContent)) !== null && snippets.length < 3) {
              snippets.push(match[0].trim());
            }
            
            billHits.push({
              keyword,
              count: matches.length,
              snippets
            });
          }
        }
        
        if (billHits.length > 0) {
          hits[billId] = billHits;
        }
      }
      
      setBillKeywordHits(hits);
      
      toast({
        title: "Search complete",
        description: `Found ${Object.keys(hits).length} bills with matches`
      });
    } catch (error) {
      console.error("Error searching keywords:", error);
      toast({
        title: "Error",
        description: "Could not complete keyword search",
        variant: "destructive"
      });
    } finally {
      setKeywordSearching(false);
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    const newKeywords = activeKeywords.filter(k => k !== keyword);
    setActiveKeywords(newKeywords);
    
    if (newKeywords.length === 0) {
      setBillKeywordHits({});
    } else {
      // Refilter hits
      const newHits: Record<string, { keyword: string; count: number; snippets: string[] }[]> = {};
      Object.entries(billKeywordHits).forEach(([billId, hits]) => {
        const filteredHits = hits.filter(h => newKeywords.includes(h.keyword));
        if (filteredHits.length > 0) {
          newHits[billId] = filteredHits;
        }
      });
      setBillKeywordHits(newHits);
    }
  };

  const filteredBills = bills.filter((bill) => {
    const matchesSearch = bill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${bill.type} ${bill.number}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChamber = !selectedChamber || bill.originChamber === selectedChamber;
    
    // If keywords are active, only show bills with hits
    const matchesKeywords = activeKeywords.length === 0 || 
      billKeywordHits[`${bill.congress}-${bill.type}-${bill.number}`];
    
    return matchesSearch && matchesChamber && matchesKeywords;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading Congress data: {error}
          <br />
          <span className="text-xs mt-2 block">
            Note: You need a Congress.gov API key. 
            <a 
              href="https://api.congress.gov/sign-up/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline ml-1"
            >
              Sign up here
            </a>
          </span>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">U.S. Congress Bills</h2>
          <p className="text-muted-foreground">
            119th Congress (2025-2027) • {bills.length} bills
          </p>
        </div>

        {/* Keyword Search */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex gap-2 flex-1">
              <Input
                placeholder="Add keyword to search in full text..."
                value={keywordSearch}
                onChange={(e) => setKeywordSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                className="max-w-md"
              />
              <Button
                onClick={handleAddKeyword}
                disabled={keywordSearching || !keywordSearch.trim()}
              >
                {keywordSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          {activeKeywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeKeywords.map((keyword) => (
                <Badge key={keyword} variant="secondary" className="gap-1">
                  {keyword}
                  <button
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search bills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="introducedDate-desc">Introduction Date - Newest</SelectItem>
                <SelectItem value="introducedDate-asc">Introduction Date - Oldest</SelectItem>
                <SelectItem value="latestAction-desc">Latest Action - Newest</SelectItem>
                <SelectItem value="latestAction-asc">Latest Action - Oldest</SelectItem>
                <SelectItem value="number-asc">Number - Ascending</SelectItem>
                <SelectItem value="number-desc">Number - Descending</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="lawNumber-asc">Law Number - Ascending</SelectItem>
                <SelectItem value="lawNumber-desc">Law Number - Descending</SelectItem>
                <SelectItem value="cosponsorCount-desc">Cosponsors - Most to Least</SelectItem>
                <SelectItem value="cosponsorCount-asc">Cosponsors - Least to Most</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedChamber === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedChamber(null)}
            >
              All
            </Button>
            <Button
              variant={selectedChamber === "House" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedChamber("House")}
            >
              House
            </Button>
            <Button
              variant={selectedChamber === "Senate" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedChamber("Senate")}
            >
              Senate
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleBatchLoad}
            disabled={batchLoading}
          >
            {batchLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {progress.current}/{progress.total}
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Update Database
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEmailSetupOpen(true)}
          >
            <Mail className="h-4 w-4 mr-2" />
            Email Notifications
          </Button>
        </div>
        
        {/* Progress Bar */}
        {batchLoading && progress.total > 0 && (
          <div className="space-y-2">
            <Progress value={(progress.current / progress.total) * 100} />
            <p className="text-xs text-muted-foreground">{progress.status}</p>
          </div>
        )}
      </div>

      {/* Bills List - Vertical Stack */}
      {filteredBills.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No bills found
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBills.map((bill) => {
            const billId = `${bill.congress}-${bill.type}-${bill.number}`;
            const keywordHits = billKeywordHits[billId];
            
            return (
              <CongressBillCard
                key={billId}
                bill={bill}
                onViewDetails={() => setSelectedBill(bill)}
                keywordHits={keywordHits}
              />
            );
          })}
        </div>
      )}

      {/* Bill Details Drawer */}
      {selectedBill && (
        <CongressBillDrawer
          bill={selectedBill}
          open={!!selectedBill}
          onOpenChange={(open) => !open && setSelectedBill(null)}
        />
      )}

      {/* Email Setup Dialog */}
      <EmailSetupDialog
        open={emailSetupOpen}
        onOpenChange={setEmailSetupOpen}
      />
    </div>
  );
}
