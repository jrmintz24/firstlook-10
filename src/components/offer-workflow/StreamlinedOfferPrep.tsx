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
  
  // Essential Financial Info
  budgetMax: number;
  downPaymentAmount: number;
  preApprovalStatus: 'approved' | 'pending' | 'not_started';
  
  // Strategic Offer Questions
  maxOverAskingPrice: number;
  flexibleClosingDate: 'yes' | 'no' | 'somewhat';
  inspectionDealBreakers: string;
  
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
  const [currentStep, setCurrentStep] = useState<'scheduling' | 'questionnaire' | 'complete'>('scheduling');
  const [formData, setFormData] = useState<OfferPrepData>({
    consultationType: 'video',
    contactName: '',
    contactPhone: '',
    budgetMax: 0,
    downPaymentAmount: 0,
    preApprovalStatus: 'not_started',
    maxOverAskingPrice: 0,
    flexibleClosingDate: 'somewhat',
    inspectionDealBreakers: '',
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
      
      // First create an offer intent
      const { data: offerIntent, error: offerError } = await supabase
        .from('offer_intents')
        .insert({
          buyer_id: buyerId,
          agent_id: agentId || buyerId, // Use buyer ID as fallback if no agent
          property_address: propertyAddress,
          offer_type: agentId ? 'agent_assisted' : 'consultation_request',
          contract_type: propertyAddress.includes('Montgomery') ? 'gcaar' : 
                       propertyAddress.includes('DC') || propertyAddress.includes('Washington') ? 'gcaar' : 'mar'
        })
        .select()
        .single();

      if (offerError) throw offerError;

      // Create consultation booking with prep data in buyer_notes
      const prepData = {
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
        consultationType: formData.consultationType,
        propertyAddress: propertyAddress,
        budgetMax: formData.budgetMax,
        downPaymentAmount: formData.downPaymentAmount,
        preApprovalStatus: formData.preApprovalStatus,
        maxOverAskingPrice: formData.maxOverAskingPrice,
        flexibleClosingDate: formData.flexibleClosingDate,
        inspectionDealBreakers: formData.inspectionDealBreakers,
        specificQuestions: formData.specificQuestions
      };

      const { data: booking, error: bookingError } = await supabase
        .from('consultation_bookings')
        .insert({
          buyer_id: buyerId,
          agent_id: agentId || buyerId, // Use buyer ID as fallback if no agent
          offer_intent_id: offerIntent.id,
          scheduled_at: scheduledDateTime.toISOString(),
          duration_minutes: 30,
          status: 'scheduled',
          buyer_notes: JSON.stringify(prepData)
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Send confirmation email
      try {
        const testEmail = 'firstlookhometourstest@gmail.com';
        console.log('Sending consultation email to test address:', testEmail);
        
        const { error: emailError } = await supabase.functions.invoke('send-consultation-confirmation', {
          body: {
            buyerName: formData.contactName || 'Test Buyer',
            buyerEmail: testEmail, // Always use test email for now
            propertyAddress: propertyAddress,
            consultationDate: scheduledDateTime.toISOString(),
            consultationTime: formatTime(scheduledDateTime),
            consultationType: formData.consultationType,
            agentName: agentId ? 'FirstLook Expert' : undefined,
            meetingLink: formData.consultationType === 'video' ? 'https://meet.firstlook.com/consultation' : undefined
          }
        });

        if (emailError) {
          console.error('Email sending failed:', emailError);
          // Don't fail the whole process if email fails
        }
      } catch (emailError) {
        console.error('Email function error:', emailError);
        // Don't fail the whole process if email fails
      }

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
           formData.maxOverAskingPrice !== undefined &&
           formData.flexibleClosingDate;
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
              Check your email for a detailed confirmation with everything you need to prepare for your call.
            </p>
            <Button onClick={onClose} className="w-full">
              Got It
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'scheduling':
        return (
          <>
            <CardHeader>
              <CardTitle className="text-xl">Schedule Your Offer Strategy Call</CardTitle>
              <p className="text-sm text-gray-600">
                Property: {propertyAddress}
              </p>
              <p className="text-sm text-blue-600 font-medium">
                Step 1 of 2: Choose your preferred time
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact Type Selection */}
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
                    <Video className="h-4 w-4" />
                    Video
                  </Button>
                  <Button
                    type="button"
                    variant={formData.consultationType === 'phone' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleInputChange('consultationType', 'phone')}
                    className="flex items-center gap-1"
                  >
                    <Phone className="h-4 w-4" />
                    Phone
                  </Button>
                </div>
              </div>

              {/* Basic Contact Info */}
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

              {/* Scheduling */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>Select Date</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {dates.map((dateStr) => {
                      const date = new Date(dateStr);
                      const isSelected = selectedDate?.toDateString() === date.toDateString();
                      
                      return (
                        <Button
                          key={dateStr}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          className="flex flex-col py-3 px-2 h-auto"
                          onClick={() => setSelectedDate(date)}
                        >
                          <span className="text-xs">{formatDate(date).split(' ')[0]}</span>
                          <span className="text-lg font-semibold">{date.getDate()}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {selectedDate && slotsByDate[selectedDate.toDateString()]?.length > 0 && (
                  <div className="space-y-3">
                    <Label>Select Time</Label>
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

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={() => setCurrentStep('questionnaire')}
                  disabled={!formData.contactName || !formData.contactPhone || !selectedDate || !selectedTime}
                >
                  Continue to Details
                </Button>
              </div>
            </CardContent>
          </>
        );

      case 'questionnaire':
        return (
          <>
            <CardHeader>
              <CardTitle className="text-xl">Tell Us About Your Offer Plans</CardTitle>
              <p className="text-sm text-gray-600">
                Property: {propertyAddress}
              </p>
              <p className="text-sm text-blue-600 font-medium">
                Step 2 of 2: Help us prepare for your call
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Financial Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Financial Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budgetMax">Maximum Budget *</Label>
                    <Input
                      id="budgetMax"
                      type="number"
                      value={formData.budgetMax || ''}
                      onChange={(e) => handleInputChange('budgetMax', parseInt(e.target.value) || 0)}
                      placeholder="500000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="downPayment">Down Payment Amount *</Label>
                    <Input
                      id="downPayment"
                      type="number"
                      value={formData.downPaymentAmount || ''}
                      onChange={(e) => handleInputChange('downPaymentAmount', parseInt(e.target.value) || 0)}
                      placeholder="100000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Pre-approval Status</Label>
                  <Select
                    value={formData.preApprovalStatus}
                    onValueChange={(value: 'approved' | 'pending' | 'not_started') => 
                      handleInputChange('preApprovalStatus', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">Pre-approved</SelectItem>
                      <SelectItem value="pending">Application in progress</SelectItem>
                      <SelectItem value="not_started">Haven't started yet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Strategic Offer Questions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Offer Strategy</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxOverAsking">Maximum Over Asking Price *</Label>
                    <Input
                      id="maxOverAsking"
                      type="number"
                      value={formData.maxOverAskingPrice || ''}
                      onChange={(e) => handleInputChange('maxOverAskingPrice', parseInt(e.target.value) || 0)}
                      placeholder="25000"
                    />
                    <p className="text-xs text-gray-500">Amount you'd consider going over list price</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Flexible on Closing Date? *</Label>
                    <Select
                      value={formData.flexibleClosingDate}
                      onValueChange={(value: 'yes' | 'no' | 'somewhat') => 
                        handleInputChange('flexibleClosingDate', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select flexibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes, very flexible</SelectItem>
                        <SelectItem value="somewhat">Somewhat flexible</SelectItem>
                        <SelectItem value="no">No, specific date needed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dealBreakers">Inspection Deal-Breakers</Label>
                  <Input
                    id="dealBreakers"
                    value={formData.inspectionDealBreakers}
                    onChange={(e) => handleInputChange('inspectionDealBreakers', e.target.value)}
                    placeholder="e.g., foundation issues, roof problems, electrical..."
                  />
                  <p className="text-xs text-gray-500">Issues that would cause you to walk away</p>
                </div>
              </div>

              {/* Additional Questions */}
              <div className="space-y-2">
                <Label htmlFor="specificQuestions">Specific Questions or Concerns</Label>
                <Textarea
                  id="specificQuestions"
                  value={formData.specificQuestions || ''}
                  onChange={(e) => handleInputChange('specificQuestions', e.target.value)}
                  placeholder="Any specific questions about this property or the offer process..."
                  rows={3}
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setCurrentStep('scheduling')}
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!isFormValid() || loading}
                  className="flex-1 ml-3"
                >
                  {loading ? "Scheduling..." : "Schedule Consultation"}
                </Button>
              </div>
            </CardContent>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {renderStepContent()}
      </Card>
    </div>
  );
};

export default StreamlinedOfferPrep;