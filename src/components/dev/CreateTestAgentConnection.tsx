import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const CreateTestAgentConnection = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const createSampleAgent = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create test data",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // First, create a sample agent profile
      const agentData = {
        id: '550e8400-e29b-41d4-a716-446655440000', // Fixed UUID for consistency
        first_name: 'Sarah',
        last_name: 'Johnson',
        phone: '(555) 123-4567',
        email: 'sarah.johnson@example.com',
        user_type: 'agent',
        photo_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        agent_details: {
          specialties: ['First-time buyers', 'Luxury homes', 'Investment properties'],
          bio: 'Experienced real estate agent with 8+ years helping buyers find their dream homes.',
          rating: 4.8,
          reviews_count: 127,
          license_number: 'RE12345678'
        }
      };

      // Insert or update the agent profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(agentData, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error('Failed to create agent profile');
      }

      // Create a buyer-agent match
      const matchData = {
        buyer_id: user.id,
        agent_id: agentData.id,
        match_source: 'demo_test',
        created_at: new Date().toISOString()
      };

      const { error: matchError } = await supabase
        .from('buyer_agent_matches')
        .insert(matchData);

      if (matchError) {
        console.error('Match creation error:', matchError);
        throw new Error('Failed to create agent connection');
      }

      toast({
        title: "Success!",
        description: "Sample agent connection created. Check your Portfolio tab!",
      });

    } catch (error: any) {
      console.error('Error creating test data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create test agent connection",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Only show this in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="max-w-md mx-auto my-8">
      <CardHeader>
        <CardTitle>Dev Tool: Create Test Agent Connection</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          This will create a sample agent connection for testing the Portfolio tab.
        </p>
        <Button 
          onClick={createSampleAgent} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Creating...' : 'Create Sample Agent Connection'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreateTestAgentConnection;