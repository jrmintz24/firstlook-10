
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import PropertyInfoStep from "./PropertyInfoStep";
import SchedulingStep from "./SchedulingStep";
import DetailsStep from "./DetailsStep";

interface PropertyRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const PropertyRequestForm = ({ isOpen, onClose }: PropertyRequestFormProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    propertyAddress: '',
    mlsId: '',
    preferredDates: [null, null, null] as (Date | null)[],
    preferredTimes: ['', '', ''],
    notes: '',
    contactMethod: 'email'
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (index: number, date: Date | undefined) => {
    setFormData(prev => {
      const newDates = [...prev.preferredDates];
      newDates[index] = date || null;
      return { ...prev, preferredDates: newDates };
    });
  };

  const handleTimeChange = (index: number, time: string) => {
    setFormData(prev => {
      const newTimes = [...prev.preferredTimes];
      newTimes[index] = time;
      return { ...prev, preferredTimes: newTimes };
    });
  };

  const handleNext = () => {
    if (step === 1 && !formData.propertyAddress && !formData.mlsId) {
      toast({
        title: "Property Required",
        description: "Please provide either a property address or MLS ID",
        variant: "destructive"
      });
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Request Submitted! 🎉",
      description: "We'll match you with a showing partner and send confirmation within 24 hours.",
    });
    onClose();
    setStep(1);
    setFormData({
      propertyAddress: '',
      mlsId: '',
      preferredDates: [null, null, null],
      preferredTimes: ['', '', ''],
      notes: '',
      contactMethod: 'email'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🏠 Request Your Free Showing
          </DialogTitle>
          <DialogDescription>
            Step {step} of 3 - Let's get you scheduled for your first free private showing
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <PropertyInfoStep
            formData={formData}
            onInputChange={handleInputChange}
            onNext={handleNext}
          />
        )}

        {step === 2 && (
          <SchedulingStep
            formData={formData}
            onDateChange={handleDateChange}
            onTimeChange={handleTimeChange}
            onNext={handleNext}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <DetailsStep
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onBack={() => setStep(2)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PropertyRequestForm;
