import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileSearch, ExternalLink, AlertCircle } from "lucide-react";

interface Tender {
  atmId: string;
  title: string;
  agency: string;
  category: string;
  description: string;
  aiSummary: string;
  closeDateTime: string;
  lastUpdated: string;
  status: "open" | "closed";
  relevanceScore: number;
  portfolioMatches: string[];
  fullDetailsUrl: string;
}

// Mock tenders data relevant to healthcare from AusTender
const mockTenders: Tender[] = [
  {
    atmId: "JHC/RFP/2025/1",
    title: "Australian Defence Contracted Health System",
    agency: "Department of Defence - DSRG",
    category: "Comprehensive health services",
    description: "Request for Proposal for the Australian Defence Contracted Health System",
    aiSummary: "Defence needs a comprehensive healthcare provider to deliver medical services to military personnel and their families, including primary care, specialist consultations, mental health support, and emergency services across multiple locations.",
    closeDateTime: "2025-10-10T16:00:00",
    lastUpdated: "2025-10-03T11:39:00",
    status: "open",
    relevanceScore: 93,
    portfolioMatches: ["health service", "hospital", "health system", "contracted health"],
    fullDetailsUrl: "https://www.tenders.gov.au/?event=public.ATM.show&ATMUUID=JHC/RFP/2025/1"
  },
  {
    atmId: "DHAC-2025-1234",
    title: "Supply of Medical Equipment and Devices for Public Hospitals",
    agency: "Department of Health and Aged Care",
    category: "Medical Equipment",
    description: "Provision of medical equipment including diagnostic devices, surgical instruments, and monitoring equipment for public hospital networks across Australia.",
    aiSummary: "The government wants suppliers to provide MRI machines, CT scanners, ultrasound equipment, surgical instruments, patient monitors, and diagnostic tools for 50+ public hospitals nationwide, with installation, training, and 5-year maintenance included.",
    closeDateTime: "2025-11-30T17:00:00",
    lastUpdated: "2025-10-05T14:30:00",
    status: "open",
    relevanceScore: 95,
    portfolioMatches: ["hospital", "medical device", "surgical", "diagnostic"],
    fullDetailsUrl: "https://www.tenders.gov.au/?event=public.ATM.show&ATMUUID=DHAC-2025-1234"
  },
  {
    atmId: "DHAC-2025-1189",
    title: "Healthcare IT Systems Integration and Support",
    agency: "Department of Health and Aged Care",
    category: "IT Services",
    description: "Integration of electronic health record systems and ongoing IT support for healthcare facilities.",
    aiSummary: "Looking for IT firms to connect and integrate electronic health record systems across 120 healthcare facilities, migrate patient data securely, provide staff training, and deliver 24/7 technical support for 3 years.",
    closeDateTime: "2025-12-15T17:00:00",
    lastUpdated: "2025-09-28T11:20:00",
    status: "open",
    relevanceScore: 88,
    portfolioMatches: ["electronic health record", "EHR", "health IT", "hospital"],
    fullDetailsUrl: "https://www.tenders.gov.au/?event=public.ATM.show&ATMUUID=DHAC-2025-1189"
  },
  {
    atmId: "DHAC-2025-1145",
    title: "Mental Health Services Expansion Program",
    agency: "Department of Health and Aged Care",
    category: "Healthcare Services",
    description: "Delivery of expanded mental health services including crisis support, consultation services, and facility upgrades.",
    aiSummary: "The state wants mental health providers to expand services in regional areas: 24/7 crisis helplines, psychiatric consultations, therapy programs, and renovation of 8 mental health facilities to increase capacity by 40%.",
    closeDateTime: "2025-11-15T17:00:00",
    lastUpdated: "2025-09-30T09:45:00",
    status: "open",
    relevanceScore: 92,
    portfolioMatches: ["mental health", "psychiatric", "hospital", "health service"],
    fullDetailsUrl: "https://www.tenders.gov.au/?event=public.ATM.show&ATMUUID=DHAC-2025-1145"
  },
  {
    atmId: "TGA-2025-1098",
    title: "Pharmaceutical Supply Chain Management",
    agency: "Therapeutic Goods Administration",
    category: "Pharmaceutical Services",
    description: "Management and optimization of pharmaceutical supply chains for healthcare facilities.",
    aiSummary: "TGA needs logistics companies to manage pharmaceutical distribution: warehousing temperature-controlled medicines, tracking inventory in real-time, coordinating deliveries to 200+ healthcare facilities, and ensuring compliance with pharmaceutical storage regulations.",
    closeDateTime: "2025-10-30T17:00:00",
    lastUpdated: "2025-09-22T16:10:00",
    status: "open",
    relevanceScore: 85,
    portfolioMatches: ["pharmaceutical", "pharmacy", "medicine", "TGA"],
    fullDetailsUrl: "https://www.tenders.gov.au/?event=public.ATM.show&ATMUUID=TGA-2025-1098"
  },
  {
    atmId: "DHAC-2025-1052",
    title: "Aged Care Facility Upgrades and Equipment",
    agency: "Department of Health and Aged Care",
    category: "Aged Care",
    description: "Facility upgrades and equipment procurement for aged care facilities to meet new quality standards.",
    aiSummary: "Seeking contractors to renovate 15 aged care facilities: upgrade bathrooms for accessibility, install nurse call systems, modernize kitchens, provide new mobility aids and care equipment to meet 2025 quality standards.",
    closeDateTime: "2025-10-20T17:00:00",
    lastUpdated: "2025-09-18T13:55:00",
    status: "open",
    relevanceScore: 90,
    portfolioMatches: ["aged care", "residential care", "nursing home", "care plan"],
    fullDetailsUrl: "https://www.tenders.gov.au/?event=public.ATM.show&ATMUUID=DHAC-2025-1052"
  },
  {
    atmId: "ACSC-2025-0987",
    title: "Cybersecurity Assessment for Health Data Systems",
    agency: "Australian Cyber Security Centre",
    category: "Cybersecurity",
    description: "Comprehensive cybersecurity assessment and remediation for healthcare data systems.",
    aiSummary: "Cybersecurity firms needed to audit healthcare IT systems, identify vulnerabilities in patient data storage, perform penetration testing, implement security fixes, and provide staff training on data protection protocols.",
    closeDateTime: "2025-10-15T17:00:00",
    lastUpdated: "2025-09-10T10:30:00",
    status: "closed",
    relevanceScore: 82,
    portfolioMatches: ["cybersecurity", "data protection", "privacy", "health IT"],
    fullDetailsUrl: "https://www.tenders.gov.au/?event=public.ATM.show&ATMUUID=ACSC-2025-0987"
  },
];

