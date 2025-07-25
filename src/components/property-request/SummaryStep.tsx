
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Loader2, MapPin, Calendar, CheckCircle } from "lucide-react";
import { PropertyRequestFormData } from "@/types/propertyRequest";
import { useAuth } from "@/contexts/SimpleAuth0Context";

interface SummaryStepProps {
  formData: PropertyRequestFormData;
  onInputChange: (field: string, value: string) => void;
  onContinueToSubscriptions: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

const SummaryStep = ({ formData, onInputChange, onContinueToSubscriptions, onBack, isSubmitting }: SummaryStepProps) => {
  const { user } = useAuth();

  const getDateDisplay = (dateString: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div className="space-y-6 max-h-[65vh] overflow-y-auto">
      {/* Compact Summary Card */}
      <Card className="border border-gray-200">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Tour Summary</h3>
          </div>
          
          <div className="space-y-3">
            {/* Properties */}
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {formData.selectedProperties.length || 1} propert{(formData.selectedProperties.length || 1) > 1 ? 'ies' : 'y'}
                </p>
                {formData.selectedProperties.length > 0 ? (
                  <div className="space-y-1">
                    {formData.selectedProperties.map((property, index) => (
                      <p key={index} className="text-sm text-gray-600 truncate">{property}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 truncate">{formData.propertyAddress}</p>
                )}
              </div>
            </div>
            
            {/* Preferred Times */}
            {(formData.preferredDate1 && formData.preferredTime1) && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Preferred Time</p>
                  <p className="text-sm text-gray-600">
                    {getDateDisplay(formData.preferredDate1)} at {formData.preferredTime1}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notes Section */}
      <Card className="border border-gray-200">
        <CardContent className="p-5">
          <Label htmlFor="notes" className="text-sm font-medium text-gray-900 mb-3 block">
            Special Requests (Optional)
          </Label>
          <Textarea
            id="notes"
            placeholder="Any specific areas you'd like to focus on, accessibility needs, or questions..."
            value={formData.notes}
            onChange={(e) => onInputChange('notes', e.target.value)}
            rows={3}
            disabled={isSubmitting}
            className="border-gray-300 focus:border-black focus:ring-1 focus:ring-black resize-none"
          />
        </CardContent>
      </Card>

      {/* What's Next */}
      <Card className="border border-gray-200 bg-gray-50">
        <CardContent className="p-5">
          <h4 className="font-semibold text-gray-900 mb-2">
            {user ? 'Ready to Submit!' : 'Almost Ready!'}
          </h4>
          <p className="text-sm text-gray-700 mb-3">
            {user 
              ? "We'll match you with a licensed showing partner and confirm your tour within 24 hours."
              : "Next, you'll sign in and we'll submit your request. We'll then match you with a licensed showing partner and confirm your tour within 24 hours."
            }
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span>Licensed DC professionals</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span>No pressure, no commitments</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <Button 
          variant="outline" 
          onClick={onBack} 
          className="flex-1 h-12 border-2 border-gray-300 hover:border-gray-400 font-medium"
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button 
          onClick={onContinueToSubscriptions}
          className="flex-1 h-12 bg-black hover:bg-gray-800 text-white font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : user ? (
            <>
              Submit Request
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Sign In & Submit
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SummaryStep;
