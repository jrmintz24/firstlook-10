
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PropertyRequestFormData } from "@/types/propertyRequest";
import { Calendar, Clock } from "lucide-react";

interface SchedulingStepProps {
  formData: PropertyRequestFormData;
  onInputChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const SchedulingStep = ({ formData, onInputChange, onNext, onBack }: SchedulingStepProps) => {
  const validProperties = formData.properties?.filter(p => p.address.trim()) || [];
  const hasSingleProperty = formData.propertyAddress?.trim();
  const hasValidProperties = validProperties.length > 0 || hasSingleProperty;

  const canProceed = hasValidProperties && formData.preferredDate1 && formData.preferredTime1;

  return (
    <div className="space-y-6">
      {/* Properties Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Properties for Tour:</h3>
        {validProperties.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {validProperties.map((property, index) => (
              <li key={index} className="text-gray-700">{property.address}</li>
            ))}
          </ul>
        ) : hasSingleProperty ? (
          <p className="text-gray-700">{formData.propertyAddress}</p>
        ) : (
          <p className="text-gray-500">No properties selected</p>
        )}
      </div>

      {/* Scheduling Form */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="preferredDate1" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Preferred Date
            </Label>
            <Input
              id="preferredDate1"
              type="date"
              value={formData.preferredDate1}
              onChange={(e) => onInputChange('preferredDate1', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div>
            <Label htmlFor="preferredTime1" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Preferred Time
            </Label>
            <Input
              id="preferredTime1"
              type="time"
              value={formData.preferredTime1}
              onChange={(e) => onInputChange('preferredTime1', e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Any special requests or information for your showing..."
            value={formData.notes}
            onChange={(e) => onInputChange('notes', e.target.value)}
            rows={3}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!canProceed}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Review Tour Request
        </Button>
      </div>
    </div>
  );
};

export default SchedulingStep;
