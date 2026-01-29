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
import { X, Plus } from "lucide-react";
import { ClientProfile, SECTORS, ProductService } from "../types";

interface Step2Props {
  data: ClientProfile;
  onChange: (data: Partial<ClientProfile>) => void;
}

const CUSTOMER_SEGMENTS = [
  'B2B',
  'B2C',
  'B2G (Gobierno)',
  'Corporativo',
  'PYME',
  'Retail',
  'Mayorista',
];

const DISTRIBUTION_CHANNELS = [
  'Venta Directa',
  'E-commerce',
  'Retail',
  'Distribuidores',
  'Agentes',
  'Franquicias',
  'Marketplace',
];

const COUNTRIES = [
  { code: 'PE', name: 'Perú' },
  { code: 'CO', name: 'Colombia' },
  { code: 'MX', name: 'México' },
  { code: 'CL', name: 'Chile' },
  { code: 'AR', name: 'Argentina' },
  { code: 'BR', name: 'Brasil' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'US', name: 'Estados Unidos' },
  { code: 'ES', name: 'España' },
];

export function Step2BusinessScope({ data, onChange }: Step2Props) {
  const [newProduct, setNewProduct] = useState<ProductService>({ name: '', description: '' });
  const [customPrimarySector, setCustomPrimarySector] = useState("");

  const addSecondarySector = (sector: string) => {
    if (!data.secondarySectors.includes(sector)) {
      onChange({ secondarySectors: [...data.secondarySectors, sector] });
    }
  };

  const removeSecondarySector = (sector: string) => {
    onChange({ secondarySectors: data.secondarySectors.filter(s => s !== sector) });
  };

  const addProduct = () => {
    if (newProduct.name) {
      onChange({ productsServices: [...data.productsServices, newProduct] });
      setNewProduct({ name: '', description: '' });
    }
  };

  const removeProduct = (index: number) => {
    onChange({ productsServices: data.productsServices.filter((_, i) => i !== index) });
  };

  const toggleSegment = (segment: string) => {
    if (data.customerSegments.includes(segment)) {
      onChange({ customerSegments: data.customerSegments.filter(s => s !== segment) });
    } else {
      onChange({ customerSegments: [...data.customerSegments, segment] });
    }
  };

  const toggleChannel = (channel: string) => {
    if (data.distributionChannels.includes(channel)) {
      onChange({ distributionChannels: data.distributionChannels.filter(c => c !== channel) });
    } else {
      onChange({ distributionChannels: [...data.distributionChannels, channel] });
    }
  };

  const toggleCrossBorderCountry = (country: string) => {
    if (data.crossBorderCountries.includes(country)) {
      onChange({ crossBorderCountries: data.crossBorderCountries.filter(c => c !== country) });
    } else {
      onChange({ crossBorderCountries: [...data.crossBorderCountries, country] });
    }
  };

  const handlePrimarySectorChange = (value: string) => {
    if (value === "Otro") {
      setCustomPrimarySector("");
    }
    onChange({ primarySector: value });
  };

  const handleCustomPrimarySectorChange = (value: string) => {
    setCustomPrimarySector(value);
    if (value.trim()) {
      onChange({ primarySector: value.trim() });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Business Scope</h2>
        <p className="text-sm text-muted-foreground">
          Define the client's business activities and market presence
        </p>
      </div>

      {/* Sectors */}
      <div className="grid grid-cols-2 gap-4 items-start">
        <div className="space-y-2">
          <Label>Primary Sector</Label>
          <Select
            value={SECTORS.includes(data.primarySector || "") ? data.primarySector : "Otro"}
            onValueChange={handlePrimarySectorChange}
          >
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder="Select primary sector" />
            </SelectTrigger>
            <SelectContent>
              {SECTORS.map((sector) => (
                <SelectItem key={sector} value={sector}>{sector}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Custom sector input when "Otro" is selected */}
          {(data.primarySector === "Otro" || (data.primarySector && !SECTORS.includes(data.primarySector))) && (
            <Input
              value={SECTORS.includes(data.primarySector || "") ? customPrimarySector : data.primarySector}
              onChange={(e) => handleCustomPrimarySectorChange(e.target.value)}
              placeholder="Specify sector..."
              className="bg-background/50 mt-2"
            />
          )}
        </div>
        <div className="space-y-2">
          <Label>Secondary Sectors</Label>
          <Select onValueChange={addSecondarySector}>
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder="Add secondary sector..." />
            </SelectTrigger>
            <SelectContent>
              {SECTORS.filter(s => s !== data.primarySector && !data.secondarySectors.includes(s)).map((sector) => (
                <SelectItem key={sector} value={sector}>{sector}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {data.secondarySectors.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {data.secondarySectors.map((sector) => (
                <Badge key={sector} variant="secondary" className="gap-1 text-xs">
                  {sector}
                  <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removeSecondarySector(sector)} />
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Regulatory Context */}
      <div className="space-y-2">
        <Label htmlFor="businessModel">Regulatory Context</Label>
        <p className="text-xs text-muted-foreground">
          Describe the client's operations that may be subject to regulatory oversight
        </p>
        <Textarea
          id="businessModel"
          value={data.businessModelDescription || ""}
          onChange={(e) => onChange({ businessModelDescription: e.target.value })}
          placeholder="E.g., Manufactures consumer electronics requiring CE/FCC certification, operates e-commerce with cross-border data flows..."
          className="bg-background/50 resize-none"
          rows={3}
        />
      </div>

      {/* Products/Services */}
      <div className="space-y-2">
        <Label>Products/Services</Label>
        <div className="space-y-2 mb-2">
          {data.productsServices.map((product, index) => (
            <div key={index} className="flex items-center gap-2 p-2 rounded bg-background/30 border border-border/30">
              <div className="flex-1">
                <div className="font-medium text-sm">{product.name}</div>
                {product.description && (
                  <div className="text-xs text-muted-foreground">{product.description}</div>
                )}
              </div>
              <X className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-destructive" onClick={() => removeProduct(index)} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Input
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            placeholder="Product/Service name"
            className="bg-background/50"
          />
          <Input
            value={newProduct.description || ""}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            placeholder="Description (optional)"
            className="bg-background/50"
          />
          <Button type="button" variant="outline" onClick={addProduct} disabled={!newProduct.name}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
      </div>

      {/* Customer Segments */}
      <div className="space-y-2">
        <Label>Customer Segments</Label>
        <div className="flex flex-wrap gap-2">
          {CUSTOMER_SEGMENTS.map((segment) => (
            <Badge
              key={segment}
              variant={data.customerSegments.includes(segment) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleSegment(segment)}
            >
              {segment}
            </Badge>
          ))}
        </div>
      </div>

      {/* Distribution Channels */}
      <div className="space-y-2">
        <Label>Distribution Channels</Label>
        <div className="flex flex-wrap gap-2">
          {DISTRIBUTION_CHANNELS.map((channel) => (
            <Badge
              key={channel}
              variant={data.distributionChannels.includes(channel) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleChannel(channel)}
            >
              {channel}
            </Badge>
          ))}
        </div>
      </div>

      {/* Cross-border Toggle */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-border/30">
        <div>
          <Label htmlFor="isCrossBorder">Cross-border Operations</Label>
          <p className="text-sm text-muted-foreground">
            Does this client operate across multiple countries?
          </p>
        </div>
        <Switch
          id="isCrossBorder"
          checked={data.isCrossBorder}
          onCheckedChange={(checked) => onChange({ isCrossBorder: checked })}
        />
      </div>

      {/* Cross-border Countries */}
      {data.isCrossBorder && (
        <div className="space-y-2">
          <Label>Cross-border Countries</Label>
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.map((country) => (
              <Badge
                key={country.code}
                variant={data.crossBorderCountries.includes(country.code) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleCrossBorderCountry(country.code)}
              >
                {country.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
