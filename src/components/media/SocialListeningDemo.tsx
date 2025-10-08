import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Minus, Newspaper, Users, Building2 } from "lucide-react";

export function SocialListeningDemo() {
  const newspaperCoverage = [
    {
      source: "The Australian",
      headline: "Healthcare Bill Promises Universal Access, Critics Question Costs",
      sentiment: "neutral" as const,
      score: 0.05,
      date: "2024-07-25",
      excerpt: "The proposed Healthcare Access Bill has sparked debate in Parliament, with government touting unprecedented access while opposition raises fiscal concerns...",
      reach: "2.3M readers"
    },
    {
      source: "ABC News",
      headline: "Government's Healthcare Overhaul Receives Mixed Reception",
      sentiment: "neutral" as const,
      score: -0.15,
      date: "2024-07-24",
      excerpt: "Healthcare reform takes center stage as the Minister defends the $2.4 billion investment against criticism from opposition benches...",
      reach: "3.1M readers"
    },
    {
      source: "Sydney Morning Herald",
      headline: "Rural Health Groups Welcome Telehealth Expansion Plans",
      sentiment: "positive" as const,
      score: 0.68,
      date: "2024-07-24",
      excerpt: "Regional healthcare advocates have praised the telehealth provisions in the new bill, though call for stronger implementation guarantees...",
      reach: "1.8M readers"
    },
    {
      source: "Guardian Australia",
      headline: "Mental Health Advocates Slam 'Inadequate' Healthcare Bill",
      sentiment: "negative" as const,
      score: -0.79,
      date: "2024-07-23",
      excerpt: "Mental health organizations have criticized the Healthcare Access Bill for lacking specific mental health funding and infrastructure commitments...",
      reach: "1.5M readers"
    }
  ];

  const ngoStatements = [
    {
      organization: "Australian Medical Association",
      type: "Medical Professional Body",
      position: "Support with Conditions",
      sentiment: "positive" as const,
      score: 0.45,
      date: "2024-07-24",
      statement: "The AMA welcomes the Healthcare Access Bill's focus on universal coverage. However, we call for stronger workforce provisions and funding for GP training to ensure the system can meet increased demand.",
      influence: "High",
      followers: "95K"
    },
    {
      organization: "Beyond Blue",
      type: "Mental Health NGO",
      position: "Opposition",
      sentiment: "negative" as const,
      score: -0.82,
      date: "2024-07-23",
      statement: "We are deeply disappointed by the lack of dedicated mental health funding in this bill. Mental health cannot continue to be an afterthought in healthcare reform. We urge the government to amend the legislation.",
      influence: "High",
      followers: "180K"
    },
    {
      organization: "Rural Doctors Association",
      type: "Regional Health Advocacy",
      position: "Strong Support",
      sentiment: "positive" as const,
      score: 0.88,
      date: "2024-07-24",
      statement: "This is a game-changer for rural Australia. The telehealth expansion and regional incentives address long-standing inequities in healthcare access. We commend the government's vision.",
      influence: "Medium",
      followers: "42K"
    },
    {
      organization: "Australian Taxpayers' Alliance",
      type: "Fiscal Advocacy",
      position: "Opposition",
      sentiment: "negative" as const,
      score: -0.71,
      date: "2024-07-25",
      statement: "The $2.4 billion price tag raises serious concerns about fiscal responsibility. Taxpayers deserve transparency on how this expansion will be funded without increasing debt or taxes.",
      influence: "Medium",
      followers: "68K"
    }
  ];

  const stakeholderPush = [
    {
      stakeholder: "Australian Council of Social Service",
      type: "Social Services Coalition",
      action: "Lobbying for Legislation",
      sentiment: "positive" as const,
      score: 0.92,
      date: "2024-06-15",
      description: "ACOSS has been actively campaigning for universal healthcare access legislation for 18 months. Released comprehensive policy paper and conducted nationwide consultations with 200+ community organizations.",
      impact: "Direct influence on bill's social equity provisions",
      coalition: "Coalition of 50+ member organizations"
    },
    {
      stakeholder: "Australian Healthcare Reform Alliance",
      type: "Industry Coalition",
      action: "Policy Development Partnership",
      sentiment: "positive" as const,
      score: 0.85,
      date: "2024-05-20",
      description: "Multi-stakeholder alliance including hospitals, insurers, and patient groups collaborated with government on bill drafting. Provided technical expertise on implementation feasibility.",
      impact: "Shaped telehealth framework and funding mechanisms",
      coalition: "15 major healthcare organizations"
    },
    {
      stakeholder: "Mental Health Australia",
      type: "Mental Health Advocacy Peak Body",
      action: "Pushing for Amendment",
      sentiment: "negative" as const,
      score: -0.65,
      date: "2024-07-20",
      description: "Leading a coalition demanding specific mental health provisions be added to the bill. Launched public campaign #MentalHealthMatters with 25K petition signatures in 48 hours.",
      impact: "Pressure for bill amendment before final vote",
      coalition: "Coalition of 30+ mental health organizations"
    }
  ];

  const getSentimentIcon = (sentiment: "positive" | "negative" | "neutral") => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="w-4 h-4 text-success" />;
      case "negative":
        return <TrendingDown className="w-4 h-4 text-destructive" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getSentimentColor = (sentiment: "positive" | "negative" | "neutral") => {
    switch (sentiment) {
      case "positive":
        return "border-success bg-success/10";
      case "negative":
        return "border-destructive bg-destructive/10";
      default:
        return "border-muted bg-muted/10";
    }
  };

  const getInfluenceBadge = (influence: string) => {
    const colors: Record<string, string> = {
      "High": "bg-destructive text-destructive-foreground",
      "Medium": "bg-warning text-warning-foreground",
      "Low": "bg-muted text-muted-foreground"
    };
    return colors[influence] || "bg-muted";
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 border border-primary/20">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]"></div>
        <div className="relative p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Social Listening</h2>
          </div>
          <p className="text-muted-foreground">
            Real-time monitoring of media outlets, NGOs, and stakeholders driving the Healthcare Access Bill 2024
          </p>
        </div>
      </div>

      <Tabs defaultValue="newspapers" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/50 backdrop-blur-sm">
          <TabsTrigger 
            value="newspapers" 
            className="data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all"
          >
            <Newspaper className="w-4 h-4 mr-2" />
            <span className="font-medium">Newspapers</span>
          </TabsTrigger>
          <TabsTrigger 
            value="ngos"
            className="data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all"
          >
            <Users className="w-4 h-4 mr-2" />
            <span className="font-medium">NGOs</span>
          </TabsTrigger>
          <TabsTrigger 
            value="stakeholders"
            className="data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all"
          >
            <Building2 className="w-4 h-4 mr-2" />
            <span className="font-medium">Stakeholders</span>
          </TabsTrigger>
        </TabsList>

        {/* Newspapers Tab */}
        <TabsContent value="newspapers" className="space-y-4 mt-6">
          <div className="rounded-xl bg-gradient-to-br from-background to-muted/30 p-6 border shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Newspaper className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Media Coverage</h3>
                <p className="text-sm text-muted-foreground">Sentiment analysis from major Australian newspapers</p>
              </div>
            </div>
            <div className="space-y-4">
              {newspaperCoverage.map((article, index) => (
                <div
                  key={index}
                  className={`group relative p-5 rounded-xl border-l-4 ${getSentimentColor(article.sentiment)} backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge variant="outline" className="font-semibold">{article.source}</Badge>
                          <Badge variant="secondary" className="text-xs">{article.reach}</Badge>
                          <span className="text-xs text-muted-foreground">{article.date}</span>
                        </div>
                        <h4 className="font-bold text-lg mb-2 leading-tight">{article.headline}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{article.excerpt}</p>
                      </div>
                      <div className="ml-4 flex flex-col items-center gap-1 bg-background/80 backdrop-blur-sm p-3 rounded-lg border">
                        {getSentimentIcon(article.sentiment)}
                        <span className="text-sm font-bold">
                          {article.score > 0 ? '+' : ''}{article.score.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* NGOs Tab */}
        <TabsContent value="ngos" className="space-y-4 mt-6">
          <div className="rounded-xl bg-gradient-to-br from-background to-muted/30 p-6 border shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">NGO Positions</h3>
                <p className="text-sm text-muted-foreground">Statements and positions from non-governmental organizations</p>
              </div>
            </div>
            <div className="space-y-4">
              {ngoStatements.map((ngo, index) => (
                <div
                  key={index}
                  className={`group relative p-5 rounded-xl border-l-4 ${getSentimentColor(ngo.sentiment)} backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-2">{ngo.organization}</h4>
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <Badge variant="outline" className="text-xs">{ngo.type}</Badge>
                          <Badge className={`text-xs ${getInfluenceBadge(ngo.influence)}`}>
                            {ngo.influence} Influence
                          </Badge>
                          <Badge variant="secondary" className="text-xs">{ngo.followers} followers</Badge>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col items-center gap-1 bg-background/80 backdrop-blur-sm p-3 rounded-lg border">
                        {getSentimentIcon(ngo.sentiment)}
                        <span className="text-sm font-bold">
                          {ngo.score > 0 ? '+' : ''}{ngo.score.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="mb-3 flex items-center gap-2">
                      <Badge variant={ngo.position.includes("Support") ? "default" : "destructive"} className="font-medium">
                        {ngo.position}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{ngo.date}</span>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4 border-l-2 border-primary/20">
                      <p className="text-sm leading-relaxed italic">"{ngo.statement}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Stakeholders Tab */}
        <TabsContent value="stakeholders" className="space-y-4 mt-6">
          <div className="rounded-xl bg-gradient-to-br from-background to-muted/30 p-6 border shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Stakeholders Driving Legislation</h3>
                <p className="text-sm text-muted-foreground">Organizations actively pushing for the creation or modification of the law</p>
              </div>
            </div>
            <div className="space-y-4">
              {stakeholderPush.map((stakeholder, index) => (
                <div
                  key={index}
                  className={`group relative p-6 rounded-xl border-l-4 ${getSentimentColor(stakeholder.sentiment)} backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-xl mb-2">{stakeholder.stakeholder}</h4>
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <Badge variant="outline" className="font-medium">{stakeholder.type}</Badge>
                          <span className="text-xs text-muted-foreground">{stakeholder.date}</span>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col items-center gap-1 bg-background/80 backdrop-blur-sm p-3 rounded-lg border">
                        {getSentimentIcon(stakeholder.sentiment)}
                        <span className="text-sm font-bold">
                          {stakeholder.score > 0 ? '+' : ''}{stakeholder.score.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    <Badge variant="default" className="mb-4 font-medium">
                      {stakeholder.action}
                    </Badge>
                    
                    <p className="text-sm mb-4 leading-relaxed bg-muted/30 rounded-lg p-4 border-l-2 border-primary/20">
                      {stakeholder.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t">
                      <div className="flex items-start gap-3 bg-background/50 rounded-lg p-3">
                        <div className="w-1 h-full bg-primary rounded-full"></div>
                        <div>
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Impact</span>
                          <p className="text-sm mt-1">{stakeholder.impact}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-background/50 rounded-lg p-3">
                        <div className="w-1 h-full bg-accent rounded-full"></div>
                        <div>
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Coalition</span>
                          <p className="text-sm mt-1">{stakeholder.coalition}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
