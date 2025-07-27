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
        <div key={field.key} className="space-y-4">
          <label className="block text-lg font-semibold text-gray-800 mb-2">{field.label}</label>
          <div className="grid gap-3">
            {field.options.map((option: any) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleInputChange(field.key, option.value)}
                className={`group relative p-5 text-left rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                  value === option.value
                    ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white border-violet-500 shadow-lg shadow-violet-500/30'
                    : 'bg-white/80 border-gray-200 hover:border-violet-300 hover:bg-violet-50/80 hover:shadow-lg hover:shadow-violet-500/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-lg">{option.label}</span>
                  <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                    value === option.value
                      ? 'border-white bg-white'
                      : 'border-gray-400 group-hover:border-violet-500'
                  }`}>
                    {value === option.value && (
                      <div className="w-full h-full rounded-full bg-violet-500 scale-75"></div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (field.type === 'textarea') {
      return (
        <div key={field.key} className="space-y-4">
          <label className="block text-lg font-semibold text-gray-800">{field.label}</label>
          <div className="relative">
            <textarea
              value={value || ''}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-0 focus:border-violet-500 resize-none text-gray-800 placeholder-gray-400 transition-all duration-300 hover:border-gray-300"
            />
          </div>
        </div>
      );
    }

    return (
      <div key={field.key} className="space-y-4">
        <label className="block text-lg font-semibold text-gray-800">{field.label}</label>
        <div className="relative">
          {field.prefix && (
            <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-violet-600 text-lg font-semibold">
              {field.prefix}
            </span>
          )}
          <input
            type={field.type}
            value={value || ''}
            onChange={(e) => {
              const val = field.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value;
              handleInputChange(field.key, val);
            }}
            placeholder={field.placeholder}
            className={`w-full ${field.prefix ? 'pl-12' : 'pl-5'} pr-5 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-0 focus:border-violet-500 text-gray-800 placeholder-gray-400 text-lg transition-all duration-300 hover:border-gray-300 hover:bg-white`}
          />
        </div>
      </div>
    );
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/50 to-rose-50 relative overflow-hidden flex items-center justify-center p-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative z-10 w-full max-w-lg">
          <div className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl shadow-green-500/10 rounded-3xl overflow-hidden">
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/30 animate-bounce">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
                You're All Set! 🎉
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto mb-6 rounded-full"></div>
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                Your consultation has been scheduled! Check your email for all the details.
              </p>
              <div className="bg-gradient-to-r from-gray-50 to-purple-50/50 border border-gray-200/50 rounded-2xl p-6">
                <p className="text-gray-600 leading-relaxed">
                  Our expert will help you create an amazing offer strategy for{' '}
                  <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {propertyAddress}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/50 to-rose-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl text-sm font-semibold mb-6 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>Offer Consultation</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent mb-4 tracking-tight">
                Let's Get You Ready
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6 rounded-full"></div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Preparing your expert consultation for{' '}
                <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {propertyAddress}
                </span>
              </p>
            </div>

            {/* Progress */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-700 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                    Step {currentStep + 1} of {formSteps.length}
                  </span>
                  <div className="hidden sm:flex items-center gap-2">
                    {Array.from({ length: formSteps.length }).map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-500 ${
                          index <= currentStep 
                            ? 'bg-gradient-to-r from-violet-500 to-purple-500 shadow-lg shadow-purple-500/30 scale-110' 
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-500 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full">
                  {Math.round(((currentStep + 1) / formSteps.length) * 100)}% complete
                </span>
              </div>
              <div className="relative w-full bg-gray-200/60 backdrop-blur-sm rounded-full h-3 shadow-inner">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700 ease-out shadow-lg shadow-purple-500/30"
                  style={{ width: `${((currentStep + 1) / formSteps.length) * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg shadow-purple-500/50 border-2 border-purple-500"></div>
                </div>
              </div>
            </div>

            {/* Main Form */}
            <div className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl shadow-purple-500/10 rounded-3xl overflow-hidden">
              <div className="relative">
                {/* Gradient header */}
                <div className="bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-pink-500/10 px-8 py-8 text-center border-b border-purple-100/50">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                    {currentStepData.title}
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed">{currentStepData.subtitle}</p>
                </div>
                
                <div className="p-8 space-y-8">
                {currentStepData.id === 'scheduling' ? (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
                        <Calendar className="h-8 w-8 text-white" />
                      </div>
                      <p className="text-xl text-gray-700 font-medium">Choose your perfect time</p>
                      <p className="text-gray-500 mt-2">All times are in your local timezone</p>
                    </div>
                    <div className="grid gap-4 max-h-96 overflow-y-auto pr-2">
                      {availableSlots.slice(0, 12).map((slot, index) => {
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

                        return (
                          <button
                            key={index}
                            onClick={() => handleScheduleSlot(slot)}
                            disabled={isSubmitting}
                            className="group w-full p-6 text-left bg-gradient-to-r from-white to-gray-50/50 border border-gray-200/60 rounded-2xl hover:from-violet-50 hover:to-purple-50 hover:border-violet-300 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-violet-100 to-purple-100 group-hover:from-violet-200 group-hover:to-purple-200 rounded-xl flex items-center justify-center transition-all duration-300">
                                <Calendar className="h-6 w-6 text-violet-600 group-hover:text-violet-700" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900 text-lg group-hover:text-violet-900 transition-colors">
                                  {formatDate(slot.datetime)}
                                </div>
                                <div className="text-gray-600 text-base group-hover:text-violet-700 transition-colors">
                                  {formatTime(slot.datetime)}
                                </div>
                              </div>
                              <div className="w-6 h-6 border-2 border-gray-300 group-hover:border-violet-500 rounded-full group-hover:bg-violet-500 transition-all duration-300">
                                <div className="w-full h-full rounded-full bg-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                  <div className="flex justify-between pt-8 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={currentStep === 0}
                      className="flex items-center gap-3 px-6 py-3 bg-white/80 border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                    >
                      <ArrowLeft className="h-5 w-5" />
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!isStepValid()}
                      className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 rounded-2xl font-semibold text-white shadow-lg shadow-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-violet-500/40"
                    >
                      Next
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptDrivenOfferForm;