import { useState, useMemo, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Grid, 
  List, 
  Gavel, 
  Clock, 
  FileText,
  Building2,
  MapPin,
  ScrollText,
  Handshake,
  Landmark,
  Scale,
  Loader2,
  ChevronDown,
  SlidersHorizontal,
  Home,
  X,
  GitBranch,
  AlertTriangle,
  Briefcase,
  Calendar
} from "lucide-react";
import { usaLegislationData } from "@/data/usaLegislationMockData";
import { UnifiedAlertCard } from "./UnifiedAlertCard";
import { USALegislationDrawer } from "./USALegislationDrawer";
import { CongressBillDrawer } from "@/components/congress/CongressBillDrawer";
import { useReadAlerts } from "@/hooks/useReadAlerts";
import { useStarredBills } from "@/hooks/useStarredBills";
import { useToast } from "@/hooks/use-toast";
import { useCongressBills } from "@/hooks/useCongressBills";
import { 
  LifecycleStatus, 
  USDocumentType, 
  Authority, 
  USLegislationItem, 
  documentTypeLabels, 
  authorityLabels,
  USBranch,
  USInstrumentType,
  CongressStage,
  RulemakingStage,
  DeadlinePreset,
  JurisdictionLevel,
  RiskLevel,
  USFilterPreset
} from "@/types/usaLegislation";
import { CongressBill } from "@/types/congress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { USAFilterPresets, DEFAULT_US_PRESETS } from "./USAFilterPresets";

// ========== LABEL MAPPINGS ==========
const branchLabels: Record<USBranch, string> = {
  all: "All Branches",
  legislative: "Legislative",
  executive: "Executive",
  judicial: "Judicial"
};

const instrumentTypeLabels: Record<USInstrumentType, string> = {
  "congress-bill": "Congress Bills & Resolutions",
  "public-law": "Public Laws / Statutes",
  "agency-rulemaking": "Agency Rulemakings",
  "guidance": "Guidance & Policy",
  "executive-order": "Executive Orders"
};

const congressStageLabels: Record<CongressStage, string> = {
  introduced: "Introduced",
  "in-committee": "In Committee",
  "on-calendar": "On Calendar",
  "passed-chamber": "Passed Chamber",
  "to-president": "To President",
  enacted: "Enacted",
  failed: "Failed"
};

const rulemakingStageLabels: Record<RulemakingStage, string> = {
  draft: "Draft",
  proposed: "Proposed",
  "comment-open": "Comment Open",
  "comment-closed": "Comment Closed",
  final: "Final",
  effective: "Effective"
};

const deadlinePresetLabels: Record<DeadlinePreset, string> = {
  "next-30": "Next 30 Days",
  "next-60": "Next 60 Days",
  "next-90": "Next 90 Days",
  "this-quarter": "This Quarter",
  none: "No Filter"
};

const lifecycleIcons = {
  all: <FileText className="h-4 w-4" />,
  "in-force": <Gavel className="h-4 w-4" />,
  pipeline: <Clock className="h-4 w-4" />
};

