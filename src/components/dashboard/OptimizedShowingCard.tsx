
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StatusBadge from "./shared/StatusBadge";
import InteractiveButton from "./shared/InteractiveButton";
import PostShowingActionsPanel from "@/components/post-showing/PostShowingActionsPanel";
import ShowingCheckoutButton from "./ShowingCheckoutButton";
import ShowingSpecialistCard from "./ShowingSpecialistCard";
import { 
  Calendar,
  Clock,
  MessageCircle,
  MapPin,
  User,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

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

interface OptimizedShowingCardProps {
  showing: ShowingRequest;
  onCancel: (id: string) => void;
  onReschedule: (id: string) => void;
  onConfirm?: (id: string) => void;
  onComplete?: () => void;
  currentUserId?: string;
  onSendMessage?: (showingId: string) => void;
  agreements?: Record<string, boolean>;
  userType?: 'buyer' | 'agent';
  showActions?: boolean;
  onSignAgreement?: (showing: ShowingRequest) => void;
  onRequestShowing?: () => void;
}

const OptimizedShowingCard = ({
  showing,
  onCancel,
  onReschedule,
  onConfirm,
  onComplete,
  currentUserId,
  onSendMessage,
  agreements = {},
  userType = 'buyer',
  showActions = true,
  onSignAgreement,
  onRequestShowing
}: OptimizedShowingCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
  
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Enhanced agreement requirement detection
  const isAgreementRequired = () => {
    const agreementStatuses = ['agent_confirmed', 'awaiting_agreement'];
    const statusRequiresAgreement = agreementStatuses.includes(showing.status);
    const alreadySigned = agreements[showing.id] === true;
    const hasAssignedSpecialist = showing.assigned_agent_id && showing.assigned_agent_name;
    
    return statusRequiresAgreement && !alreadySigned && hasAssignedSpecialist;
  };

  const agreementRequired = isAgreementRequired();
  const isSpecialistRequestedStatus = showing.status === 'agent_requested';
  const isCompletedTour = showing.status === 'completed';
  const isConfirmedTour = ['confirmed', 'scheduled', 'in_progress'].includes(showing.status);
  const isAwaitingAgreement = showing.status === 'awaiting_agreement';

  // Get appropriate styling based on status and requirements
  const getCardStyling = () => {
    if (agreementRequired || isAwaitingAgreement) {
      return 'border-orange-300 bg-orange-50';
    }
    if (isSpecialistRequestedStatus) {
      return 'border-orange-300 bg-orange-50';
    }
    if (isCompletedTour) {
      return 'border-green-200 bg-green-50';
    }
    if (isConfirmedTour) {
      return 'border-blue-200 bg-blue-50';
    }
    return 'border-gray-200 bg-white';
  };

  const handleMessageSpecialist = () => {
    if (onSendMessage) {
      onSendMessage(showing.id);
    }
  };

  return (
    <Card className={`border ${getCardStyling()} shadow-none hover:shadow-sm transition-all duration-200`}>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-2">
                <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                <h3 className="font-medium text-gray-900 text-sm sm:text-base leading-tight">
                  {showing.property_address}
                </h3>
              </div>
              
              {/* Mobile-optimized Status Row */}
              <div className="space-y-2">
                {/* Primary Status - Always Visible */}
                <div className="flex items-center gap-2">
                  <StatusBadge 
                    status={showing.status} 
                    size="sm"
                    className="font-medium"
                  />
                  
                  {/* Only show additional context for non-awaiting-agreement statuses */}
                  {!isAwaitingAgreement && agreementRequired && (
                    <Badge className="bg-orange-100 text-orange-800 border-orange-300 font-medium text-xs">
                      <FileText className="w-3 h-3 mr-1" />
                      <span className="hidden xs:inline">Agreement Required</span>
                      <span className="xs:hidden">Agreement</span>
                    </Badge>
                  )}
                </div>
                
                {/* Secondary Info - Mobile Stacked */}
                <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-3 text-xs sm:text-sm text-gray-600">
                  {showing.preferred_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">
                        {formatDate(showing.preferred_date)}
                        {showing.preferred_time && (
                          <span className="ml-1">at {formatTime(showing.preferred_time)}</span>
                        )}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">Requested {formatDate(showing.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Streamlined Agreement Alert Box */}
              {agreementRequired && (
                <div className="mt-3 p-3 bg-orange-100 rounded-lg border border-orange-200">
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-orange-900 mb-1">
                        Ready to Sign Tour Agreement
                      </p>
                      <p className="text-xs text-orange-700 leading-relaxed">
                        {showing.assigned_agent_name} has confirmed your tour. Sign the agreement to finalize your appointment.
                      </p>
                      {/* Mobile-friendly Sign Button */}
                      {onSignAgreement && (
                        <Button
                          onClick={() => onSignAgreement(showing)}
                          className="mt-2 w-full xs:w-auto bg-orange-600 hover:bg-orange-700 text-white text-sm h-8 px-3"
                          size="sm"
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Sign Agreement
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tour Ready Alert Box for Confirmed Tours */}
              {isConfirmedTour && userType === 'buyer' && (
                <div className="mt-3 p-3 bg-blue-100 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        Tour Confirmed
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        Your tour is confirmed with {showing.assigned_agent_name}. Complete the tour when you're ready to start the post-showing process.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Compact Action Buttons */}
            {showActions && (
              <div className="flex items-start gap-1 ml-2">
                {/* Message Button - Only if agent assigned and not awaiting agreement */}
                {onSendMessage && showing.assigned_agent_id && !agreementRequired && (
                  <InteractiveButton
                    variant="outline"
                    size="sm"
                    icon={MessageCircle}
                    onClick={() => onSendMessage(showing.id)}
                    className="border-gray-300 h-8 px-2"
                  >
                    <span className="hidden xs:inline ml-1">Message</span>
                  </InteractiveButton>
                )}

                {/* Expand/Collapse Button */}
                <InteractiveButton
                  variant="ghost"
                  size="sm"
                  icon={isExpanded ? ChevronUp : ChevronDown}
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-gray-500 hover:text-gray-700 h-8 px-2"
                >
                  <span className="hidden xs:inline ml-1">{isExpanded ? 'Less' : 'More'}</span>
                </InteractiveButton>
              </div>
            )}
          </div>

          {/* Enhanced Showing Specialist Card for Confirmed Tours */}
          {isConfirmedTour && showing.assigned_agent_name && (
            <div className="mt-4">
              <ShowingSpecialistCard
                specialistName={showing.assigned_agent_name}
                specialistPhone={showing.assigned_agent_phone || undefined}
                specialistEmail={showing.assigned_agent_email || undefined}
                specialistId={showing.assigned_agent_id || undefined}
                onMessageClick={handleMessageSpecialist}
              />
            </div>
          )}

          {/* Complete Tour Button for Confirmed Tours - Prominent Placement */}
          {isConfirmedTour && userType === 'buyer' && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Ready to Complete Tour?</h4>
                  <p className="text-sm text-blue-700">
                    Complete your tour to share feedback and explore next steps.
                  </p>
                </div>
                <ShowingCheckoutButton
                  showing={showing}
                  showingId={showing.id}
                  buyerId={showing.user_id || currentUserId}
                  userType={userType}
                  onComplete={onComplete}
                />
              </div>
            </div>
          )}

          {/* Post-Showing Actions for Completed Tours */}
          {isCompletedTour && userType === 'buyer' && (
            <div className="mt-4">
              <PostShowingActionsPanel
                showingId={showing.id}
                buyerId={showing.user_id || currentUserId || ''}
                agentId={showing.assigned_agent_id}
                agentName={showing.assigned_agent_name}
                agentEmail={showing.assigned_agent_email}
                agentPhone={showing.assigned_agent_phone}
                propertyAddress={showing.property_address}
                onRequestShowing={onRequestShowing}
              />
            </div>
          )}

          {/* Expanded Content */}
          {isExpanded && (
            <div className="space-y-4 pt-4 border-t border-gray-100">
              {/* Showing Specialist Info for Non-Confirmed Tours */}
              {!isConfirmedTour && showing.assigned_agent_name && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Showing Specialist Information</h4>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{showing.assigned_agent_name}</span>
                  </div>
                  {showing.assigned_agent_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <a href={`tel:${showing.assigned_agent_phone}`} className="text-sm text-blue-600 hover:underline">
                        {showing.assigned_agent_phone}
                      </a>
                    </div>
                  )}
                  {showing.assigned_agent_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <a href={`mailto:${showing.assigned_agent_email}`} className="text-sm text-blue-600 hover:underline">
                        {showing.assigned_agent_email}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons in Expanded Section - Only for Non-Completed Tours */}
              {showActions && !isCompletedTour && !isConfirmedTour && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {/* Message Specialist */}
                  {onSendMessage && showing.assigned_agent_id && (
                    <InteractiveButton
                      variant="outline"
                      size="sm"
                      icon={MessageCircle}
                      onClick={() => onSendMessage(showing.id)}
                      className="border-gray-300 w-full sm:w-auto"
                    >
                      Message Specialist
                    </InteractiveButton>
                  )}

                  {/* Cancel Button */}
                  {onCancel && showing.status !== 'completed' && (
                    <InteractiveButton
                      variant="destructive"
                      size="sm"
                      onClick={() => onCancel(showing.id)}
                    >
                      Cancel
                    </InteractiveButton>
                  )}

                  {/* Reschedule Button */}
                  {onReschedule && showing.status !== 'completed' && (
                    <InteractiveButton
                      variant="secondary"
                      size="sm"
                      onClick={() => onReschedule(showing.id)}
                      className="border-gray-300"
                    >
                      Reschedule
                    </InteractiveButton>
                  )}
                  
                  {/* Confirm Button */}
                  {onConfirm && showing.status === 'agent_confirmed' && (
                    <InteractiveButton
                      variant="default"
                      size="sm"
                      onClick={() => onConfirm(showing.id)}
                    >
                      Confirm Tour
                    </InteractiveButton>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizedShowingCard;
