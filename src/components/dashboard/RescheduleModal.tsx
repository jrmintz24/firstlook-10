
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RescheduleModalProps {
  showingRequest: {
    id: string;
    property_address: string;
    preferred_date: string | null;
    preferred_time: string | null;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const RescheduleModal = ({
  showingRequest,
  isOpen,
  onClose,
  onSuccess
}: RescheduleModalProps) => {
  const [newDate, setNewDate] = useState(showingRequest.preferred_date || "");
  const [newTime, setNewTime] = useState(showingRequest.preferred_time || "");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleReschedule = async () => {
    if (!newDate) {
      toast({
        title: "Date Required",
        description: "Please select a new preferred date.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('showing_requests')
        .update({
          preferred_date: newDate,
          preferred_time: newTime || null,
          message: reason ? `Reschedule request: ${reason}` : null,
          status: 'pending', // Reset to pending for re-confirmation
          status_updated_at: new Date().toISOString()
        })
        .eq('id', showingRequest.id);

      if (error) throw error;

      toast({
        title: "Reschedule Request Sent",
        description: "Your reschedule request has been submitted for review.",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error rescheduling showing:', error);
      toast({
        title: "Error",
        description: "Failed to submit reschedule request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Reschedule Showing
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 truncate">
            {showingRequest.property_address}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              New Preferred Date *
            </label>
            <Input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              disabled={submitting}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
              <Clock className="h-4 w-4" />
              New Preferred Time (optional)
            </label>
            <Input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Reason for Reschedule (optional)
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Let us know why you need to reschedule..."
              className="min-h-[80px]"
              disabled={submitting}
            />
          </div>
          
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button
              onClick={handleReschedule}
              disabled={submitting || !newDate}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {submitting ? "Submitting..." : "Submit Reschedule"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RescheduleModal;
