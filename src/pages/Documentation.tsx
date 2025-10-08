import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, BarChart3, Star, Calendar, Bell, Filter, Search, AlertTriangle, Receipt, Users } from "lucide-react";

export default function Documentation() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">User Documentation</h1>
              <p className="text-sm text-muted-foreground">Complete guide to using LawMeter Dashboard</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="filtering">Filtering</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="tips">Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Getting Started
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">What is LawMeter?</h3>
                  <p className="text-muted-foreground">
                    LawMeter is a comprehensive legislative monitoring platform designed to help you track, analyze, and stay informed about Australian legislation, bills, tenders, and parliamentary activities.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Main Navigation</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <FileText className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Acts & Bills</p>
                        <p className="text-sm text-muted-foreground">Browse and monitor legislative acts and proposed bills</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Users className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Media & Social Listening</p>
                        <p className="text-sm text-muted-foreground">Track media coverage, NGO statements, and stakeholder advocacy</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Analytics</p>
                        <p className="text-sm text-muted-foreground">Visualize trends, sentiment, and key metrics</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Calendar className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Calendar</p>
                        <p className="text-sm text-muted-foreground">View deadlines and important dates</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Acts Monitoring
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">Track legislative acts with AI-powered risk assessment.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">1</Badge>
                      <span>View all acts with automatic risk scoring</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">2</Badge>
                      <span>Check AI-detected deadlines and urgency levels</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">3</Badge>
                      <span>Click any act to view full details in the drawer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">4</Badge>
                      <span>Star important acts for quick access</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Starred Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">Save and organize items you want to monitor closely.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">1</Badge>
                      <span>Click the star icon on any act or bill</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">2</Badge>
                      <span>Access all starred items in the Starred tab</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">3</Badge>
                      <span>Add private or public comments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">4</Badge>
                      <span>Unstar anytime by clicking the star again</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Calendar View
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">Track all important dates and deadlines in one place.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">1</Badge>
                      <span>View deadlines, bill actions, and tender closings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">2</Badge>
                      <span>Click any date to see events for that day</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">3</Badge>
                      <span>Events are color-coded by priority level</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">4</Badge>
                      <span>See upcoming event counts by priority</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    Tenders
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">Monitor government procurement opportunities.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">1</Badge>
                      <span>Browse open tenders by category</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">2</Badge>
                      <span>Filter by value range and closing date</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">3</Badge>
                      <span>View detailed requirements and contacts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">4</Badge>
                      <span>Track time remaining until tender closes</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="filtering" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Advanced Filtering
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Search & Text Filters
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Use the search box to find specific acts, bills, or keywords across all content.
                  </p>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm font-mono">Example: "environmental protection" or "tax reform"</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Portfolio Filters</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Filter by government portfolio (e.g., Health, Education, Treasury)
                  </p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Select multiple portfolios to narrow results</li>
                    <li>• Clear filters to see all portfolios</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Risk Score Range</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Adjust the slider to filter by AI-calculated risk level (0-100)
                  </p>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="bg-success/10 p-2 rounded text-center">
                      <p className="text-xs font-medium">Low</p>
                      <p className="text-xs text-muted-foreground">0-40</p>
                    </div>
                    <div className="bg-warning/10 p-2 rounded text-center">
                      <p className="text-xs font-medium">Medium</p>
                      <p className="text-xs text-muted-foreground">41-70</p>
                    </div>
                    <div className="bg-risk-high/10 p-2 rounded text-center">
                      <p className="text-xs font-medium">High</p>
                      <p className="text-xs text-muted-foreground">71-100</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Time Windows</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Filter by time period to focus on recent or all activity
                  </p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Last 7 days - Recent updates only</li>
                    <li>• Last 30 days - This month's activity</li>
                    <li>• Last 90 days - Quarterly view</li>
                    <li>• All time - Complete history</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Sorting Options</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Sort results by date, risk score, or title
                  </p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Toggle between ascending and descending order</li>
                    <li>• Date: Most recent first (default)</li>
                    <li>• Risk: Highest priority items first</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Alert Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Configuring Alerts</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Click the "Alert Settings" button in the top-right header to configure your notification preferences.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">What You Can Configure</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                      <div>
                        <p className="font-medium">Risk Level Thresholds</p>
                        <p className="text-muted-foreground">Set which risk levels trigger notifications</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Portfolio Monitoring</p>
                        <p className="text-muted-foreground">Choose specific portfolios to watch</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Deadline Alerts</p>
                        <p className="text-muted-foreground">Get notified before important deadlines</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">💡 Pro Tip</p>
                  <p className="text-sm text-muted-foreground">
                    Combine portfolio filters with high-risk alerts to focus on what matters most to your organization.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Understanding Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Available Charts</h3>
                  <div className="space-y-3">
                    <div className="border-l-4 border-primary pl-4">
                      <p className="font-medium">Textual Trends</p>
                      <p className="text-sm text-muted-foreground">
                        Visualize the frequency of acts or bills over time. Spot patterns and legislative activity peaks.
                      </p>
                    </div>
                    <div className="border-l-4 border-primary pl-4">
                      <p className="font-medium">Sentiment Analysis</p>
                      <p className="text-sm text-muted-foreground">
                        AI-powered sentiment tracking of parliamentary debates and media coverage.
                      </p>
                    </div>
                    <div className="border-l-4 border-primary pl-4">
                      <p className="font-medium">Entity Mentions</p>
                      <p className="text-sm text-muted-foreground">
                        Track which organizations, people, and topics are mentioned most frequently.
                      </p>
                    </div>
                    <div className="border-l-4 border-primary pl-4">
                      <p className="font-medium">Impact/Urgency Matrix</p>
                      <p className="text-sm text-muted-foreground">
                        See which acts require immediate attention based on impact and urgency scores.
                      </p>
                    </div>
                    <div className="border-l-4 border-primary pl-4">
                      <p className="font-medium">Stakeholder Analysis</p>
                      <p className="text-sm text-muted-foreground">
                        Understand which stakeholders are most active and influential in the legislative process.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">How to Use Analytics</h3>
                  <ol className="space-y-2 text-sm list-decimal list-inside">
                    <li>Navigate to the Analytics tab</li>
                    <li>Charts update automatically based on your active filters</li>
                    <li>Hover over data points for detailed information</li>
                    <li>Use insights to prioritize your monitoring efforts</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Best Practices</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="font-medium text-sm mb-1">✨ Start with Filters</p>
                    <p className="text-xs text-muted-foreground">
                      Set up portfolio and risk filters first to reduce noise and focus on relevant legislation.
                    </p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="font-medium text-sm mb-1">⭐ Use the Star System</p>
                    <p className="text-xs text-muted-foreground">
                      Star acts and bills you're monitoring - it creates a personalized dashboard in the Starred tab.
                    </p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="font-medium text-sm mb-1">📅 Check the Calendar Weekly</p>
                    <p className="text-xs text-muted-foreground">
                      Review upcoming deadlines every Monday to stay ahead of important dates.
                    </p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="font-medium text-sm mb-1">📊 Review Analytics Monthly</p>
                    <p className="text-xs text-muted-foreground">
                      Use trend charts to identify patterns and emerging legislative themes.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Keyboard Shortcuts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm">Search</span>
                    <Badge variant="outline" className="font-mono">Ctrl + K</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm">Go to Acts</span>
                    <Badge variant="outline" className="font-mono">1</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm">Go to Bills</span>
                    <Badge variant="outline" className="font-mono">2</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm">Go to Starred</span>
                    <Badge variant="outline" className="font-mono">3</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm">Go to Calendar</span>
                    <Badge variant="outline" className="font-mono">4</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm">Go to Analytics</span>
                    <Badge variant="outline" className="font-mono">5</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Data Retention & Privacy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Data Retention Policy</h4>
                    <p className="text-sm text-muted-foreground">
                      Acts and bills are retained for 12 months from their publication date. Older items are archived but can be requested if needed.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Your Comments & Stars</h4>
                    <p className="text-sm text-muted-foreground">
                      Comments and starred items are stored locally in your browser. Make sure to back up important notes regularly.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Public vs Private Comments</h4>
                    <p className="text-sm text-muted-foreground">
                      Comments marked "public" may be visible to your organization. Private comments are visible only to you.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
