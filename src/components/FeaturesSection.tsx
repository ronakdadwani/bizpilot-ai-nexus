import { 
  Brain, 
  TrendingUp, 
  Zap, 
  Database, 
  Activity, 
  Sparkles 
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "Natural Language AI",
      description: "Ask questions in plain English. Get SQL, insights, and visualizations instantly.",
      iconColor: "text-cyan",
      iconBg: "bg-cyan/10 border-cyan/20",
    },
    {
      icon: TrendingUp,
      title: "Predictive Forecasting",
      description: "AI-powered predictions with confidence intervals and external signals.",
      iconColor: "text-primary",
      iconBg: "bg-primary/10 border-primary/20",
    },
    {
      icon: Zap,
      title: "Autonomous Alerts",
      description: "Real-time anomaly detection and strategic notifications.",
      iconColor: "text-yellow-400",
      iconBg: "bg-yellow-400/10 border-yellow-400/20",
    },
    {
      icon: Database,
      title: "Universal Data Sync",
      description: "Connect any data source. CSV, databases, APIs—all unified.",
      iconColor: "text-cyan",
      iconBg: "bg-cyan/10 border-cyan/20",
    },
    {
      icon: Activity,
      title: "Live Intelligence",
      description: "Dynamic dashboards that adapt to your business in real-time.",
      iconColor: "text-accent",
      iconBg: "bg-accent/10 border-accent/20",
    },
    {
      icon: Sparkles,
      title: "Market Intelligence",
      description: "AI-generated competitive analysis and market research.",
      iconColor: "text-pink-400",
      iconBg: "bg-pink-400/10 border-pink-400/20",
    },
  ];

  return (
    <section id="features" className="relative py-24 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Enterprise-Grade AI Platform
          </h2>
          <p className="text-lg text-muted-foreground">
            Built for scale. Designed for intelligence.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card p-6 group hover:scale-[1.02] transition-all duration-300 hover:border-primary/30"
              style={{ 
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className={`inline-flex p-3 rounded-xl border ${feature.iconBg} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
