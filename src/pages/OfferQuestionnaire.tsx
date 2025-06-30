
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import OfferQuestionnaireWizard from '@/components/offer-workflow/OfferQuestionnaireWizard';

const OfferQuestionnaire = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [offerIntentId, setOfferIntentId] = useState<string>('');

  const propertyAddress = searchParams.get('property') || '';
  const agentId = searchParams.get('agent') || '';

  useEffect(() => {
    const initializeOfferFlow = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            title: "Authentication Required",
            description: "Please log in to create an offer",
            variant: "destructive"
          });
          navigate('/auth');
          return;
        }

        setCurrentUser(user);

        if (!propertyAddress) {
          toast({
            title: "Property Required",
            description: "Property address is required to create an offer",
            variant: "destructive"
          });
          navigate('/dashboard');
          return;
        }

        // Create offer intent record
        const { data: offerIntent, error } = await supabase
          .from('offer_intents')
          .insert({
            buyer_id: user.id,
            agent_id: agentId || null,
            property_address: propertyAddress,
            offer_type: 'make_offer',
            contract_type: propertyAddress.includes('Montgomery') || propertyAddress.includes('MD') ? 'mar' : 'gcaar'
          })
          .select()
          .single();

        if (error) throw error;

        setOfferIntentId(offerIntent.id);
      } catch (error) {
        console.error('Error initializing offer flow:', error);
        toast({
          title: "Error",
          description: "Failed to initialize offer creation",
          variant: "destructive"
        });
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    initializeOfferFlow();
  }, [propertyAddress, agentId, navigate, toast]);

  const handleWizardClose = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!offerIntentId || !currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <OfferQuestionnaireWizard
        isOpen={true}
        onClose={handleWizardClose}
        offerIntentId={offerIntentId}
        propertyAddress={propertyAddress}
        buyerId={currentUser.id}
        agentId={agentId || undefined}
      />
    </div>
  );
};

export default OfferQuestionnaire;
