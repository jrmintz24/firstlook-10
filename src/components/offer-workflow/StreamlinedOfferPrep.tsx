import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, User, Video, Phone, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TimeSlot {
  datetime: Date;
  available: boolean;
}

interface OfferPrepData {
  // Appointment Details
  consultationType: 'video' | 'phone';
  selectedDate?: Date;
  selectedTime?: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  
  // Essential Financial Info
  budgetMax: number;
  downPaymentAmount: number;
  preApprovalStatus: 'approved' | 'pending' | 'not_started';
  
  // Timeline & Strategy
  buyingTimeline: string;
  competitiveComfort: string;
  
  // Specific Questions/Concerns
  specificQuestions?: string;
}

interface StreamlinedOfferPrepProps {
  isOpen: boolean;
  onClose: () => void;
  propertyAddress: string;
  buyerId: string;
  agentId?: string;
}

const StreamlinedOfferPrep = ({
  isOpen,
  onClose,
  propertyAddress,
  buyerId,
  agentId
}: StreamlinedOfferPrepProps) => {
  const [currentStep, setCurrentStep] = useState<'appointment' | 'complete'>('appointment');
  const [formData, setFormData] = useState<OfferPrepData>({
    consultationType: 'video',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    budgetMax: 0,
    downPaymentAmount: 0,
    preApprovalStatus: 'not_started',
    buyingTimeline: '',
    competitiveComfort: '',
    specificQuestions: ''
  });
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Generate available time slots for the next 14 days
  useEffect(() => {
    const slots: TimeSlot[] = [];
    const now = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
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
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
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

  const handleInputChange = (field: keyof OfferPrepData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !isFormValid()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select a time slot.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const scheduledDateTime = new Date(`${selectedDate.toISOString().split('T')[0]}T${selectedTime}`);
      
      // Create consultation booking with prep data
      const { data: booking, error } = await supabase
        .from('consultation_bookings')
        .insert({
          buyer_id: buyerId,
          agent_id: agentId,
          scheduled_at: scheduledDateTime.toISOString(),
          duration_minutes: 30,
          consultation_type: formData.consultationType,
          status: 'scheduled',
          contact_name: formData.contactName,
          contact_phone: formData.contactPhone,
          contact_email: formData.contactEmail,
          property_address: propertyAddress,
          specific_questions: formData.specificQuestions,
          prep_data: {
            budgetMax: formData.budgetMax,
            downPaymentAmount: formData.downPaymentAmount,
            preApprovalStatus: formData.preApprovalStatus,
            buyingTimeline: formData.buyingTimeline,
            competitiveComfort: formData.competitiveComfort
          }
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Consultation Scheduled!",
        description: `Your expert consultation is scheduled for ${formatDate(scheduledDateTime)} at ${formatTime(scheduledDateTime)}`,
      });

      setCurrentStep('complete');
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

  const isFormValid = () => {
    return formData.contactName && 
           formData.contactPhone && 
           formData.budgetMax && 
           formData.downPaymentAmount && 
           formData.preApprovalStatus &&
           formData.buyingTimeline &&
           formData.competitiveComfort;
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

  if (!isOpen) return null;

  if (currentStep === 'complete') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">You're All Set!</h3>
            <p className="text-gray-600 mb-4">
              Our team will call you at your scheduled time to discuss your offer strategy for {propertyAddress}.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              You'll receive a confirmation email with all the details.
            </p>
            <Button onClick={onClose} className="w-full">
              Got It
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-xl">Schedule Your Offer Strategy Call</CardTitle>
          <p className="text-sm text-gray-600">
            Property: {propertyAddress}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Contact & Consultation Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Full Name *</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) => handleInputChange('contactName', e.target.value)}
                placeholder="Your full name"
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
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label>Call Type</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={formData.consultationType === 'video' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleInputChange('consultationType', 'video')}
                  className="flex items-center gap-1"
                >
                  <Video className="h-3 w-3" />
                  Video
                </Button>
                <Button
                  type="button"
                  variant={formData.consultationType === 'phone' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleInputChange('consultationType', 'phone')}
                  className="flex items-center gap-1"
                >
                  <Phone className="h-3 w-3" />
                  Phone
                </Button>
              </div>
            </div>
          </div>

          {/* Essential Financial Info */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Quick Financial Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budgetMax">Max Budget *</Label>
                <Input
                  id="budgetMax"
                  type="number"
                  placeholder="750000"
                  value={formData.budgetMax || ''}
                  onChange={(e) => handleInputChange('budgetMax', Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="downPaymentAmount">Down Payment *</Label>
                <Input
                  id="downPaymentAmount"
                  type="number"
                  placeholder="150000"
                  value={formData.downPaymentAmount || ''}
                  onChange={(e) => handleInputChange('downPaymentAmount', Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Pre-Approval Status *</Label>
                <Select
                  value={formData.preApprovalStatus}
                  onValueChange={(value) => handleInputChange('preApprovalStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Pre-Approved</SelectItem>
                    <SelectItem value="pending">In Progress</SelectItem>
                    <SelectItem value="not_started">Not Started</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Timeline & Strategy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Buying Timeline *</Label>
              <Select
                value={formData.buyingTimeline}
                onValueChange={(value) => handleInputChange('buyingTimeline', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediately">ASAP (0-30 days)</SelectItem>
                  <SelectItem value="soon">Soon (1-3 months)</SelectItem>
                  <SelectItem value="moderate">Flexible (3-6 months)</SelectItem>
                  <SelectItem value="exploring">Just Exploring</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Offer Strategy Comfort *</Label>
              <Select
                value={formData.competitiveComfort}
                onValueChange={(value) => handleInputChange('competitiveComfort', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select comfort level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aggressive">Very Competitive</SelectItem>
                  <SelectItem value="moderate">Moderately Competitive</SelectItem>
                  <SelectItem value="conservative">Conservative</SelectItem>
                  <SelectItem value="unsure">Need Guidance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Questions/Concerns */}
          <div className="space-y-2">
            <Label htmlFor="specificQuestions">Questions or Concerns</Label>
            <Textarea
              id="specificQuestions"
              placeholder="Any specific questions about this property, pricing strategy, or the offer process..."
              value={formData.specificQuestions}
              onChange={(e) => handleInputChange('specificQuestions', e.target.value)}
              rows={2}
            />
          </div>

          {/* Date & Time Selection */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Choose Your Consultation Time</h3>
            
            {/* Date Selection */}
            <div className="space-y-3">
              <Label>Select a Date</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {dates.map((dateKey) => {
                  const date = new Date(dateKey);
                  const isSelected = selectedDate?.toDateString() === dateKey;
                  
                  return (
                    <Button
                      key={dateKey}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedTime(null);
                      }}
                    >
                      {formatDate(date)}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="space-y-3 mt-4">
                <Label>Select a Time</Label>
                <div className="grid grid-cols-4 gap-2">
                  {slotsByDate[selectedDate.toDateString()]?.slice(0, 12).map((slot, index) => {
                    const timeString = slot.datetime.toTimeString().slice(0, 5);
                    const isSelected = selectedTime === timeString;
                    
                    return (
                      <Button
                        key={index}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(timeString)}
                      >
                        {formatTime(slot.datetime)}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedDate || !selectedTime || !isFormValid() || loading}
              className="flex-1"
            >
              {loading ? "Scheduling..." : "Schedule Consultation"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StreamlinedOfferPrep;