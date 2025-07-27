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
import { Calendar, Clock, User, MessageCircle, CheckCircle2, Home, DollarSign, Heart, Star, Target, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImprovedOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyAddress: string;
  buyerId: string;
  agentId?: string;
}

const ImprovedOfferModal: React.FC<ImprovedOfferModalProps> = ({
  isOpen,
  onClose,
  propertyAddress,
  buyerId,
  agentId
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Consultation Scheduling
    urgency: 'within_24_hours',
    preferredTimes: [] as string[],
    consultationNotes: '',
    
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
      description: 'When can we connect to discuss your offer strategy?'
    },
    {
      id: 'property',
      title: 'Property Thoughts',
      icon: Home,
      description: 'Share your honest reaction to the property'
    },
    {
      id: 'financial',
      title: 'Financial Position',
      icon: DollarSign,
      description: 'Help us understand your buying power'
    },
    {
      id: 'strategy',
      title: 'Offer Goals',
      icon: Target,
      description: 'What matters most in your offer strategy?'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTimeToggle = (time: string) => {
    setFormData(prev => ({
      ...prev,
      preferredTimes: prev.preferredTimes.includes(time)
        ? prev.preferredTimes.filter(t => t !== time)
        : [...prev.preferredTimes, time]
    }));
  };

  const handleConcernToggle = (concern: string) => {
    setFormData(prev => ({
      ...prev,
      priorityConcerns: prev.priorityConcerns.includes(concern)
        ? prev.priorityConcerns.filter(c => c !== concern)
        : [...prev.priorityConcerns, concern]
    }));
  };

  const generateTimeSlots = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const slots = [];
    
    // Today slots (if after 10 AM)
    if (today.getHours() < 18) {
      slots.push('Today - This Afternoon');
      slots.push('Today - This Evening');
    }
    
    // Tomorrow slots
    slots.push('Tomorrow - Morning (9-12pm)');
    slots.push('Tomorrow - Afternoon (1-5pm)');
    slots.push('Tomorrow - Evening (6-8pm)');
    
    // Day after tomorrow
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(tomorrow.getDate() + 1);
    const dayName = dayAfter.toLocaleDateString('en-US', { weekday: 'long' });
    slots.push(`${dayName} - Morning (9-12pm)`);
    slots.push(`${dayName} - Afternoon (1-5pm)`);
    
    return slots;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create offer intent with simplified data
      const { data: offerIntent, error: offerError } = await supabase
        .from('offer_intents')
        .insert({
          buyer_id: buyerId,
          agent_id: agentId || buyerId, // Use buyerId as fallback since agent_id is required in schema
          property_address: propertyAddress,
          offer_type: 'consultation_request',
          consultation_requested: true
        })
        .select()
        .single();

      if (offerError) throw offerError;

      // Create consultation booking with correct schema
      const { error: bookingError } = await supabase
        .from('consultation_bookings')
        .insert({
          buyer_id: buyerId,
          offer_intent_id: offerIntent.id,
          agent_id: agentId || buyerId, // Use buyerId as placeholder - will be updated when real agent is assigned
          status: 'requested',
          buyer_notes: JSON.stringify({
            urgency: formData.urgency,
            preferred_times: formData.preferredTimes,
            consultation_notes: formData.consultationNotes,
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
            property_address: propertyAddress
          })
        });

      if (bookingError) throw bookingError;

      setIsSuccess(true);
      
      toast({
        title: "Consultation Request Submitted!",
        description: "Your agent will contact you soon to schedule your strategy session.",
      });

      // Auto close after 3 seconds
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setCurrentStep(0);
        setFormData({
          urgency: 'within_24_hours',
          preferredTimes: [],
          consultationNotes: '',
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
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Consultation Requested!</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Your agent will contact you within the next few hours to schedule your personalized offer strategy session for 
              <span className="font-medium text-gray-900"> {propertyAddress}</span>.
            </p>
            <Button onClick={onClose} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              Perfect, thanks!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                <StepIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-gray-900">{currentStepData.title}</DialogTitle>
                <p className="text-sm text-gray-600">{currentStepData.description}</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs font-medium">
              {currentStep + 1} of {steps.length}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">{propertyAddress}</span>
              <span className="text-gray-500">{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Consultation Scheduling */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">How urgent is this offer discussion?</Label>
                <RadioGroup
                  value={formData.urgency}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}
                  className="space-y-3"
                >
                  {[
                    { value: 'within_24_hours', label: 'Very urgent - need to talk within 24 hours', color: 'text-red-600', icon: AlertTriangle },
                    { value: 'within_2_days', label: 'Urgent - within 2 days would be great', color: 'text-orange-600', icon: Clock },
                    { value: 'this_week', label: 'This week works fine', color: 'text-blue-600', icon: Calendar }
                  ].map((option) => {
                    const Icon = option.icon;
                    return (
                      <div key={option.value} className="flex items-center space-x-3">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Icon className={`w-4 h-4 ${option.color}`} />
                        <label htmlFor={option.value} className={`text-sm font-medium ${option.color}`}>
                          {option.label}
                        </label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">When are you typically available? (Select all that work)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {generateTimeSlots().map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => handleTimeToggle(slot)}
                      className={`p-3 text-sm border rounded-lg transition-all ${
                        formData.preferredTimes.includes(slot)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="consultationNotes" className="text-sm font-medium text-gray-700">Anything specific you want to discuss?</Label>
                <Textarea
                  id="consultationNotes"
                  value={formData.consultationNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, consultationNotes: e.target.value }))}
                  placeholder="e.g., concerns about pricing, timeline pressure, competing offers..."
                  rows={3}
                  className="mt-1 resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 2: Property Thoughts */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="propertyFeedback" className="text-sm font-medium text-gray-700">What's your honest reaction to this property?</Label>
                <Textarea
                  id="propertyFeedback"
                  value={formData.propertyFeedback}
                  onChange={(e) => setFormData(prev => ({ ...prev, propertyFeedback: e.target.value }))}
                  placeholder="e.g., I love the kitchen but concerned about the small backyard. The location is perfect for our commute..."
                  rows={4}
                  className="mt-1 resize-none"
                  required
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">How competitive do you think this market/property is?</Label>
                <RadioGroup
                  value={formData.competitionConcerns}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, competitionConcerns: value }))}
                  className="space-y-3"
                >
                  {[
                    { value: 'high', label: 'Very competitive - expect multiple offers', color: 'text-red-600' },
                    { value: 'moderate', label: 'Some competition likely', color: 'text-orange-600' },
                    { value: 'low', label: 'Not much competition expected', color: 'text-green-600' },
                    { value: 'unsure', label: 'I have no idea - please advise!', color: 'text-gray-600' }
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-3">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <label htmlFor={option.value} className={`text-sm font-medium ${option.color}`}>
                        {option.label}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">How familiar are you with this local market?</Label>
                <Select value={formData.marketKnowledge} onValueChange={(value) => setFormData(prev => ({ ...prev, marketKnowledge: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your market knowledge level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expert">Very familiar - I've been watching this area closely</SelectItem>
                    <SelectItem value="some">Some knowledge - I've looked at a few properties here</SelectItem>
                    <SelectItem value="minimal">Limited knowledge - still learning about the area</SelectItem>
                    <SelectItem value="none">No knowledge - this is all new to me</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: Financial Position */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">How confident are you in your budget range?</Label>
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
                    <div key={option.value} className="flex items-center space-x-3">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <label htmlFor={option.value} className="text-sm text-gray-700">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="maxPrice" className="text-sm font-medium text-gray-700">What's the absolute maximum you'd be comfortable paying?</Label>
                <Input
                  id="maxPrice"
                  value={formData.maxComfortablePrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxComfortablePrice: e.target.value }))}
                  placeholder="e.g., $650,000 (or 'I'm not sure')"
                  className="mt-1"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="downPaymentReady"
                  checked={formData.downPaymentReady}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, downPaymentReady: !!checked }))}
                />
                <Label htmlFor="downPaymentReady" className="text-sm text-gray-700">
                  My down payment funds are ready and available
                </Label>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">What's your financing situation?</Label>
                <RadioGroup
                  value={formData.financingSecured}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, financingSecured: value }))}
                  className="space-y-3"
                >
                  {[
                    { value: 'pre_approved', label: 'Pre-approved with a specific lender' },
                    { value: 'pre_qualified', label: 'Pre-qualified but not fully approved yet' },
                    { value: 'cash', label: 'Cash buyer - no financing needed' },
                    { value: 'need_help', label: 'Haven\'t started the financing process yet' }
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-3">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <label htmlFor={option.value} className="text-sm text-gray-700">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Step 4: Offer Strategy Goals */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">What's your timeline preference?</Label>
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
                    <div key={option.value} className="flex items-center space-x-3">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <label htmlFor={option.value} className="text-sm text-gray-700">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">What matters most to you in this offer? (Select all that apply)</Label>
                <div className="space-y-2">
                  {[
                    { id: 'price', label: 'Getting the best possible price' },
                    { id: 'certainty', label: 'Certainty that my offer will be accepted' },
                    { id: 'timeline', label: 'Closing quickly' },
                    { id: 'contingencies', label: 'Protecting myself with contingencies' },
                    { id: 'inspection', label: 'Having time for thorough inspection' },
                    { id: 'financing', label: 'Flexible financing terms' }
                  ].map((concern) => (
                    <div key={concern.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={concern.id}
                        checked={formData.priorityConcerns.includes(concern.id)}
                        onCheckedChange={(checked) => handleConcernToggle(concern.id)}
                      />
                      <Label htmlFor={concern.id} className="text-sm text-gray-700">
                        {concern.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="dealBreakers" className="text-sm font-medium text-gray-700">Any absolute deal-breakers for you?</Label>
                <Textarea
                  id="dealBreakers"
                  value={formData.dealBreakers}
                  onChange={(e) => setFormData(prev => ({ ...prev, dealBreakers: e.target.value }))}
                  placeholder="e.g., Won't waive inspection, must close before school starts, need seller to cover repairs..."
                  rows={3}
                  className="mt-1 resize-none"
                />
              </div>

              <div>
                <Label htmlFor="winningFactors" className="text-sm font-medium text-gray-700">What do you think would make your offer stand out?</Label>
                <Textarea
                  id="winningFactors"
                  value={formData.winningFactors}
                  onChange={(e) => setFormData(prev => ({ ...prev, winningFactors: e.target.value }))}
                  placeholder="e.g., Strong financing, flexible closing date, personal letter, cash down payment..."
                  rows={3}
                  className="mt-1 resize-none"
                />
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3 pt-4 border-t">
            {currentStep > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrev}
                className="flex-1"
                disabled={isSubmitting}
              >
                Previous
              </Button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={
                  (currentStep === 0 && formData.preferredTimes.length === 0) ||
                  (currentStep === 1 && !formData.propertyFeedback)
                }
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Requesting Consultation...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Request Consultation
                  </>
                )}
              </Button>
            )}
          </div>
        </form>

        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          <MessageCircle className="w-3 h-3 inline mr-1" />
          Your agent will use this information to prepare a personalized offer strategy for you
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImprovedOfferModal;