
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import type { OnboardingStepProps } from '@/types/onboarding';

const CompletionStep: React.FC<OnboardingStepProps> = ({ profile, onNext, isLoading }) => {
  const getDashboardUrl = () => {
    return profile.user_type === 'agent' ? '/agent-dashboard' : '/buyer-dashboard';
  };

  const getWelcomeMessage = () => {
    if (profile.user_type === 'agent') {
      return {
        title: `Welcome to FirstLook, ${profile.first_name}!`,
        subtitle: 'You\'re ready to start earning with our showing partner network',
        features: [
          'Receive qualified buyer leads',
          'Earn $50-100+ per showing',
          'Build your client base',
          'Flexible scheduling'
        ]
      };
    }
    
    return {
      title: `Welcome to FirstLook, ${profile.first_name}!`,
      subtitle: 'You\'re all set to start touring homes with our expert agents',
      features: [
        'Book your first free showing',
        'Tour homes on your schedule',
        'No buyer agreements required',
        'Expert agent guidance'
      ]
    };
  };

  const welcome = getWelcomeMessage();

  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {welcome.title}
        </h2>
        <p className="text-gray-600 text-lg">
          {welcome.subtitle}
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">What's next:</h3>
        <ul className="space-y-2 text-left">
          {welcome.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button onClick={onNext} size="lg" className="w-full" disabled={isLoading}>
        Go to Dashboard
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};

export default CompletionStep;
