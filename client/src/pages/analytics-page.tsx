import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, TrendingDown, Target, DollarSign, Calendar, Activity } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { useState } from "react";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState("30d");

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    enabled: !!user,
  });

  const { data: trades } = useQuery({
    queryKey: ["/api/trades"],
    enabled: !!user,
  });

  // Generate sample performance data (replace with real data)
  const performanceData = [
    { date: "Jan", pnl: 120 },
    { date: "Feb", pnl: -45 },
    { date: "Mar", pnl: 200 },
    { date: "Apr", pnl: 89 },
    { date: "May", pnl: -67 },
    { date: "Jun", pnl: 234 },
  ];

  const assetData = [
    { asset: "AAPL", trades: 12, pnl: 450 },
    { asset: "MSFT", trades: 8, pnl: -120 },
    { asset: "GOOGL", trades: 15, pnl: 320 },
    { asset: "TSLA", trades: 6, pnl: 89 },
  ];

  const directionData = [
    { name: "Long", value: 65, color: "#10b981" },
    { name: "Short", value: 35, color: "#ef4444" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-64">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center space-x-2">
                <BarChart3 className="w-8 h-8" />
                <span>Analytics</span>
              </h1>
              <p className="text-muted-foreground">Deep dive into your trading performance</p>
            </div>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats?.totalPnL || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.winRate || 0}%</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalTrades || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +12 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Risk/Reward</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.avgRiskReward || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +0.3 from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>P&L Performance</CardTitle>
                <CardDescription>
                  Your profit and loss over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="pnl" 
                      stroke="#10b981" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trading Direction</CardTitle>
                <CardDescription>
                  Long vs Short position distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={directionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {directionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Asset Performance */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Asset Performance</CardTitle>
              <CardDescription>
                Performance breakdown by trading asset
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={assetData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="asset" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="pnl" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Advanced Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Best Performing Asset</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">AAPL</div>
                <p className="text-sm text-muted-foreground">$450 profit across 12 trades</p>
                <Badge className="mt-2 bg-green-100 text-green-800">
                  +75% win rate
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Largest Win</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${stats?.largestWin || 0}
                </div>
                <p className="text-sm text-muted-foreground">Best single trade performance</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Max Drawdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  ${stats?.maxDrawdown || 0}
                </div>
                <p className="text-sm text-muted-foreground">Peak to trough decline</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}