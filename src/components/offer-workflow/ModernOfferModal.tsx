import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar, Clock, User, MessageCircle, CheckCircle2, Home, DollarSign, Heart, Star, Target, AlertTriangle, ChevronRight, ArrowLeft, Info, HelpCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ModernOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyAddress: string;
  buyerId: string;
  agentId?: string;
}

const ModernOfferModal: React.FC<ModernOfferModalProps> = ({
  isOpen,
  onClose,
  propertyAddress,
  buyerId,
  agentId
}) => {
  const [currentStep, setCurrentStep] = useState(-1); // Start with welcome screen
  const [showWelcome, setShowWelcome] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formData, setFormData] = useState({
    // Consultation Scheduling
    urgency: 'within_24_hours',
    
    // Property & Market Context
    propertyFeedback: '',
    competitionConcerns: 'moderate',
    marketKnowledge: 'some',
    
    // Financial Readiness
    budgetConfidence: 'firm',
    maxComfortablePrice: '',
    downPaymentReady: false,
    financingSecured: 'pre_approved',
    
    // Offer Strategy Goals
    timeline: 'flexible',
    priorityConcerns: [] as string[],
    dealBreakers: '',
    winningFactors: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const steps = [
    {
      id: 'scheduling',
      title: 'Schedule Consultation',
      icon: Calendar,
      description: 'When can we connect?',
      contextBanner: 'We\'ll schedule a consultation to discuss your offer strategy. This usually takes 30-45 minutes and helps us craft a competitive offer.',
      celebration: '🎯 Great! Let\'s talk about this property next.'
    },
    {
      id: 'property',
      title: 'Property Thoughts',
      icon: Home,
      description: 'Your honest reaction',
      contextBanner: 'Your honest feedback helps us understand what you love and any concerns, so we can address them in your offer.',
      celebration: '💭 Perfect! Now let\'s review your financial position.'
    },
    {
      id: 'financial',
      title: 'Financial Position',
      icon: DollarSign,
      description: 'Your buying power',
      contextBanner: 'Understanding your budget and financing helps us determine the strongest offer amount and terms you\'re comfortable with.',
      celebration: '💪 Excellent! Finally, let\'s define your offer strategy.'
    },
    {
      id: 'strategy',
      title: 'Offer Goals',
      icon: Target,
      description: 'What matters most',
      contextBanner: 'These final questions help us prioritize what matters most to you, so we can balance price, certainty, and timing in your offer.',
      celebration: '🏆 All set! We have everything we need to create your winning offer.'
    }
  ];

  // Generate next 7 days for scheduling
  const getNext7Days = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      days.push({
        date: dateString,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate(),
        monthName: date.toLocaleDateString('en-US', { month: 'short' }),
        isToday: i === 0,
        isTomorrow: i === 1
      });
    }
    
    return days;
  };

  // Time slots for consultation
  const timeSlots = [
    { value: "9:00 AM", label: "9:00 AM" },
    { value: "9:30 AM", label: "9:30 AM" },
    { value: "10:00 AM", label: "10:00 AM" },
    { value: "10:30 AM", label: "10:30 AM" },
    { value: "11:00 AM", label: "11:00 AM" },
    { value: "11:30 AM", label: "11:30 AM" },
    { value: "12:00 PM", label: "12:00 PM" },
    { value: "12:30 PM", label: "12:30 PM" },
    { value: "1:00 PM", label: "1:00 PM" },
    { value: "1:30 PM", label: "1:30 PM" },
    { value: "2:00 PM", label: "2:00 PM" },
    { value: "2:30 PM", label: "2:30 PM" },
    { value: "3:00 PM", label: "3:00 PM" },
    { value: "3:30 PM", label: "3:30 PM" },
    { value: "4:00 PM", label: "4:00 PM" },
    { value: "4:30 PM", label: "4:30 PM" },
    { value: "5:00 PM", label: "5:00 PM" },
    { value: "5:30 PM", label: "5:30 PM" },
    { value: "6:00 PM", label: "6:00 PM" }
  ];

  const handleNext = () => {
    if (showWelcome) {
      setShowWelcome(false);
      setCurrentStep(0);
    } else if (currentStep < steps.length - 1) {
      // Show celebration for completed step
      const currentStepData = steps[currentStep];
      if (currentStepData?.celebration) {
        setCelebrationMessage(currentStepData.celebration);
        setShowCelebration(true);
        
        // Hide celebration after 2 seconds and move to next step
        setTimeout(() => {
          setShowCelebration(false);
          setCurrentStep(currentStep + 1);
        }, 2000);
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleWelcomeStart = () => {
    setShowWelcome(false);
    setCurrentStep(0);
  };

  const handlePrev = () => {
    if (currentStep === 0) {
      setShowWelcome(true);
      setCurrentStep(-1);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConcernToggle = (concern: string) => {
    setFormData(prev => ({
      ...prev,
      priorityConcerns: prev.priorityConcerns.includes(concern)
        ? prev.priorityConcerns.filter(c => c !== concern)
        : [...prev.priorityConcerns, concern]
    }));
  };

  const handleDateSelection = (dayDate: string) => {
    setSelectedDate(dayDate);
    setSelectedTime(''); // Reset time when date changes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Starting form submission with data:', {
        selectedDate,
        selectedTime,
        formData,
        buyerId,
        propertyAddress,
        agentId
      });

      // Create offer intent with simplified data
      console.log('*** UPDATED CODE *** Creating offer intent...');
      console.log('Raw input values:', { buyerId, agentId, propertyAddress });
      
      // Prepare offer intent data - use buyerId as fallback for agent_id to satisfy NOT NULL constraint
      const offerIntentData = {
        buyer_id: buyerId,
        agent_id: agentId || buyerId, // Use buyerId as fallback since agent_id is required in schema
        property_address: propertyAddress,
        offer_type: 'consultation_request'
      };
      
      console.log('Offer intent data being sent to database:', offerIntentData);
      console.log('agent_id value specifically:', offerIntentData.agent_id);
      
      const { data: offerIntent, error: offerError } = await supabase
        .from('offer_intents')
        .insert(offerIntentData)
        .select()
        .single();

      if (offerError) {
        console.error('Offer intent creation failed:', offerError);
        throw offerError;
      }
      
      console.log('Offer intent created successfully:', offerIntent);

      // Parse selected date and time to create a scheduled_at timestamp
      let scheduledAt = null;
      if (selectedDate && selectedTime) {
        try {
          const dateTime = new Date(`${selectedDate} ${selectedTime}`);
          if (!isNaN(dateTime.getTime())) {
            scheduledAt = dateTime.toISOString();
          }
        } catch (dateError) {
          console.warn('Could not parse date/time:', dateError);
        }
      }

      const bookingData = {
        buyer_id: buyerId,
        offer_intent_id: offerIntent.id,
        agent_id: agentId || buyerId, // Use buyerId as placeholder - will be updated when real agent is assigned
        status: 'scheduled', // Use 'scheduled' as it's a valid status for consultation_bookings
        scheduled_at: scheduledAt || new Date().toISOString(), // Provide default if no specific time selected
        buyer_notes: JSON.stringify({
          urgency: formData.urgency,
          preferred_date: selectedDate,
          preferred_time: selectedTime,
          property_feedback: formData.propertyFeedback,
          competition_concerns: formData.competitionConcerns,
          market_knowledge: formData.marketKnowledge,
          budget_confidence: formData.budgetConfidence,
          max_comfortable_price: formData.maxComfortablePrice,
          down_payment_ready: formData.downPaymentReady,
          financing_secured: formData.financingSecured,
          timeline: formData.timeline,
          priority_concerns: formData.priorityConcerns,
          deal_breakers: formData.dealBreakers,
          winning_factors: formData.winningFactors,
          property_address: propertyAddress,
          needs_agent_assignment: !agentId // Flag to indicate this consultation needs agent assignment
        })
      };

      console.log('Creating consultation booking with data:', bookingData);

      // Create consultation booking with correct schema
      const { error: bookingError } = await supabase
        .from('consultation_bookings')
        .insert(bookingData);

      if (bookingError) {
        console.error('Consultation booking creation failed:', bookingError);
        throw bookingError;
      }
      
      console.log('Consultation booking created successfully');

      setIsSuccess(true);
      
      toast({
        title: "Consultation Requested",
        description: "Your agent will contact you to confirm the details.",
      });

      // Auto close after 3 seconds
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setCurrentStep(-1);
        setShowWelcome(true);
        setSelectedDate('');
        setSelectedTime('');
        setFormData({
          urgency: 'within_24_hours',
          propertyFeedback: '',
          competitionConcerns: 'moderate',
          marketKnowledge: 'some',
          budgetConfidence: 'firm',
          maxComfortablePrice: '',
          downPaymentReady: false,
          financingSecured: 'pre_approved',
          timeline: 'flexible',
          priorityConcerns: [],
          dealBreakers: '',
          winningFactors: ''
        });
      }, 3000);

    } catch (error) {
      console.error('Error submitting consultation request:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      console.error('Error type:', typeof error);
      console.error('Error constructor:', error?.constructor?.name);
      
      // Log all error properties
      if (error && typeof error === 'object') {
        Object.keys(error).forEach(key => {
          console.error(`Error.${key}:`, (error as any)[key]);
        });
      }
      
      // More detailed error handling
      let errorMessage = "Something went wrong. Please try again.";
      if (error && typeof error === 'object') {
        if ('message' in error) {
          errorMessage = error.message;
        } else if ('error' in error) {
          errorMessage = error.error;
        } else if ('details' in error) {
          errorMessage = (error as any).details;
        } else if ('hint' in error) {
          errorMessage = (error as any).hint;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl">
          <div className="text-center py-10">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-black mb-4">Consultation Requested</h3>
            <p className="text-gray-600 mb-8 leading-relaxed max-w-sm mx-auto">
              Your agent will contact you to confirm your consultation for 
              <span className="font-medium text-black"> {propertyAddress}</span>.
            </p>
            <Button 
              onClick={onClose} 
              className="w-full bg-black hover:bg-gray-800 text-white border-0 h-12 font-medium"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Welcome screen
  if (showWelcome) {
    return (
      <TooltipProvider>
        <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl bg-white border-0 shadow-2xl">
          <div className="text-center py-8">
            <div className="relative mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <Target className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-black mb-4">
              Let's craft a winning offer for
            </h2>
            <p className="text-xl text-gray-700 font-medium mb-8">
              {propertyAddress}
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 text-left">
              <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Here's what we'll cover:
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Calendar className="w-3 h-3 text-blue-600" />
                  </div>
                  <div>
                    <span className="font-medium">Schedule consultation</span> - Find a time that works for you
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Home className="w-3 h-3 text-green-600" />
                  </div>
                  <div>
                    <span className="font-medium">Property feedback</span> - Share your honest thoughts and concerns
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <DollarSign className="w-3 h-3 text-orange-600" />
                  </div>
                  <div>
                    <span className="font-medium">Financial position</span> - Understand your buying power
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Target className="w-3 h-3 text-purple-600" />
                  </div>
                  <div>
                    <span className="font-medium">Offer strategy</span> - Define what matters most to you
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-8">
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Takes about 5-7 minutes to complete</span>
              </div>
            </div>
            
            <Button 
              onClick={handleWelcomeStart}
              className="w-full bg-black hover:bg-gray-800 text-white border-0 h-12 font-medium text-lg"
            >
              Let's Get Started
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      </TooltipProvider>
    );
  }

  // Celebration overlay
  if (showCelebration) {
    return (
      <TooltipProvider>
        <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl">
          <div className="text-center py-10">
            <div className="relative mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <Star className="w-4 h-4 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-black mb-4">
              {celebrationMessage}
            </h3>
            <div className="flex justify-center">
              <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full animate-pulse" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </TooltipProvider>
    );
  }

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData?.icon;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-0 shadow-xl">
          <DialogHeader className="space-y-6 border-b border-gray-50 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                <StepIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-black">{currentStepData.title}</DialogTitle>
                <p className="text-sm text-gray-500 mt-1">{currentStepData.description}</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-0 font-medium">
              {currentStep + 1} of {steps.length}
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-black">{propertyAddress}</span>
              <span className="text-gray-400">{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1">
              <div 
                className="bg-black h-1 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-center space-x-2">
            {steps.map((step, index) => {
              const StepIconSmall = step.icon;
              return (
                <div
                  key={step.id}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'bg-black text-white'
                      : index < currentStep
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <StepIconSmall className="w-3 h-3" />
                  <span className="text-xs font-medium hidden sm:inline">{step.title.split(' ')[0]}</span>
                </div>
              );
            })}
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-6">
          {/* Contextual Banner */}
          {currentStepData?.contextBanner && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Info className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-blue-900 text-sm leading-relaxed font-medium">
                  {currentStepData.contextBanner}
                </p>
              </div>
            </div>
          )}

          {/* Step 1: Consultation Scheduling */}
          {currentStep === 0 && (
            <div className="space-y-8">
              <div>
                <Label className="text-base font-medium text-black mb-4 block">How urgent is this?</Label>
                <RadioGroup
                  value={formData.urgency}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}
                  className="space-y-3"
                >
                  {[
                    { value: 'within_24_hours', label: 'Very urgent - within 24 hours', color: 'text-red-500', icon: AlertTriangle },
                    { value: 'within_2_days', label: 'Urgent - within 2 days', color: 'text-orange-500', icon: Clock },
                    { value: 'this_week', label: 'This week works', color: 'text-gray-600', icon: Calendar }
                  ].map((option) => {
                    const Icon = option.icon;
                    return (
                      <div key={option.value} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-2xl hover:border-gray-200 hover:bg-gray-50 transition-all duration-200">
                        <RadioGroupItem value={option.value} id={option.value} className="border-gray-300" />
                        <Icon className={`w-5 h-5 ${option.color}`} />
                        <label htmlFor={option.value} className="text-gray-900 font-medium flex-1 cursor-pointer">
                          {option.label}
                        </label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>

              {/* Date Selection */}
              <div>
                <Label className="text-base font-medium text-black mb-4 block">Select a day</Label>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                  {getNext7Days().map((day) => (
                    <button
                      key={day.date}
                      type="button"
                      onClick={() => handleDateSelection(day.date)}
                      className={`p-4 border rounded-2xl text-center transition-all duration-200 hover:border-gray-300 ${
                        selectedDate === day.date
                          ? 'bg-black text-white border-black shadow-lg'
                          : 'border-gray-100 text-gray-900 hover:bg-gray-50 hover:shadow-sm'
                      }`}
                    >
                      <div className="text-xs text-gray-500 mb-1">
                        {day.isToday ? 'Today' : day.isTomorrow ? 'Tomorrow' : day.dayName}
                      </div>
                      <div className="text-lg font-semibold">{day.dayNumber}</div>
                      <div className="text-xs text-gray-500">{day.monthName}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection - Only show if date is selected */}
              {selectedDate && (
                <div>
                  <Label className="text-base font-medium text-black mb-4 block">Available times</Label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.value}
                        type="button"
                        onClick={() => setSelectedTime(slot.value)}
                        className={`p-3 border rounded-xl text-center transition-all duration-200 hover:border-gray-300 ${
                          selectedTime === slot.value
                            ? 'bg-black text-white border-black shadow-md'
                            : 'border-gray-100 text-gray-900 hover:bg-gray-50 hover:shadow-sm'
                        }`}
                      >
                        <div className="text-sm font-medium">{slot.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Property Thoughts */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div>
                <Label htmlFor="propertyFeedback" className="text-base font-medium text-black mb-4 block">
                  What's your honest reaction to this property?
                </Label>
                <Textarea
                  id="propertyFeedback"
                  value={formData.propertyFeedback}
                  onChange={(e) => setFormData(prev => ({ ...prev, propertyFeedback: e.target.value }))}
                  placeholder="Example: 'I love the updated kitchen and master suite, but I'm concerned about the small backyard for our dog. The location is perfect for our commute to downtown, and the neighborhood feels safe. The price seems fair compared to similar homes we've seen.'"
                  rows={4}
                  className="resize-none border-gray-100 focus:border-blue-400 focus:ring-blue-100 rounded-xl transition-colors"
                  required
                />
              </div>

              <div>
                <Label className="text-base font-medium text-black mb-4 block">How competitive is this market?</Label>
                <RadioGroup
                  value={formData.competitionConcerns}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, competitionConcerns: value }))}
                  className="space-y-3"
                >
                  {[
                    { value: 'high', label: 'Very competitive - expect multiple offers', color: 'text-red-500' },
                    { value: 'moderate', label: 'Some competition likely', color: 'text-orange-500' },
                    { value: 'low', label: 'Not much competition expected', color: 'text-green-500' },
                    { value: 'unsure', label: 'I have no idea - please advise!', color: 'text-gray-500' }
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-2xl hover:border-gray-200 hover:bg-gray-50 transition-all duration-200">
                      <RadioGroupItem value={option.value} id={option.value} className="border-gray-300" />
                      <label htmlFor={option.value} className="text-gray-900 font-medium flex-1 cursor-pointer">
                        {option.label}
                      </label>
                      <div className={`w-3 h-3 rounded-full ${option.color.replace('text-', 'bg-')}`} />
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium text-black mb-4 block">Your market knowledge</Label>
                <Select value={formData.marketKnowledge} onValueChange={(value) => setFormData(prev => ({ ...prev, marketKnowledge: value }))}>
                  <SelectTrigger className="border-gray-100 focus:border-blue-400 focus:ring-blue-100 h-12 rounded-xl transition-colors">
                    <SelectValue placeholder="How familiar are you with this area?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expert">Very familiar - I've been watching closely</SelectItem>
                    <SelectItem value="some">Some knowledge - looked at a few properties</SelectItem>
                    <SelectItem value="minimal">Limited knowledge - still learning</SelectItem>
                    <SelectItem value="none">No knowledge - this is all new</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: Financial Position */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div>
                <Label className="text-base font-medium text-black mb-4 block">Budget confidence</Label>
                <RadioGroup
                  value={formData.budgetConfidence}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, budgetConfidence: value }))}
                  className="space-y-3"
                >
                  {[
                    { value: 'firm', label: 'Very firm - I know exactly what I can afford' },
                    { value: 'flexible', label: 'Some flexibility - could stretch for the right property' },
                    { value: 'unsure', label: 'Unsure - need help understanding what I can afford' }
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                      <RadioGroupItem value={option.value} id={option.value} className="border-gray-300" />
                      <label htmlFor={option.value} className="text-black font-medium flex-1 cursor-pointer">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="maxPrice" className="text-base font-medium text-black mb-4 block">
                  Maximum comfortable price
                </Label>
                <Input
                  id="maxPrice"
                  value={formData.maxComfortablePrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxComfortablePrice: e.target.value }))}
                  placeholder="$650,000 (or 'I'm not sure yet - let's discuss' or 'Up to $700k for the right property')"
                  className="border-gray-100 focus:border-blue-400 focus:ring-blue-100 h-12 rounded-xl transition-colors"
                />
              </div>

              <div className="flex items-center space-x-3 p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">
                <Checkbox
                  id="downPaymentReady"
                  checked={formData.downPaymentReady}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, downPaymentReady: !!checked }))}
                  className="border-gray-300"
                />
                <Label htmlFor="downPaymentReady" className="text-gray-900 font-medium cursor-pointer flex items-center gap-2">
                  My down payment funds are ready and available
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>This means your down payment money is in accessible accounts (checking, savings, or money market) and ready to transfer when needed.</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
              </div>

              <div>
                <Label className="text-base font-medium text-black mb-4 block">Financing situation</Label>
                <RadioGroup
                  value={formData.financingSecured}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, financingSecured: value }))}
                  className="space-y-3"
                >
                  {[
                    { value: 'pre_approved', label: 'Pre-approved with a specific lender', tooltip: 'A lender has verified your income, assets, and credit and committed to a specific loan amount.' },
                    { value: 'pre_qualified', label: 'Pre-qualified but not fully approved yet', tooltip: 'Based on basic info you provided, a lender estimated what you might qualify for, but hasn\'t verified everything yet.' },
                    { value: 'cash', label: 'Cash buyer - no financing needed' },
                    { value: 'need_help', label: 'Haven\'t started the financing process yet' }
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                      <RadioGroupItem value={option.value} id={option.value} className="border-gray-300" />
                      <label htmlFor={option.value} className="text-gray-900 font-medium flex-1 cursor-pointer flex items-center gap-2">
                        {option.label}
                        {option.tooltip && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>{option.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Step 4: Offer Strategy Goals */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div>
                <Label className="text-base font-medium text-black mb-4 block">Timeline preference</Label>
                <RadioGroup
                  value={formData.timeline}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, timeline: value }))}
                  className="space-y-3"
                >
                  {[
                    { value: 'urgent', label: 'Need to move quickly - make offer ASAP' },
                    { value: 'flexible', label: 'Flexible - willing to negotiate timing' },
                    { value: 'patient', label: 'Patient - prefer to take time and negotiate carefully' }
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                      <RadioGroupItem value={option.value} id={option.value} className="border-gray-300" />
                      <label htmlFor={option.value} className="text-black font-medium flex-1 cursor-pointer">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium text-black mb-4 block">What matters most? (Select all that apply)</Label>
                <div className="space-y-3">
                  {[
                    { id: 'price', label: 'Getting the best possible price' },
                    { id: 'certainty', label: 'Certainty that my offer will be accepted' },
                    { id: 'timeline', label: 'Closing quickly' },
                    { id: 'contingencies', label: 'Protecting myself with contingencies', tooltip: 'Contingencies are conditions in your offer that let you back out if certain things aren\'t met (like inspection issues, financing problems, or appraisal coming in low).' },
                    { id: 'inspection', label: 'Having time for thorough inspection' },
                    { id: 'financing', label: 'Flexible financing terms' }
                  ].map((concern) => (
                    <div key={concern.id} className="flex items-center space-x-3 p-4 border border-gray-100 rounded-2xl hover:border-gray-200 hover:bg-gray-50 transition-all duration-200">
                      <Checkbox
                        id={concern.id}
                        checked={formData.priorityConcerns.includes(concern.id)}
                        onCheckedChange={(checked) => handleConcernToggle(concern.id)}
                        className="border-gray-300"
                      />
                      <Label htmlFor={concern.id} className="text-gray-900 font-medium cursor-pointer flex items-center gap-2">
                        {concern.label}
                        {concern.tooltip && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>{concern.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="dealBreakers" className="text-base font-medium text-black mb-4 block">
                  Any absolute deal-breakers?
                </Label>
                <Textarea
                  id="dealBreakers"
                  value={formData.dealBreakers}
                  onChange={(e) => setFormData(prev => ({ ...prev, dealBreakers: e.target.value }))}
                  placeholder="Example: 'Must keep inspection contingency - won't waive. Need to close before August 15th when school starts. Seller must handle any major repairs over $2,000. Won't compete in bidding wars above asking price.'"
                  rows={3}
                  className="resize-none border-gray-100 focus:border-blue-400 focus:ring-blue-100 rounded-xl transition-colors"
                />
              </div>

              <div>
                <Label htmlFor="winningFactors" className="text-base font-medium text-black mb-4 block">
                  What would make your offer stand out?
                </Label>
                <Textarea
                  id="winningFactors"
                  value={formData.winningFactors}
                  onChange={(e) => setFormData(prev => ({ ...prev, winningFactors: e.target.value }))}
                  placeholder="Example: 'Pre-approved with 20% down payment ready. Flexible on closing date (30-60 days). Writing a personal letter about why we love the home. Local buyers, no contingent sale. Can close quickly if needed.'"
                  rows={3}
                  className="resize-none border-gray-100 focus:border-blue-400 focus:ring-blue-100 rounded-xl transition-colors"
                />
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-100">
            {currentStep > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrev}
                className="flex-1 h-12 border-gray-200 text-black hover:bg-gray-50"
                disabled={isSubmitting}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1 h-12 bg-black hover:bg-gray-800 text-white"
                disabled={
                  (currentStep === 0 && (!selectedDate || !selectedTime)) ||
                  (currentStep === 1 && !formData.propertyFeedback)
                }
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="flex-1 h-12 bg-black hover:bg-gray-800 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Request Consultation
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </form>

        <div className="text-xs text-gray-400 text-center pt-4 border-t border-gray-100">
          <MessageCircle className="w-3 h-3 inline mr-1" />
          Your agent will use this information to prepare a personalized strategy
        </div>
      </DialogContent>
    </Dialog>
    </TooltipProvider>
  );
};

export default ModernOfferModal;