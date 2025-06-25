
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertTriangle, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ShowingRequest {
  id: string;
  property_address: string;
  preferred_date: string | null;
  preferred_time: string | null;
  user_id?: string | null;
}

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ShowingRequest;
  agentId: string;
  onComplete?: () => void;
}

const ReportIssueModal = ({ 
  isOpen, 
  onClose, 
  request, 
  agentId, 
  onComplete 
}: ReportIssueModalProps) => {
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const issueOptions = [
    { value: 'property_access', label: 'Cannot access property (keys, lockbox, etc.)' },
    { value: 'property_condition', label: 'Property condition issues' },
    { value: 'scheduling_conflict', label: 'Scheduling conflict with property owner/listing agent' },
    { value: 'safety_concern', label: 'Safety or security concerns' },
    { value: 'other', label: 'Other issue' }
  ];

  const handleSubmit = async () => {
    if (!issueType || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select an issue type and provide a description.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Add internal notes to the showing request
      const { error: updateError } = await supabase
        .from('showing_requests')
        .update({
          internal_notes: `Agent Issue Report: ${issueOptions.find(opt => opt.value === issueType)?.label}\n\nDetails: ${description}`,
          status: 'needs_admin_review'
        })
        .eq('id', request.id);

      if (updateError) throw updateError;

      // Send a message to notify about the issue
      if (request.user_id) {
        const { error: messageError } = await supabase
          .from('messages')
          .insert({
            showing_request_id: request.id,
            sender_id: agentId,
            receiver_id: request.user_id,
            content: `I've encountered an issue with your showing at ${request.property_address}. Our team has been notified and will contact you shortly to resolve this and reschedule if needed.`
          });

        if (messageError) {
          console.error('Error sending notification message:', messageError);
        }
      }

      toast({
        title: "Issue Reported",
        description: "Your report has been submitted. Our team will review and contact the buyer to resolve this issue.",
      });

      onClose();
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error reporting issue:', error);
      toast({
        title: "Error",
        description: "Failed to submit issue report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Report Showing Issue
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-medium text-gray-800">{request.property_address}</p>
            <p className="text-sm text-gray-600">
              Scheduled: {request.preferred_date} at {request.preferred_time}
            </p>
          </div>

          <div>
            <Label className="text-base font-medium">What type of issue are you experiencing?</Label>
            <RadioGroup value={issueType} onValueChange={setIssueType} className="mt-2">
              {issueOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="text-sm font-normal cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="description" className="text-base font-medium">
              Please describe the issue in detail
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide specific details about the issue you're experiencing..."
              rows={4}
              className="mt-2"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800 mb-2">
              <MessageSquare className="h-4 w-4" />
              <span className="font-medium">What happens next?</span>
            </div>
            <div className="text-blue-700 text-sm">
              • Your report will be reviewed by our team immediately
              • We'll contact the buyer to explain the situation
              • We'll help reschedule the showing if needed
              • You'll be notified of the resolution
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!issueType || !description.trim() || isSubmitting}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportIssueModal;
