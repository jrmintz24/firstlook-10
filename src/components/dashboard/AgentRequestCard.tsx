
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, Phone, Mail, CheckCircle, UserPlus, Eye, EyeOff, MessageCircle, AlertTriangle } from "lucide-react";
import { getStatusInfo, getEstimatedTimeline, type ShowingStatus } from "@/utils/showingStatus";
import ShowingCheckoutButton from "./ShowingCheckoutButton";
import BuyerActionIndicators from "./BuyerActionIndicators";

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
  buyer_consents_to_contact?: boolean | null;
}

interface AgentRequestCardProps {
  request: ShowingRequest;
  onAssign: () => void;
  onUpdateStatus: (status: string, estimatedDate?: string) => void;
  onSendMessage: () => void;
  onConfirm?: (request: ShowingRequest) => void;
  onReportIssue?: (request: ShowingRequest) => void;
  showAssignButton: boolean;
  onComplete?: () => void;
  currentAgentId?: string;
  buyerActions?: {
    favorited?: boolean;
    madeOffer?: boolean;
    hiredAgent?: boolean;
    scheduledMoreTours?: boolean;
    askedQuestions?: number;
    propertyRating?: number;
    agentRating?: number;
    latestAction?: string;
    actionTimestamp?: string;
  };
}

const AgentRequestCard = ({ 
  request, 
  onAssign, 
  onUpdateStatus, 
  onSendMessage, 
  onConfirm, 
  onReportIssue,
  showAssignButton,
  onComplete,
  currentAgentId,
  buyerActions
}: AgentRequestCardProps) => {
  const statusInfo = getStatusInfo(request.status as ShowingStatus);
  const timeline = getEstimatedTimeline(request.status as ShowingStatus);
  
  // Specialist can only see buyer contact info if showing is completed AND buyer consents
  const canAccessBuyerContact = request.status === 'completed' && 
    request.buyer_consents_to_contact === true && 
    request.assigned_agent_id === currentAgentId;

  // Specialist can message if assigned and showing is not cancelled
  const canMessage = request.assigned_agent_id === currentAgentId && 
    !['cancelled'].includes(request.status) &&
    request.user_id; // Make sure there's a buyer to message

  const handleMessageClick = () => {
    console.log('Message button clicked for request:', request.id);
    console.log('Can message:', canMessage);
    console.log('Current specialist ID:', currentAgentId);
    console.log('Assigned specialist ID:', request.assigned_agent_id);
    console.log('User ID:', request.user_id);
    
    if (canMessage) {
      onSendMessage();
    }
  };

  const handleReportIssue = () => {
    if (onReportIssue) {
      onReportIssue(request);
    }
  };

  const handleAcceptRequest = () => {
    if (onConfirm) {
      onConfirm(request);
    }
  };

  return (
    <Card className="group shadow-sm border border-gray-100/80 hover:shadow-lg hover:border-gray-200/80 transition-all duration-300">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Badge className={`${statusInfo.bgColor} ${statusInfo.color} border-0 text-xs`}>
                <span className="mr-1">{statusInfo.icon}</span>
                {statusInfo.label}
              </Badge>
              {request.status_updated_at && (
                <span className="text-xs text-gray-500">
                  Updated {new Date(request.status_updated_at).toLocaleDateString()}
                </span>
              )}
            </div>
            
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-purple-500 flex-shrink-0" />
              <span className="truncate">{request.property_address}</span>
            </h3>

            {/* Privacy Protection Notice */}
            {!canAccessBuyerContact && (
              <div className="bg-amber-50/80 border border-amber-200/50 p-3 rounded-lg mb-4">
                <div className="flex items-center gap-2 text-amber-700 text-sm">
                  <EyeOff className="h-4 w-4" />
                  <span className="font-medium">Buyer Contact Protected</span>
                </div>
                <div className="text-amber-600 text-xs mt-1">
                  {request.status === 'completed' 
                    ? "Contact info available only if buyer consents to work with you"
                    : showAssignButton 
                      ? "Accept this request to begin messaging with buyer"
                      : "Contact information protected until showing completion"}
                </div>
              </div>
            )}

            {/* Buyer Contact Information - Only shown if specialist has access */}
            {canAccessBuyerContact && (
              <div className="bg-green-50/80 border border-green-200/50 p-3 rounded-lg mb-4">
                <div className="text-sm font-medium text-green-800 mb-2 flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  Buyer Contact Information
                </div>
                <div className="text-green-700 text-sm">
                  Buyer has consented to share contact information with you.
                </div>
                {/* Here you would show actual buyer contact details */}
              </div>
            )}

            {/* Buyer Action Indicators for Completed Showings */}
            {request.status === 'completed' && buyerActions && (
              <div className="bg-blue-50/80 border border-blue-200/50 p-3 rounded-lg mb-4">
                <div className="text-sm font-medium text-blue-800 mb-2">
                  Buyer Post-Tour Activity
                </div>
                <BuyerActionIndicators actions={buyerActions} />
              </div>
            )}

            {/* Status Description */}
            <div className="bg-blue-50/80 border border-blue-200/50 p-3 rounded-lg mb-4">
              <div className="text-sm font-medium text-blue-800 mb-1">Current Status</div>
              <div className="text-blue-600 text-sm mb-2">{statusInfo.description}</div>
              <div className="text-blue-500 text-xs">{timeline}</div>
            </div>

            {/* Date/Time Info */}
            {request.preferred_date && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{new Date(request.preferred_date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                {request.preferred_time && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{request.preferred_time}</span>
                  </div>
                )}
              </div>
            )}

            {/* Estimated Confirmation Date */}
            {request.estimated_confirmation_date && (
              <div className="flex items-center gap-2 text-green-600 mb-3">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">
                  Expected confirmation by {new Date(request.estimated_confirmation_date).toLocaleDateString()}
                </span>
              </div>
            )}

            {/* Showing Specialist Information */}
            {request.assigned_agent_name && (
              <div className="bg-green-50/80 border border-green-200/50 p-3 rounded-lg mb-4">
                <div className="text-sm font-medium text-green-800 mb-2 flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Assigned Showing Specialist
                </div>
                <div className="text-green-700 font-medium">{request.assigned_agent_name}</div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                  {request.assigned_agent_phone && (
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <Phone className="h-3 w-3" />
                      <span>{request.assigned_agent_phone}</span>
                    </div>
                  )}
                  {request.assigned_agent_email && (
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{request.assigned_agent_email}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {request.message && (
              <div className="bg-gray-50/80 border border-gray-200/50 p-3 rounded-lg mb-4">
                <div className="text-sm font-medium text-gray-800 mb-1">Client Notes</div>
                <div className="text-gray-600 text-sm">{request.message}</div>
              </div>
            )}

            <p className="text-xs text-gray-400">
              Requested on {new Date(request.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {/* Accept & Confirm Button for pending requests */}
          {showAssignButton && request.status === 'pending' && (
            <Button
              onClick={handleAcceptRequest}
              className="bg-black hover:bg-gray-800 text-white text-sm w-full sm:w-auto"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Accept & Confirm
            </Button>
          )}

          {/* Show checkout button for active showings */}
          {!showAssignButton && ['confirmed', 'scheduled'].includes(request.status) && (
            <ShowingCheckoutButton
              showing={request}
              userType="agent"
              onComplete={onComplete}
            />
          )}

          {canMessage && (
            <Button 
              variant="outline" 
              onClick={handleMessageClick}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm w-full sm:w-auto"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Message Client
            </Button>
          )}

          {/* Report Issue button for assigned specialists who can't fulfill the showing */}
          {!showAssignButton && request.assigned_agent_id === currentAgentId && 
           ['agent_assigned', 'confirmed'].includes(request.status) && (
            <Button 
              variant="outline" 
              onClick={handleReportIssue}
              className="border-red-200 text-red-700 hover:bg-red-50 text-sm w-full sm:w-auto"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Report Issue
            </Button>
          )}

          {request.status === 'cancelled' && (
            <div className="text-xs text-gray-500 italic">
              Messaging disabled for cancelled showings
            </div>
          )}

          {!canMessage && request.assigned_agent_id === currentAgentId && request.status !== 'cancelled' && !request.user_id && (
            <div className="text-xs text-gray-500 italic">
              No buyer contact available for messaging
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentRequestCard;
