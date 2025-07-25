
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/SimpleAuth0Context";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthForm } from "@/hooks/useAuthForm";
import SignupForm from "@/components/auth/SignupForm";
import LoginForm from "@/components/auth/LoginForm";
import { Home, Sparkles, Shield, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";

const BuyerAuth = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'signup';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showBenefits, setShowBenefits] = useState(initialTab !== 'login');
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'login' || tab === 'signup') {
      setActiveTab(tab);
      // Hide benefits section for login users by default
      setShowBenefits(tab !== 'login');
    }
  }, [searchParams]);

  // Auto-scroll to form for login users
  useEffect(() => {
    if (initialTab === 'login') {
      setTimeout(() => {
        const authCard = document.getElementById('auth-card');
        if (authCard) {
          authCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [initialTab]);

  // Handle successful authentication - let auth state change trigger navigation
  const buyerAuth = useAuthForm('buyer', () => {
    console.log('BuyerAuth: Auth success callback triggered');
    // Don't navigate here - let the auth state change handle it
  });

  // Listen for auth state changes and navigate when user is authenticated
  useEffect(() => {
    if (user && !loading) {
      console.log('BuyerAuth: User authenticated, navigating to dashboard');
      const userType = user.user_metadata?.user_type;
      const dashboardPath = userType === 'agent' ? '/agent-dashboard' : '/buyer-dashboard';
      navigate(dashboardPath, { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (user) {
    // This shouldn't happen due to the useEffect above, but just in case
    return null;
  }

  // Check if user came from property request
  const pendingTourRequest = localStorage.getItem('pendingTourRequest');
  const hasPendingTour = !!pendingTourRequest;

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-8">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-medium text-gray-900">
                FirstLook
              </span>
            </Link>
            <h1 className="text-3xl font-light text-gray-900 mb-4 tracking-tight">
              {activeTab === 'login' ? 'Welcome Back!' 
               : hasPendingTour ? 'Almost There!' : 'Welcome Home Buyer!'}
            </h1>
            <p className="text-gray-600 font-light leading-relaxed">
              {activeTab === 'login' 
                ? 'Sign in to continue your home search' 
                : hasPendingTour
                ? 'Create your account to complete your tour request'
                : 'Join thousands discovering their dream homes with zero commitment'
              }
            </p>
            
            {hasPendingTour && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 font-medium">
                  🏠 Tour Request Ready
                </p>
                <p className="text-xs text-blue-600">
                  Complete your account to book your showing
                </p>
              </div>
            )}
          </div>

          {/* Collapsible Benefits Section */}
          {(showBenefits || activeTab === 'signup') && !hasPendingTour && (
            <div className="mb-8">
              {activeTab === 'login' && (
                <div className="text-center mb-4">
                  <Button
                    variant="ghost"
                    onClick={() => setShowBenefits(!showBenefits)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {showBenefits ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Hide Benefits
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Why Choose FirstLook?
                      </>
                    )}
                  </Button>
                </div>
              )}
              
              {showBenefits && (
                <div className="grid grid-cols-1 gap-4 mb-8">
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">100% Free First Tour</h3>
                        <p className="text-sm text-gray-600 font-light">No upfront costs or commitments</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">No Buyer Agreements</h3>
                        <p className="text-sm text-gray-600 font-light">Tour homes without pressure</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Available 7 Days a Week</h3>
                        <p className="text-sm text-gray-600 font-light">See homes on your schedule</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Auth Form */}
          <Card id="auth-card" className="bg-white border border-gray-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-light text-gray-900 tracking-tight">
                {activeTab === 'login' ? 'Sign In' 
                 : hasPendingTour ? 'Complete Your Account' : 'Get Started Today'}
              </CardTitle>
              <CardDescription className="text-gray-600 font-light">
                {activeTab === 'login' 
                  ? 'Access your account to continue touring homes'
                  : hasPendingTour
                  ? 'Just one more step to book your tour'
                  : 'Create your account and start touring homes instantly'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signup">
                  <SignupForm
                    userType="buyer"
                    firstName={buyerAuth.formData.firstName}
                    email={buyerAuth.formData.email}
                    phone={buyerAuth.formData.phone}
                    password={buyerAuth.formData.password}
                    licenseNumber={buyerAuth.formData.licenseNumber}
                    isLoading={buyerAuth.isLoading}
                    onInputChange={buyerAuth.handleInputChange}
                    onSubmit={(e) => buyerAuth.handleSubmit(e, false)}
                    onSocialLogin={buyerAuth.handleSocialLogin}
                  />
                </TabsContent>
                
                <TabsContent value="login">
                  <LoginForm
                    email={buyerAuth.formData.email}
                    password={buyerAuth.formData.password}
                    isLoading={buyerAuth.isLoading}
                    onInputChange={buyerAuth.handleInputChange}
                    onSubmit={(e) => buyerAuth.handleSubmit(e, true)}
                    onSocialLogin={buyerAuth.handleSocialLogin}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-12">
            <Link to="/">
              <Button variant="ghost" className="text-gray-600 hover:bg-gray-100 font-light">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerAuth;
