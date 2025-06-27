
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, Zap, FileText } from "lucide-react";

interface OfferTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAgentAssisted: () => void;
  onSelectFirstLookGenerator: () => void;
  agentName?: string;
  propertyAddress: string;
}

const OfferTypeDialog = ({
  isOpen,
  onClose,
  onSelectAgentAssisted,
  onSelectFirstLookGenerator,
  agentName,
  propertyAddress
}: OfferTypeDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAgentAssisted = async () => {
    setIsSubmitting(true);
    await onSelectAgentAssisted();
    setIsSubmitting(false);
    onClose();
  };

  const handleFirstLookGenerator = async () => {
    setIsSubmitting(true);
    await onSelectFirstLookGenerator();
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Make an Offer on This Property
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Ready to make an offer on <strong>{propertyAddress}</strong>? Choose how you'd like to proceed:
          </p>

          <div className="space-y-3">
            {agentName && (
              <Button
                onClick={handleAgentAssisted}
                disabled={isSubmitting}
                className="w-full h-auto p-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <div className="flex items-start gap-3 text-left">
                  <User className="h-5 w-5 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Work with {agentName}</div>
                    <div className="text-sm opacity-90">
                      Get personalized offer coaching and negotiation support from your tour agent
                    </div>
                  </div>
                </div>
              </Button>
            )}

            <Button
              onClick={handleFirstLookGenerator}
              disabled={isSubmitting}
              variant="outline"
              className="w-full h-auto p-4 border-2 border-orange-200 hover:bg-orange-50"
            >
              <div className="flex items-start gap-3 text-left">
                <Zap className="h-5 w-5 mt-1 flex-shrink-0 text-orange-600" />
                <div>
                  <div className="font-semibold text-gray-900">Use FirstLook Offer Generator</div>
                  <div className="text-sm text-gray-600">
                    Create a competitive offer instantly with our automated tools
                  </div>
                </div>
              </div>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OfferTypeDialog;
