
export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<OnboardingStepProps>;
  isComplete: (profile: any) => boolean;
  canSkip?: boolean;
}

export interface OnboardingStepProps {
  profile: any;
  onUpdate: (updates: any) => Promise<void>;
  onNext: () => void;
  onSkip?: () => void;
  isLoading: boolean;
}

export interface OnboardingProgress {
  currentStep: number;
  totalSteps: number;
  completedSteps: string[];
}
