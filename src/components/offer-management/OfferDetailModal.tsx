
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, FileText, MessageCircle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OfferIntent {
  id: string;
  property_address: string;
  offer_type: string;
  created_at: string;
  agent_id?: string;
  consultation_scheduled_at?: string;
  questionnaire_completed_at?: string;
  agent_summary_generated_at?: string;
  consultation_requested: boolean;
  buyer_qualification?: any;
  financing_details?: any;
  contingencies?: any;
  additional_terms?: any;
}

interface OfferDetailModalProps {
  offer: OfferIntent;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const OfferDetailModal = ({ offer, isOpen, onClose, onUpdate }: OfferDetailModalProps) => {
  const navigate = useNavigate();

  const getOfferStatus = () => {
    if (offer.agent_summary_generated_at) return 'ready';
    if (offer.questionnaire_completed_at) return 'under_review';
    if (offer.consultation_scheduled_at) return 'consultation_scheduled';
    if (offer.consultation_requested) return 'consultation_requested';
    return 'in_progress';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'consultation_scheduled': return 'bg-purple-100 text-purple-800';
      case 'consultation_requested': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready': return 'Ready for Submission';
      case 'under_review': return 'Under Review';
      case 'consultation_scheduled': return 'Consultation Scheduled';
      case 'consultation_requested': return 'Consultation Requested';
      default: return 'In Progress';
    }
  };

  const handleContinueQuestionnaire = () => {
    navigate(`/offer-questionnaire?property=${encodeURIComponent(offer.property_address)}&agent=${offer.agent_id || ''}`);
    onClose();
  };

  const status = getOfferStatus();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{offer.property_address}</DialogTitle>
              <p className="text-sm text-gray-600 mt-1 capitalize">
                {offer.offer_type?.replace('_', ' ') || 'Standard Offer'}
              </p>
            </div>
            <Badge className={getStatusColor(status)}>
              {getStatusText(status)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Offer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>Created: {new Date(offer.created_at).toLocaleDateString()}</span>
              </div>
              {offer.agent_id && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>Agent Assigned</span>
                </div>
              )}
              {offer.consultation_scheduled_at && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>Consultation: {new Date(offer.consultation_scheduled_at).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Questionnaire Started</span>
                  <Badge variant="outline" className="text-green-600 border-green-200">Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Questionnaire Completed</span>
                  <Badge variant={offer.questionnaire_completed_at ? "outline" : "secondary"} 
                         className={offer.questionnaire_completed_at ? "text-green-600 border-green-200" : ""}>
                    {offer.questionnaire_completed_at ? "Complete" : "Pending"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Agent Review</span>
                  <Badge variant={offer.agent_summary_generated_at ? "outline" : "secondary"}
                         className={offer.agent_summary_generated_at ? "text-green-600 border-green-200" : ""}>
                    {offer.agent_summary_generated_at ? "Complete" : "Pending"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Info */}
          {(offer.buyer_qualification || offer.financing_details) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Offer Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {offer.financing_details?.loan_type && (
                    <div>
                      <span className="font-medium">Financing: </span>
                      <span className="capitalize">{offer.financing_details.loan_type}</span>
                    </div>
                  )}
                  {offer.buyer_qualification?.pre_approval_amount && (
                    <div>
                      <span className="font-medium">Pre-approval: </span>
                      <span>${offer.buyer_qualification.pre_approval_amount.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex items-center gap-3">
            {!offer.questionnaire_completed_at && (
              <Button onClick={handleContinueQuestionnaire} className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Continue Questionnaire
              </Button>
            )}
            
            {offer.agent_id && (
              <Button variant="outline" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Message Agent
              </Button>
            )}

            {status === 'ready' && (
              <Button variant="outline" className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                View Documents
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OfferDetailModal;
