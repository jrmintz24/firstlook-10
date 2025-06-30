
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Zap, CheckCircle, ArrowRight } from "lucide-react";
import BuyerQualificationForm from "./BuyerQualificationForm";

interface OfferTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAgentAssisted: (qualificationData?: any) => void;
  onSelectFirstLookGenerator: (qualificationData?: any) => void;
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
  const [selectedOption, setSelectedOption] = useState<'agent' | 'generator' | null>(null);
  const [showQualificationForm, setShowQualificationForm] = useState(false);

  const handleOptionSelect = (option: 'agent' | 'generator') => {
    setSelectedOption(option);
    setShowQualificationForm(true);
  };

  const handleQualificationSubmit = (qualificationData: any) => {
    if (selectedOption === 'agent') {
      onSelectAgentAssisted(qualificationData);
    } else {
      onSelectFirstLookGenerator(qualificationData);
    }
    onClose();
  };

  if (showQualificationForm) {
    return (
      <BuyerQualificationForm
        isOpen={isOpen}
        onClose={() => {
          setShowQualificationForm(false);
          setSelectedOption(null);
        }}
        onSubmit={handleQualificationSubmit}
        propertyAddress={propertyAddress}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>How would you like to make your offer?</DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            Choose the best approach for making an offer on {propertyAddress}
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Agent Assisted Option */}
          {agentName && (
            <Card className="cursor-pointer border-2 hover:border-blue-300 transition-colors" onClick={() => handleOptionSelect('agent')}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Work with {agentName}</h3>
                    <Badge variant="secondary" className="text-xs">Recommended</Badge>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Expert negotiation and market analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Handle paperwork and legal details</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Up to 1% cash back at closing</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Ongoing support through closing</span>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  <span>Choose Agent Assistance</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* FirstLook Generator Option */}
          <Card className="cursor-pointer border-2 hover:border-purple-300 transition-colors" onClick={() => handleOptionSelect('generator')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Zap className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">FirstLook Generator</h3>
                  <Badge variant="secondary" className="text-xs">Fast & Easy</Badge>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>AI-powered offer analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Instant competitive pricing</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Professional offer documents</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Submit offers in minutes</span>
                </div>
              </div>

              <Button className="w-full" variant="outline">
                <span>Use Offer Generator</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center pt-4 border-t">
          <Button variant="ghost" onClick={onClose}>
            I'll decide later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OfferTypeDialog;
