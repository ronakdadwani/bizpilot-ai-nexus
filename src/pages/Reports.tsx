import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Download, Calendar, Filter, Plus, Loader2, LogOut } from "lucide-react";
import Navbar from "@/components/Navbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useCustomAuth } from "@/hooks/useCustomAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api, Report } from "@/lib/api";
import { toast } from "sonner";

const Reports = () => {
  const { user, loading, signOut } = useCustomAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      const result = await api.getReports();
      if (result.data) {
        setReports(result.data);
      } else if (result.error) {
        toast.error("Failed to load reports: " + result.error);
      }
      setIsLoading(false);
    };

    if (user) {
      fetchReports();
    }
  }, [user]);

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">Ready</Badge>;
      case "generating":
        return <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30">Generating</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30">Scheduled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DashboardSidebar />

      <main className="pl-64 pt-16 page-transition">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Reports</h1>
              <p className="text-muted-foreground">
                View and download your business reports
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Generate Report
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
          ) : reports.length > 0 ? (
            /* Reports Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report) => (
                <Card key={report.id} className="glass-card hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      {getStatusBadge(report.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold text-foreground mb-1">{report.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <span className="px-2 py-0.5 rounded bg-secondary">{report.type}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {report.date}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      disabled={report.status !== "ready"}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {report.status === "ready" ? "Download" : "Not Ready"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No reports available</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Reports;