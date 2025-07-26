import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Heart, FileText, User, Calendar, CheckCircle } from "lucide-react";

interface ActionStateBadgesProps {
  actions: {
    favorited?: boolean;
    madeOffer?: boolean;
    hiredAgent?: boolean;
    scheduledMoreTours?: boolean;
    actionCount?: number;
    latestAction?: string | null;
  };
  className?: string;
  size?: 'sm' | 'md';
}

const ActionStateBadges: React.FC<ActionStateBadgesProps> = ({ 
  actions, 
  className = "", 
  size = 'sm' 
}) => {
  if (!actions || actions.actionCount === 0) {
    return null;
  }

  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  const paddingSize = size === 'sm' ? 'px-2 py-1' : 'px-3 py-1.5';

  const activeBadges = [];

  if (actions.favorited) {
    activeBadges.push({
      key: 'favorited',
      icon: Heart,
      label: 'Favorited',
      color: 'bg-red-100 text-red-700 border-red-200'
    });
  }

  if (actions.madeOffer) {
    activeBadges.push({
      key: 'made_offer',
      icon: FileText,
      label: 'Offer Made',
      color: 'bg-blue-100 text-blue-700 border-blue-200'
    });
  }

  if (actions.hiredAgent) {
    activeBadges.push({
      key: 'hired_agent',
      icon: User,
      label: 'Agent Hired',
      color: 'bg-purple-100 text-purple-700 border-purple-200'
    });
  }

  if (actions.scheduledMoreTours) {
    activeBadges.push({
      key: 'scheduled_tours',
      icon: Calendar,
      label: 'More Tours',
      color: 'bg-green-100 text-green-700 border-green-200'
    });
  }

  return (
    <div className={`flex flex-wrap items-center gap-1 ${className}`}>
      {activeBadges.slice(0, 3).map(({ key, icon: Icon, label, color }) => (
        <Badge
          key={key}
          variant="outline"
          className={`${color} ${textSize} ${paddingSize} font-medium border`}
        >
          <Icon className={`${iconSize} mr-1`} />
          {label}
        </Badge>
      ))}
      
      {/* Show action count if multiple actions */}
      {(actions.actionCount || 0) > 1 && (
        <Badge
          variant="outline"
          className={`bg-gray-100 text-gray-700 border-gray-200 ${textSize} ${paddingSize} font-bold`}
        >
          <CheckCircle className={`${iconSize} mr-1`} />
          {actions.actionCount} Actions
        </Badge>
      )}

      {/* Show "+" if more than 3 actions */}
      {activeBadges.length > 3 && (
        <Badge
          variant="outline"
          className={`bg-gray-100 text-gray-500 border-gray-200 ${textSize} ${paddingSize}`}
        >
          +{activeBadges.length - 3} more
        </Badge>
      )}
    </div>
  );
};

export default ActionStateBadges;