import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  ChevronDown, 
  ChevronUp,
  Bed,
  Bath,
  Square,
  Home,
  DollarSign,
  CheckCircle,
  ClipboardList,
  Info,
  Phone,
  Mail,
  Navigation,
  Loader2,
  FileText
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FloatingCard from '@/components/ui/FloatingCard';
import DynamicShadowCard from '@/components/ui/DynamicShadowCard';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import MagneticButton from '@/components/ui/MagneticButton';
import { cn } from '@/lib/utils';
import { usePropertyDetails } from '@/hooks/usePropertyDetails';

interface PropertyDetails {
  beds?: number;
  baths?: number;
  sqft?: number;
  price?: number;
  pricePerSqft?: number;
  propertyType?: string;
  yearBuilt?: number;
  daysOnMarket?: number;
  lotSize?: string;
}

interface TourChecklist {
  foundation: boolean;
  roof: boolean;
  hvac: boolean;
  plumbing: boolean;
  electrical: boolean;
  windows: boolean;
  appliances: boolean;
  neighborhood: boolean;
}

interface EnhancedTourCardProps {
  showing: {
    id: string;
    property_address: string;
    preferred_date: string | null;
    preferred_time: string | null;
    status: string;
    assigned_agent_name?: string | null;
    assigned_agent_phone?: string | null;
    assigned_agent_email?: string | null;
    idx_property_id?: string | null;
    property_details?: PropertyDetails;
  };
  onCancel?: (id: string) => void;
  onReschedule?: (id: string) => void;
  onAddToCalendar?: (showing: any) => void;
  onGetDirections?: (address: string) => void;
  index?: number;
}

const defaultChecklist: TourChecklist = {
  foundation: false,
  roof: false,
  hvac: false,
  plumbing: false,
  electrical: false,
  windows: false,
  appliances: false,
  neighborhood: false
};

