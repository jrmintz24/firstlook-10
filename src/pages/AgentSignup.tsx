
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, Shield, TrendingUp } from "lucide-react";
import { useAuthForm } from "@/hooks/useAuthForm";
import SignupForm from "@/components/auth/SignupForm";
import LoginForm from "@/components/auth/LoginForm";

const AgentSignup = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthSuccess = () => {
    // Redirect will be handled by the auth context
    setShowAuthModal(false);
  };

  const {
    isLogin,
    setIsLogin,
    formData,
    isLoading,
    handleInputChange,
    handleSubmit,
    handleSocialLogin
  } = useAuthForm('agent', handleAuthSuccess);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-purple-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                FirstLook
              </span>
            </Link>
            <Link to="/agents">
              <Button variant="ghost" className="flex items-center gap-2 text-gray-600 hover:text-purple-600">
                <ArrowLeft className="w-4 h-4" />
                Back to Agent Info
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Benefits */}
            <div className="space-y-8">
              <div>
                <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Join 200+ Licensed Agents
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-blue-600 bg-clip-text text-transparent mb-6">
                  Start Earning with FirstLook
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Join our network of licensed agents and start earning from qualified buyer leads. Provide one free showing per month and unlock unlimited paid opportunities.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-4 bg-white/80 rounded-lg border border-purple-100">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">$75</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Average Per Showing</h3>
                    <p className="text-gray-600">Earn $50-100+ per showing plus conversion opportunities</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-white/80 rounded-lg border border-purple-100">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Pre-Qualified Leads</h3>
                    <p className="text-gray-600">All leads are screened and ready to view homes</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-white/80 rounded-lg border border-purple-100">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Flexible Schedule</h3>
                    <p className="text-gray-600">Work as much or as little as you want</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-gray-900 mb-2">What's Required?</h3>
                <p className="text-gray-700">
                  • Valid real estate license<br/>
                  • Provide one free showing per month<br/>
                  • Professional service standards
                </p>
              </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="max-w-md mx-auto w-full">
              {isLogin ? (
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800">Welcome Back, Agent</CardTitle>
                    <CardDescription className="text-gray-600">
                      Sign in to access your agent dashboard
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <LoginForm
                      email={formData.email}
                      password={formData.password}
                      isLoading={isLoading}
                      onInputChange={handleInputChange}
                      onSubmit={handleSubmit}
                      onSocialLogin={handleSocialLogin}
                    />
                    <div className="text-center">
                      <Button
                        variant="ghost"
                        onClick={() => setIsLogin(false)}
                        className="text-purple-600 hover:text-purple-700"
                      >
                        New agent? Create account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  <SignupForm
                    userType="agent"
                    firstName={formData.firstName}
                    email={formData.email}
                    phone={formData.phone}
                    password={formData.password}
                    licenseNumber={formData.licenseNumber}
                    isLoading={isLoading}
                    onInputChange={handleInputChange}
                    onSubmit={handleSubmit}
                    onSocialLogin={handleSocialLogin}
                  />
                  <div className="text-center">
                    <Button
                      variant="ghost"
                      onClick={() => setIsLogin(true)}
                      className="text-purple-600 hover:text-purple-700"
                    >
                      Already have an account? Sign in
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentSignup;
