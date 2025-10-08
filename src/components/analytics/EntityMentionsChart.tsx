import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, BillItem } from "@/types/legislation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Users, Building2, MapPin } from "lucide-react";

interface EntityMentionsChartProps {
  data: Alert[] | BillItem[];
  type: "acts" | "bills";
}

export function EntityMentionsChart({ data, type }: EntityMentionsChartProps) {
  // Extract entities from text
  const extractEntities = () => {
    const entityMap = new Map<string, { count: number; type: "organization" | "location" | "person" }>();

    // Common Australian government entities and locations
    const organizations = ["Treasury", "Department", "Commission", "Authority", "Agency", "Parliament", "Senate", "House"];
    const locations = ["Australia", "NSW", "Victoria", "Queensland", "Tasmania", "SA", "WA", "NT", "ACT", "Sydney", "Melbourne", "Brisbane"];
    const persons = ["Minister", "Commissioner", "Chair", "Director", "Secretary"];

    data.forEach((item) => {
      const text = type === "acts"
        ? `${(item as Alert).title} ${(item as Alert).AI_triage?.summary || ""}`
        : `${(item as BillItem).title} ${(item as BillItem).summary}`;

      // Extract organizations
      organizations.forEach(org => {
        const regex = new RegExp(`\\b${org}\\b`, "gi");
        const matches = text.match(regex);
        if (matches) {
          const key = org;
          if (!entityMap.has(key)) {
            entityMap.set(key, { count: 0, type: "organization" });
          }
          entityMap.get(key)!.count += matches.length;
        }
      });

      // Extract locations
      locations.forEach(loc => {
        const regex = new RegExp(`\\b${loc}\\b`, "gi");
        const matches = text.match(regex);
        if (matches) {
          const key = loc;
          if (!entityMap.has(key)) {
            entityMap.set(key, { count: 0, type: "location" });
          }
          entityMap.get(key)!.count += matches.length;
        }
      });

      // Extract persons/roles
      persons.forEach(person => {
        const regex = new RegExp(`\\b${person}\\b`, "gi");
        const matches = text.match(regex);
        if (matches) {
          const key = person;
          if (!entityMap.has(key)) {
            entityMap.set(key, { count: 0, type: "person" });
          }
          entityMap.get(key)!.count += matches.length;
        }
      });
    });

    return Array.from(entityMap.entries())
      .map(([entity, data]) => ({ entity, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  };

  const entities = extractEntities();

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "organization": return <Building2 className="w-4 h-4" />;
      case "location": return <MapPin className="w-4 h-4" />;
      case "person": return <Users className="w-4 h-4" />;
      default: return null;
    }
  };

  const getEntityColor = (type: string) => {
    switch (type) {
      case "organization": return "hsl(var(--primary))";
      case "location": return "hsl(var(--chart-2))";
      case "person": return "hsl(var(--chart-3))";
      default: return "hsl(var(--muted-foreground))";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entity Mentions</CardTitle>
        <CardDescription>
          Most frequently mentioned organizations, locations, and roles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={entities} layout="vertical" margin={{ left: 100, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis 
              type="number" 
              allowDecimals={false}
              domain={[0, (dataMax: number) => Math.ceil(dataMax / 2) * 2]}
              ticks={Array.from({ length: Math.ceil(Math.max(...entities.map(e => e.count)) / 2) + 1 }, (_, i) => i * 2)}
            />
            <YAxis dataKey="entity" type="category" width={90} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-popover border rounded-lg shadow-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        {getEntityIcon(data.type)}
                        <span className="font-semibold">{data.entity}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Mentions: <span className="font-medium text-foreground">{data.count}</span>
                      </div>
                      <div className="text-xs text-muted-foreground capitalize mt-1">
                        Type: {data.type}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {entities.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getEntityColor(entry.type)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(var(--primary))" }} />
            <span className="text-sm text-muted-foreground">Organizations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(var(--chart-2))" }} />
            <span className="text-sm text-muted-foreground">Locations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(var(--chart-3))" }} />
            <span className="text-sm text-muted-foreground">Roles</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