// US States list
const usStates = [
  { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" }, { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" }, { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" }, { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" }, { code: "HI", name: "Hawaii" }, { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" }, { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" }, { code: "KY", name: "Kentucky" }, { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" }, { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" }, { code: "MN", name: "Minnesota" }, { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" }, { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" }, { code: "NH", name: "New Hampshire" }, { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" }, { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" }, { code: "OH", name: "Ohio" }, { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" }, { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" }, { code: "SD", name: "South Dakota" }, { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" }, { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" }, { code: "WA", name: "Washington" }, { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" }, { code: "DC", name: "District of Columbia" }
];

// Union type for combined items
type CombinedLegislationItem = 
  | { type: "mock"; data: USLegislationItem }
  | { type: "congress"; data: CongressBill };

export function USALegislationSection() {
  // ========== ROW 1: SCOPE FILTERS ==========
  const [lifecycleFilter, setLifecycleFilter] = useState<LifecycleStatus>("all");
  const [jurisdictionLevel, setJurisdictionLevel] = useState<JurisdictionLevel>("all");
  
  // ========== ROW 2: CORE FILTERS ==========
  const [selectedBranch, setSelectedBranch] = useState<USBranch>("all");
  const [selectedInstrumentTypes, setSelectedInstrumentTypes] = useState<USInstrumentType[]>([]);
  const [selectedStages, setSelectedStages] = useState<(CongressStage | RulemakingStage)[]>([]);
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<RiskLevel[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // ========== ROW 3: ADVANCED FILTERS ==========
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [selectedAuthorities, setSelectedAuthorities] = useState<Authority[]>([]);
  const [selectedChamber, setSelectedChamber] = useState<string[]>([]);
  const [deadlinePreset, setDeadlinePreset] = useState<DeadlinePreset>("none");
  const [selectedSponsorParty, setSelectedSponsorParty] = useState<string[]>([]);
  
  // Preset tracking
  const [activePresetId, setActivePresetId] = useState<string | undefined>();
  
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  
  // Drawer states
  const [selectedMockItem, setSelectedMockItem] = useState<USLegislationItem | null>(null);
  const [selectedCongressBill, setSelectedCongressBill] = useState<CongressBill | null>(null);
  const [mockDrawerOpen, setMockDrawerOpen] = useState(false);
  const [congressDrawerOpen, setCongressDrawerOpen] = useState(false);
  
  const { markAsRead, toggleRead, isRead, getUnreadCount, deleteAlert, isDeleted } = useReadAlerts();
  const { isStarred, toggleStar } = useStarredBills();
  const { toast } = useToast();
  
  // Fetch Congress bills
  const { bills: congressBills, loading: congressLoading, error: congressError } = useCongressBills("latestAction-desc");

  const regulatoryCategories = ["Radio", "Product Safety", "Cybersecurity", "Battery", "Food Contact Material"];

  // ========== MAPPING FUNCTIONS ==========
  const mapDocTypeToInstrumentType = (docType: USDocumentType, authority: Authority): USInstrumentType => {
    if (docType === "bill") return "congress-bill";
    if (docType === "statute") return "public-law";
    if (docType === "regulation") return "agency-rulemaking";
    if (docType === "treaty") return "guidance"; // Simplified mapping
    if (docType === "ordinance") return "congress-bill"; // Local bills
    return "congress-bill";
  };

  const getMockBranch = (item: USLegislationItem): USBranch => {
    if (item.authority === "congress" || item.authority === "state" || item.authority === "city") return "legislative";
    if (item.authority === "federal-agency") return "executive";
    return "legislative";
  };

  const getMockStage = (item: USLegislationItem): CongressStage | RulemakingStage | null => {
    const status = item.status.toLowerCase();
    // Congress stages
    if (status.includes("introduced")) return "introduced";
    if (status.includes("committee")) return "in-committee";
    if (status.includes("calendar")) return "on-calendar";
    if (status.includes("passed")) return "passed-chamber";
    if (status.includes("president")) return "to-president";
    if (status.includes("enacted") || status === "in force") return "enacted";
    if (status.includes("failed")) return "failed";
    // Rulemaking stages
    if (status.includes("draft")) return "draft";
    if (status.includes("proposed")) return "proposed";
    if (status.includes("comment open")) return "comment-open";
    if (status.includes("comment closed")) return "comment-closed";
    if (status.includes("final rule")) return "final";
    if (status.includes("effective")) return "effective";
    return null;
  };

  const getCongressStage = (bill: CongressBill): CongressStage => {
    const action = bill.latestAction?.text?.toLowerCase() || "";
    if (action.includes("became public law") || action.includes("signed by president")) return "enacted";
    if (action.includes("presented to president") || action.includes("to president")) return "to-president";
    if (action.includes("passed") && (action.includes("house") || action.includes("senate"))) return "passed-chamber";
    if (action.includes("calendar")) return "on-calendar";
    if (action.includes("committee")) return "in-committee";
    return "introduced";
  };

  // ========== COMBINE DATA ==========
  const combinedData = useMemo((): CombinedLegislationItem[] => {
    const mockItems: CombinedLegislationItem[] = usaLegislationData
      .filter(item => !isDeleted(item.id))
      .map(item => ({ type: "mock" as const, data: item }));
    
    const congressItems: CombinedLegislationItem[] = congressBills.map(bill => ({
      type: "congress" as const,
      data: bill
    }));
    
    return [...mockItems, ...congressItems];
  }, [congressBills, isDeleted]);

  // ========== JURISDICTION LEVEL HELPER ==========
  const getMockJurisdictionLevel = (item: USLegislationItem): JurisdictionLevel => {
    if (item.authority === "city") return "local";
    if (item.subJurisdiction) return "state";
    return "federal";
  };

  // ========== DEADLINE FILTER HELPER ==========
  const isWithinDeadlinePreset = (item: USLegislationItem | CongressBill, preset: DeadlinePreset): boolean => {
    if (preset === "none") return true;
    
    let deadlineDate: Date | null = null;
    
    if ('complianceDeadline' in item && item.complianceDeadline) {
      deadlineDate = new Date(item.complianceDeadline);
    } else if ('effectiveDate' in item && item.effectiveDate) {
      deadlineDate = new Date(item.effectiveDate);
    }
    
    if (!deadlineDate) return false; // No deadline = doesn't match deadline filter
    
    const now = new Date();
    const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    switch (preset) {
      case "next-30": return diffDays >= 0 && diffDays <= 30;
      case "next-60": return diffDays >= 0 && diffDays <= 60;
      case "next-90": return diffDays >= 0 && diffDays <= 90;
      case "this-quarter": {
        const quarterEnd = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 0);
        return deadlineDate >= now && deadlineDate <= quarterEnd;
      }
      default: return true;
    }
  };

  // ========== FILTERING LOGIC ==========
  const filteredData = useMemo(() => {
    return combinedData.filter(item => {
      if (item.type === "mock") {
        const mockItem = item.data;
        const itemLevel = getMockJurisdictionLevel(mockItem);
        const itemBranch = getMockBranch(mockItem);
        const itemInstrumentType = mapDocTypeToInstrumentType(mockItem.documentType, mockItem.authority);
        const itemStage = getMockStage(mockItem);
        
        // Lifecycle filter
        if (lifecycleFilter === "in-force" && !mockItem.isInForce) return false;
        if (lifecycleFilter === "pipeline" && !mockItem.isPipeline) return false;

        // Jurisdiction Level filter
        if (jurisdictionLevel !== "all" && itemLevel !== jurisdictionLevel) return false;

        // Branch filter
        if (selectedBranch !== "all" && itemBranch !== selectedBranch) return false;

        // Instrument type filter
        if (selectedInstrumentTypes.length > 0 && !selectedInstrumentTypes.includes(itemInstrumentType)) return false;

        // Stage filter
        if (selectedStages.length > 0 && itemStage && !selectedStages.includes(itemStage)) return false;

        // Geography filter (states)
        if (selectedStates.length > 0) {
          if (itemLevel === "federal") return false;
          const stateCode = mockItem.subJurisdiction?.includes(",") 
            ? mockItem.subJurisdiction.split(",").pop()?.trim()
            : mockItem.subJurisdiction;
          if (!stateCode || !selectedStates.includes(stateCode)) return false;
        }

        // Regulatory category filter
        if (selectedCategories.length > 0 && !selectedCategories.includes(mockItem.regulatoryCategory)) return false;

        // Risk level filter
        if (selectedRiskLevels.length > 0 && !selectedRiskLevels.includes(mockItem.riskLevel)) return false;

        // Authority filter
        if (selectedAuthorities.length > 0 && !selectedAuthorities.includes(mockItem.authority)) return false;

        // Chamber filter (for bills)
        if (selectedChamber.length > 0 && mockItem.documentType === "bill") {
          const chamberMatch = selectedChamber.some(chamber => {
            if (chamber === "house") return mockItem.regulatoryBody?.toLowerCase().includes("house");
            if (chamber === "senate") return mockItem.regulatoryBody?.toLowerCase().includes("senate");
            return false;
          });
          if (!chamberMatch) return false;
        }

        // Deadline preset filter
        if (!isWithinDeadlinePreset(mockItem, deadlinePreset)) return false;

        return true;
      } else {
        // Congress bill
        const bill = item.data;
        const billStage = getCongressStage(bill);
        
        // Congress bills are always in pipeline
        if (lifecycleFilter === "in-force") return false;
        
        // Congress bills are federal
        if (jurisdictionLevel === "state" || jurisdictionLevel === "local") return false;

        // Branch filter - Congress bills are legislative
        if (selectedBranch !== "all" && selectedBranch !== "legislative") return false;

        // Geography filter doesn't apply to federal
        if (selectedStates.length > 0) return false;
        
        // Instrument type filter
        if (selectedInstrumentTypes.length > 0 && !selectedInstrumentTypes.includes("congress-bill")) return false;
        
        // Stage filter
        if (selectedStages.length > 0 && !selectedStages.includes(billStage)) return false;
        
        // Authority filter
        if (selectedAuthorities.length > 0 && !selectedAuthorities.includes("congress")) return false;
        
        // Chamber filter
        if (selectedChamber.length > 0) {
          const chamberMatch = selectedChamber.some(chamber => {
            if (chamber === "house") return bill.originChamber === "House";
            if (chamber === "senate") return bill.originChamber === "Senate";
            return false;
          });
          if (!chamberMatch) return false;
        }
        
        // Category filter
        if (selectedCategories.length > 0 && bill.policyArea) {
          const policyName = bill.policyArea.name.toLowerCase();
          const categoryMatch = selectedCategories.some(cat => {
            const catLower = cat.toLowerCase();
            return policyName.includes(catLower) || 
                   (catLower === "product safety" && policyName.includes("consumer")) ||
                   (catLower === "cybersecurity" && (policyName.includes("science") || policyName.includes("technology"))) ||
                   (catLower === "radio" && policyName.includes("communications"));
          });
          if (!categoryMatch) return false;
        }

        // Risk level filter
        if (selectedRiskLevels.length > 0) {
          const billId = `${bill.congress}-${bill.type}-${bill.number}`;
          const cached = localStorage.getItem(`ai_summary_v3_${billId}`);
          if (cached) {
            try {
              const analysis = JSON.parse(cached);
              const score = analysis.summary?.riskScore || 50;
              const level: RiskLevel = score >= 70 ? "high" : score >= 40 ? "medium" : "low";
              if (!selectedRiskLevels.includes(level)) return false;
            } catch {
              if (!selectedRiskLevels.includes("medium")) return false;
            }
          } else {
            if (!selectedRiskLevels.includes("medium")) return false;
          }
        }

        // Sponsor party filter
        if (selectedSponsorParty.length > 0 && bill.sponsors?.[0]?.party) {
          const party = bill.sponsors[0].party;
          const partyMatch = selectedSponsorParty.some(p => {
            if (p === "D") return party === "Democratic";
            if (p === "R") return party === "Republican";
            return false;
          });
          if (!partyMatch) return false;
        }
        
        return true;
      }
    });
  }, [combinedData, lifecycleFilter, jurisdictionLevel, selectedBranch, selectedInstrumentTypes, selectedStages, selectedStates, selectedCategories, selectedRiskLevels, selectedAuthorities, selectedChamber, deadlinePreset, selectedSponsorParty]);

  // ========== COUNTS ==========
  const totalMock = usaLegislationData.filter(i => !isDeleted(i.id)).length;
  const totalCongress = congressBills.length;
  const allCount = totalMock + totalCongress;
  
  const inForceCount = usaLegislationData.filter(i => i.isInForce && !isDeleted(i.id)).length;
  const pipelineCount = usaLegislationData.filter(i => i.isPipeline && !isDeleted(i.id)).length + totalCongress;

  const riskCounts = useMemo(() => {
    let high = 0, medium = 0, low = 0;
    
    filteredData.forEach(item => {
      if (item.type === "mock") {
        if (item.data.riskLevel === "high") high++;
        else if (item.data.riskLevel === "medium") medium++;
        else if (item.data.riskLevel === "low") low++;
      } else {
        const billId = `${item.data.congress}-${item.data.type}-${item.data.number}`;
        const cached = localStorage.getItem(`ai_summary_v3_${billId}`);
        if (cached) {
          try {
            const analysis = JSON.parse(cached);
            const score = analysis.summary?.riskScore || 50;
            if (score >= 70) high++;
            else if (score >= 40) medium++;
            else low++;
          } catch {
            medium++;
          }
        } else {
          medium++;
        }
      }
    });
    
    return { high, medium, low };
  }, [filteredData]);

  // ========== TOGGLE FUNCTIONS ==========
  const toggleInstrumentType = (type: USInstrumentType) => {
    setSelectedInstrumentTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
    setActivePresetId(undefined);
  };

  const toggleStage = (stage: CongressStage | RulemakingStage) => {
    setSelectedStages(prev =>
      prev.includes(stage) ? prev.filter(s => s !== stage) : [...prev, stage]
    );
    setActivePresetId(undefined);
  };

  const toggleAuthority = (auth: Authority) => {
    setSelectedAuthorities(prev => 
      prev.includes(auth) ? prev.filter(a => a !== auth) : [...prev, auth]
    );
    setActivePresetId(undefined);
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
    setActivePresetId(undefined);
  };

  const toggleState = (state: string) => {
    setSelectedStates(prev =>
      prev.includes(state) ? prev.filter(s => s !== state) : [...prev, state]
    );
    setActivePresetId(undefined);
  };

  const toggleChamber = (chamber: string) => {
    setSelectedChamber(prev =>
      prev.includes(chamber) ? prev.filter(c => c !== chamber) : [...prev, chamber]
    );
    setActivePresetId(undefined);
  };

  const toggleRiskLevel = (level: RiskLevel) => {
    setSelectedRiskLevels(prev =>
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
    setActivePresetId(undefined);
  };

  const toggleSponsorParty = (party: string) => {
    setSelectedSponsorParty(prev =>
      prev.includes(party) ? prev.filter(p => p !== party) : [...prev, party]
    );
    setActivePresetId(undefined);
  };

  const clearAllFilters = () => {
    setSelectedInstrumentTypes([]);
    setSelectedStages([]);
    setSelectedAuthorities([]);
    setSelectedCategories([]);
    setSelectedStates([]);
    setSelectedChamber([]);
    setSelectedRiskLevels([]);
    setSelectedSponsorParty([]);
    setSelectedBranch("all");
    setJurisdictionLevel("all");
    setLifecycleFilter("all");
    setDeadlinePreset("none");
    setActivePresetId(undefined);
  };

  // ========== APPLY PRESET ==========
  const applyPreset = useCallback((filters: USFilterPreset['filters']) => {
    // Clear existing filters first
    clearAllFilters();
    
    // Apply preset filters
    if (filters.lifecycle) setLifecycleFilter(filters.lifecycle);
    if (filters.level) setJurisdictionLevel(filters.level);
    if (filters.branch) setSelectedBranch(filters.branch);
    if (filters.instrumentTypes) setSelectedInstrumentTypes(filters.instrumentTypes);
    if (filters.stages) setSelectedStages(filters.stages);
    if (filters.riskLevels) setSelectedRiskLevels(filters.riskLevels);
    if (filters.deadlinePreset) setDeadlinePreset(filters.deadlinePreset);
    if (filters.states) setSelectedStates(filters.states);
    if (filters.categories) setSelectedCategories(filters.categories);
    
    // Find matching preset ID
    const matchingPreset = DEFAULT_US_PRESETS.find(p => 
      JSON.stringify(p.filters) === JSON.stringify(filters)
    );
    setActivePresetId(matchingPreset?.id);
  }, []);

  // ========== SMART FILTER DEPENDENCIES ==========
  const availableAuthorities = useMemo((): Authority[] => {
    if (selectedBranch === "legislative") return ["congress", "state", "city"];
    if (selectedBranch === "executive") return ["federal-agency"];
    if (jurisdictionLevel === "federal") return ["congress", "federal-agency"];
    if (jurisdictionLevel === "state") return ["state"];
    if (jurisdictionLevel === "local") return ["city"];
    return ["congress", "federal-agency", "state", "city"];
  }, [jurisdictionLevel, selectedBranch]);

  const availableStages = useMemo((): (CongressStage | RulemakingStage)[] => {
    const hasCongressTypes = selectedInstrumentTypes.length === 0 || 
      selectedInstrumentTypes.includes("congress-bill") || 
      selectedInstrumentTypes.includes("public-law");
    const hasRulemakingTypes = selectedInstrumentTypes.length === 0 || 
      selectedInstrumentTypes.includes("agency-rulemaking");
    
    const stages: (CongressStage | RulemakingStage)[] = [];
    if (hasCongressTypes) {
      stages.push("introduced", "in-committee", "on-calendar", "passed-chamber", "to-president", "enacted", "failed");
    }
    if (hasRulemakingTypes) {
      stages.push("draft", "proposed", "comment-open", "comment-closed", "final", "effective");
    }
    return stages;
  }, [selectedInstrumentTypes]);

  const showGeographyFilter = jurisdictionLevel !== "federal";
  const showChamberFilter = selectedInstrumentTypes.length === 0 || selectedInstrumentTypes.includes("congress-bill");
  const showSponsorPartyFilter = selectedInstrumentTypes.length === 0 || selectedInstrumentTypes.includes("congress-bill");

  // ========== FILTER COUNTS ==========
  const coreFilterCount = selectedInstrumentTypes.length + selectedStages.length + selectedRiskLevels.length + 
    (selectedBranch !== "all" ? 1 : 0) + selectedStates.length + selectedCategories.length;
  const advancedFilterCount = selectedAuthorities.length + selectedChamber.length + selectedSponsorParty.length + 
    (deadlinePreset !== "none" ? 1 : 0);
  const hasAnyFilters = coreFilterCount > 0 || advancedFilterCount > 0 || jurisdictionLevel !== "all" || lifecycleFilter !== "all";

  // ========== LABEL HELPERS ==========
  const getJurisdictionLabel = () => {
    if (selectedStates.length === 0) return "Jurisdiction · All US";
    if (selectedStates.length <= 3) return `Jurisdiction · ${selectedStates.join(", ")}`;
    return `Jurisdiction · ${selectedStates.length} states`;
  };

  const getBranchLabel = () => {
    if (selectedBranch === "all") return "Branch · All";
    return `Branch · ${branchLabels[selectedBranch]}`;
  };

  const getInstrumentLabel = () => {
    if (selectedInstrumentTypes.length === 0) return "Instrument · All";
    if (selectedInstrumentTypes.length === 1) return `Instrument · ${instrumentTypeLabels[selectedInstrumentTypes[0]].split(" ")[0]}`;
    return `Instrument · ${selectedInstrumentTypes.length} types`;
  };

  const getStageLabel = () => {
    if (selectedStages.length === 0) return "Stage · All";
    if (selectedStages.length === 1) {
      const stage = selectedStages[0];
      const label = congressStageLabels[stage as CongressStage] || rulemakingStageLabels[stage as RulemakingStage];
      return `Stage · ${label}`;
    }
    return `Stage · ${selectedStages.length} stages`;
  };

  const getRiskLabel = () => {
    if (selectedRiskLevels.length === 0) return "Risk · All";
    return `Risk · ${selectedRiskLevels.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(", ")}`;
  };

  const getCategoryLabel = () => {
    if (selectedCategories.length === 0) return "Category · All";
    if (selectedCategories.length === 1) return `Category · ${selectedCategories[0]}`;
    return `Category · ${selectedCategories.length} selected`;
  };

  // ========== EVENT HANDLERS ==========
  const handleReport = (id: string) => {
    toast({ title: "Reported", description: "This item has been flagged for review." });
  };

  const handleRefresh = (id: string) => {
    toast({ title: "Refreshed", description: "Item data has been updated." });
  };

  const handleDelete = (id: string) => {
    deleteAlert(id);
    toast({ title: "Deleted", description: "Item has been removed from your view." });
  };

  const handleViewMockDetails = (item: USLegislationItem) => {
    markAsRead(item.id);
    setSelectedMockItem(item);
    setMockDrawerOpen(true);
  };

  const handleViewCongressDetails = (bill: CongressBill) => {
    const billId = `${bill.congress}-${bill.type}-${bill.number}`;
    markAsRead(billId);
    setSelectedCongressBill(bill);
    setCongressDrawerOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          🇺🇸 USA Legislation
        </h2>
        <p className="text-muted-foreground">
          {congressLoading ? "Loading Congress bills..." : `${allCount} items: ${totalCongress} Congress bills + ${totalMock} other documents`}
        </p>
      </div>

      {/* ========== PRESET QUICK VIEWS ========== */}
      <USAFilterPresets onApplyPreset={applyPreset} activePresetId={activePresetId} />

      {/* ========== ROW 1: SCOPE (Lifecycle + Level) ========== */}
      <div className="bg-muted/50 border border-border rounded-lg p-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Lifecycle Tabs */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Lifecycle</span>
            <Tabs value={lifecycleFilter} onValueChange={(v) => { setLifecycleFilter(v as LifecycleStatus); setActivePresetId(undefined); }}>
              <TabsList className="bg-background p-1 shadow-sm">
                <TabsTrigger 
                  value="all" 
                  className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {lifecycleIcons.all}
                  All
                  <Badge variant="outline" className="ml-1 bg-background/50 text-foreground border-border text-[10px] px-1">
                    {allCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger 
                  value="in-force" 
                  className="gap-1.5 text-xs data-[state=active]:bg-success data-[state=active]:text-success-foreground"
                >
                  {lifecycleIcons["in-force"]}
                  In Force
                  <Badge variant="outline" className="ml-1 bg-background/50 text-foreground border-border text-[10px] px-1">
                    {inForceCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger 
                  value="pipeline" 
                  className="gap-1.5 text-xs data-[state=active]:bg-warning data-[state=active]:text-warning-foreground"
                >
                  {lifecycleIcons.pipeline}
                  Pipeline
                  <Badge variant="outline" className="ml-1 bg-background/50 text-foreground border-border text-[10px] px-1">
                    {pipelineCount}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Jurisdiction Level Tabs */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Level</span>
            <Tabs value={jurisdictionLevel} onValueChange={(v) => {
              setJurisdictionLevel(v as JurisdictionLevel);
              setActivePresetId(undefined);
              if (v === "federal") setSelectedStates([]);
            }}>
              <TabsList className="bg-background p-1 shadow-sm">
                <TabsTrigger value="all" className="gap-1.5 text-xs">
                  <Scale className="h-3.5 w-3.5" />
                  All
                </TabsTrigger>
                <TabsTrigger value="federal" className="gap-1.5 text-xs">
                  <Building2 className="h-3.5 w-3.5" />
                  Federal
                </TabsTrigger>
                <TabsTrigger value="state" className="gap-1.5 text-xs">
                  <MapPin className="h-3.5 w-3.5" />
                  State
                </TabsTrigger>
                <TabsTrigger value="local" className="gap-1.5 text-xs">
                  <Home className="h-3.5 w-3.5" />
                  Local
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* View Toggle */}
            <div className="flex items-center gap-1 ml-4">
              <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => setViewMode("list")}>
                <List className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => setViewMode("grid")}>
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ========== ROW 2: CORE FILTERS ========== */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Branch Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant={selectedBranch !== "all" ? "secondary" : "outline"} 
              size="sm" 
              className={cn("gap-2 h-9", selectedBranch !== "all" && "pr-2")}
            >
              <GitBranch className="h-3.5 w-3.5" />
              {getBranchLabel()}
              {selectedBranch !== "all" && (
                <span className="ml-1 hover:bg-destructive/20 rounded-full p-0.5" onClick={(e) => { e.stopPropagation(); setSelectedBranch("all"); setActivePresetId(undefined); }}>
                  <X className="h-3 w-3" />
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 bg-background border border-border z-50">
            <div className="space-y-2">
              {(["all", "legislative", "executive", "judicial"] as USBranch[]).map(branch => (
                <div key={branch} className="flex items-center gap-2">
                  <Checkbox
                    id={`branch-${branch}`}
                    checked={selectedBranch === branch}
                    onCheckedChange={() => { setSelectedBranch(branch); setActivePresetId(undefined); }}
                  />
                  <label htmlFor={`branch-${branch}`} className="text-sm cursor-pointer">
                    {branchLabels[branch]}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Instrument Type Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant={selectedInstrumentTypes.length > 0 ? "secondary" : "outline"} 
              size="sm" 
              className={cn("gap-2 h-9", selectedInstrumentTypes.length > 0 && "pr-2")}
            >
              <ScrollText className="h-3.5 w-3.5" />
              {getInstrumentLabel()}
              {selectedInstrumentTypes.length > 0 && (
                <span className="ml-1 hover:bg-destructive/20 rounded-full p-0.5" onClick={(e) => { e.stopPropagation(); setSelectedInstrumentTypes([]); setActivePresetId(undefined); }}>
                  <X className="h-3 w-3" />
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 bg-background border border-border z-50">
            <div className="space-y-2">
              {(Object.keys(instrumentTypeLabels) as USInstrumentType[]).map(type => (
                <div key={type} className="flex items-center gap-2">
                  <Checkbox
                    id={`inst-${type}`}
                    checked={selectedInstrumentTypes.includes(type)}
                    onCheckedChange={() => toggleInstrumentType(type)}
                  />
                  <label htmlFor={`inst-${type}`} className="text-sm cursor-pointer">
                    {instrumentTypeLabels[type]}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Stage Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant={selectedStages.length > 0 ? "secondary" : "outline"} 
              size="sm" 
              className={cn("gap-2 h-9", selectedStages.length > 0 && "pr-2")}
            >
              <Clock className="h-3.5 w-3.5" />
              {getStageLabel()}
              {selectedStages.length > 0 && (
                <span className="ml-1 hover:bg-destructive/20 rounded-full p-0.5" onClick={(e) => { e.stopPropagation(); setSelectedStages([]); setActivePresetId(undefined); }}>
                  <X className="h-3 w-3" />
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 bg-background border border-border z-50 max-h-72 overflow-y-auto">
            <div className="space-y-3">
              {availableStages.includes("introduced") && (
                <>
                  <div className="text-xs font-medium text-muted-foreground uppercase">Congress Stages</div>
                  {(["introduced", "in-committee", "on-calendar", "passed-chamber", "to-president", "enacted", "failed"] as CongressStage[]).map(stage => (
                    <div key={stage} className="flex items-center gap-2">
                      <Checkbox
                        id={`stage-${stage}`}
                        checked={selectedStages.includes(stage)}
                        onCheckedChange={() => toggleStage(stage)}
                      />
                      <label htmlFor={`stage-${stage}`} className="text-sm cursor-pointer">
                        {congressStageLabels[stage]}
                      </label>
                    </div>
                  ))}
                </>
              )}
              {availableStages.includes("draft") && (
                <>
                  <div className="text-xs font-medium text-muted-foreground uppercase mt-2">Rulemaking Stages</div>
                  {(["draft", "proposed", "comment-open", "comment-closed", "final", "effective"] as RulemakingStage[]).map(stage => (
                    <div key={stage} className="flex items-center gap-2">
                      <Checkbox
                        id={`stage-${stage}`}
                        checked={selectedStages.includes(stage)}
                        onCheckedChange={() => toggleStage(stage)}
                      />
                      <label htmlFor={`stage-${stage}`} className="text-sm cursor-pointer">
                        {rulemakingStageLabels[stage]}
                      </label>
                    </div>
                  ))}
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Risk Level Filter - Moved from Advanced */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant={selectedRiskLevels.length > 0 ? "secondary" : "outline"} 
              size="sm" 
              className={cn("gap-2 h-9", selectedRiskLevels.length > 0 && "pr-2")}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              {getRiskLabel()}
              {selectedRiskLevels.length > 0 && (
                <span className="ml-1 hover:bg-destructive/20 rounded-full p-0.5" onClick={(e) => { e.stopPropagation(); setSelectedRiskLevels([]); setActivePresetId(undefined); }}>
                  <X className="h-3 w-3" />
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 bg-background border border-border z-50">
            <div className="space-y-2">
              {(["high", "medium", "low"] as RiskLevel[]).map(level => (
                <div key={level} className="flex items-center gap-2">
                  <Checkbox
                    id={`risk-${level}`}
                    checked={selectedRiskLevels.includes(level)}
                    onCheckedChange={() => toggleRiskLevel(level)}
                  />
                  <label htmlFor={`risk-${level}`} className="text-sm cursor-pointer flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", 
                      level === "high" && "bg-risk-high",
                      level === "medium" && "bg-risk-medium",
                      level === "low" && "bg-risk-low"
                    )} />
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Jurisdiction Filter (States) */}
        {showGeographyFilter && (
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant={selectedStates.length > 0 ? "secondary" : "outline"} 
                size="sm" 
                className={cn("gap-2 h-9", selectedStates.length > 0 && "pr-2")}
              >
                <MapPin className="h-3.5 w-3.5" />
                {getJurisdictionLabel()}
                {selectedStates.length > 0 && (
                  <span className="ml-1 hover:bg-destructive/20 rounded-full p-0.5" onClick={(e) => { e.stopPropagation(); setSelectedStates([]); setActivePresetId(undefined); }}>
                    <X className="h-3 w-3" />
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-background border border-border max-h-80 overflow-y-auto z-50">
              <div className="text-xs font-medium text-muted-foreground mb-2 uppercase">
                Select {jurisdictionLevel === "local" ? "Cities" : "States"}
              </div>
              <div className="grid grid-cols-2 gap-1">
                {usStates.map(state => (
                  <div key={state.code} className="flex items-center gap-2">
                    <Checkbox
                      id={`state-${state.code}`}
                      checked={selectedStates.includes(state.code)}
                      onCheckedChange={() => toggleState(state.code)}
                    />
                    <label htmlFor={`state-${state.code}`} className="text-xs cursor-pointer">
                      {state.code} - {state.name}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Category Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant={selectedCategories.length > 0 ? "secondary" : "outline"} 
              size="sm" 
              className={cn("gap-2 h-9", selectedCategories.length > 0 && "pr-2")}
            >
              <Briefcase className="h-3.5 w-3.5" />
              {getCategoryLabel()}
              {selectedCategories.length > 0 && (
                <span className="ml-1 hover:bg-destructive/20 rounded-full p-0.5" onClick={(e) => { e.stopPropagation(); setSelectedCategories([]); setActivePresetId(undefined); }}>
                  <X className="h-3 w-3" />
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 bg-background border border-border z-50">
            <div className="space-y-2">
              {regulatoryCategories.map(cat => (
                <div key={cat} className="flex items-center gap-2">
                  <Checkbox
                    id={`cat-${cat}`}
                    checked={selectedCategories.includes(cat)}
                    onCheckedChange={() => toggleCategory(cat)}
                  />
                  <label htmlFor={`cat-${cat}`} className="text-sm cursor-pointer">
                    {cat}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Advanced Filters Toggle */}
        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant={advancedFilterCount > 0 ? "secondary" : "ghost"} 
              size="sm" 
              className="gap-2 h-9 text-muted-foreground"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Advanced
              {advancedFilterCount > 0 && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {advancedFilterCount}
                </Badge>
              )}
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", advancedOpen && "rotate-180")} />
            </Button>
          </CollapsibleTrigger>
        </Collapsible>

        {hasAnyFilters && (
          <Button variant="ghost" size="sm" className="h-9 text-muted-foreground" onClick={clearAllFilters}>
            Clear all
          </Button>
        )}
      </div>

      {/* ========== ROW 3: ADVANCED FILTERS (Collapsible) ========== */}
      <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
        <CollapsibleContent>
          <div className="bg-muted/20 border border-border/50 rounded-lg p-3 space-y-3">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Advanced Filters</div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Authority Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant={selectedAuthorities.length > 0 ? "secondary" : "outline"} 
                    size="sm" 
                    className={cn("gap-2 h-8", selectedAuthorities.length > 0 && "pr-2")}
                  >
                    <Building2 className="h-3.5 w-3.5" />
                    Authority
                    {selectedAuthorities.length > 0 && (
                      <>
                        <Badge variant="secondary" className="text-[10px] px-1">{selectedAuthorities.length}</Badge>
                        <span className="ml-1 hover:bg-destructive/20 rounded-full p-0.5" onClick={(e) => { e.stopPropagation(); setSelectedAuthorities([]); setActivePresetId(undefined); }}>
                          <X className="h-3 w-3" />
                        </span>
                      </>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 bg-background border border-border z-50">
                  <div className="space-y-2">
                    {availableAuthorities.map(auth => (
                      <div key={auth} className="flex items-center gap-2">
                        <Checkbox
                          id={`auth-${auth}`}
                          checked={selectedAuthorities.includes(auth)}
                          onCheckedChange={() => toggleAuthority(auth)}
                        />
                        <label htmlFor={`auth-${auth}`} className="text-sm cursor-pointer">
                          {authorityLabels[auth]}
                        </label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Chamber Filter */}
              {showChamberFilter && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant={selectedChamber.length > 0 ? "secondary" : "outline"} 
                      size="sm" 
                      className={cn("gap-2 h-8", selectedChamber.length > 0 && "pr-2")}
                    >
                      <Landmark className="h-3.5 w-3.5" />
                      Chamber
                      {selectedChamber.length > 0 && (
                        <>
                          <Badge variant="secondary" className="text-[10px] px-1">{selectedChamber.length}</Badge>
                          <span className="ml-1 hover:bg-destructive/20 rounded-full p-0.5" onClick={(e) => { e.stopPropagation(); setSelectedChamber([]); setActivePresetId(undefined); }}>
                            <X className="h-3 w-3" />
                          </span>
                        </>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 bg-background border border-border z-50">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox id="chamber-house" checked={selectedChamber.includes("house")} onCheckedChange={() => toggleChamber("house")} />
                        <label htmlFor="chamber-house" className="text-sm cursor-pointer">House</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="chamber-senate" checked={selectedChamber.includes("senate")} onCheckedChange={() => toggleChamber("senate")} />
                        <label htmlFor="chamber-senate" className="text-sm cursor-pointer">Senate</label>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}

              {/* Sponsor Party Filter */}
              {showSponsorPartyFilter && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant={selectedSponsorParty.length > 0 ? "secondary" : "outline"} 
                      size="sm" 
                      className={cn("gap-2 h-8", selectedSponsorParty.length > 0 && "pr-2")}
                    >
                      Sponsor Party
                      {selectedSponsorParty.length > 0 && (
                        <>
                          <Badge variant="secondary" className="text-[10px] px-1">{selectedSponsorParty.length}</Badge>
                          <span className="ml-1 hover:bg-destructive/20 rounded-full p-0.5" onClick={(e) => { e.stopPropagation(); setSelectedSponsorParty([]); setActivePresetId(undefined); }}>
                            <X className="h-3 w-3" />
                          </span>
                        </>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 bg-background border border-border z-50">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox id="party-d" checked={selectedSponsorParty.includes("D")} onCheckedChange={() => toggleSponsorParty("D")} />
                        <label htmlFor="party-d" className="text-sm cursor-pointer">Democrat</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="party-r" checked={selectedSponsorParty.includes("R")} onCheckedChange={() => toggleSponsorParty("R")} />
                        <label htmlFor="party-r" className="text-sm cursor-pointer">Republican</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="party-bi" checked={selectedSponsorParty.includes("bipartisan")} onCheckedChange={() => toggleSponsorParty("bipartisan")} />
                        <label htmlFor="party-bi" className="text-sm cursor-pointer">Bipartisan</label>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}

              {/* Deadline Preset Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant={deadlinePreset !== "none" ? "secondary" : "outline"} 
                    size="sm" 
                    className={cn("gap-2 h-8", deadlinePreset !== "none" && "pr-2")}
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    {deadlinePreset === "none" ? "Deadline" : deadlinePresetLabels[deadlinePreset]}
                    {deadlinePreset !== "none" && (
                      <span className="ml-1 hover:bg-destructive/20 rounded-full p-0.5" onClick={(e) => { e.stopPropagation(); setDeadlinePreset("none"); setActivePresetId(undefined); }}>
                        <X className="h-3 w-3" />
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 bg-background border border-border z-50">
                  <div className="space-y-2">
                    {(["none", "next-30", "next-60", "next-90", "this-quarter"] as DeadlinePreset[]).map(preset => (
                      <div key={preset} className="flex items-center gap-2">
                        <Checkbox
                          id={`deadline-${preset}`}
                          checked={deadlinePreset === preset}
                          onCheckedChange={() => { setDeadlinePreset(preset); setActivePresetId(undefined); }}
                        />
                        <label htmlFor={`deadline-${preset}`} className="text-sm cursor-pointer">
                          {deadlinePresetLabels[preset]}
                        </label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredData.length}</div>
          </CardContent>
        </Card>
        <Card className="border-risk-high/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-risk-high">{riskCounts.high}</div>
          </CardContent>
        </Card>
        <Card className="border-risk-medium/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Medium Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-risk-medium">{riskCounts.medium}</div>
          </CardContent>
        </Card>
        <Card className="border-risk-low/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Low Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-risk-low">{riskCounts.low}</div>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {congressLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading Congress bills...</span>
        </div>
      )}

      {/* Error State */}
      {congressError && (
        <div className="text-center py-4 text-destructive">
          Error loading Congress bills: {congressError}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredData.length} items
      </div>

      {/* Cards */}
      {filteredData.length === 0 && !congressLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          No items match your filters
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
          {filteredData.map((item) => {
            if (item.type === "mock") {
              const itemId = item.data.id;
              return (
                <UnifiedAlertCard
                  key={itemId}
                  mockItem={item.data}
                  isRead={isRead(itemId)}
                  isStarred={isStarred(itemId)}
                  onMarkRead={() => markAsRead(itemId)}
                  onToggleStar={() => toggleStar(itemId)}
                  onDelete={() => handleDelete(itemId)}
                  onRefresh={() => handleRefresh(itemId)}
                  onReport={() => handleReport(itemId)}
                  onViewDetails={() => handleViewMockDetails(item.data)}
                  viewMode={viewMode}
                />
              );
            } else {
              const bill = item.data;
              const billId = `${bill.congress}-${bill.type}-${bill.number}`;
              return (
                <UnifiedAlertCard
                  key={billId}
                  congressBill={bill}
                  isRead={isRead(billId)}
                  isStarred={isStarred(billId)}
                  onMarkRead={() => markAsRead(billId)}
                  onToggleStar={() => toggleStar(billId)}
                  onDelete={() => handleDelete(billId)}
                  onRefresh={() => handleRefresh(billId)}
                  onReport={() => handleReport(billId)}
                  onViewDetails={() => handleViewCongressDetails(bill)}
                  viewMode={viewMode}
                />
              );
            }
          })}
        </div>
      )}

      {/* Drawers */}
      {selectedMockItem && (
        <USALegislationDrawer
          item={selectedMockItem}
          open={mockDrawerOpen}
          onClose={() => setMockDrawerOpen(false)}
        />
      )}

      {selectedCongressBill && (
        <CongressBillDrawer
          bill={selectedCongressBill}
          open={congressDrawerOpen}
          onOpenChange={setCongressDrawerOpen}
        />
      )}
    </div>
  );
}
