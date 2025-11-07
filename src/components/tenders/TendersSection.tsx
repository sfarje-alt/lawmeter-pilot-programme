import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileSearch, ExternalLink, AlertCircle, FileText, ShoppingCart, Users, Bookmark, Share2 } from "lucide-react";

interface Tender {
  sicopId: string;
  title: string;
  institution: string;
  category: string;
  description: string;
  aiSummary: string;
  closeDateTime: string;
  publishDate: string;
  lastUpdated: string;
  status: "abierta" | "en-evaluacion" | "adjudicada" | "desierta" | "cancelada";
  relevanceScore: number;
  portfolioMatches: string[];
  unspsc: string[];
  amount: number;
  currency: string;
  location: string;
  procedureType: string;
  modality: string;
  tags: string[];
  sicopUrl: string;
}

// Mock tenders data relevant to BAC (banking sector) from SICOP
const mockTenders: Tender[] = [
  {
    sicopId: "2025LN-000012-0001400001",
    title: "Contratación de servicios de consultoría para implementación de Core Bancario",
    institution: "Banco Central de Costa Rica",
    category: "Servicios de Consultoría TI",
    description: "Se requiere contratar servicios especializados de consultoría para la implementación de un nuevo sistema de Core Bancario con integración a sistemas legacy y migración de datos.",
    aiSummary: "El BCCR busca consultoría experta para migrar su plataforma bancaria central a una solución moderna, incluyendo análisis de procesos, capacitación del personal y garantía de continuidad operativa durante la transición.",
    closeDateTime: "2025-12-15T15:00:00",
    publishDate: "2025-11-20T08:00:00",
    lastUpdated: "2025-11-25T10:30:00",
    status: "abierta",
    relevanceScore: 96,
    portfolioMatches: ["core bancario", "consultoría TI", "migración de datos", "sistemas financieros"],
    unspsc: ["81111500", "81111600", "43232700"],
    amount: 450000,
    currency: "USD",
    location: "San José, Distrito Central",
    procedureType: "Licitación Pública",
    modality: "Servicios",
    tags: ["urgent", "high-value", "banking", "IT services"],
    sicopUrl: "https://www.sicop.go.cr/moduloContratacion/licitacion/ver/2025LN-000012-0001400001"
  },
  {
    sicopId: "2025CD-000345-0002100001",
    title: "Adquisición de solución de ciberseguridad para infraestructura bancaria",
    institution: "Superintendencia General de Entidades Financieras (SUGEF)",
    category: "Tecnología - Seguridad Informática",
    description: "Compra de plataforma integrada de ciberseguridad que incluya firewall de nueva generación, IDS/IPS, SIEM, y herramientas de análisis de amenazas para proteger infraestructura crítica bancaria.",
    aiSummary: "SUGEF necesita una solución completa de ciberseguridad que proteja los sistemas financieros del país contra amenazas avanzadas, con monitoreo 24/7, detección de anomalías y respuesta automatizada a incidentes.",
    closeDateTime: "2025-11-28T16:00:00",
    publishDate: "2025-11-01T09:00:00",
    lastUpdated: "2025-11-22T14:15:00",
    status: "abierta",
    relevanceScore: 94,
    portfolioMatches: ["ciberseguridad", "firewall", "SIEM", "protección bancaria", "infraestructura crítica"],
    unspsc: ["43233200", "43233205", "81112000"],
    amount: 280000,
    currency: "USD",
    location: "San José, Distrito Central",
    procedureType: "Contratación Directa",
    modality: "Bienes y Servicios",
    tags: ["cybersecurity", "urgent", "critical-infrastructure"],
    sicopUrl: "https://www.sicop.go.cr/moduloContratacion/licitacion/ver/2025CD-000345-0002100001"
  },
  {
    sicopId: "2025LA-000089-0000800001",
    title: "Servicio de auditoría externa para cumplimiento normativo bancario",
    institution: "Consejo Nacional de Supervisión del Sistema Financiero (CONASSIF)",
    category: "Servicios Profesionales - Auditoría",
    description: "Contratación de firma de auditoría especializada en sector financiero para evaluar cumplimiento de Basel III, FATCA, y normativa local de prevención de lavado de activos.",
    aiSummary: "CONASSIF requiere auditoría experta que evalúe el cumplimiento de regulaciones internacionales y locales en entidades financieras, con enfoque en gestión de riesgos, capital regulatorio y prevención de lavado de dinero.",
    closeDateTime: "2025-12-20T15:00:00",
    publishDate: "2025-11-15T08:30:00",
    lastUpdated: "2025-11-24T11:00:00",
    status: "abierta",
    relevanceScore: 89,
    portfolioMatches: ["auditoría", "cumplimiento normativo", "Basel III", "riesgo financiero", "prevención lavado"],
    unspsc: ["86101500", "86111500"],
    amount: 120000,
    currency: "USD",
    location: "San José, Distrito Central",
    procedureType: "Licitación Abreviada",
    modality: "Servicios",
    tags: ["compliance", "audit", "regulatory"],
    sicopUrl: "https://www.sicop.go.cr/moduloContratacion/licitacion/ver/2025LA-000089-0000800001"
  },
  {
    sicopId: "2025LN-000156-0001200001",
    title: "Equipamiento de sucursales bancarias con cajeros automáticos de última generación",
    institution: "Banco Popular y de Desarrollo Comunal",
    category: "Equipamiento Bancario",
    description: "Adquisición e instalación de 50 cajeros automáticos con capacidad de reciclaje de efectivo, lector de chip EMV, NFC para pagos contactless, y conexión a red central bancaria.",
    aiSummary: "El Banco Popular moderniza su red de cajeros con tecnología avanzada que reduce costos operativos mediante reciclaje de billetes, acepta pagos sin contacto y mejora la experiencia del cliente con interfaces táctiles modernas.",
    closeDateTime: "2026-01-10T16:00:00",
    publishDate: "2025-11-18T09:00:00",
    lastUpdated: "2025-11-26T15:45:00",
    status: "abierta",
    relevanceScore: 92,
    portfolioMatches: ["cajero automático", "ATM", "reciclaje efectivo", "NFC", "EMV chip"],
    unspsc: ["44101800", "44101805"],
    amount: 2500000,
    currency: "USD",
    location: "Nacional (todas las provincias)",
    procedureType: "Licitación Pública",
    modality: "Bienes",
    tags: ["ATM", "banking-equipment", "high-value"],
    sicopUrl: "https://www.sicop.go.cr/moduloContratacion/licitacion/ver/2025LN-000156-0001200001"
  },
  {
    sicopId: "2025CD-000234-0000500001",
    title: "Licenciamiento de software de análisis de riesgo crediticio con IA",
    institution: "Banco Nacional de Costa Rica",
    category: "Software Financiero",
    description: "Adquisición de licencias de software especializado en análisis de riesgo crediticio que utilice inteligencia artificial y machine learning para evaluación de créditos comerciales y personales.",
    aiSummary: "El BNCR busca modernizar su evaluación crediticia con IA que analice automáticamente el perfil de riesgo de solicitantes, prediga morosidad y optimice la aprobación de créditos con mayor precisión y velocidad.",
    closeDateTime: "2025-11-30T17:00:00",
    publishDate: "2025-11-10T08:00:00",
    lastUpdated: "2025-11-27T09:20:00",
    status: "abierta",
    relevanceScore: 95,
    portfolioMatches: ["riesgo crediticio", "IA", "machine learning", "scoring crediticio", "análisis financiero"],
    unspsc: ["43232800", "81112100"],
    amount: 180000,
    currency: "USD",
    location: "San José, Distrito Central",
    procedureType: "Contratación Directa",
    modality: "Servicios",
    tags: ["AI", "credit-risk", "fintech"],
    sicopUrl: "https://www.sicop.go.cr/moduloContratacion/licitacion/ver/2025CD-000234-0000500001"
  },
  {
    sicopId: "2025LA-000067-0001900001",
    title: "Implementación de sistema de monitoreo de transacciones para prevención de fraude",
    institution: "Ministerio de Hacienda - Dirección de Inteligencia Financiera",
    category: "Sistemas de Monitoreo Financiero",
    description: "Desarrollo e implementación de sistema avanzado de monitoreo de transacciones financieras en tiempo real para detección de patrones sospechosos y prevención de fraude y lavado de activos.",
    aiSummary: "Hacienda requiere un sistema inteligente que monitoree todas las transacciones financieras del país en tiempo real, detecte automáticamente operaciones sospechosas mediante algoritmos avanzados y genere alertas para investigación.",
    closeDateTime: "2026-01-05T15:00:00",
    publishDate: "2025-11-12T10:00:00",
    lastUpdated: "2025-11-23T13:30:00",
    status: "abierta",
    relevanceScore: 91,
    portfolioMatches: ["monitoreo transacciones", "prevención fraude", "AML", "detección anomalías"],
    unspsc: ["81111700", "43233000"],
    amount: 520000,
    currency: "USD",
    location: "San José, Distrito Central",
    procedureType: "Licitación Abreviada",
    modality: "Servicios",
    tags: ["fraud-prevention", "AML", "real-time-monitoring"],
    sicopUrl: "https://www.sicop.go.cr/moduloContratacion/licitacion/ver/2025LA-000067-0001900001"
  },
  {
    sicopId: "2024LN-000891-0001100001",
    title: "Renovación de infraestructura de data center para servicios bancarios críticos",
    institution: "Banco de Costa Rica",
    category: "Infraestructura TI",
    description: "Actualización completa de infraestructura de data center incluyendo servidores, almacenamiento, redes, sistemas de climatización, UPS y seguridad física para garantizar disponibilidad 99.99%.",
    aiSummary: "El BCR moderniza su data center con equipamiento de última generación para soportar operaciones bancarias 24/7, incluyendo servidores redundantes, almacenamiento de alto rendimiento y sistemas de respaldo que aseguren continuidad del negocio.",
    closeDateTime: "2025-11-12T16:00:00",
    publishDate: "2024-10-15T08:00:00",
    lastUpdated: "2025-11-08T10:00:00",
    status: "adjudicada",
    relevanceScore: 88,
    portfolioMatches: ["data center", "infraestructura TI", "alta disponibilidad", "servidores bancarios"],
    unspsc: ["43211500", "43211700", "43222600"],
    amount: 3200000,
    currency: "USD",
    location: "San José, Distrito Central",
    procedureType: "Licitación Pública",
    modality: "Bienes y Servicios",
    tags: ["data-center", "high-availability", "adjudicated"],
    sicopUrl: "https://www.sicop.go.cr/moduloContratacion/licitacion/ver/2024LN-000891-0001100001"
  },
  {
    sicopId: "2025CD-000412-0000300001",
    title: "Servicios de respaldo y recuperación ante desastres (DRP) para instituciones financieras",
    institution: "Superintendencia General de Entidades Financieras (SUGEF)",
    category: "Continuidad del Negocio",
    description: "Contratación de servicios especializados de respaldo de datos, plan de recuperación ante desastres y sitio alterno para garantizar continuidad operativa de entidades financieras reguladas.",
    aiSummary: "SUGEF busca proveedor que ofrezca solución completa de DRP con respaldo automatizado de datos críticos, sitio de recuperación geográficamente separado y pruebas periódicas para asegurar recuperación en menos de 4 horas ante cualquier desastre.",
    closeDateTime: "2025-12-08T15:00:00",
    publishDate: "2025-11-05T09:30:00",
    lastUpdated: "2025-11-26T16:00:00",
    status: "abierta",
    relevanceScore: 93,
    portfolioMatches: ["DRP", "respaldo datos", "continuidad negocio", "recuperación desastres", "sitio alterno"],
    unspsc: ["81111800", "43232400"],
    amount: 340000,
    currency: "USD",
    location: "San José + Sitio Alterno (Heredia o Cartago)",
    procedureType: "Contratación Directa",
    modality: "Servicios",
    tags: ["DRP", "business-continuity", "backup"],
    sicopUrl: "https://www.sicop.go.cr/moduloContratacion/licitacion/ver/2025CD-000412-0000300001"
  },
  {
    sicopId: "2025LA-000123-0000900001",
    title: "Capacitación especializada en gestión de riesgos financieros y cumplimiento normativo",
    institution: "Instituto Centroamericano de Administración de Empresas (INCAE)",
    category: "Servicios de Capacitación",
    description: "Programa de capacitación ejecutiva para funcionarios del sector financiero en temas de gestión de riesgos, cumplimiento normativo internacional, Basel III/IV y gobierno corporativo.",
    aiSummary: "INCAE ofrece programa intensivo de formación para ejecutivos bancarios en gestión moderna de riesgos financieros, cumplimiento de regulaciones globales y mejores prácticas de gobierno corporativo, con certificación internacional.",
    closeDateTime: "2025-12-01T17:00:00",
    publishDate: "2025-11-08T08:00:00",
    lastUpdated: "2025-11-25T14:30:00",
    status: "abierta",
    relevanceScore: 85,
    portfolioMatches: ["capacitación", "gestión riesgos", "cumplimiento", "Basel", "gobierno corporativo"],
    unspsc: ["86101700", "86111700"],
    amount: 95000,
    currency: "USD",
    location: "Alajuela, Campus INCAE",
    procedureType: "Licitación Abreviada",
    modality: "Servicios",
    tags: ["training", "risk-management", "compliance"],
    sicopUrl: "https://www.sicop.go.cr/moduloContratacion/licitacion/ver/2025LA-000123-0000900001"
  },
  {
    sicopId: "2025LN-000203-0001600001",
    title: "Plataforma de banca digital y aplicaciones móviles de nueva generación",
    institution: "Banco Crédito Agrícola de Cartago",
    category: "Desarrollo de Software - Banca Digital",
    description: "Desarrollo e implementación de plataforma completa de banca digital incluyendo portal web responsive, aplicaciones móviles iOS/Android, wallet digital, y funcionalidades de open banking.",
    aiSummary: "El Banco Cartago moderniza su oferta digital con una plataforma omnicanal que permite a clientes realizar todas sus operaciones bancarias desde dispositivos móviles, incluyendo transferencias, pagos, inversiones y apertura de cuentas 100% digital.",
    closeDateTime: "2026-01-20T16:00:00",
    publishDate: "2025-11-21T10:00:00",
    lastUpdated: "2025-11-27T11:15:00",
    status: "abierta",
    relevanceScore: 97,
    portfolioMatches: ["banca digital", "app móvil", "fintech", "open banking", "wallet digital"],
    unspsc: ["81111500", "43232900"],
    amount: 680000,
    currency: "USD",
    location: "Cartago + San José",
    procedureType: "Licitación Pública",
    modality: "Servicios",
    tags: ["digital-banking", "mobile-app", "high-value", "fintech"],
    sicopUrl: "https://www.sicop.go.cr/moduloContratacion/licitacion/ver/2025LN-000203-0001600001"
  }
];

