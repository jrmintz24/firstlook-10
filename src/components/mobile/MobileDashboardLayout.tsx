import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  Heart, 
  MessageCircle, 
  Settings,
  ChevronRight,
  Plus,
  TrendingUp,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import FloatingCard from '@/components/ui/FloatingCard';
import DynamicShadowCard from '@/components/ui/DynamicShadowCard';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';

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
  const { shouldEnableAnimations, getOptimizedDuration, getAnimationIntensity } = useMobileOptimization();
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Tab order for swipe navigation
  const tabOrder = ['requested', 'confirmed', 'offers', 'favorites', 'activity', 'history'];
  
  // Handle swipe gestures
  useSwipeGesture(contentRef, {
    onSwipeLeft: () => {
      const currentIndex = tabOrder.indexOf(activeTab);
      if (currentIndex < tabOrder.length - 1) {
        handleTabChange(tabOrder[currentIndex + 1]);
      }
    },
    onSwipeRight: () => {
      const currentIndex = tabOrder.indexOf(activeTab);
      if (currentIndex > 0) {
        handleTabChange(tabOrder[currentIndex - 1]);
      }
    },
    threshold: 50,
    enabled: shouldEnableAnimations
  });

  // Sync with parent active tab
  useEffect(() => {
    console.log('[MobileDashboardLayout] Syncing activeTab:', {
      propActiveTab,
      currentActiveTab: activeTab,
      needsSync: propActiveTab !== activeTab
    });
    if (propActiveTab !== activeTab) {
      setActiveTab(propActiveTab);
    }
  }, [propActiveTab, activeTab]);

  const handleTabChange = (tab: string) => {
    console.log('[MobileDashboardLayout] Tab change:', { 
      previousTab: activeTab, 
      newTab: tab,
      hasOnTabChange: !!onTabChange 
    });
    setActiveTab(tab);
    onTabChange?.(tab);
  };


  const quickStats = [
    {
      label: 'Requested Tours',
      value: pendingRequests.length,
      icon: Clock,
      color: 'from-orange-500 to-amber-500',
      shadowColor: 'rgba(251, 146, 60, 0.15)',
      action: () => handleTabChange('requested')
    },
    {
      label: 'Confirmed Tours',
      value: activeShowings.length,
      icon: Calendar,
      color: 'from-blue-500 to-indigo-500',
      shadowColor: 'rgba(59, 130, 246, 0.15)',
      action: () => handleTabChange('confirmed')
    },
    {
      label: 'Completed Tours',
      value: completedShowings.length,
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
      shadowColor: 'rgba(34, 197, 94, 0.15)',
      action: () => handleTabChange('history')
    },
    {
      label: 'Favorites',
      value: favorites.length,
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      shadowColor: 'rgba(236, 72, 153, 0.15)',
      action: () => handleTabChange('favorites')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-white">
      {/* Mobile Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/60 px-4 py-4 safe-area-top shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="animate-fade-in">
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
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
        >
          <Plus className="h-5 w-5 mr-2" />
          Schedule New Tour
        </Button>
      </div>

      {/* Quick Stats Grid - Above Navigation */}
      <div className="bg-transparent px-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <DynamicShadowCard
                key={index}
                shadowIntensity={0.08}
                shadowColor="rgba(0, 0, 0, 0.06)"
              >
                <FloatingCard
                  intensity={getAnimationIntensity('subtle')}
                  duration={getOptimizedDuration(4000)}
                  delay={index * 100}
                >
                  <button
                    onClick={stat.action}
                    className={cn(
                      "p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/60 text-left",
                      "hover:bg-gray-50/80 transition-all duration-300 touch-feedback",
                      "hover:scale-[1.02] hover:shadow-md",
                      "animate-fade-in w-full"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shadow-sm",
                        "bg-gradient-to-br",
                        stat.color
                      )}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                    <AnimatedNumber
                      value={stat.value}
                      className="text-2xl font-bold text-gray-900 mb-1"
                      duration={getOptimizedDuration(1000)}
                    />
                    <div className="text-sm text-gray-600">
                      {stat.label}
                    </div>
                  </button>
                </FloatingCard>
              </DynamicShadowCard>
            );
          })}
        </div>
      </div>


      {/* Main Content */}
      <div ref={contentRef} className="px-4 py-6">
        {/* Tab Navigation Dots */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {tabOrder.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={cn(
                "h-2 transition-all duration-300",
                activeTab === tab 
                  ? "w-8 bg-blue-600 rounded-full" 
                  : "w-2 bg-gray-300 rounded-full hover:bg-gray-400"
              )}
              aria-label={`Go to ${tab} tab`}
            />
          ))}
        </div>
        
        {/* Tab Content with Swipe Animation */}
        <div className={cn(
          "transition-all duration-300",
          shouldEnableAnimations && "animate-fade-in"
        )}>
          {children}
        </div>
      </div>

      {/* Bottom Safe Area */}
      <div className="safe-area-bottom" />
    </div>
  );
};

export default MobileDashboardLayout;