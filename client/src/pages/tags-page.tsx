import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tags, Plus, Edit, Trash2, BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { Sidebar } from "@/components/sidebar";

export default function TagsPage() {
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#10b981");

  const { data: trades } = useQuery({
    queryKey: ["/api/trades"],
    enabled: !!user,
  });

  // Extract and count tags from trades
  const tagCounts = trades?.reduce((acc: Record<string, number>, trade: any) => {
    if (trade.tags) {
      trade.tags.forEach((tag: string) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
    }
    return acc;
  }, {}) || {};

  const tagColors = {
    "breakout": "#10b981",
    "reversal": "#ef4444",
    "momentum": "#3b82f6",
    "scalp": "#f59e0b",
    "swing": "#8b5cf6",
    "day-trade": "#06b6d4",
    "earnings": "#ec4899",
    "news": "#84cc16",
  };

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      // Implementation for creating new tag
      console.log("Create tag:", newTagName, newTagColor);
      setNewTagName("");
      setIsCreateDialogOpen(false);
    }
  };

  const handleDeleteTag = (tagName: string) => {
    // Implementation for deleting tag
    console.log("Delete tag:", tagName);
  };

  const getTagPerformance = (tagName: string) => {
    const tagTrades = trades?.filter((trade: any) => 
      trade.tags?.includes(tagName)
    ) || [];
    
    const totalPnL = tagTrades.reduce((sum: number, trade: any) => sum + trade.pnl, 0);
    const winRate = tagTrades.length > 0 
      ? (tagTrades.filter((trade: any) => trade.pnl > 0).length / tagTrades.length) * 100
      : 0;
    
    return { totalPnL, winRate, tradeCount: tagTrades.length };
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-64">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center space-x-2">
                <Tags className="w-8 h-8" />
                <span>Tags & Labels</span>
              </h1>
              <p className="text-muted-foreground">Organize and analyze your trades by categories</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Tag
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Tag</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tagName">Tag Name</Label>
                    <Input
                      id="tagName"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="e.g., breakout, reversal, momentum"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tagColor">Color</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        id="tagColor"
                        value={newTagColor}
                        onChange={(e) => setNewTagColor(e.target.value)}
                        className="w-12 h-8 rounded border"
                      />
                      <Badge style={{ backgroundColor: newTagColor }}>
                        {newTagName || "Preview"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTag}>Create Tag</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{Object.keys(tagCounts).length}</div>
                <p className="text-sm text-muted-foreground">Active trading tags</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Most Used Tag</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Object.keys(tagCounts).length > 0 
                    ? Object.entries(tagCounts).sort(([,a], [,b]) => b - a)[0][0]
                    : "N/A"
                  }
                </div>
                <p className="text-sm text-muted-foreground">
                  Used in {Object.keys(tagCounts).length > 0 
                    ? Object.entries(tagCounts).sort(([,a], [,b]) => b - a)[0][1]
                    : 0
                  } trades
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tagged Trades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {trades?.filter((trade: any) => trade.tags?.length > 0).length || 0}
                </div>
                <p className="text-sm text-muted-foreground">
                  {trades?.length > 0 
                    ? `${Math.round(((trades?.filter((trade: any) => trade.tags?.length > 0).length || 0) / trades.length) * 100)}%`
                    : "0%"
                  } of all trades
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tag Performance</CardTitle>
              <CardDescription>
                Analyze performance by trading strategy and setup
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(tagCounts).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No tags found. Start adding tags to your trades to see performance analytics here.
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(tagCounts).map(([tagName, count]) => {
                    const performance = getTagPerformance(tagName);
                    const color = tagColors[tagName as keyof typeof tagColors] || "#6b7280";
                    
                    return (
                      <div key={tagName} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Badge style={{ backgroundColor: color }}>
                            {tagName}
                          </Badge>
                          <div>
                            <div className="font-medium">{count} trades</div>
                            <div className="text-sm text-muted-foreground">
                              {performance.winRate.toFixed(1)}% win rate
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className={`font-semibold ${
                              performance.totalPnL >= 0 ? "text-green-600" : "text-red-600"
                            }`}>
                              {performance.totalPnL >= 0 ? "+" : ""}${performance.totalPnL.toFixed(2)}
                            </div>
                            <div className="text-sm text-muted-foreground">Total P&L</div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteTag(tagName)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Popular Trading Tags</CardTitle>
              <CardDescription>
                Commonly used tags in the trading community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(tagColors).map(([tagName, color]) => (
                  <div key={tagName} className="flex items-center justify-between p-3 border rounded-lg">
                    <Badge style={{ backgroundColor: color }}>
                      {tagName}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}