const EnhancedTourCard: React.FC<EnhancedTourCardProps> = ({
  showing,
  onCancel,
  onReschedule,
  onAddToCalendar,
  onGetDirections,
  index = 0
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [checklist, setChecklist] = useState<TourChecklist>(defaultChecklist);
  const [notes, setNotes] = useState('');
  const { details: fetchedDetails, loading: detailsLoading } = usePropertyDetails(
    showing.property_address, 
    showing.idx_property_id || undefined
  );

  const toggleChecklistItem = (item: keyof TourChecklist) => {
    setChecklist(prev => ({ ...prev, [item]: !prev[item] }));
  };

  // Use fetched details if available, but show graceful fallbacks when data is missing
  const propertyDetails: PropertyDetails = fetchedDetails || showing.property_details || {};
  
  // Helper function to check if we have meaningful property data
  const hasPropertyData = propertyDetails && (
    propertyDetails.beds || 
    propertyDetails.baths || 
    propertyDetails.sqft || 
    propertyDetails.price
  );

  // Save checklist to localStorage
  useEffect(() => {
    const savedChecklist = localStorage.getItem(`tour-checklist-${showing.id}`);
    if (savedChecklist) {
      setChecklist(JSON.parse(savedChecklist));
    }
  }, [showing.id]);

  useEffect(() => {
    localStorage.setItem(`tour-checklist-${showing.id}`, JSON.stringify(checklist));
  }, [checklist, showing.id]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Date TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <DynamicShadowCard
      shadowIntensity={0.12}
      shadowColor="rgba(0, 0, 0, 0.08)"
    >
      <FloatingCard
        intensity="subtle"
        duration={5000}
        delay={index * 200}
      >
        <Card className={cn(
          "overflow-hidden transition-all duration-500",
          "bg-white/90 backdrop-blur-sm border-gray-200/60",
          "hover:shadow-xl hover:scale-[1.01]",
          isExpanded && "ring-2 ring-blue-500/20"
        )}>
          <CardContent className="p-0">
            {/* Main Card Content */}
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
                      <Home className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {showing.property_address}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(showing.preferred_date)}
                        </span>
                        {showing.preferred_time && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {showing.preferred_time}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  Confirmed
                </Badge>
              </div>

              {/* Property Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-3 text-center relative">
                  {detailsLoading && (
                    <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                    <Bed className="w-4 h-4" />
                    <span className="text-sm">Beds</span>
                  </div>
                  <AnimatedNumber 
                    value={propertyDetails.beds || 0} 
                    className="text-lg font-semibold text-gray-900"
                    duration={800}
                  />
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                    <Bath className="w-4 h-4" />
                    <span className="text-sm">Baths</span>
                  </div>
                  <AnimatedNumber 
                    value={propertyDetails.baths || 0} 
                    className="text-lg font-semibold text-gray-900"
                    duration={900}
                  />
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                    <Square className="w-4 h-4" />
                    <span className="text-sm">Sq Ft</span>
                  </div>
                  <AnimatedNumber 
                    value={propertyDetails.sqft || 0} 
                    className="text-lg font-semibold text-gray-900"
                    formatNumber={true}
                    duration={1000}
                  />
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 text-center border border-green-200/50">
                  <div className="flex items-center justify-center gap-1 text-green-700 mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Price</span>
                  </div>
                  <AnimatedNumber 
                    value={propertyDetails.price || 0} 
                    prefix="$" 
                    className="text-lg font-semibold text-green-700"
                    formatNumber={true}
                    duration={1100}
                  />
                </div>
              </div>

              {/* Additional Details Row */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span>{propertyDetails.propertyType}</span>
                <span>•</span>
                <span>Built {propertyDetails.yearBuilt}</span>
                <span>•</span>
                <span className="text-orange-600 font-medium">
                  {propertyDetails.daysOnMarket} days on market
                </span>
              </div>

              {/* Agent Info */}
              {showing.assigned_agent_name && (
                <div className="bg-blue-50/50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">
                        Your agent: <span className="font-medium">{showing.assigned_agent_name}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {showing.assigned_agent_phone && (
                        <Button size="sm" variant="ghost" className="h-8 px-2">
                          <Phone className="w-4 h-4" />
                        </Button>
                      )}
                      {showing.assigned_agent_email && (
                        <Button size="sm" variant="ghost" className="h-8 px-2">
                          <Mail className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <MagneticButton
                  variant="outline"
                  size="sm"
                  onClick={() => onGetDirections?.(showing.property_address)}
                  className="flex-1"
                  magneticStrength={0.1}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </MagneticButton>
                <MagneticButton
                  variant="outline"
                  size="sm"
                  onClick={() => onAddToCalendar?.(showing)}
                  className="flex-1"
                  magneticStrength={0.1}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Add to Calendar
                </MagneticButton>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="ml-auto"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1" />
                      Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" />
                      More
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Expandable Content */}
            <div className={cn(
              "border-t border-gray-200/60 bg-gray-50/50 transition-all duration-500 overflow-hidden",
              isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
            )}>
              <div className="p-6 space-y-6">
                {/* Tour Preparation Checklist */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-blue-600" />
                    Tour Preparation Checklist
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries({
                      foundation: "Check foundation for cracks",
                      roof: "Inspect roof condition",
                      hvac: "Ask about HVAC age & maintenance",
                      plumbing: "Test water pressure & drainage",
                      electrical: "Check outlets & electrical panel",
                      windows: "Test windows & look for drafts",
                      appliances: "Verify appliances work",
                      neighborhood: "Walk the neighborhood"
                    }).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => toggleChecklistItem(key as keyof TourChecklist)}
                        className={cn(
                          "flex items-center gap-2 p-2 rounded-lg text-sm text-left transition-all duration-200",
                          checklist[key as keyof TourChecklist]
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        <CheckCircle className={cn(
                          "w-4 h-4 transition-all duration-200",
                          checklist[key as keyof TourChecklist] ? "text-green-600" : "text-gray-400"
                        )} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Questions to Ask */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    Important Questions to Ask
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>What are the monthly HOA fees and what do they cover?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>What is the average monthly utility cost?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Have there been any major repairs or renovations?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Why are the current owners selling?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Are there any known issues or upcoming assessments?</span>
                    </li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReschedule?.(showing.id)}
                    className="flex-1"
                  >
                    Reschedule Tour
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCancel?.(showing.id)}
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Cancel Tour
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Show helpful message when property data is incomplete */}
            {!hasPropertyData && (
              <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-3 mt-4">
                <div className="flex items-center gap-2 text-amber-700">
                  <Info className="w-4 h-4" />
                  <span className="text-sm">
                    Property details are being updated from MLS. Check back soon for complete information.
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </FloatingCard>
    </DynamicShadowCard>
  );
};

export default EnhancedTourCard;