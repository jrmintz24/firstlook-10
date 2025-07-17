import { supabase } from '@/integrations/supabase/client';

/**
 * Backfill missing IDX property data for existing favorites
 * This function will attempt to link favorites to IDX properties based on address matching
 */
export const backfillFavoriteIDXData = async (buyerId?: string) => {
  try {
    console.log('Starting backfill of favorite IDX data...');
    
    // Get favorites without IDX property links
    const { data: favorites, error: favoritesError } = await supabase
      .from('property_favorites')
      .select('id, property_address, mls_id, idx_property_id')
      .is('idx_property_id', null)
      .eq('buyer_id', buyerId || '')
      .limit(50); // Process in batches to avoid timeouts

    if (favoritesError) {
      console.error('Error fetching favorites:', favoritesError);
      return;
    }

    if (!favorites || favorites.length === 0) {
      console.log('No favorites need IDX data backfill');
      return;
    }

    console.log(`Found ${favorites.length} favorites to backfill`);
    let updated = 0;

    // Try to match favorites to IDX properties
    for (const favorite of favorites) {
      let matchedProperty = null;

      // First try exact address match
      if (favorite.property_address) {
        const { data: addressMatch } = await supabase
          .from('idx_properties')
          .select('id, mls_id')
          .eq('address', favorite.property_address)
          .single();

        if (addressMatch) {
          matchedProperty = addressMatch;
        } else {
          // Try fuzzy address matching (remove common suffixes/prefixes)
          const cleanAddress = favorite.property_address
            .replace(/^(the\s+)/i, '')
            .replace(/\s+(dr|drive|st|street|ave|avenue|rd|road|ln|lane|ct|court|blvd|boulevard)\.?$/i, '')
            .trim();

          const { data: fuzzyMatch } = await supabase
            .from('idx_properties')
            .select('id, mls_id, address')
            .ilike('address', `%${cleanAddress}%`)
            .limit(1)
            .single();

          if (fuzzyMatch) {
            matchedProperty = fuzzyMatch;
          }
        }
      }

      // If we found a match, update the favorite
      if (matchedProperty) {
        const { error: updateError } = await supabase
          .from('property_favorites')
          .update({
            idx_property_id: matchedProperty.id,
            mls_id: matchedProperty.mls_id
          })
          .eq('id', favorite.id);

        if (updateError) {
          console.error(`Error updating favorite ${favorite.id}:`, updateError);
        } else {
          console.log(`Updated favorite ${favorite.id} with IDX property ${matchedProperty.id}`);
          updated++;
        }
      }
    }

    console.log(`Backfill complete: updated ${updated} out of ${favorites.length} favorites`);
    return { total: favorites.length, updated };
  } catch (error) {
    console.error('Error in backfillFavoriteIDXData:', error);
    throw error;
  }
};

/**
 * Enhanced version that also tries to extract property data from sessionStorage
 */
export const enhancedBackfillFavorites = async (buyerId?: string) => {
  try {
    // First run the standard backfill
    const result = await backfillFavoriteIDXData(buyerId);
    
    // Then try to extract any current property data from page
    if (typeof window !== 'undefined' && window.ihfPropertyData) {
      const propertyData = window.ihfPropertyData;
      
      if (propertyData.mlsId && propertyData.address) {
        // Check if this property is already in favorites but missing IDX link
        const { data: existingFavorite } = await supabase
          .from('property_favorites')
          .select('id')
          .eq('buyer_id', buyerId || '')
          .eq('property_address', propertyData.address)
          .is('idx_property_id', null)
          .single();

        if (existingFavorite) {
          // Look up the IDX property
          const { data: idxProperty } = await supabase
            .from('idx_properties')
            .select('id')
            .eq('mls_id', propertyData.mlsId)
            .single();

          if (idxProperty) {
            // Update the favorite with IDX data
            const { error: updateError } = await supabase
              .from('property_favorites')
              .update({
                idx_property_id: idxProperty.id,
                mls_id: propertyData.mlsId
              })
              .eq('id', existingFavorite.id);

            if (!updateError) {
              console.log('Updated current page favorite with IDX data');
            }
          }
        }
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error in enhancedBackfillFavorites:', error);
    throw error;
  }
};