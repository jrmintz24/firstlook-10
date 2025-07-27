import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, ArrowRight, ArrowLeft, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OfferData {
  // Contact Info
  contactName: string;
  contactPhone: string;
  consultationType: 'video' | 'phone';
  
  // Scheduling
  selectedDate?: Date;
  selectedTime?: string;
  
  // Financial
  budgetMax?: number;
  downPaymentAmount?: number;
  preApprovalStatus: 'approved' | 'pending' | 'not_started';
  
  // Strategy
  maxOverAskingPrice?: number;
  flexibleClosingDate: 'yes' | 'no' | 'somewhat';
  inspectionDealBreakers: string;
  specificQuestions: string;
}

interface PromptDrivenOfferFormProps {
  propertyAddress: string;
  buyerId: string;
  agentId?: string;
  onComplete?: () => void;
}

const PromptDrivenOfferForm = ({
  propertyAddress,
  buyerId,
  agentId,
  onComplete
}: PromptDrivenOfferFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [offerData, setOfferData] = useState<OfferData>({
    contactName: '',
    contactPhone: '',
    consultationType: 'video',
    preApprovalStatus: 'not_started',
    flexibleClosingDate: 'somewhat',
    inspectionDealBreakers: '',
    specificQuestions: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<Array<{datetime: Date, available: boolean}>>([]);
  const { toast } = useToast();

  const formSteps = [
    {
      id: 'contact',
      title: 'Let\'s start with the basics',
      subtitle: 'We need to know how to reach you',
      fields: [
        {
          key: 'contactName' as keyof OfferData,
          label: 'Full Name',
          type: 'text',
          placeholder: 'Your full name',
          required: true
        },
        {
          key: 'contactPhone' as keyof OfferData,
          label: 'Phone Number',
          type: 'tel',
          placeholder: '(555) 123-4567',
          required: true
        }
      ]
    },
    {
      id: 'consultation',
      title: 'How would you like to meet?',
      subtitle: 'Choose your consultation style',
      fields: [
        {
          key: 'consultationType' as keyof OfferData,
          label: 'Consultation Type',
          type: 'select',
          options: [
            { value: 'video', label: '📹 Video Call (recommended)' },
            { value: 'phone', label: '📞 Phone Call' }
          ],
          required: true
        }
      ]
    },
    {
      id: 'financial',
      title: 'Tell us about your budget',
      subtitle: 'This helps us prepare the best strategy',
      fields: [
        {
          key: 'budgetMax' as keyof OfferData,
          label: 'Maximum Budget',
          type: 'number',
          placeholder: '750000',
          required: true,
          prefix: '$'
        },
        {
          key: 'downPaymentAmount' as keyof OfferData,
          label: 'Down Payment Amount',
          type: 'number',
          placeholder: '150000',
          required: true,
          prefix: '$'
        },
        {
          key: 'preApprovalStatus' as keyof OfferData,
          label: 'Pre-approval Status',
          type: 'select',
          options: [
            { value: 'approved', label: '✅ Already pre-approved' },
            { value: 'pending', label: '⏳ Application in progress' },
            { value: 'not_started', label: '📋 Haven\'t started yet' }
          ],
          required: true
        }
      ]
    },
    {
      id: 'strategy',
      title: 'Your offer strategy',
      subtitle: 'Help us understand your approach',
      fields: [
        {
          key: 'maxOverAskingPrice' as keyof OfferData,
          label: 'Maximum Over Asking Price',
          type: 'number',
          placeholder: '25000 (or 0 if you won\'t go over)',
          required: true,
          prefix: '$'
        },
        {
          key: 'flexibleClosingDate' as keyof OfferData,
          label: 'Closing Date Flexibility',
          type: 'select',
          options: [
            { value: 'yes', label: '🤸 Very flexible' },
            { value: 'somewhat', label: '😌 Somewhat flexible' },
            { value: 'no', label: '📍 Need specific date' }
          ],
          required: true
        }
      ]
    },
    {
      id: 'details',
      title: 'Final details',
      subtitle: 'Any specific concerns or questions?',
      fields: [
        {
          key: 'inspectionDealBreakers' as keyof OfferData,
          label: 'Inspection Deal-Breakers',
          type: 'text',
          placeholder: 'e.g., foundation issues, roof problems (optional)',
          required: false
        },
        {
          key: 'specificQuestions' as keyof OfferData,
          label: 'Questions or Concerns',
          type: 'textarea',
          placeholder: 'Any specific questions about this property or the offer process? (optional)',
          required: false
        }
      ]
    },
    {
      id: 'scheduling',
      title: 'Pick your perfect time',
      subtitle: 'Choose when you\'d like your consultation',
      fields: []
    }
  ];

  // Generate available time slots
  useEffect(() => {
    const slots: Array<{datetime: Date, available: boolean}> = [];
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

  const currentStepData = formSteps[currentStep];

  const handleInputChange = (field: keyof OfferData, value: any) => {
    setOfferData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleScheduleSlot = async (slot: {datetime: Date, available: boolean}) => {
    if (!slot.available) return;

    setOfferData(prev => ({
      ...prev,
      selectedDate: slot.datetime,
      selectedTime: slot.datetime.toTimeString().slice(0, 5)
    }));

    await handleSubmit(slot.datetime);
  };

  const handleSubmit = async (scheduledDateTime?: Date) => {
    setIsSubmitting(true);
    
    try {
      const finalDateTime = scheduledDateTime || offerData.selectedDate;
      if (!finalDateTime) throw new Error('No datetime selected');

      // Create offer intent
      const { data: offerIntent, error: offerError } = await supabase
        .from('offer_intents')
        .insert({
          buyer_id: buyerId,
          agent_id: agentId || buyerId,
          property_address: propertyAddress,
          offer_type: agentId ? 'agent_assisted' : 'consultation_request',
          contract_type: propertyAddress.includes('Montgomery') ? 'gcaar' : 
                       propertyAddress.includes('DC') || propertyAddress.includes('Washington') ? 'gcaar' : 'mar'
        })
        .select()
        .single();

      if (offerError) throw offerError;

      // Create consultation booking
      const { data: booking, error: bookingError } = await supabase
        .from('consultation_bookings')
        .insert({
          buyer_id: buyerId,
          agent_id: agentId || buyerId,
          offer_intent_id: offerIntent.id,
          scheduled_at: finalDateTime.toISOString(),
          duration_minutes: 30,
          status: 'scheduled',
          buyer_notes: JSON.stringify(offerData)
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      const formatDate = (date: Date) => date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      });

      const formatTime = (date: Date) => date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      toast({
        title: "Consultation Scheduled! 🎉",
        description: `Your consultation is set for ${formatDate(finalDateTime)} at ${formatTime(finalDateTime)}`,
      });

      setIsComplete(true);
      
      setTimeout(() => {
        onComplete?.();
      }, 3000);

    } catch (error) {
      console.error('Error scheduling consultation:', error);
      toast({
        title: "Error",
        description: "Failed to schedule consultation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    const requiredFields = currentStepData.fields.filter(field => field.required);
    return requiredFields.every(field => {
      const value = offerData[field.key];
      return value !== undefined && value !== '' && value !== null;
    });
  };

  const renderField = (field: any) => {
    const value = offerData[field.key];

    if (field.type === 'select') {
      return (
        <div key={field.key} className="space-y-2">
          <label className="text-sm font-medium text-gray-700">{field.label}</label>
          <div className="grid gap-2">
            {field.options.map((option: any) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleInputChange(field.key, option.value)}
                className={`p-3 text-left rounded-xl border transition-all duration-200 ${
                  value === option.value
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500'
                    : 'bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (field.type === 'textarea') {
      return (
        <div key={field.key} className="space-y-2">
          <label className="text-sm font-medium text-gray-700">{field.label}</label>
          <textarea
            value={value || ''}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
        </div>
      );
    }

    return (
      <div key={field.key} className="space-y-2">
        <label className="text-sm font-medium text-gray-700">{field.label}</label>
        <div className="relative">
          {field.prefix && (
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              {field.prefix}
            </span>
          )}
          <Input
            type={field.type}
            value={value || ''}
            onChange={(e) => {
              const val = field.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value;
              handleInputChange(field.key, val);
            }}
            placeholder={field.placeholder}
            className={`w-full ${field.prefix ? 'pl-8' : ''} border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
          />
        </div>
      </div>
    );
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-lg border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">You're All Set! 🎉</h3>
            <p className="text-gray-600 mb-4">
              Your consultation has been scheduled! Check your email for all the details.
            </p>
            <p className="text-sm text-gray-500">
              Our expert will help you create an amazing offer strategy for {propertyAddress}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
              <span>Offer Consultation</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Let's Get You Ready! 🏠
            </h1>
            <p className="text-gray-600">
              Preparing your consultation for <span className="font-medium">{propertyAddress}</span>
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Step {currentStep + 1} of {formSteps.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentStep + 1) / formSteps.length) * 100)}% complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / formSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Main Form */}
          <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <h2 className="text-xl font-semibold text-gray-900">{currentStepData.title}</h2>
              <p className="text-gray-600 text-sm">{currentStepData.subtitle}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStepData.id === 'scheduling' ? (
                <div className="space-y-4">
                  <p className="text-center text-gray-600 mb-6">Choose a time that works best for you:</p>
                  <div className="grid gap-3 max-h-96 overflow-y-auto">
                    {availableSlots.slice(0, 12).map((slot, index) => {
                      const formatDate = (date: Date) => date.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      });
                      const formatTime = (date: Date) => date.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      });

                      return (
                        <button
                          key={index}
                          onClick={() => handleScheduleSlot(slot)}
                          disabled={isSubmitting}
                          className="w-full p-4 text-left bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50"
                        >
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-purple-600" />
                            <div>
                              <div className="font-medium text-gray-900">
                                {formatDate(slot.datetime)}
                              </div>
                              <div className="text-sm text-gray-600">
                                {formatTime(slot.datetime)}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {currentStepData.fields.map(renderField)}
                </div>
              )}

              {/* Navigation */}
              {currentStepData.id !== 'scheduling' && (
                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PromptDrivenOfferForm;