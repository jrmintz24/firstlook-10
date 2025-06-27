import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, Phone, FileText, CheckCircle } from "lucide-react";
import { useState } from "react";
import SignAgreementModal from "./SignAgreementModal";

interface TourAgreement {
  id: string;
  showing_request_id: string;
  signed: boolean;
  signed_at: string | null;
  agreement_type: string;
  created_at: string;
}

interface ShowingWithAgreement {
  id: string;
  property_address: string;
  preferred_date: string | null;
  preferred_time: string | null;
  status: string;
  assigned_agent_name: string | null;
  assigned_agent_phone: string | null;
  tour_agreement: TourAgreement | null;
}

interface AgreementSigningCardProps {
  showing: ShowingWithAgreement;
  onSign: (showingId: string, signerName: string) => Promise<boolean>;
}

const AgreementSigningCard = ({ showing, onSign }: AgreementSigningCardProps) => {
  const [showSignModal, setShowSignModal] = useState(false);

  const handleSignAgreement = async (signerName: string) => {
    const success = await onSign(showing.id, signerName);
    if (success) {
      setShowSignModal(false);
    }
  };

  return (
    <>
      <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-600" />
              <Badge className="bg-orange-100 text-orange-800 border-orange-300">
                Agreement Required
              </Badge>
            </div>
            {showing.tour_agreement?.signed && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Signed</span>
              </div>
            )}
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-orange-600" />
            {showing.property_address}
          </h3>

          <div className="bg-white/60 p-4 rounded-lg border border-orange-200/50 mb-4">
            <h4 className="font-semibold text-orange-900 mb-3">Tour Details</h4>
            
            <div className="space-y-2">
              {showing.preferred_date && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  <span className="font-medium">
                    {new Date(showing.preferred_date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              )}
              
              {showing.preferred_time && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="font-medium">{showing.preferred_time}</span>
                </div>
              )}

              {showing.assigned_agent_name && (
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="h-4 w-4 text-orange-500" />
                  <span className="font-medium">{showing.assigned_agent_name}</span>
                  {showing.assigned_agent_phone && (
                    <div className="flex items-center gap-1 ml-2">
                      <Phone className="h-3 w-3" />
                      <span className="text-sm">{showing.assigned_agent_phone}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-4">
            <p className="text-blue-800 text-sm">
              <strong>Next Step:</strong> Please sign the single-day non-exclusive tour agreement to finalize your appointment. 
              This agreement allows you to tour the property with our agent and is valid for this tour only.
            </p>
          </div>

          {!showing.tour_agreement?.signed && (
            <Button
              onClick={() => setShowSignModal(true)}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-lg shadow-sm"
            >
              <FileText className="h-4 w-4 mr-2" />
              Sign Tour Agreement
            </Button>
          )}
        </CardContent>
      </Card>

      <SignAgreementModal
        isOpen={showSignModal}
        onClose={() => setShowSignModal(false)}
        onSign={handleSignAgreement}
        showingDetails={{
          propertyAddress: showing.property_address,
          date: showing.preferred_date,
          time: showing.preferred_time,
          agentName: showing.assigned_agent_name
        }}
      />
    </>
  );
};

export default AgreementSigningCard;
