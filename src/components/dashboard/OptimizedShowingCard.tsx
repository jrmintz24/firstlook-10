
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StatusBadge from "./shared/StatusBadge";
import InteractiveButton from "./shared/InteractiveButton";
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
  AlertCircle
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
  onSignAgreement
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
    const hasAssignedAgent = showing.assigned_agent_id && showing.assigned_agent_name;
    
    return statusRequiresAgreement && !alreadySigned && hasAssignedAgent;
  };

  const agreementRequired = isAgreementRequired();
  const isAgentRequestedStatus = showing.status === 'agent_requested';

  // Get appropriate styling based on status and requirements
  const getCardStyling = () => {
    if (agreementRequired) {
      return 'border-orange-300 bg-orange-50';
    }
    if (isAgentRequestedStatus) {
      return 'border-orange-300 bg-orange-50';
    }
    return 'border-gray-200 bg-white';
  };

  return (
    <Card className={`border ${getCardStyling()} shadow-none hover:shadow-sm transition-all duration-200`}>
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
                
                {/* Agreement Required Badge */}
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
