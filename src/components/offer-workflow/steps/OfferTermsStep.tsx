
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { OfferTermsData } from '@/hooks/useOfferQuestionnaire';

interface OfferTermsStepProps {
  data: Partial<OfferTermsData>;
  onComplete: (data: OfferTermsData) => void;
  loading: boolean;
  propertyAddress: string;
}

const OfferTermsStep = ({ data, onComplete, loading, propertyAddress }: OfferTermsStepProps) => {
  const [formData, setFormData] = useState<OfferTermsData>({
    offerPrice: 0,
    offerStrategy: 'at_asking',
    escalationClause: false,
    settlementDate: '',
    possessionDate: '',
    offerExpiration: '',
    personalPropertyIncluded: [],
    personalPropertyExcluded: [],
    ...data
  });

  const handleInputChange = (field: keyof OfferTermsData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onComplete(formData);
  };

  const isFormValid = () => {
    return formData.offerPrice > 0 &&
           formData.settlementDate &&
           formData.possessionDate &&
           formData.offerExpiration;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Offer Price & Strategy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="offerPrice">Offer Price *</Label>
              <Input
                id="offerPrice"
                type="number"
                placeholder="Enter offer amount"
                value={formData.offerPrice || ''}
                onChange={(e) => handleInputChange('offerPrice', Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="offerStrategy">Offer Strategy</Label>
              <Select
                value={formData.offerStrategy}
                onValueChange={(value) => handleInputChange('offerStrategy', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="below_asking">Below Asking Price</SelectItem>
                  <SelectItem value="at_asking">At Asking Price</SelectItem>
                  <SelectItem value="above_asking">Above Asking Price</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="escalationClause"
                checked={formData.escalationClause}
                onCheckedChange={(checked) => handleInputChange('escalationClause', !!checked)}
              />
              <Label htmlFor="escalationClause">Include Escalation Clause</Label>
            </div>

            {formData.escalationClause && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxEscalationPrice">Maximum Escalation Price</Label>
                  <Input
                    id="maxEscalationPrice"
                    type="number"
                    placeholder="Maximum price"
                    value={formData.maxEscalationPrice || ''}
                    onChange={(e) => handleInputChange('maxEscalationPrice', Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="escalationIncrement">Escalation Increment</Label>
                  <Input
                    id="escalationIncrement"
                    type="number"
                    placeholder="Increment amount"
                    value={formData.escalationIncrement || ''}
                    onChange={(e) => handleInputChange('escalationIncrement', Number(e.target.value))}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Dates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="settlementDate">Settlement Date *</Label>
              <Input
                id="settlementDate"
                type="date"
                value={formData.settlementDate}
                onChange={(e) => handleInputChange('settlementDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="possessionDate">Possession Date *</Label>
              <Input
                id="possessionDate"
                type="date"
                value={formData.possessionDate}
                onChange={(e) => handleInputChange('possessionDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="offerExpiration">Offer Expiration *</Label>
              <Input
                id="offerExpiration"
                type="datetime-local"
                value={formData.offerExpiration}
                onChange={(e) => handleInputChange('offerExpiration', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Property</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="personalPropertyIncluded">Items to Include (one per line)</Label>
            <Textarea
              id="personalPropertyIncluded"
              placeholder="e.g., Refrigerator, Washer/Dryer, Window Treatments"
              value={formData.personalPropertyIncluded?.join('\n') || ''}
              onChange={(e) => handleInputChange('personalPropertyIncluded', e.target.value.split('\n').filter(Boolean))}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personalPropertyExcluded">Items to Exclude (one per line)</Label>
            <Textarea
              id="personalPropertyExcluded"
              placeholder="e.g., Custom artwork, Antique fixtures"
              value={formData.personalPropertyExcluded?.join('\n') || ''}
              onChange={(e) => handleInputChange('personalPropertyExcluded', e.target.value.split('\n').filter(Boolean))}
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

export default OfferTermsStep;
