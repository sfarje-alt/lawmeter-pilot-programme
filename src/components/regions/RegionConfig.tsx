import React from "react";
import { 
  Building2, 
  Scale, 
  FileText, 
  Globe, 
  Landmark, 
  ScrollText,
  Leaf,
  Waves,
  Network,
  Stamp,
  BookOpen,
  Star,
  Circle,
  Pilcrow
} from "lucide-react";

// ========== REGION TYPES ==========
export type RegionCode = "NAM" | "LATAM" | "EU" | "GCC" | "APAC";

export interface RegionTheme {
  code: RegionCode;
  name: string;
  fullName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgPattern: string;
  tone: string;
  emptyStateMessages: {
    title: string;
    subtitle: string;
    suggestions: string[];
  };
}

// ========== REGION THEMES ==========
export const regionThemes: Record<RegionCode, RegionTheme> = {
  NAM: {
    code: "NAM",
    name: "North America",
    fullName: "North America (USA & Canada)",
    primaryColor: "hsl(215, 60%, 50%)",
    secondaryColor: "hsl(210, 50%, 55%)",
    accentColor: "hsl(215, 65%, 60%)",
    bgPattern: "linear-gradient(135deg, hsl(215 60% 50% / 0.06) 0%, transparent 100%)",
    tone: "",
    emptyStateMessages: {
      title: "No pending legislation",
      subtitle: "Check back for new bills, regulatory guidance, and landmark cases",
      suggestions: [
        "View pending federal bills",
        "Browse state legislation",
        "Track regulatory guidance"
      ]
    }
  },
  LATAM: {
    code: "LATAM",
    name: "Latin America",
    fullName: "Latin America & Caribbean",
    primaryColor: "hsl(160, 50%, 42%)",
    secondaryColor: "hsl(165, 45%, 48%)",
    accentColor: "hsl(160, 55%, 52%)",
    bgPattern: "linear-gradient(135deg, hsl(160 50% 42% / 0.06) 0%, transparent 100%)",
    tone: "",
    emptyStateMessages: {
      title: "No active reforms",
      subtitle: "Monitor constitutional rights, ESG regulations, and community impact laws",
      suggestions: [
        "Track environmental reforms",
        "View constitutional updates",
        "Browse ESG regulations"
      ]
    }
  },
  EU: {
    code: "EU",
    name: "European Union",
    fullName: "European Union",
    primaryColor: "hsl(220, 65%, 52%)",
    secondaryColor: "hsl(220, 55%, 58%)",
    accentColor: "hsl(45, 80%, 55%)",
    bgPattern: "linear-gradient(135deg, hsl(220 65% 52% / 0.06) 0%, transparent 100%)",
    tone: "",
    emptyStateMessages: {
      title: "No directives pending",
      subtitle: "Review frameworks, delegated acts, and Court of Justice case law",
      suggestions: [
        "Browse EU directives",
        "Track regulations",
        "View CJEU decisions"
      ]
    }
  },
  GCC: {
    code: "GCC",
    name: "Gulf States",
    fullName: "Gulf Cooperation Council",
    primaryColor: "hsl(35, 55%, 48%)",
    secondaryColor: "hsl(145, 40%, 40%)",
    accentColor: "hsl(35, 60%, 55%)",
    bgPattern: "linear-gradient(135deg, hsl(35 55% 48% / 0.06) 0%, transparent 100%)",
    tone: "",
    emptyStateMessages: {
      title: "No pending approvals",
      subtitle: "Track licences, concessions, and government decrees",
      suggestions: [
        "View permit requirements",
        "Browse royal decrees",
        "Track licensing updates"
      ]
    }
  },
  APAC: {
    code: "APAC",
    name: "Asia-Pacific",
    fullName: "Asia-Pacific (incl. Japan)",
    primaryColor: "hsl(185, 55%, 42%)",
    secondaryColor: "hsl(190, 50%, 48%)",
    accentColor: "hsl(185, 60%, 52%)",
    bgPattern: "linear-gradient(135deg, hsl(185 55% 42% / 0.06) 0%, transparent 100%)",
    tone: "",
    emptyStateMessages: {
      title: "No cross-border updates",
      subtitle: "Monitor trade agreements, tech regulations, and data privacy rules",
      suggestions: [
        "View trade agreements",
        "Track data regulations",
        "Browse tech standards"
      ]
    }
  }
};

// ========== REGION ICON COMPONENTS ==========

interface RegionIconProps {
  region: RegionCode;
  size?: number;
  showCode?: boolean;
  className?: string;
}

