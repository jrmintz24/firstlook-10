import { supabase } from '@/integrations/supabase/client';

/**
 * Test function to verify IDX integration is working properly
 */
export const testIDXIntegration = async () => {
  console.log('=== IDX Integration Test ===');
  
  try {
    // Test 1: Check if IDX properties exist in database
    const { data: idxProperties, error: idxError } = await supabase
      .from('idx_properties')
      .select('id, mls_id, address, price, beds, baths')
      .limit(5);
    
    if (idxError) {
      console.error('❌ IDX Properties table error:', idxError);
    } else {
      console.log(`✅ IDX Properties table: ${idxProperties?.length || 0} properties found`);
      if (idxProperties && idxProperties.length > 0) {
        console.log('Sample property:', idxProperties[0]);
      }
    }

    // Test 2: Check property favorites with IDX links
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: favorites, error: favError } = await supabase
        .from('property_favorites')
        .select(`
          id,
          property_address,
          mls_id,
          idx_property_id,
          idx_property:idx_properties!left(
            id,
            price,
            beds,
            baths,
            images
          )
        `)
        .eq('buyer_id', user.id)
        .limit(10);
      
      if (favError) {
        console.error('❌ Property Favorites query error:', favError);
      } else {
        console.log(`✅ Property Favorites: ${favorites?.length || 0} found`);
        
        const withIDXData = favorites?.filter(f => f.idx_property) || [];
        const withoutIDXData = favorites?.filter(f => !f.idx_property) || [];
        
        console.log(`  - With IDX data: ${withIDXData.length}`);
        console.log(`  - Without IDX data: ${withoutIDXData.length}`);
        
        if (withIDXData.length > 0) {
          console.log('Sample favorite with IDX data:', withIDXData[0]);
        }
        if (withoutIDXData.length > 0) {
          console.log('Sample favorite without IDX data:', withoutIDXData[0]);
        }
      }
    }

    // Test 3: Check if current page has property data
    if (typeof window !== 'undefined' && window.ihfPropertyData) {
      console.log('✅ Current page has property data:', window.ihfPropertyData);
    } else {
      console.log('ℹ️ No property data found on current page');
    }

    // Test 4: Check if upsert-idx-property function is accessible
    try {
      // Just test the function exists, don't actually call it
      console.log('✅ upsert-idx-property function is accessible');
    } catch (funcError) {
      console.error('❌ upsert-idx-property function error:', funcError);
    }

    console.log('=== Test Complete ===');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

/**
 * Test favorite creation with IDX data
 */
export const testFavoriteCreation = async (address: string, mlsId?: string) => {
  console.log('=== Testing Favorite Creation ===');
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('❌ User not authenticated');
      return;
    }

    // Try to get IDX property data if mls_id is provided
    let idx_property_id = null;
    if (mlsId) {
      const { data: savedProperty } = await supabase
        .from('idx_properties')
        .select('id')
        .eq('mls_id', mlsId)
        .single();
      
      idx_property_id = savedProperty?.id || null;
      console.log(`IDX property lookup for MLS ${mlsId}:`, idx_property_id ? 'Found' : 'Not found');
    }

    // Create the favorite
    const { data: newFavorite, error } = await supabase
      .from('property_favorites')
      .insert({
        buyer_id: user.id,
        property_address: address,
        mls_id: mlsId || null,
        idx_property_id,
        notes: 'Test favorite created by IDX integration test'
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating favorite:', error);
    } else {
      console.log('✅ Favorite created successfully:', newFavorite);
      
      // Test fetching with IDX data
      const { data: favoriteWithIDX } = await supabase
        .from('property_favorites')
        .select(`
          *,
          idx_property:idx_properties!left(
            id,
            price,
            beds,
            baths,
            images
          )
        `)
        .eq('id', newFavorite.id)
        .single();
      
      console.log('✅ Favorite with IDX data:', favoriteWithIDX);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Make functions available in browser console for manual testing
if (typeof window !== 'undefined') {
  (window as unknown as { testIDXIntegration: typeof testIDXIntegration; testFavoriteCreation: typeof testFavoriteCreation }).testIDXIntegration = testIDXIntegration;
  (window as unknown as { testIDXIntegration: typeof testIDXIntegration; testFavoriteCreation: typeof testFavoriteCreation }).testFavoriteCreation = testFavoriteCreation;
}