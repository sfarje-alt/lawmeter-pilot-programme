import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BillItem } from "@/types/legislation";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Users, Building2, TrendingUp } from "lucide-react";

interface VotingAnalyticsChartProps {
  bills: BillItem[];
}

export function VotingAnalyticsChart({ bills }: VotingAnalyticsChartProps) {
  // Aggregate all voting data
  const votingStats = bills.reduce((acc, bill) => {
    bill.votingRecords?.forEach(record => {
      acc.totalFor += record.votesFor;
      acc.totalAgainst += record.votesAgainst;
      acc.totalAbstain += record.abstentions;
      acc.totalVotes += 1;
      if (record.passed) acc.passedVotes += 1;
    });
    return acc;
  }, { totalFor: 0, totalAgainst: 0, totalAbstain: 0, totalVotes: 0, passedVotes: 0 });

  const voteDistribution = [
    { name: "For", value: votingStats.totalFor, color: "hsl(var(--success))" },
    { name: "Against", value: votingStats.totalAgainst, color: "hsl(var(--destructive))" },
    { name: "Abstain", value: votingStats.totalAbstain, color: "hsl(var(--muted-foreground))" },
  ];

  // MP voting patterns by party
  const mpVotesByParty = bills.reduce((acc, bill) => {
    bill.votingRecords?.forEach(record => {
      record.mpVotes?.forEach(mpVote => {
        if (!acc[mpVote.party]) {
          acc[mpVote.party] = { for: 0, against: 0, abstain: 0 };
        }
        acc[mpVote.party][mpVote.vote] += 1;
      });
    });
    return acc;
  }, {} as Record<string, { for: number; against: number; abstain: number }>);

  const partyVotingData = Object.entries(mpVotesByParty).map(([party, votes]) => ({
    party,
    For: votes.for,
    Against: votes.against,
    Abstain: votes.abstain,
  }));

  const passRate = votingStats.totalVotes > 0 
    ? ((votingStats.passedVotes / votingStats.totalVotes) * 100).toFixed(1)
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Overall Vote Distribution
          </CardTitle>
          <CardDescription>
            Patrones de votación agregados en todos los proyectos legislativos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={voteDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {voteDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                <div className="text-sm text-muted-foreground mb-1">Total For</div>
                <div className="text-2xl font-bold text-success">{votingStats.totalFor}</div>
              </div>
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="text-sm text-muted-foreground mb-1">Total Against</div>
                <div className="text-2xl font-bold text-destructive">{votingStats.totalAgainst}</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 border">
                <div className="text-sm text-muted-foreground mb-1">Pass Rate</div>
                <div className="text-2xl font-bold">{passRate}%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Voting Patterns by Party
          </CardTitle>
          <CardDescription>
            Cómo votaron los diferentes partidos en los proyectos legislativos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {partyVotingData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No voting data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={partyVotingData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="party" />
                <YAxis 
                  allowDecimals={false}
                  domain={[0, (dataMax: number) => Math.ceil(dataMax / 2) * 2]}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="For" fill="hsl(var(--success))" />
                <Bar dataKey="Against" fill="hsl(var(--destructive))" />
                <Bar dataKey="Abstain" fill="hsl(var(--muted-foreground))" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
