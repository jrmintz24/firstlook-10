
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, User, FileText, MessageCircle, ExternalLink, Clock, Video, CheckCircle, XCircle, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import OfferStatusTracker from '../offer-workflow/OfferStatusTracker';
import DocumentUploadManager from '../offer-workflow/DocumentUploadManager';
import ConsultationActions from '../offer-workflow/ConsultationActions';

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
  buyerId: string;
  userType?: 'buyer' | 'agent';
  currentUserId?: string;
}

const OfferDetailModal = ({ offer, isOpen, onClose, onUpdate, buyerId, userType = 'buyer', currentUserId }: OfferDetailModalProps) => {
  const { toast } = useToast();
  const [consultationBooking, setConsultationBooking] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [agentNotes, setAgentNotes] = useState('');
  const [documentsRef, setDocumentsRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (offer.id && offer.consultation_scheduled_at) {
      fetchConsultationBooking();
    }
  }, [offer.id, offer.consultation_scheduled_at]);

  const fetchConsultationBooking = async () => {
    try {
      const { data, error } = await supabase
        .from('consultation_bookings')
        .select('*')
        .eq('offer_intent_id', offer.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching consultation booking:', error);
        return;
      }

      if (data) {
        setConsultationBooking(data);
        setMeetingLink(data.meeting_link || '');
        setAgentNotes(data.agent_notes || '');
      }
    } catch (error) {
      console.error('Error fetching consultation booking:', error);
    }
  };

  const scheduleConsultation = async () => {
    if (!scheduleDate || !scheduleTime) {
      toast({
        title: "Error",
        description: "Please select both date and time for the consultation.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
      
      const { data, error } = await supabase
        .from('consultation_bookings')
        .insert({
          offer_intent_id: offer.id,
          agent_id: offer.agent_id,
          buyer_id: buyerId,
          scheduled_at: scheduledDateTime.toISOString(),
          duration_minutes: 30,
          status: 'scheduled',
          meeting_link: meetingLink,
          agent_notes: agentNotes
        })
        .select()
        .single();

      if (error) throw error;

      // Update offer intent with consultation scheduled timestamp
      await supabase
        .from('offer_intents')
        .update({ consultation_scheduled_at: scheduledDateTime.toISOString() })
        .eq('id', offer.id);

      setConsultationBooking(data);
      onUpdate();
      
      toast({
        title: "Success",
        description: "Consultation scheduled successfully!",
      });
    } catch (error) {
      console.error('Error scheduling consultation:', error);
      toast({
        title: "Error",
        description: "Failed to schedule consultation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateConsultation = async (status: string) => {
    if (!consultationBooking) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('consultation_bookings')
        .update({
          status,
          meeting_link: meetingLink,
          agent_notes: agentNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', consultationBooking.id);

      if (error) throw error;

      await fetchConsultationBooking();
      onUpdate();
      
      toast({
        title: "Success",
        description: `Consultation ${status} successfully!`,
      });
    } catch (error) {
      console.error('Error updating consultation:', error);
      toast({
        title: "Error",
        description: "Failed to update consultation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getOfferStatus = () => {
    if (offer.agent_summary_generated_at) return 'ready';
    if (offer.questionnaire_completed_at) return 'under_review';
    // Check if consultation is completed
    if (consultationBooking?.status === 'completed') return 'consultation_completed';
    if (offer.consultation_scheduled_at || consultationBooking?.status === 'scheduled') return 'consultation_scheduled';
    if (offer.consultation_requested) return 'consultation_requested';
    return 'in_progress';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'consultation_completed': return 'bg-emerald-100 text-emerald-800';
      case 'consultation_scheduled': return 'bg-purple-100 text-purple-800';
      case 'consultation_requested': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready': return 'Ready for Submission';
      case 'under_review': return 'Under Review';
      case 'consultation_completed': return 'Consultation Completed';
      case 'consultation_scheduled': return 'Consultation Scheduled';
      case 'consultation_requested': return 'Consultation Requested';
      default: return 'In Progress';
    }
  };


  const scrollToDocuments = () => {
    if (documentsRef) {
      documentsRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const status = getOfferStatus();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
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

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
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

          {/* Consultation Management */}
          {status === 'consultation_requested' && !consultationBooking && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Schedule Consultation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  The buyer has requested a consultation. Please schedule a meeting to discuss their offer.
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <Input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <Input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Link (Optional)</label>
                  <Input
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="https://zoom.us/j/..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <Textarea
                    value={agentNotes}
                    onChange={(e) => setAgentNotes(e.target.value)}
                    placeholder="Add notes about this consultation..."
                    rows={2}
                  />
                </div>
                
                <Button 
                  onClick={scheduleConsultation}
                  disabled={loading || !scheduleDate || !scheduleTime}
                  className="w-full"
                >
                  {loading ? 'Scheduling...' : 'Schedule Consultation'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Existing Consultation Details */}
          {consultationBooking && (
            <ConsultationActions
              consultation={consultationBooking}
              userType={userType}
              onUpdate={() => {
                fetchConsultationBooking();
                onUpdate();
              }}
            />
          )}

          {/* Offer Status Tracker */}
          <OfferStatusTracker
            offerIntentId={offer.id}
            buyerId={buyerId}
            agentId={offer.agent_id}
            onStatusUpdate={onUpdate}
          />

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

          {/* Document Upload Section - Always Available */}
          <div ref={setDocumentsRef} className="min-h-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Upload className="h-5 w-5 text-blue-600" />
                  Documents & Requirements
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Upload supporting documents for your offer. Required documents will be marked clearly.
                </p>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                <DocumentUploadManager
                  offerIntentId={offer.id}
                  buyerId={buyerId}
                  agentId={offer.agent_id}
                  onDocumentUploaded={onUpdate}
                />
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Buyer Actions */}
            {userType === 'buyer' && offer.agent_id && (
              <Button variant="outline" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Message Agent
              </Button>
            )}

            {/* Agent Actions */}
            {userType === 'agent' && (
              <>
                
                {status === 'ready' && (
                  <Button className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Submit Offer
                  </Button>
                )}
                
                <Button variant="outline" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Message Buyer
                </Button>
              </>
            )}

            {/* Common Actions - Document Upload Always Available */}
            <Button variant="outline" className="flex items-center gap-2" onClick={scrollToDocuments}>
              <Upload className="w-4 h-4" />
              Upload Documents
            </Button>
            
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
