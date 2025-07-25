import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSimpleIDXIntegration } from '../hooks/useSimpleIDXIntegration';
import { useAuth } from '../contexts/Auth0AuthContext';

export default function ManualPropertyInput() {
  const { user } = useAuth();
  const { savePropertyToDatabase, favoriteProperty, isLoading } = useSimpleIDXIntegration();
  
  const [formData, setFormData] = useState({
    mlsId: '',
    address: '',
    price: '',
    beds: '',
    baths: '',
    sqft: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProperty = async () => {
    if (!formData.mlsId || !formData.address) {
      alert('MLS ID and Address are required');
      return;
    }

    try {
      const result = await savePropertyToDatabase(formData);
      console.log('Property saved:', result);
      alert('Property saved successfully!');
    } catch (error) {
      console.error('Failed to save property:', error);
      alert('Failed to save property');
    }
  };

  const handleFavoriteProperty = async () => {
    if (!formData.mlsId || !formData.address || !user) {
      alert('MLS ID, Address, and user login are required');
      return;
    }

    try {
      const result = await favoriteProperty(formData, user.id);
      console.log('Property favorited:', result);
      alert('Property favorited successfully!');
    } catch (error) {
      console.error('Failed to favorite property:', error);
      alert('Failed to favorite property');
    }
  };

  const handleScheduleTour = () => {
    if (!formData.mlsId) {
      alert('MLS ID is required');
      return;
    }
    window.location.href = `/schedule-tour?listing=${formData.mlsId}`;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Manual Property Input (Debug)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">MLS ID *</label>
            <Input
              value={formData.mlsId}
              onChange={(e) => handleInputChange('mlsId', e.target.value)}
              placeholder="225003593_13"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Address *</label>
            <Input
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="123 Main St, City, State"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Price</label>
            <Input
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="$500,000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Beds</label>
            <Input
              value={formData.beds}
              onChange={(e) => handleInputChange('beds', e.target.value)}
              placeholder="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Baths</label>
            <Input
              value={formData.baths}
              onChange={(e) => handleInputChange('baths', e.target.value)}
              placeholder="2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Square Feet</label>
            <Input
              value={formData.sqft}
              onChange={(e) => handleInputChange('sqft', e.target.value)}
              placeholder="1500"
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={handleSaveProperty}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Saving...' : 'Save Property'}
          </Button>
          
          {user && (
            <Button
              onClick={handleFavoriteProperty}
              disabled={isLoading}
              variant="outline"
              className="flex-1"
            >
              {isLoading ? 'Adding...' : 'Add to Favorites'}
            </Button>
          )}
          
          <Button
            onClick={handleScheduleTour}
            variant="outline"
            className="flex-1"
          >
            Schedule Tour
          </Button>
        </div>

        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
          <p><strong>Debug Info:</strong></p>
          <p>User: {user ? `${user.email} (${user.id})` : 'Not logged in'}</p>
          <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
          <p>Current URL: {window.location.href}</p>
        </div>
      </CardContent>
    </Card>
  );
}