import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sparkles, Loader2, Zap, Clock, Brain, ThumbsUp, ThumbsDown, Target, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

type DepthLevel = "level1" | "level2" | "level3";

interface SWOTData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

const depthOptions = [
  {
    value: "level1",
    label: "Level 1",
    description: "Quick Overview",
    time: "~30 seconds",
    icon: Zap,
  },
  {
    value: "level2",
    label: "Level 2",
    description: "Medium Analysis",
    time: "~2 minutes",
    icon: Clock,
  },
  {
    value: "level3",
    label: "Level 3",
    description: "Deep Research",
    time: "~5 minutes",
    icon: Brain,
  },
];

const mockSWOT: SWOTData = {
  strengths: [
    "Unique AI-powered approach differentiates from competitors",
    "Strong focus on founder/SMB segment with clear value proposition",
    "All-in-one platform reduces tool fragmentation",
    "Real-time data analysis provides immediate insights",
  ],
  weaknesses: [
    "New entrant in established market research industry",
    "Requires significant data integration for full functionality",
    "May face trust barriers with AI-generated insights",
    "Limited brand recognition in target market",
  ],
  opportunities: [
    "Growing demand for AI-powered business tools",
    "SMBs underserved by expensive enterprise solutions",
    "Partnership potential with accounting/ERP software",
    "Expansion into international markets",
  ],
  threats: [
    "Large players (Google, Microsoft) entering AI business tools",
    "Data privacy regulations may limit functionality",
    "Economic downturn could reduce SMB spending",
    "Open-source alternatives could erode market share",
  ],
};

const MarketResearch = () => {
  const [businessIdea, setBusinessIdea] = useState("");
  const [industry, setIndustry] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [depth, setDepth] = useState<DepthLevel>("level2");
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleGenerate = async () => {
    if (!businessIdea.trim() || !industry.trim()) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setShowResults(true);
  };

  const SWOTQuadrant = ({
    title,
    items,
    icon: Icon,
    colorClass,
    bgClass,
  }: {
    title: string;
    items: string[];
    icon: React.ElementType;
    colorClass: string;
    bgClass: string;
  }) => (
    <div className={`glass-card p-5 ${bgClass} border-l-4 ${colorClass}`}>
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`h-5 w-5 ${colorClass.replace("border-", "text-")}`} />
        <h4 className="font-semibold text-foreground">{title}</h4>
      </div>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${colorClass.replace("border-", "bg-")}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DashboardSidebar />

      <main className="pl-64 pt-16">
        <div className="p-8 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Market Research</h1>
            <p className="text-muted-foreground">
              AI-powered intelligence reports for your business ideas
            </p>
          </div>

          {/* Input Form */}
          <div className="glass-card p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="business-idea" className="text-foreground">
                  Business Idea *
                </Label>
                <Textarea
                  id="business-idea"
                  placeholder="Describe your business idea in detail..."
                  value={businessIdea}
                  onChange={(e) => setBusinessIdea(e.target.value)}
                  className="min-h-[100px] bg-secondary/50 border-border/50 focus:border-primary"
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-foreground">
                    Industry *
                  </Label>
                  <Input
                    id="industry"
                    placeholder="e.g., SaaS, E-commerce, Healthcare..."
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="bg-secondary/50 border-border/50 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target-audience" className="text-foreground">
                    Target Audience
                  </Label>
                  <Input
                    id="target-audience"
                    placeholder="e.g., Small business owners, Gen Z consumers..."
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="bg-secondary/50 border-border/50 focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Depth Selector */}
            <div className="mb-6">
              <Label className="text-foreground mb-3 block">Research Depth</Label>
              <RadioGroup
                value={depth}
                onValueChange={(value) => setDepth(value as DepthLevel)}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {depthOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`relative flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                      depth === option.value
                        ? "bg-primary/10 border-2 border-primary"
                        : "bg-secondary/50 border-2 border-transparent hover:border-border"
                    }`}
                  >
                    <RadioGroupItem value={option.value} className="sr-only" />
                    <div className={`p-2 rounded-lg ${depth === option.value ? "bg-primary/20" : "bg-secondary"}`}>
                      <option.icon className={`h-5 w-5 ${depth === option.value ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${depth === option.value ? "text-primary" : "text-foreground"}`}>
                        {option.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{option.time}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>

            {/* Generate Button */}
            <Button
              variant="hero"
              size="lg"
              onClick={handleGenerate}
              disabled={!businessIdea.trim() || !industry.trim() || isLoading}
              className="w-full md:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Generate Intelligence Report
                </>
              )}
            </Button>
          </div>

          {/* Results Section */}
          {showResults && (
            <div className="animate-fade-in-up">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Intelligence Report</h2>
                  <p className="text-muted-foreground">AI-generated analysis for: {industry}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Was this helpful?</span>
                  <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                    <ThumbsUp className="h-4 w-4 text-muted-foreground hover:text-green-400" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                    <ThumbsDown className="h-4 w-4 text-muted-foreground hover:text-red-400" />
                  </button>
                </div>
              </div>

              {/* SWOT Analysis Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SWOTQuadrant
                  title="Strengths"
                  items={mockSWOT.strengths}
                  icon={ThumbsUp}
                  colorClass="border-green-500"
                  bgClass="bg-green-500/5"
                />
                <SWOTQuadrant
                  title="Weaknesses"
                  items={mockSWOT.weaknesses}
                  icon={ThumbsDown}
                  colorClass="border-red-500"
                  bgClass="bg-red-500/5"
                />
                <SWOTQuadrant
                  title="Opportunities"
                  items={mockSWOT.opportunities}
                  icon={Target}
                  colorClass="border-primary"
                  bgClass="bg-primary/5"
                />
                <SWOTQuadrant
                  title="Threats"
                  items={mockSWOT.threats}
                  icon={AlertTriangle}
                  colorClass="border-yellow-500"
                  bgClass="bg-yellow-500/5"
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MarketResearch;
