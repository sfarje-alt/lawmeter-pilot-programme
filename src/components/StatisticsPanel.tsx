import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, PieChart, TrendingUp, TrendingDown, Calendar, AlertTriangle, FileText, Users } from "lucide-react";

interface Alert {
  id: number;
  title: string;
  type: string;
  portfolio: string;
  regulator: string;
  party: string;
  mp: string;
  status: string;
  riskScore: string;
  effectiveDate: string;
  summary: string;
  starred: boolean;
  isNew: boolean;
}

interface StatisticsPanelProps {
  alerts: Alert[];
}

export function StatisticsPanel({ alerts }: StatisticsPanelProps) {
  // Calculate statistics
  const totalAlerts = alerts.length;
  const highRiskCount = alerts.filter(a => a.riskScore === "High").length;
  const mediumRiskCount = alerts.filter(a => a.riskScore === "Medium").length;
  const lowRiskCount = alerts.filter(a => a.riskScore === "Low").length;
  const billsCount = alerts.filter(a => a.type === "Bill").length;
  const actsCount = alerts.filter(a => a.type === "Act").length;

  // Portfolio statistics
  const portfolioStats = alerts.reduce((acc, alert) => {
    acc[alert.portfolio] = (acc[alert.portfolio] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topPortfolios = Object.entries(portfolioStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Party statistics
  const partyStats = alerts.reduce((acc, alert) => {
    acc[alert.party] = (acc[alert.party] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Risk percentage calculations
  const highRiskPercentage = totalAlerts > 0 ? (highRiskCount / totalAlerts) * 100 : 0;
  const mediumRiskPercentage = totalAlerts > 0 ? (mediumRiskCount / totalAlerts) * 100 : 0;
  const lowRiskPercentage = totalAlerts > 0 ? (lowRiskCount / totalAlerts) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Analytics & Statistics</h2>
        <Badge variant="outline" className="text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          Data as of {new Date().toLocaleDateString()}
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Total Legislation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalAlerts}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {billsCount} Bills • {actsCount} Acts
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              High Risk Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-risk-high">{highRiskCount}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {highRiskPercentage.toFixed(1)}% of total
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              {alerts.filter(a => a.isNew).length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">New additions</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <PieChart className="h-4 w-4 mr-2" />
              Portfolios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{Object.keys(portfolioStats).length}</div>
            <div className="text-xs text-muted-foreground mt-1">Active portfolios</div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="h-5 w-5 mr-2" />
            Risk Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-risk-high rounded-full"></div>
                <span className="text-sm font-medium">High Risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">{highRiskCount}</span>
                <span className="text-xs text-muted-foreground">({highRiskPercentage.toFixed(1)}%)</span>
              </div>
            </div>
            <Progress value={highRiskPercentage} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-risk-medium rounded-full"></div>
                <span className="text-sm font-medium">Medium Risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">{mediumRiskCount}</span>
                <span className="text-xs text-muted-foreground">({mediumRiskPercentage.toFixed(1)}%)</span>
              </div>
            </div>
            <Progress value={mediumRiskPercentage} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-risk-low rounded-full"></div>
                <span className="text-sm font-medium">Low Risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">{lowRiskCount}</span>
                <span className="text-xs text-muted-foreground">({lowRiskPercentage.toFixed(1)}%)</span>
              </div>
            </div>
            <Progress value={lowRiskPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Top Portfolios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Top Portfolios by Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPortfolios.map(([portfolio, count], index) => {
              const percentage = totalAlerts > 0 ? (count / totalAlerts) * 100 : 0;
              return (
                <div key={portfolio} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                      <span className="text-sm font-medium truncate">{portfolio}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{count}</span>
                      <span className="text-xs text-muted-foreground">({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Political Party Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Political Party Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(partyStats).map(([party, count]) => (
              <div key={party} className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-foreground">{count}</div>
                <div className="text-xs text-muted-foreground capitalize">{party}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legislation Type Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Legislation Type Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Bills</span>
                <Badge variant="outline">{billsCount}</Badge>
              </div>
              <Progress value={totalAlerts > 0 ? (billsCount / totalAlerts) * 100 : 0} className="h-2" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Acts</span>
                <Badge variant="outline">{actsCount}</Badge>
              </div>
              <Progress value={totalAlerts > 0 ? (actsCount / totalAlerts) * 100 : 0} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
