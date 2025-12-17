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
  FileSpreadsheet, 
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

interface ParsedSession {
  tipo_comision: string;
  commission_name: string;
  session_title: string;
  caracteristicas: string | null;
  scheduled_date: string;
  scheduled_time: string;
  agenda_url: string | null;
  external_session_id: string | null;
}

interface ParseResult {
  sessions: ParsedSession[];
  linksExtracted: number;
  totalRows: number;
}

interface PeruSessionImporterProps {
  open: boolean;
  onClose: () => void;
  onImport: (sessions: ParsedSession[]) => Promise<void>;
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
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
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
        setParseResult(null);
        setParseError(null);
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setParseResult(null);
      setParseError(null);
    }
  };

  const handleProcessPdf = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    setParseError(null);
    setParseResult(null);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const { data, error } = await supabase.functions.invoke('parse-peru-sessions-pdf', {
        body: formData,
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to parse PDF');
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setParseResult(data as ParseResult);
      
      if (data.sessions.length === 0) {
        setParseError('No sessions found in the PDF. Make sure the file contains the sessions table.');
      } else {
        toast.success(`Found ${data.sessions.length} sessions with ${data.linksExtracted} agenda links`);
      }
      
    } catch (error) {
      console.error('Error processing PDF:', error);
      setParseError(error instanceof Error ? error.message : 'Failed to process PDF');
      toast.error('Failed to process PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (!parseResult || parseResult.sessions.length === 0) return;
    
    setIsImporting(true);
    try {
      await onImport(parseResult.sessions);
      toast.success(`Imported ${parseResult.sessions.length} sessions`);
      onClose();
    } catch (error) {
      console.error('Error importing sessions:', error);
      toast.error('Failed to import sessions');
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setParseResult(null);
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
            Sube el PDF exportado desde el visor de sesiones del Congreso. 
            El sistema extraerá automáticamente las sesiones y los links de agenda.
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
                          setParseResult(null);
                          setParseError(null);
                        }}
                      >
                        Cambiar Archivo
                      </Button>
                      {!parseResult && (
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
                              <FileText className="h-4 w-4" />
                              Procesar PDF
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
                      Solo archivos PDF del visor de sesiones
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

              {/* Parse Results Preview */}
              {parseResult && parseResult.sessions.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">Sesiones Encontradas</h4>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="gap-1">
                        <Calendar className="h-3 w-3" />
                        {parseResult.sessions.length} sesiones
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <LinkIcon className="h-3 w-3" />
                        {parseResult.linksExtracted} links
                      </Badge>
                    </div>
                  </div>
                  
                  <ScrollArea className="h-[200px] border rounded-lg">
                    <div className="p-3 space-y-2">
                      {parseResult.sessions.map((session, index) => (
                        <Card key={index} className="p-3">
                          <div className="space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-medium text-sm text-foreground line-clamp-1">
                                {session.commission_name}
                              </p>
                              <Badge variant="outline" className="text-xs flex-shrink-0">
                                {session.tipo_comision}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {session.scheduled_date} {session.scheduled_time}
                              </span>
                              {session.caracteristicas && (
                                <Badge variant="secondary" className="text-xs">
                                  {session.caracteristicas}
                                </Badge>
                              )}
                            </div>
                            {session.agenda_url && (
                              <a 
                                href={session.agenda_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-primary hover:underline"
                              >
                                <LinkIcon className="h-3 w-3" />
                                Ver Agenda
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
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

Formato esperado:
Comisión, Fecha, Hora, URL Agenda
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
                        Puedes copiar y pegar la tabla de sesiones directamente desde la 
                        página web del Congreso. El sistema intentará parsear los datos automáticamente.
                        <br /><br />
                        <strong>Nota:</strong> Los links de agenda se preservan mejor si copias 
                        directamente desde la web en lugar del PDF.
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
              <p className="text-xs text-muted-foreground">
                Navega al "Visor de Sesiones de Comisiones", filtra las sesiones y exporta a PDF.
              </p>
            </div>
          </CardContent>
        </Card>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleImport}
            disabled={
              isImporting || 
              !parseResult || 
              parseResult.sessions.length === 0
            }
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
                Importar {parseResult?.sessions.length || 0} Sesiones
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
