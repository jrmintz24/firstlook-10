
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/Auth0AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { User, Settings, Bell, Shield } from 'lucide-react';
import BuyerProfileForm from './BuyerProfileForm';
import AgentProfileForm from './AgentProfileForm';
import PersonalInfoForm from './PersonalInfoForm';
import CommunicationPreferencesForm from './CommunicationPreferencesForm';
import type { EnhancedProfile } from '@/types/profile';

const ProfileWrapper = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<EnhancedProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        // Transform Supabase data to EnhancedProfile format
        const enhancedProfile: EnhancedProfile = {
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          user_type: (data.user_type as 'buyer' | 'agent' | 'admin') || 'buyer',
          photo_url: data.photo_url,
          buyer_preferences: data.buyer_preferences as any || {},
          agent_details: data.agent_details as any || {},
          communication_preferences: data.communication_preferences as any || {},
          onboarding_completed: data.onboarding_completed || false,
          profile_completion_percentage: data.profile_completion_percentage || 0,
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        setProfile(enhancedProfile);
      } else {
        // Create default profile if none exists
        const defaultProfile: EnhancedProfile = {
          id: user.id,
          user_type: 'buyer',
          buyer_preferences: {},
          agent_details: {},
          communication_preferences: {},
          onboarding_completed: false,
          profile_completion_percentage: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setProfile(defaultProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<EnhancedProfile>) => {
    if (!user?.id || !profile) return;

    setSaving(true);
    try {
      const updatedProfile = { ...profile, ...updates };
      
      // Calculate completion percentage
      const completionPercentage = calculateCompletionPercentage(updatedProfile);
      updatedProfile.profile_completion_percentage = completionPercentage;

      // Transform to Supabase format - cast complex objects to Json type
      const supabaseData = {
        id: user.id,
        first_name: updatedProfile.first_name || null,
        last_name: updatedProfile.last_name || null,
        phone: updatedProfile.phone || null,
        user_type: updatedProfile.user_type || 'buyer',
        photo_url: updatedProfile.photo_url || null,
        buyer_preferences: updatedProfile.buyer_preferences as any,
        agent_details: updatedProfile.agent_details as any,
        communication_preferences: updatedProfile.communication_preferences as any,
        onboarding_completed: updatedProfile.onboarding_completed || false,
        profile_completion_percentage: updatedProfile.profile_completion_percentage || 0,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(supabaseData);

      if (error) throw error;

      setProfile(updatedProfile);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const calculateCompletionPercentage = (profile: EnhancedProfile): number => {
    const requiredFields = ['first_name', 'last_name', 'phone'];
    const optionalFields = ['photo_url'];
    
    let totalFields = requiredFields.length + optionalFields.length;
    let completedFields = 0;

    requiredFields.forEach(field => {
      if (profile[field as keyof EnhancedProfile]) completedFields++;
    });

    optionalFields.forEach(field => {
      if (profile[field as keyof EnhancedProfile]) completedFields++;
    });

    if (profile.user_type === 'buyer' && profile.buyer_preferences) {
      const buyerFields = ['budget', 'desiredAreas', 'homeTypes'];
      totalFields += buyerFields.length;
      
      buyerFields.forEach(field => {
        if (profile.buyer_preferences?.[field as keyof typeof profile.buyer_preferences]) {
          completedFields++;
        }
      });
    }

    if (profile.user_type === 'agent' && profile.agent_details) {
      const agentFields = ['brokerage', 'licenseNumber', 'yearsExperience', 'areasServed'];
      totalFields += agentFields.length;
      
      agentFields.forEach(field => {
        if (profile.agent_details?.[field as keyof typeof profile.agent_details]) {
          completedFields++;
        }
      });
    }

    return Math.round((completedFields / totalFields) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Profile not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Completion Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Complete your profile to get better matches</span>
              <span>{profile.profile_completion_percentage || 0}%</span>
            </div>
            <Progress value={profile.profile_completion_percentage || 0} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Profile Settings Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Personal
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                {profile.user_type === 'buyer' ? 'Preferences' : 'Professional'}
              </TabsTrigger>
              <TabsTrigger value="communication" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Communication
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Privacy
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="mt-6">
              <PersonalInfoForm
                profile={profile}
                onUpdate={updateProfile}
                saving={saving}
              />
            </TabsContent>

            <TabsContent value="preferences" className="mt-6">
              {profile.user_type === 'buyer' ? (
                <BuyerProfileForm
                  profile={profile}
                  onUpdate={updateProfile}
                  saving={saving}
                />
              ) : (
                <AgentProfileForm
                  profile={profile}
                  onUpdate={updateProfile}
                  saving={saving}
                />
              )}
            </TabsContent>

            <TabsContent value="communication" className="mt-6">
              <CommunicationPreferencesForm
                profile={profile}
                onUpdate={updateProfile}
                saving={saving}
              />
            </TabsContent>

            <TabsContent value="privacy" className="mt-6">
              <div className="text-center py-8 text-gray-500">
                Privacy settings coming soon
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileWrapper;