export function TendersSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [relevanceFilter, setRelevanceFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "abierta" | "en-evaluacion" | "adjudicada" | "desierta" | "cancelada">("all");

  const filteredTenders = mockTenders.filter(tender => {
    const matchesSearch = tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.unspsc.some(code => code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      tender.portfolioMatches.some(match => match.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRelevance = relevanceFilter === "all" ||
      (relevanceFilter === "high" && tender.relevanceScore >= 90) ||
      (relevanceFilter === "medium" && tender.relevanceScore >= 70 && tender.relevanceScore < 90) ||
      (relevanceFilter === "low" && tender.relevanceScore < 70);
    
    const matchesStatus = statusFilter === "all" || tender.status === statusFilter;
    
    return matchesSearch && matchesRelevance && matchesStatus;
  });

  const openTenders = filteredTenders.filter(t => t.status === "abierta");
  const highRelevanceTenders = openTenders.filter(t => t.relevanceScore >= 90);
  
  const isClosingSoon = (closeDateTime: string) => {
    const close = new Date(closeDateTime);
    const now = new Date();
    const daysUntilClose = Math.ceil((close.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilClose <= 7 && daysUntilClose > 0;
  };

  const closingSoonTenders = openTenders.filter(t => isClosingSoon(t.closeDateTime));
  
  const recentlyAdjudicated = mockTenders.filter(t => {
    if (t.status !== "adjudicada") return false;
    const updated = new Date(t.lastUpdated);
    const now = new Date();
    const daysDiff = Math.ceil((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 30;
  });

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString("es-CR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }) + " (Hora CR)";
  };

  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case "abierta": return "default";
      case "en-evaluacion": return "secondary";
      case "adjudicada": return "outline";
      case "desierta": return "destructive";
      case "cancelada": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "abierta": return "bg-green-600 hover:bg-green-700 text-white border-green-600";
      case "adjudicada": return "bg-blue-600 hover:bg-blue-700 text-white border-blue-600";
      default: return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-info/10 border border-info rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-info">Costa Rica – Monitoreo de Licitaciones (SICOP)</p>
            <p className="text-sm text-muted-foreground mt-1">
              Oportunidades de contratación pública del gobierno de Costa Rica, filtradas por palabras clave relevantes a su cartera bancaria.
              Estas licitaciones pueden representar oportunidades de negocio, alianzas estratégicas o indicar prioridades regulatorias del sector financiero.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Licitaciones Abiertas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTenders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Alta Relevancia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{highRelevanceTenders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Próximas a Cerrar (7 días)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{closingSoonTenders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Adjudicadas Recientes (30 días)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{recentlyAdjudicated.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="relative flex-1">
          <FileSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título, institución, categoría, UNSPSC o palabras clave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los Estados</SelectItem>
            <SelectItem value="abierta">Abierta</SelectItem>
            <SelectItem value="en-evaluacion">En Evaluación</SelectItem>
            <SelectItem value="adjudicada">Adjudicada</SelectItem>
            <SelectItem value="desierta">Desierta</SelectItem>
            <SelectItem value="cancelada">Cancelada</SelectItem>
          </SelectContent>
        </Select>
        <Select value={relevanceFilter} onValueChange={(value: "all" | "high" | "medium" | "low") => setRelevanceFilter(value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Relevancia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toda Relevancia</SelectItem>
            <SelectItem value="high">Alta (90%+)</SelectItem>
            <SelectItem value="medium">Media (70-89%)</SelectItem>
            <SelectItem value="low">Baja (&lt;70%)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredTenders.map(tender => (
          <Card key={tender.sicopId} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <FileSearch className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-semibold text-lg">{tender.title}</h3>
                        <Badge 
                          variant={getStatusBadgeVariant(tender.status)}
                          className={tender.status === "abierta" || tender.status === "adjudicada" ? getStatusColor(tender.status) : ""}
                        >
                          {tender.status.toUpperCase()}
                        </Badge>
                        {isClosingSoon(tender.closeDateTime) && tender.status === "abierta" && (
                          <Badge variant="outline" className="border-warning text-warning">
                            Cierra Pronto
                          </Badge>
                        )}
                      </div>
                      
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-3">
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className="text-xs bg-primary/10 border-primary/30 flex-shrink-0">
                            AI Summary
                          </Badge>
                          <p className="text-sm font-medium leading-relaxed">{tender.aiSummary}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-3">
                        <div className="flex items-start gap-2 text-sm">
                          <span className="font-semibold min-w-[140px]">ID SICOP:</span>
                          <span className="text-primary font-medium">{tender.sicopId}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <span className="font-semibold min-w-[140px]">Cierre:</span>
                          <span className="text-muted-foreground">{formatDateTime(tender.closeDateTime)}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <span className="font-semibold min-w-[140px]">Institución:</span>
                          <span className="text-muted-foreground">{tender.institution}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <span className="font-semibold min-w-[140px]">Categoría:</span>
                          <span className="text-muted-foreground">{tender.category}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <span className="font-semibold min-w-[140px]">Tipo Procedimiento:</span>
                          <span className="text-muted-foreground">{tender.procedureType}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <span className="font-semibold min-w-[140px]">Modalidad:</span>
                          <span className="text-muted-foreground">{tender.modality}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <span className="font-semibold min-w-[140px]">Monto Estimado:</span>
                          <span className="text-muted-foreground font-semibold">
                            {new Intl.NumberFormat('es-CR', { style: 'currency', currency: tender.currency }).format(tender.amount)}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <span className="font-semibold min-w-[140px]">Ubicación:</span>
                          <span className="text-muted-foreground">{tender.location}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <span className="font-semibold min-w-[140px]">Publicación:</span>
                          <span className="text-muted-foreground text-xs">{formatDateTime(tender.publishDate)}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <span className="font-semibold min-w-[140px]">Relevancia:</span>
                          <Badge variant="outline" className="text-xs">
                            {tender.relevanceScore}% match
                          </Badge>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <span className="font-semibold min-w-[140px]">Última Actualización:</span>
                          <span className="text-muted-foreground text-xs">{formatDateTime(tender.lastUpdated)}</span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="text-xs font-semibold text-muted-foreground mb-1">Códigos UNSPSC:</div>
                        <div className="flex flex-wrap gap-1">
                          {tender.unspsc.map(code => (
                            <Badge key={code} variant="secondary" className="text-xs font-mono">
                              {code}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="text-xs font-semibold text-muted-foreground mb-1">Palabras Clave:</div>
                        <div className="flex flex-wrap gap-1">
                          {tender.portfolioMatches.map(match => (
                            <Badge key={match} variant="outline" className="text-xs">
                              {match}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="text-xs font-semibold text-muted-foreground mb-1">Tags:</div>
                        <div className="flex flex-wrap gap-1">
                          {tender.tags.map(tag => (
                            <Badge key={tag} className="text-xs bg-accent text-accent-foreground">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Button size="sm" asChild>
                          <a href={tender.sicopUrl} target="_blank" rel="noopener noreferrer">
                            Abrir en SICOP
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-3 w-3 mr-1" />
                          Expediente Electrónico
                        </Button>
                        <Button size="sm" variant="outline">
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Compra por Catálogo
                        </Button>
                        <Button size="sm" variant="outline">
                          <Users className="h-3 w-3 mr-1" />
                          Consulta Proveedores
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Bookmark className="h-3 w-3 mr-1" />
                          Guardar
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Share2 className="h-3 w-3 mr-1" />
                          Compartir
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTenders.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FileSearch className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No se encontraron licitaciones que coincidan con tu búsqueda</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
