import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const IDXDataTester = () => {
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<string>('');

  useEffect(() => {
    // Check for existing data on load
    checkForIDXData();
    
    // Listen for new IDX data events
    const handleIDXData = (event: CustomEvent) => {
      console.log('🎉 [IDX Tester] Received IDX data event:', event.detail);
      setExtractedData(event.detail);
    };

    window.addEventListener('ihfPropertyDataReady', handleIDXData as EventListener);
    setIsListening(true);

    return () => {
      window.removeEventListener('ihfPropertyDataReady', handleIDXData as EventListener);
      setIsListening(false);
    };
  }, []);

  const checkForIDXData = () => {
    // Check window object for IDX data
    if (typeof window !== 'undefined') {
      const windowData = (window as any).ihfPropertyData;
      if (windowData) {
        console.log('🏠 [IDX Tester] Found IDX data in window:', windowData);
        setExtractedData(windowData);
      }

      // Check sessionStorage
      const sessionData = sessionStorage.getItem('ihfPropertyData');
      if (sessionData) {
        try {
          const parsed = JSON.parse(sessionData);
          console.log('💾 [IDX Tester] Found IDX data in sessionStorage:', parsed);
          if (!windowData) setExtractedData(parsed);
        } catch (e) {
          console.warn('Failed to parse session IDX data');
        }
      }
    }
  };

  const testExtractionManually = () => {
    console.log('🔍 [IDX Tester] Testing manual extraction...');
    
    // Try to manually extract property data from current page
    const testExtractors = {
      address: ['.ihf-address', '.ihf-listing-address', '.property-address', '.address', 'h1', 'h2'],
      price: ['.ihf-price', '.ihf-listing-price', '.property-price', '.price'],
      beds: ['.ihf-beds', '.bedrooms', '.beds', '[data-beds]'],
      baths: ['.ihf-baths', '.bathrooms', '.baths', '[data-baths]'],
      sqft: ['.ihf-sqft', '.square-feet', '.sqft', '[data-sqft]'],
      mlsId: ['.ihf-mls-number', '.mls-number', '[data-mls]', '.listing-mls']
    };

    const testData: any = {};
    for (const [key, selectors] of Object.entries(testExtractors)) {
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent?.trim()) {
          testData[key] = element.textContent.trim();
          console.log(`✅ Found ${key}:`, testData[key], 'via selector:', selector);
          break;
        }
      }
    }

    // Test image extraction
    const imageSelectors = [
      '.ihf-main-image img', 
      '.ihf-slideshow img', 
      '.property-photo img',
      '.gallery img',
      'img[src*="listing"]'
    ];
    
    const images: string[] = [];
    imageSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(img => {
        const src = (img as HTMLImageElement).src;
        if (src && !src.includes('data:') && !images.includes(src)) {
          images.push(src);
        }
      });
    });
    
    if (images.length > 0) {
      testData.images = images.slice(0, 5);
      console.log('📸 Found images:', testData.images);
    }

    testData.pageUrl = window.location.href;
    testData.extractedAt = new Date().toISOString();

    console.log('🧪 [IDX Tester] Manual extraction result:', testData);
    setExtractedData(testData);

    // Store in window and session for consistency
    if (Object.keys(testData).length > 1) {
      (window as any).ihfPropertyData = testData;
      sessionStorage.setItem('ihfPropertyData', JSON.stringify(testData));
      
      // Dispatch event to trigger auto-saver
      window.dispatchEvent(new CustomEvent('ihfPropertyDataReady', {
        detail: testData
      }));
    }
  };

  const testSaveToDatabase = async () => {
    if (!extractedData) {
      setSaveResult('❌ No extracted data to save');
      return;
    }

    setIsSaving(true);
    setSaveResult('💾 Saving to database...');

    try {
      console.log('🗄️ [IDX Tester] Testing database save with data:', extractedData);
      
      const { data, error } = await supabase.functions.invoke('upsert-idx-property', {
        body: { property: extractedData }
      });

      if (error) {
        console.error('[IDX Tester] Save error:', error);
        setSaveResult(`❌ Save failed: ${error.message}`);
      } else {
        console.log('[IDX Tester] Save success:', data);
        setSaveResult(`✅ Saved successfully! Property ID: ${data.propertyId}`);
      }
    } catch (err) {
      console.error('[IDX Tester] Save exception:', err);
      setSaveResult(`❌ Save exception: ${err}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 mb-4">
      <h3 className="font-bold mb-4 text-yellow-800">🧪 IDX Data Extraction Tester</h3>
      
      <div className="mb-4 text-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>Event Listener: {isListening ? 'Active' : 'Inactive'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${extractedData ? 'bg-green-500' : 'bg-gray-400'}`}></span>
          <span>IDX Data: {extractedData ? 'Found' : 'Not Found'}</span>
        </div>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <Button onClick={checkForIDXData} size="sm" variant="outline">
          Check for Data
        </Button>
        <Button onClick={testExtractionManually} size="sm" className="bg-yellow-600 hover:bg-yellow-700">
          Test Manual Extraction
        </Button>
        <Button 
          onClick={testSaveToDatabase} 
          size="sm" 
          className="bg-green-600 hover:bg-green-700"
          disabled={!extractedData || isSaving}
        >
          {isSaving ? 'Saving...' : 'Test Save to DB'}
        </Button>
      </div>

      {saveResult && (
        <div className="mb-4 p-2 bg-white rounded border text-sm">
          {saveResult}
        </div>
      )}

      {extractedData && (
        <div className="bg-white p-3 rounded border">
          <h4 className="font-semibold mb-2">📊 Extracted IDX Data:</h4>
          <div className="space-y-1 text-sm">
            <div><strong>Address:</strong> {extractedData.address || 'Not found'}</div>
            <div><strong>Price:</strong> {extractedData.price || 'Not found'}</div>
            <div><strong>Beds:</strong> {extractedData.beds || 'Not found'}</div>
            <div><strong>Baths:</strong> {extractedData.baths || 'Not found'}</div>
            <div><strong>SqFt:</strong> {extractedData.sqft || 'Not found'}</div>
            <div><strong>MLS ID:</strong> {extractedData.mlsId || 'Not found'}</div>
            <div><strong>Images:</strong> {extractedData.images?.length || 0} found</div>
            <div><strong>Extracted At:</strong> {extractedData.extractedAt || 'Unknown'}</div>
          </div>
          
          {extractedData.images && extractedData.images.length > 0 && (
            <div className="mt-3">
              <strong>Sample Image:</strong>
              <img 
                src={extractedData.images[0]} 
                alt="Property" 
                className="mt-1 w-20 h-15 object-cover rounded border"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      )}

      <div className="mt-4 text-xs text-yellow-700 bg-yellow-100 p-2 rounded">
        <strong>Instructions:</strong>
        <ol className="list-decimal list-inside mt-1 space-y-1">
          <li>Visit an IDX property page</li>
          <li>Click "Test Manual Extraction" to test data extraction</li>
          <li>Check if real property data is found</li>
          <li>If no data, verify iHomeFinder script installation</li>
        </ol>
      </div>
    </div>
  );
};

export default IDXDataTester;