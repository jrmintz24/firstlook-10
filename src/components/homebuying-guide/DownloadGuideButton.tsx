
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const DownloadGuideButton = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    
    try {
      // In a real implementation, this would call an API to generate a PDF
      // For now, we'll simulate the process and show a toast
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("PDF guide will be emailed to you shortly!", {
        description: "Check your inbox in the next few minutes."
      });
    } catch (error) {
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isGenerating}
      variant="outline"
      className="flex items-center gap-2 border-purple-200 hover:bg-purple-50"
    >
      <Download className="w-4 h-4" />
      {isGenerating ? "Generating..." : "Download PDF Guide"}
    </Button>
  );
};
