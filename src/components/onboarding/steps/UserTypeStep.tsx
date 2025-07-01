
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, Briefcase } from 'lucide-react';
import type { OnboardingStepProps } from '@/types/onboarding';

const UserTypeStep: React.FC<OnboardingStepProps> = ({ profile, onUpdate, onNext, isLoading }) => {
  const handleUserTypeSelect = async (userType: 'buyer' | 'agent') => {
    await onUpdate({ user_type: userType });
    setTimeout(onNext, 500); // Small delay for better UX
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          How will you be using FirstLook?
        </h2>
        <p className="text-gray-600">
          This helps us customize your experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${
            profile.user_type === 'buyer' ? 'ring-2 ring-purple-500' : ''
          }`}
          onClick={() => handleUserTypeSelect('buyer')}
        >
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">I'm a Home Buyer</h3>
            <p className="text-sm text-gray-600">
              Looking to buy a home and want to tour properties with experienced agents
            </p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${
            profile.user_type === 'agent' ? 'ring-2 ring-purple-500' : ''
          }`}
          onClick={() => handleUserTypeSelect('agent')}
        >
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">I'm a Real Estate Agent</h3>
            <p className="text-sm text-gray-600">
              Want to earn extra income by showing properties to qualified buyers
            </p>
          </CardContent>
        </Card>
      </div>

      {profile.user_type && (
        <div className="text-center">
          <Button onClick={onNext} disabled={isLoading}>
            Continue as {profile.user_type === 'buyer' ? 'Home Buyer' : 'Real Estate Agent'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserTypeStep;
