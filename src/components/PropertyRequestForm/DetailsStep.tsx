
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock } from "lucide-react";

interface DetailsStepProps {
  formData: {
    notes: string;
  };
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

const DetailsStep = ({ formData, onInputChange, onSubmit, onBack }: DetailsStepProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Additional Details
        </CardTitle>
        <CardDescription>
          Any special requests or notes for your showing partner?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any specific areas you'd like to focus on, accessibility needs, or questions about the property..."
              value={formData.notes}
              onChange={(e) => onInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• We'll match you with a licensed showing partner</li>
              <li>• You'll receive confirmation within 24 hours</li>
              <li>• Your showing partner will coordinate access</li>
              <li>• Enjoy your free, no-pressure viewing!</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              Back
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Submit Request
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DetailsStep;
