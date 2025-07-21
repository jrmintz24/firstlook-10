import React from 'react';
import { useDeviceInfo } from '@/hooks/use-mobile';
import PropertyRequestForm from '@/components/PropertyRequestForm';
import MobilePropertyRequestForm from '@/components/mobile/MobilePropertyRequestForm';

interface AdaptivePropertyRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => Promise<void>;
  initialPropertyAddress?: string;
}

const AdaptivePropertyRequestForm: React.FC<AdaptivePropertyRequestFormProps> = (props) => {
  const { isMobile } = useDeviceInfo();

  if (isMobile) {
    return <MobilePropertyRequestForm {...props} />;
  }

  return <PropertyRequestForm {...props} />;
};

export default AdaptivePropertyRequestForm;