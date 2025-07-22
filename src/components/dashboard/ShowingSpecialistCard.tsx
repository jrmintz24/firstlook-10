
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Phone, Mail, MessageCircle, Shield, Award, Building, Clock, MapPin, AlertCircle } from "lucide-react";
import { useEnhancedAgentProfile } from "@/hooks/useEnhancedAgentProfile";
import { useAgentStats } from "@/hooks/useAgentStats";

interface ShowingSpecialistCardProps {
  specialistName: string;
  specialistPhone?: string;
  specialistEmail?: string;
  specialistId?: string;
  photoUrl?: string;
  licenseNumber?: string;
  onMessageClick?: () => void;
  onCallClick?: () => void;
  onEmailClick?: () => void;
  onContactAttempt?: (contactMethod: 'sms' | 'call' | 'email', specialistDetails: any) => void;
}

const ShowingSpecialistCard = ({
  specialistName,
  specialistPhone,
  specialistEmail,
  specialistId,
  photoUrl,
  licenseNumber,
  onMessageClick,
  onCallClick,
  onEmailClick,
  onContactAttempt
}: ShowingSpecialistCardProps) => {
  const { profile: enhancedProfile, loading, error } = useEnhancedAgentProfile(specialistId);
  const { stats: agentStats, loading: statsLoading } = useAgentStats(specialistId);

  // Generate initials from name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Use real stats from database
  const rating = agentStats.averageRating;
  const reviewCount = agentStats.totalReviews;
  const completedTours = agentStats.completedShowings;

  // Use enhanced profile data if available, otherwise fall back to props
  const agentDetails = enhancedProfile?.agent_details || {};
  const displayName = enhancedProfile ? `${enhancedProfile.first_name} ${enhancedProfile.last_name}` : specialistName;
  const displayPhone = enhancedProfile?.phone || specialistPhone;
  const displayPhoto = enhancedProfile?.photo_url || photoUrl;
  const displayLicense = agentDetails.licenseNumber || licenseNumber;

  const handleSMSClick = async () => {
    if (displayPhone) {
      // Track the contact attempt silently (no user notification)
      if (onContactAttempt) {
        await onContactAttempt('sms', {
          specialist_id: specialistId,
          specialist_name: displayName,
          specialist_phone: displayPhone,
          contact_method: 'sms'
        });
      }
      
      // Open native SMS app
      const smsUrl = `sms:${displayPhone}`;
      try {
        window.open(smsUrl, '_self');
      } catch (error) {
        console.error('Failed to open SMS app:', error);
        // Fallback to internal messaging if available
        if (onMessageClick) {
          onMessageClick();
        }
      }
    }
  };

  const handleCallClick = async () => {
    if (displayPhone) {
      // Track the contact attempt silently (no user notification)
      if (onContactAttempt) {
        await onContactAttempt('call', {
          specialist_id: specialistId,
          specialist_name: displayName,
          specialist_phone: displayPhone,
          contact_method: 'call'
        });
      }
      
      // Open native phone app
      const telUrl = `tel:${displayPhone}`;
      try {
        window.open(telUrl, '_self');
      } catch (error) {
        console.error('Failed to open phone app:', error);
      }
    }
    
    // Call the optional callback
    if (onCallClick) {
      onCallClick();
    }
  };

  const handleEmailClick = async () => {
    if (specialistEmail) {
      // Track the contact attempt silently (no user notification)
      if (onContactAttempt) {
        await onContactAttempt('email', {
          specialist_id: specialistId,
          specialist_name: displayName,
          specialist_email: specialistEmail,
          contact_method: 'email'
        });
      }
      
      // Open native email app
      const mailtoUrl = `mailto:${specialistEmail}`;
      try {
        window.open(mailtoUrl, '_self');
      } catch (error) {
        console.error('Failed to open email app:', error);
      }
    }
    
    // Call the optional callback
    if (onEmailClick) {
      onEmailClick();
    }
  };

  if (loading || statsLoading) {
    return (
      <Card className="border-blue-200 bg-blue-50/30">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Always show a proper agent card, even if enhanced profile fails to load
  if (error && !enhancedProfile) {
    return (
      <Card className="border-blue-200 bg-blue-50/30">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">Your Showing Specialist</h3>
            </div>

            {/* Specialist Profile - Basic Version */}
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={displayPhoto} alt={displayName} />
                <AvatarFallback className="bg-blue-100 text-blue-700 text-lg font-semibold">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-xl font-semibold text-gray-900">{displayName}</h4>
                  {displayLicense && (
                    <Badge className="bg-blue-100 text-blue-800 text-xs">
                      <Award className="w-3 h-3 mr-1" />
                      Licensed
                    </Badge>
                  )}
                </div>
                
                <p className="text-blue-700 font-medium mb-2">Licensed Real Estate Professional</p>
                
                {/* Rating - Mock data for now */}
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
                    {rating.toFixed(1)} {reviewCount > 0 ? `(${reviewCount} reviews)` : '(New specialist)'}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span>{completedTours > 0 ? `${completedTours}+ tours completed` : 'Licensed showing specialist'}</span>
                  {displayLicense && (
                    <>
                      <span>•</span>
                      <span>License: {displayLicense}</span>
                    </>
                  )}
                </div>

                {/* Contact Information */}
                <div className="space-y-2">
                  {displayPhone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{displayPhone}</span>
                    </div>
                  )}
                  {specialistEmail && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{specialistEmail}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              {displayPhone && (
                <Button 
                  onClick={handleSMSClick}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Text
                </Button>
              )}
              
              {displayPhone && (
                <Button 
                  variant="outline" 
                  onClick={handleCallClick}
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
              )}
              
              {specialistEmail && (
                <Button 
                  variant="outline" 
                  onClick={handleEmailClick}
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              )}
            </div>

            {/* Professional Note */}
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              Your dedicated showing specialist will guide you through the property tour and answer any questions.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">Your Showing Specialist</h3>
            {enhancedProfile?.profile_completion_percentage && (
              <Badge 
                variant={enhancedProfile.profile_completion_percentage >= 80 ? "default" : "secondary"}
                className="ml-auto text-xs"
              >
                {enhancedProfile.profile_completion_percentage}% Complete
              </Badge>
            )}
          </div>

          {/* Specialist Profile */}
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={displayPhoto} alt={displayName} />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-lg font-semibold">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-xl font-semibold text-gray-900">{displayName}</h4>
                {displayLicense && (
                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                    <Award className="w-3 h-3 mr-1" />
                    Licensed
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                {agentDetails.brokerage && (
                  <p className="text-blue-700 font-medium flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    {agentDetails.brokerage}
                  </p>
                )}
                {!agentDetails.brokerage && (
                  <p className="text-blue-700 font-medium">Licensed Showing Specialist</p>
                )}
              </div>
              
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
                  {rating.toFixed(1)} {reviewCount > 0 ? `(${reviewCount} reviews)` : '(New specialist)'}
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <span>{completedTours > 0 ? `${completedTours}+ tours completed` : 'Licensed showing specialist'}</span>
                {agentDetails.yearsExperience && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {agentDetails.yearsExperience}+ years
                    </span>
                  </>
                )}
                {displayLicense && (
                  <>
                    <span>•</span>
                    <span>License: {displayLicense}</span>
                  </>
                )}
              </div>

              {/* Specialties */}
              {agentDetails.specialties && agentDetails.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {agentDetails.specialties.slice(0, 3).map((specialty, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-700">
                      {specialty}
                    </Badge>
                  ))}
                  {agentDetails.specialties.length > 3 && (
                    <Badge variant="outline" className="text-xs border-gray-200 text-gray-600">
                      +{agentDetails.specialties.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              {/* Areas Served */}
              {agentDetails.areasServed && agentDetails.areasServed.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Areas Served:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {agentDetails.areasServed.slice(0, 2).map((area, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                    {agentDetails.areasServed.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{agentDetails.areasServed.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="space-y-2">
                {displayPhone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{displayPhone}</span>
                  </div>
                )}
                {specialistEmail && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{specialistEmail}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Professional Bio */}
          {agentDetails.bio && (
            <div className="bg-white/60 p-3 rounded-lg border border-blue-100">
              <p className="text-sm text-gray-700">{agentDetails.bio}</p>
            </div>
          )}

          {/* Action Buttons - Enhanced with native contact functionality */}
          <div className="flex gap-2 pt-2">
            {displayPhone && (
              <Button 
                onClick={handleSMSClick}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Text
              </Button>
            )}
            
            {displayPhone && (
              <Button 
                variant="outline" 
                onClick={handleCallClick}
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
            )}
            
            {specialistEmail && (
              <Button 
                variant="outline" 
                onClick={handleEmailClick}
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            )}
          </div>

          {/* Profile Completion Notice for Incomplete Profiles */}
          {enhancedProfile?.profile_completion_percentage && enhancedProfile.profile_completion_percentage < 80 && (
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
              <p className="text-xs text-amber-700">
                This specialist is still completing their profile. Full details will be available soon.
              </p>
            </div>
          )}

          {/* Privacy Notice - Updated to reflect silent tracking */}
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            Contact attempts help us improve our service and provide insights to specialists.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShowingSpecialistCard;
