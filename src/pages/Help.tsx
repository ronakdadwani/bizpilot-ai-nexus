import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle, Book, MessageCircle, Mail, ExternalLink, Search, LogOut } from "lucide-react";
import Navbar from "@/components/Navbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useCustomAuth } from "@/hooks/useCustomAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Help = () => {
  const { user, loading, signOut } = useCustomAuth();
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const faqs = [
    {
      question: "How do I upload my sales data?",
      answer: "Navigate to the 'Upload Data' section from the sidebar. You can drag and drop your CSV or Excel files, or click to browse your computer. We support .csv, .xlsx, and .xls formats.",
    },
    {
      question: "How accurate are the AI forecasts?",
      answer: "Our AI models typically achieve 85-95% accuracy depending on the quality and quantity of your historical data. The more data you provide, the more accurate the predictions become.",
    },
    {
      question: "Can I export my reports?",
      answer: "Yes! You can export any report by clicking the 'Download' or 'Export' button. Reports are available in PDF and Excel formats.",
    },
    {
      question: "How often is my data refreshed?",
      answer: "If you've set up automatic data sync, your data updates in real-time. For manual uploads, data is processed immediately after upload.",
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use enterprise-grade encryption for all data in transit and at rest. Your data is never shared with third parties.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DashboardSidebar />

      <main className="pl-64 pt-16 page-transition">
        <div className="p-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Help Center</h1>
              <p className="text-muted-foreground">
                Find answers and get support
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

          {/* Search */}
          <Card className="glass-card mb-8">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for help..."
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="glass-card hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="pt-6 text-center">
                <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                  <Book className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Documentation</h3>
                <p className="text-sm text-muted-foreground">Browse our guides</p>
              </CardContent>
            </Card>
            <Card className="glass-card hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="pt-6 text-center">
                <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Live Chat</h3>
                <p className="text-sm text-muted-foreground">Talk to our team</p>
              </CardContent>
            </Card>
            <Card className="glass-card hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="pt-6 text-center">
                <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Email Support</h3>
                <p className="text-sm text-muted-foreground">support@bizpilot.ai</p>
              </CardContent>
            </Card>
          </div>

          {/* FAQs */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Help;
