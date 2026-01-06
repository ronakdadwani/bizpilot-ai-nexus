import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, AlertTriangle, TrendingDown, TrendingUp, Package, CheckCircle, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useCustomAuth } from "@/hooks/useCustomAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Alert {
  id: string;
  type: "warning" | "critical" | "info" | "success";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const Alerts = () => {
  const { user, loading } = useCustomAuth();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "critical",
      title: "Low Inventory Alert",
      message: "Product SKU-1234 is running low. Only 5 units remaining.",
      timestamp: "10 minutes ago",
      read: false,
    },
    {
      id: "2",
      type: "warning",
      title: "Sales Target Below Average",
      message: "Daily sales are 15% below the monthly target.",
      timestamp: "1 hour ago",
      read: false,
    },
    {
      id: "3",
      type: "success",
      title: "Revenue Milestone Reached",
      message: "Congratulations! You've reached $100K in monthly revenue.",
      timestamp: "2 hours ago",
      read: true,
    },
    {
      id: "4",
      type: "info",
      title: "New Customer Segment Identified",
      message: "AI has identified a new potential customer segment in your data.",
      timestamp: "5 hours ago",
      read: true,
    },
  ]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

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

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <TrendingDown className="h-5 w-5 text-yellow-500" />;
      case "success":
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case "info":
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const getAlertBadge = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return <Badge className="bg-red-500/20 text-red-500">Critical</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500/20 text-yellow-500">Warning</Badge>;
      case "success":
        return <Badge className="bg-green-500/20 text-green-500">Success</Badge>;
      case "info":
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DashboardSidebar />

      <main className="pl-64 pt-16">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Alerts</h1>
              <p className="text-muted-foreground">
                Stay updated on important business events
              </p>
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" onClick={() => setAlerts(prev => prev.map(a => ({ ...a, read: true })))}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark All as Read
              </Button>
            )}
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

          {/* Alerts List */}
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
              <TabsTrigger value="critical">Critical</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {alerts.map((alert) => (
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
              ))}
            </TabsContent>

            <TabsContent value="unread" className="space-y-4">
              {alerts.filter(a => !a.read).map((alert) => (
                <Card 
                  key={alert.id} 
                  className="glass-card border-l-4 border-l-primary"
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
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                        <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => markAsRead(alert.id)}>
                          Mark as Read
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => dismissAlert(alert.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="critical" className="space-y-4">
              {alerts.filter(a => a.type === "critical").map((alert) => (
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
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Alerts;
