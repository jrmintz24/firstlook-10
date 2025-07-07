
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EnhancedAgentProfile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  photo_url?: string;
  user_type: string;
  agent_details?: {
    bio?: string;
    brokerage?: string;
    licenseNumber?: string;
    yearsExperience?: number;
    specialties?: string[];
    areasServed?: string[];
    website?: string;
    referralFeePercent?: number;
    commissionRebateOffered?: boolean;
  };
  profile_completion_percentage?: number;
}

export const useEnhancedAgentProfile = (agentId?: string) => {
  const [profile, setProfile] = useState<EnhancedAgentProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProfile = async (id: string) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .eq('user_type', 'agent')
        .single();

      if (error) {
        console.error('Error fetching agent profile:', error);
        setError('Failed to load agent profile');
        return;
      }

      setProfile(data);
    } catch (err) {
      console.error('Exception fetching agent profile:', err);
      setError('Failed to load agent profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (agentId) {
      fetchProfile(agentId);
    }
  }, [agentId]);

  return {
    profile,
    loading,
    error,
    refetch: () => agentId && fetchProfile(agentId)
  };
};
