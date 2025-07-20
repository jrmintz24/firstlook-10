
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TimeSlot {
  datetime: Date;
  available: boolean;
}

interface ConsultationSchedulerProps {
  agentId: string;
  agentName: string;
  offerIntentId: string;
  buyerId: string;
  onScheduled: (bookingId: string) => void;
  onBack: () => void;
}

const ConsultationScheduler = ({
  agentId,
  agentName,
  offerIntentId,
  buyerId,
  onScheduled,
  onBack
}: ConsultationSchedulerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const { toast } = useToast();

  // Generate available time slots for the next 14 days
  useEffect(() => {
    generateAvailableSlots();
  }, []);

  const generateAvailableSlots = () => {
    const slots: TimeSlot[] = [];
    const now = new Date();
    
    // Generate slots for next 14 days
    for (let i = 1; i <= 14; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      
      // Skip weekends for now (can be made configurable later)
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      // Generate time slots: 9 AM to 5 PM, every 30 minutes
      for (let hour = 9; hour < 17; hour++) {
        for (let minute of [0, 30]) {
          const slotTime = new Date(date);
          slotTime.setHours(hour, minute, 0, 0);
          
          // Only show future slots
          if (slotTime > now) {
            slots.push({
              datetime: slotTime,
              available: true // This would be checked against agent availability in a real implementation
            });
          }
        }
      }
    }
    
    setAvailableSlots(slots);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleScheduleConsultation = async () => {
    if (!selectedDate || !selectedTime) return;

    setScheduling(true);
    try {
      const scheduledDateTime = new Date(`${selectedDate.toISOString().split('T')[0]}T${selectedTime}`);
      
      const { data, error } = await supabase
        .from('consultation_bookings')
        .insert({
          offer_intent_id: offerIntentId,
          agent_id: agentId,
          buyer_id: buyerId,
          scheduled_at: scheduledDateTime.toISOString(),
          duration_minutes: 30,
          status: 'scheduled'
        })
        .select()
        .single();

      if (error) throw error;

      // Get buyer profile for email notification
      const { data: buyerProfile, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name, email')
        .eq('id', buyerId)
        .single();

      if (!profileError && buyerProfile) {
        // Send consultation confirmation email
        try {
          const { error: emailError } = await supabase.functions.invoke('send-consultation-confirmation', {
            body: {
              buyerName: `${buyerProfile.first_name} ${buyerProfile.last_name}`,
              buyerEmail: buyerProfile.email,
              propertyAddress: "Property consultation", // You may want to get this from offer intent
              consultationDate: scheduledDateTime.toISOString().split('T')[0],
              consultationTime: formatTime(scheduledDateTime),
              consultationType: 'video',
              agentName: agentName,
              meetingLink: "Video link will be provided 15 minutes before the call"
            }
          });

          if (emailError) {
            console.error('Failed to send consultation confirmation email:', emailError);
          } else {
            console.log('Consultation confirmation email sent successfully');
          }
        } catch (emailError) {
          console.error('Error sending consultation confirmation email:', emailError);
        }
      }

      toast({
        title: "Consultation Scheduled!",
        description: `Your consultation with ${agentName} is scheduled for ${formatDate(scheduledDateTime)} at ${formatTime(scheduledDateTime)}`,
      });

      onScheduled(data.id);
    } catch (error) {
      console.error('Error scheduling consultation:', error);
      toast({
        title: "Error",
        description: "Failed to schedule consultation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setScheduling(false);
    }
  };

  // Group slots by date
  const slotsByDate = availableSlots.reduce((acc, slot) => {
    const dateKey = slot.datetime.toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  const dates = Object.keys(slotsByDate).slice(0, 7); // Show first 7 days

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Schedule Consultation with {agentName}
        </CardTitle>
        <p className="text-sm text-gray-600">
          Choose a 30-minute time slot for your property consultation
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Consultation Details */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Video className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-900">Video Consultation</span>
          </div>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• 30-minute property discussion</p>
            <p>• Market analysis and pricing guidance</p>
            <p>• Answer your specific questions</p>
            <p>• Discuss next steps for making an offer</p>
          </div>
        </div>

        {/* Date Selection */}
        <div className="space-y-3">
          <h3 className="font-medium">Select a Date</h3>
          <div className="grid grid-cols-1 gap-2">
            {dates.map((dateKey) => {
              const date = new Date(dateKey);
              const isSelected = selectedDate?.toDateString() === dateKey;
              
              return (
                <Button
                  key={dateKey}
                  variant={isSelected ? "default" : "outline"}
                  className="justify-start h-auto p-3"
                  onClick={() => {
                    setSelectedDate(date);
                    setSelectedTime(null); // Reset time selection
                  }}
                >
                  <div className="text-left">
                    <div className="font-medium">{formatDate(date)}</div>
                    <div className="text-xs text-gray-500">
                      {slotsByDate[dateKey].length} slots available
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Time Selection */}
        {selectedDate && (
          <div className="space-y-3">
            <h3 className="font-medium">Select a Time</h3>
            <div className="grid grid-cols-3 gap-2">
              {slotsByDate[selectedDate.toDateString()]?.map((slot, index) => {
                const timeString = slot.datetime.toTimeString().slice(0, 5);
                const isSelected = selectedTime === timeString;
                
                return (
                  <Button
                    key={index}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(timeString)}
                  >
                    {formatTime(slot.datetime)}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Appointment Summary */}
        {selectedDate && selectedTime && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-900">Selected Appointment</span>
            </div>
            <div className="text-sm text-green-700">
              <p><strong>Date:</strong> {formatDate(selectedDate)}</p>
              <p><strong>Time:</strong> {formatTime(new Date(`${selectedDate.toISOString().split('T')[0]}T${selectedTime}`))}</p>
              <p><strong>Duration:</strong> 30 minutes</p>
              <p><strong>Agent:</strong> {agentName}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={scheduling}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={handleScheduleConsultation}
            disabled={!selectedDate || !selectedTime || scheduling}
            className="flex-1"
          >
            {scheduling ? "Scheduling..." : "Schedule Consultation"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsultationScheduler;
