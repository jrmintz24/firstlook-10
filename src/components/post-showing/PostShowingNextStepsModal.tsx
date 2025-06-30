
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, FileText, MessageSquare, Star, Building } from "lucide-react";
import FavoritePropertyModal from "./FavoritePropertyModal";
import EnhancedOfferTypeDialog from "./EnhancedOfferTypeDialog";
import AgentProfileModal from "./AgentProfileModal";

interface PostShowingNextStepsModalProps {
  isOpen: boolean;
  onClose: () => void;
  showing: {
    id: string;
    property_address: string;
    assigned_agent_name?: string;
    assigned_agent_id?: string;
    assigned_agent_email?: string;
    assigned_agent_phone?: string;
  };
  buyerId: string;
}

const PostShowingNextStepsModal = ({
  isOpen,
  onClose,
  showing,
  buyerId
}: PostShowingNextStepsModalProps) => {
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [showAgentProfile, setShowAgentProfile] = useState(false);

  const handleFavoriteComplete = async (notes?: string) => {
    // Handle favorite save logic here
    console.log('Saving favorite with notes:', notes);
    setShowFavoriteModal(false);
  };

  const handleOfferComplete = () => {
    setShowOfferDialog(false);
  };

  const handleAgentProfileClose = () => {
    setShowAgentProfile(false);
  };

  const handleConfirmHire = () => {
    // Handle agent hiring logic here
    console.log('Confirming agent hire');
    setShowAgentProfile(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>What's Next?</DialogTitle>
            <p className="text-gray-600">
              Choose your next steps for {showing.property_address}
            </p>
          </DialogHeader>

          <div className="space-y-4">
            {/* Make an Offer */}
            <Card className="border-2 border-green-200 bg-green-50 hover:bg-green-100 transition-colors cursor-pointer"
                  onClick={() => setShowOfferDialog(true)}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    Make an Offer
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Recommended
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-3">
                  Start the comprehensive offer preparation process. We'll guide you through all the details needed for a competitive, compliant offer in the DC/Maryland market.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">GCAAR/MAR Compliant</Badge>
                  <Badge variant="outline" className="text-xs">Market Analysis</Badge>
                  <Badge variant="outline" className="text-xs">Agent-Ready</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Save as Favorite */}
            <Card className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setShowFavoriteModal(true)}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Save as Favorite
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  Keep this property in your favorites list to compare with others and come back to later.
                </p>
              </CardContent>
            </Card>

            {/* Connect with Agent */}
            {showing.assigned_agent_name && (
              <Card className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setShowAgentProfile(true)}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-blue-500" />
                    Work with {showing.assigned_agent_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">
                    Connect with your showing agent for ongoing representation and additional properties.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Maybe Later */}
            <div className="text-center pt-4">
              <Button variant="outline" onClick={onClose}>
                I'll decide later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modals */}
      <FavoritePropertyModal
        isOpen={showFavoriteModal}
        onClose={() => setShowFavoriteModal(false)}
        onSave={handleFavoriteComplete}
        propertyAddress={showing.property_address}
      />

      <EnhancedOfferTypeDialog
        isOpen={showOfferDialog}
        onClose={() => setShowOfferDialog(false)}
        showing={showing}
        buyerId={buyerId}
      />

      {showing.assigned_agent_name && (
        <AgentProfileModal
          isOpen={showAgentProfile}
          onClose={handleAgentProfileClose}
          onConfirmHire={handleConfirmHire}
          agentName={showing.assigned_agent_name}
          agentEmail={showing.assigned_agent_email}
          agentPhone={showing.assigned_agent_phone}
        />
      )}
    </>
  );
};

export default PostShowingNextStepsModal;
