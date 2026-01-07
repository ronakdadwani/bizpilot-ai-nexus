import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, BarChart3, PieChart, Activity, Download, Calendar, Loader2, LogOut } from "lucide-react";
import Navbar from "@/components/Navbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useCustomAuth } from "@/hooks/useCustomAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api, AnalyticsData } from "@/lib/api";
import { toast } from "sonner";

const Analytics = () => {
  const { user, loading, signOut } = useCustomAuth();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("30d");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      const result = await api.getAnalytics();
      if (result.data) {
        setAnalyticsData(result.data);
      } else if (result.error) {
        toast.error("Failed to load analytics: " + result.error);
      }
      setIsLoading(false);
    };

    if (user) {
      fetchAnalytics();
    }
  }, [user, timeRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const analyticsCards = [
    { 
      title: "Total Sales", 
      value: analyticsData?.totalSales ? `$${analyticsData.totalSales.toLocaleString()}` : "$0", 
      change: "+12.5%", 
      icon: TrendingUp 
    },
    { 
      title: "Conversion Rate", 
      value: analyticsData?.conversionRate ? `${analyticsData.conversionRate}%` : "0%", 
      change: "+0.8%", 
      icon: Activity 
    },
    { 
      title: "Avg. Order Value", 
      value: analyticsData?.avgOrderValue ? `$${analyticsData.avgOrderValue.toFixed(2)}` : "$0", 
      change: "+5.2%", 
      icon: BarChart3 
    },
    { 
      title: "Customer Retention", 
      value: analyticsData?.customerRetention ? `${analyticsData.customerRetention}%` : "0%", 
      change: "+2.1%", 
      icon: PieChart 
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DashboardSidebar />

      <main className="pl-64 pt-16 page-transition">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
              <p className="text-muted-foreground">
                Track your business performance and insights
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[150px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {analyticsCards.map((card, index) => (
                  <Card key={index} className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {card.title}
                      </CardTitle>
                      <card.icon className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-foreground">{card.value}</div>
                      <p className="text-xs text-green-500 mt-1">{card.change} from last period</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Placeholder Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Sales Trend</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    {analyticsData?.salesTrend ? (
                      <p className="text-muted-foreground">Sales data loaded from backend</p>
                    ) : (
                      <p className="text-muted-foreground">No sales data available</p>
                    )}
                  </CardContent>
                </Card>
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Category Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    {analyticsData?.categoryBreakdown ? (
                      <p className="text-muted-foreground">Category data loaded from backend</p>
                    ) : (
                      <p className="text-muted-foreground">No category data available</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Analytics;