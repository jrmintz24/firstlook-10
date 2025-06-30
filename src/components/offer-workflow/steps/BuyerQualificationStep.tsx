
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BuyerQualificationData } from '@/hooks/useOfferQuestionnaire';

interface BuyerQualificationStepProps {
  data: Partial<BuyerQualificationData>;
  onComplete: (data: BuyerQualificationData) => void;
  loading: boolean;
}

const BuyerQualificationStep = ({ data, onComplete, loading }: BuyerQualificationStepProps) => {
  const [formData, setFormData] = useState<BuyerQualificationData>({
    preApprovalStatus: 'not_started',
    downPaymentSource: '',
    employmentStatus: '',
    incomeVerified: false,
    creditScoreRange: '',
    buyingTimeline: '',
    currentHomeStatus: 'rent',
    needToSellFirst: false,
    ...data
  });

  const handleInputChange = (field: keyof BuyerQualificationData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onComplete(formData);
  };

  const isFormValid = () => {
    return formData.preApprovalStatus &&
           formData.employmentStatus &&
           formData.creditScoreRange &&
           formData.buyingTimeline &&
           formData.downPaymentSource;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pre-Approval Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preApprovalStatus">Pre-Approval Status *</Label>
              <Select
                value={formData.preApprovalStatus}
                onValueChange={(value: any) => handleInputChange('preApprovalStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Pre-Approved</SelectItem>
                  <SelectItem value="pending">Application Pending</SelectItem>
                  <SelectItem value="not_started">Not Started</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.preApprovalStatus === 'approved' && (
              <div className="space-y-2">
                <Label htmlFor="preApprovalAmount">Pre-Approval Amount</Label>
                <Input
                  id="preApprovalAmount"
                  type="number"
                  placeholder="Amount"
                  value={formData.preApprovalAmount || ''}
                  onChange={(e) => handleInputChange('preApprovalAmount', Number(e.target.value))}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget & Down Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budgetMin">Minimum Budget</Label>
              <Input
                id="budgetMin"
                type="number"
                placeholder="Minimum price"
                value={formData.budgetMin || ''}
                onChange={(e) => handleInputChange('budgetMin', Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budgetMax">Maximum Budget</Label>
              <Input
                id="budgetMax"
                type="number"
                placeholder="Maximum price"
                value={formData.budgetMax || ''}
                onChange={(e) => handleInputChange('budgetMax', Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="downPaymentAmount">Down Payment Amount</Label>
              <Input
                id="downPaymentAmount"
                type="number"
                placeholder="Down payment"
                value={formData.downPaymentAmount || ''}
                onChange={(e) => handleInputChange('downPaymentAmount', Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="downPaymentSource">Down Payment Source *</Label>
              <Select
                value={formData.downPaymentSource}
                onValueChange={(value) => handleInputChange('downPaymentSource', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="savings">Personal Savings</SelectItem>
                  <SelectItem value="gift">Gift from Family</SelectItem>
                  <SelectItem value="retirement">Retirement Funds</SelectItem>
                  <SelectItem value="sale_of_home">Sale of Current Home</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Employment & Credit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employmentStatus">Employment Status *</Label>
              <Select
                value={formData.employmentStatus}
                onValueChange={(value) => handleInputChange('employmentStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_time">Full-Time Employee</SelectItem>
                  <SelectItem value="part_time">Part-Time Employee</SelectItem>
                  <SelectItem value="self_employed">Self-Employed</SelectItem>
                  <SelectItem value="contract">Contract Worker</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="creditScoreRange">Credit Score Range *</Label>
              <Select
                value={formData.creditScoreRange}
                onValueChange={(value) => handleInputChange('creditScoreRange', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent (750+)</SelectItem>
                  <SelectItem value="very_good">Very Good (700-749)</SelectItem>
                  <SelectItem value="good">Good (650-699)</SelectItem>
                  <SelectItem value="fair">Fair (600-649)</SelectItem>
                  <SelectItem value="poor">Poor (<600)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="incomeVerified"
              checked={formData.incomeVerified}
              onCheckedChange={(checked) => handleInputChange('incomeVerified', checked)}
            />
            <Label htmlFor="incomeVerified">Income has been verified by lender</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Timeline & Current Situation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buyingTimeline">Buying Timeline *</Label>
              <Select
                value={formData.buyingTimeline}
                onValueChange={(value) => handleInputChange('buyingTimeline', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediately">Immediately (0-30 days)</SelectItem>
                  <SelectItem value="soon">Soon (1-3 months)</SelectItem>
                  <SelectItem value="moderate">Moderate (3-6 months)</SelectItem>
                  <SelectItem value="flexible">Flexible (6+ months)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentHomeStatus">Current Home Status</Label>
              <Select
                value={formData.currentHomeStatus}
                onValueChange={(value: any) => handleInputChange('currentHomeStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="own">Own Current Home</SelectItem>
                  <SelectItem value="rent">Rent Current Home</SelectItem>
                  <SelectItem value="living_with_family">Living with Family</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.currentHomeStatus === 'own' && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="needToSellFirst"
                checked={formData.needToSellFirst}
                onCheckedChange={(checked) => handleInputChange('needToSellFirst', checked)}
              />
              <Label htmlFor="needToSellFirst">Need to sell current home before purchasing</Label>
            </div>
          )}
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

export default BuyerQualificationStep;
