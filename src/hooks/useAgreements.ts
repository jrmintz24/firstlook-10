
import { useCallback } from 'react';

export const useAgreements = (userId: string, toast: any, onComplete?: () => void) => {
  const handleSignAgreement = useCallback((agreement: any) => {
    console.log('Signing agreement:', agreement);
    toast({
      title: "Agreement Signed",
      description: "Your agreement has been signed successfully.",
    });
    if (onComplete) {
      onComplete();
    }
  }, [toast, onComplete]);

  return {
    handleSignAgreement
  };
};
