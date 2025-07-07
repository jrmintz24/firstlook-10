import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useShowingSubmission } from "@/hooks/useShowingSubmission";
import { PropertyRequestFormData, PropertyEntry } from "@/types/propertyRequest";
import { useShowingEligibility } from "@/hooks/useShowingEligibility";
import AddressAutocomplete from "./AddressAutocomplete";

interface PropertyRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => Promise<void>;
}

const PropertyRequestForm = ({ isOpen, onClose, onSuccess }: PropertyRequestFormProps) => {
  const [formData, setFormData] = useState<PropertyRequestFormData>({
    properties: [{ address: "", notes: "" }],
    preferredOptions: [{ date: "", time: "" }],
    notes: "",
    // Include all required legacy fields
    propertyAddress: "",
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

  const handleAddPreferredOption = () => {
    if (formData.preferredOptions.length >= 3) return;
    
    setFormData(prev => ({
      ...prev,
      preferredOptions: [...prev.preferredOptions, { date: "", time: "" }]
    }));
  };

  const handleRemovePreferredOption = (index: number) => {
    if (formData.preferredOptions.length <= 1) return;
    
    setFormData(prev => ({
      ...prev,
      preferredOptions: prev.preferredOptions.filter((_, i) => i !== index)
    }));
  };

  const handlePreferredOptionChange = (index: number, field: 'date' | 'time', value: string) => {
    setFormData(prev => ({
      ...prev,
      preferredOptions: prev.preferredOptions.map((option, i) => 
        i === index ? { ...option, [field]: value } : option
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasValidProperty = formData.properties.some(prop => prop.address.trim());
    if (!hasValidProperty) {
      return;
    }

    await submitShowingRequests(formData);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      properties: [{ address: "", notes: "" }],
      preferredOptions: [{ date: "", time: "" }],
      notes: "",
      propertyAddress: "",
      preferredDate1: "",
      preferredTime1: "",
      preferredDate2: "",
      preferredTime2: "",
      preferredDate3: "",
      preferredTime3: "",
      selectedProperties: []
    });
    onClose();
  };

  const isMultipleProperties = formData.properties.length > 1;
  const canAddMoreProperties = eligibility?.eligible && eligibility.reason === 'subscribed';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request a Property Tour</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Properties Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Properties to Tour</Label>
              {canAddMoreProperties && formData.properties.length < 3 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddProperty}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Property
                </Button>
              )}
            </div>

            {formData.properties.map((property, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="font-medium">Property {index + 1}</Label>
                  {formData.properties.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveProperty(index)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <AddressAutocomplete
                    value={property.address}
                    onChange={(value) => handlePropertyChange(index, 'address', value)}
                    placeholder="Enter property address..."
                    label="Property Address *"
                    id={`address-${index}`}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`property-notes-${index}`}>Notes for this property (optional)</Label>
                  <Textarea
                    id={`property-notes-${index}`}
                    value={property.notes}
                    onChange={(e) => handlePropertyChange(index, 'notes', e.target.value)}
                    placeholder="Any specific notes about this property..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            ))}

            {isMultipleProperties && !canAddMoreProperties && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Multiple properties in one tour session require a subscription. 
                  <span className="font-medium"> Upgrade to add more properties!</span>
                </p>
              </div>
            )}
          </div>

          {/* Preferred Times Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Preferred Tour Times</Label>
              {formData.preferredOptions.length < 3 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddPreferredOption}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Option
                </Button>
              )}
            </div>

            {formData.preferredOptions.map((option, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="font-medium">Option {index + 1}</Label>
                  {formData.preferredOptions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemovePreferredOption(index)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Preferred Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !option.date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {option.date ? format(new Date(option.date), "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={option.date ? new Date(option.date) : undefined}
                          onSelect={(date) => 
                            handlePreferredOptionChange(index, 'date', date ? date.toISOString() : '')
                          }
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`time-${index}`}>Preferred Time</Label>
                    <Input
                      id={`time-${index}`}
                      type="time"
                      value={option.time}
                      onChange={(e) => handlePreferredOptionChange(index, 'time', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* General Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any special requests or additional information..."
              className="min-h-[100px]"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.properties.some(p => p.address.trim())}
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyRequestForm;
