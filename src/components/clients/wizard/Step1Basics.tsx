import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus, Upload, Sparkles, FileText } from "lucide-react";
import { ClientProfile, COMPANY_TYPES, SECTORS, ProductService } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Step1Props {
  data: ClientProfile;
  onChange: (data: Partial<ClientProfile>) => void;
  onAISuggestions?: (suggestions: Partial<ClientProfile>) => void;
}

const COUNTRIES = [
  { code: 'PE', name: 'Perú' },
  { code: 'CO', name: 'Colombia' },
  { code: 'MX', name: 'México' },
  { code: 'CL', name: 'Chile' },
  { code: 'AR', name: 'Argentina' },
  { code: 'BR', name: 'Brasil' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'BO', name: 'Bolivia' },
];

const SUPERVISING_AUTHORITIES = [
  'BCRP', 'SBS', 'SMV', 'OSINERGMIN', 'OSIPTEL', 'SUNASS', 
  'INDECOPI', 'SUNAT', 'MTPE', 'OEFA', 'DIGEMID', 'DIGESA'
];

const CROSS_BORDER_COUNTRIES = [
  { code: 'PE', name: 'Perú' },
  { code: 'CO', name: 'Colombia' },
  { code: 'CL', name: 'Chile' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'MX', name: 'México' },
  { code: 'BR', name: 'Brasil' },
  { code: 'US', name: 'Estados Unidos' },
];

