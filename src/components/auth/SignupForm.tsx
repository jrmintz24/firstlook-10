
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import SocialLoginButtons from "./SocialLoginButtons";

interface SignupFormProps {
  userType: 'buyer' | 'agent' | 'admin';
  firstName: string;
  email: string;
  phone: string;
  password: string;
  licenseNumber: string;
  isLoading: boolean;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSocialLogin: (provider: 'google' | 'facebook') => void;
}

const SignupForm = ({ 
  userType, 
  firstName, 
  email, 
  phone, 
  password,
  licenseNumber, 
  isLoading, 
  onInputChange, 
  onSubmit, 
  onSocialLogin 
}: SignupFormProps) => {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-gray-800">Create your account</CardTitle>
        <CardDescription className="text-gray-600">
          {userType === 'buyer' 
            ? 'Start discovering homes with your free showing'
            : 'Join our network and start earning'
          }
        </CardDescription>
        {userType === 'agent' && (
          <Badge variant="secondary" className="w-fit bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border-purple-200">
            <Sparkles className="h-3 w-3 mr-1" />
            License verification required
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <SocialLoginButtons
          onGoogleLogin={() => onSocialLogin('google')}
          onFacebookLogin={() => onSocialLogin('facebook')}
          isLoading={isLoading}
          buttonText="signup"
        />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => onInputChange('firstName', e.target.value)}
              required
              disabled={isLoading}
              className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => onInputChange('email', e.target.value)}
              required
              disabled={isLoading}
              className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => onInputChange('password', e.target.value)}
              required
              disabled={isLoading}
              className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              minLength={6}
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => onInputChange('phone', e.target.value)}
              required
              disabled={isLoading}
              className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          {userType === 'agent' && (
            <div>
              <Label htmlFor="licenseNumber" className="text-gray-700 font-medium">Real Estate License Number</Label>
              <Input
                id="licenseNumber"
                value={licenseNumber}
                onChange={(e) => onInputChange('licenseNumber', e.target.value)}
                required
                placeholder="License # (will be verified)"
                disabled={isLoading}
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          )}
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 shadow-lg transform hover:scale-105 transition-all duration-300"
            disabled={isLoading}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
