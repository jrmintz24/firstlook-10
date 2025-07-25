
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/Auth0AuthContext";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthForm } from "@/hooks/useAuthForm";
import SignupForm from "@/components/auth/SignupForm";
import LoginForm from "@/components/auth/LoginForm";

const AdminAuth = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "login";
  const [activeTab, setActiveTab] = useState(initialTab);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "login" || tab === "signup") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const adminAuth = useAuthForm("admin", () => {
    navigate("/admin-dashboard");
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (user) {
    navigate("/admin-dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card className="bg-white border border-gray-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-light text-gray-900 tracking-tight">
                Admin Portal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="signup">
                  <SignupForm
                    userType="admin"
                    firstName={adminAuth.formData.firstName}
                    email={adminAuth.formData.email}
                    phone={adminAuth.formData.phone}
                    password={adminAuth.formData.password}
                    licenseNumber={adminAuth.formData.licenseNumber}
                    isLoading={adminAuth.isLoading}
                    onInputChange={adminAuth.handleInputChange}
                    onSubmit={(e) => adminAuth.handleSubmit(e, false)}
                    onSocialLogin={adminAuth.handleSocialLogin}
                  />
                </TabsContent>
                <TabsContent value="login">
                  <LoginForm
                    email={adminAuth.formData.email}
                    password={adminAuth.formData.password}
                    isLoading={adminAuth.isLoading}
                    onInputChange={adminAuth.handleInputChange}
                    onSubmit={(e) => adminAuth.handleSubmit(e, true)}
                    onSocialLogin={adminAuth.handleSocialLogin}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          <div className="text-center mt-8">
            <Link to="/">
              <Button variant="ghost" className="text-gray-600 hover:bg-gray-100 font-light">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
