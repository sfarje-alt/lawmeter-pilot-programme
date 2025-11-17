import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Bell, Globe, Users, ArrowRight, Activity } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from "recharts";

const chartData = [
  { name: "Mon", value: 42 },
  { name: "Tue", value: 58 },
  { name: "Wed", value: 45 },
  { name: "Thu", value: 67 },
  { name: "Fri", value: 53 },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(220,40%,8%)] via-[hsl(220,45%,6%)] to-[hsl(220,50%,4%)] text-foreground overflow-hidden relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
      
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]">
          {/* Left: Hero Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-white">AI Policy Alerts</span>
                <br />
                <span className="gradient-text">
                  Built for Your Jurisdictions and Interests
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                Real-time legislative monitoring powered by AI. Track bills, regulations, and policy changes across multiple jurisdictions with intelligent alerts tailored to your organization.
              </p>
            </div>

            <div className="flex gap-4 flex-wrap">
              <Button 
                size="lg" 
                className="gradient-button text-lg px-8 py-6 h-auto group"
                onClick={() => navigate("/dashboard")}
              >
                View Dashboard
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="glass-button text-lg px-8 py-6 h-auto"
                onClick={() => navigate("/documentation")}
              >
                Learn More
              </Button>
            </div>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-3 pt-4">
              <Badge variant="secondary" className="glass-badge px-4 py-2 text-sm">
                <Globe className="w-4 h-4 mr-2" />
                Multi-Jurisdiction
              </Badge>
              <Badge variant="secondary" className="glass-badge px-4 py-2 text-sm">
                <Bell className="w-4 h-4 mr-2" />
                Real-Time Alerts
              </Badge>
              <Badge variant="secondary" className="glass-badge px-4 py-2 text-sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                AI-Powered Analysis
              </Badge>
              <Badge variant="secondary" className="glass-badge px-4 py-2 text-sm">
                <Users className="w-4 h-4 mr-2" />
                Stakeholder Tracking
              </Badge>
            </div>
          </div>

          {/* Right: Dashboard Preview Card */}
          <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Card className="glass-card border-white/10 overflow-hidden group hover:border-white/20 transition-all duration-300">
              <div className="p-6 space-y-6">
                {/* Header with status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Activity className="w-5 h-5 text-accent" />
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
                    </div>
                    <span className="text-lg font-semibold">Live Dashboard</span>
                  </div>
                  <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                    Active
                  </Badge>
                </div>

                {/* Mini chart */}
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">Weekly Activity</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={chartData}>
                      <XAxis 
                        dataKey="name" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="hsl(var(--accent))"
                        radius={[8, 8, 0, 0]}
                        className="transition-all duration-300"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div className="space-y-1">
                    <div className="text-3xl font-bold gradient-text">127</div>
                    <div className="text-sm text-muted-foreground">Active Alerts</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold gradient-text">8</div>
                    <div className="text-sm text-muted-foreground">Jurisdictions</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Decorative glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 to-[hsl(180,80%,50%)]/20 rounded-3xl blur-3xl -z-10 opacity-50 group-hover:opacity-70 transition-opacity" />
          </div>
        </div>
      </div>
    </div>
  );
}
