
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, CreditCard, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscriptionComplete: () => void;
}

export const SubscribeModal = ({ isOpen, onClose, onSubscriptionComplete }: SubscribeModalProps) => {
  const [step, setStep] = useState<'payment' | 'success'>('payment');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePayNow = async () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Log subscription attempt for analytics
      console.log('Subscription attempt:', {
        userId: user.id,
        email: user.email,
        formData,
        timestamp: new Date().toISOString()
      });

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update subscription status in database
      const { error } = await supabase
        .from('subscribers')
        .upsert({
          user_id: user.id,
          email: user.email,
          subscribed: true,
          subscription_tier: 'Premium',
          subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          stripe_customer_id: null, // Will be filled when Stripe is integrated
          updated_at: new Date().toISOString()
        }, { onConflict: 'email' });

      if (error) {
        throw error;
      }

      // Log successful subscription for analytics
      console.log('Subscription completed:', {
        userId: user.id,
        email: user.email,
        subscriptionTier: 'Premium',
        timestamp: new Date().toISOString()
      });

      setStep('success');
      onSubscriptionComplete();

      toast({
        title: "Welcome to FirstLook Premium! 🎉",
        description: "Your subscription is now active. Enjoy unlimited home tours!",
      });

    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription Failed",
        description: "There was an error processing your subscription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setStep('payment');
    setFormData({ name: '', email: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {step === 'payment' ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                  Start Your Premium Membership
                </div>
              </DialogTitle>
            </DialogHeader>

            <Card className="border-2 border-purple-200">
              <CardHeader className="text-center pb-4">
                <Badge className="w-fit mx-auto mb-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  Limited Time Offer
                </Badge>
                <CardTitle className="text-2xl">FirstLook Premium</CardTitle>
                <div className="text-3xl font-bold text-green-600">
                  $29<span className="text-lg text-gray-600">/first month</span>
                </div>
                <div className="text-sm text-gray-500 line-through">$69.95</div>
                <div className="text-lg font-semibold text-purple-600">Then $69.95/month</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Unlimited home tours</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>VIP priority scheduling</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Monthly expert support call</span>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                      defaultValue={user?.email || ''}
                    />
                  </div>

                  {/* Stripe Integration Placeholder */}
                  <div className="bg-gray-50 p-3 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <CreditCard className="w-4 h-4" />
                      <span>Payment details will be collected via Stripe (integration coming soon)</span>
                    </div>
                  </div>

                  <Button
                    onClick={handlePayNow}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 text-lg"
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Pay Now - $29 First Month
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-600 text-center">
                    Cancel anytime. No long-term contracts. Secure payment processing.
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Star className="h-8 w-8 text-yellow-500" />
                  Welcome to Premium!
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="text-center space-y-4">
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  🎉 You're now subscribed!
                </h3>
                <p className="text-green-700">
                  Your FirstLook Premium membership is active. You can now book unlimited home tours with VIP priority!
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">What's Next?</h4>
                <p className="text-blue-700 text-sm">
                  Head to your dashboard to start booking tours, or browse our available homes to get started.
                </p>
              </div>

              <Button
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                Start Exploring Homes
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
