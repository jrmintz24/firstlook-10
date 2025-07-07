
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  FileText, 
  UserCheck, 
  Calendar, 
  MessageCircle, 
  Star,
  Phone,
  Mail
} from "lucide-react";

interface BuyerActionIndicatorsProps {
  actions: {
    favorited?: boolean;
    madeOffer?: boolean;
    hiredAgent?: boolean;
    scheduledMoreTours?: boolean;
    askedQuestions?: number;
    propertyRating?: number;
    agentRating?: number;
    latestAction?: string;
    actionTimestamp?: string;
    attemptedContactSms?: boolean;
    attemptedContactCall?: boolean;
    attemptedContactEmail?: boolean;
  };
}

const BuyerActionIndicators = ({ actions }: BuyerActionIndicatorsProps) => {
  const getActionLabel = (actionType: string): string => {
    switch (actionType) {
      case 'request_offer_assistance':
        return 'Made Offer';
      case 'schedule_same_agent':
      case 'schedule_different_agent':
        return 'Scheduled Tour';
      case 'work_with_agent':
        return 'Hired Agent';
      case 'favorited':
        return 'Favorited';
      case 'asked_question':
        return 'Asked Question';
      case 'attempted_contact_sms':
        return 'Texted Specialist';
      case 'attempted_contact_call':
        return 'Called Specialist';
      case 'attempted_contact_email':
        return 'Emailed Specialist';
      default:
        return actionType.replace(/_/g, ' ');
    }
  };

  const getInterestLevel = (): 'high' | 'medium' | 'low' => {
    const score = 
      (actions.favorited ? 2 : 0) +
      (actions.madeOffer ? 3 : 0) +
      (actions.hiredAgent ? 4 : 0) +
      (actions.scheduledMoreTours ? 2 : 0) +
      (actions.askedQuestions || 0) +
      (actions.propertyRating && actions.propertyRating >= 4 ? 2 : 0) +
      // Add points for contact attempts (shows engagement)
      (actions.attemptedContactSms ? 1 : 0) +
      (actions.attemptedContactCall ? 1 : 0) +
      (actions.attemptedContactEmail ? 1 : 0);

    if (score >= 6) return 'high';
    if (score >= 3) return 'medium';
    return 'low';
  };

  const interestLevel = getInterestLevel();
  const hasActions = actions.favorited || actions.madeOffer || actions.hiredAgent || 
                    actions.scheduledMoreTours || (actions.askedQuestions && actions.askedQuestions > 0) ||
                    actions.attemptedContactSms || actions.attemptedContactCall || actions.attemptedContactEmail;

  if (!hasActions) {
    return (
      <div className="text-xs text-gray-500 italic">
        No post-tour actions taken
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Interest Level Indicator */}
      <div className="flex items-center gap-2">
        <Badge 
          variant="outline" 
          className={`text-xs ${
            interestLevel === 'high' 
              ? 'border-green-300 bg-green-50 text-green-700' 
              : interestLevel === 'medium'
              ? 'border-yellow-300 bg-yellow-50 text-yellow-700'
              : 'border-gray-300 bg-gray-50 text-gray-700'
          }`}
        >
          {interestLevel === 'high' && '🔥 High Interest'}
          {interestLevel === 'medium' && '📈 Medium Interest'}
          {interestLevel === 'low' && '👀 Some Interest'}
        </Badge>
      </div>

      {/* Action Badges */}
      <div className="flex flex-wrap gap-1">
        {actions.favorited && (
          <Badge variant="outline" className="text-xs border-pink-300 bg-pink-50 text-pink-700">
            <Heart className="w-3 h-3 mr-1" />
            Favorited
          </Badge>
        )}
        
        {actions.madeOffer && (
          <Badge variant="outline" className="text-xs border-blue-300 bg-blue-50 text-blue-700">
            <FileText className="w-3 h-3 mr-1" />
            Made Offer
          </Badge>
        )}
        
        {actions.hiredAgent && (
          <Badge variant="outline" className="text-xs border-green-300 bg-green-50 text-green-700">
            <UserCheck className="w-3 h-3 mr-1" />
            Hired Agent
          </Badge>
        )}
        
        {actions.scheduledMoreTours && (
          <Badge variant="outline" className="text-xs border-purple-300 bg-purple-50 text-purple-700">
            <Calendar className="w-3 h-3 mr-1" />
            More Tours
          </Badge>
        )}
        
        {actions.askedQuestions && actions.askedQuestions > 0 && (
          <Badge variant="outline" className="text-xs border-orange-300 bg-orange-50 text-orange-700">
            <MessageCircle className="w-3 h-3 mr-1" />
            {actions.askedQuestions} Question{actions.askedQuestions > 1 ? 's' : ''}
          </Badge>
        )}

        {/* Contact Attempt Badges */}
        {actions.attemptedContactSms && (
          <Badge variant="outline" className="text-xs border-indigo-300 bg-indigo-50 text-indigo-700">
            <MessageCircle className="w-3 h-3 mr-1" />
            Texted
          </Badge>
        )}

        {actions.attemptedContactCall && (
          <Badge variant="outline" className="text-xs border-emerald-300 bg-emerald-50 text-emerald-700">
            <Phone className="w-3 h-3 mr-1" />
            Called
          </Badge>
        )}

        {actions.attemptedContactEmail && (
          <Badge variant="outline" className="text-xs border-cyan-300 bg-cyan-50 text-cyan-700">
            <Mail className="w-3 h-3 mr-1" />
            Emailed
          </Badge>
        )}
      </div>

      {/* Ratings */}
      {(actions.propertyRating || actions.agentRating) && (
        <div className="flex items-center gap-3 text-xs text-gray-600">
          {actions.propertyRating && (
            <div className="flex items-center gap-1">
              <span>Property:</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3 h-3 ${
                      i < actions.propertyRating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
            </div>
          )}
          
          {actions.agentRating && (
            <div className="flex items-center gap-1">
              <span>Agent:</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3 h-3 ${
                      i < actions.agentRating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Latest Action */}
      {actions.latestAction && actions.actionTimestamp && (
        <div className="text-xs text-gray-500">
          Latest: {getActionLabel(actions.latestAction)} • {new Date(actions.actionTimestamp).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default BuyerActionIndicators;
