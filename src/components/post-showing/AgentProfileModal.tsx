
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { User, Star, Award, DollarSign, CheckCircle } from "lucide-react";

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
  agentName,
  agentEmail,
  agentPhone,
  isSubmitting = false
}: AgentProfileModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Connect with {agentName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Agent Profile Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{agentName}</h3>
                  <p className="text-gray-600">Licensed Real Estate Agent</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">4.9</span>
                    <span className="text-sm text-gray-500">(47 reviews)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">127</div>
                  <div className="text-sm text-gray-600">Properties Sold</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">3.2</div>
                  <div className="text-sm text-gray-600">Avg Days on Market</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">
                  <Award className="h-3 w-3 mr-1" />
                  Top Producer 2024
                </Badge>
                <Badge variant="secondary">First-Time Buyer Specialist</Badge>
                <Badge variant="secondary">Negotiation Expert</Badge>
              </div>

              <p className="text-gray-700 text-sm">
                Specializing in DC area properties with 8+ years of experience. Known for exceptional client service and achieving above-market prices for sellers while securing great deals for buyers.
              </p>
            </CardContent>
          </Card>

          {/* FirstLook Pro Benefits */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900">FirstLook Pro Benefits</h4>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Up to 1% cash back on your home purchase</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Dedicated agent for all your property needs</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Priority scheduling for property tours</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Expert negotiation and offer support</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                <p className="text-xs text-gray-600">
                  <strong>Cash Back Example:</strong> On a $500,000 home, you could receive up to $5,000 back at closing.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Contact Information</h4>
              <div className="space-y-1 text-sm text-gray-600">
                {agentEmail && <p>Email: {agentEmail}</p>}
                {agentPhone && <p>Phone: {agentPhone}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
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
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Connecting..." : "Connect with Agent"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgentProfileModal;