export function Step1Basics({ data, onChange, onAISuggestions }: Step1Props) {
  const [newAuthority, setNewAuthority] = useState("");
  const [newProduct, setNewProduct] = useState<ProductService>({ name: '', description: '' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [documentText, setDocumentText] = useState("");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // For now, we'll read text files. PDF parsing would need additional handling.
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const text = await file.text();
      setDocumentText(text);
    } else {
      toast.info("Por ahora solo se soportan archivos .txt. Pega el contenido del documento abajo.");
    }
  };

  const analyzeDocument = async () => {
    if (!documentText.trim()) {
      toast.error("Ingresa o pega el contenido del documento primero");
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('analyze-client-document', {
        body: { documentText, documentType: 'company_document' }
      });

      if (error) throw error;

      if (result?.success && result?.analysis) {
        const analysis = result.analysis;
        
        // Apply suggestions
        const suggestions: Partial<ClientProfile> = {};
        
        if (analysis.suggestedSector) {
          suggestions.primarySector = analysis.suggestedSector;
        }
        if (analysis.secondarySectors?.length) {
          suggestions.secondarySectors = analysis.secondarySectors;
        }
        if (analysis.productsServices?.length) {
          suggestions.productsServices = analysis.productsServices;
        }
        if (analysis.keywords?.length) {
          suggestions.keywords = [...new Set([...data.keywords, ...analysis.keywords])];
        }
        if (analysis.suggestedExclusions?.length) {
          suggestions.exclusions = analysis.suggestedExclusions;
        }
        if (analysis.regulatoryContext) {
          suggestions.shortDescription = analysis.regulatoryContext;
        }

        onChange(suggestions);
        onAISuggestions?.(suggestions);
        
        toast.success(`AI extrajo ${analysis.keywords?.length || 0} keywords y ${analysis.productsServices?.length || 0} productos/servicios`);
      }
    } catch (error) {
      console.error('Error analyzing document:', error);
      toast.error("Error al analizar el documento");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addLocation = (country: string) => {
    if (!data.locations.find(l => l.country === country)) {
      onChange({ locations: [...data.locations, { country, regions: [] }] });
    }
  };

  const removeLocation = (country: string) => {
    onChange({ locations: data.locations.filter(l => l.country !== country) });
  };

  const addAuthority = (authority: string) => {
    if (authority && !data.supervisingAuthorities.includes(authority)) {
      onChange({ supervisingAuthorities: [...data.supervisingAuthorities, authority] });
    }
    setNewAuthority("");
  };

  const removeAuthority = (authority: string) => {
    onChange({ supervisingAuthorities: data.supervisingAuthorities.filter(a => a !== authority) });
  };

  const addSecondarySector = (sector: string) => {
    if (!data.secondarySectors.includes(sector)) {
      onChange({ secondarySectors: [...data.secondarySectors, sector] });
    }
  };

  const addProduct = () => {
    if (newProduct.name) {
      onChange({ productsServices: [...data.productsServices, newProduct] });
      setNewProduct({ name: '', description: '' });
    }
  };

  const toggleCrossBorderCountry = (country: string) => {
    if (data.crossBorderCountries.includes(country)) {
      onChange({ crossBorderCountries: data.crossBorderCountries.filter(c => c !== country) });
    } else {
      onChange({ crossBorderCountries: [...data.crossBorderCountries, country] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Client Basics</h2>
        <p className="text-sm text-muted-foreground">
          Company information and business scope
        </p>
      </div>

      {/* AI Document Upload */}
      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <Label className="font-medium">AI-Assisted Setup</Label>
        </div>
        <p className="text-xs text-muted-foreground">
          Upload or paste company documents (statutes, annual report) to auto-extract keywords and business info.
        </p>
        <div className="flex gap-2">
          <label className="flex-1">
            <input type="file" accept=".txt,.pdf" onChange={handleFileUpload} className="hidden" />
            <Button type="button" variant="outline" className="w-full" asChild>
              <span><Upload className="h-4 w-4 mr-2" /> Upload Document</span>
            </Button>
          </label>
        </div>
        <Textarea
          value={documentText}
          onChange={(e) => setDocumentText(e.target.value)}
          placeholder="Or paste document content here..."
          className="bg-background/50 resize-none text-xs"
          rows={3}
        />
        <Button 
          onClick={analyzeDocument} 
          disabled={isAnalyzing || !documentText.trim()}
          className="w-full"
        >
          {isAnalyzing ? (
            <>Analyzing...</>
          ) : (
            <><Sparkles className="h-4 w-4 mr-2" /> Analyze with AI</>
          )}
        </Button>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="legalName">Legal Name *</Label>
          <Input
            id="legalName"
            value={data.legalName}
            onChange={(e) => onChange({ legalName: e.target.value })}
            placeholder="e.g., Empresa ABC S.A.C."
            className="bg-background/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tradeName">Trade Name</Label>
          <Input
            id="tradeName"
            value={data.tradeName || ""}
            onChange={(e) => onChange({ tradeName: e.target.value })}
            placeholder="e.g., ABC Corp"
            className="bg-background/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Company Type</Label>
          <Select value={data.companyType || ""} onValueChange={(value) => onChange({ companyType: value })}>
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {COMPANY_TYPES.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Primary Sector</Label>
          <Select value={data.primarySector || ""} onValueChange={(value) => onChange({ primarySector: value })}>
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder="Select sector" />
            </SelectTrigger>
            <SelectContent>
              {SECTORS.map((sector) => (
                <SelectItem key={sector} value={sector}>{sector}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Secondary Sectors */}
      {data.secondarySectors.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {data.secondarySectors.map((sector) => (
            <Badge key={sector} variant="secondary" className="gap-1 text-xs">
              {sector}
              <X className="h-3 w-3 cursor-pointer" onClick={() => onChange({ secondarySectors: data.secondarySectors.filter(s => s !== sector) })} />
            </Badge>
          ))}
        </div>
      )}

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="shortDescription">Brief Description</Label>
        <Textarea
          id="shortDescription"
          value={data.shortDescription || ""}
          onChange={(e) => onChange({ shortDescription: e.target.value })}
          placeholder="Brief description of regulatory exposure..."
          className="bg-background/50 resize-none"
          rows={2}
        />
      </div>

      {/* Locations */}
      <div className="space-y-2">
        <Label>Locations</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {data.locations.map((loc) => (
            <Badge key={loc.country} variant="secondary" className="gap-1">
              {COUNTRIES.find(c => c.code === loc.country)?.name || loc.country}
              <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removeLocation(loc.country)} />
            </Badge>
          ))}
        </div>
        <Select onValueChange={addLocation}>
          <SelectTrigger className="bg-background/50">
            <SelectValue placeholder="Add location..." />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.filter(c => !data.locations.find(l => l.country === c.code)).map((country) => (
              <SelectItem key={country.code} value={country.code}>{country.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Supervising Authorities */}
      <div className="space-y-2">
        <Label>Supervising Authorities</Label>
        <div className="flex flex-wrap gap-1 mb-2">
          {SUPERVISING_AUTHORITIES.map((auth) => (
            <Badge
              key={auth}
              variant={data.supervisingAuthorities.includes(auth) ? "default" : "outline"}
              className="cursor-pointer text-xs"
              onClick={() => data.supervisingAuthorities.includes(auth) ? removeAuthority(auth) : addAuthority(auth)}
            >
              {auth}
            </Badge>
          ))}
        </div>
      </div>

      {/* Products/Services */}
      <div className="space-y-2">
        <Label>Products/Services</Label>
        {data.productsServices.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {data.productsServices.map((product, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {product.name}
                <X className="h-3 w-3 cursor-pointer" onClick={() => onChange({ productsServices: data.productsServices.filter((_, i) => i !== index) })} />
              </Badge>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Input
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            placeholder="Product/Service name"
            className="bg-background/50"
            onKeyPress={(e) => e.key === 'Enter' && addProduct()}
          />
          <Button type="button" variant="outline" onClick={addProduct} disabled={!newProduct.name}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Cross-border Toggle */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border/30">
        <div>
          <Label htmlFor="isCrossBorder">Cross-border Operations</Label>
          <p className="text-xs text-muted-foreground">Monitor legislation in multiple countries?</p>
        </div>
        <Switch
          id="isCrossBorder"
          checked={data.isCrossBorder}
          onCheckedChange={(checked) => onChange({ isCrossBorder: checked })}
        />
      </div>

      {data.isCrossBorder && (
        <div className="flex flex-wrap gap-2">
          {CROSS_BORDER_COUNTRIES.map((country) => (
            <Badge
              key={country.code}
              variant={data.crossBorderCountries.includes(country.code) ? "default" : "outline"}
              className="cursor-pointer text-xs"
              onClick={() => toggleCrossBorderCountry(country.code)}
            >
              {country.name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
