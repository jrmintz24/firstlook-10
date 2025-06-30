
import { Clock, CheckCircle, Calendar, MessageSquare, User, Phone, MapPin, FileText, AlertCircle, X, RotateCcw } from "lucide-react";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EmptyStateCard from "./EmptyStateCard";
import SignAgreementModal from "./SignAgreementModal";

interface ShowingRequest {
  id: string;
  property_address: string;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string | null;
  status: string;
  created_at: string;
  assigned_agent_name?: string | null;
  assigned_agent_phone?: string | null;
  assigned_agent_email?: string | null;
  assigned_agent_id?: string | null;
  estimated_confirmation_date?: string | null;
  status_updated_at?: string | null;
  user_id?: string | null;
}

interface ShowingListTabProps {
  title: string;
  showings: ShowingRequest[];
  emptyIcon: React.ComponentType<any>;
  emptyTitle: string;
  emptyDescription: string;
  emptyButtonText: string;
  onRequestShowing: () => void;
  onCancelShowing: (id: string) => void;
  onRescheduleShowing: (id: string) => void;
  onConfirmShowing?: (showing: ShowingRequest) => void;
  onSendMessage: (showingId: string) => void;
  userType: "buyer" | "agent";
  currentUserId: string;
  agreements: Record<string, boolean>;
  onComplete?: () => void;
}

const ShowingListTab = ({
  title,
  showings,
  emptyIcon: EmptyIcon,
  emptyTitle,
  emptyDescription,
  emptyButtonText,
  onRequestShowing,
  onCancelShowing,
  onRescheduleShowing,
  onConfirmShowing,
  onSendMessage,
  userType,
  currentUserId,
  agreements,
  onComplete
}: ShowingListTabProps) => {
  const [showSignModal, setShowSignModal] = useState(false);
  const [selectedShowing, setSelectedShowing] = useState<ShowingRequest | null>(null);

  const handleSignAgreement = (showing: ShowingRequest) => {
    setSelectedShowing(showing);
    setShowSignModal(true);
  };

  const handleAgreementSign = async (signerName: string) => {
    if (!selectedShowing) return;

    try {
      // Call the sign agreement handler from the parent
      if (onConfirmShowing) {
        onConfirmShowing(selectedShowing);
      }
      setShowSignModal(false);
      setSelectedShowing(null);
    } catch (error) {
      console.error('Error signing agreement:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="border-orange-500 text-orange-500">Pending</Badge>;
      case "confirmed":
        return <Badge variant="outline" className="border-green-500 text-green-500">Confirmed</Badge>;
      case "awaiting_agreement":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Agreement Required</Badge>;
      case "completed":
        return <Badge variant="outline" className="border-gray-500 text-gray-500">Completed</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="border-red-500 text-red-500">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (showings.length === 0) {
    return (
      <EmptyStateCard
        icon={EmptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        buttonText={emptyButtonText}
        onButtonClick={onRequestShowing}
      />
    );
  }

  return (
    <>
      <div className="space-y-4">
        {title && <h2 className="text-xl font-semibold">{title}</h2>}
        
        {showings.map((showing) => {
          const isAgreementSigned = agreements[showing.id];
          const needsAgreement = showing.status === "awaiting_agreement" && !isAgreementSigned;
          
          return (
            <Card key={showing.id} className="border rounded-lg">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-purple-500" />
                      {showing.property_address}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(showing.status)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Tour Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {showing.preferred_date && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="h-4 w-4 text-purple-500" />
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
                      <Clock className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">{showing.preferred_time}</span>
                    </div>
                  )}
                </div>

                {/* Agent Details */}
                {showing.assigned_agent_name && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-purple-500" />
                      <span className="font-medium text-gray-900">Agent: {showing.assigned_agent_name}</span>
                    </div>
                    {showing.assigned_agent_phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-3 w-3" />
                        <span>{showing.assigned_agent_phone}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Agreement Required Notice */}
                {needsAgreement && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Tour Agreement Required</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Please sign the tour agreement to confirm your showing appointment.
                    </p>
                  </div>
                )}

                {/* Message */}
                {showing.message && (
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    <strong>Message:</strong> {showing.message}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap pt-2">
                  {userType === "buyer" && (
                    <>
                      {needsAgreement && (
                        <Button
                          onClick={() => handleSignAgreement(showing)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          size="sm"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Sign Agreement
                        </Button>
                      )}
                      
                      {showing.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => onRescheduleShowing(showing.id)}
                            size="sm"
                          >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Reschedule
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => onCancelShowing(showing.id)}
                            size="sm"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </>
                      )}
                      
                      {showing.assigned_agent_name && (
                        <Button
                          variant="outline"
                          onClick={() => onSendMessage(showing.id)}
                          size="sm"
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message Agent
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Sign Agreement Modal */}
      {showSignModal && selectedShowing && (
        <SignAgreementModal
          isOpen={showSignModal}
          onClose={() => {
            setShowSignModal(false);
            setSelectedShowing(null);
          }}
          onSign={handleAgreementSign}
          showingDetails={{
            propertyAddress: selectedShowing.property_address,
            date: selectedShowing.preferred_date,
            time: selectedShowing.preferred_time,
            agentName: selectedShowing.assigned_agent_name
          }}
        />
      )}
    </>
  );
};

export default ShowingListTab;
