import { DollarSign, TrendingUp, Users, Target } from "lucide-react";
import Navbar from "@/components/Navbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import KPICard from "@/components/dashboard/KPICard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import RecentAlerts from "@/components/dashboard/RecentAlerts";
import TopProductsTable from "@/components/dashboard/TopProductsTable";

const kpiData = [
  {
    title: "Total Revenue",
    value: "$2.4M",
    change: "12.5%",
    changeType: "positive" as const,
    icon: DollarSign,
  },
  {
    title: "Net Profit",
    value: "$847K",
    change: "8.2%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
  {
    title: "Active Customers",
    value: "12,847",
    change: "23.1%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Prediction Accuracy",
    value: "94.7%",
    change: "2.3%",
    changeType: "positive" as const,
    icon: Target,
  },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DashboardSidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiData.map((kpi, index) => (
              <KPICard key={index} {...kpi} />
            ))}
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
