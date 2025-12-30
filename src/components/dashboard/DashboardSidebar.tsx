import { NavLink } from "@/components/NavLink";
import { 
  LayoutDashboard, 
  Search, 
  TrendingUp, 
  Settings, 
  HelpCircle,
  Sparkles,
  FileText,
  Users,
  Bell
} from "lucide-react";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Market Research", href: "/market-research", icon: Search },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Alerts", href: "/alerts", icon: Bell },
];

const bottomItems = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help", href: "/help", icon: HelpCircle },
];

const DashboardSidebar = () => {
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-border/50 bg-background/80 backdrop-blur-xl flex flex-col">
      <div className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            activeClassName="bg-primary/10 text-primary border border-primary/20"
          >
            <item.icon className="h-5 w-5" />
            <span className="text-sm font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* AI Assistant Card */}
      <div className="p-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">AI Assistant</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Ask anything about your business data
          </p>
          <button className="w-full py-2 px-3 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary text-sm font-medium transition-colors">
            Start Chat
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-border/50 space-y-1">
        {bottomItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            activeClassName="bg-primary/10 text-primary"
          >
            <item.icon className="h-5 w-5" />
            <span className="text-sm font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default DashboardSidebar;
