import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Auth0Callback() {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth0Callback = async () => {
      console.log('Auth0Callback: Handler called', { isLoading, isAuthenticated, user: !!user });
      
      if (isLoading) {
        console.log('Auth0Callback: Still loading, waiting...');
        return;
      }

      if (isAuthenticated && user) {
        try {
          console.log('Auth0Callback: User authenticated successfully', { 
            user: user.email, 
            sub: user.sub,
            tourBooking: localStorage.getItem('newUserFromPropertyRequest')
          });

          // Get Auth0 access token
          const accessToken = await getAccessTokenSilently();
          
          // Try to create or update user in Supabase, but don't fail if it doesn't work
          try {
            await createSupabaseUser(user, accessToken);
            console.log('Supabase profile sync successful');
          } catch (supabaseError) {
            console.warn('Supabase profile sync failed, but continuing with Auth0 authentication:', supabaseError);
            // Continue anyway - Auth0 authentication was successful
          }

          // Check if this was from a tour booking
          const isFromTourBooking = localStorage.getItem('newUserFromPropertyRequest') === 'true';
          const pendingTourRequest = localStorage.getItem('pendingTourRequest');
          
          if (isFromTourBooking && pendingTourRequest) {
            console.log('Tour booking context detected, redirecting to buyer-dashboard');
            localStorage.removeItem('newUserFromPropertyRequest');
            navigate('/buyer-dashboard', { replace: true });
          } else {
            // Default redirect to buyer dashboard for now
            navigate('/buyer-dashboard', { replace: true });
          }
        } catch (error) {
          console.error('Auth0 callback error:', error);
          navigate('/?error=' + encodeURIComponent('Authentication failed'));
        }
      } else if (!isLoading && !isAuthenticated) {
        // Auth failed
        navigate('/?error=' + encodeURIComponent('Authentication failed'));
      }
    };

    handleAuth0Callback();
  }, [isAuthenticated, isLoading, user, navigate, getAccessTokenSilently]);

  const createSupabaseUser = async (auth0User: any, accessToken: string) => {
    try {
      // Check if user already exists in Supabase
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', auth0User.email)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching existing profile:', fetchError);
        throw fetchError;
      }

      if (!existingProfile) {
        // Create new user profile - let Supabase generate the ID
        const profileData = {
          email: auth0User.email,
          first_name: auth0User.given_name || auth0User.name?.split(' ')[0] || '',
          last_name: auth0User.family_name || auth0User.name?.split(' ').slice(1).join(' ') || '',
          user_type: 'buyer', // Default to buyer
          auth_provider: 'auth0',
          auth_provider_id: auth0User.sub,
          profile_picture_url: auth0User.picture,
          onboarding_completed: true,
          profile_completion_percentage: 85,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        console.log('Creating new profile with data:', profileData);

        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([profileData])
          .select()
          .single();

        if (createError) {
          console.error('Error creating Supabase profile:', createError);
          throw createError;
        }

        console.log('Created new Supabase profile for Auth0 user:', newProfile);
      } else {
        // Update existing profile with latest Auth0 data
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            first_name: auth0User.given_name || existingProfile.first_name,
            last_name: auth0User.family_name || existingProfile.last_name,
            profile_picture_url: auth0User.picture || existingProfile.profile_picture_url,
            auth_provider_id: auth0User.sub,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingProfile.id);

        if (updateError) {
          console.error('Error updating Supabase profile:', updateError);
          throw updateError;
        }

        console.log('Updated existing Supabase profile');
      }
    } catch (error) {
      console.error('Error managing Supabase user:', error);
      throw error;
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}