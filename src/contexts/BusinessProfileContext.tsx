import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface BusinessProfile {
  companyName: string;
  industryDescription: string;
  productTypes: string[];
  regulatoryCategories: string[];
  portfolioKeywords: string[];
  monitoredJurisdictions: string[];
}

const DEFAULT_REGULATORY_CATEGORIES = [
  'Radio Regulations',
  'Product Safety',
  'Cybersecurity',
  'Battery Regulations',
  'Food Contact Material'
];

const DEFAULT_PORTFOLIO_KEYWORDS = [
  // Product types
  'kettle', 'espresso', 'coffee maker', 'appliance', 'kitchen', 'brewing',
  // Technical
  'IoT', 'connected device', 'smart home', 'wifi', 'bluetooth', 'RF', 'wireless',
  // Safety
  'electrical safety', 'thermal', 'burn prevention', 'auto-shutoff', 'overheating',
  // Materials
  'BPA-free', 'food grade', 'stainless steel', 'plastic', 'silicone',
  // Compliance
  'CE marking', 'UL', 'FCC', 'EMC', 'RoHS', 'WEEE', 'REACH',
  // Energy
  'energy efficiency', 'standby power', 'wattage', 'voltage', 'power consumption'
];

const DEFAULT_JURISDICTIONS = ['USA', 'Canada', 'EU', 'Japan', 'Korea', 'Taiwan', 'UAE', 'Saudi Arabia', 'Costa Rica', 'Peru'];

const DEFAULT_PROFILE: BusinessProfile = {
  companyName: 'Smart Appliance Co.',
  industryDescription: 'Manufacturer of smart kitchen appliances including connected kettles and espresso machines',
  productTypes: ['Smart Kettle', 'Espresso Machine', 'Coffee Maker'],
  regulatoryCategories: DEFAULT_REGULATORY_CATEGORIES,
  portfolioKeywords: DEFAULT_PORTFOLIO_KEYWORDS,
  monitoredJurisdictions: DEFAULT_JURISDICTIONS
};

interface BusinessProfileContextType {
  profile: BusinessProfile;
  updateProfile: (updates: Partial<BusinessProfile>) => void;
  resetToDefaults: () => void;
  defaultCategories: string[];
  defaultKeywords: string[];
  defaultJurisdictions: string[];
}

const BusinessProfileContext = createContext<BusinessProfileContextType | undefined>(undefined);

const STORAGE_KEY = 'lawmeter_business_profile';

export function BusinessProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<BusinessProfile>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
      } catch {
        return DEFAULT_PROFILE;
      }
    }
    return DEFAULT_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates: Partial<BusinessProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const resetToDefaults = () => {
    setProfile(DEFAULT_PROFILE);
  };

  return (
    <BusinessProfileContext.Provider
      value={{
        profile,
        updateProfile,
        resetToDefaults,
        defaultCategories: DEFAULT_REGULATORY_CATEGORIES,
        defaultKeywords: DEFAULT_PORTFOLIO_KEYWORDS,
        defaultJurisdictions: DEFAULT_JURISDICTIONS
      }}
    >
      {children}
    </BusinessProfileContext.Provider>
  );
}

export function useBusinessProfile() {
  const context = useContext(BusinessProfileContext);
  if (!context) {
    throw new Error('useBusinessProfile must be used within a BusinessProfileProvider');
  }
  return context;
}
