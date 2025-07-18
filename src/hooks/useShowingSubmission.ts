
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PropertyRequestFormData } from "@/types/propertyRequest";

export const useShowingSubmission = (
  onDataRefresh?: () => Promise<void>
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const findOrCreatePropertyByIdxId = async (address: string, mlsId?: string) => {
    try {
      console.log('🔍 Looking for property with address:', address, 'MLS ID:', mlsId);
      
      // First priority: Find by MLS ID if provided
      if (mlsId) {
        const { data: mlsMatch } = await supabase
          .from('idx_properties')
          .select('id, mls_id, address')
          .eq('mls_id', mlsId)
          .single();
        
        if (mlsMatch) {
          console.log('✅ Found property by MLS ID:', mlsMatch);
          return mlsMatch;
        }
      }
      
      // Second priority: Try exact address match
      const { data: exactMatch } = await supabase
        .from('idx_properties')
        .select('id, mls_id, address')
        .eq('address', address)
        .single();
      
      if (exactMatch) {
        console.log('✅ Found exact property match:', exactMatch);
        return exactMatch;
      }
      
      // Third priority: Auto-create property with available data
      console.log('🔄 Creating new property record for:', address);
      
      const newProperty = {
        mls_id: mlsId || `AUTO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        address: address,
        city: extractCityFromAddress(address),
        state: 'CA',
        zip: extractZipFromAddress(address),
        price: getEstimatedPrice(address),
        beds: 3,
        baths: 2.5,
        sqft: 2000,
        property_type: 'Single Family Residential',
        status: 'Active',
        description: 'Beautiful home in desirable location',
        images: getDefaultImages(),
        ihf_page_url: `https://www.firstlookhometours.com/listing?search=${encodeURIComponent(address)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data: createdProperty, error } = await supabase
        .from('idx_properties')
        .insert([newProperty])
        .select('id, mls_id, address')
        .single();
      
      if (error) {
        console.error('Error creating property:', error);
        return null;
      }
      
      console.log('✅ Created new property:', createdProperty);
      return createdProperty;
      
    } catch (error) {
      console.error('Error finding/creating property:', error);
      return null;
    }
  };

  const extractCityFromAddress = (address: string): string => {
    const cityMap: {[key: string]: string} = {
      'El Dorado Hills': 'El Dorado Hills',
      'Roseville': 'Roseville',
      'Rocklin': 'Rocklin',
      'Elk Grove': 'Elk Grove',
      'Folsom': 'Folsom',
      'Sacramento': 'Sacramento',
      'Granite Bay': 'Granite Bay'
    };
    
    for (const [cityName, cityValue] of Object.entries(cityMap)) {
      if (address.includes(cityName)) {
        return cityValue;
      }
    }
    return 'Sacramento';
  };

  const extractZipFromAddress = (address: string): string => {
    const zipMatch = address.match(/\b\d{5}\b/);
    return zipMatch ? zipMatch[0] : '95825';
  };

  const getEstimatedPrice = (address: string): number => {
    if (address.includes('El Dorado Hills')) return 1200000;
    if (address.includes('Granite Bay')) return 950000;
    if (address.includes('Folsom')) return 850000;
    if (address.includes('Roseville')) return 750000;
    if (address.includes('Rocklin')) return 800000;
    if (address.includes('Elk Grove')) return 650000;
    return 700000;
  };

  const getDefaultImages = (): string => {
    return JSON.stringify([
      {"url": "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop&auto=format", "caption": "Beautiful home"},
      {"url": "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop&auto=format", "caption": "Comfortable living"}
    ]);
  };

  const submitShowingRequests = async (formData: PropertyRequestFormData) => {
    console.log('DEBUG: submitShowingRequests called with formData:', formData);
    
    if (!user?.id) {
      console.error('No authenticated user found for showing submission');
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit tour requests.",
        variant: "destructive"
      });
      throw new Error('User must be authenticated to submit showing requests');
    }

    setIsSubmitting(true);
    
    try {
      console.log('Submitting showing requests for user:', user.id);
      console.log('Form data:', formData);

      const showingRequests = [];

      // Handle multiple properties if they exist
      if (formData.properties && formData.properties.length > 0) {
        console.log('DEBUG: Processing properties array:', formData.properties);
        for (const property of formData.properties) {
          if (property.address && property.address.trim()) {
            console.log('DEBUG: Adding property from properties array:', property.address.trim());
            
            // Find matching property in idx_properties
            const propertyMatch = await findOrCreatePropertyByIdxId(property.address.trim(), property.mlsId);
            
            showingRequests.push({
              user_id: user.id,
              property_address: property.address.trim(),
              property_id: formData.propertyId || null,
              idx_property_id: propertyMatch?.id || null,
              mls_id: propertyMatch?.mls_id || null,
              message: property.notes || formData.notes || null,
              preferred_date: formData.preferredDate1 || null,
              preferred_time: formData.preferredTime1 || null,
              status: 'pending'
            });
          }
        }
      }

        // Handle single property from direct form fields
        if (formData.propertyAddress && formData.propertyAddress.trim()) {
          console.log('DEBUG: Processing single propertyAddress:', formData.propertyAddress.trim());
          
          // Find matching property in idx_properties
          const propertyMatch = await findOrCreatePropertyByIdxId(formData.propertyAddress.trim(), formData.mlsId);
          
          const request = {
            user_id: user.id,
            property_address: formData.propertyAddress.trim(),
            property_id: formData.propertyId || null,
            idx_property_id: propertyMatch?.id || null,
            mls_id: propertyMatch?.mls_id || null,
            message: formData.notes || null,
            preferred_date: formData.preferredDate1 || null,
            preferred_time: formData.preferredTime1 || null,
            status: 'pending'
          };

        // Avoid duplicates
        const isDuplicate = showingRequests.some(req => 
          req.property_address === request.property_address
        );
        
        if (!isDuplicate) {
          console.log('DEBUG: Adding single property:', request.property_address);
          showingRequests.push(request);
        } else {
          console.log('DEBUG: Skipping duplicate property:', request.property_address);
        }
      }

      console.log('DEBUG: Final showing requests to submit:', showingRequests);

      if (showingRequests.length === 0) {
        console.error('DEBUG: No valid properties found to submit');
        throw new Error('No valid properties to submit');
      }

      console.log('Submitting requests:', showingRequests);

      // Submit all requests
      const { data, error } = await supabase
        .from('showing_requests')
        .insert(showingRequests)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Successfully submitted showing requests:', data);

      // Clear any pending tour request from localStorage
      localStorage.removeItem('pendingTourRequest');

      // Refresh dashboard data if callback provided
      if (onDataRefresh) {
        await onDataRefresh();
      }

      toast({
        title: "Tour Request Submitted",
        description: `Successfully submitted ${showingRequests.length} tour request${showingRequests.length > 1 ? 's' : ''}!`,
      });

      return data;

    } catch (error: any) {
      console.error('Error submitting showing requests:', error);
      
      let errorMessage = "Failed to submit tour request. Please try again.";
      
      if (error.message?.includes('violates row-level security')) {
        errorMessage = "Authentication error. Please sign in and try again.";
      } else if (error.message?.includes('check_user_id_not_null')) {
        errorMessage = "Authentication required. Please ensure you're signed in.";
      }

      toast({
        title: "Submission Error",
        description: errorMessage,
        variant: "destructive"
      });

      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitShowingRequests
  };
};
