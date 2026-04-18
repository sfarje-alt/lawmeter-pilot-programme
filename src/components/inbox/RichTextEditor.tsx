import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, List, ListOrdered, Paperclip, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  /** data URL — kept in-memory only for demo */
  dataUrl?: string;
}

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  attachments: AttachedFile[];
  onAttachmentsChange: (files: AttachedFile[]) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Minimal rich-text editor using contentEditable + execCommand.
 * Supports bold / italic / underline / bullet & numbered lists + file attachments.
 * Storage: stores raw HTML for the commentary; attachments held in memory.
 */
export function RichTextEditor({
  value,
  onChange,
  attachments,
  onAttachmentsChange,
  placeholder,
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEmpty, setIsEmpty] = useState(!value);

  // Sync external value into the editor only when alert changes (avoid caret jumps)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
      setIsEmpty(!value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exec = (command: string) => {
    document.execCommand(command, false);
    editorRef.current?.focus();
    handleInput();
  };

  const handleInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    setIsEmpty(editorRef.current.textContent?.trim() === "");
    onChange(html);
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const newFiles: AttachedFile[] = [];
    for (const file of Array.from(files)) {
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      newFiles.push({
        id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl,
      });
    }
    onAttachmentsChange([...attachments, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (id: string) => {
    onAttachmentsChange(attachments.filter((a) => a.id !== id));
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const ToolbarBtn = ({
    onClick,
    title,
    children,
  }: {
    onClick: () => void;
    title: string;
    children: React.ReactNode;
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/50"
    >
      {children}
    </Button>
  );

  return (
    <div className={cn("rounded-md border border-border/50 bg-muted/30", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 border-b border-border/40 px-1.5 py-1">
        <ToolbarBtn onClick={() => exec("bold")} title="Negrita">
          <Bold className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec("italic")} title="Cursiva">
          <Italic className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec("underline")} title="Subrayado">
          <Underline className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <div className="w-px h-4 bg-border/50 mx-1" />
        <ToolbarBtn onClick={() => exec("insertUnorderedList")} title="Lista">
          <List className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec("insertOrderedList")} title="Lista numerada">
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <div className="w-px h-4 bg-border/50 mx-1" />
        <ToolbarBtn
          onClick={() => fileInputRef.current?.click()}
          title="Adjuntar documento"
        >
          <Paperclip className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Editor */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          suppressContentEditableWarning
          className={cn(
            "min-h-[120px] p-3 text-sm text-foreground outline-none",
            "prose prose-sm prose-invert max-w-none",
            "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
            "[&_b]:font-semibold [&_strong]:font-semibold [&_u]:underline [&_i]:italic [&_em]:italic"
          )}
        />
        {isEmpty && placeholder && (
          <div className="pointer-events-none absolute inset-0 p-3 text-sm text-muted-foreground/60">
            {placeholder}
          </div>
        )}
      </div>

      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="border-t border-border/40 p-2 space-y-1">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground px-1">
            Documentos adjuntos
          </div>
          <div className="flex flex-col gap-1">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center gap-2 rounded-md bg-muted/40 border border-border/30 px-2 py-1.5"
              >
                <Paperclip className="h-3 w-3 text-muted-foreground shrink-0" />
                {att.dataUrl ? (
                  <a
                    href={att.dataUrl}
                    download={att.name}
                    className="text-xs text-foreground truncate hover:text-primary flex-1"
                    title={att.name}
                  >
                    {att.name}
                  </a>
                ) : (
                  <span className="text-xs text-foreground truncate flex-1">{att.name}</span>
                )}
                <span className="text-[10px] text-muted-foreground shrink-0">
                  {formatBytes(att.size)}
                </span>
                <button
                  type="button"
                  onClick={() => removeAttachment(att.id)}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                  title="Eliminar"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
