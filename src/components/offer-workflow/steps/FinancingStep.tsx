
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FinancingData } from '@/hooks/useOfferQuestionnaire';

interface FinancingStepProps {
  data: Partial<FinancingData>;
  onComplete: (data: FinancingData) => void;
  loading: boolean;
}

const FinancingStep = ({ data, onComplete, loading }: FinancingStepProps) => {
  const [formData, setFormData] = useState<FinancingData>({
    loanType: 'conventional',
    financingContingencyDays: 21,
    appraisalContingency: true,
    ...data
  });

  const handleInputChange = (field: keyof FinancingData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onComplete(formData);
  };

  const isFormValid = () => {
    return formData.loanType && formData.financingContingencyDays > 0;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Loan Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="loanType">Loan Type *</Label>
              <Select
                value={formData.loanType}
                onValueChange={(value) => handleInputChange('loanType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select loan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conventional">Conventional</SelectItem>
                  <SelectItem value="fha">FHA</SelectItem>
                  <SelectItem value="va">VA</SelectItem>
                  <SelectItem value="usda">USDA</SelectItem>
                  <SelectItem value="cash">Cash (No Financing)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.loanType !== 'cash' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="loanAmount">Loan Amount</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    placeholder="Loan amount"
                    value={formData.loanAmount || ''}
                    onChange={(e) => handleInputChange('loanAmount', Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interestRate">Expected Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.01"
                    placeholder="Interest rate"
                    value={formData.interestRate || ''}
                    onChange={(e) => handleInputChange('interestRate', Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loanTerm">Loan Term (years)</Label>
                  <Select
                    value={formData.loanTerm?.toString() || '30'}
                    onValueChange={(value) => handleInputChange('loanTerm', Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 years</SelectItem>
                      <SelectItem value="30">30 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>

          {formData.loanType !== 'cash' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lenderName">Lender Name</Label>
                <Input
                  id="lenderName"
                  placeholder="Lender or bank name"
                  value={formData.lenderName || ''}
                  onChange={(e) => handleInputChange('lenderName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lenderContact">Lender Contact</Label>
                <Input
                  id="lenderContact"
                  placeholder="Phone or email"
                  value={formData.lenderContact || ''}
                  onChange={(e) => handleInputChange('lenderContact', e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financing Contingencies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.loanType !== 'cash' && (
            <div className="space-y-2">
              <Label htmlFor="financingContingencyDays">Financing Contingency Period (days) *</Label>
              <Input
                id="financingContingencyDays"
                type="number"
                min="1"
                max="60"
                value={formData.financingContingencyDays}
                onChange={(e) => handleInputChange('financingContingencyDays', Number(e.target.value))}
              />
              <p className="text-sm text-gray-600">
                Typical range: 21-30 days for conventional loans, 30-45 days for FHA/VA
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="appraisalContingency"
                checked={formData.appraisalContingency}
                onCheckedChange={(checked) => handleInputChange('appraisalContingency', !!checked)}
              />
              <Label htmlFor="appraisalContingency">Include Appraisal Contingency</Label>
            </div>

            {formData.appraisalContingency && (
              <div className="space-y-2">
                <Label htmlFor="appraisalContingencyDays">Appraisal Contingency Period (days)</Label>
                <Input
                  id="appraisalContingencyDays"
                  type="number"
                  min="1"
                  max="30"
                  value={formData.appraisalContingencyDays || 21}
                  onChange={(e) => handleInputChange('appraisalContingencyDays', Number(e.target.value))}
                />
              </div>
            )}
          </div>

          {(formData.loanType === 'va' || formData.loanType === 'fha') && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> {formData.loanType.toUpperCase()} loans include mandatory appraisal contingencies that cannot be waived.
              </p>
            </div>
          )}

          {formData.loanType === 'cash' && (
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Cash Purchase:</strong> No financing contingencies required. Consider adding appraisal contingency for protection.
              </p>
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

export default FinancingStep;
