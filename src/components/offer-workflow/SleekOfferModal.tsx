import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, ArrowRight, ArrowLeft, X } from 'lucide-react';
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

interface SleekOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyAddress: string;
  buyerId: string;
  agentId?: string;
}

const SleekOfferModal = ({
  isOpen,
  onClose,
  propertyAddress,
  buyerId,
  agentId
}: SleekOfferModalProps) => {
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
      title: 'Contact Information',
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
      title: 'Consultation Preference',
      fields: [
        {
          key: 'consultationType' as keyof OfferData,
          label: 'How would you like to meet?',
          type: 'select',
          options: [
            { value: 'video', label: 'Video Call' },
            { value: 'phone', label: 'Phone Call' }
          ],
          required: true
        }
      ]
    },
    {
      id: 'financial',
      title: 'Financial Details',
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
            { value: 'approved', label: 'Already pre-approved' },
            { value: 'pending', label: 'Application in progress' },
            { value: 'not_started', label: 'Haven\'t started yet' }
          ],
          required: true
        }
      ]
    },
    {
      id: 'strategy',
      title: 'Offer Strategy',
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
            { value: 'yes', label: 'Very flexible' },
            { value: 'somewhat', label: 'Somewhat flexible' },
            { value: 'no', label: 'Need specific date' }
          ],
          required: true
        }
      ]
    },
    {
      id: 'details',
      title: 'Additional Details',
      fields: [
        {
          key: 'inspectionDealBreakers' as keyof OfferData,
          label: 'Inspection Deal-Breakers (optional)',
          type: 'text',
          placeholder: 'e.g., foundation issues, roof problems',
          required: false
        },
        {
          key: 'specificQuestions' as keyof OfferData,
          label: 'Questions or Concerns (optional)',
          type: 'textarea',
          placeholder: 'Any specific questions about this property?',
          required: false
        }
      ]
    },
    {
      id: 'scheduling',
      title: 'Schedule Your Consultation',
      fields: []
    }
  ];

  // Generate available time slots
  useEffect(() => {
    if (!isOpen) return;
    
    const slots: Array<{datetime: Date, available: boolean}> = [];
    const now = new Date();
    
    for (let i = 1; i <= 10; i++) {
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
    
    setAvailableSlots(slots.slice(0, 12));
  }, [isOpen]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setIsComplete(false);
      setOfferData({
        contactName: '',
        contactPhone: '',
        consultationType: 'video',
        preApprovalStatus: 'not_started',
        flexibleClosingDate: 'somewhat',
        inspectionDealBreakers: '',
        specificQuestions: ''
      });
    }
  }, [isOpen]);

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
        title: "Consultation Scheduled!",
        description: `Your consultation is set for ${formatDate(finalDateTime)} at ${formatTime(finalDateTime)}`,
      });

      setIsComplete(true);
      
      setTimeout(() => {
        onClose();
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
          <div className="space-y-2">
            {field.options.map((option: any) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleInputChange(field.key, option.value)}
                className={`w-full p-3 text-left rounded-lg border transition-colors ${
                  value === option.value
                    ? 'bg-blue-50 border-blue-500 text-blue-900'
                    : 'bg-white border-gray-200 hover:border-gray-300'
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
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
            className={`${field.prefix ? 'pl-8' : ''} border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
        </div>
      </div>
    );
  };

  if (isComplete) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Consultation Scheduled!</h3>
            <p className="text-gray-600 mb-4">
              Check your email for confirmation details.
            </p>
            <p className="text-sm text-gray-500">
              Our expert will help you create a winning offer strategy for {propertyAddress}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold">Schedule Offer Consultation</DialogTitle>
              <p className="text-sm text-gray-600 mt-1">{propertyAddress}</p>
            </div>
            <Badge variant="secondary" className="text-xs">
              {currentStep + 1} of {formSteps.length}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / formSteps.length) * 100}%` }}
            />
          </div>

          {/* Form content */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">{currentStepData.title}</h3>
            
            {currentStepData.id === 'scheduling' ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">Choose a time that works for you:</p>
                <div className="grid gap-2 max-h-60 overflow-y-auto">
                  {availableSlots.map((slot, index) => {
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
                        className="w-full p-3 text-left bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50"
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900 text-sm">
                              {formatDate(slot.datetime)}
                            </div>
                            <div className="text-xs text-gray-600">
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
              <div className="space-y-4">
                {currentStepData.fields.map(renderField)}
              </div>
            )}
          </div>

          {/* Navigation */}
          {currentStepData.id !== 'scheduling' && (
            <div className="flex justify-between">
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
                className="flex items-center gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SleekOfferModal;