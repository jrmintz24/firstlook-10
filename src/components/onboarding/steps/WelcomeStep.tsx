
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Shield, Clock } from 'lucide-react';
import type { OnboardingStepProps } from '@/types/onboarding';

const WelcomeStep: React.FC<OnboardingStepProps> = ({ onNext }) => {
  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
        <Sparkles className="h-8 w-8 text-purple-600" />
      </div>
      
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Welcome to FirstLook!
        </h2>
        <p className="text-gray-600">
          We're excited to help you with your real estate journey. Let's get you set up with a personalized experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
        <div className="text-center p-4">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Sparkles className="h-5 w-5 text-gray-600" />
          </div>
          <h3 className="font-medium text-gray-900">Personalized</h3>
          <p className="text-sm text-gray-600">Tailored to your needs</p>
        </div>
        <div className="text-center p-4">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Shield className="h-5 w-5 text-gray-600" />
          </div>
          <h3 className="font-medium text-gray-900">Secure</h3>
          <p className="text-sm text-gray-600">Your data is protected</p>
        </div>
        <div className="text-center p-4">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Clock className="h-5 w-5 text-gray-600" />
          </div>
          <h3 className="font-medium text-gray-900">Quick Setup</h3>
          <p className="text-sm text-gray-600">Takes just 2 minutes</p>
        </div>
      </div>

      <Button onClick={onNext} size="lg" className="w-full">
        Get Started
      </Button>
    </div>
  );
};

export default WelcomeStep;
