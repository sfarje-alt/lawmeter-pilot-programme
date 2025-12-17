import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CountryFlag } from "@/components/shared/CountryFlag";
import { 
  TrendingUp, TrendingDown, Minus, Newspaper, Users, Building2, Info, 
  Facebook, Settings, Download, Calendar, BarChart3, MessageCircle,
  Clock, Bell, FileText, Plus, Eye, Heart, Share2, Mail, Search,
  ChevronLeft, ChevronRight, MessageSquare, Repeat2, Image as ImageIcon, X
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

  // 50 tracked accounts data
  const trackedAccounts = [
    { id: "1", platform: "facebook" as const, handle: "World Health Organization (WHO)", posts: 1847, lastExtraction: "15m ago", followers: 14200000 },
    { id: "2", platform: "x" as const, handle: "@ATU_GobPeru", posts: 13398, lastExtraction: "10m ago", followers: 59727 },
    { id: "3", platform: "facebook" as const, handle: "UNICEF", posts: 2341, lastExtraction: "20m ago", followers: 16500000 },
    { id: "4", platform: "x" as const, handle: "@MTC_GobPeru", posts: 8742, lastExtraction: "5m ago", followers: 125000 },
    { id: "5", platform: "facebook" as const, handle: "European Commission", posts: 3256, lastExtraction: "30m ago", followers: 2800000 },
    { id: "6", platform: "x" as const, handle: "@SUGEF_CR", posts: 892, lastExtraction: "1h ago", followers: 45000 },
    { id: "7", platform: "facebook" as const, handle: "BAC Credomatic", posts: 1567, lastExtraction: "2h ago", followers: 890000 },
    { id: "8", platform: "x" as const, handle: "@BCCRCostaRica", posts: 3421, lastExtraction: "45m ago", followers: 78000 },
    { id: "9", platform: "facebook" as const, handle: "Banco Nacional Costa Rica", posts: 2103, lastExtraction: "1h ago", followers: 1200000 },
    { id: "10", platform: "x" as const, handle: "@AsofintechCR", posts: 456, lastExtraction: "3h ago", followers: 12000 },
    { id: "11", platform: "facebook" as const, handle: "Ministerio de Salud CR", posts: 1890, lastExtraction: "25m ago", followers: 450000 },
    { id: "12", platform: "x" as const, handle: "@presidaborici", posts: 5678, lastExtraction: "20m ago", followers: 890000 },
    { id: "13", platform: "facebook" as const, handle: "CCSS Costa Rica", posts: 2345, lastExtraction: "40m ago", followers: 670000 },
    { id: "14", platform: "x" as const, handle: "@LaRepublicaCR", posts: 12456, lastExtraction: "5m ago", followers: 234000 },
    { id: "15", platform: "facebook" as const, handle: "Defensoría de los Habitantes", posts: 1234, lastExtraction: "2h ago", followers: 180000 },
    { id: "16", platform: "x" as const, handle: "@CRHoyNews", posts: 18923, lastExtraction: "3m ago", followers: 567000 },
    { id: "17", platform: "facebook" as const, handle: "Camara de Comercio de Costa Rica", posts: 890, lastExtraction: "4h ago", followers: 95000 },
    { id: "18", platform: "x" as const, handle: "@elmaborici", posts: 7845, lastExtraction: "15m ago", followers: 123000 },
    { id: "19", platform: "facebook" as const, handle: "ICE Costa Rica", posts: 1567, lastExtraction: "1h ago", followers: 340000 },
    { id: "20", platform: "x" as const, handle: "@reaborica", posts: 4532, lastExtraction: "30m ago", followers: 456000 },
    { id: "21", platform: "facebook" as const, handle: "MOPT Costa Rica", posts: 987, lastExtraction: "3h ago", followers: 120000 },
    { id: "22", platform: "x" as const, handle: "@MELOACCR", posts: 2341, lastExtraction: "2h ago", followers: 67000 },
    { id: "23", platform: "facebook" as const, handle: "Asamblea Legislativa CR", posts: 2890, lastExtraction: "45m ago", followers: 210000 },
    { id: "24", platform: "x" as const, handle: "@AsambleaCR", posts: 6789, lastExtraction: "20m ago", followers: 189000 },
    { id: "25", platform: "facebook" as const, handle: "Poder Judicial Costa Rica", posts: 1456, lastExtraction: "1h ago", followers: 156000 },
    { id: "26", platform: "x" as const, handle: "@aboricadoj", posts: 3456, lastExtraction: "35m ago", followers: 134000 },
    { id: "27", platform: "facebook" as const, handle: "COMEX Costa Rica", posts: 678, lastExtraction: "5h ago", followers: 45000 },
    { id: "28", platform: "x" as const, handle: "@ComaboricaR", posts: 2134, lastExtraction: "1h ago", followers: 56000 },
    { id: "29", platform: "facebook" as const, handle: "PROCOMER", posts: 1234, lastExtraction: "2h ago", followers: 78000 },
    { id: "30", platform: "x" as const, handle: "@PROCOMER_CR", posts: 4567, lastExtraction: "40m ago", followers: 89000 },
    { id: "31", platform: "facebook" as const, handle: "CINDE Costa Rica", posts: 890, lastExtraction: "3h ago", followers: 67000 },
    { id: "32", platform: "x" as const, handle: "@CABORICASTA", posts: 2345, lastExtraction: "1h ago", followers: 45000 },
    { id: "33", platform: "facebook" as const, handle: "AyA Costa Rica", posts: 1567, lastExtraction: "2h ago", followers: 123000 },
    { id: "34", platform: "x" as const, handle: "@AyA_CR", posts: 3421, lastExtraction: "45m ago", followers: 98000 },
    { id: "35", platform: "facebook" as const, handle: "SETENA Costa Rica", posts: 456, lastExtraction: "6h ago", followers: 34000 },
    { id: "36", platform: "x" as const, handle: "@SETENA_CR", posts: 1234, lastExtraction: "4h ago", followers: 23000 },
    { id: "37", platform: "facebook" as const, handle: "MAG Costa Rica", posts: 2103, lastExtraction: "1h ago", followers: 145000 },
    { id: "38", platform: "x" as const, handle: "@MAG_CostaRica", posts: 5678, lastExtraction: "30m ago", followers: 112000 },
    { id: "39", platform: "facebook" as const, handle: "SINAC Costa Rica", posts: 1890, lastExtraction: "2h ago", followers: 89000 },
    { id: "40", platform: "x" as const, handle: "@SINAC_CR", posts: 4532, lastExtraction: "1h ago", followers: 67000 },
    { id: "41", platform: "facebook" as const, handle: "CNE Costa Rica", posts: 987, lastExtraction: "3h ago", followers: 234000 },
    { id: "42", platform: "x" as const, handle: "@CNE_CR", posts: 6789, lastExtraction: "15m ago", followers: 189000 },
    { id: "43", platform: "facebook" as const, handle: "TSE Costa Rica", posts: 1456, lastExtraction: "2h ago", followers: 178000 },
    { id: "44", platform: "x" as const, handle: "@TSECostaRica", posts: 3456, lastExtraction: "1h ago", followers: 156000 },
    { id: "45", platform: "facebook" as const, handle: "SUGEVAL Costa Rica", posts: 678, lastExtraction: "4h ago", followers: 23000 },
    { id: "46", platform: "x" as const, handle: "@SUGEVAL_CR", posts: 1567, lastExtraction: "3h ago", followers: 18000 },
    { id: "47", platform: "facebook" as const, handle: "SUPEN Costa Rica", posts: 456, lastExtraction: "5h ago", followers: 19000 },
    { id: "48", platform: "x" as const, handle: "@SUPEN_CR", posts: 1234, lastExtraction: "4h ago", followers: 15000 },
    { id: "49", platform: "facebook" as const, handle: "CONASSIF Costa Rica", posts: 345, lastExtraction: "6h ago", followers: 12000 },
    { id: "50", platform: "x" as const, handle: "@CONASSIF_CR", posts: 890, lastExtraction: "5h ago", followers: 9800 },
  ];

  // Toggle account selection for filtering posts
  const toggleAccountSelection = (handle: string) => {
    setSelectedAccounts(prev => 
      prev.includes(handle) 
        ? prev.filter(h => h !== handle)
        : [...prev, handle]
    );
  };

  // Clear all selected accounts
  const clearSelectedAccounts = () => setSelectedAccounts([]);

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
      sentiment: 0.15
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
      sentiment: -0.25
    },
    {
      id: "fb-1292794656213255",
      url: "https://www.facebook.com/WHO/posts/pfbid02DjVfBJ61LDThkBXYTmYDkg4646MWsS9iMawxHLsez9WJpZYEn1oDzchHjycz54Ttl",
      platform: "facebook" as const,
      verified: true,
      username: "World Health Organization (WHO)",
      fullname: "World Health Organization (WHO)",
      timestamp: "2025-11-26T13:34:16.000Z",
      text: "Floods can have a devastating impact on health from drowning, injuries to the risk of electrocution, and even snake bites. Floods can: Contaminate drinking water, Disrupt sanitation, Create mosquito breeding sites. Stay alert. Stay safe.",
      images: ["https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/590434671_1292794642879923_5414104857014688924_n.jpg"],
      likes: 180,
      comments: 29,
      shares: 54,
      sentiment: 0.45
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
      sentiment: 0.65
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
      sentiment: -0.32
    }
  ];

  // Filter posts by selected accounts
  const filteredPosts = useMemo(() => {
    if (selectedAccounts.length === 0) return extractedPosts;
    return extractedPosts.filter(post => selectedAccounts.includes(post.username));
  }, [selectedAccounts]);

  // Single standard monthly report configuration
  const scheduledReport = {
    name: "Monthly Social Activity Report",
    frequency: "Monthly",
    nextRun: "Jan 1, 2025",
    lastRun: "Dec 1, 2024",
    status: "active",
    description: "Comprehensive narrative report on social media activity across all tracked accounts"
  };

  const reportRepository = [
    { id: "1", name: "Monthly Social Activity Report - December 2024", date: "Dec 1, 2024", size: "4.2 MB" },
    { id: "2", name: "Monthly Social Activity Report - November 2024", date: "Nov 1, 2024", size: "3.8 MB" },
    { id: "3", name: "Monthly Social Activity Report - October 2024", date: "Oct 1, 2024", size: "4.5 MB" },
    { id: "4", name: "Monthly Social Activity Report - September 2024", date: "Sep 1, 2024", size: "3.9 MB" },
    { id: "5", name: "Monthly Social Activity Report - August 2024", date: "Aug 1, 2024", size: "4.1 MB" },
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
      country: "costa-rica",
      headline: "Ley Fintech Promete Modernización Bancaria, BAC Alerta Sobre Riesgos",
      sentiment: "neutral" as const,
      score: 0.08,
      date: "2025-01-16",
      excerpt: "El proyecto de regulación fintech ha generado debate en la Asamblea. Mientras el gobierno destaca innovación, el sector bancario tradicional señala preocupaciones sobre competencia desleal...",
      reach: "850K lectores"
    },
    {
      source: "El Financiero",
      country: "costa-rica",
      headline: "BAC y Banca Privada Exigen Igualdad Regulatoria ante Avance Fintech",
      sentiment: "negative" as const,
      score: -0.62,
      date: "2025-01-15",
      excerpt: "Los principales bancos del país, liderados por BAC, han manifestado su rechazo a disposiciones que permitirían a plataformas fintech operar con menores requisitos de capital y liquidez...",
      reach: "420K lectores"
    },
    {
      source: "CRHoy",
      country: "costa-rica",
      headline: "SUGEF Respalda Marco Regulatorio que Equilibra Innovación y Estabilidad",
      sentiment: "positive" as const,
      score: 0.71,
      date: "2025-01-14",
      excerpt: "La Superintendencia General de Entidades Financieras destacó que el proyecto incluye salvaguardas prudenciales adecuadas para proteger el sistema financiero nacional...",
      reach: "320K lectores"
    },
    {
      source: "Semanario Universidad",
      country: "costa-rica",
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
              {/* Selected accounts filter indicator */}
              {selectedAccounts.length > 0 && (
                <div className="flex items-center gap-2 mb-4 p-2 bg-primary/10 rounded-lg">
                  <span className="text-sm font-medium">Filtering posts by {selectedAccounts.length} account(s)</span>
                  <Button variant="ghost" size="sm" onClick={clearSelectedAccounts} className="h-6 px-2 text-xs">
                    <X className="w-3 h-3 mr-1" />
                    Clear
                  </Button>
                </div>
              )}

              {/* 4x3 Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {paginatedAccounts.map((account) => {
                  const isSelected = selectedAccounts.includes(account.handle);
                  return (
                    <div 
                      key={account.id}
                      onClick={() => toggleAccountSelection(account.handle)}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                        isSelected 
                          ? 'bg-primary/10 border-primary' 
                          : 'bg-card hover:bg-muted/50'
                      }`}
                    >
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
                  );
                })}
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
                      {selectedAccounts.length > 0 
                        ? `Showing posts from ${selectedAccounts.length} selected account(s)`
                        : "Recent posts with sentiment analysis"}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No posts found for selected accounts</p>
                  <Button variant="link" size="sm" onClick={clearSelectedAccounts}>
                    Clear filter
                  </Button>
                </div>
              ) : (
                filteredPosts.map((post) => (
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
                ))
              )}
            </CardContent>
          </Card>

          {/* Social Activity Reports - Unified Configuration & Repository */}
          <Card className="border-primary/20">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Social Activity Reports</CardTitle>
                    <CardDescription>
                      Automated narrative reports on social media activity
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="w-4 h-4" />
                    Configure
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="w-4 h-4" />
                    View All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Active Report Schedule */}
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{scheduledReport.name}</div>
                      <div className="text-xs text-muted-foreground mb-1">
                        {scheduledReport.frequency} - Next: {scheduledReport.nextRun}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {scheduledReport.description}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                    Active
                  </Badge>
                </div>
              </div>

              {/* Report Repository List */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground px-1">Previous Reports</div>
                {reportRepository.slice(0, 4).map((report, index) => (
                  <div 
                    key={report.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                      index === 0 
                        ? "bg-primary/5 border-primary/30 hover:bg-primary/10" 
                        : "bg-card hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className={`w-4 h-4 ${index === 0 ? "text-primary" : "text-muted-foreground"}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate max-w-[280px]">{report.name}</span>
                          {index === 0 && (
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs px-1.5 py-0">
                              Latest
                            </Badge>
                          )}
                        </div>
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
              </div>
            </CardContent>
          </Card>

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
        <TabsContent value="press" className="space-y-6 mt-6">
          <Card className="border-primary/20">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Newspaper className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Press Coverage</CardTitle>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {pressCoverage.map((article, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CountryFlag countryKey={article.country} size="sm" />
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{article.source}</span>
                          <span className="text-xs text-muted-foreground">{article.reach} - {article.date}</span>
                        </div>
                      </div>
                      <h4 className="font-semibold text-sm mb-2 leading-tight">{article.headline}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{article.excerpt}</p>
                    </div>
                    <div className="flex flex-col items-center gap-1 p-3 rounded-lg border bg-background">
                      {article.score >= 0.3 ? (
                        <TrendingUp className="w-4 h-4 text-success" />
                      ) : article.score <= -0.3 ? (
                        <TrendingDown className="w-4 h-4 text-destructive" />
                      ) : (
                        <Minus className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className={`text-sm font-bold ${
                        article.score >= 0.3 ? "text-success" : 
                        article.score <= -0.3 ? "text-destructive" : 
                        "text-muted-foreground"
                      }`}>
                        {article.score > 0 ? '+' : ''}{article.score.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Organizations Tab */}
        <TabsContent value="custom-orgs" className="space-y-6 mt-6">
          <Card className="border-primary/20">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Custom Organizations</CardTitle>
                    <CardDescription>
                      Website and newsletter extraction upon request
                    </CardDescription>
                  </div>
                </div>
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Request Extraction
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {customOrganizations.map((org, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{org.organization}</span>
                          <span className="text-xs text-muted-foreground">{org.type} - {org.date}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs ml-2">{org.followers} followers</Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
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
                        <Badge variant={org.position.includes("Support") ? "default" : org.position.includes("Opposition") ? "destructive" : "secondary"} className="text-xs">
                          {org.position}
                        </Badge>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3 mt-2">
                        <p className="text-sm text-muted-foreground leading-relaxed italic">"{org.statement}"</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1 p-3 rounded-lg border bg-background">
                      {org.score >= 0.3 ? (
                        <TrendingUp className="w-4 h-4 text-success" />
                      ) : org.score <= -0.3 ? (
                        <TrendingDown className="w-4 h-4 text-destructive" />
                      ) : (
                        <Minus className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className={`text-sm font-bold ${
                        org.score >= 0.3 ? "text-success" : 
                        org.score <= -0.3 ? "text-destructive" : 
                        "text-muted-foreground"
                      }`}>
                        {org.score > 0 ? '+' : ''}{org.score.toFixed(2)}
                      </span>
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
