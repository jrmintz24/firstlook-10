
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyAnalysisData } from '@/hooks/useOfferQuestionnaire';

interface PropertyAnalysisStepProps {
  data: Partial<PropertyAnalysisData>;
  onComplete: (data: PropertyAnalysisData) => void;
  loading: boolean;
  propertyAddress: string;
}

const PropertyAnalysisStep = ({ data, onComplete, loading, propertyAddress }: PropertyAnalysisStepProps) => {
  const [formData, setFormData] = useState<PropertyAnalysisData>({
    propertyType: '',
    listingPrice: 0,
    marketConditions: 'balanced',
    neighborhoodTrends: '',
    ...data
  });

  const handleInputChange = (field: keyof PropertyAnalysisData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onComplete(formData);
  };

  const isFormValid = () => {
    return formData.propertyType &&
           formData.listingPrice > 0 &&
           formData.marketConditions;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Property Information</CardTitle>
          <p className="text-sm text-gray-600">Property: {propertyAddress}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type *</Label>
              <Select
                value={formData.propertyType}
                onValueChange={(value) => handleInputChange('propertyType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single_family_dc">Single Family - DC</SelectItem>
                  <SelectItem value="single_family_md">Single Family - Maryland</SelectItem>
                  <SelectItem value="townhouse_dc">Townhouse - DC</SelectItem>
                  <SelectItem value="townhouse_md">Townhouse - Maryland</SelectItem>
                  <SelectItem value="condo_dc">Condo - DC</SelectItem>
                  <SelectItem value="condo_md">Condo - Maryland</SelectItem>
                  <SelectItem value="coop_dc">Co-op - DC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="listingPrice">Current Listing Price *</Label>
              <Input
                id="listingPrice"
                type="number"
                placeholder="Listing price"
                value={formData.listingPrice || ''}
                onChange={(e) => handleInputChange('listingPrice', Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="daysOnMarket">Days on Market</Label>
              <Input
                id="daysOnMarket"
                type="number"
                placeholder="Days on market"
                value={formData.daysOnMarket || ''}
                onChange={(e) => handleInputChange('daysOnMarket', Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="marketConditions">Market Conditions *</Label>
              <Select
                value={formData.marketConditions}
                onValueChange={(value: any) => handleInputChange('marketConditions', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select conditions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hot">Hot Market (Seller's Market)</SelectItem>
                  <SelectItem value="balanced">Balanced Market</SelectItem>
                  <SelectItem value="slow">Slow Market (Buyer's Market)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Price History & Market Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="neighborhoodTrends">Neighborhood Trends & Analysis</Label>
            <Textarea
              id="neighborhoodTrends"
              placeholder="Describe recent sales trends, neighborhood developments, market activity..."
              value={formData.neighborhoodTrends}
              onChange={(e) => handleInputChange('neighborhoodTrends', e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-4">
            <Label>Recent Comparable Sales (Optional)</Label>
            <div className="text-sm text-gray-600">
              Add information about similar properties that have sold recently to help with pricing strategy.
            </div>
            
            {/* Simplified comparable sales input */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
              <Input placeholder="Comparable Address" />
              <Input type="number" placeholder="Sale Price" />
              <Input type="date" placeholder="Sale Date" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Special Features & Considerations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Property Features & Upgrades</Label>
            <Textarea
              placeholder="List any special features, recent upgrades, or unique selling points..."
              value={formData.specialFeatures?.join('\n') || ''}
              onChange={(e) => handleInputChange('specialFeatures', e.target.value.split('\n').filter(f => f.trim()))}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid() || loading}
          className="min-w-32"
        >
          {loading ? 'Saving...' : 'Save & Continue'}
        </Button>
      </div>
    </div>
  );
};

export default PropertyAnalysisStep;
