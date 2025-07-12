
import { Property, SearchFilters } from "@/types/simplyrets";

export interface SearchResult {
  properties: Property[];
  searchTerm: string;
  totalCount: number;
}

export const searchProperties = async (filters: SearchFilters): Promise<SearchResult> => {
  // This service now only provides a message directing users to IDX
  // All actual property search is handled by the iHomeFinder IDX widget
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    properties: [],
    searchTerm: filters.cities || '',
    totalCount: 0
  };
};
