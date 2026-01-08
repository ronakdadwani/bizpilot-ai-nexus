import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Play } from "lucide-react";

interface DemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DemoModal = ({ open, onOpenChange }: DemoModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">BizPilot Demo</DialogTitle>
        </DialogHeader>
        
        <div className="relative bg-black/50 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
          {/* Demo Video Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
          
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 border-2 border-primary mb-4 hover:bg-primary/30 transition-colors cursor-pointer">
              <Play className="w-8 h-8 text-primary fill-primary" />
            </div>
            
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Demo video coming soon
            </h3>
            <p className="text-muted-foreground mb-6">
              In the meantime, start for free to explore all features
            </p>
            
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                ✨ AI-powered market research
              </p>
              <p className="text-sm text-muted-foreground">
                📊 Real-time business analytics
              </p>
              <p className="text-sm text-muted-foreground">
                🚀 Automated forecasting
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemoModal;
