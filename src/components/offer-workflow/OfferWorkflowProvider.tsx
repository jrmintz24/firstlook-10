
import { createContext, useContext, useState, ReactNode } from 'react';

interface OfferWorkflowContextType {
  currentOfferIntentId: string | null;
  setCurrentOfferIntentId: (id: string | null) => void;
  workflowStep: number;
  setWorkflowStep: (step: number) => void;
  isWorkflowActive: boolean;
  setIsWorkflowActive: (active: boolean) => void;
}

const OfferWorkflowContext = createContext<OfferWorkflowContextType | undefined>(undefined);

export const useOfferWorkflow = () => {
  const context = useContext(OfferWorkflowContext);
  if (context === undefined) {
    throw new Error('useOfferWorkflow must be used within an OfferWorkflowProvider');
  }
  return context;
};

interface OfferWorkflowProviderProps {
  children: ReactNode;
}

export const OfferWorkflowProvider = ({ children }: OfferWorkflowProviderProps) => {
  const [currentOfferIntentId, setCurrentOfferIntentId] = useState<string | null>(null);
  const [workflowStep, setWorkflowStep] = useState(1);
  const [isWorkflowActive, setIsWorkflowActive] = useState(false);

  const value: OfferWorkflowContextType = {
    currentOfferIntentId,
    setCurrentOfferIntentId,
    workflowStep,
    setWorkflowStep,
    isWorkflowActive,
    setIsWorkflowActive,
  };

  return (
    <OfferWorkflowContext.Provider value={value}>
      {children}
    </OfferWorkflowContext.Provider>
  );
};
