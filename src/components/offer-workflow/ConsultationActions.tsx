import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Calendar, AlertCircle, Edit3, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { shouldShowAutoCompleteWarning, getTimeUntilAutoComplete } from '@/services/consultationService';

interface ConsultationData {
  id: string;
  offer_intent_id: string;
  scheduled_at: string;
  status: string;
  completed_at?: string;
  completion_method?: string;
  consultation_notes?: string;
  issue_reported?: boolean;
  issue_details?: string;
  meeting_link?: string;
}

interface ConsultationActionsProps {
  consultation: ConsultationData;
  userType: 'agent' | 'buyer';
  onUpdate: () => void;
}

const ConsultationActions: React.FC<ConsultationActionsProps> = ({
  consultation,
  userType,
  onUpdate
}) => {
  const { toast } = useToast();
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [showReportIssueDialog, setShowReportIssueDialog] = useState(false);
  const [consultationNotes, setConsultationNotes] = useState('');
  const [issueDetails, setIssueDetails] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [loading, setLoading] = useState(false);

  const isCompleted = consultation.status === 'completed';
  const isPast = new Date(consultation.scheduled_at) < new Date();
  const isUpcoming = !isPast;
  // Agent can complete consultation any time (before or after scheduled time)
  const canComplete = userType === 'agent' && !isCompleted && consultation.status !== 'cancelled';
  const canReschedule = !isCompleted && !consultation.issue_reported;

  const handleCompleteConsultation = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('consultation_bookings')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          completion_method: 'agent_manual',
          consultation_notes: consultationNotes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', consultation.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Consultation marked as complete. You can now prepare the offer.",
      });
      
      setShowCompleteDialog(false);
      onUpdate();
    } catch (error) {
      console.error('Error completing consultation:', error);
      toast({
        title: "Error",
        description: "Failed to complete consultation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = async () => {
    if (!newDate || !newTime) {
      toast({
        title: "Error",
        description: "Please select both date and time.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const scheduledDateTime = new Date(`${newDate}T${newTime}`);
      
      const { error } = await supabase
        .from('consultation_bookings')
        .update({
          scheduled_at: scheduledDateTime.toISOString(),
          status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('id', consultation.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Consultation rescheduled successfully.",
      });
      
      setShowRescheduleDialog(false);
      onUpdate();
    } catch (error) {
      console.error('Error rescheduling consultation:', error);
      toast({
        title: "Error",
        description: "Failed to reschedule consultation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReportIssue = async () => {
    if (!issueDetails.trim()) {
      toast({
        title: "Error",
        description: "Please provide issue details.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('consultation_bookings')
        .update({
          issue_reported: true,
          issue_details: issueDetails,
          issue_reported_by: userType,
          updated_at: new Date().toISOString()
        })
        .eq('id', consultation.id);

      if (error) throw error;

      toast({
        title: "Issue Reported",
        description: "The issue has been reported. We'll help resolve it soon.",
      });
      
      setShowReportIssueDialog(false);
      onUpdate();
    } catch (error) {
      console.error('Error reporting issue:', error);
      toast({
        title: "Error",
        description: "Failed to report issue. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Consultation Details
            </span>
            <Badge className={isCompleted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
              {isCompleted ? 'Completed' : 'Scheduled'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Date & Time</p>
              <p className="font-medium">
                {format(new Date(consultation.scheduled_at), 'MMM d, yyyy at h:mm a')}
              </p>
            </div>
            {isCompleted && consultation.completed_at && (
              <div>
                <p className="text-gray-500">Completed</p>
                <p className="font-medium">
                  {format(new Date(consultation.completed_at), 'MMM d, yyyy at h:mm a')}
                </p>
              </div>
            )}
          </div>

          {consultation.meeting_link && !isCompleted && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(consultation.meeting_link, '_blank')}
            >
              Join Meeting
            </Button>
          )}

          {consultation.consultation_notes && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Consultation Notes</p>
              <p className="text-sm bg-gray-50 p-3 rounded-md">{consultation.consultation_notes}</p>
            </div>
          )}

          {/* Auto-complete warning */}
          {!isCompleted && isPast && shouldShowAutoCompleteWarning(consultation.scheduled_at) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-sm font-medium text-yellow-800 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Auto-completion in {getTimeUntilAutoComplete(consultation.scheduled_at)}
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                This consultation will be automatically marked as complete if no action is taken.
              </p>
            </div>
          )}

          {consultation.issue_reported && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm font-medium text-red-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Issue Reported by {consultation.issue_reported_by}
              </p>
              <p className="text-sm text-red-700 mt-1">{consultation.issue_details}</p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {canComplete && (
              <Button 
                onClick={() => setShowCompleteDialog(true)}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Complete
              </Button>
            )}
            
            {canReschedule && (
              <Button 
                variant="outline"
                onClick={() => setShowRescheduleDialog(true)}
                className="flex-1"
              >
                <Clock className="w-4 h-4 mr-2" />
                Reschedule
              </Button>
            )}
            
            {!isCompleted && !consultation.issue_reported && (
              <Button 
                variant="outline"
                onClick={() => setShowReportIssueDialog(true)}
                className="flex-1"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Report Issue
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Complete Consultation Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Consultation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Mark this consultation as complete to proceed with offer preparation.
            </p>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Consultation Notes (Optional)
              </label>
              <Textarea
                placeholder="Add any notes about the consultation..."
                value={consultationNotes}
                onChange={(e) => setConsultationNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCompleteConsultation} disabled={loading}>
              {loading ? 'Completing...' : 'Complete Consultation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Consultation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">New Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded-md"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">New Time</label>
              <input
                type="time"
                className="w-full p-2 border rounded-md"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRescheduleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleReschedule} disabled={loading || !newDate || !newTime}>
              {loading ? 'Rescheduling...' : 'Reschedule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Issue Dialog */}
      <Dialog open={showReportIssueDialog} onOpenChange={setShowReportIssueDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Consultation Issue</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Let us know what went wrong with the consultation.
            </p>
            <Textarea
              placeholder="Describe the issue..."
              value={issueDetails}
              onChange={(e) => setIssueDetails(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportIssueDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleReportIssue} 
              disabled={loading || !issueDetails.trim()}
              variant="destructive"
            >
              {loading ? 'Reporting...' : 'Report Issue'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConsultationActions;