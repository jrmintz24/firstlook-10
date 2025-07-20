import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, User, Video, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TimeSlot {
  datetime: Date;
  available: boolean;
}

interface AppointmentData {
  consultationType: 'video' | 'phone';
  selectedDate?: Date;
  selectedTime?: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  preferredContactMethod: 'phone' | 'email';
  specificQuestions?: string;
  bookingId?: string;
}

interface AppointmentSchedulingStepProps {
  data: AppointmentData;
  onComplete: (data: AppointmentData) => void;
  loading: boolean;
  propertyAddress: string;
  buyerId: string;
}

const AppointmentSchedulingStep = ({
  data,
  onComplete,
  loading,
  propertyAddress,
  buyerId
}: AppointmentSchedulingStepProps) => {
  const [formData, setFormData] = useState<AppointmentData>({
    consultationType: 'video',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    preferredContactMethod: 'phone',
    specificQuestions: '',
    ...data
  });
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(data.selectedDate || null);
  const [selectedTime, setSelectedTime] = useState<string | null>(data.selectedTime || null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
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
      
      // Skip weekends for now
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

  const handleInputChange = (field: keyof AppointmentData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleScheduleAppointment = async () => {
    if (!selectedDate || !selectedTime || !formData.contactName || !formData.contactPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select a time slot.",
        variant: "destructive"
      });
      return;
    }

    setScheduling(true);
    try {
      const scheduledDateTime = new Date(`${selectedDate.toISOString().split('T')[0]}T${selectedTime}`);
      
      // Create consultation booking
      const { data: booking, error } = await supabase
        .from('consultation_bookings')
        .insert({
          buyer_id: buyerId,
          scheduled_at: scheduledDateTime.toISOString(),
          duration_minutes: 30,
          consultation_type: formData.consultationType,
          status: 'scheduled',
          contact_name: formData.contactName,
          contact_phone: formData.contactPhone,
          contact_email: formData.contactEmail,
          preferred_contact_method: formData.preferredContactMethod,
          property_address: propertyAddress,
          specific_questions: formData.specificQuestions
        })
        .select()
        .single();

      if (error) throw error;

      const completedData: AppointmentData = {
        ...formData,
        selectedDate,
        selectedTime,
        bookingId: booking.id
      };

      toast({
        title: "Appointment Scheduled!",
        description: `Your consultation is scheduled for ${formatDate(scheduledDateTime)} at ${formatTime(scheduledDateTime)}`,
      });

      onComplete(completedData);
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      toast({
        title: "Error",
        description: "Failed to schedule appointment. Please try again.",
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

  const isFormValid = formData.contactName && formData.contactPhone && selectedDate && selectedTime;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Schedule Your Offer Consultation
          </CardTitle>
          <p className="text-sm text-gray-600">
            Before we dive into the offer details, let's schedule a consultation to discuss your strategy for {propertyAddress}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Consultation Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Consultation Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={formData.consultationType === 'video' ? 'default' : 'outline'}
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => handleInputChange('consultationType', 'video')}
              >
                <Video className="h-5 w-5" />
                <span>Video Call</span>
                <span className="text-xs text-gray-500">Zoom/Teams meeting</span>
              </Button>
              <Button
                type="button"
                variant={formData.consultationType === 'phone' ? 'default' : 'outline'}
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => handleInputChange('consultationType', 'phone')}
              >
                <Phone className="h-5 w-5" />
                <span>Phone Call</span>
                <span className="text-xs text-gray-500">Traditional phone call</span>
              </Button>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Full Name *</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) => handleInputChange('contactName', e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone Number *</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                placeholder="(555) 123-4567"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email Address</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredContact">Preferred Contact Method</Label>
              <select
                id="preferredContact"
                value={formData.preferredContactMethod}
                onChange={(e) => handleInputChange('preferredContactMethod', e.target.value as 'phone' | 'email')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="phone">Phone</option>
                <option value="email">Email</option>
              </select>
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Select a Date</Label>
            <div className="grid grid-cols-1 gap-2">
              {dates.map((dateKey) => {
                const date = new Date(dateKey);
                const isSelected = selectedDate?.toDateString() === dateKey;
                
                return (
                  <Button
                    key={dateKey}
                    type="button"
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
              <Label className="text-base font-medium">Select a Time</Label>
              <div className="grid grid-cols-3 gap-2">
                {slotsByDate[selectedDate.toDateString()]?.map((slot, index) => {
                  const timeString = slot.datetime.toTimeString().slice(0, 5);
                  const isSelected = selectedTime === timeString;
                  
                  return (
                    <Button
                      key={index}
                      type="button"
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

          {/* Specific Questions */}
          <div className="space-y-2">
            <Label htmlFor="specificQuestions">Specific Questions or Topics to Discuss</Label>
            <Textarea
              id="specificQuestions"
              value={formData.specificQuestions}
              onChange={(e) => handleInputChange('specificQuestions', e.target.value)}
              placeholder="Any specific questions about this property, the market, or the offer process..."
              rows={3}
            />
          </div>

          {/* Selected Appointment Summary */}
          {selectedDate && selectedTime && formData.contactName && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-900">Appointment Summary</span>
              </div>
              <div className="text-sm text-green-700 space-y-1">
                <p><strong>Type:</strong> {formData.consultationType === 'video' ? 'Video Call' : 'Phone Call'}</p>
                <p><strong>Date:</strong> {formatDate(selectedDate)}</p>
                <p><strong>Time:</strong> {formatTime(new Date(`${selectedDate.toISOString().split('T')[0]}T${selectedTime}`))}</p>
                <p><strong>Duration:</strong> 30 minutes</p>
                <p><strong>Contact:</strong> {formData.contactName} - {formData.contactPhone}</p>
                <p><strong>Property:</strong> {propertyAddress}</p>
              </div>
            </div>
          )}

          <Button
            onClick={handleScheduleAppointment}
            disabled={!isFormValid || scheduling || loading}
            className="w-full"
            size="lg"
          >
            {scheduling ? "Scheduling..." : "Schedule Appointment & Continue"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentSchedulingStep;