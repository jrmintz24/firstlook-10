import { supabase } from '@/integrations/supabase/client';

/**
 * Comprehensive backfill utility to link existing showing requests and favorites
 * to IDX properties that may have been saved after the records were created
 */
export class IDXBackfillService {
  
  /**
   * Backfill all unlinked showing requests and favorites for a user
   */
  static async backfillUserRecords(userId: string) {
    console.log('[IDX Backfill] Starting comprehensive backfill for user:', userId);
    
    const results = {
      favorites: { total: 0, linked: 0 },
      showings: { total: 0, linked: 0 }
    };

    try {
      // Backfill favorites
      const favoriteResults = await this.backfillFavorites(userId);
      results.favorites = favoriteResults;

      // Backfill showing requests
      const showingResults = await this.backfillShowingRequests(userId);
      results.showings = showingResults;

      console.log('[IDX Backfill] Backfill complete:', results);
      return results;

    } catch (error) {
      console.error('[IDX Backfill] Error during backfill:', error);
      throw error;
    }
  }

  /**
   * Backfill favorites with IDX property links
   */
  static async backfillFavorites(userId: string) {
    console.log('[IDX Backfill] Processing favorites...');

    // Get all favorites without IDX links
    const { data: favorites, error: favError } = await supabase
      .from('property_favorites')
      .select('id, property_address, mls_id')
      .eq('buyer_id', userId)
      .is('idx_property_id', null);

    if (favError) {
      console.error('[IDX Backfill] Error fetching favorites:', favError);
      return { total: 0, linked: 0 };
    }

    if (!favorites || favorites.length === 0) {
      console.log('[IDX Backfill] No favorites to backfill');
      return { total: 0, linked: 0 };
    }

    console.log(`[IDX Backfill] Found ${favorites.length} favorites to process`);
    let linked = 0;

    for (const favorite of favorites) {
      const idxPropertyId = await this.findMatchingIDXProperty(
        favorite.property_address,
        favorite.mls_id
      );

      if (idxPropertyId) {
        const { error: updateError } = await supabase
          .from('property_favorites')
          .update({
            idx_property_id: idxPropertyId,
            mls_id: favorite.mls_id || null
          })
          .eq('id', favorite.id);

        if (!updateError) {
          linked++;
          console.log(`[IDX Backfill] Linked favorite ${favorite.id} to property ${idxPropertyId}`);
        } else {
          console.error(`[IDX Backfill] Error linking favorite ${favorite.id}:`, updateError);
        }
      }
    }

    return { total: favorites.length, linked };
  }

  /**
   * Backfill showing requests with IDX property links
   */
  static async backfillShowingRequests(userId: string) {
    console.log('[IDX Backfill] Processing showing requests...');

    // Get all showing requests without IDX links
    const { data: showings, error: showError } = await supabase
      .from('showing_requests')
      .select('id, property_address, mls_id')
      .eq('user_id', userId)
      .is('idx_property_id', null);

    if (showError) {
      console.error('[IDX Backfill] Error fetching showing requests:', showError);
      return { total: 0, linked: 0 };
    }

    if (!showings || showings.length === 0) {
      console.log('[IDX Backfill] No showing requests to backfill');
      return { total: 0, linked: 0 };
    }

    console.log(`[IDX Backfill] Found ${showings.length} showing requests to process`);
    let linked = 0;

    for (const showing of showings) {
      const idxPropertyId = await this.findMatchingIDXProperty(
        showing.property_address,
        showing.mls_id
      );

      if (idxPropertyId) {
        const { error: updateError } = await supabase
          .from('showing_requests')
          .update({
            idx_property_id: idxPropertyId,
            mls_id: showing.mls_id || null
          })
          .eq('id', showing.id);

        if (!updateError) {
          linked++;
          console.log(`[IDX Backfill] Linked showing request ${showing.id} to property ${idxPropertyId}`);
        } else {
          console.error(`[IDX Backfill] Error linking showing request ${showing.id}:`, updateError);
        }
      }
    }

    return { total: showings.length, linked };
  }

  /**
   * Find matching IDX property by address and/or MLS ID
   */
  static async findMatchingIDXProperty(address?: string, mlsId?: string): Promise<string | null> {
    if (!address && !mlsId) {
      return null;
    }

    // Strategy 1: Exact MLS ID match (highest confidence)
    if (mlsId) {
      const { data: mlsMatch } = await supabase
        .from('idx_properties')
        .select('id')
        .eq('mls_id', mlsId)
        .single();

      if (mlsMatch) {
        console.log(`[IDX Backfill] Found exact MLS match for ${mlsId}`);
        return mlsMatch.id;
      }
    }

    // Strategy 2: Exact address match
    if (address) {
      const { data: addressMatch } = await supabase
        .from('idx_properties')
        .select('id')
        .eq('address', address)
        .single();

      if (addressMatch) {
        console.log(`[IDX Backfill] Found exact address match for ${address}`);
        return addressMatch.id;
      }
    }

    // Strategy 3: Fuzzy address matching
    if (address) {
      const cleanAddress = this.cleanAddressForMatching(address);
      
      if (cleanAddress.length >= 10) { // Only try fuzzy matching for substantial addresses
        const { data: fuzzyMatch } = await supabase
          .from('idx_properties')
          .select('id, address')
          .ilike('address', `%${cleanAddress}%`)
          .limit(1)
          .single();

        if (fuzzyMatch) {
          console.log(`[IDX Backfill] Found fuzzy address match: "${address}" -> "${fuzzyMatch.address}"`);
          return fuzzyMatch.id;
        }
      }
    }

    console.log(`[IDX Backfill] No match found for address: "${address}", MLS: "${mlsId}"`);
    return null;
  }

  /**
   * Clean address for fuzzy matching
   */
  static cleanAddressForMatching(address: string): string {
    return address
      .toLowerCase()
      .replace(/^(the\s+)/i, '') // Remove "The" prefix
      .replace(/\s+(dr|drive|st|street|ave|avenue|rd|road|ln|lane|ct|court|blvd|boulevard|way|pl|place|cir|circle)\.?$/i, '') // Remove street suffixes
      .replace(/\s+unit\s+.*/i, '') // Remove unit numbers
      .replace(/\s+apt\s+.*/i, '') // Remove apartment numbers
      .replace(/\s+#.*/i, '') // Remove # and everything after
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  /**
   * Run backfill for current authenticated user
   */
  static async backfillCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('[IDX Backfill] No authenticated user found');
      return null;
    }

    return await this.backfillUserRecords(user.id);
  }

  /**
   * Auto-backfill on page load (non-blocking)
   */
  static autoBackfillOnLoad() {
    // Run backfill after a delay to avoid blocking initial page load
    setTimeout(async () => {
      try {
        const results = await this.backfillCurrentUser();
        if (results && (results.favorites.linked > 0 || results.showings.linked > 0)) {
          console.log('[IDX Backfill] Auto-backfill completed with links:', results);
        }
      } catch (error) {
        console.warn('[IDX Backfill] Auto-backfill failed (non-critical):', error);
      }
    }, 5000); // 5 second delay
  }
}

// Auto-run backfill when this module is imported
if (typeof window !== 'undefined') {
  IDXBackfillService.autoBackfillOnLoad();
}

export default IDXBackfillService;