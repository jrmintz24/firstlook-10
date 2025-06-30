
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { AdditionalTermsData } from '@/hooks/useOfferQuestionnaire';

interface AdditionalTermsStepProps {
  data: Partial<AdditionalTermsData>;
  onComplete: (data: AdditionalTermsData) => void;
  loading: boolean;
}

const AdditionalTermsStep = ({ data, onComplete, loading }: AdditionalTermsStepProps) => {
  const [formData, setFormData] = useState<AdditionalTermsData>({
    sellerConcessions: false,
    surveyRequired: false,
    hoa: false,
    condoAssociation: false,
    specialConditions: [],
    ...data
  });

  const handleInputChange = (field: keyof AdditionalTermsData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onComplete(formData);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Seller Concessions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sellerConcessions"
              checked={formData.sellerConcessions}
              onCheckedChange={(checked) => handleInputChange('sellerConcessions', !!checked)}
            />
            <Label htmlFor="sellerConcessions">Request Seller Contribution to Closing Costs</Label>
          </div>

          {formData.sellerConcessions && (
            <div className="ml-6">
              <div className="space-y-2">
                <Label htmlFor="sellerConcessionsAmount">Contribution Amount ($)</Label>
                <Input
                  id="sellerConcessionsAmount"
                  type="number"
                  placeholder="Dollar amount"
                  value={formData.sellerConcessionsAmount || ''}
                  onChange={(e) => handleInputChange('sellerConcessionsAmount', Number(e.target.value))}
                />
                <p className="text-sm text-gray-600">
                  Typical range: 2-6% of purchase price, subject to loan limits
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hoa"
                checked={formData.hoa}
                onCheckedChange={(checked) => handleInputChange('hoa', !!checked)}
              />
              <Label htmlFor="hoa">Property is in a Homeowners Association (HOA)</Label>
            </div>

            {formData.hoa && (
              <div className="ml-6">
                <div className="space-y-2">
                  <Label htmlFor="hoaFees">Monthly HOA Fees ($)</Label>
                  <Input
                    id="hoaFees"
                    type="number"
                    placeholder="Monthly HOA fee"
                    value={formData.hoaFees || ''}
                    onChange={(e) => handleInputChange('hoaFees', Number(e.target.value))}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="condoAssociation"
                checked={formData.condoAssociation}
                onCheckedChange={(checked) => handleInputChange('condoAssociation', !!checked)}
              />
              <Label htmlFor="condoAssociation">Property is a Condominium</Label>
            </div>

            {formData.condoAssociation && (
              <div className="ml-6">
                <div className="space-y-2">
                  <Label htmlFor="condoFees">Monthly Condo Fees ($)</Label>
                  <Input
                    id="condoFees"
                    type="number"
                    placeholder="Monthly condo fee"
                    value={formData.condoFees || ''}
                    onChange={(e) => handleInputChange('condoFees', Number(e.target.value))}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="surveyRequired"
                checked={formData.surveyRequired}
                onCheckedChange={(checked) => handleInputChange('surveyRequired', !!checked)}
              />
              <Label htmlFor="surveyRequired">Property Survey Required</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Professional Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="attorneySelection">Attorney/Settlement Agent</Label>
              <Input
                id="attorneySelection"
                placeholder="Attorney or settlement company name"
                value={formData.attorneySelection || ''}
                onChange={(e) => handleInputChange('attorneySelection', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="titleCompany">Title Company</Label>
              <Input
                id="titleCompany"
                placeholder="Title company name"
                value={formData.titleCompany || ''}
                onChange={(e) => handleInputChange('titleCompany', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Special Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="specialConditions">Additional Terms or Special Conditions</Label>
            <Textarea
              id="specialConditions"
              placeholder="Enter any special conditions, requests, or terms (one per line)"
              value={formData.specialConditions?.join('\n') || ''}
              onChange={(e) => handleInputChange('specialConditions', e.target.value.split('\n').filter(Boolean))}
              rows={4}
            />
            <p className="text-sm text-gray-600">
              Examples: "Seller to provide roof inspection", "Buyer to assume oil tank", "Property sold as-is"
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialInstructions">Special Instructions for Agent</Label>
            <Textarea
              id="specialInstructions"
              placeholder="Any specific instructions or preferences for your agent"
              value={formData.specialInstructions || ''}
              onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="min-w-32"
        >
          {loading ? 'Saving...' : 'Save & Continue'}
        </Button>
      </div>
    </div>
  );
};

export default AdditionalTermsStep;
