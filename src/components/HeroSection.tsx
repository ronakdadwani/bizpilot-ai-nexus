import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Play, Send, TrendingUp } from "lucide-react";
import DemoModal from "@/components/DemoModal";

const HeroSection = () => {
  const navigate = useNavigate();
  const [demoOpen, setDemoOpen] = useState(false);
  return (
    <section className="relative min-h-screen pt-24 pb-16 overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Live Badge */}
        <div className="flex justify-center lg:justify-start mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-sm font-medium text-accent">LIVE AI SYSTEM ACTIVE</span>
            <Sparkles className="h-4 w-4 text-accent" />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
              <span className="text-foreground">Your AI</span>
              <br />
              <span className="gradient-text">Chief Strategy Officer.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in-up [animation-delay:100ms]">
              Automate market research, predict trends, and get answers from your business data in seconds. The all-in-one intelligence platform for founders.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up [animation-delay:200ms]">
              <Button 
                variant="hero" 
                size="lg" 
                className="group"
                onClick={() => navigate("/auth")}
              >
                Start for Free
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Button>
              <Button 
                variant="heroOutline" 
                size="lg" 
                className="group"
                onClick={() => setDemoOpen(true)}
              >
                <Play className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Right Column - Mock Chat Interface */}
          <div className="animate-fade-in-up [animation-delay:300ms]">
            <div className="relative">
              {/* Glow effect behind the card */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 blur-2xl opacity-60 rounded-3xl" />
              
              {/* Chat Interface Card */}
              <div className="relative glass-card p-6 rounded-2xl border-primary/20">
                {/* Chat Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">BizPilot AI</p>
                    <p className="text-xs text-accent">● Online</p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="space-y-4 mb-6">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-br-md max-w-[80%]">
                      <p className="text-sm">Project revenue for Q4</p>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="bg-secondary/80 text-foreground px-4 py-3 rounded-2xl rounded-bl-md max-w-[90%]">
                      <p className="text-sm mb-3">Based on current trends and historical data, here's your Q4 projection:</p>
                      
                      {/* Mini Chart */}
                      <div className="bg-background/50 rounded-xl p-4 mb-3">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-muted-foreground">Revenue Forecast</span>
                          <span className="text-xs text-accent font-medium flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            +24%
                          </span>
                        </div>
                        
                        {/* Chart Bars */}
                        <div className="flex items-end gap-2 h-20">
                          <div className="flex-1 flex flex-col items-center gap-1">
                            <div className="w-full bg-muted rounded-t h-8"></div>
                            <span className="text-[10px] text-muted-foreground">Oct</span>
                          </div>
                          <div className="flex-1 flex flex-col items-center gap-1">
                            <div className="w-full bg-muted rounded-t h-12"></div>
                            <span className="text-[10px] text-muted-foreground">Nov</span>
                          </div>
                          <div className="flex-1 flex flex-col items-center gap-1">
                            <div className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t h-16 relative">
                              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary whitespace-nowrap">$2.4M</div>
                            </div>
                            <span className="text-[10px] text-muted-foreground">Dec</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">Confidence: 94% • Based on 847 data points</p>
                    </div>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="flex items-center gap-3 bg-secondary/50 rounded-xl px-4 py-3">
                  <input 
                    type="text" 
                    placeholder="Ask about your business..."
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                    readOnly
                  />
                  <button className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors">
                    <Send className="h-4 w-4 text-primary-foreground" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DemoModal open={demoOpen} onOpenChange={setDemoOpen} />
    </section>
  );
};

export default HeroSection;
