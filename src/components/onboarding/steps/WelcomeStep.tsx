
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Shield, Clock } from 'lucide-react';
import type { OnboardingStepProps } from '@/types/onboarding';

const WelcomeStep: React.FC<OnboardingStepProps> = ({ onNext, isLoading }) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
          <Sparkles className="h-8 w-8 text-purple-600" />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to FirstLook! 🎉
          </h2>
          <p className="text-gray-600 text-lg">
            Let's get your account set up so you can start touring homes
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">100% Free First Tour</h3>
              <p className="text-sm text-gray-600">No upfront costs or commitments</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">No Buyer Agreements</h3>
              <p className="text-sm text-gray-600">Tour homes without pressure</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Available 7 Days a Week</h3>
              <p className="text-sm text-gray-600">See homes on your schedule</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button 
          onClick={onNext} 
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? 'Setting up...' : 'Get Started'}
        </Button>
      </div>
    </div>
  );
};

export default WelcomeStep;
