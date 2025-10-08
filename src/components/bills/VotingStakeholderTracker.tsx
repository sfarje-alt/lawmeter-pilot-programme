import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VotingRecord, MP } from "@/types/legislation";
import { ThumbsUp, ThumbsDown, Minus, Users, Building2, TrendingUp, TrendingDown } from "lucide-react";

interface VotingStakeholderTrackerProps {
  votingRecords?: VotingRecord[];
  mps?: MP[];
  stakeholders?: Array<{
    name: string;
    organization?: string;
    position: "support" | "oppose" | "neutral";
    statement?: string;
  }>;
}

export function VotingStakeholderTracker({ 
  votingRecords = [], 
  mps = [],
  stakeholders = []
}: VotingStakeholderTrackerProps) {
  
  const getPositionColor = (position: string) => {
    switch (position) {
      case "support":
      case "for":
        return "text-success border-success bg-success/10";
      case "oppose":
      case "against":
        return "text-destructive border-destructive bg-destructive/10";
      default:
        return "text-muted-foreground border-muted bg-muted/10";
    }
  };

  const getPositionIcon = (position: string) => {
    switch (position) {
      case "support":
      case "for":
        return <ThumbsUp className="w-4 h-4" />;
      case "oppose":
      case "against":
        return <ThumbsDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  // Calculate voting statistics
  const totalVotes = votingRecords.reduce((sum, record) => 
    sum + record.votesFor + record.votesAgainst + record.abstentions, 0
  );
  
  const totalFor = votingRecords.reduce((sum, record) => sum + record.votesFor, 0);
  const totalAgainst = votingRecords.reduce((sum, record) => sum + record.votesAgainst, 0);
  const totalAbstain = votingRecords.reduce((sum, record) => sum + record.abstentions, 0);

  const supportPercentage = totalVotes ? (totalFor / totalVotes) * 100 : 0;
  const opposePercentage = totalVotes ? (totalAgainst / totalVotes) * 100 : 0;

  // Group MPs by position
  const mpsByPosition = {
    support: mps.filter(mp => mp.votingPosition === "support"),
    oppose: mps.filter(mp => mp.votingPosition === "oppose"),
    abstain: mps.filter(mp => mp.votingPosition === "abstain"),
    unknown: mps.filter(mp => !mp.votingPosition || mp.votingPosition === "unknown"),
  };

  return (
    <Tabs defaultValue="voting" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="voting">Voting Records</TabsTrigger>
        <TabsTrigger value="mps">MP Positions</TabsTrigger>
        <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
      </TabsList>

      <TabsContent value="voting" className="space-y-4 mt-4">
        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-success" />
                Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{totalFor}</div>
              <Progress value={supportPercentage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {supportPercentage.toFixed(1)}% of total votes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <ThumbsDown className="w-4 h-4 text-destructive" />
                Opposition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{totalAgainst}</div>
              <Progress value={opposePercentage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {opposePercentage.toFixed(1)}% of total votes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Minus className="w-4 h-4" />
                Abstentions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAbstain}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalVotes ? ((totalAbstain / totalVotes) * 100).toFixed(1) : 0}% of total votes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Voting History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Voting History</CardTitle>
            <CardDescription>Chronological record of all votes</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {votingRecords.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No voting records available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {votingRecords.map((record, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{record.stage}</h4>
                          <p className="text-xs text-muted-foreground">
                            {new Date(record.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={record.passed ? "default" : "destructive"}>
                          {record.passed ? "Passed" : "Failed"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-success">
                          <div className="font-medium">{record.votesFor}</div>
                          <div className="text-xs">For</div>
                        </div>
                        <div className="text-destructive">
                          <div className="font-medium">{record.votesAgainst}</div>
                          <div className="text-xs">Against</div>
                        </div>
                        <div className="text-muted-foreground">
                          <div className="font-medium">{record.abstentions}</div>
                          <div className="text-xs">Abstain</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="mps" className="space-y-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-success" />
                Supporting MPs ({mpsByPosition.support.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {mpsByPosition.support.map((mp, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg border border-success/20 bg-success/5">
                      <div>
                        <div className="font-medium text-sm">{mp.name}</div>
                        <div className="text-xs text-muted-foreground">{mp.party || "Independent"}</div>
                      </div>
                      <ThumbsUp className="w-4 h-4 text-success" />
                    </div>
                  ))}
                  {mpsByPosition.support.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No supporting MPs</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Opposition */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-destructive" />
                Opposing MPs ({mpsByPosition.oppose.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {mpsByPosition.oppose.map((mp, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg border border-destructive/20 bg-destructive/5">
                      <div>
                        <div className="font-medium text-sm">{mp.name}</div>
                        <div className="text-xs text-muted-foreground">{mp.party || "Independent"}</div>
                      </div>
                      <ThumbsDown className="w-4 h-4 text-destructive" />
                    </div>
                  ))}
                  {mpsByPosition.oppose.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No opposing MPs</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="stakeholders" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Key Stakeholders
            </CardTitle>
            <CardDescription>Organizations and groups with stated positions</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {stakeholders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No stakeholder information available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stakeholders.map((stakeholder, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border-l-4 ${getPositionColor(stakeholder.position)}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold">{stakeholder.name}</h4>
                          {stakeholder.organization && (
                            <p className="text-sm text-muted-foreground">{stakeholder.organization}</p>
                          )}
                        </div>
                        <div className={`flex items-center gap-1 ${getPositionColor(stakeholder.position)}`}>
                          {getPositionIcon(stakeholder.position)}
                          <span className="text-xs font-medium capitalize">{stakeholder.position}</span>
                        </div>
                      </div>
                      {stakeholder.statement && (
                        <p className="text-sm text-muted-foreground italic mt-2">
                          "{stakeholder.statement}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
