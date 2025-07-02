
import { supabase } from "@/integrations/supabase/client";

export const createTestAgent = async () => {
  try {
    console.log('Creating test agent profile...');
    
    // Create a test agent profile
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: '00000000-0000-0000-0000-000000000001', // Fixed UUID for test agent
        first_name: 'Test',
        last_name: 'Agent',
        phone: '555-123-4567',
        user_type: 'agent',
        profile_status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (error) {
      console.error('Error creating test agent:', error);
      return false;
    }

    console.log('Test agent created/updated successfully:', data);
    return true;
  } catch (error) {
    console.error('Failed to create test agent:', error);
    return false;
  }
};

// Auto-create test agent on module load
createTestAgent();
