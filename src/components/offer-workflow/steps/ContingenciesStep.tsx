
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContingenciesData } from '@/hooks/useOfferQuestionnaire';

interface ContingenciesStepProps {
  data: Partial<ContingenciesData>;
  onComplete: (data: ContingenciesData) => void;
  loading: boolean;
}

const ContingenciesStep = ({ data, onComplete, loading }: ContingenciesStepProps) => {
  const [formData, setFormData] = useState<ContingenciesData>({
    homeInspection: true,
    homeInspectionDays: 7,
    inspectionType: 'negotiate_repairs',
    radonTesting: false,
    leadPaintInspection: false,
    termiteInspection: true,
    homeWarranty: false,
    homeWarrantyPaidBy: 'seller',
    saleOfCurrentHome: false,
    ...data
  });

  const handleInputChange = (field: keyof ContingenciesData, value: any) => {
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
          <CardTitle>Inspection Contingencies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="homeInspection"
              checked={formData.homeInspection}
              onCheckedChange={(checked) => handleInputChange('homeInspection', !!checked)}
            />
            <Label htmlFor="homeInspection">Home Inspection Contingency</Label>
          </div>

          {formData.homeInspection && (
            <div className="space-y-4 ml-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="homeInspectionDays">Inspection Period (days)</Label>
                  <Input
                    id="homeInspectionDays"
                    type="number"
                    min="1"
                    max="21"
                    value={formData.homeInspectionDays}
                    onChange={(e) => handleInputChange('homeInspectionDays', Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inspectionType">Inspection Type</Label>
                  <Select
                    value={formData.inspectionType}
                    onValueChange={(value) => handleInputChange('inspectionType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inspection (Right to Void Only)</SelectItem>
                      <SelectItem value="negotiate_repairs">Inspection with Repair Negotiations</SelectItem>
                      <SelectItem value="void_only">Information Only (No Repairs)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="radonTesting"
                checked={formData.radonTesting}
                onCheckedChange={(checked) => handleInputChange('radonTesting', !!checked)}
              />
              <Label htmlFor="radonTesting">Radon Testing Contingency</Label>
            </div>

            {formData.radonTesting && (
              <div className="ml-6">
                <div className="space-y-2">
                  <Label htmlFor="radonTestingDays">Radon Testing Period (days)</Label>
                  <Input
                    id="radonTestingDays"
                    type="number"
                    min="1"
                    max="14"
                    value={formData.radonTestingDays || 7}
                    onChange={(e) => handleInputChange('radonTestingDays', Number(e.target.value))}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="leadPaintInspection"
                checked={formData.leadPaintInspection}
                onCheckedChange={(checked) => handleInputChange('leadPaintInspection', !!checked)}
              />
              <Label htmlFor="leadPaintInspection">Lead Paint Inspection (Pre-1978 homes)</Label>
            </div>

            {formData.leadPaintInspection && (
              <div className="ml-6">
                <div className="space-y-2">
                  <Label htmlFor="leadPaintInspectionDays">Lead Paint Inspection Period (days)</Label>
                  <Input
                    id="leadPaintInspectionDays"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.leadPaintInspectionDays || 10}
                    onChange={(e) => handleInputChange('leadPaintInspectionDays', Number(e.target.value))}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="termiteInspection"
                checked={formData.termiteInspection}
                onCheckedChange={(checked) => handleInputChange('termiteInspection', !!checked)}
              />
              <Label htmlFor="termiteInspection">Termite/Wood Destroying Insect Inspection</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Other Contingencies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="saleOfCurrentHome"
              checked={formData.saleOfCurrentHome}
              onCheckedChange={(checked) => handleInputChange('saleOfCurrentHome', !!checked)}
            />
            <Label htmlFor="saleOfCurrentHome">Sale of Current Home Contingency</Label>
          </div>

          {formData.saleOfCurrentHome && (
            <div className="space-y-4 ml-6">
              <div className="space-y-2">
                <Label htmlFor="saleContingencyDate">Current Home Must Settle By</Label>
                <Input
                  id="saleContingencyDate"
                  type="date"
                  value={formData.saleContingencyDate || ''}
                  onChange={(e) => handleInputChange('saleContingencyDate', e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="kickoutClause"
                  checked={formData.kickoutClause}
                  onCheckedChange={(checked) => handleInputChange('kickoutClause', !!checked)}
                />
                <Label htmlFor="kickoutClause">Accept 72-hour kick-out clause</Label>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="homeWarranty"
              checked={formData.homeWarranty}
              onCheckedChange={(checked) => handleInputChange('homeWarranty', !!checked)}
            />
            <Label htmlFor="homeWarranty">Home Warranty</Label>
          </div>

          {formData.homeWarranty && (
            <div className="ml-6">
              <div className="space-y-2">
                <Label htmlFor="homeWarrantyPaidBy">Home Warranty Paid By</Label>
                <Select
                  value={formData.homeWarrantyPaidBy}
                  onValueChange={(value) => handleInputChange('homeWarrantyPaidBy', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select who pays" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buyer">Buyer</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                    <SelectItem value="split">Split 50/50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> In competitive markets, fewer contingencies can make your offer more attractive. 
          Consider which contingencies are most important for your protection.
        </p>
      </div>

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

export default ContingenciesStep;
