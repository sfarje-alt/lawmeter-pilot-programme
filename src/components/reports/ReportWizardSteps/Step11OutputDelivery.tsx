import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ReportConfig } from "../types";
import { FileText, FileSpreadsheet } from "lucide-react";

interface Step11Props {
  config: ReportConfig;
  onUpdate: (updates: Partial<ReportConfig>) => void;
}

export function Step11OutputDelivery({ config, onUpdate }: Step11Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Formato de Salida</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Seleccione el formato del documento generado
        </p>
      </div>

      <RadioGroup
        value={config.outputFormat}
        onValueChange={(value) => onUpdate({ outputFormat: value as ReportConfig['outputFormat'] })}
        className="grid gap-4"
      >
        <Label htmlFor="format-pdf" className="cursor-pointer">
          <Card className={`transition-all hover:border-primary/50 ${
            config.outputFormat === 'pdf' 
              ? 'border-primary bg-primary/5' 
              : 'border-border/50'
          }`}>
            <CardContent className="flex items-center gap-4 p-4">
              <RadioGroupItem value="pdf" id="format-pdf" />
              <div className="p-2 rounded-lg bg-red-500/10">
                <FileText className="h-5 w-5 text-red-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-foreground">PDF</div>
                <div className="text-sm text-muted-foreground">
                  Documento portable, ideal para distribución y archivo
                </div>
              </div>
            </CardContent>
          </Card>
        </Label>

        <Label htmlFor="format-docx" className="cursor-pointer opacity-50">
          <Card className="border-border/50">
            <CardContent className="flex items-center gap-4 p-4">
              <RadioGroupItem value="docx" id="format-docx" disabled />
              <div className="p-2 rounded-lg bg-blue-500/10">
                <FileSpreadsheet className="h-5 w-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-foreground">DOCX</div>
                <div className="text-sm text-muted-foreground">
                  Documento editable (próximamente)
                </div>
              </div>
            </CardContent>
          </Card>
        </Label>
      </RadioGroup>
    </div>
  );
}
