import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/Auth0AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePendingTourHandler } from '@/hooks/usePendingTourHandler';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowRight, X, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import WelcomeStep from './steps/WelcomeStep';
import PersonalInfoStep from './steps/PersonalInfoStep';
import UserTypeStep from './steps/UserTypeStep';
import PreferencesStep from './steps/PreferencesStep';
import CompletionStep from './steps/CompletionStep';
import type { OnboardingStep, OnboardingProgress } from '@/types/onboarding';
import type { EnhancedProfile } from '@/types/profile';

const OnboardingWizard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { triggerPendingTourProcessing } = usePendingTourHandler();
  const [profile, setProfile] = useState<EnhancedProfile | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('OnboardingWizard: Initializing with user:', user?.id);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to FirstLook',
      description: 'Let\'s get you set up in just a few minutes',
      component: WelcomeStep,
      isComplete: () => true,
      canSkip: false
    },
    {
      id: 'user-type',
      title: 'Tell us about yourself',
      description: 'Are you a buyer or an agent?',
      component: UserTypeStep,
      isComplete: (profile) => !!profile?.user_type,
      canSkip: false
    },
    {
      id: 'personal-info',
      title: 'Personal Information',
      description: 'Help us personalize your experience',
      component: PersonalInfoStep,
      isComplete: (profile) => !!(profile?.first_name && profile?.last_name && profile?.phone),
      canSkip: false
    },
    {
      id: 'preferences',
      title: 'Your Preferences',
      description: 'Customize your experience',
      component: PreferencesStep,
      isComplete: (profile) => {
        if (profile?.user_type === 'buyer') {
          return !!(profile?.buyer_preferences?.budget || profile?.buyer_preferences?.desiredAreas?.length);
        }
        if (profile?.user_type === 'agent') {
          return !!(profile?.agent_details?.brokerage || profile?.agent_details?.areasServed?.length);
        }
        return true;
      },
      canSkip: true
    },
    {
      id: 'completion',
      title: 'You\'re all set!',
      description: 'Welcome to FirstLook',
      component: CompletionStep,
      isComplete: () => true,
      canSkip: false
    }
  ];

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    } else {
      console.log('OnboardingWizard: No user found');
      setLoading(false);
      setError('No user session found. Please try signing in again.');
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user?.id) return;

    console.log('OnboardingWizard: Fetching profile for user:', user.id);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('OnboardingWizard: Error fetching profile:', error);
        throw error;
      }

      if (data) {
        const enhancedProfile: EnhancedProfile = {
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          user_type: (data.user_type as 'buyer' | 'agent' | 'admin') || 'buyer',
          photo_url: data.photo_url,
          buyer_preferences: data.buyer_preferences as any || {},
          agent_details: data.agent_details as any || {},
          communication_preferences: data.communication_preferences as any || {},
          onboarding_completed: data.onboarding_completed || false,
          profile_completion_percentage: data.profile_completion_percentage || 0,
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        
        console.log('OnboardingWizard: Profile loaded:', enhancedProfile);
        setProfile(enhancedProfile);

        // If onboarding is already completed, redirect to dashboard
        if (enhancedProfile.onboarding_completed) {
          console.log('OnboardingWizard: Onboarding already completed, redirecting');
          const dashboardUrl = enhancedProfile.user_type === 'agent' ? '/agent-dashboard' : '/buyer-dashboard';
          window.location.href = dashboardUrl;
          return;
        }
      } else {
        console.log('OnboardingWizard: No profile found, creating default');
        const defaultProfile: EnhancedProfile = {
          id: user.id,
          user_type: 'buyer',
          buyer_preferences: {},
          agent_details: {},
          communication_preferences: {},
          onboarding_completed: false,
          profile_completion_percentage: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setProfile(defaultProfile);
      }
    } catch (error) {
      console.error('OnboardingWizard: Error in fetchProfile:', error);
      setError('Failed to load profile information. Please refresh the page.');
      toast({
        title: "Error",
        description: "Failed to load profile information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<EnhancedProfile>) => {
    if (!user?.id || !profile) return;

    console.log('OnboardingWizard: Updating profile with:', updates);
    setSaving(true);
    setError(null);
    
    try {
      const updatedProfile = { ...profile, ...updates };
      
      // Calculate completion percentage
      const completionPercentage = calculateCompletionPercentage(updatedProfile);
      updatedProfile.profile_completion_percentage = completionPercentage;

      const supabaseData = {
        id: user.id,
        first_name: updatedProfile.first_name || null,
        last_name: updatedProfile.last_name || null,
        phone: updatedProfile.phone || null,
        user_type: updatedProfile.user_type || 'buyer',
        photo_url: updatedProfile.photo_url || null,
        buyer_preferences: updatedProfile.buyer_preferences as any,
        agent_details: updatedProfile.agent_details as any,
        communication_preferences: updatedProfile.communication_preferences as any,
        onboarding_completed: updatedProfile.onboarding_completed || false,
        profile_completion_percentage: updatedProfile.profile_completion_percentage || 0,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(supabaseData);

      if (error) {
        console.error('OnboardingWizard: Error updating profile:', error);
        throw error;
      }

      console.log('OnboardingWizard: Profile updated successfully');
      setProfile(updatedProfile);
    } catch (error) {
      console.error('OnboardingWizard: Error in updateProfile:', error);
      setError('Failed to update profile. Please try again.');
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const calculateCompletionPercentage = (profile: EnhancedProfile): number => {
    const requiredFields = ['first_name', 'last_name', 'phone', 'user_type'];
    let totalFields = requiredFields.length;
    let completedFields = 0;

    requiredFields.forEach(field => {
      if (profile[field as keyof EnhancedProfile]) completedFields++;
    });

    if (profile.user_type === 'buyer' && profile.buyer_preferences) {
      const buyerFields = ['budget', 'desiredAreas'];
      totalFields += buyerFields.length;
      
      buyerFields.forEach(field => {
        if (profile.buyer_preferences?.[field as keyof typeof profile.buyer_preferences]) {
          completedFields++;
        }
      });
    }

    if (profile.user_type === 'agent' && profile.agent_details) {
      const agentFields = ['brokerage', 'areasServed'];
      totalFields += agentFields.length;
      
      agentFields.forEach(field => {
        if (profile.agent_details?.[field as keyof typeof profile.agent_details]) {
          completedFields++;
        }
      });
    }

    return Math.round((completedFields / totalFields) * 100);
  };

  const handleNext = () => {
    console.log('OnboardingWizard: Moving to next step');
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    console.log('OnboardingWizard: Skipping current step');
    if (steps[currentStep].canSkip && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = async () => {
    console.log('OnboardingWizard: Completing onboarding');
    await updateProfile({ onboarding_completed: true });
    
    // Check for pending tour request and trigger processing
    const pendingTourRequest = localStorage.getItem('pendingTourRequest');
    if (pendingTourRequest) {
      console.log('OnboardingWizard: Found pending tour request, triggering processing...');
      
      // Use setTimeout to ensure the profile is updated and the dashboard is ready
      setTimeout(() => {
        console.log('OnboardingWizard: Manually triggering pending tour processing');
        triggerPendingTourProcessing();
        
        // Navigate to dashboard after triggering tour processing
        const dashboardUrl = profile?.user_type === 'agent' ? '/agent-dashboard' : '/buyer-dashboard';
        window.location.href = dashboardUrl;
      }, 1000);
    } else {
      // Direct navigation to dashboard if no pending tour
      const dashboardUrl = profile?.user_type === 'agent' ? '/agent-dashboard' : '/buyer-dashboard';
      console.log('OnboardingWizard: No pending tour, redirecting to:', dashboardUrl);
      window.location.href = dashboardUrl;
    }
  };

  const progress: OnboardingProgress = {
    currentStep: currentStep + 1,
    totalSteps: steps.length,
    completedSteps: steps.slice(0, currentStep).map(s => s.id)
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-semibold text-gray-900">Something went wrong</h2>
            <p className="text-gray-600">{error}</p>
            <div className="space-y-2">
              <Button onClick={fetchProfile} className="w-full">
                Try Again
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="text-gray-600">Unable to load profile. Please try refreshing the page.</p>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Getting Started</h1>
              <p className="text-gray-600">Step {progress.currentStep} of {progress.totalSteps}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = '/'}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Progress value={(progress.currentStep / progress.totalSteps) * 100} className="h-2" />
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Current Step */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              {steps[currentStep].isComplete(profile) && (
                <CheckCircle className="h-6 w-6 text-green-500" />
              )}
              <div>
                <CardTitle>{steps[currentStep].title}</CardTitle>
                <p className="text-gray-600 mt-1">{steps[currentStep].description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CurrentStepComponent
              profile={profile}
              onUpdate={updateProfile}
              onNext={currentStep === steps.length - 1 ? handleComplete : handleNext}
              onSkip={steps[currentStep].canSkip ? handleSkip : undefined}
              isLoading={saving}
            />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          
          <div className="flex gap-2">
            {steps[currentStep].canSkip && (
              <Button variant="ghost" onClick={handleSkip}>
                Skip for now
              </Button>
            )}
            <Button
              onClick={currentStep === steps.length - 1 ? handleComplete : handleNext}
              disabled={(!steps[currentStep].isComplete(profile) && !steps[currentStep].canSkip) || saving}
            >
              {saving ? 'Saving...' : currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
