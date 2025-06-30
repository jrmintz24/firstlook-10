
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calculator, Users, CheckSquare } from "lucide-react";
import OfferQuestionnaireWizard from "@/components/offer-workflow/OfferQuestionnaireWizard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EnhancedOfferTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  showing: {
    id: string;
    property_address: string;
    assigned_agent_id?: string;
    assigned_agent_name?: string;
  };
  buyerId: string;
}

const EnhancedOfferTypeDialog = ({
  isOpen,
  onClose,
  showing,
  buyerId
}: EnhancedOfferTypeDialogProps) => {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [offerIntentId, setOfferIntentId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleStartComprehensiveOffer = async () => {
    setLoading(true);
    try {
      // Create new offer intent
      const { data, error } = await supabase
        .from('offer_intents')
        .insert({
          buyer_id: buyerId,
          agent_id: showing.assigned_agent_id,
          showing_request_id: showing.id,
          property_address: showing.property_address,
          offer_type: 'comprehensive'
        })
        .select('id')
        .single();

      if (error) throw error;

      setOfferIntentId(data.id);
      setShowQuestionnaire(true);

      toast({
        title: "Offer Preparation Started",
        description: "Let's gather all the information needed for your offer."
      });

    } catch (error) {
      console.error('Error creating offer intent:', error);
      toast({
        title: "Error",
        description: "Failed to start offer preparation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionnaireClose = () => {
    setShowQuestionnaire(false);
    onClose();
  };

  if (showQuestionnaire && offerIntentId) {
    return (
      <OfferQuestionnaireWizard
        isOpen={showQuestionnaire}
        onClose={handleQuestionnaireClose}
        offerIntentId={offerIntentId}
        propertyAddress={showing.property_address}
        buyerId={buyerId}
        agentId={showing.assigned_agent_id}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Make an Offer - DC/Baltimore</DialogTitle>
          <p className="text-gray-600">
            Property: {showing.property_address}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Comprehensive Offer Preparation
              </CardTitle>
              <CardDescription>
                Complete step-by-step questionnaire for GCAAR/MAR compliant offers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckSquare className="w-4 h-4 text-green-600" />
                  <span>Buyer qualification review</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckSquare className="w-4 h-4 text-green-600" />
                  <span>Market analysis integration</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckSquare className="w-4 h-4 text-green-600" />
                  <span>Financing & contingencies</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckSquare className="w-4 h-4 text-green-600" />
                  <span>Agent-ready summary</span>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded border">
                <p className="text-sm text-gray-700">
                  <strong>What you'll get:</strong> A detailed, organized summary that your agent can use to quickly prepare a complete, compliant offer for the DC/Maryland market.
                </p>
              </div>

              <Button
                onClick={handleStartComprehensiveOffer}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {loading ? 'Starting...' : 'Start Comprehensive Offer Preparation'}
              </Button>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-600">
            <p>
              This process will take 10-15 minutes and ensures all necessary information is captured for your offer.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedOfferTypeDialog;
