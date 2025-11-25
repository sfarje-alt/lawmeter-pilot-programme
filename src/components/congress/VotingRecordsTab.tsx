import { useState, useEffect } from "react";
import { CongressVote, VoteMember } from "@/types/congress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { fetchVoteMembers } from "@/hooks/useCongressVotes";
import { 
  ThumbsUp, 
  ThumbsDown, 
  User, 
  Users,
  Calendar,
  Loader2,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface VotingRecordsTabProps {
  votes: CongressVote[];
}

export function VotingRecordsTab({ votes }: VotingRecordsTabProps) {
  const [selectedVote, setSelectedVote] = useState<CongressVote | null>(null);
  const [voteMembers, setVoteMembers] = useState<VoteMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [expandedVote, setExpandedVote] = useState<number | null>(null);

  const getPartyBadgeColor = (party: string) => {
    const colors: Record<string, string> = {
      R: "bg-party-republican text-white",
      D: "bg-party-democrat text-white",
      I: "bg-muted text-muted-foreground",
      ID: "bg-party-democrat/70 text-white",
    };
    return colors[party] || "bg-muted text-muted-foreground";
  };

  const getVoteColor = (vote: string) => {
    switch (vote) {
      case "Yea":
        return "text-success";
      case "Nay":
        return "text-destructive";
      case "Present":
        return "text-warning";
      default:
        return "text-muted-foreground";
    }
  };

  const handleLoadMembers = async (vote: CongressVote) => {
    if (selectedVote?.rollNumber === vote.rollNumber) {
      setSelectedVote(null);
      setVoteMembers([]);
      return;
    }

    setSelectedVote(vote);
    setLoadingMembers(true);
    
    const chamber = vote.chamber.toLowerCase() as 'house' | 'senate';
    const members = await fetchVoteMembers(chamber, vote.congress, vote.session, vote.rollNumber);
    
    setVoteMembers(members);
    setLoadingMembers(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Calculate party statistics for selected vote
  const partyStats = voteMembers.reduce((acc, member) => {
    if (!acc[member.party]) {
      acc[member.party] = { Yea: 0, Nay: 0, Present: 0, "Not Voting": 0 };
    }
    acc[member.party][member.vote]++;
    return acc;
  }, {} as Record<string, Record<string, number>>);

  if (votes.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No voting records available for this bill</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Vote List */}
      <div className="space-y-3">
        {votes.map((vote, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="font-mono">
                      Roll Call {vote.rollNumber}
                    </Badge>
                    <Badge variant="secondary">{vote.chamber}</Badge>
                    <Badge variant={vote.voteResult.toLowerCase().includes('passed') || vote.voteResult.toLowerCase().includes('agreed') ? "default" : "destructive"}>
                      {vote.voteResult}
                    </Badge>
                  </div>
                  <CardTitle className="text-base">{vote.voteQuestion}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {formatDate(vote.voteDate)}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleLoadMembers(vote);
                    setExpandedVote(expandedVote === index ? null : index);
                  }}
                >
                  {expandedVote === index ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Vote Totals */}
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{vote.totals.yea}</div>
                  <div className="text-xs text-muted-foreground">Yea</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-destructive">{vote.totals.nay}</div>
                  <div className="text-xs text-muted-foreground">Nay</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">{vote.totals.present}</div>
                  <div className="text-xs text-muted-foreground">Present</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-muted-foreground">{vote.totals.notVoting}</div>
                  <div className="text-xs text-muted-foreground">Not Voting</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex gap-1">
                  <div 
                    className="h-2 bg-success rounded-l transition-all"
                    style={{ 
                      width: `${(vote.totals.yea / (vote.totals.yea + vote.totals.nay + vote.totals.present)) * 100}%` 
                    }}
                  />
                  <div 
                    className="h-2 bg-destructive transition-all"
                    style={{ 
                      width: `${(vote.totals.nay / (vote.totals.yea + vote.totals.nay + vote.totals.present)) * 100}%` 
                    }}
                  />
                  <div 
                    className="h-2 bg-warning rounded-r transition-all"
                    style={{ 
                      width: `${(vote.totals.present / (vote.totals.yea + vote.totals.nay + vote.totals.present)) * 100}%` 
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Majority required: {vote.majority}
                </p>
              </div>

              {/* Member Details (Expanded) */}
              {expandedVote === index && selectedVote?.rollNumber === vote.rollNumber && (
                <div className="border-t pt-4 mt-4">
                  {loadingMembers ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <Tabs defaultValue="all" className="w-full">
                      <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="all">All ({voteMembers.length})</TabsTrigger>
                        <TabsTrigger value="yea">Yea ({vote.totals.yea})</TabsTrigger>
                        <TabsTrigger value="nay">Nay ({vote.totals.nay})</TabsTrigger>
                        <TabsTrigger value="present">Present ({vote.totals.present})</TabsTrigger>
                        <TabsTrigger value="party">By Party</TabsTrigger>
                      </TabsList>

                      <TabsContent value="all" className="mt-4">
                        <ScrollArea className="h-[300px]">
                          <div className="space-y-2">
                            {voteMembers.map((member, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2 rounded border">
                                <div className="flex items-center gap-3">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <div className="font-medium text-sm">{member.name}</div>
                                    <div className="text-xs text-muted-foreground">{member.state}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className={getPartyBadgeColor(member.party)}>
                                    {member.party}
                                  </Badge>
                                  <span className={`font-medium text-sm ${getVoteColor(member.vote)}`}>
                                    {member.vote}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>

                      <TabsContent value="yea" className="mt-4">
                        <ScrollArea className="h-[300px]">
                          <div className="space-y-2">
                            {voteMembers.filter(m => m.vote === "Yea").map((member, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2 rounded border border-success/20 bg-success/5">
                                <div className="flex items-center gap-3">
                                  <ThumbsUp className="h-4 w-4 text-success" />
                                  <div>
                                    <div className="font-medium text-sm">{member.name}</div>
                                    <div className="text-xs text-muted-foreground">{member.state}</div>
                                  </div>
                                </div>
                                <Badge className={getPartyBadgeColor(member.party)}>
                                  {member.party}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>

                      <TabsContent value="nay" className="mt-4">
                        <ScrollArea className="h-[300px]">
                          <div className="space-y-2">
                            {voteMembers.filter(m => m.vote === "Nay").map((member, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2 rounded border border-destructive/20 bg-destructive/5">
                                <div className="flex items-center gap-3">
                                  <ThumbsDown className="h-4 w-4 text-destructive" />
                                  <div>
                                    <div className="font-medium text-sm">{member.name}</div>
                                    <div className="text-xs text-muted-foreground">{member.state}</div>
                                  </div>
                                </div>
                                <Badge className={getPartyBadgeColor(member.party)}>
                                  {member.party}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>

                      <TabsContent value="present" className="mt-4">
                        <ScrollArea className="h-[300px]">
                          <div className="space-y-2">
                            {voteMembers.filter(m => m.vote === "Present").map((member, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2 rounded border">
                                <div className="flex items-center gap-3">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <div className="font-medium text-sm">{member.name}</div>
                                    <div className="text-xs text-muted-foreground">{member.state}</div>
                                  </div>
                                </div>
                                <Badge className={getPartyBadgeColor(member.party)}>
                                  {member.party}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>

                      <TabsContent value="party" className="mt-4">
                        <div className="space-y-4">
                          {Object.entries(partyStats).map(([party, stats]) => (
                            <Card key={party}>
                              <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center gap-2">
                                  <Badge className={getPartyBadgeColor(party)}>
                                    {party === 'R' ? 'Republican' : party === 'D' ? 'Democrat' : party}
                                  </Badge>
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-4 gap-2 text-sm">
                                  <div>
                                    <div className="font-bold text-success">{stats.Yea}</div>
                                    <div className="text-xs text-muted-foreground">Yea</div>
                                  </div>
                                  <div>
                                    <div className="font-bold text-destructive">{stats.Nay}</div>
                                    <div className="text-xs text-muted-foreground">Nay</div>
                                  </div>
                                  <div>
                                    <div className="font-bold text-warning">{stats.Present}</div>
                                    <div className="text-xs text-muted-foreground">Present</div>
                                  </div>
                                  <div>
                                    <div className="font-bold text-muted-foreground">{stats["Not Voting"]}</div>
                                    <div className="text-xs text-muted-foreground">Not Voting</div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
