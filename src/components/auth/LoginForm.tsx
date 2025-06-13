
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SocialLoginButtons from "./SocialLoginButtons";

interface LoginFormProps {
  email: string;
  password: string;
  isLoading: boolean;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSocialLogin: (provider: 'google' | 'facebook') => void;
}

const LoginForm = ({ email, password, isLoading, onInputChange, onSubmit, onSocialLogin }: LoginFormProps) => {
  return (
    <Card className="border-0 bg-white">
      <CardHeader>
        <CardTitle className="text-xl text-gray-900 font-medium">Welcome back</CardTitle>
        <CardDescription className="text-gray-600 font-light">
          Sign in to your FirstLook account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SocialLoginButtons
          onGoogleLogin={() => onSocialLogin('google')}
          onFacebookLogin={() => onSocialLogin('facebook')}
          isLoading={isLoading}
          buttonText="signin"
        />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-gray-500 font-light">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => onInputChange('email', e.target.value)}
              required
              disabled={isLoading}
              className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
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
              className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
