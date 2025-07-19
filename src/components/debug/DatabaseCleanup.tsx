import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const DatabaseCleanup = () => {
  const [isClearing, setIsClearing] = useState(false);
  const [result, setResult] = useState<string>('');

  const clearFakeData = async () => {
    setIsClearing(true);
    setResult('🧹 Clearing fake data...');

    try {
      // Clear fake data patterns
      const { error: deleteError } = await supabase
        .from('idx_properties')
        .delete()
        .or('price.in.(650000,750000,850000,950000,1200000),sqft.in.(1800,2200,2600,3000,3400),address.eq.Property Address Not Available');

      if (deleteError) {
        setResult(`❌ Error clearing fake data: ${deleteError.message}`);
        return;
      }

      // Get remaining entries
      const { data: remaining, error: selectError } = await supabase
        .from('idx_properties')
        .select('idx_id, address, price, beds, baths, sqft, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (selectError) {
        setResult(`❌ Error fetching remaining data: ${selectError.message}`);
        return;
      }

      setResult(`✅ Fake data cleared! Remaining properties: ${remaining?.length || 0}\n\n${JSON.stringify(remaining, null, 2)}`);
    } catch (error) {
      setResult(`❌ Error: ${error}`);
    } finally {
      setIsClearing(false);
    }
  };

  const testSpecificProperty = async () => {
    setIsClearing(true);
    setResult('🔍 Checking property 225044848_13...');

    try {
      const { data, error } = await supabase
        .from('idx_properties')
        .select('*')
        .or('idx_id.eq.225044848_13,mls_id.eq.225044848_13')
        .single();

      if (error) {
        setResult(`❌ Error fetching property: ${error.message}`);
        return;
      }

      if (data) {
        setResult(`🏠 Found property data:\n\n${JSON.stringify(data, null, 2)}`);
      } else {
        setResult('❌ No property found with ID 225044848_13');
      }
    } catch (error) {
      setResult(`❌ Error: ${error}`);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="p-4 bg-red-50 rounded-lg border border-red-200 mb-4">
      <h3 className="font-bold mb-4 text-red-800">🧹 Database Cleanup Tool</h3>
      
      <div className="flex gap-2 mb-4 flex-wrap">
        <Button 
          onClick={clearFakeData} 
          size="sm" 
          className="bg-red-600 hover:bg-red-700"
          disabled={isClearing}
        >
          {isClearing ? 'Clearing...' : 'Clear Fake Data'}
        </Button>
        
        <Button 
          onClick={testSpecificProperty} 
          size="sm" 
          className="bg-blue-600 hover:bg-blue-700"
          disabled={isClearing}
        >
          {isClearing ? 'Checking...' : 'Check Property 225044848_13'}
        </Button>
      </div>

      {result && (
        <div className="bg-white p-3 rounded border text-sm font-mono whitespace-pre-wrap max-h-60 overflow-y-auto">
          {result}
        </div>
      )}

      <div className="mt-4 text-xs text-red-700 bg-red-100 p-2 rounded">
        <strong>Instructions:</strong>
        <ol className="list-decimal list-inside mt-1 space-y-1">
          <li>Click "Clear Fake Data" to remove any generated property data</li>
          <li>Click "Check Property 225044848_13" to see what's stored for that property</li>
          <li>Check console for IDX extraction attempts</li>
        </ol>
      </div>
    </div>
  );
};

export default DatabaseCleanup;