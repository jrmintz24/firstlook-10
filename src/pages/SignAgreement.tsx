
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, AlertCircle, FileText } from 'lucide-react';

interface AgreementData {
  id: string;
  showing_request_id: string;
  email_token: string;
  token_expires_at: string;
  showing_request: {
    property_address: string;
    preferred_date: string | null;
    preferred_time: string | null;
    assigned_agent_name: string | null;
    user_id: string;
  };
}

const SignAgreement = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [agreementData, setAgreementData] = useState<AgreementData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing agreement token.');
      setLoading(false);
      return;
    }

    fetchAgreementData();
  }, [token]);

  const fetchAgreementData = async () => {
    try {
      const { data, error } = await supabase
        .from('tour_agreements')
        .select(`
          id,
          showing_request_id,
          email_token,
          token_expires_at,
          showing_request:showing_requests(
            property_address,
            preferred_date,
            preferred_time,
            assigned_agent_name,
            user_id
          )
        `)
        .eq('email_token', token)
        .single();

      if (error) {
        console.error('Error fetching agreement:', error);
        setError('Agreement not found or expired.');
        return;
      }

      // Check if token is expired
      if (new Date() > new Date(data.token_expires_at)) {
        setError('This agreement link has expired. Please contact us for a new link.');
        return;
      }

      setAgreementData(data);
    } catch (error) {
      console.error('Error fetching agreement data:', error);
      setError('Failed to load agreement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignAgreement = async () => {
    if (!agreed || !agreementData || !user) {
      return;
    }

    setSigning(true);

    try {
      // Update the agreement as signed
      const { error: updateError } = await supabase
        .from('tour_agreements')
        .update({
          buyer_id: user.id,
          signed: true,
          signed_at: new Date().toISOString()
        })
        .eq('id', agreementData.id);

      if (updateError) {
        throw updateError;
      }

      // Update showing request status to confirmed
      const { error: statusError } = await supabase
        .from('showing_requests')
        .update({
          status: 'confirmed',
          status_updated_at: new Date().toISOString()
        })
        .eq('id', agreementData.showing_request_id);

      if (statusError) {
        throw statusError;
      }

      toast({
        title: "Agreement Signed Successfully!",
        description: "Your tour is now confirmed. You'll receive a confirmation email shortly.",
      });

      // Redirect to buyer dashboard after a brief delay
      setTimeout(() => {
        navigate('/buyer-dashboard');
      }, 2000);

    } catch (error: any) {
      console.error('Error signing agreement:', error);
      toast({
        title: "Error",
        description: "Failed to sign agreement. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading agreement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Agreement Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/')}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
            <p className="text-gray-600 mb-4">Please sign in to your account to sign this agreement.</p>
            <Button onClick={() => navigate('/buyer-auth')}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Single Day Non-Exclusive Tour Agreement</CardTitle>
            <p className="text-gray-600">Please review and sign to confirm your property tour</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Tour Details */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">Tour Details</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Property:</strong> {agreementData?.showing_request.property_address}</p>
                {agreementData?.showing_request.preferred_date && (
                  <p><strong>Date:</strong> {new Date(agreementData.showing_request.preferred_date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                )}
                {agreementData?.showing_request.preferred_time && (
                  <p><strong>Time:</strong> {agreementData.showing_request.preferred_time}</p>
                )}
                {agreementData?.showing_request.assigned_agent_name && (
                  <p><strong>Agent:</strong> {agreementData.showing_request.assigned_agent_name}</p>
                )}
              </div>
            </div>

            {/* Agreement Terms */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Agreement Terms</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-3">
                <p><strong>1. Non-Exclusive Agreement:</strong> This agreement is non-exclusive. You are free to work with other agents and view properties with other representatives.</p>
                
                <p><strong>2. Single Tour Only:</strong> This agreement covers only the specific property tour listed above on the specified date.</p>
                
                <p><strong>3. Tour Conduct:</strong> You agree to conduct yourself professionally during the tour and follow all safety guidelines provided by the agent.</p>
                
                <p><strong>4. No Obligation:</strong> This agreement does not obligate you to make an offer on the property or enter into any purchase agreement.</p>
                
                <p><strong>5. Agent Representation:</strong> The agent represents the seller/listing agent and will provide information about the property in good faith.</p>
                
                <p><strong>6. Liability:</strong> You acknowledge that you tour the property at your own risk and will hold the agent and brokerage harmless from any accidents or injuries.</p>
                
                <p><strong>7. Duration:</strong> This agreement is valid only for the specific tour date and expires after the tour is completed.</p>
              </div>
            </div>

            {/* Agreement Checkbox */}
            <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
              <Checkbox 
                id="agreement-terms" 
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
              />
              <label htmlFor="agreement-terms" className="text-sm leading-relaxed cursor-pointer">
                I have read and agree to the terms of this Single Day Non-Exclusive Tour Agreement. 
                I understand this is a limited agreement for the specific property tour listed above.
              </label>
            </div>

            {/* Sign Button */}
            <div className="text-center">
              <Button
                onClick={handleSignAgreement}
                disabled={!agreed || signing}
                size="lg"
                className="w-full sm:w-auto px-8"
              >
                {signing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing Agreement...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Sign Agreement & Confirm Tour
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              By signing this agreement electronically, you acknowledge that your electronic signature 
              has the same legal effect as a handwritten signature.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignAgreement;
