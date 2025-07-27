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
import { Calendar, Clock, User, MessageCircle, CheckCircle2, Home, DollarSign, Heart, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EnhancedOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyAddress: string;
  buyerId: string;
  agentId?: string;
}

const EnhancedOfferModal: React.FC<EnhancedOfferModalProps> = ({
  isOpen,
  onClose,
  propertyAddress,
  buyerId,
  agentId
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Contact Info
    contactName: '',
    email: '',
    phone: '',
    
    // Property Interest
    interestLevel: 'very_interested',
    priceRange: '',
    financingType: 'mortgage',
    downPayment: '',
    preApproved: false,
    
    // Offer Strategy
    timeframe: 'within_week',
    offerStrategy: 'competitive',
    maxPrice: '',
    contingencies: [] as string[],
    
    // Additional Info
    notes: '',
    tourCompleted: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const steps = [
    {
      id: 'contact',
      title: 'Contact Information',
      icon: User,
      description: 'Let us know how to reach you'
    },
    {
      id: 'interest',
      title: 'Property Interest',
      icon: Heart,
      description: 'Tell us about your interest in this property'
    },
    {
      id: 'financing',
      title: 'Financing Details',
      icon: DollarSign,
      description: 'Help us understand your financial situation'
    },
    {
      id: 'strategy',
      title: 'Offer Strategy',
      icon: Star,
      description: 'Let\'s plan your approach'
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

  const handleContingencyChange = (contingency: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      contingencies: checked
        ? [...prev.contingencies, contingency]
        : prev.contingencies.filter(c => c !== contingency)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create offer intent with detailed information
      const { data: offerIntent, error: offerError } = await supabase
        .from('offer_intents')
        .insert({
          buyer_id: buyerId,
          property_address: propertyAddress,
          offer_type: 'consultation_request',
          consultation_requested: true
        })
        .select()
        .single();

      if (offerError) throw offerError;

      // Create consultation booking with enhanced details
      const { error: bookingError } = await supabase
        .from('consultation_bookings')
        .insert({
          buyer_id: buyerId,
          offer_intent_id: offerIntent.id,
          agent_id: agentId || null,
          property_address: propertyAddress,
          preferred_timeframe: formData.timeframe,
          buyer_name: formData.contactName,
          buyer_email: formData.email,
          buyer_phone: formData.phone,
          special_requests: JSON.stringify({
            interest_level: formData.interestLevel,
            price_range: formData.priceRange,
            financing_type: formData.financingType,
            down_payment: formData.downPayment,
            pre_approved: formData.preApproved,
            offer_strategy: formData.offerStrategy,
            max_price: formData.maxPrice,
            contingencies: formData.contingencies,
            notes: formData.notes,
            tour_completed: formData.tourCompleted
          })
        });

      if (bookingError) throw bookingError;

      setIsSuccess(true);
      
      toast({
        title: "Consultation Request Submitted!",
        description: "Our team will contact you within 24 hours to discuss your offer strategy.",
      });

      // Auto close after 3 seconds
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setCurrentStep(0);
        setFormData({
          contactName: '',
          email: '',
          phone: '',
          interestLevel: 'very_interested',
          priceRange: '',
          financingType: 'mortgage',
          downPayment: '',
          preApproved: false,
          timeframe: 'within_week',
          offerStrategy: 'competitive',
          maxPrice: '',
          contingencies: [],
          notes: '',
          tourCompleted: false
        });
      }, 3000);

    } catch (error) {
      console.error('Error submitting offer request:', error);
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
                <Home className="w-4 h-4 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Consultation Request Submitted!</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Our expert team will contact you within 24 hours to discuss your personalized offer strategy for 
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

          {/* Step indicators */}
          <div className="flex items-center justify-center space-x-2">
            {steps.map((step, index) => {
              const StepIconSmall = step.icon;
              return (
                <div
                  key={step.id}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all ${
                    index === currentStep
                      ? 'bg-blue-100 text-blue-700'
                      : index < currentStep
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <StepIconSmall className="w-3 h-3" />
                  <span className="text-xs font-medium hidden sm:inline">{step.title.split(' ')[0]}</span>
                </div>
              );
            })}
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information Step */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.contactName}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                    placeholder="Your full name"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(555) 123-4567"
                    required
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                  required
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {/* Property Interest Step */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">How interested are you in this property?</Label>
                <RadioGroup
                  value={formData.interestLevel}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, interestLevel: value }))}
                  className="space-y-3"
                >
                  {[
                    { value: 'very_interested', label: 'Very interested - ready to make an offer', color: 'text-green-600' },
                    { value: 'interested', label: 'Interested - want to discuss options', color: 'text-blue-600' },
                    { value: 'considering', label: 'Considering - need more information', color: 'text-yellow-600' }
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
                <Label htmlFor="priceRange" className="text-sm font-medium text-gray-700">Your price range for this property</Label>
                <Select value={formData.priceRange} onValueChange={(value) => setFormData(prev => ({ ...prev, priceRange: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asking_price">At asking price</SelectItem>
                    <SelectItem value="below_asking">Below asking price</SelectItem>
                    <SelectItem value="above_asking">Above asking price</SelectItem>
                    <SelectItem value="unsure">I'm not sure yet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tourCompleted"
                  checked={formData.tourCompleted}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, tourCompleted: !!checked }))}
                />
                <Label htmlFor="tourCompleted" className="text-sm text-gray-700">
                  I have toured this property
                </Label>
              </div>
            </div>
          )}

          {/* Financing Details Step */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">How will you finance this purchase?</Label>
                <RadioGroup
                  value={formData.financingType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, financingType: value }))}
                  className="space-y-3"
                >
                  {[
                    { value: 'mortgage', label: 'Traditional mortgage financing' },
                    { value: 'cash', label: 'Cash purchase' },
                    { value: 'va_loan', label: 'VA loan' },
                    { value: 'fha_loan', label: 'FHA loan' },
                    { value: 'other', label: 'Other financing' }
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="downPayment" className="text-sm font-medium text-gray-700">Down payment amount</Label>
                  <Input
                    id="downPayment"
                    value={formData.downPayment}
                    onChange={(e) => setFormData(prev => ({ ...prev, downPayment: e.target.value }))}
                    placeholder="e.g., $50,000 or 20%"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center space-x-2 mt-6">
                  <Checkbox
                    id="preApproved"
                    checked={formData.preApproved}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, preApproved: !!checked }))}
                  />
                  <Label htmlFor="preApproved" className="text-sm text-gray-700">
                    I'm pre-approved for financing
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* Offer Strategy Step */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Preferred timeline for consultation</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'asap', label: 'ASAP', icon: Clock, desc: 'Within 24 hours' },
                    { value: 'within_week', label: 'This Week', icon: Calendar, desc: 'Next few days' },
                    { value: 'within_month', label: 'This Month', icon: Calendar, desc: 'No rush' }
                  ].map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, timeframe: option.value }))}
                        className={`p-4 rounded-lg border text-center transition-all ${
                          formData.timeframe === option.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <Icon className="w-5 h-5 mx-auto mb-2" />
                        <div className="text-sm font-medium">{option.label}</div>
                        <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label htmlFor="maxPrice" className="text-sm font-medium text-gray-700">Maximum you'd be willing to pay</Label>
                <Input
                  id="maxPrice"
                  value={formData.maxPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxPrice: e.target.value }))}
                  placeholder="e.g., $650,000"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Important contingencies (select all that apply)</Label>
                <div className="space-y-2">
                  {[
                    { id: 'inspection', label: 'Home inspection contingency' },
                    { id: 'financing', label: 'Financing contingency' },
                    { id: 'appraisal', label: 'Appraisal contingency' },
                    { id: 'sale_of_home', label: 'Sale of current home contingency' }
                  ].map((contingency) => (
                    <div key={contingency.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={contingency.id}
                        checked={formData.contingencies.includes(contingency.id)}
                        onCheckedChange={(checked) => handleContingencyChange(contingency.id, !!checked)}
                      />
                      <Label htmlFor={contingency.id} className="text-sm text-gray-700">
                        {contingency.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm font-medium text-gray-700">Additional notes or questions</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any specific concerns, questions, or requirements?"
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
                  (currentStep === 0 && (!formData.contactName || !formData.email || !formData.phone)) ||
                  (currentStep === 1 && !formData.priceRange)
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
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Request Consultation
                  </>
                )}
              </Button>
            )}
          </div>
        </form>

        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          <MessageCircle className="w-3 h-3 inline mr-1" />
          Our expert agents will contact you within 24 hours to discuss your personalized offer strategy
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedOfferModal;