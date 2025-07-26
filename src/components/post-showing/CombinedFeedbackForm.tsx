import React, { useState } from 'react';
import { Star, MessageCircle, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface CombinedFeedbackFormProps {
  propertyAddress: string;
  showingRequestId: string;
  agentName?: string;
  onSubmit: (data: {
    propertyRating: number;
    agentRating: number;
    insightData?: {
      insightText: string;
      category: string;
      buyerName: string;
    };
  }) => void;
  onSkip: () => void;
  loading?: boolean;
}

type InsightCategory = 'neighborhood' | 'condition' | 'value' | 'highlights' | 'concerns' | 'other';

const categoryOptions: { value: InsightCategory; label: string; description: string; color: string }[] = [
  {
    value: 'highlights',
    label: '✨ Highlights',
    description: 'Amazing features, unexpected gems',
    color: 'bg-purple-100 text-purple-700 border-purple-200'
  },
  {
    value: 'neighborhood',
    label: '🏘️ Neighborhood',
    description: 'Area vibe, walkability, noise, parking',
    color: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  {
    value: 'condition',
    label: '🔧 Property Condition',
    description: 'Maintenance, updates needed, systems',
    color: 'bg-orange-100 text-orange-700 border-orange-200'
  },
  {
    value: 'value',
    label: '💰 Value & Pricing',
    description: 'Market comparison, negotiation insights',
    color: 'bg-green-100 text-green-700 border-green-200'
  },
  {
    value: 'concerns',
    label: '⚠️ Things to Know',
    description: 'Potential issues, things to consider',
    color: 'bg-red-100 text-red-700 border-red-200'
  },
  {
    value: 'other',
    label: '💭 Other Notes',
    description: 'General observations, tips',
    color: 'bg-gray-100 text-gray-700 border-gray-200'
  }
];

const CombinedFeedbackForm: React.FC<CombinedFeedbackFormProps> = ({
  propertyAddress,
  showingRequestId,
  agentName,
  onSubmit,
  onSkip,
  loading = false
}) => {
  const [propertyRating, setPropertyRating] = useState(0);
  const [agentRating, setAgentRating] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<InsightCategory>('highlights');
  const [insightText, setInsightText] = useState('');
  const [buyerName, setBuyerName] = useState('');

  const selectedOption = categoryOptions.find(opt => opt.value === selectedCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submissionData = {
      propertyRating,
      agentRating,
      insightData: insightText.trim().length >= 10 && buyerName.trim()
        ? {
            insightText: insightText.trim(),
            category: selectedCategory,
            buyerName: buyerName.trim()
          }
        : undefined
    };

    onSubmit(submissionData);
  };

  const StarRating = ({ 
    rating, 
    onRatingChange, 
    label 
  }: { 
    rating: number; 
    onRatingChange: (rating: number) => void; 
    label: string; 
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`p-1 transition-all transform hover:scale-110 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
            }`}
            onClick={() => onRatingChange(star)}
          >
            <Star
              className={`h-6 w-6 ${
                star <= rating ? 'fill-current' : ''
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  const exampleInsights = {
    neighborhood: "Quiet street but close to schools",
    condition: "Kitchen needs updating but has good bones",
    value: "Comparable homes sold for $50k more last year",
    highlights: "Beautiful natural light in the living room",
    concerns: "Traffic noise noticeable during rush hour",
    other: "Neighbors were super friendly when we visited"
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Star Ratings Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Rate Your Experience</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StarRating
            rating={propertyRating}
            onRatingChange={setPropertyRating}
            label="How would you rate this property?"
          />
          
          {agentName && (
            <StarRating
              rating={agentRating}
              onRatingChange={setAgentRating}
              label={`How would you rate ${agentName}?`}
            />
          )}
        </div>
      </div>

      <Separator />

      {/* Insights Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">Share Your Insights</h3>
        </div>
        <p className="text-sm text-gray-600">
          Help future buyers by sharing what you discovered during your tour (optional)
        </p>

        <div className="space-y-4 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
            {/* Category Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">What would you like to share?</Label>
              <RadioGroup
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value as InsightCategory)}
                className="grid grid-cols-1 gap-2"
              >
                {categoryOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label
                      htmlFor={option.value}
                      className="flex-1 cursor-pointer"
                    >
                      <div className={`p-2 rounded border transition-all hover:shadow-sm ${
                        selectedCategory === option.value 
                          ? option.color + ' shadow-sm' 
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{option.label}</span>
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
                className="min-h-[80px] resize-none"
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
            {insightText.length >= 10 && buyerName.trim() && (
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-xs text-gray-500 mb-2">Preview:</p>
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm text-gray-700">"{insightText}"</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <Badge variant="secondary" className="text-xs">
                      {selectedOption?.label}
                    </Badge>
                    <span>•</span>
                    <span className="font-medium">{buyerName}</span>
                    <span>•</span>
                    <span>toured today</span>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onSkip} className="flex-1">
          Skip All
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
          className="flex-1"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Submit
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default CombinedFeedbackForm;