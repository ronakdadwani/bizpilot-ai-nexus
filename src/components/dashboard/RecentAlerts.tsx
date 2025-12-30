import { AlertTriangle, TrendingDown, TrendingUp, Zap } from "lucide-react";

const alerts = [
  {
    id: 1,
    icon: TrendingDown,
    iconColor: "text-yellow-400",
    iconBg: "bg-yellow-400/10",
    title: "Demand for Umbrella dropping soon",
    time: "2 hours ago",
    type: "warning",
  },
  {
    id: 2,
    icon: TrendingUp,
    iconColor: "text-green-400",
    iconBg: "bg-green-400/10",
    title: "Winter jacket sales projected +45%",
    time: "4 hours ago",
    type: "positive",
  },
  {
    id: 3,
    icon: AlertTriangle,
    iconColor: "text-red-400",
    iconBg: "bg-red-400/10",
    title: "Competitor price cut detected",
    time: "6 hours ago",
    type: "critical",
  },
  {
    id: 4,
    icon: Zap,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    title: "New market opportunity in Q1",
    time: "8 hours ago",
    type: "info",
  },
  {
    id: 5,
    icon: TrendingDown,
    iconColor: "text-yellow-400",
    iconBg: "bg-yellow-400/10",
    title: "Supply chain delay expected",
    time: "12 hours ago",
    type: "warning",
  },
];

const RecentAlerts = () => {
  return (
    <div className="glass-card p-6 h-[400px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Alerts</h3>
        <p className="text-sm text-muted-foreground">AI-powered insights</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary/80 transition-colors cursor-pointer"
          >
            <div className={`p-2 rounded-lg ${alert.iconBg} shrink-0`}>
              <alert.icon className={`h-4 w-4 ${alert.iconColor}`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">
                {alert.title}
              </p>
              <p className="text-xs text-muted-foreground">{alert.time}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 text-sm text-primary hover:text-primary/80 font-medium transition-colors">
        View all alerts →
      </button>
    </div>
  );
};

export default RecentAlerts;
