
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign } from "lucide-react";

interface PropertyInfoStepProps {
  formData: {
    propertyAddress: string;
    mlsId: string;
  };
  onInputChange: (field: string, value: string) => void;
  onNext: () => void;
}

const PropertyInfoStep = ({ formData, onInputChange, onNext }: PropertyInfoStepProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          Property Information
        </CardTitle>
        <CardDescription>
          Tell us which property you'd like to see
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="propertyAddress">Property Address</Label>
          <Input
            id="propertyAddress"
            placeholder="123 Main St, Washington, DC 20001"
            value={formData.propertyAddress}
            onChange={(e) => onInputChange('propertyAddress', e.target.value)}
          />
        </div>
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
        <Badge variant="secondary" className="bg-green-50 text-green-700">
          <DollarSign className="h-3 w-3 mr-1" />
          Your first showing is 100% FREE
        </Badge>
        <Button onClick={onNext} className="w-full bg-blue-600 hover:bg-blue-700">
          Continue
        </Button>
      </CardContent>
    </Card>
  );
};

export default PropertyInfoStep;
