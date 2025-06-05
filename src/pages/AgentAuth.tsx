
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
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
    // Could redirect to agent dashboard when implemented
    navigate('/');
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Redirect if already authenticated
  if (user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                FirstLook
              </span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Join Our Showing Partners
            </h1>
            <p className="text-gray-600">
              Turn your downtime into quality leads and extra income
            </p>
          </div>

          {/* Benefits Cards */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Earn $50-100+ Per Showing</h3>
                  <p className="text-sm text-gray-600">Plus commission opportunities</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Pre-Qualified Leads</h3>
                  <p className="text-sm text-gray-600">Ready-to-buy prospects</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">35% Lead Conversion</h3>
                  <p className="text-sm text-gray-600">To full representation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Auth Form */}
          <Card className="bg-white/90 backdrop-blur-sm border-purple-100 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Join Our Network
              </CardTitle>
              <CardDescription>
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
                    licenseNumber={agentAuth.formData.licenseNumber}
                    isLoading={agentAuth.isLoading}
                    onInputChange={agentAuth.handleInputChange}
                    onSubmit={(e) => {
                      agentAuth.setIsLogin(false);
                      agentAuth.handleSubmit(e);
                    }}
                    onSocialLogin={agentAuth.handleSocialLogin}
                  />
                </TabsContent>
                
                <TabsContent value="login">
                  <LoginForm
                    email={agentAuth.formData.email}
                    password={agentAuth.formData.password}
                    isLoading={agentAuth.isLoading}
                    onInputChange={agentAuth.handleInputChange}
                    onSubmit={(e) => {
                      agentAuth.setIsLogin(true);
                      agentAuth.handleSubmit(e);
                    }}
                    onSocialLogin={agentAuth.handleSocialLogin}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Licensed professionals only</span>
            </div>
            <Link to="/agents">
              <Button variant="ghost" className="text-purple-600 hover:bg-purple-50 mr-4">
                Back to Agent Info
              </Button>
            </Link>
            <Link to="/">
              <Button variant="ghost" className="text-purple-600 hover:bg-purple-50">
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

export default AgentAuth;
