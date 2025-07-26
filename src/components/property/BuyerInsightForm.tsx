import React, { useState } from 'react';
import {
  MessageCircle,
  Send,
  X,
  Home,
  MapPin,
  DollarSign,
  Star,
  AlertTriangle,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface BuyerInsightFormProps {
  propertyAddress: string;
  showingRequestId?: string;
  onClose: () => void;
  onSuccess: () => void;
  className?: string;
}

type InsightCategory = 'neighborhood' | 'condition' | 'value' | 'highlights' | 'concerns' | 'other';

const categoryOptions: { value: InsightCategory; label: string; icon: React.ReactNode; description: string; color: string }[] = [
  {
    value: 'neighborhood',
    label: 'Neighborhood',
    icon: <MapPin className="h-4 w-4" />,
    description: 'Area vibe, walkability, noise, parking',
    color: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  {
    value: 'condition',
    label: 'Property Condition',
    icon: <Home className="h-4 w-4" />,
    description: 'Maintenance, updates needed, systems',
    color: 'bg-orange-100 text-orange-700 border-orange-200'
  },
  {
    value: 'value',
    label: 'Value & Pricing',
    icon: <DollarSign className="h-4 w-4" />,
    description: 'Market comparison, negotiation insights',
    color: 'bg-green-100 text-green-700 border-green-200'
  },
  {
    value: 'highlights',
    label: 'Highlights',
    icon: <Star className="h-4 w-4" />,
    description: 'Amazing features, unexpected gems',
    color: 'bg-purple-100 text-purple-700 border-purple-200'
  },
  {
    value: 'concerns',
    label: 'Things to Know',
    icon: <AlertTriangle className="h-4 w-4" />,
    description: 'Potential issues, things to consider',
    color: 'bg-red-100 text-red-700 border-red-200'
  },
  {
    value: 'other',
    label: 'Other Notes',
    icon: <MessageSquare className="h-4 w-4" />,
    description: 'General observations, tips',
    color: 'bg-gray-100 text-gray-700 border-gray-200'
  }
];

const BuyerInsightForm: React.FC<BuyerInsightFormProps> = ({
  propertyAddress,
  showingRequestId,
  onClose,
  onSuccess,
  className
}) => {
  const { currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<InsightCategory>('highlights');
  const [insightText, setInsightText] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedOption = categoryOptions.find(opt => opt.value === selectedCategory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!insightText.trim() || insightText.length < 10) {
      setError('Please share at least 10 characters of insight');
      return;
    }

    if (!buyerName.trim()) {
      setError('Please enter your name or nickname');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('buyer_insights')
        .insert({
          property_address: propertyAddress,
          insight_text: insightText.trim(),
          category: selectedCategory,
          buyer_name: buyerName.trim(),
          buyer_id: currentUser?.id,
          showing_request_id: showingRequestId,
          tour_date: new Date().toISOString().split('T')[0], // Today's date
          is_approved: false // Will be auto-approved if from verified buyer
        });

      if (insertError) {
        throw insertError;
      }

      // Success!
      onSuccess();
      
    } catch (err) {
      console.error('Error submitting buyer insight:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit insight');
    } finally {
      setIsSubmitting(false);
    }
  };

  const exampleInsights = {
    neighborhood: "Quiet street but close to schools",
    condition: "Kitchen needs updating but has good bones",
    value: "Comparable homes sold for $50k more last year",
    highlights: "Beautiful natural light in the living room",
    concerns: "Traffic noise noticeable during rush hour",
    other: "Neighbors were super friendly when we visited"
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            Share Your Insights
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          Help future buyers by sharing what you discovered during your tour
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">What would you like to share?</Label>
            <RadioGroup
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value as InsightCategory)}
              className="grid grid-cols-1 gap-3"
            >
              {categoryOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label
                    htmlFor={option.value}
                    className="flex-1 cursor-pointer"
                  >
                    <div className={`p-3 rounded-lg border transition-all hover:shadow-sm ${
                      selectedCategory === option.value 
                        ? option.color + ' shadow-sm' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        {option.icon}
                        <span className="font-medium">{option.label}</span>
                      </div>
                      <p className="text-xs text-gray-600">{option.description}</p>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Insight Text */}
          <div className="space-y-2">
            <Label htmlFor="insight">Your insight</Label>
            <Textarea
              id="insight"
              value={insightText}
              onChange={(e) => setInsightText(e.target.value)}
              placeholder={`e.g., "${exampleInsights[selectedCategory]}"`}
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Share what other buyers should know</span>
              <span>{insightText.length}/500</span>
            </div>
          </div>

          {/* Buyer Name */}
          <div className="space-y-2">
            <Label htmlFor="buyerName">Your name or nickname</Label>
            <Input
              id="buyerName"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              placeholder="e.g., Sarah M."
              maxLength={50}
            />
            <p className="text-xs text-gray-500">
              This will be shown with your insight to help other buyers
            </p>
          </div>

          {/* Preview */}
          {insightText.length >= 10 && (
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-xs text-gray-500 mb-2">Preview:</p>
              <div className="bg-white p-3 rounded border">
                <p className="text-sm text-gray-700">"{insightText}"</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <Badge variant="secondary" className="text-xs">
                    {selectedOption?.label}
                  </Badge>
                  <span>•</span>
                  <span className="font-medium">{buyerName || 'Your Name'}</span>
                  <span>•</span>
                  <span>toured today</span>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || insightText.length < 10 || !buyerName.trim()}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sharing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Share Insight
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BuyerInsightForm;