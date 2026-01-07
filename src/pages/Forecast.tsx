import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Brain, Calendar, Sparkles, Loader2, LogOut } from "lucide-react";
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
import { api, ForecastData } from "@/lib/api";
import { toast } from "sonner";

const Forecast = () => {
  const { user, loading, signOut } = useCustomAuth();
  const navigate = useNavigate();
  const [forecastPeriod, setForecastPeriod] = useState("30d");
  const [isGenerating, setIsGenerating] = useState(false);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  useEffect(() => {
    const fetchForecast = async () => {
      setIsLoading(true);
      const result = await api.getForecast(forecastPeriod);
      if (result.data) {
        setForecastData(result.data);
      } else if (result.error) {
        toast.error("Failed to load forecast: " + result.error);
      }
      setIsLoading(false);
    };

    if (user) {
      fetchForecast();
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

  const handleGenerateForecast = async () => {
    setIsGenerating(true);
    const result = await api.getForecast(forecastPeriod);
    if (result.data) {
      setForecastData(result.data);
      toast.success("Forecast generated successfully!");
    } else if (result.error) {
      toast.error("Failed to generate forecast: " + result.error);
    }
    setIsGenerating(false);
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
              <h1 className="text-3xl font-bold text-foreground mb-2">AI Forecast</h1>
              <p className="text-muted-foreground">
                AI-powered revenue and trend predictions
              </p>
            </div>
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

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
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
                    <div className="text-3xl font-bold text-foreground">
                      {forecastData?.revenuePrediction 
                        ? `$${forecastData.revenuePrediction.toLocaleString()}` 
                        : "N/A"}
                    </div>
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
                    <div className="text-3xl font-bold text-foreground">
                      {forecastData?.confidenceScore 
                        ? `${forecastData.confidenceScore}%` 
                        : "N/A"}
                    </div>
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
                    <div className="text-3xl font-bold text-foreground">
                      {forecastData?.peakPeriod || "N/A"}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Predicted high activity</p>
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
                  {forecastData?.forecastData ? (
                    <p className="text-muted-foreground">Forecast data loaded from backend</p>
                  ) : (
                    <div className="text-center">
                      <Brain className="h-16 w-16 text-primary/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Upload sales data to generate AI-powered forecasts
                      </p>
                      <Button variant="outline" className="mt-4" onClick={() => navigate("/upload-data")}>
                        Upload Sales Data
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Forecast;