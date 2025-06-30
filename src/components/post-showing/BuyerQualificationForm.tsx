
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Home, Calendar, MessageSquare } from "lucide-react";

interface BuyerQualificationData {
  preApprovalStatus: string;
  preApprovalAmount: number | null;
  budgetMin: number | null;
  budgetMax: number | null;
  buyingTimeline: string;
  additionalNotes: string;
}

interface BuyerQualificationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BuyerQualificationData) => void;
  isSubmitting?: boolean;
  propertyAddress: string;
}

const BuyerQualificationForm = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  propertyAddress
}: BuyerQualificationFormProps) => {
  const [formData, setFormData] = useState<BuyerQualificationData>({
    preApprovalStatus: '',
    preApprovalAmount: null,
    budgetMin: null,
    budgetMax: null,
    buyingTimeline: '',
    additionalNotes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleNumberChange = (field: keyof BuyerQualificationData, value: string) => {
    const numValue = value ? parseInt(value.replace(/,/g, '')) : null;
    setFormData(prev => ({ ...prev, [field]: numValue }));
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return '';
    return value.toLocaleString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Let's Make Your Offer Competitive
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            Help us understand your situation to make the strongest possible offer on {propertyAddress}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pre-approval Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Financing Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="preApprovalStatus">Pre-approval Status</Label>
                <Select
                  value={formData.preApprovalStatus}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, preApprovalStatus: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your pre-approval status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pre-approved">Pre-approved with lender</SelectItem>
                    <SelectItem value="pre-qualified">Pre-qualified (initial assessment)</SelectItem>
                    <SelectItem value="cash">Paying cash</SelectItem>
                    <SelectItem value="need-financing">Need help with financing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(formData.preApprovalStatus === 'pre-approved' || formData.preApprovalStatus === 'pre-qualified') && (
                <div>
                  <Label htmlFor="preApprovalAmount">Pre-approval Amount</Label>
                  <Input
                    id="preApprovalAmount"
                    type="text"
                    placeholder="500,000"
                    value={formatCurrency(formData.preApprovalAmount)}
                    onChange={(e) => handleNumberChange('preApprovalAmount', e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter the maximum amount you're approved for</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Budget Range */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Budget Range</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budgetMin">Minimum Budget</Label>
                  <Input
                    id="budgetMin"
                    type="text"
                    placeholder="400,000"
                    value={formatCurrency(formData.budgetMin)}
                    onChange={(e) => handleNumberChange('budgetMin', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="budgetMax">Maximum Budget</Label>
                  <Input
                    id="budgetMax"
                    type="text"
                    placeholder="600,000"
                    value={formatCurrency(formData.budgetMax)}
                    onChange={(e) => handleNumberChange('budgetMax', e.target.value)}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                This helps us position your offer competitively within your comfort zone
              </p>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Buying Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.buyingTimeline}
                onValueChange={(value) => setFormData(prev => ({ ...prev, buyingTimeline: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="When are you looking to buy?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediately">Ready to buy immediately</SelectItem>
                  <SelectItem value="1-2-months">Within 1-2 months</SelectItem>
                  <SelectItem value="3-6-months">Within 3-6 months</SelectItem>
                  <SelectItem value="6-12-months">Within 6-12 months</SelectItem>
                  <SelectItem value="exploring">Just exploring options</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Any special circumstances, requirements, or questions about making an offer?"
                value={formData.additionalNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting || !formData.preApprovalStatus || !formData.buyingTimeline}
            >
              {isSubmitting ? "Processing..." : "Continue with Offer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BuyerQualificationForm;
