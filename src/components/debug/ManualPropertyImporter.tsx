import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { enrichPropertyData, storeEnrichedPropertyData } from '@/services/propertyEnrichmentService';
import { useAuth } from '@/contexts/SimpleAuth0Context';

const ManualPropertyImporter = () => {
  const { user } = useAuth();
  const [isImporting, setIsImporting] = useState(false);
  const [isEnriching, setIsEnriching] = useState(false);
  const [importData, setImportData] = useState({
    address: '',
    price: '',
    beds: '',
    baths: '',
    sqft: '',
    mlsId: '',
    images: '',
    ihfPageUrl: ''
  });

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const propertyData = {
        mls_id: importData.mlsId || `MANUAL-${Date.now()}`,
        idx_id: importData.mlsId || `MANUAL-${Date.now()}`,
        address: importData.address,
        price: importData.price ? parseFloat(importData.price.replace(/[^0-9.]/g, '')) : null,
        beds: importData.beds ? parseInt(importData.beds) : null,
        baths: importData.baths ? parseFloat(importData.baths) : null,
        sqft: importData.sqft ? parseInt(importData.sqft.replace(/[^0-9]/g, '')) : null,
        images: importData.images ? importData.images.split(',').map(url => url.trim()) : [],
        ihf_page_url: importData.ihfPageUrl,
        property_type: 'Single Family Residential',
        status: 'Active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('idx_properties')
        .upsert(propertyData, { onConflict: 'mls_id' })
        .select()
        .single();

      if (error) {
        console.error('Import error:', error);
        alert('Import failed: ' + error.message);
      } else {
        console.log('Property imported:', data);
        alert('Property imported successfully!');
        // Clear form
        setImportData({
          address: '',
          price: '',
          beds: '',
          baths: '',
          sqft: '',
          mlsId: '',
          images: '',
          ihfPageUrl: ''
        });
      }
    } catch (err) {
      console.error('Import error:', err);
      alert('Import failed: ' + err);
    } finally {
      setIsImporting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setImportData(prev => ({ ...prev, [field]: value }));
  };

  const handleBulkEnrichment = async () => {
    if (!user) return;
    
    setIsEnriching(true);
    try {
      // Get all showing requests for this user
      const { data: showings, error } = await supabase
        .from('showing_requests')
        .select('property_address')
        .eq('user_id', user.id);
      
      if (error) {
        alert('Error fetching showing requests: ' + error.message);
        return;
      }
      
      let enrichedCount = 0;
      const uniqueAddresses = [...new Set(showings?.map(s => s.property_address) || [])];
      
      for (const address of uniqueAddresses) {
        console.log('Enriching:', address);
        const enrichedData = await enrichPropertyData(address);
        
        if (enrichedData) {
          await storeEnrichedPropertyData(enrichedData);
          enrichedCount++;
        }
        
        // Small delay to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      alert(`Successfully enriched ${enrichedCount} properties!`);
      
    } catch (error) {
      console.error('Bulk enrichment error:', error);
      alert('Bulk enrichment failed: ' + error);
    } finally {
      setIsEnriching(false);
    }
  };

  return (
    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
      <h3 className="font-bold mb-4 text-blue-800">🏠 Manual Property Data Import</h3>
      <p className="text-sm text-blue-600 mb-4">
        Import real property data to test enhanced property cards. Fill in the details below:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Address *</label>
          <Input
            value={importData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="123 Main St, City, CA 12345"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <Input
            value={importData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            placeholder="750000"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Beds</label>
          <Input
            value={importData.beds}
            onChange={(e) => handleInputChange('beds', e.target.value)}
            placeholder="4"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Baths</label>
          <Input
            value={importData.baths}
            onChange={(e) => handleInputChange('baths', e.target.value)}
            placeholder="2.5"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Square Feet</label>
          <Input
            value={importData.sqft}
            onChange={(e) => handleInputChange('sqft', e.target.value)}
            placeholder="2100"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">MLS ID</label>
          <Input
            value={importData.mlsId}
            onChange={(e) => handleInputChange('mlsId', e.target.value)}
            placeholder="225026090_13"
          />
        </div>
      </div>
      
      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">Image URLs (comma separated)</label>
        <Textarea
          value={importData.images}
          onChange={(e) => handleInputChange('images', e.target.value)}
          placeholder="https://image1.jpg, https://image2.jpg"
          rows={2}
        />
      </div>
      
      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">IDX Page URL</label>
        <Input
          value={importData.ihfPageUrl}
          onChange={(e) => handleInputChange('ihfPageUrl', e.target.value)}
          placeholder="https://www.firstlookhometours.com/listing/..."
        />
      </div>
      
      <div className="flex gap-4 mt-4">
        <Button
          onClick={handleImport}
          disabled={!importData.address || isImporting}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isImporting ? 'Importing...' : 'Import Property Data'}
        </Button>
        
        <Button
          onClick={handleBulkEnrichment}
          disabled={isEnriching}
          className="bg-green-600 hover:bg-green-700"
        >
          {isEnriching ? 'Enriching Properties...' : 'Auto-Enrich All My Properties'}
        </Button>
      </div>
    </div>
  );
};

export default ManualPropertyImporter;