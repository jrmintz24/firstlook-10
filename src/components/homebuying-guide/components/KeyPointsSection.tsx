
import { CheckCircle, Star } from "lucide-react";

interface KeyPointsSectionProps {
  keyPoints: string[];
  isMobile: boolean;
}

export const KeyPointsSection = ({ keyPoints, isMobile }: KeyPointsSectionProps) => {
  return (
    <div className={isMobile ? "mb-8" : "mb-12"}>
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
          <Star className="w-4 h-4 text-white fill-current" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-slate-800 tracking-wide">Key Takeaways</h3>
      </div>
      <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-2 gap-6'}`}>
        {keyPoints.map((point, pointIndex) => (
          <div 
            key={pointIndex} 
            className="flex items-start gap-4 md:gap-5 p-5 md:p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-200/60 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 group"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
              <CheckCircle className="w-4 h-4 text-white fill-current" />
            </div>
            <span className={`text-slate-700 font-medium leading-relaxed ${isMobile ? 'text-sm' : 'text-base md:text-lg'}`}>
              {point}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
