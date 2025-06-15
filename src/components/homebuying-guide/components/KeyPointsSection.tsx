
import { CheckCircle, Sparkles } from "lucide-react";

interface KeyPointsSectionProps {
  keyPoints: string[];
  isMobile: boolean;
}

export const KeyPointsSection = ({ keyPoints, isMobile }: KeyPointsSectionProps) => {
  return (
    <div className={isMobile ? "mb-8" : "mb-12"}>
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
        <h3 className="text-xl md:text-2xl font-semibold text-gray-900 tracking-wide">Key Takeaways</h3>
      </div>
      <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-2 gap-6'}`}>
        {keyPoints.map((point, pointIndex) => (
          <div key={pointIndex} className="flex items-start gap-4 md:gap-5 p-5 md:p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200/50 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 group">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
            <span className={`text-gray-700 font-medium leading-relaxed ${isMobile ? 'text-sm' : 'text-base md:text-lg'}`}>{point}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
