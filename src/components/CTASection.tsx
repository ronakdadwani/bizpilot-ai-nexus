import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="relative max-w-4xl mx-auto">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 blur-3xl opacity-50 rounded-3xl" />
          
          <div className="relative glass-card p-12 md:p-16 text-center rounded-2xl border-primary/20">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Ready to Amplify
              <br />
              Your Intelligence?
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Join the AI-powered business revolution
            </p>

            <Button variant="cta" size="xl">
              Start Free Trial
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
