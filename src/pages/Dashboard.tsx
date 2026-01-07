import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DollarSign, TrendingUp, Users, Target, LogOut, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import KPICard from "@/components/dashboard/KPICard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import RecentAlerts from "@/components/dashboard/RecentAlerts";
import TopProductsTable from "@/components/dashboard/TopProductsTable";
import { Button } from "@/components/ui/button";
import { useCustomAuth } from "@/hooks/useCustomAuth";
import { api } from "@/lib/api";
import { toast } from "sonner";

const kpiData = [
  {
    title: "Total Revenue",
    value: "$0",
    change: "0%",
    changeType: "neutral" as const,
    icon: DollarSign,
  },
  {
    title: "Net Profit",
    value: "$0",
    change: "0%",
    changeType: "neutral" as const,
    icon: TrendingUp,
  },
  {
    title: "Active Customers",
    value: "0",
    change: "0%",
    changeType: "neutral" as const,
    icon: Users,
  },
  {
    title: "Prediction Accuracy",
    value: "0%",
    change: "0%",
    changeType: "neutral" as const,
    icon: Target,
  },
];

const Dashboard = () => {
  const { user, loading, signOut } = useCustomAuth();
  const navigate = useNavigate();
  const [kpis, setKpis] = useState(kpiData);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Fetch real data from backend
  useEffect(() => {
    const fetchRealData = async () => {
      if (!user) return;
      
      setIsLoadingData(true);
      try {
        // Try to fetch forecast data (real backend endpoint)
        const forecastResult = await api.getForecast();
        
        // Update KPIs with real data if available
        if (forecastResult.data) {
          const updatedKpis = [
            {
              title: "Revenue Prediction",
              value: forecastResult.data.revenuePrediction 
                ? `$${(forecastResult.data.revenuePrediction / 1000).toFixed(1)}K`
                : "$0",
              change: `${(forecastResult.data.confidenceScore ? forecastResult.data.confidenceScore * 100 : 0).toFixed(0)}%`,
              changeType: "positive" as const,
              icon: DollarSign,
            },
            {
              title: "Confidence Score",
              value: forecastResult.data.confidenceScore 
                ? `${(forecastResult.data.confidenceScore * 100).toFixed(0)}%`
                : "0%",
              change: "Forecast accuracy",
              changeType: "positive" as const,
              icon: Target,
            },
            {
              title: "Peak Period",
              value: forecastResult.data.peakPeriod || "N/A",
              change: "Expected peak",
              changeType: "neutral" as const,
              icon: TrendingUp,
            },
            {
              title: "Data Status",
              value: "Live",
              change: "Real-time",
              changeType: "positive" as const,
              icon: Users,
            },
          ];
          setKpis(updatedKpis);
        }
      } catch (error) {
        // Silently fail - show empty state instead of dummy data
        console.log("No real data available from backend");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchRealData();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DashboardSidebar />
      
      <main className="pl-64 pt-16 page-transition">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
            </div>
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

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {isLoadingData ? (
              <div className="col-span-full flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              kpis.map((kpi, index) => (
                <KPICard key={index} {...kpi} />
              ))
            )}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <RevenueChart />
            </div>
            <div className="lg:col-span-1">
              <RecentAlerts />
            </div>
          </div>

          {/* Products Table */}
          <TopProductsTable />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
