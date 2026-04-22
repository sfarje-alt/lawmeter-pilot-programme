// Renderiza el agenda_markdown del portal del Congreso como HTML formateado.
// 100% client-side, sin llamadas a IA ni edge functions.

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ExternalLink, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  markdown: string;
}

// Limpia el ruido del scraper del portal del Congreso.
function cleanAgendaMarkdown(md: string): string {
  let out = md;

  // Imágenes (logo_congreso.svg, portada.svg, etc.)
  out = out.replace(/!\[[^\]]*\]\([^)]*\)/g, "");

  // Enlaces-imagen tipo [![](...)](#/)
  out = out.replace(/\[!\[[^\]]*\]\([^)]*\)\]\([^)]*\)/g, "");

  // Cabecera repetitiva
  out = out.replace(/^\s*##\s*CONGRESO DE LA REP[ÚU]BLICA\s*$/gim, "");
  out = out.replace(/^\s*Portal\s*$/gim, "");
  out = out.replace(/^\s*##\s*Sesiones de comisiones\s*$/gim, "");

  // Footer
  out = out.replace(/^\s*#\s*Congreso de la Rep[úu]blica\s*$/gim, "");
  out = out.replace(/^\s*Visor de SGSC[^\n]*$/gim, "");
  out = out.replace(/^\s*Plaza Bol[íi]var[^\n]*$/gim, "");
  out = out.replace(/^\s*Copyright\s*©[^\n]*$/gim, "");

  // Colapsar líneas en blanco múltiples
  out = out.replace(/\n{3,}/g, "\n\n").trim();

  return out;
}

// Detecta códigos de proyecto de ley peruano: 12369/2025-CR, 06571/2023-PE, etc.
const BILL_CODE_RE = /(\d{4,6}\/\d{4}-(?:CR|PE))/g;

function renderTextWithBillBadges(text: string): React.ReactNode {
  const parts = text.split(BILL_CODE_RE);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    BILL_CODE_RE.test(part) ? (
      <Badge
        key={i}
        variant="secondary"
        className="font-mono text-[11px] mx-0.5 align-middle"
      >
        {part}
      </Badge>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function processChildren(children: React.ReactNode): React.ReactNode {
  if (typeof children === "string") return renderTextWithBillBadges(children);
  if (Array.isArray(children)) {
    return children.map((c, i) =>
      typeof c === "string" ? (
        <span key={i}>{renderTextWithBillBadges(c)}</span>
      ) : (
        c
      ),
    );
  }
  return children;
}

export function AgendaMarkdownView({ markdown }: Props) {
  const cleaned = cleanAgendaMarkdown(markdown);

  return (
    <div className="text-sm text-foreground leading-relaxed space-y-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: () => null,
          h1: ({ children }) => (
            <h1 className="text-base font-semibold text-foreground mt-4 mb-2 pb-1 border-b">
              {processChildren(children)}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm font-semibold text-foreground mt-4 mb-2 pb-1 border-b">
              {processChildren(children)}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-semibold text-foreground mt-3 mb-1">
              {processChildren(children)}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-sm text-foreground my-2">
              {processChildren(children)}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 space-y-1.5 my-2 marker:text-muted-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 space-y-1.5 my-2 marker:text-muted-foreground">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-sm text-foreground">{processChildren(children)}</li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {processChildren(children)}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic">{processChildren(children)}</em>
          ),
          a: ({ href, children }) => {
            const url = href ?? "#";
            const isAlfresco = /service-alfresco/i.test(url);
            const Icon = isAlfresco ? FileText : ExternalLink;
            return (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline font-medium break-words"
              >
                <span>{processChildren(children)}</span>
                <Icon className="h-3 w-3 shrink-0" />
              </a>
            );
          },
          hr: () => <hr className="my-4 border-border" />,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-primary/40 pl-3 text-muted-foreground italic my-2">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
              {children}
            </code>
          ),
        }}
      >
        {cleaned}
      </ReactMarkdown>
    </div>
  );
}
