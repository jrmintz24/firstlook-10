
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Clock, FileText, AlertTriangle, CheckCircle, Wifi } from "lucide-react";
import { PropertyRequestFormData } from "@/types/propertyRequest";

interface SummaryStepProps {
  formData: PropertyRequestFormData;
  onInputChange: (field: string, value: string) => void;
  onContinueToSubscriptions: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  subscriptionReadiness?: {
    canSubmitForms: boolean;
    isHealthy: boolean;
    errors: Array<{ name: string; error: string | null; retryCount: number }>;
  };
}

const SummaryStep = ({ 
  formData, 
  onContinueToSubscriptions, 
  onBack, 
  isSubmitting,
  subscriptionReadiness
}: SummaryStepProps) => {
  
  const allProperties = [
    // Include individual property address if it exists
    ...(formData.propertyAddress ? [{ address: formData.propertyAddress, notes: formData.notes }] : []),
    // Include properties from the properties array
    ...formData.properties
  ];

  // Remove duplicates
  const uniqueProperties = allProperties.filter((property, index, self) => 
    index === self.findIndex(p => p.address === property.address)
  );

  const getConnectionStatusInfo = () => {
    if (!subscriptionReadiness) return null;
    
    if (subscriptionReadiness.isHealthy) {
      return {
        icon: <CheckCircle className="h-4 w-4 text-green-600" />,
        text: "Connection stable",
        className: "bg-green-50 border-green-200 text-green-800"
      };
    } else if (subscriptionReadiness.canSubmitForms) {
      return {
        icon: <AlertTriangle className="h-4 w-4 text-amber-600" />,
        text: "Connection issues detected - may take longer to update",
        className: "bg-amber-50 border-amber-200 text-amber-800"
      };
    } else {
      return {
        icon: <Wifi className="h-4 w-4 text-red-600" />,
        text: "Connection problems - please try again",
        className: "bg-red-50 border-red-200 text-red-800"
      };
    }
  };

  const connectionStatus = getConnectionStatusInfo();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Your Tour Request</h3>
        <p className="text-gray-600">Please review the details before submitting</p>
      </div>

      {/* Connection Status */}
      {connectionStatus && (
        <Card className={`border ${connectionStatus.className.includes('green') ? 'border-green-200' : connectionStatus.className.includes('amber') ? 'border-amber-200' : 'border-red-200'}`}>
          <CardContent className="p-4">
            <div className={`flex items-center gap-2 text-sm ${connectionStatus.className}`}>
              {connectionStatus.icon}
              <span>{connectionStatus.text}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Properties Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-gray-600" />
            <h4 className="font-semibold text-gray-900">
              Properties ({uniqueProperties.length})
            </h4>
          </div>
          
          <div className="space-y-3">
            {uniqueProperties.map((property, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="font-medium text-gray-900">{property.address}</div>
                {property.notes && (
                  <div className="text-sm text-gray-600 mt-1">{property.notes}</div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-gray-600" />
            <h4 className="font-semibold text-gray-900">Preferred Schedule</h4>
          </div>
          
          <div className="space-y-2">
            {formData.preferredDate1 && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-900">
                  {new Date(formData.preferredDate1).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            )}
            
            {formData.preferredTime1 && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-gray-900">{formData.preferredTime1}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* General Notes */}
      {formData.notes && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-gray-600" />
              <h4 className="font-semibold text-gray-900">Additional Notes</h4>
            </div>
            <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{formData.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1"
        >
          Back
        </Button>
        <Button 
          onClick={onContinueToSubscriptions}
          disabled={isSubmitting || (subscriptionReadiness && !subscriptionReadiness.canSubmitForms && subscriptionReadiness.errors.length > 0)}
          className="flex-1 bg-black hover:bg-gray-800"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Submitting...
            </div>
          ) : (
            'Submit Tour Request'
          )}
        </Button>
      </div>

      {/* Warning for connection issues */}
      {subscriptionReadiness && !subscriptionReadiness.isHealthy && subscriptionReadiness.canSubmitForms && (
        <div className="text-center">
          <p className="text-sm text-amber-600">
            Your request will be submitted, but dashboard updates may be delayed due to connection issues.
          </p>
        </div>
      )}
    </div>
  );
};

export default SummaryStep;
