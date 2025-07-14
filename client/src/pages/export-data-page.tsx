import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Download, FileText, Calendar, Filter } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ExportDataPage() {
  const { user } = useAuth();
  const [exportFormat, setExportFormat] = useState("csv");
  const [dateRange, setDateRange] = useState("all");
  const [selectedFields, setSelectedFields] = useState({
    date: true,
    asset: true,
    direction: true,
    entryPrice: true,
    exitPrice: true,
    quantity: true,
    pnl: true,
    notes: true,
    tags: true,
  });

  const { data: trades } = useQuery({
    queryKey: ["/api/trades"],
    enabled: !!user,
  });

  const { data: subscriptionStatus } = useQuery({
    queryKey: ["/api/subscription-status"],
    enabled: !!user,
  });

  const isProUser = subscriptionStatus?.plan === "pro";

  const handleFieldToggle = (field: string, checked: boolean) => {
    setSelectedFields(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const generateCSV = () => {
    if (!trades || trades.length === 0) return "";

    const headers = Object.entries(selectedFields)
      .filter(([_, selected]) => selected)
      .map(([field, _]) => field);

    const rows = trades.map((trade: any) => {
      return headers.map(header => {
        switch (header) {
          case 'date':
            return new Date(trade.createdAt).toLocaleDateString();
          case 'asset':
            return trade.asset;
          case 'direction':
            return trade.direction;
          case 'entryPrice':
            return trade.entryPrice;
          case 'exitPrice':
            return trade.exitPrice;
          case 'quantity':
            return trade.quantity;
          case 'pnl':
            return trade.pnl;
          case 'notes':
            return trade.notes || "";
          case 'tags':
            return trade.tags ? trade.tags.join(';') : "";
          default:
            return "";
        }
      });
    });

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const handleExport = () => {
    if (!isProUser) {
      alert("CSV export is a Pro feature. Please upgrade to access this functionality.");
      return;
    }

    const csvContent = generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `trade-journal-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const selectedFieldsCount = Object.values(selectedFields).filter(Boolean).length;

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center space-x-2">
                <FileText className="w-8 h-8" />
                <span>Export Data</span>
              </h1>
              <p className="text-muted-foreground">Export your trading data for analysis</p>
            </div>
            {!isProUser && (
              <Badge variant="outline" className="border-amber-500 text-amber-600">
                Pro Feature
              </Badge>
            )}
          </div>

          {!isProUser && (
            <Alert className="mb-6 border-amber-500 bg-amber-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Data export is available for Pro users. <a href="/subscribe" className="underline">Upgrade now</a> to access this feature.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Download className="w-5 h-5" />
                    <span>Export Options</span>
                  </CardTitle>
                  <CardDescription>
                    Configure your data export settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="format">Export Format</Label>
                    <Select value={exportFormat} onValueChange={setExportFormat}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV (Comma Separated)</SelectItem>
                        <SelectItem value="json" disabled={!isProUser}>
                          JSON {!isProUser && "(Pro)"}
                        </SelectItem>
                        <SelectItem value="excel" disabled={!isProUser}>
                          Excel {!isProUser && "(Pro)"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="dateRange">Date Range</Label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="30d">Last 30 Days</SelectItem>
                        <SelectItem value="90d">Last 90 Days</SelectItem>
                        <SelectItem value="1y">Last Year</SelectItem>
                        <SelectItem value="custom" disabled={!isProUser}>
                          Custom Range {!isProUser && "(Pro)"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Filter className="w-5 h-5" />
                    <span>Fields to Export</span>
                  </CardTitle>
                  <CardDescription>
                    Select which data fields to include ({selectedFieldsCount} selected)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedFields).map(([field, checked]) => (
                      <div key={field} className="flex items-center space-x-2">
                        <Checkbox
                          id={field}
                          checked={checked}
                          onCheckedChange={(checked) => handleFieldToggle(field, checked as boolean)}
                          disabled={!isProUser}
                        />
                        <Label htmlFor={field} className="capitalize">
                          {field === 'pnl' ? 'P&L' : field.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Export Summary</CardTitle>
                  <CardDescription>
                    Review your export configuration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium">Format</div>
                      <div className="text-sm text-muted-foreground uppercase">
                        {exportFormat}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Date Range</div>
                      <div className="text-sm text-muted-foreground">
                        {dateRange === "all" ? "All Time" : dateRange}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Total Records</div>
                      <div className="text-sm text-muted-foreground">
                        {trades?.length || 0} trades
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Fields</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedFieldsCount} selected
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button 
                      onClick={handleExport}
                      disabled={!isProUser || !trades || trades.length === 0}
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Export History</CardTitle>
                  <CardDescription>
                    Your recent data exports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {!isProUser ? (
                      <div className="text-center py-4 text-muted-foreground">
                        Export history available for Pro users
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No exports yet. Create your first export above.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Export Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• CSV format is compatible with Excel and Google Sheets</li>
                    <li>• Include tags for better categorization analysis</li>
                    <li>• Export regularly to backup your trading data</li>
                    <li>• Use date ranges for specific period analysis</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}