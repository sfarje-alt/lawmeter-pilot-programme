// Sessions / Hearing Intelligence - Main Page Component

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SESSION_REGIONS, SessionRegion, SessionCountryConfig } from '@/types/peruSessions';
import { PeruSessionsSection } from './peru/PeruSessionsSection';
import { SessionEmptyState } from './shared/SessionEmptyState';
import { Video, MapPin } from 'lucide-react';
import { RegionCode, regionThemes, NAMIcon, LATAMIcon, EUIcon, GCCIcon, APACIcon } from '@/components/regions/RegionConfig';
import { CountryFlag } from '@/components/shared/CountryFlag';

interface SessionsPageProps {
  className?: string;
}

// Map SessionRegion to RegionCode icon components
const regionIconComponents: Record<RegionCode, React.FC<{ size?: number; className?: string }>> = {
  NAM: NAMIcon,
  LATAM: LATAMIcon,
  EU: EUIcon,
  GCC: GCCIcon,
  APAC: APACIcon,
};

export function SessionsPage({ className }: SessionsPageProps) {
  const [selectedRegion, setSelectedRegion] = useState<SessionRegion>('LATAM');
  const [selectedCountry, setSelectedCountry] = useState<string>('PE');

  const currentRegion = SESSION_REGIONS.find(r => r.id === selectedRegion);
  const currentCountry = currentRegion?.countries.find(c => c.code === selectedCountry);

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode);
  };

  const renderCountryContent = () => {
    if (!currentCountry?.isImplemented) {
      return (
        <SessionEmptyState 
          countryName={currentCountry?.name || 'Unknown'}
          countryFlag={currentCountry?.flag || '🌐'}
        />
      );
    }

    switch (currentCountry.code) {
      case 'PE':
        return <PeruSessionsSection />;
      default:
        return (
          <SessionEmptyState 
            countryName={currentCountry.name}
            countryFlag={currentCountry.flag}
          />
        );
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Video className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sessions / Hearing Intelligence</h1>
            <p className="text-sm text-muted-foreground">
              Monitor legislative committee sessions and access video recordings
            </p>
          </div>
        </div>
      </div>

      {/* Region Tabs */}
      <Tabs value={selectedRegion} onValueChange={(v) => {
        setSelectedRegion(v as SessionRegion);
        const region = SESSION_REGIONS.find(r => r.id === v);
        if (region && region.countries.length > 0) {
          // Select first implemented country, or first country if none implemented
          const implementedCountry = region.countries.find(c => c.isImplemented);
          setSelectedCountry(implementedCountry?.code || region.countries[0].code);
        }
      }}>
        <TabsList className="bg-muted/50 p-1">
          {SESSION_REGIONS.map(region => {
            const theme = regionThemes[region.id as RegionCode];
            const IconComponent = regionIconComponents[region.id as RegionCode];
            const isSelected = selectedRegion === region.id;
            
            return (
              <TabsTrigger 
                key={region.id} 
                value={region.id}
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2"
                style={isSelected ? { color: theme?.primaryColor } : undefined}
              >
                {IconComponent && (
                  <IconComponent 
                    size={16} 
                    className={isSelected ? '' : 'text-muted-foreground'}
                  />
                )}
                <span>{region.name}</span>
                {region.countries.some(c => c.isImplemented) && (
                  <Badge 
                    variant="secondary" 
                    className="ml-1 text-xs"
                    style={{ 
                      backgroundColor: `${theme?.primaryColor}20`,
                      color: theme?.primaryColor 
                    }}
                  >
                    Live
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {SESSION_REGIONS.map(region => (
          <TabsContent key={region.id} value={region.id} className="mt-6">
            <div className="space-y-6">
              {/* Country Selector */}
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Select Country
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="w-full">
                    <div className="flex gap-2 pb-2">
                      {region.countries.map(country => (
                        <Button
                          key={country.code}
                          variant={selectedCountry === country.code ? "default" : "outline"}
                          className={`flex items-center gap-2 whitespace-nowrap ${
                            !country.isImplemented ? 'opacity-60' : ''
                          }`}
                          onClick={() => handleCountrySelect(country.code)}
                        >
                          <CountryFlag 
                            countryKey={country.code} 
                            variant="flag" 
                            size="sm" 
                            showTooltip={false}
                          />
                          <span>{country.name}</span>
                          {!country.isImplemented && (
                            <Badge variant="outline" className="ml-1 text-xs">
                              Coming Soon
                            </Badge>
                          )}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Country Content */}
              {renderCountryContent()}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default SessionsPage;
