
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, CreditCard, Star, User, Mail, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/Auth0AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { signUp, signIn } from "@/services/authService";

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscriptionComplete: () => void;
}

export const SubscribeModal = ({ isOpen, onClose, onSubscriptionComplete }: SubscribeModalProps) => {
  const [step, setStep] = useState<'auth' | 'payment' | 'success'>('auth');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [isProcessing, setIsProcessing] = useState(false);
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    firstName: '',
    confirmPassword: ''
  });
  const [paymentData, setPaymentData] = useState({
    name: '',
    email: ''
  });
  const { toast } = useToast();
  const { user } = useAuth();

  // If user is already logged in, skip to payment step
  useState(() => {
    if (user && step === 'auth') {
      setStep('payment');
      setPaymentData(prev => ({ ...prev, email: user.email || '' }));
    }
  });

  const proFeatures = [
    "Unlimited home tours",
    "Up to 3 homes per tour session",
    "Same-day showing availability", 
    "Priority scheduling",
    "DIY Offer Maker tool access",
    "Advanced property analytics"
  ];

  const handleAuthInputChange = (field: string, value: string) => {
    setAuthData(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const validateAuthForm = () => {
    if (!authData.email || !authData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return false;
    }

    if (authMode === 'signup') {
      if (!authData.firstName) {
        toast({
          title: "Missing Information", 
          description: "Please enter your first name.",
          variant: "destructive"
        });
        return false;
      }
      if (authData.password !== authData.confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "Passwords do not match.",
          variant: "destructive"
        });
        return false;
      }
      if (authData.password.length < 6) {
        toast({
          title: "Password Too Short",
          description: "Password must be at least 6 characters long.",
          variant: "destructive"
        });
        return false;
      }
    }

    return true;
  };

  const handleAuth = async () => {
    if (!validateAuthForm()) return;

    setIsProcessing(true);

    try {
      if (authMode === 'signup') {
        const { error } = await signUp(authData.email, authData.password, {
          first_name: authData.firstName,
          user_type: 'buyer'
        });

        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: "Account Already Exists",
              description: "This email is already registered. Please sign in instead.",
              variant: "destructive"
            });
            setAuthMode('signin');
          } else {
            throw error;
          }
          return;
        }

        toast({
          title: "Account Created!",
          description: "Welcome! Let's complete your subscription.",
        });
      } else {
        const { error } = await signIn(authData.email, authData.password);
        
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: "Invalid Credentials",
              description: "Please check your email and password.",
              variant: "destructive"
            });
          } else {
            throw error;
          }
          return;
        }

        toast({
          title: "Welcome back!",
          description: "Let's complete your subscription.",
        });
      }

      // Wait for auth state to update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Pre-fill payment form with auth data
      setPaymentData({
        name: authData.firstName,
        email: authData.email
      });
      
      setStep('payment');

    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayNow = async () => {
    if (!paymentData.name || !paymentData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update subscription status in database
      const { error } = await supabase
        .from('subscribers')
        .upsert({
          user_id: user?.id,
          email: paymentData.email,
          subscribed: true,
          subscription_tier: 'pro',
          subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          stripe_customer_id: null, // Will be filled when Stripe is integrated
          updated_at: new Date().toISOString()
        }, { onConflict: 'email' });

      if (error) {
        throw error;
      }

      setStep('success');
      onSubscriptionComplete();

      toast({
        title: "Welcome to FirstLook Pro! 🎉",
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
    setStep(user ? 'payment' : 'auth');
    setAuthMode('signup');
    setAuthData({ email: '', password: '', firstName: '', confirmPassword: '' });
    setPaymentData({ name: '', email: '' });
    onClose();
  };

  const handleBackToAuth = () => {
    setStep('auth');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {step === 'auth' ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                  {authMode === 'signup' ? 'Create Account & Subscribe' : 'Sign In & Subscribe'}
                </div>
              </DialogTitle>
            </DialogHeader>

            <Card className="border-2 border-blue-200">
              <CardHeader className="text-center pb-4">
                <Badge className="w-fit mx-auto mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  Pro Plan
                </Badge>
                <CardTitle className="text-xl">FirstLook Pro</CardTitle>
                <div className="text-2xl font-bold text-blue-600">
                  $29<span className="text-lg text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {proFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-4 border-t">
                  {authMode === 'signup' && (
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={authData.firstName}
                        onChange={(e) => handleAuthInputChange('firstName', e.target.value)}
                        placeholder="Enter your first name"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={authData.email}
                      onChange={(e) => handleAuthInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={authData.password}
                      onChange={(e) => handleAuthInputChange('password', e.target.value)}
                      placeholder={authMode === 'signup' ? 'Create a password (6+ characters)' : 'Enter your password'}
                    />
                  </div>

                  {authMode === 'signup' && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={authData.confirmPassword}
                        onChange={(e) => handleAuthInputChange('confirmPassword', e.target.value)}
                        placeholder="Confirm your password"
                      />
                    </div>
                  )}

                  <Button
                    onClick={handleAuth}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg"
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        {authMode === 'signup' ? <User className="mr-2 h-5 w-5" /> : <Mail className="mr-2 h-5 w-5" />}
                        {authMode === 'signup' ? 'Create Account & Continue' : 'Sign In & Continue'}
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <button
                      onClick={() => setAuthMode(authMode === 'signup' ? 'signin' : 'signup')}
                      className="text-sm text-blue-600 hover:text-blue-700 underline"
                    >
                      {authMode === 'signup' 
                        ? 'Already have an account? Sign in' 
                        : "Don't have an account? Sign up"}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : step === 'payment' ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                  Complete Your Subscription
                </div>
              </DialogTitle>
            </DialogHeader>

            <Card className="border-2 border-blue-200">
              <CardHeader className="text-center pb-4">
                <Badge className="w-fit mx-auto mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  Pro Plan
                </Badge>
                <CardTitle className="text-2xl">FirstLook Pro</CardTitle>
                <div className="text-3xl font-bold text-blue-600">
                  $29<span className="text-lg text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {proFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={paymentData.name}
                      onChange={(e) => handlePaymentInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={paymentData.email}
                      onChange={(e) => handlePaymentInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>

                  {/* Stripe Integration Placeholder */}
                  <div className="bg-gray-50 p-3 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <CreditCard className="w-4 h-4" />
                      <span>Payment details will be collected via Stripe (integration coming soon)</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!user && (
                      <Button
                        onClick={handleBackToAuth}
                        variant="outline"
                        className="flex-1"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                    )}
                    
                    <Button
                      onClick={handlePayNow}
                      disabled={isProcessing}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg"
                    >
                      {isProcessing ? (
                        "Processing..."
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Subscribe for $29/month
                        </>
                      )}
                    </Button>
                  </div>

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
                  Welcome to Pro!
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="text-center space-y-4">
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  🎉 You're now subscribed!
                </h3>
                <p className="text-green-700">
                  Your FirstLook Pro membership is active. You can now book unlimited home tours with same-day availability!
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">What's Next?</h4>
                <p className="text-blue-700 text-sm">
                  Head to your dashboard to start booking unlimited tours, or try our DIY Offer Maker tool when you're ready to buy.
                </p>
              </div>

              <Button
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                Start Booking Unlimited Tours
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
