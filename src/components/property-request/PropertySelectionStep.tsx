
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { PropertyRequestFormData } from "@/hooks/usePropertyRequest";

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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          Select Properties for Your Tour
        </CardTitle>
        <CardDescription>
          Add up to 3 homes to your tour session (save time and money!)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {formData.selectedProperties.length > 0 && (
          <div className="space-y-2">
            <Label className="font-medium">Selected Properties:</Label>
            {formData.selectedProperties.map((property, index) => (
              <div key={index} className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                <span className="text-sm font-medium text-green-800">{property}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveProperty(property)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}

        <AddressAutocomplete
          value={formData.propertyAddress}
          onChange={(value) => onInputChange('propertyAddress', value)}
          placeholder="123 Main St, Washington, DC 20001"
          label="Property Address"
          id="propertyAddress"
        />
        <div className="text-center text-gray-500">— OR —</div>
        <div>
          <Label htmlFor="mlsId">MLS ID</Label>
          <Input
            id="mlsId"
            placeholder="DC1234567"
            value={formData.mlsId}
            onChange={(e) => onInputChange('mlsId', e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          {formData.selectedProperties.length < 3 && (
            <Button 
              onClick={onAddProperty} 
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={!formData.propertyAddress && !formData.mlsId}
            >
              Add Property ({formData.selectedProperties.length}/3)
            </Button>
          )}
          {formData.selectedProperties.length > 0 && (
            <Button onClick={onNext} className="flex-1 bg-blue-600 hover:bg-blue-700">
              Continue to Scheduling
            </Button>
          )}
        </div>

        {formData.selectedProperties.length === 0 && (formData.propertyAddress || formData.mlsId) && (
          <Button onClick={onNext} className="w-full bg-blue-600 hover:bg-blue-700">
            Continue with Single Property
          </Button>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">💡 Pro Tip</h4>
          <p className="text-sm text-blue-700">
            Add multiple homes to one session to save money! A 3-home session costs less than 3 individual tours.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertySelectionStep;
