
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { User, Star, Award, Phone, Mail, MapPin, CheckCircle } from "lucide-react";

interface AgentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmHire: () => void;
  agentName?: string;
  agentEmail?: string;
  agentPhone?: string;
  isSubmitting?: boolean;
}

const AgentProfileModal = ({
  isOpen,
  onClose,
  onConfirmHire,
  agentName = "Sarah Chen",
  agentEmail = "sarah.chen@firstlook.com",
  agentPhone = "(202) 555-0123",
  isSubmitting = false
}: AgentProfileModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="h-5 w-5" />
            Connect with {agentName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Agent Profile Header */}
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg">{agentName}</h3>
              <p className="text-gray-600 text-sm">Licensed Real Estate Agent</p>
              <div className="flex items-center gap-2 mt-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">4.9</span>
                <span className="text-sm text-gray-500">(47 reviews)</span>
              </div>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">127</div>
              <div className="text-xs text-gray-600">Properties Sold</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">15</div>
              <div className="text-xs text-gray-600">Avg Days on Market</div>
            </div>
          </div>

          {/* Specialties */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Specialties</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                <Award className="h-3 w-3 mr-1" />
                First-Time Buyers
              </Badge>
              <Badge variant="secondary" className="text-xs">DC Area Expert</Badge>
              <Badge variant="secondary" className="text-xs">Negotiation Specialist</Badge>
            </div>
          </div>

          {/* What You Get */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <h4 className="font-semibold text-green-900 mb-3">What You Get</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-green-800">Dedicated agent for your home search</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-green-800">Expert market analysis and pricing guidance</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-green-800">Professional offer writing and negotiation</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-green-800">Transaction support through closing</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Contact Information</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{agentEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{agentPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>Washington, DC Metro Area</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Maybe Later
            </Button>
            <Button
              onClick={onConfirmHire}
              disabled={isSubmitting}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? "Connecting..." : "Work with Agent"}
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            No upfront costs. Agent is compensated through standard real estate commission.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgentProfileModal;
