
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "@/contexts/SimpleAuth0Context";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface StreamlinedSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const StreamlinedSignupModal = ({ isOpen, onClose, onSuccess }: StreamlinedSignupModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    budget: '',
    desiredAreas: ''
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
        toast({
          title: "Welcome Back!",
          description: "Processing your tour request...",
        });
      } else {
        // Store signup flag and form data for profile creation
        localStorage.setItem('signupFormData', JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          budget: formData.budget,
          desiredAreas: formData.desiredAreas
        }));
        
        await signUp(formData.email, formData.password, {
          user_type: 'buyer',
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone
        });
        
        toast({
          title: "Account Created!",
          description: "Welcome to FirstLook! Your tour request will be processed automatically...",
        });
      }
      
      onClose();
      setTimeout(() => {
        onSuccess();
      }, 500);
      
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to authenticate. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">
                {isLogin ? "Welcome back" : "Create your account"}
              </h3>
              <p className="text-gray-600 text-sm">
                {isLogin ? "Sign in to continue with your tour" : "Start your home search journey"}
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); isLogin ? handleAuthSubmit(e) : handleNext(); }} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                  className="mt-1 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  minLength={6}
                  className="mt-1 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading || !formData.email || !formData.password} 
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-lg"
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Continue')}
                {!loading && !isLogin && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
              
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsLogin(!isLogin)}
                disabled={loading}
                className="w-full text-gray-600 hover:text-gray-900"
              >
                {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
              </Button>
            </form>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">Tell us about yourself</h3>
              <p className="text-gray-600 text-sm">We'll use this to coordinate your tours</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="First name"
                    required
                    disabled={loading}
                    className="mt-1 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Last name"
                    required
                    disabled={loading}
                    className="mt-1 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                  required
                  disabled={loading}
                  className="mt-1 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleBack}
                  disabled={loading}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading || !formData.firstName || !formData.lastName || !formData.phone} 
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">Your house hunt preferences</h3>
              <p className="text-gray-600 text-sm">Help us find homes that match what you're looking for</p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <Label htmlFor="budget" className="text-sm font-medium text-gray-700">Budget Range</Label>
                <Input
                  id="budget"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  placeholder="e.g., $400,000 - $600,000"
                  disabled={loading}
                  className="mt-1 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                />
              </div>

              <div>
                <Label htmlFor="desiredAreas" className="text-sm font-medium text-gray-700">Preferred Areas</Label>
                <Input
                  id="desiredAreas"
                  value={formData.desiredAreas}
                  onChange={(e) => handleInputChange('desiredAreas', e.target.value)}
                  placeholder="e.g., Arlington, Alexandria, DC"
                  disabled={loading}
                  className="mt-1 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleBack}
                  disabled={loading}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium"
                >
                  {loading ? 'Creating Account...' : 'Complete & Book Tour'}
                </Button>
              </div>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl">
        <DialogHeader className="space-y-4 pb-2">
          <DialogTitle className="text-center text-2xl font-light text-gray-900">
            Book Your Tour
          </DialogTitle>
          {!isLogin && (
            <div className="space-y-2">
              <div className="flex justify-center items-center space-x-2">
                <span className="text-xs font-medium text-gray-500">Step {currentStep} of {totalSteps}</span>
              </div>
              <Progress value={progress} className="h-1 bg-gray-100" />
            </div>
          )}
        </DialogHeader>

        <div className="py-2">
          {renderStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StreamlinedSignupModal;
