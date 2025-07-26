import { LucideIcon } from "lucide-react";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import FloatingCard from "@/components/ui/FloatingCard";
import DynamicShadowCard from "@/components/ui/DynamicShadowCard";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

interface StatCard {
  id: string;
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

interface EnhancedDashboardStatsProps {
  stats: StatCard[];
  className?: string;
}

const EnhancedDashboardStats = ({ stats, className }: EnhancedDashboardStatsProps) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const getGradientByColor = (color: string) => {
    const gradientMap: Record<string, string> = {
      "bg-orange-100 text-orange-700": "from-orange-500 to-amber-500",
      "bg-green-100 text-green-700": "from-green-500 to-emerald-500",
      "bg-purple-100 text-purple-700": "from-purple-500 to-indigo-500",
      "bg-pink-100 text-pink-700": "from-pink-500 to-rose-500",
      "bg-blue-100 text-blue-700": "from-blue-500 to-indigo-500",
      "bg-gray-100 text-gray-700": "from-gray-500 to-slate-500"
    };
    return gradientMap[color] || "from-gray-500 to-slate-500";
  };

  const getShadowColor = (color: string) => {
    const shadowMap: Record<string, string> = {
      "bg-orange-100 text-orange-700": "rgba(251, 146, 60, 0.15)",
      "bg-green-100 text-green-700": "rgba(34, 197, 94, 0.15)",
      "bg-purple-100 text-purple-700": "rgba(147, 51, 234, 0.15)",
      "bg-pink-100 text-pink-700": "rgba(236, 72, 153, 0.15)",
      "bg-blue-100 text-blue-700": "rgba(59, 130, 246, 0.15)",
      "bg-gray-100 text-gray-700": "rgba(107, 114, 128, 0.15)"
    };
    return shadowMap[color] || "rgba(107, 114, 128, 0.15)";
  };

  return (
    <div 
      ref={ref}
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
        className
      )}
    >
      {stats.map((stat, index) => (
        <DynamicShadowCard
          key={stat.id}
          shadowIntensity={0.15}
          shadowColor={getShadowColor(stat.color)}
        >
          <FloatingCard
            intensity="subtle"
            duration={4000}
            delay={index * 200}
          >
            <div
              onClick={stat.onClick}
              className={cn(
                "relative overflow-hidden rounded-2xl border transition-all duration-500",
                "hover:scale-[1.02] hover:shadow-2xl cursor-pointer",
                "bg-white/90 backdrop-blur-sm border-gray-200/60",
                isVisible && "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background gradient decoration */}
              <div 
                className={cn(
                  "absolute inset-0 opacity-5 bg-gradient-to-br",
                  getGradientByColor(stat.color)
                )}
              />

              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      "bg-gradient-to-br shadow-lg transition-transform duration-300 hover:scale-110",
                      getGradientByColor(stat.color)
                    )}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </h3>
                    </div>
                  </div>
                  
                  {stat.trend && (
                    <div className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full",
                      stat.trend.isPositive 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                    )}>
                      {stat.trend.isPositive ? "+" : ""}{stat.trend.value}%
                    </div>
                  )}
                </div>

                <div className="flex items-baseline gap-2">
                  <AnimatedNumber
                    value={stat.value}
                    className="text-3xl font-bold text-gray-900"
                    duration={1500}
                    enableGlow={stat.value > 0}
                    glowColor={getShadowColor(stat.color)}
                  />
                </div>

                {/* Hover effect line */}
                <div className={cn(
                  "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r transform scale-x-0 transition-transform duration-300",
                  getGradientByColor(stat.color),
                  "group-hover:scale-x-100"
                )} />
              </div>
            </div>
          </FloatingCard>
        </DynamicShadowCard>
      ))}
    </div>
  );
};

export default EnhancedDashboardStats;