import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Brain, Calendar, Sparkles, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useCustomAuth } from "@/hooks/useCustomAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Forecast = () => {
  const { user, loading } = useCustomAuth();
  const navigate = useNavigate();
  const [forecastPeriod, setForecastPeriod] = useState("30d");
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleGenerateForecast = async () => {
    setIsGenerating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DashboardSidebar />

      <main className="pl-64 pt-16">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">AI Forecast</h1>
              <p className="text-muted-foreground">
                Predictive analytics powered by machine learning
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
                <SelectTrigger className="w-[180px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Forecast period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Next 7 days</SelectItem>
                  <SelectItem value="30d">Next 30 days</SelectItem>
                  <SelectItem value="90d">Next quarter</SelectItem>
                  <SelectItem value="1y">Next year</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleGenerateForecast} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Forecast
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Forecast Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Revenue Prediction
                </CardTitle>
                <CardDescription>Expected revenue for next period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">$156,000</div>
                <p className="text-sm text-green-500 mt-1">+18% projected growth</p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Confidence Score
                </CardTitle>
                <CardDescription>Model prediction accuracy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">87.5%</div>
                <p className="text-sm text-muted-foreground mt-1">Based on historical data</p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Peak Period
                </CardTitle>
                <CardDescription>Highest expected activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">Week 3</div>
                <p className="text-sm text-muted-foreground mt-1">Jan 15-21, 2026</p>
              </CardContent>
            </Card>
          </div>

          {/* Forecast Chart Placeholder */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Forecast Visualization</CardTitle>
              <CardDescription>
                AI-powered predictions based on your sales data
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <Brain className="h-16 w-16 text-primary/30 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Upload sales data to generate AI-powered forecasts
                </p>
                <Button variant="outline" className="mt-4" onClick={() => navigate("/upload-data")}>
                  Upload Sales Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Forecast;
