import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Filter, Star, AlertTriangle, FileText, Users, BarChart3, Clock, ExternalLink } from "lucide-react";
import { FilterPanel } from "./FilterPanel";
import { AlertCard } from "./AlertCard";
import { StatisticsPanel } from "./StatisticsPanel";
import { ContactForm } from "./ContactForm";

export function LegislativeDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    timeframe: "1-week",
    portfolios: [],
    riskLevel: "all",
    party: "all",
    type: "all"
  });

  // Sample data for demonstration
  const sampleAlerts = [
    {
      id: 1,
      title: "Environment Protection and Biodiversity Conservation Amendment (Native Vegetation) Bill 2024",
      type: "Bill",
      portfolio: "Environment and Energy",
      regulator: "Department of Climate Change, Energy, the Environment and Water",
      party: "Greens",
      mp: "Adam Bandt",
      status: "Committee Stage - House of Representatives",
      riskScore: "High",
      effectiveDate: "2024-12-01",
      summary: "Introduces stricter protections for native vegetation and increases penalties for unauthorized clearing. May impact development projects and agricultural practices.",
      starred: false,
      isNew: true
    },
    {
      id: 2,
      title: "Financial Services Reform Amendment Act 2024",
      type: "Act",
      portfolio: "Treasury",
      regulator: "Australian Securities and Investments Commission",
      party: "Labor",
      mp: "Jim Chalmers",
      status: "Royal Assent",
      riskScore: "Medium",
      effectiveDate: "2024-11-15",
      summary: "Updates financial services licensing requirements and introduces new consumer protection measures for digital financial products.",
      starred: true,
      isNew: false
    },
    {
      id: 3,
      title: "Workplace Relations Amendment (Fair Work) Bill 2024",
      type: "Bill",
      portfolio: "Employment and Workplace Relations",
      regulator: "Fair Work Commission",
      party: "Labor",
      mp: "Tony Burke",
      status: "Second Reading - Senate",
      riskScore: "High",
      effectiveDate: "2024-12-20",
      summary: "Strengthens collective bargaining rights and introduces new minimum wage protections for gig economy workers.",
      starred: true,
      isNew: true
    }
  ];

  const filteredAlerts = sampleAlerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = selectedFilters.riskLevel === "all" || 
                       alert.riskScore.toLowerCase() === selectedFilters.riskLevel.toLowerCase();
    return matchesSearch && matchesRisk;
  });

  const starredAlerts = filteredAlerts.filter(alert => alert.starred);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Legislative Dashboard</h1>
                <p className="text-sm text-muted-foreground">Australian Government Legislation Tracking</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-success text-success-foreground">
                <Clock className="h-3 w-3 mr-1" />
                Last Updated: 2 mins ago
              </Badge>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="feed" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Feed</span>
            </TabsTrigger>
            <TabsTrigger value="starred" className="flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span>Starred</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Contact</span>
            </TabsTrigger>
          </TabsList>

          {/* Search and Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search legislation, bills, acts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedFilters.riskLevel} onValueChange={(value) => 
                setSelectedFilters(prev => ({ ...prev, riskLevel: value }))
              }>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{filteredAlerts.length}</div>
                  <div className="text-xs text-muted-foreground">This week</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">High Risk</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-risk-high">
                    {filteredAlerts.filter(a => a.riskScore === "High").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Requiring attention</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Starred Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">{starredAlerts.length}</div>
                  <div className="text-xs text-muted-foreground">Tracked items</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">New This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">
                    {filteredAlerts.filter(a => a.isNew).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Recent additions</div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Recent Legislative Alerts</h3>
              {filteredAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="feed" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Legislative Feed (1 Year History)</h3>
              <Badge variant="outline" className="text-warning">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Data retained for 1 year maximum
              </Badge>
            </div>
            {filteredAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </TabsContent>

          <TabsContent value="starred" className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Starred Legislative Alerts</h3>
            {starredAlerts.length > 0 ? (
              starredAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} showEnhancedFeatures={true} />
              ))
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h4 className="text-lg font-medium text-foreground mb-2">No Starred Alerts</h4>
                  <p className="text-muted-foreground">Star important legislation to track them here with enhanced features.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <StatisticsPanel alerts={filteredAlerts} />
          </TabsContent>

          <TabsContent value="contact">
            <ContactForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}