import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, TrendingDown, Minus, Newspaper, Users, Building2, Info, 
  Facebook, Twitter, Settings, Download, Calendar, BarChart3, MessageCircle,
  Clock, Bell, FileText, Plus, Eye, Heart, Share2, Mail
} from "lucide-react";
import { useState } from "react";

export function SocialListeningDemo() {
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);

  // Social Media Monitoring Data
  const trackedAccounts = [
    { id: "1", platform: "facebook", handle: "BAC Credomatic", avatar: "🏦", posts: 156, lastExtraction: "2h ago" },
    { id: "2", platform: "twitter", handle: "@SUGEF_CR", avatar: "🏛️", posts: 89, lastExtraction: "1h ago" },
    { id: "3", platform: "facebook", handle: "Banco Nacional CR", avatar: "🏦", posts: 203, lastExtraction: "3h ago" },
    { id: "4", platform: "twitter", handle: "@BCCRCostaRica", avatar: "🏛️", posts: 124, lastExtraction: "30m ago" },
    { id: "5", platform: "facebook", handle: "Fintech Costa Rica", avatar: "💳", posts: 67, lastExtraction: "45m ago" },
    { id: "6", platform: "twitter", handle: "@AsofintechCR", avatar: "💳", posts: 45, lastExtraction: "2h ago" },
    { id: "7", platform: "facebook", handle: "Cámara de Comercio CR", avatar: "🏢", posts: 78, lastExtraction: "1h ago" },
    { id: "8", platform: "twitter", handle: "@MELOACCR", avatar: "🏛️", posts: 92, lastExtraction: "4h ago" },
    { id: "9", platform: "facebook", handle: "Defensoría Habitantes", avatar: "⚖️", posts: 54, lastExtraction: "2h ago" },
    { id: "10", platform: "twitter", handle: "@LaRepublicaCR", avatar: "📰", posts: 312, lastExtraction: "15m ago" },
    { id: "11", platform: "facebook", handle: "El Financiero CR", avatar: "📰", posts: 287, lastExtraction: "20m ago" },
    { id: "12", platform: "twitter", handle: "@CRHoyNews", avatar: "📰", posts: 445, lastExtraction: "10m ago" },
  ];

  const extractedPosts = [
    {
      id: "1",
      account: "@SUGEF_CR",
      platform: "twitter",
      content: "COMUNICADO: La SUGEF anuncia nuevos lineamientos para la regulación de entidades fintech. Los requisitos de capital se ajustarán proporcionalmente al volumen de operaciones. #RegulacionFintech #CostaRica",
      date: "2025-01-16 14:30",
      sentiment: 0.45,
      engagement: { likes: 234, shares: 89, comments: 45 }
    },
    {
      id: "2",
      account: "BAC Credomatic",
      platform: "facebook",
      content: "En BAC Credomatic apoyamos la innovación financiera, pero consideramos fundamental que todos los actores del sistema operen bajo las mismas reglas prudenciales para garantizar la estabilidad del sistema financiero costarricense.",
      date: "2025-01-16 11:15",
      sentiment: -0.32,
      engagement: { likes: 567, shares: 123, comments: 189 }
    },
    {
      id: "3",
      account: "@AsofintechCR",
      platform: "twitter",
      content: "¡Gran avance para la innovación financiera en Costa Rica! El proyecto de ley fintech incluye sandbox regulatorio que permitirá a startups probar nuevos productos. Agradecemos el apoyo del @MELOACCR y @BCCRCostaRica #FintechCR",
      date: "2025-01-16 09:45",
      sentiment: 0.88,
      engagement: { likes: 445, shares: 201, comments: 67 }
    },
    {
      id: "4",
      account: "@BCCRCostaRica",
      platform: "twitter",
      content: "El Banco Central reitera su compromiso con un marco regulatorio que equilibre la innovación tecnológica con la estabilidad del sistema de pagos nacional. Continuamos trabajando en coordinación con @SUGEF_CR",
      date: "2025-01-15 16:20",
      sentiment: 0.15,
      engagement: { likes: 189, shares: 56, comments: 23 }
    },
    {
      id: "5",
      account: "Cámara de Comercio CR",
      platform: "facebook",
      content: "Las PYMES costarricenses necesitan acceso a financiamiento más ágil. La regulación fintech puede ser la clave para democratizar el acceso al crédito y reducir costos para los pequeños empresarios del país.",
      date: "2025-01-15 10:00",
      sentiment: 0.72,
      engagement: { likes: 312, shares: 98, comments: 54 }
    }
  ];

  const scheduledReports = [
    { id: "1", name: "Weekly Sentiment Summary", frequency: "Weekly", nextRun: "Monday 8:00 AM", lastRun: "Jan 13, 2025", status: "active" },
    { id: "2", name: "Monthly Stakeholder Analysis", frequency: "Monthly", nextRun: "Feb 1, 2025", lastRun: "Jan 1, 2025", status: "active" },
    { id: "3", name: "Quarterly Trend Report", frequency: "Quarterly", nextRun: "Apr 1, 2025", lastRun: "Jan 1, 2025", status: "active" },
  ];

  const reportRepository = [
    { id: "1", name: "Weekly Sentiment Summary - Jan 13, 2025", date: "Jan 13, 2025", type: "Weekly", size: "2.4 MB" },
    { id: "2", name: "Weekly Sentiment Summary - Jan 6, 2025", date: "Jan 6, 2025", type: "Weekly", size: "2.1 MB" },
    { id: "3", name: "Monthly Stakeholder Analysis - Jan 2025", date: "Jan 1, 2025", type: "Monthly", size: "5.8 MB" },
    { id: "4", name: "Weekly Sentiment Summary - Dec 30, 2024", date: "Dec 30, 2024", type: "Weekly", size: "2.3 MB" },
    { id: "5", name: "Quarterly Trend Report - Q4 2024", date: "Jan 1, 2025", type: "Quarterly", size: "12.4 MB" },
  ];

  // Press Coverage Data (renamed from Newspapers)
  const pressCoverage = [
    {
      source: "La Nación",
      headline: "Ley Fintech Promete Modernización Bancaria, BAC Alerta Sobre Riesgos",
      sentiment: "neutral" as const,
      score: 0.08,
      date: "2025-01-16",
      excerpt: "El proyecto de regulación fintech ha generado debate en la Asamblea. Mientras el gobierno destaca innovación, el sector bancario tradicional señala preocupaciones sobre competencia desleal...",
      reach: "850K lectores"
    },
    {
      source: "El Financiero",
      headline: "BAC y Banca Privada Exigen Igualdad Regulatoria ante Avance Fintech",
      sentiment: "negative" as const,
      score: -0.62,
      date: "2025-01-15",
      excerpt: "Los principales bancos del país, liderados por BAC, han manifestado su rechazo a disposiciones que permitirían a plataformas fintech operar con menores requisitos de capital y liquidez...",
      reach: "420K lectores"
    },
    {
      source: "CRHoy",
      headline: "SUGEF Respalda Marco Regulatorio que Equilibra Innovación y Estabilidad",
      sentiment: "positive" as const,
      score: 0.71,
      date: "2025-01-14",
      excerpt: "La Superintendencia General de Entidades Financieras destacó que el proyecto incluye salvaguardas prudenciales adecuadas para proteger el sistema financiero nacional...",
      reach: "320K lectores"
    },
    {
      source: "Semanario Universidad",
      headline: "Proyecto Fintech Ignora Inclusión Financiera en Zonas Rurales",
      sentiment: "negative" as const,
      score: -0.78,
      date: "2025-01-13",
      excerpt: "Organizaciones de consumidores critican que la ley no contempla mecanismos para garantizar acceso bancario digital a comunidades alejadas de centros urbanos...",
      reach: "280K lectores"
    }
  ];

  // Custom Organizations Data (renamed from NGOs)
  const customOrganizations = [
    {
      organization: "Asociación Bancaria Costarricense",
      type: "Banking Association",
      sourceType: "Website Extraction",
      position: "Opposition with Reservations",
      sentiment: "negative" as const,
      score: -0.58,
      date: "2025-01-15",
      statement: "La ABC reconoce la importancia de la innovación financiera. Sin embargo, exigimos que las fintech cumplan los mismos estándares de solvencia, liquidez y gestión de riesgos que la banca tradicional. No puede existir arbitraje regulatorio.",
      influence: "High",
      followers: "125K"
    },
    {
      organization: "ASOBANCA",
      type: "Private Banks Association",
      sourceType: "Website Extraction",
      position: "Strong Opposition",
      sentiment: "negative" as const,
      score: -0.84,
      date: "2025-01-14",
      statement: "Estamos profundamente preocupados por las asimetrías regulatorias propuestas. El BAC y los bancos privados enfrentamos requisitos estrictos de capital (Basilea III) mientras las fintech operarían con reglas más laxas. Esto pone en riesgo la estabilidad del sistema.",
      influence: "High",
      followers: "210K"
    },
    {
      organization: "Defensoría de los Habitantes",
      type: "Consumer Protection",
      sourceType: "Website Extraction",
      position: "Conditional Support",
      sentiment: "neutral" as const,
      score: 0.25,
      date: "2025-01-13",
      statement: "Apoyamos la innovación que beneficie a los consumidores. No obstante, exigimos garantías robustas de protección de datos personales y financieros, especialmente en transacciones con nuevos actores digitales.",
      influence: "High",
      followers: "180K"
    },
    {
      organization: "Cámara de Comercio de Costa Rica",
      type: "Business Sector",
      sourceType: "Website Extraction",
      position: "Strong Support",
      sentiment: "positive" as const,
      score: 0.79,
      date: "2025-01-16",
      statement: "La regulación fintech es fundamental para la competitividad nacional. Las PYMES necesitan acceso a financiamiento ágil y las fintech pueden llenar vacíos que la banca tradicional no atiende eficientemente.",
      influence: "Medium",
      followers: "95K"
    },
    {
      organization: "Fundación ACCESO - Consumer Rights NGO",
      type: "NGO Newsletter",
      sourceType: "Newsletter Extraction",
      position: "Critical Analysis",
      sentiment: "neutral" as const,
      score: -0.15,
      date: "2025-01-12",
      statement: "En nuestro boletín mensual analizamos los impactos de la Ley Fintech en los consumidores vulnerables. Si bien la innovación es bienvenida, alertamos sobre la necesidad de mecanismos de protección más robustos para usuarios de bajos ingresos que podrían ser excluidos del sistema digital.",
      influence: "Medium",
      followers: "45K",
      isNewsletter: true,
      newsletterName: "Boletín Derechos del Consumidor - Enero 2025"
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

  const getSentimentBadgeColor = (score: number) => {
    if (score >= 0.3) return "bg-success/20 text-success border-success/30";
    if (score <= -0.3) return "bg-destructive/20 text-destructive border-destructive/30";
    return "bg-muted/50 text-muted-foreground border-muted";
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
            Monitor social media accounts, press coverage, and custom organization websites for regulatory discussions
          </p>
        </div>
      </div>

      <Tabs defaultValue="social-media" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/50 backdrop-blur-sm">
          <TabsTrigger 
            value="social-media" 
            className="data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            <span className="font-medium">Social Media</span>
          </TabsTrigger>
          <TabsTrigger 
            value="press" 
            className="data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all"
          >
            <Newspaper className="w-4 h-4 mr-2" />
            <span className="font-medium">Press</span>
          </TabsTrigger>
          <TabsTrigger 
            value="custom-orgs"
            className="data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all"
          >
            <Building2 className="w-4 h-4 mr-2" />
            <span className="font-medium">Custom Organizations</span>
          </TabsTrigger>
        </TabsList>

        {/* Social Media Monitoring Tab */}
        <TabsContent value="social-media" className="space-y-6 mt-6">
          {/* Account Configuration Panel */}
          <Card className="border-primary/20">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Tracked Accounts</CardTitle>
                    <CardDescription>
                      {trackedAccounts.length}/50 accounts configured for extraction
                    </CardDescription>
                  </div>
                </div>
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Account
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {trackedAccounts.map((account) => (
                  <div 
                    key={account.id}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="text-2xl">{account.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        {account.platform === "facebook" ? (
                          <Facebook className="w-3 h-3 text-blue-500" />
                        ) : (
                          <Twitter className="w-3 h-3 text-sky-500" />
                        )}
                        <span className="text-sm font-medium truncate">{account.handle}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{account.posts} posts</span>
                        <span>•</span>
                        <span>{account.lastExtraction}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Extracted Posts Dashboard */}
          <Card className="border-primary/20">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Extracted Posts</CardTitle>
                    <CardDescription>
                      Recent posts with sentiment analysis
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="w-4 h-4" />
                    Filters
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {extractedPosts.map((post) => (
                <div 
                  key={post.id}
                  className="p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {post.platform === "facebook" ? (
                          <Facebook className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Twitter className="w-4 h-4 text-sky-500" />
                        )}
                        <span className="font-medium">{post.account}</span>
                        <span className="text-xs text-muted-foreground">• {post.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" /> {post.engagement.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <Share2 className="w-3 h-3" /> {post.engagement.shares}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" /> {post.engagement.comments}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1 p-3 rounded-lg border bg-background">
                      {post.sentiment >= 0.3 ? (
                        <TrendingUp className="w-4 h-4 text-success" />
                      ) : post.sentiment <= -0.3 ? (
                        <TrendingDown className="w-4 h-4 text-destructive" />
                      ) : (
                        <Minus className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className={`text-sm font-bold ${
                        post.sentiment >= 0.3 ? "text-success" : 
                        post.sentiment <= -0.3 ? "text-destructive" : 
                        "text-muted-foreground"
                      }`}>
                        {post.sentiment > 0 ? '+' : ''}{post.sentiment.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Report Configuration & Repository */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Scheduled Reports */}
            <Card className="border-primary/20">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Scheduled Reports</CardTitle>
                      <CardDescription>
                        Automated report generation
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="w-4 h-4" />
                    Configure
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {scheduledReports.map((report) => (
                  <div 
                    key={report.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Clock className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{report.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {report.frequency} • Next: {report.nextRun}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                      Active
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Report Repository */}
            <Card className="border-primary/20">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Report Repository</CardTitle>
                      <CardDescription>
                        Previously generated reports
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="w-4 h-4" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {reportRepository.slice(0, 4).map((report) => (
                  <div 
                    key={report.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-sm truncate max-w-[200px]">{report.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {report.date} • {report.size}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sentiment Score Explanation */}
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Info className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">Understanding Sentiment Scores</CardTitle>
                  <CardDescription className="space-y-2">
                    <p>Sentiment scores range from <strong>-1.0</strong> (most negative) to <strong>+1.0</strong> (most positive), with <strong>0.0</strong> representing neutral sentiment.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-success/10 border border-success/20">
                        <TrendingUp className="w-4 h-4 text-success flex-shrink-0" />
                        <div className="text-xs">
                          <div className="font-semibold text-success">Positive</div>
                          <div className="text-muted-foreground">+0.3 to +1.0</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-muted">
                        <Minus className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div className="text-xs">
                          <div className="font-semibold">Neutral</div>
                          <div className="text-muted-foreground">-0.3 to +0.3</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-destructive/10 border border-destructive/20">
                        <TrendingDown className="w-4 h-4 text-destructive flex-shrink-0" />
                        <div className="text-xs">
                          <div className="font-semibold text-destructive">Negative</div>
                          <div className="text-muted-foreground">-1.0 to -0.3</div>
                        </div>
                      </div>
                    </div>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </TabsContent>

        {/* Press Tab */}
        <TabsContent value="press" className="space-y-4 mt-6">
          <div className="rounded-xl bg-gradient-to-br from-background to-muted/30 p-6 border shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Newspaper className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Press Coverage</h3>
                <p className="text-sm text-muted-foreground">Sentiment analysis of main Costa Rican media outlets</p>
              </div>
            </div>
            <div className="space-y-4">
              {pressCoverage.map((article, index) => (
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

        {/* Custom Organizations Tab */}
        <TabsContent value="custom-orgs" className="space-y-4 mt-6">
          <div className="rounded-xl bg-gradient-to-br from-background to-muted/30 p-6 border shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Custom Organizations</h3>
                  <p className="text-sm text-muted-foreground">Website and newsletter extraction upon request</p>
                </div>
              </div>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Request Extraction
              </Button>
            </div>
            <div className="space-y-4">
              {customOrganizations.map((org, index) => (
                <div
                  key={index}
                  className={`group relative p-5 rounded-xl border-l-4 ${getSentimentColor(org.sentiment)} backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-2">{org.organization}</h4>
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <Badge variant="outline" className="text-xs">{org.type}</Badge>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${org.sourceType === "Newsletter Extraction" ? "bg-amber-500/20 text-amber-700 border-amber-500/30" : ""}`}
                          >
                            {org.sourceType === "Newsletter Extraction" ? (
                              <><Mail className="w-3 h-3 mr-1" />{org.sourceType}</>
                            ) : (
                              org.sourceType
                            )}
                          </Badge>
                          <Badge className={`text-xs ${getInfluenceBadge(org.influence)}`}>
                            {org.influence} Influence
                          </Badge>
                          <Badge variant="secondary" className="text-xs">{org.followers} followers</Badge>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col items-center gap-1 bg-background/80 backdrop-blur-sm p-3 rounded-lg border">
                        {getSentimentIcon(org.sentiment)}
                        <span className="text-sm font-bold">
                          {org.score > 0 ? '+' : ''}{org.score.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="mb-3 flex items-center gap-2 flex-wrap">
                      <Badge variant={org.position.includes("Support") ? "default" : org.position.includes("Opposition") ? "destructive" : "secondary"} className="font-medium">
                        {org.position}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{org.date}</span>
                      {'isNewsletter' in org && org.isNewsletter && (
                        <Badge variant="outline" className="text-xs bg-amber-500/10 border-amber-500/30 text-amber-700">
                          <Mail className="w-3 h-3 mr-1" />
                          {org.newsletterName}
                        </Badge>
                      )}
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4 border-l-2 border-primary/20">
                      <p className="text-sm leading-relaxed italic">"{org.statement}"</p>
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
