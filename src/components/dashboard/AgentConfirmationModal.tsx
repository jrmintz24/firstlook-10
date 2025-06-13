
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, MessageSquare } from 'lucide-react';

interface ShowingRequest {
  id: string;
  property_address: string;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string | null;
  user_id?: string | null;
}

interface AgentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ShowingRequest;
  onConfirm: (confirmationData: AgentConfirmationData) => Promise<void>;
}

interface AgentConfirmationData {
  requestId: string;
  confirmedDate: string;
  confirmedTime: string;
  agentMessage: string;
  alternativeDate1?: string;
  alternativeTime1?: string;
  alternativeDate2?: string;
  alternativeTime2?: string;
}

const AgentConfirmationModal = ({ isOpen, onClose, request, onConfirm }: AgentConfirmationModalProps) => {
  const [confirmedDate, setConfirmedDate] = useState(request.preferred_date || '');
  const [confirmedTime, setConfirmedTime] = useState(request.preferred_time || '');
  const [agentMessage, setAgentMessage] = useState('');
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [alternativeDate1, setAlternativeDate1] = useState('');
  const [alternativeTime1, setAlternativeTime1] = useState('');
  const [alternativeDate2, setAlternativeDate2] = useState('');
  const [alternativeTime2, setAlternativeTime2] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!confirmedDate || !confirmedTime) return;

    setIsSubmitting(true);
    try {
      await onConfirm({
        requestId: request.id,
        confirmedDate,
        confirmedTime,
        agentMessage,
        alternativeDate1: showAlternatives ? alternativeDate1 : undefined,
        alternativeTime1: showAlternatives ? alternativeTime1 : undefined,
        alternativeDate2: showAlternatives ? alternativeDate2 : undefined,
        alternativeTime2: showAlternatives ? alternativeTime2 : undefined,
      });
      onClose();
    } catch (error) {
      console.error('Error confirming showing:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            Confirm Showing Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-medium text-gray-800">{request.property_address}</p>
            <p className="text-sm text-gray-600">
              Buyer's preferred: {request.preferred_date} at {request.preferred_time}
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="confirmed-date">Confirmed Date</Label>
              <Input
                id="confirmed-date"
                type="date"
                value={confirmedDate}
                onChange={(e) => setConfirmedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <Label htmlFor="confirmed-time">Confirmed Time</Label>
              <select
                id="confirmed-time"
                value={confirmedTime}
                onChange={(e) => setConfirmedTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select time</option>
                <option value="09:00:00">9:00 AM</option>
                <option value="10:00:00">10:00 AM</option>
                <option value="11:00:00">11:00 AM</option>
                <option value="12:00:00">12:00 PM</option>
                <option value="13:00:00">1:00 PM</option>
                <option value="14:00:00">2:00 PM</option>
                <option value="15:00:00">3:00 PM</option>
                <option value="16:00:00">4:00 PM</option>
                <option value="17:00:00">5:00 PM</option>
                <option value="18:00:00">6:00 PM</option>
              </select>
            </div>

            <div>
              <Label htmlFor="agent-message">Message to Buyer (Optional)</Label>
              <Textarea
                id="agent-message"
                value={agentMessage}
                onChange={(e) => setAgentMessage(e.target.value)}
                placeholder="Introduce yourself, confirm meeting point, or ask any questions..."
                rows={3}
              />
            </div>

            <Button
              variant="outline"
              onClick={() => setShowAlternatives(!showAlternatives)}
              className="w-full"
            >
              <Clock className="h-4 w-4 mr-2" />
              {showAlternatives ? 'Hide' : 'Offer'} Alternative Times
            </Button>

            {showAlternatives && (
              <div className="space-y-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800">Alternative Options</p>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="alt-date-1" className="text-xs">Alternative Date 1</Label>
                    <Input
                      id="alt-date-1"
                      type="date"
                      value={alternativeDate1}
                      onChange={(e) => setAlternativeDate1(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="alt-time-1" className="text-xs">Time</Label>
                    <select
                      id="alt-time-1"
                      value={alternativeTime1}
                      onChange={(e) => setAlternativeTime1(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Select time</option>
                      <option value="09:00:00">9:00 AM</option>
                      <option value="10:00:00">10:00 AM</option>
                      <option value="11:00:00">11:00 AM</option>
                      <option value="12:00:00">12:00 PM</option>
                      <option value="13:00:00">1:00 PM</option>
                      <option value="14:00:00">2:00 PM</option>
                      <option value="15:00:00">3:00 PM</option>
                      <option value="16:00:00">4:00 PM</option>
                      <option value="17:00:00">5:00 PM</option>
                      <option value="18:00:00">6:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="alt-date-2" className="text-xs">Alternative Date 2</Label>
                    <Input
                      id="alt-date-2"
                      type="date"
                      value={alternativeDate2}
                      onChange={(e) => setAlternativeDate2(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="alt-time-2" className="text-xs">Time</Label>
                    <select
                      id="alt-time-2"
                      value={alternativeTime2}
                      onChange={(e) => setAlternativeTime2(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Select time</option>
                      <option value="09:00:00">9:00 AM</option>
                      <option value="10:00:00">10:00 AM</option>
                      <option value="11:00:00">11:00 AM</option>
                      <option value="12:00:00">12:00 PM</option>
                      <option value="13:00:00">1:00 PM</option>
                      <option value="14:00:00">2:00 PM</option>
                      <option value="15:00:00">3:00 PM</option>
                      <option value="16:00:00">4:00 PM</option>
                      <option value="17:00:00">5:00 PM</option>
                      <option value="18:00:00">6:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleConfirm}
              disabled={!confirmedDate || !confirmedTime || isSubmitting}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Confirming...' : 'Confirm & Contact Buyer'}
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

export default AgentConfirmationModal;
