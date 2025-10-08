import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, BillItem } from "@/types/legislation";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Link2 } from "lucide-react";

interface SemanticSimilarityMatrixProps {
  data: Alert[] | BillItem[];
  type: "acts" | "bills";
}

export function SemanticSimilarityMatrix({ data, type }: SemanticSimilarityMatrixProps) {
  // Calculate semantic similarity between documents
  const calculateSimilarity = (text1: string, text2: string): number => {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size; // Jaccard similarity
  };

  const findSimilarDocuments = () => {
    const similarities: Array<{
      doc1: string;
      doc2: string;
      similarity: number;
      topics: string[];
    }> = [];

    for (let i = 0; i < data.length; i++) {
      for (let j = i + 1; j < data.length; j++) {
        const text1 = type === "acts"
          ? `${(data[i] as Alert).title} ${(data[i] as Alert).AI_triage?.summary || ""}`
          : `${(data[i] as BillItem).title} ${(data[i] as BillItem).summary}`;
          
        const text2 = type === "acts"
          ? `${(data[j] as Alert).title} ${(data[j] as Alert).AI_triage?.summary || ""}`
          : `${(data[j] as BillItem).title} ${(data[j] as BillItem).summary}`;

        const similarity = calculateSimilarity(text1, text2);

        if (similarity > 0.15) { // Only show if similarity > 15%
          const topics1 = type === "acts"
            ? (data[i] as Alert).AI_triage?.affected_units || []
            : [(data[i] as BillItem).portfolio || ""];
          const topics2 = type === "acts"
            ? (data[j] as Alert).AI_triage?.affected_units || []
            : [(data[j] as BillItem).portfolio || ""];
          
          const commonTopics = topics1.filter(t => topics2.includes(t));

          similarities.push({
            doc1: type === "acts" ? (data[i] as Alert).title : (data[i] as BillItem).title,
            doc2: type === "acts" ? (data[j] as Alert).title : (data[j] as BillItem).title,
            similarity,
            topics: commonTopics,
          });
        }
      }
    }

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10);
  };

  const similarDocs = findSimilarDocuments();

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.5) return "hsl(var(--risk-high))";
    if (similarity >= 0.3) return "hsl(var(--warning))";
    return "hsl(var(--chart-1))";
  };

  const getSimilarityLabel = (similarity: number) => {
    if (similarity >= 0.5) return "Very High";
    if (similarity >= 0.3) return "High";
    if (similarity >= 0.2) return "Moderate";
    return "Low";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="w-5 h-5" />
          Semantic Similarity
        </CardTitle>
        <CardDescription>
          Documents with related content and overlapping themes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {similarDocs.map((link, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border bg-card hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 space-y-2">
                  <div className="flex items-start gap-2">
                    <Link2 className="w-4 h-4 mt-1 text-muted-foreground shrink-0" />
                    <p className="text-sm font-medium line-clamp-2">{link.doc1}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Link2 className="w-4 h-4 mt-1 text-muted-foreground shrink-0" />
                    <p className="text-sm font-medium line-clamp-2">{link.doc2}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className="text-2xl font-bold mb-1"
                    style={{ color: getSimilarityColor(link.similarity) }}
                  >
                    {(link.similarity * 100).toFixed(0)}%
                  </div>
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: getSimilarityColor(link.similarity),
                      color: getSimilarityColor(link.similarity),
                    }}
                  >
                    {getSimilarityLabel(link.similarity)}
                  </Badge>
                </div>
              </div>

              {link.topics.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap pt-2 border-t">
                  <span className="text-xs text-muted-foreground">Common topics:</span>
                  {link.topics.map((topic, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}

          {similarDocs.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <GitBranch className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No similar documents found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
