// Demo Analyzed Card - Shows a hardcoded demo session with mock analysis

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Video, 
  Star, 
  CheckCircle2, 
  ChevronDown,
  Calendar,
  Building,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Target,
  Zap,
  Users,
  MessageSquare
} from 'lucide-react';

// Mock analysis data for the demo
const mockAnalysis = {
  executiveSummary: "Esta sesión extraordinaria de la Comisión de Salud y Población abordó reformas críticas del sistema de salud incluyendo controles de precios de medicamentos, regulaciones de telemedicina e inversiones en infraestructura de salud pública. Los debates clave se centraron en políticas de importación de medicamentos y su potencial impacto en empresas farmacéuticas que operan en Perú.",
  relevanceScore: 87,
  relevanceCategory: "High",
  keyTopics: [
    {
      topic: "Control de Precios de Medicamentos",
      details: "Discusión sobre nuevos mecanismos de regulación de precios para medicamentos esenciales y genéricos.",
      relevance: "Direct",
      timestamp: "00:15:32"
    },
    {
      topic: "Regulación de Telemedicina",
      details: "Propuestas para expandir servicios de salud digital y establecer marcos regulatorios para consultas virtuales.",
      relevance: "Direct",
      timestamp: "00:42:18"
    },
    {
      topic: "Certificación de Dispositivos Médicos",
      details: "Revisión de requisitos de certificación para equipos médicos importados y fabricados localmente.",
      relevance: "Indirect",
      timestamp: "01:05:44"
    },
    {
      topic: "Infraestructura Hospitalaria",
      details: "Plan de inversión para modernización de hospitales públicos en regiones rurales.",
      relevance: "Background",
      timestamp: "01:28:15"
    }
  ],
  regulatoryMentions: [
    {
      type: "Proyecto de Ley",
      quote: "El proyecto de ley 4521/2024-CR propone establecer un tope de precios para medicamentos oncológicos...",
      implication: "Impacto directo en márgenes de distribuidores farmacéuticos",
      timestamp: "00:22:45"
    },
    {
      type: "Modificación Reglamentaria",
      quote: "Se plantea modificar el reglamento de DIGEMID para acelerar el registro sanitario...",
      implication: "Podría reducir tiempos de entrada al mercado para nuevos productos",
      timestamp: "00:58:12"
    },
    {
      type: "Norma Técnica",
      quote: "La nueva norma técnica de telemedicina establecerá requisitos mínimos de infraestructura...",
      implication: "Requerimientos de inversión para proveedores de servicios digitales de salud",
      timestamp: "01:15:33"
    }
  ],
  actionItems: [
    {
      action: "Votación del Proyecto de Ley 4521",
      deadline: "Próxima sesión ordinaria",
      responsible: "Pleno de la Comisión",
      timestamp: "01:45:20"
    },
    {
      action: "Consulta con DIGEMID",
      deadline: "15 días",
      responsible: "Mesa Directiva",
      timestamp: "01:52:08"
    },
    {
      action: "Audiencia pública sobre telemedicina",
      deadline: "Enero 2025",
      responsible: "Subcomisión de Salud Digital",
      timestamp: "02:05:42"
    },
    {
      action: "Informe de impacto económico",
      deadline: "30 días",
      responsible: "Asesoría técnica",
      timestamp: "02:18:35"
    }
  ],
  speakerSentiments: [
    {
      speaker: "Presidente de la Comisión",
      sentiment: "Favorable",
      position: "Apoyo firme a regulación de precios",
      timestamp: "00:08:15"
    },
    {
      speaker: "Congresista García",
      sentiment: "Neutral",
      position: "Solicita mayor análisis de impacto antes de votar",
      timestamp: "00:35:22"
    },
    {
      speaker: "Representante MINSA",
      sentiment: "Favorable",
      position: "Presenta datos de acceso a medicamentos",
      timestamp: "01:02:48"
    }
  ],
  clientImpact: {
    "Empresas Farmacéuticas": "Alto - Cambios en estructura de precios afectarán márgenes",
    "Distribuidores de Dispositivos Médicos": "Medio - Nuevos requisitos de certificación",
    "Proveedores de Telemedicina": "Alto - Oportunidad de expansión con nuevo marco regulatorio",
    "Aseguradoras de Salud": "Medio - Posibles ajustes en coberturas obligatorias"
  }
};

