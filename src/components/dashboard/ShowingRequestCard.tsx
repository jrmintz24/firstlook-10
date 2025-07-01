
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StatusBadge from "./shared/StatusBadge";
import InteractiveButton from "./shared/InteractiveButton";
import PostShowingActions from "./PostShowingActions";
import ShowingCheckoutButton from "./ShowingCheckoutButton";
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
  Star,
  Home,
  FileText,
  AlertCircle
} from "lucide-react";
import { usePostShowingActionsTracking } from "@/hooks/usePostShowingActionsTracking";
import { useEffect } from "react";

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

interface ShowingRequestCardProps {
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
  onReportIssue?: (showing: ShowingRequest) => void;
  onSignAgreement?: (showing: ShowingRequest) => void;
}

const ShowingRequestCard = ({
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
  onReportIssue,
  onSignAgreement
}: ShowingRequestCardProps) => {
  // Auto-expand completed tours to show post-tour actions
  const [isExpanded, setIsExpanded] = useState(showing.status === 'completed');
  const { 
    fetchActionsForShowing, 
    getCompletedActions, 
    getLatestAction 
  } = usePostShowingActionsTracking();

  // Fetch post-showing actions for completed tours
  useEffect(() => {
    if (showing.status === 'completed') {
      fetchActionsForShowing(showing.id);
    }
  }, [showing.id, showing.status, fetchActionsForShowing]);

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

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'submitted':
        return { label: 'Submitted', color: 'text-blue-500' };
      case 'under_review':
        return { label: 'Under Review', color: 'text-purple-500' };
      case 'pending':
        return { label: 'Pending', color: 'text-gray-500' };
      case 'agent_assigned':
        return { label: 'Agent Assigned', color: 'text-indigo-500' };
      case 'agent_requested':
        return { label: 'Agent Requested', color: 'text-orange-500' };
      case 'agent_confirmed':
        return { label: 'Agent Confirmed', color: 'text-green-500' };
      case 'awaiting_agreement':
        return { label: 'Awaiting Agreement', color: 'text-orange-500' };
      case 'confirmed':
        return { label: 'Confirmed', color: 'text-green-500' };  
      case 'scheduled':
        return { label: 'Scheduled', color: 'text-teal-500' };
      case 'completed':
        return { label: 'Completed', color: 'text-gray-500' };
      case 'cancelled':
        return { label: 'Cancelled', color: 'text-red-500' };
      default:
        return { label: status, color: 'text-gray-500' };
    }
  };

  const completedActions = showing.status === 'completed' ? getCompletedActions(showing.id) : [];
  const latestAction = showing.status === 'completed' ? getLatestAction(showing.id) : null;

  const getActionLabel = (actionType: string): string => {
    switch (actionType) {
      case 'schedule_same_agent':
        return 'Schedule Another Tour';
      case 'schedule_different_agent':
        return 'Try Different Agent';
      case 'work_with_agent':
        return 'Work with Agent';
      case 'request_offer_assistance':
        return 'Get Offer Help';
      case 'favorite_property':
        return 'Favorited Property';
      case 'request_disclosures':
        return 'Request Disclosures';
      case 'ask_question':
        return 'Asked Question';
      case 'no_action':
        return 'No Action Taken';
      default:
        return actionType.replace(/_/g, ' ');
    }
  };

  // Enhanced agreement requirement detection
  const isAgreementRequired = () => {
    // Check if the status explicitly indicates agreement is needed
    const agreementStatuses = ['agent_confirmed', 'awaiting_agreement'];
    const statusRequiresAgreement = agreementStatuses.includes(showing.status);
    
    // Check if agreement has already been signed
    const alreadySigned = agreements[showing.id] === true;
    
    // Check if there's an assigned agent (requirement for agreement)
    const hasAssignedAgent = showing.assigned_agent_id && showing.assigned_agent_name;
    
    console.log('Agreement check:', {
      showingId: showing.id,
      status: showing.status,
      statusRequiresAgreement,
      alreadySigned,
      hasAssignedAgent,
      agreementsRecord: agreements
    });
    
    return statusRequiresAgreement && !alreadySigned && hasAssignedAgent;
  };

  const agreementRequired = isAgreementRequired();

  // Special handling for agent_requested status
  const isAgentRequestedStatus = showing.status === 'agent_requested';

  return (
    <Card className={`border ${agreementRequired ? 'border-orange-300 bg-orange-50' : isAgentRequestedStatus ? 'border-orange-300 bg-orange-50' : 'border-gray-200 bg-white'} shadow-none hover:shadow-sm transition-all duration-200`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <h3 className="font-medium text-gray-900 truncate">
                  {showing.property_address}
                </h3>
              </div>
              
              {/* Status and Date Info */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <StatusBadge 
                  status={showing.status} 
                  size="sm"
                  className="font-medium"
                />
                
                {/* Agent Requested Special Badge */}
                {isAgentRequestedStatus && userType === 'agent' && (
                  <Badge className="bg-orange-100 text-orange-800 border-orange-300 font-medium">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Waiting for Agreement
                  </Badge>
                )}
                
                {/* Agreement Required Badge - More Prominent */}
                {agreementRequired && (
                  <Badge className="bg-orange-100 text-orange-800 border-orange-300 font-medium">
                    <FileText className="w-3 h-3 mr-1" />
                    Agreement Required
                  </Badge>
                )}
                
                {showing.preferred_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(showing.preferred_date)}</span>
                    {showing.preferred_time && (
                      <span className="ml-1">at {formatTime(showing.preferred_time)}</span>
                    )}
                  </div>
                )}
                
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>Requested {formatDate(showing.created_at)}</span>
                </div>
              </div>

              {/* Show post-tour actions preview for completed tours */}
              {showing.status === 'completed' && !isExpanded && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        Post-Tour Actions Available
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsExpanded(true)}
                      className="text-blue-700 hover:text-blue-900 h-6 px-2"
                    >
                      View Actions
                    </Button>
                  </div>
                  <div className="text-xs text-blue-700 mt-1">
                    Make an offer, schedule another tour, or save to favorites
                  </div>
                </div>
              )}

              {/* Agent Requested Alert Box */}
              {isAgentRequestedStatus && userType === 'agent' && (
                <div className="mt-3 p-3 bg-orange-100 rounded-lg border border-orange-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-orange-900">
                        Tour Request Sent
                      </p>
                      <p className="text-xs text-orange-700 mt-1">
                        You've requested this tour. The buyer needs to sign the tour agreement to confirm the appointment.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Agreement Alert Box */}
              {agreementRequired && (
                <div className="mt-3 p-3 bg-orange-100 rounded-lg border border-orange-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-orange-900">
                        Tour Agreement Required
                      </p>
                      <p className="text-xs text-orange-700 mt-1">
                        Please sign the single-day tour agreement to confirm your appointment with {showing.assigned_agent_name}.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Post-Showing Action Highlight */}
              {showing.status === 'completed' && latestAction && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Post-Tour Action:
                    </span>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 border border-gray-300">
                      {getActionLabel(latestAction.action_type)}
                    </Badge>
                  </div>
                  {completedActions.length > 1 && (
                    <div className="mt-2 text-xs text-gray-600">
                      + {completedActions.length - 1} other action{completedActions.length > 2 ? 's' : ''}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {showActions && (
              <div className="flex items-center gap-2 ml-4">
                {/* Sign Agreement Button - Most Prominent */}
                {onSignAgreement && agreementRequired && (
                  <InteractiveButton
                    variant="default"
                    size="sm"
                    onClick={() => onSignAgreement(showing)}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-medium shadow-sm"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Sign Agreement
                  </InteractiveButton>
                )}

                {/* Message Button */}
                {onSendMessage && showing.assigned_agent_id && (
                  <InteractiveButton
                    variant="outline"
                    size="sm"
                    icon={MessageCircle}
                    onClick={() => onSendMessage(showing.id)}
                    className="border-gray-300"
                  >
                    Message
                  </InteractiveButton>
                )}

                {/* Expand/Collapse Button */}
                <InteractiveButton
                  variant="ghost"
                  size="sm"
                  icon={isExpanded ? ChevronUp : ChevronDown}
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {isExpanded ? 'Less' : 'More'}
                </InteractiveButton>
              </div>
            )}
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="space-y-4 pt-4 border-t border-gray-100">
              {/* Agent Info */}
              {showing.assigned_agent_name && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Agent Information</h4>
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
              
              {/* Post-Showing Actions for Completed Tours */}
              {showing.status === 'completed' && userType === 'buyer' && (
                <PostShowingActions
                  showingId={showing.id}
                  userType={userType}
                  showingStatus={showing.status}
                  agentName={showing.assigned_agent_name}
                  agentId={showing.assigned_agent_id}
                  agentEmail={showing.assigned_agent_email}
                  agentPhone={showing.assigned_agent_phone}
                  propertyAddress={showing.property_address}
                  buyerId={currentUserId || ''}
                  onActionTaken={onComplete}
                />
              )}

              {/* Action Buttons in Expanded Section */}
              {showActions && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {/* Sign Agreement Button - Also in expanded section for emphasis */}
                  {onSignAgreement && agreementRequired && (
                    <InteractiveButton
                      variant="default"
                      size="sm"
                      onClick={() => onSignAgreement(showing)}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-medium w-full sm:w-auto"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Sign Tour Agreement
                    </InteractiveButton>
                  )}

                  {/* Message Agent */}
                  {onSendMessage && showing.assigned_agent_id && (
                    <InteractiveButton
                      variant="outline"
                      size="sm"
                      icon={MessageCircle}
                      onClick={() => onSendMessage(showing.id)}
                      className="border-gray-300 w-full sm:w-auto"
                    >
                      Message Agent
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

                  {/* Show Checkout Button for Active Tours */}
                  {(['confirmed', 'scheduled', 'in_progress'].includes(showing.status)) && (
                    <ShowingCheckoutButton
                      showingId={showing.id}
                      buyerId={currentUserId}
                      showing={showing}
                      userType={userType}
                      onComplete={onComplete}
                    />
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

export default ShowingRequestCard;
