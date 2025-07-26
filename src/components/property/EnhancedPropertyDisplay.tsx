import React, { useState } from 'react';
import { 
  Home, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  MapPin,
  TrendingUp,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  Flag,
  Info,
  CheckCircle,
  Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useEnhancedPropertyData } from '@/hooks/useEnhancedPropertyData';
import { cn } from '@/lib/utils';

interface EnhancedPropertyDisplayProps {
  address: string;
  mlsId?: string;
  onAddInsight?: () => void;
  showInsightForm?: boolean;
  className?: string;
}

const EnhancedPropertyDisplay: React.FC<EnhancedPropertyDisplayProps> = ({
  address,
  mlsId,
  onAddInsight,
  showInsightForm = false,
  className
}) => {
  console.log('[EnhancedPropertyDisplay] Rendering with:', { address, mlsId });
  const { data, loading, error } = useEnhancedPropertyData(address, mlsId);
  const [showAllInsights, setShowAllInsights] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  
  console.log('[EnhancedPropertyDisplay] Data state:', { data, loading, error });

  if (loading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className={cn("w-full border-orange-200 bg-orange-50", className)}>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-orange-600">
            <Info className="h-5 w-5" />
            <span className="text-sm">Property details will be available after your tour</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { objective, insights, insightsSummary, ratings } = data;

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const categoryLabels = {
    neighborhood: '🏘️ Neighborhood',
    condition: '🔧 Property Condition',
    value: '💰 Value & Pricing',
    highlights: '✨ Highlights',
    concerns: '⚠️ Things to Know',
    other: '💭 Other Notes'
  };

  const groupedInsights = insights.reduce((acc, insight) => {
    if (!acc[insight.category]) {
      acc[insight.category] = [];
    }
    acc[insight.category].push(insight);
    return acc;
  }, {} as Record<string, typeof insights>);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Objective Property Data */}
      {objective && (
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Home className="h-5 w-5 text-blue-600" />
              Property Details
              <Badge variant="outline" className="ml-auto text-xs">
                {objective.source}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {objective.beds && (
                <div className="flex items-center gap-2">
                  <Bed className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">{objective.beds}</span>
                  <span className="text-sm text-gray-600">beds</span>
                </div>
              )}
              {objective.baths && (
                <div className="flex items-center gap-2">
                  <Bath className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">{objective.baths}</span>
                  <span className="text-sm text-gray-600">baths</span>
                </div>
              )}
              {objective.sqft && (
                <div className="flex items-center gap-2">
                  <Square className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">{objective.sqft.toLocaleString()}</span>
                  <span className="text-sm text-gray-600">sqft</span>
                </div>
              )}
              {objective.yearBuilt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">{objective.yearBuilt}</span>
                  <span className="text-sm text-gray-600">built</span>
                </div>
              )}
            </div>
            
            {(objective.propertyType || objective.lotSize) && (
              <>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {objective.propertyType && (
                    <div>
                      <span className="text-gray-600">Property Type:</span>
                      <span className="ml-2 font-medium">{objective.propertyType}</span>
                    </div>
                  )}
                  {objective.lotSize && (
                    <div>
                      <span className="text-gray-600">Lot Size:</span>
                      <span className="ml-2 font-medium">{objective.lotSize}</span>
                    </div>
                  )}
                </div>
              </>
            )}
            
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Last updated {new Date(objective.lastUpdated).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Buyer Insights Section */}
      {(insights.length > 0 || showInsightForm || ratings) && (
        <Card className="border-green-200 bg-green-50/30">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageCircle className="h-5 w-5 text-green-600" />
              Other Buyers Are Saying...
              {insightsSummary.total > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {insightsSummary.total} insights
                </Badge>
              )}
            </CardTitle>
            {insightsSummary.recent > 0 && (
              <p className="text-sm text-gray-600">
                {insightsSummary.recent} recent insights from buyers who toured this property
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Ratings Display */}
            {ratings && ratings.totalRatings > 0 && (
              <>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ratings.averagePropertyRating > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Property Rating</span>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= Math.round(ratings.averagePropertyRating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {ratings.averagePropertyRating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    )}
                    {ratings.averageAgentRating > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Specialist Rating</span>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= Math.round(ratings.averageAgentRating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {ratings.averageAgentRating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 text-center mt-2">
                    Based on {ratings.totalRatings} buyer{ratings.totalRatings === 1 ? '' : 's'} who toured this property
                  </div>
                </div>
                <Separator />
              </>
            )}
            
            {insights.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No buyer insights yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              <>
                {Object.entries(groupedInsights).map(([category, categoryInsights]) => (
                  <div key={category} className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCategory(category)}
                      className="w-full justify-between p-2 h-auto"
                    >
                      <span className="font-medium text-left">
                        {categoryLabels[category as keyof typeof categoryLabels] || category}
                        <span className="ml-2 text-xs text-gray-500">
                          ({categoryInsights.length})
                        </span>
                      </span>
                      {expandedCategories.has(category) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    
                    {expandedCategories.has(category) && (
                      <div className="space-y-3 pl-4">
                        {categoryInsights.slice(0, showAllInsights ? undefined : 2).map((insight) => (
                          <div
                            key={insight.id}
                            className="bg-white rounded-lg p-3 border border-gray-200 space-y-2"
                          >
                            <p className="text-sm text-gray-700 leading-relaxed">
                              "{insight.insight}"
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{insight.buyerName}</span>
                                {insight.isVerified && (
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                )}
                                <span>•</span>
                                <span>toured {new Date(insight.tourDate).toLocaleDateString()}</span>
                              </div>
                              {insight.helpfulCount > 0 && (
                                <div className="flex items-center gap-1">
                                  <ThumbsUp className="h-3 w-3" />
                                  <span>{insight.helpfulCount}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        
                        {categoryInsights.length > 2 && !showAllInsights && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowAllInsights(true)}
                            className="w-full"
                          >
                            Show {categoryInsights.length - 2} more insights
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                
                {!showAllInsights && insights.length > 6 && (
                  <Button
                    variant="outline"
                    onClick={() => setShowAllInsights(true)}
                    className="w-full"
                  >
                    Show all {insights.length} buyer insights
                  </Button>
                )}
              </>
            )}
            
            {onAddInsight && (
              <div className="pt-4 border-t">
                <Button
                  onClick={onAddInsight}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Share your insights after your tour
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedPropertyDisplay;