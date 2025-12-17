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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  ClipboardPaste,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Link as LinkIcon,
  Calendar,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ExtractedLink {
  url: string;
  index: number;
}

// Exported for use in parent component
export interface ParsedSession {
  tipo_comision: string;
  commission_name: string;
  session_title: string;
  caracteristicas: string | null;
  scheduled_date: string;
  scheduled_time: string;
  agenda_url: string | null;
  external_session_id: string | null;
}

interface PeruSessionImporterProps {
  open: boolean;
  onClose: () => void;
  onImport: (sessions: ParsedSession[]) => Promise<void>;
}

// Extract session ID from agenda URL
function extractSessionId(url: string): string | null {
  const match = url.match(/[\/=]([A-Z0-9]{20,})/i);
  return match ? match[1] : null;
}

export function PeruSessionImporter({
  open,
  onClose,
  onImport,
}: PeruSessionImporterProps) {
  const [importMethod, setImportMethod] = useState<'file' | 'paste'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedContent, setPastedContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [extractedLinks, setExtractedLinks] = useState<ExtractedLink[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);

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
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setSelectedFile(file);
        setExtractedLinks([]);
        setParseError(null);
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setExtractedLinks([]);
      setParseError(null);
    }
  };

  const handleProcessPdf = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    setParseError(null);
    setExtractedLinks([]);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const { data, error } = await supabase.functions.invoke('parse-peru-sessions-pdf', {
        body: formData,
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to process PDF');
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      const links = data.links || [];
      setExtractedLinks(links);
      
      if (links.length === 0) {
        setParseError('No se encontraron links de agenda en el PDF.');
      } else {
        toast.success(`Se encontraron ${links.length} links de agenda`);
      }
      
    } catch (error) {
      console.error('Error processing PDF:', error);
      setParseError(error instanceof Error ? error.message : 'Failed to process PDF');
      toast.error('Error al procesar el PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (extractedLinks.length === 0) return;
    
    // Convert links to sessions (minimal data - user can enrich later)
    const sessions: ParsedSession[] = extractedLinks.map((link, index) => ({
      tipo_comision: 'Ordinaria',
      commission_name: `Sesión ${index + 1}`,
      session_title: `Sesión importada desde PDF`,
      caracteristicas: null,
      scheduled_date: new Date().toISOString().split('T')[0],
      scheduled_time: '',
      agenda_url: link.url,
      external_session_id: extractSessionId(link.url),
    }));
    
    setIsImporting(true);
    try {
      await onImport(sessions);
      toast.success(`Se importaron ${sessions.length} sesiones con links de agenda`);
      onClose();
    } catch (error) {
      console.error('Error importing sessions:', error);
      toast.error('Error al importar sesiones');
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setExtractedLinks([]);
    setParseError(null);
    setPastedContent('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={() => handleClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Sesiones del Congreso de Perú
          </DialogTitle>
          <DialogDescription>
            Sube el PDF exportado desde el visor de sesiones. 
            El sistema extraerá los links de agenda embebidos.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={importMethod} onValueChange={(v) => setImportMethod(v as 'file' | 'paste')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="file" className="gap-2">
                <FileText className="h-4 w-4" />
                Subir PDF
              </TabsTrigger>
              <TabsTrigger value="paste" className="gap-2">
                <ClipboardPaste className="h-4 w-4" />
                Pegar Datos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="mt-4 space-y-4">
              {/* File Upload Zone */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
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
                    <CheckCircle2 className="h-10 w-10 mx-auto text-green-500" />
                    <div>
                      <p className="font-medium text-foreground">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <div className="flex justify-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedFile(null);
                          setExtractedLinks([]);
                          setParseError(null);
                        }}
                      >
                        Cambiar Archivo
                      </Button>
                      {extractedLinks.length === 0 && (
                        <Button 
                          size="sm"
                          onClick={handleProcessPdf}
                          disabled={isProcessing}
                          className="gap-2"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Procesando...
                            </>
                          ) : (
                            <>
                              <LinkIcon className="h-4 w-4" />
                              Extraer Links
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <FileText className="h-10 w-10 mx-auto text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">
                        Arrastra el PDF aquí
                      </p>
                      <p className="text-sm text-muted-foreground">
                        o haz clic para seleccionar
                      </p>
                    </div>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="max-w-xs mx-auto"
                    />
                    <p className="text-xs text-muted-foreground">
                      Solo archivos PDF (máximo 5MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Parse Error */}
              {parseError && (
                <Card className="border-destructive/50 bg-destructive/5">
                  <CardContent className="pt-4">
                    <div className="flex gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <p>{parseError}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Extracted Links Preview */}
              {extractedLinks.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">Links de Agenda Extraídos</h4>
                    <Badge variant="secondary" className="gap-1">
                      <LinkIcon className="h-3 w-3" />
                      {extractedLinks.length} links
                    </Badge>
                  </div>
                  
                  <ScrollArea className="h-[200px] border rounded-lg">
                    <div className="p-3 space-y-2">
                      {extractedLinks.map((link, index) => (
                        <Card key={index} className="p-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <Badge variant="outline" className="text-xs flex-shrink-0">
                                #{index + 1}
                              </Badge>
                              <a 
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline truncate"
                              >
                                {link.url}
                              </a>
                            </div>
                            <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  <Card className="bg-amber-500/10 border-amber-500/20">
                    <CardContent className="pt-4">
                      <div className="flex gap-2 text-sm text-amber-700 dark:text-amber-400">
                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <p>
                          Se extrajeron los links de agenda. Los datos de comisión y fecha 
                          deberán ser agregados manualmente o desde la página web.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="paste" className="mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pastedContent">Pegar Datos de Sesiones</Label>
                  <Textarea
                    id="pastedContent"
                    placeholder="Pega el contenido de la tabla desde la página web del Congreso...

Los links de agenda se preservan mejor si copias directamente desde la web."
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
                        <strong>Recomendado:</strong> Copia la tabla directamente desde la 
                        página web del Congreso para preservar todos los datos y links.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Source Info */}
        <Card className="bg-muted/30 border-muted">
          <CardContent className="pt-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">¿Dónde obtener los datos?</p>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => window.open('https://www2.congreso.gob.pe/sicr/comisiones/sesiones.nsf', '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
                Abrir Visor de Sesiones del Congreso
              </Button>
            </div>
          </CardContent>
        </Card>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleImport}
            disabled={isImporting || extractedLinks.length === 0}
            className="gap-2"
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Importando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Importar {extractedLinks.length} Sesiones
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
