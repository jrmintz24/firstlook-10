
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { PropertyRequestFormData } from "@/types/propertyRequest";
import { useAuth } from "@/contexts/AuthContext";

interface PropertySelectionStepProps {
  formData: PropertyRequestFormData;
  onInputChange: (field: string, value: string) => void;
  onAddProperty: () => void;
  onRemoveProperty: (property: string) => void;
  onNext: () => void;
}

const PropertySelectionStep = ({
  formData,
  onInputChange,
  onAddProperty,
  onRemoveProperty,
  onNext
}: PropertySelectionStepProps) => {
  const { user } = useAuth();
  
  // Use the new properties array structure
  const hasProperties = formData.properties.length > 0 && formData.properties[0].address.trim() !== '';
  const hasSingleProperty = formData.propertyAddress;
  const canProceed = hasProperties || hasSingleProperty;

  // For non-authenticated users, limit to single property selection
  const canAddMoreProperties = user && formData.properties.length < 3 && formData.properties.filter(p => p.address.trim()).length < 3;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MapPin className="h-6 w-6 text-blue-600" />
          </div>
          {user ? "Select Properties for Your Tour" : "Select Property for Your Free Tour"}
        </CardTitle>
        <CardDescription className="text-gray-600 mt-2">
          {user 
            ? "Add 1-3 homes to your tour session (save time and money with multiple properties!)"
            : "Choose the home you'd like to tour for your free showing"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Show added properties from the properties array */}
        {hasProperties && (
          <div className="space-y-3">
            <Label className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Selected Properties:</Label>
            <div className="space-y-2">
              {formData.properties
                .filter(property => property.address.trim())
                .map((property, index) => (
                <div key={index} className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 group hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-700 font-semibold text-sm">{index + 1}</span>
                    </div>
                    <span className="text-sm font-medium text-green-800">{property.address}</span>
                  </div>
                  {user && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveProperty(property.address)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <AddressAutocomplete
            value={formData.propertyAddress}
            onChange={(value) => onInputChange('propertyAddress', value)}
            placeholder="Enter the full property address"
            label="Property Address"
            id="propertyAddress"
          />
        </div>

        <div className="flex gap-3">
          {canAddMoreProperties && formData.propertyAddress && (
            <Button 
              onClick={onAddProperty} 
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Add Property ({formData.properties.filter(p => p.address.trim()).length}/3)
            </Button>
          )}
          {canProceed && (
            <Button 
              onClick={onNext} 
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Continue to Scheduling
            </Button>
          )}
        </div>

        {user && hasProperties && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              💡 Tour Session Ready
            </h4>
            <p className="text-sm text-blue-700">
              You can add more properties or continue with your current selection. 
              {formData.properties.filter(p => p.address.trim()).length < 3 && " Adding more homes to one session saves money!"}
            </p>
          </div>
        )}

        {!user && !hasProperties && hasSingleProperty && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
              🎉 Free Tour Ready
            </h4>
            <p className="text-sm text-green-700">
              Perfect! Your free showing is ready to be scheduled. After signing up, you can book additional tours with our subscription plans.
            </p>
          </div>
        )}

        {user && !hasProperties && hasSingleProperty && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-xl border border-amber-200">
            <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
              💡 Pro Tip
            </h4>
            <p className="text-sm text-amber-700">
              Add multiple homes to one session to save money! A multi-home session costs less than individual tours.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertySelectionStep;
