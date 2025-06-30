
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { PropertyAnalysisData } from '@/hooks/useOfferQuestionnaire';
import { TrendingUp, TrendingDown, Minus, Home, Calendar, DollarSign } from 'lucide-react';

interface PropertyAnalysisStepProps {
  data: Partial<PropertyAnalysisData>;
  onComplete: (data: PropertyAnalysisData) => void;
  loading: boolean;
  propertyAddress: string;
  buyerId: string;
}

const PropertyAnalysisStep = ({ data, onComplete, loading, propertyAddress, buyerId }: PropertyAnalysisStepProps) => {
  const [formData, setFormData] = useState<PropertyAnalysisData>({
    propertyType: 'single_family',
    listingPrice: 0,
    daysOnMarket: undefined,
    priceHistory: [],
    comparableSales: [],
    marketConditions: 'balanced',
    neighborhoodTrends: '',
    specialFeatures: [],
    ...data
  });

  // Auto-populate property address
  useEffect(() => {
    if (propertyAddress && !formData.propertyAddress) {
      setFormData(prev => ({ ...prev, propertyAddress }));
    }
  }, [propertyAddress, formData.propertyAddress]);

  const handleInputChange = (field: keyof PropertyAnalysisData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePriceHistoryAdd = () => {
    const newEntry = { date: '', price: 0 };
    setFormData(prev => ({
      ...prev,
      priceHistory: [...(prev.priceHistory || []), newEntry]
    }));
  };

  const handlePriceHistoryUpdate = (index: number, field: 'date' | 'price', value: string | number) => {
    const updated = [...(formData.priceHistory || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, priceHistory: updated }));
  };

  const handleComparableAdd = () => {
    const newComparable = { address: '', price: 0, date: '' };
    setFormData(prev => ({
      ...prev,
      comparableSales: [...(prev.comparableSales || []), newComparable]
    }));
  };

  const handleComparableUpdate = (index: number, field: 'address' | 'price' | 'date', value: string | number) => {
    const updated = [...(formData.comparableSales || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, comparableSales: updated }));
  };

  const handleSubmit = () => {
    onComplete(formData);
  };

  const isFormValid = () => {
    return formData.listingPrice > 0 && 
           formData.propertyType && 
           formData.marketConditions;
  };

  const getMarketTrendIcon = () => {
    switch (formData.marketConditions) {
      case 'hot': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'slow': return <TrendingDown className="w-4 h-4 text-blue-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            Property Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="propertyAddress">Property Address</Label>
            <Input
              id="propertyAddress"
              value={formData.propertyAddress || propertyAddress}
              onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
              placeholder="Property address"
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <Select
                value={formData.propertyType}
                onValueChange={(value) => handleInputChange('propertyType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single_family">Single Family Home</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="condo">Condominium</SelectItem>
                  <SelectItem value="coop">Cooperative</SelectItem>
                  <SelectItem value="multi_family">Multi-Family</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="listingPrice">Current Listing Price *</Label>
              <Input
                id="listingPrice"
                type="number"
                placeholder="Enter listing price"
                value={formData.listingPrice || ''}
                onChange={(e) => handleInputChange('listingPrice', Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="daysOnMarket">Days on Market</Label>
              <Input
                id="daysOnMarket"
                type="number"
                placeholder="Number of days"
                value={formData.daysOnMarket || ''}
                onChange={(e) => handleInputChange('daysOnMarket', Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="marketConditions">Market Conditions *</Label>
              <Select
                value={formData.marketConditions}
                onValueChange={(value) => handleInputChange('marketConditions', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select market conditions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hot">Hot Market (Seller's Market)</SelectItem>
                  <SelectItem value="balanced">Balanced Market</SelectItem>
                  <SelectItem value="slow">Slow Market (Buyer's Market)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Price History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.priceHistory?.map((entry, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 border rounded">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={entry.date}
                  onChange={(e) => handlePriceHistoryUpdate(index, 'date', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Price</Label>
                <Input
                  type="number"
                  value={entry.price || ''}
                  onChange={(e) => handlePriceHistoryUpdate(index, 'price', Number(e.target.value))}
                  placeholder="Price at that time"
                />
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={handlePriceHistoryAdd}
          >
            Add Price History Entry
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Comparable Sales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.comparableSales?.map((comp, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border rounded">
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={comp.address}
                  onChange={(e) => handleComparableUpdate(index, 'address', e.target.value)}
                  placeholder="Comparable property address"
                />
              </div>
              <div className="space-y-2">
                <Label>Sale Price</Label>
                <Input
                  type="number"
                  value={comp.price || ''}
                  onChange={(e) => handleComparableUpdate(index, 'price', Number(e.target.value))}
                  placeholder="Sale price"
                />
              </div>
              <div className="space-y-2">
                <Label>Sale Date</Label>
                <Input
                  type="date"
                  value={comp.date}
                  onChange={(e) => handleComparableUpdate(index, 'date', e.target.value)}
                />
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={handleComparableAdd}
          >
            Add Comparable Sale
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getMarketTrendIcon()}
            Market Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="flex items-center gap-1">
              {getMarketTrendIcon()}
              {formData.marketConditions?.replace('_', ' ')} Market
            </Badge>
          </div>

          <div className="space-y-2">
            <Label htmlFor="neighborhoodTrends">Neighborhood Trends & Analysis</Label>
            <Textarea
              id="neighborhoodTrends"
              placeholder="Describe neighborhood trends, recent developments, school district info, etc."
              value={formData.neighborhoodTrends || ''}
              onChange={(e) => handleInputChange('neighborhoodTrends', e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialFeatures">Special Features</Label>
            <Textarea
              id="specialFeatures"
              placeholder="List unique features, recent upgrades, lot characteristics, etc. (one per line)"
              value={formData.specialFeatures?.join('\n') || ''}
              onChange={(e) => handleInputChange('specialFeatures', e.target.value.split('\n').filter(Boolean))}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Market Insight:</strong> Based on your selections, this appears to be a{' '}
          <strong>{formData.marketConditions}</strong> market. Consider adjusting your offer strategy accordingly.
          {formData.marketConditions === 'hot' && ' In hot markets, competitive offers and quick decisions are often necessary.'}
          {formData.marketConditions === 'slow' && ' In slower markets, you may have more negotiating power and time to evaluate.'}
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid() || loading}
          className="min-w-32"
        >
          {loading ? 'Saving...' : 'Save & Continue'}
        </Button>
      </div>
    </div>
  );
};

export default PropertyAnalysisStep;
