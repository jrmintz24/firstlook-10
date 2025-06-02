
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, DollarSign, User, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AddressAutocomplete from "@/components/AddressAutocomplete";

interface PropertyRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const PropertyRequestForm = ({ isOpen, onClose }: PropertyRequestFormProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    propertyAddress: '',
    mlsId: '',
    preferredDate1: '',
    preferredTime1: '',
    preferredDate2: '',
    preferredTime2: '',
    preferredDate3: '',
    preferredTime3: '',
    notes: '',
    // Store selected properties for the tour session
    selectedProperties: [] as string[],
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1 && !formData.propertyAddress && !formData.mlsId) {
      toast({
        title: "Property Required",
        description: "Please provide either a property address or MLS ID",
        variant: "destructive"
      });
      return;
    }
    setStep(step + 1);
  };

  const handleAddProperty = () => {
    const propertyAddress = formData.propertyAddress || `MLS ID: ${formData.mlsId}`;
    if (propertyAddress && !formData.selectedProperties.includes(propertyAddress)) {
      setFormData(prev => ({
        ...prev,
        selectedProperties: [...prev.selectedProperties, propertyAddress],
        propertyAddress: '',
        mlsId: ''
      }));
      toast({
        title: "Property Added!",
        description: `Added "${propertyAddress}" to your tour session`,
      });
    }
  };

  const handleRemoveProperty = (propertyToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      selectedProperties: prev.selectedProperties.filter(prop => prop !== propertyToRemove)
    }));
  };

  const handleContinueToSubscriptions = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    // Store tour data in localStorage to persist across navigation
    const tourData = {
      properties: formData.selectedProperties,
      preferredDates: [
        { date: formData.preferredDate1, time: formData.preferredTime1 },
        { date: formData.preferredDate2, time: formData.preferredTime2 },
        { date: formData.preferredDate3, time: formData.preferredTime3 },
      ].filter(slot => slot.date && slot.time),
      notes: formData.notes,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('pendingTourRequest', JSON.stringify(tourData));
    
    onClose();
    navigate('/subscriptions');
  };

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              🏠 Request Your Tour
            </DialogTitle>
            <DialogDescription>
              Step {step} of 3 - Let's get you set up for your tour session
            </DialogDescription>
          </DialogHeader>

          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Select Properties for Your Tour
                </CardTitle>
                <CardDescription>
                  Add up to 3 homes to your tour session (save time and money!)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.selectedProperties.length > 0 && (
                  <div className="space-y-2">
                    <Label className="font-medium">Selected Properties:</Label>
                    {formData.selectedProperties.map((property, index) => (
                      <div key={index} className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                        <span className="text-sm font-medium text-green-800">{property}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveProperty(property)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <AddressAutocomplete
                  value={formData.propertyAddress}
                  onChange={(value) => handleInputChange('propertyAddress', value)}
                  placeholder="123 Main St, Washington, DC 20001"
                  label="Property Address"
                  id="propertyAddress"
                />
                <div className="text-center text-gray-500">— OR —</div>
                <div>
                  <Label htmlFor="mlsId">MLS ID</Label>
                  <Input
                    id="mlsId"
                    placeholder="DC1234567"
                    value={formData.mlsId}
                    onChange={(e) => handleInputChange('mlsId', e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  {formData.selectedProperties.length < 3 && (
                    <Button 
                      onClick={handleAddProperty} 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={!formData.propertyAddress && !formData.mlsId}
                    >
                      Add Property ({formData.selectedProperties.length}/3)
                    </Button>
                  )}
                  {formData.selectedProperties.length > 0 && (
                    <Button onClick={handleNext} className="flex-1 bg-blue-600 hover:bg-blue-700">
                      Continue to Scheduling
                    </Button>
                  )}
                </div>

                {formData.selectedProperties.length === 0 && (formData.propertyAddress || formData.mlsId) && (
                  <Button onClick={handleNext} className="w-full bg-blue-600 hover:bg-blue-700">
                    Continue with Single Property
                  </Button>
                )}

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">💡 Pro Tip</h4>
                  <p className="text-sm text-blue-700">
                    Add multiple homes to one session to save money! A 3-home session costs less than 3 individual tours.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Preferred Tour Times
                </CardTitle>
                <CardDescription>
                  Choose up to 3 time slots to increase your chances of quick scheduling
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="space-y-2">
                    <Label className="font-medium">Option {num}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor={`date${num}`} className="text-sm">Date</Label>
                        <Input
                          id={`date${num}`}
                          type="date"
                          value={formData[`preferredDate${num}` as keyof typeof formData]}
                          onChange={(e) => handleInputChange(`preferredDate${num}`, e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`time${num}`} className="text-sm">Time</Label>
                        <select
                          id={`time${num}`}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background"
                          value={formData[`preferredTime${num}` as keyof typeof formData]}
                          onChange={(e) => handleInputChange(`preferredTime${num}`, e.target.value)}
                        >
                          <option value="">Select time</option>
                          {timeSlots.map((time) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleNext} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Tour Session Summary
                </CardTitle>
                <CardDescription>
                  Review your tour details and continue to sign in
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tour Summary */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Your Tour Session</h4>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div>
                      <strong>Properties:</strong> {formData.selectedProperties.length || 1} home{(formData.selectedProperties.length || 1) > 1 ? 's' : ''}
                    </div>
                    {formData.selectedProperties.length > 0 ? (
                      <ul className="list-disc list-inside ml-2">
                        {formData.selectedProperties.map((property, index) => (
                          <li key={index}>{property}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="ml-2">{formData.propertyAddress || `MLS ID: ${formData.mlsId}`}</div>
                    )}
                    {formData.preferredDate1 && formData.preferredTime1 && (
                      <div><strong>Preferred Time:</strong> {formData.preferredDate1} at {formData.preferredTime1}</div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Special Requests (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any specific areas you'd like to focus on, accessibility needs, or questions about the properties..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-2">🎉 Almost Ready!</h4>
                  <p className="text-sm text-green-700 mb-3">
                    Next, you'll sign in and choose your plan. We'll then match you with a licensed showing partner and confirm your tour within 24 hours.
                  </p>
                  <div className="text-xs text-green-600">
                    <div>✓ Licensed DC professionals only</div>
                    <div>✓ No pressure, no agent commitments</div>
                    <div>✓ Your contact info stays private</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(2)} 
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleContinueToSubscriptions}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    Sign In & Choose Plan
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>

      {/* Quick Sign-In Modal */}
      {showAuthModal && (
        <QuickSignInModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleContinueToSubscriptions}
        />
      )}
    </>
  );
};

// Quick Sign-In Modal Component
const QuickSignInModal = ({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signUp, signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast({
            title: "Sign In Failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "Redirecting to plans...",
          });
          onClose();
          onSuccess();
        }
      } else {
        const metadata = {
          first_name: formData.firstName,
          last_name: '',
          user_type: 'buyer'
        };

        const { error } = await signUp(formData.email, formData.password, metadata);
        if (error) {
          toast({
            title: "Sign Up Failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Account Created!",
            description: "Redirecting to plans...",
          });
          onClose();
          onSuccess();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign In to Continue</DialogTitle>
          <DialogDescription>
            Quick sign-in to secure your tour session and choose your plan
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Social Login Buttons */}
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "Google sign-in will be available soon!",
                });
              }}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "Facebook sign-in will be available soon!",
                });
              }}
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                  placeholder="John"
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
                placeholder="Choose a secure password"
                minLength={6}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (isLogin ? "Signing In..." : "Creating Account...") : (isLogin ? "Sign In" : "Create Account")}
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm"
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyRequestForm;
