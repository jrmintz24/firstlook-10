
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, MessageSquare, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
  onConfirm: (confirmationData: any) => Promise<void>;
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
  const [timeChangeReason, setTimeChangeReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if agent changed the original time/date
  const isTimeChanged = confirmedDate !== request.preferred_date || confirmedTime !== request.preferred_time;
  
  // Check if offering alternatives (has at least one alternative with both date and time)
  const isOfferingAlternatives = showAlternatives && 
    ((alternativeDate1 && alternativeTime1) || (alternativeDate2 && alternativeTime2));

  const handleConfirm = async () => {
    if (!confirmedDate || !confirmedTime) return;

    // If time was changed but no reason provided, require explanation
    if (isTimeChanged && !timeChangeReason.trim()) {
      return;
    }

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
        timeChangeReason: isTimeChanged ? timeChangeReason : undefined,
      });
      onClose();
    } catch (error) {
      console.error('Error confirming showing:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine button text based on what the agent is doing
  const getButtonText = () => {
    if (isSubmitting) return 'Accepting Request...';
    
    if (isOfferingAlternatives) {
      return 'Accept with Alternatives';
    }
    
    if (isTimeChanged) {
      return 'Accept with Time Change';
    }
    
    return 'Accept & Confirm Tour';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            Accept & Confirm Tour Request
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-medium text-gray-800">{request.property_address}</p>
            <p className="text-sm text-gray-600">
              Buyer's request: {request.preferred_date} at {request.preferred_time}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800 mb-2">
              <MessageSquare className="h-4 w-4" />
              <span className="font-medium">What happens next?</span>
            </div>
            <p className="text-blue-700 text-sm">
              After you accept, the tour will be confirmed and the buyer will be notified. You can then coordinate directly with the buyer for the showing.
            </p>
          </div>

          {/* Time Change Alert */}
          {isTimeChanged && (
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-amber-800 mb-2">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Time Change Detected</span>
              </div>
              <p className="text-amber-700 text-sm">
                You've changed the buyer's preferred time. Please explain why the original time isn't available.
              </p>
            </div>
          )}

          {/* Alternatives Notice */}
          {isOfferingAlternatives && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800 mb-2">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Offering Alternative Times</span>
              </div>
              <p className="text-blue-700 text-sm">
                You're providing alternative options for the buyer to choose from.
              </p>
            </div>
          )}

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
              {confirmedDate !== request.preferred_date && (
                <Badge variant="outline" className="mt-1 text-amber-600 border-amber-300">
                  Changed from {request.preferred_date}
                </Badge>
              )}
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
              {confirmedTime !== request.preferred_time && (
                <Badge variant="outline" className="mt-1 text-amber-600 border-amber-300">
                  Changed from {request.preferred_time}
                </Badge>
              )}
            </div>

            {/* Time Change Reason - Required if time changed */}
            {isTimeChanged && (
              <div>
                <Label htmlFor="time-change-reason" className="text-amber-700 font-medium">
                  Reason for Time Change *
                </Label>
                <Textarea
                  id="time-change-reason"
                  value={timeChangeReason}
                  onChange={(e) => setTimeChangeReason(e.target.value)}
                  placeholder="Explain why the original time isn't available (e.g., property has another showing, owner availability, etc.)"
                  rows={2}
                  className="border-amber-300 focus:border-amber-500"
                  required
                />
                {!timeChangeReason.trim() && (
                  <p className="text-sm text-red-600 mt-1">
                    Please explain why the time was changed
                  </p>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="agent-message">Message to Buyer</Label>
              <Textarea
                id="agent-message"
                value={agentMessage}
                onChange={(e) => setAgentMessage(e.target.value)}
                placeholder="Introduce yourself, confirm meeting point, or provide additional details..."
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
              disabled={!confirmedDate || !confirmedTime || isSubmitting || (isTimeChanged && !timeChangeReason.trim())}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {getButtonText()}
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
