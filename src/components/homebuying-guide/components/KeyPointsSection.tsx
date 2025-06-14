
import { CheckCircle, Sparkles } from "lucide-react";

interface KeyPointsSectionProps {
  keyPoints: string[];
  isMobile: boolean;
}

export const KeyPointsSection = ({ keyPoints, isMobile }: KeyPointsSectionProps) => {
  return (
    <div className={isMobile ? "mb-8" : "mb-12"}>
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
        <h3 className="text-lg md:text-xl font-medium text-gray-900">Key Takeaways</h3>
      </div>
      <div className={`grid grid-cols-1 ${isMobile ? 'gap-3' : 'md:grid-cols-2 gap-4'}`}>
        {keyPoints.map((point, pointIndex) => (
          <div key={pointIndex} className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
            <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span className={`text-gray-700 font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>{point}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