export function TendersSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [relevanceFilter, setRelevanceFilter] = useState<"all" | "high" | "medium" | "low">("all");

  const filteredTenders = mockTenders.filter(tender => {
    const matchesSearch = tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.portfolioMatches.some(match => match.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRelevance = relevanceFilter === "all" ||
      (relevanceFilter === "high" && tender.relevanceScore >= 90) ||
      (relevanceFilter === "medium" && tender.relevanceScore >= 70 && tender.relevanceScore < 90) ||
      (relevanceFilter === "low" && tender.relevanceScore < 70);
    
    return matchesSearch && matchesRelevance;
  });

  const openTenders = filteredTenders.filter(t => t.status === "open");

  const isClosingSoon = (closeDateTime: string) => {
    const close = new Date(closeDateTime);
    const now = new Date();
    const daysUntilClose = Math.ceil((close.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilClose <= 30 && daysUntilClose > 0;
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }) + " (ACT Local Time)";
  };

  return (
    <div className="space-y-6">
      <div className="bg-info/10 border border-info rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-info">Public Tenders - AusTender Integration</p>
            <p className="text-sm text-muted-foreground mt-1">
              Relevant government procurement opportunities from AusTender, filtered by your portfolio keywords.
              These tenders may represent opportunities for service expansion or indicate regulatory priorities.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Open Tenders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTenders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">High Relevance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {openTenders.filter(t => t.relevanceScore >= 90).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Closing Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {openTenders.filter(t => isClosingSoon(t.closeDateTime)).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="relative flex-1">
          <FileSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tenders by title, agency, category, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={relevanceFilter} onValueChange={(value: "all" | "high" | "medium" | "low") => setRelevanceFilter(value)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Relevance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Relevance</SelectItem>
            <SelectItem value="high">High (90%+)</SelectItem>
            <SelectItem value="medium">Medium (70-89%)</SelectItem>
            <SelectItem value="low">Low (&lt;70%)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredTenders.map(tender => (
          <Card key={tender.atmId} className={`hover:shadow-md transition-shadow ${tender.status === "open" ? "" : "opacity-60"}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <FileSearch className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{tender.title}</h3>
                        <Badge variant={tender.status === "open" ? "default" : "secondary"}>
                          {tender.status.toUpperCase()}
                        </Badge>
                        {isClosingSoon(tender.closeDateTime) && tender.status === "open" && (
                          <Badge variant="outline" className="border-warning text-warning">
                            Closing Soon
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
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex items-start gap-2 text-sm">
                          <span className="font-semibold min-w-[140px]">ATM ID:</span>
                          <span className="text-primary font-medium">{tender.atmId}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <span className="font-semibold min-w-[140px]">Close Date & Time:</span>
                          <span className="text-muted-foreground">{formatDateTime(tender.closeDateTime)}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <span className="font-semibold min-w-[140px]">Agency:</span>
                          <span className="text-muted-foreground">{tender.agency}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <span className="font-semibold min-w-[140px]">Category:</span>
                          <span className="text-muted-foreground">{tender.category}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <span className="font-semibold min-w-[140px]">Description:</span>
                          <span className="text-muted-foreground">{tender.description}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <span className="font-semibold min-w-[140px]">Relevance:</span>
                          <Badge variant="outline" className="text-xs">
                            {tender.relevanceScore}% match
                          </Badge>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <span className="font-semibold min-w-[140px]">Last Updated:</span>
                          <span className="text-muted-foreground text-xs">{formatDateTime(tender.lastUpdated)}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {tender.portfolioMatches.slice(0, 5).map(match => (
                          <Badge key={match} variant="secondary" className="text-xs">
                            {match}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button size="sm" asChild>
                          <a href={tender.fullDetailsUrl} target="_blank" rel="noopener noreferrer">
                            Full Details
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
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
            <p className="text-muted-foreground">No tenders found matching your search</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
