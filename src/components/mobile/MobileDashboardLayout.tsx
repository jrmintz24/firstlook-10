import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  Heart, 
  MessageCircle, 
  Settings,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileDashboardLayoutProps {
  user?: any;
  pendingRequests?: any[];
  activeShowings?: any[];
  completedShowings?: any[];
  favorites?: any[];
  onRequestTour?: () => void;
  onTabChange?: (tab: string) => void;
  activeTab?: string;
  children?: React.ReactNode;
}

const MobileDashboardLayout: React.FC<MobileDashboardLayoutProps> = ({
  user,
  pendingRequests = [],
  activeShowings = [],
  completedShowings = [],
  favorites = [],
  onRequestTour,
  onTabChange,
  activeTab: propActiveTab = 'requested',
  children
}) => {
  const [activeTab, setActiveTab] = useState(propActiveTab);

  // Sync with parent active tab
  useEffect(() => {
    if (propActiveTab !== activeTab) {
      setActiveTab(propActiveTab);
    }
  }, [propActiveTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };


  const quickStats = [
    {
      label: 'Requested Tours',
      value: pendingRequests.length,
      icon: Clock,
      color: 'bg-orange-100 text-orange-700',
      action: () => handleTabChange('requested')
    },
    {
      label: 'Confirmed Tours',
      value: activeShowings.length,
      icon: Calendar,
      color: 'bg-blue-100 text-blue-700',
      action: () => handleTabChange('confirmed')
    },
    {
      label: 'Completed Tours',
      value: completedShowings.length,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-700',
      action: () => handleTabChange('history')
    },
    {
      label: 'Favorites',
      value: favorites.length,
      icon: Heart,
      color: 'bg-red-100 text-red-700',
      action: () => handleTabChange('favorites')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 safe-area-top">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Hi, {user?.user_metadata?.first_name || 'there'}!
            </h1>
            <p className="text-sm text-gray-600">Let's find your dream home</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Quick Action Button */}
        <Button 
          onClick={onRequestTour}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl"
        >
          <Plus className="h-5 w-5 mr-2" />
          Schedule New Tour
        </Button>
      </div>

      {/* Quick Stats Grid - Above Navigation */}
      <div className="bg-gray-50 px-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <button
                key={index}
                onClick={stat.action}
                className="p-4 bg-white rounded-xl border border-gray-200 text-left hover:bg-gray-50 transition-colors touch-feedback"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", stat.color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>


      {/* Main Content */}
      <div className="px-4 py-6 pb-20">
        {/* Tab Content */}
        {children}
      </div>

      {/* Bottom Safe Area */}
      <div className="safe-area-bottom" />
    </div>
  );
};

export default MobileDashboardLayout;