
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText, User, Eye, Upload, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ProposalCardProps {
  proposal: {
    id: string;
    property_address: string;
    buyer_id: string;
    agent_id: string;
    created_at: string;
    consultation_requested: boolean;
    consultation_scheduled_at: string | null;
    questionnaire_completed_at: string | null;
    agent_summary_generated_at: string | null;
    offer_type: string | null;
    consultation_type: string | null;
    property_details: any;
    financing_details: any;
    contingencies: any;
  };
  buyerName?: string;
  onViewQuestionnaire: (proposalId: string) => void;
  onScheduleConsultation: (proposalId: string) => void;
  onUploadOffer: (proposalId: string) => void;
  onUpdateStatus: (proposalId: string, status: string) => void;
}

const ProposalCard = ({
  proposal,
  buyerName,
  onViewQuestionnaire,
  onScheduleConsultation,
  onUploadOffer,
  onUpdateStatus
}: ProposalCardProps) => {
  
  const getStatusInfo = () => {
    if (!proposal.questionnaire_completed_at) {
      return {
        status: 'Questionnaire Pending',
        color: 'bg-gray-100 text-gray-700',
        description: 'Buyer has not completed the offer questionnaire yet'
      };
    }
    
    if (proposal.consultation_requested && !proposal.consultation_scheduled_at) {
      return {
        status: 'Consultation Requested',
        color: 'bg-yellow-100 text-yellow-700',
        description: 'Buyer has requested a consultation'
      };
    }
    
    if (proposal.consultation_scheduled_at && new Date(proposal.consultation_scheduled_at) > new Date()) {
      return {
        status: 'Consultation Scheduled',
        color: 'bg-blue-100 text-blue-700',
        description: 'Consultation meeting is scheduled'
      };
    }
    
    if (proposal.consultation_scheduled_at && new Date(proposal.consultation_scheduled_at) <= new Date() && !proposal.agent_summary_generated_at) {
      return {
        status: 'In Progress',
        color: 'bg-purple-100 text-purple-700',
        description: 'Working on offer preparation'
      };
    }
    
    if (proposal.agent_summary_generated_at) {
      return {
        status: 'Ready for Review',
        color: 'bg-green-100 text-green-700',
        description: 'Offer prepared and ready for buyer review'
      };
    }
    
    return {
      status: 'New Request',
      color: 'bg-orange-100 text-orange-700',
      description: 'New offer request from buyer'
    };
  };

  const statusInfo = getStatusInfo();
  const canScheduleConsultation = proposal.consultation_requested && !proposal.consultation_scheduled_at;
  const canUploadOffer = proposal.consultation_scheduled_at && new Date(proposal.consultation_scheduled_at) <= new Date();

  return (
    <Card className="group shadow-sm border border-gray-100/80 hover:shadow-lg hover:border-gray-200/80 transition-all duration-300">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Badge className={`${statusInfo.color} border-0 text-xs`}>
                {statusInfo.status}
              </Badge>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(proposal.created_at), { addSuffix: true })}
              </span>
            </div>
            
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <span className="truncate">{proposal.property_address}</span>
            </h3>

            {/* Status Description */}
            <div className="bg-blue-50/80 border border-blue-200/50 p-3 rounded-lg mb-4">
              <div className="text-sm font-medium text-blue-800 mb-1">Status</div>
              <div className="text-blue-600 text-sm">{statusInfo.description}</div>
            </div>

            {/* Buyer Information */}
            {buyerName && (
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <User className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm font-medium">{buyerName}</span>
              </div>
            )}

            {/* Offer Details */}
            {proposal.offer_type && (
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <span className="text-sm">
                  <strong>Offer Type:</strong> {proposal.offer_type}
                </span>
              </div>
            )}

            {/* Consultation Info */}
            {proposal.consultation_scheduled_at && (
              <div className="flex items-center gap-2 text-green-600 mb-3">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">
                  Consultation: {new Date(proposal.consultation_scheduled_at).toLocaleDateString()} at{' '}
                  {new Date(proposal.consultation_scheduled_at).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {/* View Questionnaire - Always available if completed */}
          {proposal.questionnaire_completed_at && (
            <Button
              onClick={() => onViewQuestionnaire(proposal.id)}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm w-full sm:w-auto"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Form
            </Button>
          )}

          {/* Schedule Consultation */}
          {canScheduleConsultation && (
            <Button
              onClick={() => onScheduleConsultation(proposal.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm w-full sm:w-auto"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Call
            </Button>
          )}

          {/* Upload Offer */}
          {canUploadOffer && (
            <Button
              onClick={() => onUploadOffer(proposal.id)}
              className="bg-green-600 hover:bg-green-700 text-white text-sm w-full sm:w-auto"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Offer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProposalCard;
