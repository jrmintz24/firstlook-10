
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, X, User } from "lucide-react";

interface BuyerConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentName: string;
  onConsent: (consent: boolean) => void;
  loading?: boolean;
}

const BuyerConsentModal = ({ 
  isOpen, 
  onClose, 
  agentName, 
  onConsent, 
  loading = false 
}: BuyerConsentModalProps) => {
  const [selectedChoice, setSelectedChoice] = useState<boolean | null>(null);

  const handleSubmit = () => {
    if (selectedChoice !== null) {
      onConsent(selectedChoice);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-purple-600" />
            Share Contact Information?
          </DialogTitle>
          <DialogDescription>
            Your showing with {agentName} has been completed. Would you like to share your contact information with them for future opportunities?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-3">
            <Card 
              className={`cursor-pointer transition-all ${
                selectedChoice === true 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-green-300'
              }`}
              onClick={() => setSelectedChoice(true)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className={`h-5 w-5 ${
                    selectedChoice === true ? 'text-green-600' : 'text-gray-400'
                  }`} />
                  <div>
                    <div className="font-medium text-green-800">Yes, share my contact info</div>
                    <div className="text-sm text-green-600">
                      Allow {agentName} to contact you about future properties and opportunities
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all ${
                selectedChoice === false 
                  ? 'border-gray-500 bg-gray-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedChoice(false)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <X className={`h-5 w-5 ${
                    selectedChoice === false ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <div>
                    <div className="font-medium text-gray-800">No, keep my info private</div>
                    <div className="text-sm text-gray-600">
                      Your contact information will remain protected
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={selectedChoice === null || loading}
              className="flex-1"
            >
              {loading ? "Saving..." : "Confirm Choice"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyerConsentModal;
