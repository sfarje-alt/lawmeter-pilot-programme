import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Minus, Newspaper, Users, Building2, Info } from "lucide-react";

export function SocialListeningDemo() {
  const newspaperCoverage = [
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

  const ngoStatements = [
    {
      organization: "Asociación Bancaria Costarricense",
      type: "Gremio Bancario",
      position: "Oposición con Reservas",
      sentiment: "negative" as const,
      score: -0.58,
      date: "2025-01-15",
      statement: "La ABC reconoce la importancia de la innovación financiera. Sin embargo, exigimos que las fintech cumplan los mismos estándares de solvencia, liquidez y gestión de riesgos que la banca tradicional. No puede existir arbitraje regulatorio.",
      influence: "High",
      followers: "125K"
    },
    {
      organization: "ASOBANCA",
      type: "Asociación de Bancos Privados",
      position: "Oposición Fuerte",
      sentiment: "negative" as const,
      score: -0.84,
      date: "2025-01-14",
      statement: "Estamos profundamente preocupados por las asimetrías regulatorias propuestas. El BAC y los bancos privados enfrentamos requisitos estrictos de capital (Basilea III) mientras las fintech operarían con reglas más laxas. Esto pone en riesgo la estabilidad del sistema.",
      influence: "High",
      followers: "210K"
    },
    {
      organization: "Defensoría de los Habitantes",
      type: "Protección al Consumidor",
      position: "Apoyo Condicionado",
      sentiment: "neutral" as const,
      score: 0.25,
      date: "2025-01-13",
      statement: "Apoyamos la innovación que beneficie a los consumidores. No obstante, exigimos garantías robustas de protección de datos personales y financieros, especialmente en transacciones con nuevos actores digitales.",
      influence: "High",
      followers: "180K"
    },
    {
      organization: "Cámara de Comercio de Costa Rica",
      type: "Sector Empresarial",
      position: "Apoyo Fuerte",
      sentiment: "positive" as const,
      score: 0.79,
      date: "2025-01-16",
      statement: "La regulación fintech es fundamental para la competitividad nacional. Las PYMES necesitan acceso a financiamiento ágil y las fintech pueden llenar vacíos que la banca tradicional no atiende eficientemente.",
      influence: "Medium",
      followers: "95K"
    }
  ];

  const stakeholderPush = [
    {
      stakeholder: "BAC Credomatic",
      type: "Banco Líder Regional",
      action: "Cabildeo Contra Asimetrías Regulatorias",
      sentiment: "negative" as const,
      score: -0.68,
      date: "2024-11-10",
      description: "BAC ha liderado durante 14 meses una campaña intensiva contra el arbitraje regulatorio. Ha presentado estudios técnicos en 8 comisiones legislativas demostrando riesgos sistémicos de permitir fintech con menores requisitos de capital.",
      impact: "Presión directa sobre modificaciones a requisitos prudenciales",
      coalition: "Alianza con todos los bancos privados del país"
    },
    {
      stakeholder: "Asociación Fintech de Costa Rica",
      type: "Coalición Tecnología Financiera",
      action: "Cabildeo Pro-Innovación",
      sentiment: "positive" as const,
      score: 0.88,
      date: "2024-09-15",
      description: "Alianza de 35 startups fintech que ha trabajado directamente con el Ministerio de Hacienda en el diseño del sandbox regulatorio. Presentó roadmap de inclusión financiera digital validado por BID y Banco Mundial.",
      impact: "Influencia en diseño del marco sandbox y requisitos escalonados",
      coalition: "35 empresas fintech + respaldo BID"
    },
    {
      stakeholder: "Banco Central de Costa Rica",
      type: "Autoridad Monetaria",
      action: "Diseño de Marco Prudencial",
      sentiment: "neutral" as const,
      score: 0.15,
      date: "2024-12-01",
      description: "BCCR ha trabajado en conjunto con SUGEF para establecer requisitos de capital, liquidez y gestión de riesgos proporcionales. Busca equilibrio entre innovación y estabilidad del sistema de pagos nacional.",
      impact: "Definición técnica de estándares regulatorios finales",
      coalition: "Coordinación interinstitucional BCCR-SUGEF-Hacienda"
    },
    {
      stakeholder: "MEIC - Ministerio de Economía",
      type: "Entidad Gubernamental",
      action: "Impulso de Competencia",
      sentiment: "positive" as const,
      score: 0.72,
      date: "2025-01-05",
      description: "MEIC ha sido promotor clave de la ley para romper oligopolio bancario. Argumenta que concentración del BAC y 3 bancos más controla 85% del mercado, limitando opciones y elevando costos para consumidores y PYMES.",
      impact: "Respaldo político de alto nivel en gobierno",
      coalition: "Apoyo directo de Casa Presidencial"
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
            Monitoreo en tiempo real de medios, ONGs y actores clave que impulsan la Ley de Regulación Fintech 2025
          </p>
        </div>
      </div>

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
                <p className="text-sm text-muted-foreground">Sentiment analysis of main Costa Rican media outlets</p>
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
                <p className="text-sm text-muted-foreground">Declaraciones y posiciones de organizaciones gremiales y de consumidores</p>
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
                <h3 className="text-xl font-bold">Actors Promoting Legislation</h3>
                <p className="text-sm text-muted-foreground">Organizations actively seeking to create or modify legislation</p>
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
