// Demo Analyzed Card - Fully analyzed session card for demonstration

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  Brain,
  Sparkles,
  Target,
  AlertTriangle,
  Users,
  Zap,
  FileText,
  CheckCircle,
  ExternalLink,
  Clock
} from 'lucide-react';

// Demo analysis data for "SEGUNDA SESIÓN EXTRAORDINARIA DE LA COMISIÓN DE SALUD Y POBLACIÓN"
const DEMO_ANALYSIS = {
  relevanceScore: 87,
  relevanceCategory: 'High',
  executiveSummary: 'This extraordinary session of the Health and Population Commission addressed critical healthcare reforms including pharmaceutical pricing controls, telemedicine regulations, and public health infrastructure investments. Key debates centered on drug import policies and their potential impact on pharmaceutical companies operating in Peru. The commission reviewed draft legislation that could significantly affect medical device certification requirements and digital health service providers.',
  keyTopics: [
    { 
      topic: 'Pharmaceutical Pricing Regulation', 
      relevance: 'Direct', 
      timestamp: '00:15:32',
      details: 'Discussion of price cap legislation for essential medicines under consideration in draft bill PL-2025-1234. Proposed 15% price reduction on generic medications.' 
    },
    { 
      topic: 'Telemedicine Framework', 
      relevance: 'Direct', 
      timestamp: '00:48:17',
      details: 'New regulatory framework for remote healthcare service providers including licensing requirements, data protection standards, and cross-border service provisions.' 
    },
    { 
      topic: 'Medical Device Certification', 
      relevance: 'Direct', 
      timestamp: '01:22:45',
      details: 'Updates to DIGEMID requirements for Class II and Class III medical device imports, including new documentation requirements.' 
    },
    { 
      topic: 'Public Health Funding 2026', 
      relevance: 'Indirect', 
      timestamp: '01:58:03',
      details: 'Budget allocation discussions for public health infrastructure, hospital modernization, and rural healthcare access programs.' 
    },
  ],
  regulatoryMentions: [
    { 
      type: 'Drug Import Regulations', 
      timestamp: '00:23:18',
      quote: 'Se propone modificar el artículo 15 del reglamento de importación de medicamentos para agilizar los procesos de registro sanitario...', 
      implication: 'May affect pharmaceutical import licensing requirements and timeline for product approvals' 
    },
    { 
      type: 'Digital Health Standards', 
      timestamp: '00:52:41',
      quote: 'Los proveedores de telemedicina deberán cumplir con los estándares de protección de datos personales establecidos en la Ley 29733...', 
      implication: 'New compliance requirements for telehealth platforms including data localization and patient consent protocols' 
    },
    { 
      type: 'Medical Device Registration', 
      timestamp: '01:31:55',
      quote: 'Se actualizarán los requisitos técnicos para el registro de dispositivos médicos de clase II y III...', 
      implication: 'Updated technical dossier requirements may require additional testing and documentation' 
    },
  ],
  actionItems: [
    'Monitor draft bill PL-2025-1234 on pharmaceutical price caps - committee vote scheduled for January 2026',
    'Review updated DIGEMID requirements for medical device imports - new forms available February 2026',
    'Assess telemedicine compliance requirements for digital health clients',
    'Track public procurement opportunities in hospital modernization program',
  ],
  speakerSentiments: [
    { 
      speaker: 'Congresista María García (Chair)', 
      position: 'Supportive', 
      timestamp: '00:18:42',
      keyStatement: 'This reform will benefit millions of Peruvians who struggle to afford essential medications. We must prioritize public health over corporate profits.' 
    },
    { 
      speaker: 'Congresista Roberto Mendoza', 
      position: 'Opposed', 
      timestamp: '00:35:28',
      keyStatement: 'We must consider the impact on pharmaceutical investment in Peru. Price controls could reduce access to innovative treatments and harm our biotechnology sector.' 
    },
    { 
      speaker: 'Congresista Ana Torres', 
      position: 'Neutral', 
      timestamp: '01:45:11',
      keyStatement: 'I support the goals of this legislation but believe we need more data on potential market impacts before proceeding with such significant changes.' 
    },
  ],
  clientImpact: {
    productSafety: 'Medium - New labeling requirements for pharmaceutical products discussed',
    radioRegulations: 'Low - Not addressed in this session',
    cybersecurity: 'High - Digital health data protection and telemedicine security requirements emphasized',
    energyEfficiency: 'Low - Not addressed in this session',
    overallAssessment: 'High relevance for pharmaceutical, medical device, and healthcare technology clients operating in Peru. Immediate attention required for companies in telemedicine and drug import sectors.',
  },
};

