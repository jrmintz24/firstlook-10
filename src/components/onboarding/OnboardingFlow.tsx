
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePWA } from '@/hooks/usePWA';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  canSkip?: boolean;
}

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const { userType } = useAuth();
  const { isInstallable, installApp, requestNotificationPermission } = usePWA();

  const buyerSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to FirstLook',
      description: 'Let\'s get you started with requesting property showings',
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🏠</div>
          <p className="text-gray-600">
            FirstLook makes it easy to request and schedule property showings with licensed agents.
          </p>
        </div>
      ),
    },
    {
      id: 'request-showing',
      title: 'How to Request a Showing',
      description: 'Learn how to request property showings',
      content: (
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
            <div>
              <h4 className="font-medium">Enter Property Address</h4>
              <p className="text-sm text-gray-600">Simply enter the address of the property you want to see</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
            <div>
              <h4 className="font-medium">Choose Your Preferred Time</h4>
              <p className="text-sm text-gray-600">Select when you'd like to view the property</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
            <div>
              <h4 className="font-medium">Get Matched with an Agent</h4>
              <p className="text-sm text-gray-600">We'll connect you with a licensed agent in your area</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'dashboard',
      title: 'Your Dashboard',
      description: 'Track your showing requests and status updates',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Your dashboard shows all your showing requests, their current status, and upcoming appointments.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900">Status Updates</h4>
            <p className="text-sm text-blue-700">
              You'll receive real-time updates as your showing request moves through our process.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const agentSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome Agent',
      description: 'Get started with managing showing requests',
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🏘️</div>
          <p className="text-gray-600">
            FirstLook connects you with buyers looking for property showings in your area.
          </p>
        </div>
      ),
    },
    {
      id: 'manage-requests',
      title: 'Managing Requests',
      description: 'Learn how to handle showing requests efficiently',
      content: (
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
            <div>
              <h4 className="font-medium">View Unassigned Requests</h4>
              <p className="text-sm text-gray-600">See all new showing requests in your area</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
            <div>
              <h4 className="font-medium">Assign to Yourself</h4>
              <p className="text-sm text-gray-600">Take ownership of requests you can handle</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
            <div>
              <h4 className="font-medium">Update Status</h4>
              <p className="text-sm text-gray-600">Keep buyers informed with status updates</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'dashboard',
      title: 'Agent Dashboard',
      description: 'Your central hub for managing all showing activities',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Your dashboard provides a complete overview of all your showing requests, active showings, and performance metrics.
          </p>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-900">Real-time Updates</h4>
            <p className="text-sm text-purple-700">
              Get notified instantly when new requests come in or when buyers update their preferences.
            </p>
          </div>
        </div>
      ),
    },
  ];

  if (isInstallable) {
    const installStep: OnboardingStep = {
      id: 'install',
      title: 'Install FirstLook',
      description: 'Get quick access from your home screen',
      canSkip: true,
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">📱</div>
          <p className="text-gray-600">
            Install FirstLook on your device for quick access and offline functionality.
          </p>
          <Button onClick={installApp} className="w-full">
            Install App
          </Button>
        </div>
      ),
    };
    
    buyerSteps.push(installStep);
    agentSteps.push(installStep);
  }

  const notificationStep: OnboardingStep = {
    id: 'notifications',
    title: 'Enable Notifications',
    description: 'Stay updated on your showing requests',
    canSkip: true,
    content: (
      <div className="text-center space-y-4">
        <div className="text-6xl mb-4">🔔</div>
        <p className="text-gray-600">
          Get notified about status updates, new requests, and important messages.
        </p>
        <Button onClick={requestNotificationPermission} className="w-full">
          Enable Notifications
        </Button>
      </div>
    ),
  };

  buyerSteps.push(notificationStep);
  agentSteps.push(notificationStep);

  const steps = userType === 'agent' ? agentSteps : buyerSteps;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    const step = steps[currentStep];
    setCompletedSteps(prev => new Set([...prev, step.id]));
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                {currentStepData.title}
              </CardTitle>
              <span className="text-sm text-gray-500">
                {currentStep + 1} of {steps.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <CardDescription>
              {currentStepData.description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStepData.content}
          
          <div className="flex justify-between">
            <div>
              {currentStep > 0 && (
                <Button variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex space-x-2">
              {currentStepData.canSkip && (
                <Button variant="ghost" onClick={handleSkip}>
                  Skip
                </Button>
              )}
              <Button onClick={handleNext}>
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                {currentStep !== steps.length - 1 && (
                  <ArrowRight className="h-4 w-4 ml-2" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
