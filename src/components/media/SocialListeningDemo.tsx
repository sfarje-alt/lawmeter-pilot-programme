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
      <Card>
        <CardHeader>
          <CardTitle>Escucha Social - Healthcare Access Bill 2024</CardTitle>
          <CardDescription>
            Monitoreo de medios, ONGs, y stakeholders que impulsan la legislación
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="newspapers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="newspapers">
            <Newspaper className="w-4 h-4 mr-2" />
            Periódicos
          </TabsTrigger>
          <TabsTrigger value="ngos">
            <Users className="w-4 h-4 mr-2" />
            ONGs
          </TabsTrigger>
          <TabsTrigger value="stakeholders">
            <Building2 className="w-4 h-4 mr-2" />
            Stakeholders
          </TabsTrigger>
        </TabsList>

        {/* Newspapers Tab */}
        <TabsContent value="newspapers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cobertura de Medios</CardTitle>
              <CardDescription>
                Análisis de sentimiento de principales periódicos australianos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {newspaperCoverage.map((article, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${getSentimentColor(article.sentiment)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{article.source}</Badge>
                        <span className="text-xs text-muted-foreground">{article.date}</span>
                        <Badge variant="secondary" className="text-xs">{article.reach}</Badge>
                      </div>
                      <h4 className="font-semibold mb-2">{article.headline}</h4>
                      <p className="text-sm text-muted-foreground">{article.excerpt}</p>
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      {getSentimentIcon(article.sentiment)}
                      <span className="text-sm font-medium">
                        {article.score > 0 ? '+' : ''}{article.score.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* NGOs Tab */}
        <TabsContent value="ngos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Posiciones de ONGs</CardTitle>
              <CardDescription>
                Declaraciones y posiciones de organizaciones no gubernamentales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {ngoStatements.map((ngo, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${getSentimentColor(ngo.sentiment)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{ngo.organization}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{ngo.type}</Badge>
                        <Badge className={`text-xs ${getInfluenceBadge(ngo.influence)}`}>
                          {ngo.influence} Influence
                        </Badge>
                        <span className="text-xs text-muted-foreground">{ngo.followers} followers</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getSentimentIcon(ngo.sentiment)}
                      <span className="text-sm font-medium">
                        {ngo.score > 0 ? '+' : ''}{ngo.score.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="mb-2">
                    <Badge variant={ngo.position.includes("Support") ? "default" : "destructive"}>
                      {ngo.position}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-2">{ngo.date}</span>
                  </div>
                  <p className="text-sm leading-relaxed italic">"{ngo.statement}"</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stakeholders Tab */}
        <TabsContent value="stakeholders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stakeholders Impulsando Legislación</CardTitle>
              <CardDescription>
                Organizaciones activamente empujando la creación o modificación de la ley
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stakeholderPush.map((stakeholder, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${getSentimentColor(stakeholder.sentiment)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{stakeholder.stakeholder}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{stakeholder.type}</Badge>
                        <span className="text-xs text-muted-foreground">{stakeholder.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getSentimentIcon(stakeholder.sentiment)}
                      <span className="text-sm font-medium">
                        {stakeholder.score > 0 ? '+' : ''}{stakeholder.score.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <Badge variant="default" className="mb-3">
                    {stakeholder.action}
                  </Badge>
                  
                  <p className="text-sm mb-3 leading-relaxed">{stakeholder.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">Impact:</span>
                      <span className="text-xs">{stakeholder.impact}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">Coalition:</span>
                      <span className="text-xs">{stakeholder.coalition}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
