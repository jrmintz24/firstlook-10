
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "lucide-react";

interface AgentConsultationData {
  propertyInterestLevel: string;
  timeline: string;
  preferredCommunication: string;
  specificQuestions: string;
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
    propertyInterestLevel: "",
    timeline: "",
    preferredCommunication: "",
    specificQuestions: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const isFormValid = formData.propertyInterestLevel && 
                     formData.timeline &&
                     formData.preferredCommunication;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          Quick Consultation Setup
        </CardTitle>
        <p className="text-sm text-gray-600">
          Just a few quick questions so your agent can provide the best guidance for {propertyAddress}
        </p>
        <p className="text-xs text-gray-500 font-medium">
          ⏱️ Takes about 2 minutes
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Property Interest Level */}
          <div className="space-y-3">
            <Label className="text-base font-medium">How interested are you in this property?</Label>
            <RadioGroup 
              value={formData.propertyInterestLevel} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, propertyInterestLevel: value }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very_interested" id="very_interested" />
                <Label htmlFor="very_interested">Very interested - ready to make an offer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="interested" id="interested" />
                <Label htmlFor="interested">Interested - want to learn more</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="exploring" id="exploring" />
                <Label htmlFor="exploring">Just exploring - early in my search</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <Label className="text-base font-medium">What's your timeline?</Label>
            <RadioGroup 
              value={formData.timeline} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, timeline: value }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="asap" id="asap" />
                <Label htmlFor="asap">ASAP - ready to move quickly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1_3_months" id="1_3_months" />
                <Label htmlFor="1_3_months">1-3 months</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3_6_months" id="3_6_months" />
                <Label htmlFor="3_6_months">3-6 months</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="exploring" id="timeline_exploring" />
                <Label htmlFor="timeline_exploring">Just exploring</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Communication Preference */}
          <div className="space-y-3">
            <Label className="text-base font-medium">How do you prefer to communicate?</Label>
            <Select value={formData.preferredCommunication} onValueChange={(value) => setFormData(prev => ({ ...prev, preferredCommunication: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">Phone calls</SelectItem>
                <SelectItem value="video">Video calls</SelectItem>
                <SelectItem value="text">Text messages</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Specific Questions */}
          <div className="space-y-3">
            <Label htmlFor="questions" className="text-base font-medium">
              Any specific questions about this property? (Optional)
            </Label>
            <Textarea
              id="questions"
              placeholder="e.g., What's the neighborhood like? Are there any known issues? What's a competitive offer price?"
              value={formData.specificQuestions}
              onChange={(e) => setFormData(prev => ({ ...prev, specificQuestions: e.target.value }))}
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
