import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  RegionCode, 
  regionThemes, 
  RegionIcon, 
  RegionHeader, 
  RegionEmptyState, 
  RegionBadge,
  RegionSelector
} from "@/components/regions";
import { NAMIcon, LATAMIcon, EUIcon, GCCIcon, APACIcon } from "@/components/regions/RegionConfig";
import { RegionLegislationCard } from "@/components/regions/RegionLegislationCard";

const REGION_ORDER: RegionCode[] = ["NAM", "LATAM", "EU", "GCC", "APAC"];

// Sample legislation data for each region
const sampleLegislation: Record<RegionCode, Array<{
  id: string;
  title: string;
  summary: string;
  documentType: string;
  status: string;
  riskLevel: "high" | "medium" | "low";
  date: string;
  deadline?: string;
}>> = {
  NAM: [
    {
      id: "hr-2024-1234",
      title: "Smart Appliance Safety Act of 2024",
      summary: "Federal bill establishing safety standards for IoT-enabled kitchen appliances.",
      documentType: "Bill",
      status: "In Committee",
      riskLevel: "high",
      date: "Dec 1, 2024",
      deadline: "Mar 15, 2025"
    }
  ],
  LATAM: [
    {
      id: "cr-ley-2024-89",
      title: "Ley de Protección del Consumidor Digital",
      summary: "New consumer protection framework for digital products and IoT devices.",
      documentType: "Ley",
      status: "En Tramite",
      riskLevel: "medium",
      date: "Nov 15, 2024"
    }
  ],
  EU: [
    {
      id: "eu-dir-2024-1234",
      title: "Directive on Radio Equipment Cybersecurity",
      summary: "Harmonised cybersecurity requirements for wireless devices under the RED.",
      documentType: "Directive",
      status: "In Force",
      riskLevel: "high",
      date: "Aug 1, 2024",
      deadline: "Aug 1, 2025"
    }
  ],
  GCC: [
    {
      id: "uae-decree-2024-45",
      title: "TRA Technical Specification for Wireless Devices",
      summary: "Updated licensing requirements for WiFi 6E enabled consumer electronics.",
      documentType: "Decree",
      status: "Published",
      riskLevel: "medium",
      date: "Oct 20, 2024"
    }
  ],
  APAC: [
    {
      id: "kr-act-2024-78",
      title: "Korea Radio Certification Amendment",
      summary: "Updated KC certification requirements for smart home devices.",
      documentType: "Amendment",
      status: "Pending",
      riskLevel: "medium",
      date: "Nov 5, 2024",
      deadline: "Feb 1, 2025"
    },
    {
      id: "jp-meti-2024-12",
      title: "METI Technical Guidelines for IoT Security",
      summary: "Implementation guidance for connected device security standards.",
      documentType: "Guideline",
      status: "Final",
      riskLevel: "low",
      date: "Sep 1, 2024"
    }
  ]
};

export function RegionShowcase() {
  const [selectedRegion, setSelectedRegion] = useState<RegionCode | "ALL">("NAM");
  const [selectedTab, setSelectedTab] = useState("overview");

  const alertCounts: Partial<Record<RegionCode | "ALL", number>> = {
    ALL: 381,
    NAM: 156,
    LATAM: 23,
    EU: 89,
    GCC: 34,
    APAC: 79
  };
  
  // Get current region code for components that don't support "ALL"
  const currentRegionCode: RegionCode = selectedRegion === "ALL" ? "NAM" : selectedRegion;

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Regional Design System</h1>
        <p className="text-muted-foreground">
          Themed components for each commercial region with legal/regulatory styling
        </p>
      </div>

      {/* Region Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Region Selector (Horizontal)</CardTitle>
        </CardHeader>
        <CardContent>
          <RegionSelector 
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
            alertCounts={alertCounts}
          />
        </CardContent>
      </Card>

      {/* All Icons Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Region Icons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {REGION_ORDER.map(code => (
              <div key={code} className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/30">
                <RegionIcon region={code} size={32} showCode={false} />
                <span className="text-xs font-bold">{code}</span>
                <span className="text-[10px] text-muted-foreground text-center">
                  {regionThemes[code].name}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Region Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Region Badges (All Variants)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Default variant */}
            <div>
              <span className="text-xs text-muted-foreground mb-2 block">Default</span>
              <div className="flex flex-wrap gap-2">
                {REGION_ORDER.map(code => (
                  <RegionBadge key={code} region={code} variant="default" />
                ))}
              </div>
            </div>
            {/* Outline variant */}
            <div>
              <span className="text-xs text-muted-foreground mb-2 block">Outline</span>
              <div className="flex flex-wrap gap-2">
                {REGION_ORDER.map(code => (
                  <RegionBadge key={code} region={code} variant="outline" />
                ))}
              </div>
            </div>
            {/* Subtle variant */}
            <div>
              <span className="text-xs text-muted-foreground mb-2 block">Subtle</span>
              <div className="flex flex-wrap gap-2">
                {REGION_ORDER.map(code => (
                  <RegionBadge key={code} region={code} variant="subtle" />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Region Headers */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Region Headers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REGION_ORDER.map(code => (
            <RegionHeader 
              key={code} 
              region={code} 
              alertCount={alertCounts[code]}
            />
          ))}
        </div>
      </div>

      {/* Sample Legislation Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Legislation Cards by Region</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REGION_ORDER.map(code => {
            const item = sampleLegislation[code][0];
            return (
              <RegionLegislationCard
                key={code}
                region={code}
                id={item.id}
                title={item.title}
                summary={item.summary}
                documentType={item.documentType}
                status={item.status}
                riskLevel={item.riskLevel}
                date={item.date}
                deadline={item.deadline}
                isRead={code === "GCC"}
              />
            );
          })}
        </div>
      </div>

      {/* Empty States */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Empty States</h2>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            {REGION_ORDER.map(code => (
              <TabsTrigger key={code} value={code} className="text-xs">
                {code}
              </TabsTrigger>
            ))}
          </TabsList>
          {REGION_ORDER.map(code => (
            <TabsContent key={code} value={code}>
              <RegionEmptyState region={code} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

export default RegionShowcase;
