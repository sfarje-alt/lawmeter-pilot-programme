import { BillItem } from "@/types/legislation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface PeopleOfInterestChartProps {
  bills: BillItem[];
}

const PARTY_COLORS: Record<string, string> = {
  "Labor": "hsl(var(--primary))",
  "Liberal": "hsl(220, 70%, 50%)",
  "Greens": "hsl(142, 71%, 45%)",
  "Nationals": "hsl(45, 93%, 47%)",
  "Independent": "hsl(var(--muted-foreground))",
};

export function PeopleOfInterestChart({ bills }: PeopleOfInterestChartProps) {
  // Count MPs by frequency
  const mpCounts: Record<string, { count: number; party: string; email?: string; phone?: string; role?: string }> = {};
  
  bills.forEach(bill => {
    bill.mps?.forEach(mp => {
      if (!mpCounts[mp.name]) {
        mpCounts[mp.name] = { count: 0, party: bill.party || "Unknown", email: mp.email, phone: mp.phone, role: mp.role };
      }
      mpCounts[mp.name].count += 1;
    });
  });
  
  const topMPs = Object.entries(mpCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 15);
  
  const mpData = topMPs.map(([name, info]) => ({
    name: name.length > 20 ? name.substring(0, 17) + "..." : name,
    fullName: name,
    count: info.count,
    party: info.party,
    email: info.email,
    phone: info.phone,
    role: info.role,
  }));
  
  // Party distribution
  const partyCounts: Record<string, number> = {};
  bills.forEach(bill => {
    if (bill.party) {
      partyCounts[bill.party] = (partyCounts[bill.party] || 0) + 1;
    }
  });
  
  const partyData = Object.entries(partyCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Most Active MPs & Senators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={mpData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                domain={[0, (dataMax: number) => Math.ceil(dataMax / 2) * 2]} 
                allowDecimals={false}
                ticks={Array.from({ length: Math.ceil(Math.max(...mpData.map(d => d.count)) / 2) + 1 }, (_, i) => i * 2)}
              />
              <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 11 }} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border rounded-lg p-3 shadow-lg">
                        <p className="font-semibold">{data.fullName}</p>
                        <p className="text-sm text-muted-foreground">{data.party}</p>
                        {data.role && <p className="text-sm">{data.role}</p>}
                        <p className="text-sm mt-1">Bills sponsored: {data.count}</p>
                        {data.email && (
                          <div className="flex items-center gap-1 mt-1 text-xs">
                            <Mail className="h-3 w-3" />
                            <span>{data.email}</span>
                          </div>
                        )}
                        {data.phone && (
                          <div className="flex items-center gap-1 text-xs">
                            <Phone className="h-3 w-3" />
                            <span>{data.phone}</span>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Bills by Political Party</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={partyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {partyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PARTY_COLORS[entry.name] || "hsl(var(--muted))"} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
