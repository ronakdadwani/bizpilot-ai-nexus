import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, AlertTriangle, TrendingDown, TrendingUp, CheckCircle, X, Loader2, LogOut } from "lucide-react";
import Navbar from "@/components/Navbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useCustomAuth } from "@/hooks/useCustomAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api, AlertItem } from "@/lib/api";
import { toast } from "sonner";

const Alerts = () => {
  const { user, loading, signOut } = useCustomAuth();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchAlerts = async () => {
      setIsLoading(true);
      const result = await api.getAlerts();
      if (result.data) {
        setAlerts(result.data);
      } else if (result.error) {
        toast.error("Failed to load alerts: " + result.error);
      }
      setIsLoading(false);
    };

    if (user) {
      fetchAlerts();
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

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <TrendingDown className="h-5 w-5 text-yellow-500" />;
      case "success":
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case "info":
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const getAlertBadge = (type: string) => {
    switch (type) {
      case "critical":
        return <Badge className="bg-red-500/20 text-red-500">Critical</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500/20 text-yellow-500">Warning</Badge>;
      case "success":
        return <Badge className="bg-green-500/20 text-green-500">Success</Badge>;
      case "info":
      default:
        return <Badge className="bg-blue-500/20 text-blue-500">Info</Badge>;
    }
  };

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const unreadCount = alerts.filter(a => !a.read).length;

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const renderAlertCard = (alert: AlertItem) => (
    <Card 
      key={alert.id} 
      className={`glass-card ${!alert.read ? "border-l-4 border-l-primary" : ""}`}
    >
      <CardContent className="py-4">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-secondary">
            {getAlertIcon(alert.type)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground">{alert.title}</h3>
              {getAlertBadge(alert.type)}
              {!alert.read && (
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
            <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
          </div>
          <div className="flex items-center gap-2">
            {!alert.read && (
              <Button variant="ghost" size="sm" onClick={() => markAsRead(alert.id)}>
                Mark as Read
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => dismissAlert(alert.id)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DashboardSidebar />

      <main className="pl-64 pt-16 page-transition">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Alerts</h1>
              <p className="text-muted-foreground">
                Stay updated on important business events
              </p>
            </div>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <Button variant="outline" onClick={() => setAlerts(prev => prev.map(a => ({ ...a, read: true })))}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark All as Read
                </Button>
              )}
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

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-foreground">{alerts.length}</div>
                <p className="text-sm text-muted-foreground">Total Alerts</p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-red-500">
                  {alerts.filter(a => a.type === "critical").length}
                </div>
                <p className="text-sm text-muted-foreground">Critical</p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-yellow-500">
                  {alerts.filter(a => a.type === "warning").length}
                </div>
                <p className="text-sm text-muted-foreground">Warnings</p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">{unreadCount}</div>
                <p className="text-sm text-muted-foreground">Unread</p>
              </CardContent>
            </Card>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            /* Alerts List */
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
                <TabsTrigger value="critical">Critical</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {alerts.length > 0 ? (
                  alerts.map(renderAlertCard)
                ) : (
                  <p className="text-center text-muted-foreground py-12">No alerts</p>
                )}
              </TabsContent>

              <TabsContent value="unread" className="space-y-4">
                {alerts.filter(a => !a.read).length > 0 ? (
                  alerts.filter(a => !a.read).map(renderAlertCard)
                ) : (
                  <p className="text-center text-muted-foreground py-12">No unread alerts</p>
                )}
              </TabsContent>

              <TabsContent value="critical" className="space-y-4">
                {alerts.filter(a => a.type === "critical").length > 0 ? (
                  alerts.filter(a => a.type === "critical").map(renderAlertCard)
                ) : (
                  <p className="text-center text-muted-foreground py-12">No critical alerts</p>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
};

export default Alerts;