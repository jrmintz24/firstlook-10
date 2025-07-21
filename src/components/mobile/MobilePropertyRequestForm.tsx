import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, Trash2, Home, Calendar } from 'lucide-react';
import { useDeviceInfo } from '@/hooks/use-mobile';
import { useShowingSubmission } from '@/hooks/useShowingSubmission';
import { PropertyRequestFormData, PropertyEntry } from '@/types/propertyRequest';
import { useShowingEligibility } from '@/hooks/useShowingEligibility';
import MobileDateTimePicker from './MobileDateTimePicker';
import HybridAddressInput from '@/components/HybridAddressInput';

interface MobilePropertyRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => Promise<void>;
  initialPropertyAddress?: string;
}

const MobilePropertyRequestForm: React.FC<MobilePropertyRequestFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialPropertyAddress
}) => {
  const { isMobile } = useDeviceInfo();
  const [step, setStep] = useState<'properties' | 'timing' | 'notes'>('properties');
  const [formData, setFormData] = useState<PropertyRequestFormData>({
    properties: [{ address: initialPropertyAddress || "", notes: "" }],
    preferredOptions: [{ date: "", time: "" }],
    notes: "",
    propertyAddress: initialPropertyAddress || "",
    preferredDate1: "",
    preferredTime1: "",
    preferredDate2: "",
    preferredTime2: "",
    preferredDate3: "",
    preferredTime3: "",
    selectedProperties: []
  });

  const { eligibility } = useShowingEligibility();
  const { isSubmitting, submitShowingRequests } = useShowingSubmission(onSuccess);

  // Update form when initialPropertyAddress changes
  useEffect(() => {
    if (initialPropertyAddress && formData.properties[0].address !== initialPropertyAddress) {
      setFormData(prev => ({
        ...prev,
        properties: [{ address: initialPropertyAddress, notes: "" }, ...prev.properties.slice(1)],
        propertyAddress: initialPropertyAddress
      }));
    }
  }, [initialPropertyAddress]);

  const handleAddProperty = () => {
    if (formData.properties.length >= 3) return;
    
    setFormData(prev => ({
      ...prev,
      properties: [...prev.properties, { address: "", notes: "" }]
    }));
  };

  const handleRemoveProperty = (index: number) => {
    if (formData.properties.length <= 1) return;
    
    setFormData(prev => ({
      ...prev,
      properties: prev.properties.filter((_, i) => i !== index)
    }));
  };

  const handlePropertyChange = (index: number, field: keyof PropertyEntry, value: string) => {
    setFormData(prev => ({
      ...prev,
      properties: prev.properties.map((prop, i) => 
        i === index ? { ...prop, [field]: value } : prop
      )
    }));
  };

  const handleDateTimeChange = (index: number, date: string, time: string) => {
    setFormData(prev => {
      const newOptions = [...prev.preferredOptions];
      newOptions[index] = { date, time };
      
      // Update legacy fields for backward compatibility
      const updates: Partial<PropertyRequestFormData> = {
        preferredOptions: newOptions
      };
      
      if (index === 0) {
        updates.preferredDate1 = date;
        updates.preferredTime1 = time;
      } else if (index === 1) {
        updates.preferredDate2 = date;
        updates.preferredTime2 = time;
      } else if (index === 2) {
        updates.preferredDate3 = date;
        updates.preferredTime3 = time;
      }
      
      return { ...prev, ...updates };
    });
  };

  const addTimeOption = () => {
    if (formData.preferredOptions.length >= 3) return;
    
    setFormData(prev => ({
      ...prev,
      preferredOptions: [...prev.preferredOptions, { date: "", time: "" }]
    }));
  };

  const removeTimeOption = (index: number) => {
    if (formData.preferredOptions.length <= 1) return;
    
    setFormData(prev => ({
      ...prev,
      preferredOptions: prev.preferredOptions.filter((_, i) => i !== index)
    }));
  };

  const canProceedToTiming = formData.properties.some(prop => prop.address.trim() !== "");
  const canProceedToNotes = formData.preferredOptions.some(opt => opt.date && opt.time);
  const canSubmit = canProceedToTiming && canProceedToNotes;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      await submitShowingRequests(formData);
      onClose();
      setStep('properties');
    } catch (error) {
      console.error('Failed to submit showing request:', error);
    }
  };

  const handleNext = () => {
    if (step === 'properties' && canProceedToTiming) {
      setStep('timing');
    } else if (step === 'timing' && canProceedToNotes) {
      setStep('notes');
    }
  };

  const handleBack = () => {
    if (step === 'notes') {
      setStep('timing');
    } else if (step === 'timing') {
      setStep('properties');
    }
  };

  const stepTitles = {
    properties: 'Add Properties',
    timing: 'Preferred Times',
    notes: 'Additional Details'
  };

  const stepNumbers = {
    properties: 1,
    timing: 2,
    notes: 3
  };

  if (!isMobile) {
    return null; // Fall back to desktop form
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[95vh] p-0 gap-0 rounded-t-3xl rounded-b-none fixed bottom-0 left-0 right-0 top-auto data-[state=open]:slide-in-from-bottom-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {stepTitles[step]}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Step {stepNumbers[step]} of 3
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 flex space-x-2">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`flex-1 h-2 rounded-full ${
                  stepNumbers[step] >= num ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {step === 'properties' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Add up to 3 properties you'd like to tour
              </p>
              
              {formData.properties.map((property, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        Property {index + 1}
                      </span>
                    </div>
                    {formData.properties.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveProperty(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <HybridAddressInput
                    value={property.address}
                    onChange={(value) => handlePropertyChange(index, 'address', value)}
                    placeholder="Enter property address"
                    className="h-12"
                  />
                  
                  <Textarea
                    value={property.notes}
                    onChange={(e) => handlePropertyChange(index, 'notes', e.target.value)}
                    placeholder="Any specific notes about this property? (optional)"
                    className="min-h-[80px] resize-none"
                  />
                </div>
              ))}
              
              {formData.properties.length < 3 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddProperty}
                  className="w-full h-12 text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Property
                </Button>
              )}
            </div>
          )}

          {step === 'timing' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Choose your preferred tour times (up to 3 options)
              </p>
              
              {formData.preferredOptions.map((option, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        Option {index + 1}
                      </span>
                    </div>
                    {formData.preferredOptions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTimeOption(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <MobileDateTimePicker
                    selectedDate={option.date}
                    selectedTime={option.time}
                    onDateTimeChange={(date, time) => handleDateTimeChange(index, date, time)}
                    placeholder="Select date & time"
                  />
                </div>
              ))}
              
              {formData.preferredOptions.length < 3 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTimeOption}
                  className="w-full h-12 text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Time Option
                </Button>
              )}
            </div>
          )}

          {step === 'notes' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Any additional information for your agent? (optional)
              </p>
              
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="e.g., specific features you're interested in, questions about the property, accessibility needs..."
                className="min-h-[120px] resize-none"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-white space-y-3">
          <div className="flex gap-3">
            {step !== 'properties' && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex-1 h-12"
              >
                Back
              </Button>
            )}
            
            {step !== 'notes' ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={
                  (step === 'properties' && !canProceedToTiming) ||
                  (step === 'timing' && !canProceedToNotes)
                }
                className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
              >
                Continue
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit || isSubmitting}
                className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Tour Request'}
              </Button>
            )}
          </div>
          
          {/* Safe area for mobile devices */}
          <div className="h-safe-area-inset-bottom" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobilePropertyRequestForm;