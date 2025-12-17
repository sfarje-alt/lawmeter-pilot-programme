// Peru Session Importer Component

import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Upload, 
  FileSpreadsheet, 
  FileText, 
  ClipboardPaste,
  AlertCircle,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface PeruSessionImporterProps {
  open: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<void>;
}

export function PeruSessionImporter({
  open,
  onClose,
  onImport,
}: PeruSessionImporterProps) {
  const [importMethod, setImportMethod] = useState<'file' | 'paste'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedContent, setPastedContent] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.type === 'application/vnd.ms-excel' ||
          file.type === 'application/pdf' ||
          file.name.endsWith('.xlsx') ||
          file.name.endsWith('.xls') ||
          file.name.endsWith('.pdf')) {
        setSelectedFile(file);
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    try {
      if (importMethod === 'file' && selectedFile) {
        await onImport(selectedFile);
      } else if (importMethod === 'paste' && pastedContent) {
        // Create a text file from pasted content
        const blob = new Blob([pastedContent], { type: 'text/csv' });
        const file = new File([blob], 'pasted-sessions.csv', { type: 'text/csv' });
        await onImport(file);
      }
      onClose();
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Sessions
          </DialogTitle>
          <DialogDescription>
            Import committee sessions from the Peru Congress website. 
            Export the sessions list from the official viewer and upload it here.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={importMethod} onValueChange={(v) => setImportMethod(v as 'file' | 'paste')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file" className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Upload File
            </TabsTrigger>
            <TabsTrigger value="paste" className="gap-2">
              <ClipboardPaste className="h-4 w-4" />
              Paste Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="mt-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-muted-foreground/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-3">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-green-500" />
                  <div>
                    <p className="font-medium text-foreground">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                  >
                    Choose Different File
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">
                      Drag and drop your file here
                    </p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse
                    </p>
                  </div>
                  <Input
                    type="file"
                    accept=".xlsx,.xls,.pdf"
                    onChange={handleFileChange}
                    className="max-w-xs mx-auto"
                  />
                  <p className="text-xs text-muted-foreground">
                    Supported formats: Excel (.xlsx, .xls), PDF
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="paste" className="mt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="pastedContent">Paste Session Data</Label>
                <Textarea
                  id="pastedContent"
                  placeholder="Paste the table content from the Congress website here...

Example format:
Comisión, Fecha, Hora, Agenda
Ciencia Innovación y Tecnología, 24/11/2025, 10:00, https://...
Defensa del Consumidor, 25/11/2025, 15:00, https://..."
                  value={pastedContent}
                  onChange={(e) => setPastedContent(e.target.value)}
                  className="mt-2 h-[200px] font-mono text-sm"
                />
              </div>
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <p>
                      You can copy and paste the sessions table directly from the 
                      Congress website. The system will try to parse the data automatically.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Source Info */}
        <Card className="bg-muted/30 border-muted">
          <CardContent className="pt-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Where to get session data:</p>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => window.open('https://www2.congreso.gob.pe/sicr/comisiones/sesiones.nsf', '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
                Open Congress Sessions Viewer
              </Button>
              <p className="text-xs text-muted-foreground">
                Navigate to "Visor de Sesiones de Comisiones" and export the sessions list.
              </p>
            </div>
          </CardContent>
        </Card>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={
              isImporting || 
              (importMethod === 'file' && !selectedFile) ||
              (importMethod === 'paste' && !pastedContent.trim())
            }
            className="gap-2"
          >
            {isImporting ? (
              <>Processing...</>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Import Sessions
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
