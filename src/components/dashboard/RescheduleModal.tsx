
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, X, AlertCircle } from "lucide-react";
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg shadow-2xl border-0 bg-white">
        <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">Reschedule Showing</div>
                <div className="text-sm text-gray-600 font-normal">Update your preferred date and time</div>
              </div>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-white/50 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-3 p-3 bg-white/70 rounded-lg border border-blue-100">
            <p className="text-sm text-gray-700 font-medium truncate">
              {showingRequest.property_address}
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 p-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Reschedule Notice</p>
                <p className="text-xs text-amber-700 mt-1">
                  Your showing will be reset to pending status and require re-confirmation from the agent.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-800 mb-2 block flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                New Preferred Date *
              </label>
              <Input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                disabled={submitting}
                className="border-gray-200 focus:border-blue-300 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800 mb-2 block flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                New Preferred Time
              </label>
              <Input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                disabled={submitting}
                className="border-gray-200 focus:border-blue-300 focus:ring-blue-200"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-800 mb-2 block">
              Reason for Reschedule (optional)
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Let us know why you need to reschedule..."
              className="min-h-[80px] border-gray-200 focus:border-blue-300 focus:ring-blue-200 resize-none"
              disabled={submitting}
            />
          </div>
          
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
            <Button 
              variant="outline" 
              onClick={onClose} 
              disabled={submitting}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReschedule}
              disabled={submitting || !newDate}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 shadow-md"
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
