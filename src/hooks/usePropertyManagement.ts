
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useShowingEligibility } from "@/hooks/useShowingEligibility";
import { PropertyRequestFormData } from "@/types/propertyRequest";

export const usePropertyManagement = (
  formData: PropertyRequestFormData,
  setFormData: (data: PropertyRequestFormData | ((prev: PropertyRequestFormData) => PropertyRequestFormData)) => void
) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { checkEligibility } = useShowingEligibility();

  const handleAddProperty = async () => {
    const propertyAddress = formData.propertyAddress;
    
    if (!propertyAddress) {
      toast({
        title: "Property Required",
        description: "Please provide a property address",
        variant: "destructive"
      });
      return;
    }

    if (formData.selectedProperties.includes(propertyAddress)) {
      toast({
        title: "Property Already Added",
        description: "This property is already in your tour session",
        variant: "destructive"
      });
      return;
    }

    // Check eligibility before allowing multiple properties for non-subscribers
    if (user && formData.selectedProperties.length >= 1) {
      const currentEligibility = await checkEligibility();
      
      if (!currentEligibility?.eligible || currentEligibility.reason !== 'subscribed') {
        toast({
          title: "Subscription Required",
          description: "Multiple properties in one tour session require a subscription. Please subscribe to add more homes!",
          variant: "destructive"
        });
        navigate('/subscriptions');
        return;
      }
    }

    setFormData((prev: PropertyRequestFormData) => ({
      ...prev,
      selectedProperties: [...prev.selectedProperties, propertyAddress],
      propertyAddress: ''
    }));
    
    toast({
      title: "Property Added!",
      description: `Added "${propertyAddress}" to your tour session`,
    });
  };

  const handleRemoveProperty = (propertyToRemove: string) => {
    setFormData((prev: PropertyRequestFormData) => ({
      ...prev,
      selectedProperties: prev.selectedProperties.filter(prop => prop !== propertyToRemove)
    }));
  };

  return {
    handleAddProperty,
    handleRemoveProperty
  };
};
