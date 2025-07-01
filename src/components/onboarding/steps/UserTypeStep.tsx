
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Building } from 'lucide-react';
import type { OnboardingStepProps } from '@/types/onboarding';

const UserTypeStep: React.FC<OnboardingStepProps> = ({ 
  profile, 
  onUpdate, 
  onNext, 
  isLoading 
}) => {
  const handleUserTypeSelect = async (userType: 'buyer' | 'agent') => {
    await onUpdate({ user_type: userType });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Tell us about yourself
        </h2>
        <p className="text-gray-600">
          Are you looking to buy a home or help others find homes?
        </p>
      </div>

      <div className="grid gap-4">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-300"
          onClick={() => handleUserTypeSelect('buyer')}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  I'm a Home Buyer
                </h3>
                <p className="text-gray-600">
                  Looking to find and tour homes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-green-300"
          onClick={() => handleUserTypeSelect('agent')}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  I'm a Real Estate Agent
                </h3>
                <p className="text-gray-600">
                  Helping buyers find their perfect home
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {profile?.user_type && (
        <div className="text-center">
          <Button onClick={onNext} disabled={isLoading} className="w-full">
            Continue
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserTypeStep;