export function DemoAnalyzedCard() {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRelevanceBadge = () => {
    return (
      <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
        <CheckCircle className="h-3 w-3 mr-1" />
        High Relevance ({mockAnalysis.relevanceScore}/100)
      </Badge>
    );
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <Card className="border-primary bg-primary/5">
        <CardContent className="pt-4">
          <div className="flex flex-col gap-3">
            {/* Demo Badge */}
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                <Sparkles className="h-3 w-3 mr-1" />
                Demo: Fully Analyzed Session
              </Badge>
            </div>

            {/* Header Row */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Recommended - Commission in your watchlist</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                    <Calendar className="h-3 w-3 mr-1" />
                    Scheduled
                  </Badge>
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                    <Video className="h-3 w-3 mr-1" />
                    Video Found
                  </Badge>
                  <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Analyzed
                  </Badge>
                  {getRelevanceBadge()}
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <h3 className="font-semibold text-foreground line-clamp-1">
                    SALUD Y POBLACIÓN
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span className="capitalize">Miércoles, 17 de Diciembre 2025, 18:15</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="default" size="sm">
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Selected for Monitoring</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button
                  variant="default"
                  size="sm"
                  className="gap-2 bg-green-600 hover:bg-green-700"
                  onClick={() => window.open('https://www.youtube.com/watch?v=Ux0Sn3C3bKE', '_blank')}
                >
                  <Video className="h-4 w-4" />
                  Open Video
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-purple-500/50 text-purple-600"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <Sparkles className="h-4 w-4" />
                  AI Analysis
                </Button>

                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>

            {/* Expanded Content */}
            <CollapsibleContent>
              <div className="pt-4 border-t border-border/50 space-y-4">
                {/* Session Title */}
                <div>
                  <span className="text-xs text-muted-foreground">Session Title</span>
                  <p className="font-medium text-foreground">
                    SEGUNDA SESIÓN EXTRAORDINARIA DE LA COMISIÓN DE SALUD Y POBLACIÓN
                  </p>
                </div>

                {/* Video Embed */}
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/Ux0Sn3C3bKE"
                    title="Session Recording"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* AI Analysis Results */}
                <div className="bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-lg p-4 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    <h4 className="font-semibold text-foreground">AI Analysis Results</h4>
                    <span className="text-xs text-muted-foreground ml-auto">
                      Analyzed: Dec 17, 2025 19:45
                    </span>
                  </div>
                  
                  {/* Executive Summary */}
                  <div className="bg-background/50 rounded-md p-3 mb-4">
                    <h5 className="text-sm font-medium text-foreground mb-2">Executive Summary</h5>
                    <p className="text-sm text-muted-foreground">{mockAnalysis.executiveSummary}</p>
                  </div>

                  <Accordion type="single" collapsible className="space-y-2">
                    {/* Key Topics */}
                    <AccordionItem value="topics" className="border border-border/50 rounded-lg px-3">
                      <AccordionTrigger className="py-2 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-blue-500" />
                          Key Topics ({mockAnalysis.keyTopics.length})
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-3">
                        <div className="space-y-2">
                          {mockAnalysis.keyTopics.map((topic, idx) => (
                            <div key={idx} className="bg-background/50 rounded-md p-2">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="font-mono text-xs">
                                  {topic.timestamp}
                                </Badge>
                                <Badge variant="outline" className={
                                  topic.relevance === 'Direct' ? 'border-green-500/50 text-green-600' :
                                  topic.relevance === 'Indirect' ? 'border-amber-500/50 text-amber-600' :
                                  'border-slate-500/50 text-slate-600'
                                }>
                                  {topic.relevance}
                                </Badge>
                                <span className="font-medium text-sm">{topic.topic}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">{topic.details}</p>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Regulatory Mentions */}
                    <AccordionItem value="regulatory" className="border border-border/50 rounded-lg px-3">
                      <AccordionTrigger className="py-2 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          Regulatory Mentions ({mockAnalysis.regulatoryMentions.length})
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-3">
                        <div className="space-y-2">
                          {mockAnalysis.regulatoryMentions.map((mention, idx) => (
                            <div key={idx} className="bg-background/50 rounded-md p-2">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="font-mono text-xs">
                                  {mention.timestamp}
                                </Badge>
                                <Badge variant="outline">{mention.type}</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground italic mb-1">"{mention.quote}"</p>
                              <p className="text-xs font-medium text-foreground">{mention.implication}</p>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Action Items */}
                    <AccordionItem value="actions" className="border border-border/50 rounded-lg px-3">
                      <AccordionTrigger className="py-2 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Action Items ({mockAnalysis.actionItems.length})
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-3">
                        <div className="space-y-2">
                          {mockAnalysis.actionItems.map((item, idx) => (
                            <div key={idx} className="bg-background/50 rounded-md p-2">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="font-mono text-xs">
                                  {item.timestamp}
                                </Badge>
                                <span className="font-medium text-sm">{item.action}</span>
                              </div>
                              <div className="flex gap-4 text-xs text-muted-foreground">
                                <span>Deadline: {item.deadline}</span>
                                <span>Responsible: {item.responsible}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Speaker Sentiments */}
                    <AccordionItem value="speakers" className="border border-border/50 rounded-lg px-3">
                      <AccordionTrigger className="py-2 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-indigo-500" />
                          Speaker Sentiments ({mockAnalysis.speakerSentiments.length})
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-3">
                        <div className="space-y-2">
                          {mockAnalysis.speakerSentiments.map((speaker, idx) => (
                            <div key={idx} className="bg-background/50 rounded-md p-2">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="font-mono text-xs">
                                  {speaker.timestamp}
                                </Badge>
                                <Badge variant="outline" className={
                                  speaker.sentiment === 'Favorable' ? 'border-green-500/50 text-green-600' :
                                  speaker.sentiment === 'Neutral' ? 'border-amber-500/50 text-amber-600' :
                                  'border-red-500/50 text-red-600'
                                }>
                                  {speaker.sentiment}
                                </Badge>
                                <span className="font-medium text-sm">{speaker.speaker}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">{speaker.position}</p>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Client Impact */}
                    <AccordionItem value="impact" className="border border-border/50 rounded-lg px-3">
                      <AccordionTrigger className="py-2 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-orange-500" />
                          Client Impact Assessment
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-3">
                        <div className="grid gap-2">
                          {Object.entries(mockAnalysis.clientImpact).map(([key, value]) => (
                            <div key={key} className="bg-background/50 rounded-md p-2">
                              <span className="text-xs font-medium text-foreground">{key}</span>
                              <p className="text-xs text-muted-foreground">{value}</p>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </CardContent>
      </Card>
    </Collapsible>
  );
}
