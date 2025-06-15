
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
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8 md:p-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px]" />
      <div className="absolute top-0 right-0 w-48 h-48 md:w-80 md:h-80 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-32 h-32 md:w-64 md:h-64 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      
      <div className="relative z-10">
        <div className="flex items-center gap-6 md:gap-8 mb-6 md:mb-8">
          <div className="w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
            <Icon className="w-7 h-7 md:w-10 md:h-10 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2 md:mb-3">
              <span className="text-sm md:text-base font-semibold text-purple-300 tracking-wide">Step {index + 1}</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-light tracking-tight leading-tight">{title}</h2>
          </div>
        </div>
        <p className="text-lg md:text-2xl text-gray-300 leading-relaxed font-light max-w-5xl mb-6">
          {overview}
        </p>
        <ReadTimeEstimate content={content} />
      </div>
    </div>
  );
};
