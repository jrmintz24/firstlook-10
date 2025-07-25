
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/Auth0AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthForm } from "@/hooks/useAuthForm";
import SignupForm from "@/components/auth/SignupForm";
import LoginForm from "@/components/auth/LoginForm";
import { Home, DollarSign, Users, TrendingUp, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const AgentAuth = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'signup';
  const [activeTab, setActiveTab] = useState(initialTab);
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'login' || tab === 'signup') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const agentAuth = useAuthForm('agent', () => {
    toast({
      title: "Welcome to FirstLook!",
      description: "You're now part of our showing partner network.",
    });
    navigate('/agent-dashboard');
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (user) {
    navigate('/agent-dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Link to="/" className="inline-flex items-center space-x-2 mb-8">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-medium text-gray-900">
                FirstLook
              </span>
            </Link>
            <h1 className="text-3xl font-light text-gray-900 mb-4 tracking-tight">
              Join Our Showing Partners
            </h1>
            <p className="text-gray-600 font-light leading-relaxed">
              Turn your downtime into quality leads and extra income
            </p>
          </div>

          {/* Benefits Cards */}
          <div className="grid grid-cols-1 gap-4 mb-12">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Earn $50-100+ Per Showing</h3>
                  <p className="text-sm text-gray-600 font-light">Plus commission opportunities</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Pre-Qualified Leads</h3>
                  <p className="text-sm text-gray-600 font-light">Ready-to-buy prospects</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">35% Lead Conversion</h3>
                  <p className="text-sm text-gray-600 font-light">To full representation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Auth Form */}
          <Card className="bg-white border border-gray-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-light text-gray-900 tracking-tight">
                Join Our Network
              </CardTitle>
              <CardDescription className="text-gray-600 font-light">
                Licensed professionals only - start earning within 48 hours
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
                    userType="agent"
                    firstName={agentAuth.formData.firstName}
                    email={agentAuth.formData.email}
                    phone={agentAuth.formData.phone}
                    password={agentAuth.formData.password}
                    licenseNumber={agentAuth.formData.licenseNumber}
                    isLoading={agentAuth.isLoading}
                    onInputChange={agentAuth.handleInputChange}
                    onSubmit={(e) => agentAuth.handleSubmit(e, false)}
                    onSocialLogin={agentAuth.handleSocialLogin}
                  />
                </TabsContent>
                
                <TabsContent value="login">
                  <LoginForm
                    email={agentAuth.formData.email}
                    password={agentAuth.formData.password}
                    isLoading={agentAuth.isLoading}
                    onInputChange={agentAuth.handleInputChange}
                    onSubmit={(e) => agentAuth.handleSubmit(e, true)}
                    onSocialLogin={agentAuth.handleSocialLogin}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-12 space-y-4">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span className="font-light">Licensed professionals only</span>
            </div>
            <div className="space-x-4">
              <Link to="/agents">
                <Button variant="ghost" className="text-gray-600 hover:bg-gray-100 font-light">
                  Back to Agent Info
                </Button>
              </Link>
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
    </div>
  );
};

export default AgentAuth;
