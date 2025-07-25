
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/Auth0AuthContext";
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

    // Prevent non-authenticated users from adding multiple properties
    if (!user) {
      toast({
        title: "Single Property Only",
        description: "Sign up to add multiple properties to your tour session!",
        variant: "destructive"
      });
      return;
    }

    // Check if property already exists in the properties array
    const existingProperty = formData.properties.find(prop => prop.address === propertyAddress);
    if (existingProperty) {
      toast({
        title: "Property Already Added",
        description: "This property is already in your tour session",
        variant: "destructive"
      });
      return;
    }

    // Check eligibility before allowing multiple properties for non-subscribers
    const currentPropertyCount = formData.properties.filter(p => p.address.trim()).length;
    if (user && currentPropertyCount >= 1) {
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

    // Add property to the properties array
    setFormData((prev: PropertyRequestFormData) => {
      const newProperties = [...prev.properties];
      
      // Find an empty slot or add a new one
      const emptyIndex = newProperties.findIndex(prop => !prop.address.trim());
      if (emptyIndex >= 0) {
        newProperties[emptyIndex] = { address: propertyAddress, notes: "" };
      } else {
        newProperties.push({ address: propertyAddress, notes: "" });
      }

      return {
        ...prev,
        properties: newProperties,
        propertyAddress: '', // Clear the input field
        // Also update legacy selectedProperties for backward compatibility
        selectedProperties: newProperties.map(p => p.address).filter(Boolean)
      };
    });
    
    toast({
      title: "Property Added!",
      description: `Added "${propertyAddress}" to your tour session`,
    });
  };

  const handleRemoveProperty = (propertyToRemove: string) => {
    setFormData((prev: PropertyRequestFormData) => {
      const newProperties = prev.properties.filter(prop => prop.address !== propertyToRemove);
      
      // Ensure we always have at least one empty property entry
      if (newProperties.length === 0 || newProperties.every(p => p.address.trim())) {
        newProperties.push({ address: "", notes: "" });
      }

      return {
        ...prev,
        properties: newProperties,
        // Also update legacy selectedProperties for backward compatibility
        selectedProperties: newProperties.map(p => p.address).filter(Boolean)
      };
    });
  };

  return {
    handleAddProperty,
    handleRemoveProperty
  };
};
