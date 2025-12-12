import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  TrendingUp, TrendingDown, Minus, Newspaper, Users, Building2, Info, 
  Facebook, Settings, Download, Calendar, BarChart3, MessageCircle,
  Clock, Bell, FileText, Plus, Eye, Heart, Share2, Mail, Search,
  ChevronLeft, ChevronRight, MessageSquare, Repeat2, Image as ImageIcon
} from "lucide-react";
import { useState, useMemo } from "react";

// X (Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function SocialListeningDemo() {
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [accountSearchQuery, setAccountSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const accountsPerPage = 12; // 4x3 grid

  // 50 tracked accounts data (no emojis)
  const trackedAccounts = [
    { id: "1", platform: "facebook" as const, handle: "World Health Organization (WHO)", profilePic: "https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-1/488220448_9921581377887156_4002557874571876678_n.jpg", posts: 1847, lastExtraction: "15m ago", followers: 14200000 },
    { id: "2", platform: "x" as const, handle: "@ATU_GobPeru", profilePic: "https://pbs.twimg.com/profile_images/1819095731623346177/YouKV4kG.jpg", posts: 13398, lastExtraction: "10m ago", followers: 59727 },
    { id: "3", platform: "facebook" as const, handle: "UNICEF", profilePic: "", posts: 2341, lastExtraction: "20m ago", followers: 16500000 },
    { id: "4", platform: "x" as const, handle: "@MTC_GobPeru", profilePic: "", posts: 8742, lastExtraction: "5m ago", followers: 125000 },
    { id: "5", platform: "facebook" as const, handle: "European Commission", profilePic: "", posts: 3256, lastExtraction: "30m ago", followers: 2800000 },
    { id: "6", platform: "x" as const, handle: "@SUGEF_CR", profilePic: "", posts: 892, lastExtraction: "1h ago", followers: 45000 },
    { id: "7", platform: "facebook" as const, handle: "BAC Credomatic", profilePic: "", posts: 1567, lastExtraction: "2h ago", followers: 890000 },
    { id: "8", platform: "x" as const, handle: "@BCCRCostaRica", profilePic: "", posts: 3421, lastExtraction: "45m ago", followers: 78000 },
    { id: "9", platform: "facebook" as const, handle: "Banco Nacional Costa Rica", profilePic: "", posts: 2103, lastExtraction: "1h ago", followers: 1200000 },
    { id: "10", platform: "x" as const, handle: "@AsofintechCR", profilePic: "", posts: 456, lastExtraction: "3h ago", followers: 12000 },
    { id: "11", platform: "facebook" as const, handle: "Ministerio de Salud CR", profilePic: "", posts: 1890, lastExtraction: "25m ago", followers: 450000 },
    { id: "12", platform: "x" as const, handle: "@presidaborici", profilePic: "", posts: 5678, lastExtraction: "20m ago", followers: 890000 },
    { id: "13", platform: "facebook" as const, handle: "CCSS Costa Rica", profilePic: "", posts: 2345, lastExtraction: "40m ago", followers: 670000 },
    { id: "14", platform: "x" as const, handle: "@LaRepublicaCR", profilePic: "", posts: 12456, lastExtraction: "5m ago", followers: 234000 },
    { id: "15", platform: "facebook" as const, handle: "Defensoría de los Habitantes", profilePic: "", posts: 1234, lastExtraction: "2h ago", followers: 180000 },
    { id: "16", platform: "x" as const, handle: "@CRHoyNews", profilePic: "", posts: 18923, lastExtraction: "3m ago", followers: 567000 },
    { id: "17", platform: "facebook" as const, handle: "Camara de Comercio de Costa Rica", profilePic: "", posts: 890, lastExtraction: "4h ago", followers: 95000 },
    { id: "18", platform: "x" as const, handle: "@elmaborici", profilePic: "", posts: 7845, lastExtraction: "15m ago", followers: 123000 },
    { id: "19", platform: "facebook" as const, handle: "ICE Costa Rica", profilePic: "", posts: 1567, lastExtraction: "1h ago", followers: 340000 },
    { id: "20", platform: "x" as const, handle: "@reaborica", profilePic: "", posts: 4532, lastExtraction: "30m ago", followers: 456000 },
    { id: "21", platform: "facebook" as const, handle: "MOPT Costa Rica", profilePic: "", posts: 987, lastExtraction: "3h ago", followers: 120000 },
    { id: "22", platform: "x" as const, handle: "@MELOACCR", profilePic: "", posts: 2341, lastExtraction: "2h ago", followers: 67000 },
    { id: "23", platform: "facebook" as const, handle: "Asamblea Legislativa CR", profilePic: "", posts: 2890, lastExtraction: "45m ago", followers: 210000 },
    { id: "24", platform: "x" as const, handle: "@AsambleaCR", profilePic: "", posts: 6789, lastExtraction: "20m ago", followers: 189000 },
    { id: "25", platform: "facebook" as const, handle: "Poder Judicial Costa Rica", profilePic: "", posts: 1456, lastExtraction: "1h ago", followers: 156000 },
    { id: "26", platform: "x" as const, handle: "@aboricadoj", profilePic: "", posts: 3456, lastExtraction: "35m ago", followers: 134000 },
    { id: "27", platform: "facebook" as const, handle: "COMEX Costa Rica", profilePic: "", posts: 678, lastExtraction: "5h ago", followers: 45000 },
    { id: "28", platform: "x" as const, handle: "@ComaboricaR", profilePic: "", posts: 2134, lastExtraction: "1h ago", followers: 56000 },
    { id: "29", platform: "facebook" as const, handle: "PROCOMER", profilePic: "", posts: 1234, lastExtraction: "2h ago", followers: 78000 },
    { id: "30", platform: "x" as const, handle: "@PROCOMER_CR", profilePic: "", posts: 4567, lastExtraction: "40m ago", followers: 89000 },
    { id: "31", platform: "facebook" as const, handle: "CINDE Costa Rica", profilePic: "", posts: 890, lastExtraction: "3h ago", followers: 67000 },
    { id: "32", platform: "x" as const, handle: "@CABORICASTA", profilePic: "", posts: 2345, lastExtraction: "1h ago", followers: 45000 },
    { id: "33", platform: "facebook" as const, handle: "AyA Costa Rica", profilePic: "", posts: 1567, lastExtraction: "2h ago", followers: 123000 },
    { id: "34", platform: "x" as const, handle: "@AyA_CR", profilePic: "", posts: 3421, lastExtraction: "45m ago", followers: 98000 },
    { id: "35", platform: "facebook" as const, handle: "SETENA Costa Rica", profilePic: "", posts: 456, lastExtraction: "6h ago", followers: 34000 },
    { id: "36", platform: "x" as const, handle: "@SETENA_CR", profilePic: "", posts: 1234, lastExtraction: "4h ago", followers: 23000 },
    { id: "37", platform: "facebook" as const, handle: "MAG Costa Rica", profilePic: "", posts: 2103, lastExtraction: "1h ago", followers: 145000 },
    { id: "38", platform: "x" as const, handle: "@MAG_CostaRica", profilePic: "", posts: 5678, lastExtraction: "30m ago", followers: 112000 },
    { id: "39", platform: "facebook" as const, handle: "SINAC Costa Rica", profilePic: "", posts: 1890, lastExtraction: "2h ago", followers: 89000 },
    { id: "40", platform: "x" as const, handle: "@SINAC_CR", profilePic: "", posts: 4532, lastExtraction: "1h ago", followers: 67000 },
    { id: "41", platform: "facebook" as const, handle: "CNE Costa Rica", profilePic: "", posts: 987, lastExtraction: "3h ago", followers: 234000 },
    { id: "42", platform: "x" as const, handle: "@CNE_CR", profilePic: "", posts: 6789, lastExtraction: "15m ago", followers: 189000 },
    { id: "43", platform: "facebook" as const, handle: "TSE Costa Rica", profilePic: "", posts: 1456, lastExtraction: "2h ago", followers: 178000 },
    { id: "44", platform: "x" as const, handle: "@TSECostaRica", profilePic: "", posts: 3456, lastExtraction: "1h ago", followers: 156000 },
    { id: "45", platform: "facebook" as const, handle: "SUGEVAL Costa Rica", profilePic: "", posts: 678, lastExtraction: "4h ago", followers: 23000 },
    { id: "46", platform: "x" as const, handle: "@SUGEVAL_CR", profilePic: "", posts: 1567, lastExtraction: "3h ago", followers: 18000 },
    { id: "47", platform: "facebook" as const, handle: "SUPEN Costa Rica", profilePic: "", posts: 456, lastExtraction: "5h ago", followers: 19000 },
    { id: "48", platform: "x" as const, handle: "@SUPEN_CR", profilePic: "", posts: 1234, lastExtraction: "4h ago", followers: 15000 },
    { id: "49", platform: "facebook" as const, handle: "CONASSIF Costa Rica", profilePic: "", posts: 345, lastExtraction: "6h ago", followers: 12000 },
    { id: "50", platform: "x" as const, handle: "@CONASSIF_CR", profilePic: "", posts: 890, lastExtraction: "5h ago", followers: 9800 },
  ];

  // Extracted posts with real X and Facebook data structure
  const extractedPosts = [
    {
      id: "1994397408550412356",
      url: "https://x.com/ATU_GobPeru/status/1994397408550412356",
      platform: "x" as const,
      verified: true,
      username: "@ATU_GobPeru",
      fullname: "Autoridad de Transporte Urbano",
      timestamp: "2025-11-28T13:26:00.000Z",
      text: "La persona afectada ha sido trasladada a una clínica cercana para recibir la atención médica correspondiente. Personal de la ATU se encuentra en el lugar a fin de garantizar la circulación de los buses para no afectar la operación y la movilidad de miles de usuarios.",
      images: [],
      likes: 2,
      replies: 0,
      retweets: 0,
      quotes: 0,
      sentiment: 0.15,
      profilePic: "https://pbs.twimg.com/profile_images/1819095731623346177/YouKV4kG.jpg"
    },
    {
      id: "1994397404724879657",
      url: "https://x.com/ATU_GobPeru/status/1994397404724879657",
      platform: "x" as const,
      verified: true,
      username: "@ATU_GobPeru",
      fullname: "Autoridad de Transporte Urbano",
      timestamp: "2025-11-28T13:26:00.000Z",
      text: "#ATUInforma | Con relación al incidente de tránsito ocurrido hoy a la altura de la estación Izaguirre en Los Olivos, donde un bus del Metropolitano atropelló a un peatón que cruzó de manera imprudente la vía exclusiva, la ATU informa lo siguiente:",
      images: ["https://pbs.twimg.com/media/G62F3bTWsAAb_7s.jpg"],
      likes: 3,
      replies: 1,
      retweets: 1,
      quotes: 0,
      sentiment: -0.25,
      profilePic: "https://pbs.twimg.com/profile_images/1819095731623346177/YouKV4kG.jpg"
    },
    {
      id: "fb-1292794656213255",
      url: "https://www.facebook.com/WHO/posts/pfbid02DjVfBJ61LDThkBXYTmYDkg4646MWsS9iMawxHLsez9WJpZYEn1oDzchHjycz54Ttl",
      platform: "facebook" as const,
      verified: true,
      username: "WHO",
      fullname: "World Health Organization (WHO)",
      timestamp: "2025-11-26T13:34:16.000Z",
      text: "Floods can have a devastating impact on health from drowning, injuries to the risk of electrocution, and even snake bites. Floods can: Contaminate drinking water, Disrupt sanitation, Create mosquito breeding sites. Stay alert. Stay safe.",
      images: ["https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/590434671_1292794642879923_5414104857014688924_n.jpg"],
      likes: 180,
      comments: 29,
      shares: 54,
      sentiment: 0.45,
      profilePic: "https://scontent-lax3-2.xx.fbcdn.net/v/t39.30808-1/488220448_9921581377887156_4002557874571876678_n.jpg"
    },
    {
      id: "1994395678923456789",
      url: "https://x.com/SUGEF_CR/status/1994395678923456789",
      platform: "x" as const,
      verified: true,
      username: "@SUGEF_CR",
      fullname: "SUGEF Costa Rica",
      timestamp: "2025-11-28T12:15:00.000Z",
      text: "COMUNICADO: La SUGEF anuncia nuevos lineamientos para la regulación de entidades fintech. Los requisitos de capital se ajustarán proporcionalmente al volumen de operaciones. #RegulacionFintech #CostaRica",
      images: [],
      likes: 234,
      replies: 45,
      retweets: 89,
      quotes: 12,
      sentiment: 0.65,
      profilePic: ""
    },
    {
      id: "fb-9876543210123456",
      url: "https://www.facebook.com/BACCredomatic/posts/9876543210123456",
      platform: "facebook" as const,
      verified: true,
      username: "BAC Credomatic",
      fullname: "BAC Credomatic",
      timestamp: "2025-11-28T11:00:00.000Z",
      text: "En BAC Credomatic apoyamos la innovación financiera, pero consideramos fundamental que todos los actores del sistema operen bajo las mismas reglas prudenciales para garantizar la estabilidad del sistema financiero costarricense.",
      images: [],
      likes: 567,
      comments: 189,
      shares: 123,
      sentiment: -0.32,
      profilePic: ""
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

  // Filter and paginate tracked accounts
  const filteredAccounts = useMemo(() => {
    return trackedAccounts.filter(account => 
      account.handle.toLowerCase().includes(accountSearchQuery.toLowerCase())
    );
  }, [accountSearchQuery]);

  const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);
  const paginatedAccounts = useMemo(() => {
    const startIndex = (currentPage - 1) * accountsPerPage;
    return filteredAccounts.slice(startIndex, startIndex + accountsPerPage);
  }, [filteredAccounts, currentPage]);

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

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
              {/* Search Bar */}
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search accounts..."
                  value={accountSearchQuery}
                  onChange={(e) => {
                    setAccountSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              {/* 4x3 Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {paginatedAccounts.map((account) => (
                  <div 
                    key={account.id}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                      {account.profilePic ? (
                        <img src={account.profilePic} alt={account.handle} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-semibold text-muted-foreground">
                          {account.handle.replace('@', '').substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        {account.platform === "facebook" ? (
                          <Facebook className="w-3 h-3 text-blue-500 flex-shrink-0" />
                        ) : (
                          <XIcon className="w-3 h-3 flex-shrink-0" />
                        )}
                        <span className="text-sm font-medium truncate">{account.handle}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatNumber(account.posts)} posts</span>
                        <span className="hidden sm:inline">-</span>
                        <span className="hidden sm:inline">{account.lastExtraction}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <span className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * accountsPerPage) + 1}-{Math.min(currentPage * accountsPerPage, filteredAccounts.length)} of {filteredAccounts.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-medium px-2">
                      {currentPage} / {totalPages}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
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
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                          {post.profilePic ? (
                            <img src={post.profilePic} alt={post.username} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs font-semibold text-muted-foreground">
                              {post.username.replace('@', '').substring(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>
                        {post.platform === "facebook" ? (
                          <Facebook className="w-4 h-4 text-blue-500" />
                        ) : (
                          <XIcon className="w-4 h-4" />
                        )}
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{post.fullname}</span>
                          <span className="text-xs text-muted-foreground">{post.username} - {formatTimestamp(post.timestamp)}</span>
                        </div>
                        {post.verified && (
                          <Badge variant="secondary" className="text-xs">Verified</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        {post.text}
                      </p>
                      {post.images && post.images.length > 0 && (
                        <div className="flex items-center gap-2 mb-3">
                          <ImageIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{post.images.length} image(s) attached</span>
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" /> {post.likes}
                        </span>
                        {post.platform === "x" ? (
                          <>
                            <span className="flex items-center gap-1">
                              <Repeat2 className="w-3 h-3" /> {post.retweets}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" /> {post.replies}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="flex items-center gap-1">
                              <Share2 className="w-3 h-3" /> {post.shares}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" /> {post.comments}
                            </span>
                          </>
                        )}
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
