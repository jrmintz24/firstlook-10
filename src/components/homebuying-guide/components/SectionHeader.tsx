
import { ReadTimeEstimate } from "../ReadTimeEstimate";

interface SectionHeaderProps {
  title: string;
  icon: any;
  index: number;
  overview: string;
  content: string[];
}

export const SectionHeader = ({ title, icon: Icon, index, overview, content }: SectionHeaderProps) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 md:p-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px]" />
      <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 md:gap-6 mb-4 md:mb-6">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
            <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 md:mb-2">
              <span className="text-xs md:text-sm font-medium text-purple-300">Step {index + 1}</span>
            </div>
            <h2 className="text-xl md:text-3xl font-light tracking-tight">{title}</h2>
          </div>
        </div>
        <p className="text-base md:text-xl text-gray-300 leading-relaxed font-light max-w-4xl">
          {overview}
        </p>
        <ReadTimeEstimate content={content} />
      </div>
    </div>
  );
};
