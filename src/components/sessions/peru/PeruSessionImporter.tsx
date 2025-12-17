// Peru Session Importer Component - Client-side PDF parsing

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
  Loader2,
  Clock,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner';
import { parsePeruSessionsPdf, parseFromPastedText, ParsedSession as PDFParsedSession } from '@/lib/pdfTableParser';

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

// Convert PDF parsed session to export format
function convertToExportFormat(pdfSession: PDFParsedSession): ParsedSession {
  return {
    tipo_comision: pdfSession.tipoSesion,
    commission_name: pdfSession.commissionName,
    session_title: pdfSession.sessionTitle,
    caracteristicas: pdfSession.caracteristicas,
    scheduled_date: pdfSession.scheduledDate,
    scheduled_time: pdfSession.scheduledTime,
    agenda_url: pdfSession.agendaUrl,
    external_session_id: pdfSession.agendaUrl ? extractSessionId(pdfSession.agendaUrl) : null,
  };
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
  const [parsedSessions, setParsedSessions] = useState<PDFParsedSession[]>([]);
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
        setParsedSessions([]);
        setParseError(null);
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setParsedSessions([]);
      setParseError(null);
    }
  };

  const handleProcessPdf = async () => {
    if (!selectedFile) return;
    
    // Check file size (10MB limit for client-side)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setParseError('El archivo es demasiado grande. Máximo 10MB.');
      return;
    }
    
    setIsProcessing(true);
    setParseError(null);
    setParsedSessions([]);
    
    try {
      console.log('Starting PDF parsing...', selectedFile.name);
      const sessions = await parsePeruSessionsPdf(selectedFile);
      
      if (sessions.length === 0) {
        setParseError('No se pudieron extraer sesiones del PDF. Intenta copiar y pegar los datos desde la web.');
      } else {
        setParsedSessions(sessions);
        toast.success(`Se encontraron ${sessions.length} sesiones`);
      }
      
    } catch (error) {
      console.error('Error processing PDF:', error);
      setParseError(error instanceof Error ? error.message : 'Error al procesar el PDF');
      toast.error('Error al procesar el PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessPaste = () => {
    if (!pastedContent.trim()) return;
    
    setIsProcessing(true);
    setParseError(null);
    
    try {
      const sessions = parseFromPastedText(pastedContent);
      
      if (sessions.length === 0) {
        setParseError('No se pudieron extraer sesiones del texto pegado.');
      } else {
        setParsedSessions(sessions);
        toast.success(`Se encontraron ${sessions.length} sesiones`);
      }
    } catch (error) {
      console.error('Error parsing pasted content:', error);
      setParseError('Error al procesar el texto');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (parsedSessions.length === 0) return;
    
    const sessions = parsedSessions.map(convertToExportFormat);
    
    setIsImporting(true);
    try {
      await onImport(sessions);
      toast.success(`Se importaron ${sessions.length} sesiones`);
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
    setParsedSessions([]);
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
            Sube el PDF o pega los datos desde el visor de sesiones. 
            El sistema extraerá comisiones, fechas y links de agenda.
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
                          setParsedSessions([]);
                          setParseError(null);
                        }}
                      >
                        Cambiar Archivo
                      </Button>
                      {parsedSessions.length === 0 && (
                        <Button 
                          size="sm"
                          onClick={handleProcessPdf}
                          disabled={isProcessing}
                          className="gap-2"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Analizando PDF...
                            </>
                          ) : (
                            <>
                              <FileText className="h-4 w-4" />
                              Extraer Sesiones
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
                      Solo archivos PDF (máximo 10MB)
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
            </TabsContent>

            <TabsContent value="paste" className="mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pastedContent">Pegar Datos de Sesiones</Label>
                  <Textarea
                    id="pastedContent"
                    placeholder="Pega el contenido de la tabla desde la página web del Congreso...

Ejemplo:
Ordinaria  Comisión de Educación  18/12/2025  9:00AM  Descentralizada"
                    value={pastedContent}
                    onChange={(e) => setPastedContent(e.target.value)}
                    className="mt-2 h-[200px] font-mono text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleProcessPaste}
                    disabled={isProcessing || !pastedContent.trim()}
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
                        Extraer Sesiones
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Parsed Sessions Preview */}
          {parsedSessions.length > 0 && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">Sesiones Extraídas</h4>
                <Badge variant="secondary" className="gap-1">
                  <Calendar className="h-3 w-3" />
                  {parsedSessions.length} sesiones
                </Badge>
              </div>
              
              <ScrollArea className="h-[280px] border rounded-lg">
                <div className="p-3 space-y-2">
                  {parsedSessions.map((session, index) => (
                    <Card key={index} className="p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs flex-shrink-0">
                              {session.tipoSesion}
                            </Badge>
                            {session.caracteristicas && (
                              <Badge variant="secondary" className="text-xs gap-1">
                                <MapPin className="h-3 w-3" />
                                {session.caracteristicas}
                              </Badge>
                            )}
                          </div>
                          <p className="font-medium text-sm text-foreground truncate">
                            {session.commissionName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {session.sessionTitle}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {session.scheduledDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {session.scheduledDate}
                          </span>
                        )}
                        {session.scheduledTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {session.scheduledTime}
                          </span>
                        )}
                        {session.agendaUrl && (
                          <a 
                            href={session.agendaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary hover:underline"
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
            disabled={isImporting || parsedSessions.length === 0}
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
                Importar {parsedSessions.length} Sesiones
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
