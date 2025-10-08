import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileSearch, ExternalLink, Calendar, DollarSign, Building2, AlertCircle } from "lucide-react";
import { parseDate } from "@/lib/dateUtils";

interface Tender {
  id: string;
  title: string;
  agency: string;
  category: string;
  value: number;
  publishDate: string;
  closeDate: string;
  status: "open" | "closed" | "awarded";
  description: string;
  relevanceScore: number;
  portfolioMatches: string[];
}

// Mock tenders data relevant to healthcare
const mockTenders: Tender[] = [
  {
    id: "ATM2025-001234",
    title: "Supply of Medical Equipment and Devices for Public Hospitals",
    agency: "Department of Health and Aged Care",
    category: "Medical Equipment",
    value: 15000000,
    publishDate: "2025-09-15",
    closeDate: "2025-11-30",
    status: "open",
    description: "Provision of medical equipment including diagnostic devices, surgical instruments, and monitoring equipment for public hospital networks across Australia.",
    relevanceScore: 95,
    portfolioMatches: ["hospital", "medical device", "surgical", "diagnostic"]
  },
  {
    id: "ATM2025-001189",
    title: "Healthcare IT Systems Integration and Support",
    agency: "Department of Health and Aged Care",
    category: "IT Services",
    value: 8500000,
    publishDate: "2025-09-20",
    closeDate: "2025-12-15",
    status: "open",
    description: "Integration of electronic health record systems and ongoing IT support for healthcare facilities.",
    relevanceScore: 88,
    portfolioMatches: ["electronic health record", "EHR", "health IT", "hospital"]
  },
  {
    id: "ATM2025-001145",
    title: "Mental Health Services Expansion Program",
    agency: "Department of Health and Aged Care",
    category: "Healthcare Services",
    value: 12000000,
    publishDate: "2025-08-30",
    closeDate: "2025-11-15",
    status: "open",
    description: "Delivery of expanded mental health services including crisis support, consultation services, and facility upgrades.",
    relevanceScore: 92,
    portfolioMatches: ["mental health", "psychiatric", "hospital", "health service"]
  },
  {
    id: "ATM2025-001098",
    title: "Pharmaceutical Supply Chain Management",
    agency: "Therapeutic Goods Administration",
    category: "Pharmaceutical Services",
    value: 6000000,
    publishDate: "2025-08-15",
    closeDate: "2025-10-30",
    status: "open",
    description: "Management and optimization of pharmaceutical supply chains for healthcare facilities.",
    relevanceScore: 85,
    portfolioMatches: ["pharmaceutical", "pharmacy", "medicine", "TGA"]
  },
  {
    id: "ATM2025-001052",
    title: "Aged Care Facility Upgrades and Equipment",
    agency: "Department of Health and Aged Care",
    category: "Aged Care",
    value: 10000000,
    publishDate: "2025-07-28",
    closeDate: "2025-10-20",
    status: "open",
    description: "Facility upgrades and equipment procurement for aged care facilities to meet new quality standards.",
    relevanceScore: 90,
    portfolioMatches: ["aged care", "residential care", "nursing home", "care plan"]
  },
  {
    id: "ATM2025-000987",
    title: "Cybersecurity Assessment for Health Data Systems",
    agency: "Australian Cyber Security Centre",
    category: "Cybersecurity",
    value: 3500000,
    publishDate: "2025-07-10",
    closeDate: "2025-10-15",
    status: "closed",
    description: "Comprehensive cybersecurity assessment and remediation for healthcare data systems.",
    relevanceScore: 82,
    portfolioMatches: ["cybersecurity", "data protection", "privacy", "health IT"]
  },
];

export function TendersSection() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTenders = mockTenders.filter(tender =>
    tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tender.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tender.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tender.portfolioMatches.some(match => match.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const openTenders = filteredTenders.filter(t => t.status === "open");
  const totalValue = openTenders.reduce((sum, t) => sum + t.value, 0);

  const isClosingSoon = (closeDate: string) => {
    const close = parseDate(closeDate);
    if (!close) return false;
    const now = new Date();
    const daysUntilClose = Math.ceil((close.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilClose <= 30 && daysUntilClose > 0;
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
            <CardTitle className="text-sm">Total Value (Open)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalValue / 1000000).toFixed(1)}M
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Closing Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {openTenders.filter(t => isClosingSoon(t.closeDate)).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <FileSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tenders by title, agency, category, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredTenders.map(tender => (
          <Card key={tender.id} className={`hover:shadow-md transition-shadow ${tender.status === "open" ? "" : "opacity-60"}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <FileSearch className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{tender.title}</h3>
                        <Badge variant={tender.status === "open" ? "default" : "secondary"}>
                          {tender.status}
                        </Badge>
                        {isClosingSoon(tender.closeDate) && tender.status === "open" && (
                          <Badge variant="outline" className="border-warning text-warning">
                            Closing Soon
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{tender.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{tender.agency}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">${(tender.value / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Close: {new Date(tender.closeDate).toLocaleDateString("en-AU")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="outline" className="text-xs">
                            {tender.relevanceScore}% match
                          </Badge>
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
                        <Button size="sm" variant="outline" asChild>
                          <a href={`https://www.tenders.gov.au/?event=public.ATM.show&ATMUUID=${tender.id}`} target="_blank" rel="noopener noreferrer">
                            View on AusTender
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                        <span className="text-xs text-muted-foreground">ID: {tender.id}</span>
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
