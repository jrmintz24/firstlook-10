
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Phone, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TimeSlot {
  datetime: Date;
  available: boolean;
}

interface AgentConsultationSchedulerProps {
  propertyAddress: string;
  consultationType: 'phone' | 'video';
  onScheduled: (bookingId: string) => void;
  onBack: () => void;
}

const AgentConsultationScheduler = ({
  propertyAddress,
  consultationType,
  onScheduled,
  onBack
}: AgentConsultationSchedulerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [scheduling, setScheduling] = useState(false);
  const { toast } = useToast();

  // Generate available time slots for the next 7 days
  useEffect(() => {
    generateAvailableSlots();
  }, []);

  const generateAvailableSlots = () => {
    const slots: TimeSlot[] = [];
    const now = new Date();
    
    // Generate slots for next 7 days
    for (let i = 1; i <= 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      
      // Skip weekends for now
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      // Generate time slots: 9 AM to 5 PM, every 30 minutes
      for (let hour = 9; hour < 17; hour++) {
        for (let minute of [0, 30]) {
          const slotTime = new Date(date);
          slotTime.setHours(hour, minute, 0, 0);
          
          if (slotTime > now) {
            slots.push({
              datetime: slotTime,
              available: true
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
      
      // For now, we'll create a placeholder booking
      // In a real implementation, this would link to the offer intent
      const bookingId = `booking_${Date.now()}`;
      
      toast({
        title: "Consultation Scheduled! 🎉",
        description: `Your ${consultationType} consultation is scheduled for ${formatDate(scheduledDateTime)} at ${formatTime(scheduledDateTime)}`,
      });

      onScheduled(bookingId);
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

  const dates = Object.keys(slotsByDate).slice(0, 5); // Show first 5 days

  return (
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Calendar className="h-6 w-6 text-purple-600" />
          </div>
          Schedule Your Consultation
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Property: {propertyAddress}
        </p>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {/* Consultation Type Display */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <div className="flex items-center gap-3">
            {consultationType === 'phone' ? (
              <Phone className="h-5 w-5 text-blue-600" />
            ) : (
              <Video className="h-5 w-5 text-blue-600" />
            )}
            <div>
              <h4 className="font-semibold text-blue-900">
                {consultationType === 'phone' ? 'Phone Consultation' : 'Video Consultation'}
              </h4>
              <p className="text-sm text-blue-700">
                30-minute property discussion with your agent
              </p>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">Select a Date</h3>
          <div className="grid grid-cols-1 gap-2">
            {dates.map((dateKey) => {
              const date = new Date(dateKey);
              const isSelected = selectedDate?.toDateString() === dateKey;
              
              return (
                <Button
                  key={dateKey}
                  variant={isSelected ? "default" : "outline"}
                  className="justify-start h-auto p-4 rounded-xl"
                  onClick={() => {
                    setSelectedDate(date);
                    setSelectedTime(null);
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
            <h3 className="font-semibold text-gray-800">Select a Time</h3>
            <div className="grid grid-cols-3 gap-2">
              {slotsByDate[selectedDate.toDateString()]?.map((slot, index) => {
                const timeString = slot.datetime.toTimeString().slice(0, 5);
                const isSelected = selectedTime === timeString;
                
                return (
                  <Button
                    key={index}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className="rounded-lg"
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
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-900">Selected Appointment</h4>
                <p className="text-sm text-green-700">
                  {formatDate(selectedDate)} at {formatTime(new Date(`${selectedDate.toISOString().split('T')[0]}T${selectedTime}`))}
                </p>
                <p className="text-sm text-green-700">
                  {consultationType === 'phone' ? 'Phone Call' : 'Video Call'} • 30 minutes
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={scheduling}
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl font-medium"
          >
            Back
          </Button>
          <Button
            onClick={handleScheduleConsultation}
            disabled={!selectedDate || !selectedTime || scheduling}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {scheduling ? "Scheduling..." : "Schedule Consultation"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentConsultationScheduler;
