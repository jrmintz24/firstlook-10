
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Phone, Mail, MessageCircle, Shield, Award } from "lucide-react";

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
  // Generate initials from name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Mock rating data - in the future this would come from the database
  const rating = 4.8;
  const reviewCount = 127;
  const completedTours = 340;

  // Mock specialties - in the future this would come from specialist profile
  const specialties = ["First-Time Buyers", "Investment Properties", "Luxury Homes"];

  const handleSMSClick = () => {
    if (specialistPhone) {
      // Track the contact attempt
      if (onContactAttempt) {
        onContactAttempt('sms', {
          specialist_id: specialistId,
          specialist_name: specialistName,
          specialist_phone: specialistPhone,
          contact_method: 'sms'
        });
      }
      
      // Open native SMS app
      const smsUrl = `sms:${specialistPhone}`;
      try {
        window.open(smsUrl, '_self');
      } catch (error) {
        console.error('Failed to open SMS app:', error);
        // Fallback to internal messaging
        if (onMessageClick) {
          onMessageClick();
        }
      }
    }
    onCallClick?.();
  };

  const handleCallClick = () => {
    if (specialistPhone) {
      // Track the contact attempt
      if (onContactAttempt) {
        onContactAttempt('call', {
          specialist_id: specialistId,
          specialist_name: specialistName,
          specialist_phone: specialistPhone,
          contact_method: 'call'
        });
      }
      
      // Open native phone app
      const telUrl = `tel:${specialistPhone}`;
      try {
        window.open(telUrl, '_self');
      } catch (error) {
        console.error('Failed to open phone app:', error);
      }
    }
    onCallClick?.();
  };

  const handleEmailClick = () => {
    if (specialistEmail) {
      // Track the contact attempt
      if (onContactAttempt) {
        onContactAttempt('email', {
          specialist_id: specialistId,
          specialist_name: specialistName,
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
    onEmailClick?.();
  };

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">Your Showing Specialist</h3>
          </div>

          {/* Specialist Profile */}
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={photoUrl} alt={specialistName} />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-lg font-semibold">
                {getInitials(specialistName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-xl font-semibold text-gray-900">{specialistName}</h4>
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  <Award className="w-3 h-3 mr-1" />
                  Licensed
                </Badge>
              </div>
              
              <p className="text-blue-700 font-medium mb-2">Licensed Showing Specialist</p>
              
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

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <span>{completedTours}+ tours completed</span>
                {licenseNumber && (
                  <span>License: {licenseNumber}</span>
                )}
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-1 mb-3">
                {specialties.map((specialty, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-700">
                    {specialty}
                  </Badge>
                ))}
              </div>

              {/* Contact Information */}
              <div className="space-y-2">
                {specialistPhone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{specialistPhone}</span>
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
          <div className="bg-white/60 p-3 rounded-lg border border-blue-100">
            <p className="text-sm text-gray-700">
              "I specialize in helping buyers find their perfect home with personalized attention and local market expertise. 
              My goal is to make your home buying journey smooth, informed, and stress-free."
            </p>
          </div>

          {/* Action Buttons - Enhanced with native contact functionality */}
          <div className="flex gap-2 pt-2">
            {specialistPhone && (
              <Button 
                onClick={handleSMSClick}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Text
              </Button>
            )}
            
            {specialistPhone && (
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

          {/* Privacy Notice */}
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            Your contact attempts are logged for service improvement and specialist insights.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShowingSpecialistCard;
