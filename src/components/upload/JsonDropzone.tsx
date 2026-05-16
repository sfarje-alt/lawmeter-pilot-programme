import { useCallback, useRef, useState } from "react";
import { Upload, FileJson } from "lucide-react";
import { cn } from "@/lib/utils";

interface JsonDropzoneProps {
  onFile: (text: string, filename: string) => void;
  disabled?: boolean;
}

export function JsonDropzone({ onFile, disabled }: JsonDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.toLowerCase().endsWith(".json")) {
        // El parent valida; aquí solo entregamos el texto
      }
      const text = await file.text();
      onFile(text, file.name);
    },
    [onFile],
  );

  return (
    <div
      onDragOver={(e) => {
        if (disabled) return;
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        if (disabled) return;
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
      }}
      onClick={() => !disabled && inputRef.current?.click()}
      className={cn(
        "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
        "bg-card/40 hover:bg-card/60",
        isDragging ? "border-primary bg-primary/10" : "border-white/15",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <div className="rounded-full bg-primary/10 p-4">
          <Upload className="h-8 w-8 text-primary" />
        </div>
        <div>
          <p className="text-base font-medium text-foreground">
            Arrastra el archivo JSON aquí
          </p>
          <p className="text-sm">o haz clic para seleccionarlo</p>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <FileJson className="h-3 w-3" />
          <span>Solo archivos .json</span>
        </div>
      </div>
    </div>
  );
}