export function DemoAnalyzedCard() {
  const [showTranscript, setShowTranscript] = useState(false);

  const getRelevanceBadgeColor = (category: string) => {
    switch (category) {
      case 'High': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'Medium': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'Low': return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  return (
    <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/5 via-indigo-500/5 to-blue-500/5 shadow-lg shadow-purple-500/10">
      <CardContent className="pt-6 space-y-4">
        {/* Demo Banner */}
        <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <Sparkles className="h-4 w-4 text-purple-500" />
          <span className="text-sm font-medium text-purple-600">Demo: Fully Analyzed Session</span>
        </div>

        {/* Status Badges Row */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
            <Star className="h-3 w-3 mr-1 fill-amber-500" />
            Recommended
          </Badge>
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Selected for Monitoring
          </Badge>
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
            <Video className="h-3 w-3 mr-1" />
            Video Found (HIGH)
          </Badge>
          <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">
            <Brain className="h-3 w-3 mr-1" />
            AI Analyzed
          </Badge>
          <Badge className={getRelevanceBadgeColor(DEMO_ANALYSIS.relevanceCategory)}>
            <CheckCircle className="h-3 w-3 mr-1" />
            {DEMO_ANALYSIS.relevanceCategory} Relevance ({DEMO_ANALYSIS.relevanceScore}/100)
          </Badge>
        </div>

        {/* Session Title */}
        <div className="space-y-1">
          <h3 className="font-bold text-lg text-foreground">
            SEGUNDA SESIÓN EXTRAORDINARIA DE LA COMISIÓN DE SALUD Y POBLACIÓN
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Lunes, 16 de diciembre 2024, 10:00 AM
          </p>
        </div>


        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button variant="default" size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
            <Video className="h-4 w-4" />
            Watch Recording
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <FileText className="h-4 w-4" />
            View Full Transcript
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Congress Page
          </Button>
        </div>

        {/* AI Analysis Section */}
        <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-lg p-4 border border-purple-500/20 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <h4 className="font-semibold text-foreground">AI Analysis Results</h4>
            <span className="text-xs text-muted-foreground ml-auto">
              Analyzed: Dec 17, 2024 14:32
            </span>
          </div>

          {/* Executive Summary */}
          <div className="bg-background/60 rounded-md p-3">
            <h5 className="text-sm font-medium text-foreground mb-2">Executive Summary</h5>
            <p className="text-sm text-muted-foreground">{DEMO_ANALYSIS.executiveSummary}</p>
          </div>

          <Accordion type="multiple" className="space-y-2">
            {/* Key Topics */}
            <AccordionItem value="topics" className="border border-border/50 rounded-lg px-3">
              <AccordionTrigger className="py-2 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  Key Topics ({DEMO_ANALYSIS.keyTopics.length})
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                <div className="space-y-2">
                  {DEMO_ANALYSIS.keyTopics.map((topic, idx) => (
                    <div key={idx} className="bg-background/50 rounded-md p-2">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge variant="outline" className="font-mono text-xs bg-slate-500/10 border-slate-500/30">
                          {topic.timestamp}
                        </Badge>
                        <Badge variant="outline" className={
                          topic.relevance === 'Direct' ? 'border-green-500/50 text-green-600' :
                          'border-amber-500/50 text-amber-600'
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
                  Regulatory Mentions ({DEMO_ANALYSIS.regulatoryMentions.length})
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                <div className="space-y-2">
                  {DEMO_ANALYSIS.regulatoryMentions.map((mention, idx) => (
                    <div key={idx} className="bg-background/50 rounded-md p-2">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge variant="outline" className="font-mono text-xs bg-slate-500/10 border-slate-500/30">
                          {mention.timestamp}
                        </Badge>
                        <Badge variant="outline">{mention.type}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground italic mb-1">{mention.quote}</p>
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
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Action Items ({DEMO_ANALYSIS.actionItems.length})
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                <ul className="space-y-2">
                  {DEMO_ANALYSIS.actionItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Speaker Sentiments */}
            <AccordionItem value="speakers" className="border border-border/50 rounded-lg px-3">
              <AccordionTrigger className="py-2 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-500" />
                  Speaker Sentiments ({DEMO_ANALYSIS.speakerSentiments.length})
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                <div className="space-y-2">
                  {DEMO_ANALYSIS.speakerSentiments.map((speaker, idx) => (
                    <div key={idx} className="bg-background/50 rounded-md p-2">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge variant="outline" className="font-mono text-xs bg-slate-500/10 border-slate-500/30">
                          {speaker.timestamp}
                        </Badge>
                        <span className="font-medium text-sm">{speaker.speaker}</span>
                        <Badge variant="outline" className={
                          speaker.position === 'Supportive' ? 'border-green-500/50 text-green-600' :
                          speaker.position === 'Opposed' ? 'border-red-500/50 text-red-600' :
                          'border-slate-500/50 text-slate-600'
                        }>
                          {speaker.position}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground italic">&quot;{speaker.keyStatement}&quot;</p>
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
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-background/50 rounded-md p-2">
                      <span className="text-xs font-medium text-muted-foreground">Product Safety</span>
                      <p className="text-sm text-foreground">{DEMO_ANALYSIS.clientImpact.productSafety}</p>
                    </div>
                    <div className="bg-background/50 rounded-md p-2">
                      <span className="text-xs font-medium text-muted-foreground">Cybersecurity</span>
                      <p className="text-sm text-foreground">{DEMO_ANALYSIS.clientImpact.cybersecurity}</p>
                    </div>
                    <div className="bg-background/50 rounded-md p-2">
                      <span className="text-xs font-medium text-muted-foreground">Radio Regulations</span>
                      <p className="text-sm text-foreground">{DEMO_ANALYSIS.clientImpact.radioRegulations}</p>
                    </div>
                    <div className="bg-background/50 rounded-md p-2">
                      <span className="text-xs font-medium text-muted-foreground">Energy Efficiency</span>
                      <p className="text-sm text-foreground">{DEMO_ANALYSIS.clientImpact.energyEfficiency}</p>
                    </div>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-md p-3 mt-2">
                    <p className="text-sm font-medium text-orange-600">Overall Assessment</p>
                    <p className="text-xs text-muted-foreground mt-1">{DEMO_ANALYSIS.clientImpact.overallAssessment}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}
