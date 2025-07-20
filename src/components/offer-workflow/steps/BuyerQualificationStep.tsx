import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Info } from 'lucide-react';
import { BuyerQualificationData } from '@/hooks/useOfferQuestionnaire';

interface ExtendedBuyerQualificationData extends BuyerQualificationData {
  specificConcerns?: string;
  competitiveComfort?: string;
  contingencyPreference?: string;
  dealBreakers?: string;
}

interface BuyerQualificationStepProps {
  data: Partial<ExtendedBuyerQualificationData>;
  onComplete: (data: ExtendedBuyerQualificationData) => void;
  loading: boolean;
}

const BuyerQualificationStep = ({ data, onComplete, loading }: BuyerQualificationStepProps) => {
  const [formData, setFormData] = useState<ExtendedBuyerQualificationData>({
    preApprovalStatus: 'not_started',
    downPaymentSource: '',
    employmentStatus: '',
    incomeVerified: false,
    creditScoreRange: '',
    buyingTimeline: '',
    currentHomeStatus: 'rent',
    needToSellFirst: false,
    specificConcerns: '',
    competitiveComfort: '',
    contingencyPreference: '',
    dealBreakers: '',
    ...data
  });

  const handleInputChange = (field: keyof ExtendedBuyerQualificationData, value: string | number | boolean) => {
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
           formData.downPaymentSource &&
           formData.budgetMax &&
           formData.downPaymentAmount;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            Pre-Approval & Financial Readiness
          </CardTitle>
          <p className="text-sm text-gray-600">
            This information helps us understand your financial position and craft the strongest possible offer strategy.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preApprovalStatus">Pre-Approval Status *</Label>
              <Select
                value={formData.preApprovalStatus}
                onValueChange={(value) => handleInputChange('preApprovalStatus', value)}
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
          <CardTitle>Budget & Down Payment Details</CardTitle>
          <p className="text-sm text-gray-600">
            Understanding your budget helps us determine competitive offer pricing and negotiation strategies.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budgetMin">Minimum Budget</Label>
              <Input
                id="budgetMin"
                type="number"
                placeholder="e.g. 500000"
                value={formData.budgetMin || ''}
                onChange={(e) => handleInputChange('budgetMin', Number(e.target.value))}
              />
              <p className="text-xs text-gray-500">What's the lowest price you'd consider?</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budgetMax">Maximum Budget *</Label>
              <Input
                id="budgetMax"
                type="number"
                placeholder="e.g. 750000"
                value={formData.budgetMax || ''}
                onChange={(e) => handleInputChange('budgetMax', Number(e.target.value))}
              />
              <p className="text-xs text-gray-500">Your absolute maximum, including potential escalation</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="downPaymentAmount">Down Payment Amount *</Label>
              <Input
                id="downPaymentAmount"
                type="number"
                placeholder="e.g. 150000"
                value={formData.downPaymentAmount || ''}
                onChange={(e) => handleInputChange('downPaymentAmount', Number(e.target.value))}
              />
              <p className="text-xs text-gray-500">Available funds for down payment</p>
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
                  <SelectItem value="retirement">Retirement Funds (401k/IRA)</SelectItem>
                  <SelectItem value="sale_of_home">Sale of Current Home</SelectItem>
                  <SelectItem value="stocks_investments">Stocks/Investments</SelectItem>
                  <SelectItem value="business_sale">Business Sale/Partnership</SelectItem>
                  <SelectItem value="inheritance">Inheritance</SelectItem>
                  <SelectItem value="combination">Combination of Sources</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Employment & Financial Profile</CardTitle>
          <p className="text-sm text-gray-600">
            This helps us understand your loan qualification strength and potential lender requirements.
          </p>
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
                  <SelectItem value="poor">Poor (&lt;600)</SelectItem>
                  <SelectItem value="unknown">Don't Know/Prefer Not to Say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="incomeVerified"
              checked={formData.incomeVerified}
              onCheckedChange={(checked) => handleInputChange('incomeVerified', !!checked)}
            />
            <Label htmlFor="incomeVerified">Income has been verified by lender</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Timeline & Current Housing Situation</CardTitle>
          <p className="text-sm text-gray-600">
            Understanding your timeline helps us structure offers with appropriate settlement dates and contingencies.
          </p>
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
                  <SelectItem value="exploring">Just Exploring Options</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentHomeStatus">Current Home Status</Label>
              <Select
                value={formData.currentHomeStatus}
                onValueChange={(value) => handleInputChange('currentHomeStatus', value)}
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
                onCheckedChange={(checked) => handleInputChange('needToSellFirst', !!checked)}
              />
              <Label htmlFor="needToSellFirst">Need to sell current home before purchasing</Label>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="specificConcerns">Specific Concerns or Requirements</Label>
            <Textarea
              id="specificConcerns"
              placeholder="Any specific concerns about financing, timeline, property features, or other requirements we should discuss..."
              value={formData.specificConcerns || ''}
              onChange={(e) => handleInputChange('specificConcerns', e.target.value)}
              rows={3}
            />
            <p className="text-xs text-gray-500">This helps us prepare for your consultation</p>
          </div>
        </CardContent>
      </Card>

      {/* Market Competitiveness Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            Market Strategy Preferences
          </CardTitle>
          <p className="text-sm text-gray-600">
            Help us understand your comfort level with competitive market strategies.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="competitiveComfort">Comfort with Competitive Offers</Label>
              <Select
                value={formData.competitiveComfort || ''}
                onValueChange={(value) => handleInputChange('competitiveComfort', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select comfort level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="very_aggressive">Very Aggressive (escalation, waive contingencies)</SelectItem>
                  <SelectItem value="moderately_aggressive">Moderately Aggressive (some escalation)</SelectItem>
                  <SelectItem value="conservative">Conservative (at or below asking)</SelectItem>
                  <SelectItem value="unsure">Unsure - Need Guidance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contingencyPreference">Contingency Preferences</Label>
              <Select
                value={formData.contingencyPreference || ''}
                onValueChange={(value) => handleInputChange('contingencyPreference', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_contingencies">Want All Standard Contingencies</SelectItem>
                  <SelectItem value="limited_contingencies">Limited Contingencies for Strength</SelectItem>
                  <SelectItem value="waive_some">Willing to Waive Some if Necessary</SelectItem>
                  <SelectItem value="need_advice">Need Professional Advice</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dealBreakers">Deal Breakers or Must-Haves</Label>
            <Textarea
              id="dealBreakers"
              placeholder="What would make you walk away from this property? What features/terms are absolute must-haves?"
              value={formData.dealBreakers || ''}
              onChange={(e) => handleInputChange('dealBreakers', e.target.value)}
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

export default BuyerQualificationStep;