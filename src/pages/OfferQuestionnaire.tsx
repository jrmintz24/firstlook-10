
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import OfferQuestionnaireWizard from '@/components/offer-workflow/OfferQuestionnaireWizard';

const OfferQuestionnaire = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [offerIntentId, setOfferIntentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const propertyAddress = searchParams.get('property');
  const agentId = searchParams.get('agent');

  useEffect(() => {
    if (!user) {
      navigate('/buyer-auth');
      return;
    }

    if (!propertyAddress) {
      toast({
        title: "Missing Information",
        description: "Property address is required to create an offer.",
        variant: "destructive"
      });
      navigate('/buyer-dashboard');
      return;
    }

    createOfferIntent();
  }, [user, propertyAddress, agentId]);

  const createOfferIntent = async () => {
    if (!user || !propertyAddress) return;

    try {
      const { data: offerIntent, error } = await supabase
        .from('offer_intents')
        .insert({
          buyer_id: user.id,
          agent_id: agentId,
          property_address: propertyAddress,
          offer_type: 'firstlook_generator',
          contract_type: propertyAddress.includes('Montgomery') ? 'gcaar' : 
                       propertyAddress.includes('DC') || propertyAddress.includes('Washington') ? 'gcaar' : 'mar'
        })
        .select()
        .single();

      if (error) throw error;

      setOfferIntentId(offerIntent.id);
    } catch (error) {
      console.error('Error creating offer intent:', error);
      toast({
        title: "Error",
        description: "Failed to start offer preparation. Please try again.",
        variant: "destructive"
      });
      navigate('/buyer-dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/buyer-dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing your offer questionnaire...</p>
        </div>
      </div>
    );
  }

  if (!offerIntentId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to initialize offer questionnaire.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <OfferQuestionnaireWizard
        isOpen={true}
        onClose={handleClose}
        offerIntentId={offerIntentId}
        propertyAddress={propertyAddress}
        buyerId={user.id}
        agentId={agentId || undefined}
      />
    </div>
  );
};

export default OfferQuestionnaire;
