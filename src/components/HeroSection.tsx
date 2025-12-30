import { Button } from "@/components/ui/button";
import { Sparkles, Play, Brain, Activity, TrendingUp } from "lucide-react";

const HeroSection = () => {
  const stats = [
    {
      icon: Brain,
      value: "99.9%",
      label: "ACCURACY",
      title: "Neural Query Engine",
      color: "text-cyan",
    },
    {
      icon: Activity,
      value: "<50ms",
      label: "RESPONSE TIME",
      title: "Real-Time Processing",
      color: "text-accent",
    },
    {
      icon: TrendingUp,
      value: "10x",
      label: "FASTER INSIGHTS",
      title: "Predictive Models",
      color: "text-primary",
    },
  ];

  return (
    <section className="relative min-h-screen pt-24 pb-16 overflow-hidden">
      {/* Background Gradient Orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Live Badge */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-sm font-medium text-accent">LIVE AI SYSTEM ACTIVE</span>
            <Sparkles className="h-4 w-4 text-accent" />
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
            <span className="gradient-text">Autonomous</span>
            <br />
            <span className="text-foreground">Intelligence</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground font-light mb-4 animate-fade-in-up [animation-delay:100ms]">
            Real-Time AI Decision Engine
          </p>
          
          <p className="text-base md:text-lg text-muted-foreground/80 max-w-2xl mx-auto mb-10 animate-fade-in-up [animation-delay:200ms]">
            Replace your entire C-suite with AI-powered strategic intelligence. Get instant
            insights, predictive analytics, and autonomous decision-making through natural
            language.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up [animation-delay:300ms]">
            <Button variant="hero" size="lg" className="group">
              Launch Console
              <span className="group-hover:translate-x-1 transition-transform">›</span>
            </Button>
            <Button variant="heroOutline" size="lg" className="group">
              <Play className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto animate-fade-in-up [animation-delay:400ms]">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="glass-card p-6 text-center hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="flex justify-center mb-4">
                <div className={`p-3 rounded-lg bg-secondary ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{stat.title}</p>
              <p className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
