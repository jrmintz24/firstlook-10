
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Phone, Video } from "lucide-react";

interface AgentConsultationData {
  offerReadiness: string;
  offerPrice: string;
  preApprovalStatus: string;
  closingTimeline: string;
  contingencies: string[];
  otherContingency: string;
  callType: string;
  additionalContext: string;
}

interface AgentConsultationQuestionnaireProps {
  propertyAddress: string;
  onComplete: (data: AgentConsultationData) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

const AgentConsultationQuestionnaire = ({
  propertyAddress,
  onComplete,
  onBack,
  isSubmitting = false
}: AgentConsultationQuestionnaireProps) => {
  const [formData, setFormData] = useState<AgentConsultationData>({
    offerReadiness: "",
    offerPrice: "",
    preApprovalStatus: "",
    closingTimeline: "",
    contingencies: [],
    otherContingency: "",
    callType: "",
    additionalContext: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const handleContingencyChange = (contingency: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        contingencies: [...prev.contingencies, contingency]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        contingencies: prev.contingencies.filter(c => c !== contingency)
      }));
    }
  };

  const isFormValid = formData.offerReadiness && 
                     formData.preApprovalStatus && 
                     formData.closingTimeline &&
                     formData.callType;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-gray-900">
          📝 Agent-Led Offer Intake
        </CardTitle>
        <p className="text-sm font-medium text-gray-700">
          Property: {propertyAddress}
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Offer Readiness */}
          <div className="space-y-3">
            <Label className="text-base font-medium">1. 💵 Offer Readiness</Label>
            <p className="text-sm text-gray-600 mb-2">Are you ready to submit an offer on this property?</p>
            <RadioGroup 
              value={formData.offerReadiness} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, offerReadiness: value }))}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ready" id="ready" />
                <Label htmlFor="ready" className="text-sm">✅ Yes, I'm ready</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="details" id="details" />
                <Label htmlFor="details" className="text-sm">🕐 I want to finalize a few details with the agent first</Label>
              </div>
            </RadioGroup>
          </div>

          {/* 2. Purchase Details */}
          <div className="space-y-4">
            <Label className="text-base font-medium">2. 💰 Purchase Details</Label>
            
            <div className="space-y-2">
              <Label htmlFor="offerPrice" className="text-sm font-medium">Your intended offer price:</Label>
              <Input
                id="offerPrice"
                placeholder="e.g., $450,000 or range: $440k-460k"
                value={formData.offerPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, offerPrice: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Do you have mortgage pre-approval or proof of funds?</Label>
              <RadioGroup 
                value={formData.preApprovalStatus} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, preApprovalStatus: value }))}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="approved_yes" />
                  <Label htmlFor="approved_yes" className="text-sm">✅ Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="in_progress" id="in_progress" />
                  <Label htmlFor="in_progress" className="text-sm">🕐 In progress</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not_yet" id="not_yet" />
                  <Label htmlFor="not_yet" className="text-sm">❌ Not yet</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 3. Timeline & Contingencies */}
          <div className="space-y-4">
            <Label className="text-base font-medium">3. 🗓️ Timeline & Contingencies</Label>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Desired closing timeline:</Label>
              <Select value={formData.closingTimeline} onValueChange={(value) => setFormData(prev => ({ ...prev, closingTimeline: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30_days">30 days</SelectItem>
                  <SelectItem value="45_days">45 days</SelectItem>
                  <SelectItem value="60_plus_days">60+ days</SelectItem>
                  <SelectItem value="unsure">Unsure</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Contingencies you're planning to include:</Label>
              <div className="space-y-2">
                {[
                  { id: 'financing', label: 'Financing' },
                  { id: 'inspection', label: 'Inspection' },
                  { id: 'appraisal', label: 'Appraisal' },
                  { id: 'none', label: 'None' }
                ].map((contingency) => (
                  <div key={contingency.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={contingency.id}
                      checked={formData.contingencies.includes(contingency.id)}
                      onCheckedChange={(checked) => handleContingencyChange(contingency.id, !!checked)}
                    />
                    <Label htmlFor={contingency.id} className="text-sm">{contingency.label}</Label>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="other"
                    checked={formData.contingencies.includes('other')}
                    onCheckedChange={(checked) => handleContingencyChange('other', !!checked)}
                  />
                  <Label htmlFor="other" className="text-sm">Other:</Label>
                  <Input
                    placeholder="Specify..."
                    value={formData.otherContingency}
                    onChange={(e) => setFormData(prev => ({ ...prev, otherContingency: e.target.value }))}
                    className="flex-1 text-sm"
                    disabled={!formData.contingencies.includes('other')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4. Coaching Call Type */}
          <div className="space-y-3">
            <Label className="text-base font-medium">4. 🎧 Coaching Call Type</Label>
            <p className="text-sm text-gray-600 mb-2">How would you like to meet with your agent?</p>
            <RadioGroup 
              value={formData.callType} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, callType: value }))}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="phone" id="phone" />
                <Label htmlFor="phone" className="text-sm flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Call
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="video" id="video" />
                <Label htmlFor="video" className="text-sm flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Zoom Video Call
                </Label>
              </div>
            </RadioGroup>
            <p className="text-xs text-gray-500 mt-2">Scheduling will take place on the next screen.</p>
          </div>

          {/* 5. Additional Context */}
          <div className="space-y-3">
            <Label htmlFor="context" className="text-base font-medium">
              5. 🧠 Additional Context (Optional)
            </Label>
            <p className="text-sm text-gray-600 mb-2">Any deal-specific questions or notes for the agent?</p>
            <Textarea
              id="context"
              placeholder="e.g., Concerns about neighborhood, questions about recent sales, specific property features you want to discuss..."
              value={formData.additionalContext}
              onChange={(e) => setFormData(prev => ({ ...prev, additionalContext: e.target.value }))}
              className="min-h-[80px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isSubmitting}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Processing..." : "Continue to Scheduling"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AgentConsultationQuestionnaire;
