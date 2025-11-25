import { CongressBill, BillAnalysis } from "@/types/congress";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, Users, Bell, Star, RefreshCw, TrendingUp, Activity, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useStarredBills } from "@/hooks/useStarredBills";
import { useToast } from "@/hooks/use-toast";

interface CongressBillCardProps {
  bill: CongressBill;
  onViewDetails: () => void;
  onRefresh?: (billId: string) => void;
  keywordHits?: { keyword: string; count: number; snippets: string[] }[];
}

export function CongressBillCard({ bill, onViewDetails, onRefresh, keywordHits }: CongressBillCardProps) {
  const [hasEmailUpdate, setHasEmailUpdate] = useState(false);
  const [analysis, setAnalysis] = useState<BillAnalysis | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { isStarred, toggleStar } = useStarredBills();
  const { toast } = useToast();
  
  const billId = `${bill.congress}-${bill.type}-${bill.number}`;
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

  const getBillStatus = () => {
    const stages = ["Introduced", "Passed House", "Passed Senate", "To President", "Became Law"];
    let currentStageIndex = 0;

    if (bill.latestAction) {
      const text = bill.latestAction.text.toLowerCase();
      
      if (text.includes("became public law") || text.includes("signed by president")) {
        currentStageIndex = 4;
      } else if (text.includes("presented to president") || text.includes("sent to president")) {
        currentStageIndex = 3;
      } else if (text.includes("passed") && text.includes("senate")) {
        currentStageIndex = 2;
      } else if (text.includes("passed") && (text.includes("house") || text.includes("h.r."))) {
        currentStageIndex = 1;
      }
    }

    return {
      currentStage: stages[currentStageIndex],
      stages: stages
    };
  };

  const billStatus = getBillStatus();

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
            {bill.introducedDate && (
              <Badge variant="outline" className="gap-1">
                <Calendar className="h-3 w-3" />
                Introducido: {formatDate(bill.introducedDate)}
              </Badge>
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
        
        {/* Keyword Hits */}
        {keywordHits && keywordHits.length > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border border-yellow-200 dark:border-yellow-800 mt-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-foreground">
                {keywordHits.reduce((sum, hit) => sum + hit.count, 0)} coincidencias encontradas
              </span>
            </div>
            <div className="space-y-2">
              {keywordHits.map((hit, idx) => (
                <div key={idx} className="text-xs">
                  <span className="font-medium text-foreground">"{hit.keyword}"</span>
                  <span className="text-muted-foreground"> ({hit.count} veces)</span>
                  {hit.snippets.slice(0, 2).map((snippet, i) => (
                    <p key={i} className="text-muted-foreground italic mt-1 line-clamp-1">
                      ...{snippet}...
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Timeline */}
        <div className="bg-muted/30 p-3 rounded-md border border-border/50 mt-2">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Status</span>
          </div>
          <div className="flex items-center gap-1">
            {billStatus.stages.map((stage, index) => (
              <>
                {index > 0 && (
                  <ChevronRight key={`arrow-${index}`} className="h-4 w-4 text-muted-foreground flex-shrink-0 mx-1" />
                )}
                <div key={stage} className="flex flex-col items-center flex-1">
                  <div className={`w-full h-2 rounded-full transition-colors ${
                    billStatus.currentStage === stage ? "bg-primary" : "bg-muted"
                  }`} />
                  <span className={`text-xs mt-2 font-medium text-center ${
                    billStatus.currentStage === stage ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {stage}
                  </span>
                </div>
              </>
            ))}
          </div>
        </div>

        {/* AI Analysis Snippet */}
        {analysis && (
          <div className="text-sm bg-muted/50 p-3 rounded-md border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">Análisis IA:</span>
            </div>
            <p className="text-muted-foreground line-clamp-2">{analysis.explanation}</p>
          </div>
        )}

        {/* Dates */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          {bill.introducedDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>Intro: {formatDate(bill.introducedDate)}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>Última Acción: {formatDate(bill.latestAction.actionDate)}</span>
          </div>
          {bill.updateDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>Actualizado LawMeter: {formatDate(bill.updateDate)}</span>
            </div>
          )}
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
