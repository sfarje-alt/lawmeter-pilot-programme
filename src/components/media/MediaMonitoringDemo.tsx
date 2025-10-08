import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Minus, Newspaper, Video, Quote } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function MediaMonitoringDemo() {
  // Mock data based on Australian Parliament session
  const videoUrl = "https://www.youtube.com/embed/AxERud7DOMQ";
  
  const transcriptSegments = [
    {
      speaker: "Minister for Health",
      timestamp: "00:02:15",
      text: "The Healthcare Access Bill 2024 represents a fundamental shift in how we deliver healthcare to all Australians. This legislation ensures that no Australian will be left behind when it comes to accessing essential medical services.",
      sentiment: "positive" as const,
      score: 0.82
    },
    {
      speaker: "Opposition Leader",
      timestamp: "00:05:42",
      text: "While we support the principle of universal healthcare access, this bill lacks the necessary funding mechanisms. We're concerned about the financial sustainability and the burden it places on the states.",
      sentiment: "negative" as const,
      score: -0.65
    },
    {
      speaker: "Shadow Minister for Health",
      timestamp: "00:08:30",
      text: "The proposed telehealth expansion is a positive step. However, we need stronger provisions for rural and remote communities who face unique challenges in accessing these services.",
      sentiment: "neutral" as const,
      score: 0.12
    },
    {
      speaker: "Minister for Health",
      timestamp: "00:12:18",
      text: "I want to address the funding concerns directly. The government has allocated $2.4 billion over four years, with clear pathways for state partnerships. This is fully costed and sustainable.",
      sentiment: "positive" as const,
      score: 0.75
    },
    {
      speaker: "Independent Senator",
      timestamp: "00:15:05",
      text: "This bill fails to adequately address mental health services. We need specific provisions and dedicated funding for mental health infrastructure, not just vague commitments.",
      sentiment: "negative" as const,
      score: -0.71
    }
  ];

  const mediaReferences = [
    {
      source: "The Australian",
      headline: "Healthcare Bill Promises Universal Access, Critics Question Costs",
      sentiment: "neutral" as const,
      score: 0.05,
      date: "2024-07-25",
      excerpt: "The proposed Healthcare Access Bill has sparked debate in Parliament, with government touting unprecedented access while opposition raises fiscal concerns..."
    },
    {
      source: "ABC News",
      headline: "Government's Healthcare Overhaul Receives Mixed Reception",
      sentiment: "neutral" as const,
      score: -0.15,
      date: "2024-07-24",
      excerpt: "Healthcare reform takes center stage as the Minister defends the $2.4 billion investment against criticism from opposition benches..."
    },
    {
      source: "Sydney Morning Herald",
      headline: "Rural Health Groups Welcome Telehealth Expansion Plans",
      sentiment: "positive" as const,
      score: 0.68,
      date: "2024-07-24",
      excerpt: "Regional healthcare advocates have praised the telehealth provisions in the new bill, though call for stronger implementation guarantees..."
    },
    {
      source: "Guardian Australia",
      headline: "Mental Health Advocates Slam 'Inadequate' Healthcare Bill",
      sentiment: "negative" as const,
      score: -0.79,
      date: "2024-07-23",
      excerpt: "Mental health organizations have criticized the Healthcare Access Bill for lacking specific mental health funding and infrastructure commitments..."
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

  const getSentimentBadge = (sentiment: "positive" | "negative" | "neutral") => {
    const variants: Record<string, "default" | "destructive" | "outline"> = {
      positive: "default",
      negative: "destructive",
      neutral: "outline"
    };
    return variants[sentiment] || "outline";
  };

  // Calculate overall sentiment
  const overallSentiment = transcriptSegments.reduce((acc, seg) => acc + seg.score, 0) / transcriptSegments.length;
  const positiveCount = transcriptSegments.filter(s => s.sentiment === "positive").length;
  const negativeCount = transcriptSegments.filter(s => s.sentiment === "negative").length;
  const neutralCount = transcriptSegments.filter(s => s.sentiment === "neutral").length;

  return (
    <div className="space-y-6">
      {/* Video Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            Parliamentary Session - Healthcare Access Bill 2024
          </CardTitle>
          <CardDescription>
            Question Time: 24th July 2025 - House of Representatives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src={videoUrl}
              title="Parliamentary Session"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="border-0"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="transcript" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transcript">Transcript & Analysis</TabsTrigger>
          <TabsTrigger value="media">Media Coverage</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment Summary</TabsTrigger>
        </TabsList>

        {/* Transcript Tab */}
        <TabsContent value="transcript" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Transcript with Sentiment Analysis</CardTitle>
              <CardDescription>
                Real-time sentiment analysis of parliamentary debate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {transcriptSegments.map((segment, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${getSentimentColor(segment.sentiment)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{segment.speaker}</h4>
                      <p className="text-sm text-muted-foreground">{segment.timestamp}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getSentimentIcon(segment.sentiment)}
                      <Badge variant={getSentimentBadge(segment.sentiment)}>
                        {segment.sentiment} ({segment.score > 0 ? '+' : ''}{segment.score.toFixed(2)})
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed">
                    <Quote className="w-4 h-4 inline mr-1 opacity-50" />
                    {segment.text}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Coverage Tab */}
        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="w-5 h-5" />
                Media Coverage Analysis
              </CardTitle>
              <CardDescription>
                News articles and public sentiment from major Australian media outlets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mediaReferences.map((article, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${getSentimentColor(article.sentiment)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{article.source}</Badge>
                        <span className="text-xs text-muted-foreground">{article.date}</span>
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

        {/* Sentiment Summary Tab */}
        <TabsContent value="sentiment" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Overall Sentiment Score</CardTitle>
                <CardDescription>
                  Aggregate sentiment from parliamentary debate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className={`text-6xl font-bold ${overallSentiment > 0 ? 'text-success' : overallSentiment < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {overallSentiment > 0 ? '+' : ''}{overallSentiment.toFixed(2)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {overallSentiment > 0.3 ? 'Largely Positive' : overallSentiment < -0.3 ? 'Largely Negative' : 'Mixed/Neutral'}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-success">Positive Statements</span>
                        <span className="font-medium">{positiveCount} ({((positiveCount / transcriptSegments.length) * 100).toFixed(0)}%)</span>
                      </div>
                      <Progress value={(positiveCount / transcriptSegments.length) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-destructive">Negative Statements</span>
                        <span className="font-medium">{negativeCount} ({((negativeCount / transcriptSegments.length) * 100).toFixed(0)}%)</span>
                      </div>
                      <Progress value={(negativeCount / transcriptSegments.length) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Neutral Statements</span>
                        <span className="font-medium">{neutralCount} ({((neutralCount / transcriptSegments.length) * 100).toFixed(0)}%)</span>
                      </div>
                      <Progress value={(neutralCount / transcriptSegments.length) * 100} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
                <CardDescription>
                  AI-generated analysis summary
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                    <h5 className="font-semibold text-sm mb-1 text-success">Strong Support For</h5>
                    <p className="text-sm">Telehealth expansion and universal access principles</p>
                  </div>
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <h5 className="font-semibold text-sm mb-1 text-destructive">Major Concerns</h5>
                    <p className="text-sm">Funding sustainability and mental health provisions</p>
                  </div>
                  <div className="p-3 bg-muted/50 border rounded-lg">
                    <h5 className="font-semibold text-sm mb-1">Neutral Areas</h5>
                    <p className="text-sm">Implementation timeline and state partnerships</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-semibold text-sm mb-1">Media Tone</h5>
                    <p className="text-sm">Coverage is largely balanced with focus on fiscal debate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}