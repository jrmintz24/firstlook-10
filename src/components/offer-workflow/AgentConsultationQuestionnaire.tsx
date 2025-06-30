
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Clock, MessageCircle, DollarSign } from "lucide-react";

interface AgentConsultationData {
  propertyInterestLevel: string;
  preApprovalStatus: string;
  budgetRange: string;
  timeline: string;
  preferredCommunication: string;
  availabilityPreference: string;
  specificQuestions: string;
  ongoingRepresentation: boolean;
  additionalComments: string;
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
    preApprovalStatus: "",
    budgetRange: "",
    timeline: "",
    preferredCommunication: "",
    availabilityPreference: "",
    specificQuestions: "",
    ongoingRepresentation: false,
    additionalComments: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const isFormValid = formData.propertyInterestLevel && 
                     formData.preApprovalStatus && 
                     formData.timeline &&
                     formData.preferredCommunication;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          Schedule Agent Consultation
        </CardTitle>
        <p className="text-sm text-gray-600">
          Let's gather some basic information so your agent can provide the best guidance for {propertyAddress}
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

          {/* Pre-approval Status */}
          <div className="space-y-3">
            <Label className="text-base font-medium">What's your financing status?</Label>
            <Select value={formData.preApprovalStatus} onValueChange={(value) => setFormData(prev => ({ ...prev, preApprovalStatus: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select your status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pre_approved">Pre-approved with lender</SelectItem>
                <SelectItem value="pre_qualified">Pre-qualified (initial approval)</SelectItem>
                <SelectItem value="cash">Paying cash</SelectItem>
                <SelectItem value="need_help">Need help getting pre-approved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Budget Range */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Budget range (optional)</Label>
            <Select value={formData.budgetRange} onValueChange={(value) => setFormData(prev => ({ ...prev, budgetRange: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select range (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under_500k">Under $500K</SelectItem>
                <SelectItem value="500k_750k">$500K - $750K</SelectItem>
                <SelectItem value="750k_1m">$750K - $1M</SelectItem>
                <SelectItem value="1m_1.5m">$1M - $1.5M</SelectItem>
                <SelectItem value="over_1.5m">Over $1.5M</SelectItem>
                <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
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

          {/* Availability Preference */}
          <div className="space-y-3">
            <Label className="text-base font-medium">When are you typically available?</Label>
            <Select value={formData.availabilityPreference} onValueChange={(value) => setFormData(prev => ({ ...prev, availabilityPreference: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekday_mornings">Weekday mornings</SelectItem>
                <SelectItem value="weekday_afternoons">Weekday afternoons</SelectItem>
                <SelectItem value="weekday_evenings">Weekday evenings</SelectItem>
                <SelectItem value="weekends">Weekends</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Specific Questions */}
          <div className="space-y-3">
            <Label htmlFor="questions" className="text-base font-medium">
              Any specific questions about this property?
            </Label>
            <Textarea
              id="questions"
              placeholder="e.g., What's the neighborhood like? Are there any known issues? What's a competitive offer price?"
              value={formData.specificQuestions}
              onChange={(e) => setFormData(prev => ({ ...prev, specificQuestions: e.target.value }))}
              className="min-h-[80px]"
            />
          </div>

          {/* Ongoing Representation */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ongoing"
              checked={formData.ongoingRepresentation}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ongoingRepresentation: !!checked }))}
            />
            <Label htmlFor="ongoing" className="text-sm">
              I'm interested in ongoing representation for my home search
            </Label>
          </div>

          {/* Additional Comments */}
          <div className="space-y-3">
            <Label htmlFor="comments" className="text-base font-medium">
              Anything else you'd like the agent to know?
            </Label>
            <Textarea
              id="comments"
              placeholder="Any additional information that would be helpful..."
              value={formData.additionalComments}
              onChange={(e) => setFormData(prev => ({ ...prev, additionalComments: e.target.value }))}
              className="min-h-[60px]"
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