// NAM Icon: Courthouse pillars with continent silhouette
export const NAMIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Three pillars */}
    <rect x="4" y="8" width="3" height="12" rx="0.5" fill="currentColor" opacity="0.8" />
    <rect x="10.5" y="8" width="3" height="12" rx="0.5" fill="currentColor" opacity="0.9" />
    <rect x="17" y="8" width="3" height="12" rx="0.5" fill="currentColor" opacity="0.8" />
    {/* Pediment */}
    <path d="M2 8L12 3L22 8H2Z" fill="currentColor" opacity="0.6" />
    {/* Base */}
    <rect x="2" y="20" width="20" height="2" rx="0.5" fill="currentColor" />
  </svg>
);

// LATAM Icon: Scales with leaf
export const LATAMIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Scale base */}
    <path d="M12 4V20M12 4L4 8V12C4 13 5 14 6 14H8M12 4L20 8V12C20 13 19 14 18 14H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Scale pans */}
    <path d="M4 12C4 12 5 15 8 15C11 15 12 12 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 12C12 12 13 15 16 15C19 15 20 12 20 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Leaf */}
    <path d="M15 17C15 17 17 19 19 17C19 17 18 15 16 15C14 15 15 17 15 17Z" fill="currentColor" opacity="0.7" />
    <path d="M16 17L18 19" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

// EU Icon: Circle of stars with paragraph symbol
export const EUIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Circle of dots (stars) */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const x = 12 + 9 * Math.cos(rad);
      const y = 12 + 9 * Math.sin(rad);
      return <circle key={i} cx={x} cy={y} r="1.2" fill="currentColor" opacity="0.7" />;
    })}
    {/* Paragraph symbol in center */}
    <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="600" fill="currentColor">§</text>
  </svg>
);

// GCC Icon: Dune curve with seal
export const GCCIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Dune/arch shape */}
    <path d="M2 18C2 18 6 10 12 10C18 10 22 18 22 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M4 20C4 20 8 14 12 14C16 14 20 20 20 20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
    {/* Seal/stamp */}
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="12" cy="8" r="2" fill="currentColor" opacity="0.6" />
    {/* Stamp detail */}
    <path d="M10 8H14" stroke="currentColor" strokeWidth="0.8" />
  </svg>
);

// APAC Icon: Wave with network nodes
export const APACIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Wave pattern */}
    <path d="M2 14C4 12 6 14 8 12C10 10 12 14 14 12C16 10 18 14 20 12C22 10 22 12 22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M2 18C4 16 6 18 8 16C10 14 12 18 14 16C16 14 18 18 20 16C22 14 22 16 22 16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5" />
    {/* Network nodes */}
    <circle cx="6" cy="6" r="2" fill="currentColor" opacity="0.8" />
    <circle cx="12" cy="5" r="2" fill="currentColor" opacity="0.9" />
    <circle cx="18" cy="7" r="2" fill="currentColor" opacity="0.8" />
    {/* Connection lines */}
    <path d="M8 6L10 5.5M14 5L16 6" stroke="currentColor" strokeWidth="1" opacity="0.5" />
  </svg>
);

// JP Icon: Torii gate with law book
export const JPIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Rising sun disc (subtle) */}
    <circle cx="12" cy="6" r="4" fill="currentColor" opacity="0.15" />
    {/* Torii-inspired gate */}
    <path d="M6 8H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M7 8V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M17 8V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M5 10H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Stacked pages/book */}
    <rect x="10" y="14" width="4" height="5" rx="0.5" fill="currentColor" opacity="0.7" />
    <path d="M10 15H14M10 17H14" stroke="white" strokeWidth="0.5" opacity="0.8" />
  </svg>
);

// ========== UNIFIED REGION ICON COMPONENT ==========
export const RegionIcon: React.FC<RegionIconProps> = ({ region, size = 24, showCode = true, className }) => {
  const theme = regionThemes[region];
  
  const IconComponent = {
    NAM: NAMIcon,
    LATAM: LATAMIcon,
    EU: EUIcon,
    GCC: GCCIcon,
    APAC: APACIcon
  }[region];

  return (
    <div className={`inline-flex items-center gap-1.5 ${className || ''}`}>
      <div 
        className="flex items-center justify-center rounded-md p-1 bg-muted/50"
        style={{ color: theme.primaryColor }}
      >
        <IconComponent size={size} />
      </div>
      {showCode && (
        <span 
          className="text-xs font-bold tracking-wide"
          style={{ color: theme.primaryColor }}
        >
          {region}
        </span>
      )}
    </div>
  );
};

export default RegionIcon;
