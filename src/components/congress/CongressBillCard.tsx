import { CongressBill, BillAnalysis } from "@/types/congress";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Calendar, Users, Bell, Star, RefreshCw, Plus, X, TrendingUp, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useStarredBills } from "@/hooks/useStarredBills";
import { useBillKeywords } from "@/hooks/useBillKeywords";
import { useToast } from "@/hooks/use-toast";

interface CongressBillCardProps {
  bill: CongressBill;
  onViewDetails: () => void;
  onRefresh?: (billId: string) => void;
}

export function CongressBillCard({ bill, onViewDetails, onRefresh }: CongressBillCardProps) {
  const [hasEmailUpdate, setHasEmailUpdate] = useState(false);
  const [analysis, setAnalysis] = useState<BillAnalysis | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const [showKeywordInput, setShowKeywordInput] = useState(false);
  
  const { isStarred, toggleStar } = useStarredBills();
  const { addKeyword, removeKeyword, getKeywords } = useBillKeywords();
  const { toast } = useToast();
  
  const billId = `${bill.congress}-${bill.type}-${bill.number}`;
  const keywords = getKeywords(billId);
  const starred = isStarred(billId);

  useEffect(() => {
    // Check if this bill has email updates and load analysis
    const loadBillData = async () => {
      const { data } = await supabase
        .from('congress_bill_statuses')
        .select('has_email_update')
        .eq('congress', bill.congress)
        .eq('bill_type', bill.type)
        .eq('bill_number', bill.number)
        .maybeSingle();

      if (data?.has_email_update) {
        setHasEmailUpdate(true);
      }

      // Try to load cached analysis
      const cachedAnalysis = localStorage.getItem(`bill_analysis_${billId}`);
      if (cachedAnalysis) {
        setAnalysis(JSON.parse(cachedAnalysis));
      }
    };

    loadBillData();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('bill-email-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'congress_bill_statuses',
          filter: `congress=eq.${bill.congress},bill_type=eq.${bill.type},bill_number=eq.${bill.number}`
        },
        (payload: any) => {
          if (payload.new.has_email_update) {
            setHasEmailUpdate(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bill.congress, bill.type, bill.number, billId]);

  const getBillTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      hr: "H.R.",
      s: "S.",
      hjres: "H.J.Res.",
      sjres: "S.J.Res.",
      hconres: "H.Con.Res.",
      sconres: "S.Con.Res.",
      hres: "H.Res.",
      sres: "S.Res.",
    };
    return types[type.toLowerCase()] || type.toUpperCase();
  };

  const getChamberColor = (chamber: string) => {
    return chamber === "House" 
      ? "bg-blue-500/10 text-blue-700 dark:text-blue-400" 
      : "bg-purple-500/10 text-purple-700 dark:text-purple-400";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getRiskColor = (category: string) => {
    const colors: Record<string, string> = {
      Critical: "bg-red-500 text-white",
      Urgent: "bg-orange-600 text-white",
      High: "bg-orange-500 text-white",
      Medium: "bg-yellow-500 text-white",
      Low: "bg-blue-500 text-white",
      Minimal: "bg-green-500 text-white"
    };
    return colors[category] || "bg-gray-500 text-white";
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh(billId);
      }
      toast({ title: "Bill actualizado", description: "La información ha sido actualizada." });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo actualizar la bill.", variant: "destructive" });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      addKeyword(billId, newKeyword);
      setNewKeyword("");
      setShowKeywordInput(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap flex-1">
            {hasEmailUpdate && (
              <Badge className="bg-orange-500 text-white animate-pulse">
                <Bell className="h-3 w-3 mr-1" />
                New Update
              </Badge>
            )}
            <Badge variant="outline" className="font-mono">
              {getBillTypeLabel(bill.type)} {bill.number}
            </Badge>
            <Badge className={getChamberColor(bill.originChamber)}>
              {bill.originChamber}
            </Badge>
            {bill.policyArea && (
              <Badge variant="secondary">{bill.policyArea.name}</Badge>
            )}
            {analysis && (
              <Badge className={getRiskColor(analysis.riskCategory)}>
                <TrendingUp className="h-3 w-3 mr-1" />
                {analysis.riskCategory} ({analysis.riskScore})
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleStar(billId)}
              className="h-8 w-8 p-0"
            >
              <Star className={`h-4 w-4 ${starred ? 'fill-yellow-500 text-yellow-500' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold mt-2 line-clamp-2">{bill.title}</h3>
        
        {/* Keywords */}
        <div className="flex items-center gap-2 flex-wrap mt-2">
          {keywords.map((keyword) => (
            <Badge key={keyword} variant="outline" className="gap-1">
              {keyword}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => removeKeyword(billId, keyword)}
              />
            </Badge>
          ))}
          {showKeywordInput ? (
            <div className="flex items-center gap-1">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                placeholder="keyword"
                className="h-6 w-24 text-xs"
              />
              <Button size="sm" onClick={handleAddKeyword} className="h-6 px-2">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowKeywordInput(true)}
              className="h-6 px-2 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Keyword
            </Button>
          )}
        </div>

        {/* AI Analysis Snippet */}
        {analysis && (
          <div className="text-sm bg-muted/50 p-3 rounded-md border border-border/50 mt-2">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">Análisis IA:</span>
            </div>
            <p className="text-muted-foreground line-clamp-2">{analysis.explanation}</p>
          </div>
        )}

        {/* Dates */}
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
          {bill.introducedDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>Intro: {formatDate(bill.introducedDate)}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Activity className="h-4 w-4" />
            <span>Última: {formatDate(bill.latestAction.actionDate)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <RefreshCw className="h-4 w-4" />
            <span>Update: {formatDate(bill.updateDate)}</span>
          </div>
        </div>

        {/* Sponsor */}
        {bill.sponsors && bill.sponsors.length > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {bill.sponsors[0].fullName} ({bill.sponsors[0].party}-{bill.sponsors[0].state})
            </span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Última Acción:</p>
          <p className="line-clamp-2">{bill.latestAction.text}</p>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button variant="outline" size="sm" asChild>
            <a 
              href={`https://www.congress.gov/bill/${bill.congress}th-congress/${bill.type.toLowerCase() === 'hr' ? 'house' : 'senate'}-bill/${bill.number}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Ver en Congress.gov
            </a>
          </Button>
          <Button variant="default" size="sm" onClick={onViewDetails}>
            Ver Detalles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
