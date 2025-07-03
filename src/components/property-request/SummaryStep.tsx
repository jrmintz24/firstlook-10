import React from "react";
import { Button } from "@/components/ui/button";
import { PropertyRequestFormData } from "@/types/propertyRequest";
import { Calendar, Clock, MapPin, FileText, User } from "lucide-react";

interface SummaryStepProps {
  formData: PropertyRequestFormData;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  authLoading: boolean;
  profileReady: boolean;
}

const SummaryStep = ({ 
  formData, 
  onBack, 
  onSubmit, 
  isSubmitting, 
  authLoading,
  profileReady 
}: SummaryStepProps) => {
  const validProperties = formData.properties?.filter(p => p.address.trim()) || [];

  return (
    <div className="space-y-6">
      {/* Profile Status */}
      {!authLoading && (
        <div className="flex items-center space-x-2 text-sm">
          <User className="h-4 w-4" />
          <span className={profileReady ? "text-green-600" : "text-yellow-600"}>
            {profileReady ? "Profile ready" : "Setting up profile..."}
          </span>
        </div>
      )}

      {/* Properties */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          Properties ({validProperties.length})
        </h3>
        {validProperties.map((property, index) => (
          <div key={index} className="bg-gray-50 p-3 rounded-lg mb-2">
            <p className="font-medium">{property.address}</p>
            {property.notes && (
              <p className="text-sm text-gray-600 mt-1">{property.notes}</p>
            )}
          </div>
        ))}
      </div>

      {/* Schedule */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          Preferred Schedule
        </h3>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-gray-500" />
              <span>{formData.preferredDate1 || "No date selected"}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-gray-500" />
              <span>{formData.preferredTime1 || "No time selected"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      {formData.notes && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Additional Notes
          </h3>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-700">{formData.notes}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
          Back
        </Button>
        <Button 
          onClick={onSubmit} 
          disabled={isSubmitting || authLoading || !profileReady}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? "Submitting..." : "Submit Tour Request"}
        </Button>
      </div>
    </div>
  );
};

export default SummaryStep;
