
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Building, Award, MapPin, Clock, Phone, Mail } from 'lucide-react';

interface AgentDetails {
  bio?: string;
  brokerage?: string;
  licenseNumber?: string;
  yearsExperience?: number;
  specialties?: string[];
  areasServed?: string[];
  website?: string;
  referralFeePercent?: number;
  commissionRebateOffered?: boolean;
}

interface EnhancedAgentProfile {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  photo_url?: string;
  agent_details?: AgentDetails;
  profile_completion_percentage?: number;
}

interface EnhancedAgentDisplayProps {
  agent: EnhancedAgentProfile;
  showCompletionStatus?: boolean;
  compact?: boolean;
}

const EnhancedAgentDisplay: React.FC<EnhancedAgentDisplayProps> = ({
  agent,
  showCompletionStatus = false,
  compact = false
}) => {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const fullName = `${agent.first_name} ${agent.last_name}`;
  const details = agent.agent_details || {};

  // Mock rating data - in real implementation, this would come from database
  const rating = 4.8;
  const reviewCount = 127;

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={agent.photo_url} alt={fullName} />
          <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-semibold">
            {getInitials(agent.first_name, agent.last_name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{fullName}</p>
          {details.brokerage && (
            <p className="text-xs text-gray-500 truncate">{details.brokerage}</p>
          )}
        </div>
        {agent.phone && (
          <Phone className="h-4 w-4 text-gray-400" />
        )}
      </div>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">Your Showing Specialist</h3>
            {showCompletionStatus && agent.profile_completion_percentage && (
              <Badge 
                variant={agent.profile_completion_percentage >= 80 ? "default" : "secondary"}
                className="ml-auto"
              >
                {agent.profile_completion_percentage}% Complete
              </Badge>
            )}
          </div>

          {/* Agent Profile */}
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={agent.photo_url} alt={fullName} />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-lg font-semibold">
                {getInitials(agent.first_name, agent.last_name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-xl font-semibold text-gray-900">{fullName}</h4>
                {details.licenseNumber && (
                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                    <Award className="w-3 h-3 mr-1" />
                    Licensed
                  </Badge>
                )}
              </div>
              
              {details.brokerage && (
                <p className="text-blue-700 font-medium mb-2 flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  {details.brokerage}
                </p>
              )}
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {rating} ({reviewCount} reviews)
                </span>
              </div>

              {/* Experience */}
              {details.yearsExperience && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <Clock className="w-4 h-4" />
                  <span>{details.yearsExperience}+ years experience</span>
                  {details.licenseNumber && (
                    <>
                      <span>•</span>
                      <span>License: {details.licenseNumber}</span>
                    </>
                  )}
                </div>
              )}

              {/* Specialties */}
              {details.specialties && details.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {details.specialties.slice(0, 3).map((specialty, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-700">
                      {specialty}
                    </Badge>
                  ))}
                  {details.specialties.length > 3 && (
                    <Badge variant="outline" className="text-xs border-gray-200 text-gray-600">
                      +{details.specialties.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              {/* Areas Served */}
              {details.areasServed && details.areasServed.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Areas Served:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {details.areasServed.slice(0, 2).map((area, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                    {details.areasServed.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{details.areasServed.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="space-y-2">
                {agent.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{agent.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Professional Bio */}
          {details.bio && (
            <div className="bg-white/60 p-3 rounded-lg border border-blue-100">
              <p className="text-sm text-gray-700">{details.bio}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedAgentDisplay;
